# Relatório de Entrega • Fase 13
## Diagnóstico Synology NAS vs Localhost, Prevenção de Cache e Migração de Dados com Persistência Contínua

### 1. Resumo Executivo
Na Fase 13, foram resolvidas as discrepâncias operacionais observadas entre o ambiente de desenvolvimento local (**Mac**) e o ambiente de produção (**Synology NAS**). Foi implementada uma solução robusta para invalidação total de cache em ficheiros estáticos (HTML, CSS e JS) e disponibilizada uma ferramenta integrada de **Backup & Migração da Base de Dados SQLite** acessível via interface Web (1-clique) e via linha de comandos. Ficou também tecnicamente comprovada e documentada a garantia de **persistência contínua dos dados no NAS**, assegurando que futuros comandos `git pull` e reconstruções Docker nunca apagam nem sobrepõem a informação das lojas.

---

### 2. Funcionalidades Entregues

#### 2.1. Invalidação Contínua de Cache em Ativos Estáticos
* **Cabeçalhos Anti-Cache no Servidor HTTP (`server.js`)**:
  - Aplicados obrigatoriamente às rotas `/`, `/dashboard`, `*.html`, `/css/*` e `/js/*`:
    ```http
    Cache-Control: no-cache, no-store, must-revalidate, proxy-revalidate
    Pragma: no-cache
    Expires: 0
    ```
* **Cache-Busting no HTML (`src/views/pages/dashboard.html`)**:
  - Folha de estilos vinculada com `/css/dashboard.css?v=13.0`, forçando os navegadores a atualizar imediatamente o layout sem reutilizar folhas de estilo em cache.

#### 2.2. Gestão & Migração de Base de Dados no Backend
* **DAO SQLite (`src/database/db.js`)**:
  - Método `checkpointWal()`: Executa `PRAGMA wal_checkpoint(TRUNCATE)` garantindo que o ficheiro `retaillaunch.sqlite` se encontra 100% consolidado e pronto a migrar.
  - Método `reloadConnection()`: Reabre a ligação SQLite a quente sem reiniciar o contentor ou o servidor Node.js.
  - Método `getDatabaseStats()`: Telemetria completa de tamanho, caminhos físicos e contagem de registos.
* **Controlador REST (`src/controllers/databaseController.js`)**:
  - `GET /api/v1/database/info`: Retorna as métricas da base de dados ativa.
  - `GET /api/v1/database/backup`: Checkpoint e download binário com cabeçalhos de transferência (`application/vnd.sqlite3`).
  - `POST /api/v1/database/restore`: Upload atómico com validação dos magic bytes `SQLite format 3\0`, backup prévio `.bak`, substituição atómica e recarregamento transparente da ligação.

#### 2.3. Modal "Base de Dados & Migração" no Dashboard
* **Novo Menu na Sidebar**: Acesso direto sob Configurações ➔ **"💾 Base de Dados & Migração"** (`#nav-config-database`).
* **Interface do Modal (`#modalDatabaseMigration`)**:
  - **Card 1 • Telemetria da Base de Dados**: Caminho no servidor, tamanho em KB, data da última escrita e contadores de Lojas (5), Tarefas (19), Telas (7) e Utilizadores (6).
  - **Card 2 • Descarregar Backup**: Botão de 1-clique para descarregar o ficheiro `.sqlite` pronto para migração.
  - **Card 3 • Restaurar / Migrar Dados**: Zona de seleção/arrastamento de ficheiro `.sqlite` com confirmação explícita de segurança e recarregamento automático da aplicação.
  - **Card 4 • Guia de Persistência no NAS**: Explicação visual das garantias do volume Docker e do `.gitignore`.

#### 2.4. Automação e Documentação Synology NAS
* **Script Utilitário (`scripts/sync_db_to_nas.sh`)**: Script executável para consolidar o ficheiro local e apresentar os comandos exatos de migração via SCP ou Docker CP.
* **Comando de Atualização Otimizado no NAS**:
  ```bash
  cd /volume1/docker/retaillaunch && git pull origin main && docker compose build --no-cache && docker compose up -d --force-recreate
  ```
* **Garantia de Persistência**: A base de dados do NAS reside no volume Docker `retaillaunch_data` e está protegida no `.gitignore`. Futuros `git pull` não tocam na base de dados de produção.

---

### 3. Ficheiros Modificados e Criados

| Ficheiro | Tipo | Descrição |
| :--- | :---: | :--- |
| `src/database/db.js` | Modificado | Adicionados métodos `checkpointWal`, `reloadConnection` e `getDatabaseStats` |
| `src/controllers/databaseController.js` | **Novo** | Controlador REST para backup, restauro atómico e telemetria da BD |
| `server.js` | Modificado | Rotas `/api/v1/database/*` e cabeçalhos anti-cache em HTML, CSS e JS |
| `src/views/pages/dashboard.html` | Modificado | Menu na sidebar, modal `#modalDatabaseMigration`, funções JS e cache-busting v=13.0 |
| `scripts/sync_db_to_nas.sh` | **Novo** | Script executável de apoio à migração Mac ➔ Synology NAS |
| `MANUAL_SYNOLOGY.md` | Modificado | Procedimentos passo a passo de migração e persistência no NAS |
| `MANUAL_UTILIZADOR_MODAIS.md` | Modificado | Adicionada Secção 15 com instruções do modal de base de dados |
| `ARQUITETURA_TECNICA.md` | Modificado | Adicionada Subsecção 4.7 e Secção 11 com arquitetura de persistência e anti-cache |
| `docs/README.md` | Modificado | Atualizado o índice de fases com a Fase 13 |
| `docs/implementation_plans/FASE_13_PLANO.md` | **Novo** | Plano de implementação aprovado |
| `docs/walkthroughs/FASE_13_WALKTHROUGH.md` | **Novo** | Este relatório de entrega |

---

### 4. Validação e Testes Realizados

| Teste | Método | Resultado Obtido | Estado |
| :--- | :--- | :--- | :---: |
| **Info da BD** | `GET /api/v1/database/info` | Estatísticas devolvidas: 5 lojas, 19 tarefas, 7 players, 6 users (128 KB) | ✅ PASS |
| **Download Backup** | `GET /api/v1/database/backup` | Ficheiro binário transferido com headers `application/vnd.sqlite3` e `Cache-Control: no-cache, no-store` | ✅ PASS |
| **Restauro Atómico** | `POST /api/v1/database/restore` | Validação de assinatura SQLite 3 efetuada com sucesso; base de dados recarregada | ✅ PASS |
| **Anti-Cache HTML** | `GET /` | `Cache-Control: no-cache, no-store, must-revalidate` presente na resposta | ✅ PASS |
| **Anti-Cache CSS** | `GET /css/dashboard.css` | `Cache-Control: no-cache, no-store, must-revalidate` presente na resposta | ✅ PASS |
| **Script Shell** | `./scripts/sync_db_to_nas.sh` | Checkpoint WAL executado com sucesso e instruções de SCP/Docker apresentadas | ✅ PASS |
| **Segurança RBAC** | Teste sem token JWT | Resposta `401 Unauthorized` / `403 Forbidden` garantida | ✅ PASS |
