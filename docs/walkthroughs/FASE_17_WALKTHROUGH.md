# Relatório de Entrega • Fase 17: Mapeamento Interativo de Equipamentos em Planta de Loja
## RetailLaunchOS • Gabinete Multimédia (Fnac / Darty)

---

## 1. Sumário Executivo

A **Fase 17** implementou com sucesso o módulo de **Planta & Telas Interativa** em cada projeto de abertura de loja. Esta funcionalidade responde diretamente aos desafios de coordenação e fiscalização no chão de loja (*on-site*), permitindo aos gestores e técnicos do Gabinete Multimédia:
* Fazer upload e gerir a planta arquitetónica de cada loja (PNG, JPG, WebP, SVG).
* Posicionar e arrastar interativamente cada ecrã, totem ou display (`signage_players`) sobre a planta.
* Visualizar o estado operacional de cada display em tempo real com halos pulsantes de radar (🟢 Online, 🟠 Em Testes, 🔵 Syncing, 🔴 Offline).
* Consultar a telemetria completa de cada equipamento e disparar testes de conetividade (Ping) diretamente no mapa.
* Aceder com 1 clique através dos novos botões dourados **"🗺️ Planta"** distribuídos estrategicamente pelo dashboard.

---

## 2. O Que Foi Construído

### 2.1. Persistência Atómica no Volume Synology NAS & Base de Dados
* **Esquema Relacional**:
  - `projects.floor_plan_image`: armazena o caminho do ficheiro (ex: `/uploads/floor_plans/floorplan_proj_6_1789510156911.svg`).
  - `signage_players.pos_x` e `pos_y`: percentagens contínuas normalizadas de `0.00%` a `100.00%`.
* **Migração Idempotente (`src/database/db.js`)**:
  - A rotina `migrateFloorPlans()` cria automaticamente o diretório `database/uploads/floor_plans/` e aplica os comandos `ALTER TABLE` sem quebras de integridade referencial.
* **Sobrevivência a Rebuilds Docker**:
  - Como a pasta `database/uploads/` reside dentro do volume persistente `/app/database`, todos os ficheiros de plantas sobrevivem a qualquer atualização de contentor no Synology Container Manager.

### 2.2. Endpoints REST & Streaming Estático (`server.js` & `projectController.js`)
* `POST /api/v1/projects/:id/floor-plan`: Recebe o ficheiro em Base64, valida a extensão, grava no disco, atualiza o registo da loja e emite registo de auditoria em `ActivityLog`.
* `DELETE /api/v1/projects/:id/floor-plan`: Remove o ficheiro e desassocia a planta da loja.
* `PATCH /api/v1/projects/:id/floor-plan/positions`: Atualiza coordenadas de um ou múltiplos displays via transação segura.
* `GET /uploads/floor_plans/:filename`: Streaming direto de imagens com content-types dedicados.

### 2.3. Interface do Utilizador & Experiência Tática (`dashboard.html` & `dashboard.css`)
* **Aba "Planta & Telas"**: 4ª aba integrada no modal de gestão de abertura, com contador dinâmico de cobertura espacial (`X/Y`).
* **Visualizador Dinâmico com Zoom & Pan**:
  - Controlo de zoom (+, -, repor) de 60% a 300%.
  - Modo Ecrã Inteiro (Fullscreen).
* **Três Modos de Posicionamento**:
  - **1-Clique Guiado**: Botão *"Posicionar na Planta"* ativa a mira de colocação rápida.
  - **Arrastamento com Rato (Desktop Drag & Drop)**: Permite ajustar a posição do pin no mapa com um clique e arraste contínuo.
  - **Ajuste Tátil (Mobile Touch Drag)**: Manipulação por toque em smartphones e tablets com prevenção de rolagem de página (`touch-action: none`).
* **Popovers Flutuantes com Teste de Conectividade**:
  - Clicar num pin exibe o nome, modelo, número de série (`serial_number`), zona, playlist e o botão **"📡 Testar Ping"**, que atualiza a saúde do equipamento na hora.
* **Atalhos Rápidos de 1-Clique**:
  - Botão **"🗺️ Planta"** na coluna de ações da tabela desktop.
  - Botão **"🗺️ Planta"** nos cartões táticos móveis.
  - Ícone de mapa **"🗺️"** junto à barra de progresso no cartão de planeamento de lojas.

---

## 3. Resultados dos Testes de Validação

Foi executada uma bateria de testes automatizados de integração via Node.js (`test_floorplan.js`):
1. **Verificação de Assets & Dashboard HTML**:
   - `GET /`: Código 200 OK. Estruturas `tabFloorPlan`, atalhos de abertura direta e funções de renderização presentes.
2. **Serviço de Ficheiros Estáticos de Planta**:
   - `GET /uploads/floor_plans/fnac_cascais_planta.svg`: Código 200 OK, `Content-Type: image/svg+xml`, integridade vetorial preservada.
3. **Listagem e Leitura de Coordenadas**:
   - `GET /api/v1/projects/6/players`: Código 200 OK, ecrãs lidos com coordenadas `pos_x`, `pos_y` persistidas.
4. **Atualização Transacional com Autenticação RBAC**:
   - `PATCH /api/v1/projects/6/floor-plan/positions` com Bearer Token de Administrador: Código 200 OK (`"Posições dos ecrãs na planta atualizadas com sucesso!"`).
   - Re-consulta confirmou que as coordenadas foram gravadas na base de dados SQLite com exatidão (`ID 8: 28.5%, 35.2%` e `ID 9: 52.0%, 68.4%`).

---

## 4. Estado de Conclusão e Entrega

Todas as metas da **Fase 17** foram alcançadas a 100%, com documentação completa em `MANUAL_UTILIZADOR_MODAIS.md`, `ARQUITETURA_TECNICA.md` e `MANUAL_SYNOLOGY.md`.
O repositório está pronto para sincronização com o GitHub e implantação no Synology NAS.
