# Walkthrough • Fase 7: Módulo de Gestão de Utilizadores & Secção "Configurações" na Sidebar
## RetailLaunchOS • Gabinete Multimédia (Fnac / Darty)

**Data de Conclusão**: 04 de Setembro de 2026  
**Responsável**: Antigravity Assistant & Davis Correia  
**Branch**: `main`  
**Objetivo**: Corrigir o comportamento erróneo do tab "Utilizadores Gabinete" (que abria incorretamente o modal de sessão), criar um módulo dedicado de gestão de utilizadores com CRUD completo, renomear o tab para "Utilizadores" e adicionar a secção "Configurações" na sidebar.

---

## 1. Resumo Executivo da Entrega

A **Fase 7** resolveu dois problemas de usabilidade e adicionou capacidades de gestão de equipa ao **RetailLaunchOS**:

1. **Módulo de Gestão de Utilizadores Dedicado**:
   - Tab "Utilizadores" (renomeado de "Utilizadores Gabinete") abre agora um modal exclusivo `#modalUsersManagement`.
   - Tab "Perfis & Permissões" continua a abrir o modal de sessão `#modalAuthLogin` corretamente.
   - CRUD completo: listar, pesquisar, criar, editar, desativar e reativar utilizadores.
   - Proteção RBAC: botões de gestão visíveis apenas para o perfil `admin`.

2. **Secção "Configurações" na Sidebar**:
   - Nova secção de navegação lateral no grupo de configurações globais.
   - Item **"Telas & Players"** (`#nav-config-players`) que abre o hub de Digital Signage diretamente na aba de players.

---

## 2. Componentes Implementados

### 2.1. Backend

**`src/controllers/authController.js`** — 3 novos métodos:
- `createUser(req, res)` → `POST /api/v1/users` — cria utilizador com hash PBKDF2
- `updateUser(req, res)` → `PATCH /api/v1/users/:id` — atualiza dados (incluindo password opcional)
- `deactivateUser(req, res)` → `DELETE /api/v1/users/:id` — soft delete com verificação anti-auto-desativação

**`server.js`** — Novas rotas protegidas por RBAC de `admin`:
- `POST /api/v1/users` — com parsing de body inline `req.on('data')`
- `PATCH /api/v1/users/:id` — com regex `usersUpdateMatch` para extração de ID
- `DELETE /api/v1/users/:id` — sem body, apenas ID no path

### 2.2. Frontend HTML (`src/views/pages/dashboard.html`)

**Sidebar**:
- Renomeado span de "Utilizadores Gabinete" para **"Utilizadores"**
- Adicionada secção `<div class="nav-section">` com título "Configurações" e item `#nav-config-players`

**Modal `#modalUsersManagement`**:
- Header com ícone de equipa e título "Utilizadores • Gestão de Equipa"
- Formulário inline de criação/edição com 6 campos (oculto por defeito)
- Toolbar com contagem de utilizadores e campo de pesquisa em tempo real
- Tabela com colunas: Avatar+Nome+Email, Departamento, Perfil (badge colorido), Estado (badge ativo/inativo), Data criação, Ações

**JavaScript** — 10 funções novas:
- `openUsersManagement()` / `closeUsersManagement()`
- `loadUsersTable()` / `renderUsersTable(users)` / `filterUsersTable(query)`
- `openCreateUserForm()` / `openEditUserForm(id)` / `cancelUserForm()`
- `saveUserForm(e)` — detecta POST vs PATCH
- `deactivateUserAction(id, name)` / `reactivateUserAction(id, name)`

**Wiring de eventos**:
- `nav-users` → `openUsersManagement()`
- `nav-config-players` → `openSignageHub('hubPlayers')`
- `btnCloseUsersModal` → `closeUsersManagement()`
- Backdrop click e ESC key integrados

### 2.3. CSS (`public/css/dashboard.css`)
- `.users-toolbar` e `.users-search-input` — barra de ações
- `.users-mgmt-table` — tabela com hover e bordas
- `.user-cell-identity`, `.user-cell-avatar`, `.user-cell-name`, `.user-cell-email`
- `.status-badge-active` / `.status-badge-inactive` — badges de estado com cores do sistema
- `.btn-user-action` — botões de editar/desativar/reativar com hover por cor de função
- `.user-form-panel` / `.user-form-grid` — formulário de criação/edição com grid 2 colunas
- Adaptações `[data-theme="light"]` para todos os componentes

---

## 3. Testes de Validação

### 3.1. Endpoints REST (todos ✅ HTTP 200/201)
```
✅ POST /api/v1/auth/login (como admin)
✅ GET  /api/v1/users
✅ POST /api/v1/users     → 201 "Utilizador 'Teste Fase7' criado com sucesso."
✅ PATCH /api/v1/users/5  → 200 "Utilizador 'Teste Fase7' atualizado com sucesso."
✅ DELETE /api/v1/users/5 → 200 "Utilizador 'Teste Fase7' foi desativado."
```

### 3.2. Verificação de Comportamento
- Tab "Utilizadores" → abre modal de gestão (não o modal de sessão) ✅
- Tab "Perfis & Permissões" → continua a abrir o modal de sessão ✅
- Secção "Configurações" visível na sidebar ✅
- "Telas & Players" → abre hub signage na aba Players ✅
- Botão "+ Novo Utilizador" oculto em perfis não-admin ✅
- Linha de utilizador inativo com opacidade reduzida e texto riscado ✅
- Pesquisa filtra em tempo real por nome e email ✅
