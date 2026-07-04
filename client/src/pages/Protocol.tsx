import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Search, Pill, Heart, AlertTriangle, Activity, BookOpen,
  ChevronRight, Info, Shield, Zap, FlaskConical
} from "lucide-react";

const riskColors: Record<string, string> = {
  baixo: "bg-emerald-100 text-emerald-800 border-emerald-200",
  moderado: "bg-amber-100 text-amber-800 border-amber-200",
  alto: "bg-orange-100 text-orange-800 border-orange-200",
  muito_alto: "bg-red-100 text-red-800 border-red-200",
};

const riskLabels: Record<string, string> = {
  baixo: "Baixo",
  moderado: "Moderado",
  alto: "Alto",
  muito_alto: "Muito Alto",
};

const cardiotoxTypeColors: Record<string, string> = {
  tipo_I: "bg-red-100 text-red-800",
  tipo_II: "bg-orange-100 text-orange-800",
  misto: "bg-purple-100 text-purple-800",
  nenhum: "bg-gray-100 text-gray-700",
};

const cardiotoxTypeLabels: Record<string, string> = {
  tipo_I: "Tipo I (Irreversível)",
  tipo_II: "Tipo II (Reversível)",
  misto: "Misto",
  nenhum: "Sem cardiotoxicidade",
};

export default function ProtocolPage() {
  const [search, setSearch] = useState("");
  const [selectedClassId, setSelectedClassId] = useState<number | null>(null);
  const [selectedMedId, setSelectedMedId] = useState<number | null>(null);

  const { data: classes } = trpc.clinical.getDrugClasses.useQuery();
  const { data: medications } = trpc.clinical.getMedications.useQuery(
    selectedClassId ? { drugClassId: selectedClassId } : undefined
  );
  const { data: protocols } = trpc.clinical.getTreatmentProtocols.useQuery();

  const filteredMeds = medications?.filter(m =>
    !search || m.genericName.toLowerCase().includes(search.toLowerCase()) ||
    m.brandNames?.toLowerCase().includes(search.toLowerCase()) ||
    m.indications?.toLowerCase().includes(search.toLowerCase())
  );

  const selectedMed = filteredMeds?.find(m => m.id === selectedMedId);
  const { data: interactions } = trpc.clinical.getDrugInteractions.useQuery(
    selectedMedId ? { medicationId: selectedMedId } : undefined
  );
  const { data: monitoringSchedule } = trpc.clinical.getMonitoringSchedule.useQuery(
    { medicationId: selectedMedId || 0 },
    { enabled: !!selectedMedId }
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-primary" />
            Protocolo Eletrônico de Medicamentos
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Base de dados clínica — Diretrizes SBOC 2026 · ESC 2022 · ASCO 2017
          </p>
        </div>
      </div>

      <Tabs defaultValue="medications">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="medications">
            <Pill className="w-4 h-4 mr-2" />
            Medicamentos
          </TabsTrigger>
          <TabsTrigger value="protocols">
            <FlaskConical className="w-4 h-4 mr-2" />
            Protocolos
          </TabsTrigger>
        </TabsList>

        <TabsContent value="medications" className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Left Panel - Filters + List */}
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar medicamento..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>

              {/* Drug Classes */}
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Classes Farmacológicas</p>
                <div className="space-y-1">
                  <button
                    onClick={() => setSelectedClassId(null)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${!selectedClassId ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
                  >
                    Todas as classes
                  </button>
                  {classes?.map(cls => (
                    <button
                      key={cls.id}
                      onClick={() => setSelectedClassId(cls.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${selectedClassId === cls.id ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
                    >
                      <div className="font-medium">{cls.name}</div>
                      <div className={`text-xs mt-0.5 ${selectedClassId === cls.id ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                        {cardiotoxTypeLabels[cls.cardiotoxicityType || "nenhum"]}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Medication List */}
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                  Medicamentos ({filteredMeds?.length || 0})
                </p>
                <ScrollArea className="h-[400px]">
                  <div className="space-y-1 pr-2">
                    {filteredMeds?.map(med => (
                      <button
                        key={med.id}
                        onClick={() => setSelectedMedId(med.id)}
                        className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors border ${
                          selectedMedId === med.id
                            ? "bg-primary/10 border-primary/30 text-primary"
                            : "border-transparent hover:bg-muted"
                        }`}
                      >
                        <div className="font-medium">{med.genericName}</div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`text-xs px-1.5 py-0.5 rounded border font-medium ${riskColors[med.cardiotoxicityRisk]}`}>
                            {riskLabels[med.cardiotoxicityRisk]}
                          </span>
                          {med.lvefMonitoring && (
                            <span className="text-xs text-blue-600 flex items-center gap-0.5">
                              <Heart className="w-3 h-3" /> LVEF
                            </span>
                          )}
                          {med.qtProlongation && (
                            <span className="text-xs text-purple-600 flex items-center gap-0.5">
                              <Activity className="w-3 h-3" /> QTc
                            </span>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </div>

            {/* Right Panel - Drug Detail */}
            <div className="lg:col-span-2">
              {selectedMed ? (
                <Card className="border-border">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <CardTitle className="text-xl">{selectedMed.genericName}</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">{selectedMed.brandNames}</p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className={`text-sm px-2.5 py-1 rounded-lg border font-semibold ${riskColors[selectedMed.cardiotoxicityRisk]}`}>
                          Risco Cardíaco: {riskLabels[selectedMed.cardiotoxicityRisk]}
                        </span>
                        {selectedMed.sbocGuideline && (
                          <Badge variant="outline" className="text-xs">
                            SBOC 2026
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Cardiac Risk Indicators */}
                    <div className="flex flex-wrap gap-2 mt-3">
                      {selectedMed.lvefMonitoring && (
                        <Badge className="bg-blue-100 text-blue-800 border-blue-200 gap-1">
                          <Heart className="w-3 h-3" /> Monitorar LVEF
                        </Badge>
                      )}
                      {selectedMed.qtProlongation && (
                        <Badge className="bg-purple-100 text-purple-800 border-purple-200 gap-1">
                          <Activity className="w-3 h-3" /> Risco QTc
                        </Badge>
                      )}
                      {selectedMed.hypertensionRisk && (
                        <Badge className="bg-red-100 text-red-800 border-red-200 gap-1">
                          <Zap className="w-3 h-3" /> Risco HAS
                        </Badge>
                      )}
                      {selectedMed.myocarditisRisk && (
                        <Badge className="bg-orange-100 text-orange-800 border-orange-200 gap-1">
                          <AlertTriangle className="w-3 h-3" /> Risco Miocardite
                        </Badge>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent>
                    <Accordion type="multiple" defaultValue={["mechanism", "dose", "cardiotoxicity"]} className="space-y-2">
                      <AccordionItem value="mechanism" className="border rounded-lg px-3">
                        <AccordionTrigger className="text-sm font-semibold py-3">
                          <span className="flex items-center gap-2"><Zap className="w-4 h-4 text-blue-500" />Mecanismo de Ação</span>
                        </AccordionTrigger>
                        <AccordionContent className="text-sm text-muted-foreground pb-3 leading-relaxed">
                          {selectedMed.mechanismOfAction}
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="indications" className="border rounded-lg px-3">
                        <AccordionTrigger className="text-sm font-semibold py-3">
                          <span className="flex items-center gap-2"><BookOpen className="w-4 h-4 text-emerald-500" />Indicações e Protocolos</span>
                        </AccordionTrigger>
                        <AccordionContent className="text-sm text-muted-foreground pb-3 leading-relaxed">
                          {selectedMed.indications}
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="dose" className="border rounded-lg px-3">
                        <AccordionTrigger className="text-sm font-semibold py-3">
                          <span className="flex items-center gap-2"><Pill className="w-4 h-4 text-purple-500" />Doses e Posologia</span>
                        </AccordionTrigger>
                        <AccordionContent className="pb-3">
                          <div className="bg-muted/50 rounded-lg p-3 font-mono text-sm">
                            {selectedMed.standardDose}
                          </div>
                          {selectedMed.maxCumulativeDose && (
                            <div className="mt-2 flex items-center gap-2 text-sm text-amber-700 bg-amber-50 rounded-lg px-3 py-2">
                              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                              <span>Dose cumulativa máxima: <strong>{selectedMed.maxCumulativeDose} {selectedMed.maxCumulativeDoseUnit}</strong></span>
                            </div>
                          )}
                          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <div className="bg-blue-50 rounded-lg p-3">
                              <p className="text-xs font-semibold text-blue-700 mb-1">Ajuste Renal</p>
                              <p className="text-xs text-blue-800">{selectedMed.renalAdjustment}</p>
                            </div>
                            <div className="bg-amber-50 rounded-lg p-3">
                              <p className="text-xs font-semibold text-amber-700 mb-1">Ajuste Hepático</p>
                              <p className="text-xs text-amber-800">{selectedMed.hepaticAdjustment}</p>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="cardiotoxicity" className="border rounded-lg px-3">
                        <AccordionTrigger className="text-sm font-semibold py-3">
                          <span className="flex items-center gap-2"><Heart className="w-4 h-4 text-red-500" />Perfil de Cardiotoxicidade</span>
                        </AccordionTrigger>
                        <AccordionContent className="pb-3 space-y-3">
                          <p className="text-sm text-muted-foreground leading-relaxed">{selectedMed.cardiotoxicityProfile}</p>
                          {selectedMed.cardioProtection && (
                            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                              <p className="text-xs font-semibold text-green-700 mb-1 flex items-center gap-1">
                                <Shield className="w-3.5 h-3.5" /> Cardioprotecção e Monitoramento
                              </p>
                              <p className="text-xs text-green-800 leading-relaxed">{selectedMed.cardioProtection}</p>
                            </div>
                          )}
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="sideeffects" className="border rounded-lg px-3">
                        <AccordionTrigger className="text-sm font-semibold py-3">
                          <span className="flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-orange-500" />Efeitos Colaterais Principais</span>
                        </AccordionTrigger>
                        <AccordionContent className="text-sm text-muted-foreground pb-3 leading-relaxed">
                          {selectedMed.mainSideEffects}
                        </AccordionContent>
                      </AccordionItem>

                      {monitoringSchedule && monitoringSchedule.length > 0 && (
                        <AccordionItem value="monitoring" className="border rounded-lg px-3">
                          <AccordionTrigger className="text-sm font-semibold py-3">
                            <span className="flex items-center gap-2"><Activity className="w-4 h-4 text-teal-500" />Cronograma de Monitoramento</span>
                          </AccordionTrigger>
                          <AccordionContent className="pb-3">
                            <div className="space-y-2">
                              {monitoringSchedule.map((s, i) => (
                                <div key={i} className="border border-border rounded-lg p-3">
                                  <p className="text-sm font-semibold text-foreground mb-2">{s.timepoint}</p>
                                  <div className="flex flex-wrap gap-1.5">
                                    {s.echocardiogram && <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">Ecocardiograma</Badge>}
                                    {s.ecg && <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200">ECG</Badge>}
                                    {s.troponin && <Badge variant="outline" className="text-xs bg-red-50 text-red-700 border-red-200">Troponina</Badge>}
                                    {s.bnp && <Badge variant="outline" className="text-xs bg-orange-50 text-orange-700 border-orange-200">BNP/NT-proBNP</Badge>}
                                    {s.bloodPressure && <Badge variant="outline" className="text-xs bg-teal-50 text-teal-700 border-teal-200">Pressão Arterial</Badge>}
                                    {s.cbc && <Badge variant="outline" className="text-xs bg-gray-50 text-gray-700 border-gray-200">Hemograma</Badge>}
                                    {s.renalFunction && <Badge variant="outline" className="text-xs bg-yellow-50 text-yellow-700 border-yellow-200">Função Renal</Badge>}
                                    {s.hepaticFunction && <Badge variant="outline" className="text-xs bg-amber-50 text-amber-700 border-amber-200">Função Hepática</Badge>}
                                  </div>
                                  {s.notes && <p className="text-xs text-muted-foreground mt-2 italic">{s.notes}</p>}
                                </div>
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      )}

                      {interactions && interactions.length > 0 && (
                        <AccordionItem value="interactions" className="border rounded-lg px-3">
                          <AccordionTrigger className="text-sm font-semibold py-3">
                            <span className="flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-yellow-500" />Interações Relevantes</span>
                          </AccordionTrigger>
                          <AccordionContent className="pb-3 space-y-2">
                            {interactions.map((inter, i) => (
                              <div key={i} className={`rounded-lg p-3 border ${
                                inter.severity === "contraindicada" ? "bg-red-50 border-red-200" :
                                inter.severity === "grave" ? "bg-orange-50 border-orange-200" :
                                "bg-yellow-50 border-yellow-200"
                              }`}>
                                <div className="flex items-center justify-between mb-1">
                                  <p className="text-sm font-semibold">{inter.drug2Name}</p>
                                  <Badge className={
                                    inter.severity === "contraindicada" ? "bg-red-600 text-white" :
                                    inter.severity === "grave" ? "bg-orange-600 text-white" :
                                    "bg-yellow-600 text-white"
                                  }>
                                    {inter.severity.toUpperCase()}
                                  </Badge>
                                </div>
                                <p className="text-xs text-muted-foreground">{inter.clinicalEffect}</p>
                                <p className="text-xs font-medium mt-1">{inter.management}</p>
                              </div>
                            ))}
                          </AccordionContent>
                        </AccordionItem>
                      )}

                      <AccordionItem value="references" className="border rounded-lg px-3">
                        <AccordionTrigger className="text-sm font-semibold py-3">
                          <span className="flex items-center gap-2"><Info className="w-4 h-4 text-gray-500" />Referências</span>
                        </AccordionTrigger>
                        <AccordionContent className="text-xs text-muted-foreground pb-3 leading-relaxed">
                          {selectedMed.references}
                          {selectedMed.sbocGuideline && (
                            <div className="mt-2">
                              <span className="font-semibold text-foreground">SBOC 2026:</span> {selectedMed.sbocGuideline}
                            </div>
                          )}
                          {selectedMed.escGuideline && (
                            <div className="mt-1">
                              <span className="font-semibold text-foreground">ESC 2022:</span> {selectedMed.escGuideline}
                            </div>
                          )}
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </CardContent>
                </Card>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center py-16 text-muted-foreground">
                  <Pill className="w-12 h-12 mb-4 opacity-30" />
                  <p className="text-lg font-medium">Selecione um medicamento</p>
                  <p className="text-sm mt-1">Clique em um medicamento na lista para ver o protocolo completo</p>
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="protocols" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {protocols?.map((protocol, i) => (
              <Card key={i} className="border-border">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-base font-bold font-mono text-primary">{protocol.name}</CardTitle>
                    <span className={`text-xs px-2 py-1 rounded border font-semibold ${riskColors[protocol.cardiotoxicityRisk]}`}>
                      {riskLabels[protocol.cardiotoxicityRisk]}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">{protocol.indication}</p>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-1.5">
                    {protocol.drugs.map((drug, j) => (
                      <div key={j} className="flex items-center gap-2 bg-muted/50 rounded-lg px-3 py-2">
                        <Pill className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                        <div className="text-xs">
                          <span className="font-semibold">{drug.name}</span>
                          <span className="text-muted-foreground ml-1">{drug.dose} {drug.route} {drug.schedule}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-blue-50 rounded-lg p-2">
                      <p className="font-semibold text-blue-700">Ciclo</p>
                      <p className="text-blue-800">{protocol.cycleLength}</p>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-2">
                      <p className="font-semibold text-purple-700">Total</p>
                      <p className="text-purple-800">{protocol.totalCycles}</p>
                    </div>
                  </div>
                  <div className="bg-teal-50 border border-teal-200 rounded-lg p-2">
                    <p className="text-xs font-semibold text-teal-700 mb-1">Monitoramento</p>
                    <p className="text-xs text-teal-800">{protocol.monitoring}</p>
                  </div>
                  <p className="text-xs text-muted-foreground italic">{protocol.sbocReference}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
