# Relatório de Entrega • Fase 11
## Módulo de Configurações para Parâmetros Multimédia & Normalização de Cores Operacionais

### 1. Resumo Executivo
Na Fase 11, o **RetailLaunchOS** foi dotado de um módulo centralizado para configuração de parâmetros técnicos essenciais do Gabinete Multimédia (**Modelos de Hardware**, **Zonas / Localizações** e **Resoluções / Formatos**). Adicionalmente, foi realizada a normalização rigorosa das cores indicadoras do **Estado Operacional** das telas e players.

---

### 2. Funcionalidades Entregues

#### 2.1. Novo Módulo de Gestão de Parâmetros Multimédia
* **Acesso**:
  - Menu lateral: **Configurações ➔ Modelos, Zonas & Formatos** (`#nav-config-parameters`).
  - Catálogo de Telas: Botão **"⚙️ Gerir Parâmetros"** (`#btnOpenParamsFromCatalog`).
* **Abas de Configuração**:
  - 🖥️ **Modelos de Hardware** (ex.: *BrightSign XT1144 4K*, *Samsung SSP*, *LG webOS*, etc.).
  - 📍 **Zonas / Localizações** (ex.: *Entrada Principal*, *Montra Lateral*, *Linha de Caixas*, etc.).
  - 📐 **Resoluções / Formatos** (ex.: *4K UHD*, *FHD 1080p*, *Video Wall LED*, *Ultra-Stretch*, etc.).
* **Operações CRUD Completas**:
  - Formulário para adição rápida com design responsivo.
  - Edição imediata via prompt interativo.
  - Remoção com confirmação de segurança.

#### 2.2. Dropdowns Dinâmicos em Telas & Players
* O campo **"Zona / Localização na Loja"** foi convertido de input de texto livre para **caixa de seleção (`<select>`) obrigatória**.
* Os campos de **Modelo de Hardware** e **Resolução** passaram a ser alimentados dinamicamente pelos parâmetros ativos da base de dados.
* Implementado o mecanismo de fallback `setSelectValueOrAppend` para compatibilidade retroativa com equipamentos já registados.

#### 2.3. Padronização Oficial de Cores do Estado Operacional
* **Online (Ativo)**: **Verde** (`#10B981` / 🟢)
* **Em Testes**: **Laranja** (`#F59E0B` / 🟠)
* **A Sincronizar**: **Azul** (`#3B82F6` / 🔵)
* **Offline (Inativo)**: **Vermelho** (`#EF4444` / 🔴)
* Aplicado transversalmente aos badges de tabela, opções dos dropdowns e pontos luminosos pulsantes (*status-dot-ping*).

---

### 3. Ficheiros Criados e Modificados
1. **`database/schema.sql`**: Tabela `system_parameters`, índices e sementes iniciais.
2. **`src/database/db.js`**: Função de auto-migração `migrateSystemParameters()`.
3. **`src/models/SystemParameter.js`**: Novo DAO para gestão de parâmetros.
4. **`src/models/Role.js`**: Permissão `canManageConfig`.
5. **`src/controllers/configController.js`**: Novo controlador com métodos CRUD.
6. **`server.js`**: Rotas REST `/api/v1/config/parameters` protegidas por RBAC.
7. **`public/css/dashboard.css`**: Classes de cor de estado operacional e estilização do modal.
8. **`src/views/pages/dashboard.html`**: Integração de menus, modal `#modalConfigParameters`, selects dinâmicos e ciclo de vida do cliente.
9. **Documentação Mandatória**: `MANUAL_UTILIZADOR_MODAIS.md`, `ARQUITETURA_TECNICA.md`, `docs/README.md`.

---

### 4. Validação e Testes
* **Suite de Testes Automatizada**: 100% de sucesso validando:
  - Autenticação e emissão de token JWT.
  - Bloqueio RBAC 403 para utilizadores sem privilégios de configuração (`viewer`).
  - Criação, leitura agrupada, atualização e eliminação de parâmetros.
  - Renderização correta da página web e componentes (status 200).
