# Fase 16 • Otimização do Catálogo de Hardware, Vistas Dedicadas & Remoção de IP/MAC
## RetailLaunchOS • Gabinete Multimédia (Fnac / Darty)

---

## 1. Descrição do Problema & Objetivos

Esta fase resolve quatro requisitos operacionais fundamentais reportados pelo utilizador:

1. **Correção do Botão "Delete" no Catálogo Global de Hardware**:
   - *Causa-Raiz identificada*: O botão de eliminação utilizava interpolação inline de strings no HTML: `onclick="deleteCatalogPlayerAction(${p.id}, '${p.name.replace(...)}')"` . Equipamentos com aspas no nome (muito comuns em retalho técnico e displays, como `LCD Samsung 32"`) quebravam a sintaxe do atributo HTML `onclick="..."`, impedindo a ativação do evento para esses equipamentos.
   - *Solução*: Refatorar para passar estritamente o identificador numérico: `onclick="deleteCatalogPlayerAction(${p.id})"`. A função JavaScript cliente faz o lookup seguro do objeto via `_allCatalogPlayers.find(p => p.id === playerId)`, garantindo 100% de fiabilidade independentemente de caracteres especiais no nome. O mesmo ajuste foi aplicado a `pingCatalogPlayerAction(${p.id})`.

2. **Eliminação do Overscroll Horizontal no Modal "+ Ecrã / Player"**:
   - *Causa-Raiz*: O modal continha em simultâneo o formulário e a tabela larga de listagem com 7 colunas, gerando conflitos de largura e barras de rolagem desnecessárias.
   - *Solução*: Conectar o layout do formulário a um contentor dedicado sem overflow (`overflow-x: hidden; box-sizing: border-box;`), com grelha fluida `grid-template-columns: repeat(2, minmax(0, 1fr))` no desktop e `1fr` no mobile.

3. **Separação de Vistas: Retirar Amostragem do Catálogo do Formulário**:
   - Ao carregar em **"＋ Novo Ecrã / Player"** ou **"✏️ Editar Hardware"**, a listagem do catálogo (toolbar e tabela) é ocultada por completo (`catalogTableView.style.display = 'none'`), exibindo **apenas** a janela/painel de registo (`catalogPlayerFormView.style.display = 'block'`).
   - Ao premir **"💾 Guardar Hardware"** (ou "← Voltar ao Catálogo" / "Cancelar"), o sistema fecha o formulário, retorna à vista do catálogo total de Telas & Players e recarrega os dados atualizados em tempo real.

4. **Remoção Integral dos Campos "Endereço MAC" e "Endereço IP"**:
   - Retirar `ip_address` e `mac_address` de todos os pontos do sistema (Base de Dados SQLite, Migrações, Modelos, Controladores, Feed de Atividade, Telas do Dashboard, Catálogo Global e Aba de Telas da Loja), consolidando o **"ID / Serial (N.º Série)"** como o identificador unívoco de hardware.

---

## 2. Decisões Técnicas & Arquitetura

### 2.1. Base de Dados SQLite & Migração Idempotente
- Em `database/schema.sql`, remover as colunas `ip_address` e `mac_address` da definição da tabela `signage_players`.
- Em `src/database/db.js`, criar a rotina de migração `migrateRemoveNetworkFields()` que executa `ALTER TABLE signage_players DROP COLUMN ip_address;` e `ALTER TABLE signage_players DROP COLUMN mac_address;` caso as colunas ainda existam em bases de dados existentes (tanto no ambiente local como no Synology NAS).

### 2.2. Modelo & Controladores
- Em `src/models/SignagePlayer.js`:
  * `create(data)`: Remover colunas `ip_address` e `mac_address` do comando SQL `INSERT`.
  * `update(id, data)`: Remover `ip_address` e `mac_address` da lista de campos permitidos (`allowed`).
- Em `src/controllers/signageController.js`:
  * `pingPlayer(req, res)`: Ajustar mensagem de resposta e log de auditoria operacional em `ActivityLog` para referenciar o nome do ecrã e `serial_number`.

### 2.3. Interface do Utilizador (`dashboard.html` & `dashboard.css`)
- **Arquitetura de Vistas Alternadas no Modal de Telas & Players**:
  * `#catalogTableView`: Contém a toolbar (filtros por loja/estado, pesquisa por serial/nome, botão "⚙️ Gerir Parâmetros" e botão "＋ Novo Ecrã / Player") e a tabela de hardware (agora com 6 colunas, sem IP/MAC).
  * `#catalogPlayerFormView`: Contém o formulário isolado de criação/edição com cabeçalho limpo, botão "← Voltar ao Catálogo", campos organizados e botão "💾 Guardar Hardware".
- **Remoção de Campos**:
  * Remover inputs `#playerCatalogIp` e `#playerCatalogMac` do Catálogo Global.
  * Remover input `#newPlayerIp` do formulário da Aba de Telas da Loja.
  * Remover badges de IP e MAC nos cartões de ecrãs da Loja e no Hub de Signage, mantendo a ênfase no badge de `serial_number`.

---

## 3. Ficheiros Modificados

### Base de Dados & Backend
* **[`database/schema.sql`](file:///Users/daviscorreia/Antigravity%20/RetailLaunchOS/database/schema.sql)**:
  - Removidos `ip_address` e `mac_address` do schema e seed.
* **[`src/database/db.js`](file:///Users/daviscorreia/Antigravity%20/RetailLaunchOS/src/database/db.js)**:
  - Adicionada função de migração `migrateRemoveNetworkFields()` executada no bootstrap.
* **[`src/models/SignagePlayer.js`](file:///Users/daviscorreia/Antigravity%20/RetailLaunchOS/src/models/SignagePlayer.js)**:
  - Atualizados métodos `create` e `update` sem `ip_address` e `mac_address`.
* **[`src/controllers/signageController.js`](file:///Users/daviscorreia/Antigravity%20/RetailLaunchOS/src/controllers/signageController.js)**:
  - Atualizado `pingPlayer` para usar `serial_number` em vez de IP.

### Frontend
* **[`src/views/pages/dashboard.html`](file:///Users/daviscorreia/Antigravity%20/RetailLaunchOS/src/views/pages/dashboard.html)**:
  - Estruturado `#modalPlayersCatalog` em duas vistas alternadas (`#catalogTableView` e `#catalogPlayerFormView`).
  - Removidos campos de IP e MAC no catálogo e na aba de detalhe de projeto.
  - Atualizados handlers de delete e ping para passar apenas `playerId` (`deleteCatalogPlayerAction(${p.id})`).
  - Atualizadas funções `openCreateCatalogPlayerForm()`, `openEditCatalogPlayerForm()`, `cancelCatalogPlayerForm()`, `saveCatalogPlayerForm()`.
  - Atualizada tabela do catálogo para 6 colunas (removendo coluna Rede).
  - Versionamento de CSS atualizado para `v=16.0`.
* **[`public/css/dashboard.css`](file:///Users/daviscorreia/Antigravity%20/RetailLaunchOS/public/css/dashboard.css)**:
  - Otimizados estilos de `.player-form-panel` e `.player-form-grid` para eliminar overscroll horizontal e garantir fluidez em 2 colunas.

### Documentação & Histórico
* **[`MANUAL_UTILIZADOR_MODAIS.md`](file:///Users/daviscorreia/Antigravity%20/RetailLaunchOS/MANUAL_UTILIZADOR_MODAIS.md)**:
  - Atualizadas Secções 8 e 5 com as novas telas, remoção de IP/MAC e uso de Serial Number.
* **[`ARQUITETURA_TECNICA.md`](file:///Users/daviscorreia/Antigravity%20/RetailLaunchOS/ARQUITETURA_TECNICA.md)**:
  - Atualizados diagramas de entidades, contratos REST e Secção 14 com detalhes da arquitetura de vistas dedicadas.
