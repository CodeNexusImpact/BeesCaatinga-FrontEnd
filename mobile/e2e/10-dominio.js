// Fluxos de domínio: apiário, colmeia, vistoria, insumo, produção, lote, relatórios, mapa e logout.
const { secao } = require('./run');
const { api, registrar, conferir } = require('./lib');

const D = {}; // ids e nomes criados durante o teste
const proximo = (lista, pred) => (Array.isArray(lista) ? lista.find(pred) : undefined);
const perto = (a, b) => Math.abs(Number(a) - Number(b)) < 0.001;

secao('apiario', async (page, h, ctx) => {
  D.apiario = `Apiário QA ${Date.now() % 100000}`;
  D.registro = `SISBI ${Date.now() % 100000}/2026`; // nº de registro é único no backend
  await h.ir('/apiario/cadastrar');
  await h.preencher('Apiário Bees Caatinga ', D.apiario);
  await h.preencher('SISBI 1234/2025', D.registro);
  await h.preencher('31/12/2000', '10012020');
  await h.clicar('Usar minha localização atual');
  await page.waitForTimeout(1500);
  registrar('apiario', 'GPS: coordenadas exibidas após "Usar localização atual"', /Coordenadas: -7\.02/.test(await h.texto()));
  // Validação de faixa: latitude 95 é rejeitada
  await page.getByLabel('Latitude', { exact: true }).fill('95');
  registrar('apiario', 'latitude fora da faixa exibe erro', (await h.texto()).includes('A latitude deve estar entre -90 e 90.'));
  await page.getByLabel('Latitude', { exact: true }).fill('-7.0247');
  // Clique no mapa define o ponto
  const box = await page.locator('[data-testid="mapa"]').first().boundingBox();
  await page.mouse.click(box.x + box.width * 0.62, box.y + box.height * 0.38);
  await page.waitForTimeout(600);
  const m = /Coordenadas: (-?\d+\.\d+), (-?\d+\.\d+)/.exec(await h.texto());
  D.localMapa = m ? { lat: Number(m[1]), lng: Number(m[2]) } : null;
  registrar('apiario', 'clique no mapa define a localização', !!m && !(perto(m[1], -7.0247) && perto(m[2], -37.2806)), m ? m[0] : 'sem coordenadas');
  await h.preencher('Digite o CEP', '58700000');
  await h.preencher('Digite a rua', 'Rua do Mel');
  await h.preencher('Digite o número', '123');
  await h.preencher('Digite o bairro', 'Centro');
  await h.preencher('Digite a cidade', 'Patos');
  await h.preencher('Digite o estado', 'PB');
  await h.preencher('Digite a propriedade', 'Sítio Flor do Sertão');
  await h.preencher('Digite o complemento', 'Próximo ao açude');
  await h.preencher('Observações adicionais sobre o apiário', 'Apiário de teste QA');
  await h.foto('05-apiario-cadastro');
  await h.clicar('Cadastrar Apiário');
  registrar('apiario', 'redireciona para a listagem', await h.aguardarUrl(/\/apiario\/listar/));
  const lista = (await api('GET', `/apiarios/${ctx.id}`, ctx.token)).dados;
  const a = proximo(lista, (x) => x.nome === D.apiario);
  registrar('apiario', 'apiário persistido', !!a);
  if (!a) return;
  D.apiarioId = a.id;
  conferir('apiario', a, {
    nRegistro: D.registro, dataDeCriacao: '2020-01-10', cep: '58700000', rua: 'Rua do Mel', numero: '123',
    bairro: 'Centro', cidade: 'Patos', estado: 'PB', nomeDaPropriedade: 'Sítio Flor do Sertão',
    complemento: 'Próximo ao açude', observacoes: 'Apiário de teste QA',
  });
  registrar('apiario', 'campo latitude/longitude (ponto escolhido no mapa)', !!D.localMapa && perto(a.latitude, D.localMapa.lat) && perto(a.longitude, D.localMapa.lng), `${a.latitude}, ${a.longitude}`);

  // Edição
  await h.ir(`/apiario/editar?id=${a.id}`);
  await page.waitForTimeout(800);
  registrar('apiario', 'edição carrega o nome', (await page.getByPlaceholder('Apiário Bees Caatinga ', { exact: true }).inputValue()) === D.apiario);
  D.apiario = `${D.apiario} Editado`;
  await h.preencher('Apiário Bees Caatinga ', D.apiario);
  await h.preencher('Digite a cidade', 'São Mamede');
  await h.preencher('Observações adicionais sobre o apiário', 'Obs editada');
  await h.clicar('Salvar Alterações');
  await page.waitForTimeout(1200);
  const a2 = proximo((await api('GET', `/apiarios/${ctx.id}`, ctx.token)).dados, (x) => x.id === a.id);
  conferir('apiario-editar', a2, { nome: D.apiario, cidade: 'São Mamede', observacoes: 'Obs editada', rua: 'Rua do Mel', nRegistro: D.registro });

  await h.ir('/apiario/dashboardApiario');
  await page.waitForTimeout(1500);
  const txt = await h.texto();
  registrar('apiario', 'dashboard do apiário carrega', !/erro/i.test(txt) && txt.length > 50);
  await h.foto('06-apiario-dashboard');
});

secao('colmeia', async (page, h, ctx) => {
  D.colmeia = `COL-QA-${Date.now() % 10000}`;
  await h.ir('/apiario/colmeia/cadastrar');
  await page.waitForTimeout(800);
  await h.preencher('Identificador da Colmeia', D.colmeia);
  await h.selecionar('Selecione o Apiário', D.apiario);
  await h.selecionar('Selecione o tipo', 'Madeira');
  await h.clicar('📍 Usar localização atual');
  await h.preencher('Ex.: perto do açude', 'Sombra do juazeiro');
  await h.preencher('---', 'Colmeia forte');
  await h.foto('07-colmeia-cadastro');
  await page.getByText(/^Cadastrar/).last().click();
  await page.waitForTimeout(1500);
  const lista = (await api('GET', `/colmeias/produtor/${ctx.id}`, ctx.token)).dados;
  const c = proximo(lista, (x) => x.identificador === D.colmeia);
  registrar('colmeia', 'colmeia persistida', !!c);
  if (!c) return;
  D.colmeiaId = c.id;
  conferir('colmeia', c, { tipo: 'MADEIRA', ativa: true, statusColmeia: 'SAUDAVEL', observacoes: 'Colmeia forte', detalhesDaLocalizacao: 'Sombra do juazeiro', nomeApiario: D.apiario, apiarioId: D.apiarioId });
  registrar('colmeia', 'campo latitude/longitude', perto(c.latitude, -7.0247) && perto(c.longitude, -37.2806), `${c.latitude}, ${c.longitude}`);

  // Edição + inativar (navegando pela lista de apiários)
  await h.ir('/apiario/listar');
  await page.getByText('1/1').first().click().catch(() => {});
  await page.waitForTimeout(500);
  await page.getByText(D.colmeia, { exact: true }).first().click();
  registrar('colmeia', 'lista abre a edição da colmeia', await h.aguardarUrl(/colmeia\/editar/));
  await page.waitForTimeout(1000);
  await h.selecionar('Madeira', 'Concreto');
  await h.selecionar('Sim', 'Não');
  await h.preencher('---', 'Inativada no teste');
  await h.foto('08-colmeia-editar');
  await h.clicar('Salvar Alterações');
  await page.waitForTimeout(1200);
  let c2 = proximo((await api('GET', `/colmeias/produtor/${ctx.id}`, ctx.token)).dados, (x) => x.id === c.id);
  conferir('colmeia-inativar', c2, { tipo: 'CONCRETO', ativa: false, statusColmeia: 'INATIVO', observacoes: 'Inativada no teste', identificador: D.colmeia });

  // Reativar
  await h.ir(`/apiario/colmeia/editar?id=${c.id}`);
  await page.waitForTimeout(1000);
  await h.selecionar('Não', 'Sim');
  await h.clicar('Salvar Alterações');
  await page.waitForTimeout(1200);
  c2 = proximo((await api('GET', `/colmeias/produtor/${ctx.id}`, ctx.token)).dados, (x) => x.id === c.id);
  conferir('colmeia-ativar', c2, { ativa: true, statusColmeia: 'SAUDAVEL' });
});

secao('vistoria', async (page, h, ctx) => {
  await h.ir('/vistorias/cadastrar');
  await page.waitForTimeout(800);
  await h.preencher('dd/mm/aaaa', '20112026');
  await h.selecionar('Selecione', D.apiario);
  await page.waitForTimeout(800);
  await h.selecionar('Selecione', D.colmeia);
  await h.selecionar('Saudável', 'Manutenção Necessária');
  // 0-4: pragas (Varroa, Formiga, Traça, Lagartixa, Outro) · 5-8: perdas (Alimentação, Veneno, Clima, Outro)
  for (let i = 0; i < 9; i++) await page.locator('input[type="checkbox"]').nth(i).click({ force: true });
  await h.preencher('Observações (opcional):', 'Vistoria completa QA');
  const marcados = await page.locator('input[type="checkbox"]:checked').count();
  registrar('vistoria', 'todos os 9 checkboxes marcados', marcados === 9, String(marcados));
  await h.foto('09-vistoria-cadastro');
  await h.clicar('Salvar');
  await page.waitForTimeout(1500);
  const lista = (await api('GET', `/vistorias/${ctx.id}`, ctx.token)).dados;
  const v = proximo(lista, (x) => x.observacoes === 'Vistoria completa QA');
  registrar('vistoria', 'vistoria persistida', !!v);
  if (!v) return;
  D.vistoriaId = v.id;
  conferir('vistoria', v, {
    dataVistoria: '2026-11-20', condicao: 'MANUTENCAO_NECESSARIA', nomeApiario: D.apiario, nomeColmeia: D.colmeia,
    pragasIdentificadas: ['VARROA', 'FORMIGA', 'TRACA', 'LAGARTIXA', 'OUTRO'],
    perdasIdentificadas: ['ALIMENTACAO', 'VENENO', 'CLIMA', 'OUTRO'],
  });
  const col = proximo((await api('GET', `/colmeias/produtor/${ctx.id}`, ctx.token)).dados, (x) => x.id === D.colmeiaId);
  registrar('vistoria', 'situação da colmeia atualizada pela vistoria', col?.statusColmeia === 'TRATAMENTO_NECESSARIO', col?.statusColmeia);

  await h.ir(`/vistorias/editar?id=${v.id}`);
  await page.waitForTimeout(1200);
  registrar('vistoria', 'edição carrega checkboxes marcados', (await page.locator('input[type="checkbox"]:checked').count()) === 9);
  await h.preencher('dd/mm/aaaa', '21112026');
  await h.selecionar('Manutenção Necessária', 'Agendar Colheita');
  await page.locator('input[type="checkbox"]').nth(0).click({ force: true }); // desmarca Varroa
  await page.locator('input[type="checkbox"]').nth(7).click({ force: true }); // desmarca Clima
  await h.preencher('Observações (opcional):', 'Vistoria editada QA');
  await h.clicar('Salvar');
  await page.waitForTimeout(1500);
  const v2 = proximo((await api('GET', `/vistorias/${ctx.id}`, ctx.token)).dados, (x) => x.id === v.id);
  conferir('vistoria-editar', v2, {
    dataVistoria: '2026-11-21', condicao: 'AGENDAR_COLHEITA', observacoes: 'Vistoria editada QA',
    pragasIdentificadas: ['FORMIGA', 'TRACA', 'LAGARTIXA', 'OUTRO'], perdasIdentificadas: ['ALIMENTACAO', 'VENENO', 'OUTRO'],
  });
});

secao('insumo', async (page, h, ctx) => {
  await h.ir('/insumos/cadastrar');
  await h.preencher('dd/mm/aaaa', '01112026', 0);
  await h.preencher('Ex: Cera Alveolada', 'Cera Alveolada QA');
  await h.preencher('0,0', '12,5');
  await h.selecionar('Selecione', 'Kg');
  await h.selecionar('Selecione o tipo', 'Medicamento');
  await h.preencher('dd/mm/aaaa', '01112027', 1);
  await h.preencher('Notas adicionais...', 'Lote do fornecedor X');
  await h.foto('10-insumo-cadastro');
  await h.clicar('Salvar Registro');
  await page.waitForTimeout(1500);
  const lista = (await api('GET', `/insumos/${ctx.id}`, ctx.token)).dados;
  const i = proximo(lista, (x) => x.nome === 'Cera Alveolada QA');
  registrar('insumo', 'insumo persistido', !!i);
  if (!i) return;
  conferir('insumo', i, { dataEntrada: '2026-11-01', tipo: 'Medicamento', quantidade: 12.5, unidadeMedida: 'KILOGRAMA', dataValidade: '2027-11-01', observacoes: 'Lote do fornecedor X', statusInsumo: 'DISPONIVEL' });

  await h.ir(`/insumos/editar?id=${i.id}`);
  await page.waitForTimeout(1200);
  registrar('insumo', 'edição carrega o nome', (await page.getByPlaceholder('Ex: Cera Alveolada').inputValue()) === 'Cera Alveolada QA');
  await h.preencher('Ex: Cera Alveolada', 'Cera Editada QA');
  await h.preencher('0.00', '20');
  await h.selecionar('Kg', 'L');
  await h.selecionar('Disponível', 'Em Uso');
  await h.preencher('Detalhes adicionais...', 'Obs editada');
  await h.clicar('Salvar Alterações');
  await page.waitForTimeout(1500);
  const i2 = (await api('GET', `/insumos/${i.id}/produtor/${ctx.id}`, ctx.token)).dados;
  conferir('insumo-editar', i2, { nome: 'Cera Editada QA', quantidade: 20, unidadeMedida: 'LITRO', statusInsumo: 'EM_USO', observacoes: 'Obs editada', dataEntrada: '2026-11-01', dataValidade: '2027-11-01', tipo: 'Medicamento' });

  await h.ir(`/insumos/${i.id}`);
  await page.waitForTimeout(1000);
  await page.getByLabel('Excluir').first().click();
  await page.waitForTimeout(400);
  await h.clicar('Apagar');
  await page.waitForTimeout(1500);
  const r = await api('GET', `/insumos/${i.id}/produtor/${ctx.id}`, ctx.token);
  registrar('insumo', 'insumo excluído (404)', r.status === 404, String(r.status));
});

secao('producao', async (page, h, ctx) => {
  await h.ir('/producao/cadastrar');
  await page.waitForTimeout(1500);
  await h.preencher('dd/mm/aaaa', '15112026');
  await h.selecionar('Selecione o apiário', D.apiario);
  await page.waitForTimeout(1200);
  await h.selecionar('Selecione a colmeia', D.colmeia);
  await page.getByLabel('Tipo de mel', { exact: true }).fill('Mel de Jandaíra');
  await page.getByTestId('campo-kg').fill('25,5');
  const litros = await page.getByTestId('campo-litros').inputValue();
  registrar('producao', 'conversão automática kg → L (25,5 kg = 17,96 L)', litros === '17,96', litros);
  await h.foto('11-producao-cadastro');
  await h.clicar('Cadastrar produção');
  await page.waitForTimeout(2500);
  const lista = (await api('GET', `/producoes/${ctx.id}`, ctx.token)).dados;
  const p = proximo(lista, (x) => x.nomeColmeia === D.colmeia);
  registrar('producao', 'produção persistida', !!p);
  if (!p) return;
  conferir('producao', p, { tipoProducao: 'Mel de Jandaíra', quantidade: 25.5, unidadeMedida: 'KILOGRAMA', dataColeta: '2026-11-15', nomeApiario: D.apiario, apiarioId: D.apiarioId, colmeiaId: D.colmeiaId });

  await h.ir('/producao/listar');
  await page.waitForTimeout(1500);
  registrar('producao', 'listagem mostra kg e litros', (await h.texto()).includes('25,50 kg (17,96 L)'));

  await h.ir(`/producao/editar?id=${p.id}`);
  await page.waitForTimeout(2000);
  registrar('producao', 'edição carrega apiário/colmeia reais e a quantidade', (await h.texto()).includes(D.colmeia) && (await page.getByTestId('campo-kg').inputValue()) === '25,50');
  await page.getByTestId('campo-litros').fill('30');
  registrar('producao', 'conversão L → kg na edição (30 L = 42,60 kg)', (await page.getByTestId('campo-kg').inputValue()) === '42,60');
  await page.getByLabel('Tipo de mel', { exact: true }).fill('Mel de Marmeleiro');
  await h.preencher('dd/mm/aaaa', '16112026');
  await h.clicar('Salvar alterações');
  await page.waitForTimeout(2000);
  const p2 = proximo((await api('GET', `/producoes/${ctx.id}`, ctx.token)).dados, (x) => x.id === p.id);
  conferir('producao-editar', p2, { tipoProducao: 'Mel de Marmeleiro', quantidade: 42.6, unidadeMedida: 'KILOGRAMA', dataColeta: '2026-11-16', colmeiaId: D.colmeiaId });
});

module.exports = { D };
