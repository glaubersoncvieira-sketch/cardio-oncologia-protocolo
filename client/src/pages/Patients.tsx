import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/_core/hooks/useAuth";
import { Link } from "wouter";
import { Users, Plus, Search, ChevronRight, Heart, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";

const riskColors = {
  baixo: "bg-emerald-100 text-emerald-800",
  moderado: "bg-amber-100 text-amber-800",
  alto: "bg-orange-100 text-orange-800",
  muito_alto: "bg-red-100 text-red-800",
};

const riskLabels = {
  baixo: "Baixo",
  moderado: "Moderado",
  alto: "Alto",
  muito_alto: "Muito Alto",
};

export default function PatientsPage() {
  const { isAuthenticated, user } = useAuth();
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const utils = trpc.useUtils();

  const { data: patients, isLoading } = trpc.patients.list.useQuery(undefined, { enabled: isAuthenticated });
  const createPatient = trpc.patients.create.useMutation({
    onSuccess: () => {
      toast.success("Paciente cadastrado com sucesso!");
      utils.patients.list.invalidate();
      setOpen(false);
      reset();
    },
    onError: (err) => toast.error(`Erro: ${err.message}`),
  });

  const { register, handleSubmit, reset, setValue, watch } = useForm({
    defaultValues: {
      name: "", birthDate: "", sex: "" as "masculino" | "feminino" | "outro" | "",
      weightKg: "", heightCm: "", creatinine: "",
      oncologicDiagnosis: "", tumorStage: "",
      hypertension: false, diabetes: false, dyslipidemia: false, smoking: false,
      previousHeartDisease: false, previousChemotherapy: false,
      cardiovascularRisk: "" as "baixo" | "moderado" | "alto" | "muito_alto" | "",
      notes: "",
    },
  });

  const onSubmit = (data: any) => {
    createPatient.mutate({
      name: data.name,
      birthDate: data.birthDate || undefined,
      sex: data.sex || undefined,
      weightKg: data.weightKg ? parseFloat(data.weightKg) : undefined,
      heightCm: data.heightCm ? parseFloat(data.heightCm) : undefined,
      creatinine: data.creatinine ? parseFloat(data.creatinine) : undefined,
      oncologicDiagnosis: data.oncologicDiagnosis || undefined,
      tumorStage: data.tumorStage || undefined,
      hypertension: data.hypertension,
      diabetes: data.diabetes,
      dyslipidemia: data.dyslipidemia,
      smoking: data.smoking,
      previousHeartDisease: data.previousHeartDisease,
      previousChemotherapy: data.previousChemotherapy,
      cardiovascularRisk: data.cardiovascularRisk || undefined,
      notes: data.notes || undefined,
    });
  };

  const filtered = patients?.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    (p.oncologicDiagnosis || "").toLowerCase().includes(search.toLowerCase())
  );

  if (!isAuthenticated) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Users className="w-12 h-12 text-muted-foreground" />
        <p className="text-lg font-semibold text-foreground">Faça login para gerenciar pacientes</p>
        <p className="text-sm text-muted-foreground text-center">O módulo de pacientes requer autenticação para proteger os dados clínicos.</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Users className="w-6 h-6 text-indigo-500" />
            Pacientes
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Gestão de pacientes com histórico de tratamentos e alertas cardiovasculares</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2"><Plus className="w-4 h-4" />Novo Paciente</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Cadastrar Novo Paciente</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-muted-foreground mb-1 block">Nome Completo *</label>
                  <Input {...register("name", { required: true })} placeholder="Nome do paciente" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground mb-1 block">Data de Nascimento</label>
                  <Input type="date" {...register("birthDate")} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground mb-1 block">Sexo</label>
                  <Select onValueChange={(v) => setValue("sex", v as any)}>
                    <SelectTrigger><SelectValue placeholder="Selecionar..." /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="masculino">Masculino</SelectItem>
                      <SelectItem value="feminino">Feminino</SelectItem>
                      <SelectItem value="outro">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground mb-1 block">Peso (kg)</label>
                  <Input type="number" step="0.1" {...register("weightKg")} placeholder="70" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground mb-1 block">Altura (cm)</label>
                  <Input type="number" {...register("heightCm")} placeholder="170" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground mb-1 block">Creatinina (mg/dL)</label>
                  <Input type="number" step="0.01" {...register("creatinine")} placeholder="1.0" />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-muted-foreground mb-1 block">Diagnóstico Oncológico</label>
                  <Input {...register("oncologicDiagnosis")} placeholder="Ex: Câncer de mama HER2+ estágio II" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground mb-1 block">Estadiamento</label>
                  <Input {...register("tumorStage")} placeholder="Ex: IIB, III, IV" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground mb-1 block">Risco Cardiovascular</label>
                  <Select onValueChange={(v) => setValue("cardiovascularRisk", v as any)}>
                    <SelectTrigger><SelectValue placeholder="Selecionar..." /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="baixo">Baixo</SelectItem>
                      <SelectItem value="moderado">Moderado</SelectItem>
                      <SelectItem value="alto">Alto</SelectItem>
                      <SelectItem value="muito_alto">Muito Alto</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-muted-foreground mb-2">Fatores de Risco Cardiovascular</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { field: "hypertension", label: "Hipertensão" },
                    { field: "diabetes", label: "Diabetes" },
                    { field: "dyslipidemia", label: "Dislipidemia" },
                    { field: "smoking", label: "Tabagismo" },
                    { field: "previousHeartDisease", label: "Cardiopatia Prévia" },
                    { field: "previousChemotherapy", label: "QT Prévia" },
                  ].map(({ field, label }) => (
                    <label key={field} className="flex items-center gap-2 text-sm cursor-pointer">
                      <input type="checkbox" {...register(field as any)} className="rounded" />
                      {label}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground mb-1 block">Observações</label>
                <textarea {...register("notes")} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[80px] resize-none" placeholder="Observações clínicas relevantes..." />
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => { setOpen(false); reset(); }}>Cancelar</Button>
                <Button type="submit" disabled={createPatient.isPending}>
                  {createPatient.isPending ? "Salvando..." : "Cadastrar Paciente"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input className="pl-9" placeholder="Buscar por nome ou diagnóstico..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {/* Patients List */}
      {isLoading && <p className="text-sm text-muted-foreground">Carregando pacientes...</p>}
      {!isLoading && filtered?.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Users className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">{search ? "Nenhum paciente encontrado para a busca." : "Nenhum paciente cadastrado ainda."}</p>
            {!search && <p className="text-xs text-muted-foreground mt-1">Clique em "Novo Paciente" para começar.</p>}
          </CardContent>
        </Card>
      )}

      <div className="space-y-2">
        {filtered?.map((patient) => {
          const riskFactors = [
            patient.hypertension && "HAS",
            patient.diabetes && "DM",
            patient.dyslipidemia && "Dislipidemia",
            patient.smoking && "Tabagismo",
            patient.previousHeartDisease && "Cardiopatia",
            patient.previousChemotherapy && "QT Prévia",
          ].filter(Boolean);

          return (
            <Link key={patient.id} href={`/patients/${patient.id}`}>
              <div className="flex items-center justify-between p-4 rounded-xl border border-border hover:bg-muted/30 cursor-pointer transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-primary">{patient.name.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{patient.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {patient.oncologicDiagnosis || "Diagnóstico não informado"}
                      {patient.tumorStage && ` · ${patient.tumorStage}`}
                    </p>
                    {riskFactors.length > 0 && (
                      <div className="flex gap-1 mt-1 flex-wrap">
                        {riskFactors.map((rf, i) => (
                          <span key={i} className="text-xs bg-muted text-muted-foreground px-1.5 py-0.5 rounded">{rf}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {patient.cardiovascularRisk && (
                    <Badge className={`text-xs ${riskColors[patient.cardiovascularRisk as keyof typeof riskColors] || ""}`}>
                      {riskLabels[patient.cardiovascularRisk as keyof typeof riskLabels] || patient.cardiovascularRisk}
                    </Badge>
                  )}
                  {(patient.cardiovascularRisk === "alto" || patient.cardiovascularRisk === "muito_alto") && (
                    <AlertTriangle className="w-4 h-4 text-orange-500" />
                  )}
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
