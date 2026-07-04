// ============================================================
// BASE DE DADOS CLÍNICA - CARDIO-ONCOLOGIA
// Fonte: Diretrizes SBOC 2026, ESC 2022, ASCO 2017
// ============================================================

export interface DrugClassData {
  id: number;
  name: string;
  nameEn: string;
  description: string;
  cardiotoxicityType: "tipo_I" | "tipo_II" | "misto" | "nenhum";
  cardiotoxicityMechanism: string;
}

export interface MedicationData {
  id: number;
  genericName: string;
  brandNames: string;
  drugClassId: number;
  mechanismOfAction: string;
  indications: string;
  standardDose: string;
  doseUnit: string;
  maxCumulativeDose?: number;
  maxCumulativeDoseUnit?: string;
  cardiotoxicityRisk: "baixo" | "moderado" | "alto" | "muito_alto";
  cardiotoxicityProfile: string;
  lvefMonitoring: boolean;
  qtProlongation: boolean;
  hypertensionRisk: boolean;
  myocarditisRisk: boolean;
  renalAdjustment: string;
  hepaticAdjustment: string;
  mainSideEffects: string;
  cardioProtection: string;
  references: string;
  sbocGuideline?: string;
  escGuideline?: string;
}

export interface DrugInteractionData {
  id: number;
  drug1Id: number;
  drug2Name: string;
  severity: "contraindicada" | "grave" | "moderada" | "leve";
  mechanism: string;
  clinicalEffect: string;
  management: string;
  qtRisk: boolean;
}

export interface MonitoringScheduleData {
  medicationId: number;
  timepoint: string;
  echocardiogram: boolean;
  ecg: boolean;
  troponin: boolean;
  bnp: boolean;
  bloodPressure: boolean;
  cbc: boolean;
  renalFunction: boolean;
  hepaticFunction: boolean;
  notes: string;
}

// ─── CLASSES FARMACOLÓGICAS ───────────────────────────────────────────────────

export const DRUG_CLASSES: DrugClassData[] = [
  {
    id: 1,
    name: "Antracíclinas",
    nameEn: "Anthracyclines",
    description: "Antibióticos citotóxicos derivados de Streptomyces peucetius. Intercalam-se no DNA e inibem a topoisomerase II, causando quebras de dupla fita.",
    cardiotoxicityType: "tipo_I",
    cardiotoxicityMechanism: "Geração de radicais livres de oxigênio (ROS) via ciclo redox do grupo quinona. Formação de complexos com ferro (Fe²⁺/Fe³⁺) que amplificam o estresse oxidativo. Dano irreversível ao cardiomiócito com apoptose e fibrose miocárdica. Cardiotoxicidade dose-cumulativa dependente.",
  },
  {
    id: 2,
    name: "Agentes Anti-HER2",
    nameEn: "Anti-HER2 Agents",
    description: "Anticorpos monoclonais e inibidores de tirosina quinase direcionados ao receptor HER2 (ErbB2), superexpresso em ~20% dos cânceres de mama.",
    cardiotoxicityType: "tipo_II",
    cardiotoxicityMechanism: "Bloqueio da sinalização HER2/ErbB4 necessária para sobrevivência e reparo do cardiomiócito. Disfunção ventricular esquerda geralmente reversível com a suspensão do tratamento. Não há lesão estrutural permanente do cardiomiócito (cardiotoxicidade tipo II).",
  },
  {
    id: 3,
    name: "Inibidores de Checkpoint Imunológico (ICI)",
    nameEn: "Immune Checkpoint Inhibitors",
    description: "Anticorpos monoclonais que bloqueiam receptores inibitórios (PD-1, PD-L1, CTLA-4), potencializando a resposta imune antitumoral.",
    cardiotoxicityType: "tipo_I",
    cardiotoxicityMechanism: "Ativação imune não controlada com infiltração linfocitária do miocárdio (miocardite imunomediada). Mecanismo similar à miocardite autoimune. Pode ser fatal em até 50% dos casos de miocardite grave. Incidência de miocardite: ~1% em monoterapia, ~2-3% em combinação.",
  },
  {
    id: 4,
    name: "Inibidores de Tirosina Quinase (TKIs)",
    nameEn: "Tyrosine Kinase Inhibitors",
    description: "Moléculas pequenas que inibem receptores de tirosina quinase (VEGFR, PDGFR, c-Kit, BCR-ABL), bloqueando vias de sinalização de proliferação e angiogênese.",
    cardiotoxicityType: "misto",
    cardiotoxicityMechanism: "Inibição off-target de quinases cardíacas (AMPK, RAF). Hipertensão arterial por inibição de VEGF/VEGFR (redução de óxido nítrico e prostaciclina). Prolongamento do intervalo QT por bloqueio de canais iônicos cardíacos (hERG). Disfunção ventricular esquerda por inibição de vias de sobrevivência do cardiomiócito.",
  },
  {
    id: 5,
    name: "Agentes Alquilantes",
    nameEn: "Alkylating Agents",
    description: "Formam ligações covalentes com o DNA, impedindo a replicação. Incluem mostardas nitrogenadas (ciclofosfamida, ifosfamida) e derivados de platina.",
    cardiotoxicityType: "tipo_I",
    cardiotoxicityMechanism: "Ciclofosfamida em altas doses: lesão endotelial direta com extravasamento de metabólitos tóxicos para o interstício miocárdico. Ifosfamida: miocardite hemorrágica. Carboplatina/Cisplatina: vasospasmo coronariano, isquemia miocárdica.",
  },
  {
    id: 6,
    name: "Antimetabólitos",
    nameEn: "Antimetabolites",
    description: "Análogos estruturais de metabólitos celulares que interferem na síntese de DNA e RNA (5-FU, capecitabina, metotrexato, gemcitabina).",
    cardiotoxicityType: "misto",
    cardiotoxicityMechanism: "5-FU/Capecitabina: vasospasmo coronariano (mecanismo principal), endotelite, trombose. Incidência de cardiotoxicidade: 1-8%. Metotrexato: pericardite, miocardite (raro). Gemcitabina: fibrilação atrial, isquemia miocárdica.",
  },
  {
    id: 7,
    name: "Inibidores de CDK4/6",
    nameEn: "CDK4/6 Inhibitors",
    description: "Inibem as quinases dependentes de ciclina 4 e 6, bloqueando a progressão do ciclo celular na fase G1. Usados em câncer de mama RH+/HER2-.",
    cardiotoxicityType: "nenhum",
    cardiotoxicityMechanism: "Baixo risco cardiovascular direto. Ribociclibe: prolongamento do intervalo QTc (monitoramento obrigatório). Abemaciclibe e palbociclibe: risco mínimo de cardiotoxicidade.",
  },
  {
    id: 8,
    name: "Inibidores de PARP",
    nameEn: "PARP Inhibitors",
    description: "Inibem a enzima poli(ADP-ribose) polimerase, impedindo o reparo de danos ao DNA em células com deficiência de BRCA1/2.",
    cardiotoxicityType: "nenhum",
    cardiotoxicityMechanism: "Risco cardiovascular muito baixo. Olaparibe: anemia (pode agravar insuficiência cardíaca preexistente). Sem cardiotoxicidade direta significativa descrita.",
  },
  {
    id: 9,
    name: "Inibidores de BRAF/MEK",
    nameEn: "BRAF/MEK Inhibitors",
    description: "Inibem a via de sinalização MAPK/ERK em tumores com mutação BRAF V600E (melanoma, CPNPC, carcinoma papilífero de tireoide).",
    cardiotoxicityType: "misto",
    cardiotoxicityMechanism: "Prolongamento do intervalo QTc. Disfunção ventricular esquerda (rara). Hipertensão arterial. Vemurafenibe: maior risco de QT prolongado. Dabrafenibe + Trametinibe: pirexia, cardiomiopatia (rara).",
  },
  {
    id: 10,
    name: "Inibidores de mTOR",
    nameEn: "mTOR Inhibitors",
    description: "Inibem a via mTOR (mammalian target of rapamycin), bloqueando a proliferação celular e angiogênese. Usados em CCR, mama, tumores neuroendócrinos.",
    cardiotoxicityType: "nenhum",
    cardiotoxicityMechanism: "Baixo risco cardiovascular direto. Hiperglicemia e hiperlipidemia podem agravar fatores de risco cardiovascular. Pneumonite não infecciosa (efeito colateral relevante).",
  },
];

// ─── MEDICAMENTOS ─────────────────────────────────────────────────────────────

export const MEDICATIONS: MedicationData[] = [
  // === ANTRACÍCLINAS ===
  {
    id: 1,
    genericName: "Doxorrubicina",
    brandNames: "Adriamycin, Rubex",
    drugClassId: 1,
    mechanismOfAction: "Intercalação no DNA entre pares de bases adjacentes. Inibição da topoisomerase II (formação de complexo estável DNA-topoisomerase II-doxorrubicina). Geração de radicais livres de oxigênio via ciclo redox do grupo quinona. Inibição da síntese de DNA, RNA e proteínas.",
    indications: "Câncer de mama (adjuvância e neoadjuvância), linfomas de Hodgkin e não-Hodgkin, leucemias, sarcomas, câncer de ovário, câncer de pulmão de pequenas células. Esquemas: AC (doxorrubicina + ciclofosfamida), FAC, FEC, CHOP.",
    standardDose: "60 mg/m² EV D1 a cada 3 semanas (AC padrão) | 60 mg/m² EV D1 a cada 2 semanas (ACdd dose-densa) | 50-75 mg/m² EV D1 a cada 3 semanas (outros esquemas)",
    doseUnit: "mg/m²",
    maxCumulativeDose: 450,
    maxCumulativeDoseUnit: "mg/m²",
    cardiotoxicityRisk: "alto",
    cardiotoxicityProfile: "Cardiotoxicidade tipo I (irreversível). Incidência de IC: 3-5% com dose cumulativa ≤450 mg/m²; 7-26% com >550 mg/m²; >30% com >700 mg/m². Fatores de risco: dose cumulativa total, velocidade de infusão, idade >65 anos, radioterapia mediastinal prévia, HAS, DM, doença cardíaca preexistente, uso concomitante de trastuzumabe. Manifestação: disfunção ventricular esquerda assintomática → IC sintomática (pode ocorrer meses a anos após o tratamento).",
    lvefMonitoring: true,
    qtProlongation: false,
    hypertensionRisk: false,
    myocarditisRisk: false,
    renalAdjustment: "Não requer ajuste de dose por função renal.",
    hepaticAdjustment: "Reduzir dose: bilirrubina 1,2-3,0 mg/dL → 50% da dose; bilirrubina 3,1-5,0 mg/dL → 25% da dose; bilirrubina >5,0 mg/dL → contraindicado.",
    mainSideEffects: "Mielossupressão (nadir D10-14), alopecia, náuseas/vômitos, mucosite, cardiotoxicidade, extravasamento (necrose tecidual), coloração avermelhada da urina.",
    cardioProtection: "Dexrazoxano: indicado quando dose cumulativa >300 mg/m² em pacientes de alto risco. Formulação lipossomal (doxorrubicina lipossomal peguilada): menor cardiotoxicidade. Infusão contínua (72h) vs bolus: menor pico plasmático, menor cardiotoxicidade. Monitoramento com ecocardiograma basal e a cada 100 mg/m² acumulados.",
    references: "SBOC 2026 - Mama Adjuvância; ESC 2022 Cardio-Oncology Guidelines (Zamorano et al.); ASCO 2017 Prevention and Monitoring of Cardiac Dysfunction.",
    sbocGuideline: "Mama Adjuvância 2026, Mama Neoadjuvância 2026",
    escGuideline: "ESC 2022 - Seção 5.1 Anthracyclines",
  },
  {
    id: 2,
    genericName: "Epirrubicina",
    brandNames: "Ellence, Farmorubicin",
    drugClassId: 1,
    mechanismOfAction: "Epímero da doxorrubicina (4'-epi-doxorrubicina). Mesmo mecanismo de ação: intercalação no DNA e inibição da topoisomerase II. Menor cardiotoxicidade comparada à doxorrubicina em doses equimolares.",
    indications: "Câncer de mama (adjuvância e neoadjuvância), câncer gástrico, linfomas. Esquemas: EC (epirrubicina + ciclofosfamida), FEC (5-FU + epirrubicina + ciclofosfamida), CEF.",
    standardDose: "100 mg/m² EV D1 a cada 3 semanas (FEC-100) | 90 mg/m² EV D1 a cada 3 semanas (FEC-90) | 75-90 mg/m² EV D1 a cada 3 semanas (EC)",
    doseUnit: "mg/m²",
    maxCumulativeDose: 900,
    maxCumulativeDoseUnit: "mg/m²",
    cardiotoxicityRisk: "moderado",
    cardiotoxicityProfile: "Cardiotoxicidade tipo I. Dose cumulativa máxima: 900 mg/m² (equivale a ~450 mg/m² de doxorrubicina). Incidência de IC: ~1-2% com dose ≤900 mg/m². Menor cardiotoxicidade que doxorrubicina em doses equimolares (razão de equivalência: 1,8-2:1 epirrubicina:doxorrubicina).",
    lvefMonitoring: true,
    qtProlongation: false,
    hypertensionRisk: false,
    myocarditisRisk: false,
    renalAdjustment: "Não requer ajuste de dose por função renal.",
    hepaticAdjustment: "Reduzir dose conforme bilirrubina: 1,2-3,0 mg/dL → 50%; >3,0 mg/dL → 25%.",
    mainSideEffects: "Mielossupressão, alopecia, náuseas/vômitos, mucosite, cardiotoxicidade (menor que doxorrubicina), coloração avermelhada da urina.",
    cardioProtection: "Monitoramento com ecocardiograma basal e periódico. Dexrazoxano para doses cumulativas elevadas.",
    references: "SBOC 2026 - Mama Adjuvância; ESC 2022 Cardio-Oncology Guidelines.",
    sbocGuideline: "Mama Adjuvância 2026",
    escGuideline: "ESC 2022 - Seção 5.1",
  },
  // === ANTI-HER2 ===
  {
    id: 3,
    genericName: "Trastuzumabe",
    brandNames: "Herceptin, Kanjinti, Herzuma",
    drugClassId: 2,
    mechanismOfAction: "Anticorpo monoclonal humanizado IgG1 que se liga ao domínio extracelular IV do receptor HER2 (ErbB2). Inibe a sinalização intracelular de proliferação (PI3K/AKT, MAPK). Induz citotoxicidade celular dependente de anticorpo (ADCC). Inibe a clivagem do domínio extracelular do HER2.",
    indications: "Câncer de mama HER2-positivo (adjuvância, neoadjuvância, metastático). Câncer gástrico/gastroesofágico HER2-positivo. Esquemas: TH, TCH, TCHP, AC→TH, FEC→TH.",
    standardDose: "8 mg/kg EV D1 (dose de ataque) seguido de 6 mg/kg EV D1 a cada 3 semanas | 4 mg/kg EV D1 (dose de ataque) seguido de 2 mg/kg EV D1 semanalmente | 600 mg SC D1 a cada 3 semanas (formulação subcutânea)",
    doseUnit: "mg/kg",
    cardiotoxicityRisk: "moderado",
    cardiotoxicityProfile: "Cardiotoxicidade tipo II (reversível). Incidência de disfunção ventricular: 3-7% em monoterapia; 13-27% em combinação com antracíclinas. Mecanismo: bloqueio da sinalização HER2/ErbB4 necessária para sobrevivência do cardiomiócito. Geralmente reversível com suspensão do tratamento (80-90% dos casos). Risco aumentado: uso concomitante ou sequencial com antracíclinas, LVEF basal limítrofe, HAS, DM, idade avançada.",
    lvefMonitoring: true,
    qtProlongation: false,
    hypertensionRisk: false,
    myocarditisRisk: false,
    renalAdjustment: "Não requer ajuste de dose.",
    hepaticAdjustment: "Não requer ajuste de dose.",
    mainSideEffects: "Cardiotoxicidade (disfunção ventricular), reações infusionais (febre, calafrios, hipotensão), diarreia, fadiga, cefaleia, mialgia.",
    cardioProtection: "Monitoramento obrigatório de LVEF: basal, a cada 3 meses durante tratamento, 6 meses após término. Suspender se LVEF cair ≥10 pontos percentuais e ficar <50%. Intervalo mínimo de 3 semanas após última dose de antracíclina antes de iniciar trastuzumabe.",
    references: "SBOC 2026 - Mama Adjuvância; ESC 2022 Cardio-Oncology Guidelines - Seção 5.2; ASCO 2017.",
    sbocGuideline: "Mama Adjuvância 2026, Mama Neoadjuvância 2026, Mama Metastática 2026",
    escGuideline: "ESC 2022 - Seção 5.2 HER2-targeted therapies",
  },
  {
    id: 4,
    genericName: "Pertuzumabe",
    brandNames: "Perjeta",
    drugClassId: 2,
    mechanismOfAction: "Anticorpo monoclonal humanizado IgG1 que se liga ao domínio extracelular II do HER2 (diferente do trastuzumabe - domínio IV). Inibe a dimerização HER2-HER3, bloqueando a sinalização PI3K/AKT. Ação complementar ao trastuzumabe (duplo bloqueio HER2).",
    indications: "Câncer de mama HER2-positivo em combinação com trastuzumabe: neoadjuvância (TCHP, FEC→THP), adjuvância (após neoadjuvância), doença metastática (1ª linha). Esquema TCHP: docetaxel 75 mg/m² + carboplatina AUC6 + trastuzumabe + pertuzumabe.",
    standardDose: "840 mg EV D1 (dose de ataque) seguido de 420 mg EV D1 a cada 3 semanas",
    doseUnit: "mg (dose fixa)",
    cardiotoxicityRisk: "moderado",
    cardiotoxicityProfile: "Cardiotoxicidade tipo II. Perfil similar ao trastuzumabe. Incidência de disfunção ventricular: ~1-4% em combinação com trastuzumabe. Sem aumento significativo de cardiotoxicidade vs trastuzumabe isolado nos estudos CLEOPATRA e APHINITY.",
    lvefMonitoring: true,
    qtProlongation: false,
    hypertensionRisk: false,
    myocarditisRisk: false,
    renalAdjustment: "Não requer ajuste de dose.",
    hepaticAdjustment: "Não requer ajuste de dose.",
    mainSideEffects: "Diarreia (mais frequente que trastuzumabe isolado), alopecia, náuseas, fadiga, neutropenia, reações infusionais.",
    cardioProtection: "Monitoramento de LVEF conforme protocolo de trastuzumabe. Critérios de suspensão idênticos ao trastuzumabe.",
    references: "SBOC 2026 - Mama Adjuvância (TCHP, APHINITY); ESC 2022.",
    sbocGuideline: "Mama Adjuvância 2026, Mama Neoadjuvância 2026",
    escGuideline: "ESC 2022 - Seção 5.2",
  },
  {
    id: 5,
    genericName: "Trastuzumabe entansina (T-DM1)",
    brandNames: "Kadcyla",
    drugClassId: 2,
    mechanismOfAction: "Conjugado anticorpo-fármaco (ADC): trastuzumabe ligado ao emtansina (DM1, inibidor de microtúbulos). Combina o mecanismo do trastuzumabe com liberação intracelular de DM1 após endocitose mediada por HER2. Duplo mecanismo de ação antitumoral.",
    indications: "Câncer de mama HER2-positivo com doença residual após neoadjuvância com trastuzumabe (KATHERINE trial). Câncer de mama HER2-positivo metastático após trastuzumabe + taxano (EMILIA trial).",
    standardDose: "3,6 mg/kg EV D1 a cada 3 semanas por 14 ciclos (adjuvância pós-neoadjuvância)",
    doseUnit: "mg/kg",
    cardiotoxicityRisk: "baixo",
    cardiotoxicityProfile: "Cardiotoxicidade tipo II. Incidência de disfunção ventricular: ~1-2%. Perfil cardiovascular favorável comparado a quimioterapia convencional.",
    lvefMonitoring: true,
    qtProlongation: false,
    hypertensionRisk: false,
    myocarditisRisk: false,
    renalAdjustment: "Não requer ajuste de dose.",
    hepaticAdjustment: "Cautela em disfunção hepática grave.",
    mainSideEffects: "Trombocitopenia (principal toxicidade limitante), elevação de transaminases, fadiga, náuseas, neuropatia periférica.",
    cardioProtection: "Monitoramento de LVEF conforme protocolo padrão anti-HER2.",
    references: "SBOC 2026 - Mama Adjuvância (KATHERINE); ESC 2022.",
    sbocGuideline: "Mama Adjuvância 2026",
    escGuideline: "ESC 2022 - Seção 5.2",
  },
  // === ICI ===
  {
    id: 6,
    genericName: "Pembrolizumabe",
    brandNames: "Keytruda",
    drugClassId: 3,
    mechanismOfAction: "Anticorpo monoclonal humanizado IgG4 anti-PD-1 (Programmed Death-1). Bloqueia a ligação de PD-L1 e PD-L2 ao receptor PD-1 nos linfócitos T, restaurando a atividade citotóxica antitumoral. Potencializa a resposta imune mediada por células T.",
    indications: "Câncer de mama triplo-negativo (neoadjuvância/adjuvância - KN522), melanoma (adjuvância e metastático), CPNPC (1ª e 2ª linha), câncer de colo uterino, câncer gástrico HER2-, câncer de bexiga, carcinoma de células de Merkel, TMB-high. Doses: 200 mg EV a cada 3 semanas ou 400 mg EV a cada 6 semanas.",
    standardDose: "200 mg EV D1 a cada 3 semanas | 400 mg EV D1 a cada 6 semanas",
    doseUnit: "mg (dose fixa)",
    cardiotoxicityRisk: "moderado",
    cardiotoxicityProfile: "Miocardite imunomediada: incidência ~0,5-1% em monoterapia. Pode ser fatal em 25-50% dos casos de miocardite grave. Outras manifestações cardiovasculares: pericardite, vasculite, bloqueio AV, arritmias. Diagnóstico: elevação de troponina + alterações no ECG + RNM cardíaca + biópsia endomiocárdica (padrão-ouro).",
    lvefMonitoring: false,
    qtProlongation: false,
    hypertensionRisk: false,
    myocarditisRisk: true,
    renalAdjustment: "Não requer ajuste de dose.",
    hepaticAdjustment: "Não requer ajuste de dose.",
    mainSideEffects: "Eventos adversos imunomediados: pneumonite, colite, hepatite, endocrinopatias (hipotiroidismo, hipofisíte, DM1), nefrite, dermatite, miocardite (rara mas grave), síndrome de Stevens-Johnson.",
    cardioProtection: "Monitoramento: troponina e ECG basais e a cada ciclo nos primeiros 3 meses. Suspender imediatamente se suspeita de miocardite. Tratamento: corticosteroides (prednisona 1-2 mg/kg/dia) para miocardite grau ≥2. Grau 3-4: metilprednisolona IV + imunossupressão adicional (micofenolato, infliximabe).",
    references: "SBOC 2026 - Mama Neoadjuvância (KN522), Melanoma, Rim; ESC 2022 - Seção 5.4.",
    sbocGuideline: "Mama Neoadjuvância 2026, Melanoma 2026, Rim 2026",
    escGuideline: "ESC 2022 - Seção 5.4 Immune Checkpoint Inhibitors",
  },
  {
    id: 7,
    genericName: "Nivolumabe",
    brandNames: "Opdivo",
    drugClassId: 3,
    mechanismOfAction: "Anticorpo monoclonal humano IgG4 anti-PD-1. Mecanismo idêntico ao pembrolizumabe. Bloqueia a interação PD-1/PD-L1 e PD-1/PD-L2.",
    indications: "Melanoma (adjuvância e metastático), CPNPC, câncer de rim (combinação com ipilimumabe ou cabozantinibe), câncer gástrico, câncer de bexiga, linfoma de Hodgkin. Doses: 3 mg/kg EV a cada 2 semanas | 240 mg EV a cada 2 semanas | 480 mg EV a cada 4 semanas.",
    standardDose: "240 mg EV D1 a cada 2 semanas | 480 mg EV D1 a cada 4 semanas | 3 mg/kg EV D1 a cada 2 semanas",
    doseUnit: "mg (dose fixa) ou mg/kg",
    cardiotoxicityRisk: "moderado",
    cardiotoxicityProfile: "Miocardite imunomediada: incidência ~0,5-1% em monoterapia; ~2-3% em combinação com ipilimumabe. Risco aumentado com combinação ipilimumabe + nivolumabe (maior ativação imune). Manifestações: bloqueio AV, arritmias ventriculares, IC aguda.",
    lvefMonitoring: false,
    qtProlongation: false,
    hypertensionRisk: false,
    myocarditisRisk: true,
    renalAdjustment: "Não requer ajuste de dose.",
    hepaticAdjustment: "Não requer ajuste de dose.",
    mainSideEffects: "Eventos adversos imunomediados similares ao pembrolizumabe. Maior incidência de colite em combinação com ipilimumabe.",
    cardioProtection: "Monitoramento cardiovascular idêntico ao pembrolizumabe. Atenção especial na combinação com ipilimumabe (maior risco de miocardite).",
    references: "SBOC 2026 - Melanoma, Rim; ESC 2022 - Seção 5.4.",
    sbocGuideline: "Melanoma 2026, Rim 2026",
    escGuideline: "ESC 2022 - Seção 5.4",
  },
  {
    id: 8,
    genericName: "Ipilimumabe",
    brandNames: "Yervoy",
    drugClassId: 3,
    mechanismOfAction: "Anticorpo monoclonal humano IgG1 anti-CTLA-4 (Cytotoxic T-Lymphocyte-Associated protein 4). Bloqueia o sinal inibitório CTLA-4, potencializando a ativação e proliferação de células T. Mecanismo diferente dos anti-PD-1.",
    indications: "Melanoma metastático (monoterapia ou combinação com nivolumabe), CCR (combinação com nivolumabe), CPNPC (combinação com nivolumabe). Doses: 3 mg/kg EV a cada 3 semanas (melanoma metastático) | 1 mg/kg EV a cada 3 semanas (combinação com nivolumabe) | 80 mg EV D1 a cada 3 semanas (melanoma adjuvância).",
    standardDose: "3 mg/kg EV D1 a cada 3 semanas por 4 ciclos (monoterapia) | 1 mg/kg EV D1 a cada 3 semanas por 4 ciclos (combinação com nivolumabe) | 80 mg EV D1 a cada 3 semanas por 2 ciclos (neoadjuvância melanoma)",
    doseUnit: "mg/kg ou mg (dose fixa)",
    cardiotoxicityRisk: "alto",
    cardiotoxicityProfile: "Maior risco de miocardite entre os ICIs, especialmente em combinação com nivolumabe. Incidência de miocardite: ~1-3% em combinação. Maior ativação imune → maior risco de eventos cardiovasculares graves. Mortalidade por miocardite: ~25-50%.",
    lvefMonitoring: false,
    qtProlongation: false,
    hypertensionRisk: false,
    myocarditisRisk: true,
    renalAdjustment: "Não requer ajuste de dose.",
    hepaticAdjustment: "Não requer ajuste de dose.",
    mainSideEffects: "Colite (mais frequente que anti-PD-1), hepatite, dermatite, endocrinopatias, miocardite (rara mas grave), hipofisíte.",
    cardioProtection: "Monitoramento cardiovascular intensivo, especialmente na combinação com nivolumabe. Troponina e ECG basais e a cada ciclo.",
    references: "SBOC 2026 - Melanoma, Rim; ESC 2022 - Seção 5.4.",
    sbocGuideline: "Melanoma 2026, Rim 2026",
    escGuideline: "ESC 2022 - Seção 5.4",
  },
  // === TKIs ===
  {
    id: 9,
    genericName: "Sunitinibe",
    brandNames: "Sutent",
    drugClassId: 4,
    mechanismOfAction: "Inibidor multialvo de tirosina quinase: VEGFR-1, VEGFR-2, VEGFR-3, PDGFR-α, PDGFR-β, c-Kit, FLT3, RET, CSF-1R. Inibe angiogênese tumoral e proliferação celular direta.",
    indications: "Carcinoma de células renais (1ª linha - baixo/intermediário risco IMDC), GIST resistente a imatinibe, tumores neuroendócrinos pancreáticos. Esquema 4/2: 50 mg VO 1x/dia por 4 semanas, 2 semanas de intervalo. Esquema 2/1: 37,5-50 mg VO 1x/dia por 2 semanas, 1 semana de intervalo.",
    standardDose: "50 mg VO 1x/dia (esquema 4 semanas on/2 semanas off) | 37,5 mg VO 1x/dia continuamente (esquema alternativo)",
    doseUnit: "mg/dia",
    cardiotoxicityRisk: "alto",
    cardiotoxicityProfile: "Hipertensão arterial: 17-34% (grau 3-4: 8-15%). Disfunção ventricular esquerda: 2-8%. Prolongamento QTc: 0,5-1%. Insuficiência cardíaca: 1-3%. Mecanismo: inibição VEGFR → redução óxido nítrico e prostaciclina → vasoconstrição e hipertensão. Inibição off-target de quinases cardíacas (AMPK) → disfunção mitocondrial do cardiomiócito.",
    lvefMonitoring: true,
    qtProlongation: true,
    hypertensionRisk: true,
    myocarditisRisk: false,
    renalAdjustment: "Não requer ajuste de dose para ClCr >30 mL/min. Cautela em insuficiência renal grave.",
    hepaticAdjustment: "Não requer ajuste para Child-Pugh A/B. Cautela em Child-Pugh C.",
    mainSideEffects: "Hipertensão, fadiga, diarreia, náuseas, mucosite, síndrome mão-pé, hipotireoidismo (30-40%), mielossupressão, coloração amarelada da pele.",
    cardioProtection: "Monitoramento de PA antes e durante tratamento. Ecocardiograma basal e a cada 3-6 meses. Tratar hipertensão agressivamente (meta <140/90 mmHg). Suspender se LVEF <40% ou IC sintomática.",
    references: "SBOC 2026 - Rim; ESC 2022 - Seção 5.3 VEGF/VEGFR inhibitors.",
    sbocGuideline: "Rim 2026",
    escGuideline: "ESC 2022 - Seção 5.3",
  },
  {
    id: 10,
    genericName: "Pazopanibe",
    brandNames: "Votrient",
    drugClassId: 4,
    mechanismOfAction: "Inibidor multialvo de tirosina quinase: VEGFR-1, VEGFR-2, VEGFR-3, PDGFR-α, PDGFR-β, c-Kit. Mecanismo similar ao sunitinibe.",
    indications: "Carcinoma de células renais (1ª linha - baixo risco IMDC), sarcomas de partes moles (2ª linha). Dose: 800 mg VO 1x/dia continuamente.",
    standardDose: "800 mg VO 1x/dia continuamente (em jejum ou 1h após refeição)",
    doseUnit: "mg/dia",
    cardiotoxicityRisk: "alto",
    cardiotoxicityProfile: "Hipertensão arterial: 40-46% (grau 3-4: 4-7%). Disfunção ventricular esquerda: 2-5%. Prolongamento QTc: 2-3%. Hepatotoxicidade (importante). Tromboembolismo venoso: ~3%.",
    lvefMonitoring: true,
    qtProlongation: true,
    hypertensionRisk: true,
    myocarditisRisk: false,
    renalAdjustment: "Não requer ajuste de dose.",
    hepaticAdjustment: "Reduzir para 200 mg/dia em disfunção hepática moderada. Contraindicado em disfunção hepática grave.",
    mainSideEffects: "Hipertensão, hepatotoxicidade (monitorar TGO/TGP), diarreia, náuseas, fadiga, hipopigmentação capilar, síndrome mão-pé.",
    cardioProtection: "Monitoramento de PA e função hepática. Ecocardiograma basal e periódico. ECG para monitoramento de QTc.",
    references: "SBOC 2026 - Rim; ESC 2022 - Seção 5.3.",
    sbocGuideline: "Rim 2026",
    escGuideline: "ESC 2022 - Seção 5.3",
  },
  {
    id: 11,
    genericName: "Axitinibe",
    brandNames: "Inlyta",
    drugClassId: 4,
    mechanismOfAction: "Inibidor seletivo de VEGFR-1, VEGFR-2 e VEGFR-3 de 2ª geração. Maior seletividade para VEGFR vs sunitinibe/pazopanibe.",
    indications: "Carcinoma de células renais (2ª linha após falha de sunitinibe/citocinas, ou 1ª linha em combinação com pembrolizumabe ou avelumabe). Combinação axitinibe + pembrolizumabe: 5 mg VO 12/12h + 200 mg EV a cada 3 semanas.",
    standardDose: "5 mg VO 12/12h continuamente (ajustar para 7 mg e 10 mg se tolerado, ou reduzir para 3 mg e 2 mg se necessário)",
    doseUnit: "mg 12/12h",
    cardiotoxicityRisk: "moderado",
    cardiotoxicityProfile: "Hipertensão arterial: 40-45% (grau 3-4: 16%). Disfunção ventricular: <1%. Tromboembolismo arterial: ~2%. Menor cardiotoxicidade que sunitinibe/pazopanibe.",
    lvefMonitoring: false,
    qtProlongation: false,
    hypertensionRisk: true,
    myocarditisRisk: false,
    renalAdjustment: "Não requer ajuste de dose.",
    hepaticAdjustment: "Reduzir dose inicial para 2 mg 12/12h em disfunção hepática moderada.",
    mainSideEffects: "Hipertensão, diarreia, fadiga, náuseas, síndrome mão-pé, disfonia, hipotireoidismo.",
    cardioProtection: "Monitoramento de PA antes e durante tratamento. Meta de PA <140/90 mmHg.",
    references: "SBOC 2026 - Rim; ESC 2022 - Seção 5.3.",
    sbocGuideline: "Rim 2026",
    escGuideline: "ESC 2022 - Seção 5.3",
  },
  {
    id: 12,
    genericName: "Cabozantinibe",
    brandNames: "Cabometyx, Cometriq",
    drugClassId: 4,
    mechanismOfAction: "Inibidor multialvo: VEGFR-1/2/3, MET, AXL, RET, c-Kit, FLT3. A inibição de MET e AXL diferencia-o dos outros TKIs anti-VEGF.",
    indications: "CCR (1ª linha em combinação com nivolumabe, ou 2ª linha), carcinoma hepatocelular (2ª linha), carcinoma de tireoide medular. Combinação cabozantinibe + nivolumabe: 40 mg VO 1x/dia + 240 mg EV a cada 2 semanas.",
    standardDose: "60 mg VO 1x/dia (CCR monoterapia) | 40 mg VO 1x/dia (combinação com nivolumabe) | 140 mg VO 1x/dia (tireoide medular)",
    doseUnit: "mg/dia",
    cardiotoxicityRisk: "alto",
    cardiotoxicityProfile: "Hipertensão arterial: 36-37% (grau 3-4: 15-28%). Tromboembolismo venoso: ~7%. Tromboembolismo arterial: ~2%. Perfuração GI e fístulas (monitorar).",
    lvefMonitoring: false,
    qtProlongation: false,
    hypertensionRisk: true,
    myocarditisRisk: false,
    renalAdjustment: "Não requer ajuste de dose.",
    hepaticAdjustment: "Reduzir para 40 mg/dia em disfunção hepática moderada. Contraindicado em disfunção grave.",
    mainSideEffects: "Hipertensão, diarreia, síndrome mão-pé, fadiga, náuseas, mucosíte, tromboembolismo, perfuração GI.",
    cardioProtection: "Monitoramento intensivo de PA. Suspender 28 dias antes de cirurgia de grande porte.",
    references: "SBOC 2026 - Rim; ESC 2022 - Seção 5.3.",
    sbocGuideline: "Rim 2026",
    escGuideline: "ESC 2022 - Seção 5.3",
  },
  // === ALQUILANTES ===
  {
    id: 13,
    genericName: "Ciclofosfamida",
    brandNames: "Cytoxan, Endoxan",
    drugClassId: 5,
    mechanismOfAction: "Pró-droga ativada pelo citocromo P450 hepático em metabólitos alquilantes (mostarda fosforamida e acroleína). Forma ligações cruzadas no DNA, impedindo a replicação. Ação em todas as fases do ciclo celular.",
    indications: "Câncer de mama (AC, CMF, TC, TCH, TCHP), linfomas (CHOP, R-CHOP), leucemias, mieloma múltiplo (condicionamento para transplante), sarcomas. Doses: 600 mg/m² EV D1 a cada 3 semanas (AC padrão) | 600 mg/m² EV D1 a cada 2 semanas (ACdd) | 100 mg/m² VO D1-14 (CMF clássico).",
    standardDose: "600 mg/m² EV D1 a cada 3 semanas (esquema AC) | 100 mg/m² VO D1-D14 a cada 4 semanas (CMF clássico)",
    doseUnit: "mg/m²",
    cardiotoxicityRisk: "baixo",
    cardiotoxicityProfile: "Cardiotoxicidade em altas doses (>1,5 g/m²/dia): miocardite hemorrágica, pericardite, IC aguda (incidência: 7-28% em doses de condicionamento). Em doses padrão de quimioterapia convencional: risco cardiovascular baixo. Potencializa cardiotoxicidade das antracíclinas.",
    lvefMonitoring: false,
    qtProlongation: false,
    hypertensionRisk: false,
    myocarditisRisk: false,
    renalAdjustment: "Reduzir dose em insuficiência renal grave (ClCr <10 mL/min): reduzir 50%.",
    hepaticAdjustment: "Cautela em disfunção hepática grave (metabolismo hepático).",
    mainSideEffects: "Mielossupressão, cistite hemorrágica (prevenção com hidratação e MESNA), alopecia, náuseas/vômitos, infertilidade, leucemia secundária, SIADH.",
    cardioProtection: "MESNA para prevenção de cistite hemorrágica. Hidratação adequada. Monitoramento cardíaco em altas doses.",
    references: "SBOC 2026 - Mama Adjuvância; ESC 2022.",
    sbocGuideline: "Mama Adjuvância 2026",
    escGuideline: "ESC 2022 - Seção 5.1",
  },
  // === ANTIMETABÓLITOS ===
  {
    id: 14,
    genericName: "Capecitabina",
    brandNames: "Xeloda",
    drugClassId: 6,
    mechanismOfAction: "Pró-droga oral do 5-fluorouracil. Convertida em 5-FU pela timidina fosforilase (maior expressão em células tumorais). Inibe a timidilato sintase, bloqueando a síntese de DNA. Incorporação no RNA causando disfunção da síntese proteica.",
    indications: "Câncer de mama (adjuvância pós-neoadjuvância sem RPC - CREATE-X, metastático), câncer colorretal (adjuvância, metastático), câncer gástrico. Doses SBOC: 2.000-2.500 mg/m² VO D1-14 a cada 3 semanas | 1.300 mg/m² VO D1-28 a cada 4 semanas (metronômica).",
    standardDose: "2.000-2.500 mg/m² VO dividido em 2 doses diárias D1-D14 a cada 3 semanas | 1.300 mg/m² VO D1-D28 a cada 4 semanas (metronômica)",
    doseUnit: "mg/m²/dia",
    cardiotoxicityRisk: "moderado",
    cardiotoxicityProfile: "Cardiotoxicidade similar ao 5-FU (pró-droga). Vasospasmo coronariano: 1-8% (principal mecanismo). Angina, IAM, arritmias. Risco aumentado em pacientes com DAC prévia. Monitorar com ECG e troponina se sintomas cardíacos.",
    lvefMonitoring: false,
    qtProlongation: false,
    hypertensionRisk: false,
    myocarditisRisk: false,
    renalAdjustment: "Reduzir 25% da dose se ClCr 30-50 mL/min. Contraindicado se ClCr <30 mL/min.",
    hepaticAdjustment: "Cautela em disfunção hepática moderada. Contraindicado em disfunção grave.",
    mainSideEffects: "Síndrome mão-pé (principal), diarreia, náuseas, mucosite, mielossupressão (menor que 5-FU IV), hiperbilirrubinemia.",
    cardioProtection: "Suspender imediatamente se dor torácica ou alterações no ECG. Contraindicado em DAC instável. Nitratos podem ser usados para vasospasmo.",
    references: "SBOC 2026 - Mama Adjuvância (CREATE-X); ESC 2022.",
    sbocGuideline: "Mama Adjuvância 2026, Mama Metastática 2026",
    escGuideline: "ESC 2022 - Seção 5.1",
  },
  // === CDK4/6 ===
  {
    id: 15,
    genericName: "Ribociclibe",
    brandNames: "Kisqali",
    drugClassId: 7,
    mechanismOfAction: "Inibidor seletivo de CDK4 e CDK6 (quinases dependentes de ciclina). Bloqueia a fosforilação de Rb (retinoblastoma), impedindo a progressão G1→S do ciclo celular. Restaura o controle do ciclo celular em tumores com ativação de CDK4/6.",
    indications: "Câncer de mama RH+/HER2- (adjuvância de alto risco - NATALEE, metastático 1ª linha - MONALEESA). Adjuvância: 400 mg VO D1-21 a cada 4 semanas por 3 anos + inibidor de aromatase ± supressão ovariana.",
    standardDose: "400 mg VO 1x/dia D1-D21 a cada 4 semanas (3 semanas on/1 semana off)",
    doseUnit: "mg/dia",
    cardiotoxicityRisk: "baixo",
    cardiotoxicityProfile: "Prolongamento do intervalo QTc: 3-6% (grau 3-4: 1-3%). Monitoramento obrigatório de ECG: basal, D14 do ciclo 1, início do ciclo 2, e conforme indicação clínica. Suspender se QTcF >500 ms ou aumento >60 ms do basal.",
    lvefMonitoring: false,
    qtProlongation: true,
    hypertensionRisk: false,
    myocarditisRisk: false,
    renalAdjustment: "Não requer ajuste de dose.",
    hepaticAdjustment: "Reduzir para 200 mg/dia em disfunção hepática moderada-grave.",
    mainSideEffects: "Neutropenia (principal - 60-75%), leucopenia, fadiga, náuseas, diarreia, alopecia, prolongamento QTc.",
    cardioProtection: "ECG obrigatório: basal (QTcF deve ser <450 ms para iniciar), D14 do C1, início do C2. Evitar combinação com outros fármacos que prolongam QT.",
    references: "SBOC 2026 - Mama Adjuvância (NATALEE); ESC 2022.",
    sbocGuideline: "Mama Adjuvância 2026",
    escGuideline: "ESC 2022 - Seção 5.5",
  },
  {
    id: 16,
    genericName: "Abemaciclibe",
    brandNames: "Verzenio",
    drugClassId: 7,
    mechanismOfAction: "Inibidor seletivo de CDK4 e CDK6. Maior seletividade para CDK4 vs CDK6 comparado ao palbociclibe e ribociclibe. Penetração no SNC.",
    indications: "Câncer de mama RH+/HER2- (adjuvância de alto risco - monarchE, metastático). Adjuvância: 150 mg VO 12/12h por 2 anos + terapia endócrina (IA ou tamoxifeno ± supressão ovariana).",
    standardDose: "150 mg VO 12/12h continuamente (adjuvância) | 150 mg VO 12/12h continuamente (metastático)",
    doseUnit: "mg 12/12h",
    cardiotoxicityRisk: "baixo",
    cardiotoxicityProfile: "Risco cardiovascular muito baixo. Sem prolongamento significativo de QTc. Tromboembolismo venoso: ~2-5% (monitorar).",
    lvefMonitoring: false,
    qtProlongation: false,
    hypertensionRisk: false,
    myocarditisRisk: false,
    renalAdjustment: "Não requer ajuste de dose.",
    hepaticAdjustment: "Reduzir para 100 mg 12/12h em disfunção hepática grave.",
    mainSideEffects: "Diarreia (principal - 80-90%), neutropenia, fadiga, náuseas, infecções, tromboembolismo venoso.",
    cardioProtection: "Profilaxia de TEV em pacientes de alto risco. Monitoramento de hemograma.",
    references: "SBOC 2026 - Mama Adjuvância (monarchE); ESC 2022.",
    sbocGuideline: "Mama Adjuvância 2026",
    escGuideline: "ESC 2022 - Seção 5.5",
  },
  // === BRAF/MEK ===
  {
    id: 17,
    genericName: "Dabrafenibe + Trametinibe",
    brandNames: "Tafinlar + Mekinist",
    drugClassId: 9,
    mechanismOfAction: "Dabrafenibe: inibidor seletivo de BRAF V600E/K. Trametinibe: inibidor de MEK1/MEK2 (downstream de BRAF). Combinação bloqueia a via MAPK/ERK de forma sinérgica, retardando resistência.",
    indications: "Melanoma BRAF V600E/K mutado (adjuvância estádio III, metastático), CPNPC BRAF V600E mutado, carcinoma papilífero de tireoide BRAF mutado. Doses: dabrafenibe 150 mg VO 12/12h + trametinibe 2 mg VO 1x/dia continuamente.",
    standardDose: "Dabrafenibe 150 mg VO 12/12h + Trametinibe 2 mg VO 1x/dia continuamente",
    doseUnit: "mg (dose fixa)",
    cardiotoxicityRisk: "baixo",
    cardiotoxicityProfile: "Disfunção ventricular esquerda: 7-11% (grau 3: 2-4%). Hipertensão: 15-26%. Prolongamento QTc: raro. Pirexia (evento adverso mais frequente): pode causar taquicardia e desidratação.",
    lvefMonitoring: true,
    qtProlongation: false,
    hypertensionRisk: true,
    myocarditisRisk: false,
    renalAdjustment: "Não requer ajuste de dose.",
    hepaticAdjustment: "Cautela em disfunção hepática moderada-grave.",
    mainSideEffects: "Pirexia (principal - 50-60%), fadiga, náuseas, diarreia, hiperqueratose, alopecia, fotossensibilidade, hipertensão, disfunção ventricular.",
    cardioProtection: "Ecocardiograma basal e a cada 3 meses. Monitoramento de PA. Suspender se LVEF <40% ou queda sintomática.",
    references: "SBOC 2026 - Melanoma; ESC 2022.",
    sbocGuideline: "Melanoma 2026",
    escGuideline: "ESC 2022 - Seção 5.3",
  },
  // === INIBIDORES HORMONAIS ===
  {
    id: 18,
    genericName: "Enzalutamida",
    brandNames: "Xtandi",
    drugClassId: 4,
    mechanismOfAction: "Inibidor de receptor de andrógeno de nova geração. Bloqueia a ligação de andrógenos ao receptor, a translocação nuclear do receptor e a ligação ao DNA. Sem atividade agonista parcial.",
    indications: "Câncer de próstata resistente à castração (metastático e não-metastático), câncer de próstata sensível à castração metastático. Dose: 160 mg VO 1x/dia continuamente.",
    standardDose: "160 mg VO 1x/dia continuamente",
    doseUnit: "mg/dia",
    cardiotoxicityRisk: "baixo",
    cardiotoxicityProfile: "Risco cardiovascular baixo direto. Hipertensão: 6-14%. Tromboembolismo venoso: ~1%. Privação androgênica (TDA) associada aumenta risco cardiovascular a longo prazo: síndrome metabólica, DM, HAS, dislipidemia.",
    lvefMonitoring: false,
    qtProlongation: false,
    hypertensionRisk: true,
    myocarditisRisk: false,
    renalAdjustment: "Não requer ajuste de dose.",
    hepaticAdjustment: "Não requer ajuste de dose.",
    mainSideEffects: "Fadiga, hipertensão, fogachos, diarreia, náuseas, convulsões (raro), queda.",
    cardioProtection: "Monitoramento cardiovascular durante TDA. Controle de fatores de risco CV (HAS, DM, dislipidemia).",
    references: "SBOC 2026 - Próstata Avançada; ESC 2022.",
    sbocGuideline: "Próstata Avançada 2026",
    escGuideline: "ESC 2022 - Seção 5.6",
  },
  {
    id: 19,
    genericName: "Abiraterona + Prednisona",
    brandNames: "Zytiga, Yonsa",
    drugClassId: 4,
    mechanismOfAction: "Inibidor irreversível de CYP17A1 (17α-hidroxilase/C17,20-liase), bloqueando a síntese de andrógenos adrenais, testiculares e tumorais. Requer prednisona 5 mg/dia para prevenir mineralocorticoidismo.",
    indications: "Câncer de próstata resistente à castração (metastático e não-metastático), câncer de próstata sensível à castração metastático (combinação com TDA ± docetaxel). Dose: 1.000 mg VO 1x/dia em jejum + prednisona 5 mg VO 1x/dia.",
    standardDose: "Abiraterona 1.000 mg VO 1x/dia (em jejum, 1h antes ou 2h após refeição) + Prednisona 5 mg VO 1x/dia continuamente",
    doseUnit: "mg/dia",
    cardiotoxicityRisk: "baixo",
    cardiotoxicityProfile: "Hipertensão: 22-37% (relacionada ao excesso de mineralocorticoides). Hipocalemia: 17-28%. Edema: 28-31%. Retenção hídrica. Risco cardiovascular aumentado pela TDA a longo prazo.",
    lvefMonitoring: false,
    qtProlongation: false,
    hypertensionRisk: true,
    myocarditisRisk: false,
    renalAdjustment: "Não requer ajuste de dose.",
    hepaticAdjustment: "Contraindicado em disfunção hepática grave (Child-Pugh C).",
    mainSideEffects: "Hipertensão, hipocalemia, edema, fadiga, hepatotoxicidade (monitorar TGO/TGP), fogachos.",
    cardioProtection: "Monitoramento de PA, potássio e função hepática mensalmente nos primeiros 3 meses. Tratar hipertensão e hipocalemia.",
    references: "SBOC 2026 - Próstata Avançada; ESC 2022.",
    sbocGuideline: "Próstata Avançada 2026",
    escGuideline: "ESC 2022 - Seção 5.6",
  },
  // === INIBIDORES DE PARP ===
  {
    id: 20,
    genericName: "Olaparibe",
    brandNames: "Lynparza",
    drugClassId: 8,
    mechanismOfAction: "Inibidor de PARP-1 e PARP-2 (poli-ADP-ribose polimerase). Bloqueia o reparo de danos ao DNA por excisão de bases. Em células com deficiência de BRCA1/2 (recombinação homóloga), causa morte celular sintética letal.",
    indications: "Câncer de mama BRCA1/2 mutado (adjuvância alto risco - OlympiA, metastático - OlympiAD), câncer de ovário BRCA mutado (manutenção), câncer de próstata BRCA mutado. Dose adjuvância mama: 300 mg VO 12/12h por 1 ano.",
    standardDose: "300 mg VO 12/12h continuamente (mama adjuvância e metastático) | 400 mg VO 12/12h (ovário, próstata)",
    doseUnit: "mg 12/12h",
    cardiotoxicityRisk: "baixo",
    cardiotoxicityProfile: "Risco cardiovascular muito baixo. Anemia (pode agravar IC preexistente). Tromboembolismo venoso: ~7% (monitorar). Sem cardiotoxicidade direta significativa.",
    lvefMonitoring: false,
    qtProlongation: false,
    hypertensionRisk: false,
    myocarditisRisk: false,
    renalAdjustment: "Reduzir para 200 mg 12/12h se ClCr 31-50 mL/min. Contraindicado se ClCr <30 mL/min.",
    hepaticAdjustment: "Não requer ajuste para disfunção leve-moderada. Cautela em disfunção grave.",
    mainSideEffects: "Anemia, náuseas, fadiga, vômitos, diarreia, leucopenia, trombocitopenia, síndrome mielodisplásica/leucemia mieloide aguda (raro).",
    cardioProtection: "Monitoramento de hemograma. Transfusão se anemia sintomática.",
    references: "SBOC 2026 - Mama Adjuvância (OlympiA); ESC 2022.",
    sbocGuideline: "Mama Adjuvância 2026",
    escGuideline: "ESC 2022 - Seção 5.5",
  },
];

// ─── INTERAÇÕES MEDICAMENTOSAS ────────────────────────────────────────────────

export const DRUG_INTERACTIONS: DrugInteractionData[] = [
  {
    id: 1,
    drug1Id: 1, // Doxorrubicina
    drug2Name: "Trastuzumabe",
    severity: "grave",
    mechanism: "Potencialização da cardiotoxicidade por mecanismos complementares: doxorrubicina causa dano oxidativo ao cardiomiócito (tipo I), enquanto trastuzumabe bloqueia a sinalização de reparo HER2/ErbB4 (tipo II). Uso concomitante aumenta drasticamente o risco de IC.",
    clinicalEffect: "Incidência de IC: 27% com uso concomitante vs 7-8% com uso sequencial. Disfunção ventricular grave e potencialmente irreversível.",
    management: "USO CONCOMITANTE CONTRAINDICADO. Intervalo mínimo de 3 semanas após última dose de antracíclina antes de iniciar trastuzumabe. Monitoramento intensivo de LVEF.",
    qtRisk: false,
  },
  {
    id: 2,
    drug1Id: 15, // Ribociclibe
    drug2Name: "Inibidores de CYP3A4 fortes (cetoconazol, claritromicina, ritonavir)",
    severity: "grave",
    mechanism: "Inibição do metabolismo do ribociclibe via CYP3A4, aumentando os níveis plasmáticos e o risco de prolongamento do QTc.",
    clinicalEffect: "Aumento significativo da exposição ao ribociclibe (AUC até 3x). Risco aumentado de prolongamento do QTc e arritmias ventriculares (Torsades de Pointes).",
    management: "Evitar combinação. Se necessário, reduzir dose de ribociclibe e monitorar ECG frequentemente.",
    qtRisk: true,
  },
  {
    id: 3,
    drug1Id: 6, // Pembrolizumabe
    drug2Name: "Corticosteroides sistêmicos (uso profilático)",
    severity: "moderada",
    mechanism: "Corticosteroides podem atenuar a resposta imune antitumoral mediada pelo pembrolizumabe.",
    clinicalEffect: "Potencial redução da eficácia antitumoral. Porém, corticosteroides são necessários para o manejo de toxicidades imunomediadas.",
    management: "Evitar uso profilático de corticosteroides. Usar para manejo de toxicidades imunomediadas conforme indicado.",
    qtRisk: false,
  },
  {
    id: 4,
    drug1Id: 9, // Sunitinibe
    drug2Name: "Inibidores de CYP3A4 fortes",
    severity: "grave",
    mechanism: "Inibição do metabolismo do sunitinibe via CYP3A4, aumentando os níveis plasmáticos.",
    clinicalEffect: "Aumento da toxicidade do sunitinibe: maior risco de hipertensão grave, cardiotoxicidade e outros efeitos adversos.",
    management: "Evitar combinação. Se necessário, reduzir dose de sunitinibe para 37,5 mg/dia.",
    qtRisk: false,
  },
  {
    id: 5,
    drug1Id: 14, // Capecitabina
    drug2Name: "Varfarina",
    severity: "grave",
    mechanism: "Capecitabina inibe o metabolismo da varfarina via CYP2C9, aumentando o efeito anticoagulante.",
    clinicalEffect: "Aumento do INR com risco de sangramento grave.",
    management: "Monitoramento frequente do INR (semanalmente nas primeiras semanas). Ajustar dose de varfarina conforme INR.",
    qtRisk: false,
  },
  {
    id: 6,
    drug1Id: 6, // Pembrolizumabe
    drug2Name: "Ipilimumabe (combinação)",
    severity: "grave",
    mechanism: "Duplo bloqueio de checkpoint (PD-1 + CTLA-4) causa ativação imune sinérgica com maior risco de eventos adversos imunomediados graves.",
    clinicalEffect: "Incidência de miocardite: ~2-3% (vs ~0,5-1% em monoterapia). Maior risco de colite, hepatite e outras toxicidades imunomediadas graves.",
    management: "Monitoramento cardiovascular intensivo. Troponina e ECG basais e a cada ciclo. Suspender imediatamente se suspeita de miocardite.",
    qtRisk: false,
  },
];

// ─── CRONOGRAMAS DE MONITORAMENTO ─────────────────────────────────────────────

export const MONITORING_SCHEDULES: MonitoringScheduleData[] = [
  // Antracíclinas
  { medicationId: 1, timepoint: "Basal (antes do tratamento)", echocardiogram: true, ecg: true, troponin: true, bnp: true, bloodPressure: true, cbc: true, renalFunction: true, hepaticFunction: true, notes: "LVEF deve ser ≥50% para iniciar. Avaliar fatores de risco cardiovascular." },
  { medicationId: 1, timepoint: "Após 100 mg/m² cumulativo", echocardiogram: true, ecg: false, troponin: true, bnp: false, bloodPressure: true, cbc: true, renalFunction: false, hepaticFunction: false, notes: "Monitoramento de dose cumulativa." },
  { medicationId: 1, timepoint: "Após 200 mg/m² cumulativo", echocardiogram: true, ecg: false, troponin: true, bnp: true, bloodPressure: true, cbc: true, renalFunction: false, hepaticFunction: false, notes: "Atenção para queda de LVEF." },
  { medicationId: 1, timepoint: "Após 300 mg/m² cumulativo", echocardiogram: true, ecg: true, troponin: true, bnp: true, bloodPressure: true, cbc: true, renalFunction: true, hepaticFunction: true, notes: "Considerar dexrazoxano se LVEF limítrofe." },
  { medicationId: 1, timepoint: "6 meses após término", echocardiogram: true, ecg: false, troponin: true, bnp: true, bloodPressure: true, cbc: false, renalFunction: false, hepaticFunction: false, notes: "Seguimento pós-tratamento." },
  { medicationId: 1, timepoint: "12 meses após término", echocardiogram: true, ecg: false, troponin: false, bnp: false, bloodPressure: true, cbc: false, renalFunction: false, hepaticFunction: false, notes: "Seguimento anual." },
  // Trastuzumabe
  { medicationId: 3, timepoint: "Basal (antes do tratamento)", echocardiogram: true, ecg: false, troponin: false, bnp: false, bloodPressure: true, cbc: true, renalFunction: false, hepaticFunction: false, notes: "LVEF deve ser ≥50% para iniciar." },
  { medicationId: 3, timepoint: "A cada 3 meses durante tratamento", echocardiogram: true, ecg: false, troponin: false, bnp: false, bloodPressure: true, cbc: false, renalFunction: false, hepaticFunction: false, notes: "Suspender se LVEF cair ≥10pp e ficar <50%." },
  { medicationId: 3, timepoint: "6 meses após término", echocardiogram: true, ecg: false, troponin: false, bnp: false, bloodPressure: true, cbc: false, renalFunction: false, hepaticFunction: false, notes: "Seguimento pós-tratamento." },
  // ICI (Pembrolizumabe/Nivolumabe)
  { medicationId: 6, timepoint: "Basal (antes do tratamento)", echocardiogram: false, ecg: true, troponin: true, bnp: false, bloodPressure: true, cbc: true, renalFunction: true, hepaticFunction: true, notes: "Avaliar função tireoidiana (TSH, T4L) e glicemia." },
  { medicationId: 6, timepoint: "A cada ciclo (primeiros 3 meses)", echocardiogram: false, ecg: true, troponin: true, bnp: false, bloodPressure: true, cbc: true, renalFunction: true, hepaticFunction: true, notes: "Monitoramento intensivo inicial para miocardite." },
  { medicationId: 6, timepoint: "A cada 2-3 ciclos (após 3 meses)", echocardiogram: false, ecg: false, troponin: true, bnp: false, bloodPressure: true, cbc: true, renalFunction: true, hepaticFunction: true, notes: "Monitoramento de rotina." },
  // TKIs (Sunitinibe)
  { medicationId: 9, timepoint: "Basal (antes do tratamento)", echocardiogram: true, ecg: true, troponin: false, bnp: false, bloodPressure: true, cbc: true, renalFunction: true, hepaticFunction: true, notes: "Avaliar função tireoidiana (TSH)." },
  { medicationId: 9, timepoint: "Semanal (primeiros 2 ciclos)", echocardiogram: false, ecg: false, troponin: false, bnp: false, bloodPressure: true, cbc: false, renalFunction: false, hepaticFunction: false, notes: "Monitoramento de PA - meta <140/90 mmHg." },
  { medicationId: 9, timepoint: "A cada ciclo", echocardiogram: false, ecg: false, troponin: false, bnp: false, bloodPressure: true, cbc: true, renalFunction: true, hepaticFunction: true, notes: "Monitorar TSH a cada 2-3 ciclos." },
  { medicationId: 9, timepoint: "A cada 3-6 meses", echocardiogram: true, ecg: true, troponin: false, bnp: false, bloodPressure: true, cbc: false, renalFunction: false, hepaticFunction: false, notes: "Monitoramento de LVEF e QTc." },
  // Ribociclibe
  { medicationId: 15, timepoint: "Basal (antes do tratamento)", echocardiogram: false, ecg: true, troponin: false, bnp: false, bloodPressure: true, cbc: true, renalFunction: false, hepaticFunction: true, notes: "QTcF deve ser <450 ms para iniciar. Corrigir hipocalemia/hipomagnesemia." },
  { medicationId: 15, timepoint: "D14 do Ciclo 1", echocardiogram: false, ecg: true, troponin: false, bnp: false, bloodPressure: false, cbc: true, renalFunction: false, hepaticFunction: false, notes: "Monitoramento de QTcF. Suspender se QTcF >500 ms." },
  { medicationId: 15, timepoint: "Início do Ciclo 2", echocardiogram: false, ecg: true, troponin: false, bnp: false, bloodPressure: false, cbc: true, renalFunction: false, hepaticFunction: true, notes: "Monitoramento de QTcF e neutrófilos." },
  { medicationId: 15, timepoint: "A cada 2 ciclos (após C2)", echocardiogram: false, ecg: false, troponin: false, bnp: false, bloodPressure: false, cbc: true, renalFunction: false, hepaticFunction: true, notes: "ECG se sintomas ou alterações prévias." },
];

// ─── DADOS CTCAE v5.0 ─────────────────────────────────────────────────────────

export interface CTCAEData {
  toxicity: string;
  grade1: string;
  grade2: string;
  grade3: string;
  grade4: string;
  grade5: string;
  management1: string;
  management2: string;
  management3: string;
  management4: string;
}

export const CTCAE_CARDIAC: CTCAEData[] = [
  {
    toxicity: "Disfunção Ventricular Esquerda / Insuficiência Cardíaca",
    grade1: "LVEF 40-50% (queda ≥10pp do basal) assintomático",
    grade2: "LVEF 30-40% ou queda ≥20pp; sintomas leves com atividade moderada",
    grade3: "LVEF <30% ou sintomas graves em repouso; hospitalização indicada",
    grade4: "Risco de vida; intervenção urgente necessária (IABP, transplante)",
    grade5: "Óbito",
    management1: "Suspender tratamento temporariamente. Reavaliação em 4-6 semanas. Iniciar IECA/BRA + betabloqueador. Otimizar fatores de risco CV.",
    management2: "Suspender tratamento. Iniciar tratamento para IC (IECA + betabloqueador + diurético). Reavaliação em 4-6 semanas. Retomar se LVEF recuperar para ≥50%.",
    management3: "Descontinuar tratamento oncológico. Tratamento intensivo para IC. Encaminhar para cardiologista. Considerar internação.",
    management4: "Descontinuar permanentemente. Suporte hemodinâmico intensivo. UTI cardiológica.",
  },
  {
    toxicity: "Miocardite (Imunomediada por ICI)",
    grade1: "Elevação de troponina sem sintomas, ECG normal",
    grade2: "Sintomas leves (fadiga, dispneia leve); alterações no ECG; troponina elevada",
    grade3: "Sintomas moderados-graves; alterações hemodinâmicas; bloqueio AV",
    grade4: "Risco de vida; choque cardiogênico; arritmias ventriculares",
    grade5: "Óbito",
    management1: "Suspender ICI. Internação para monitoramento. Ecocardiograma e RNM cardíaca. Considerar biópsia endomiocárdica.",
    management2: "Suspender ICI permanentemente. Metilprednisolona 1-2 mg/kg/dia IV. Monitoramento cardíaco contínuo.",
    management3: "Suspender ICI permanentemente. Metilprednisolona 1 g/dia IV por 3-5 dias. Considerar imunossupressão adicional (micofenolato, tacrolimus). UTI.",
    management4: "Suspender ICI permanentemente. Metilprednisolona 1 g/dia IV. Imunossupressão agressiva. Suporte hemodinâmico. UTI cardiológica.",
  },
  {
    toxicity: "Hipertensão Arterial",
    grade1: "PAS 120-139 mmHg ou PAD 80-89 mmHg (pré-hipertensão)",
    grade2: "PAS 140-159 mmHg ou PAD 90-99 mmHg; monofármaco indicado",
    grade3: "PAS ≥160 mmHg ou PAD ≥100 mmHg; múltiplos fármacos ou intensificação",
    grade4: "Consequências com risco de vida (crise hipertensiva, encefalopatia)",
    grade5: "Óbito",
    management1: "Modificações no estilo de vida. Monitoramento frequente de PA.",
    management2: "Iniciar anti-hipertensivo (IECA/BRA de preferência em pacientes com TKI). Meta: PA <140/90 mmHg.",
    management3: "Suspender TKI temporariamente. Intensificar tratamento anti-hipertensivo. Retomar com dose reduzida quando PA controlada.",
    management4: "Descontinuar TKI. Tratamento de emergência hipertensiva. Internação.",
  },
  {
    toxicity: "Prolongamento do Intervalo QTc",
    grade1: "QTcF 450-480 ms",
    grade2: "QTcF 481-500 ms",
    grade3: "QTcF >500 ms ou aumento >60 ms do basal",
    grade4: "QTcF >500 ms com Torsades de Pointes ou TV polimórfica",
    grade5: "Óbito",
    management1: "Corrigir eletrólitos (K⁺, Mg²⁺). Revisar medicamentos concomitantes. Monitoramento frequente de ECG.",
    management2: "Suspender fármaco causador temporariamente. Corrigir eletrólitos. ECG frequente. Retomar com dose reduzida.",
    management3: "Suspender fármaco permanentemente. Monitoramento cardíaco contínuo. Corrigir causas reversíveis.",
    management4: "Descontinuar permanentemente. Desfibrilação se TV/FV. Magnésio IV para Torsades. UTI cardiológica.",
  },
  {
    toxicity: "Pericardite / Derrame Pericárdico",
    grade1: "Assintomático; derrame pequeno ao ecocardiograma",
    grade2: "Sintomático (dor torácica, atrito pericárdico); derrame moderado",
    grade3: "Derrame com comprometimento fisiológico; tamponamento iminente",
    grade4: "Tamponamento cardíaco; intervenção urgente necessária",
    grade5: "Óbito",
    management1: "AINEs (ibuprofeno 600 mg 3x/dia) + colchicina 0,5 mg 2x/dia. Repouso.",
    management2: "AINEs + colchicina. Considerar suspensão do tratamento oncológico. Ecocardiograma seriado.",
    management3: "Suspender tratamento oncológico. Corticosteroides se imunomediada. Pericardiocentese se necessário.",
    management4: "Pericardiocentese de emergência. Suspender tratamento oncológico permanentemente.",
  },
];

// ─── ESTRATIFICAÇÃO DE RISCO ESC 2022 ─────────────────────────────────────────

export interface RiskFactor {
  name: string;
  weight: number;
  description: string;
}

export const CARDIOVASCULAR_RISK_FACTORS: RiskFactor[] = [
  // Fatores de alto peso
  { name: "Doença cardiovascular prévia (IC, DAC, valvopatia grave)", weight: 3, description: "IC prévia, IAM, angina instável, valvopatia grave, cardiomiopatia" },
  { name: "LVEF basal <50%", weight: 3, description: "Disfunção ventricular esquerda preexistente" },
  { name: "Antracíclina em alta dose (>250 mg/m² doxorrubicina equivalente)", weight: 2, description: "Dose cumulativa elevada de antracíclinas" },
  { name: "Radioterapia mediastinal/torácica prévia", weight: 2, description: "RT com dose cardíaca significativa" },
  { name: "Combinação antracíclina + trastuzumabe", weight: 2, description: "Uso sequencial ou concomitante" },
  // Fatores de peso moderado
  { name: "Hipertensão arterial sistêmica", weight: 1, description: "HAS diagnosticada ou em tratamento" },
  { name: "Diabetes mellitus", weight: 1, description: "DM tipo 1 ou 2" },
  { name: "Dislipidemia", weight: 1, description: "Colesterol total elevado, LDL elevado, HDL baixo" },
  { name: "Tabagismo ativo", weight: 1, description: "Fumante atual" },
  { name: "Obesidade (IMC ≥30 kg/m²)", weight: 1, description: "Obesidade grau I ou maior" },
  { name: "Doença renal crônica (TFG <60 mL/min/1,73m²)", weight: 1, description: "DRC estágio 3 ou maior" },
  { name: "Idade ≥65 anos", weight: 1, description: "Fator de risco independente" },
  { name: "Quimioterapia prévia cardiotóxica", weight: 1, description: "Antracíclinas, ciclofosfamida em altas doses" },
  // Fatores de baixo peso
  { name: "Tabagismo prévio (ex-fumante)", weight: 0.5, description: "Ex-fumante (<10 anos de cessação)" },
  { name: "Sedentarismo", weight: 0.5, description: "Atividade física insuficiente" },
];

export function calculateCardiovascularRisk(factors: string[]): {
  score: number;
  level: "baixo" | "moderado" | "alto" | "muito_alto";
  recommendation: string;
} {
  const totalScore = factors.reduce((sum, factorName) => {
    const factor = CARDIOVASCULAR_RISK_FACTORS.find(f => f.name === factorName);
    return sum + (factor?.weight || 0);
  }, 0);

  if (totalScore === 0) {
    return { score: totalScore, level: "baixo", recommendation: "Monitoramento padrão. Ecocardiograma basal e conforme protocolo do tratamento." };
  } else if (totalScore <= 2) {
    return { score: totalScore, level: "moderado", recommendation: "Monitoramento reforçado. Ecocardiograma basal e a cada 3 meses durante tratamento cardiotóxico. Otimizar fatores de risco CV." };
  } else if (totalScore <= 4) {
    return { score: totalScore, level: "alto", recommendation: "Avaliação cardiológica antes do tratamento. Monitoramento intensivo com ecocardiograma, troponina e BNP. Considerar cardio-oncologista." };
  } else {
    return { score: totalScore, level: "muito_alto", recommendation: "Avaliação obrigatória por cardio-oncologista antes do tratamento. Monitoramento muito intensivo. Considerar modificação do protocolo oncológico. Otimização cardiovascular pré-tratamento." };
  }
}

// ─── CÁLCULOS DE BSA E DOSE ───────────────────────────────────────────────────

export function calculateBSA_Mosteller(weightKg: number, heightCm: number): number {
  return Math.sqrt((heightCm * weightKg) / 3600);
}

export function calculateBSA_DuBois(weightKg: number, heightCm: number): number {
  return 0.007184 * Math.pow(heightCm, 0.725) * Math.pow(weightKg, 0.425);
}

export function calculateCrCl_CockcroftGault(
  age: number,
  weightKg: number,
  creatinine: number,
  sex: "masculino" | "feminino" | "outro"
): number {
  const factor = sex === "feminino" ? 0.85 : 1.0;
  return ((140 - age) * weightKg * factor) / (72 * creatinine);
}

export function calculateDose(
  standardDosePerM2: number,
  bsa: number,
  maxDose?: number
): number {
  const calculatedDose = standardDosePerM2 * bsa;
  if (maxDose && calculatedDose > maxDose) {
    return maxDose;
  }
  return Math.round(calculatedDose * 10) / 10;
}

export function getAUCDose_Calvert(
  auc: number,
  crCl: number,
  gfr?: number
): number {
  // Fórmula de Calvert: Dose (mg) = AUC × (GFR + 25)
  const gfrValue = gfr || crCl;
  return auc * (gfrValue + 25);
}

// ─── PROTOCOLOS DE TRATAMENTO ─────────────────────────────────────────────────

export interface TreatmentProtocol {
  name: string;
  indication: string;
  drugs: Array<{
    name: string;
    dose: string;
    route: string;
    schedule: string;
  }>;
  cycleLength: string;
  totalCycles: string;
  cardiotoxicityRisk: "baixo" | "moderado" | "alto" | "muito_alto";
  monitoring: string;
  sbocReference: string;
}

export const TREATMENT_PROTOCOLS: TreatmentProtocol[] = [
  {
    name: "ACdd → T semanal",
    indication: "Mama RH+/HER2- ou TNBC - adjuvância/neoadjuvância",
    drugs: [
      { name: "Doxorrubicina", dose: "60 mg/m²", route: "EV", schedule: "D1" },
      { name: "Ciclofosfamida", dose: "600 mg/m²", route: "EV", schedule: "D1" },
      { name: "Filgrastim", dose: "300 mcg", route: "SC", schedule: "D3-D10 (ou Pegfilgrastim 6 mg D2)" },
    ],
    cycleLength: "14 dias (dose-densa)",
    totalCycles: "4 ciclos de AC, seguidos de 12 semanas de paclitaxel 80 mg/m² semanal",
    cardiotoxicityRisk: "alto",
    monitoring: "Ecocardiograma basal, após 200 mg/m² de doxorrubicina e ao final do AC. Hemograma antes de cada ciclo.",
    sbocReference: "SBOC 2026 - Mama Adjuvância (NE ALTO/FR FORTE)",
  },
  {
    name: "TCHP",
    indication: "Mama HER2+ - neoadjuvância/adjuvância",
    drugs: [
      { name: "Docetaxel", dose: "75 mg/m²", route: "EV", schedule: "D1" },
      { name: "Carboplatina", dose: "AUC 6", route: "EV", schedule: "D1" },
      { name: "Trastuzumabe", dose: "8 mg/kg (C1) → 6 mg/kg", route: "EV", schedule: "D1" },
      { name: "Pertuzumabe", dose: "840 mg (C1) → 420 mg", route: "EV", schedule: "D1" },
    ],
    cycleLength: "21 dias",
    totalCycles: "6 ciclos + manutenção com trastuzumabe ± pertuzumabe até completar 1 ano",
    cardiotoxicityRisk: "moderado",
    monitoring: "Ecocardiograma basal e a cada 3 meses durante trastuzumabe. Hemograma antes de cada ciclo.",
    sbocReference: "SBOC 2026 - Mama Adjuvância/Neoadjuvância (NE ALTO/FR FORTE)",
  },
  {
    name: "TC",
    indication: "Mama RH+/HER2- - adjuvância (alternativa sem antracíclina)",
    drugs: [
      { name: "Docetaxel", dose: "75 mg/m²", route: "EV", schedule: "D1" },
      { name: "Ciclofosfamida", dose: "600 mg/m²", route: "EV", schedule: "D1" },
    ],
    cycleLength: "21 dias",
    totalCycles: "4-6 ciclos",
    cardiotoxicityRisk: "baixo",
    monitoring: "Hemograma antes de cada ciclo. Sem necessidade de monitoramento cardíaco específico.",
    sbocReference: "SBOC 2026 - Mama Adjuvância (NE ALTO/FR FORTE)",
  },
  {
    name: "Ipilimumabe + Nivolumabe",
    indication: "CCR células claras - 1ª linha (risco intermediário/alto IMDC) | Melanoma metastático",
    drugs: [
      { name: "Ipilimumabe", dose: "1 mg/kg", route: "EV", schedule: "D1 (4 ciclos)" },
      { name: "Nivolumabe", dose: "3 mg/kg", route: "EV", schedule: "D1 (4 ciclos), depois 240 mg a cada 2 semanas" },
    ],
    cycleLength: "21 dias (fase de indução) → 14 dias (manutenção)",
    totalCycles: "4 ciclos de combinação, depois nivolumabe em manutenção até progressão",
    cardiotoxicityRisk: "alto",
    monitoring: "Troponina e ECG basais e a cada ciclo nos primeiros 3 meses. Função tireoidiana, hepática e renal a cada ciclo.",
    sbocReference: "SBOC 2026 - Rim (NE ALTO/FR FORTE) | Melanoma (NE ALTO/FR FORTE)",
  },
  {
    name: "Axitinibe + Pembrolizumabe",
    indication: "CCR células claras - 1ª linha (risco intermediário/alto IMDC)",
    drugs: [
      { name: "Axitinibe", dose: "5 mg", route: "VO", schedule: "12/12h continuamente" },
      { name: "Pembrolizumabe", dose: "200 mg", route: "EV", schedule: "D1 a cada 3 semanas" },
    ],
    cycleLength: "21 dias",
    totalCycles: "Até progressão ou toxicidade inaceitável",
    cardiotoxicityRisk: "moderado",
    monitoring: "PA diária nas primeiras semanas. Troponina e ECG basais e a cada ciclo. Função tireoidiana e hepática.",
    sbocReference: "SBOC 2026 - Rim (NE ALTO/FR FORTE)",
  },
  {
    name: "Dabrafenibe + Trametinibe",
    indication: "Melanoma BRAF V600E/K mutado - adjuvância (estádio III) e metastático",
    drugs: [
      { name: "Dabrafenibe", dose: "150 mg", route: "VO", schedule: "12/12h continuamente" },
      { name: "Trametinibe", dose: "2 mg", route: "VO", schedule: "1x/dia continuamente" },
    ],
    cycleLength: "Contínuo",
    totalCycles: "12 meses (adjuvância) | Até progressão (metastático)",
    cardiotoxicityRisk: "baixo",
    monitoring: "Ecocardiograma basal e a cada 3 meses. Monitoramento de PA. Temperatura corporal (pirexia).",
    sbocReference: "SBOC 2026 - Melanoma (NE ALTO/FR FORTE)",
  },
  {
    name: "Docetaxel + Abiraterona + Prednisona",
    indication: "Próstata sensível à castração metastático de alto volume/risco",
    drugs: [
      { name: "Docetaxel", dose: "75 mg/m²", route: "EV", schedule: "D1 a cada 3 semanas" },
      { name: "Abiraterona", dose: "1.000 mg", route: "VO", schedule: "1x/dia em jejum continuamente" },
      { name: "Prednisona", dose: "5 mg", route: "VO", schedule: "1x/dia continuamente" },
    ],
    cycleLength: "21 dias",
    totalCycles: "6 ciclos de docetaxel + abiraterona continuamente",
    cardiotoxicityRisk: "baixo",
    monitoring: "PA e potássio mensalmente. Função hepática (TGO/TGP) mensalmente nos primeiros 3 meses. Hemograma antes de cada ciclo.",
    sbocReference: "SBOC 2026 - Próstata Avançada (NE ALTO/FR FORTE)",
  },
];

// ─── CUIDADOS ESPECIAIS EM CARDIO-ONCOLOGIA ───────────────────────────────────

export interface SpecialCare {
  title: string;
  trigger: string;
  diagnosis: string;
  grading: string;
  management: string;
  followUp: string;
  references: string;
}

export const SPECIAL_CARES: SpecialCare[] = [
  {
    title: "Miocardite por Inibidores de Checkpoint Imunológico (ICI)",
    trigger: "Uso de pembrolizumabe, nivolumabe, ipilimumabe, atezolizumabe, durvalumabe",
    diagnosis: "Suspeitar em: elevação de troponina, alterações no ECG (bloqueios, ST), dispneia, dor torácica, palpitações, síncope. Diagnóstico: troponina + ECG + ecocardiograma + RNM cardíaca (padrão: realce tardio de gadolínio não-isquêmico). Biópsia endomiocárdica: padrão-ouro (infiltrado linfocitário).",
    grading: "Grau 1: troponina elevada, assintomático, ECG normal. Grau 2: sintomas leves, alterações ECG, troponina elevada. Grau 3: sintomas moderados-graves, alterações hemodinâmicas, bloqueio AV. Grau 4: risco de vida, choque cardiogênico, arritmias ventriculares. Grau 5: óbito.",
    management: "SUSPENDER ICI IMEDIATAMENTE (qualquer grau ≥2). Grau 1: monitoramento intensivo, considerar suspensão. Grau 2: metilprednisolona 1-2 mg/kg/dia IV. Grau 3-4: metilprednisolona 1 g/dia IV por 3-5 dias → imunossupressão adicional (micofenolato 1-1,5 g 2x/dia, tacrolimus, infliximabe 5 mg/kg se refratário). UTI cardiológica. Suporte hemodinâmico se necessário.",
    followUp: "Não reiniciar ICI em grau ≥3. Grau 1-2: considerar reinício com monitoramento intensivo após resolução completa (decisão multidisciplinar). Seguimento cardiológico por 6-12 meses.",
    references: "ESC 2022 - Seção 5.4; ASCO 2018 Management of Immune-Related Adverse Events.",
  },
  {
    title: "Disfunção Ventricular por Antracíclinas",
    trigger: "Uso de doxorrubicina, epirrubicina, daunorrubicina, idarrubicina",
    diagnosis: "Monitoramento de LVEF por ecocardiograma (preferencial) ou MUGA. Critérios de disfunção: queda de LVEF ≥10 pontos percentuais com LVEF final <53% (ESC 2022) ou queda ≥10pp com LVEF <50% (ASCO 2017). Biomarcadores: troponina I/T (marcador precoce de lesão), BNP/NT-proBNP (marcador de disfunção).",
    grading: "Assintomática: queda de LVEF sem sintomas. Sintomática: queda de LVEF + sintomas de IC (dispneia, edema, fadiga). Grave: LVEF <35% ou IC refratária.",
    management: "Assintomática (LVEF 40-50%): suspender antracíclina temporariamente, iniciar IECA + betabloqueador, reavaliação em 4-6 semanas. Sintomática: suspender antracíclina, tratamento completo de IC (IECA + betabloqueador + diurético ± espironolactona), reavaliação. Grave: descontinuar antracíclina, tratamento intensivo de IC, considerar cardio-oncologista.",
    followUp: "Ecocardiograma a cada 3 meses após suspensão. Retomar antracíclina apenas se LVEF recuperar para ≥50% e sintomas controlados (decisão multidisciplinar). Seguimento cardiológico por 5 anos pós-tratamento.",
    references: "ESC 2022 - Seção 5.1; ASCO 2017 Prevention and Monitoring.",
  },
  {
    title: "Hipertensão por TKIs Anti-VEGF e Anti-VEGFR",
    trigger: "Uso de sunitinibe, pazopanibe, axitinibe, cabozantinibe, sorafenibe, bevacizumabe, ramucirumabe",
    diagnosis: "PA ≥140/90 mmHg em 2 medidas consecutivas. Monitoramento: PA antes e durante cada ciclo. Monitoramento domiciliar recomendado. Crise hipertensiva: PA >180/120 mmHg com sintomas (cefaleia, alteração visual, dor torácica).",
    grading: "Grau 1: PAS 120-139 ou PAD 80-89 mmHg. Grau 2: PAS 140-159 ou PAD 90-99 mmHg. Grau 3: PAS ≥160 ou PAD ≥100 mmHg. Grau 4: Crise hipertensiva com risco de vida.",
    management: "Meta de PA: <140/90 mmHg (geral) | <130/80 mmHg (DM, DRC, DAC). Fármacos de escolha: IECA (ex: enalapril 5-20 mg/dia) ou BRA (ex: losartana 50-100 mg/dia) - 1ª linha. Anlodipino 5-10 mg/dia (2ª linha). Evitar diltiazem/verapamil (inibem CYP3A4, aumentam níveis de TKI). Grau 3: suspender TKI temporariamente até controle. Grau 4: suspender TKI permanentemente, tratamento de emergência.",
    followUp: "Monitoramento de PA durante todo o tratamento. Ajuste de dose do TKI se hipertensão refratária. Avaliação de órgão-alvo (rim, coração, olhos) periodicamente.",
    references: "ESC 2022 - Seção 5.3; ASCO 2017.",
  },
  {
    title: "Síndrome de Takotsubo Relacionada ao Câncer",
    trigger: "Estresse emocional/físico intenso (diagnóstico de câncer, cirurgia, quimioterapia), uso de 5-FU, capecitabina",
    diagnosis: "Disfunção transitória do VE com padrão apical (ballooning apical). Critérios diagnósticos (Mayo Clinic): 1) Disfunção transitória do VE (acinesia/discinesia apical); 2) Ausência de DAC obstrutiva; 3) Alterações de ECG (elevação de ST, inversão de T); 4) Ausência de feocromocitoma ou miocardite. Ecocardiograma: padrão característico de ballooning apical.",
    grading: "Leve: disfunção transitória sem complicações. Moderada: IC aguda compensada. Grave: choque cardiogênico, arritmias, trombo apical.",
    management: "Suporte hemodinâmico. IECA + betabloqueador (cautela: betabloqueador pode piorar o vasoespasmo na fase aguda). Anticoagulação se trombo apical. Evitar inotrópicos (podem piorar o espasmo). Recuperação geralmente em 4-8 semanas.",
    followUp: "Ecocardiograma seriado até recuperação da LVEF. Recorrência: ~10% ao ano. Considerar betabloqueador como prevenção secundária.",
    references: "ESC 2022 - Seção 6; Heart Failure Association 2022.",
  },
  {
    title: "Tromboembolismo Venoso em Pacientes Oncológicos",
    trigger: "Todos os pacientes oncológicos (risco 4-7x maior que população geral). Maior risco: adenocarcinoma de pâncreas, pulmão, ovário, gástrico; TKIs; talidomida/lenalidomida; hospitalização; cirurgia.",
    diagnosis: "Score de Khorana para estratificação de risco: sítio tumoral (pâncreas/estômago = 2 pontos; pulmão/linfoma/ginecológico/bexiga/testículo = 1 ponto), plaquetas ≥350.000/mm³ (1 ponto), Hb <10 g/dL ou uso de eritropoetina (1 ponto), leucócitos >11.000/mm³ (1 ponto), IMC ≥35 kg/m² (1 ponto). Score ≥3 = alto risco.",
    grading: "TVP proximal, TVP distal, TEP subsegmentar, TEP segmentar/lobar, TEP maciço.",
    management: "Profilaxia (Khorana ≥2): HBPM (enoxaparina 40 mg SC/dia) ou rivaroxabana 10 mg/dia ou apixabana 2,5 mg 2x/dia. Tratamento de TEV: HBPM ou anticoagulante oral direto (rivaroxabana 15 mg 2x/dia por 21 dias → 20 mg/dia; apixabana 10 mg 2x/dia por 7 dias → 5 mg 2x/dia). Duração: mínimo 6 meses; indefinido se câncer ativo.",
    followUp: "Monitoramento de recorrência e sangramento. Revisão periódica da indicação de anticoagulação.",
    references: "ESC 2022 - Seção 9; ASCO 2023 VTE Guidelines.",
  },
];
