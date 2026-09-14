# Manual de Sincronização e Deploy no Synology NAS
## RetailLaunchOS • Gabinete Multimédia (Fnac / Darty)

Este documento descreve o fluxo de integração e atualização contínua entre o ambiente de desenvolvimento local (Mac), o repositório **GitHub** e o servidor **Synology NAS** (à semelhança da arquitetura do projeto **BandOS**).

---

## 1. Arquitetura do Fluxo de Sincronização

```
[Mac / Desenvolvimento Local]
           │
           │  (1) git push origin main  (ou ./sync_github.sh)
           ▼
     [GitHub Repo]  (ex: github.com/davisrc73/RetailLaunchOS)
           │
           │  (2) git pull origin main
           ▼
   [Synology NAS]  (/volume1/docker/retaillaunch)
           │
           │  (3) docker compose up -d --build
           ▼
[Container Manager]  -> RetailLaunchOS ativo na porta 3000
```

---

## 2. Configuração Inicial no Synology NAS

### Passo A: Criar a pasta no Synology
No terminal SSH do Synology ou via File Station:
```bash
mkdir -p /volume1/docker/retaillaunch
cd /volume1/docker/retaillaunch
```

### Passo B: Clonar o Repositório do GitHub
```bash
git clone https://github.com/davisrc73/RetailLaunchOS.git .
```

### Passo C: Iniciar o Contentor via Docker Compose
```bash
docker compose up -d --build
```
A aplicação ficará acessível na rede local através de: `http://<IP_DO_NAS>:3000`.

### Passo D: Variáveis de Ambiente Opcionais (`docker-compose.yml`)
Podes definir variáveis de ambiente personalizadas no ficheiro `docker-compose.yml` ou num ficheiro `.env` na raiz:
* `PORT`: Porta HTTP do servidor (predefinição: `3000`).
* `JWT_SECRET`: Chave secreta de assinatura criptográfica HMAC-SHA256 para os tokens de autenticação RBAC (predefinição: chave padrão de piloto).
* `DATA_DIR`: Diretório de persistência da base de dados SQLite (predefinição: `/app/database`).
* **Zero Dependências Adicionais**: O módulo de autenticação e criptografia utiliza exclusivamente o módulo nativo `node:crypto`, sem requerer instalação de pacotes adicionais no contentor Alpine.

---

## 3. Como Atualizar no NAS Sempre que Houver Novas Alterações

### Opção 1: Atualização Manual Rápida (via SSH no NAS)
Quando fizeres `git push` no teu Mac, basta aceder ao NAS e executar:
```bash
cd /volume1/docker/retaillaunch
git pull origin main
# Reconstruir sem cache de camadas para garantir código 100% fresco
docker compose build --no-cache
docker compose up -d --force-recreate
```

### Opção 2: Atualização Automática no Synology (Agendador de Tarefas / Task Scheduler)
Para que o NAS se atualize sozinho sem precisares de entrar por terminal:

1. No DSM do Synology, abre o **Painel de Controlo (Control Panel)**.
2. Vai a **Agendador de Tarefas (Task Scheduler)**.
3. Clica em **Criar (Create)** > **Tarefa Agendada (Scheduled Task)** > **Script Definido pelo Utilizador (User-defined script)**.
4. Na aba **Geral**:
   - Nome da tarefa: `RetailLaunchOS - Auto Update`
   - Utilizador: `root`
5. Na aba **Agendamento**:
   - Define a frequência desejada (ex: diariamente às 04:00, ou de hora em hora).
6. Na aba **Definições da Tarefa (Task Settings)**, cola o seguinte script:
```bash
cd /volume1/docker/retaillaunch
git fetch origin main
# Verifica se há novos commits antes de rebuildar
LOCAL=$(git rev-parse HEAD)
REMOTE=$(git rev-parse origin/main)

if [ $LOCAL != $REMOTE ]; then
    echo "Novas atualizações encontradas. A atualizar..."
    git pull origin main
    docker compose build --no-cache
    docker compose up -d --force-recreate
else
    echo "Sem alterações no GitHub."
fi
```
7. Clica em **OK** para guardar.

---

## 4. No teu Mac: Como Enviar Alterações para o GitHub

Podes enviar novas alterações com o script facilitador incluído:
```bash
./sync_github.sh "feat: adicionar nova funcionalidade aos controladores"
```
Ou com os comandos Git padrão:
```bash
git add .
git commit -m "mensagem da alteração"
git push origin main
```

---

## 5. Como Migrar a Base de Dados do Mac para o Synology NAS

Como o ficheiro de base de dados SQLite (`database/*.sqlite*`) está incluído no `.gitignore` por razões de segurança e integridade de produção, o `git push` **nunca envia a base de dados do Mac para o GitHub**.

Para passar os dados que tens no Mac para o Synology NAS, tens duas opções simples:

### Opção A — Pela Interface Web (Recomendada • Zero Linha de Comandos):
1. No teu Mac, abre o navegador em: `http://localhost:3000`.
2. No menu lateral, acede a **Configurações ➔ Base de Dados & Migração**.
3. Clica no botão **"⬇️ Descarregar Base de Dados"**. O navegador descarregará o ficheiro `retaillaunch_backup_AAAA-MM-DD.sqlite`.
4. Agora abre o RetailLaunchOS no teu NAS: `http://<IP_DO_NAS>:3000`.
5. No menu lateral do NAS, acede a **Configurações ➔ Base de Dados & Migração**.
6. Na caixa **"Restaurar / Migrar Dados"**, clica para selecionar o ficheiro `.sqlite` que descarregaste no passo 3.
7. Clica em **"⬆️ Confirmar Restauro / Migração"**.
8. O sistema valida a integridade, cria um backup automático e substitui a base de dados do NAS. A página recarrega e o NAS fica exatamente com os mesmos dados do teu Mac!

### Opção B — Por Linha de Comandos (SCP + Docker CP):
No terminal do teu Mac, podes correr o script auxiliar incluído:
```bash
./scripts/sync_db_to_nas.sh
```
Ou executar diretamente:
```bash
# 1. Consolidar o ficheiro SQLite no Mac
node -e "require('./src/database/db').checkpointWal();"

# 2. Copiar para o NAS via SCP
scp database/retaillaunch.sqlite <UTILIZADOR_NAS>@<IP_DO_NAS>:/volume1/docker/retaillaunch/database/retaillaunch.sqlite

# 3. Copiar para dentro do contentor Docker no NAS e reiniciar
ssh <UTILIZADOR_NAS>@<IP_DO_NAS> "docker cp /volume1/docker/retaillaunch/database/retaillaunch.sqlite retaillaunch-app:/app/database/retaillaunch.sqlite && docker restart retaillaunch-app"
```

---

## 6. Garantia de Persistência Contínua no NAS (Sem Perda de Dados em Atualizações)

Uma dúvida comum é: *Ao fazer `git pull` e reconstruir o contentor no NAS no futuro, os dados do NAS vão ser apagados ou substituídos?*

**A resposta é NÃO. Os teus dados estão 100% seguros e persistem de forma contínua no NAS:**

1. **Proteção pelo `.gitignore`**: O ficheiro `database/*.sqlite*` está no `.gitignore`. Quando o NAS executa `git pull origin main`, o Git **nunca toca, apaga nem sobrescreve** a base de dados do NAS.
2. **Volume Docker Persistente (`retaillaunch_data`)**: No ficheiro `docker-compose.yml`, o diretório `/app/database` está mapeado para o volume persistente `retaillaunch_data`. Mesmo que o contentor seja destruído e recriado com `docker compose up -d --force-recreate`, o Docker volta a ligar exatamente o mesmo volume com todos os dados.
3. **Regra de Ouro**: Apenas **NUNCA** deves correr `docker compose down -v` (com a flag `-v`), pois a flag `-v` remove volumes de dados. A atualização padrão com `docker compose up -d --build --force-recreate` preserva 100% dos dados.
