# Manual de Utilização • Modais e Funcionalidades do Dashboard
## RetailLaunchOS • Gabinete Multimédia (Fnac / Darty)

Este manual destina-se aos utilizadores e operadores do **Gabinete Multimédia**, descrevendo o funcionamento prático de todos os modais, formulários e ferramentas interativas disponíveis no **RetailLaunchOS**.

---

## Índice
1. [Visão Geral do Dashboard](#1-visão-geral-do-dashboard)
2. [Modal: Registar Nova Abertura de Loja](#2-modal-registar-nova-abertura-de-loja)
3. [Modal / Gaveta: Gestão da Loja (Abas: Marcos Técnicos, Custos, Telas e Planta)](#3-modal--gaveta-gestão-da-loja-abas-marcos-técnicos-custos-e-telas)
   - [3.1.1. Edição de Dados Estruturais da Loja (Fase 12)](#311-edição-de-dados-estruturais-da-loja-fase-12)
   - [3.2. Aba 1: Marcos Técnicos & Digital Signage](#32-aba-1-marcos-técnicos--digital-signage)
   - [3.3. Aba 2: Custos, Diárias & Orçamento (Fase 3)](#33-aba-2-custos-diárias--orçamento-fase-3)
   - [3.4. Aba 3: Telas & Players da Loja (Fase 4)](#34-aba-3-telas--players-da-loja-fase-4)
   - [3.5. Aba 4: Planta & Telas Interativa da Loja (Fase 17)](#35-aba-4-planta--telas-interativa-da-loja-fase-17)
4. [Modal: Hub Central de Digital Signage & Playlists (Fase 4)](#4-modal-hub-central-de-digital-signage--playlists-fase-4)
   - [4.1. Como Aceder](#41-como-aceder)
   - [4.2. Aba A: Catálogo de Playlists & Versões](#42-aba-a-catálogo-de-playlists--versões)
   - [4.3. Aba B: Parque Global de Displays](#43-aba-b-parque-global-de-displays)
5. [Modal: Controlo de Acessos, Sessão de Operador & RBAC (Fase 5)](#5-modal-controlo-de-acessos-sessão-de-operador--rbac-fase-5)
   - [5.1. Widget de Perfil no Rodapé da Sidebar](#51-widget-de-perfil-no-rodapé-da-sidebar)
   - [5.2. Como Aceder ao Seletor de Sessão](#52-como-aceder-ao-seletor-de-sessão)
   - [5.3. Troca Rápida de Perfil (1-Clique para Ambiente Piloto)](#53-troca-rápida-de-perfil-1-clique-para-ambiente-piloto)
   - [5.4. Matriz de Permissões Operacionais por Perfil](#54-matriz-de-permissões-operacionais-por-perfil)
   - [5.5. Início de Sessão Tradicional com Credenciais Corporativas](#55-início-de-sessão-tradicional-com-credenciais-corporativas)
6. [Painel de KPIs & Contagem Decrescente](#6-painel-de-kpis--contagem-decrescente)
7. [Filtros, Pesquisa e Exportação CSV](#7-filtros-pesquisa-e-exportação-csv)
8. [Boas Práticas de Operação](#8-boas-práticas-de-operação)
9. [Motor Multi-Tema & Paleta Oficial (Fase 6)](#9-motor-multi-tema-claro-escuro-e-automático-fase-6)
10. [Módulo: Gestão de Utilizadores (Fase 7)](#10-módulo-gestão-de-utilizadores-utilizadores-gabinete-fase-7)
11. [Modal: Telas & Players • Catálogo Global de Hardware (Fase 8)](#11-modal-telas--players--catálogo-global-de-hardware-fase-8)
12. [Modal: Checklist Global de Aberturas & Gestão de Tarefas (Fase 10)](#12-modal-checklist-global-de-aberturas--gestão-de-tarefas-fase-10)
13. [Módulo: Parâmetros Multimédia & Normalização de Cores Operacionais (Fase 11)](#13-módulo-parâmetros-multimédia--normalização-de-cores-operacionais-fase-11)
    - [13.1. Como Aceder ao Módulo](#131-como-aceder-ao-módulo)
    - [13.2. Categorias de Parâmetros Geridas](#132-categorias-de-parâmetros-geridas)
    - [13.3. Adicionar, Editar e Remover Parâmetros](#133-adicionar-editar-e-remover-parâmetros)
    - [13.4. Propagação Automática nos Seletores (Dropdowns) de Telas & Players](#134-propagação-automática-nos-seletores-dropdowns-de-telas--players)
    - [13.5. Padrão Cromático Oficial de Estado Operacional](#135-padrão-cromático-oficial-de-estado-operacional)
14. [Sincronização Dinâmica da Próxima Abertura & Prevenção de Cache (Fase 12)](#14-sincronização-dinâmica-da-próxima-abertura--prevenção-de-cache-fase-12)
    - [14.1. Regras de Elegibilidade da Loja no Hero Card](#141-regras-de-elegibilidade-da-loja-no-hero-card)
    - [14.2. Eliminação de Armazenamento em Cache (HTTP Cache Prevention)](#142-eliminação-de-armazenamento-em-cache-http-cache-prevention)
    - [14.3. Fluxo de Edição Estrutural e Atualização Instantânea](#143-fluxo-de-edição-estrutural-e-atualização-instantânea)
15. [Modal: Base de Dados, Backup & Migração para Synology NAS (Fase 13)](#15-modal-base-de-dados-backup--migração-para-synology-nas-fase-13)
    - [15.1. Como Aceder](#151-como-aceder)
    - [15.2. Funcionalidades do Modal](#152-funcionalidades-do-modal)
    - [15.3. Fluxo de Migração Rápida Mac ➔ Synology NAS (1-Clique)](#153-fluxo-de-migração-rápida-mac--synology-nas-1-clique)
16. [Feed Dinâmico de Atividade Recente & Identificador Único (ID/Serial) de Hardware (Fase 14)](#16-feed-dinâmico-de-atividade-recente--identificador-único-idserial-de-hardware-fase-14)
    - [16.1. Normalização do Título: "Atividade Recente"](#161-normalização-do-título-atividade-recente)
    - [16.2. Auditoria e Telemetria em Tempo Real de Eventos Operacionais](#162-auditoria-e-telemetria-em-tempo-real-de-eventos-operacionais)
    - [16.3. Identificador Único (ID/Serial) de Equipamentos de Hardware](#163-identificador-único-idserial-de-equipamentos-de-hardware)
17. [Experiência Móvel & Operações On-Site em Smartphone / Tablet (Fase 15)](#17-experiência-móvel--operações-on-site-em-smartphone--tablet-fase-15)
    - [17.1. Gaveta de Navegação Lateral (Menu Hambúrguer & Backdrop)](#171-gaveta-de-navegação-lateral-menu-hambúrguer--backdrop)
    - [17.2. Visualização de Aberturas em Cartões Táticos Móveis](#172-visualização-de-aberturas-em-cartões-táticos-móveis)
    - [17.3. Modais em Modo Mobile Sheet & Abas Roláveis](#173-modais-em-modo-mobile-sheet--abas-roláveis)
    - [17.4. Boas Práticas de Operação On-Site no Terreno](#174-boas-práticas-de-operação-on-site-no-terreno)
18. [Mapeamento Interativo de Equipamentos em Planta de Loja (Fase 17)](#18-mapeamento-interativo-de-equipamentos-em-planta-de-loja-fase-17)
    - [18.1. Como Aceder (Atalho Rápido 'Planta' e 4ª Aba da Loja)](#181-como-aceder-atalho-rápido-planta-e-4ª-aba-da-loja)
    - [18.2. Upload e Substituição de Planta Arquitetónica de Loja](#182-upload-e-substituição-de-planta-arquitetónica-de-loja)
    - [18.3. Posicionamento de Displays na Planta (Drag & Drop, Clique e Touch)](#183-posicionamento-de-displays-na-planta-drag--drop-clique-e-touch)
    - [18.4. Visualizador Tático: Zoom, Pan, Pins Coloridos e Radar de Estado](#184-visualizador-tático-zoom-pan-pins-coloridos-e-radar-de-estado)
    - [18.5. Teste de Conectividade (Ping) e Popovers de Telemetria no Mapa](#185-teste-de-conectividade-ping-e-popovers-de-telemetria-no-mapa)
    - [18.6. Persistência Atómica no Volume Synology NAS e Responsividade Mobile](#186-persistência-atómica-no-volume-synology-nas-e-responsividade-mobile)

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

## 3. Modal / Gaveta: Gestão da Loja (Abas: Marcos Técnicos, Custos e Telas)

### 3.1. Como Aceder
Na tabela **"Aberturas em Curso"**, clica no botão **"Gerir"** situado na coluna de ações de qualquer loja. O modal expandido (*large*) abrir-se-á com um sistema de 3 abas operacionais:
* **Aba 1: Marcos Técnicos & Signage**
* **Aba 2: Custos, Diárias & Orçamento**
* **Aba 3: Telas & Players da Loja (Fase 4)**

### 3.1.1. Edição de Dados Estruturais da Loja (Fase 12)
No cabeçalho superior do modal de gestão de abertura, os utilizadores com perfil de **Administrador (`admin`)** ou **Gestor Multimédia (`multimedia_user`)** têm disponível o botão **"✏️ Editar Loja"** (`#btnToggleEditProject`).

1. **Abertura do Formulário**: Ao clicar no botão, expande-se o painel retrátil de edição direta (`#cardEditProject`).
2. **Campos Editáveis**:
   * **Nome da Loja**: Designação oficial do projeto (ex.: `Fnac Vila Nova de Famalicão`).
   * **Insígnia**: Seletor de marca (`Fnac` ou `Darty`).
   * **Formato da Loja**: Tipo de superfície (`Standard`, `Flagship`, `Express`, etc.).
   * **Localização / Morada**: Morada física do estabelecimento.
   * **Data de Inauguração (Go-Live)**: Altera a data de abertura oficial da loja.
   * **Estado da Obra**: Permite comutar o estado operacional (`planeamento`, `em_curso`, `testes_signage`, `concluido`, `atrasado`).
   * **Custo Diário Estimado (€)** e **Orçamento Total (€)**: Ajuste dos valores de referência financeira.
3. **Gravação e Propagação em Tempo Real**:
   * Ao clicar em **"Guardar Alterações"**, o sistema submete via `PATCH /api/v1/projects/:id`.
   * Os dados são validados e persistidos na base de dados SQLite.
   * O modal, a tabela principal de aberturas e o painel superior de KPIs (incluindo o relógio de contagem decrescente do cartão **"Próxima Abertura"**) são atualizados imediatamente sem necessidade de recarregar a página!

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
1. Clica no botão **"+ Registar Custo / Diária"** no cabeçalho do histórico para abrir o formulário desdobrável.
2. Preenche os campos: Data, Categoria de Custo, Valor em euros e Justificação.
3. Clica em **"Gravar Custo"**: O sistema envia os dados via `POST /api/v1/projects/:id/costs`, atualiza o histórico e recalcula todos os saldos e indicadores no modal e no Dashboard principal.

---

### 3.4. Aba 3: Telas & Players da Loja (Fase 4)

Esta aba permite gerir o inventário de ecrãs, totens e media players instalados na loja, associar pacotes de playlists e testar conetividade em tempo real.

#### A. Lista de Ecrãs Instalados
Cada display é apresentado com:
* **Identificação & Localização**: Designação do ponto de exibição (ex: *Video Wall Entrada 4x4*), zona na loja (*Montra*, *Linha de Caixas*, *Auditório*) e modelo de hardware (*BrightSign XT1144 4K*, *Samsung SSP Tizen 6.5*, *LG webOS Signage*).
* **ID / Serial (N.º Série)**: Badge identificador único de património ou número de série do equipamento (ex: `🏷️ BS-XT1144-88412`), facilitando a assistência técnica e auditoria física.
* **Resolução**: Badge indicativo (`4K UHD`, `1920x1080 (FHD)` ou `Video Wall LED`).
* **Endereço de Rede**: IP configurado na VLAN técnica da loja e MAC Address.
* **Seletor Rápido de Playlist**: Menu dropdown direto para associar uma campanha do catálogo a este ecrã específico, com atualização instantânea na base de dados.
* **Badge de Estado**:
  * `Online` (Verde pulsante): Equipamento ativo e a responder à rede.
  * `Syncing` (Azul): A descarregar novo pacote de conteúdos ou playlist.
  * `Testing` (Âmbar): Em calibração de cor, brilho ou áudio.
  * `Offline` (Vermelho): Sem comunicação ou desligado da rede.
* **Botão "Ping"**: Envia um pedido de teste imediato via API `POST /api/v1/signage/players/:id/ping`, atualizando a data de último contacto (*last_ping*) e confirmando que o dispositivo está operacional.
* **Eliminar Ecrã**: Remove o equipamento do parque da loja após confirmação.

#### B. Associar Novo Ecrã / Player
1. Clica no botão **"+ Associar Novo Ecrã / Player"** no cabeçalho da lista.
2. Preenche: Nome do ecrã, ID / Serial (N.º Série), Zona na loja, Modelo de hardware, Resolução de saída e Playlist inicial.
3. Clica em **"Gravar Ecrã"**: O registo é gravado via `POST /api/v1/projects/:id/players`, gera automaticamente um evento na auditoria de *Atividade Recente* e é integrado no cálculo de prontidão de Digital Signage.

---

### 3.5. Aba 4: Planta & Telas Interativa da Loja (Fase 17)

Esta aba constitui o **Mapeamento Arquitetónico Interativo** da loja em obra, concebida especialmente para guiar os técnicos de campo e os gestores do Gabinete Multimédia no chão de loja (*on-site*).

* **Contador Dinâmico no Separador**: O botão da aba indica a taxa de cobertura espacial dos equipamentos: `Planta & Telas (X/Y)`, onde `X` representa os ecrãs já posicionados e `Y` o total de hardware registado na loja.
* **Carregamento da Planta Arquitetónica**: Permite carregar o layout técnico da loja em formato imagem (PNG, JPEG, WebP, SVG de alta definição).
* **Posicionamento Relativo (%)**: Os equipamentos são afixados através de coordenadas percentuais relativas (`pos_x%`, `pos_y%`), garantindo exatidão milimétrica tanto num monitor 4K como num smartphone ou tablet.
* **Pins Interativos com Telemetria**:
  - Ícone representativo do tipo de hardware (TV/Monitor, Totem Vertical, Video Wall LED, Caixa de Som).
  - Ponto de pulso cromático (*radar pulse*) correspondente ao estado operacional: 🟢 Online, 🟠 Em Testes, 🔵 Syncing ou 🔴 Offline.
  - Ao clicar num pin, abre-se um **Popover Tático** com: Nome do equipamento, Modelo, S/N, Zona, Estado, Versão da Playlist e o botão **"📡 Testar Ping"** para validação imediata no local.
* **Gestão de Pendentes vs Posicionados**: Uma barra lateral na área de trabalho da planta separa os equipamentos já posicionados dos "Pendentes de Posicionar", permitindo fixá-los com 1 clique guiado ou desafixá-los a qualquer momento.

---

## 4. Modal: Hub Central de Digital Signage & Playlists (Fase 4)

### 4.1. Como Aceder
No menu lateral esquerdo (Sidebar), clica em qualquer uma destas opções:
* **"Digital Signage / Telas"** (abre diretamente na aba de monitorização do parque global).
* **"Playlists & Conteúdos"** (abre diretamente na aba do catálogo de versões).

O modal extra-largo (*extra-large*) sobrepõe-se ao Dashboard, disponibilizando a visão central do Gabinete Multimédia.

### 4.2. Aba A: Catálogo de Playlists & Versões
Apresenta todas as campanhas audiovisuais disponíveis para transmissão no ecossistema Fnac / Darty:
* **Cartões de Playlist**:
  * Nome oficial e código de referência (ex: `PL-FNAC-CAS-4K`).
  * Insígnia alvo com identidade de marca (Fnac, Darty ou Todas).
  * Resolução, duração do loop contínuo (em minutos e segundos) e contagem de ficheiros de vídeo/spot.
  * Seletor de Estado de Publicação: `Publicada`, `Em Validação`, `Rascunho` ou `Arquivada` (atualizado instantaneamente via `PATCH`).
  * Indicador de ecrãs vinculados: Exibe quantas telas em todo o país estão a reproduzir esta playlist.
* **Botão "+ Nova Versão de Playlist"**:
  * Abre o formulário para registar um novo pacote de conteúdos, definindo a insígnia, versão semântica, duração do ciclo e notas técnicas.

### 4.3. Aba B: Parque Global de Displays
Permite auditar a totalidade dos media players e ecrãs instalados em todas as lojas piloto:
* Tabela completa com Loja, Ponto de Exibição, Modelo de Hardware, IP, Playlist em reprodução e Estado de Conectividade.
* Ação de **Ping Individual** para diagnosticar rapidamente qualquer falha de transmissão em qualquer loja remota sem necessidade de aceder localmente.

---

## 5. Modal: Controlo de Acessos, Sessão de Operador & RBAC (Fase 5)

### 5.1. Widget de Perfil no Rodapé da Sidebar
No canto inferior da barra lateral esquerda encontra-se o **Widget Interativo de Sessão** (`#sidebarUserWidget`), exibindo:
* **Avatar Dinâmico**: Iniciais do operador ativo com anel de cor representativo do seu nível de permissão (Âmbar para Admin, Azul para Multimédia, Verde para Loja, Cinzento para Consulta).
* **Nome e Departamento**: Identificação completa do operador (ex: `Admin Multimédia`, `Gabinete Multimédia (PT)`).
* **Badge de Função (*Role*)**: Indicador textual em tempo real (`admin`, `multimedia_user`, `store_manager`, `viewer`).
* **Botão de Alternância de Perfil (`⇄`)**: Abre de imediato o modal de gestão de sessão.
* **Botão de Logout (`⎋`)**: Termina a sessão ativa e comuta o operador para o modo de segurança `viewer` (apenas leitura).

### 5.2. Como Aceder ao Seletor de Sessão
Existem três formas imediatas de abrir o modal de controlo de acessos:
1. Clica no botão de alternância **`⇄`** no rodapé da sidebar.
2. Clica nos itens **"Perfis & Permissões"** ou **"Utilizadores Ativos"** na secção *Controlo de Acessos* da sidebar.
3. Clica diretamente sobre o avatar ou nome do utilizador no rodapé.

### 5.3. Troca Rápida de Perfil (1-Clique para Ambiente Piloto)
No topo do modal, a secção **"Troca Rápida de Perfil"** disponibiliza 4 cartões pré-configurados que permitem aos operadores e avaliadores alternar instantaneamente entre perfis sem ter de memorizar ou digitar credenciais:

| Cartão / Perfil | Utilizador Semente | Departamento | Foco Operacional |
| :--- | :--- | :--- | :--- |
| **🛡️ Administrador** | `admin.multimedia@fnacdarty.pt` | Gabinete Multimédia (PT) | Acesso irrestrito total. Único com permissão para criar novas aberturas de loja e eliminar projetos. |
| **🎬 Técnico Multimédia** | `signage.pilot@fnacdarty.pt` | Gabinete Multimédia (PT) | Gestão completa de playlists, telas, diárias, custos e marcos técnicos. |
| **🏪 Gestor de Loja** | `loja.cascais@fnacdarty.pt` | Operações de Loja Cascais | Acompanhamento do progresso local, conclusão de tarefas da checklist e teste de ping de ecrãs. |
| **👁️ Consulta / Auditoria** | `auditor.direcao@fnacdarty.pt` | Direção Geral & Auditoria | Perfil 100% de leitura para dashboards executivos e acompanhamento sem risco de alterações acidentais. |

Ao clicar em qualquer um dos cartões:
1. O backend emite instantaneamente um token JWT nativo assinado com HMAC-SHA256 (`POST /api/v1/auth/login`).
2. O token e a matriz de permissões são gravados no `localStorage` do navegador.
3. Uma notificação *toast* confirma a troca de operador.
4. A interface ajusta-se dinamicamente (ocultando ou desativando botões para os quais a função não tem permissão).

### 5.4. Matriz de Permissões Operacionais por Perfil

| Funcionalidade / Ação | Administrador (`admin`) | Técnico Multimédia (`multimedia_user`) | Gestor de Loja (`store_manager`) | Consulta (`viewer`) |
| :--- | :---: | :---: | :---: | :---: |
| **Criar Nova Abertura de Loja** | ✅ Sim | ❌ Bloqueado | ❌ Bloqueado | ❌ Bloqueado |
| **Eliminar Projeto de Loja** | ✅ Sim | ❌ Bloqueado | ❌ Bloqueado | ❌ Bloqueado |
| **Adicionar / Concluir Marcos Técnicos** | ✅ Sim | ✅ Sim | ✅ Sim | ❌ Bloqueado |
| **Eliminar Marcos Técnicos** | ✅ Sim | ✅ Sim | ❌ Bloqueado | ❌ Bloqueado |
| **Registar Custos e Diárias** | ✅ Sim | ✅ Sim | ❌ Bloqueado | ❌ Bloqueado |
| **Eliminar Custos Registados** | ✅ Sim | ✅ Sim | ❌ Bloqueado | ❌ Bloqueado |
| **Criar / Editar Playlists e Telas** | ✅ Sim | ✅ Sim | ❌ Bloqueado | ❌ Bloqueado |
| **Teste de Ping a Media Players** | ✅ Sim | ✅ Sim | ✅ Sim | ❌ Bloqueado |
| **Visualização de KPIs e Dashboards** | ✅ Sim | ✅ Sim | ✅ Sim | ✅ Sim (Apenas Leitura) |

> [!NOTE]
> **Segurança em Duas Camadas:**
> As permissões são aplicadas tanto visualmente no front-end (ocultando botões e desativando caixas de seleção) como no back-end (onde qualquer pedido sem o cabeçalho `Authorization: Bearer <token>` ou de uma função sem privilégios é rejeitado imediatamente com HTTP 401 Unauthorized ou HTTP 403 Forbidden).

### 5.5. Início de Sessão Tradicional com Credenciais Corporativas
Para autenticação formal ou em postos de trabalho partilhados, a secção inferior do modal disponibiliza o formulário clássico com validação PBKDF2:
* **Email Corporativo**: Ex: `admin.multimedia@fnacdarty.pt`.
* **Password**: Senha padrão para o ambiente de testes piloto: `fnac2026`.
* Clica em **"Entrar no RetailLaunchOS"** para validar as credenciais e iniciar a sessão.

---

## 6. Motor Multi-Tema & Identidade Cromática Oficial (Fnac & Darty)

O RetailLaunchOS disponibiliza um motor de visualização moderno adaptativo e diferenciador, desenhado para garantir o máximo conforto de leitura e estrita fidelidade às marcas do grupo **Fnac Darty**.

### 6.1. Seletor Tri-Estado no Cabeçalho Superior
No canto superior direito (ao lado da barra de pesquisa e do botão de notificações), encontra-se o grupo segmentado de alternância rápida de tema:

* ☀️ **Dia (Modo Claro)**:
  * Otimizado para postos em superfícies de loja com iluminação forte ou para apresentações em monitores claros.
  * Fundo limpo `#F8FAFC`, cartões brancos com sombras suaves de alta definição e texto escuro `#0F172A` para contraste máximo (WCAG AAA).
* 🌙 **Noite (Modo Escuro)**:
  * Configuração padrão obsidian `#090D16` com painéis em vidro translúcido (*glassmorphism*), sombras volumétricas e iluminação periférica sutil. Ideal para bastidores técnicos, auditórios e menor cansaço visual noturno.
* 💻 **Auto (Automático)**:
  * Segue automaticamente as definições do Sistema Operativo (macOS, Windows, iOS, Android).
  * O sistema deteta em tempo real a transição Dia/Noite do computador através da API `prefers-color-scheme`, comutando de imediato sem necessidade de recarregar a página.

> [!TIP]
> **Zero FOUC (Flash of Unstyled Content):**
> A preferência de tema é gravada instantaneamente no navegador (`localStorage`). O cabeçalho da página executa um script ultraleve pré-renderização que aplica o tema antes do desenho de qualquer elemento, eliminando qualquer flash de tela branca ao navegar.

### 6.2. Paleta Oficial de Cores Rigorosa

| Insígnia / Categoria | Cor Primária | Código Hex | Utilização Principal |
| :--- | :--- | :--- | :--- |
| **Fnac** | Dourado / Amarelo Oficial | `#F5B027` | Botões de ação primária, cartões de contagem decrescente, avatares de administração e realces ativos |
| **Fnac** | Preto Puro | `#000000` | Tipografia em botões primários Fnac para contraste perfeito e fidelidade de marca |
| **Fnac** | Branco Puro | `#FFFFFF` | Superfícies, textos de elevado destaque e contrastes |
| **Darty** | Vermelho Oficial | `#E21212` | Badges de marca Darty, alertas críticos, ações de desconexão e status offline |
| **Darty** | Preto Puro | `#000000` | Fundos e contrastes de insígnia |
| **Darty** | Branco Puro | `#FFFFFF` | Tipografia em badges Darty |

### 6.3. Paleta Secundária Oficial Partilhada

O sistema utiliza 6 cores secundárias normalizadas para identificação de periféricos, tipos de custos e status de telas:

1. **Azul Corporativo (`#006EFA`)**: Utilizado em status de sincronismo de telas, rede LAN/Wi-Fi e displays Full HD.
2. **Verde Sucesso (`#39D66A`)**: Indica displays 100% online, saldo orçamental positivo e tarefas concluídas.
3. **Amarelo Destaque (`#FFDB00`)**: Identifica displays 4K Ultra HD e avisos operacionais.
4. **Roxo Multimédia (`#9147FF`)**: Sinaliza despesas de hardware, servidores BrightSign e telas de topo.
5. **Turquesa Conetividade (`#28E4AB`)**: Aplicado em gradientes de prontidão de rede audiovisual e testes de broadcast.
6. **Rosa Neon (`#FF7BF9`)**: Utilizado em custos e rubricas orçamentais diversas.

## 7. Painel de KPIs & Contagem Decrescente (Fase 10: Gestão, Planeamento de Lojas & Checklists)

O painel superior do Dashboard é composto por **3 cartões estratégicos e equilibrados de alta densidade**, reestruturados na **Fase 10** para apoiar a operação sem desperdício de espaço e com visibilidade imediata de cada loja e marco:

1. **Card 1 • Próxima Abertura (Hero Card)**:
   * **Deteção Dinâmica Inteligente**: Deteta e elege automaticamente a loja ativa com a data de go-live mais iminente (`go_live_date >= hoje`). **Exclui de forma estrita** lojas que já tenham o estado `concluido` ou `cancelado`.
   * **Subtítulo Estruturado**: Apresenta a marca e o formato da loja (ex.: *Fnac Standard*, *Fnac Flagship*, *Darty Pro*).
   * **Relógio Decrescente ao Segundo**: Contagem precisa calculada a partir do fuso horário local `[Dias : Horas : Minutos : Segundos]`.
   * **Badge de Signage Dinâmico**: Badges cromáticos oficiais (`badge-signage-ok`, `badge-signage-testing`, `badge-signage-pending`).
   * **Progresso da Loja (%)**: Barra de progresso calculada matematicamente a partir dos marcos concluídos da loja (`(concluídas / total) * 100`).
   * **Displays**: Quantidade total de ecrãs/players alocados a esta abertura específica.
   * **Formatos**: Contagem de formatos de saída distintos (ex.: *4K*, *FHD*, *LED Wall*).
   * **Playlists**: Estado de vinculação de campanhas para as telas da loja (`100% OK`, `X a Associar` ou `0 Telas`).
   * **Sincronização & Zero Cache**: As requisições de dados utilizam cabeçalhos `Cache-Control: no-store`. Ao fazer refresh da página (`F5`), o cartão reflete imediatamente quaisquer alterações em datas, nomes ou conclusões de obras.

2. **Card 2 • Planeamento Lojas (Progresso Individual por Loja)**:
   * **Visualização Global por Loja**: Apresenta a lista organizada de todas as lojas em fase de planeamento e abertura ativa.
   * **Nome e Barra de Progresso**: Para cada loja, exibe:
     * Badge oficial da marca (**FNAC** em dourado / **DARTY** em vermelho).
     * Nome da Loja com tooltip detalhado.
     * Barra de progresso horizontal colorida com a identidade da marca ou gradiente ouro/verde.
     * Percentagem de prontidão (`%`) calculada a partir dos seus marcos técnicos concluídos.
   * **Interação Direta**: Ao clicar em qualquer linha de loja na lista, abre-se de imediato a gaveta de detalhe técnico dessa obra específica (`openProjectDetails`).
   * **Sub-Métricas**: Rodapé com o número de lojas ativas em curso e a média consolidada de progresso.

3. **Card 3 • Checklists & Prazos (Cartão Unificado de Alta Densidade)**:
   * Reúne o controlo de tarefas e a gestão de urgência temporal num único painel de alta densidade operacional, dividido em **duas colunas lado a lado**:
     * **Coluna Esquerda • Tarefas em Checklist (Clicável)**:
       * Número em destaque de tarefas pendentes em todo o ecossistema (`totalPending`).
       * Chips de gravidade: `X Críticas` (vermelho) e `Y Altas` (âmbar).
       * *Ação de Clique*: Abre instantaneamente o **Modal de Checklist Global de Aberturas** filtrado em *"Pendentes"*.
     * **Coluna Direita • Due Soon • Esta Semana (Clicável)**:
       * Número em destaque de tarefas com prazo na semana corrente (`due_date <= hoje + 7 dias`).
       * Pílulas de alerta: `⚠️ X Atrasadas` (com destaque pulsante se houver atrasos) e `Y Esta Semana`.
       * *Ação de Clique*: Abre instantaneamente o modal filtrado em *"⚡ Due Soon"*.
     * **Atalho Inferior**: Link *"Abrir Gestão Global de Tarefas"* para visão geral de todas as tarefas.

4. **Resumo Operacional de Aberturas (Cabeçalho da Tabela)**:
   * Posicionado no topo da secção *"Aberturas em Curso"*, sintetiza o volume global de lojas em 5 indicadores integrados:
     * **Em Curso**: Lojas com trabalhos técnicos e montagem de telas em execução ativa.
     * **Planeamento**: Lojas em fase de provisionamento, licenciamento e agendamento.
     * **Concluído**: Lojas com inauguração realizada e entregues à operação.
     * **Total**: Número global de lojas piloto no portfólio.
     * **Signage**: Síntese de prontidão de telas em lote (`Pronto`, `Configuração`, `Pendente`).

---

## 8. Filtros, Pesquisa e Exportação CSV

### 8.1. Filtragem Rápida por Insígnia
Por cima da tabela, clica nos botões:
* **Todas**: Apresenta todas as lojas do portfólio.
* **Fnac**: Filtra apenas lojas com marca Fnac (fundo dourado `#F5B027`).
* **Darty**: Filtra apenas lojas com marca Darty (fundo vermelho `#E21212`).

### 8.2. Pesquisa Instantânea (`⌘K`)
* Escreve no campo de pesquisa do cabeçalho qualquer termo (ex: *"Cascais"*, *"Darty"*, *"Shopping"*).
* A tabela filtra as linhas em tempo real à medida que digitas.

### 8.3. Exportação para CSV
* Clica no botão **"Exportar CSV"** no canto direito da secção de aberturas.
* O sistema compila os dados atuais e descarrega automaticamente um ficheiro formatado: `RetailLaunchOS_Aberturas_AAAA-MM-DD.csv`, pronto para abrir no Excel ou Google Sheets.

---

## 9. Boas Práticas de Operação

1. **Nomenclatura**: Utiliza sempre a convenção `[Insígnia] [Nome do Centro ou Cidade]` (ex: `Fnac Forum Coimbra`, `Darty Sintra`).
2. **Datas de Entrega**: Define sempre a *Entrega Técnica Multimédia* pelo menos 5 dias antes do *Go-Live*, permitindo testes de stress de reprodução contínua 24/7 nas telas antes da inauguração.
3. **Playlists**: Mantém o padrão de numeração semântica nas playlists (ex: `v1.0-abertura`, `v1.1-ajustes`, `v2.0-campanha`).
4. **Registo Imediato de Diárias**: Imputar as diárias e custos de deslocação no próprio dia da intervenção para manter o saldo orçamental permanentemente fidedigno.
5. **Verificação de Rede de Displays**: Realizar testes de *Ping* a todos os players após a entrega técnica para garantir que nenhuma tela se encontra no estado `Offline` no dia da abertura.
6. **Sessões e Auditoria**: Em postos partilhados na loja ou no auditório, terminar sempre a sessão ou mudar para o perfil `viewer` para prevenir edições acidentais no planeamento técnico.
7. **Modo de Ecrã**: Recomenda-se o uso do modo **Dia** em auditorias durante o horário de abertura de loja e o modo **Noite** durante as montagens noturnas para reduzir a luminosidade excessiva.

---

## 10. Módulo de Gestão de Utilizadores (Fase 7)

**Acesso**: Barra lateral esquerda → secção **"Controlo de Acessos"** → **"Utilizadores"**

> ⚠️ **Permissão Necessária**: As operações de criação, edição e desativação de utilizadores estão restritas ao perfil **Administrador**. Os restantes perfis apenas visualizam a lista de utilizadores.

### 10.1. Abrir o Módulo de Utilizadores
1. Clica no item **"Utilizadores"** na barra lateral (secção *Controlo de Acessos*).
2. O modal de gestão abre com a lista completa de todos os utilizadores registados.

### 10.2. Pesquisar Utilizadores
* Usa o campo de pesquisa **"Pesquisar por nome ou email..."** para filtrar a tabela em tempo real.
* A contagem no topo atualiza automaticamente com o número de resultados.

### 10.3. Criar um Novo Utilizador (apenas Admin)
1. Clica no botão **"＋ Novo Utilizador"** (visível apenas para o perfil *Administrador*).
2. Preenche o formulário que surge no topo do modal:

| Campo | Obrigatório | Descrição |
| :--- | :---: | :--- |
| **Nome Completo** | ✅ | Nome de exibição do operador |
| **Email Corporativo** | ✅ | Email único (ex: `nome@fnacdarty.pt`) |
| **Password** | ✅ | Mínimo 6 caracteres. Padrão piloto: `fnac2026` |
| **Departamento** | — | Por defeito: `Gabinete Multimédia` |
| **Perfil de Acesso** | ✅ | Um dos 4 perfis RBAC disponíveis |
| **Estado** | — | Ativo (por defeito) ou Inativo |

3. Clica em **"💾 Guardar Utilizador"** para registar na base de dados.
4. O sistema exibe um *toast* de confirmação e atualiza a tabela.

### 10.4. Editar um Utilizador (apenas Admin)
1. Na linha do utilizador pretendido, clica em **"✏️ Editar"**.
2. O formulário de edição pré-preenche todos os campos existentes.
3. Modifica os campos necessários (a password pode ser deixada em branco para não alterar).
4. Clica em **"💾 Guardar Utilizador"** para aplicar as alterações.

### 10.5. Desativar um Utilizador (apenas Admin)
1. Na linha do utilizador ativo, clica em **"🔒 Desativar"**.
2. Um diálogo de confirmação é apresentado antes de prosseguir.
3. Após confirmação, o utilizador fica com estado `Inativo` e não poderá fazer login.
4. Os dados históricos (projetos, tarefas, custos) são **preservados integralmente**.

### 10.6. Reativar um Utilizador (apenas Admin)
1. Na linha do utilizador inativo (apresentada com opacidade reduzida), clica em **"🔓 Reativar"**.
2. Após confirmação, o acesso ao sistema é restaurado.

### 10.7. Secção "Configurações" na Barra Lateral
A secção **"Configurações"** na barra lateral do dashboard centraliza as ferramentas estruturais de inventário e parametrização do sistema:
* **"Telas & Players"**: Abre diretamente o **Catálogo Global de Hardware**, permitindo criar, inventariar, editar e eliminar ecrãs e players de Digital Signage para todo o ecossistema Fnac / Darty (com ou sem loja associada).

---

## 11. Modal: Telas & Players • Catálogo Global de Hardware (Fase 8)

### 11.1. Como Aceder
Na barra lateral de navegação, na secção **"Configurações"**, clica em **"Telas & Players"**. O modal **"Telas & Players • Catálogo Global de Hardware"** abre-se centralmente no ecrã.

### 11.2. Estrutura do Catálogo Global vs Associações por Loja
* **Catálogo Global em "Configurações" (Fase 8 & 16)**: Gere o **inventário físico de hardware** (dispositivos BrightSign, Samsung Tizen, LG webOS, Mini PCs). Permite registar displays mesmo antes de serem atribuídos a uma obra/loja (ficando identificados como `📦 Em Stock / Sem Loja`), editar especificações técnicas (modelo, resolução, firmware, serial number) e desassociar/reassociar entre projetos.
* **Aba "Telas & Players" no Detalhe da Loja (Fase 4 & 16)**: Permite visualizar e controlar apenas os displays instalados naquela obra específica.

### 11.3. Registar Novo Ecrã / Player (Vista Dedicada sem Amostragem)
1. No topo do modal do catálogo, clica no botão **"＋ Novo Ecrã / Player"** (disponível para perfis *Admin* e *Técnico Multimédia*).
2. A vista da tabela é temporariamente ocultada, abrindo uma janela limpa, dedicada e focada exclusivamente no formulário de registo (eliminando qualquer conflito de largura ou overscroll horizontal).
3. Preenche os campos do formulário:
   * **Nome do Ecrã / Display \***: Nome descritivo (ex: `Video Wall Entrada 4x4`, `Totem Interativo Montra`).
   * **ID / Serial (N.º Série)**: Identificador único de equipamento ou número de série do fabricante (ex: `BS-XT1144-88412`, `S24B40091`, `PAT-FNAC-00912`), essencial para inventário técnico e garantia.
   * **Modelo de Hardware**: Selecionar na lista (`BrightSign XT1144 4K`, `Samsung SSP Tizen`, `LG webOS Signage`, `Display Android Genérico`, `Mini PC Windows / Linux`).
   * **Zona / Localização \***: Zona física na loja ou armazém (ex: `Entrada Principal`, `Montra`, `Linha de Caixas`, `Stock Central`).
   * **Resolução / Formato**: Resolução nativa (`4K UHD`, `FHD 1080p`, `HD 720p`, `Video Wall LED`, `Formato Vertical 9:16`).
   * **Estado Operacional**: `Online`, `Testing`, `Syncing` ou `Offline`.
   * **Versão de Firmware**: Versão instalada no media player (ex: `v9.0.145`).
   * **Loja / Projeto Associado**: Selecionar a loja correspondente (`Fnac Cascais`, `Darty Alfragide`, etc.) ou deixar em **"— Em Stock / Não Associado a Projeto —"** para ecrãs de reserva ou catálogo.
   * **Playlist Vinculada**: Selecionar opcionalmente a versão de playlist do catálogo para sincronização de conteúdos.
4. Clica em **"💾 Guardar Hardware"** (ou em **"← Voltar ao Catálogo"** para cancelar). Ao guardar, o dispositivo é gravado com sucesso, gera um evento na auditoria de *Atividade Recente* e o sistema regressa de imediato à vista do catálogo total com a listagem atualizada.

### 11.4. Editar Hardware e Reatribuição de Loja
1. Na linha correspondente ao ecrã/player, clica no botão **"✏️ Editar"**.
2. A tabela de hardware é ocultada e abre-se a janela de edição dedicada com os dados atuais pré-preenchidos.
3. Altera qualquer parâmetro, incluindo o número de série ou a **reatribuição de loja** (ex: transferir um display de *Stock* para uma loja ou de uma loja para outra).
4. Clica em **"💾 Guardar Hardware"**: as alterações são salvas e o ecrã regressa automaticamente à listagem do catálogo total.

### 11.5. Teste de Conectividade (Ping em Tempo Real)
* Na coluna de ações de cada linha, clica no botão **"📡 Ping"**.
* O sistema envia um sinal de handshake, atualiza o estado operacional e o timestamp `last_ping` do player, e gera automaticamente um registo de atividade operacional.

### 11.6. Eliminar Ecrã / Player do Catálogo
1. Clica no botão com o ícone de caixote do lixo **"🗑️"** na linha do dispositivo.
2. O sistema aciona a ação com segurança absoluta por ID numérico (eliminando qualquer falha mesmo em equipamentos que contenham aspas no nome, como `LCD Samsung 32"`).
3. É solicitada a confirmação explícita de eliminação irreversível.
4. Após confirmação, o dispositivo é removido permanentemente do catálogo e da base de dados.

### 11.7. Filtros Rápidos e Pesquisa Dinâmica
* **Filtro de Associação**: Permite filtrar entre *Todas as Associações*, *📦 Em Stock / Sem Loja*, *🟡 Fnac* ou *🔴 Darty*.
* **Filtro de Estado**: Permite filtrar por *Online*, *Syncing*, *Testing* ou *Offline*.
* **Campo de Pesquisa**: Filtra instantaneamente conforme o operador digita nome, modelo, ID / Número de Série (`serial_number`), zona ou loja.

---

## 12. Modal: Checklist Global de Aberturas & Gestão de Tarefas (Fase 10)

### 12.1. Como Aceder
O operador pode aceder ao modal de três formas diretas a partir do cartão **"Checklists & Prazos"**:
1. **Clique no Bloco "Checklist / Tarefas Pendentes"**: Abre o modal pré-filtrado para **"Pendentes"**.
2. **Clique no Bloco "⚡ Due Soon"**: Abre o modal pré-filtrado para **"⚡ Due Soon"** (prazos nos próximos 7 dias).
3. **Clique no Atalho "Abrir Gestão Global de Tarefas"**: Abre o modal com a visão de todas as tarefas de abertura.

### 12.2. Barra de Ferramentas & Filtros Dinâmicos
No topo do modal, o operador dispõe de filtros em pílula (*chips*) com contadores automáticos sincronizados com a base de dados:
* **Pendentes (`gtBadgePending`)**: Exibe apenas tarefas por concluir (`status != 'concluido'`).
* **⚡ Due Soon (`gtBadgeDueSoon`)**: Tarefas cujo prazo vence na semana em curso (próximos 7 dias).
* **⚠️ Em Atraso (`gtBadgeOverdue`)**: Tarefas não concluídas cuja data limite já foi ultrapassada (`due_date < hoje`).
* **✓ Concluídas**: Tarefas finalizadas com sucesso para consulta e histórico.
* **Ver Todas**: Mostra o panorama global de tarefas de todas as lojas.

### 12.3. Filtragem por Loja Específica
À direita da barra de ferramentas, o seletor **"Loja:"** permite filtrar a checklist para:
* **Todas as Lojas Ativas** (visão consolidada agrupada por loja).
* **Loja Individual** (ex: `🟡 Fnac Cascais`, `🟡 Fnac Famalicão`, `🔴 Darty Alfragide`).

### 12.4. Criação Rápida de Tarefas ("＋ Nova Tarefa")
1. Clica no botão **"＋ Nova Tarefa"**. O painel superior expande-se suavemente.
2. Preenche os campos do formulário rápido:
   * **Título da Tarefa \***: Ex.: *Calibração de som e áudio zoneado*, *Montagem de suporte de teto*.
   * **Loja de Destino \***: Dropdown com as lojas em planeamento e abertura.
   * **Departamento**: `Multimédia & Telas`, `Redes & IT`, `Operações de Loja` ou `Marketing & Conteúdos`.
   * **Prioridade**: `Crítica`, `Alta`, `Média` ou `Baixa`.
   * **Descrição / Observações Técnicas**: Requisitos de fornecedores, cabos, conetores.
   * **Data Limite (Due Date)**: Pré-preenchida com data a 7 dias para conveniência.
3. Clica em **"💾 Gravar Tarefa"**.
4. O modal recarrega a lista instantaneamente e **todo o Dashboard** (cartões de topo e tabela de aberturas) atualiza o seu progresso e contadores no mesmo milissegundo!

### 12.5. Alteração Imediata de Estado (Checkboxes Interativas)
* Cada tarefa apresenta uma **checkbox interativa** à esquerda.
* Ao marcar/desmarcar a checkbox:
  1. É enviado um pedido `PATCH /api/v1/tasks/:id/toggle`.
  2. O título da tarefa é tachado e recebe estilo visual de conclusão.
  3. A **mini barra de progresso da loja** no cabeçalho do cartão atualiza a percentagem e a contagem (ex.: `2/4 concluídas (50%)`).
  4. O cartão **"Progresso do Planeamento"** do Dashboard recalcula a percentagem consolidada de todas as lojas.
  5. Os cartões de **"Tarefas em Checklist"** e **"Due Soon"** diminuem imediatamente as contagens de pendentes.
  6. A tabela de **"Aberturas em Curso"** reflete a subida de progresso da loja em questão.

### 12.6. Agrupamento por Loja e Atalho "Ver Loja ↗"
* As tarefas são agrupadas num cartão individual por loja (`.gt-store-card`) com o badge oficial da marca (**Fnac** em dourado / **Darty** em vermelho).
* No canto superior direito de cada loja, o botão **"Ver Loja ↗"** abre instantaneamente a gaveta de detalhe completo daquela loja específica (com as abas de Marcos, Custos e Telas).

---

## 13. Módulo: Parâmetros Multimédia & Normalização de Cores Operacionais (Fase 11)

O módulo de **Parâmetros Multimédia** centraliza a gestão dos catálogos técnicos do Gabinete Multimédia, eliminando campos de texto livre sujeitos a gralhas e alimentando diretamente as caixas de seleção (*dropbox* / dropdowns `<select>`) em todos os formulários da aplicação.

---

### 13.1. Como Aceder ao Módulo

Existem dois caminhos rápidos para abrir o modal de Parâmetros Multimédia (`#modalConfigParameters`):
1. **Via Sidebar Principal**: No menu lateral esquerdo, sob o agrupamento **Configurações**, clica na opção **"Modelos, Zonas & Formatos"** (`#nav-config-parameters`).
2. **Via Catálogo de Telas & Players**: No modal global de telas (`#modalPlayersCatalog`), clica no botão com ícone de engrenagem **"⚙️ Gerir Parâmetros"** situado na barra de topo.

> [!NOTE]
> O acesso a este módulo requer privilégios de **Administrador** (`admin`) ou **Utilizador Multimédia** (`multimedia_user`). Utilizadores com perfil de Loja ou Consulta (*Viewer*) têm o formulário de adição/edição protegido por RBAC (`HTTP 403`).

---

### 13.2. Categorias de Parâmetros Geridas

O modal organiza os parâmetros técnicos em três abas com contadores em tempo real:

1. **🖥️ Modelos de Hardware (`hardware_model`)**:
   - Catálogo de players e ecrãs profissionais homologados pela Fnac e Darty (ex.: *BrightSign XT1144 4K*, *BrightSign HD224*, *Samsung SSP Tizen 6.5*, *LG webOS Signage 6.0*, *Philips D-Line Android*, etc.).
2. **📍 Zonas / Localizações (`zone_location`)**:
   - Áreas padrão dentro do layout das lojas para posicionamento dos pontos de exibição (ex.: *Entrada Principal*, *Montra Lateral*, *Fachada Principal*, *Linha de Caixas*, *Balcão de Apoio / Serviços*, *Fórum Cultural / Bilheteira*, *Zona Café / Lounge*, etc.).
3. **📐 Resoluções / Formatos (`resolution`)**:
   - Especificações de resolução de vídeo e orientações suportadas pelos sistemas (ex.: *4K UHD (3840x2160)*, *FHD 1080p (1920x1080)*, *HD 720p (1280x720)*, *Video Wall LED*, *Formato Vertical 9:16 (1080x1920)*, *Ultra-Stretch (3840x600)*, etc.).

---

### 13.3. Adicionar, Editar e Remover Parâmetros

* **Adicionar Novo Parâmetro**:
  1. Clica na aba correspondente (Hardware, Zonas ou Resoluções).
  2. No painel **"＋ Adicionar Novo Parâmetro"**, preenche o **Nome / Designação \*** e a **Descrição / Notas Técnicas**.
  3. Clica em **"Adicionar à Categoria"**.
  4. O item é gravado na tabela `system_parameters` via `POST /api/v1/config/parameters` e surge imediatamente na lista com animação suave.
* **Editar Parâmetro Existente**:
  - Clica no botão de edição (**✏️**) na linha do parâmetro. Uma caixa de diálogo interativa solicita o novo nome e descrição, enviando as alterações via `PUT /api/v1/config/parameters/:id`.
* **Remover Parâmetro**:
  - Clica no botão de eliminação (**🗑️**). O sistema solicita confirmação de segurança e remove o parâmetro via `DELETE /api/v1/config/parameters/:id`.

---

### 13.4. Propagação Automática nos Seletores (Dropdowns) de Telas & Players

Sempre que um parâmetro é criado, editado ou removido no módulo de configurações:
* **Catálogo Global de Telas (`#modalPlayersCatalog`)**: Os dropdowns de *Modelo de Hardware*, *Zona / Localização* e *Resolução de Saída* são atualizados instantaneamente sem necessidade de recarregar a página (`F5`). O campo de Zona deixou de ser texto livre e passou a ser uma caixa de seleção obrigatória.
* **Ficha de Loja (`openProjectDetails` -> Aba "Telas & Players")**: O formulário desdobrável **"+ Associar Novo Ecrã / Player"** consome automaticamente a lista dinâmica de parâmetros, garantindo consistência e integridade em todo o sistema.

---

### 13.5. Padrão Cromático Oficial de Estado Operacional

Para garantir leitura operacional imediata e evitar ambiguidades de monitorização em sala de controlo, os estados operacionais das telas e players foram rigorosamente padronizados em todo o sistema:

| Estado Operacional | Cor Indicadora | Código Hexadecimal | Ícone / Ping Dot | Significado Operacional |
| :--- | :--- | :--- | :--- | :--- |
| **Online (Ativo)** | **Verde** | `#10B981` | 🟢 Ponto pulsante verde | O ecrã está operacional, com heartbeat ativo e a emitir broadcast normal. |
| **Em Testes** | **Laranja** | `#F59E0B` | 🟠 Ponto pulsante laranja | O dispositivo está em montagem física, comissionamento ou homologação de sinal. |
| **A Sincronizar** | **Azul** | `#3B82F6` | 🔵 Ponto pulsante azul | O player está a transferir pacotes de vídeo, layouts HTML5 ou atualização de firmware. |
| **Offline (Inativo)** | **Vermelho** | `#EF4444` | 🔴 Ponto pulsante vermelho | Sem sinal de rede, alimentador desligado ou anomalia de comunicação. |

> [!TIP]
> Esta paleta aplica-se tanto às opções das caixas de seleção `<select>`, como aos chips e badges da tabela de catálogo e aos pontos luminosos (*status-dot-ping*) na ficha técnica de cada loja.

---

## 14. Sincronização Dinâmica da Próxima Abertura & Prevenção de Cache (Fase 12)

### 14.1. Regras de Elegibilidade da Loja no Hero Card
O cartão **"Próxima Abertura"** obedece a um algoritmo estrito de priorização para garantir que reflete fielmente a realidade das obras do Gabinete Multimédia:

1. **Critério Principal**: O sistema consulta a base de dados SQLite filtrando apenas lojas que:
   * **NÃO** estejam no estado `concluido` nem `cancelado`.
   * Possuam data de go-live igual ou posterior à data atual (`go_live_date >= DATE('now', 'localtime')`).
   * Ordena por data de inauguração ascendente (`ORDER BY go_live_date ASC LIMIT 1`).
2. **Critério Fallback**: Se todas as lojas ativas tiverem datas anteriores (ou pendentes de nova calendarização), o sistema seleciona a loja ativa mais recente que permaneça em curso ou planeamento, garantindo que o cartão nunca surge vazio.
3. **Conclusão Automática**: Assim que uma loja é marcada como `concluido`, o sistema promove imediatamente a próxima loja ativa do portfólio (por exemplo, ao concluir *Fnac Famalicão*, o sistema avança automaticamente para *FNAC Madeira*).

### 14.2. Eliminação de Armazenamento em Cache (HTTP Cache Prevention)
Para garantir que o comando de atualização do navegador (`F5`, `⌘R` ou `Ctrl+R`) apresente dados rigorosamente sincronizados:
* O servidor HTTP emite os cabeçalhos normativos:
  ```http
  Cache-Control: no-store, no-cache, must-revalidate, proxy-revalidate
  Pragma: no-cache
  Expires: 0
  ```
* Todas as invocações `fetch()` efetuadas pelo frontend incluem o parâmetro `{ cache: 'no-store' }`.
* Não são mantidas variáveis estáticas de template com nomes fictícios no HTML, eliminando qualquer cintilação visual (*layout shift* ou dados fantasmas).

### 14.3. Fluxo de Edição Estrutural e Atualização Instantânea
Quando um operador com perfil autorizado altera a data de go-live ou o estado de uma loja através do botão **"✏️ Editar Loja"**:
1. O pedido `PATCH /api/v1/projects/:id` grava os novos valores diretamente no SQLite.
2. O modal atualiza os seus títulos e datas.
3. A grelha de abertura e os cartões superiores de KPIs recalculam os valores e o relógio decrescente ajusta-se imediatamente ao novo prazo sem requerer recarregar a página.

---

## 15. Modal: Base de Dados, Backup & Migração para Synology NAS (Fase 13)

### 15.1. Como Aceder
No menu lateral esquerdo (Sidebar), sob o grupo **"Configurações"**, clica na opção **"Base de Dados & Migração"** (`#nav-config-database`). O modal sobrepõe-se ao Dashboard, disponibilizando a gestão central do ficheiro SQLite (`retaillaunch.sqlite`).

> [!NOTE]
> Esta funcionalidade está restrita a utilizadores com perfil de **Administrador (`admin`)** ou **Gestor Multimédia (`multimedia_user`)** para garantir a segurança e integridade dos dados da organização.

---

### 15.2. Funcionalidades do Modal

#### A. Painel de Estado da Base de Dados Ativa
Exibe a telemetria em tempo real da base de dados ativa no servidor atual:
* **Tamanho em Disco**: Tamanho consolidado (ex: `128.0 KB`).
* **Lojas / Projetos**: Contagem total de aberturas cadastradas.
* **Tarefas Técnicas**: Volume de marcos técnicos registados.
* **Telas & Players**: Parque de hardware multimédia inventariado.
* **Caminho Físico e Última Modificação**: Caminho no sistema operativo (ou dentro do contentor Docker `/app/database/retaillaunch.sqlite`) e carimbo de data/hora da última escrita.
* **Botão "🔄 Atualizar"**: Força um novo checkpoint WAL e recarrega as métricas da base de dados.

#### B. Descarregar Backup Local
* Ao clicar no botão dourado **"⬇️ Descarregar Base de Dados"**, o sistema executa um `PRAGMA wal_checkpoint(TRUNCATE)` que unifica todas as transações pendentes e transfere para o teu computador o ficheiro consolidado `retaillaunch_backup_AAAA-MM-DD.sqlite`.
* Este ficheiro é 100% autónomo e pode ser guardado como cópia de segurança de desastre (*Disaster Recovery*) ou utilizado diretamente para migrar dados entre o Mac e o Synology NAS.

#### C. Restaurar / Migrar Base de Dados para o Servidor
Permite substituir a base de dados do servidor (Mac ou NAS) através de upload direto no browser:
1. Clica na caixa de seleção ou arrasta o ficheiro `.sqlite` desejado.
2. O sistema indica o nome e tamanho do ficheiro selecionado e ativa o botão de confirmação.
3. Clica em **"⬆️ Confirmar Restauro / Migração"**:
   * O sistema solicita uma confirmação explícita de segurança.
   * Cria automaticamente uma cópia de salvaguarda da base de dados atual (`retaillaunch.sqlite.bak`).
   * Valida a integridade do ficheiro enviado (verificando a assinatura binária `SQLite format 3` e a presença das tabelas essenciais).
   * Substitui o ficheiro, limpa buffers WAL/SHM residuais e recarrega a ligação em tempo real.
   * Apresenta notificação de sucesso e atualiza automaticamente os dados da página.

---

### 15.3. Fluxo de Migração Rápida Mac ➔ Synology NAS (1-Clique)
1. No **Mac** (`http://localhost:3000`), vai a **Configurações ➔ Base de Dados & Migração** e clica em **"⬇️ Descarregar Base de Dados"**.
2. No **Synology NAS** (`http://<IP_DO_NAS>:3000`), vai a **Configurações ➔ Base de Dados & Migração**.
3. Seleciona o ficheiro `.sqlite` descarregado e clica em **"⬆️ Confirmar Restauro / Migração"**.
4. Concluído! O NAS passa a ter exatamente as mesmas lojas, datas, tarefas e parâmetros do teu Mac.
5. Nas próximas atualizações de código com `git pull` e `docker compose`, o volume persistente do NAS mantém todos estes dados permanentemente salvaguardados.

---

## 16. Feed Dinâmico de Atividade Recente & Identificador Único (ID/Serial) de Hardware (Fase 14)

### 16.1. Normalização do Título: "Atividade Recente"
O cartão de auditoria situado na coluna direita do Dashboard foi simplificado e normalizado:
* **Título Atual**: **"Atividade Recente"** (substituindo a denominação anterior *"Atividade Recente • Gabinete Multimédia"*).
* **Botão de Refresh Manual**: O cabeçalho do cartão inclui o botão **"🔄"** (`#btnRefreshActivityFeed`) para permitir aos operadores forçar a leitura imediata dos últimos eventos registados no servidor sem necessidade de recarregar a página inteira.

### 16.2. Auditoria e Telemetria em Tempo Real de Eventos Operacionais
O cartão "Atividade Recente" deixou de ter registos fixos e passa a consumir a API REST em tempo real (`GET /api/v1/activities?limit=15`). Todas as ações executadas no sistema geram um rasto de auditoria persistido na base de dados SQLite:

| Tipo de Ação | Ícone | Gatilho Operacional | Detalhe Apresentado |
| :--- | :---: | :--- | :--- |
| **Abertura Criada / Atualizada** | 🏪 | Registo de nova loja ou alteração de dados estruturais | Nome da loja, insígnia e autor da operação |
| **Marco Concluído** | ✅ | Conclusão de uma tarefa técnica de abertura | Título do marco e loja associada |
| **Marco Reaberto** | ↩️ | Reabertura de uma tarefa técnica pendente | Título do marco e loja associada |
| **Nova Tarefa Adicionada** | 📋 | Criação de um novo marco na checklist | Nome da tarefa, prioridade e loja |
| **Custo / Diária Registada** | 💶 | Lançamento de despesa, diária ou licença | Montante (€), categoria de custo e loja |
| **Hardware Registado / Editado** | 🖥️ | Adição ou alteração de player no catálogo ou loja | Nome do ecrã, zona, N.º de Série e loja |
| **Ping de Conectividade** | 📡 | Disparo de sinal de telemetria / handshake de rede | IP do equipamento e estado de resposta |
| **Parâmetros Alterados** | ⚙️ | Gestão de modelos, zonas ou resoluções | Categoria e valor do parâmetro |

* **Tempo Relativo Inteligente**: Cada entrada exibe o carimbo temporal formatado em linguagem humana e reativa (*"Agora mesmo"*, *"há 5m"*, *"há 2h"*, *"ontem às 14:30"*, *"12 de mar às 10:15"*).
* **Auto-Atualização Coordenada**: O feed de atividades atualiza-se automaticamente no carregamento da página, no ciclo de polling de KPIs e imediatamente após qualquer operação de criação/edição no Dashboard.

### 16.3. Identificador Único (ID/Serial) de Equipamentos de Hardware
Para responder aos requisitos de gestão patrimonial, rastreabilidade física e suporte com fornecedores de hardware (BrightSign, Samsung, LG):
1. **Identificador Único (`serial_number`)**:
   - Disponível em todos os formulários de hardware (tanto no **Catálogo Global de "Configurações"** como na **Aba "Telas & Players" do Detalhe da Loja**).
   - Permite registar quer o número de série oficial do fabricante (ex: `SN-49810293`), quer o identificador de património interno Fnac/Darty (ex: `PAT-LEI-0012`).
2. **Visualização Monospace e Badges**:
   - Apresentado com destaque visual em tipografia monospace (`🏷️ BS-XT1144-88412`).
   - Se um equipamento não tiver número de série atribuído, o sistema indica com elegância `🏷️ Sem S/N`.
3. **Pesquisa Instantânea**:
   - O campo de pesquisa do Catálogo Global pesquisa instantaneamente por qualquer fragmento do número de série ou ID.

---

## 17. Experiência Móvel & Operações On-Site em Smartphone / Tablet (Fase 15)

O RetailLaunchOS foi concebido para acompanhar técnicos e gestores do Gabinete Multimédia em trabalho de campo no local das inaugurações (*on-site*). A interface adapta-se automaticamente ao tamanho do ecrã do dispositivo utilizado (smartphone iOS/Android, tablet ou desktop).

### 17.1. Gaveta de Navegação Lateral (Menu Hambúrguer & Backdrop)
* **Acesso em Ecrãs Reduzidos (`<= 900px`)**:
  - No canto superior esquerdo do cabeçalho surge o botão de menu **"☰"** (`#btnMobileMenuToggle`).
  - Ao tocar, a barra lateral desliza suavemente em modo **Drawer** com um fundo escuro enevoado (*backdrop blur*).
  - O operador pode navegar entre módulos (Lojas, Digital Signage, Playlists, Custos, Utilizadores, Parâmetros e Base de Dados) ou alternar de perfil RBAC no rodapé da gaveta.
* **Fecho Rápido e Seguro**:
  - A gaveta fecha-se automaticamente com um toque no fundo escurecido, com um toque no link de destino pretendido ou premindo a tecla `Escape`.

### 17.2. Visualização de Aberturas em Cartões Táticos Móveis
Em smartphones (`<= 768px`), a tabela clássica de 6 colunas dá automaticamente lugar a **Cartões Táticos de Abertura (`.mobile-project-cards`)**:
* **Leitura Imediata sem Scroll Horizontal**: Cada loja é apresentada num cartão vertical com margem esquerda colorida correspondente à insígnia (Dourado Fnac / Vermelho Darty).
* **Dados Rápidos de Fiscalização**:
  - Nome da loja, insígnia e formato comercial.
  - Data de go-live prevista com contagem decrescente em dias (`X dias restantes`).
  - Estado operacional de Digital Signage (Pendente, Configuração, Validação, Pronto).
  - Barra de progresso percentual calculada em tempo real pelas tarefas concluídas.
* **Ação Direta de Polegar**: O botão de largura total **"Gerir Loja • Checklist & Telas"** abre diretamente a gaveta da obra com um simples toque.
* **Filtros e Pesquisa em Mobile**: Os seletores de marca (*Todas*, *Fnac*, *Darty*) dispõem de rolagem horizontal fluida e atualizam instantaneamente os cartões exibidos.

### 17.3. Modais em Modo Mobile Sheet & Abas Roláveis
Quando um operador abre qualquer formulário ou modal de detalhe em ecrãs móveis:
* **Formato Bottom-Sheet**: O modal sobe a partir da base do ecrã com cantos superiores arredondados e preenche a altura útil da tela (até 92% da altura visível), facilitando a interação com o polegar.
* **Cabeçalho Fixo (Sticky)**: O título da obra e o botão de fechar **"✕"** permanecem sempre acessíveis no topo do ecrã durante a rolagem.
* **Abas com Rolagem Horizontal Livre**: As abas operacionais (*"1. Marcos Técnicos"*, *"2. Custos & Diárias"*, *"3. Telas & Players"*) nunca quebram linhas; deslizam suavemente na horizontal permitindo alternar de contexto com facilidade.
* **Formulários Otimizados**: Todos os formulários colapsam automaticamente para **coluna única** (`grid-template-columns: 1fr`). Os campos de texto e data possuem tamanho de fonte calibrado a 16px para evitar o efeito indesejado de zoom forçado no Safari iOS.

### 17.4. Boas Práticas de Operação On-Site no Terreno
1. **Verificação Rápida de Telas**: Na aba *"3. Telas & Players"* da loja, clica em **"📡 Ping"** para testar a conectividade em tempo real de cada BrightSign ou Samsung SSP a partir do smartphone. O resultado atualiza o badge e reflete-se imediatamente no feed de *Atividade Recente*.
2. **Validação de Tarefas Técnicas**: Na aba *"1. Marcos Técnicos"*, as caixas de seleção (*checkboxes*) possuem área de toque generosa (22x22px), permitindo marcar tarefas concluídas mesmo ao operar com uma só mão ou luvas técnicas leves no local de obra.
3. **Consulta de S/N**: Para confirmar se um display corresponde ao património alocado à loja, pesquisa ou confirma a badge `🏷️ SN-XXXX` diretamente no cartão de hardware.

---

## 18. Mapeamento Interativo de Equipamentos em Planta de Loja (Fase 17)

O módulo de **Planta & Telas Interativa** foi introduzido para responder à necessidade crítica dos técnicos de campo e gestores do Gabinete Multimédia durante as operações de montagem, calibração e vistoria no local (*on-site*). Permite associar a cada projeto de abertura uma planta arquitetónica vetorial ou em imagem e posicionar interativamente os equipamentos audiovisuais (`signage_players`) sobre ela.

---

### 18.1. Como Aceder (Atalho Rápido 'Planta' e 4ª Aba da Loja)

Existem três formas intuitivas e imediatas de aceder à planta de qualquer loja:
1. **Atalho Direto na Tabela de Aberturas (Desktop)**: Na coluna de ações, junto ao botão *"Gerir"*, clica no botão dourado **"🗺️ Planta"**. O modal de gestão abre-se instantaneamente na 4ª aba (*"Planta & Telas"*).
2. **Atalho Direto nos Cartões Móveis (Smartphone / Tablet)**: Em cada cartão tático de abertura, clica no botão **"🗺️ Planta"** ao lado de *"Gerir Loja"*.
3. **Atalho no Cartão de Planeamento de Lojas (KPI Widget)**: Na secção *"Planeamento Lojas"*, clica no pequeno ícone de mapa **"🗺️"** ao lado da percentagem de progresso de qualquer obra.
4. **Dentro da Gaveta de Detalhe da Loja**: Clica na 4ª aba **"Planta & Telas (X/Y)"** na barra de navegação superior do modal.

---

### 18.2. Upload e Substituição de Planta Arquitetónica de Loja

Cada loja dispõe de um gestor de planta dedicado:
1. **Se a loja ainda não tiver planta associada**:
   - É exibida uma zona de upload acolhedora (*empty state*) com área pontilhada e botão **"Carregar Ficheiro de Planta"**.
   - Formatos suportados: **PNG**, **JPEG**, **WebP** e **SVG** (vetorial de alta definição com zoom infinito).
   - Tamanho máximo recomendado: até 15 MB.
2. **Ao carregar o ficheiro**:
   - A imagem é convertida em Base64 no cliente e transmitida de forma atómica para o endpoint `POST /api/v1/projects/:id/floor-plan`.
   - O servidor guarda o ficheiro no diretório persistente do Synology NAS (`database/uploads/floor_plans/`) sob um nome sanitizado e único (ex: `floorplan_proj_6_1789510156911.svg`).
   - É gerado automaticamente um registo de auditoria no feed de **Atividade Recente** (ex: *"Nova Planta Arquitetónica Carregada: Fnac Cascais"*).
   - O visualizador renderiza imediatamente a planta sem necessidade de recarregar a página.
3. **Substituição ou Remoção da Planta**:
   - Na barra de ferramentas superior da planta, clica no botão **"🔄 Trocar Planta"** para selecionar um novo layout ou no botão **"🗑️ Eliminar Planta"** para removê-la (os equipamentos permanecem registados no inventário da loja, mantendo o histórico de património).

---

### 18.3. Posicionamento de Displays na Planta (Drag & Drop, Clique e Touch)

O RetailLaunchOS oferece três métodos ergonómicos para afixar e ajustar a localização de qualquer tela:

#### Método A: Modo de Colocação Guiada (1-Clique / Toque)
1. Na barra lateral direita, na secção **"Pendentes de Posicionar"**, localiza o equipamento desejado.
2. Clica no botão **"+ Posicionar na Planta"**.
3. O cursor transforma-se numa mira tática e surge um banner indicativo: *"Modo de Colocação Ativo: Clica na planta onde se localiza o equipamento"*.
4. Clica ou toca no local exato do mapa arquitetónico.
5. O sistema calcula instantaneamente as coordenadas percentuais relativas (`pos_x`, `pos_y`) e grava via `PATCH /api/v1/projects/:id/floor-plan/positions`. O pin surge imediatamente no mapa com uma animação fluida de radar!

#### Método B: Arrastamento Livre em Desktop (Drag-and-Drop)
1. Clica e segura o botão esquerdo do rato sobre qualquer pin já afixado no mapa.
2. Arrasta o pin para a nova localização.
3. Ao soltar, as coordenadas são recalculadas e salvas automaticamente na base de dados SQLite.

#### Método C: Ajuste Tátil em Smartphone / Tablet (Touch Drag)
1. No smartphone ou tablet, toca e desliza o pin diretamente com o polegar.
2. O sistema previne a rolagem indesejada da página (`touch-action: none`) enquanto arrastas o pin.
3. Ao levantar o dedo, a nova coordenada é gravada e o utilizador recebe confirmação tátil/toast de sucesso.

#### Desafixar Equipamento da Planta
* Se um display mudar de local ou for desativado daquela área, clica no pin para abrir o popover e prime **"✕ Desafixar"** (ou clica no botão com o ícone do caixote na lista lateral). O equipamento regressa à secção *"Pendentes de Posicionar"* com coordenadas limpas (`pos_x = null`, `pos_y = null`).

---

### 18.4. Visualizador Tático: Zoom, Pan, Pins Coloridos e Radar de Estado

A área de visualização (`.floorplan-canvas-wrap`) conta com ferramentas avançadas para inspeção em pisos extensos:

1. **Barra de Ferramentas (Toolbar)**:
   - **Botão `+` (Zoom In)**: Aumenta o mapa até 300% com interpolação suave.
   - **Indicador de Escala**: Mostra o fator de ampliação atual (ex: `100%`, `150%`, `200%`).
   - **Botão `-` (Zoom Out)**: Reduz o mapa até 60% para visão macro panorâmica.
   - **Botão `↺` (Repor Zoom)**: Restaura a visualização padrão a 100%.
   - **Botão `⛶` (Ecrã Inteiro)**: Expande a área de trabalho da planta ocupando a totalidade do ecrã do navegador ou tablet.
2. **Pan e Rolagem Fluida**:
   - Em níveis elevados de zoom, a barra de visualização ativa rolagem com barras de scroll discretas e estilizadas.
3. **Anatomia dos Pins no Mapa**:
   - **Ícone Central**: Ilustra a categoria do hardware (ex: ecrã de parede, totem vertical, videowall, etc.).
   - **Ponto Pulsante (Status Dot & Radar Wave)**: Onda concêntrica animada que reflete em tempo real a saúde do equipamento:
     - 🟢 **Verde Pulsante**: *Online* (conectado e a reproduzir sem falhas).
     - 🟠 **Âmbar**: *Em Testes* (calibração ou montagem).
     - 🔵 **Azul**: *Syncing* (descarregamento de nova playlist).
     - 🔴 **Vermelho**: *Offline* (sem resposta na rede).
   - **Rótulo Flutuante (Label)**: Exibe o nome do ecrã e o seu identificador de património ou número de série (ex: `🏷️ BS-XT1144`).

---

### 18.5. Teste de Conectividade (Ping) e Popovers de Telemetria no Mapa

Ao clicar ou tocar num pin afixado na planta, abre-se um **Popover Tático Flutuante**:
* **Cabeçalho com Estado Operacional**: Nome do ecrã e badge colorido de prontidão.
* **Dados de Hardware**:
  - Modelo de equipamento (ex: *BrightSign XT1144 4K*).
  - Identificador Único / Serial (`serial_number`).
  - Zona de loja registada (ex: *Montra Principal*, *Entrada*, *Balcão de Atendimento*).
  - Resolução de saída (ex: *4K UHD*, *1080p FHD*).
* **Playlist em Reprodução**: Nome e versão da campanha audiovisual ativa.
* **Ação de Teste de Ping no Terreno**:
  - Clica no botão **"📡 Testar Ping"** diretamente no popover.
  - O sistema envia um pedido em tempo real ao equipamento via API REST.
  - Se responder, o popover e o pin atualizam o badge para 🟢 *Online* com o timestamp do teste e emitem um rasto de auditoria no feed de atividades!
* **Ação de Centrar a Partir da Lista**:
  - Na barra lateral direita, ao clicar em qualquer item da secção *"Ecrãs na Planta"*, a visualização foca automaticamente o pin correspondente, acionando uma animação de destaque e abrindo o respetivo popover.

---

### 18.6. Persistência Atómica no Volume Synology NAS e Responsividade Mobile

* **Coordenadas Relativas Normalizadas**: O armazenamento das posições é efetuado em percentagem de 0.00% a 100.00% com duas casas decimais (`DECIMAL(5, 2)`). Independentemente da resolução do monitor, tamanho da janela ou densidade de píxeis (Retina/Mobile), cada equipamento mantém a sua localização exata sobre os elementos físicos da planta (paredes, pilares, montras).
* **Persistência Total no Volume Synology (`/app/database`)**:
  - O caminho de gravação local é `/app/database/uploads/floor_plans/`.
  - Como o `docker-compose.yml` mapeia o volume do host `/volume1/docker/retaillaunch/database:/app/database`, todos os ficheiros de plantas sobrevivem a paragens, migrações de hardware e recriações de contentores no Synology Container Manager.
* **Otimização Mobile**: Em smartphones, a barra lateral de equipamentos dobra-se abaixo da planta com abas verticais táteis, garantindo que o técnico dispõe de 100% da largura do ecrã para inspecionar a planta com os dedos.






