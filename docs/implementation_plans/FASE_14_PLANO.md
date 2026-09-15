# Fase 14 • Feed Dinâmico de Atividade Recente & Identificador Único de Hardware (ID/Serial)

## 1. Visão Geral e Contexto
O presente plano endereça dois requisitos operacionais solicitados para o **RetailLaunchOS** (Gabinete Multimédia Fnac / Darty):
1. **Atividade Recente Dinâmica**: O cartão no fundo do dashboard continha elementos estáticos (mock) e não refletia as ações executadas no sistema (criação/edição de lojas, conclusão de tarefas técnicas, registo de custos diários, alterações de hardware e testes de conectividade). Solicita-se também a **alteração de título** de *"Atividade Recente • Gabinete Multimédia"* para **"Atividade Recente"**.
2. **Identificador Único de Hardware (ID/Serial)**: No ecossistema de telas e media players (`signage_players`), adicionar o campo **"ID/Serial"** (número de série do fabricante / identificador de inventário corporativo), permitindo o registo, pesquisa e auditoria individual de cada equipamento.

Em estrito cumprimento das diretrizes de **`AGENTS.md`**, toda a evolução será acompanhada de migrações idempotentes sem quebra de dados, zero dependências externas (100% Vanilla JS/CSS e Node.js nativo), atualização das documentações mandatórias e versionamento documental.

---

## 2. Decisões Técnicas e Arquitetura

### 2.1. Arquitetura do Feed de Atividade Recente
- **Nova Tabela SQLite `activity_logs`**:
  - `id`: INTEGER PRIMARY KEY AUTOINCREMENT
  - `action_type`: VARCHAR(50) (ex: `project_created`, `project_updated`, `task_completed`, `cost_logged`, `player_created`, `player_updated`, `player_ping`)
  - `title`: VARCHAR(255)
  - `description`: TEXT
  - `project_id`: INTEGER (chave estrangeira opcional)
  - `project_name`: VARCHAR(150) (snapshot do nome da loja)
  - `user_name`: VARCHAR(150) (ex: "Admin Multimédia", "Gabinete Multimédia")
  - `icon_type`: VARCHAR(50) (`success`, `warning`, `info`, `hardware`, `cost`)
  - `created_at`: TIMESTAMP DEFAULT CURRENT_TIMESTAMP
- **Auto-Sementeira Histórica (Disaster Recovery & Continuidade)**:
  - Na migração inicial em `src/database/db.js`, caso `activity_logs` esteja vazia, serão gerados eventos retroativos com base nos custos já registados, tarefas concluídas e players existentes, garantindo que o dashboard inicia imediatamente preenchido com dados reais e cronológicos.
- **Hook nos Controladores Existentes**:
  - O modelo `ActivityLog.log(...)` será acionado de forma limpa e não-bloqueante em `projectController`, `taskController`, `costController` e `signageController`.
- **Endpoint REST**:
  - `GET /api/v1/activities`: Devolve os últimos 10 a 20 eventos ordenados por `created_at DESC`.
- **Frontend**:
  - Título do cartão atualizado para **"Atividade Recente"**.
  - Função `loadRecentActivities()` que desenha os itens com badges e ícones contextuais, formatação com nomes destacados e datação relativa em português (*"Há instantes"*, *"Há 5 minutos"*, *"Há 2 horas"*, *"Hoje às 14:30"*, *"Ontem às 17:40"*, etc.).
  - Recarregamento automático em `loadKpis()`, `loadProjects()`, ou após qualquer mutação técnica.

### 2.2. Arquitetura do Campo "ID/Serial" no Hardware
- **Base de Dados & Migração**:
  - Adição da coluna `serial_number VARCHAR(100)` na tabela `signage_players` em `database/schema.sql`.
  - Função de migração automática em `src/database/db.js` (`migrateSignageSerial()`): verifica se `serial_number` já existe via `PRAGMA table_info(signage_players)`. Se não existir, executa `ALTER TABLE signage_players ADD COLUMN serial_number VARCHAR(100);`.
  - Atualização dos dados semente com seriais realistas (ex: `SN-BS4K-2026-001`, `SN-SMG-TIZ-881`, etc.).
- **Modelo & Controlador**:
  - `SignagePlayer.js`: inclusão de `serial_number` nos métodos `create`, `update`, `findAll`, `findById` e `findByProject`.
  - `signageController.js`: validação e mapeamento do novo campo.
- **Interface do Utilizador (`dashboard.html`)**:
  - **Catálogo Global de Telas & Players**:
    - Adicionado input `"ID / Serial (N.º Série)"` no formulário `#formCatalogPlayerCrud`.
    - Exibição de badge com código/número de série na tabela de listagem global de hardware.
    - Suporte à pesquisa por número de série no campo de filtro global.
  - **Aba de Telas na Ficha da Loja**:
    - Adicionado input `"ID / Serial (N.º Série)"` no formulário de criação de player `#formCreatePlayer`.
    - Exibição do `ID/Serial` na listagem de equipamentos associados à loja.

---

## 3. User Review Required

> [!NOTE]
> - A migração da coluna `serial_number` e da tabela `activity_logs` é **100% retrocompatível** e transparente. Os dados já gravados no seu Mac ou no Synology NAS serão rigorosamente preservados.
> - Ao inicializar a tabela de atividades pela primeira vez, o sistema irá popular automaticamente eventos a partir dos dados existentes (projetos, tarefas concluídas e custos), para que o cartão "Atividade Recente" comece imediatamente com dados reais das lojas Fnac e Darty.

---

## 4. Proposed Changes

### Camada de Base de Dados & Migrações
#### [MODIFY] [database/schema.sql](file:///Users/daviscorreia/Antigravity%20/RetailLaunchOS/database/schema.sql)
- Adicionar coluna `serial_number VARCHAR(100)` na definição de `signage_players`.
- Adicionar definição da tabela `activity_logs` e respetivos índices.
- Atualizar sementes iniciais com seriais e logs de exemplo.

#### [MODIFY] [src/database/db.js](file:///Users/daviscorreia/Antigravity%20/RetailLaunchOS/src/database/db.js)
- Adicionar `migrateSignageSerial()` para injetar `serial_number` em bases de dados SQLite já existentes.
- Adicionar `migrateActivityLogs()` para criar `activity_logs` e popular sementes históricas.

---

### Camada de Modelos & Controladores
#### [NEW] [src/models/ActivityLog.js](file:///Users/daviscorreia/Antigravity%20/RetailLaunchOS/src/models/ActivityLog.js)
- Métodos `log({ action_type, title, description, project_id, project_name, user_name, icon_type })`, `getRecent(limit)`, e `seedInitial()`.

#### [NEW] [src/controllers/activityController.js](file:///Users/daviscorreia/Antigravity%20/RetailLaunchOS/src/controllers/activityController.js)
- Endpoint `getRecent(req, res)` que devolve os registos de atividade formatados.

#### [MODIFY] [src/models/SignagePlayer.js](file:///Users/daviscorreia/Antigravity%20/RetailLaunchOS/src/models/SignagePlayer.js)
- Adicionar suporte ao campo `serial_number` em `create`, `update`, `findAll`, `findById` e `findByProject`.

#### [MODIFY] [src/controllers/signageController.js](file:///Users/daviscorreia/Antigravity%20/RetailLaunchOS/src/controllers/signageController.js)
- Suporte a `serial_number` na criação e edição de ecrãs.
- Registo de logs de atividade ao criar, editar ou executar ping em players.

#### [MODIFY] [src/controllers/projectController.js](file:///Users/daviscorreia/Antigravity%20/RetailLaunchOS/src/controllers/projectController.js)
- Registo de log de atividade ao criar ou atualizar lojas.

#### [MODIFY] [src/controllers/taskController.js](file:///Users/daviscorreia/Antigravity%20/RetailLaunchOS/src/controllers/taskController.js)
- Registo de log de atividade ao criar, atualizar ou concluir marcos técnicos.

#### [MODIFY] [src/controllers/costController.js](file:///Users/daviscorreia/Antigravity%20/RetailLaunchOS/src/controllers/costController.js)
- Registo de log de atividade ao lançar despesas orçamentais ou diárias técnicas.

#### [MODIFY] [server.js](file:///Users/daviscorreia/Antigravity%20/RetailLaunchOS/server.js)
- Registo da rota `GET /api/v1/activities`.

---

### Camada de Apresentação (Frontend)
#### [MODIFY] [src/views/pages/dashboard.html](file:///Users/daviscorreia/Antigravity%20/RetailLaunchOS/src/views/pages/dashboard.html)
- Alterar o título do cartão de `"Atividade Recente • Gabinete Multimédia"` para `"Atividade Recente"`.
- Implementar `loadRecentActivities()` e renderizador dinâmico de eventos na `.feed-item-list`.
- Adicionar o campo "ID / Serial" no formulário e tabela do Catálogo Global de Hardware (`#modalPlayersCatalog`).
- Adicionar o campo "ID / Serial" no formulário e lista de telas da Loja (`#tabPlayers` em `#modalDetalheProjeto`).
- Conectar chamadas a `loadRecentActivities()` em todas as mutações do dashboard.

---

### Documentação & Auditoria (`AGENTS.md`)
#### [MODIFY] [MANUAL_UTILIZADOR_MODAIS.md](file:///Users/daviscorreia/Antigravity%20/RetailLaunchOS/MANUAL_UTILIZADOR_MODAIS.md)
- Detalhar o campo "ID/Serial" no catálogo de hardware e na ficha da loja.
- Explicar o funcionamento e atualização do cartão "Atividade Recente".

#### [MODIFY] [ARQUITETURA_TECNICA.md](file:///Users/daviscorreia/Antigravity%20/RetailLaunchOS/ARQUITETURA_TECNICA.md)
- Atualizar DDL de `signage_players` e `activity_logs`.
- Documentar o endpoint `GET /api/v1/activities`.

#### [MODIFY] [MANUAL_SYNOLOGY.md](file:///Users/daviscorreia/Antigravity%20/RetailLaunchOS/MANUAL_SYNOLOGY.md)
- Registar a garantia de migração automática e persistência transparente dos novos campos.

#### [NEW] [docs/implementation_plans/FASE_14_PLANO.md](file:///Users/daviscorreia/Antigravity%20/RetailLaunchOS/docs/implementation_plans/FASE_14_PLANO.md)
- Arquivo deste plano versionado no repositório.

#### [NEW] [docs/walkthroughs/FASE_14_WALKTHROUGH.md](file:///Users/daviscorreia/Antigravity%20/RetailLaunchOS/docs/walkthroughs/FASE_14_WALKTHROUGH.md)
- Relatório de entrega e validação técnica da Fase 14.

#### [MODIFY] [docs/README.md](file:///Users/daviscorreia/Antigravity%20/RetailLaunchOS/docs/README.md)
- Atualização do índice de auditoria e disaster recovery com a Fase 14.

---

## 5. Plano de Verificação

### 5.1. Testes Automatizados via API (cURL / HTTP)
1. **Atividades Recentes**:
   - Chamar `GET /api/v1/activities` e verificar resposta `200 OK` com lista não vazia de eventos contendo título, descrição, tipo de ação e data relativa.
   - Criar uma nova tarefa ou custo e verificar se um novo evento surge imediatamente no topo do feed.
2. **ID/Serial no Hardware**:
   - Chamar `POST /api/v1/signage/players` com payload contendo `serial_number: "TEST-SN-999"`.
   - Obter o player via `GET /api/v1/signage/players` e verificar que `serial_number` está persistido.
   - Chamar `PATCH /api/v1/signage/players/:id` atualizando o serial para `"TEST-SN-1000"` e confirmar persistência.

### 5.2. Verificação Visual e Funcional no Browser
1. Verificar que o título do cartão é agora **"Atividade Recente"**.
2. Confirmar que o feed apresenta os eventos reais e que se atualiza dinamicamente ao concluir tarefas ou adicionar players.
3. Abrir o Catálogo Global de Telas & Players:
   - Verificar a presença do campo "ID / Serial" no formulário.
   - Verificar a coluna/badge com o serial na tabela.
   - Testar a filtragem de pesquisa por número de série.
4. Abrir a ficha de uma loja (ex: Fnac Cascais) -> Aba "Telas & Players":
   - Verificar o campo "ID / Serial" no formulário desdobrável.
   - Confirmar a exibição do serial no card do equipamento.
