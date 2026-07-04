import {
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
  float,
  boolean,
  json,
} from "drizzle-orm/mysql-core";

// ─── Core Auth ───────────────────────────────────────────────────────────────

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ─── Drug Classes ─────────────────────────────────────────────────────────────

export const drugClasses = mysqlTable("drug_classes", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  nameEn: varchar("nameEn", { length: 100 }),
  description: text("description"),
  cardiotoxicityType: mysqlEnum("cardiotoxicityType", ["tipo_I", "tipo_II", "misto", "nenhum"]).default("nenhum"),
  cardiotoxicityMechanism: text("cardiotoxicityMechanism"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type DrugClass = typeof drugClasses.$inferSelect;

// ─── Medications ──────────────────────────────────────────────────────────────

export const medications = mysqlTable("medications", {
  id: int("id").autoincrement().primaryKey(),
  genericName: varchar("genericName", { length: 150 }).notNull(),
  brandNames: text("brandNames"),
  drugClassId: int("drugClassId").notNull(),
  mechanismOfAction: text("mechanismOfAction"),
  indications: text("indications"),
  standardDose: text("standardDose"),
  doseUnit: varchar("doseUnit", { length: 50 }),
  maxCumulativeDose: float("maxCumulativeDose"),
  maxCumulativeDoseUnit: varchar("maxCumulativeDoseUnit", { length: 30 }),
  cardiotoxicityRisk: mysqlEnum("cardiotoxicityRisk", ["baixo", "moderado", "alto", "muito_alto"]).default("baixo"),
  cardiotoxicityProfile: text("cardiotoxicityProfile"),
  lvefMonitoring: boolean("lvefMonitoring").default(false),
  qtProlongation: boolean("qtProlongation").default(false),
  hypertensionRisk: boolean("hypertensionRisk").default(false),
  myocarditisRisk: boolean("myocarditisRisk").default(false),
  renalAdjustment: text("renalAdjustment"),
  hepaticAdjustment: text("hepaticAdjustment"),
  mainSideEffects: text("mainSideEffects"),
  cardioProtection: text("cardioProtection"),
  references: text("references"),
  sbocGuideline: varchar("sbocGuideline", { length: 200 }),
  escGuideline: varchar("escGuideline", { length: 200 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Medication = typeof medications.$inferSelect;

// ─── Drug Interactions ────────────────────────────────────────────────────────

export const drugInteractions = mysqlTable("drug_interactions", {
  id: int("id").autoincrement().primaryKey(),
  drug1Id: int("drug1Id").notNull(),
  drug2Name: varchar("drug2Name", { length: 150 }).notNull(),
  severity: mysqlEnum("severity", ["contraindicada", "grave", "moderada", "leve"]).notNull(),
  mechanism: text("mechanism"),
  clinicalEffect: text("clinicalEffect"),
  management: text("management"),
  qtRisk: boolean("qtRisk").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type DrugInteraction = typeof drugInteractions.$inferSelect;

// ─── Patients ─────────────────────────────────────────────────────────────────

export const patients = mysqlTable("patients", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  name: varchar("name", { length: 200 }).notNull(),
  birthDate: timestamp("birthDate"),
  sex: mysqlEnum("sex", ["masculino", "feminino", "outro"]),
  weightKg: float("weightKg"),
  heightCm: float("heightCm"),
  creatinine: float("creatinine"),
  // Comorbidades
  hypertension: boolean("hypertension").default(false),
  diabetes: boolean("diabetes").default(false),
  dyslipidemia: boolean("dyslipidemia").default(false),
  smoking: boolean("smoking").default(false),
  obesity: boolean("obesity").default(false),
  previousHeartDisease: boolean("previousHeartDisease").default(false),
  previousChemotherapy: boolean("previousChemotherapy").default(false),
  // Diagnóstico oncológico
  oncologicDiagnosis: varchar("oncologicDiagnosis", { length: 200 }),
  tumorStage: varchar("tumorStage", { length: 50 }),
  // Dados cardíacos basais
  baselineLvef: float("baselineLvef"),
  baselineTroponin: float("baselineTroponin"),
  baselineBnp: float("baselineBnp"),
  cardiovascularRisk: mysqlEnum("cardiovascularRisk", ["baixo", "moderado", "alto", "muito_alto"]),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Patient = typeof patients.$inferSelect;
export type InsertPatient = typeof patients.$inferInsert;

// ─── Patient Assessments ──────────────────────────────────────────────────────

export const patientAssessments = mysqlTable("patient_assessments", {
  id: int("id").autoincrement().primaryKey(),
  patientId: int("patientId").notNull(),
  userId: int("userId").notNull(),
  assessmentDate: timestamp("assessmentDate").defaultNow().notNull(),
  // Tratamento atual
  currentMedicationId: int("currentMedicationId"),
  currentMedicationName: varchar("currentMedicationName", { length: 150 }),
  cumulativeDose: float("cumulativeDose"),
  cumulativeDoseUnit: varchar("cumulativeDoseUnit", { length: 30 }),
  treatmentCycle: int("treatmentCycle"),
  // Avaliação cardíaca
  lvef: float("lvef"),
  lvefMethod: varchar("lvefMethod", { length: 50 }),
  troponin: float("troponin"),
  troponinType: varchar("troponinType", { length: 20 }),
  bnp: float("bnp"),
  qtcInterval: float("qtcInterval"),
  systolicBp: int("systolicBp"),
  diastolicBp: int("diastolicBp"),
  heartRate: int("heartRate"),
  // Sintomas
  dyspnea: boolean("dyspnea").default(false),
  chestPain: boolean("chestPain").default(false),
  palpitations: boolean("palpitations").default(false),
  edema: boolean("edema").default(false),
  // CTCAE
  ctcaeGrade: int("ctcaeGrade"),
  ctcaeToxicity: varchar("ctcaeToxicity", { length: 100 }),
  // Conduta
  recommendation: text("recommendation"),
  treatmentModification: mysqlEnum("treatmentModification", ["manter", "reduzir_dose", "suspender_temporario", "descontinuar", "aguardar"]),
  nextAssessmentDate: timestamp("nextAssessmentDate"),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type PatientAssessment = typeof patientAssessments.$inferSelect;
export type InsertPatientAssessment = typeof patientAssessments.$inferInsert;

// ─── Monitoring Schedules ─────────────────────────────────────────────────────

export const monitoringSchedules = mysqlTable("monitoring_schedules", {
  id: int("id").autoincrement().primaryKey(),
  medicationId: int("medicationId").notNull(),
  timepoint: varchar("timepoint", { length: 100 }).notNull(),
  echocardiogram: boolean("echocardiogram").default(false),
  ecg: boolean("ecg").default(false),
  troponin: boolean("troponin").default(false),
  bnp: boolean("bnp").default(false),
  bloodPressure: boolean("bloodPressure").default(false),
  cbc: boolean("cbc").default(false),
  renalFunction: boolean("renalFunction").default(false),
  hepaticFunction: boolean("hepaticFunction").default(false),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type MonitoringSchedule = typeof monitoringSchedules.$inferSelect;
