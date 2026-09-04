# Plano de Implementação • Fase 1: Conexão Real à Base de Dados & CRUD de Lojas
## RetailLaunchOS • Gabinete Multimédia (Fnac / Darty)

### Contexto e Objetivo
Transitar o RetailLaunchOS de um protótipo estático para uma aplicação funcional conectada a um motor de base de dados SQLite relacional persistente, garantindo integridade referencial, consultas parametrizadas, criação de novas aberturas de lojas através de um modal interativo e cálculo dinâmico de KPIs.

---

## 1. Arquitetura da Base de Dados (`node:sqlite`)
- Adotar o módulo nativo `node:sqlite` (Node.js 22 LTS), eliminando dependências de compilação externa (`node-gyp`).
- Implementar bootstrap automático em `src/database/db.js`:
  - Verificar se a tabela `projects` existe na base de dados.
  - Caso não exista, executar automaticamente o script DDL `database/schema.sql`.
  - Configurar PRAGMAs essenciais:
    - `PRAGMA foreign_keys = ON;` (integridade relacional)
    - `PRAGMA journal_mode = WAL;` (Write-Ahead Logging para alta performance e concorrência)

---

## 2. Camada de Modelos e Acesso a Dados (DAO)
Criar e expandir `src/models/Project.js`:
- `Project.findAll({ brand, status })`: Consulta parametrizada com agregações de tarefas associadas e cálculo de progresso percentual.
- `Project.findById(id)`: Busca por ID numérico ou código de loja (ex: `FNAC-CAS-2026`).
- `Project.create(data)`: Geração normalizada de códigos de loja `[MARCA]-[CIDADE]-[ANO]-[ALEATORIO]` e inserção parametrizada.
- `Project.update(id, data)`: Atualização de campos cadastrais e estado da abertura.
- `Project.delete(id)`: Remoção em cascata de dependências do projeto.
- `Project.getKpis()`: Apuramento da próxima loja a abrir, custos diários médios, total de projetos ativos e orçamento global alocado.

---

## 3. Controladores e Endpoints REST
- `src/controllers/projectController.js`:
  - `getAllProjects`: Manipula parâmetros de consulta e retorna lista estruturada JSON.
  - `getProjectById`: Retorna detalhes individuais de uma loja.
  - `createProject`: Valida os dados de entrada (campos obrigatórios, insígnia permitida Fnac/Darty) e cria o registo com status HTTP 201.
  - `updateProject`: Atualização de loja com status HTTP 200.
  - `deleteProject`: Remoção de projeto com confirmação booleana.
  - `getProjectKpis`: Retorna objeto com todos os indicadores consolidados para o topo do painel.

---

## 4. Servidor de Aplicação (`server.js`)
- Mapeamento das rotas REST:
  - `GET /api/v1/projects`
  - `GET /api/v1/projects/kpis`
  - `GET /api/v1/projects/:id`
  - `POST /api/v1/projects`
  - `PUT /api/v1/projects/:id`
  - `DELETE /api/v1/projects/:id`
- Serviço de ficheiros estáticos (HTML, CSS vanilla e JS) com MIME types apropriados.
- Headers CORS completos para suporte a chamadas REST de clientes web.

---

## 5. Interface Gráfica & Modais (`dashboard.html` e `dashboard.css`)
- Modal "Nova Abertura de Loja":
  - Seletor visual de insígnia (Fnac com estilo dourado âmbar `#F59E0B` e Darty com estilo vermelho `#EF4444`).
  - Campos: Nome da Loja, Formato de Loja, Localização/Morada, Data de Go-Live, Data Limite das Obras, Custo Diário Previsto, Orçamento Global.
  - Validação cliente, feedback com notificações Toast flutuantes e refresh imediato da grelha de lojas e KPIs.
- Design System: Dark mode premium obsidian (`#090d16`), fontes Google *Plus Jakarta Sans* e *JetBrains Mono*, efeitos de vidro (*glassmorphism*).

---

## 6. Verificação e Critérios de Sucesso
- Criação e persistência do ficheiro `retaillaunch.sqlite`.
- Auto-criação de lojas de teste via formulário.
- Atualização em tempo real dos KPIs do cabeçalho do Dashboard.
