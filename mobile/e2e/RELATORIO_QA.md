# Relatório de QA — Homologação BeesCaatinga

**Data:** 26/11/2026 · **Branch:** `claude/homologacao-producao` (frontend e backend)
**Resultado final:** ✅ **128 de 128 verificações aprovadas** no build de produção (`expo export`), sem erros de console nem requisições com falha além do 401 esperado no teste de senha errada.

## Ambiente de teste

| Item | Configuração |
|---|---|
| Banco | PostgreSQL 16 local (`bees_qa`), migrações Flyway aplicadas pelo backend |
| API | Jar Spring Boot, `SPRING_PROFILES_ACTIVE=prod`, `JWT_SECRET` de 32+ bytes, `CORS_ALLOWED_ORIGINS=http://localhost:8081` |
| Web | `EXPO_PUBLIC_API_URL=http://localhost:8080 npx expo export --platform web --clear`, servido em `:8081` com fallback SPA |
| Navegador | Chromium (Playwright), viewport de celular 390×844, escala 2, geolocalização simulada em Patos-PB (-7,0247; -37,2806) |
| Verificação | Após cada gravação, o teste consulta a API com o token JWT e compara **campo a campo** o valor persistido |

Script: [`e2e/run.js`](run.js) + [`e2e/10-dominio.js`](10-dominio.js) (`npm run e2e`). Capturas: [`e2e/screenshots/`](screenshots/).

## Resultado por tela

| Cenário | Verificações | Campos conferidos na API | Resultado |
|---|---|---|---|
| Cadastro de produtor | 6 | nomeCompleto, telefone (só dígitos), email, genero | ✅ |
| Login | 3 | mensagem do 401 exibida, saudação na home, JWT salvo | ✅ |
| Perfil (ver/editar) | 8 | nomeCompleto, genero, nomeDaEmpresa, telefone, endereco, email inalterado, home atualizada | ✅ |
| Apiário — criar | 15 | nome, nRegistro, dataDeCriacao, cep, rua, numero, bairro, cidade, estado, nomeDaPropriedade, complemento, observacoes, latitude/longitude | ✅ |
| Apiário — editar + dashboard | 7 | nome, cidade, observacoes (e campos não editados preservados) | ✅ |
| Colmeia — criar | 10 | identificador, tipo, ativa, statusColmeia, observacoes, detalhesDaLocalizacao, apiário, latitude/longitude | ✅ |
| Colmeia — editar/inativar/ativar | 7 | tipo, ativa=false → INATIVO, observacoes; reativação → SAUDAVEL | ✅ |
| Vistoria — criar (9 checkboxes) | 10 | dataVistoria, condicao, apiário, colmeia, 5 pragas, 4 perdas, situação da colmeia atualizada | ✅ |
| Vistoria — editar | 5 | dataVistoria, condicao, observacoes, pragas/perdas desmarcadas | ✅ |
| Insumo — criar/editar/excluir | 18 | dataEntrada, tipo, quantidade, unidadeMedida, dataValidade, observacoes, statusInsumo; exclusão → 404 | ✅ |
| Produção — criar/editar | 15 | tipoProducao, quantidade, unidadeMedida, dataColeta, apiário, colmeia; conversão kg→L na tela | ✅ |
| Lote / rastreabilidade | 10 | dataProducao, nomeApiario, tipoFlorada, tipoAbelha, vendido, latitude/longitude; listagem e detalhes | ✅ |
| Relatórios | 9 | 6 telas de relatório com dados; `POST /relatorios/{producao,vistorias,rastreabilidade}` = 200 | ✅ |
| Mapa | 2 | Leaflet renderizado com marcador do apiário | ✅ |
| Configurações / logout | 3 | redireciona ao login, token removido, rota protegida bloqueada | ✅ |

## Bugs encontrados e corrigidos

### Frontend
1. **`Alert.alert` não funciona na web** (react-native-web é no-op): erros, sucessos e confirmações (excluir, sair) eram ignorados no navegador → polyfill com `window.alert/confirm` (`utils/alertWeb.ts`).
2. **Perfil não salvava** ("em manutenção") → `PUT /produtores/{id}` implementado e contexto de autenticação atualizado.
3. **Telefone** enviado com máscara no cadastro → enviado só com dígitos.
4. **Apiário:** a edição era uma tela vazia → reaproveita o formulário de cadastro com `?id=`; "Usar localização atual" não fazia nada → captura latitude/longitude; observações e foto não eram enviadas; contadores de colmeias decorativos (não persistiam) removidos; endereço obrigatório validado; mensagem de erro do backend (ex.: 409 registro duplicado) exibida.
5. **Colmeia:** coordenadas fixas (-8/-36) → localização real; campo "Data de criação" inexistente no backend removido; dropdown "Ativo" ficava atrás da seção seguinte (z-index); item da lista não abria a edição.
6. **Vistoria:** contrato divergente do backend (`data`, `condicaoVistoria`, `pragas`, `perdas` → `dataVistoria`, `condicao`, `pragasIdentificadas`, `perdasIdentificadas`) em cadastro, edição, listagem, detalhe, tabela e dashboard; condição padrão em minúsculas (400); data sem máscara (400); edição com apiários/colmeias fictícios.
7. **Insumo:** payload com nomes errados (`dataInsumo`, `tipoInsumo` → 400) e unidades inválidas (`KG`, `UN` → enums do backend); "sem validade" enviava `"N/A"`.
8. **Produção:** conversão para litros fixa em "1,43 L"; colmeias exibidas como "Colmeia {id}"; data sem máscara na edição.
9. **Lote:** payload incompatível (`apiarioId` em vez de `nomeApiario`, enums em minúsculas, sem latitude/longitude) → todo cadastro falhava; campo "localidade" sem correspondência no backend substituído por geolocalização.
10. **Tabelas de produção e vistorias** usavam o **token JWT como id do produtor** (500).
11. **Layout no celular:** campos lado a lado (quantidade/unidade) se sobrepunham em 390px e bloqueavam o toque → empilham em telas estreitas.
12. **Mapa:** Leaflet carregado de CDN (falha sem internet/CSP) e sem marcadores → Leaflet empacotado e marcadores dos apiários com coordenadas.
13. `router.back()` sem histórico (link direto/recarga) gerava erro → `voltar()` com fallback; rótulos com "::" duplicado; ações dos cards sem rótulo acessível.

### Backend
1. `ApiarioCriadoDTO` sem `observacoes`/`caminhoDaFoto`; `ApiarioRetornoDTO` sem latitude/longitude.
2. Colmeia: `statusColmeia` sempre `null` (campo `situacao` nunca preenchido) → inativa = `INATIVO`, ativa sem vistoria = `SAUDAVEL`, e a vistoria atualiza a situação; retorno passou a incluir `id`, `apiarioId` e `ativa` (inclusive dentro do apiário).
3. Retornos sem dados necessários para edição: vistoria (`apiarioId`, `colmeiaId`), insumo (`dataValidade`), produção (`unidadeMedida`, `litros`, `apiarioId`, `colmeiaId`), lote detalhado (florada, abelha, vendido, coordenadas).
4. Lote buscava o apiário **apenas pelo nome em todo o banco** (podia vincular ao apiário de outro produtor ou falhar com nomes repetidos) → busca por nome **e** produtor.
5. Parâmetro de rota inválido retornava 500 → 400.

Testes do backend: `mvn test` com 151 testes aprovados (ajustados aos novos DTOs). Frontend: `npm run lint` com 0 erros e `npm run typecheck` com 0 erros.

## Pendências e observações
- **Fotos:** o upload genérico `/upload` usado pelo seletor de imagem não existe no backend (só `POST /produtores/{id}/foto`); fotos de apiário/colmeia não foram testadas. Recomenda-se um endpoint de upload genérico.
- **Lotes** não têm edição/exclusão na API (tela de detalhes é somente leitura, por decisão de rastreabilidade).
- **Relatórios do backend** (`/relatorios/*`) funcionam, mas as telas usam as listagens e calculam no cliente; o relatório de insumos está desabilitado no backend.
- **Notificações, tutorial, sincronização e tema** (Configurações) são apenas visuais.
- Os tiles do OpenStreetMap não carregam no ambiente de teste (sem internet); o mapa e os marcadores renderizam normalmente.
- **Cache do Metro:** ao trocar `EXPO_PUBLIC_API_URL` localmente, gere o build com `--clear` (na Vercel o build é sempre limpo).
- Produção web na Vercel depende do backend hospedado em `https://beescaatinga-api-hml.onrender.com` (ainda não publicado).
