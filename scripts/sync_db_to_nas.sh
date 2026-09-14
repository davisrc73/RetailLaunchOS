#!/usr/bin/env bash
# ==============================================================================
# RetailLaunchOS • Script de Migração da Base de Dados Local (Mac) para Synology NAS
# Gabinete Multimédia (Fnac / Darty)
# ==============================================================================

set -e

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$DIR"

echo "=========================================================="
echo "📦 RetailLaunchOS • Migração de Base de Dados (Mac ➔ NAS)"
echo "=========================================================="

DB_FILE="$DIR/database/retaillaunch.sqlite"

if [ ! -f "$DB_FILE" ]; then
  echo "❌ Ficheiro de base de dados não encontrado em: $DB_FILE"
  exit 1
fi

echo "1. A consolidar transações SQLite (WAL Checkpoint)..."
node -e "const db = require('./src/database/db'); db.checkpointWal(); console.log('✅ WAL consolidado!');"

FILE_SIZE=$(ls -lh "$DB_FILE" | awk '{print $5}')
echo "✅ Base de dados pronta: $DB_FILE ($FILE_SIZE)"
echo ""
echo "=========================================================="
echo "🚀 Opções de Envio para o Synology NAS:"
echo "=========================================================="
echo ""
echo "OPÇÃO A — VIA INTERFACE WEB (Recomendada • Zero Terminal):"
echo "  1. Abra o RetailLaunchOS no Mac: http://localhost:3000"
echo "  2. Aceda a Configurações ➔ Base de Dados & Migração e clique em 'Descarregar Backup'"
echo "  3. Abra o RetailLaunchOS no NAS: http://<IP_DO_NAS>:3000"
echo "  4. Aceda a Configurações ➔ Base de Dados & Migração"
echo "  5. Selecione o ficheiro descarregado e clique em 'Confirmar Restauro / Migração'"
echo ""
echo "OPÇÃO B — VIA SCP / DOCKER CP (Linha de Comandos):"
echo "  Substitua <NAS_USER> e <NAS_IP> pelos dados do seu Synology NAS:"
echo ""
echo "  # 1. Copiar ficheiro do Mac para a pasta do projeto no NAS:"
echo "  scp database/retaillaunch.sqlite <NAS_USER>@<NAS_IP>:/volume1/docker/retaillaunch/database/retaillaunch.sqlite"
echo ""
echo "  # 2. Copiar para dentro do volume Docker e reiniciar (se estiver a usar contentor):"
echo "  ssh <NAS_USER>@<NAS_IP> \"docker cp /volume1/docker/retaillaunch/database/retaillaunch.sqlite retaillaunch-app:/app/database/retaillaunch.sqlite && docker restart retaillaunch-app\""
echo ""
echo "=========================================================="
echo "💡 Nota de Persistência no NAS:"
echo "   Como 'database/*.sqlite*' está no .gitignore, futuros 'git pull' no NAS"
echo "   NUNCA irão apagar nem substituir os dados que estiverem no NAS!"
echo "=========================================================="
