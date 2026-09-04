#!/bin/bash
# ==============================================================================
# Script de Sincronização Rápida com o GitHub
# RetailLaunchOS • Gabinete Multimédia (Fnac / Darty)
# ==============================================================================

COMMIT_MSG="${1:-Atualização RetailLaunchOS $(date +'%Y-%m-%d %H:%M')}"

echo "🚀 A sincronizar RetailLaunchOS com o GitHub..."

# Verificar se existe repositório remoto configurado
if ! git remote | grep -q "origin"; then
  echo "⚠️ Remote 'origin' não configurado."
  echo "👉 Executa primeiro:"
  echo "   git remote add origin git@github.com:davisrc73/RetailLaunchOS.git"
  exit 1
fi

git add .
git commit -m "$COMMIT_MSG"
git push origin main

echo "✅ Sincronização concluída com sucesso no GitHub!"
echo "🔄 No Synology NAS, os novos ficheiros podem ser atualizados com 'git pull origin main'."
