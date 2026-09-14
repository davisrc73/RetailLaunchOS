# Plano de Implementação • Fase 13
## Diagnóstico Synology NAS vs Localhost, Prevenção de Cache e Migração de Dados com Persistência Contínua

### 1. Contexto e Problema Identificado
Após a entrega da Fase 12, foram reportadas duas situações críticas na transição entre o ambiente de desenvolvimento local (Mac) e o servidor de produção (Synology NAS):
1. **Comportamento divergente no Synology NAS face ao Localhost**:
   - As alterações testadas no Mac não exibiam o mesmo comportamento no NAS após a execução dos comandos de atualização.
   - Diagnóstico:
     - **Divergência de Dados**: O ficheiro SQLite (`database/retaillaunch.sqlite`) do Mac continha as lojas e estados recentes, mas como `database/*.sqlite*` está no `.gitignore`, o `git push`/`git pull` nunca transportou a base de dados para o NAS. O contentor do NAS estava a correr com os dados antigos persistidos no seu volume Docker.
     - **Cache de HTML e CSS**: Em `server.js`, os ficheiros estáticos (`dashboard.html` e `dashboard.css`) estavam a ser servidos sem cabeçalhos `Cache-Control: no-cache, no-store`. Os navegadores clientes mantinham a versão anterior em cache.
     - **Cache de Camadas Docker no NAS**: Ao rebuildar sem `--no-cache`, o Docker daemon do Synology pode reaproveitar camadas anteriores.
2. **Necessidade de Migrar os Dados do Localhost para o NAS e Garantir Persistência Futura**:
   - O utilizador pretendia importar os dados atuais do Mac para o NAS.
   - Em futuras atualizações de código, os dados do NAS têm de permanecer inalterados, preservando os registos criados no NAS.

---

### 2. Arquitetura da Solução

#### 2.1. Invalidação Contínua de Cache em Ativos Estáticos (`server.js` & `dashboard.html`)
- Injeção obrigatória dos cabeçalhos:
  ```http
  Cache-Control: no-cache, no-store, must-revalidate, proxy-revalidate
  Pragma: no-cache
  Expires: 0
  ```
  Nas rotas `/`, `/dashboard`, `*.html`, `/css/*` e `/js/*`.
- Referência à folha de estilos no HTML com *cache-busting*: `/css/dashboard.css?v=13.0`.

#### 2.2. Ferramenta Integrada de Backup & Migração de Base de Dados
- **Módulo de Dados (`src/database/db.js`)**:
  - `checkpointWal()`: Executa `PRAGMA wal_checkpoint(TRUNCATE)` unificando transações pendentes no ficheiro `.sqlite`.
  - `reloadConnection()`: Fecha a ligação e reabre uma nova instância `DatabaseSync`, executando as verificações de esquema.
  - `getDatabaseStats()`: Retorna caminho, tamanho formatado, data de modificação e contadores de tabelas.
- **Controlador REST (`src/controllers/databaseController.js`)**:
  - `GET /api/v1/database/info`: Métricas da base de dados ativa.
  - `GET /api/v1/database/backup`: Download do ficheiro `retaillaunch.sqlite` consolidado.
  - `POST /api/v1/database/restore`: Validação da assinatura SQLite 3, criação de salvaguarda (`.bak`), substituição atómica e recarga de ligação.
- **Interface Gráfica no Dashboard (`src/views/pages/dashboard.html`)**:
  - Nova opção no menu: **Configurações ➔ Base de Dados & Migração** (`#nav-config-database`).
  - Modal `#modalDatabaseMigration` com telemetria do estado local, botão de download de backup e zona de upload com confirmação explícita de segurança.

#### 2.3. Automação e Persistência no Synology NAS (`scripts/sync_db_to_nas.sh` & `MANUAL_SYNOLOGY.md`)
- Criação do script de migração rápida via SCP/Docker CP.
- Atualização do comando de rebuild no NAS:
  ```bash
  git pull origin main && docker compose build --no-cache && docker compose up -d --force-recreate
  ```
- Garantia de que o volume Docker `retaillaunch_data:/app/database` e o `.gitignore` mantêm os dados 100% seguros e protegidos em todas as atualizações futuras.

---

### 3. Plano de Testes
1. Teste de compilação e execução de `db.checkpointWal()`, `db.reloadConnection()` e `db.getDatabaseStats()`.
2. Teste dos endpoints `GET /api/v1/database/info`, `GET /api/v1/database/backup` e `POST /api/v1/database/restore` via cURL.
3. Verificação dos cabeçalhos anti-cache em `GET /` e `GET /css/dashboard.css`.
4. Teste de execução do script `scripts/sync_db_to_nas.sh`.
5. Validação da interface do modal no navegador.
