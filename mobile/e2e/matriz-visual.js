/* Matriz de QA visual: todas as rotas × 4 tamanhos de tela (tema claro).
 * Detecta: rolagem horizontal da página, elementos cortados fora da tela e campos sobrepostos.
 * Uso: npm run e2e:visual   (BASE_URL/API_URL como no e2e; capturas em e2e/screenshots/matriz/)
 */
const fs = require('fs');
const { chromium } = require('playwright');
const { WEB, API, api, aquecerApi } = require('./lib');
const { semear } = require('./semear');

const TAMANHOS = [
  { nome: '360x740', width: 360, height: 740, mobile: true },
  { nome: '390x844', width: 390, height: 844, mobile: true },
  { nome: '768x1024', width: 768, height: 1024, mobile: true },
  { nome: '1366x768', width: 1366, height: 768, mobile: false },
];
const PASTA = `${__dirname}/screenshots/matriz`;
const PROXY = process.env.HTTPS_PROXY || process.env.https_proxy;

/** Verificações executadas dentro da página. */
function inspecionar() {
  const vw = window.innerWidth;
  const problemas = [];
  const doc = document.documentElement;
  if (doc.scrollWidth > vw + 1) problemas.push(`rolagem horizontal da página (${doc.scrollWidth}px > ${vw}px)`);
  const recortaX = (el) => {
    for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) {
      const s = getComputedStyle(p);
      if (['auto', 'scroll', 'hidden', 'clip'].includes(s.overflowX)) {
        const r = p.getBoundingClientRect();
        if (r.right <= vw + 1 && r.left >= -1) return true; // contido num contêiner que rola/recorta dentro da tela
      }
    }
    return false;
  };
  const visivel = (el) => {
    const s = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    return s.visibility !== 'hidden' && s.display !== 'none' && Number(s.opacity) > 0 && r.width > 0 && r.height > 0;
  };
  const alvos = [...document.querySelectorAll('input, textarea, [role="button"], button, [role="radio"], [role="checkbox"]')]
    .filter((el) => visivel(el) && !el.closest('.leaflet-container'));
  for (const el of alvos) {
    const r = el.getBoundingClientRect();
    if ((r.right > vw + 1 || r.left < -1) && !recortaX(el)) {
      const nome = (el.getAttribute('aria-label') || el.getAttribute('placeholder') || el.innerText || el.tagName).trim().slice(0, 40);
      problemas.push(`cortado na lateral: "${nome}" (${Math.round(r.left)}–${Math.round(r.right)}px)`);
    }
  }
  const campos = [...document.querySelectorAll('input, textarea')].filter(visivel);
  for (let i = 0; i < campos.length; i++) {
    for (let j = i + 1; j < campos.length; j++) {
      const a = campos[i].getBoundingClientRect();
      const b = campos[j].getBoundingClientRect();
      const x = Math.min(a.right, b.right) - Math.max(a.left, b.left);
      const y = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
      if (x > 4 && y > 4) problemas.push(`campos sobrepostos: "${campos[i].placeholder || campos[i].getAttribute('aria-label')}" × "${campos[j].placeholder || campos[j].getAttribute('aria-label')}"`);
    }
  }
  // Campo coberto por outro elemento (ex.: cabeçalho por cima do 1º campo).
  for (const el of campos) {
    const r = el.getBoundingClientRect();
    // Ignora a faixa do cabeçalho fixo (60 px) e do menu inferior (64 px): o conteúdo rola por baixo deles.
    if (r.top < 64 || r.bottom > window.innerHeight - 70) continue;
    const topo = document.elementFromPoint(r.left + r.width / 2, r.top + Math.min(r.height / 2, 12));
    if (topo && topo !== el && !el.contains(topo) && !topo.contains(el) && !topo.closest('label')) {
      problemas.push(`campo coberto: "${el.placeholder || el.getAttribute('aria-label')}" por <${topo.tagName.toLowerCase()}> "${(topo.innerText || '').trim().slice(0, 30)}"`);
    }
  }
  return [...new Set(problemas)];
}

(async () => {
  fs.mkdirSync(PASTA, { recursive: true });
  await aquecerApi();
  const conta = await semear();
  const produtor = (await api('GET', `/produtores/${conta.id}`, conta.token)).dados;
  const ids = {
    apiario: conta.apiario.id,
    colmeia: conta.colmeias[0].id,
    vistoria: (await api('GET', `/vistorias/${conta.id}`, conta.token)).dados[0]?.id,
    producao: (await api('GET', `/producoes/${conta.id}`, conta.token)).dados[0]?.id,
    insumo: (await api('GET', `/insumos/${conta.id}`, conta.token)).dados[0]?.id,
    lote: (await api('GET', `/lotes/${conta.id}/detalhado`, conta.token)).dados[0]?.id,
  };
  const publicas = ['/login', '/cadastro', '/redefinirSenha'];
  const privadas = [
    '/', '/apiario', '/apiario/listar', '/apiario/cadastrar', `/apiario/editar?id=${ids.apiario}`, '/apiario/colmeia/cadastrar',
    `/apiario/colmeia/editar?id=${ids.colmeia}`, '/apiario/dashboardApiario', '/apiario/dashboardColmeia', '/apiario/tabelaApiario',
    '/apiario/tabelaColmeia', '/vistorias', '/vistorias/cadastrar', '/vistorias/listar', `/vistorias/${ids.vistoria}`,
    `/vistorias/editar?id=${ids.vistoria}`, '/vistorias/dashboard', '/vistorias/tabela', '/producao', '/producao/cadastrar',
    '/producao/listar', `/producao/editar?id=${ids.producao}`, '/producao/dashboard', '/producao/tabela', '/insumos',
    '/insumos/cadastrar', '/insumos/listar', `/insumos/${ids.insumo}`, `/insumos/editar?id=${ids.insumo}`, '/insumos/dashboard',
    '/insumos/tabela', '/rastreabilidade', '/rastreabilidade/cadastrar', '/rastreabilidade/listar',
    `/rastreabilidade/editar?id=${ids.lote}`, '/rastreabilidade/dashboard', '/rastreabilidade/tabela', '/relatorio', '/mapa',
    '/notificacao', '/perfil', '/configuracao', '/configuracao/webhooks', '/sincronizacao', '/tutorial',
  ];

  const browser = await chromium.launch(PROXY ? { proxy: { server: PROXY, bypass: 'localhost,127.0.0.1' } } : {});
  const matriz = {};
  for (const t of TAMANHOS) {
    const context = await browser.newContext({
      viewport: { width: t.width, height: t.height }, isMobile: t.mobile, hasTouch: t.mobile, deviceScaleFactor: 1,
      permissions: ['geolocation'], geolocation: { latitude: -7.0247, longitude: -37.2806 }, locale: 'pt-BR',
    });
    if (process.env.E2E_PONTE_API === '1') {
      await context.route(`${API}/**`, async (route) => {
        const cors = { 'access-control-allow-origin': route.request().headers().origin || WEB, 'access-control-allow-headers': 'authorization,content-type,accept,idempotency-key', 'access-control-allow-methods': 'GET,POST,PUT,DELETE,OPTIONS', 'access-control-expose-headers': 'Content-Disposition' };
        if (route.request().method() === 'OPTIONS') return route.fulfill({ status: 204, headers: cors });
        const { origin: _o, referer: _r, ...h } = route.request().headers();
        const resp = await route.fetch({ headers: h });
        return route.fulfill({ response: resp, headers: { ...resp.headers(), ...cors } });
      });
    }
    const page = await context.newPage();
    page.on('dialog', (d) => d.accept());
    fs.mkdirSync(`${PASTA}/${t.nome}`, { recursive: true });
    for (const rota of [...publicas, ...privadas]) {
      if (rota === privadas[0]) {
        await page.evaluate(({ token, produtor }) => {
          localStorage.setItem('user_token', token);
          localStorage.setItem('user_data', JSON.stringify(produtor));
        }, { token: conta.token, produtor });
      }
      await page.goto(WEB + rota, { waitUntil: 'load', timeout: 90000 }).catch(() => {});
      await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
      await page.waitForTimeout(1500);
      const problemas = await page.evaluate(inspecionar).catch((e) => [`erro ao inspecionar: ${e.message}`]);
      const arquivo = rota.replace(/^\//, '').replace(/[/?=]/g, '_') || 'inicio';
      await page.screenshot({ path: `${PASTA}/${t.nome}/${arquivo}.jpg`, type: 'jpeg', quality: 55 });
      (matriz[rota] ||= {})[t.nome] = problemas;
      console.log(`${problemas.length ? 'PROBLEMA' : 'OK      '} ${t.nome} ${rota}${problemas.length ? ' — ' + problemas.join(' | ') : ''}`);
    }
    await context.close();
  }
  await browser.close();
  fs.writeFileSync(`${__dirname}/matriz-visual.json`, JSON.stringify(matriz, null, 2));
  const total = Object.values(matriz).flatMap((m) => Object.values(m)).length;
  const comProblema = Object.values(matriz).flatMap((m) => Object.values(m)).filter((p) => p.length).length;
  console.log(`\nMatriz: ${total - comProblema}/${total} combinações sem problemas`);
})();
