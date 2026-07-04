import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calculator, AlertTriangle, Heart, Activity, Info, ChevronRight } from "lucide-react";

export default function CalculatorPage() {
  // BSA Calculator
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [bsaFormula, setBsaFormula] = useState<"mosteller" | "dubois">("mosteller");

  // Dose Calculator
  const [selectedMedId, setSelectedMedId] = useState("");
  const [customDose, setCustomDose] = useState("");
  const [aucTarget, setAucTarget] = useState("");

  // Creatinine Clearance
  const [age, setAge] = useState("");
  const [creatinine, setCreatinine] = useState("");
  const [sex, setSex] = useState<"masculino" | "feminino" | "outro">("masculino");

  // Cumulative Doxorubicin
  const [doxoMg, setDoxoMg] = useState("");
  const [epiMg, setEpiMg] = useState("");
  const [daunoMg, setDaunoMg] = useState("");
  const [idarMg, setIdarMg] = useState("");

  // CV Risk
  const [selectedRiskFactors, setSelectedRiskFactors] = useState<string[]>([]);

  const { data: medications } = trpc.clinical.getMedications.useQuery();
  const { data: riskFactors } = trpc.clinical.getRiskFactors.useQuery();

  const bsaEnabled = !!weight && !!height;
  const { data: bsaResult } = trpc.calculator.calculateBSA.useQuery(
    { weightKg: parseFloat(weight), heightCm: parseFloat(height), formula: bsaFormula },
    { enabled: bsaEnabled && !isNaN(parseFloat(weight)) && !isNaN(parseFloat(height)) }
  );

  const crClEnabled = !!age && !!weight && !!creatinine;
  const { data: crClResult } = trpc.calculator.calculateCreatinineClearance.useQuery(
    { age: parseFloat(age), weightKg: parseFloat(weight), creatinine: parseFloat(creatinine), sex },
    { enabled: crClEnabled }
  );

  const doseEnabled = !!selectedMedId && bsaEnabled;
  const { data: doseResult } = trpc.calculator.calculateDose.useQuery(
    {
      medicationId: parseInt(selectedMedId),
      weightKg: parseFloat(weight),
      heightCm: parseFloat(height),
      bsaFormula,
      creatinine: creatinine ? parseFloat(creatinine) : undefined,
      age: age ? parseFloat(age) : undefined,
      sex,
      customDosePerM2: customDose ? parseFloat(customDose) : undefined,
      aucTarget: aucTarget ? parseFloat(aucTarget) : undefined,
    },
    { enabled: doseEnabled && !!parseInt(selectedMedId) }
  );

  const cumulEnabled = !!(doxoMg || epiMg || daunoMg || idarMg);
  const { data: cumulResult } = trpc.calculator.calculateCumulativeDoxorubicinEquivalent.useQuery(
    {
      doxorubicinMgM2: doxoMg ? parseFloat(doxoMg) : undefined,
      epirrubicinaMgM2: epiMg ? parseFloat(epiMg) : undefined,
      daunorrubicinaMgM2: daunoMg ? parseFloat(daunoMg) : undefined,
      idarrubicinaMgM2: idarMg ? parseFloat(idarMg) : undefined,
    },
    { enabled: cumulEnabled }
  );

  const { data: cvRiskResult } = trpc.calculator.calculateCardiovascularRisk.useQuery(
    { riskFactors: selectedRiskFactors },
    { enabled: true }
  );

  const riskColors: Record<string, string> = {
    baixo: "bg-emerald-100 text-emerald-800 border-emerald-300",
    moderado: "bg-amber-100 text-amber-800 border-amber-300",
    alto: "bg-orange-100 text-orange-800 border-orange-300",
    muito_alto: "bg-red-100 text-red-800 border-red-300",
  };

  const toggleRiskFactor = (name: string) => {
    setSelectedRiskFactors(prev =>
      prev.includes(name) ? prev.filter(f => f !== name) : [...prev, name]
    );
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Calculator className="w-6 h-6 text-primary" />
          Calculadora de Medicações
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          BSA (Mosteller/DuBois) · ClCr (Cockcroft-Gault) · Dose por m² · Calvert · Risco Cardiovascular
        </p>
      </div>

      <Tabs defaultValue="bsa-dose">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 max-w-2xl">
          <TabsTrigger value="bsa-dose">BSA & Dose</TabsTrigger>
          <TabsTrigger value="renal">Função Renal</TabsTrigger>
          <TabsTrigger value="cumulative">Dose Cumulativa</TabsTrigger>
          <TabsTrigger value="cv-risk">Risco CV</TabsTrigger>
        </TabsList>

        {/* BSA & Dose Tab */}
        <TabsContent value="bsa-dose" className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Dados Antropométricos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Peso (kg)</Label>
                    <Input type="number" placeholder="ex: 70" value={weight} onChange={e => setWeight(e.target.value)} className="mt-1" />
                  </div>
                  <div>
                    <Label>Altura (cm)</Label>
                    <Input type="number" placeholder="ex: 170" value={height} onChange={e => setHeight(e.target.value)} className="mt-1" />
                  </div>
                </div>
                <div>
                  <Label>Fórmula BSA</Label>
                  <Select value={bsaFormula} onValueChange={(v) => setBsaFormula(v as any)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mosteller">Mosteller: √(Altura × Peso / 3600)</SelectItem>
                      <SelectItem value="dubois">DuBois: 0,007184 × H^0,725 × P^0,425</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {bsaResult && (
                  <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 space-y-3">
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">Superfície Corporal (BSA)</p>
                      <p className="text-3xl font-bold text-primary">{bsaResult.bsa} m²</p>
                      <p className="text-xs text-muted-foreground">Fórmula: {bsaResult.formula === "mosteller" ? "Mosteller" : "DuBois"}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="bg-white rounded-lg p-2 text-center border">
                        <p className="text-xs text-muted-foreground">Mosteller</p>
                        <p className="font-bold">{bsaResult.mosteller} m²</p>
                      </div>
                      <div className="bg-white rounded-lg p-2 text-center border">
                        <p className="text-xs text-muted-foreground">DuBois</p>
                        <p className="font-bold">{bsaResult.dubois} m²</p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Cálculo de Dose</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Medicamento</Label>
                  <Select value={selectedMedId} onValueChange={setSelectedMedId}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Selecionar medicamento..." />
                    </SelectTrigger>
                    <SelectContent>
                      {medications?.map(m => (
                        <SelectItem key={m.id} value={String(m.id)}>
                          {m.genericName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Dose personalizada (mg/m²)</Label>
                    <Input type="number" placeholder="Opcional" value={customDose} onChange={e => setCustomDose(e.target.value)} className="mt-1" />
                  </div>
                  <div>
                    <Label>AUC alvo (Calvert)</Label>
                    <Input type="number" placeholder="ex: 5 ou 6" value={aucTarget} onChange={e => setAucTarget(e.target.value)} className="mt-1" />
                  </div>
                </div>

                {doseResult && (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 space-y-3">
                    <p className="font-semibold text-emerald-800">{doseResult.medication}</p>

                    {doseResult.calculatedDose && (
                      <div className="text-center bg-white rounded-lg p-3 border border-emerald-200">
                        <p className="text-xs text-muted-foreground">Dose Calculada (BSA)</p>
                        <p className="text-2xl font-bold text-emerald-700">{doseResult.calculatedDose} mg</p>
                        <p className="text-xs text-muted-foreground">BSA: {doseResult.bsa} m²</p>
                      </div>
                    )}

                    {doseResult.weightBasedDose && (
                      <div className="text-center bg-white rounded-lg p-3 border border-emerald-200">
                        <p className="text-xs text-muted-foreground">Dose por Peso</p>
                        <p className="text-2xl font-bold text-emerald-700">{doseResult.weightBasedDose} mg</p>
                      </div>
                    )}

                    {doseResult.aucDose && (
                      <div className="text-center bg-white rounded-lg p-3 border border-blue-200">
                        <p className="text-xs text-muted-foreground">Dose Calvert (AUC)</p>
                        <p className="text-2xl font-bold text-blue-700">{doseResult.aucDose} mg</p>
                        <p className="text-xs text-muted-foreground">ClCr: {doseResult.crCl} mL/min</p>
                      </div>
                    )}

                    <div className="text-xs text-muted-foreground bg-white rounded-lg p-2 border">
                      <p className="font-semibold text-foreground mb-1">Dose padrão de referência:</p>
                      <p className="font-mono">{doseResult.standardDose}</p>
                    </div>

                    {doseResult.warnings && doseResult.warnings.length > 0 && (
                      <div className="space-y-1">
                        {doseResult.warnings.map((w, i) => (
                          <div key={i} className="flex items-start gap-2 text-xs text-amber-700 bg-amber-50 rounded-lg px-2.5 py-2">
                            <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                            {w}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Renal Function Tab */}
        <TabsContent value="renal" className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Clearance de Creatinina — Cockcroft-Gault</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Idade (anos)</Label>
                    <Input type="number" placeholder="ex: 55" value={age} onChange={e => setAge(e.target.value)} className="mt-1" />
                  </div>
                  <div>
                    <Label>Peso (kg)</Label>
                    <Input type="number" placeholder="ex: 70" value={weight} onChange={e => setWeight(e.target.value)} className="mt-1" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Creatinina sérica (mg/dL)</Label>
                    <Input type="number" step="0.1" placeholder="ex: 0.9" value={creatinine} onChange={e => setCreatinine(e.target.value)} className="mt-1" />
                  </div>
                  <div>
                    <Label>Sexo</Label>
                    <Select value={sex} onValueChange={(v) => setSex(v as any)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="masculino">Masculino</SelectItem>
                        <SelectItem value="feminino">Feminino (×0,85)</SelectItem>
                        <SelectItem value="outro">Outro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {crClResult && (
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 space-y-2">
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">Clearance de Creatinina</p>
                      <p className="text-3xl font-bold text-blue-700">{crClResult.crCl} mL/min</p>
                    </div>
                    <div className={`text-center text-sm font-semibold rounded-lg py-2 ${
                      crClResult.crCl >= 90 ? "bg-emerald-100 text-emerald-800" :
                      crClResult.crCl >= 60 ? "bg-yellow-100 text-yellow-800" :
                      crClResult.crCl >= 30 ? "bg-orange-100 text-orange-800" :
                      "bg-red-100 text-red-800"
                    }`}>
                      {crClResult.renalFunction}
                    </div>
                    <div className="text-xs text-muted-foreground space-y-1 bg-white rounded-lg p-3 border">
                      <p className="font-semibold text-foreground">Ajustes de dose relevantes:</p>
                      <p>• Capecitabina: reduzir 25% se ClCr 30-50; contraindicada se &lt;30</p>
                      <p>• Olaparibe: reduzir para 200 mg 12/12h se ClCr 31-50</p>
                      <p>• Carboplatina: dose pela fórmula de Calvert (AUC × [ClCr + 25])</p>
                      <p>• Ciclofosfamida: reduzir 50% se ClCr &lt;10</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Fórmula de Calvert — Carboplatina</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-muted/50 rounded-xl p-4 font-mono text-sm text-center">
                  <p className="text-lg font-bold">Dose (mg) = AUC × (ClCr + 25)</p>
                  <p className="text-xs text-muted-foreground mt-1">Calvert et al., 1989</p>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="bg-blue-50 rounded-lg p-3">
                    <p className="font-semibold text-blue-800 mb-1">AUC alvo recomendado:</p>
                    <p className="text-blue-700">• AUC 5-6: 1ª linha (TCH, TCHP, carboplatina + paclitaxel)</p>
                    <p className="text-blue-700">• AUC 2: semanal (carboplatina + paclitaxel semanal)</p>
                    <p className="text-blue-700">• AUC 4-5: 2ª linha</p>
                  </div>
                  <div className="bg-amber-50 rounded-lg p-3">
                    <p className="font-semibold text-amber-800 mb-1">Dose máxima:</p>
                    <p className="text-amber-700">Limitar ClCr a 125 mL/min para evitar superdosagem</p>
                  </div>
                </div>
                {crClResult && (
                  <div className="space-y-2">
                    <p className="text-sm font-semibold">Doses calculadas com ClCr = {crClResult.crCl} mL/min:</p>
                    {[2, 4, 5, 6].map(auc => (
                      <div key={auc} className="flex justify-between items-center bg-white border rounded-lg px-3 py-2 text-sm">
                        <span className="text-muted-foreground">AUC {auc}</span>
                        <span className="font-bold text-primary font-mono">
                          {Math.round(auc * (Math.min(crClResult.crCl, 125) + 25))} mg
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Cumulative Dose Tab */}
        <TabsContent value="cumulative" className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Dose Cumulativa de Antracíclinas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Informe as doses cumulativas totais recebidas (em mg/m²) para calcular o equivalente em doxorrubicina.
                </p>
                <div className="space-y-3">
                  <div>
                    <Label>Doxorrubicina total (mg/m²)</Label>
                    <Input type="number" placeholder="ex: 240" value={doxoMg} onChange={e => setDoxoMg(e.target.value)} className="mt-1" />
                  </div>
                  <div>
                    <Label>Epirrubicina total (mg/m²) <span className="text-muted-foreground text-xs">(÷ 2 para equivalente)</span></Label>
                    <Input type="number" placeholder="ex: 300" value={epiMg} onChange={e => setEpiMg(e.target.value)} className="mt-1" />
                  </div>
                  <div>
                    <Label>Daunorrubicina total (mg/m²) <span className="text-muted-foreground text-xs">(÷ 2)</span></Label>
                    <Input type="number" placeholder="ex: 0" value={daunoMg} onChange={e => setDaunoMg(e.target.value)} className="mt-1" />
                  </div>
                  <div>
                    <Label>Idarrubicina total (mg/m²) <span className="text-muted-foreground text-xs">(× 5)</span></Label>
                    <Input type="number" placeholder="ex: 0" value={idarMg} onChange={e => setIdarMg(e.target.value)} className="mt-1" />
                  </div>
                </div>

                {cumulResult && (
                  <div className={`rounded-xl p-4 border-2 ${
                    cumulResult.totalEquivalent < 200 ? "bg-emerald-50 border-emerald-300" :
                    cumulResult.totalEquivalent < 300 ? "bg-yellow-50 border-yellow-300" :
                    cumulResult.totalEquivalent < 450 ? "bg-orange-50 border-orange-300" :
                    "bg-red-50 border-red-300"
                  }`}>
                    <div className="text-center mb-3">
                      <p className="text-xs text-muted-foreground">Equivalente Total de Doxorrubicina</p>
                      <p className={`text-3xl font-bold ${
                        cumulResult.totalEquivalent < 200 ? "text-emerald-700" :
                        cumulResult.totalEquivalent < 300 ? "text-yellow-700" :
                        cumulResult.totalEquivalent < 450 ? "text-orange-700" :
                        "text-red-700"
                      }`}>{cumulResult.totalEquivalent} mg/m²</p>
                      <p className="text-xs text-muted-foreground">Dose máxima segura: {cumulResult.maxSafe} mg/m²</p>
                    </div>
                    <div className={`text-center text-sm font-semibold rounded-lg py-2 ${
                      cumulResult.totalEquivalent < 200 ? "bg-emerald-100 text-emerald-800" :
                      cumulResult.totalEquivalent < 300 ? "bg-yellow-100 text-yellow-800" :
                      cumulResult.totalEquivalent < 450 ? "bg-orange-100 text-orange-800" :
                      "bg-red-100 text-red-800"
                    }`}>
                      {cumulResult.risk}
                    </div>
                    <p className="text-xs text-center mt-2 text-muted-foreground">{cumulResult.recommendation}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Referência: Risco por Dose Cumulativa</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { range: "< 200 mg/m²", risk: "Baixo risco", color: "bg-emerald-100 text-emerald-800", ic: "< 1%" },
                    { range: "200-300 mg/m²", risk: "Risco moderado", color: "bg-yellow-100 text-yellow-800", ic: "1-3%" },
                    { range: "300-450 mg/m²", risk: "Alto risco", color: "bg-orange-100 text-orange-800", ic: "3-7%" },
                    { range: "> 450 mg/m²", risk: "Muito alto risco", color: "bg-red-100 text-red-800", ic: "> 7-26%" },
                    { range: "> 550 mg/m²", risk: "Risco crítico", color: "bg-red-200 text-red-900", ic: "> 26%" },
                  ].map((item) => (
                    <div key={item.range} className={`flex items-center justify-between rounded-lg px-3 py-2.5 ${item.color}`}>
                      <div>
                        <p className="font-semibold text-sm">{item.range}</p>
                        <p className="text-xs opacity-80">{item.risk}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-semibold">IC sintomática</p>
                        <p className="text-sm font-bold">{item.ic}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-xs font-semibold text-blue-800 mb-1">Fatores que aumentam o risco:</p>
                  <p className="text-xs text-blue-700">Velocidade de infusão rápida, radioterapia mediastinal prévia, uso concomitante de trastuzumabe, idade &gt;65 anos, HAS, DM, doença cardíaca preexistente.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* CV Risk Tab */}
        <TabsContent value="cv-risk" className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Estratificação de Risco Cardiovascular — ESC 2022</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Selecione os fatores de risco presentes para calcular o nível de risco cardiovascular antes do tratamento oncológico.
                </p>
                <div className="space-y-2">
                  {riskFactors?.map((factor) => (
                    <button
                      key={factor.name}
                      onClick={() => toggleRiskFactor(factor.name)}
                      className={`w-full text-left px-3 py-2.5 rounded-lg border text-sm transition-all ${
                        selectedRiskFactors.includes(factor.name)
                          ? "bg-primary/10 border-primary/40 text-primary"
                          : "border-border hover:bg-muted"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{factor.name}</span>
                        <Badge variant="outline" className="text-xs ml-2">
                          Peso: {factor.weight}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{factor.description}</p>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Resultado da Estratificação</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cvRiskResult && (
                  <>
                    <div className={`rounded-xl p-5 border-2 text-center ${
                      cvRiskResult.level === "baixo" ? "bg-emerald-50 border-emerald-300" :
                      cvRiskResult.level === "moderado" ? "bg-amber-50 border-amber-300" :
                      cvRiskResult.level === "alto" ? "bg-orange-50 border-orange-300" :
                      "bg-red-50 border-red-300"
                    }`}>
                      <p className="text-xs text-muted-foreground mb-1">Score Total</p>
                      <p className={`text-4xl font-bold ${
                        cvRiskResult.level === "baixo" ? "text-emerald-700" :
                        cvRiskResult.level === "moderado" ? "text-amber-700" :
                        cvRiskResult.level === "alto" ? "text-orange-700" :
                        "text-red-700"
                      }`}>{cvRiskResult.score}</p>
                      <p className={`text-lg font-semibold mt-2 ${
                        cvRiskResult.level === "baixo" ? "text-emerald-800" :
                        cvRiskResult.level === "moderado" ? "text-amber-800" :
                        cvRiskResult.level === "alto" ? "text-orange-800" :
                        "text-red-800"
                      }`}>
                        Risco {cvRiskResult.level === "muito_alto" ? "Muito Alto" :
                          cvRiskResult.level.charAt(0).toUpperCase() + cvRiskResult.level.slice(1)}
                      </p>
                    </div>

                    <div className="bg-muted/50 rounded-xl p-4">
                      <p className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                        <ChevronRight className="w-4 h-4 text-primary" />
                        Recomendação (ESC 2022)
                      </p>
                      <p className="text-sm text-muted-foreground leading-relaxed">{cvRiskResult.recommendation}</p>
                    </div>

                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Níveis de Risco ESC 2022</p>
                      {[
                        { level: "Baixo", score: "0", color: "bg-emerald-100 text-emerald-800", action: "Monitoramento padrão" },
                        { level: "Moderado", score: "1-2", color: "bg-amber-100 text-amber-800", action: "Monitoramento reforçado" },
                        { level: "Alto", score: "3-4", color: "bg-orange-100 text-orange-800", action: "Avaliação cardiológica" },
                        { level: "Muito Alto", score: "≥5", color: "bg-red-100 text-red-800", action: "Cardio-oncologista obrigatório" },
                      ].map(item => (
                        <div key={item.level} className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm ${item.color}`}>
                          <div>
                            <span className="font-semibold">{item.level}</span>
                            <span className="text-xs ml-2 opacity-75">(score {item.score})</span>
                          </div>
                          <span className="text-xs">{item.action}</span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
