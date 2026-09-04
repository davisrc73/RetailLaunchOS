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
docker compose up -d --build
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
    docker compose up -d --build
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
