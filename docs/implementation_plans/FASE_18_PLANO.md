# Plano Técnico • Fase 18: Painel Lateral Deslizante à Direita (Slide-Over Drawer) & Modo Master-Detail
## RetailLaunchOS • Gabinete Multimédia (Fnac / Darty)

### 1. Contexto & Motivação
A gestão de aberturas de lojas Fnac e Darty envolve uma densidade considerável de informação operacional em cada projeto: cronograma de marcos, orçamentos e diárias, parque de telas/players e, mais recentemente (Fase 17), plantas arquitetónicas de alta resolução com ancoragem interativa de hardware.

Anteriormente, estes módulos abriam em caixas de diálogo flutuantes centradas (`.modal-backdrop` + `.modal-card`). Em ecrãs de trabalho habituais (laptops, postos de comando ou monitores ultrawide), este modelo centrado apresentava desvantagens:
1. **Perda de Contexto Global**: Ocultava a tabela de projetos e a evolução das outras lojas em simultâneo.
2. **Scrolls Duplos / Altura Restrita**: Conflito entre scroll do cartão e scroll da janela quando a planta arquitetónica ou listas extensas eram renderizadas.
3. **Falta de Fluidez na Navegação Entre Lojas**: Obrigatoriedade de fechar o modal de uma loja para inspecionar outra loja.

### 2. Objetivos e Requisitos
1. **Slide-Over Drawer à Direita**:
   - Animação de entrada fluida a partir da margem direita do ecrã (`transform: translateX(100%) -> translateX(0)`) com aceleração por GPU (`cubic-bezier(0.16, 1, 0.3, 1)`).
   - Ocupação de 100% da altura do ecrã (`100vh` / `100dvh`), fornecendo espaço vertical integral para os painéis de navegação por abas.
   - Aplicação aos dois maiores módulos da aplicação:
     - `#modalDetalheProjeto`: Gestão Completa de Loja (Marcos, Custos, Telas e Planta).
     - `#modalPlayersCatalog`: Catálogo Global de Hardware.
2. **Preservação de Contexto & Modo Master-Detail**:
   - Manter visível e clicável a tabela de projetos à esquerda do ecrã.
   - Ao clicar noutra loja na lista com o drawer aberto, o conteúdo é atualizado instantaneamente sem fechar e reabrir a janela, com scroll resetado para o topo (`scrollTop = 0`).
   - Destaque visual permanente da linha selecionada na tabela (`.master-row-selected`).
3. **Botão de Expansão / Maximização (`⛶`)**:
   - Botão no cabeçalho do drawer permitindo alternar entre a largura normal de inspeção lateral (**760px**) e a largura expandida (**94vw**), ideal para trabalho de precisão na planta arquitetónica de loja.
4. **Responsividade Mobile & Tablets**:
   - Em ecrãs móveis (`<= 768px`), o drawer assume automaticamente `width: 100vw; max-width: 100vw; border-radius: 0;`.
5. **Acessibilidade e Fecho Intuitivo**:
   - Fecho através do botão de fechar (`&times;`), clique no backdrop semitransparente ou tecla `Escape`.

---

### 3. Ficheiros e Componentes Modificados

#### 1. Folha de Estilos (`public/css/dashboard.css`)
- Classes implementadas:
  - `.drawer-backdrop`: Backdrop flexível alinhado à direita (`justify-content: flex-end; align-items: stretch;`).
  - `.drawer-card`: Painel lateral com `width: 760px; max-width: 90vw; height: 100vh; height: 100dvh; max-height: 100vh; border-radius: 16px 0 0 16px; transform: translateX(100%); transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);`.
  - `.modal-backdrop.show .drawer-card`: Ativação do slide (`transform: translateX(0);`).
  - `.drawer-card.drawer-expanded`: Modo maximizado (`width: 94vw; max-width: 94vw;`).
  - `.drawer-header-actions`: Agrupamento de botões de expansão (`.btn-drawer-expand`) e fecho (`.btn-close-modal`).
  - `.master-row-selected`: Highlight com fundo temático e rebordo esquerdo estilizado para a loja selecionada.
  - Media queries `@media (max-width: 768px)` para largura total móvel.

#### 2. Interface e Lógica JavaScript (`src/views/pages/dashboard.html`)
- Atualização da estrutura HTML de `#modalDetalheProjeto` e `#modalPlayersCatalog` com as novas classes `.drawer-backdrop` e `.drawer-card`.
- Inclusão dos botões `#btnToggleExpandDetalhe` e `#btnToggleExpandCatalog` nos respetivos cabeçalhos.
- Implementação das rotinas JS:
  - `toggleDrawerExpand(cardId, btnId)`: Alternância dinâmica de largura e ícones `⛶` / `🗗`.
  - `closeProjectDetails()`: Limpeza da classe de seleção `.master-row-selected` e fecho com animação.
  - Atualização de `openProjectDetails(lojaId)` para destacar a linha ativa e resetar o scroll vertical do contentor de abas (`scrollTop = 0`).

---

### 4. Plano de Verificação & Testes
1. **Teste Automatizado de Renderização HTTP**:
   - Validação da resposta `GET /` com verificação de classes CSS, IDs dos cartões e declaração das funções no cliente.
2. **Validação de Comportamento Visual**:
   - Abertura de loja com slide suave à direita.
   - Alternância entre lojas diferentes mantendo o drawer aberto.
   - Alternância de largura normal (760px) vs maximizada (94vw).
   - Fecho com clique no backdrop, botão fechar e tecla Escape.
