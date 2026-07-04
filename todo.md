# CardioOncologia System - TODO

## Schema & Backend
- [x] Schema: tabelas patients, medications, drug_classes, cardiotoxicity_profiles, monitoring_schedules, ctcae_grades, drug_interactions, patient_assessments
- [x] Migrations: gerar e aplicar SQL via webdev_execute_sql
- [x] Server routes: medications, patients, assessments, reports
- [x] tRPC procedures: listMedications, getMedication, listDrugClasses, createPatient, createAssessment, getPatientHistory

## Design & Layout
- [x] Tema: dark mode profissional (azul escuro/teal médico)
- [x] Fontes: Inter para UI, fonte médica profissional
- [x] DashboardLayout com sidebar de navegação
- [x] Logo e identidade visual cardio-oncologia
- [x] Responsividade mobile

## Módulo 1: Protocolo de Medicamentos
- [x] Listagem por classe farmacológica (antracíclinas, anti-HER2, ICI, TKIs, alquilantes, antimetabólitos)
- [x] Ficha completa: mecanismo de ação, indicações, doses, cardiotoxicidade
- [x] Filtros por classe, risco cardíaco, tipo de tumor
- [x] Busca por nome genérico/comercial
- [x] Referências ESC 2022, ASCO 2017, SBOC 2026

## Módulo 2: Calculadora de Dose (BSA)
- [x] Fórmula Mosteller: BSA = √(altura × peso / 3600)
- [x] Fórmula DuBois: BSA = 0.007184 × altura^0.725 × peso^0.425
- [x] Cálculo de dose total por BSA
- [x] Ajuste por ClCr (Cockcroft-Gault)
- [x] Ajuste por função hepática (Child-Pugh)
- [x] Dose cumulativa de antracíclinas com alerta de limite

## Módulo 3: Cardio-Oncologia (Estratificação de Risco)
- [x] Estratificação ESC 2022: baixo, moderado, alto, muito alto
- [x] Avaliação de LVEF (normal ≥55%, disfunção leve 45-54%, moderada 35-44%, grave <35%)
- [x] Biomarcadores: troponina I/T, BNP/NT-proBNP
- [x] Fatores de risco cardiovascular (HAS, DM, dislipidemia, tabagismo, obesidade)
- [x] Score de risco integrado com recomendação de conduta

## Módulo 4: Monitoramento Cardíaco
- [x] Cronograma de ecocardiograma por protocolo de tratamento
- [x] Cronograma de ECG (especialmente para drogas que prolongam QT)
- [x] Laboratório: troponina, BNP, hemograma, função renal/hepática
- [x] Alertas automáticos por alteração de LVEF
- [x] Tabela de seguimento pós-tratamento (1, 3, 6, 12 meses)

## Módulo 5: CTCAE v5.0
- [x] Classificação de toxicidades por grau (1-4 + 5)
- [x] Toxicidades cardíacas: IC, arritmia, hipertensão, miocardite, pericardite
- [x] Conduta por grau: manter/reduzir/suspender/descontinuar
- [x] Tabela de manejo específico por droga e grau

## Módulo 6: Interações Medicamentosas
- [x] Base de interações com foco em prolongamento de QT
- [x] Interações cardiotóxicas (antracíclinas + trastuzumabe)
- [x] Classificação: contraindicada, grave, moderada, leve
- [x] Calculadora de risco de QT (fatores de risco + drogas)

## Módulo 7: Dashboard Clínico
- [x] Cadastro de paciente com dados demográficos e comorbidades
- [x] Histórico de tratamentos oncológicos
- [x] Alertas de risco cardiovascular personalizados
- [x] Resumo clínico com recomendações
- [x] Timeline de eventos cardiovasculares

## Módulo 8: Cuidados Especiais
- [x] Miocardite por imunoterapia (ICI): diagnóstico, grau, manejo
- [x] Disfunção ventricular por antracíclinas: prevenção, monitoramento, tratamento
- [x] Hipertensão por TKIs/anti-VEGF: metas, medicamentos, ajuste de dose
- [x] Síndrome de Takotsubo relacionada ao câncer
- [x] Tromboembolismo venoso em pacientes oncológicos

## Módulo 9: Exportação PDF
- [x] Relatório clínico individualizado do paciente
- [x] Protocolo de tratamento com doses calculadas
- [x] Cronograma de monitoramento cardíaco
- [x] Recomendações personalizadas
- [x] Cabeçalho institucional e rodapé com referências

## Testes
- [x] Vitest: testes de cálculo BSA (Mosteller e DuBois)
- [x] Vitest: testes de estratificação de risco cardiovascular
- [x] Vitest: testes de ajuste de dose por ClCr
- [x] Vitest: testes de interações medicamentosas
- [x] Vitest: 16 testes passando (auth.logout + cardiooncology)

## Atualização Automática Quinzenal

- [x] Criar tabelas drug_updates e update_jobs no banco de dados
- [x] Implementar handler /api/scheduled/heartbeat-update (busca PubMed + OpenFDA)
- [x] Implementar handler /api/scheduled/agent-update (recebe dados do agente IA)
- [x] Registrar handlers no server/_core/index.ts
- [x] Criar job Heartbeat quinzenal via manus-heartbeat CLI (task_uid: DnjqyN55zhr2BkXjk74qdA)
- [ ] Criar job AGENT quinzenal para pesquisa nos sites SBOC/ASCO/ESC
- [x] Criar página Updates.tsx com histórico de jobs e atualizações detectadas
- [x] Adicionar badge de notificação no DashboardLayout e card no Dashboard.tsx
- [ ] Testes e checkpoint final
