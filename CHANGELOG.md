# Changelog

Todas as mudanças relevantes deste projeto serão documentadas aqui.
O formato segue [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/) e o projeto adota [Versionamento Semântico](https://semver.org/lang/pt-BR/).

## [Unreleased]
### Added
- Licença MIT, Código de Conduta, Política de Segurança e templates de issue/PR.
- Dependabot para npm, GitHub Actions e Docker.
- Configuração Nginx para SPA com health check (`/healthz`), gzip e headers de segurança.
- `mobile/eas.json` com perfis `development`, `preview` (APK, API de homologação `https://api-hml.codenximpact.com.br`) e `production` (AAB).
- Workflow `android-apk.yml`: build EAS do perfil `preview` em tags `v*` ou manualmente e publicação de `BeesCaatinga.apk` na GitHub Release (`releases/latest/download/BeesCaatinga.apk`).
- `mobile/vercel.json` para deploy do app web na Vercel (`hml.codenximpact.com.br`), com rewrites de SPA, cache de assets e headers de segurança (CSP, HSTS etc.).
- `app.config.js` como fonte única de configuração do Expo (nome, scheme e package `br.com.codenexusimpact.beescaatinga`, chave do Google Maps e `EAS_PROJECT_ID` via ambiente).
- `mobile/.env.example`; scripts `typecheck` e `build:web`; `engines.node >= 20`.
- Tela de edição de colmeia acessível a partir da lista de apiários.

### Changed
- Pipeline de CI/CD reescrito para o frontend (lint, typecheck, build web e publicação da imagem no GHCR).
- `docker-compose.yml` passa a usar variáveis de ambiente e a imagem publicada do backend.
- Dockerfile com Node 22, `npm ci` e `EXPO_PUBLIC_API_URL` configurável no build.
- Autenticação usa o JWT real retornado por `POST /login`, enviado como `Authorization: Bearer` em todas as requisições; mensagens de erro 401 do backend exibidas no login.
- Cliente HTTP sem IP de rede local fixo: `EXPO_PUBLIC_API_URL` (fallback `localhost` apenas em desenvolvimento); sessão limpa somente em 401.
- Mocks substituídos por chamadas reais: edição de colmeia, edição de produção (apiários/colmeias reais), detalhes de lote e KPIs/gráficos de produção calculados a partir dos dados.
- Rastreabilidade lista lotes via `/lotes/{produtorId}/detalhado`; a tela de lote passa a ser somente leitura (a API não expõe edição/exclusão de lotes).

### Fixed
- Typecheck com 0 erros (`jsx: react-jsx`, import ausente em `useProducao`, campo `tipoInsumo`, assinatura de `atualizarVistoria`).
- Lint com 0 erros (regras do React Compiler: setState em effects, refs no render, memoização e componentes criados durante o render).
- Busca por id de produção/colmeia/lote usava rotas inexistentes no backend.
- Edição de insumo não carregava quando o usuário ainda não estava disponível.
- Cadastro de apiário pré-preenchia um endereço fictício.
- Upload de imagem usava URL base fixa (`192.168.18.5:3000`).

### Removed
- Workflows de backend (Maven) que não se aplicavam a este repositório.
- `app.json` (substituído por `app.config.js`), `.env.exemple` e a permissão `RECORD_AUDIO`.
- Logs de depuração com dados de login.
