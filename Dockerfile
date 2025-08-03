# ---- Etapa 1: Build del frontend ----
FROM node:18-bullseye AS build-frontend
WORKDIR /app

# Copiar frontend y construir
COPY frontend ./frontend
WORKDIR /app/frontend
RUN npm install && npm run build

# ---- Etapa 2: Backend para producción ----
FROM node:18-bullseye
WORKDIR /app

# 1️⃣ Copiar package.json para instalación rápida de dependencias
COPY backend/package*.json ./backend/
WORKDIR /app/backend
RUN npm install --production

# 2️⃣ Copiar backend completo
COPY backend/ .

# 3️⃣ Copiar el archivo de plantilla al contenedor
COPY cv_sermaluc.html /app/backend/

# 4️⃣ Copiar frontend compilado al backend/public
RUN mkdir -p public
COPY --from=build-frontend /app/frontend/dist ./public

# 5️⃣ Crear carpeta temporal para Cloud Run
RUN mkdir -p /tmp

# Variables de entorno
ENV NODE_ENV=production
ENV PORT=8080

# Exponer el puerto para Cloud Run
EXPOSE 8080

# Comando de inicio
CMD ["node", "index.js"]
