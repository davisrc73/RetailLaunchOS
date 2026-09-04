# Plano de Implementação • Fase 2: Gestão de Marcos Técnicos & Checklist Interativa
## RetailLaunchOS • Gabinete Multimédia (Fnac / Darty)

### Contexto e Objetivo
Implementar a gestão granular de tarefas e marcos técnicos (*milestones*) por abertura de loja na tabela `tasks`, permitindo ao Gabinete Multimédia acompanhar e validar cada etapa da infraestrutura de loja (Video Wall, Digital Signage, Áudio, Rede/VLAN) com recálculo automático da percentagem de progresso e atualização rápida de parâmetros de Signage.

---

## 1. Modificações na Base de Dados
- Utilização da tabela `tasks`:
  - `id`: Identificador primário
  - `project_id`: Loja vinculada (FK)
  - `department`: Departamento responsável (ex: `multimedia`, `infraestrutura`, `it_rede`, `som`)
  - `title`: Título do marco
  - `description`: Instruções e especificações técnicas
  - `priority`: `critical`, `high`, `medium`, `low`
  - `status`: `pendente`, `em_curso`, `concluido`
  - `due_date`: Prazo de entrega
  - `assigned_to`: Utilizador responsável (FK)
  - `completed_at`: Timestamp de conclusão

---

## 2. Camada de Modelos (DAO)
- Criar `src/models/Task.js`:
  - `Task.findByProject(projectId)`: Lista de tarefas com ordenação por prioridade e prazo.
  - `Task.create(data)`: Inserção de novo marco técnico.
  - `Task.toggleStatus(id)`: Alternância de 1 clique entre `concluido` (definindo `completed_at`) e `pendente`.
  - `Task.update(id, data)`: Atualização cadastral da tarefa.
  - `Task.delete(id)`: Remoção da tarefa.
  - `Task.getStats(projectId)`: Retorna contadores agregados `{ total, completed, inProgress, pending, progress }`.
- Atualizar `src/models/Project.js`:
  - Adicionar método `updateSignage(id, { signage_status, playlist_version })`.

---

## 3. Controladores e Endpoints REST
- Criar `src/controllers/taskController.js`:
  - `getProjectTasks`: Retorna a lista de tarefas e resumo estatístico de progresso.
  - `createTask`: Criação de tarefa técnica com status HTTP 201.
  - `toggleTask`: Alterna estado de conclusão com status HTTP 200.
  - `updateTask`: Edição de tarefa.
  - `deleteTask`: Eliminação com status HTTP 200.
- Atualizar `src/controllers/projectController.js`:
  - `updateProjectSignage`: Atualização rápida dos campos de Digital Signage.

---

## 4. Roteamento em `server.js`
- `GET /api/v1/projects/:id/tasks`
- `POST /api/v1/projects/:id/tasks`
- `PATCH /api/v1/tasks/:id/toggle`
- `PUT /api/v1/tasks/:id`
- `DELETE /api/v1/tasks/:id`
- `PATCH /api/v1/projects/:id/signage`

---

## 5. Interface Gráfica & Componentes Interativos (`dashboard.html` e `dashboard.css`)
- Modal de Detalhes da Loja (`#modalProjectDetails`):
  - Sistema de abas no cabeçalho do modal.
  - **Aba 1**: "Marcos Técnicos & Signage":
    - Painel superior com barra de progresso dinâmica em gradiente.
    - Mini-formulário inline para atualização rápida do status de Digital Signage e versão de playlist.
    - Lista de checklist interativa com checkboxes estilizados, tags de prioridade coloridas, departamento e botão de remoção.
    - Formulário colapsável para inserção de novo marco técnico.

---

## 6. Verificação e Critérios de Sucesso
- Alternar uma tarefa para concluída e verificar se a percentagem de progresso da loja sobe instantaneamente na barra do modal e no cartão da loja.
- Adicionar um novo marco e verificar a sua persistência na base de dados.
- Alterar o status de Signage e confirmar a gravação imediata no SQLite.
