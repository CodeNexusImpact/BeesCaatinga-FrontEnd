# E2E BeesCaatinga (Playwright)

Testa o app web pela interface real e confere, via API, cada campo salvo.
Por padrão roda contra o **link público de homologação**:
`BASE_URL=https://beescaatinga-hml.vercel.app` e `API_URL=https://beescaatinga-api-hml.onrender.com`.

Requisito: Playwright com Chromium (não é dependência do app, para manter o `npm ci` leve):
`npm i --no-save playwright && npx playwright install chromium`.

```bash
# Link público (padrão). Conta nova criada a cada execução.
npm run e2e
# Seções específicas (cadastro e login sempre rodam):
E2E_SECOES=apiario,colmeia npm run e2e
# Build local apontando para a API pública (o CORS só libera a Vercel, então use a ponte):
EXPO_PUBLIC_API_URL=https://beescaatinga-api-hml.onrender.com npx expo export --platform web
# sirva dist/ com fallback de SPA na porta 8081 e:
E2E_PONTE_API=1 BASE_URL=http://localhost:8081 npm run e2e
# Capturas antes/depois das telas principais (conta com dados semeados pela API):
npm run e2e:capturas -- depois
```

Seções: cadastro, login, perfil, apiário (mapa/GPS/validação), colmeia, vistoria, insumo, produção (kg ↔ L),
lote vinculado, dashboards, mapa, relatórios (JSON + PDF `%PDF`), webhooks, sessão e offline (fila + sincronização + idempotência).

Saídas: `e2e/resultado.json` (não versionado), capturas em `e2e/screenshots/` (390×844, escala 2) e PDFs baixados.
O relatório da rodada está em [`RELATORIO_QA.md`](RELATORIO_QA.md).
`NODE_USE_ENV_PROXY=1` (já no script) faz o `fetch` do Node respeitar `HTTPS_PROXY`; o Chromium também usa o proxy quando definido.
