FROM node:18-bullseye AS build-frontend
WORKDIR /app
COPY frontend ./frontend
WORKDIR /app/frontend
RUN npm install && npm run build

FROM node:18-bullseye
WORKDIR /app
COPY backend ./backend
COPY cv_sermaluc.html ./
WORKDIR /app/backend
RUN npm install
RUN mkdir -p public
COPY --from=build-frontend /app/frontend/dist ./public
ENV PORT=8080
EXPOSE 8080
CMD ["node", "index.js"]
