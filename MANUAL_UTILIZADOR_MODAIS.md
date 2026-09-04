# Manual de Utilização • Modais e Funcionalidades do Dashboard
## RetailLaunchOS • Gabinete Multimédia (Fnac / Darty)

Este manual destina-se aos utilizadores e operadores do **Gabinete Multimédia**, descrevendo o funcionamento prático de todos os modais, formulários e ferramentas interativas disponíveis no **RetailLaunchOS**.

---

## Índice
1. [Visão Geral do Dashboard](#1-visão-geral-do-dashboard)
2. [Modal: Registar Nova Abertura de Loja](#2-modal-registar-nova-abertura-de-loja)
3. [Modal / Gaveta: Gestão da Loja (Abas: Marcos Técnicos & Custos)](#3-modal--gaveta-gestão-da-loja-abas-marcos-técnicos--custos)
   - [3.2. Aba 1: Marcos Técnicos & Digital Signage](#32-aba-1-marcos-técnicos--digital-signage)
   - [3.3. Aba 2: Custos, Diárias & Orçamento (Fase 3)](#33-aba-2-custos-diárias--orçamento-fase-3)
4. [Painel de KPIs & Contagem Decrescente](#4-painel-de-kpis--contagem-decrescente)
5. [Filtros, Pesquisa e Exportação CSV](#5-filtros-pesquisa-e-exportação-csv)
6. [Boas Práticas de Operação](#6-boas-práticas-de-operação)

---

## 1. Visão Geral do Dashboard

O ecrã principal (`http://localhost:3000` ou no IP do teu Synology NAS) centraliza toda a informação operacional das novas lojas em fase de abertura para as insígnias **Fnac** e **Darty**:

* **Sidebar Lateral**: Navegação rápida entre os módulos de *Lojas*, *Digital Signage*, *Playlists*, *Custos* e *Permissões*.
* **Header Superior**: Indicador de conectividade da rede signage, barra de pesquisa rápida e botão de ação primária **"+ Nova Abertura"**.
* **Painel de KPIs**: Indicadores agregados calculados em tempo real a partir da base de dados.
* **Tabela de Aberturas**: Lista dinâmica das lojas ativas com custos diários, progresso e acesso a detalhes técnicos.

---

## 2. Modal: Registar Nova Abertura de Loja

### 2.1. Como Aceder
No canto superior direito do Dashboard, clica no botão dourado **"+ Nova Abertura"**. O formulário surgirá sobreposto em formato modal com fundo escurecido.

### 2.2. Campos do Formulário e Significado

| Campo | Tipo | Obrigatoriedade | Descrição e Impacto no Sistema |
| :--- | :--- | :--- | :--- |
| **Insígnia da Loja** | Botão Seletor (Fnac / Darty) | Obrigatório | Define a marca. Aplica a identidade visual nos badges (Dourado para Fnac, Vermelho para Darty) e prefixa o código interno do projeto. |
| **Nome da Loja** | Texto | Obrigatório | Nome oficial do projeto. Exemplo: `Fnac Leiria Shopping` ou `Darty Amadora`. |
| **Formato da Loja** | Seleção (Dropdown) | Opcional (Default: *Standard*) | Tipo de superfície comercial: *Flagship Store*, *Standard Retail*, *Fnac Express / Travel* ou *Pop-up Store*. |
| **Localização / Morada** | Texto | Obrigatório | Identificação física da loja. Exemplo: `LeiriaShopping, Piso 0, Loja 112`. |
| **Data de Inauguração (Go-Live)** | Seletor de Data | Obrigatório | Data oficial de abertura ao público. Alimenta a contagem decrescente em dias e horas no Dashboard. |
| **Entrega Técnica Multimédia** | Seletor de Data | Opcional | Data limite para conclusão dos testes de telas, som e rede (normalmente 4 a 7 dias antes do go-live). |
| **Custo Diário Estimado (€)** | Numérico decimal | Opcional (Default: *380.00*) | Custo diário estimado para acompanhamento técnico, deslocações e operação durante a fase de abertura. |
| **Orçamento Total (€)** | Numérico decimal | Opcional (Default: *35000.00*) | Budget global alocado para a infraestrutura multimédia da loja. |
| **Versão da Playlist Signage** | Texto | Opcional (Default: *v1.0-inauguracao*) | Identificador do pacote de conteúdos digitais carregado nos players BrightSign/Samsung SSP. |
| **Estado Inicial de Signage** | Seleção (Dropdown) | Opcional (Default: *Pendente*) | Prontidão audiovisual: `Pendente de Instalação`, `Em Configuração de IPs`, `Em Validação de Telas` ou `Pronto para Broadcast`. |

### 2.3. Comportamento ao Submeter ("Gravar Abertura")
1. O formulário valida os campos obrigatórios.
2. É gerado automaticamente um código único estruturado (exemplo: `FNAC-LEI-2026-789`).
3. O registo é enviado via `POST /api/v1/projects` e persistido imediatamente na base de dados SQLite.
4. O modal fecha-se, a tabela de aberturas atualiza-se sem recarregar a página e surge uma notificação verde (*Toast*) de confirmação no canto inferior direito.
5. Se a nova loja tiver a data de abertura mais próxima de todas, o relógio de contagem decrescente do painel superior atualiza-se automaticamente para apontar para ela!

---

## 3. Modal / Gaveta: Gestão da Loja (Abas: Marcos Técnicos & Custos)

### 3.1. Como Aceder
Na tabela **"Aberturas em Curso"**, clica no botão **"Gerir"** situado na coluna de ações de qualquer loja. O modal expandido (*large*) abrir-se-á com um sistema de navegação por abas:
* **Aba 1: Marcos Técnicos & Signage**
* **Aba 2: Custos, Diárias & Orçamento**

---

### 3.2. Aba 1: Marcos Técnicos & Digital Signage

#### A. Barra de Progresso Global em Tempo Real
No topo da aba, é exibida a barra de progresso da abertura e o rácio de cumprimento:
* **Exemplo**: `75% (3 de 4 concluídos)`.
* O cálculo é feito instantaneamente na base de dados: `Progresso = (Tarefas Concluídas / Total de Tarefas) * 100`.

#### B. Painel de Configuração de Digital Signage & Playlists
Permite ao Gabinete Multimédia atualizar os parâmetros de transmissão audiovisual da loja sem sair do ecrã:
1. **Estado de Signage**: Seleciona entre `Pendente de Instalação`, `Em Configuração de IPs`, `Em Validação de Telas` ou `Pronto para Broadcast`.
2. **Versão da Playlist**: Altera o identificador da campanha/conteúdo (ex: `v2.5-gold-cascais`).
3. **Botão "Atualizar"**: Clica para gravar de imediato via `PATCH /api/v1/projects/:id/signage`. O indicador no Dashboard e o cálculo de prontidão de signage (*Signage Readiness*) atualizam-se instantaneamente!

#### C. Checklist Interativa de Marcos Técnicos (`tasks`)
Apresenta a lista ordenada de tarefas técnicas da loja:
* **Conclusão com 1 Clique (Checkbox)**: Clica na caixa de seleção à esquerda da tarefa. 
  * A tarefa é riscada e marcada com `✓ Concluído`.
  * A barra de progresso da loja atualiza-se de imediato tanto no modal como na tabela principal do Dashboard!
  * Um novo clique reabre a tarefa para o estado `Pendente`.
* **Identificadores Visuais**:
  * **Prioridade**: Badges coloridos para `Crítica` (vermelho), `Alta` (âmbar), `Média` (azul) e `Baixa` (cinzento).
  * **Departamento**: Tag com a área responsável (`Multimédia & Telas`, `Redes & IT`, `Som & Iluminação`, `Operações & Obras`).
  * **Prazo**: Data prevista de conclusão do marco técnico.
* **Eliminação de Tarefas**: Clica no ícone do caixote do lixo para remover o marco técnico após confirmação.

#### D. Adicionar Novo Marco Técnico
Para acrescentar uma nova tarefa à checklist da loja:
1. Clica no botão **"+ Novo Marco Técnico"** no cabeçalho da checklist para abrir o formulário desdobrável.
2. Preenche os campos:
   * **Título do Marco Técnico*** (obrigatório, ex: *"Calibração de Áudio Bose / JBL"*).
   * **Departamento** (Multimédia & Telas, Redes & IT, Som & Iluminação, Operações).
   * **Prioridade** (Crítica, Alta, Média, Baixa).
   * **Prazo de Entrega** (por defeito pré-preenchido com a data limite técnica da loja).
   * **Descrição / Observações Técnicas** (opcional, ex: *"Verificar níveis de SPL junto à Linha de Caixas"*).
3. Clica em **"Guardar Marco"**: a tarefa é inserida na base de dados SQLite via `POST /api/v1/projects/:id/tasks` e surge imediatamente na lista com o progresso recalculado.

---

### 3.3. Aba 2: Custos, Diárias & Orçamento (Fase 3)

Esta aba disponibiliza o acompanhamento financeiro detalhado de cada abertura, permitindo controlar o consumo do orçamento alocado e auditar as diárias técnicas efetuadas no local.

#### A. Cartões de Indicadores Financeiros (KPIs)
No topo da aba surgem 4 métricas calculadas em tempo real:
1. **Orçamento Total**: Montante global aprovado para a loja (`total_budget`).
2. **Total Executado**: Somatório de todas as despesas e diárias lançadas até ao momento (`totalSpent`).
3. **Saldo Restante**: Diferença entre o orçamento e os custos registados (`remainingBudget`). Fica automaticamente assinalado a vermelho caso ocorra derrapagem orçamental.
4. **Consumo Budget (%)**: Percentagem de execução com código visual de alerta:
   * **Verde (< 65%)**: Consumo controlado e dentro dos limites.
   * **Âmbar (65% a 85%)**: Consumo intermédio; requer atenção para custos adicionais.
   * **Vermelho (> 85%)**: Alerta crítico de aproximação ao limite do budget.

#### B. Barra de Consumo Orçamental
Barra visual proporcional que espelha graficamente a percentagem consumida face ao limite global.

#### C. Histórico de Despesas & Diárias (`project_costs`)
Lista discriminada de todos os custos imputados à abertura:
* **Badge de Categoria**:
  * `Diária Técnica`: Deslocações, horas de técnicos externos e calibradores.
  * `Hardware`: Aquisição de displays, media players, suportes ou cablagem.
  * `Licenciamento`: Assinaturas de software CMS de Digital Signage e licenças de streaming.
  * `Redes & IT`: Switches, bastidores, routers ou conetividade.
  * `Outro`: Despesas e consumíveis diversos.
* **Descrição & Auditoria**: Detalha o motivo da despesa, a data em que ocorreu e o utilizador que realizou o lançamento (`logged_by_name`).
* **Valor**: Formatação em Euros (`€`) em tipografia tabular *JetBrains Mono*.
* **Remoção de Registo**: Ícone de caixote do lixo para eliminar lançamentos incorretos com recálculo automático instantâneo dos KPIs.

#### D. Lançar Novo Custo ou Diária Técnica
Para imputar um novo custo ao projeto:
1. Clica no botão **"+ Registar Custo / Diária"** no cabeçalho do histórico para abrir o formulário desdobrável.
2. Preenche os campos:
   * **Data da Despesa***: Data de ocorrência da fatura ou da intervenção no local (pré-selecionada com o dia atual).
   * **Categoria de Custo***: Escolha entre *Diária Técnica Externa*, *Hardware & Displays Multimédia*, *Licenciamento & Streaming de Telas*, *Cablagem & Redes IT* ou *Outro*.
   * **Valor (€)***: Montante em euros (ex: `485.50`).
   * **Descrição do Custo***: Justificação clara (ex: *"Calibração de som e alinhamento de displays de montra"*).
3. Clica em **"Gravar Custo"**: O sistema envia os dados via `POST /api/v1/projects/:id/costs`, armazena o lançamento na base de dados SQLite, atualiza a lista de histórico e recalcula todos os saldos e indicadores no modal e no Dashboard principal.

---

## 4. Painel de KPIs & Contagem Decrescente

O painel superior do Dashboard atualiza-se em tempo real com as seguintes métricas:

1. **Próxima Abertura (Hero Card)**:
   * Deteta automaticamente a loja com data de go-live mais iminente.
   * Apresenta um relógio com contagem decrescente ativa ao segundo: `[Dias : Horas : Minutos : Segundos]`.
2. **Playlists & Signage**:
   * Barra de prontidão percentual indicando o volume de telas e conteúdos validados no piloto.
3. **Custo Diário Médio**:
   * Média aritmética do custo/dia de todas as lojas ativas, com o volume financeiro acumulado no mês corrente.
4. **Budget Global Alocado**:
   * Soma total dos orçamentos atribuídos aos projetos em execução e percentual executado.

---

## 5. Filtros, Pesquisa e Exportação CSV

### 5.1. Filtragem Rápida por Insígnia
Por cima da tabela, clica nos botões:
* **Todas**: Apresenta todas as lojas do portfólio.
* **Fnac**: Filtra apenas lojas com marca Fnac (fundo dourado).
* **Darty**: Filtra apenas lojas com marca Darty (fundo vermelho).

### 5.2. Pesquisa Instantânea (`⌘K`)
* Escreve no campo de pesquisa do cabeçalho qualquer termo (ex: *"Cascais"*, *"Darty"*, *"Shopping"*).
* A tabela filtra as linhas em tempo real à medida que digitas.

### 5.3. Exportação para CSV
* Clica no botão **"Exportar CSV"** no canto direito da secção de aberturas.
* O sistema compila os dados atuais e descarrega automaticamente um ficheiro formatado: `RetailLaunchOS_Aberturas_AAAA-MM-DD.csv`, pronto para abrir no Excel ou Google Sheets.

---

## 6. Boas Práticas de Operação

1. **Nomenclatura**: Utiliza sempre a convenção `[Insígnia] [Nome do Centro ou Cidade]` (ex: `Fnac Forum Coimbra`, `Darty Sintra`).
2. **Datas de Entrega**: Define sempre a *Entrega Técnica Multimédia* pelo menos 5 dias antes do *Go-Live*, permitindo testes de stress de reprodução contínua 24/7 nas telas antes da inauguração.
3. **Playlists**: Mantém o padrão de numeração semântica nas playlists (ex: `v1.0-abertura`, `v1.1-ajustes`, `v2.0-campanha`).
4. **Registo Imediato de Diárias**: Imputar as diárias e custos de deslocação no próprio dia da intervenção para manter o saldo orçamental permanentemente fidedigno.

