# Plano de Implementação • Fase 3: Gestão de Custos & Diárias Técnicas
## RetailLaunchOS • Gabinete Multimédia (Fnac / Darty)

### Contexto e Objetivo
Implementar o módulo financeiro de acompanhamento de custos diários e despesas técnicas de cada abertura de loja (tabela `project_costs`), permitindo calcular em tempo real a taxa de execução orçamental, saldo remanescente e desvio orçamental com alertas visuais no painel.

---

## 1. Modificações na Base de Dados
- Utilização da tabela `project_costs`:
  - `id`: Identificador primário
  - `project_id`: Loja associada (FK)
  - `entry_date`: Data da despesa/diária
  - `cost_type`: Categoria (`diaria_tecnica`, `hardware_signage`, `cablagem_rede`, `sistema_som`, `licenca_software`, `contingencia`)
  - `amount`: Valor monetário em Euros (€)
  - `description`: Descrição detalhada da despesa ou prestador de serviços
  - `logged_by`: Utilizador que efetuou o lançamento (FK)
  - `created_at`: Timestamp de registo

---

## 2. Camada de Modelos (DAO)
- Criar `src/models/Cost.js`:
  - `Cost.findByProject(projectId)`: Lista de lançamentos ordenados por data decrescente com JOIN em `users`.
  - `Cost.findById(id)`: Procura individual por ID.
  - `Cost.create(data)`: Inserção parametrizada de novo custo.
  - `Cost.delete(id)`: Remoção de lançamento financeiro.
  - `Cost.getProjectFinancialSummary(projectId)`: Apura em tempo real:
    - `totalBudget`: Orçamento total alocado à loja.
    - `totalSpent`: Total acumulado de despesas registadas.
    - `remainingBudget`: Saldo orçamental disponível (`totalBudget - totalSpent`).
    - `budgetExecutionPercent`: Percentagem de consumo do plafond (`(totalSpent / totalBudget) * 100`).
    - `costsByType`: Agrupamento e soma de despesas por categoria de custo.
    - `costs`: Lista completa de lançamentos.
  - `Cost.getGlobalSummary()`: Apuramento agregado de gastos em todo o ecossistema.

---

## 3. Controladores e Endpoints REST
- Criar `src/controllers/costController.js`:
  - `getProjectCosts`: Retorna o sumário financeiro completo da loja.
  - `createProjectCost`: Valida os dados de entrada, insere a despesa e devolve o sumário recalculado (status HTTP 201).
  - `getGlobalCostSummary`: Métricas globais para a direção de operações.
  - `deleteProjectCost`: Remove o lançamento e devolve o sumário financeiro atualizado.

---

## 4. Roteamento em `server.js`
- `GET /api/v1/projects/:id/costs`
- `POST /api/v1/projects/:id/costs`
- `GET /api/v1/costs/summary`
- `DELETE /api/v1/costs/:id`

---

## 5. Interface Gráfica & Componentes (`dashboard.html` e `dashboard.css`)
- Modal de Detalhes da Loja:
  - **Aba 2: Custos, Diárias & Orçamento**:
    - Três cartões de KPI financeiro no topo:
      1. *Orçamento Total Alocado*
      2. *Total Gasto / Executado* (com barra de consumo orçamental e alerta de estouro se >100%)
      3. *Saldo Disponível* (com indicador visual positivo em verde ou negativo em vermelho)
    - Formulário elegante de registo de despesa: data, tipo de custo com tags categorizadas, valor em euros e descrição.
    - Tabela de histórico de lançamentos com formatação monetária em Euros (`Intl.NumberFormat('pt-PT')`), data formatada e botão de eliminação individual.

---

## 6. Verificação e Critérios de Sucesso
- Registar uma diária técnica de 350€ e verificar o aumento imediato do total gasto e a dedução no saldo disponível.
- Verificar o comportamento da barra de execução orçamental (verde até 75%, âmbar entre 75-100%, vermelho se >100%).
- Eliminar um lançamento e confirmar o recálculo imediato de todos os totais.
