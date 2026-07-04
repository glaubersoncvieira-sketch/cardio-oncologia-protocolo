/**
 * Handlers para atualização automática quinzenal de dados oncológicos.
 * Recebe dados do job AGENT (pesquisa em sites oncológicos) e do job Heartbeat (PubMed/OpenFDA).
 * Salva no banco de dados e registra o log de execução.
 */

import { Request, Response } from "express";
import { getDb } from "./db";
import { updateJobs, drugUpdates } from "../drizzle/schema";
import { eq } from "drizzle-orm";
import { sdk } from "./_core/sdk";

// ─── Handler principal: recebe dados do AGENT cron ──────────────────────────
export async function handleAgentUpdate(req: Request, res: Response) {
  try {
    // Autenticar como cron
    const user = await sdk.authenticateRequest(req);
    if (!user.isCron) {
      return res.status(403).json({ error: "cron-only endpoint" });
    }

    const db = await getDb();
    if (!db) {
      return res.status(500).json({ error: "Database unavailable" });
    }

    const body = req.body as {
      updates?: Array<{
        drugName: string;
        updateType: string;
        source: string;
        sourceUrl?: string;
        title: string;
        description: string;
        clinicalRelevance?: string;
      }>;
      summary?: string;
      sourcesChecked?: string[];
      githubCommit?: string;
    };

    // Criar registro do job
    const jobResult = await db.insert(updateJobs).values({
      jobType: "agent",
      status: "running",
      sourcesChecked: JSON.stringify(body.sourcesChecked || ["sboc", "asco", "esc", "pubmed"]),
      drugsFound: body.updates?.length || 0,
      summary: body.summary || "Pesquisa automática quinzenal executada",
      githubCommit: body.githubCommit,
    });
    const jobId = Number(jobResult[0].insertId);

    // Salvar cada atualização detectada
    let drugsUpdated = 0;
    if (body.updates && body.updates.length > 0) {
      for (const update of body.updates) {
        await db.insert(drugUpdates).values({
          jobId,
          drugName: update.drugName,
          updateType: update.updateType,
          source: update.source,
          sourceUrl: update.sourceUrl,
          title: update.title,
          description: update.description,
          clinicalRelevance: update.clinicalRelevance || "moderada",
          applied: false,
        });
        drugsUpdated++;
      }
    }

    // Marcar job como concluído
    await db.update(updateJobs)
      .set({
        status: "completed",
        drugsUpdated,
        completedAt: new Date(),
      })
      .where(eq(updateJobs.id, jobId));

    console.log(`[AutoUpdate] Job ${jobId} concluído: ${drugsUpdated} atualizações registradas`);
    return res.json({ ok: true, jobId, drugsUpdated });

  } catch (error) {
    console.error("[AutoUpdate] Erro no handler agent-update:", error);
    return res.status(500).json({
      error: String(error),
      timestamp: new Date().toISOString(),
    });
  }
}

// ─── Handler Heartbeat: busca PubMed/OpenFDA diretamente ─────────────────────
export async function handleHeartbeatUpdate(req: Request, res: Response) {
  try {
    const user = await sdk.authenticateRequest(req);
    if (!user.isCron) {
      return res.status(403).json({ error: "cron-only endpoint" });
    }

    const db = await getDb();
    if (!db) {
      return res.status(500).json({ error: "Database unavailable" });
    }

    // Criar registro do job
    const jobResult = await db.insert(updateJobs).values({
      jobType: "heartbeat",
      status: "running",
      sourcesChecked: JSON.stringify(["pubmed", "openfda"]),
      summary: "Verificação automática PubMed/OpenFDA",
    });
    const jobId = Number(jobResult[0].insertId);

    let drugsFound = 0;
    let alertsFound = 0;
    const updates: Array<{
      drugName: string;
      updateType: string;
      source: string;
      sourceUrl: string;
      title: string;
      description: string;
      clinicalRelevance: string;
    }> = [];

    try {
      // Buscar alertas de cardiotoxicidade no OpenFDA
      const fdaRes = await fetch(
        "https://api.fda.gov/drug/event.json?search=cardiotoxicity+oncology&limit=5&sort=receivedate:desc",
        { signal: AbortSignal.timeout(15000) }
      );
      if (fdaRes.ok) {
        const fdaData = await fdaRes.json() as {
          results?: Array<{
            patient?: { drug?: Array<{ medicinalproduct?: string }> };
            serious?: number;
          }>;
        };
        for (const event of (fdaData.results || []).slice(0, 3)) {
          const drugName = event.patient?.drug?.[0]?.medicinalproduct || "Desconhecido";
          if (event.serious === 1) {
            updates.push({
              drugName,
              updateType: "safety_alert",
              source: "openfda",
              sourceUrl: "https://api.fda.gov/drug/event.json",
              title: `Alerta de segurança FDA: ${drugName}`,
              description: `Evento adverso cardíaco grave reportado para ${drugName} no sistema FDA FAERS.`,
              clinicalRelevance: "alta",
            });
            alertsFound++;
          }
        }
      }

      // Buscar novas publicações sobre cardiotoxicidade no PubMed
      const pubmedSearch = await fetch(
        "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=cardiotoxicity+chemotherapy+2025&retmax=5&retmode=json&sort=pub+date",
        { signal: AbortSignal.timeout(15000) }
      );
      if (pubmedSearch.ok) {
        const searchData = await pubmedSearch.json() as { esearchresult?: { idlist?: string[] } };
        const ids = searchData.esearchresult?.idlist || [];
        if (ids.length > 0) {
          const summaryRes = await fetch(
            `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&id=${ids.slice(0, 3).join(",")}&retmode=json`,
            { signal: AbortSignal.timeout(15000) }
          );
          if (summaryRes.ok) {
            const summaryData = await summaryRes.json() as {
              result?: Record<string, { title?: string; source?: string; pubdate?: string }>;
            };
            for (const id of ids.slice(0, 3)) {
              const article = summaryData.result?.[id];
              if (article?.title) {
                updates.push({
                  drugName: "Cardiotoxicidade Oncológica",
                  updateType: "new_indication",
                  source: "pubmed",
                  sourceUrl: `https://pubmed.ncbi.nlm.nih.gov/${id}/`,
                  title: article.title.substring(0, 200),
                  description: `Nova publicação em ${article.source || "PubMed"} (${article.pubdate || "2025"}): ${article.title}`,
                  clinicalRelevance: "moderada",
                });
                drugsFound++;
              }
            }
          }
        }
      }
    } catch (fetchErr) {
      console.warn("[AutoUpdate] Erro ao buscar APIs externas:", fetchErr);
      // Continua mesmo com erro nas APIs externas
    }

    // Salvar atualizações no banco
    for (const update of updates) {
      await db.insert(drugUpdates).values({ ...update, jobId, applied: false });
    }

    // Finalizar job
    await db.update(updateJobs)
      .set({
        status: "completed",
        drugsFound,
        drugsUpdated: updates.length,
        alertsFound,
        completedAt: new Date(),
        summary: `Verificação concluída: ${updates.length} item(s) encontrado(s) (${alertsFound} alertas FDA, ${drugsFound} publicações PubMed)`,
      })
      .where(eq(updateJobs.id, jobId));

    console.log(`[AutoUpdate] Heartbeat job ${jobId} concluído: ${updates.length} atualizações`);
    return res.json({ ok: true, jobId, total: updates.length });

  } catch (error) {
    console.error("[AutoUpdate] Erro no handler heartbeat-update:", error);
    return res.status(500).json({
      error: String(error),
      stack: String(error),
      timestamp: new Date().toISOString(),
    });
  }
}
