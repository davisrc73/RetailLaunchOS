# Plano de Implementação • Fase 11
## Módulo de Configurações para Parâmetros Multimédia & Normalização de Cores Operacionais

### 1. Contexto e Objetivos
O Gabinete Multimédia (Fnac / Darty) necessitava de:
1. **Centralização e Gestão Dinâmica de Parâmetros Técnicos**:
   - Gestão no módulo de Configurações de **"Modelo de Hardware"**, **"Zona / Localização"** e **"Resolução / Formato"**.
   - Substituição de campos de texto livre por caixas de seleção (*dropbox* / `<select>`) alimentadas pela base de dados, quer no formulário do Catálogo Global de Telas & Players (`#modalPlayersCatalog`), quer no formulário de associação de ecrãs na ficha de loja (`tabPlayers`).
2. **Normalização Cromática do "Estado Operacional"**:
   - **Online (Ativo)**: **Verde** (`#10B981` / 🟢)
   - **Em Testes**: **Laranja** (`#F59E0B` / 🟠)
   - **A Sincronizar**: **Azul** (`#3B82F6` / 🔵)
   - **Offline (Inativo)**: **Vermelho** (`#EF4444` / 🔴)
   - Aplicação consistente nas caixas de seleção, chips/badges de tabelas e pontos luminosos pulsantes (*ping dot*).

---

### 2. Arquitetura e Alterações Técnicas

#### 2.1. Base de Dados SQLite
- Adição da tabela `system_parameters` em `database/schema.sql`:
  - `id` INTEGER PRIMARY KEY AUTOINCREMENT
  - `category` TEXT NOT NULL CHECK(category IN ('hardware_model', 'zone_location', 'resolution'))
  - `name` TEXT NOT NULL
  - `description` TEXT
  - `display_order` INTEGER DEFAULT 0
  - `is_active` INTEGER DEFAULT 1
  - `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
  - `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP
  - Índice único em `(category, name)`.
- Auto-migração transparente implementada em `src/database/db.js` (`migrateSystemParameters()`) que garante o provisionamento automático e sementes iniciais sem intervenção manual.

#### 2.2. Camada de Modelos & RBAC
- **`src/models/SystemParameter.js`**:
  - `findAll(category)`
  - `findGrouped()`
  - `findById(id)`
  - `findByCategoryAndName(category, name)`
  - `create(data)`
  - `update(id, data)`
  - `delete(id)`
- **`src/models/Role.js`**:
  - Adicionada permissão `canManageConfig: true` para `admin` e `multimedia_user` (bloqueado como `false` para `store_manager` e `viewer`).

#### 2.3. Controladores e API REST
- **`src/controllers/configController.js`**:
  - `getParameters(req, res)`: Retorna os parâmetros agrupados por padrão ou filtrados por categoria.
  - `createParameter(req, res)`: Cria novo parâmetro validando categoria e unicidade.
  - `updateParameter(req, res)`: Atualiza parâmetros existentes.
  - `deleteParameter(req, res)`: Remove fisicamente parâmetros.
- **`server.js`**:
  - Registado o grupo de rotas `/api/v1/config/parameters` sob middleware `checkAuth('admin', 'multimedia_user')`.

#### 2.4. Estilos CSS (`public/css/dashboard.css`)
- Cores de estado operacional padronizadas:
  - `.player-status-badge.online`, `.status-dot-ping.online`: Verde `#10B981`
  - `.player-status-badge.testing`, `.status-dot-ping.testing`: Laranja `#F59E0B`
  - `.player-status-badge.syncing`, `.status-dot-ping.syncing`: Azul `#3B82F6`
  - `.player-status-badge.offline`, `.status-dot-ping.offline`: Vermelho `#EF4444`
- Estilos para o novo modal `#modalConfigParameters` (abas, cards, listas com hover, badges e animações suaves).

#### 2.5. Frontend (`src/views/pages/dashboard.html`)
- Sidebar: Opção "Modelos, Zonas & Formatos" sob Configurações.
- Modal `#modalConfigParameters`: Interface com 3 abas, contadores, formulário rápido e lista com botões de edição e remoção.
- Dropdowns nos formulários de Telas & Players convertidos para selects dinâmicos obrigatórios.

---

### 3. Plano de Testes e Validação
1. **Verificação de Migração da BD**: Confirmação da criação e povoamento da tabela `system_parameters`.
2. **Testes de API REST & RBAC**: Testes automáticos cobrindo login admin, bloqueio 403 para viewer, ciclo de vida CRUD de parâmetros.
3. **Validação UI e Dropdowns**: Verificação da propagação dos novos parâmetros criados para todos os formulários e aplicação das novas cores operacionais.
