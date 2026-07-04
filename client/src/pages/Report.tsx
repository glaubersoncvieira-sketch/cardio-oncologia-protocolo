import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/_core/hooks/useAuth";
import { FileText, Download, Printer, Heart, Activity, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

const riskColors = {
  baixo: "bg-emerald-100 text-emerald-800",
  moderado: "bg-amber-100 text-amber-800",
  alto: "bg-orange-100 text-orange-800",
  muito_alto: "bg-red-100 text-red-800",
};

export default function ReportPage() {
  const { isAuthenticated } = useAuth();
  const [selectedPatientId, setSelectedPatientId] = useState("");
  const { data: patients } = trpc.patients.list.useQuery(undefined, { enabled: isAuthenticated });
  const { data: patient } = trpc.patients.getById.useQuery(
    { id: parseInt(selectedPatientId) },
    { enabled: !!selectedPatientId && !isNaN(parseInt(selectedPatientId)) }
  );
  const { data: assessments } = trpc.assessments.listByPatient.useQuery(
    { patientId: parseInt(selectedPatientId) },
    { enabled: !!selectedPatientId && !isNaN(parseInt(selectedPatientId)) }
  );
  const { data: medications } = trpc.clinical.getMedications.useQuery();

  const handlePrint = () => {
    window.print();
    toast.success("Relatório enviado para impressão!");
  };

  const latestAssessment = assessments?.[0];

  if (!isAuthenticated) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <FileText className="w-12 h-12 text-muted-foreground" />
        <p className="text-lg font-semibold">Faça login para gerar relatórios</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="print:hidden">
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <FileText className="w-6 h-6 text-blue-500" />
          Relatório Clínico
        </h1>
        <p className="text-muted-foreground text-sm mt-1">Exportação de protocolo individualizado para prontuário</p>
      </div>

      {/* Patient selector */}
      <div className="print:hidden flex flex-col sm:flex-row gap-3">
        <Select value={selectedPatientId} onValueChange={setSelectedPatientId}>
          <SelectTrigger className="flex-1">
            <SelectValue placeholder="Selecionar paciente para gerar relatório..." />
          </SelectTrigger>
          <SelectContent>
            {patients?.map(p => (
              <SelectItem key={p.id} value={String(p.id)}>{p.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {patient && (
          <Button onClick={handlePrint} className="gap-2 print:hidden">
            <Printer className="w-4 h-4" />
            Imprimir / Salvar PDF
          </Button>
        )}
      </div>

      {!patient && (
        <Card className="print:hidden">
          <CardContent className="py-12 text-center text-muted-foreground">
            <FileText className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p>Selecione um paciente para gerar o relatório clínico.</p>
          </CardContent>
        </Card>
      )}

      {/* REPORT CONTENT - printable */}
      {patient && (
        <div className="space-y-5" id="report-content">
          {/* Header */}
          <div className="border-b-2 border-primary pb-4">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold text-foreground">Relatório de Cardio-Oncologia</h2>
                <p className="text-sm text-muted-foreground">Sistema de Protocolo Eletrônico · ESC 2022 · ASCO 2017 · SBOC 2026</p>
              </div>
              <div className="text-right text-xs text-muted-foreground">
                <p>Data: {new Date().toLocaleDateString("pt-BR")}</p>
                <p>Hora: {new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}</p>
              </div>
            </div>
          </div>

          {/* Patient Data */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Heart className="w-4 h-4 text-red-500" />
                Dados do Paciente
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
                <div><p className="text-xs text-muted-foreground">Nome</p><p className="font-semibold">{patient.name}</p></div>
                <div><p className="text-xs text-muted-foreground">Sexo</p><p className="font-semibold">{patient.sex || "—"}</p></div>
                <div><p className="text-xs text-muted-foreground">Peso</p><p className="font-semibold">{patient.weightKg ? `${patient.weightKg} kg` : "—"}</p></div>
                <div><p className="text-xs text-muted-foreground">Altura</p><p className="font-semibold">{patient.heightCm ? `${patient.heightCm} cm` : "—"}</p></div>
                <div><p className="text-xs text-muted-foreground">Creatinina</p><p className="font-semibold">{patient.creatinine ? `${patient.creatinine} mg/dL` : "—"}</p></div>
                <div>
                  <p className="text-xs text-muted-foreground">Risco Cardiovascular</p>
                  {patient.cardiovascularRisk ? (
                    <Badge className={`text-xs mt-0.5 ${riskColors[patient.cardiovascularRisk as keyof typeof riskColors] || ""}`}>
                      {patient.cardiovascularRisk.replace("_", " ")}
                    </Badge>
                  ) : <p className="font-semibold">—</p>}
                </div>
                <div className="col-span-2 sm:col-span-3">
                  <p className="text-xs text-muted-foreground">Diagnóstico Oncológico</p>
                  <p className="font-semibold">{patient.oncologicDiagnosis || "—"} {patient.tumorStage ? `(${patient.tumorStage})` : ""}</p>
                </div>
              </div>

              {/* Risk Factors */}
              {[patient.hypertension, patient.diabetes, patient.dyslipidemia, patient.smoking, patient.previousHeartDisease, patient.previousChemotherapy].some(Boolean) && (
                <div className="mt-3 pt-3 border-t">
                  <p className="text-xs text-muted-foreground mb-1">Fatores de Risco Cardiovascular</p>
                  <div className="flex flex-wrap gap-1">
                    {patient.hypertension && <Badge variant="outline" className="text-xs">Hipertensão</Badge>}
                    {patient.diabetes && <Badge variant="outline" className="text-xs">Diabetes</Badge>}
                    {patient.dyslipidemia && <Badge variant="outline" className="text-xs">Dislipidemia</Badge>}
                    {patient.smoking && <Badge variant="outline" className="text-xs">Tabagismo</Badge>}
                    {patient.previousHeartDisease && <Badge variant="outline" className="text-xs">Cardiopatia Prévia</Badge>}
                    {patient.previousChemotherapy && <Badge variant="outline" className="text-xs">QT Prévia</Badge>}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Baseline Values */}
          {(patient.baselineLvef || patient.baselineTroponin || patient.baselineBnp) && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Activity className="w-4 h-4 text-blue-500" />
                  Valores Basais (Pré-tratamento)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-3">
                  {patient.baselineLvef && (
                    <div className={`rounded-lg p-3 text-center border ${patient.baselineLvef >= 55 ? "bg-emerald-50 border-emerald-200" : patient.baselineLvef >= 50 ? "bg-amber-50 border-amber-200" : "bg-red-50 border-red-200"}`}>
                      <p className="text-xs text-muted-foreground">LVEF Basal</p>
                      <p className="text-lg font-bold">{patient.baselineLvef}%</p>
                    </div>
                  )}
                  {patient.baselineTroponin && (
                    <div className="rounded-lg p-3 text-center border bg-blue-50 border-blue-200">
                      <p className="text-xs text-muted-foreground">Troponina Basal</p>
                      <p className="text-lg font-bold">{patient.baselineTroponin} ng/mL</p>
                    </div>
                  )}
                  {patient.baselineBnp && (
                    <div className="rounded-lg p-3 text-center border bg-purple-50 border-purple-200">
                      <p className="text-xs text-muted-foreground">BNP Basal</p>
                      <p className="text-lg font-bold">{patient.baselineBnp} pg/mL</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Latest Assessment */}
          {latestAssessment && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-orange-500" />
                  Última Avaliação Cardíaca
                </CardTitle>
                <p className="text-xs text-muted-foreground">{new Date(latestAssessment.assessmentDate).toLocaleDateString("pt-BR")}</p>
              </CardHeader>
              <CardContent className="space-y-3">
                {latestAssessment.currentMedicationName && (
                  <div><p className="text-xs text-muted-foreground">Medicamento em Uso</p><p className="text-sm font-semibold">{latestAssessment.currentMedicationName}</p></div>
                )}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {latestAssessment.lvef && <div className="bg-white rounded p-2 border text-xs text-center"><p className="text-muted-foreground">LVEF</p><p className="font-bold">{latestAssessment.lvef}%</p></div>}
                  {latestAssessment.troponin && <div className="bg-white rounded p-2 border text-xs text-center"><p className="text-muted-foreground">Troponina</p><p className="font-bold">{latestAssessment.troponin}</p></div>}
                  {latestAssessment.bnp && <div className="bg-white rounded p-2 border text-xs text-center"><p className="text-muted-foreground">BNP</p><p className="font-bold">{latestAssessment.bnp}</p></div>}
                  {latestAssessment.qtcInterval && <div className="bg-white rounded p-2 border text-xs text-center"><p className="text-muted-foreground">QTc</p><p className="font-bold">{latestAssessment.qtcInterval} ms</p></div>}
                  {latestAssessment.systolicBp && <div className="bg-white rounded p-2 border text-xs text-center"><p className="text-muted-foreground">PA</p><p className="font-bold">{latestAssessment.systolicBp}/{latestAssessment.diastolicBp}</p></div>}
                </div>
                {latestAssessment.recommendation && (
                  <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                    <p className="text-xs font-semibold text-blue-700 mb-1">Recomendação</p>
                    <p className="text-sm text-blue-800">{latestAssessment.recommendation}</p>
                  </div>
                )}
                {latestAssessment.treatmentModification && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Modificação do Tratamento</p>
                    <Badge className={latestAssessment.treatmentModification === "manter" ? "bg-emerald-100 text-emerald-800" : latestAssessment.treatmentModification === "descontinuar" ? "bg-red-100 text-red-800" : "bg-amber-100 text-amber-800"}>
                      {latestAssessment.treatmentModification.replace("_", " ")}
                    </Badge>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Notes */}
          {patient.notes && (
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-base">Observações Clínicas</CardTitle></CardHeader>
              <CardContent><p className="text-sm">{patient.notes}</p></CardContent>
            </Card>
          )}

          {/* Footer */}
          <div className="border-t pt-4 text-xs text-muted-foreground">
            <p className="font-semibold mb-1">Referências</p>
            <p>[1] ESC Guidelines on Cardio-Oncology 2022 — European Heart Journal</p>
            <p>[2] ASCO Clinical Practice Guideline: Prevention and Monitoring of Cardiac Dysfunction 2017</p>
            <p>[3] Diretrizes SBOC 2026 — Sociedade Brasileira de Oncologia Clínica</p>
            <p>[4] CTCAE v5.0 — Common Terminology Criteria for Adverse Events (NCI/NIH)</p>
            <p className="mt-2 italic">Este relatório foi gerado pelo Sistema de Cardio-Oncologia e deve ser revisado pelo médico responsável antes de ser incorporado ao prontuário.</p>
          </div>
        </div>
      )}
    </div>
  );
}
