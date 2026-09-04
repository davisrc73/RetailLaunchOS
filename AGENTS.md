# Diretrizes do Projeto • RetailLaunchOS
## Gabinete Multimédia (Fnac / Darty)

### Regra Mandatória de Documentação Contínua
Sempre que for implementada qualquer atualização **estrutural** (base de dados, modelos, rotas, API, Docker) ou **funcional** (novos modais, formulários, filtros, botões ou telas):

1. **`MANUAL_UTILIZADOR_MODAIS.md`**: Atualizar a descrição dos fluxos, modais e campos com instruções práticas para os utilizadores do Gabinete Multimédia.
2. **`ARQUITETURA_TECNICA.md`**: Atualizar os diagramas relacionais, endpoints da API REST, métodos de modelo e configurações técnicas.
3. **`MANUAL_SYNOLOGY.md`**: Atualizar se houver novas variáveis de ambiente, portas ou dependências de contentor.
4. **Planos & Walkthroughs Versionados (`docs/`)**: Arquivar obrigatoriamente o plano de implementação em `docs/implementation_plans/FASE_X_PLANO.md` e o relatório de entrega em `docs/walkthroughs/FASE_X_WALKTHROUGH.md`, mantendo `docs/README.md` atualizado para auditabilidade e Disaster Recovery.
5. **Sincronização**: Manter o repositório sincronizado com o GitHub via commits semânticos e push regular.
