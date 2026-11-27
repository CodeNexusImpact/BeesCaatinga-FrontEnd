# Relatório de QA — Homologação BeesCaatinga

## Rodada 3 (27/11/2026) — revisão visual e novos contratos
**Link público:** https://beescaatinga-hml.vercel.app · **API:** https://beescaatinga-api-hml.onrender.com
**E2E funcional:** ✅ 195/195 verificações (conta nova, link público; único erro de console: o 401 esperado da senha errada) · **Matriz visual:** ✅ 192/192 (48 rotas × 4 tamanhos)

### Problemas relatados pelo usuário e correção
| # | Problema | Correção |
|---|---|---|
| A | Login: faixa amarela com o logo cobria o 1º campo; cartão mal montado | `TelaAuth` única para login, cadastro e recuperar senha: logo em faixa no celular e em coluna no tablet/computador, sem margem negativa nem altura fixa; rótulos acima dos campos, dicas e erros junto ao campo. A tela "Recuperar senha" dizia "senha redefinida" sem chamar a API — agora explica que a recuperação ainda não existe (pendência de backend). |
| B | Vistorias: filtros Mês/Ano estouravam a largura (Ano cortado) — e não filtravam nada | `Filtros` compartilhado (quebra de linha automática, 1 coluna no celular); filtros de mês/ano passaram a filtrar de verdade. |
| C | Tabelas sem padrão | `Tabela` única (cabeçalho mel, linhas zebradas, ordenação, datas dd/mm/aaaa, números com vírgula, "kg (L)", estado vazio com botão, rolagem lateral só dentro do contêiner, **cartões no celular**, "Mostrar mais" a cada 25 linhas) usada em todos os relatórios (`TelaRelatorio`) e listagens (`TelaLista`): apiários, colmeias, vistorias, insumos, produção e lotes. CSV exporta com a mesma formatação. |
| D | Qualidade visual desigual | Mesma moldura em todas as telas (cabeçalho com Voltar, cartões brancos com borda suave, espaçamento 16, campos de 48 px); matriz visual automática (abaixo). |
| E | Tema escuro e tamanho do texto não faziam nada; tiles do mapa | Preferências lidas na inicialização (`index.js` → `tema/aplicar.ts`): tokens de cor e tamanhos de fonte valem para o app inteiro (web aplica na hora; celular ao reabrir). Web passou a SPA (`output: single`) para não haver conflito de hidratação. CSP com `https://tile.openstreetmap.org` e `https://*.tile.openstreetmap.org`; atribuição "© OpenStreetMap" com link. |
| F | Contrato novo do backend | Fotos via `POST /upload` (campo `file`) em perfil, apiário, colmeia e vistoria, exibidas por `GET /arquivos/{id}`; lote com **várias colmeias** (`colmeiaIds`), **editar** (`PUT /lotes/{p}/{id}`) e **excluir** (`DELETE`, com confirmação); vistoria com latitude/longitude (GPS/mapa) e foto. |

### Matriz visual (tema claro)
Script `npm run e2e:visual` (`e2e/matriz-visual.js`): conta nova com dados semeados pela API, **todas as 48 rotas** × 360×740, 390×844, 768×1024 e 1366×768. Em cada combinação verifica: rolagem horizontal da página (`scrollWidth > innerWidth`), botões/campos cortados fora da tela (fora de contêineres com rolagem própria), campos sobrepostos e campo coberto por outro elemento (`elementFromPoint`). Capturas em `e2e/screenshots/matriz/<tamanho>/`.

**Resultado: 192 de 192 combinações sem problemas** no link público (após as correções A–D; na 1ª rodada local o detector só acusou falsos positivos do menu fixo, depois tratados).

<details><summary>Matriz completa</summary>

| Rota | 360x740 | 390x844 | 768x1024 | 1366x768 |
|---|---|---|---|---|
| `/login` | ✅ | ✅ | ✅ | ✅ |
| `/cadastro` | ✅ | ✅ | ✅ | ✅ |
| `/redefinirSenha` | ✅ | ✅ | ✅ | ✅ |
| `/` | ✅ | ✅ | ✅ | ✅ |
| `/apiario` | ✅ | ✅ | ✅ | ✅ |
| `/apiario/listar` | ✅ | ✅ | ✅ | ✅ |
| `/apiario/cadastrar` | ✅ | ✅ | ✅ | ✅ |
| `/apiario/editar` | ✅ | ✅ | ✅ | ✅ |
| `/apiario/colmeia/cadastrar` | ✅ | ✅ | ✅ | ✅ |
| `/apiario/colmeia/editar` | ✅ | ✅ | ✅ | ✅ |
| `/apiario/dashboardApiario` | ✅ | ✅ | ✅ | ✅ |
| `/apiario/dashboardColmeia` | ✅ | ✅ | ✅ | ✅ |
| `/apiario/tabelaApiario` | ✅ | ✅ | ✅ | ✅ |
| `/apiario/tabelaColmeia` | ✅ | ✅ | ✅ | ✅ |
| `/vistorias` | ✅ | ✅ | ✅ | ✅ |
| `/vistorias/cadastrar` | ✅ | ✅ | ✅ | ✅ |
| `/vistorias/listar` | ✅ | ✅ | ✅ | ✅ |
| `/vistorias/58` | ✅ | ✅ | ✅ | ✅ |
| `/vistorias/editar` | ✅ | ✅ | ✅ | ✅ |
| `/vistorias/dashboard` | ✅ | ✅ | ✅ | ✅ |
| `/vistorias/tabela` | ✅ | ✅ | ✅ | ✅ |
| `/producao` | ✅ | ✅ | ✅ | ✅ |
| `/producao/cadastrar` | ✅ | ✅ | ✅ | ✅ |
| `/producao/listar` | ✅ | ✅ | ✅ | ✅ |
| `/producao/editar` | ✅ | ✅ | ✅ | ✅ |
| `/producao/dashboard` | ✅ | ✅ | ✅ | ✅ |
| `/producao/tabela` | ✅ | ✅ | ✅ | ✅ |
| `/insumos` | ✅ | ✅ | ✅ | ✅ |
| `/insumos/cadastrar` | ✅ | ✅ | ✅ | ✅ |
| `/insumos/listar` | ✅ | ✅ | ✅ | ✅ |
| `/insumos/63` | ✅ | ✅ | ✅ | ✅ |
| `/insumos/editar` | ✅ | ✅ | ✅ | ✅ |
| `/insumos/dashboard` | ✅ | ✅ | ✅ | ✅ |
| `/insumos/tabela` | ✅ | ✅ | ✅ | ✅ |
| `/rastreabilidade` | ✅ | ✅ | ✅ | ✅ |
| `/rastreabilidade/cadastrar` | ✅ | ✅ | ✅ | ✅ |
| `/rastreabilidade/listar` | ✅ | ✅ | ✅ | ✅ |
| `/rastreabilidade/editar` | ✅ | ✅ | ✅ | ✅ |
| `/rastreabilidade/dashboard` | ✅ | ✅ | ✅ | ✅ |
| `/rastreabilidade/tabela` | ✅ | ✅ | ✅ | ✅ |
| `/relatorio` | ✅ | ✅ | ✅ | ✅ |
| `/mapa` | ✅ | ✅ | ✅ | ✅ |
| `/notificacao` | ✅ | ✅ | ✅ | ✅ |
| `/perfil` | ✅ | ✅ | ✅ | ✅ |
| `/configuracao` | ✅ | ✅ | ✅ | ✅ |
| `/configuracao/webhooks` | ✅ | ✅ | ✅ | ✅ |
| `/sincronizacao` | ✅ | ✅ | ✅ | ✅ |
| `/tutorial` | ✅ | ✅ | ✅ | ✅ |

</details>

### Bug encontrado só no link público e corrigido
- **Envio de foto bloqueado pela CSP** da Vercel: o app lê a imagem escolhida (`blob:`) com `fetch` antes do `POST /upload` e a política `connect-src` não permitia `blob:` ("Refused to connect to blob:…"). Corrigido em `vercel.json`; e2e público passou a 195/195.

### Pendências
- **Recuperação de senha**: não há endpoint no backend (a tela agora informa isso em vez de simular sucesso).
- **Tema/tamanho do texto no celular** valem ao reabrir o app (na web, na hora). Cores fixas escritas direto em alguns estilos inline antigos podem não seguir o tema escuro.
- **Tiles do OSM** não carregam no ambiente de teste (proxy de saída); CSP e atribuição conferidas.

### Novas verificações no e2e
- Perfil: foto enviada pela tela (`POST /upload` = 201), `caminhoDaFoto = /arquivos/{id}` e `GET /arquivos/{id}` público devolve `image/jpeg`.
- Vistoria: latitude/longitude gravadas pelo botão "Usar minha localização atual".
- Lote: `colmeias[]` na resposta; edição carrega quantidade e colmeias; `PUT` altera quantidade e "vendido" mantendo as colmeias; exclusão pela tela → `GET` 404.


## Rodada 2 (27/11/2026) — link público
**Web:** https://beescaatinga-hml.vercel.app (Vercel, build da branch `claude/homologacao-producao`) · **API:** https://beescaatinga-api-hml.onrender.com (Render, plano gratuito)
**Resultado final:** ✅ **183 de 183 verificações aprovadas** no link público, conta nova, sem erros de console nem requisições com falha além do 401 esperado no teste de senha errada.

### Como foi testado
- `npm run e2e` (Playwright/Chromium, 390×844, escala 2, geolocalização simulada em Patos-PB) contra o **link público**, criando uma **conta nova** a cada execução — sem dados simulados.
- Após cada gravação pela interface, o teste consulta a API com o JWT e compara **campo a campo** o valor persistido.
- Registra erros de console, requisições com falha e respostas HTTP ≥ 400 da API.
- A API é "acordada" antes do teste (`/actuator/health`; o Render gratuito hiberna e leva ~1 min).

### Resultado por cenário (link público)
| Cenário | O que foi verificado | Resultado |
|---|---|---|
| Cadastro / login | todos os campos do cadastro (nome, telefone só dígitos, e-mail, nascimento, gênero, senha); 401 com mensagem; JWT salvo | ✅ |
| Perfil | nome, gênero, empresa, telefone, endereço; e-mail inalterado; Início atualizado | ✅ |
| Apiário (cadastro + edição) | 11 campos de endereço/dados; GPS; latitude 95 rejeitada na tela; **ponto escolhido com clique no mapa** = latitude/longitude persistidas; edição preserva campos | ✅ |
| Colmeia | criar, editar, inativar (INATIVO) e reativar (SAUDAVEL); coordenadas | ✅ |
| Vistoria | 9 checkboxes, condição, data; situação da colmeia atualizada; edição | ✅ |
| Insumo | criar, editar, excluir (404 após exclusão) | ✅ |
| Produção | **kg ↔ L automático** (25,5 kg = 17,96 L; 30 L = 42,60 kg com densidade 1,42); listagem "25,50 kg (17,96 L)"; edição | ✅ |
| Lote | apiário e **colmeia de origem reais** (apiarioId, colmeiaId, identificadorColmeia); localização herdada do apiário; listagem e detalhe com a cadeia apiário → colmeia → produções → vistorias | ✅ |
| Dashboards (6) | indicadores e gráficos com os dados criados no teste, sem erros no navegador | ✅ |
| Mapa | camadas Apiários/Vistorias/Propriedades com contagem; marcadores; `PUT /apiarios/{id}/localizacao` pela tela; API rejeita latitude 95 (400) | ✅ |
| Relatórios | 5 tabelas com dados; `POST /relatorios/*` = 200; **PDF baixado pela interface** dos 3 relatórios (arquivo começa com `%PDF`) | ✅ |
| Webhooks | estado vazio; criar (URL + 2 eventos); segredo exibido uma vez e ausente na listagem; desativar/ativar; testar → entrega registrada; últimas entregas na tela; excluir | ✅ |
| Sessão | sair, token removido, rota protegida bloqueada, novo login, sessão mantida ao recarregar, dados presentes | ✅ |
| Offline | aviso "Sem internet"; apiário e colmeia (dependente do apiário local) salvos na fila com UUID; ao voltar a conexão a fila é enviada em ordem, ids locais trocados pelos do servidor, sem duplicar; insumo offline; `Idempotency-Key` repetida devolve o mesmo registro (`Idempotency-Replayed: true`) | ✅ |

Capturas: [`screenshots/`](screenshots/) (01–28) e PDFs baixados (`relatorio-*.pdf`).

### Bugs encontrados e corrigidos nesta rodada (frontend)
1. **Vercel devolvia 404** em rotas dinâmicas e em qualquer rota sem arquivo ao abrir por link/recarregar (`/insumos/31`, `/vistorias/12`): a reescrita para `/index.html` não funcionava com `cleanUrls`. Corrigido em `vercel.json` (reescrita para `[id]` e para `/`). Encontrado **somente no link público**.
2. Dados fictícios removidos: dashboard de rastreabilidade (`MASTER_DATA`), tabela de colmeias mock, avisos fixos, KPI de "conformidade" aleatório, anos/meses fixos em filtros (o de rastreabilidade só tinha jan/fev/mai).
3. Relatório de colmeias lia campos inexistentes (`apiarioNome`, `tipoColmeia`, `dataCriacao`) → "N/A" em tudo.
4. Tabela de rastreabilidade mostrava quantidade 0 e "Vendido" para lotes em estoque (assinatura errada de `render`).
5. "Exportar relatório" só escrevia no `console.log` → CSV real (download/compartilhar).
6. Listagens de produção, vistorias e insumos escondiam erros (devolviam lista vazia).
7. Seletor: opção "Todos" aparecia como "Selecione uma opção"; setas do seletor não apareciam (ícones inexistentes); rótulos em fonte serifada na web (`System-Bold` inexistente).
8. Conversão kg→L fixa em 1,4 e diferente entre telas → `utils/mel.ts` (1,42, configurável, igual ao backend).
9. Lote só por nome do apiário e sem colmeia → `apiarioId`/`colmeiaId` reais.
10. Rótulo "N Registro" (abreviação) → "Número de registro (SISBI ou SIF)".
11. Produção/vistorias com contraste insuficiente (texto branco sobre amarelo) → pares de cor AA.

### Bugs/observações de backend
Nenhum defeito de backend encontrado nesta rodada. Os contratos novos (PDF, webhooks, localizações, lote com colmeia, densidadeMel, sugestões, Idempotency-Key) responderam conforme o combinado.

### Melhorias de UX (fase 2)
Capturas lado a lado em [`screenshots/antes-depois/`](screenshots/antes-depois/) (`antes-*` = versão publicada antes desta rodada; `depois-*` = atual), mesmas telas e dados semeados pela API.
- **Identidade**: amarelo-mel `#F0B21A` + marrom `#3E2723/#5D4037`, fundo creme; texto marrom sobre amarelo e branco sobre marrom (contraste AA); tokens centralizados em `constants/cores.ts`, `fonts.ts` (base 17) e `layout.ts` (`toqueMinimo` 48).
- **Início** com cartões grandes e numerados na ordem do trabalho: 1 Apiários e Colmeias · 2 Vistorias · 3 Produção de Mel · 4 Lotes · 5 Insumos · 6 Relatórios · 7 Mapa; "Mais opções": Como usar, Meu Perfil, Avisos, Configurações.
- **Como Usar**: guia em 7 passos curtos, incluindo o uso sem internet.
- **Telas de módulo** com **uma ação principal** (ex.: "Cadastrar apiário") e as demais em linhas grandes com ícone + texto + descrição.
- **Formulários**: rótulo acima do campo, dica abaixo, erro junto ao campo (borda vermelha), máscaras de data/telefone, campos de ≥ 48 px, fonte 17; quantidade de mel em kg **ou** litros; sugestões enquanto digita; última escolha lembrada.
- **Estados vazios** com ícone e botão "Cadastrar primeiro …"; "Dashboard" → "Resumo"; títulos em Title Case e botões em caixa de frase; termos unificados (Apiário, Colmeia, Vistoria, Produção, Lote, Insumo, Relatório).
- **Navegação**: cabeçalho com "Voltar" (seguro sem histórico) e título em todas as telas; menu inferior Início/Apiários/Mapa/Relatórios/Sair com ícone + texto.
- **Acessibilidade**: `accessibilityRole`/`accessibilityLabel` em botões, campos, seletores, menu e cartões; navegação por teclado na web.
- **Avisos** calculados dos dados reais (insumo vencido/vencendo, estoque baixo, colmeia que precisa de atenção, vistoria atrasada).

### Pendências
- **Tiles do mapa** não carregam no ambiente de teste (o proxy de saída bloqueia `tile.openstreetmap.org`); no navegador do usuário carregam normalmente (CSP liberada). Mapa, cliques e marcadores funcionam.
- **Vistoria não tem latitude/longitude no backend**: o ponto da vistoria no mapa é o da colmeia/apiário.
- **Fotos** de apiário/colmeia: não há endpoint genérico de upload no backend.
- **Tema escuro e tamanho da fonte** em Configurações ainda são só preferências locais (sem efeito visual).
- Offline no celular usa erro de rede para detectar falta de conexão (sem `NetInfo`); na web usa `navigator.onLine`.
- Lote vincula **uma** colmeia (limite do contrato atual); lotes não têm edição/exclusão por rastreabilidade.

## Rodada 1 (26/11/2026) — ambiente local

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
