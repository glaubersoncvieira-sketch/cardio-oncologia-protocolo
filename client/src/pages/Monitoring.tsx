import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Activity, Heart, FlaskConical, Stethoscope, CheckCircle } from "lucide-react";

export default function MonitoringPage() {
  const [selectedMedId, setSelectedMedId] = useState("");
  const { data: medications } = trpc.clinical.getMedications.useQuery();
  const { data: schedule } = trpc.clinical.getMonitoringSchedule.useQuery(
    { medicationId: parseInt(selectedMedId) },
    { enabled: !!selectedMedId && !isNaN(parseInt(selectedMedId)) }
  );

  const generalSchedule = [
    {
      phase: "Pré-tratamento (Basal)",
      color: "bg-blue-50 border-blue-200",
      items: [
        { exam: "Ecocardiograma transtorácico", mandatory: true, note: "LVEF basal obrigatória para antracíclinas e anti-HER2" },
        { exam: "ECG de 12 derivações", mandatory: true, note: "QTc basal — especialmente para TKIs e ICI" },
        { exam: "Troponina I de alta sensibilidade", mandatory: true, note: "Basal para todos os agentes cardiotóxicos" },
        { exam: "NT-proBNP ou BNP", mandatory: true, note: "Basal para antracíclinas e anti-HER2" },
        { exam: "Pressão arterial", mandatory: true, note: "Especialmente para TKIs e anti-VEGF" },
        { exam: "Hemograma completo", mandatory: true, note: "Função medular basal" },
        { exam: "Função renal (creatinina, ClCr)", mandatory: true, note: "Ajuste de dose e risco de toxicidade" },
        { exam: "Função hepática (TGO, TGP, bilirrubinas)", mandatory: true, note: "Ajuste de dose hepático" },
        { exam: "Eletrólitos (K+, Mg²+)", mandatory: false, note: "Especialmente para agentes com risco de QTc" },
      ],
    },
    {
      phase: "Durante o Tratamento",
      color: "bg-amber-50 border-amber-200",
      items: [
        { exam: "LVEF (ecocardiograma)", mandatory: true, note: "Antracíclinas: a cada 3 ciclos (alto risco) ou ao final (baixo risco). Anti-HER2: a cada 3 meses" },
        { exam: "ECG", mandatory: false, note: "A cada ciclo para agentes com risco de QTc (TKIs, ICI)" },
        { exam: "Troponina", mandatory: false, note: "A cada ciclo para antracíclinas em alto risco; se sintomas para ICI" },
        { exam: "BNP/NT-proBNP", mandatory: false, note: "Se sintomas de IC ou queda de LVEF" },
        { exam: "Pressão arterial", mandatory: true, note: "A cada consulta — especialmente TKIs e anti-VEGF" },
        { exam: "Hemograma", mandatory: true, note: "A cada ciclo — toxicidade hematológica" },
        { exam: "Função renal e hepática", mandatory: true, note: "A cada ciclo ou conforme protocolo" },
        { exam: "Eletrólitos", mandatory: false, note: "Se QTc prolongado ou uso de diuréticos" },
      ],
    },
    {
      phase: "Ao Final do Tratamento",
      color: "bg-purple-50 border-purple-200",
      items: [
        { exam: "Ecocardiograma final", mandatory: true, note: "Obrigatório para antracíclinas e anti-HER2" },
        { exam: "ECG final", mandatory: false, note: "Se QTc alterado durante o tratamento" },
        { exam: "Troponina e BNP", mandatory: false, note: "Se suspeita de cardiotoxicidade" },
        { exam: "Hemograma e bioquímica completa", mandatory: true, note: "Avaliação de toxicidade residual" },
      ],
    },
    {
      phase: "Seguimento Pós-tratamento",
      color: "bg-emerald-50 border-emerald-200",
      items: [
        { exam: "Ecocardiograma anual (5 anos)", mandatory: true, note: "Antracíclinas — risco de cardiotoxicidade tardia" },
        { exam: "Ecocardiograma anual (10 anos)", mandatory: false, note: "Radioterapia mediastinal — doença coronariana tardia" },
        { exam: "Avaliação de fatores de risco CV", mandatory: true, note: "HAS, DM, dislipidemia, tabagismo — a cada consulta" },
        { exam: "ECG anual", mandatory: false, note: "Sobreviventes de longo prazo com risco de arritmia" },
        { exam: "Rastreamento de DAC", mandatory: false, note: "Radioterapia mediastinal: angiotomografia ou cintilografia após 10 anos" },
      ],
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Activity className="w-6 h-6 text-purple-500" />
          Protocolo de Monitoramento Cardíaco
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Cronograma de exames durante e após o tratamento oncológico — ESC 2022
        </p>
      </div>

      {/* Medication-specific schedule */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Cronograma por Medicamento</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Select value={selectedMedId} onValueChange={setSelectedMedId}>
            <SelectTrigger>
              <SelectValue placeholder="Selecionar medicamento para ver cronograma específico..." />
            </SelectTrigger>
            <SelectContent>
              {medications?.filter(m => m.lvefMonitoring || m.cardiotoxicityRisk === "alto" || m.cardiotoxicityRisk === "muito_alto").map(m => (
                <SelectItem key={m.id} value={String(m.id)}>{m.genericName}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {schedule && schedule.length > 0 && (
            <div className="space-y-3">
              <p className="text-sm font-semibold text-foreground">
                Cronograma específico para {medications?.find(m => m.id === parseInt(selectedMedId))?.genericName}:
              </p>
              {schedule.map((s, i) => (
                <div key={i} className="border border-border rounded-xl p-4">
                  <p className="text-sm font-bold text-foreground mb-3">{s.timepoint}</p>
                  <div className="flex flex-wrap gap-2">
                    {s.echocardiogram && <Badge className="bg-blue-100 text-blue-800 border-blue-200 gap-1"><Heart className="w-3 h-3" />Ecocardiograma</Badge>}
                    {s.ecg && <Badge className="bg-purple-100 text-purple-800 border-purple-200 gap-1"><Activity className="w-3 h-3" />ECG</Badge>}
                    {s.troponin && <Badge className="bg-red-100 text-red-800 border-red-200 gap-1"><FlaskConical className="w-3 h-3" />Troponina</Badge>}
                    {s.bnp && <Badge className="bg-orange-100 text-orange-800 border-orange-200 gap-1"><FlaskConical className="w-3 h-3" />BNP/NT-proBNP</Badge>}
                    {s.bloodPressure && <Badge className="bg-teal-100 text-teal-800 border-teal-200 gap-1"><Stethoscope className="w-3 h-3" />Pressão Arterial</Badge>}
                    {s.cbc && <Badge className="bg-gray-100 text-gray-800 border-gray-200 gap-1"><FlaskConical className="w-3 h-3" />Hemograma</Badge>}
                    {s.renalFunction && <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 gap-1"><FlaskConical className="w-3 h-3" />Função Renal</Badge>}
                    {s.hepaticFunction && <Badge className="bg-amber-100 text-amber-800 border-amber-200 gap-1"><FlaskConical className="w-3 h-3" />Função Hepática</Badge>}
                  </div>
                  {s.notes && <p className="text-xs text-muted-foreground mt-2 italic">{s.notes}</p>}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* General monitoring schedule */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Protocolo Geral de Monitoramento</h2>
        {generalSchedule.map((phase, i) => (
          <Card key={i} className={`border ${phase.color}`}>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">{phase.phase}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {phase.items.map((item, j) => (
                  <div key={j} className="flex items-start gap-3 p-2.5 rounded-lg bg-white/60 border border-white">
                    <CheckCircle className={`w-4 h-4 flex-shrink-0 mt-0.5 ${item.mandatory ? "text-emerald-600" : "text-gray-400"}`} />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-medium">{item.exam}</p>
                        {item.mandatory && <Badge className="text-xs bg-emerald-100 text-emerald-800 border-emerald-200">Obrigatório</Badge>}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{item.note}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Monitoring by risk level */}
      <Card>
        <CardHeader><CardTitle className="text-base">Frequência de Monitoramento por Nível de Risco (ESC 2022)</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 pr-4 font-semibold">Nível de Risco</th>
                  <th className="text-left py-2 px-3 font-semibold">Ecocardiograma</th>
                  <th className="text-left py-2 px-3 font-semibold">Troponina</th>
                  <th className="text-left py-2 pl-3 font-semibold">BNP/NT-proBNP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {[
                  { risk: "Baixo", color: "bg-emerald-100 text-emerald-800", echo: "Basal + ao final", troponin: "Basal", bnp: "Basal" },
                  { risk: "Moderado", color: "bg-amber-100 text-amber-800", echo: "Basal + a cada 3 meses", troponin: "Basal + a cada 3 ciclos", bnp: "Basal + se sintomas" },
                  { risk: "Alto", color: "bg-orange-100 text-orange-800", echo: "Basal + a cada 6 semanas", troponin: "Basal + a cada ciclo", bnp: "Basal + a cada 3 meses" },
                  { risk: "Muito Alto", color: "bg-red-100 text-red-800", echo: "Basal + semanal (inicial)", troponin: "Basal + a cada ciclo", bnp: "Basal + a cada ciclo" },
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-muted/30">
                    <td className="py-2 pr-4"><span className={`text-xs px-2 py-1 rounded font-semibold ${row.color}`}>{row.risk}</span></td>
                    <td className="py-2 px-3 text-sm">{row.echo}</td>
                    <td className="py-2 px-3 text-sm">{row.troponin}</td>
                    <td className="py-2 pl-3 text-sm">{row.bnp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
