# Checklist de Homologação — BeesCaatinga

## Frontend (este repo)
- [x] URL da API via `EXPO_PUBLIC_API_URL` (sem IP fixo)
- [x] Interceptor envia `Authorization: Bearer <token>`; logout só em 401
- [x] Configuração Expo via `app.config.js` (nome, bundle id, chave do Google Maps por env)
- [x] Scripts `lint`, `typecheck`, `build:web`
- [x] Dockerfile determinístico (`npm ci`, Node 22) + Nginx com fallback SPA, gzip, cache, headers, `/healthz`
- [x] CI: lint + typecheck + build web; publicação da imagem no GHCR em `main`
- [x] Dependabot, templates de issue/PR, LICENSE (MIT), CODE_OF_CONDUCT, SECURITY, CHANGELOG
- [ ] Remover dados mockados (colmeia/editar, rastreabilidade/editar, useProducao, producao/editar)
- [ ] Testes (Jest + @testing-library/react-native) nos services e hooks
- [ ] Build Android/iOS com EAS (`eas.json`) para distribuição

## Backend (`BeesCaatinga-BackEnd`, branch `claude/homologacao-producao`)
- [x] JWT no `/login` e filtro de autenticação
- [x] Validar posse do `produtorId` (IDOR) — falta: `/vistorias/colmeia/{id}`, `/relatorios/*` e posse de apiarioId/colmeiaId
- [x] CORS restrito a `https://app.<dominio>` / `https://hml.<dominio>`
- [x] `/actuator/health`, SLF4J, Flyway (seed só em dev), BCrypt
- [ ] Imagem publicada em `ghcr.io/codenexusimpact/beescaatinga-backend`

## Infra (`deploy/` no repo BackEnd)
- [ ] DNS: `A app.<dominio>` e `A api.<dominio>` → IP da VPS
- [ ] `.env` preenchido (senhas fortes, `JWT_SECRET` ≥ 32 bytes)
- [ ] `./scripts/deploy.sh` e healthchecks verdes
- [ ] Backup diário (`scripts/backup-db.sh` no cron) testado com restore
- [ ] Teste de aceite: cadastro → login → apiário → colmeia → vistoria → produção → lote → relatório
- [ ] E-mail único no cadastro de produtor (constraint + validação)
