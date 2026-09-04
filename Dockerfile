# Dockerfile para RetailLaunchOS (Fnac/Darty - Gabinete Multimédia)
FROM node:20-alpine

# Definir diretório de trabalho
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
