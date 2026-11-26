// Lote vinculado, dashboards, mapa, relatórios (JSON + PDF), webhooks e persistência de sessão.
const fs = require('fs');
const { secao } = require('./run');
const { api, registrar, conferir, WEB } = require('./lib');
const { D } = require('./10-dominio');

const proximo = (lista, pred) => (Array.isArray(lista) ? lista.find(pred) : undefined);
const perto = (a, b, tol = 0.001) => Math.abs(Number(a) - Number(b)) < tol;

secao('lote', async (page, h, ctx) => {
  await h.ir('/rastreabilidade/cadastrar');
  await page.waitForTimeout(1500);
  await h.preencher('dd/mm/aaaa', '25112026');
  await h.selecionar('Selecione o apiário', D.apiario);
  await page.waitForTimeout(1500);
  const txt = await h.texto();
  registrar('lote', 'colmeias reais do apiário listadas', txt.includes(D.colmeia), D.colmeia);
  // A colmeia com produção já vem marcada; só clica se ainda não estiver selecionada.
  const radio = page.getByTestId(`colmeia-${D.colmeiaId}`);
  if ((await radio.getAttribute('aria-checked')) !== 'true') await radio.click();
  registrar('lote', 'colmeia de origem selecionada', (await radio.getAttribute('aria-checked')) === 'true');
  await page.getByTestId('campo-kg').fill('40,5');
  const litros = await page.getByTestId('campo-litros').inputValue();
  registrar('lote', 'conversão automática kg → L (densidade 1,42)', litros === '28,52', litros);
  await page.getByTestId('campo-litros').fill('10');
  const kg = await page.getByTestId('campo-kg').inputValue();
  registrar('lote', 'conversão automática L → kg', kg === '14,20', kg);
  await page.getByTestId('campo-kg').fill('40,5');
  await h.selecionar('Selecione a florada', 'Marmeleiro');
  await h.selecionar('Selecione o tipo de abelha', 'Jandaíra');
  registrar('lote', 'localização herdada do apiário', /Coordenadas: -?\d/.test(await h.texto()));
  await h.foto('12-lote-cadastro');
  await h.clicar('Cadastrar lote');
  await page.waitForTimeout(2500);
  const lista = (await api('GET', `/lotes/${ctx.id}/detalhado`, ctx.token)).dados;
  const l = proximo(lista, (x) => x.quantidadeProduzida === 40.5);
  registrar('lote', 'lote persistido', !!l, JSON.stringify(lista).slice(0, 200));
  if (!l) return;
  D.loteId = l.id;
  conferir('lote', l, {
    dataProducao: '2026-11-25', nomeApiario: D.apiario, apiarioId: D.apiarioId, colmeiaId: D.colmeiaId,
    identificadorColmeia: D.colmeia, tipoFlorada: 'MARMELEIRO', tipoAbelha: 'JANDAIRA', vendido: false,
  });
  registrar('lote', 'latitude/longitude = local do apiário', !!D.localMapa && perto(l.latitude, D.localMapa.lat) && perto(l.longitude, D.localMapa.lng), `${l.latitude}, ${l.longitude}`);

  await h.ir('/rastreabilidade/listar');
  await page.waitForTimeout(1500);
  const t2 = await h.texto();
  registrar('lote', 'listagem exibe o lote, apiário e kg (L)', t2.includes(String(l.id)) && t2.includes(D.apiario) && t2.includes('40,50 kg (28,52 L)'));
  await h.foto('13-lote-listar');
  await h.ir(`/rastreabilidade/editar?id=${l.id}`);
  await page.waitForTimeout(2500);
  const valores = await page.$$eval('input', (els) => els.map((e) => e.value));
  const t3 = await h.texto();
  registrar('lote', 'detalhe mostra data, quantidade e apiário', valores.includes('25/11/2026') && valores.includes('40,50 kg (28,52 L)') && valores.includes(D.apiario), JSON.stringify(valores));
  registrar('lote', 'detalhe mostra a cadeia de origem (colmeia, produção, vistoria)', t3.includes(`Colmeia ${D.colmeia}`) && /Produções \(\d+\)/.test(t3) && /Vistorias \([1-9]/.test(t3));
  await h.foto('13b-lote-detalhes');
});

secao('dashboards', async (page, h, ctx) => {
  // Insumo para o dashboard de insumos (o da seção de insumos foi excluído no teste de exclusão).
  await api('POST', `/insumos/${ctx.id}`, ctx.token, { dataEntrada: '01/11/2026', nome: 'Xarope QA', tipo: 'Alimento', quantidade: 3, unidadeMedida: 'LITRO', dataValidade: '01/12/2026', observacoes: '' });
  const telas = {
    '/apiario/dashboardApiario': ['Total de Apiários', 'Colmeias por apiário', D.apiario],
    '/apiario/dashboardColmeia': ['Total de Colmeias', 'Situação das colmeias'],
    '/producao/dashboard': ['Produção total (kg)', 'Produção mensal', 'Mel de Marmeleiro'],
    '/vistorias/dashboard': ['Vistorias Realizadas', 'Pragas identificadas', 'Formiga'],
    '/insumos/dashboard': ['Total de Insumos', 'Insumos por tipo'],
    '/rastreabilidade/dashboard': ['Lotes Rastreados', 'Lotes por florada', 'Marmeleiro'],
  };
  let n = 17;
  for (const [rota, esperados] of Object.entries(telas)) {
    await h.ir(rota);
    await page.waitForTimeout(2500);
    const txt = await h.texto();
    const faltando = esperados.filter((e) => !txt.includes(e));
    registrar('dashboards', `${rota} renderiza KPIs e gráficos com dados reais`, faltando.length === 0 && !/Não foi possível/.test(txt), faltando.join(', '));
    await h.foto(`${n++}-dashboard-${rota.split('/')[1]}${rota.includes('Colmeia') ? '-colmeia' : ''}`);
  }
});

secao('mapa', async (page, h, ctx) => {
  await h.ir('/mapa');
  await page.waitForTimeout(3500);
  const txt = await h.texto();
  registrar('mapa', 'camadas com contagem (apiários/vistorias/propriedades)', /Apiários \(1\)/.test(txt) && /Vistorias \([1-9]/.test(txt) && /Propriedades \(1\)/.test(txt), txt.slice(0, 120));
  const marcadores = await page.locator('.bees-pin').count();
  registrar('mapa', 'marcadores renderizados no Leaflet', marcadores >= 3, `${marcadores} marcadores`);
  await h.foto('23-mapa');
  // Editar a localização do apiário pelo mapa (PUT /apiarios/{id}/localizacao)
  await h.selecionar('Selecione o apiário', D.apiario);
  await page.waitForTimeout(800);
  await page.getByLabel('Latitude', { exact: true }).fill('-6.5');
  await page.getByLabel('Longitude', { exact: true }).fill('-36.75');
  await h.clicar('Salvar localização');
  await page.waitForTimeout(2500);
  const a = proximo((await api('GET', `/apiarios/${ctx.id}`, ctx.token)).dados, (x) => x.id === D.apiarioId);
  registrar('mapa', 'nova localização do apiário persistida', perto(a?.latitude, -6.5) && perto(a?.longitude, -36.75), `${a?.latitude}, ${a?.longitude}`);
  conferir('mapa', a, { nome: D.apiario, nRegistro: D.registro, cidade: 'São Mamede' });
  const loc = await api('GET', `/apiarios/localizacoes/${ctx.id}`, ctx.token);
  registrar('mapa', 'GET /apiarios/localizacoes reflete a mudança', loc.status === 200 && perto(loc.dados?.[0]?.latitude, -6.5), `${loc.status} ${JSON.stringify(loc.dados).slice(0, 120)}`);
  const inval = await api('PUT', `/apiarios/${D.apiarioId}/localizacao`, ctx.token, { latitude: 95, longitude: 0 });
  registrar('mapa', 'API rejeita latitude 95 (400)', inval.status === 400, String(inval.status));
});

secao('relatorios', async (page, h, ctx) => {
  const telas = {
    '/apiario/tabelaApiario': D.apiario, '/apiario/tabelaColmeia': D.colmeia, '/producao/tabela': 'Mel de Marmeleiro',
    '/vistorias/tabela': 'Vistoria editada QA', '/rastreabilidade/tabela': '40,50 kg',
  };
  for (const [rota, esperado] of Object.entries(telas)) {
    await h.ir(rota);
    await page.waitForTimeout(1800);
    registrar('relatorios', `tela ${rota} com dados`, (await h.texto()).includes(esperado), esperado);
  }
  for (const tipo of ['producao', 'vistorias', 'rastreabilidade']) {
    const r = await api('POST', `/relatorios/${tipo}`, ctx.token, { ano: 2026 });
    registrar('relatorios', `relatório ${tipo} JSON (API)`, r.status === 200 && typeof r.dados === 'object', `${r.status} ${JSON.stringify(r.dados).slice(0, 100)}`);
  }
  // Exportar PDF pela interface: download real do arquivo
  for (const [tipo, rota] of [['producao', '/producao/tabela'], ['vistorias', '/vistorias/tabela'], ['rastreabilidade', '/rastreabilidade/tabela']]) {
    await h.ir(rota);
    await page.waitForTimeout(1500);
    try {
      const [download] = await Promise.all([
        page.waitForEvent('download', { timeout: 90000 }),
        page.getByText('Exportar PDF', { exact: true }).first().click(),
      ]);
      const caminho = await download.path();
      const inicio = fs.readFileSync(caminho).subarray(0, 4).toString();
      registrar('relatorios', `PDF ${tipo} baixado pela interface (%PDF)`, inicio === '%PDF', `${download.suggestedFilename()} ${fs.statSync(caminho).size} bytes`);
      fs.copyFileSync(caminho, `${__dirname}/screenshots/relatorio-${tipo}.pdf`);
    } catch (e) {
      registrar('relatorios', `PDF ${tipo} baixado pela interface (%PDF)`, false, e.message.split('\n')[0]);
    }
    await page.waitForTimeout(800);
  }
  await h.foto('24-relatorio-producao-pdf');
});

secao('webhooks', async (page, h, ctx) => {
  const url = 'https://httpbin.org/post';
  await h.ir('/configuracao');
  await h.clicar('Integrações / Webhooks');
  registrar('webhooks', 'Configuração abre Integrações / Webhooks', await h.aguardarUrl(/configuracao\/webhooks/));
  await page.waitForTimeout(1500);
  registrar('webhooks', 'estado vazio exibido', (await h.texto()).includes('Nenhum webhook cadastrado ainda.'));
  await h.preencher('https://meusistema.com/webhooks/bees', url);
  await h.clicar('Apiário criado');
  await h.clicar('Lote criado');
  await h.clicar('Criar Webhook');
  await page.waitForTimeout(2500);
  const segredo = (await page.getByTestId('webhook-segredo').innerText().catch(() => '')).trim();
  registrar('webhooks', 'segredo exibido uma única vez após criar', segredo.length >= 16, `${segredo.length} caracteres`);
  await h.foto('25-webhooks');
  let lista = (await api('GET', '/webhooks', ctx.token)).dados;
  const w = proximo(lista, (x) => x.url === url);
  registrar('webhooks', 'webhook persistido', !!w);
  if (!w) return;
  conferir('webhooks', w, { url, eventos: ['apiario.criado', 'lote.criado'], ativo: true });
  registrar('webhooks', 'segredo não é devolvido na listagem', !w.segredo);

  await page.getByLabel(`Ativar webhook ${w.id}`).click();
  await page.waitForTimeout(1500);
  lista = (await api('GET', '/webhooks', ctx.token)).dados;
  registrar('webhooks', 'alternar desativa (ativo=false)', proximo(lista, (x) => x.id === w.id)?.ativo === false);
  await page.getByLabel(`Ativar webhook ${w.id}`).click();
  await page.waitForTimeout(1500);

  await h.clicar('Testar');
  await page.waitForTimeout(6000);
  const ent = (await api('GET', `/webhooks/${w.id}/entregas`, ctx.token)).dados;
  registrar('webhooks', 'teste gera entrega registrada', Array.isArray(ent) && ent.length > 0, JSON.stringify(ent?.[0] ?? {}).slice(0, 160));
  await h.clicar('Entregas');
  await page.waitForTimeout(1500);
  registrar('webhooks', 'últimas entregas exibidas na tela', /Últimas entregas/.test(await h.texto()));
  await h.foto('26-webhooks-entregas');

  await h.clicar('Excluir');
  await page.waitForTimeout(2000);
  lista = (await api('GET', '/webhooks', ctx.token)).dados;
  registrar('webhooks', 'webhook excluído', !proximo(lista, (x) => x.id === w.id));
});

secao('sessao', async (page, h, ctx) => {
  await h.ir('/configuracao');
  await h.foto('27-configuracoes');
  await h.clicar('Sair');
  await page.waitForTimeout(1500);
  registrar('sessao', 'logout redireciona para login', /\/login/.test(page.url()), page.url());
  registrar('sessao', 'token removido do storage', (await page.evaluate(() => localStorage.getItem('user_token'))) === null);
  await h.ir('/apiario');
  registrar('sessao', 'rota protegida bloqueada após logout', /\/login/.test(page.url()), page.url());
  // Login novamente: os dados continuam lá
  await h.ir('/login');
  await h.preencher('E-mail', ctx.email).catch(async () => h.preencher('Email', ctx.email));
  await page.locator('input[type="password"]').first().fill(ctx.senha);
  await h.clicar('Entrar');
  await page.waitForTimeout(3000);
  registrar('sessao', 'login novamente leva à home', !/\/login/.test(page.url()), page.url());
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  registrar('sessao', 'sessão persiste após recarregar a página', !/\/login/.test(page.url()));
  await h.ir('/apiario/listar');
  await page.waitForTimeout(2500);
  registrar('sessao', 'dados persistidos visíveis após novo login', (await h.texto()).includes(D.apiario));
  await page.goto(WEB + '/', { waitUntil: 'networkidle' });
});
