# Repositório de Documentação Técnica & Planos de Entrega
## RetailLaunchOS • Gabinete Multimédia (Fnac / Darty)

Este diretório armazena todos os registos históricos de planeamento técnico (**Implementation Plans**) e relatórios de validação de entregas (**Walkthroughs**), assegurando **auditabilidade contínua**, **capacidade de replicação integral do projeto** e suporte completo a cenários de **Disaster Recovery**.

---

## 📑 Índice de Fases de Desenvolvimento

| Fase | Título / Âmbito | Plano Técnico (Plan) | Relatório de Entrega (Walkthrough) | Estado |
| :---: | :--- | :---: | :---: | :---: |
| **0** | **Bootstrap & Infraestrutura** (Setup, Docker, Synology) | — | — | ✅ Concluído |
| **1** | **Conexão Real SQLite & CRUD de Lojas** | [FASE_1_PLANO.md](file:///Users/daviscorreia/Antigravity%20/RetailLaunchOS/docs/implementation_plans/FASE_1_PLANO.md) | [FASE_1_WALKTHROUGH.md](file:///Users/daviscorreia/Antigravity%20/RetailLaunchOS/docs/walkthroughs/FASE_1_WALKTHROUGH.md) | ✅ Concluído |
| **2** | **Marcos Técnicos & Checklist Interativa** | [FASE_2_PLANO.md](file:///Users/daviscorreia/Antigravity%20/RetailLaunchOS/docs/implementation_plans/FASE_2_PLANO.md) | [FASE_2_WALKTHROUGH.md](file:///Users/daviscorreia/Antigravity%20/RetailLaunchOS/docs/walkthroughs/FASE_2_WALKTHROUGH.md) | ✅ Concluído |
| **3** | **Gestão de Custos & Diárias Técnicas** | [FASE_3_PLANO.md](file:///Users/daviscorreia/Antigravity%20/RetailLaunchOS/docs/implementation_plans/FASE_3_PLANO.md) | [FASE_3_WALKTHROUGH.md](file:///Users/daviscorreia/Antigravity%20/RetailLaunchOS/docs/walkthroughs/FASE_3_WALKTHROUGH.md) | ✅ Concluído |
| **4** | **Digital Signage & Versionamento de Playlists** | [FASE_4_PLANO.md](file:///Users/daviscorreia/Antigravity%20/RetailLaunchOS/docs/implementation_plans/FASE_4_PLANO.md) | [FASE_4_WALKTHROUGH.md](file:///Users/daviscorreia/Antigravity%20/RetailLaunchOS/docs/walkthroughs/FASE_4_WALKTHROUGH.md) | ✅ Concluído |
| **5** | **Controlo de Permissões (RBAC) & Autenticação** | *Próxima etapa* | *A realizar* | ⏳ Em Planeamento |

---

## 🛠️ Procedimento de Disaster Recovery (Replicação a partir do Zero)

Caso seja necessário recriar o ambiente a partir de raiz num novo servidor ou no Synology NAS:

1. **Clonar o Repositório**:
   ```bash
   git clone git@github.com:davisrc73/RetailLaunchOS.git
   cd RetailLaunchOS
   ```
2. **Iniciar o Servidor ou Contentor Docker**:
   - **Via Node.js**: `npm start` (ou `node server.js`)
   - **Via Docker no Synology NAS**: `docker-compose up -d`
3. **Mecanismo de Auto-Bootstrap**:
   - O ficheiro `src/database/db.js` deteta a ausência da base de dados e compila automaticamente o esquema relacional integral em `database/schema.sql`.
4. **Consulta das Decisões de Engenharia**:
   - Consultar [`ARQUITETURA_TECNICA.md`](file:///Users/daviscorreia/Antigravity%20/RetailLaunchOS/ARQUITETURA_TECNICA.md) para detalhes de rotas, classes DAO e modelos relacionais.
   - Consultar [`MANUAL_UTILIZADOR_MODAIS.md`](file:///Users/daviscorreia/Antigravity%20/RetailLaunchOS/MANUAL_UTILIZADOR_MODAIS.md) para documentação de interface e fluxos de negócio do Gabinete Multimédia.
