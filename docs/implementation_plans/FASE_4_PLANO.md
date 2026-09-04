# Plano de Implementação • Fase 4: Digital Signage & Versionamento de Playlists
## RetailLaunchOS • Gabinete Multimédia (Fnac / Darty)

### Contexto e Objetivo
Expandir a aplicação para incluir o controlo operacional centralizado do ecossistema de **Digital Signage**, permitindo catalogar versões de playlists de conteúdos publicitários e institucionais, associá-las dinamicamente aos ecrãs e monitorizar a conectividade e prontidão do parque de telas e media players (BrightSign, Samsung SSP, LG webOS) em cada nova loja.

---

## 1. Modificações Estruturais na Base de Dados (SQLite)

### Novas Tabelas em `database/schema.sql` e Migração Segura em `src/database/db.js`:
1. **`playlists`**:
   - `id`: Identificador primário
   - `name`: Nome da playlist / pacote de conteúdos (ex: `Fnac Flagship 4K - Campanha Inauguração`)
   - `version`: Versão semântica única (ex: `v2.5-cascais`, `v1.0-nacoes`)
   - `brand`: Insígnia alvo (`Fnac`, `Darty`, `Ambas`)
   - `resolution`: Resolução de saída (`3840x2160 (4K)`, `1920x1080 (FHD)`, `LED Wall Ultrawide`, `Tablet 1200x800`)
   - `loop_duration_sec`: Ciclo do loop de exibição em segundos
   - `status`: Estado da playlist (`rascunho`, `aprovado`, `em_revisao`, `obsoleto`)
   - `storage_path`: Caminho no storage/NAS dos ficheiros de média
   - `published_at`: Timestamp de aprovação/publicação
   - `approved_by`: Utilizador responsável pela aprovação (FK)

2. **`signage_players`**:
   - `id`: Identificador primário
   - `project_id`: Loja onde o equipamento está instalado (FK)
   - `player_code`: Código alfanumérico único (ex: `PLY-FNAC-CAS-01`)
   - `name`: Designação da tela (ex: `Video Wall Entrada 4x4`, `Ecrã Montra Principal`)
   - `zone`: Zona de implantação na loja (`Entrada`, `Montra`, `Linha de Caixas`, `Espaço Som`, `Auditório`)
   - `resolution`: Resolução ótica do display
   - `orientation`: Orientação física (`landscape`, `portrait`)
   - `ip_address`: Endereço IP na VLAN técnica da loja
   - `mac_address`: Endereço MAC para reservas DHCP
   - `hardware_model`: Modelo do equipamento (`BrightSign XT1144`, `Samsung SSP Tizen`, `LG webOS Signage`, `Philips D-Line`)
   - `os_version`: Versão de firmware / SO
   - `current_playlist_id`: Playlist atualmente associada ao ecrã (FK)
   - `status`: Estado operacional (`online`, `syncing`, `testing`, `offline`)
   - `last_ping_at`: Timestamp do último teste de telemetria
   - `notes`: Observações técnicas do Gabinete Multimédia

---

## 2. Camada de Modelos e Lógica de Negócio

### A. `src/models/Playlist.js`
- `Playlist.findAll({ brand, status, resolution })`: Catálogo de playlists com contagem agregada de telas associadas.
- `Playlist.findById(id)`: Retorna metadados completos de uma playlist e dados do utilizador aprovador.
- `Playlist.create(data)`: Criação de nova versão de playlist.
- `Playlist.updateStatus(id, status)`: Atualiza o ciclo de vida da playlist, gravando `published_at = CURRENT_TIMESTAMP` na aprovação.
- `Playlist.delete(id)`: Remoção de versão não vinculada a equipamentos ativos.
- `Playlist.getStats()`: Sumário de versões por estado.

### B. `src/models/SignagePlayer.js`
- `SignagePlayer.findByProject(projectId)`: Lista todos os ecrãs/players de uma loja específica com dados da playlist associada.
- `SignagePlayer.findAll({ status, brand, projectId })`: Parque global de ecrãs de todas as lojas.
- `SignagePlayer.create(data)`: Registo de novo ecrã com geração automática de código.
- `SignagePlayer.update(id, data)`: Alteração de parâmetros, playlist vinculada ou estado.
- `SignagePlayer.ping(id)`: Executa/simula telemetria de conectividade com timestamp atualizado e estado `online`.
- `SignagePlayer.delete(id)`: Remoção de player da base de dados.
- `SignagePlayer.getGlobalSignageStats()`: Consolida métricas em tempo real para o KPI do Dashboard (total, online, em teste, offline, rácio de prontidão %).

### C. `src/models/Project.js`
- Atualização de `getKpis()` para calcular `signageReadiness` e contadores de telas dinamicamente da tabela `signage_players`.

---

## 3. Camada de Controlo REST e Rotas
- `src/controllers/signageController.js`:
  - `GET /api/v1/signage/stats`: Estatísticas globais do parque de telas e playlists.
  - `GET /api/v1/signage/playlists`: Catálogo central de playlists.
  - `POST /api/v1/signage/playlists`: Nova versão de playlist.
  - `PATCH /api/v1/signage/playlists/:id/status`: Transição de aprovação.
  - `GET /api/v1/signage/players`: Parque global de ecrãs.
  - `GET /api/v1/projects/:id/players`: Telas de uma loja específica.
  - `POST /api/v1/projects/:id/players`: Adicionar ecrã a uma loja.
  - `POST /api/v1/signage/players/:id/ping`: Teste de conectividade e ping.
  - `DELETE /api/v1/signage/players/:id`: Eliminar ecrã.
- `server.js`: Mapeamento de todas as rotas de Digital Signage.

---

## 4. Interface Visual e Componentes (UI / UX)

### A. Modal de Gestão da Loja (`dashboard.html`)
Adição de uma 3ª aba no modal de detalhes da loja:
- **Aba 1**: Marcos Técnicos & Signage
- **Aba 2**: Custos, Diárias & Orçamento
- **Aba 3**: Telas & Players da Loja:
  - Tabela com listagem de ecrãs, pílulas de status em tempo real (`online`, `syncing`, `testing`, `offline`), seletor dropdown inline de playlist e botão de teste de conectividade Ping com feedback instantâneo.
  - Formulário desdobrável `+ Associar Novo Ecrã / Player`.

### B. Modal Hub Central de Digital Signage & Playlists
Acessível a partir da Sidebar ("Digital Signage / Telas" ou "Playlists & Conteúdos"):
- **Aba A: Catálogo de Playlists & Versões**:
  - Grelha de cartões visuais com insígnia (Fnac/Darty), tags de resolução (4K, FHD, LED), duração de loop, número de telas ativas e dropdown de status.
  - Formulário para submissão de nova versão de playlist.
- **Aba B: Parque Global de Displays**:
  - Tabela unificada com todos os ecrãs de todas as lojas do ecossistema piloto, com badges de loja, IPs na VLAN técnica, firmware e teste de conectividade individual.

---

## 5. Verificação e Critérios de Sucesso
- Migração automática de `playlists` e `signage_players` sem reiniciar a BD nem perder dados anteriores.
- Criação e aprovação de novas playlists no catálogo.
- Vinculação de playlists a telas de loja e teste de conectividade Ping em tempo real.
- Atualização em tempo real do rácio de prontidão de Digital Signage no card KPI do topo do Dashboard.
