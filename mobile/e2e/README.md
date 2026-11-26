# E2E BeesCaatinga (Playwright)

Testa o app web pela interface real e confere, via API, cada campo salvo.

Requisito: Playwright com Chromium (não é dependência do app, para manter o `npm ci` leve):
`npm i --no-save playwright && npx playwright install chromium`.

```bash
# 1) API local (Postgres + backend) em http://localhost:8080
# 2) Build web apontando para a API local e servidor estático na porta 8081
EXPO_PUBLIC_API_URL=http://localhost:8080 npx expo export --platform web --clear
npx serve -s dist -l 8081
# 3) Executar (Chromium do Playwright)
npm run e2e
# Seções específicas (cadastro e login sempre rodam):
E2E_SECOES=apiario,colmeia npm run e2e
```

Variáveis: `E2E_WEB_URL` (padrão `http://localhost:8081`) e `E2E_API_URL` (padrão `http://localhost:8080`).
Saídas: `e2e/resultado.json` (não versionado) e capturas em `e2e/screenshots/` (390×844, escala 2).
O relatório da rodada de homologação está em [`RELATORIO_QA.md`](RELATORIO_QA.md).
