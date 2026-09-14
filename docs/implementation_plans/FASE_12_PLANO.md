# Plano de Implementação • Fase 12
## Correção e Sincronização Dinâmica do Cartão "Próxima Abertura" & Edição de Lojas

### 1. Contexto e Problema Identificado
No Dashboard principal do RetailLaunchOS (`http://localhost:3000`), os utilizadores do Gabinete Multimédia reportaram que o cartão Hero **"Próxima Abertura"** não atualizava os seus dados ao fazer refresh da página (`F5`), mesmo após terem sido efetuadas alterações em dados das lojas que deveriam refletir-se nesse cartão (alteração de data de inauguração/go-live, alteração do nome da loja ou alteração do estado da obra, ex: passando para `concluido`).

#### Análise das Causas-Raiz:
1. **Regra de Seleção SQL em `Project.getKpis()`**:
   - A query SQL em `Project.js` selecionava a próxima abertura utilizando apenas `WHERE go_live_date >= DATE('now') ORDER BY go_live_date ASC LIMIT 1`.
   - Não havia filtro para excluir lojas com estado `concluido` ou `cancelado`. Se a loja mais recente já estivesse concluída, o sistema continuava a elegê-la como "Próxima Abertura", impedindo a progressão natural para a próxima abertura ativa do portfólio.
2. **Armazenamento em Cache HTTP pelo Navegador**:
   - O servidor nativo `server.js` não definia cabeçalhos HTTP de controlo de cache (`Cache-Control`) nas respostas JSON da API.
   - O cliente frontend `src/views/pages/dashboard.html` invocava `fetch('/api/v1/projects/kpis')` sem a diretiva `{ cache: 'no-store' }`. Os navegadores (Safari, Chrome, Firefox) reutilizavam respostas de requisições anteriores durante o refresh regular.
3. **Ausência de Mecanismo e UI para Edição dos Dados de Loja**:
   - O sistema permitia criar novas lojas (`POST /api/v1/projects`) e atualizar tarefas ou custos, mas não disponibilizava na interface uma forma direta de retificar a data de go-live, o nome ou o estado da loja sem aceder diretamente à base de dados.
   - O servidor nativo `server.js` não tinha mapeamento para as rotas `PATCH` ou `PUT /api/v1/projects/:id`.
4. **Resquícios de Placeholders Estáticos e Fuso Horário**:
   - O template HTML de `dashboard.html` continha valores estáticos codificados ("Fnac Cascais", "CascaiShopping", "18 Dias", "22 Set 2026") que podiam causar flashes visuais até à conclusão do carregamento assíncrono.
   - O cálculo de dias restantes e formatação de datas sofria de deriva de fuso horário UTC em datas `YYYY-MM-DD`.

---

### 2. Arquitetura e Solução Implementada

#### 2.1. Backend & Modelo (`src/models/Project.js`)
- Refatoração da query de eleição da próxima abertura em `Project.getKpis()`:
  - Query Primária:
    ```sql
    SELECT * FROM projects 
    WHERE status NOT IN ('concluido', 'cancelado') 
      AND go_live_date >= DATE('now', 'localtime') 
    ORDER BY go_live_date ASC 
    LIMIT 1
    ```
  - Query Fallback (se todas as aberturas ativas estiverem com datas passadas ou em planeamento):
    ```sql
    SELECT * FROM projects 
    WHERE status NOT IN ('concluido', 'cancelado') 
    ORDER BY go_live_date DESC 
    LIMIT 1
    ```
- Garantia de que lojas entregues ou canceladas nunca surgem como a próxima abertura ativa.

#### 2.2. Servidor HTTP Nativo (`server.js`) & Rotas Express (`src/routes/api/projects.js`)
- Emissão obrigatória de cabeçalhos anti-cache em `sendJson()`:
  - `Cache-Control: no-store, no-cache, must-revalidate, proxy-revalidate`
  - `Pragma: no-cache`
  - `Expires: 0`
- Adicionado suporte completo às rotas `PATCH` e `PUT /api/v1/projects/:id` no servidor nativo `server.js`:
  - Validação RBAC via `checkAuth(req, res, 'admin', 'multimedia_user')`.
  - Invocação de `projectController.update(req, mockRes)`.
- Adicionadas as rotas correspondentes no ficheiro de rotas Express `src/routes/api/projects.js`:
  - `router.patch('/:id', requireRole('admin', 'multimedia_user'), projectController.update)`
  - `router.put('/:id', requireRole('admin', 'multimedia_user'), projectController.update)`
  - `router.delete('/:id', requireRole('admin'), projectController.delete)`

#### 2.3. Frontend & Interface do Utilizador (`src/views/pages/dashboard.html`)
- **Limpeza do Template Hero Card**:
  - Remoção dos dados estáticos fictícios, substituídos por *placeholders* estruturados e estados de carregamento elegantes.
- **Parsing de Datas sem Deriva UTC**:
  - Funções `formatDate` e `getDaysRemaining` refatoradas para interpretar cadeias `YYYY-MM-DD` com componentes numéricos locais `(ano, mes - 1, dia)`.
- **Desativação de Cache nos Pedidos `fetch`**:
  - Parâmetro `{ cache: 'no-store' }` injetado em `loadKpis()`, `loadProjects()`, `loadGlobalTasks()`, `loadSignagePlayers()`, etc.
- **Formulário de Edição de Loja no Modal de Detalhes (`#modalDetalheProjeto`)**:
  - Adicionado botão de ação rápida **"✏️ Editar Loja"** no cabeçalho do modal.
  - Secção retrátil `#cardEditProject` com campos editáveis: Nome, Insígnia, Formato, Localização, Data de Inauguração (Go-Live), Estado da Obra, Custo Diário e Orçamento Total.
  - Submissão via `PATCH /api/v1/projects/:id` com atualização instantânea do modal, da tabela de aberturas e dos KPIs superiores.
- **Carregamento Imediato no Arranque**:
  - `loadKpis()` e `loadProjects()` disparados simultaneamente logo no evento `DOMContentLoaded`.

---

### 3. Plano de Testes e Validação
1. **Teste de Conclusão de Loja**: Atualizar a loja atualmente mais próxima (Fnac Famalicão) para `status = 'concluido'` e verificar via `GET /api/v1/projects/kpis` se o sistema elege imediatamente a loja seguinte (FNAC Madeira).
2. **Teste de Reversão e Edição de Dados**: Reverter o estado para `planeamento`, alterar o nome e a data de go-live, validando o recálculo do relógio decrescente e dos cabeçalhos `Cache-Control: no-store`.
3. **Teste de Permissões RBAC**: Garantir que apenas perfis com permissão (`admin` e `multimedia_user`) conseguem submeter alterações através do endpoint `PATCH /api/v1/projects/:id`.
4. **Verificação de Regressão**: Garantir que as contagens globais de tarefas, infraestrutura multimédia e listas de ecrãs continuam 100% funcionais.
