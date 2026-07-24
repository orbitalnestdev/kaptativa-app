/* ============================================================
   Tests funcionales E2E via Chrome DevTools Protocol — DOMUS
   Sin dependencias (WebSocket nativo de Node 24)
   ============================================================ */
const fs = require('fs');
const CDP_PORT = 9223;
const BASE = 'http://127.0.0.1:8123';
const TMP = __dirname;

let passed = 0, failed = 0;
const ok = n => { passed++; console.log(`  PASS  ${n}`); };
const bad = (n, d) => { failed++; console.log(`  FAIL  ${n}${d ? ' → ' + d : ''}`); };
const check = (n, c, d) => c ? ok(n) : bad(n, d);
const sleep = ms => new Promise(r => setTimeout(r, ms));

/* ---------- Cliente CDP mínimo ---------- */
let msgId = 0;
const pending = new Map();
let ws;
const consoleErrors = [];
const exceptions = [];

function send(method, params = {}) {
  return new Promise((resolve, reject) => {
    const id = ++msgId;
    pending.set(id, { resolve, reject });
    ws.send(JSON.stringify({ id, method, params }));
  });
}

async function evaluate(expr, awaitPromise = false) {
  const res = await send('Runtime.evaluate', {
    expression: expr, returnByValue: true, awaitPromise
  });
  if (res.exceptionDetails) throw new Error('Evaluate falló: ' + JSON.stringify(res.exceptionDetails.exception?.description || res.exceptionDetails.text));
  return res.result.value;
}

async function waitFor(expr, timeout = 8000, poll = 200) {
  const t0 = Date.now();
  while (Date.now() - t0 < timeout) {
    if (await evaluate(expr)) return true;
    await sleep(poll);
  }
  return false;
}

async function main() {
  /* ---- Conectar ---- */
  let target = null;
  for (let i = 0; i < 40 && !target; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${CDP_PORT}/json`);
      const list = await res.json();
      target = list.find(t => t.type === 'page');
    } catch { await sleep(400); }
  }
  if (!target) { console.log('No se encontró target CDP'); process.exit(2); }

  ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);
  ws.onmessage = ev => {
    const msg = JSON.parse(ev.data);
    if (msg.id && pending.has(msg.id)) {
      pending.get(msg.id).resolve(msg.result || {});
      pending.delete(msg.id);
    } else if (msg.method === 'Runtime.consoleAPICalled' && msg.params.type === 'error') {
      consoleErrors.push(msg.params.args.map(a => a.value ?? a.description).join(' '));
    } else if (msg.method === 'Runtime.exceptionThrown') {
      exceptions.push(msg.params.exceptionDetails.exception?.description || msg.params.exceptionDetails.text);
    }
  };

  await send('Page.enable');
  await send('Runtime.enable');
  await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });

  /* ============================================================
     BLOQUE 1 — Carga inicial y JS básico
     ============================================================ */
  console.log('\n[B1] Carga inicial');
  await send('Page.navigate', { url: BASE });
  const loaded = await waitFor('document.readyState === "complete"', 15000);
  check('Documento cargado completamente', loaded);

  const title = await evaluate('document.title');
  check('Título correcto', title.includes('Socten'), title);

  const preloaderGone = await waitFor(`document.getElementById('preloader').classList.contains('is-done')`, 8000);
  check('Preloader se oculta tras la carga', preloaderGone);

  const bodyUnlocked = await evaluate(`!document.body.classList.contains('is-locked')`);
  check('Scroll del body liberado', bodyUnlocked);

  const waFloat = await evaluate(`(() => {
    const wa = document.querySelector('.wa-float');
    if (!wa) return false;
    const cs = getComputedStyle(wa);
    return cs.position === 'fixed' && wa.href.includes('wa.me/5493804548961') && cs.backgroundColor === 'rgb(37, 211, 102)';
  })()`);
  check('Botón flotante WhatsApp: fijo, verde, link correcto', waFloat);

  const year = await evaluate(`document.getElementById('year').textContent`);
  check('Año automático en footer = 2026', year === '2026', year);

  const heroImgOk = await evaluate(`(() => { const i = document.querySelector('.hero__img'); return i.complete && i.naturalWidth > 500; })()`);
  check('Imagen del hero cargada (naturalWidth > 500)', heroImgOk);

  const imgsInitial = await evaluate(`[...document.images].filter(i => i.complete && i.naturalWidth > 0).length`);
  check('Imágenes above-the-fold cargan de inmediato (≥5)', imgsInitial >= 5, `cargadas: ${imgsInitial}/11`);

  /* ============================================================
     BLOQUE 2 — Reveals, contadores e interacciones de scroll
     ============================================================ */
  console.log('\n[B2] Scroll, reveals y contadores');
  await sleep(3000); // deja correr la red de seguridad de reveals del hero
  const heroStatsVisible = await evaluate(`document.querySelectorAll('.hero__stats .reveal.is-visible').length`);
  check('Stats del hero revelados (4)', heroStatsVisible === 4, `${heroStatsVisible}/4`);

  const counterDone = await waitFor(`document.querySelector('.hero__stats .stat__num').textContent === '+150'`, 6000);
  check('Contador hero llega a +150', counterDone,
    await evaluate(`document.querySelector('.hero__stats .stat__num').textContent`));

  await evaluate(`document.getElementById('propiedades').scrollIntoView()`);
  await sleep(1500);
  const cardsRow1 = await evaluate(`document.querySelectorAll('#propiedades .card.is-visible').length`);
  check('Primera fila de tarjetas se revela (4)', cardsRow1 === 4, `${cardsRow1}/4`);

  await evaluate(`document.querySelector('.properties__more').scrollIntoView()`);
  await sleep(1500);
  const cardsAll = await evaluate(`document.querySelectorAll('#propiedades .card.is-visible').length`);
  check('Segunda fila se revela al seguir scrolleando (8 total)', cardsAll === 8, `${cardsAll}/8`);

  const navbarSolid = await evaluate(`document.getElementById('navbar').classList.contains('is-scrolled')`);
  check('Navbar se solidifica al scrollear', navbarSolid);

  const toTopVisible = await evaluate(`document.getElementById('toTop').classList.contains('is-visible')`);
  check('Botón "volver arriba" aparece tras scroll', toTopVisible);

  await evaluate(`document.getElementById('nosotros').scrollIntoView()`);
  await sleep(2500);
  const aboutCounter = await evaluate(`[...document.querySelectorAll('.about__stats .stat__num')].map(e => e.textContent).join('|')`);
  check('Contadores de Nosotros (+5|+300)', aboutCounter === '+5|+300', aboutCounter);

  const imgsTotal = await evaluate(`[...document.images].filter(i => i.complete && i.naturalWidth > 0).length`);
  check('Los 10 <img> cargaron tras recorrer la página (lazy loading OK)', imgsTotal === 10, `cargadas: ${imgsTotal}/10`);

  const contactBgOk = await evaluate(`getComputedStyle(document.querySelector('.contact__bg')).backgroundImage.includes('02-living-luz-natural')`);
  check('Fondo CSS de contacto referenciado correctamente', contactBgOk);

  /* ============================================================
     BLOQUE 3 — Formulario de contacto
     ============================================================ */
  console.log('\n[B3] Formulario de contacto');
  await evaluate(`document.getElementById('contacto').scrollIntoView()`);
  await sleep(800);

  // Envío con campos vacíos → debe marcar errores
  await evaluate(`document.querySelector('#contactForm button[type="submit"]').click()`);
  await sleep(400);
  const errCount = await evaluate(`document.querySelectorAll('#contactForm .has-error').length`);
  check('Validación marca campos requeridos vacíos', errCount >= 3, `marcados: ${errCount}`);
  const errMsg = await evaluate(`document.getElementById('formFeedback').textContent`);
  check('Mensaje de error visible', errMsg.includes('Revisá'), errMsg);

  // Email inválido
  await evaluate(`(() => {
    const f = document.getElementById('contactForm');
    f.nombre.value = 'Juan Test';
    f.email.value = 'correo-invalido';
    f.motivo.value = 'Quiero alquilar una propiedad';
    f.mensaje.value = 'Hola, me interesa una casa.';
  })()`);
  await evaluate(`document.querySelector('#contactForm button[type="submit"]').click()`);
  await sleep(400);
  const emailErr = await evaluate(`document.getElementById('contactForm').email.classList.contains('has-error')`);
  check('Email inválido es rechazado', emailErr);

  // Envío válido
  await evaluate(`document.getElementById('contactForm').email.value = 'juan@test.com'`);
  await evaluate(`document.querySelector('#contactForm button[type="submit"]').click()`);
  await sleep(500);
  const okMsg = await evaluate(`document.getElementById('formFeedback').textContent`);
  check('Envío válido muestra confirmación personalizada', okMsg.includes('Gracias, Juan'), okMsg);
  const btnLabel = await evaluate(`document.querySelector('#contactForm .btn__label').textContent`);
  check('Botón cambia a "Consulta enviada ✓"', btnLabel.includes('enviada'), btnLabel);

  /* ============================================================
     BLOQUE 4 — Newsletter
     ============================================================ */
  console.log('\n[B4] Newsletter');
  await evaluate(`(() => { const n = document.querySelector('#newsletterForm input'); n.value = 'mal'; })()`);
  await evaluate(`document.querySelector('#newsletterForm button').click()`);
  await sleep(300);
  const newsErr = await evaluate(`document.getElementById('newsletterFeedback').textContent`);
  check('Newsletter rechaza email inválido', newsErr.includes('válido'), newsErr);

  await evaluate(`(() => { const n = document.querySelector('#newsletterForm input'); n.value = 'ok@test.com'; })()`);
  await evaluate(`document.querySelector('#newsletterForm button').click()`);
  await sleep(300);
  const newsOk = await evaluate(`document.getElementById('newsletterFeedback').textContent`);
  check('Newsletter confirma suscripción', newsOk.includes('suscripto'), newsOk);

  /* ============================================================
     BLOQUE 5 — Responsive mobile + menú hamburguesa
     ============================================================ */
  console.log('\n[B5] Mobile (390px) y menú');
  await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 2, mobile: true });
  await evaluate(`window.scrollTo(0, 0)`);
  await sleep(600);

  const navHidden = await evaluate(`getComputedStyle(document.querySelector('.nav')).display === 'none'`);
  check('Nav desktop oculto en mobile', navHidden);

  const burgerVisible = await evaluate(`getComputedStyle(document.getElementById('hamburger')).display === 'flex'`);
  check('Hamburguesa visible en mobile', burgerVisible);

  await evaluate(`document.getElementById('hamburger').click()`);
  await sleep(500);
  const menuOpen = await evaluate(`document.getElementById('mobileMenu').classList.contains('is-open')`);
  check('Menú mobile abre al tocar hamburguesa', menuOpen);

  const lockOn = await evaluate(`document.body.classList.contains('is-locked')`);
  check('Body se bloquea con menú abierto', lockOn);

  // Screenshot del menú abierto
  const menuShot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(`${TMP}\\e2e-menu-mobile.png`, Buffer.from(menuShot.data, 'base64'));

  await evaluate(`document.querySelector('.mobile-menu__link[href="#propiedades"]').click()`);
  await sleep(700);
  const menuClosed = await evaluate(`!document.getElementById('mobileMenu').classList.contains('is-open')`);
  check('Menú cierra al elegir una sección', menuClosed);

  const gridCols = await evaluate(`getComputedStyle(document.querySelector('.properties__grid')).gridTemplateColumns.split(' ').length`);
  check('Grilla de propiedades = 1 columna en mobile', gridCols === 1, `cols: ${gridCols}`);

  /* ============================================================
     BLOQUE 6 — Screenshots full-page (captureBeyondViewport)
     ============================================================ */
  console.log('\n[B6] Screenshots full-page por CDP');
  await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
  await evaluate(`window.scrollTo(0, 0)`);
  await sleep(1000);
  // Revelar todo para la captura (simula usuario que scrolleó todo)
  await evaluate(`document.querySelectorAll('.reveal').forEach(el => el.classList.add('is-visible'))`);
  await sleep(1200);

  const metrics = await send('Page.getLayoutMetrics');
  const fullHeight = Math.ceil(metrics.cssContentSize.height);
  console.log(`  (altura total del documento: ${fullHeight}px)`);

  const full = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true });
  fs.writeFileSync(`${TMP}\\e2e-full-desktop.png`, Buffer.from(full.data, 'base64'));
  ok('Captura full-page desktop guardada');

  try {
    await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
    await evaluate(`window.scrollTo(0, 0)`);
    await sleep(800);
    await evaluate(`document.querySelectorAll('.reveal').forEach(el => el.classList.add('is-visible'))`);
    await sleep(1000);
    const fullM = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true });
    fs.writeFileSync(`${TMP}\\e2e-full-mobile.png`, Buffer.from(fullM.data, 'base64'));
    ok('Captura full-page mobile guardada');
  } catch (e) {
    bad('Captura full-page mobile', e.message);
  }

  /* ============================================================
     BLOQUE 7 — Consola limpia
     ============================================================ */
  console.log('\n[B7] Errores de consola y excepciones');
  check('Sin excepciones JS en toda la sesión', exceptions.length === 0, exceptions.slice(0, 3).join(' || '));
  check('Sin console.error de la página', consoleErrors.length === 0, consoleErrors.slice(0, 3).join(' || '));

  console.log(`\n========================================`);
  console.log(`RESULTADO E2E: ${passed} pasados, ${failed} fallidos`);
  console.log(`========================================`);
  ws.close();
  process.exit(failed ? 1 : 0);
}

main().catch(e => { console.error('ERROR FATAL:', e.message); process.exit(2); });
