---
description: Regra de documentação contínua funcional e técnica para o RetailLaunchOS
globs: ["**/*"]
---

# Regra Operacional: Atualização Contínua de Documentação

Sempre que forem introduzidas alterações pertinentes, funcionais ou estruturais no desenvolvimento do **RetailLaunchOS**, o agente DEVE atualizar automaticamente os seguintes documentos:

1. **`MANUAL_UTILIZADOR_MODAIS.md`**:
   - Manter atualizado sempre que um novo modal, formulário, botão interativo, filtro ou funcionalidade de interface for adicionado ou alterado.
   - Descrever claramente os campos, opções, efeitos no sistema e passos para o utilizador.

2. **`ARQUITETURA_TECNICA.md`**:
   - Manter atualizado sempre que houver alterações estruturais:
     - Novas tabelas, colunas ou relações no esquema de base de dados (`database/schema.sql`).
     - Novos métodos de modelo (`src/models/`).
     - Novos endpoints REST ou controllers (`src/controllers/`, rotas).
     - Novas configurações de ambiente, scripts ou definições de Docker/Synology.

3. **Sincronização**:
   - Após grandes marcos ou alterações estruturais, assegurar que as alterações de código e documentação são registadas e sincronizadas com o repositório GitHub (`git commit` e `git push`).
