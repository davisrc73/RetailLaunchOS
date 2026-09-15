# Fase 15 • Sistema de Design Responsivo & Otimização Mobile para Operações On-Site

## 1. Visão Geral e Contexto
O **RetailLaunchOS** é utilizado intensivamente pelo **Gabinete Multimédia (Fnac / Darty)** não apenas em computadores de secretária no escritório, mas crucialmente **no terreno (*on-site*)**, onde técnicos, gestores de projeto e diretores de loja verificam instalações de Digital Signage, executam checklists de abertura, monitorizam custos e validam o estado dos players diretamente em smartphones ou tablets.

Atualmente, a aplicação apresentava sérias limitações ergonómicas e visuais quando acedida a partir de dispositivos móveis:
1. **Perda de Navegação**: A barra lateral (`.app-sidebar`) era ocultada em ecrãs `<= 900px`, mas **não existia botão hambúrguer nem mecanismo de abertura**, deixando os operadores móveis sem acesso aos módulos de Lojas, Digital Signage, Playlists, Custos, Utilizadores, Parâmetros e Troca de Perfil RBAC.
2. **Sobrecarga do Cabeçalho Superior (`.app-header`)**: Títulos extensos, pílula de estado de rede, pesquisa com atalhos de teclado e botões colidiam e transbordavam horizontalmente (*overflow horizontal*).
3. **Cartões de KPIs Superiores (`.kpi-grid`)**: O Hero Card (contagem decrescente) e os cartões de Planeamento e Checklists sofriam compressão forçada e quebras de linha em viewports estreitos.
4. **Tabela de Aberturas no Terreno**: A visualização em tabela HTML clássica com 6 colunas obrigava a rolagem horizontal incómoda e dificultava a operação com uma só mão no local de obra.
5. **Modais e Formulários Inadequados para Toque**: Os modais mantinham grelhas de 2 e 3 colunas que esmagavam inputs, as abas sofriam quebras deselegantes e os botões de ação ficavam fora da zona confortável do polegar (*thumb zone*).

O objetivo da **Fase 15** é implementar uma reformulação profunda e estruturada de **Design Responsivo Mobile-First**, garantindo uma experiência fluida, sem scroll horizontal involuntário, com alvos de toque generosos e leitura impecável da densidade de informação tanto em smartphones (360px–480px), tablets (768px–1024px) como em monitores desktop.

---

## 2. Decisões de Engenharia & Arquitetura Responsiva

### 2.1. Gaveta de Navegação Móvel (Drawer) com Botão Hambúrguer
- **Botão Hambúrguer (`#btnMobileMenuToggle`)**:
  - Inserido no canto superior esquerdo do header (visível apenas em ecrãs `< 900px`).
  - Alvo de toque de 44x44px com animação suave de abertura.
- **Drawer com Backdrop Transparente Enevoado (`#sidebarBackdrop`)**:
  - Em telas móveis, a sidebar transforma-se numa gaveta deslizante lateral com efeito de profundidade, backdrop escuro enevoado (`backdrop-filter: blur(8px)`) e fecho automático ao tocar no backdrop, ao pressionar `Escape` ou ao clicar num link de navegação.
  - O rodapé com widget de utilizador e botão de troca de perfil permanece acessível e fixado na base da gaveta.

### 2.2. Cabeçalho Adaptativo & Barra de Ações Rápidas
- **Header Mobile Otimizado (`@media (max-width: 768px)`)**:
  - Título simplificado para o logótipo/marca ou versão compacta (*"RetailLaunchOS"*).
  - A pílula de estado da rede signage colapsa para um ponto pulsante discreto (*pulse dot*) com tooltip.
  - A caixa de pesquisa adapta-se fluidamente ou fica recolhível via ícone.
  - O seletor de tema é mantido num formato compacto de alternância rápida de toque.
  - Botão **"+ Nova Abertura"** preserva a acessibilidade tátil sem romper a linha visual.

### 2.3. Cartões Superiores de KPIs (Fluxo Vertical Equilibrado)
- Em telas `< 1024px` e `< 768px`:
  - A `.kpi-grid` reorganiza-se automaticamente de 3 colunas para 1 coluna vertical (`grid-template-columns: 1fr`).
  - No **Hero Card (Contagem Decrescente)**: os 4 blocos de tempo (Dias, Horas, Minutos, Segundos) utilizam dimensões flexíveis (`flex: 1`, `min-width: 0`, fontes fluidas com `clamp()`) para garantir perfeito encaixe em ecrãs estreitos como 360px ou 375px (iPhone SE/Mini).
  - No cartão **"Checklists & Prazos"**: as duas colunas internas ajustam-se para layout empilhado ou grelha proporcional de alta legibilidade.

### 2.4. Transformação Adaptativa da Tabela de Aberturas: Cartões Táticos Mobile
- Para operadores no terreno, a verificação do estado das lojas deve ser imediata e sem frustração de rolagem lateral:
  - Em desktop (`> 768px`): A tabela clássica com 6 colunas permanece ativa e detalhada.
  - Em mobile (`<= 768px`): Introdução automática de **Visualização em Cartões Táticos Móveis (`.mobile-project-cards`)**:
    - Cada loja é apresentada como um cartão estruturado com:
      - Insígnia destacada (Fnac Dourado / Darty Vermelho), nome da loja e formato comercial.
      - Data de inauguração com badge de urgência e contagem decrescente em dias.
      - Barra de progresso visual com percentagem real calculada pelas tarefas.
      - Estado de Digital Signage e versão de Playlist.
      - Botão tátil de largura total: **"Gerir Loja"** (`btn-manage`), de acesso imediato com o polegar.
  - A sincronização com a pesquisa (`#projectSearch`) e com os filtros de marca ("Todas", "Fnac", "Darty") atualiza simultaneamente a tabela e os cartões móveis.

### 2.5. Modais em Modo "Mobile Sheet / Full-Screen Dialog"
- Em dispositivos móveis (`max-width: 768px`):
  - Todos os modais (`#modalNovaAbertura`, `#modalDetalheProjeto`, `#modalGlobalTasks`, `#modalPlayersCatalog`, `#modalSystemParameters`, `#modalDatabaseMigration`, `#modalAuth`) transformam-se em **painéis de ecrã quase total (*mobile bottom-sheet*)**:
    - `width: 100%`, `max-width: 100%`, margens reduzidas a zero na base (`border-radius: 18px 18px 0 0` ou tela cheia segura).
    - `max-height: 92vh` com `margin-top: auto` ou `100vh` adaptado à safe-area de iOS/Android.
    - Cabeçalho do modal fixo (*sticky*) com botão de fechar proeminente e fácil de alcançar.
    - As abas de navegação interna (`.modal-nav-tabs`) ganham suporte a scroll horizontal livre (`overflow-x: auto; flex-wrap: nowrap; -webkit-overflow-scrolling: touch;`), garantindo que nenhuma aba é truncada ou escondida.
    - Formulários com grelhas de 2 ou 3 colunas (`.form-grid-2`, `.form-grid-3`, `.form-grid-4`) colapsam automaticamente para **coluna única (`grid-template-columns: 1fr`)**, assegurando campos de texto, números e datas confortáveis de digitar no teclado virtual.

### 2.6. Feed de "Atividade Recente" & Elementos de Rodapé
- O cartão de Atividade Recente adapta-se à largura disponível, garantindo que descrições longas quebram de forma limpa (*word-break: break-word*) e que badges e carimbos de data/hora ficam organizados verticalmente em telas compactas.

### 2.7. Alvos de Toque, Tipografia e Prevenção de Zoom Indesejado
- Aplicação das diretrizes da Apple (Human Interface Guidelines) e Google (Material Design):
  - Todos os elementos clicáveis/tocáveis têm dimensão mínima de 44x44px.
  - Inputs de formulário com tamanho de fonte base mínimo de 16px no mobile para prevenir o comportamento indesejado de zoom automático do iOS Safari ao focar campos de texto.
  - Prevenção rigorosa de overflow horizontal (`overflow-x: hidden`) no `html` e `body`.

---

## 3. User Review Required

> [!IMPORTANT]
> - **Nenhuma perda de funcionalidades em Desktop**: Todas as visualizações ricas existentes em monitores e portáteis mantêm-se exatamente iguais.
> - **Visualização Tática de Aberturas no Mobile**: A visualização de lojas em smartphones passará a dispor de cartões táteis otimizados para operação no terreno, permitindo inspecionar cada loja com facilidade sem requerer scroll horizontal forçado.
> - **Suporte Integral a Plataformas**: Otimizado para Safari iOS (iPhone), Chrome Android e tablets (iPad/Android).

---

## 4. Proposed Changes

### Camada de Interface & Estilos (Frontend)

#### [MODIFY] [public/css/dashboard.css](file:///Users/daviscorreia/Antigravity%20/RetailLaunchOS/public/css/dashboard.css)
- Implementar as variáveis de safe-area e regras globais de prevenção de overflow móvel.
- Adicionar estilos para o botão de menu hambúrguer móvel (`#btnMobileMenuToggle`) e backdrop da sidebar móvel (`#sidebarBackdrop`).
- Adicionar media queries estruturadas para:
  - Header adaptativo móvel (`< 768px`).
  - Grelha vertical de KPIs e contadores decrescentes fluidos.
  - Sistema de cartões de abertura móvel (`.mobile-project-card`).
  - Comportamento de modais como *mobile sheets / full-screen drawers* com abas roláveis.
  - Colapso de formulários de 2/3 colunas para 1 coluna.
  - Adaptação do feed de Atividade Recente.

#### [MODIFY] [src/views/pages/dashboard.html](file:///Users/daviscorreia/Antigravity%20/RetailLaunchOS/src/views/pages/dashboard.html)
- Adicionar botão de menu hambúrguer no cabeçalho: `<button id="btnMobileMenuToggle" class="btn-mobile-menu">...`.
- Adicionar backdrop da sidebar: `<div id="sidebarBackdrop" class="sidebar-backdrop"></div>`.
- Adicionar contentor de cartões móveis de aberturas: `<div class="mobile-project-cards" id="mobileProjectCards"></div>` dentro da secção de aberturas.
- Atualizar o JavaScript cliente:
  - Lógica de abertura/fecho da sidebar móvel no clique do botão hambúrguer, clique no backdrop ou clique em links de navegação.
  - Função `renderMobileProjectCards(projects)` sincronizada em conjunto com `renderProjectsTable(projects)`.
  - Melhorias de acessibilidade tátil e ajuste dinâmico em redimensionamentos de ecrã (*window resize / orientation change*).

---

### Documentação & Governação (`AGENTS.md`)

#### [MODIFY] [MANUAL_UTILIZADOR_MODAIS.md](file:///Users/daviscorreia/Antigravity%20/RetailLaunchOS/MANUAL_UTILIZADOR_MODAIS.md)
- Adicionar secção com guia de utilização móvel para operadores no terreno (*on-site*): como abrir a barra lateral em telemóveis, como consultar cartões táteis de lojas e como interagir com modais em formato sheet.

#### [MODIFY] [ARQUITETURA_TECNICA.md](file:///Users/daviscorreia/Antigravity%20/RetailLaunchOS/ARQUITETURA_TECNICA.md)
- Documentar a arquitetura responsiva: breakpoints oficiais (Desktop `>= 1024px`, Tablet `768px-1023px`, Mobile `< 768px`, Mobile Pequeno `< 400px`), componentes móveis e diretrizes ergonómicas.

#### [MODIFY] [MANUAL_SYNOLOGY.md](file:///Users/daviscorreia/Antigravity%20/RetailLaunchOS/MANUAL_SYNOLOGY.md)
- Manter notas de compatibilidade e sincronização.

#### [NEW] [docs/implementation_plans/FASE_15_PLANO.md](file:///Users/daviscorreia/Antigravity%20/RetailLaunchOS/docs/implementation_plans/FASE_15_PLANO.md)
- Arquivo do plano da Fase 15 para auditoria e replicação.

#### [NEW] [docs/walkthroughs/FASE_15_WALKTHROUGH.md](file:///Users/daviscorreia/Antigravity%20/RetailLaunchOS/docs/walkthroughs/FASE_15_WALKTHROUGH.md)
- Relatório de validação técnica da Fase 15.

#### [MODIFY] [docs/README.md](file:///Users/daviscorreia/Antigravity%20/RetailLaunchOS/docs/README.md)
- Entrada da Fase 15 no repositório de documentação.

---

## 5. Plano de Verificação

### 5.1. Validação de Layouts em Múltiplos Breakpoints
- **Mobile Estreito (360px - 390px - iPhone SE / Mini / Galaxy S)**:
  - Header: sem transbordo horizontal, botão hambúrguer visível e funcional.
  - Sidebar: abre ao tocar no botão hambúrguer, escurece o fundo e fecha ao tocar no backdrop ou num link.
  - Hero Card de Contagem Decrescente: os 4 blocos de contagem cabem confortavelmente sem empurrar as bordas.
  - Tabela / Cartões: exibe a visualização em cartões móveis com botões táteis "Gerir Loja".
  - Modais: abrem em formato sheet com scroll fluido, abas acessíveis e formulários em coluna única de fácil digitação.
- **Mobile Padrão (390px - 430px - iPhone 14/15/16 Pro, Pixel, Galaxy Plus)**:
  - Verificação de espaçamentos harmoniosos e alvos de toque generosos.
- **Tablet / iPad (768px - 820px)**:
  - Verificação da transição equilibrada de 2 colunas nos KPIs e adaptabilidade do header.
- **Desktop (>= 1024px)**:
  - Garantir que a experiência desktop original mantém 100% da sua estética, densidade e riqueza visual intactas.

### 5.2. Validação Funcional On-Site
- Abrir modal de gestão de loja em mobile:
  - Verificar se a alternância entre as abas "Marcos Técnicos", "Custos & Diárias" e "Telas & Players" funciona com 1-toque.
  - Validar checkbox de conclusão de tarefas no ecrã tátil.
  - Validar visualização de serial number e status de telas.
