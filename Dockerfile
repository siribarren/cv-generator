FROM node:18-bullseye AS build-frontend
WORKDIR /app/frontend
COPY frontend/package.json frontend/package-lock.json* ./
RUN npm install
COPY frontend .
RUN npm run build

FROM node:18-bullseye
WORKDIR /app/backend
COPY backend/package.json backend/package-lock.json* ./
RUN npm install
COPY backend .
COPY cv_sermaluc.html /app/
RUN mkdir -p public
COPY --from=build-frontend /app/frontend/dist ./public

ENV PORT=8080
EXPOSE 8080
CMD ["node", "index.js"]
