# syntax=docker/dockerfile:1
# ---- Build stage ----
FROM node:22-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

COPY . .

# URL da API embutida no bundle web em tempo de build
ARG EXPO_PUBLIC_API_URL=http://localhost:8080
ENV EXPO_PUBLIC_API_URL=${EXPO_PUBLIC_API_URL}

RUN npx expo export --platform web

# ---- Serve stage (nginx sem root, porta 8080) ----
FROM nginxinc/nginx-unprivileged:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD wget -qO- http://127.0.0.1:8080/healthz || exit 1
