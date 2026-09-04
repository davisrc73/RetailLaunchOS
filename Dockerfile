# Dockerfile para RetailLaunchOS (Fnac/Darty - Gabinete Multimédia)
# Node.js 22 LTS Alpine com suporte nativo ao node:sqlite
FROM node:22-alpine

WORKDIR /app

# Instalar dependências se package.json existir
COPY package*.json ./
RUN npm install --omit=dev --ignore-scripts || true

# Copiar código da aplicação
COPY . .

# Expor a porta configurada
EXPOSE 3000

# Variáveis de ambiente padrão
ENV NODE_ENV=production
ENV PORT=3000

# Comando de arranque
CMD ["node", "server.js"]
