# Fase 17 • Mapeamento Interativo de Equipamentos em Planta de Loja
## RetailLaunchOS • Gabinete Multimédia (Fnac / Darty)

---

## 1. Descrição do Problema & Objetivos

Durante o planeamento e a montagem física de novas lojas (*on-site*), as equipas técnicas do Gabinete Multimédia e das obras necessitam de uma representação espacial clara de onde cada display, totem ou player está alocado no espaço comercial.

Esta fase implementa:
1. **Upload & Gestão de Planta Arquitetónica**:
   - Associação de um mapa/planta de loja a cada projeto de abertura (formatos PNG, JPEG, WebP e SVG vetorial).
   - Armazenamento persistente no volume permanente do Synology NAS (`database/uploads/floor_plans/`).
2. **Posicionamento Relativo (%) de Telas (`signage_players`)**:
   - Afixação de equipamentos com coordenadas percentuais normalizadas (`pos_x`, `pos_y` de 0.00% a 100.00%).
   - Garantia de responsividade absoluta e precisão milimétrica em qualquer dispositivo (desktop, tablet ou smartphone).
3. **Visualizador Tático Interativo**:
   - Zoom suave (+, -, reset) e modo ecrã inteiro.
   - Pins táticos com ícones por categoria e halo concêntrico de status operacional (🟢 Online, 🟠 Em Testes, 🔵 Syncing, 🔴 Offline).
   - Popovers com telemetria detalhada de hardware (Modelo, S/N, Zona, Playlist) e botão direto **"📡 Testar Ping"**.
4. **Ergonomia Operacional no Chão de Loja**:
   - Colocação guiada em 1-clique.
   - Arrastamento livre (Drag & Drop) com rato.
   - Manipulação tátil (Touch Drag) em smartphones e tablets com prevenção de scroll de página.
   - Lista lateral separando ecrãs "Pendentes de Posicionar" de "Posicionados na Planta".
   - Atalho rápido **"🗺️ Planta"** na tabela de projetos, cartões mobile e widget de planeamento de lojas.

---

## 2. Decisões Técnicas & Arquitetura

### 2.1. Base de Dados SQLite & Migrações
* `database/schema.sql`:
  - `projects`: coluna `floor_plan_image VARCHAR(255)`.
  - `signage_players`: colunas `pos_x DECIMAL(5, 2)` e `pos_y DECIMAL(5, 2)`.
* `src/database/db.js`:
  - Migração idempotente `migrateFloorPlans()` que cria a pasta `database/uploads/floor_plans` e executa os comandos `ALTER TABLE` necessários no arranque da aplicação.

### 2.2. Modelos & Camada de Negócio
* `src/models/Project.js`:
  - `floor_plan_image` adicionado aos campos permitidos de atualização.
* `src/models/SignagePlayer.js`:
  - Suporte a `pos_x` e `pos_y` em `create` e `update`.
  - Método estático `SignagePlayer.updatePositions(positionsArray)` executando atualização transacional de coordenadas em lote.

### 2.3. Endpoints REST & Armazenamento de Ficheiros
* `POST /api/v1/projects/:id/floor-plan`:
  - Recebe JSON com `{ fileData (Base64), fileName }`.
  - Decodifica binário, valida extensão permitida, gera nome único no disco (`database/uploads/floor_plans/`) e atualiza o registo do projeto.
  - Regista auditoria em `ActivityLog` (`floor_plan_uploaded`).
* `DELETE /api/v1/projects/:id/floor-plan`:
  - Remove o ficheiro do disco e limpa a coluna `floor_plan_image`.
* `PATCH /api/v1/projects/:id/floor-plan/positions`:
  - Atualiza as coordenadas relativas de um ou múltiplos displays.
* `GET /uploads/floor_plans/:filename` & `GET /public/uploads/floor_plans/:filename`:
  - Streaming estático de ficheiros com cabeçalhos MIME corretos (`image/svg+xml`, `image/png`, etc.).

### 2.4. Interface e Experiência do Utilizador
* `public/css/dashboard.css`:
  - Classes para o workspace de planta, canvas, toolbar flutuante, pins, animações de radar pulsante e popovers.
  - Regras responsivas para mobile bottom-sheet e abas deslizantes.
* `src/views/pages/dashboard.html`:
  - Aba *"Planta & Telas"* adicionada à navegação da modal de detalhe da loja.
  - Suporte à navegação direta via `openProjectDetails(id, 'tabFloorPlan')`.
  - Funções de renderização, upload, zoom, drag & drop, touch drag, popover e teste de ping integradas.

---

## 3. Ficheiros Modificados e Criados

* **[`database/schema.sql`](file:///Users/daviscorreia/Antigravity%20/RetailLaunchOS/database/schema.sql)**: Colunas `floor_plan_image`, `pos_x`, `pos_y`.
* **[`src/database/db.js`](file:///Users/daviscorreia/Antigravity%20/RetailLaunchOS/src/database/db.js)**: Rotina `migrateFloorPlans()`.
* **[`src/models/Project.js`](file:///Users/daviscorreia/Antigravity%20/RetailLaunchOS/src/models/Project.js)**: Suporte a `floor_plan_image`.
* **[`src/models/SignagePlayer.js`](file:///Users/daviscorreia/Antigravity%20/RetailLaunchOS/src/models/SignagePlayer.js)**: Suporte a `pos_x`, `pos_y` e `updatePositions()`.
* **[`src/controllers/projectController.js`](file:///Users/daviscorreia/Antigravity%20/RetailLaunchOS/src/controllers/projectController.js)**: Métodos de upload, remoção de planta e atualização de posições.
* **[`server.js`](file:///Users/daviscorreia/Antigravity%20/RetailLaunchOS/server.js)**: Rotas estáticas de `/uploads/` e endpoints REST `/api/v1/projects/:id/floor-plan*`.
* **[`public/css/dashboard.css`](file:///Users/daviscorreia/Antigravity%20/RetailLaunchOS/public/css/dashboard.css)**: Estilos do visualizador de planta e pins.
* **[`src/views/pages/dashboard.html`](file:///Users/daviscorreia/Antigravity%20/RetailLaunchOS/src/views/pages/dashboard.html)**: Aba "Planta & Telas", atalhos rápidos e lógica interativa.
* **[`database/uploads/floor_plans/fnac_cascais_planta.svg`](file:///Users/daviscorreia/Antigravity%20/RetailLaunchOS/database/uploads/floor_plans/fnac_cascais_planta.svg)**: Planta arquitetónica vetorial semente de alta definição.

---

## 4. Plano de Verificação & Testes

1. **Testes Unitários & Integração Backend**:
   - Script automatizado testando integridade das rotas, uploads, autorização JWT e persistência de posições.
2. **Navegação & UI**:
   - Validação da abertura rápida via botão "🗺️ Planta".
   - Verificação do canvas interativo, pins, zoom e popover de telemetria com ping em tempo real.
3. **Persistência**:
   - Verificação de persistência das imagens no caminho montado pelo Docker no Synology NAS (`/app/database/uploads/floor_plans/`).
