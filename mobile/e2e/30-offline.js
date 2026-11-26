// Modo offline: cadastros sem internet vão para a fila local e são sincronizados (com Idempotency-Key)
// quando a conexão volta, em ordem de dependência (apiário → colmeia; insumo).
const { secao } = require('./run');
const { api, registrar, conferir } = require('./lib');

const proximo = (lista, pred) => (Array.isArray(lista) ? lista.find(pred) : undefined);
const fila = (page) => page.evaluate(() => JSON.parse(localStorage.getItem('@offline:fila') || '[]'));

secao('offline', async (page, h, ctx) => {
  const sufixo = Date.now() % 100000;
  const nomeApiario = `Apiário Offline ${sufixo}`;
  const nomeColmeia = `COL-OFF-${sufixo}`;
  const nomeInsumo = `Xarope Offline ${sufixo}`;

  // 1) Apiário criado sem internet
  await h.ir('/apiario/cadastrar');
  await page.waitForTimeout(1500);
  await page.context().setOffline(true);
  await page.waitForTimeout(500);
  registrar('offline', 'aviso "Sem internet" exibido', (await h.texto()).includes('Sem internet'));
  await h.preencher('Apiário Bees Caatinga ', nomeApiario);
  await h.preencher('SISBI 1234/2025', `OFF ${sufixo}/2026`);
  await h.preencher('Digite o CEP', '58700000');
  await h.preencher('Digite a rua', 'Rua Sem Sinal');
  await h.preencher('Digite o bairro', 'Sítio');
  await h.preencher('Digite a cidade', 'Patos');
  await h.preencher('Digite o estado', 'PB');
  await h.preencher('Digite a propriedade', 'Sítio Sem Internet');
  await page.getByLabel('Latitude', { exact: true }).fill('-7.1');
  await page.getByLabel('Longitude', { exact: true }).fill('-37.3');
  await h.clicar('Cadastrar Apiário');
  await page.waitForTimeout(1500);
  registrar('offline', 'apiário salvo no aparelho (mensagem)', page.dialogs.some((d) => d.includes('Salvo no aparelho')), page.dialogs.slice(-1)[0]);
  let f = await fila(page);
  registrar('offline', 'fila local com o apiário (UUID do cliente)', f.length === 1 && f[0].tipo === 'apiario' && /^[0-9a-f-]{36}$/.test(f[0].uuid), JSON.stringify(f.map((i) => i.tipo)));

  // 2) Colmeia do apiário pendente (dependência por id local), ainda offline — navegação interna (SPA)
  await page.evaluate(() => window.history.pushState({}, '', '/apiario/colmeia/cadastrar'));
  await page.evaluate(() => window.dispatchEvent(new PopStateEvent('popstate')));
  await page.waitForTimeout(2000);
  if (!/colmeia\/cadastrar/.test(page.url()) || !(await h.texto()).includes('Identificador')) {
    registrar('offline', 'navegação offline para cadastro de colmeia', false, page.url());
  } else {
    await h.preencher('Identificador da Colmeia', nomeColmeia);
    await h.selecionar('Selecione o Apiário', nomeApiario);
    await h.selecionar('Selecione o tipo', 'Madeira');
    await h.clicar('📍 Usar localização atual');
    await page.waitForTimeout(800);
    await page.getByText(/^Cadastrar/).last().click();
    await page.waitForTimeout(1500);
    f = await fila(page);
    registrar('offline', 'colmeia enfileirada apontando para o apiário local', f.length === 2 && f[1].tipo === 'colmeia' && f[1].url.includes('local:'), JSON.stringify(f.map((i) => i.url)));
  }
  await h.foto('28-offline-pendentes');

  // 3) Volta a internet → sincroniza (automático ao voltar, ou pelo botão)
  await page.context().setOffline(false);
  await page.waitForTimeout(4000);
  if ((await fila(page)).length) {
    await page.getByText(/^Sincronizar \(/).first().click().catch(() => {});
    await page.waitForTimeout(6000);
  }
  f = await fila(page);
  registrar('offline', 'fila vazia após sincronizar', f.length === 0, JSON.stringify(f.map((i) => [i.tipo, i.erro])));

  const apiarios = (await api('GET', `/apiarios/${ctx.id}`, ctx.token)).dados;
  const a = proximo(apiarios, (x) => x.nome === nomeApiario);
  registrar('offline', 'apiário criado offline existe na API (uma única vez)', apiarios.filter((x) => x.nome === nomeApiario).length === 1);
  if (a) conferir('offline', a, { cidade: 'Patos', nomeDaPropriedade: 'Sítio Sem Internet', latitude: -7.1, longitude: -37.3 });
  const colmeias = (await api('GET', `/colmeias/produtor/${ctx.id}`, ctx.token)).dados;
  const c = proximo(colmeias, (x) => x.identificador === nomeColmeia);
  registrar('offline', 'colmeia sincronizada vinculada ao apiário real (id remapeado)', !!c && !!a && c.apiarioId === a.id, c ? `apiarioId ${c.apiarioId}` : 'não encontrada');

  // 4) Insumo offline + sincronização
  await h.ir('/insumos/cadastrar');
  await page.waitForTimeout(1500);
  await page.context().setOffline(true);
  await h.preencher('dd/mm/aaaa', '02112026', 0);
  await h.preencher('Ex: Cera Alveolada', nomeInsumo);
  await h.preencher('0,0', '4');
  await h.selecionar('Selecione', 'Kg');
  await h.selecionar('Selecione o tipo', 'Medicamento');
  await h.preencher('dd/mm/aaaa', '01112027', 1);
  await h.clicar('Salvar Registro');
  await page.waitForTimeout(1500);
  registrar('offline', 'insumo enfileirado', (await fila(page)).some((i) => i.tipo === 'insumo'));
  await page.context().setOffline(false);
  await page.waitForTimeout(4000);
  if ((await fila(page)).length) {
    await page.getByText(/^Sincronizar \(/).first().click().catch(() => {});
    await page.waitForTimeout(5000);
  }
  const insumos = (await api('GET', `/insumos/${ctx.id}`, ctx.token)).dados;
  registrar('offline', 'insumo offline sincronizado uma única vez', insumos.filter((x) => x.nome === nomeInsumo).length === 1);

  // 5) Idempotency-Key: repetir o mesmo POST não duplica
  const chave = `e2e-${sufixo}-${Math.random().toString(16).slice(2)}`;
  const corpo = { dataEntrada: '03/11/2026', nome: `Idem ${sufixo}`, tipo: 'Teste', quantidade: 1, unidadeMedida: 'UNIDADE', observacoes: '' };
  const r1 = await fetch(`${require('./lib').API}/insumos/${ctx.id}`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${ctx.token}`, 'Idempotency-Key': chave }, body: JSON.stringify(corpo) });
  const r2 = await fetch(`${require('./lib').API}/insumos/${ctx.id}`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${ctx.token}`, 'Idempotency-Key': chave }, body: JSON.stringify(corpo) });
  const [j1, j2] = [await r1.json(), await r2.json()];
  registrar('offline', 'Idempotency-Key: repetição devolve o mesmo registro', j1.id === j2.id && r2.headers.get('idempotency-replayed') === 'true', `${j1.id}/${j2.id} replayed=${r2.headers.get('idempotency-replayed')}`);
});
