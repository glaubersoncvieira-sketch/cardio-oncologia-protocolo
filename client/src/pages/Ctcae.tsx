import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle, ChevronRight } from "lucide-react";
import type { CTCAEData } from "../../../shared/clinicalData";

const gradeColors = ["", "bg-yellow-50 border-yellow-200", "bg-orange-50 border-orange-200", "bg-red-50 border-red-200", "bg-red-100 border-red-400", "bg-red-900 border-red-900"];
const gradeTextColors = ["", "text-yellow-800", "text-orange-800", "text-red-800", "text-red-900", "text-white"];

const getGradeText = (item: CTCAEData, grade: number): string => {
  if (grade === 1) return item.grade1;
  if (grade === 2) return item.grade2;
  if (grade === 3) return item.grade3;
  if (grade === 4) return item.grade4;
  return item.grade5;
};

const getManagementText = (item: CTCAEData, grade: number): string => {
  if (grade === 1) return item.management1;
  if (grade === 2) return item.management2;
  if (grade === 3) return item.management3;
  return item.management4;
};

const gradeLabels = ["", "Grau 1 — Leve", "Grau 2 — Moderado", "Grau 3 — Grave", "Grau 4 — Risco de Vida", "Grau 5 — Morte"];
const modificationBadge = (grade: number) => {
  if (grade === 1) return { label: "Manter / Monitorar", cls: "bg-emerald-100 text-emerald-800" };
  if (grade === 2) return { label: "Suspender Temporariamente", cls: "bg-amber-100 text-amber-800" };
  if (grade === 3) return { label: "Suspender / Avaliar Descontinuação", cls: "bg-orange-100 text-orange-800" };
  if (grade === 4) return { label: "Descontinuar Definitivamente", cls: "bg-red-100 text-red-800" };
  return { label: "Óbito", cls: "bg-red-900 text-white" };
};

export default function CtcaePage() {
  const [selectedToxicity, setSelectedToxicity] = useState<string | null>(null);
  const { data: ctcaeData } = trpc.clinical.getCtcaeData.useQuery();

  const selectedItem = ctcaeData?.find((t: CTCAEData) => t.toxicity === selectedToxicity);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <AlertTriangle className="w-6 h-6 text-orange-500" />
          Toxicidades CTCAE v5.0
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Classificação e manejo de toxicidades cardíacas — Common Terminology Criteria for Adverse Events v5.0
        </p>
      </div>

      {/* Grade Legend */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {[
          { grade: 1, label: "Leve", desc: "Assintomático ou sintomas leves; apenas observação" },
          { grade: 2, label: "Moderado", desc: "Intervenção mínima indicada; limitação de atividades" },
          { grade: 3, label: "Grave", desc: "Hospitalização indicada; limitação significativa" },
          { grade: 4, label: "Risco de Vida", desc: "Intervenção urgente indicada" },
          { grade: 5, label: "Morte", desc: "Morte relacionada ao evento adverso" },
        ].map((g) => (
          <div key={g.grade} className={`rounded-xl border p-3 text-center ${gradeColors[g.grade]}`}>
            <p className={`text-xl font-bold ${gradeTextColors[g.grade]}`}>{g.grade}</p>
            <p className={`text-xs font-semibold mt-0.5 ${gradeTextColors[g.grade]}`}>{g.label}</p>
            <p className={`text-xs mt-1 ${g.grade === 5 ? "text-red-200" : "text-muted-foreground"}`}>{g.desc}</p>
          </div>
        ))}
      </div>

      <Tabs defaultValue="list">
        <TabsList>
          <TabsTrigger value="list">Lista de Toxicidades</TabsTrigger>
          <TabsTrigger value="detail" disabled={!selectedToxicity}>
            {selectedToxicity ? `Detalhe` : "Selecione uma toxicidade"}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ctcaeData?.map((item: CTCAEData, i: number) => (
              <Card
                key={i}
                className={`cursor-pointer hover:shadow-md transition-all border ${selectedToxicity === item.toxicity ? "ring-2 ring-primary border-primary" : "border-border"}`}
                onClick={() => setSelectedToxicity(item.toxicity)}
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-bold">{item.toxicity}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1">
                    {[1, 2, 3, 4].map((grade) => (
                      <div key={grade} className={`rounded px-2 py-1 text-xs border ${gradeColors[grade]}`}>
                        <span className={`font-bold ${gradeTextColors[grade]}`}>G{grade}:</span>
                        <span className={`ml-1 ${gradeTextColors[grade]}`}>
                          {getGradeText(item, grade).substring(0, 60)}{getGradeText(item, grade).length > 60 ? "..." : ""}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-2 flex items-center gap-1 text-xs text-primary">
                    <ChevronRight className="w-3 h-3" />
                    <span>Ver conduta por grau</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="detail" className="mt-4">
          {selectedItem && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold">{selectedItem.toxicity}</h2>

              {[1, 2, 3, 4, 5].map((grade) => {
                const gradeText = getGradeText(selectedItem, grade);
                const mgmt = grade < 5 ? getManagementText(selectedItem, grade) : "Óbito relacionado ao evento adverso.";
                const mod = modificationBadge(grade);
                return (
                  <Card key={grade} className={`border-2 ${gradeColors[grade]}`}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-3">
                        <span className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold border-2 ${gradeColors[grade]} ${gradeTextColors[grade]}`}>
                          {grade}
                        </span>
                        <div>
                          <p className={`font-bold ${gradeTextColors[grade]}`}>{gradeLabels[grade]}</p>
                          <p className={`text-sm ${gradeTextColors[grade]}`}>{gradeText}</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="bg-white/80 rounded-lg p-3">
                        <p className="text-xs font-semibold text-muted-foreground mb-1">Conduta Clínica</p>
                        <p className="text-sm">{mgmt}</p>
                      </div>
                      <div className="bg-white/80 rounded-lg p-3">
                        <p className="text-xs font-semibold text-muted-foreground mb-1">Modificação do Tratamento</p>
                        <Badge className={mod.cls}>{mod.label}</Badge>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
