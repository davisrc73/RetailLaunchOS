# Plano de Implementação • Fase 8: Catálogo Global de Telas & Players em "Configurações"
## RetailLaunchOS • Gabinete Multimédia (Fnac / Darty)

**Data de Planeamento**: 04 de Setembro de 2026  
**Estado**: ✅ Aprovado e Executado

---

## Objetivo

1. **Catálogo Global de Hardware**: O item **"Telas & Players"** na secção "Configurações" da barra lateral deve abrir um catálogo global de gestão de hardware de Digital Signage, em vez de abrir as associações por projeto.
2. **Ciclo de Vida Independente**: Permitir criar, editar e eliminar ecrãs e media players que existam no parque físico ou armazém sem estarem obrigatoriamente vinculados a uma loja (`project_id` opcional / `NULL`).
3. **Reatribuição Dinâmica**: Capacidade de atribuir ou transferir hardware entre lojas/projetos a partir do próprio catálogo global.
4. **Coexistência de Vistas**: Manter a vista por loja na aba "Telas & Players" do detalhe do projeto para gestão no contexto de abertura daquela loja específica.

---

## Componentes Afetados

### Base de Dados & Migração
- `database/schema.sql` — `project_id INTEGER` (tornar nullable) com `ON DELETE SET NULL`.
- `src/database/db.js` — Rotina de migração transparente `migrateSchema()` que deteta se `project_id` ainda possui restrição `NOT NULL` e recria a tabela sem perda de dados históricos.

### Backend (Modelos, Controladores e Rotas)
- `src/models/SignagePlayer.js` — `create` com suporte a `project_id` opcional, `update` permitindo reatribuição de loja/projeto e desassociação (`project_id: null`), `findAll` com ordenação de ecrãs em stock.
- `src/controllers/signageController.js` — Remoção da validação impeditiva de `project_id` obrigatório em `createPlayer`.
- `server.js` — Suporte aos métodos `GET /api/v1/signage/players`, `POST /api/v1/signage/players`, `PATCH /api/v1/signage/players/:id`, `DELETE /api/v1/signage/players/:id` e `POST /api/v1/signage/players/:id/ping`.

### Frontend
- `public/css/dashboard.css` — Estilos específicos da tabela de hardware (`.players-catalog-table`), badges de estado (`online`, `syncing`, `testing`, `offline`), chips de modelo e tags de resolução.
- `src/views/pages/dashboard.html`:
  - Ligar `#nav-config-players` a `openPlayersCatalog()`.
  - Novo modal `#modalPlayersCatalog` com formulário inline completo, toolbar de filtros rápidos (loja/marca e estado operacional) e pesquisa instantânea.
  - Funções JS: `openPlayersCatalog`, `closePlayersCatalog`, `loadPlayersCatalogData`, `renderPlayersCatalogTable`, `filterPlayersCatalog`, `openCreateCatalogPlayerForm`, `openEditCatalogPlayerForm`, `saveCatalogPlayerForm`, `pingCatalogPlayerAction`, `deleteCatalogPlayerAction`.
  - Controlo de RBAC para permissões de visualização e edição (`currentPermissions.canManageSignagePlayers`).

### Documentação
- `MANUAL_UTILIZADOR_MODAIS.md` — Secção 10.7 atualizada e Secção 11 adicionada com guia detalhado do catálogo.
- `ARQUITETURA_TECNICA.md` — Secção 4.4 atualizada com os endpoints globais de hardware.
- `docs/README.md` — Adicionada a Fase 8 à tabela de planos e walkthroughs.

---

## Decisões Técnicas e de Design

1. **Migração em SQLite**: Por restrições do SQLite nativo quanto à alteração direta de colunas `NOT NULL`, a migração cria uma tabela temporária, copia os registos existentes (preservando IDs e dados), substitui a tabela e recria os índices.
2. **Identificação Visual de Stock**: Dispositivos sem loja associada são identificados com a badge `📦 Em Stock / Sem Loja`, permitindo ao operador saber que equipamento está livre para novas aberturas.
3. **Controlo de Acesso RBAC**: Apenas utilizadores com `canManageSignagePlayers` (*Administrador* e *Técnico Multimédia*) podem registar, editar ou eliminar hardware do catálogo.
