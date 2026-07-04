import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, AlertTriangle, Activity, Shield, Info, ChevronRight, Stethoscope } from "lucide-react";

const riskLevelConfig = {
  baixo: { label: "Baixo Risco", icon: "🟢", lvef: "LVEF ≥ 55%", troponin: "Normal", bnp: "Normal", monitoring: "Avaliação basal + monitoramento padrão conforme protocolo", frequency: "Ecocardiograma basal e ao final do tratamento", cardioRef: "Não requer avaliação cardiológica de rotina antes do início", bg: "bg-emerald-50", border: "border-emerald-200", textColor: "text-emerald-800" },
  moderado: { label: "Risco Moderado", icon: "🟡", lvef: "LVEF 50-54% ou queda 10-14%", troponin: "Elevação leve", bnp: "Elevação leve", monitoring: "Monitoramento reforçado com ecocardiograma a cada 3 ciclos", frequency: "Ecocardiograma a cada 3 meses durante o tratamento", cardioRef: "Considerar avaliação cardiológica antes do início", bg: "bg-amber-50", border: "border-amber-200", textColor: "text-amber-800" },
  alto: { label: "Alto Risco", icon: "🟠", lvef: "LVEF 40-49% ou queda ≥15%", troponin: "Elevação moderada", bnp: "Elevação moderada", monitoring: "Avaliação cardiológica obrigatória + monitoramento intensivo", frequency: "Ecocardiograma a cada 6 semanas durante o tratamento", cardioRef: "Avaliação por cardio-oncologista antes e durante o tratamento", bg: "bg-orange-50", border: "border-orange-200", textColor: "text-orange-800" },
  muito_alto: { label: "Muito Alto Risco", icon: "🔴", lvef: "LVEF < 40% ou IC sintomática", troponin: "Elevação significativa", bnp: "Elevação significativa", monitoring: "Suspender tratamento + avaliação cardiológica urgente", frequency: "Monitoramento semanal até estabilização", cardioRef: "Cardio-oncologista obrigatório — decisão multidisciplinar", bg: "bg-red-50", border: "border-red-200", textColor: "text-red-800" },
};

export default function CardioOncologyPage() {
  const [selectedRisk, setSelectedRisk] = useState<string | null>(null);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Heart className="w-6 h-6 text-red-500" />
          Módulo de Cardio-Oncologia
        </h1>
        <p className="text-muted-foreground text-sm mt-1">Estratificação de risco cardiovascular · ESC 2022 · Biomarcadores · Cardiotoxicidade</p>
      </div>

      <Tabs defaultValue="risk-stratification">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 max-w-2xl">
          <TabsTrigger value="risk-stratification">Estratificação</TabsTrigger>
          <TabsTrigger value="biomarkers">Biomarcadores</TabsTrigger>
          <TabsTrigger value="cardiotoxicity-types">Tipos Cardiotox.</TabsTrigger>
          <TabsTrigger value="esc-algorithm">Algoritmo ESC</TabsTrigger>
        </TabsList>

        <TabsContent value="risk-stratification" className="mt-4 space-y-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(riskLevelConfig).map(([key, config]) => (
              <button key={key} onClick={() => setSelectedRisk(selectedRisk === key ? null : key)}
                className={`text-left p-4 rounded-xl border-2 transition-all ${config.bg} ${config.border} ${selectedRisk === key ? "ring-2 ring-primary ring-offset-2 scale-[1.02]" : "hover:scale-[1.01]"}`}>
                <div className="text-2xl mb-2">{config.icon}</div>
                <p className={`font-bold text-sm ${config.textColor}`}>{config.label}</p>
                <p className="text-xs text-muted-foreground mt-1">{config.lvef}</p>
              </button>
            ))}
          </div>

          {selectedRisk && (() => {
            const config = riskLevelConfig[selectedRisk as keyof typeof riskLevelConfig];
            return (
              <Card className={`border-2 ${config.border}`}>
                <CardHeader><CardTitle className="flex items-center gap-2"><span className="text-xl">{config.icon}</span>{config.label}</CardTitle></CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      {[["LVEF", config.lvef], ["Troponina", config.troponin], ["BNP/NT-proBNP", config.bnp]].map(([label, val]) => (
                        <div key={label} className="bg-white rounded-lg p-3 border">
                          <p className="text-xs font-semibold text-muted-foreground mb-1">{label}</p>
                          <p className="text-sm font-bold">{val}</p>
                        </div>
                      ))}
                    </div>
                    <div className="space-y-3">
                      <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                        <p className="text-xs font-semibold text-blue-700 mb-1 flex items-center gap-1"><Activity className="w-3.5 h-3.5" />Monitoramento</p>
                        <p className="text-sm text-blue-800">{config.monitoring}</p>
                      </div>
                      <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                        <p className="text-xs font-semibold text-purple-700 mb-1 flex items-center gap-1"><Stethoscope className="w-3.5 h-3.5" />Frequência</p>
                        <p className="text-sm text-purple-800">{config.frequency}</p>
                      </div>
                      <div className="bg-teal-50 rounded-lg p-3 border border-teal-200">
                        <p className="text-xs font-semibold text-teal-700 mb-1 flex items-center gap-1"><Shield className="w-3.5 h-3.5" />Referência Cardiológica</p>
                        <p className="text-sm text-teal-800">{config.cardioRef}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })()}

          <Card>
            <CardHeader><CardTitle className="text-base">Fatores de Risco para Estratificação — ESC 2022</CardTitle></CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="border-b"><th className="text-left py-2 pr-4 font-semibold text-muted-foreground">Fator de Risco</th><th className="text-center py-2 px-2 font-semibold text-muted-foreground">Peso</th><th className="text-left py-2 pl-4 font-semibold text-muted-foreground">Categoria</th></tr></thead>
                  <tbody className="divide-y divide-border">
                    {[
                      ["IC prévia ou LVEF < 50%", 3, "Cardíaco"], ["Doença coronariana ou DAP", 2, "Cardíaco"],
                      ["Arritmia grave (FA, TV)", 2, "Cardíaco"], ["Hipertensão arterial grave", 2, "Cardíaco"],
                      ["QTc > 480 ms basal", 2, "Cardíaco"], ["Antracíclinas em dose alta (> 250 mg/m²)", 2, "Tratamento"],
                      ["Radioterapia mediastinal prévia", 2, "Tratamento"], ["Trastuzumabe + antracíclinas", 2, "Tratamento"],
                      ["Diabetes mellitus", 1, "Metabólico"], ["Dislipidemia", 1, "Metabólico"],
                      ["Obesidade (IMC > 30)", 1, "Metabólico"], ["Tabagismo ativo", 1, "Metabólico"],
                      ["Idade > 65 anos", 1, "Demográfico"], ["Quimioterapia prévia cardiotóxica", 1, "Tratamento"],
                    ].map(([factor, weight, category], i) => (
                      <tr key={i} className="hover:bg-muted/30">
                        <td className="py-2 pr-4">{factor}</td>
                        <td className="py-2 px-2 text-center"><Badge className={Number(weight) >= 2 ? "bg-orange-100 text-orange-800" : "bg-blue-100 text-blue-800"}>+{weight}</Badge></td>
                        <td className="py-2 pl-4 text-muted-foreground text-xs">{category}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                {[["Score 0", "Baixo", "bg-emerald-50 border-emerald-200 text-emerald-800"], ["Score 1-2", "Moderado", "bg-amber-50 border-amber-200 text-amber-800"], ["Score 3-4", "Alto", "bg-orange-50 border-orange-200 text-orange-800"], ["Score ≥ 5", "Muito Alto", "bg-red-50 border-red-200 text-red-800"]].map(([score, label, cls]) => (
                  <div key={score} className={`rounded-lg p-2 text-center border ${cls}`}><p className="font-bold">{score}</p><p>{label}</p></div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="biomarkers" className="mt-4 space-y-4">
          {[
            { marker: "LVEF (Fração de Ejeção do VE)", method: "Ecocardiograma (preferencial) ou RNM cardíaca", normal: "≥ 55%", lowNormal: "50-54%", mild: "40-49%", severe: "< 40%", note: "Queda ≥ 10% do basal ou queda para < 53% = CTRCD (ESC 2022)" },
            { marker: "Troponina I de Alta Sensibilidade", method: "Troponina de alta sensibilidade preferencial", normal: "< 0,04 ng/mL", lowNormal: "0,04-0,12 ng/mL", mild: "0,12-0,40 ng/mL", severe: "> 0,40 ng/mL", note: "Elevação acima do percentil 99 do LSR = significativa clinicamente" },
            { marker: "NT-proBNP / BNP", method: "Coleta em jejum, evitar exercício 24h antes", normal: "NT-proBNP < 125 pg/mL | BNP < 35 pg/mL", lowNormal: "NT-proBNP 125-400 | BNP 35-100", mild: "NT-proBNP 400-900 | BNP 100-400", severe: "NT-proBNP > 900 | BNP > 400", note: "Ajustar por idade (> 75 anos: NT-proBNP > 1800 pg/mL) e função renal" },
            { marker: "Intervalo QTc (ECG)", method: "ECG de 12 derivações — fórmula de Bazett ou Fridericia", normal: "< 450 ms (H) / < 460 ms (M)", lowNormal: "450-470 ms", mild: "470-500 ms", severe: "> 500 ms", note: "QTc > 500 ms: risco aumentado de torsades de pointes — suspender agente causador" },
          ].map((bm, i) => (
            <Card key={i}>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2"><Activity className="w-4 h-4 text-primary" />{bm.marker}</CardTitle>
                <p className="text-xs text-muted-foreground">{bm.method}</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
                  {[["Normal", bm.normal, "emerald"], ["Limítrofe", bm.lowNormal, "yellow"], ["Disfunção Leve", bm.mild, "orange"], ["Disfunção Grave", bm.severe, "red"]].map(([label, val, color]) => (
                    <div key={label} className={`bg-${color}-50 border border-${color}-200 rounded-lg p-3 text-center`}>
                      <p className={`text-xs font-semibold text-${color}-700 mb-1`}>{label}</p>
                      <p className={`text-xs text-${color}-800 font-mono`}>{val}</p>
                    </div>
                  ))}
                </div>
                <div className="flex items-start gap-2 bg-blue-50 rounded-lg px-3 py-2">
                  <Info className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-blue-800">{bm.note}</p>
                </div>
              </CardContent>
            </Card>
          ))}

          <Card className="border-red-200 bg-red-50">
            <CardHeader className="pb-2"><CardTitle className="text-base text-red-800 flex items-center gap-2"><AlertTriangle className="w-4 h-4" />Definição de CTRCD — ESC 2022</CardTitle></CardHeader>
            <CardContent className="text-sm text-red-800 space-y-2">
              <p className="font-semibold">Disfunção Cardíaca Relacionada ao Tratamento do Câncer (CTRCD):</p>
              <p>Queda da LVEF ≥ 10 pontos percentuais para um valor abaixo de 53%, confirmada por segunda avaliação em 2-4 semanas.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
                <div className="bg-white/70 rounded-lg p-3"><p className="font-semibold text-xs mb-1">CTRCD Assintomática</p><p className="text-xs">Queda de LVEF sem sintomas de IC — monitoramento intensivo, considerar IECAs/betabloqueadores</p></div>
                <div className="bg-white/70 rounded-lg p-3"><p className="font-semibold text-xs mb-1">CTRCD Sintomática</p><p className="text-xs">Queda de LVEF + sintomas de IC — suspensão do agente causador + tratamento de IC</p></div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cardiotoxicity-types" className="mt-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              { type: "Tipo I — Irreversível (Antracíclinas)", color: "bg-red-50 border-red-200", titleColor: "text-red-800", mechanism: "Morte celular por apoptose/necrose (dano estrutural permanente)", drugs: "Doxorrubicina, Epirrubicina, Daunorrubicina, Idarrubicina", chars: ["Dano dose-dependente e cumulativo", "Geralmente irreversível", "Lesão histológica: vacuolização, necrose miofibrilar", "Pode ocorrer meses a anos após o tratamento"], prevention: "Dexrazoxano (≥300 mg/m² doxorrubicina), formulação lipossomal, monitoramento LVEF obrigatório" },
              { type: "Tipo II — Reversível (Anti-HER2)", color: "bg-blue-50 border-blue-200", titleColor: "text-blue-800", mechanism: "Disfunção mitocondrial reversível (sem dano estrutural permanente)", drugs: "Trastuzumabe, Pertuzumabe, Lapatinibe, T-DM1, T-DXd", chars: ["Não dose-dependente", "Geralmente reversível com suspensão", "Sem lesão histológica específica", "Recuperação da LVEF em 2-4 meses após suspensão"], prevention: "LVEF a cada 3 meses, IECAs/betabloqueadores preventivos em alto risco" },
            ].map((type, i) => (
              <Card key={i} className={`border ${type.color}`}>
                <CardHeader><CardTitle className={`text-base ${type.titleColor}`}>{type.type}</CardTitle><p className="text-sm text-muted-foreground">{type.mechanism}</p></CardHeader>
                <CardContent className="space-y-3">
                  <div className="bg-white/80 rounded-lg p-3"><p className="text-xs font-semibold text-muted-foreground mb-1">Medicamentos</p><p className="text-sm font-medium">{type.drugs}</p></div>
                  <div className="space-y-1">{type.chars.map((c, j) => (<div key={j} className="flex items-start gap-2 text-sm"><ChevronRight className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0 mt-0.5" /><span>{c}</span></div>))}</div>
                  <div className="bg-white/80 rounded-lg p-3"><p className="text-xs font-semibold text-muted-foreground mb-1">Prevenção e Manejo</p><p className="text-sm">{type.prevention}</p></div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader><CardTitle className="text-base">Perfil de Cardiotoxicidade por Classe — ESC 2022</CardTitle></CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead><tr className="border-b">{["Classe", "Tipo", "Efeito Principal", "Monitoramento", "Risco"].map(h => <th key={h} className="text-left py-2 px-2 font-semibold">{h}</th>)}</tr></thead>
                  <tbody className="divide-y divide-border">
                    {[
                      ["Antracíclinas", "Tipo I", "Disfunção VE, IC, cardiomiopatia", "LVEF basal, a cada 3 ciclos, ao final", "muito_alto"],
                      ["Anti-HER2 (trastuzumabe)", "Tipo II", "Disfunção VE reversível", "LVEF a cada 3 meses", "alto"],
                      ["ICI (anti-PD1/PDL1)", "Misto", "Miocardite imune, pericardite, arritmia", "Troponina, ECG, LVEF se sintomas", "moderado"],
                      ["TKIs (sunitinibe, pazopanibe)", "Tipo II", "HAS, disfunção VE, QTc", "PA, ECG, LVEF basal e periódico", "alto"],
                      ["Anti-VEGF (bevacizumabe)", "Vascular", "HAS, TEV, isquemia miocárdica", "PA, sinais de TEV", "moderado"],
                      ["Fluoropirimidinas (5-FU)", "Vascular", "Vasoespasmo coronariano, isquemia", "ECG, troponina durante infusão", "moderado"],
                      ["Agentes alquilantes", "Tipo I", "Pericardite, IC aguda (alta dose)", "LVEF, ECG se dose alta", "moderado"],
                    ].map((row, i) => (
                      <tr key={i} className="hover:bg-muted/30">
                        <td className="py-2 px-2 font-medium">{row[0]}</td>
                        <td className="py-2 px-2"><Badge variant="outline" className="text-xs">{row[1]}</Badge></td>
                        <td className="py-2 px-2 text-muted-foreground">{row[2]}</td>
                        <td className="py-2 px-2 text-muted-foreground">{row[3]}</td>
                        <td className="py-2 px-2"><span className={`text-xs px-1.5 py-0.5 rounded font-medium ${row[4] === "muito_alto" ? "bg-red-100 text-red-800" : row[4] === "alto" ? "bg-orange-100 text-orange-800" : "bg-amber-100 text-amber-800"}`}>{row[4] === "muito_alto" ? "Muito Alto" : row[4] === "alto" ? "Alto" : "Moderado"}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="esc-algorithm" className="mt-4">
          <Card>
            <CardHeader><CardTitle className="text-base">Algoritmo de Avaliação Cardiovascular — ESC 2022</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { step: "1", title: "Avaliação Basal (Pré-tratamento)", color: "bg-blue-50 border-blue-200", stepBg: "bg-blue-600", items: ["História clínica e cardiovascular completa", "ECG de 12 derivações (QTc basal)", "Ecocardiograma transtorácico (LVEF basal)", "Troponina de alta sensibilidade", "NT-proBNP ou BNP", "Pressão arterial e frequência cardíaca", "Estratificação de risco cardiovascular (score ESC)"] },
                  { step: "2", title: "Durante o Tratamento", color: "bg-amber-50 border-amber-200", stepBg: "bg-amber-600", items: ["Monitoramento conforme nível de risco", "Antracíclinas: LVEF a cada 3 ciclos (alto risco) ou ao final (baixo risco)", "Trastuzumabe: LVEF a cada 3 meses", "TKIs: PA e ECG periódicos", "ICI: Troponina e ECG se sintomas cardíacos", "Avaliação de sintomas a cada consulta"] },
                  { step: "3", title: "Critérios para Suspensão do Tratamento", color: "bg-red-50 border-red-200", stepBg: "bg-red-600", items: ["LVEF < 40% (qualquer agente)", "Queda de LVEF ≥ 15% do basal", "IC sintomática (NYHA III-IV)", "Miocardite por ICI (grau ≥ 2)", "QTc > 500 ms ou prolongamento > 60 ms", "Hipertensão grau 3 não controlada"] },
                  { step: "4", title: "Após o Tratamento (Seguimento)", color: "bg-emerald-50 border-emerald-200", stepBg: "bg-emerald-600", items: ["Ecocardiograma ao final do tratamento", "Seguimento cardiológico por 5 anos (antracíclinas)", "Seguimento por 10 anos (radioterapia mediastinal)", "Avaliação de fatores de risco cardiovascular", "Estilo de vida e reabilitação cardiovascular"] },
                ].map((step) => (
                  <div key={step.step} className={`rounded-xl border p-4 ${step.color}`}>
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-sm font-bold ${step.stepBg}`}>{step.step}</div>
                      <p className="font-semibold">{step.title}</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                      {step.items.map((item, j) => (
                        <div key={j} className="flex items-start gap-2 text-sm">
                          <ChevronRight className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0 mt-0.5" />
                          <span className="text-muted-foreground">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
