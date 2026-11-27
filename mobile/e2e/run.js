/* E2E BeesCaatinga — executa o fluxo completo pela UI web e confere os dados na API.
 * Uso: npm run e2e   (requer app web em E2E_WEB_URL e API em E2E_API_URL)
 * Seções específicas: E2E_SECOES=cadastro,apiario npm run e2e
 */
const fs = require('fs');
const { api, aquecerApi, abrirNavegador, ui, registrar, conferir, resultados, problemas } = require('./lib');

const RUN = Date.now().toString().slice(-6);
const ctx = {
  email: `qa.${RUN}@beescaatinga.test`,
  senha: 'Senha@123',
  token: null,
  id: null,
};

const secoes = [];
const secao = (nome, fn) => secoes.push({ nome, fn });

// ---------------------------------------------------------------- Cadastro / Login
secao('cadastro', async (page, h) => {
  await h.ir('/cadastro');
  await h.preencher('Nome Completo', 'Maria QA da Silva');
  await h.preencher('Telefone (DDD + Número)', '83987654321');
  await h.preencher('E-mail', ctx.email);
  await h.preencher('dd/mm/aaaa', '15031990');
  await h.selecionar('Selecione uma opção', 'Feminino');
  await h.preencher('Senha', ctx.senha);
  await h.preencher('Confirme sua Senha', ctx.senha);
  await h.foto('01-cadastro');
  await h.clicar('Finalizar Cadastro');
  const foiParaLogin = await h.aguardarUrl(/\/login/, 10000);
  registrar('cadastro', 'redireciona para login após sucesso', foiParaLogin, page.url());

  const login = await api('POST', '/login', null, { email: ctx.email, senha: ctx.senha });
  registrar('cadastro', 'produtor existe na API (login 200)', login.status === 200, String(login.status));
  ctx.token = login.dados.token; ctx.id = login.dados.id;
  const p = await api('GET', `/produtores/${ctx.id}`, ctx.token);
  conferir('cadastro', p.dados, { nomeCompleto: 'Maria QA da Silva', telefone: '83987654321', email: ctx.email, genero: 'FEMININO' });
});

secao('login', async (page, h) => {
  await h.ir('/login');
  await h.preencher('E-mail', ctx.email).catch(async () => h.preencher('Email', ctx.email));
  await page.locator('input[type="password"]').first().fill('errada');
  await h.clicar('Entrar');
  await page.waitForTimeout(1500);
  registrar('login', 'senha errada exibe mensagem do backend', /inválid|incorret/i.test(h.ultimoDialogo()), h.ultimoDialogo());
  await page.locator('input[type="password"]').first().fill(ctx.senha);
  await h.foto('02-login');
  await h.clicar('Entrar');
  await page.waitForTimeout(2500);
  const texto = await h.texto();
  registrar('login', 'home exibe saudação com o nome', texto.includes('Olá, Maria QA da Silva'), page.url());
  const tok = await page.evaluate(() => localStorage.getItem('user_token'));
  registrar('login', 'token JWT salvo no storage', !!tok && tok.split('.').length === 3);
  await h.foto('03-home');
});

secao('perfil', async (page, h) => {
  await h.ir('/perfil');
  const valorNome = await page.getByPlaceholder('Digite seu nome completo').inputValue();
  registrar('perfil', 'exibe nome do usuário', valorNome === 'Maria QA da Silva', valorNome);
  await h.preencher('Digite seu nome completo', 'Maria QA Editada');
  await h.selecionar('Feminino', 'Outro');
  await h.preencher('(Opcional)', 'Mel do Sertão LTDA');
  await h.preencher('(00) 0 0000-0000', '83912345678');
  await h.preencher('Rua, número, bairro, cidade', 'Rua das Flores, 10, Centro, Patos-PB');
  // Foto do perfil: POST /upload (multipart "file") → caminhoDaFoto = /arquivos/{id}
  const [seletor] = await Promise.all([
    page.waitForEvent('filechooser', { timeout: 15000 }),
    (async () => { await page.getByLabel('Escolher foto').first().click(); await page.getByText('Escolher da Galeria', { exact: true }).click(); })(),
  ]);
  const upload = page.waitForResponse((r) => /\/upload$/.test(r.url()) && r.request().method() === 'POST', { timeout: 60000 });
  await seletor.setFiles(`${__dirname}/screenshots/antes-depois/antes-01-login.png`);
  const respUpload = await upload.catch(() => null);
  registrar('perfil', 'POST /upload = 201', respUpload?.status() === 201, String(respUpload?.status()));
  await page.waitForTimeout(1000);
  await h.foto('04-perfil');
  await h.clicar('Salvar Alterações');
  await page.waitForTimeout(1500);
  const p = await api('GET', `/produtores/${ctx.id}`, ctx.token);
  conferir('perfil', p.dados, {
    nomeCompleto: 'Maria QA Editada', genero: 'OUTRO', nomeDaEmpresa: 'Mel do Sertão LTDA',
    telefone: '83912345678', endereco: 'Rua das Flores, 10, Centro, Patos-PB', email: ctx.email,
  });
  const foto = p.dados.caminhoDaFoto || '';
  registrar('perfil', 'foto enviada (caminhoDaFoto = /arquivos/{id})', /^\/arquivos\//.test(foto), foto);
  if (foto) {
    const img = await fetch(require('./lib').API + foto);
    registrar('perfil', 'GET /arquivos/{id} público devolve a imagem', img.ok && /^image\//.test(img.headers.get('content-type') || ''), `${img.status} ${img.headers.get('content-type')}`);
  }
  await h.ir('/');
  registrar('perfil', 'home reflete nome editado', (await h.texto()).includes('Olá, Maria QA Editada'));
});

module.exports = { secao, ctx };

// Seções de domínio ficam em arquivos separados para facilitar a manutenção.
for (const f of fs.readdirSync(__dirname).filter((n) => /^\d\d-.*\.js$/.test(n)).sort()) require(`./${f}`);

(async () => {
  const filtro = process.env.E2E_SECOES ? process.env.E2E_SECOES.split(',') : null;
  console.log(`Aquecendo a API (${require('./lib').API})...`, (await aquecerApi()) ? 'ok' : 'sem resposta');
  const { browser, page } = await abrirNavegador();
  const h = ui(page);
  for (const s of secoes) {
    if (filtro && !filtro.includes(s.nome) && !['cadastro', 'login'].includes(s.nome)) continue;
    console.log(`\n== ${s.nome}`);
    try { await s.fn(page, h, ctx); } catch (e) {
      registrar(s.nome, 'execução da seção', false, e.message.split('\n')[0]);
      await h.foto(`erro-${s.nome}`).catch(() => {});
    }
  }
  await browser.close();
  const falhas = resultados.filter((r) => !r.ok);
  fs.writeFileSync(`${__dirname}/resultado.json`, JSON.stringify({ run: RUN, resultados, problemas }, null, 2));
  console.log(`\nResumo: ${resultados.length - falhas.length}/${resultados.length} OK`);
  console.log(`Erros de console: ${problemas.console.length}`); problemas.console.forEach((c) => console.log('  ' + c));
  console.log(`Falhas de rede/HTTP: ${problemas.rede.length}`); problemas.rede.forEach((c) => console.log('  ' + c));
  process.exit(falhas.length ? 1 : 0);
})();
