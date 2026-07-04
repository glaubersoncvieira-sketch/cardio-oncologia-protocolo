import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/_core/hooks/useAuth";
import { Link } from "wouter";
import { Users, Heart, Activity, AlertTriangle, Calculator, BookOpen, Stethoscope, Zap, FileText, ChevronRight } from "lucide-react";

const riskColors = {
  baixo: "bg-emerald-100 text-emerald-800 border-emerald-300",
  moderado: "bg-amber-100 text-amber-800 border-amber-300",
  alto: "bg-orange-100 text-orange-800 border-orange-300",
  muito_alto: "bg-red-100 text-red-800 border-red-300",
};

const riskLabels = {
  baixo: "Baixo",
  moderado: "Moderado",
  alto: "Alto",
  muito_alto: "Muito Alto",
};

export default function DashboardPage() {
  const { user } = useAuth();
  const { data: patients } = trpc.patients.list.useQuery();
  // Stats computed from patients list
  const totalPatients = patients?.length || 0;
  const highRiskPatients = patients?.filter(p => p.cardiovascularRisk === "alto" || p.cardiovascularRisk === "muito_alto").length || 0;

  const modules = [
    { title: "Protocolo de Medicamentos", desc: "Base completa de medicamentos oncológicos com mecanismo de ação, doses e cardiotoxicidade", icon: BookOpen, color: "bg-blue-50 border-blue-200 hover:bg-blue-100", iconColor: "text-blue-600", href: "/protocol" },
    { title: "Calculadora de Dose BSA", desc: "Cálculo de dose por superfície corporal (Mosteller/DuBois) com ajuste renal e hepático", icon: Calculator, color: "bg-purple-50 border-purple-200 hover:bg-purple-100", iconColor: "text-purple-600", href: "/calculator" },
    { title: "Cardio-Oncologia", desc: "Estratificação de risco cardiovascular ESC 2022, biomarcadores e tipos de cardiotoxicidade", icon: Heart, color: "bg-red-50 border-red-200 hover:bg-red-100", iconColor: "text-red-600", href: "/cardio-oncology" },
    { title: "Monitoramento Cardíaco", desc: "Cronograma de ecocardiograma, ECG e exames laboratoriais durante e após o tratamento", icon: Activity, color: "bg-teal-50 border-teal-200 hover:bg-teal-100", iconColor: "text-teal-600", href: "/monitoring" },
    { title: "Toxicidades CTCAE v5.0", desc: "Classificação e manejo de toxicidades cardíacas por grau com conduta clínica específica", icon: AlertTriangle, color: "bg-orange-50 border-orange-200 hover:bg-orange-100", iconColor: "text-orange-600", href: "/ctcae" },
    { title: "Interações Medicamentosas", desc: "Interações cardiotóxicas relevantes com foco em prolongamento de QT", icon: Zap, color: "bg-amber-50 border-amber-200 hover:bg-amber-100", iconColor: "text-amber-600", href: "/interactions" },
    { title: "Cuidados Especiais", desc: "Miocardite por ICI, disfunção ventricular por antracíclinas e hipertensão por TKIs", icon: Stethoscope, color: "bg-emerald-50 border-emerald-200 hover:bg-emerald-100", iconColor: "text-emerald-600", href: "/special-cares" },
    { title: "Pacientes", desc: "Gestão de pacientes com histórico de tratamentos e alertas cardiovasculares", icon: Users, color: "bg-indigo-50 border-indigo-200 hover:bg-indigo-100", iconColor: "text-indigo-600", href: "/patients" },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Sistema de Cardio-Oncologia
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Protocolo eletrônico interativo · ESC 2022 · ASCO 2017 · SBOC 2026
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card><CardContent className="pt-4"><p className="text-3xl font-bold text-foreground">{totalPatients}</p><p className="text-xs text-muted-foreground mt-1">Pacientes Cadastrados</p></CardContent></Card>
          <Card><CardContent className="pt-4"><p className="text-3xl font-bold text-red-600">{highRiskPatients}</p><p className="text-xs text-muted-foreground mt-1">Alto/Muito Alto Risco CV</p></CardContent></Card>
          <Card><CardContent className="pt-4"><p className="text-3xl font-bold text-blue-600">8</p><p className="text-xs text-muted-foreground mt-1">Módulos Clínicos</p></CardContent></Card>
          <Card><CardContent className="pt-4"><p className="text-3xl font-bold text-purple-600">3</p><p className="text-xs text-muted-foreground mt-1">Diretrizes Referenciadas</p></CardContent></Card>
        </div>

      {/* Modules Grid */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-3">Módulos Clínicos</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {modules.map((mod) => (
            <Link key={mod.href} href={mod.href}>
              <div className={`rounded-xl border p-4 cursor-pointer transition-all ${mod.color} group`}>
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 bg-white/70`}>
                  <mod.icon className={`w-5 h-5 ${mod.iconColor}`} />
                </div>
                <p className="font-semibold text-sm text-foreground">{mod.title}</p>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{mod.desc}</p>
                <div className="flex items-center gap-1 mt-3 text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>Acessar</span>
                  <ChevronRight className="w-3 h-3" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Patients */}
      {patients && patients.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-foreground">Pacientes Recentes</h2>
            <Link href="/patients">
              <span className="text-sm text-primary hover:underline cursor-pointer">Ver todos</span>
            </Link>
          </div>
          <div className="space-y-2">
            {patients.slice(0, 5).map((patient) => (
              <Link key={patient.id} href={`/patients/${patient.id}`}>
                <div className="flex items-center justify-between p-3 rounded-xl border border-border hover:bg-muted/30 cursor-pointer transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-bold text-primary">{patient.name.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{patient.name}</p>
                      <p className="text-xs text-muted-foreground">{patient.oncologicDiagnosis || "Diagnóstico não informado"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {patient.cardiovascularRisk && (
                      <Badge className={`text-xs ${riskColors[patient.cardiovascularRisk as keyof typeof riskColors] || "bg-gray-100 text-gray-800"}`}>
                        {riskLabels[patient.cardiovascularRisk as keyof typeof riskLabels] || patient.cardiovascularRisk}
                      </Badge>
                    )}
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* References */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="pt-4">
          <p className="text-xs font-semibold text-blue-800 mb-2">Referências Clínicas</p>
          <div className="space-y-1">
            {[
              "ESC Guidelines on Cardio-Oncology 2022 — European Heart Journal",
              "ASCO Clinical Practice Guideline: Prevention and Monitoring of Cardiac Dysfunction in Survivors of Adult Cancers 2017",
              "Diretrizes SBOC 2026 — Sociedade Brasileira de Oncologia Clínica",
              "CTCAE v5.0 — Common Terminology Criteria for Adverse Events (NCI/NIH)",
            ].map((ref, i) => (
              <div key={i} className="flex items-start gap-2 text-xs text-blue-700">
                <span className="font-bold text-blue-500 flex-shrink-0">[{i + 1}]</span>
                <span>{ref}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
