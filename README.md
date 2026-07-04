# 🫀 CardioOncologia — Protocolo Eletrônico Interativo

> Sistema clínico interativo de cardio-oncologia baseado nas diretrizes **ESC 2022**, **ASCO 2017** e **SBOC 2026**.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61dafb)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8)](https://tailwindcss.com/)
[![Vitest](https://img.shields.io/badge/Tests-22%20passing-green)](https://vitest.dev/)
[![License](https://img.shields.io/badge/License-MIT-yellow)](LICENSE)

---

## 📋 Sobre o Projeto

O **CardioOncologia** é um sistema web completo e clinicamente executável para oncologistas e cardio-oncologistas. Oferece protocolo eletrônico de medicamentos, calculadora de dose com ajustes renais e hepáticos, estratificação de risco cardiovascular e ferramentas de monitoramento cardíaco — tudo baseado em evidências de diretrizes internacionais.

### Fontes Clínicas

| Diretriz | Ano | Uso no Sistema |
|---|---|---|
| **ESC** — Cardio-Oncology Guidelines | 2022 | Estratificação de risco CV, monitoramento, biomarcadores |
| **ASCO** — Cardio-Oncology Guidelines | 2017 | Protocolos de monitoramento, LVEF, troponina |
| **SBOC** — Diretrizes Oncológicas Brasileiras | 2026 | Doses, esquemas, indicações e protocolos nacionais |
| **CTCAE v5.0** — NCI | 2017 | Classificação e manejo de toxicidades |

---

## 🚀 Funcionalidades

### 🔍 Busca Rápida por Quimioterápico
Digite o nome do medicamento e receba automaticamente:
- Nível de risco cardiovascular (ESC 2022)
- Cronograma de monitoramento personalizado
- Alertas de cardiotoxicidade
- Interações medicamentosas relevantes
- Conduta clínica por grau CTCAE
- Dose padrão e ajustes renal/hepático

### 📋 Protocolo Eletrônico de Medicamentos
- 20 fármacos em 10 classes terapêuticas
- Mecanismo de ação, indicações, doses e perfil completo de cardiotoxicidade
- Filtro por classe: Antracíclinas, Anti-HER2, ICI, TKIs, Alquilantes, Antimetabólitos, CDK4/6, PARP, BRAF/MEK

### 🧮 Calculadora de Dose
- **BSA**: Mosteller e DuBois
- **Função Renal**: Cockcroft-Gault (ClCr)
- **Carboplatina**: Fórmula de Calvert (AUC)
- **Função Hepática**: Child-Pugh
- **Dose Cumulativa**: Tracker de antracíclinas com alerta de limite máximo

### ❤️ Cardio-Oncologia (ESC 2022)
- Estratificação de risco em 4 níveis: Baixo / Moderado / Alto / Muito Alto
- Avaliação de LVEF, troponina e BNP/NT-proBNP
- Algoritmo interativo de risco cardiovascular

### 📊 Monitoramento Cardíaco
- Cronograma detalhado por classe de medicamento
- Ecocardiograma, ECG, troponina, BNP
- Seguimento pós-tratamento (6 meses, 1 ano, anual)

### ⚠️ CTCAE v5.0
- 5 toxicidades cardíacas com graus 1–5
- Conduta clínica específica por grau
- Critérios de suspensão e reinício do tratamento

### ⚡ Interações Medicamentosas
- 8 interações graves com mecanismo e conduta
- Guia de QTc e medicamentos que prolongam o intervalo
- Foco em cardiotoxicidade aditiva

### 🏥 Cuidados Especiais
- **Miocardite por ICI**: Graus 1–4 com conduta detalhada
- **Disfunção Ventricular por Antracíclinas**: Prevenção e manejo
- **Hipertensão por TKIs/Anti-VEGF**: Algoritmo de tratamento
- **TEV em Oncologia**: Profilaxia e tratamento

### 👥 Gestão de Pacientes
- Cadastro com comorbidades e fatores de risco
- Histórico de avaliações cardiovasculares
- Alertas de alto risco
- Relatório clínico em PDF

---

## 🛠️ Stack Tecnológica

| Camada | Tecnologia |
|---|---|
| **Frontend** | React 19 + TypeScript + Tailwind CSS 4 |
| **Backend** | Express 4 + tRPC 11 |
| **Banco de Dados** | MySQL / TiDB (Drizzle ORM) |
| **Autenticação** | Manus OAuth |
| **Testes** | Vitest (22 testes) |
| **Build** | Vite 7 |

---

## 📁 Estrutura do Projeto

```
cardio_oncology_system/
├── client/
│   └── src/
│       ├── pages/
│       │   ├── Home.tsx              # Landing page
│       │   ├── Protocol.tsx          # Protocolo de medicamentos
│       │   ├── Calculator.tsx        # Calculadora BSA/ClCr/Calvert
│       │   ├── CardioOncology.tsx    # Risco cardiovascular ESC 2022
│       │   ├── Monitoring.tsx        # Cronograma de monitoramento
│       │   ├── Ctcae.tsx             # CTCAE v5.0
│       │   ├── Interactions.tsx      # Interações medicamentosas
│       │   ├── SpecialCares.tsx      # Cuidados especiais
│       │   ├── Dashboard.tsx         # Dashboard clínico
│       │   ├── Patients.tsx          # Gestão de pacientes
│       │   ├── PatientDetail.tsx     # Detalhe do paciente
│       │   └── Report.tsx            # Relatório PDF
│       └── components/
├── server/
│   ├── routers.ts                    # Procedimentos tRPC
│   ├── db.ts                         # Helpers de banco de dados
│   └── cardiooncology.test.ts        # 22 testes Vitest
├── shared/
│   └── clinicalData.ts               # Base de dados clínica completa
├── drizzle/
│   └── schema.ts                     # Schema do banco de dados
└── cardio_oncologia_offline.html     # Versão offline para celular
```

---

## 📱 Versão Offline para Celular

O arquivo `cardio_oncologia_offline.html` é uma versão standalone completa do sistema, otimizada para uso em celular sem necessidade de internet ou servidor.

**Como usar:**
1. Baixe o arquivo `cardio_oncologia_offline.html`
2. Abra no navegador do celular (Chrome, Safari, Firefox)
3. **Android**: Menu ⋮ → "Adicionar à tela inicial"
4. **iPhone**: Compartilhar → "Adicionar à Tela de Início"

**Módulos incluídos na versão offline:**
- Busca Rápida por quimioterápico
- Protocolo de 20 medicamentos
- Calculadora BSA/ClCr/Calvert
- Estratificação de risco ESC 2022
- Monitoramento cardíaco
- CTCAE v5.0
- Interações medicamentosas
- Cuidados especiais
- Protocolos de quimioterapia (AC, TCHP, TC, FEC-100, etc.)

---

## ⚙️ Instalação e Execução

### Pré-requisitos
- Node.js 22+
- pnpm 10+
- MySQL / TiDB (para o banco de dados)

### Instalação

```bash
# Clonar o repositório
git clone https://github.com/SEU_USUARIO/cardio_oncology_system.git
cd cardio_oncology_system

# Instalar dependências
pnpm install

# Configurar variáveis de ambiente
cp .env.example .env
# Editar .env com suas credenciais

# Aplicar migrations do banco de dados
pnpm drizzle-kit generate
# Aplicar o SQL gerado no banco de dados

# Iniciar em desenvolvimento
pnpm dev
```

### Testes

```bash
pnpm test
```

---

## 🗄️ Schema do Banco de Dados

O sistema utiliza as seguintes tabelas principais:

- `users` — Usuários e autenticação
- `patients` — Cadastro de pacientes
- `cardiovascular_assessments` — Avaliações cardiovasculares
- `treatment_records` — Histórico de tratamentos

---

## ⚠️ Aviso Clínico

> Este sistema é uma **ferramenta de apoio à decisão** para profissionais de saúde habilitados. **Não substitui o julgamento clínico individualizado.** Consulte sempre as diretrizes atualizadas e a bula dos medicamentos. As informações clínicas são baseadas nas diretrizes ESC 2022, ASCO 2017 e SBOC 2026 e podem não refletir atualizações posteriores.

---

## 📜 Licença

Este projeto está licenciado sob a [MIT License](LICENSE).

---

## 👨‍⚕️ Créditos

Desenvolvido com base clínica nas diretrizes:
- [ESC 2022 Cardio-Oncology Guidelines](https://academic.oup.com/eurheartj/article/43/41/4229/6633005)
- [ASCO 2017 Cardio-Oncology Guidelines](https://ascopubs.org/doi/10.1200/JCO.2016.70.5400)
- [SBOC 2026 Diretrizes Públicas](https://2026.sboc.org.br/diretrizes-publicas/)
- [CTCAE v5.0 — NCI](https://ctep.cancer.gov/protocoldevelopment/electronic_applications/ctc.htm)
