// Utilitários do E2E BeesCaatinga (Playwright puro, sem @playwright/test).
const { chromium } = require('playwright');

// Padrão: link público de homologação. Para rodar local, defina BASE_URL/API_URL (ou E2E_WEB_URL/E2E_API_URL).
const WEB = (process.env.BASE_URL || process.env.E2E_WEB_URL || 'https://beescaatinga-hml.vercel.app').replace(/\/+$/, '');
const API = (process.env.API_URL || process.env.E2E_API_URL || 'https://beescaatinga-api-hml.onrender.com').replace(/\/+$/, '');
// Em ambientes com proxy de saída (HTTPS_PROXY), o Chromium também precisa usá-lo.
const PROXY = process.env.HTTPS_PROXY || process.env.https_proxy;
const SHOTS = `${__dirname}/screenshots`;

const resultados = []; // { secao, item, ok, detalhe }
const problemas = { console: [], rede: [] };

function registrar(secao, item, ok, detalhe = '') {
  resultados.push({ secao, item, ok, detalhe });
  console.log(`${ok ? '  OK   ' : '  FALHA'} [${secao}] ${item}${detalhe ? ' — ' + detalhe : ''}`);
}

/** Compara campos esperados com o objeto retornado pela API. */
function conferir(secao, obj, esperado) {
  for (const [campo, valor] of Object.entries(esperado)) {
    const atual = campo.split('.').reduce((o, k) => (o == null ? o : o[k]), obj);
    const ok = JSON.stringify(normalizar(atual)) === JSON.stringify(normalizar(valor));
    registrar(secao, `campo ${campo}`, ok, ok ? JSON.stringify(atual) : `esperado ${JSON.stringify(valor)}, obtido ${JSON.stringify(atual)}`);
  }
}
const normalizar = (v) => (Array.isArray(v) ? [...v].map(String).sort() : typeof v === 'number' ? Number(v.toFixed(6)) : v);

async function api(metodo, caminho, token, corpo) {
  const r = await fetch(API + caminho, {
    method: metodo,
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: corpo ? JSON.stringify(corpo) : undefined,
  });
  const texto = await r.text();
  let dados = texto;
  try { dados = JSON.parse(texto); } catch { /* texto puro */ }
  return { status: r.status, dados };
}

async function abrirNavegador() {
  const browser = await chromium.launch(PROXY ? { proxy: { server: PROXY, bypass: 'localhost,127.0.0.1' } } : {});
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
    permissions: ['geolocation'],
    geolocation: { latitude: -7.0247, longitude: -37.2806 }, // Patos-PB
    locale: 'pt-BR',
  });
  // Execução local contra a API pública: o CORS do backend só libera o domínio da Vercel.
  // Com E2E_PONTE_API=1 as chamadas à API passam pelo Playwright (fora do navegador) e recebem cabeçalhos CORS.
  // Marca o modo offline simulado (erros de rede esperados nesse período não contam como defeito).
  const setOfflineOriginal = context.setOffline.bind(context);
  context.setOffline = async (v) => { context.__offline = v; return setOfflineOriginal(v); };
  if (process.env.E2E_PONTE_API === '1') {
    await context.route(`${API}/**`, async (route) => {
      if (context.__offline) return route.abort('internetdisconnected');
      const origem = route.request().headers()['origin'] || WEB;
      const cors = {
        'access-control-allow-origin': origem,
        'access-control-allow-headers': 'authorization,content-type,accept,idempotency-key',
        'access-control-allow-methods': 'GET,POST,PUT,DELETE,OPTIONS',
        'access-control-expose-headers': 'Content-Disposition',
      };
      if (route.request().method() === 'OPTIONS') return route.fulfill({ status: 204, headers: cors });
      try {
        const { origin: _o, referer: _r, ...cabecalhos } = route.request().headers();
        const resp = await route.fetch({ headers: cabecalhos });
        await route.fulfill({ response: resp, headers: { ...resp.headers(), ...cors } });
      } catch {
        await route.abort('failed');
      }
    });
  }
  const page = await context.newPage();
  page.on('console', (m) => {
    // Tiles do OpenStreetMap ficam bloqueados no sandbox de CI (sem internet); não é defeito do app.
    if (context.__offline || /ERR_INTERNET_DISCONNECTED/.test(m.text())) return;
    if (m.type() === 'error' && !/ERR_TUNNEL_CONNECTION_FAILED|ERR_NAME_NOT_RESOLVED/.test(m.text())) problemas.console.push(`${page.url()} :: ${m.text().slice(0, 300)}`);
  });
  page.on('pageerror', (e) => problemas.console.push(`${page.url()} :: pageerror ${e.message.slice(0, 300)}`));
  page.on('requestfailed', (r) => {
    if (context.__offline || /ERR_INTERNET_DISCONNECTED/.test(r.failure()?.errorText || '')) return;
    if (!/fonts|favicon|tile\.openstreetmap/.test(r.url())) problemas.rede.push(`FALHOU ${r.method()} ${r.url()} (${r.failure()?.errorText})`);
  });
  page.on('response', (r) => {
    if (r.status() >= 400 && r.url().startsWith(API)) problemas.rede.push(`HTTP ${r.status()} ${r.request().method()} ${r.url()}`);
  });
  // Alertas/confirmações nativos (polyfill web do Alert.alert) são aceitos e registrados.
  page.dialogs = [];
  page.on('dialog', async (d) => { page.dialogs.push(d.message()); await d.accept(); });
  return { browser, page };
}

/** Helpers de interação com componentes React Native Web. */
function ui(page) {
  const h = {
    ir: async (rota) => { await page.goto(WEB + rota, { waitUntil: 'networkidle' }); await page.waitForTimeout(600); },
    preencher: async (placeholder, valor, nth = 0) => {
      const el = page.getByPlaceholder(placeholder, { exact: true }).nth(nth);
      await el.click(); await el.fill(''); await el.pressSequentially(String(valor), { delay: 5 });
    },
    // Preenche o input que segue um rótulo (para inputs sem placeholder único).
    preencherPorRotulo: async (rotulo, valor) => {
      const el = page.locator(`xpath=//*[normalize-space(text())="${rotulo}"]/following::input[1]`).first();
      await el.click(); await el.fill(''); await el.pressSequentially(String(valor), { delay: 5 });
    },
    // Clica no último elemento com o texto (botões ficam abaixo do título homônimo do cabeçalho).
    clicar: async (texto) => { await page.getByText(texto, { exact: true }).last().click(); await page.waitForTimeout(400); },
    selecionar: async (textoAtual, opcao) => {
      await page.getByText(textoAtual, { exact: true }).first().click();
      await page.waitForTimeout(300);
      await page.getByText(opcao, { exact: true }).last().click();
      await page.waitForTimeout(300);
    },
    marcar: async (rotulo) => {
      await page.locator(`xpath=//*[normalize-space(text())="${rotulo}"]/preceding::input[@type="checkbox"][1]`).last().click({ force: true });
    },
    aguardarUrl: async (re, ms = 8000) => { await page.waitForURL(re, { timeout: ms }).catch(() => {}); return re.test(page.url()); },
    foto: async (nome) => page.screenshot({ path: `${SHOTS}/${nome}.png`, fullPage: false }),
    texto: () => page.innerText('body'),
    ultimoDialogo: () => page.dialogs[page.dialogs.length - 1] || '',
  };
  return h;
}

module.exports = { WEB, API, api, abrirNavegador, ui, registrar, conferir, resultados, problemas };
