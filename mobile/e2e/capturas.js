/* Capturas das telas principais (390x844) para comparação antes/depois.
 * Uso: E2E_WEB_URL=... E2E_API_URL=... node e2e/capturas.js antes|depois
 */
const fs = require('fs');
const { WEB, api, abrirNavegador } = require('./lib');
const { semear } = require('./semear');

const TELAS = [
  ['01-login', '/login', false], ['02-home', '/'], ['03-apiarios', '/apiario'], ['04-apiario-listar', '/apiario/listar'],
  ['05-apiario-cadastrar', '/apiario/cadastrar'], ['06-vistorias', '/vistorias'], ['07-vistoria-cadastrar', '/vistorias/cadastrar'],
  ['08-producao-dashboard', '/producao/dashboard'], ['09-lote-cadastrar', '/rastreabilidade/cadastrar'], ['10-insumos-listar', '/insumos/listar'],
  ['11-relatorios', '/relatorio'], ['12-configuracao', '/configuracao'],
];

(async () => {
  const pasta = `${__dirname}/screenshots/antes-depois`;
  fs.mkdirSync(pasta, { recursive: true });
  const prefixo = process.argv[2] || 'depois';
  const conta = await semear();
  conta.produtor = (await api('GET', `/produtores/${conta.id}`, conta.token)).dados;
  const { browser, page } = await abrirNavegador();
  await page.goto(WEB + '/login', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: `${pasta}/${prefixo}-01-login.png` });
  await page.evaluate(({ token, produtor }) => {
    localStorage.setItem('user_token', token);
    localStorage.setItem('user_data', JSON.stringify(produtor));
  }, conta);
  for (const [nome, rota, logado = true] of TELAS) {
    if (!logado) continue;
    await page.goto(WEB + rota, { waitUntil: 'networkidle' }).catch(() => {});
    await page.waitForTimeout(2500);
    await page.screenshot({ path: `${pasta}/${prefixo}-${nome}.png` });
    console.log('captura', prefixo, nome);
  }
  await browser.close();
})();
