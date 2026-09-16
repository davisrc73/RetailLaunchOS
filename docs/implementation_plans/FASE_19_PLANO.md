# Plano Técnico • Fase 19: Usabilidade Final • Unificação de Painéis Laterais (Drawers), Sidebar Retrátil (⌘B) & Atualização de Cabeçalho
## RetailLaunchOS • Gabinete Multimédia (Fnac / Darty)

### 1. Contexto & Motivação
Na fase de maturidade de desenvolvimento do RetailLaunchOS, a interface carecia de uma otimização ergonómica global para aproveitar ao máximo a área de ecrã em estações de trabalho e portáteis, uniformizando todos os fluxos de interação:
1. **Nome Oficial da Aplicação**: O título do cabeçalho mantinha o termo temporário de teste *"Piloto Multimédia • Aberturas de Lojas"*, devendo passar para a designação corporativa definitiva **"Dashboard • Expansão Fnac/Darty"**.
2. **Telemetria Estática no Cabeçalho**: O distintivo *"Rede Signage Ativa (BrightSign / Samsung SSP)"* era meramente figurativo/estático, ocupando espaço valioso no cabeçalho sem fornecer ação prática.
3. **Aproveitamento de Ecrã**: Necessidade de recolher/retrair a barra lateral de navegação para a esquerda, permitindo 100% de largura para tabelas de obras, checklists e plantas arquitetónicas.
4. **Coerência de Interação (100% Drawers)**: Enquanto a Gestão da Loja e o Catálogo de Hardware já deslizavam lateralmente à direita (Fase 18), as restantes 7 janelas ainda abriam como modais centrados, gerando inconsistência visual e de navegação.

---

### 2. Objetivos e Requisitos

1. **Atualização do Cabeçalho**:
   - Alteração do título para **"Dashboard • Expansão Fnac/Darty"**.
   - Remoção completa do selo estático `.system-status-pill`.
   - Adição do botão de retração da barra lateral `#btnToggleSidebar`.

2. **Mecânica de Barra Lateral Retrátil**:
   - Ocultação fluida para fora do ecrã (`transform: translateX(-100%)`).
   - Expansão do contentor principal para margem zero (`margin-left: 0`).
   - Transições suaves com aceleração por GPU (`cubic-bezier(0.16, 1, 0.3, 1)`).
   - Três mecanismos de acionamento:
     - Botão `#btnToggleSidebar` no cabeçalho;
     - Botão `#btnCollapseSidebarInternal` junto ao logótipo da barra;
     - Atalho de teclado universal **`⌘B` / `Ctrl+B`**.
   - Persistência em `localStorage` e prevenção de FOUC com classe no `<html>` antes da pintura inicial.

3. **Unificação Global dos 9 Modais em Slide-Over Drawers à Direita**:
   - `#modalNovaAbertura`: Drawer de formulário (`640px`).
   - `#modalDetalheProjeto`: Drawer operacional (`760px` / `94vw`).
   - `#modalHubSignage`: Drawer de catálogo (`760px` / `94vw`).
   - `#modalUsersManagement`: Drawer de equipa (`760px` / `94vw`).
   - `#modalPlayersCatalog`: Drawer de hardware (`760px` / `94vw`).
   - `#modalConfigParameters`: Drawer de configurações (`760px` / `94vw`).
   - `#modalAuthLogin`: Drawer compacto (`520px`).
   - `#modalGlobalTasks`: Drawer de checklists (`760px` / `94vw`).
   - `#modalDatabaseMigration`: Drawer de dados (`640px`).
   - Todos dotados de altura a `100vh` / `100dvh`, botão de maximização `⛶` (`toggleDrawerExpand`), preservação de contexto e fecho centralizado.

---

### 3. Ficheiros e Componentes Modificados

- **`public/css/dashboard.css`**:
  - Regras de `body.sidebar-collapsed` para `.app-sidebar` e `.app-main`.
  - Estilos de `.btn-sidebar-toggle` e `.btn-sidebar-collapse-brand`.
  - Variantes `.drawer-card.drawer-form` e `.drawer-card.drawer-compact`.
- **`src/views/pages/dashboard.html`**:
  - Script anti-FOUC no `<head>`.
  - Botão `#btnCollapseSidebarInternal` na `sidebar-brand`.
  - Novo cabeçalho com `#btnToggleSidebar` e título atualizado.
  - Conversão da marcação HTML de todos os 7 modais remanescentes para `.drawer-backdrop` + `.drawer-card`.
  - Lógica JavaScript: `toggleSidebar()`, `initSidebarCollapse()`, atalho `⌘B`, listeners de backdrop e Escape.

---

### 4. Plano de Verificação e Testes
1. Validação de sintaxe JS com compilador V8 (`vm.Script`).
2. Teste automatizado HTTP validando a presença dos 9 drawers e remoção de elementos obsoletos.
3. Teste funcional de retração da barra lateral (botões e atalho `⌘B`) e persistência via `localStorage`.
