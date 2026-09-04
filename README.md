# RetailLaunchOS 🚀
### Plataforma de Gestão de Aberturas de Lojas (Fnac & Darty)
**Desenvolvido para o Piloto Interno do Gabinete Multimédia (PT)**

---

## 📌 Visão Geral
O **RetailLaunchOS** é uma plataforma concebida para gerir e monitorizar os marcos de abertura de lojas Fnac e Darty, com foco na prontidão técnica audiovisual, digital signage (ecrãs, videowalls e players BrightSign / Samsung), conformidade de rede IT e acompanhamento de custos e diárias operacionais.

---

## 📚 Documentação do Projeto

Para garantir um desenvolvimento organizado e de fácil manutenção, o projeto inclui manuais dedicados:

* 📖 **[Manual de Utilização de Modais e Funcionalidades](file:///Users/daviscorreia/Antigravity%20/RetailLaunchOS/MANUAL_UTILIZADOR_MODAIS.md)**  
  *Guia passo-a-passo para os utilizadores do Gabinete Multimédia: criação de novas lojas via modal, inspeção de marcos técnicos, filtros por insígnia e exportação de relatórios.*

* ⚙️ **[Especificação da Arquitetura Técnica e Estrutural](file:///Users/daviscorreia/Antigravity%20/RetailLaunchOS/ARQUITETURA_TECNICA.md)**  
  *Documentação técnica aprofundada: camadas MVC, SQLite nativo (`node:sqlite`), auto-bootstrap de base de dados, diagrama relacional ER, modelos e endpoints da API REST.*

* 🖥️ **[Manual de Deploy e Sincronização Synology NAS](file:///Users/daviscorreia/Antigravity%20/RetailLaunchOS/MANUAL_SYNOLOGY.md)**  
  *Procedimentos para correr a aplicação em contentor Docker no Synology Container Manager e automação de atualizações via Agendador de Tarefas do DSM.*

---

## ⚡ Arranque Rápido

### Desenvolvimento Local (Mac / PC)
```bash
# Iniciar o servidor com base de dados SQLite automática
node server.js
```
Acede no teu browser a: **[http://localhost:3000](http://localhost:3000)**

### Deploy com Docker Compose (Synology NAS / Servidor)
```bash
docker compose up -d --build
```

### Sincronização com GitHub
```bash
./sync_github.sh "descrição da atualização"
```
*(ou `git add . && git commit -m "..." && git push origin main`)*

---

## 🛠️ Tecnologias Utilizadas
* **Runtime**: Node.js 22+ / 24+
* **Base de Dados**: SQLite Nativo (`node:sqlite`) com WAL mode e chaves estrangeiras ativas
* **Frontend**: HTML5 Semântico, Vanilla CSS com Design System Fnac/Darty e JavaScript nativo
* **Contentorização**: Docker Alpine & Docker Compose
* **Controlo de Versões**: Git & GitHub (`davisrc73/RetailLaunchOS`)
