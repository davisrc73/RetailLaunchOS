# Plano de Implementação • Fase 5: Controlo de Permissões (RBAC) & Autenticação de Utilizadores
## RetailLaunchOS • Gabinete Multimédia (Fnac / Darty)

A **Fase 5** introduz a camada de segurança, autenticação e controlo de acessos baseado em perfis (**Role-Based Access Control - RBAC**), garantindo que apenas técnicos autorizados do Gabinete Multimédia e administradores possam alterar infraestrutura, playlists e orçamentos, enquanto gestores de lojas e auditores dispõem de acessos ajustados às suas responsabilidades.

---

## User Review Required

> [!IMPORTANT]
> **Filosofia Zero Dependências Mantida**:
> Toda a geração e validação de tokens de autenticação (JWT assinado com HMAC-SHA256) e hash seguro de senhas utiliza exclusivamente a biblioteca nativa `node:crypto` do Node.js 22 LTS, preservando a portabilidade e performance sem instalar pacotes adicionais (`jsonwebtoken`, `bcrypt`) no Synology NAS.

> [!TIP]
> **Alternador Rápido de Perfis (*Quick Role Switcher*) no Piloto**:
> Para facilitar os testes e a validação do Gabinete Multimédia sem atrito no piloto interno, o modal de autenticação disponibilizará tanto o login tradicional por Email e Senha como botões de alternância rápida de 1 clique para os 4 perfis padrão (`admin`, `multimedia_user`, `store_manager`, `viewer`).

---

## 1. Matriz de Perfis e Permissões (RBAC)

| Perfil | Código (`roles.name`) | Âmbito e Responsabilidade | Permissões no Sistema |
| :--- | :--- | :--- | :--- |
| **Administrador** | `admin` | Gestão global do sistema e infraestruturas | • Acesso total sem restrições<br>• Criar, editar e eliminar lojas<br>• Aprovação final de orçamentos e playlists<br>• Gestão de utilizadores e perfis |
| **Técnico Multimédia** | `multimedia_user` | Operações técnicas do Gabinete Multimédia | • Criar e aprovar versões de playlists<br>• Associar displays e executar testes de ping<br>• Registar e marcar marcos técnicos<br>• Lançar diárias e despesas técnicas<br>❌ Bloqueado: Eliminar lojas ou alterar utilizadores |
| **Gestor de Loja** | `store_manager` | Direção / Gestão de Abertura local | • Visualizar detalhes da sua loja<br>• Validar e alternar marcos técnicos atribuídos<br>• Consultar status das telas e custos locais<br>❌ Bloqueado: Criar lojas, gerir playlists centrais ou alterar orçamentos |
| **Consulta / Viewer** | `viewer` | Auditoria e Direção Executiva | • Leitura integral de Dashboards, KPIs e relatórios<br>❌ Bloqueado: Todas as mutações (`POST`, `PUT`, `PATCH`, `DELETE`) |

---

## 2. Proposta de Alterações Estruturais

### 2.1. Base de Dados & Migração Segura
- **`database/schema.sql`** & **`src/database/db.js`**:
  - Garantir a existência dos 4 perfis (`admin`, `multimedia_user`, `store_manager`, `viewer`).
  - Inserir/garantir dados semente dos 4 utilizadores correspondentes com senhas padrão seguras (`fnac2026`):
    1. `admin.multimedia@fnacdarty.pt` (Admin Multimédia)
    2. `signage.pilot@fnacdarty.pt` (Técnico Digital Signage)
    3. `loja.cascais@fnacdarty.pt` (Gestor Loja Cascais)
    4. `auditor.direcao@fnacdarty.pt` (Auditor de Operações)
  - Validação idempotente no arranque via `initSchema()`.

---

### 2.2. Camada de Modelos (DAOs)

#### [NEW] `src/models/User.js`
- `User.findById(id)`: Retorna utilizador com dados do papel (`role_name`, `role_description`).
- `User.findByEmail(email)`: Busca utilizador para verificação de credenciais.
- `User.findAll({ role, status })`: Lista utilizadores para atribuição de tarefas e auditoria.
- `User.verifyCredentials(email, password)`: Validação com comparação segura (`crypto.timingSafeEqual` ou suporte a hash PBKDF2/demo).
- `User.create(data)`: Registo de novos utilizadores com hash de password.
- `User.update(id, data)`: Atualização de perfil, departamento ou status.

#### [NEW] `src/models/Role.js`
- `Role.findAll()`: Lista todos os papéis disponíveis.
- `Role.findById(id)`: Detalhes de um perfil.

---

### 2.3. Camada de Segurança & Middleware

#### [MODIFY] `src/middleware/authMiddleware.js`
- **Tokens JWT Nativos**:
  - `signToken(payload)`: Gera tokens assinados com HMAC-SHA256 (`alg: HS256`, expiração de 24h).
  - `verifyToken(token)`: Validação criptográfica da assinatura e expiração sem bibliotecas externas.
- **Intercetores**:
  - `authenticate`: Extrai `Authorization: Bearer <token>` dos cabeçalhos; popula `req.user`.
  - `requireRole(...allowedRoles)`: Retorna HTTP 403 Forbidden se o utilizador logado não possuir permissão.
  - `requirePermission(action)`: Validação declarativa por ação (ex: `delete_project`, `create_playlist`).

---

### 2.4. Camada de Controladores & Rotas

#### [NEW] `src/controllers/authController.js`
- `login(req, res)`:
  - Valida email e senha (ou troca rápida de perfil por `role` no piloto).
  - Devolve status 200 com token JWT assinado e perfil sanitizado do utilizador.
- `getCurrentUser(req, res)` (`GET /api/v1/auth/me`):
  - Retorna o utilizador ativo a partir do token decifrado e lista das suas permissões ativas.
- `getUsersList(req, res)` (`GET /api/v1/users`):
  - Lista de utilizadores disponíveis para atribuição de marcos técnicos.

#### [MODIFY] `server.js`
- Registo dos novos endpoints:
  - `POST /api/v1/auth/login`
  - `GET /api/v1/auth/me`
  - `GET /api/v1/users`
- Aplicação de guardas de segurança nos endpoints existentes:
  - `DELETE /api/v1/projects/:id` ➔ Restrito a `admin`
  - `POST /api/v1/projects` ➔ Restrito a `admin`
  - `POST /api/v1/signage/playlists` ➔ Restrito a `admin`, `multimedia_user`
  - `POST /api/v1/projects/:id/costs` ➔ Restrito a `admin`, `multimedia_user`
  - `POST /api/v1/projects/:id/tasks` ➔ Restrito a `admin`, `multimedia_user`, `store_manager`
  - `PATCH /api/v1/tasks/:id/toggle` ➔ Restrito a `admin`, `multimedia_user`, `store_manager`
  - Operações de leitura `GET` ➔ Permitidas a qualquer utilizador autenticado (`admin`, `multimedia_user`, `store_manager`, `viewer`).

---

### 2.5. Interface Gráfica & Componentes (UI / UX)

#### [MODIFY] `public/css/dashboard.css`
- **Widget de Utilizador na Sidebar**:
  - Card compacto no rodapé da Sidebar com avatar de iniciais, nome do operador, pílula de cor por perfil (Admin dourado, Técnico ciano, Gestor verde, Viewer cinzento) e botões de troca de perfil e logout.
- **Modal de Autenticação / Troca de Perfil (`#modalAuthLogin`)**:
  - Grelha com 4 cartões de 1 clique para troca rápida no piloto com ícones de crachá e indicação das permissões.
  - Formulário alternativo com campos de Email e Senha.
- **Gating Visual de Permissões**:
  - Elementos restritos recebem classe visual com tooltip informativa e são desativados ou ocultados quando o utilizador atual não tem permissão para a ação.

#### [MODIFY] `src/views/pages/dashboard.html`
- Sistema de autenticação client-side com persistência em `localStorage` (`authToken`, `authUser`).
- Injeção automática do cabeçalho `Authorization: Bearer <token>` em todas as requisições AJAX (`fetchAPI`).
- Função reativa `applyUserRolePermissions(role)` para atualizar dinamicamente a interface (ocultar botões "+ Nova Abertura", botões de eliminar despesa, botões de associar ecrã quando em modo `viewer` ou `store_manager`).
- Intercetor global para erros HTTP 401/403 com aviso Toast amigável ("Acesso não autorizado para o seu perfil").

---

### 2.6. Documentação & Auditoria

#### [NEW] `docs/implementation_plans/FASE_5_PLANO.md`
- Cópia versionada deste plano no repositório.

#### [MODIFY] `MANUAL_UTILIZADOR_MODAIS.md`
- Adição da secção "Gestão de Acessos & Perfis de Utilizador", explicando como alternar entre perfis, o que cada papel permite fazer e como funciona a proteção contra ações indevidas.

#### [MODIFY] `ARQUITETURA_TECNICA.md`
- Documentação do fluxo criptográfico de tokens nativos, tabela de permissões e novos endpoints `/api/v1/auth/...`.

---

## 3. Plano de Verificação e Testes

### Testes Automatizados via `curl`
1. **Login com Sucesso**:
   - `POST /api/v1/auth/login` com credenciais de `admin.multimedia@fnacdarty.pt` ➔ Recebe token JWT válido (HTTP 200).
2. **Acesso Protegido**:
   - `GET /api/v1/auth/me` com header `Authorization: Bearer <token>` ➔ Retorna objeto do utilizador e role `admin`.
3. **Bloqueio de Não Autenticado**:
   - `POST /api/v1/projects` sem header Authorization ➔ Rejeitado com HTTP 401.
4. **Verificação de RBAC (Viewer bloqueado)**:
   - Login como `viewer` e tentativa de `POST /api/v1/projects/1/costs` ➔ Rejeitado com HTTP 403 Forbidden.
5. **Verificação de RBAC (Admin autorizado)**:
   - Login como `admin` e chamada a `POST /api/v1/projects/1/costs` ➔ Executado com sucesso (HTTP 201).

### Testes Manuais na Interface
- Alternar para o perfil **Viewer** no painel:
  - Verificar que o botão "+ Nova Abertura" desaparece ou fica desativado.
  - Verificar que botões de eliminar despesa e criar marcos ficam inativos.
- Alternar para o perfil **Técnico Multimédia**:
  - Verificar que consegue criar marcos, associar ecrãs e lançar diárias.
- Alternar para o perfil **Admin**:
  - Verificar acesso desimpedido a todas as abas, formulários e eliminações.
