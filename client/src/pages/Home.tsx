import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getLoginUrl } from "@/const";
import { useLocation } from "wouter";
import {
  Heart,
  Pill,
  Calculator,
  Activity,
  AlertTriangle,
  BookOpen,
  Users,
  ChevronRight,
  Shield,
  Stethoscope,
  FlaskConical,
  FileText,
} from "lucide-react";

const features = [
  {
    icon: BookOpen,
    title: "Protocolo Eletrônico",
    description: "Base de dados completa de medicamentos oncológicos com mecanismo de ação, indicações e perfil de cardiotoxicidade.",
    href: "/protocol",
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    icon: Calculator,
    title: "Calculadora de Dose",
    description: "Cálculo de BSA (Mosteller e DuBois), ClCr (Cockcroft-Gault), dose por m² e fórmula de Calvert para carboplatina.",
    href: "/calculator",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    icon: Heart,
    title: "Cardio-Oncologia",
    description: "Estratificação de risco cardiovascular em 4 níveis (ESC 2022), avaliação de LVEF e biomarcadores cardíacos.",
    href: "/cardio-oncology",
    color: "text-red-600",
    bg: "bg-red-50",
  },
  {
    icon: Activity,
    title: "Monitoramento Cardíaco",
    description: "Cronograma detalhado de ecocardiograma, ECG, troponina e BNP durante e após o tratamento oncológico.",
    href: "/monitoring",
    color: "text-purple-600",
    bg: "bg-purple-50",
  },
  {
    icon: AlertTriangle,
    title: "Toxicidades CTCAE v5.0",
    description: "Classificação e manejo de toxicidades cardíacas por grau com recomendações de conduta clínica específicas.",
    href: "/ctcae",
    color: "text-orange-600",
    bg: "bg-orange-50",
  },
  {
    icon: FlaskConical,
    title: "Interações Medicamentosas",
    description: "Banco de dados de interações com foco em prolongamento de QT e potencialização de cardiotoxicidade.",
    href: "/interactions",
    color: "text-cyan-600",
    bg: "bg-cyan-50",
  },
  {
    icon: Stethoscope,
    title: "Cuidados Especiais",
    description: "Protocolos para miocardite por ICI, disfunção por antracíclinas, hipertensão por TKIs e TEV oncológico.",
    href: "/special-cares",
    color: "text-indigo-600",
    bg: "bg-indigo-50",
  },
  {
    icon: Users,
    title: "Gestão de Pacientes",
    description: "Dashboard clínico com histórico de tratamentos, alertas de risco cardiovascular e avaliações seriadas.",
    href: "/patients",
    color: "text-teal-600",
    bg: "bg-teal-50",
  },
];

const guidelines = [
  { name: "ESC 2022", full: "European Society of Cardiology — Cardio-Oncology Guidelines 2022" },
  { name: "ASCO 2017", full: "American Society of Clinical Oncology — Prevention and Monitoring of Cardiac Dysfunction 2017" },
  { name: "SBOC 2026", full: "Sociedade Brasileira de Oncologia Clínica — Diretrizes de Tratamentos Oncológicos 2026" },
  { name: "CTCAE v5.0", full: "Common Terminology Criteria for Adverse Events v5.0 — NCI/NIH" },
];

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
              <Heart className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <span className="font-bold text-foreground text-lg leading-none">CardioOncologia</span>
              <p className="text-xs text-muted-foreground">Protocolo Clínico Interativo</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <Button onClick={() => navigate("/dashboard")} className="gap-2">
                <Activity className="w-4 h-4" />
                Acessar Sistema
              </Button>
            ) : (
              <Button asChild>
                <a href={getLoginUrl()}>Entrar</a>
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white py-20 px-4">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-blue-400 blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-teal-400 blur-3xl" />
        </div>
        <div className="container relative z-10 text-center max-w-4xl mx-auto">
          <Badge variant="outline" className="mb-6 border-teal-400/50 text-teal-300 bg-teal-400/10 text-sm px-4 py-1.5">
            <Shield className="w-3.5 h-3.5 mr-2" />
            Baseado nas Diretrizes ESC 2022 · ASCO 2017 · SBOC 2026
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            Protocolo Eletrônico de{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-blue-300">
              Cardio-Oncologia
            </span>
          </h1>
          <p className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            Sistema clínico interativo para oncologistas e cardio-oncologistas. Calculadora de dose,
            estratificação de risco cardiovascular, monitoramento cardíaco e protocolos de manejo
            baseados em evidências.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {isAuthenticated ? (
              <Button size="lg" onClick={() => navigate("/dashboard")} className="gap-2 bg-teal-500 hover:bg-teal-400 text-white">
                <Activity className="w-5 h-5" />
                Acessar Dashboard
                <ChevronRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button size="lg" asChild className="gap-2 bg-teal-500 hover:bg-teal-400 text-white">
                <a href={getLoginUrl()}>
                  Entrar no Sistema
                  <ChevronRight className="w-4 h-4" />
                </a>
              </Button>
            )}
            <Button size="lg" variant="outline" onClick={() => navigate("/protocol")}
              className="gap-2 border-slate-500 text-slate-200 hover:bg-slate-800">
              <BookOpen className="w-5 h-5" />
              Ver Protocolos
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-4">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-3">Módulos Clínicos</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Ferramentas clínicas integradas para suporte à decisão em oncologia e cardio-oncologia.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((feature) => (
              <Card
                key={feature.title}
                className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 border-border group"
                onClick={() => navigate(feature.href)}
              >
                <CardContent className="p-5">
                  <div className={`w-11 h-11 rounded-xl ${feature.bg} flex items-center justify-center mb-4`}>
                    <feature.icon className={`w-6 h-6 ${feature.color}`} />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Guidelines */}
      <section className="py-12 px-4 bg-muted/30 border-y border-border">
        <div className="container">
          <div className="text-center mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-2">Fontes e Referências Clínicas</h2>
            <p className="text-sm text-muted-foreground">Todo o conteúdo clínico é baseado nas seguintes diretrizes:</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {guidelines.map((g) => (
              <div key={g.name} className="bg-card border border-border rounded-lg p-4 text-center">
                <Badge className="mb-2 bg-primary/10 text-primary border-primary/20 font-mono">{g.name}</Badge>
                <p className="text-xs text-muted-foreground leading-relaxed">{g.full}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-8 px-4">
        <div className="container max-w-3xl mx-auto">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 flex gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-amber-800 mb-1">Aviso Importante</p>
              <p className="text-xs text-amber-700 leading-relaxed">
                Este sistema é uma ferramenta de apoio à decisão clínica para profissionais de saúde habilitados.
                Não substitui o julgamento clínico individualizado. As recomendações devem ser adaptadas às
                características específicas de cada paciente. Consulte sempre as diretrizes atualizadas e
                especialistas em cardio-oncologia para casos complexos.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-6 px-4 bg-card">
        <div className="container flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground">CardioOncologia — Protocolo Clínico Interativo</span>
          </div>
          <p className="text-xs text-muted-foreground">
            ESC 2022 · ASCO 2017 · SBOC 2026 · CTCAE v5.0
          </p>
        </div>
      </footer>
    </div>
  );
}
