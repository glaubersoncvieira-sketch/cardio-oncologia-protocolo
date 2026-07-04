import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  RefreshCw,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  BookOpen,
  Activity,
  Calendar,
  ExternalLink,
  Info,
} from "lucide-react";

const statusConfig = {
  running: { label: "Em execução", color: "bg-blue-100 text-blue-800", icon: RefreshCw },
  completed: { label: "Concluído", color: "bg-emerald-100 text-emerald-800", icon: CheckCircle2 },
  failed: { label: "Falhou", color: "bg-red-100 text-red-800", icon: XCircle },
  pending: { label: "Pendente", color: "bg-amber-100 text-amber-800", icon: Clock },
};

const relevanceConfig = {
  alta: { label: "Alta", color: "bg-red-100 text-red-800" },
  moderada: { label: "Moderada", color: "bg-amber-100 text-amber-800" },
  baixa: { label: "Baixa", color: "bg-emerald-100 text-emerald-800" },
};

const updateTypeLabels: Record<string, string> = {
  new_indication: "Nova indicação",
  dosage_change: "Alteração de dose",
  safety_alert: "Alerta de segurança",
  interaction: "Interação medicamentosa",
  guideline_update: "Atualização de diretriz",
  new_publication: "Nova publicação",
};

function formatDate(date: Date | string | null | undefined): string {
  if (!date) return "—";
  return new Date(date).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function UpdatesPage() {
  const [activeTab, setActiveTab] = useState("jobs");

  const { data: jobs = [], isLoading: jobsLoading, refetch: refetchJobs } =
    trpc.updates.listJobs.useQuery({ limit: 20 });

  const { data: drugUpdatesList = [], isLoading: updatesLoading, refetch: refetchUpdates } =
    trpc.updates.listDrugUpdates.useQuery({ limit: 50 });

  const { data: lastJob } = trpc.updates.getLastJob.useQuery();
  const { data: pendingCount = 0 } = trpc.updates.countPending.useQuery();

  const handleRefresh = () => {
    refetchJobs();
    refetchUpdates();
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Atualizações Automáticas</h1>
          <p className="text-slate-600 mt-1">
            Monitoramento quinzenal de diretrizes oncológicas — ESC 2022, ASCO 2017, SBOC 2026, PubMed e FDA FAERS
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={handleRefresh}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Atualizar
        </Button>
      </div>

      {/* Cards de resumo */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-5">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Activity className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Última execução</p>
                <p className="font-semibold text-slate-900">
                  {lastJob ? formatDate(lastJob.startedAt) : "Nenhuma ainda"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-5">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Atualizações pendentes</p>
                <p className="font-semibold text-slate-900 text-2xl">{pendingCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-5">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <Calendar className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Próxima execução</p>
                <p className="font-semibold text-slate-900">Dia 15 de julho, 08:00 UTC</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Informativo sobre o sistema */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="pt-4">
          <div className="flex gap-3">
            <Info className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-semibold mb-1">Como funciona a atualização automática</p>
              <p>
                O sistema verifica automaticamente nos dias <strong>1 e 15 de cada mês</strong> as APIs do{" "}
                <strong>PubMed (NCBI)</strong> e <strong>FDA FAERS (OpenFDA)</strong> em busca de novos alertas de
                cardiotoxicidade e publicações relevantes. Os resultados são registrados aqui para revisão pelo
                médico responsável antes de serem incorporados ao protocolo clínico.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="jobs">
            Histórico de Jobs
          </TabsTrigger>
          <TabsTrigger value="updates">
            Atualizações Detectadas
            {pendingCount > 0 && (
              <Badge className="ml-2 bg-amber-500 text-white text-xs px-1.5 py-0.5">
                {pendingCount}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        {/* Tab: Histórico de Jobs */}
        <TabsContent value="jobs" className="mt-4">
          {jobsLoading ? (
            <div className="text-center py-8 text-slate-500">Carregando...</div>
          ) : jobs.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Clock className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500 font-medium">Nenhuma execução registrada ainda</p>
                <p className="text-slate-400 text-sm mt-1">
                  O primeiro job será executado em 15 de julho de 2026
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {jobs.map((job) => {
                const status = statusConfig[job.status as keyof typeof statusConfig] || statusConfig.pending;
                const StatusIcon = status.icon;
                return (
                  <Card key={job.id}>
                    <CardContent className="py-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3">
                          <div className={`p-1.5 rounded-full ${status.color}`}>
                            <StatusIcon className="h-4 w-4" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-medium text-slate-900">
                                Job #{job.id} — {job.jobType === "heartbeat" ? "Heartbeat (PubMed/FDA)" : "Agent (Pesquisa Web)"}
                              </span>
                              <Badge className={`text-xs ${status.color}`}>{status.label}</Badge>
                            </div>
                            <p className="text-sm text-slate-600 mt-1">{job.summary || "Sem resumo"}</p>
                            <div className="flex gap-4 mt-2 text-xs text-slate-500">
                              <span>Início: {formatDate(job.startedAt)}</span>
                              {job.completedAt && <span>Fim: {formatDate(job.completedAt)}</span>}
                              {job.drugsFound != null && <span>{job.drugsFound} itens encontrados</span>}
                              {job.alertsFound != null && job.alertsFound > 0 && (
                                <span className="text-red-600 font-medium">{job.alertsFound} alertas FDA</span>
                              )}
                            </div>
                          </div>
                        </div>
                        {job.githubCommit && (
                          <a
                            href={`https://github.com/glaubersoncvieira-sketch/cardio-oncologia-protocolo/commit/${job.githubCommit}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-600 hover:underline flex items-center gap-1 shrink-0"
                          >
                            <ExternalLink className="h-3 w-3" />
                            GitHub
                          </a>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        {/* Tab: Atualizações Detectadas */}
        <TabsContent value="updates" className="mt-4">
          {updatesLoading ? (
            <div className="text-center py-8 text-slate-500">Carregando...</div>
          ) : drugUpdatesList.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <BookOpen className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500 font-medium">Nenhuma atualização detectada ainda</p>
                <p className="text-slate-400 text-sm mt-1">
                  As atualizações aparecerão aqui após a primeira execução do job quinzenal
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {drugUpdatesList.map((update) => {
                const relevance = relevanceConfig[update.clinicalRelevance as keyof typeof relevanceConfig] ||
                  relevanceConfig.moderada;
                return (
                  <Card key={update.id} className={update.applied ? "opacity-60" : ""}>
                    <CardContent className="py-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <Badge variant="outline" className="text-xs">
                              {updateTypeLabels[update.updateType] || update.updateType}
                            </Badge>
                            <Badge className={`text-xs ${relevance.color}`}>
                              Relevância {relevance.label}
                            </Badge>
                            <Badge variant="outline" className="text-xs capitalize">
                              {update.source}
                            </Badge>
                            {update.applied && (
                              <Badge className="text-xs bg-slate-100 text-slate-600">Aplicado</Badge>
                            )}
                          </div>
                          <p className="font-medium text-slate-900">{update.title}</p>
                          <p className="text-sm text-slate-600 mt-1">{update.description}</p>
                          <div className="flex gap-4 mt-2 text-xs text-slate-500">
                            <span>Fármaco: <strong>{update.drugName}</strong></span>
                            <span>{formatDate(update.createdAt)}</span>
                          </div>
                        </div>
                        {update.sourceUrl && (
                          <a
                            href={update.sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-600 hover:underline flex items-center gap-1 shrink-0"
                          >
                            <ExternalLink className="h-3 w-3" />
                            Fonte
                          </a>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
