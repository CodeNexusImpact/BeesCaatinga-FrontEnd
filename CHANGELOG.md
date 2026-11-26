# Changelog

Todas as mudanças relevantes deste projeto serão documentadas aqui.
O formato segue [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/) e o projeto adota [Versionamento Semântico](https://semver.org/lang/pt-BR/).

## [Unreleased]
### Added
- Licença MIT, Código de Conduta, Política de Segurança e templates de issue/PR.
- Dependabot para npm, GitHub Actions e Docker.
- Configuração Nginx para SPA com health check (`/healthz`), gzip e headers de segurança.

### Changed
- Pipeline de CI/CD reescrito para o frontend (lint, typecheck, build web e publicação da imagem no GHCR).
- `docker-compose.yml` passa a usar variáveis de ambiente e a imagem publicada do backend.
- Dockerfile com Node 22, `npm ci` e `EXPO_PUBLIC_API_URL` configurável no build.

### Removed
- Workflows de backend (Maven) que não se aplicavam a este repositório.
