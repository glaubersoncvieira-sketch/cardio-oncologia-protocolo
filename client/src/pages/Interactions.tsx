import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertTriangle, Zap, Info, ChevronRight } from "lucide-react";
import type { DrugInteractionData, MedicationData } from "../../../shared/clinicalData";

const severityConfig = {
  contraindicada: { label: "Contraindicada", cls: "bg-red-100 text-red-800 border-red-300", icon: "🚫" },
  grave: { label: "Grave", cls: "bg-orange-100 text-orange-800 border-orange-300", icon: "⚠️" },
  moderada: { label: "Moderada", cls: "bg-amber-100 text-amber-800 border-amber-300", icon: "⚡" },
  leve: { label: "Leve", cls: "bg-yellow-100 text-yellow-800 border-yellow-300", icon: "ℹ️" },
};

export default function InteractionsPage() {
  const [selectedMedId, setSelectedMedId] = useState("");
  const [filterSeverity, setFilterSeverity] = useState("all");

  const { data: medications } = trpc.clinical.getMedications.useQuery();
  const { data: allInteractions } = trpc.clinical.getDrugInteractions.useQuery({});
  const { data: medInteractions } = trpc.clinical.getDrugInteractions.useQuery(
    { medicationId: parseInt(selectedMedId) },
    { enabled: !!selectedMedId && !isNaN(parseInt(selectedMedId)) }
  );

  const displayInteractions = selectedMedId ? medInteractions : allInteractions;
  const filtered = displayInteractions?.filter((i: DrugInteractionData) =>
    filterSeverity === "all" || i.severity === filterSeverity
  );

  const qtInteractions = allInteractions?.filter((i: DrugInteractionData) => i.qtRisk);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Zap className="w-6 h-6 text-amber-500" />
          Interações Medicamentosas
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Interações cardiotóxicas relevantes — foco em prolongamento de QT e cardiotoxicidade aditiva
        </p>
      </div>

      {/* QT Risk Alert */}
      <Card className="border-red-200 bg-red-50">
        <CardHeader className="pb-2">
          <CardTitle className="text-base text-red-800 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            Alerta: Risco de Prolongamento de QT
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-red-800 mb-3">
            O prolongamento do intervalo QT pode levar a arritmias ventriculares graves (torsades de pointes). 
            Monitorar ECG antes e durante o tratamento com agentes de risco.
          </p>
          <div className="flex flex-wrap gap-2">
            {qtInteractions?.slice(0, 8).map((i: DrugInteractionData, idx: number) => (
              <Badge key={idx} className="bg-red-100 text-red-800 border-red-300 text-xs">
                {medications?.find((m: MedicationData) => m.id === i.drug1Id)?.genericName} + {i.drug2Name}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Select value={selectedMedId} onValueChange={setSelectedMedId}>
          <SelectTrigger className="flex-1">
            <SelectValue placeholder="Filtrar por medicamento oncológico..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os medicamentos</SelectItem>
            {medications?.map((m: MedicationData) => (
              <SelectItem key={m.id} value={String(m.id)}>{m.genericName}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filterSeverity} onValueChange={setFilterSeverity}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Gravidade..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as gravidades</SelectItem>
            <SelectItem value="contraindicada">Contraindicada</SelectItem>
            <SelectItem value="grave">Grave</SelectItem>
            <SelectItem value="moderada">Moderada</SelectItem>
            <SelectItem value="leve">Leve</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Interactions List */}
      <div className="space-y-3">
        {filtered?.length === 0 && (
          <Card><CardContent className="py-8 text-center text-muted-foreground">Nenhuma interação encontrada para os filtros selecionados.</CardContent></Card>
        )}
        {filtered?.map((interaction: DrugInteractionData, i: number) => {
          const drug1 = medications?.find((m: MedicationData) => m.id === interaction.drug1Id);
          const sev = severityConfig[interaction.severity];
          return (
            <Card key={i} className={`border ${interaction.severity === "contraindicada" ? "border-red-300 bg-red-50/30" : interaction.severity === "grave" ? "border-orange-300 bg-orange-50/30" : "border-border"}`}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-base">{sev.icon}</span>
                    <span className="font-bold text-sm">{drug1?.genericName || `Med #${interaction.drug1Id}`}</span>
                    <span className="text-muted-foreground text-sm">+</span>
                    <span className="font-bold text-sm">{interaction.drug2Name}</span>
                    {interaction.qtRisk && (
                      <Badge className="bg-purple-100 text-purple-800 border-purple-300 text-xs">⚡ Risco QT</Badge>
                    )}
                  </div>
                  <Badge className={`${sev.cls} text-xs border`}>{sev.label}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div className="bg-white/80 rounded-lg p-2.5 border">
                    <p className="text-xs font-semibold text-muted-foreground mb-1">Mecanismo</p>
                    <p className="text-xs">{interaction.mechanism}</p>
                  </div>
                  <div className="bg-white/80 rounded-lg p-2.5 border">
                    <p className="text-xs font-semibold text-muted-foreground mb-1">Efeito Clínico</p>
                    <p className="text-xs">{interaction.clinicalEffect}</p>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-2.5 border border-blue-200">
                    <p className="text-xs font-semibold text-blue-700 mb-1 flex items-center gap-1">
                      <ChevronRight className="w-3 h-3" />Conduta
                    </p>
                    <p className="text-xs text-blue-800">{interaction.management}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* QT Prolongation Guide */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Info className="w-4 h-4 text-blue-500" />
            Guia de Monitoramento do QTc
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="text-sm font-semibold">Valores de Referência do QTc</p>
              {[
                { range: "< 450 ms (H) / < 460 ms (M)", label: "Normal", cls: "bg-emerald-50 border-emerald-200 text-emerald-800" },
                { range: "450-470 ms", label: "Limítrofe", cls: "bg-yellow-50 border-yellow-200 text-yellow-800" },
                { range: "470-500 ms", label: "Prolongado", cls: "bg-orange-50 border-orange-200 text-orange-800" },
                { range: "> 500 ms", label: "Risco de TdP", cls: "bg-red-50 border-red-200 text-red-800" },
              ].map((v) => (
                <div key={v.range} className={`rounded-lg px-3 py-2 border text-xs flex justify-between ${v.cls}`}>
                  <span className="font-mono">{v.range}</span>
                  <span className="font-semibold">{v.label}</span>
                </div>
              ))}
            </div>
            <div className="space-y-2">
              <p className="text-sm font-semibold">Conduta por QTc</p>
              {[
                { qtc: "< 470 ms", action: "Manter tratamento, monitoramento padrão" },
                { qtc: "470-500 ms", action: "Corrigir eletrólitos (K+, Mg²+), revisar medicações concomitantes, ECG seriado" },
                { qtc: "> 500 ms ou Δ > 60 ms", action: "Suspender agente causador, avaliação cardiológica urgente, monitoramento contínuo" },
              ].map((v) => (
                <div key={v.qtc} className="bg-white rounded-lg p-2.5 border text-xs">
                  <p className="font-bold font-mono text-foreground">{v.qtc}</p>
                  <p className="text-muted-foreground mt-0.5">{v.action}</p>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
