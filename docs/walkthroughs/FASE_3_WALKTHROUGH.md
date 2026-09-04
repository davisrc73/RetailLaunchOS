# Walkthrough • Fase 3: Gestão de Custos & Diárias Técnicas
## RetailLaunchOS • Gabinete Multimédia (Fnac / Darty)

### Resumo das Entregas e Resultados

A Fase 3 dotou o RetailLaunchOS de controlo financeiro e orçamental rigoroso para cada abertura de loja, permitindo ao Gabinete Multimédia monitorizar despesas diárias de técnicos externos, aquisições de hardware e consumo do orçamento aprovado.

---

## 1. O que foi Implementado

1. **DAO Financeiro (`src/models/Cost.js`)**:
   - Desenvolvido para gerir lançamentos e computar sumários financeiros consolidados em tempo real.
   - Cálculo automático de percentagens de execução e distribuição de despesas por categoria.

2. **Controlador REST (`src/controllers/costController.js`)**:
   - Endpoints `/api/v1/projects/:id/costs` para listagem e criação.
   - Endpoint `/api/v1/costs/:id` para cancelamento/remoção de lançamentos com resposta que já inclui o sumário recalculado para atualização direta da UI.

3. **Aba Financeira na Gestão de Loja (Aba 2)**:
   - Apresenta KPIs no topo da aba: Orçamento Global, Total Executado e Saldo Restante.
   - Barra de progresso orçamental reativa com código de cores e avisos de aproximação do teto orçamental.
   - Formulário de lançamento rápido e tabela de auditoria de despesas com badges coloridos por tipo de custo.

4. **Documentação Atualizada**:
   - Atualizados `MANUAL_UTILIZADOR_MODAIS.md` e `ARQUITETURA_TECNICA.md` com a especificação da nova aba e endpoints.

---

## 2. Validação e Testes Realizados

| Teste | Ação | Resultado |
| :--- | :--- | :--- |
| **Sumário de Custos** | `GET /api/v1/projects/1/costs` | Retornou orçamento de 25.000€, despesas semente e saldo restante |
| **Registar Nova Diária** | `POST /api/v1/projects/1/costs` | Lançou 450€ de "Diária Técnica - Alinhamento de LED Wall" com status 201 |
| **Recálculo do Saldo** | Verificação na UI do Modal | Saldo disponível deduzido imediatamente e barra de consumo atualizada |
| **Remoção de Despesa** | `DELETE /api/v1/costs/1` | Lançamento eliminado e totais recalculados com precisão |
