# Plano de Implementação • Fase 9: Adaptação do Dashboard para Piloto Multimédia
## RetailLaunchOS • Gabinete Multimédia (Fnac / Darty)

**Data de Planeamento**: 07 de Setembro de 2026  
**Fase**: Fase 9 • Piloto Gabinete Multimédia  
**Estado**: ✅ Aprovado e Executado

---

## Objetivo

1. **Adequação ao Piloto Técnico Multimédia**: Adaptar a secção de topo do Dashboard para priorizar as operações técnicas diárias de Digital Signage, áudio e vídeo do Gabinete Multimédia da Fnac / Darty.
2. **Remoção de Métricas Puramente Financeiras**: Retirar os cartões de KPI *"Custo Diário Médio"* e *"Budget Global Alocado"*, focados em contabilidade geral e pouco relevantes na rotina imediata de montagem técnica das telas.
3. **Novo Cartão "Infraestrutura Multimédia"**: Criar um componente unificado, proeminente e responsivo que sintetize 4 dimensões chave em tempo real:
   - **Modelos de Hardware e o seu Estado**: Totais de equipamentos físicos no parque, desagregação por modelo (BrightSign XT1144, Samsung Tizen, LG webOS, BrightSign HD) e contadores por estado operacional (`Online`, `Em Teste`, `Syncing`, `Offline`).
   - **Resoluções de Saída**: Número de formatos de saída distintos e quantitativo de ecrãs por resolução (ex.: `4K UHD`, `1080p FHD`, `Video Wall LED`).
   - **Playlists a Associar**: Monitorização de displays pendentes de campanha vinculada (`playlist_id IS NULL`), taxa de associação global e total de campanhas prontas no catálogo.
   - **Número de Aberturas e o seu Estado**: Quantidade de lojas em preparação, distribuição por status (`Em Curso`, `Planeamento`, `Concluído`) e marco de prontidão de Digital Signage.

---

## Componentes Afetados

### Backend (Modelos e API REST)
- `src/models/Project.js`:
  - Enriquecimento do método estático `Project.getKpis()` para agregar dados em tempo real da tabela `signage_players` (modelos, resoluções, estados, players sem playlist), `playlists` (campanhas publicadas, em validação e rascunho) e `projects` (aberturas por status e por prontidão de signage).
- `server.js`:
  - O endpoint `GET /api/v1/projects/kpis` passa a disponibilizar o objeto `infraMultimedia`.

### Frontend (Interface e Estilos)
- `src/views/pages/dashboard.html`:
  - Remoção do markup HTML dos cartões de custo diário e budget.
  - Inclusão do novo cartão `.infra-multimedia-card` estruturado em 4 micro-painéis com atalhos de clique interativo (abrir catálogo de hardware, catálogo de playlists ou scroll para as aberturas).
  - Atualização da função `loadKpis()` para renderizar com segurança os dados agregados.
- `public/css/dashboard.css`:
  - Regras de grid com expansão a 2 colunas (`grid-column: span 2`) em ecrãs desktop (`>= 1200px`), assegurando equilíbrio perfeito na linha de 4 cartões.
  - Estilização com design system oficial (Fnac Gold, Dark Glassmorphism, micro-indicadores luminosos, chips de modelo e tags de resolução).

### Documentação Contínua (`AGENTS.md`)
- `MANUAL_UTILIZADOR_MODAIS.md`: Atualização da Secção 7 com a descrição detalhada do cartão e dos 4 micro-painéis.
- `ARQUITETURA_TECNICA.md`: Atualização das secções 3.1, 4.1 e 9 com o esquema de dados do endpoint.
- `MANUAL_BASE_DE_DADOS.md`: Guia de referência das entidades de dados SQLite e relacionamentos de suporte ao Gabinete Multimédia.
- `docs/README.md`: Registo da Fase 9 na tabela de entregas.
- `docs/implementation_plans/FASE_9_PLANO.md` e `docs/walkthroughs/FASE_9_WALKTHROUGH.md`.

---

## Refinamentos Finais Concluídos
1. **Grelha Superior**: Removido cartão *"Playlists & Signage"*, ficando 2 cartões de alto impacto: *Próxima Abertura* e *Infraestrutura Multimédia*.
2. **Tabela de Aberturas**: Título renomeado para *"Aberturas em Curso"* e removida coluna *"Custo / Dia"*.
3. **Secção Inferior**: Removido bloco antigo de infraestrutura e expandido *"Atividade Recente • Gabinete Multimédia"* para full-width (100%).

