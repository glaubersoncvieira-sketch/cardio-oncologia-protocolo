import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useParams, Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Heart, Activity, Plus, AlertTriangle, Stethoscope } from "lucide-react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";

const riskColors = {
  baixo: "bg-emerald-100 text-emerald-800",
  moderado: "bg-amber-100 text-amber-800",
  alto: "bg-orange-100 text-orange-800",
  muito_alto: "bg-red-100 text-red-800",
};

export default function PatientDetailPage() {
  const params = useParams<{ id: string }>();
  const patientId = parseInt(params.id || "0");
  const [assessmentOpen, setAssessmentOpen] = useState(false);
  const utils = trpc.useUtils();

  const { data: patient, isLoading } = trpc.patients.getById.useQuery({ id: patientId }, { enabled: !!patientId });
  const { data: assessments } = trpc.assessments.listByPatient.useQuery({ patientId }, { enabled: !!patientId });
  const { data: medications } = trpc.clinical.getMedications.useQuery();

  const createAssessment = trpc.assessments.create.useMutation({
    onSuccess: () => {
      toast.success("Avaliação registrada com sucesso!");
      utils.assessments.listByPatient.invalidate({ patientId });
      setAssessmentOpen(false);
      reset();
    },
    onError: (err) => toast.error(`Erro: ${err.message}`),
  });

  const { register, handleSubmit, reset, setValue } = useForm({
    defaultValues: {
      currentMedicationName: "", treatmentCycle: "", cumulativeDose: "",
      lvef: "", troponin: "", bnp: "", qtcInterval: "",
      systolicBp: "", diastolicBp: "", heartRate: "",
      dyspnea: false, chestPain: false, palpitations: false, edema: false,
      ctcaeToxicity: "", ctcaeGrade: "",
      treatmentModification: "" as any,
      recommendation: "", notes: "",
    },
  });

  const onSubmit = (data: any) => {
    createAssessment.mutate({
      patientId,
      currentMedicationName: data.currentMedicationName || undefined,
      treatmentCycle: data.treatmentCycle ? parseInt(data.treatmentCycle) : undefined,
      cumulativeDose: data.cumulativeDose ? parseFloat(data.cumulativeDose) : undefined,
      lvef: data.lvef ? parseFloat(data.lvef) : undefined,
      troponin: data.troponin ? parseFloat(data.troponin) : undefined,
      bnp: data.bnp ? parseFloat(data.bnp) : undefined,
      qtcInterval: data.qtcInterval ? parseFloat(data.qtcInterval) : undefined,
      systolicBp: data.systolicBp ? parseInt(data.systolicBp) : undefined,
      diastolicBp: data.diastolicBp ? parseInt(data.diastolicBp) : undefined,
      heartRate: data.heartRate ? parseInt(data.heartRate) : undefined,
      dyspnea: data.dyspnea, chestPain: data.chestPain, palpitations: data.palpitations, edema: data.edema,
      ctcaeToxicity: data.ctcaeToxicity || undefined,
      ctcaeGrade: data.ctcaeGrade ? parseInt(data.ctcaeGrade) : undefined,
      treatmentModification: data.treatmentModification || undefined,
      recommendation: data.recommendation || undefined,
      notes: data.notes || undefined,
    });
  };

  if (isLoading) return <div className="p-6 text-muted-foreground">Carregando...</div>;
  if (!patient) return <div className="p-6 text-muted-foreground">Paciente não encontrado.</div>;

  const riskFactors = [
    patient.hypertension && "Hipertensão",
    patient.diabetes && "Diabetes",
    patient.dyslipidemia && "Dislipidemia",
    patient.smoking && "Tabagismo",
    patient.previousHeartDisease && "Cardiopatia Prévia",
    patient.previousChemotherapy && "QT Prévia",
  ].filter(Boolean);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/patients">
          <Button variant="ghost" size="sm" className="gap-1"><ArrowLeft className="w-4 h-4" />Voltar</Button>
        </Link>
        <div>
          <h1 className="text-xl font-bold text-foreground">{patient.name}</h1>
          <p className="text-sm text-muted-foreground">{patient.oncologicDiagnosis || "Diagnóstico não informado"}</p>
        </div>
        {patient.cardiovascularRisk && (
          <Badge className={`ml-auto ${riskColors[patient.cardiovascularRisk as keyof typeof riskColors] || ""}`}>
            Risco CV: {patient.cardiovascularRisk.replace("_", " ")}
          </Badge>
        )}
      </div>

      {/* Patient Info */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Peso", value: patient.weightKg ? `${patient.weightKg} kg` : "—" },
          { label: "Altura", value: patient.heightCm ? `${patient.heightCm} cm` : "—" },
          { label: "Creatinina", value: patient.creatinine ? `${patient.creatinine} mg/dL` : "—" },
          { label: "Estadiamento", value: patient.tumorStage || "—" },
          { label: "LVEF Basal", value: patient.baselineLvef ? `${patient.baselineLvef}%` : "—" },
          { label: "Troponina Basal", value: patient.baselineTroponin ? `${patient.baselineTroponin} ng/mL` : "—" },
          { label: "BNP Basal", value: patient.baselineBnp ? `${patient.baselineBnp} pg/mL` : "—" },
          { label: "Sexo", value: patient.sex || "—" },
        ].map(({ label, value }) => (
          <Card key={label}>
            <CardContent className="pt-3 pb-3">
              <p className="text-xs text-muted-foreground">{label}</p>
              <p className="text-sm font-semibold text-foreground mt-0.5">{value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Risk Factors */}
      {riskFactors.length > 0 && (
        <Card>
          <CardContent className="pt-4">
            <p className="text-xs font-semibold text-muted-foreground mb-2">Fatores de Risco Cardiovascular</p>
            <div className="flex flex-wrap gap-2">
              {riskFactors.map((rf, i) => (
                <Badge key={i} variant="outline" className="text-xs">{rf}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Assessments */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">Avaliações Cardíacas</h2>
        <Dialog open={assessmentOpen} onOpenChange={setAssessmentOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-1"><Plus className="w-3.5 h-3.5" />Nova Avaliação</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>Registrar Avaliação Cardíaca</DialogTitle></DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-muted-foreground mb-1 block">Medicamento em Uso</label>
                  <Input {...register("currentMedicationName")} placeholder="Ex: Doxorrubicina 60 mg/m²" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground mb-1 block">Ciclo de Tratamento</label>
                  <Input type="number" {...register("treatmentCycle")} placeholder="Ex: 3" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground mb-1 block">Dose Cumulativa (mg/m²)</label>
                  <Input type="number" step="0.1" {...register("cumulativeDose")} placeholder="Ex: 180" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground mb-1 block">LVEF (%)</label>
                  <Input type="number" step="0.1" {...register("lvef")} placeholder="Ex: 58" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground mb-1 block">Troponina (ng/mL)</label>
                  <Input type="number" step="0.001" {...register("troponin")} placeholder="Ex: 0.02" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground mb-1 block">BNP/NT-proBNP (pg/mL)</label>
                  <Input type="number" step="1" {...register("bnp")} placeholder="Ex: 120" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground mb-1 block">QTc (ms)</label>
                  <Input type="number" {...register("qtcInterval")} placeholder="Ex: 440" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground mb-1 block">PA Sistólica (mmHg)</label>
                  <Input type="number" {...register("systolicBp")} placeholder="Ex: 130" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground mb-1 block">PA Diastólica (mmHg)</label>
                  <Input type="number" {...register("diastolicBp")} placeholder="Ex: 85" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground mb-1 block">FC (bpm)</label>
                  <Input type="number" {...register("heartRate")} placeholder="Ex: 72" />
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-muted-foreground mb-2">Sintomas</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[["dyspnea", "Dispneia"], ["chestPain", "Dor Torácica"], ["palpitations", "Palpitações"], ["edema", "Edema"]].map(([field, label]) => (
                    <label key={field} className="flex items-center gap-2 text-sm cursor-pointer">
                      <input type="checkbox" {...register(field as any)} className="rounded" />
                      {label}
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground mb-1 block">Toxicidade CTCAE</label>
                  <Input {...register("ctcaeToxicity")} placeholder="Ex: Disfunção Ventricular" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground mb-1 block">Grau CTCAE</label>
                  <Select onValueChange={(v) => setValue("ctcaeGrade", v as any)}>
                    <SelectTrigger><SelectValue placeholder="Grau..." /></SelectTrigger>
                    <SelectContent>
                      {[1,2,3,4,5].map(g => <SelectItem key={g} value={String(g)}>Grau {g}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-muted-foreground mb-1 block">Modificação do Tratamento</label>
                  <Select onValueChange={(v) => setValue("treatmentModification", v as any)}>
                    <SelectTrigger><SelectValue placeholder="Selecionar..." /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="manter">Manter tratamento</SelectItem>
                      <SelectItem value="reduzir_dose">Reduzir dose</SelectItem>
                      <SelectItem value="suspender_temporario">Suspender temporariamente</SelectItem>
                      <SelectItem value="descontinuar">Descontinuar definitivamente</SelectItem>
                      <SelectItem value="aguardar">Aguardar/Avaliar</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-muted-foreground mb-1 block">Recomendação</label>
                  <textarea {...register("recommendation")} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[60px] resize-none" placeholder="Recomendação clínica..." />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-muted-foreground mb-1 block">Notas</label>
                  <textarea {...register("notes")} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[60px] resize-none" placeholder="Notas adicionais..." />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => { setAssessmentOpen(false); reset(); }}>Cancelar</Button>
                <Button type="submit" disabled={createAssessment.isPending}>
                  {createAssessment.isPending ? "Salvando..." : "Registrar Avaliação"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {assessments?.length === 0 && (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            <Stethoscope className="w-8 h-8 mx-auto mb-2 opacity-40" />
            <p>Nenhuma avaliação registrada ainda.</p>
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        {assessments?.map((a, i) => (
          <Card key={i} className={a.ctcaeGrade && a.ctcaeGrade >= 3 ? "border-red-200 bg-red-50/30" : "border-border"}>
            <CardContent className="pt-4">
              <div className="flex items-start justify-between gap-2 mb-3">
                <div>
                  <p className="text-sm font-semibold">{a.currentMedicationName || "Avaliação Geral"}</p>
                  <p className="text-xs text-muted-foreground">{new Date(a.assessmentDate).toLocaleDateString("pt-BR")} {a.treatmentCycle ? `· Ciclo ${a.treatmentCycle}` : ""}</p>
                </div>
                {a.treatmentModification && (
                  <Badge className={`text-xs ${a.treatmentModification === "manter" ? "bg-emerald-100 text-emerald-800" : a.treatmentModification === "descontinuar" ? "bg-red-100 text-red-800" : "bg-amber-100 text-amber-800"}`}>
                    {a.treatmentModification.replace("_", " ")}
                  </Badge>
                )}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {a.lvef && <div className="bg-white rounded p-2 border text-xs"><p className="text-muted-foreground">LVEF</p><p className="font-bold">{a.lvef}%</p></div>}
                {a.troponin && <div className="bg-white rounded p-2 border text-xs"><p className="text-muted-foreground">Troponina</p><p className="font-bold">{a.troponin} ng/mL</p></div>}
                {a.bnp && <div className="bg-white rounded p-2 border text-xs"><p className="text-muted-foreground">BNP</p><p className="font-bold">{a.bnp} pg/mL</p></div>}
                {a.qtcInterval && <div className={`rounded p-2 border text-xs ${a.qtcInterval > 500 ? "bg-red-50 border-red-200" : "bg-white"}`}><p className="text-muted-foreground">QTc</p><p className="font-bold">{a.qtcInterval} ms</p></div>}
                {a.systolicBp && <div className="bg-white rounded p-2 border text-xs"><p className="text-muted-foreground">PA</p><p className="font-bold">{a.systolicBp}/{a.diastolicBp} mmHg</p></div>}
              </div>
              {a.recommendation && (
                <div className="mt-3 bg-blue-50 rounded-lg p-2.5 border border-blue-200">
                  <p className="text-xs font-semibold text-blue-700 mb-0.5">Recomendação</p>
                  <p className="text-xs text-blue-800">{a.recommendation}</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
