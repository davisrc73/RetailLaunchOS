# Walkthrough • Fase 2: Gestão de Marcos Técnicos & Checklist Interativa
## RetailLaunchOS • Gabinete Multimédia (Fnac / Darty)

### Resumo das Entregas e Resultados

A Fase 2 introduziu a capacidade de gerir a esteira técnica e operacional de abertura de lojas, transformando a percentagem de progresso de um valor estático num cálculo reativo baseado em marcos técnicos reais.

---

## 1. O que foi Implementado

1. **DAO de Tarefas (`src/models/Task.js`)**:
   - Implementados métodos para listar, criar, alternar estado, atualizar, eliminar e calcular métricas agregadas da loja (`getStats`).
   - Cálculo automático de progresso: `progress = round((completed / total) * 100)`.

2. **Controlador REST (`src/controllers/taskController.js`)**:
   - Respostas semânticas e transações seguras no SQLite.
   - Endpoint de alternância rápida `/api/v1/tasks/:id/toggle` com resposta instantânea.

3. **Checklist Interativa no Modal de Gestão da Loja**:
   - Ao clicar em "Gerir Loja", o modal exibe a **Aba 1: Marcos Técnicos & Signage**.
   - Ao clicar no checkbox de qualquer marco, o estado transita entre concluído e pendente, atualizando a barra de progresso no modal e o card da loja no Dashboard sem necessidade de F5.
   - Formulário para adição rápida de tarefas com atribuição de departamento e nível de prioridade.
   - Atualização ágil de versão de Playlist de Signage e status de sincronização.

4. **Documentação Contínua**:
   - Atualizados `MANUAL_UTILIZADOR_MODAIS.md` e `ARQUITETURA_TECNICA.md`.

---

## 2. Validação e Testes Realizados

| Teste | Ação | Resultado |
| :--- | :--- | :--- |
| **Listar Tarefas** | `GET /api/v1/projects/1/tasks` | Retornou marcos técnicos da Fnac Cascais com progresso calculado |
| **Toggle de Estado** | `PATCH /api/v1/tasks/1/toggle` | Alternou status para concluído e gravou `completed_at` |
| **Atualização Signage** | `PATCH /api/v1/projects/1/signage` | Atualizou versão da playlist para `v2.4-cascais` e status `sincronizado` |
| **Criação de Marco** | Submissão no modal de tarefas | Novo marco adicionado à lista e progresso recalculado |
