# Changelog

Todas as mudanças relevantes deste projeto serão documentadas aqui.
O formato segue [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/) e o projeto adota [Versionamento Semântico](https://semver.org/lang/pt-BR/).

## [Unreleased]
### Added
- Componentes compartilhados `Tabela` (cartões no celular, zebra, ordenação, paginação, formatação pt-BR, kg+L), `Filtros`, `TelaRelatorio`, `TelaLista` e `TelaAuth`; matriz visual automática (`npm run e2e:visual`, 48 rotas × 4 tamanhos).
- Tema escuro e tamanho do texto aplicados no app inteiro; fotos (`POST /upload`) em perfil, apiário, colmeia e vistoria; lote com várias colmeias, edição e exclusão; vistoria com localização.
- **Exportar PDF** dos relatórios de produção, vistorias e rastreabilidade (`POST /relatorios/{tipo}/pdf`): download por link na web e compartilhamento (expo-file-system + expo-sharing) no celular.
- **Integrações / Webhooks** em Configurações: listar, criar (URL + eventos, segredo exibido uma única vez com botão copiar), ativar/desativar, testar, excluir e ver as últimas entregas.
- **Mapa** (`/mapa`): camadas de apiários, vistorias e propriedades (`/…/localizacoes/{produtorId}`), definição da localização do apiário por toque/clique no mapa, GPS ou digitação, com validação de faixa (latitude −90..90, longitude −180..180) e `PUT /apiarios/{id}/localizacao`.
- Seletor de localização reutilizável (mapa + GPS + campos) no cadastro/edição de apiário e no lote.
- **Lote vinculado** ao apiário (`apiarioId`) e à colmeia de origem (`colmeiaId`) escolhidos entre os dados reais; detalhe do lote mostra a cadeia apiário → colmeia → vistorias → produções.
- **Conversão kg ↔ litros** do mel (`utils/mel.ts`, densidade padrão 1,42 kg/L configurável em Configurações e sincronizada com `densidadeMel` do produtor); campos de quantidade aceitam kg OU litros e exibem "12,50 kg (8,80 L)" em listas, relatórios e gráficos.
- **Sugestões inteligentes** enquanto digita (`GET /sugestoes` + histórico local) em cidade, bairro, estado, propriedade, tipo de mel, nome e observações de insumo; seletores lembram a última escolha.
- **Modo offline**: cadastros/edições sem internet vão para uma fila local com UUID, aparecem como "pendente de envio" e são sincronizados em ordem de dependência (apiário → colmeia → vistoria/produção → lote) com `Idempotency-Key`; faixa "Sincronizar (N pendentes)", tela "Envios Pendentes" com erro por item; listas em cache para leitura offline.
- Tela **Avisos** calculada a partir dos dados reais (insumos vencidos/vencendo, estoque baixo, colmeias que precisam de atenção ou sem vistoria).
- Guia **Como Usar** em passos; tela inicial com cartões numerados na ordem do trabalho no campo.
- Exportação de planilhas CSV reais (antes apenas `console.log`/alerta).
- E2E contra o link público (padrão `BASE_URL=https://beescaatinga-hml.vercel.app`): lote vinculado, dashboards, mapa, PDF (%PDF), webhooks, sessão, offline/sincronização e idempotência; capturas antes/depois.

### Changed
- Dashboards de apiários, colmeias, produção, vistorias, insumos e lotes reescritos: indicadores e gráficos calculados dos dados reais, gráficos em View (sem SVG; sem erros no navegador), estados de carregamento/erro/vazio com botão "Cadastrar primeiro…".
- Identidade visual com contraste AA (texto marrom sobre amarelo-mel, branco sobre marrom), fonte base 17, áreas de toque ≥ 48 px, rótulos acima dos campos, dicas e erros junto ao campo, botões e campos com `accessibilityLabel`/`role`, cabeçalho com "Voltar" e título em todas as telas, menu inferior Início/Apiários/Mapa/Relatórios/Sair.
- Telas de módulo com uma ação principal e demais opções em linhas grandes com ícone + texto; termos padronizados ("Resumo" em vez de "Dashboard", títulos em Title Case).
- Leaflet reescrito: o mapa é criado uma vez e os marcadores atualizados sem perder o zoom; tiles em `tile.openstreetmap.org`.

### Removed
- Dados fictícios: dashboard de rastreabilidade (`MASTER_DATA`), tabela de colmeias mock, notificações fixas, anos/meses fixos nos filtros, KPI de "conformidade" aleatório.

### Fixed
- Login/cadastro: faixa do logo cobria o primeiro campo; filtros de vistorias estouravam a largura e não filtravam; "Recuperar senha" simulava sucesso sem API.
- Vercel: 404 em rotas sem arquivo (SPA) e CSP bloqueando `blob:` no envio de fotos.
- Relatório de colmeias usava campos inexistentes (`apiarioNome`, `tipoColmeia`, `dataCriacao`).
- Seletor exibia "Selecione uma opção" para a opção "Todos" e as setas não apareciam (ícones `setaBaixo`/`setaCima` ausentes).
- Listagens de produção/vistorias/insumos escondiam erros de rede (retornavam lista vazia).
- Tabela de rastreabilidade mostrava quantidade 0 e status errado (assinatura de `render`).

## [Anterior]
### Added
- Testes E2E com Playwright (`npm run e2e`, `mobile/e2e/`): 128 verificações pela UI com conferência campo a campo na API; relatório `mobile/e2e/RELATORIO_QA.md` e capturas de tela.
- Edição de perfil e de apiário funcionais; geolocalização real em apiário, colmeia e lote; marcadores de apiários no mapa.
- Polyfill de `Alert.alert` para a web (alertas e confirmações antes ignorados no navegador).
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
- Contratos de vistoria, insumo e lote alinhados aos DTOs do backend (cadastros falhavam com 400).
- Tabelas de produção e vistorias usavam o token JWT como id do produtor.
- Conversão kg→L fixa, data sem máscara, campos sobrepostos em telas de celular, dropdown atrás de outras seções.
- Leaflet empacotado (sem CDN) e navegação "voltar" segura sem histórico.
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
