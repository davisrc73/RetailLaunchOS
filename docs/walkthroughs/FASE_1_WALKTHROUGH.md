# Walkthrough • Fase 1: Conexão Real à Base de Dados & CRUD de Lojas
## RetailLaunchOS • Gabinete Multimédia (Fnac / Darty)

### Resumo das Entregas e Resultados

A Fase 1 estabeleceu a espinha dorsal funcional do RetailLaunchOS, eliminando dados mock em memória e implementando persistência relacional real.

---

## 1. O que foi Implementado

1. **Auto-Bootstrap da Base de Dados**:
   - `src/database/db.js` configurado com `node:sqlite`.
   - Na inicialização, deteta automaticamente se a tabela `projects` existe; caso não exista, executa `database/schema.sql`.
   - Tabelas criadas: `roles`, `users`, `projects`, `tasks`, `project_costs`.
   - Dados semente inseridos com sucesso para a Fnac Cascais e Darty Parque das Nações.

2. **Camada de Modelos (DAO)**:
   - `src/models/Project.js`: métodos `findAll`, `findById`, `create`, `update`, `delete`, `getKpis` utilizando *prepared statements* parametrizados para blindagem contra SQL Injection.

3. **Controladores e Roteamento**:
   - `src/controllers/projectController.js` e `server.js` ligados via rotas REST `/api/v1/projects` e `/api/v1/projects/kpis`.
   - Respostas semânticas com códigos de status HTTP apropriados (200, 201, 400, 404, 500).

4. **Interface Gráfica e Modal de "Nova Abertura"**:
   - O botão "+ Nova Abertura" no Dashboard passou a acionar o modal `#modalNewProject`.
   - Validações client-side de datas, formatos de loja e valores monetários.
   - Notificações toast e atualização dinâmica da lista de lojas sem recarregar a página completa.

---

## 2. Validação e Testes Realizados

| Teste | Ação | Resultado |
| :--- | :--- | :--- |
| **Inicialização da BD** | Arrancar `node server.js` com base de dados inexistente | Ficheiro `database/retaillaunch.sqlite` gerado e tabelas criadas automaticamente |
| **API Projetos** | `curl http://localhost:3000/api/v1/projects` | Retornou JSON com lojas ativas semente e progresso percentual |
| **API KPIs** | `curl http://localhost:3000/api/v1/projects/kpis` | Métricas agregadas de contagem, média de custos diários e próxima abertura |
| **Criação de Loja** | Submissão no formulário UI | Nova loja registada com código alfanumérico normalizado e exibida no grid |
