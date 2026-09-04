# Walkthrough • Fase 5: Controlo de Permissões (RBAC) & Autenticação de Utilizadores
## RetailLaunchOS • Gabinete Multimédia (Fnac / Darty)

**Data de Conclusão**: 04 de Setembro de 2026  
**Responsável**: Antigravity Assistant & Davis Correia  
**Branch**: `main`  
**Objetivo**: Implementação do sistema integral de controlo de acessos baseado em perfis (RBAC), autenticação nativa sem dependências externas via tokens JWT (`node:crypto`), widget de operador dinâmico na barra lateral, modal de troca rápida de perfis em ambiente piloto e proteção estrita de todas as operações de escrita no backend e frontend.

---

## 1. Resumo Executivo da Entrega

A **Fase 5** dotou o **RetailLaunchOS** de governação e segurança corporativa essencial para as operações partilhadas entre o **Gabinete Multimédia Central**, os **Gestores de Loja locais** e a **Direção de Operações / Auditoria**:

1. **Zero Dependências NPM (Filosofia Synology-First)**:
   - Tokens JWT no formato padrão RFC 7519 gerados e validados exclusivamente através do módulo nativo do Node.js `node:crypto` com assinatura HMAC-SHA256.
   - Hash seguro de palavras-passe através de PBKDF2 com 10.000 iterações e salt criptográfico.
2. **4 Perfis RBAC Operacionais**:
   - `admin` (Administrador): Acesso irrestrito a criação e eliminação de lojas, orçamentos, playlists, ecrãs e utilizadores.
   - `multimedia_user` (Técnico Multimédia): Gestão de playlists, displays, pings de telemetria, diárias, custos e checklist técnica. Bloqueada a criação e eliminação estrutural de lojas.
   - `store_manager` (Gestor de Loja): Conclusão de tarefas de checklist e envio de sinais de teste (ping) aos ecrãs locais. Acesso em modo de leitura a orçamentos e sem permissão para criar ou remover equipamentos.
   - `viewer` (Consulta / Auditoria): Acesso de leitura universal em tempo real para dashboards executivos. Bloqueadas todas as mutações e formulários.
3. **Guardas de Rota no Backend (`server.js`)**:
   - Intercetor `checkAuth(req, res, ...allowedRoles)` que rejeita chamadas não autorizadas com HTTP 401 Unauthorized ou HTTP 403 Forbidden.
4. **Interface Dinâmica e Intuitiva**:
   - **Widget de Operador** no rodapé da sidebar com avatar de iniciais, badge de função e botões de alternância e logout.
   - **Modal de Sessão (`#modalAuthLogin`)** com 4 cartões de 1 clique para troca rápida de perfil em ambiente de demonstração/piloto, e formulário clássico com email e password (`fnac2026`).
   - **Adaptação Visual em Tempo Real**: Botão "+ Nova Abertura" oculto para não-administradores, caixas de seleção bloqueadas para o perfil `viewer`, botões de eliminação condicionados e banners explicativos de permissão no modal de detalhes da loja.

---

## 2. Componentes e Ficheiros Implementados

### 2.1. Base de Dados & Modelos DAO
* **`src/models/User.js`**:
  * Métodos: `verifyCredentials(email, password)`, `findById(id)`, `findByEmail(email)`, `findByRole(roleName)`, `findAll()`, `create(userData)`, `update(id, userData)`.
  * Utilizadores semente garantidos no arranque:
    * ID 1: `admin.multimedia@fnacdarty.pt` (`admin`)
    * ID 2: `signage.pilot@fnacdarty.pt` (`multimedia_user`)
    * ID 3: `loja.cascais@fnacdarty.pt` (`store_manager`)
    * ID 4: `auditor.direcao@fnacdarty.pt` (`viewer`)
* **`src/models/Role.js`**:
  * Métodos: `findAll()`, `findByName(name)`, `getPermissionsMatrix(roleName)`.
  * Matriz granular de privilégios (`canCreateProject`, `canDeleteProject`, `canManageTasks`, `canDeleteTasks`, `canManageCosts`, `canManageSignage`, `canPingPlayers`, `canManageUsers`).

### 2.2. Middleware & Controladores
* **`src/middleware/authMiddleware.js`**:
  * `signToken(payload)`: Emissão de token JWT assinado com HMAC-SHA256 e validade de 24 horas.
  * `verifyToken(token)`: Descodificação, verificação de integridade criptográfica com `crypto.timingSafeEqual` e validação de expiração.
  * `authenticate(req)`: Extração do token no cabeçalho `Authorization: Bearer <token>`.
  * `requireRole(...allowedRoles)`: Validador de papel de acesso.
* **`src/controllers/authController.js`**:
  * `login`: Suporta troca rápida via `{ role }` ou autenticação formal com `{ email, password }`.
  * `getCurrentUser`: Retorna dados do utilizador ativo e matriz de permissões.
  * `getUsersList`: Retorna a lista de operadores para seleção de equipa.
  * `getRolesList`: Retorna a lista de papéis e privilégios.

### 2.3. Endpoints Registados no `server.js`
* `POST /api/v1/auth/login` (Público)
* `GET /api/v1/auth/me` (Requer autenticação)
* `GET /api/v1/users` (Requer autenticação)
* `GET /api/v1/roles` (Requer autenticação)
* **Rotas de Mutação Protegidas**:
  * `POST /api/v1/projects` ➔ `admin`
  * `DELETE /api/v1/projects/:id` ➔ `admin`
  * `POST /api/v1/projects/:id/tasks` ➔ `admin`, `multimedia_user`, `store_manager`
  * `PATCH /api/v1/tasks/:id/toggle` ➔ `admin`, `multimedia_user`, `store_manager`
  * `DELETE /api/v1/tasks/:id` ➔ `admin`, `multimedia_user`
  * `POST /api/v1/projects/:id/costs` ➔ `admin`, `multimedia_user`
  * `DELETE /api/v1/costs/:id` ➔ `admin`, `multimedia_user`
  * `POST /api/v1/signage/playlists` ➔ `admin`, `multimedia_user`
  * `PATCH /api/v1/signage/playlists/:id/status` ➔ `admin`, `multimedia_user`
  * `DELETE /api/v1/signage/playlists/:id` ➔ `admin`, `multimedia_user`
  * `POST /api/v1/projects/:id/players` ➔ `admin`, `multimedia_user`
  * `PATCH /api/v1/signage/players/:id` ➔ `admin`, `multimedia_user`
  * `DELETE /api/v1/signage/players/:id` ➔ `admin`, `multimedia_user`
  * `POST /api/v1/signage/players/:id/ping` ➔ `admin`, `multimedia_user`, `store_manager`

### 2.4. Interface Gráfica & Estilos
* **`public/css/dashboard.css`**:
  * Estilos para `.sidebar-user-widget`, `.user-avatar` com anel de cor por papel, badges `.role-badge` (`admin`, `multimedia_user`, `store_manager`, `viewer`).
  * Estilos para grelha de seleção rápida `.auth-quick-cards` e cartões `.quick-role-card`.
  * Classes utilitárias `.perm-hidden`, `.perm-disabled` e `.perm-disabled-banner`.
* **`src/views/pages/dashboard.html`**:
  * Intercetor global `window.fetch` que injeta `Authorization: Bearer <token>` em todos os pedidos e trata 401/403.
  * Estrutura visual do `#sidebarUserWidget` e do modal `#modalAuthLogin`.
  * Lógica adaptativa em `applyRolePermissions()`, `openProjectDetails()` e `openSignageHub()`.

---

## 3. Matriz de Permissões Validada

| Ação do Sistema | Admin | Técnico Multimédia | Gestor de Loja | Viewer |
| :--- | :---: | :---: | :---: | :---: |
| **Criar Nova Abertura de Loja** | ✅ | ❌ | ❌ | ❌ |
| **Eliminar Projeto de Loja** | ✅ | ❌ | ❌ | ❌ |
| **Criar / Concluir Tarefas** | ✅ | ✅ | ✅ | ❌ |
| **Eliminar Tarefas** | ✅ | ✅ | ❌ | ❌ |
| **Registar Custos / Diárias** | ✅ | ✅ | ❌ | ❌ |
| **Eliminar Custos** | ✅ | ✅ | ❌ | ❌ |
| **Criar / Editar Playlists e Telas** | ✅ | ✅ | ❌ | ❌ |
| **Teste de Ping a Media Players** | ✅ | ✅ | ✅ | ❌ |
| **Visualização de KPIs e Dashboards** | ✅ | ✅ | ✅ | ✅ |

---

## 4. Testes e Validações Automatizadas Executadas

Foi executada uma bateria de testes funcionais via API HTTP REST validando todos os cenários de autorização:

```text
1. Admin Login (Quick Role): SUCESSO (Token JWT emitido, role: admin)
2. Auth Me (/api/v1/auth/me): SUCESSO (Utilizador: admin.multimedia@fnacdarty.pt)
3. Store Manager Credentials Login: SUCESSO (Utilizador: loja.cascais@fnacdarty.pt, role: store_manager)
4. Viewer Login: SUCESSO (role: viewer)
5. Viewer POST /api/v1/projects: HTTP 403 Forbidden (Correto: criação bloqueada)
6. Viewer PATCH /api/v1/tasks/1/toggle: HTTP 403 Forbidden (Correto: checklist bloqueada)
7. Store Manager POST /api/v1/projects/1/costs: HTTP 403 Forbidden (Correto: custos bloqueados)
8. Store Manager PATCH /api/v1/tasks/1/toggle: SUCESSO HTTP 200 OK (Correto: permissão concedida)
9. Admin POST /api/v1/projects: SUCESSO HTTP 201 Created (Novo projeto criado com ID 5)
10. Viewer DELETE /api/v1/projects/5: HTTP 403 Forbidden (Correto: eliminação bloqueada)
11. Admin DELETE /api/v1/projects/5: SUCESSO HTTP 200 OK (Projeto eliminado permanentemente)
```

---

## 5. Documentação Atualizada

* `MANUAL_UTILIZADOR_MODAIS.md`: Atualizado com a Secção 5 dedicada ao Modal de Sessão, Perfis de Operador, Troca Rápida de 1-clique e Matriz de Permissões.
* `ARQUITETURA_TECNICA.md`: Atualizado com os modelos `User.js` e `Role.js`, endpoints de autenticação, arquitetura de assinatura JWT e guardas RBAC.
* `MANUAL_SYNOLOGY.md`: Atualizado com a especificação das variáveis de ambiente (`JWT_SECRET`, `PORT`, `DATA_DIR`) e nota de zero dependências externas adicionais.
* `docs/README.md`: Atualizado para refletir o estado de conclusão da Fase 5.

---

## 6. Resolução de Incidentes no Front-End

* **Diagnóstico**: Durante os primeiros testes no navegador, foi detetado um erro de parsing (`SyntaxError: Identifier 'currentProjectIdInModal' has already been declared`), que impedia o runtime JavaScript do browser de executar o bloco `<script>`, inibindo o registo de todos os event listeners dos links e modais.
* **Resolução**:
  1. Removida a declaração redundante da variável `currentProjectIdInModal`.
  2. Adicionada proteção com bloco `try/catch` na desserialização de `localStorage` para `currentUser` e `currentPermissions`.
  3. Ligados explicitamente os ouvintes de clique para toda a navegação da barra lateral (`nav-dashboard`, `nav-projetos`, `nav-signage`, `nav-playlists`, `nav-custos`, `nav-roles`, `nav-users` e widget de perfil).
  4. Validação estática executada com sucesso via motor V8/Node.js confirmando sintaxe 100% íntegra.
