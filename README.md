# BeesCaatinga — Frontend

[![CI/CD](https://github.com/CodeNexusImpact/BeesCaatinga-FrontEnd/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/CodeNexusImpact/BeesCaatinga-FrontEnd/actions/workflows/ci-cd.yml)
[![Licença: MIT](https://img.shields.io/badge/licen%C3%A7a-MIT-green.svg)](LICENSE)

O **BeesCaatinga** é um projeto iniciado em parceria com a **FAPESQ** para apoiar produtores familiares de mel do interior da Paraíba: gestão de apiários, colmeias, vistorias, insumos, produção e rastreabilidade de lotes.

> Este repositório contém o **Front-End** (React Native + Expo, mobile e web). O Back-End (Spring Boot) está em [CodeNexusImpact/BeesCaatinga-BackEnd](https://github.com/CodeNexusImpact/BeesCaatinga-BackEnd).

## Stack
React Native, Expo (Expo Router), Axios, React Native Maps, Recharts/Victory. Web servido por Nginx em Docker.

## Desenvolvimento
Pré-requisitos: Node.js 22+ e npm.

```bash
cd mobile
cp .env.exemple .env        # defina EXPO_PUBLIC_API_URL
npm ci
npm start                   # Expo (web: tecla w, celular: Expo Go)
```

Scripts úteis (em `mobile/`): `npm run lint`, `npm run typecheck`, `npm run build:web`.

Sem backend? Use a API mock em [`mock-api/`](mock-api/README.md) (`npm start`, porta 3000).

## Docker (ambiente local completo)
```bash
cp .env.example .env
docker compose up --build
```
Frontend: http://localhost:8081 · Backend: http://localhost:8080 · Postgres: 5432.

## Deploy / homologação
- Cada push na `main` publica a imagem `ghcr.io/codenexusimpact/beescaatinga-frontend` (tags `latest` e SHA).
- Configure a variável de repositório `EXPO_PUBLIC_API_URL` (ex.: `https://api.seudominio`) em **Settings → Secrets and variables → Actions → Variables**.
- O stack de produção (Caddy + HTTPS, frontend, backend, Postgres) e o passo a passo de homologação ficam no repositório/pasta **beescaatinga-integrado**.

## Contribuindo
Leia o [CONTRIBUTING.md](CONTRIBUTING.md) e o [Código de Conduta](CODE_OF_CONDUCT.md). Vulnerabilidades: veja [SECURITY.md](SECURITY.md).

## Licença
[MIT](LICENSE) © 2026 Code Nexus Impact
