# Relatório de Entrega • Fase 12
## Correção e Sincronização Dinâmica do Cartão "Próxima Abertura" & Edição de Lojas

### 1. Resumo Executivo
Na Fase 12, foi resolvida a anomalia reportada no Dashboard principal do **RetailLaunchOS**, onde o cartão **"Próxima Abertura"** (Hero Card) mantinha dados desatualizados ou estáticos ao efetuar refresh da página (`F5`), mesmo após terem sido alterados a data de go-live, o nome ou o estado da loja. Adicionalmente, foi implementado um mecanismo completo e seguro de **Edição de Lojas** no modal de detalhe, permitindo a administradores e gestores multimédia retificar parâmetros fundamentais da abertura com propagação instantânea para o Dashboard e base de dados SQLite.

---

### 2. Funcionalidades e Correções Entregues

#### 2.1. Refatoração da Query SQL de Eleição da Próxima Abertura (`src/models/Project.js`)
* **Exclusão de Lojas Concluídas/Canceladas**: A seleção da próxima abertura foi corrigida para filtrar explicitamente:
  ```sql
  WHERE status NOT IN ('concluido', 'cancelado') 
    AND go_live_date >= DATE('now', 'localtime')
  ORDER BY go_live_date ASC 
  LIMIT 1
  ```
* **Fallback Ordenado Inteligente**: Caso todas as lojas ativas tenham prazos atingidos ou estejam em planeamento, é selecionada a loja mais recente que não esteja concluída ou cancelada, evitando cartões vazios ou seleções desfasadas da realidade da obra.

#### 2.2. Prevenção Estrita de Cache HTTP (Servidor e Cliente)
* **Cabeçalhos Anti-Cache no Servidor HTTP Nativo (`server.js`)**:
  - `sendJson()` emite agora de forma obrigatória:
    - `Cache-Control: no-store, no-cache, must-revalidate, proxy-revalidate`
    - `Pragma: no-cache`
    - `Expires: 0`
* **Requisições Frontend com `{ cache: 'no-store' }` (`src/views/pages/dashboard.html`)**:
  - Todas as chamadas `fetch` a `/api/v1/projects/kpis`, `/api/v1/projects`, `/api/v1/tasks` e `/api/v1/signage/players` desativam expressamente o armazenamento em cache do navegador, garantindo que qualquer refresh da página (`F5` ou `Ctrl+R`) obtém dados 100% frescos diretamente da base de dados.

#### 2.3. Endpoints REST `PATCH` e `PUT /api/v1/projects/:id`
* **Mapeamento no Servidor HTTP Nativo (`server.js`)**:
  - Mapeado com suporte aos verbos `PATCH` e `PUT`, verificação RBAC (`admin`, `multimedia_user`) e invocação de `projectController.update(req, mockRes)`.
* **Rotas Express (`src/routes/api/projects.js`)**:
  - Mapeadas formalmente as rotas `PATCH /:id` e `PUT /:id` com middleware `requireRole('admin', 'multimedia_user')`, e `DELETE /:id` com restrição `admin`.

#### 2.4. Formulário e Botão de "Editar Loja" no Modal de Detalhe (`#modalDetalheProjeto`)
* **Interface de Edição Dinâmica**:
  - No cabeçalho do modal de gestão de abertura, adicionado o botão de ação **"✏️ Editar Loja"** (`#btnToggleEditProject`).
  - Painel expansível `#cardEditProject` com campos editáveis:
    - **Nome da Loja**
    - **Insígnia** (Fnac / Darty)
    - **Formato da Loja** (Standard, Flagship, Express, etc.)
    - **Localização / Morada**
    - **Data de Inauguração (Go-Live)**
    - **Estado da Obra** (`planeamento`, `em_curso`, `testes_signage`, `concluido`, `atrasado`)
    - **Custo Diário Estimado (€)** e **Orçamento Total (€)**
* **Feedback Imediato & Atualização Reativa**:
  - A submissão valida os dados, emite um *Toast* de notificação verde e recarrega os dados do modal, da tabela de aberturas e dos cartões superiores de KPIs em paralelo.

#### 2.5. Correção de Fusos Horários e Placeholders Estáticos no Frontend
* **Eliminação de Deriva UTC**:
  - As funções `formatDate` e `getDaysRemaining` fazem agora o parse local de strings `YYYY-MM-DD` sem interpretar a data como meia-noite UTC (que causava por vezes desvios de 1 dia consoante o fuso horário).
* **Limpeza do HTML do Hero Card**:
  - Removidos valores fictícios de rascunho (*"Fnac Cascais"*, *"CascaiShopping"*, etc.) do HTML inicial, substituídos por estados neutros de carregamento.
* **Exibição do Formato da Loja e Status Visual**:
  - O subtítulo do Hero Card apresenta o formato oficial (ex: *Fnac Standard*, *Fnac Flagship*).
  - O badge de status de signage é estilizado com a classe dinâmica correta (`badge-signage-ok`, `badge-signage-testing`, `badge-signage-pending`).

---

### 3. Ficheiros Modificados
1. **`src/models/Project.js`**: Refatoração do método `Project.getKpis()` com filtro anti-lojas concluídas.
2. **`server.js`**: Adicionados cabeçalhos HTTP anti-cache em `sendJson()` e rotas `PATCH`/`PUT /api/v1/projects/:id` com guardas RBAC.
3. **`src/routes/api/projects.js`**: Adicionadas rotas Express protegidas para atualização e eliminação de projetos.
4. **`src/views/pages/dashboard.html`**: Formulário de edição de loja, limpeza do template Hero, parse local de datas, `{ cache: 'no-store' }` nos fetches e sincronização reativa.
5. **`docs/implementation_plans/FASE_12_PLANO.md`**: Plano técnico aprovado.
6. **`docs/walkthroughs/FASE_12_WALKTHROUGH.md`**: Este relatório de validação.
7. **`docs/README.md`**: Atualizado o sumário de fases.
8. **`MANUAL_UTILIZADOR_MODAIS.md`**: Documentadas as novas opções de edição de loja e as regras do cartão de próxima abertura.
9. **`ARQUITETURA_TECNICA.md`**: Documentada a nova rota REST e o algoritmo de seleção de KPIs.

---

### 4. Validação e Testes Realizados

| Cenário de Teste | Operação Executada | Resultado Observado | Estado |
| :--- | :--- | :--- | :---: |
| **Cabeçalhos Anti-Cache** | `curl -i http://localhost:3000/api/v1/projects/kpis` | Cabeçalhos `Cache-Control: no-store...`, `Pragma: no-cache` e `Expires: 0` devolvidos com sucesso. | ✅ Aprovado |
| **Conclusão de Abertura** | `PATCH /api/v1/projects/6` com `status: "concluido"` | Resposta `200 OK`. `GET /api/v1/projects/kpis` promoveu imediatamente a loja seguinte (**FNAC Madeira (MAD)**) como "Próxima Abertura". | ✅ Aprovado |
| **Reversão de Estado** | `PATCH /api/v1/projects/6` com `status: "planeamento"` | Resposta `200 OK`. `GET /api/v1/projects/kpis` voltou a eleger **Fnac Famalicão** (data mais próxima: 2026-09-16). | ✅ Aprovado |
| **Atualização de Nome & Data** | `PATCH /api/v1/projects/6` alterando nome e data para `2026-09-18` | Resposta `200 OK`. `GET /api/v1/projects/kpis` refletiu imediatamente o novo nome e nova data. | ✅ Aprovado |
| **Segurança RBAC** | Tentativa de `PATCH` com utilizador não autenticado ou sem perfil | Erro `401 Unauthorized` ou `403 Forbidden` garantido. | ✅ Aprovado |
| **Persistência de Estado** | Verificação pós-restauro de dados de teste | Aberturas ativas com dados íntegros na base de dados SQLite. | ✅ Aprovado |
