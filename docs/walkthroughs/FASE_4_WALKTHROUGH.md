# Walkthrough • Fase 4: Digital Signage & Versionamento de Playlists
## RetailLaunchOS • Gabinete Multimédia (Fnac / Darty)

### Resumo das Entregas e Resultados

A Fase 4 transformou o RetailLaunchOS num centro de comando de Digital Signage para a Fnac e Darty, permitindo ao Gabinete Multimédia centralizar o ciclo de aprovação de pacotes de conteúdos (playlists) e monitorizar o parque de equipamentos em tempo real.

---

## 1. O que foi Implementado

1. **Estrutura Relacional e Auto-Migração (`database/schema.sql` e `src/database/db.js`)**:
   - Criação das tabelas relacionais `playlists` e `signage_players` com integridade referencial.
   - Mecanismo resiliente em `initSchema()` para detetar e criar tabelas sem interromper o funcionamento ou apagar a base de dados existente.
   - Dados semente para a Fnac Cascais (ecrãs 4K, LED Wall, tablets de escuta) e Darty Parque das Nações (displays balcão e auditório).

2. **Modelos DAO (`src/models/Playlist.js` e `src/models/SignagePlayer.js`)**:
   - Métodos completos de consulta, agregação, criação, atualização de ciclo de vida e telemetria ping.
   - Recálculo dinâmico do KPI de prontidão global de ecrãs no Dashboard (`Project.getKpis()`).

3. **API RESTful e Rotas**:
   - Controladores em `src/controllers/signageController.js` mapeados em `server.js` cobrindo o catálogo de playlists, gestão de telas por loja, inventário global e testes de conectividade.

4. **Interface Gráfica & Componentes**:
   - **Aba 3 no Modal de Detalhe da Loja**: Painel de ecrãs locais com pílulas de status, troca instantânea de playlist e teste de conectividade Ping com feedback ao vivo.
   - **Hub Central de Digital Signage & Playlists** (acessível pelo menu lateral):
     - **Aba A**: Catálogo com cards visuais, badges de resolução e seletor rápido de ciclo de vida.
     - **Aba B**: Parque Global de Displays com listagem consolidada de todas as lojas, IPs e modelos de hardware.

5. **Documentação e Repositório**:
   - `MANUAL_UTILIZADOR_MODAIS.md` e `ARQUITETURA_TECNICA.md` atualizados em conformidade com as diretrizes do projeto.

---

## 2. Validação e Testes Realizados

| Teste | Endpoint / Ação | Resultado |
| :--- | :--- | :--- |
| **Métricas de Signage** | `GET /api/v1/signage/stats` | Status `200 OK` com dados agregados de telas e playlists |
| **Catálogo de Playlists** | `GET /api/v1/signage/playlists` | Status `200 OK` com listagem e contadores de telas associadas |
| **Telas por Loja** | `GET /api/v1/projects/1/players` | Status `200 OK` com 3 ecrãs da Fnac Cascais |
| **Telemetria Ping** | `POST /api/v1/signage/players/1/ping` | Status `200 OK` com `last_ping_at` atualizado e status online |
| **Criação de Ecrã** | `POST /api/v1/projects/1/players` | Status `201 Created` e auto-código `PLY-FNAC-CAS-175` |
| **Eliminar Ecrã** | `DELETE /api/v1/signage/players/:id` | Status `200 OK` com remoção validada |
| **Git Push** | `git push origin main` | Commit `960654a` enviado com sucesso |
