# Plano de Implementação • Fase 7: Módulo de Gestão de Utilizadores & Secção "Configurações" na Sidebar
## RetailLaunchOS • Gabinete Multimédia (Fnac / Darty)

**Data de Planeamento**: 04 de Setembro de 2026  
**Estado**: ✅ Aprovado e Executado

---

## Objetivo

1. **Separação de Funcionalidades RBAC**: O tab "Utilizadores Gabinete" abria incorretamente o mesmo modal de autenticação/sessão que o tab "Perfis & Permissões". Era necessário um módulo dedicado de gestão de utilizadores com CRUD completo.
2. **Renomeação de Tab**: "Utilizadores Gabinete" → "Utilizadores".
3. **Secção de Configurações na Sidebar**: Novo grupo de navegação para módulos de configuração global como "Telas & Players".

---

## Componentes Afetados

### Backend
- `src/controllers/authController.js` — Métodos `createUser`, `updateUser`, `deactivateUser`
- `server.js` — Rotas `POST /api/v1/users`, `PATCH /api/v1/users/:id`, `DELETE /api/v1/users/:id`

### Frontend
- `public/css/dashboard.css` — Estilos do módulo de utilizadores
- `src/views/pages/dashboard.html` — Modal, sidebar, JavaScript

### Documentação
- `MANUAL_UTILIZADOR_MODAIS.md` — Secção 10 adicionada
- `ARQUITETURA_TECNICA.md` — Secção 4.5 atualizada
- `docs/README.md` — Fase 7 adicionada ao índice

---

## Novos Endpoints REST

| Método | Endpoint | Permissão |
| :--- | :--- | :---: |
| POST | `/api/v1/users` | admin |
| PATCH | `/api/v1/users/:id` | admin |
| DELETE | `/api/v1/users/:id` | admin |

---

## Decisões de Design

1. **Soft Delete**: A eliminação é implementada como desativação de estado (`status = 'inactive'`), preservando toda a integridade referencial histórica.
2. **Role Mapping no Frontend**: O dropdown de perfis usa `role_id` (inteiro) para compatibilidade direta com a base de dados.
3. **Reativação**: Os utilizadores inativos podem ser reativados com um botão dedicado.
4. **Segurança Própria do Admin**: Um administrador não pode desativar a sua própria conta através desta interface.
