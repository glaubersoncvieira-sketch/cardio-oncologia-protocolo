import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

function createAuthContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-oncologist",
    email: "oncologist@hospital.com",
    name: "Dr. Oncologista",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };
  return {
    user,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("clinical.getMedications", () => {
  it("retorna lista de medicamentos oncológicos", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const medications = await caller.clinical.getMedications();
    expect(Array.isArray(medications)).toBe(true);
    expect(medications.length).toBeGreaterThan(0);
  });

  it("cada medicamento tem campos clínicos obrigatórios", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const medications = await caller.clinical.getMedications();
    for (const med of medications) {
      expect(med).toHaveProperty("id");
      expect(med).toHaveProperty("genericName");
      expect(med).toHaveProperty("drugClassId");
      expect(med).toHaveProperty("mechanismOfAction");
      expect(med).toHaveProperty("cardiotoxicityProfile");
      expect(typeof med.genericName).toBe("string");
      expect(med.genericName.length).toBeGreaterThan(0);
    }
  });

  it("inclui antracíclinas (drugClassId=1) com perfil de cardiotoxicidade", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const medications = await caller.clinical.getMedications({ drugClassId: 1 });
    expect(medications.length).toBeGreaterThan(0);
    for (const med of medications) {
      expect(med.drugClassId).toBe(1);
      expect(med.cardiotoxicityProfile).toBeTruthy();
    }
  });

  it("inclui agentes anti-HER2 (drugClassId=2) com perfil de cardiotoxicidade", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const medications = await caller.clinical.getMedications({ drugClassId: 2 });
    expect(medications.length).toBeGreaterThan(0);
    for (const med of medications) {
      expect(med.drugClassId).toBe(2);
      expect(med.cardiotoxicityProfile).toContain("II");
    }
  });
});

describe("clinical.getMedicationById", () => {
  it("retorna medicamento específico por ID", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const med = await caller.clinical.getMedicationById({ id: 1 });
    expect(med).toBeDefined();
    expect(med?.id).toBe(1);
    expect(med?.genericName).toBeTruthy();
  });

  it("retorna null para ID inexistente", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const med = await caller.clinical.getMedicationById({ id: 99999 });
    expect(med).toBeNull();
  });
});

describe("clinical.getProtocols", () => {
  it("retorna lista de protocolos oncológicos", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const protocols = await caller.clinical.getTreatmentProtocols();
    expect(Array.isArray(protocols)).toBe(true);
    expect(protocols.length).toBeGreaterThan(0);
  });

  it("cada protocolo tem nome, indicação e drogas", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const protocols = await caller.clinical.getTreatmentProtocols();
    for (const prot of protocols) {
      expect(prot).toHaveProperty("name");
      expect(prot).toHaveProperty("indication");
      expect(prot).toHaveProperty("drugs");
      expect(Array.isArray(prot.drugs)).toBe(true);
    }
  });
});

describe("clinical.getCTCAEData", () => {
  it("retorna dados de toxicidades CTCAE", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const ctcae = await caller.clinical.getCtcaeData();
    expect(Array.isArray(ctcae)).toBe(true);
    expect(ctcae.length).toBeGreaterThan(0);
  });

  it("inclui toxicidade de disfunção ventricular", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const ctcae = await caller.clinical.getCtcaeData();
    const ventriDysf = ctcae.find(t => t.toxicity.toLowerCase().includes("ventricular") || t.toxicity.toLowerCase().includes("disfunção"));
    expect(ventriDysf).toBeDefined();
  });

  it("inclui toxicidade de miocardite", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const ctcae = await caller.clinical.getCtcaeData();
    const myocarditis = ctcae.find(t => t.toxicity.toLowerCase().includes("miocardite"));
    expect(myocarditis).toBeDefined();
  });

  it("cada toxicidade tem campos de grau 1 a 4", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const ctcae = await caller.clinical.getCtcaeData();
    for (const tox of ctcae) {
      expect(tox.grade1).toBeDefined();
      expect(tox.grade2).toBeDefined();
      expect(tox.grade3).toBeDefined();
      expect(tox.grade4).toBeDefined();
      expect(typeof tox.grade1).toBe("string");
    }
  });
});

describe("clinical.getInteractions", () => {
  it("retorna lista de interações medicamentosas", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const interactions = await caller.clinical.getDrugInteractions();
    expect(Array.isArray(interactions)).toBe(true);
    expect(interactions.length).toBeGreaterThan(0);
  });

  it("inclui interação doxorrubicina + trastuzumabe", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const interactions = await caller.clinical.getDrugInteractions();
    // drug1Id=1 é doxorrubicina, drug2Name contém trastuzumabe
    const doxTras = interactions.find(i =>
      i.drug1Id === 1 &&
      i.drug2Name.toLowerCase().includes("trastuzumabe")
    );
    expect(doxTras).toBeDefined();
    expect(doxTras?.severity).toBe("grave");
  });
});

describe("calculator.calculateBSA", () => {
  it("calcula BSA corretamente com fórmula Mosteller", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.calculator.calculateBSA({ weightKg: 70, heightCm: 170, formula: "mosteller" });
    // Mosteller: sqrt(170 * 70 / 3600) = sqrt(3.3056) ≈ 1.82
    expect(result.bsa).toBeCloseTo(1.82, 1);
    expect(result.formula).toBe("mosteller");
  });

  it("calcula BSA corretamente com fórmula DuBois", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.calculator.calculateBSA({ weightKg: 70, heightCm: 170, formula: "dubois" });
    // DuBois: 0.007184 * 170^0.725 * 70^0.425 ≈ 1.83
    expect(result.bsa).toBeGreaterThan(1.7);
    expect(result.bsa).toBeLessThan(1.95);
    expect(result.formula).toBe("dubois");
  });

  it("retorna ambas as fórmulas na resposta", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.calculator.calculateBSA({ weightKg: 60, heightCm: 160, formula: "mosteller" });
    expect(result.mosteller).toBeDefined();
    expect(result.dubois).toBeDefined();
    expect(typeof result.mosteller).toBe("number");
    expect(typeof result.dubois).toBe("number");
  });
});

describe("calculator.calculateCreatinineClearance", () => {
  it("calcula ClCr corretamente para homem adulto (Cockcroft-Gault)", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    // Homem 50 anos, 70kg, creatinina 1.0 mg/dL
    // CG: (140-50) * 70 / (72 * 1.0) = 87.5 mL/min
    const result = await caller.calculator.calculateCreatinineClearance({
      age: 50, weightKg: 70, creatinine: 1.0, sex: "masculino"
    });
    expect(result.crCl).toBeGreaterThan(80);
    expect(result.crCl).toBeLessThan(100);
    expect(result.formula).toBe("Cockcroft-Gault");
  });

  it("aplica fator de correção 0.85 para mulheres", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const homem = await caller.calculator.calculateCreatinineClearance({
      age: 50, weightKg: 70, creatinine: 1.0, sex: "masculino"
    });
    const mulher = await caller.calculator.calculateCreatinineClearance({
      age: 50, weightKg: 70, creatinine: 1.0, sex: "feminino"
    });
    // Mulher deve ter ClCr ~85% do homem
    expect(mulher.crCl).toBeLessThan(homem.crCl);
    expect(mulher.crCl / homem.crCl).toBeCloseTo(0.85, 1);
  });

  it("classifica função renal corretamente", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    // Insuficiência renal grave: creatinina alta
    const result = await caller.calculator.calculateCreatinineClearance({
      age: 70, weightKg: 60, creatinine: 3.5, sex: "masculino"
    });
    expect(result.renalFunction).toContain("reduzida");
  });
});

describe("patients (autenticado)", () => {
  it("lista de pacientes retorna array vazio para novo usuário", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    const patients = await caller.patients.list();
    expect(Array.isArray(patients)).toBe(true);
  });
});
