import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, AlertTriangle, ChevronRight, Stethoscope, Activity } from "lucide-react";

export default function SpecialCaresPage() {
  const { data: specialCares } = trpc.clinical.getSpecialCares.useQuery();

  const myocarditisProtocol = {
    title: "Miocardite por Imunoterapia (ICI)",
    subtitle: "Protocolo de Manejo — ESC 2022 / ASCO 2017",
    incidence: "0,5-1,5% dos pacientes em uso de ICI (anti-PD1, anti-PDL1, anti-CTLA4)",
    mortality: "Mortalidade de até 50% nos casos graves — emergência médica",
    grades: [
      {
        grade: 1,
        color: "bg-yellow-50 border-yellow-200",
        textColor: "text-yellow-800",
        criteria: "Elevação de troponina sem sintomas, ECG normal",
        management: [
          "Suspender ICI imediatamente",
          "Internação para monitoramento cardíaco",
          "Ecocardiograma transtorácico urgente",
          "RNM cardíaca com gadolínio (padrão-ouro)",
          "Troponina seriada a cada 6-12h",
          "ECG diário",
          "Considerar biópsia endomiocárdica",
        ],
        corticosteroid: "Metilprednisolona 1-2 mg/kg/dia IV",
        rechallenge: "Possível com cautela após resolução completa (decisão multidisciplinar)",
      },
      {
        grade: 2,
        color: "bg-orange-50 border-orange-200",
        textColor: "text-orange-800",
        criteria: "Sintomas leves (fadiga, dispneia leve); alterações no ECG; troponina elevada",
        management: [
          "Suspender ICI definitivamente",
          "Internação em UTI cardiológica",
          "Monitoramento hemodinâmico contínuo",
          "Ecocardiograma e RNM cardíaca urgentes",
          "Avaliação por cardio-oncologista",
          "Troponina a cada 6h",
          "Biópsia endomiocárdica se diagnóstico incerto",
        ],
        corticosteroid: "Metilprednisolona 1-2 mg/kg/dia IV por 3-5 dias, depois prednisona oral",
        rechallenge: "Contraindicado na maioria dos casos",
      },
      {
        grade: 3,
        color: "bg-red-50 border-red-200",
        textColor: "text-red-800",
        criteria: "Sintomas moderados-graves; alterações hemodinâmicas; bloqueio AV; LVEF reduzida",
        management: [
          "Suspender ICI definitivamente",
          "UTI cardiológica — emergência",
          "Suporte hemodinâmico (inotrópicos, balão intra-aórtico)",
          "Corticosteroides em alta dose IV",
          "Considerar imunossupressão adicional (micofenolato, azatioprina)",
          "Marcapasso temporário se bloqueio AV avançado",
          "Equipe multidisciplinar (cardiologia + oncologia + imunologia)",
        ],
        corticosteroid: "Metilprednisolona 500-1000 mg/dia IV por 3-5 dias",
        rechallenge: "Contraindicado absolutamente",
      },
      {
        grade: 4,
        color: "bg-red-100 border-red-400",
        textColor: "text-red-900",
        criteria: "Risco de vida; choque cardiogênico; arritmias ventriculares; LVEF < 30%",
        management: [
          "Emergência absoluta — UTI cardiológica",
          "Suporte circulatório mecânico (ECMO, Impella)",
          "Metilprednisolona 1000 mg/dia IV",
          "Imunoglobulina IV 2 g/kg",
          "Plasmaférese se refratário",
          "Considerar transplante cardíaco urgente",
          "Consulta urgente com centro de referência",
        ],
        corticosteroid: "Metilprednisolona 1000 mg/dia IV + imunoglobulina IV",
        rechallenge: "Absolutamente contraindicado",
      },
    ],
    diagnosticCriteria: [
      "Troponina elevada (> percentil 99 do LSR)",
      "Alterações no ECG (bloqueio AV, alterações de ST/T, arritmias)",
      "Queda de LVEF no ecocardiograma",
      "Edema miocárdico na RNM cardíaca (Critérios de Lake Louise)",
      "Infiltrado inflamatório na biópsia endomiocárdica",
    ],
  };

  const ventricularDysfunction = {
    title: "Disfunção Ventricular por Antracíclinas",
    subtitle: "Prevenção, Diagnóstico e Manejo — ESC 2022",
    riskFactors: [
      "Dose cumulativa de doxorrubicina > 250 mg/m²",
      "Dose cumulativa de epirrubicina > 600 mg/m²",
      "Radioterapia mediastinal concomitante ou prévia",
      "Trastuzumabe concomitante ou sequencial",
      "LVEF basal < 55%",
      "Hipertensão arterial não controlada",
      "Idade > 65 anos ou < 15 anos",
      "Doença cardíaca prévia",
    ],
    prevention: [
      { measure: "Dexrazoxano", detail: "Indicado quando dose cumulativa de doxorrubicina ≥ 300 mg/m². Dose: 10:1 (dexrazoxano:doxorrubicina). Reduz risco de cardiotoxicidade sem comprometer eficácia oncológica." },
      { measure: "Formulação Lipossomal", detail: "Doxorrubicina lipossomal peguilada: menor cardiotoxicidade que a doxorrubicina convencional. Preferir em pacientes de alto risco cardíaco." },
      { measure: "Infusão Contínua", detail: "Infusão de doxorrubicina em 48-96h (vs. bolus) reduz pico de concentração e cardiotoxicidade aguda. Considerar em alto risco." },
      { measure: "IECA/BRA Preventivo", detail: "Enalapril, perindopril ou candesartana: considerar em pacientes de alto risco antes do início das antracíclinas. Evidência crescente de cardioproteção." },
      { measure: "Betabloqueador", detail: "Carvedilol ou bisoprolol: considerar em combinação com IECA em alto risco. Estudo OVERCOME: redução de CTRCD com enalapril + carvedilol." },
    ],
    management: [
      { lvef: "LVEF 50-54% (queda 10-14%)", action: "Iniciar IECA + betabloqueador. Repetir ecocardiograma em 4-6 semanas. Continuar antracíclina com cautela." },
      { lvef: "LVEF 40-49% (queda ≥ 15%)", action: "Suspender antracíclina temporariamente. Iniciar tratamento de IC (IECA + betabloqueador + diurético se necessário). Reavaliação em 4-6 semanas. Retomar apenas se LVEF ≥ 50%." },
      { lvef: "LVEF < 40% ou IC sintomática", action: "Descontinuar antracíclina definitivamente. Tratamento intensivo de IC. Encaminhar para cardiologista. Considerar alternativas oncológicas." },
    ],
  };

  const hypertension = {
    title: "Hipertensão por TKIs e Anti-VEGF",
    subtitle: "Manejo da Hipertensão Arterial Induzida por Tratamento Oncológico",
    incidence: "TKIs VEGFR: 15-45% | Bevacizumabe: 20-30% | Sunitinibe: 15-35%",
    mechanism: "Inibição do VEGF → redução de NO → vasoconstrição → HAS. Também: rarefação microvascular e ativação do sistema renina-angiotensina.",
    grades: [
      { grade: 1, criteria: "PAS 120-139 mmHg ou PAD 80-89 mmHg (pré-hipertensão)", action: "Monitoramento mais frequente. Modificação do estilo de vida. Manter tratamento oncológico." },
      { grade: 2, criteria: "PAS 140-159 mmHg ou PAD 90-99 mmHg (HAS grau 1)", action: "Iniciar anti-hipertensivo. IECA ou BRA de primeira escolha. Manter tratamento oncológico com monitoramento." },
      { grade: 3, criteria: "PAS ≥ 160 mmHg ou PAD ≥ 100 mmHg (HAS grau 2-3)", action: "Iniciar ou intensificar anti-hipertensivo. Considerar suspensão temporária do agente causador. Avaliação cardiológica." },
      { grade: 4, criteria: "Crise hipertensiva com consequências orgânicas (encefalopatia, SCA)", action: "Suspender agente causador imediatamente. Internação. Anti-hipertensivo IV. Avaliação de órgão-alvo." },
    ],
    preferredAntihypertensives: [
      { drug: "IECA (enalapril, lisinopril)", reason: "Primeira escolha — nefroproteção, cardioproteção, sem interação com VEGF" },
      { drug: "BRA (losartana, valsartana)", reason: "Alternativa ao IECA se intolerância à tosse" },
      { drug: "Anlodipino (BCC di-hidropiridínico)", reason: "Boa opção em combinação — sem interação com QTc" },
      { drug: "Betabloqueadores (carvedilol, bisoprolol)", reason: "Se disfunção ventricular associada" },
    ],
    avoid: ["Diltiazem e verapamil (inibidores de CYP3A4 — interação com TKIs)", "Diuréticos como monoterapia (risco de hipocalemia e QTc)"],
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Stethoscope className="w-6 h-6 text-teal-500" />
          Cuidados Especiais em Cardio-Oncologia
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Protocolos clínicos específicos para as principais complicações cardiovasculares do tratamento oncológico
        </p>
      </div>

      <Tabs defaultValue="myocarditis">
        <TabsList className="grid w-full grid-cols-3 max-w-xl">
          <TabsTrigger value="myocarditis">Miocardite ICI</TabsTrigger>
          <TabsTrigger value="ventricular">Disfunção VE</TabsTrigger>
          <TabsTrigger value="hypertension">Hipertensão</TabsTrigger>
        </TabsList>

        {/* Myocarditis */}
        <TabsContent value="myocarditis" className="mt-4 space-y-4">
          <Card className="border-red-200 bg-red-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-base text-red-800 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                {myocarditisProtocol.title}
              </CardTitle>
              <p className="text-xs text-red-700">{myocarditisProtocol.subtitle}</p>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className="bg-white/70 rounded-lg p-2.5 text-xs">
                  <p className="font-semibold text-red-800 mb-1">Incidência</p>
                  <p className="text-red-700">{myocarditisProtocol.incidence}</p>
                </div>
                <div className="bg-white/70 rounded-lg p-2.5 text-xs">
                  <p className="font-semibold text-red-800 mb-1">Mortalidade</p>
                  <p className="text-red-700">{myocarditisProtocol.mortality}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-sm">Critérios Diagnósticos</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-1">
                {myocarditisProtocol.diagnosticCriteria.map((c, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm">
                    <ChevronRight className="w-3.5 h-3.5 text-primary flex-shrink-0 mt-0.5" />
                    <span>{c}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {myocarditisProtocol.grades.map((g) => (
            <Card key={g.grade} className={`border ${g.color}`}>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 ${g.color} ${g.textColor}`}>{g.grade}</span>
                  <div>
                    <p className={`font-bold text-sm ${g.textColor}`}>Grau {g.grade}</p>
                    <p className="text-xs text-muted-foreground">{g.criteria}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-1">
                  {g.management.map((m, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs">
                      <ChevronRight className="w-3 h-3 text-muted-foreground flex-shrink-0 mt-0.5" />
                      <span>{m}</span>
                    </div>
                  ))}
                </div>
                <div className="bg-white/80 rounded-lg p-2.5">
                  <p className="text-xs font-semibold text-muted-foreground mb-1">Corticosteróide</p>
                  <p className="text-xs font-medium">{g.corticosteroid}</p>
                </div>
                <div className={`rounded-lg p-2.5 ${g.grade <= 1 ? "bg-emerald-50 border border-emerald-200" : "bg-red-50 border border-red-200"}`}>
                  <p className={`text-xs font-semibold mb-1 ${g.grade <= 1 ? "text-emerald-700" : "text-red-700"}`}>Reintrodução do ICI</p>
                  <p className={`text-xs ${g.grade <= 1 ? "text-emerald-800" : "text-red-800"}`}>{g.rechallenge}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Ventricular Dysfunction */}
        <TabsContent value="ventricular" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Heart className="w-4 h-4 text-red-500" />
                {ventricularDysfunction.title}
              </CardTitle>
              <p className="text-xs text-muted-foreground">{ventricularDysfunction.subtitle}</p>
            </CardHeader>
            <CardContent>
              <p className="text-sm font-semibold mb-2">Fatores de Risco para Cardiotoxicidade por Antracíclinas</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                {ventricularDysfunction.riskFactors.map((r, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm">
                    <ChevronRight className="w-3.5 h-3.5 text-orange-500 flex-shrink-0 mt-0.5" />
                    <span>{r}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-sm">Estratégias de Prevenção</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {ventricularDysfunction.prevention.map((p, i) => (
                <div key={i} className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                  <p className="text-sm font-bold text-blue-800">{p.measure}</p>
                  <p className="text-xs text-blue-700 mt-1">{p.detail}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-sm">Manejo por LVEF</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {ventricularDysfunction.management.map((m, i) => (
                <div key={i} className={`rounded-xl border p-3 ${i === 0 ? "bg-amber-50 border-amber-200" : i === 1 ? "bg-orange-50 border-orange-200" : "bg-red-50 border-red-200"}`}>
                  <p className={`text-sm font-bold font-mono ${i === 0 ? "text-amber-800" : i === 1 ? "text-orange-800" : "text-red-800"}`}>{m.lvef}</p>
                  <p className={`text-xs mt-1 ${i === 0 ? "text-amber-700" : i === 1 ? "text-orange-700" : "text-red-700"}`}>{m.action}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Hypertension */}
        <TabsContent value="hypertension" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-500" />
                {hypertension.title}
              </CardTitle>
              <p className="text-xs text-muted-foreground">{hypertension.subtitle}</p>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className="bg-blue-50 rounded-lg p-2.5 text-xs border border-blue-200">
                  <p className="font-semibold text-blue-800 mb-1">Incidência</p>
                  <p className="text-blue-700">{hypertension.incidence}</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-2.5 text-xs border border-purple-200">
                  <p className="font-semibold text-purple-800 mb-1">Mecanismo</p>
                  <p className="text-purple-700">{hypertension.mechanism}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-3">
            {hypertension.grades.map((g) => (
              <Card key={g.grade} className={`border ${g.grade === 1 ? "border-yellow-200 bg-yellow-50" : g.grade === 2 ? "border-orange-200 bg-orange-50" : g.grade === 3 ? "border-red-200 bg-red-50" : "border-red-400 bg-red-100"}`}>
                <CardContent className="pt-4">
                  <div className="flex items-start gap-3">
                    <span className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0 ${g.grade === 1 ? "bg-yellow-600" : g.grade === 2 ? "bg-orange-600" : g.grade === 3 ? "bg-red-600" : "bg-red-900"}`}>{g.grade}</span>
                    <div>
                      <p className="text-sm font-bold">{g.criteria}</p>
                      <p className="text-xs text-muted-foreground mt-1">{g.action}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader><CardTitle className="text-sm">Anti-hipertensivos Preferidos</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {hypertension.preferredAntihypertensives.map((a, i) => (
                <div key={i} className="bg-emerald-50 rounded-lg p-2.5 border border-emerald-200">
                  <p className="text-sm font-bold text-emerald-800">{a.drug}</p>
                  <p className="text-xs text-emerald-700 mt-0.5">{a.reason}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-red-200 bg-red-50">
            <CardHeader className="pb-2"><CardTitle className="text-sm text-red-800">Evitar</CardTitle></CardHeader>
            <CardContent>
              {hypertension.avoid.map((a, i) => (
                <div key={i} className="flex items-start gap-2 text-sm text-red-800">
                  <span className="text-red-500 font-bold">✗</span>
                  <span>{a}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
