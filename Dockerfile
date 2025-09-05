# Dockerfile para API de Ecommerce - Backend2Coder

# Usar imagen oficial de Node.js LTS (Long Term Support)
FROM node:18-alpine

# Instalar herramientas necesarias
RUN apk add --no-cache curl

# Establecer directorio de trabajo
WORKDIR /usr/src/app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm ci --only=production && npm cache clean --force

# Crear usuario no-root para seguridad
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Copiar código fuente
COPY . .

# Cambiar ownership de los archivos al usuario nodejs
RUN chown -R nodejs:nodejs /usr/src/app

# Cambiar a usuario no-root
USER nodejs

# Exponer puerto
EXPOSE 8080

# Variables de entorno por defecto
ENV NODE_ENV=production
ENV PORT=8080

# Comando de salud para verificar que el contenedor está funcionando
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8080/ || exit 1

# Comando para ejecutar la aplicación
CMD ["npm", "start"]
