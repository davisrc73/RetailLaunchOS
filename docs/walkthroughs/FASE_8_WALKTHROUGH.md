# Walkthrough • Fase 8: Catálogo Global de Telas & Players em "Configurações"
## RetailLaunchOS • Gabinete Multimédia (Fnac / Darty)

**Data de Conclusão**: 04 de Setembro de 2026  
**Responsável**: Antigravity Assistant & Davis Correia  
**Branch**: `main`  
**Objetivo**: Transformar o módulo "Telas & Players" da secção "Configurações" da barra lateral num catálogo global de hardware de Digital Signage, permitindo gerir o parque de displays físico independentemente de lojas específicas.

---

## 1. Resumo Executivo da Entrega

A **Fase 8** entregou a funcionalidade requerida para a gestão do inventário de hardware de Digital Signage:

1. **Catálogo Global de Hardware**:
   * O link **"Telas & Players"** da secção **"Configurações"** da barra lateral (`#nav-config-players`) abre agora o modal dedicado `#modalPlayersCatalog` ("Telas & Players • Catálogo Global de Hardware").
   * Deixou de ser uma visualização agregada de associações por loja para se tornar um inventário completo de dispositivos físicos (BrightSign, Samsung SSP Tizen, LG webOS, PCs e displays genéricos).
   * Suporte total a hardware em armazém / stock com identificação clara: `📦 Em Stock / Sem Loja`.

2. **CRUD Completo de Hardware**:
   * **Criar**: Formulário inline com validação técnica (Nome, Modelo, Zona, Resolução, IP, MAC, Estado, Firmware, Loja/Projeto Opcional e Playlist Vinculada Opcional).
   * **Editar**: Capacidade de atualizar qualquer parâmetro e reatribuir ou desassociar hardware entre projetos.
   * **Eliminar**: Remoção permanente do catálogo com confirmação explícita.
   * **Ping**: Teste de conectividade em tempo real para verificação de resposta do player na rede.

3. **Migração Transparente de Base de Dados**:
   * `signage_players.project_id` passou de `NOT NULL` para `NULL` (opcional).
   * Execução automática de migração em SQLite na inicialização do servidor, preservando todos os 6 dispositivos semente e respetivos IDs e configurações.

---

## 2. Componentes Modificados e Criados

### 2.1. Base de Dados e Backend
* **`database/schema.sql`**: Atualizado para `project_id INTEGER` e `FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE SET NULL`.
* **`src/database/db.js`**: Adicionada função `migrateSchema()` com validação via `PRAGMA table_info(signage_players)` e recriação atómica de tabela em SQLite.
* **`src/models/SignagePlayer.js`**:
  * `create(data)`: Suporta criação sem `project_id` ou com `project_id` nulo/vazio.
  * `update(id, data)`: Suporta atualização de `project_id` (atribuição, transferência ou desatribuição).
  * `findAll(filters)`: Ordenação estruturada com lojas por ordem alfabética e equipamentos em stock no fim (`CASE WHEN p.name IS NULL THEN 1 ELSE 0 END`).
* **`src/controllers/signageController.js`**:
  * `createPlayer`: Removida a exigência obrigatória de `project_id`.

### 2.2. Interface e Estilos
* **`public/css/dashboard.css`**: Adicionadas classes `.players-catalog-table`, `.player-model-chip`, `.player-res-chip`, `.player-net-info`, `.player-status-badge`, `.player-store-badge` e `.player-form-panel`.
* **`src/views/pages/dashboard.html`**:
  * Adicionado o modal `#modalPlayersCatalog` com formulário inline expansível, contadores, filtros por loja e status, campo de pesquisa rápida e tabela responsiva.
  * Implementadas as funções JavaScript de suporte: `openPlayersCatalog`, `closePlayersCatalog`, `loadPlayersCatalogData`, `renderPlayersCatalogTable`, `filterPlayersCatalog`, `openCreateCatalogPlayerForm`, `openEditCatalogPlayerForm`, `saveCatalogPlayerForm`, `pingCatalogPlayerAction`, `deleteCatalogPlayerAction`.
  * Integrado controlo de permissões RBAC com a matriz de acessos (`currentPermissions.canManageSignagePlayers`).

### 2.3. Documentação
* **`MANUAL_UTILIZADOR_MODAIS.md`**: Atualizada a secção 10.7 e criada a nova secção 11 com o guia de utilização do catálogo.
* **`ARQUITETURA_TECNICA.md`**: Atualizada a secção 4.4 com os métodos `POST` e `PATCH` globais do catálogo.
* **`docs/README.md`**: Índice atualizado com a Fase 8.

---

## 3. Testes e Validação Técnica

| Teste | Resultado |
| :--- | :---: |
| Migração da base de dados sem perda de dados existentes | ✅ Passou |
| `POST /api/v1/signage/players` com hardware em stock (`project_id: null`) | ✅ Passou |
| `PATCH /api/v1/signage/players/:id` para associar hardware a uma loja | ✅ Passou |
| `PATCH /api/v1/signage/players/:id` para desassociar hardware para stock (`project_id: null`) | ✅ Passou |
| `POST /api/v1/signage/players/:id/ping` handshake de teste | ✅ Passou |
| `DELETE /api/v1/signage/players/:id` remoção definitiva | ✅ Passou |
| Validação de sintaxe dos scripts de `dashboard.html` | ✅ Passou |
