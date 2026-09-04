# Plano de Implementação • Fase 6: Redesign Visual Diferenciador & Motor Multi-Tema (Day / Night / Auto)
## RetailLaunchOS • Gabinete Multimédia (Fnac / Darty)

**Data de Elaboração**: 04 de Setembro de 2026  
**Responsável**: Antigravity Assistant & Davis Correia  
**Branch**: `main`  
**Objetivo**: Implementar uma renovação visual distintiva e moderna no RetailLaunchOS, integrando um motor nativo com 3 modos de tema (Claro / Day, Escuro / Night, Automático / System), e adaptando todo o design system para a paleta oficial estrita das insígnias Fnac e Darty, acompanhada pelas 6 cores secundárias corporativas.

---

## 1. Especificação da Paleta de Cores Oficial

### 1.1. Insígnia Fnac
* **Amarelo / Dourado Oficial**: `#F5B027` (Acentos primários, botões de ação principal, barras de progresso Fnac)
* **Preto Puro**: `#000000` (Texto sobre fundos dourados, contrastes estritos de alta legibilidade)
* **Branco Puro**: `#FFFFFF` (Bordas, ícones e destaques)

### 1.2. Insígnia Darty
* **Vermelho Oficial**: `#E21212` (Badges Darty, destaques de inauguração Darty, avisos críticos)
* **Preto Puro**: `#000000` (Fundos e elementos de apoio)
* **Branco Puro**: `#FFFFFF` (Texto sobre fundos vermelhos, ícones e superfícies claras)

### 1.3. Cores Secundárias (Ambas as Insígnias)
* **`#006EFA`** (Azul Elétrico): Conectividade, Redes & IT, Endereços IP, Links de navegação e foco.
* **`#39D66A`** (Verde Vibrante): Status Online, Tarefas Concluídas, Prontidão de Signage e Indicadores de Sucesso.
* **`#FFDB00`** (Amarelo Radiante): Avisos, Tarefas em Validação, Contadores Regressivos e Destaques.
* **`#9147FF`** (Roxo Real): Catálogo de Playlists, Telas 4K Ultra HD e Tags de Hardware.
* **`#28E4AB`** (Turquesa Hi-Tech): Telemetria, Sinais de Teste (Ping), Cablagem e Redes.
* **`#FF7BF9`** (Rosa Neon): Campanhas Especiais, Eventos de Inauguração e Ações de Marketing.

---

## 2. Modos de Visualização

1. **☀️ Modo Claro (Day)**:
   * Fundo geral limpo em ardósia suave (`#F8FAFC`).
   * Superfícies de cartões e modais em branco puro (`#FFFFFF`) com elevações de sombra sutis.
   * Textos em tons profundos (`#0F172A` e `#475569`) com contraste ideal para ambientes com muita luz natural ou escritórios.
2. **🌙 Modo Escuro (Night)**:
   * Atmosfera obsidian imersiva (`#090D16`), com cartões em `#0F172A` e *glassmorphism* translúcido.
   * Iluminação ambiente periférica suave com gradientes das marcas Fnac e Darty.
3. **💻 Modo Automático (Auto / System)**:
   * Responde de imediato ao tema configurado no macOS/Windows (`window.matchMedia('(prefers-color-scheme: dark)')`).
   * Altera a interface em tempo real quando o utilizador muda o tema do sistema operativo.

---

## 3. Componente de Controlo (Seletor Segmentado)

* Localizado no canto superior direito do cabeçalho (*Header*), com 3 opções em formato *segmented pill*:
  * `[ ☀️ Claro | 🌙 Escuro | 💻 Auto ]`
* Indicador visual ativo deslizante (*smooth pill highlight*).
* Script inline no topo do `<head>` para garantir **Zero FOUC** (*Flash of Unstyled Content*).

---

## 4. Plano de Ficheiros a Modificar

1. **`public/css/dashboard.css`**:
   - Definição completa das variáveis CSS de tema (`:root`, `[data-theme="dark"]`, `[data-theme="light"]`).
   - Mapeamento das 6 cores secundárias e das cores oficiais Fnac/Darty.
   - Estilização do seletor segmentado `.theme-switcher-group`.
   - Ajuste dos contrastes de tabelas, cartões, formulários e modais para ambos os modos.
2. **`src/views/pages/dashboard.html`**:
   - Script inline anti-FOUC no `<head>`.
   - Marcação HTML do seletor de tema no cabeçalho.
   - Funções cliente `setThemeMode(mode)` e listeners reativos de preferências do sistema.
3. **Documentação**:
   - Atualizar `MANUAL_UTILIZADOR_MODAIS.md`, `ARQUITETURA_TECNICA.md` e `docs/README.md`.
