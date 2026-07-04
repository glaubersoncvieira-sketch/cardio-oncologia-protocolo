import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { getDb } from "./db";
import { patients, patientAssessments, drugClasses, medications, drugInteractions, monitoringSchedules } from "../drizzle/schema";
import { eq, desc, and } from "drizzle-orm";
import {
  DRUG_CLASSES,
  MEDICATIONS,
  DRUG_INTERACTIONS,
  MONITORING_SCHEDULES,
  TREATMENT_PROTOCOLS,
  CTCAE_CARDIAC,
  SPECIAL_CARES,
  CARDIOVASCULAR_RISK_FACTORS,
  calculateCardiovascularRisk,
  calculateBSA_Mosteller,
  calculateBSA_DuBois,
  calculateCrCl_CockcroftGault,
  calculateDose,
  getAUCDose_Calvert,
} from "../shared/clinicalData";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // ─── Clinical Data (public - read only) ─────────────────────────────────────
  clinical: router({
    getDrugClasses: publicProcedure.query(() => DRUG_CLASSES),

    getMedications: publicProcedure
      .input(z.object({ drugClassId: z.number().optional() }).optional())
      .query(({ input }) => {
        if (input?.drugClassId) {
          return MEDICATIONS.filter(m => m.drugClassId === input.drugClassId);
        }
        return MEDICATIONS;
      }),

    getMedicationById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(({ input }) => {
        return MEDICATIONS.find(m => m.id === input.id) || null;
      }),

    getDrugInteractions: publicProcedure
      .input(z.object({ medicationId: z.number().optional() }).optional())
      .query(({ input }) => {
        if (input?.medicationId) {
          return DRUG_INTERACTIONS.filter(i => i.drug1Id === input.medicationId);
        }
        return DRUG_INTERACTIONS;
      }),

    getMonitoringSchedule: publicProcedure
      .input(z.object({ medicationId: z.number() }))
      .query(({ input }) => {
        return MONITORING_SCHEDULES.filter(s => s.medicationId === input.medicationId);
      }),

    getTreatmentProtocols: publicProcedure.query(() => TREATMENT_PROTOCOLS),

    getCtcaeData: publicProcedure.query(() => CTCAE_CARDIAC),

    getSpecialCares: publicProcedure.query(() => SPECIAL_CARES),

    getRiskFactors: publicProcedure.query(() => CARDIOVASCULAR_RISK_FACTORS),
  }),

  // ─── Calculator ─────────────────────────────────────────────────────────────
  calculator: router({
    calculateBSA: publicProcedure
      .input(z.object({
        weightKg: z.number().positive(),
        heightCm: z.number().positive(),
        formula: z.enum(["mosteller", "dubois"]).default("mosteller"),
      }))
      .query(({ input }) => {
        const bsa = input.formula === "mosteller"
          ? calculateBSA_Mosteller(input.weightKg, input.heightCm)
          : calculateBSA_DuBois(input.weightKg, input.heightCm);
        return {
          bsa: Math.round(bsa * 100) / 100,
          formula: input.formula,
          mosteller: Math.round(calculateBSA_Mosteller(input.weightKg, input.heightCm) * 100) / 100,
          dubois: Math.round(calculateBSA_DuBois(input.weightKg, input.heightCm) * 100) / 100,
        };
      }),

    calculateCreatinineClearance: publicProcedure
      .input(z.object({
        age: z.number().positive(),
        weightKg: z.number().positive(),
        creatinine: z.number().positive(),
        sex: z.enum(["masculino", "feminino", "outro"]),
      }))
      .query(({ input }) => {
        const crCl = calculateCrCl_CockcroftGault(input.age, input.weightKg, input.creatinine, input.sex);
        return {
          crCl: Math.round(crCl),
          formula: "Cockcroft-Gault",
          renalFunction: crCl >= 90 ? "Normal (≥90 mL/min)" :
            crCl >= 60 ? "Levemente reduzida (60-89 mL/min)" :
            crCl >= 30 ? "Moderadamente reduzida (30-59 mL/min)" :
            crCl >= 15 ? "Gravemente reduzida (15-29 mL/min)" :
            "Insuficiência renal terminal (<15 mL/min)",
        };
      }),

    calculateDose: publicProcedure
      .input(z.object({
        medicationId: z.number(),
        weightKg: z.number().positive(),
        heightCm: z.number().positive(),
        bsaFormula: z.enum(["mosteller", "dubois"]).default("mosteller"),
        creatinine: z.number().optional(),
        age: z.number().optional(),
        sex: z.enum(["masculino", "feminino", "outro"]).optional(),
        customDosePerM2: z.number().optional(),
        aucTarget: z.number().optional(),
      }))
      .query(({ input }) => {
        const medication = MEDICATIONS.find(m => m.id === input.medicationId);
        if (!medication) return null;

        const bsa = input.bsaFormula === "mosteller"
          ? calculateBSA_Mosteller(input.weightKg, input.heightCm)
          : calculateBSA_DuBois(input.weightKg, input.heightCm);

        const bsaRounded = Math.round(bsa * 100) / 100;

        let crCl: number | null = null;
        if (input.creatinine && input.age && input.sex) {
          crCl = calculateCrCl_CockcroftGault(input.age, input.weightKg, input.creatinine, input.sex);
        }

        // AUC-based dosing (Carboplatin - Calvert formula)
        let aucDose: number | null = null;
        if (input.aucTarget && crCl) {
          aucDose = Math.round(getAUCDose_Calvert(input.aucTarget, crCl));
        }

        // Parse standard dose to extract mg/m2 value
        const doseMatch = medication.standardDose.match(/(\d+(?:\.\d+)?)\s*mg\/m[²2]/);
        const standardDosePerM2 = input.customDosePerM2 || (doseMatch ? parseFloat(doseMatch[1]) : null);

        let calculatedDose: number | null = null;
        if (standardDosePerM2) {
          calculatedDose = calculateDose(standardDosePerM2, bsaRounded, undefined);
        }

        // Weight-based dosing (mg/kg)
        const weightDoseMatch = medication.standardDose.match(/(\d+(?:\.\d+)?)\s*mg\/kg/);
        let weightBasedDose: number | null = null;
        if (weightDoseMatch) {
          weightBasedDose = Math.round(parseFloat(weightDoseMatch[1]) * input.weightKg * 10) / 10;
        }

        return {
          medication: medication.genericName,
          bsa: bsaRounded,
          crCl: crCl ? Math.round(crCl) : null,
          calculatedDose,
          weightBasedDose,
          aucDose,
          standardDose: medication.standardDose,
          doseUnit: medication.doseUnit,
          maxCumulativeDose: medication.maxCumulativeDose,
          maxCumulativeDoseUnit: medication.maxCumulativeDoseUnit,
          renalAdjustment: medication.renalAdjustment,
          hepaticAdjustment: medication.hepaticAdjustment,
          cardiotoxicityRisk: medication.cardiotoxicityRisk,
          warnings: [
            ...(medication.maxCumulativeDose && calculatedDose
              ? [`Dose cumulativa máxima: ${medication.maxCumulativeDose} ${medication.maxCumulativeDoseUnit || medication.doseUnit}`]
              : []),
            ...(medication.cardiotoxicityRisk === "alto" || medication.cardiotoxicityRisk === "muito_alto"
              ? [`Risco cardiotóxico ${medication.cardiotoxicityRisk.replace("_", " ")}: monitoramento cardíaco obrigatório`]
              : []),
            ...(medication.lvefMonitoring ? ["Monitoramento de LVEF obrigatório"] : []),
            ...(medication.qtProlongation ? ["Risco de prolongamento do intervalo QTc: ECG obrigatório"] : []),
            ...(medication.hypertensionRisk ? ["Risco de hipertensão arterial: monitorar PA"] : []),
          ],
        };
      }),

    calculateCardiovascularRisk: publicProcedure
      .input(z.object({
        riskFactors: z.array(z.string()),
      }))
      .query(({ input }) => {
        return calculateCardiovascularRisk(input.riskFactors);
      }),

    calculateCumulativeDoxorubicinEquivalent: publicProcedure
      .input(z.object({
        doxorubicinMgM2: z.number().optional(),
        epirrubicinaMgM2: z.number().optional(),
        daunorrubicinaMgM2: z.number().optional(),
        idarrubicinaMgM2: z.number().optional(),
      }))
      .query(({ input }) => {
        // Conversão para equivalente de doxorrubicina
        const doxo = input.doxorubicinMgM2 || 0;
        const epi = (input.epirrubicinaMgM2 || 0) * 0.5; // 2:1 ratio
        const dauno = (input.daunorrubicinaMgM2 || 0) * 0.5;
        const idarro = (input.idarrubicinaMgM2 || 0) * 5; // 1:5 ratio
        const total = doxo + epi + dauno + idarro;
        return {
          totalEquivalent: Math.round(total * 10) / 10,
          unit: "mg/m² equivalente de doxorrubicina",
          risk: total < 200 ? "Baixo risco" :
            total < 300 ? "Risco moderado" :
            total < 450 ? "Alto risco (considerar dexrazoxano)" :
            "Muito alto risco (dose cumulativa crítica)",
          maxSafe: 450,
          recommendation: total >= 300
            ? "Considerar dexrazoxano para cardioprotecção. Monitoramento intensivo de LVEF."
            : "Monitoramento padrão de LVEF.",
        };
      }),
  }),

  // ─── Patients ────────────────────────────────────────────────────────────────
  patients: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      const db = await getDb();
      if (!db) return [];
      return db.select().from(patients).where(eq(patients.userId, ctx.user.id)).orderBy(desc(patients.createdAt));
    }),

    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) return null;
        const result = await db.select().from(patients)
          .where(and(eq(patients.id, input.id), eq(patients.userId, ctx.user.id)))
          .limit(1);
        return result[0] || null;
      }),

    create: protectedProcedure
      .input(z.object({
        name: z.string().min(1),
        birthDate: z.string().optional(),
        sex: z.enum(["masculino", "feminino", "outro"]).optional(),
        weightKg: z.number().positive().optional(),
        heightCm: z.number().positive().optional(),
        creatinine: z.number().positive().optional(),
        hypertension: z.boolean().optional(),
        diabetes: z.boolean().optional(),
        dyslipidemia: z.boolean().optional(),
        smoking: z.boolean().optional(),
        obesity: z.boolean().optional(),
        previousHeartDisease: z.boolean().optional(),
        previousChemotherapy: z.boolean().optional(),
        oncologicDiagnosis: z.string().optional(),
        tumorStage: z.string().optional(),
        baselineLvef: z.number().optional(),
        baselineTroponin: z.number().optional(),
        baselineBnp: z.number().optional(),
        cardiovascularRisk: z.enum(["baixo", "moderado", "alto", "muito_alto"]).optional(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database unavailable");
        const result = await db.insert(patients).values({
          ...input,
          userId: ctx.user.id,
          birthDate: input.birthDate ? new Date(input.birthDate) : undefined,
        });
        return { id: Number(result[0].insertId) };
      }),

    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().min(1).optional(),
        birthDate: z.string().optional(),
        sex: z.enum(["masculino", "feminino", "outro"]).optional(),
        weightKg: z.number().positive().optional(),
        heightCm: z.number().positive().optional(),
        creatinine: z.number().positive().optional(),
        hypertension: z.boolean().optional(),
        diabetes: z.boolean().optional(),
        dyslipidemia: z.boolean().optional(),
        smoking: z.boolean().optional(),
        obesity: z.boolean().optional(),
        previousHeartDisease: z.boolean().optional(),
        previousChemotherapy: z.boolean().optional(),
        oncologicDiagnosis: z.string().optional(),
        tumorStage: z.string().optional(),
        baselineLvef: z.number().optional(),
        baselineTroponin: z.number().optional(),
        baselineBnp: z.number().optional(),
        cardiovascularRisk: z.enum(["baixo", "moderado", "alto", "muito_alto"]).optional(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database unavailable");
        const { id, birthDate, ...rest } = input;
        await db.update(patients)
          .set({ ...rest, birthDate: birthDate ? new Date(birthDate) : undefined })
          .where(and(eq(patients.id, id), eq(patients.userId, ctx.user.id)));
        return { success: true };
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database unavailable");
        await db.delete(patients)
          .where(and(eq(patients.id, input.id), eq(patients.userId, ctx.user.id)));
        return { success: true };
      }),
  }),

  // ─── Assessments ─────────────────────────────────────────────────────────────
  assessments: router({
    listByPatient: protectedProcedure
      .input(z.object({ patientId: z.number() }))
      .query(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) return [];
        return db.select().from(patientAssessments)
          .where(and(
            eq(patientAssessments.patientId, input.patientId),
            eq(patientAssessments.userId, ctx.user.id)
          ))
          .orderBy(desc(patientAssessments.assessmentDate));
      }),

    create: protectedProcedure
      .input(z.object({
        patientId: z.number(),
        currentMedicationId: z.number().optional(),
        currentMedicationName: z.string().optional(),
        cumulativeDose: z.number().optional(),
        cumulativeDoseUnit: z.string().optional(),
        treatmentCycle: z.number().optional(),
        lvef: z.number().optional(),
        lvefMethod: z.string().optional(),
        troponin: z.number().optional(),
        troponinType: z.string().optional(),
        bnp: z.number().optional(),
        qtcInterval: z.number().optional(),
        systolicBp: z.number().optional(),
        diastolicBp: z.number().optional(),
        heartRate: z.number().optional(),
        dyspnea: z.boolean().optional(),
        chestPain: z.boolean().optional(),
        palpitations: z.boolean().optional(),
        edema: z.boolean().optional(),
        ctcaeGrade: z.number().optional(),
        ctcaeToxicity: z.string().optional(),
        recommendation: z.string().optional(),
        treatmentModification: z.enum(["manter", "reduzir_dose", "suspender_temporario", "descontinuar", "aguardar"]).optional(),
        nextAssessmentDate: z.string().optional(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database unavailable");
        const result = await db.insert(patientAssessments).values({
          ...input,
          userId: ctx.user.id,
          nextAssessmentDate: input.nextAssessmentDate ? new Date(input.nextAssessmentDate) : undefined,
        });
        return { id: Number(result[0].insertId) };
      }),

    getLatestByPatient: protectedProcedure
      .input(z.object({ patientId: z.number() }))
      .query(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) return null;
        const result = await db.select().from(patientAssessments)
          .where(and(
            eq(patientAssessments.patientId, input.patientId),
            eq(patientAssessments.userId, ctx.user.id)
          ))
          .orderBy(desc(patientAssessments.assessmentDate))
          .limit(1);
        return result[0] || null;
      }),
  }),

  // ─── Dashboard ───────────────────────────────────────────────────────────────
  dashboard: router({
    getSummary: protectedProcedure.query(async ({ ctx }) => {
      const db = await getDb();
      if (!db) return { totalPatients: 0, highRiskPatients: 0, recentAssessments: 0, alerts: [] };

      const allPatients = await db.select().from(patients).where(eq(patients.userId, ctx.user.id));
      const highRisk = allPatients.filter(p =>
        p.cardiovascularRisk === "alto" || p.cardiovascularRisk === "muito_alto"
      );

      const recentAssessments = await db.select().from(patientAssessments)
        .where(eq(patientAssessments.userId, ctx.user.id))
        .orderBy(desc(patientAssessments.createdAt))
        .limit(5);

      const alerts: string[] = [];
      for (const p of allPatients) {
        const latestAssessment = await db.select().from(patientAssessments)
          .where(and(
            eq(patientAssessments.patientId, p.id),
            eq(patientAssessments.userId, ctx.user.id)
          ))
          .orderBy(desc(patientAssessments.assessmentDate))
          .limit(1);

        const la = latestAssessment[0];
        if (la) {
          if (la.lvef && la.lvef < 50) {
            alerts.push(`${p.name}: LVEF baixa (${la.lvef}%)`);
          }
          if (la.ctcaeGrade && la.ctcaeGrade >= 3) {
            alerts.push(`${p.name}: Toxicidade CTCAE Grau ${la.ctcaeGrade}`);
          }
          if (la.systolicBp && la.systolicBp >= 160) {
            alerts.push(`${p.name}: Hipertensão Grau 3 (${la.systolicBp}/${la.diastolicBp} mmHg)`);
          }
          if (la.qtcInterval && la.qtcInterval > 500) {
            alerts.push(`${p.name}: QTc prolongado (${la.qtcInterval} ms)`);
          }
        }
      }

      return {
        totalPatients: allPatients.length,
        highRiskPatients: highRisk.length,
        recentAssessments: recentAssessments.length,
        alerts,
        recentAssessmentsList: recentAssessments,
        riskDistribution: {
          baixo: allPatients.filter(p => p.cardiovascularRisk === "baixo").length,
          moderado: allPatients.filter(p => p.cardiovascularRisk === "moderado").length,
          alto: allPatients.filter(p => p.cardiovascularRisk === "alto").length,
          muito_alto: allPatients.filter(p => p.cardiovascularRisk === "muito_alto").length,
        },
      };
    }),
  }),
});

export type AppRouter = typeof appRouter;
