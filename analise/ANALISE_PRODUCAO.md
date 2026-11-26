# BeesCaatinga — Análise de prontidão para Homologação/Produção

Data: 2026-11-26 · Escopo: `CodeNexusImpact/BeesCaatinga-FrontEnd` (branch `main`)

> **Bloqueio principal:** o repositório `CodeNexusImpact/BeesCaatinga-BackEnd` **não está acessível** para esta sessão (privado ou nome diferente). Sem ele não é possível validar/corrigir o backend nem subir o sistema completo. Ver seção 5.

## 1. Visão geral
| Item | Situação |
|---|---|
| Stack | Expo 57 / React Native 0.86 / Expo Router / TypeScript (~14 mil linhas) |
| Web | `expo export --platform web` servido por Nginx (Docker) |
| Backend esperado | Spring Boot (Java 21) + PostgreSQL, porta 8080 (outro repo) |
| Mock | `mock-api/` com json-server (porta 3000) |
| Domínio | Não encontrado nos repositórios (sem `CNAME`). **Informar o domínio** para configurar `app.` e `api.` |

## 2. Problemas encontrados (prioridade)

### 🔴 Críticos (bloqueiam produção)
1. **CI/CD quebrado** — os 3 workflows referenciam `./backend` e `mvnw`, que não existem neste repo. Todo push em `main` falha.
2. **`docker-compose.yml` aponta para `./backend`** (inexistente) e contém **credenciais fixas** (`erick / 12345678`).
3. **Autenticação sem JWT** — interceptor de requisição comentado; nenhuma rota envia token.
4. **Sessão apagada em qualquer 404** — o interceptor faz logout em 401 **e 404** (um recurso inexistente desloga o usuário).
5. **IPs de rede local fixos** — `services/api.ts` (`192.168.0.8:8080`) e `imagemPicker.tsx` (`192.168.18.5:3000`).
6. **Telas ainda com dados mockados** — `apiario/colmeia/editar.tsx`, `rastreabilidade/editar.tsx`, `hooks/useProducao.ts` (`produtorId = 1` fixo, KPIs e gráficos mockados), `producao/editar.tsx` (apiário fixo `'1'`).
7. **Risco de IDOR no contrato da API** — todas as rotas recebem `produtorId` pela URL. O backend **precisa** validar que o `produtorId` pertence ao usuário do token.

### 🟠 Importantes
8. `app.json`: `googleMaps.apiKey` é a *string literal* `"process.env.GOOGLE_MAPS_API_KEY"`; pacote `com.anonymous.mobile`; permissão `RECORD_AUDIO` duplicada e desnecessária.
9. Nginx sem fallback de rotas (refresh em rota interna → 404), sem gzip/cache/headers de segurança, sem healthcheck.
10. Dockerfile usa `npm install` (não determinístico) e Node 20; `EXPO_PUBLIC_API_URL` não é injetado no build.
11. Sem testes automatizados reais (apenas scripts JS soltos na raiz).

### 🟡 Padrão open source
12. Faltam `LICENSE`, `CODE_OF_CONDUCT.md`, `SECURITY.md`, `CHANGELOG.md`, templates de issue/PR e Dependabot.
13. `.idea/`, `.expo/` versionados; `.env.exemple` com nome errado.

## 3. O que foi corrigido nesta sessão
Ver `analise/CHECKLIST_HOMOLOGACAO.md` (itens marcados) e o resumo no final do PR/commit.

## 4. Contrato de API consumido pelo frontend
O backend deve expor (base `EXPO_PUBLIC_API_URL`):
```
POST /login                       POST /produtores   GET|PUT|DELETE /produtores/{id}
GET|POST /apiarios/{produtorId}   PUT|DELETE /apiarios/{apiarioId}/produtor/{produtorId}
PUT /apiarios/{apiarioId}/localizacao   GET /apiarios/localizacoes/{produtorId}
GET /colmeias/{id}  GET /colmeias/produtor/{produtorId}
GET|POST /colmeias/produtor/{p}/apiario/{a}   GET .../ativas   GET .../inativas
PUT|DELETE /colmeias/produtor/{p}/apiario/{a}/colmeia/{c}
GET|POST /insumos/{produtorId}    GET|PUT|DELETE /insumos/{insumoId}/produtor/{produtorId}
GET|POST /producoes/{produtorId}  GET /producoes/{producaoId}  PUT|DELETE /producoes/{id}/produtor/{produtorId}
GET|POST /lotes/{produtorId}      GET /lotes/{produtorId}/detalhado
vistorias: GET|POST /{produtorId}, PUT|DELETE /{vistoriaId}/produtor/{produtorId}, POST /produtor/{p}/apiario/{a}/colmeia/{c}
GET /vistorias/localizacoes/{produtorId}   GET /propriedades/localizacoes/{produtorId}
POST /relatorios/producao | /relatorios/rastreabilidade | /relatorios/vistorias
POST /upload
```
Requisitos para o backend em produção: JWT no `/login` (retornar `token`), CORS para `https://app.<dominio>`, `/actuator/health`, Flyway/Liquibase para migrações, profile `prod` lendo tudo de variáveis de ambiente.

## 5. Próximos passos (ordem)
1. **Dar acesso ao backend**: instalar o GitHub App do Claude na organização (inclui permissão de push — hoje o push neste repo também é recusado) ou confirmar o nome do repo.
2. Informar o **domínio** e ter uma VPS (2 vCPU / 4 GB) com Docker.
3. Backend: JWT + validação de dono (IDOR), CORS, actuator, migrações, imagem no GHCR.
4. Frontend: substituir os mocks listados no item 6 pelas chamadas reais.
5. Subir a stack de `beescaatinga-integrado/` em homologação (`hml.`) → testes de aceite → produção.
