# Manual de Utilização • Modais e Funcionalidades do Dashboard
## RetailLaunchOS • Gabinete Multimédia (Fnac / Darty)

Este manual destina-se aos utilizadores e operadores do **Gabinete Multimédia**, descrevendo o funcionamento prático de todos os modais, formulários e ferramentas interativas disponíveis no **RetailLaunchOS**.

---

## Índice
1. [Visão Geral do Dashboard](#1-visão-geral-do-dashboard)
2. [Modal: Registar Nova Abertura de Loja](#2-modal-registar-nova-abertura-de-loja)
3. [Modal / Gaveta: Detalhes da Abertura & Marcos Técnicos](#3-modal--gaveta-detalhes-da-abertura--marcos-técnicos)
4. [Painel de KPIs & Contagem Decrescente](#4-painel-de-kpis--contagem-decrescente)
5. [Filtros, Pesquisa e Exportação CSV](#5-filtros-pesquisa-e-exportação-csv)
6. [Boas Práticas de Operação](#6-boas-práticas-de-operação)

---

## 1. Visão Geral do Dashboard

O ecrã principal (`http://localhost:3000` ou no IP do teu Synology NAS) centraliza toda a informação operacional das novas lojas em fase de abertura para as insígnias **Fnac** e **Darty**:

* **Sidebar Lateral**: Navegação rápida entre os módulos de *Lojas*, *Digital Signage*, *Playlists*, *Custos* e *Permissões*.
* **Header Superior**: Indicador de conectividade da rede signage, barra de pesquisa rápida e botão de ação primária **"+ Nova Abertura"**.
* **Painel de KPIs**: Indicadores agregados calculados em tempo real a partir da base de dados.
* **Tabela de Aberturas**: Lista dinâmica das lojas ativas com custos diários, progresso e acesso a detalhes técnicos.

---

## 2. Modal: Registar Nova Abertura de Loja

### 2.1. Como Aceder
No canto superior direito do Dashboard, clica no botão dourado **"+ Nova Abertura"**. O formulário surgirá sobreposto em formato modal com fundo escurecido.

### 2.2. Campos do Formulário e Significado

| Campo | Tipo | Obrigatoriedade | Descrição e Impacto no Sistema |
| :--- | :--- | :--- | :--- |
| **Insígnia da Loja** | Botão Seletor (Fnac / Darty) | Obrigatório | Define a marca. Aplica a identidade visual nos badges (Dourado para Fnac, Vermelho para Darty) e prefixa o código interno do projeto. |
| **Nome da Loja** | Texto | Obrigatório | Nome oficial do projeto. Exemplo: `Fnac Leiria Shopping` ou `Darty Amadora`. |
| **Formato da Loja** | Seleção (Dropdown) | Opcional (Default: *Standard*) | Tipo de superfície comercial: *Flagship Store*, *Standard Retail*, *Fnac Express / Travel* ou *Pop-up Store*. |
| **Localização / Morada** | Texto | Obrigatório | Identificação física da loja. Exemplo: `LeiriaShopping, Piso 0, Loja 112`. |
| **Data de Inauguração (Go-Live)** | Seletor de Data | Obrigatório | Data oficial de abertura ao público. Alimenta a contagem decrescente em dias e horas no Dashboard. |
| **Entrega Técnica Multimédia** | Seletor de Data | Opcional | Data limite para conclusão dos testes de telas, som e rede (normalmente 4 a 7 dias antes do go-live). |
| **Custo Diário Estimado (€)** | Numérico decimal | Opcional (Default: *380.00*) | Custo diário estimado para acompanhamento técnico, deslocações e operação durante a fase de abertura. |
| **Orçamento Total (€)** | Numérico decimal | Opcional (Default: *35000.00*) | Budget global alocado para a infraestrutura multimédia da loja. |
| **Versão da Playlist Signage** | Texto | Opcional (Default: *v1.0-inauguracao*) | Identificador do pacote de conteúdos digitais carregado nos players BrightSign/Samsung SSP. |
| **Estado Inicial de Signage** | Seleção (Dropdown) | Opcional (Default: *Pendente*) | Prontidão audiovisual: `Pendente de Instalação`, `Em Configuração de IPs`, `Em Validação de Telas` ou `Pronto para Broadcast`. |

### 2.3. Comportamento ao Submeter ("Gravar Abertura")
1. O formulário valida os campos obrigatórios.
2. É gerado automaticamente um código único estruturado (exemplo: `FNAC-LEI-2026-789`).
3. O registo é enviado via `POST /api/v1/projects` e persistido imediatamente na base de dados SQLite.
4. O modal fecha-se, a tabela de aberturas atualiza-se sem recarregar a página e surge uma notificação verde (*Toast*) de confirmação no canto inferior direito.
5. Se a nova loja tiver a data de abertura mais próxima de todas, o relógio de contagem decrescente do painel superior atualiza-se automaticamente para apontar para ela!

---

## 3. Modal / Gaveta: Detalhes da Abertura & Marcos Técnicos

### 3.1. Como Aceder
Na tabela **"Aberturas em Curso"**, clica no botão **"Gerir"** situado na última coluna de qualquer linha de projeto.

### 3.2. Informação Disponibilizada no Modal
* **Cabeçalho**: Nome da loja acompanhado do código oficial (ex: `FNAC-CAS-2026`).
* **Cartões de Resumo**:
  * **Inauguração Oficial**: Data formatada e contagem decrescente dos dias restantes.
  * **Custo Diário & Orçamento**: Diária contratual e teto orçamental alocado.
  * **Localização Física**: Morada completa e identificação de piso/loja.
  * **Digital Signage**: Versão de playlist associada e respetivo estado técnico.
* **Lista de Marcos Técnicos Multimédia (`tasks`)**:
  * Tarefas atribuídas ao Gabinete Multimédia (ex: *Configuração de Video Wall 4x4*, *Deploy de Playlist 4K*, *Certificação da VLAN de Signage*).
  * Prioridade (Crítica, Alta, Média) e status (*Concluído*, *Em Progresso*, *Pendente*).
  * Prazo de entrega de cada marco técnico.

---

## 4. Painel de KPIs & Contagem Decrescente

O painel superior do Dashboard atualiza-se em tempo real com as seguintes métricas:

1. **Próxima Abertura (Hero Card)**:
   * Deteta automaticamente a loja com data de go-live mais iminente.
   * Apresenta um relógio com contagem decrescente ativa ao segundo: `[Dias : Horas : Minutos : Segundos]`.
2. **Playlists & Signage**:
   * Barra de prontidão percentual indicando o volume de telas e conteúdos validados no piloto.
3. **Custo Diário Médio**:
   * Média aritmética do custo/dia de todas as lojas ativas, com o volume financeiro acumulado no mês corrente.
4. **Budget Global Alocado**:
   * Soma total dos orçamentos atribuídos aos projetos em execução e percentual executado.

---

## 5. Filtros, Pesquisa e Exportação CSV

### 5.1. Filtragem Rápida por Insígnia
Por cima da tabela, clica nos botões:
* **Todas**: Apresenta todas as lojas do portfólio.
* **Fnac**: Filtra apenas lojas com marca Fnac (fundo dourado).
* **Darty**: Filtra apenas lojas com marca Darty (fundo vermelho).

### 5.2. Pesquisa Instantânea (`⌘K`)
* Escreve no campo de pesquisa do cabeçalho qualquer termo (ex: *"Cascais"*, *"Darty"*, *"Shopping"*).
* A tabela filtra as linhas em tempo real à medida que digitas.

### 5.3. Exportação para CSV
* Clica no botão **"Exportar CSV"** no canto direito da secção de aberturas.
* O sistema compila os dados atuais e descarrega automaticamente um ficheiro formatado: `RetailLaunchOS_Aberturas_AAAA-MM-DD.csv`, pronto para abrir no Excel ou Google Sheets.

---

## 6. Boas Práticas de Operação

1. **Nomenclatura**: Utiliza sempre a convenção `[Insígnia] [Nome do Centro ou Cidade]` (ex: `Fnac Forum Coimbra`, `Darty Sintra`).
2. **Datas de Entrega**: Define sempre a *Entrega Técnica Multimédia* pelo menos 5 dias antes do *Go-Live*, permitindo testes de stress de reprodução contínua 24/7 nas telas antes da inauguração.
3. **Playlists**: Mantém o padrão de numeração semântica nas playlists (ex: `v1.0-abertura`, `v1.1-ajustes`, `v2.0-campanha`).
