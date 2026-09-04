# Manual de Utilização • Modais e Funcionalidades do Dashboard
## RetailLaunchOS • Gabinete Multimédia (Fnac / Darty)

Este manual destina-se aos utilizadores e operadores do **Gabinete Multimédia**, descrevendo o funcionamento prático de todos os modais, formulários e ferramentas interativas disponíveis no **RetailLaunchOS**.

---

## Índice
1. [Visão Geral do Dashboard](#1-visão-geral-do-dashboard)
2. [Modal: Registar Nova Abertura de Loja](#2-modal-registar-nova-abertura-de-loja)
3. [Modal / Gaveta: Gestão da Loja (Abas: Marcos Técnicos, Custos e Telas)](#3-modal--gaveta-gestão-da-loja-abas-marcos-técnicos-custos-e-telas)
   - [3.2. Aba 1: Marcos Técnicos & Digital Signage](#32-aba-1-marcos-técnicos--digital-signage)
   - [3.3. Aba 2: Custos, Diárias & Orçamento (Fase 3)](#33-aba-2-custos-diárias--orçamento-fase-3)
   - [3.4. Aba 3: Telas & Players da Loja (Fase 4)](#34-aba-3-telas--players-da-loja-fase-4)
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
2. Preenche: Nome do ecrã, Zona na loja, Modelo de hardware, Resolução de saída, Endereço IP e Playlist inicial.
3. Clica em **"Gravar Ecrã"**: O registo é gravado via `POST /api/v1/projects/:id/players` e integrado no cálculo de prontidão de Digital Signage.

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

---

## 7. Painel de KPIs & Contagem Decrescente

O painel superior do Dashboard atualiza-se em tempo real com as seguintes métricas:

1. **Próxima Abertura (Hero Card)**:
   * Deteta automaticamente a loja com data de go-live mais iminente.
   * Apresenta um relógio com contagem decrescente ativa ao segundo: `[Dias : Horas : Minutos : Segundos]`.
2. **Playlists & Signage**:
   * Barra de prontidão percentual calculada a partir do rácio de ecrãs `Online` face ao total do parque.
   * Sub-contadores dinâmicos: `Players Ativos`, `Em Teste` e `Falhas` alimentados diretamente pela base de dados.
3. **Custo Diário Médio**:
   * Média aritmética do custo/dia de todas as lojas ativas, com o volume financeiro acumulado no mês corrente.
4. **Budget Global Alocado**:
   * Soma total dos orçamentos atribuídos aos projetos em execução e percentual executado.

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


