/* Tests estáticos estructurales e integridad referencial — DOMUS */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const css = fs.readFileSync(path.join(ROOT, 'styles.css'), 'utf8');
const js = fs.readFileSync(path.join(ROOT, 'script.js'), 'utf8');

let passed = 0, failed = 0;
function ok(name) { passed++; console.log(`  PASS  ${name}`); }
function fail(name, detail) { failed++; console.log(`  FAIL  ${name}${detail ? ' → ' + detail : ''}`); }
function check(name, cond, detail) { cond ? ok(name) : fail(name, detail); }

/* ---------- 1. Balance de etiquetas HTML ---------- */
console.log('\n[1] Estructura HTML');
const VOID = new Set(['area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr']);
const tags = [...html.matchAll(/<(\/?)([a-zA-Z][a-zA-Z0-9]*)((?:"[^"]*"|'[^']*'|[^>"'])*)>/g)];
const stack = [];
let tagError = null;
for (const m of tags) {
  const [, closing, name, attrs] = m;
  const tag = name.toLowerCase();
  if (VOID.has(tag) || attrs.trim().endsWith('/')) continue;
  if (!closing) { stack.push(tag); }
  else {
    if (stack.length === 0) { tagError = `cierre sin apertura: </${tag}>`; break; }
    const top = stack.pop();
    if (top !== tag) { tagError = `se esperaba </${top}> pero apareció </${tag}>`; break; }
  }
}
if (!tagError && stack.length) tagError = `etiquetas sin cerrar: ${stack.join(', ')}`;
check('Etiquetas HTML balanceadas', !tagError, tagError);

const dupes = [...html.matchAll(/id="([^"]+)"/g)].map(m => m[1])
  .filter((v, i, a) => a.indexOf(v) !== i);
check('Sin IDs duplicados', dupes.length === 0, dupes.join(', '));

check('Atributo lang="es"', /<html lang="es"[ >]/.test(html));
check('Meta viewport presente', /name="viewport"/.test(html));
check('Meta description presente', /name="description"/.test(html));
check('Título presente', /<title>.+<\/title>/.test(html));
const imgsNoAlt = [...html.matchAll(/<img(?![^>]*alt=)[^>]*>/g)];
check('Todas las <img> tienen alt', imgsNoAlt.length === 0, `${imgsNoAlt.length} sin alt`);

/* ---------- 2. Integridad referencial ---------- */
console.log('\n[2] Integridad referencial');
const htmlIds = new Set([...html.matchAll(/id="([^"]+)"/g)].map(m => m[1]));

// IDs usados por JS con getElementById
const jsIds = [...js.matchAll(/getElementById\('([^']+)'\)/g)].map(m => m[1]);
const missingIds = jsIds.filter(id => !htmlIds.has(id));
check('IDs usados en JS existen en HTML', missingIds.length === 0, missingIds.join(', '));

// Anclas internas
const anchors = [...html.matchAll(/href="#([^"]+)"/g)].map(m => m[1]);
const badAnchors = anchors.filter(a => !htmlIds.has(a));
check('Todas las anclas #... resuelven a un ID', badAnchors.length === 0, badAnchors.join(', '));

// Assets locales referenciados en HTML y CSS
const assetRefs = new Set();
for (const m of html.matchAll(/(?:src|href)="((?:fotos\/|[\w\-]+\.(?:css|js|png|jpg))[^"]*)"/g)) assetRefs.add(m[1]);
for (const m of css.matchAll(/url\("?(fotos\/[^")]+)"?\)/g)) assetRefs.add(m[1]);
const missingAssets = [...assetRefs].filter(a => !fs.existsSync(path.join(ROOT, a)));
check('Todos los assets referenciados existen en disco', missingAssets.length === 0, missingAssets.join(', '));

// Clases que JS consulta con querySelector(All): deben existir en HTML
// o ser clases de estado agregadas dinámicamente por el propio JS
const jsClassSelectors = [...js.matchAll(/querySelectorAll\('\[data-[\w-]+\]'\)|querySelectorAll\('\.([a-z\-]+)'/g)]
  .map(m => m[1]).filter(Boolean);
const jsAddedClasses = new Set([...js.matchAll(/classList\.(?:add|toggle)\('([\w-]+)'/g)].map(m => m[1]));
const missingClasses = jsClassSelectors.filter(c =>
  !new RegExp(`class="[^"]*${c}`).test(html) && !jsAddedClasses.has(c));
check('Clases consultadas por JS existen (HTML o estado dinámico)', missingClasses.length === 0, missingClasses.join(', '));

// Clases que JS activa (classList.add/toggle) deben tener estilos en CSS
const toggled = [...js.matchAll(/classList\.(?:add|toggle)\('([\w-]+)'/g)].map(m => m[1]);
const unstyled = toggled.filter(c => !css.includes('.' + c));
check('Clases activadas por JS tienen estilos CSS', unstyled.length === 0, unstyled.join(', '));

// Campos de formulario usados por JS (contactForm.X)
const formFields = [...js.matchAll(/contactForm\.(\w+)/g)].map(m => m[1])
  .filter(f => !['addEventListener', 'reset', 'querySelector', 'querySelectorAll'].includes(f));
const htmlNames = new Set([...html.matchAll(/name="([^"]+)"/g)].map(m => m[1]));
const missingFields = formFields.filter(f => !htmlNames.has(f));
check('Campos del formulario usados en JS existen', missingFields.length === 0, missingFields.join(', '));

/* ---------- 3. CSS ---------- */
console.log('\n[3] CSS');
const openB = (css.match(/\{/g) || []).length;
const closeB = (css.match(/\}/g) || []).length;
check('Llaves balanceadas', openB === closeB, `${openB} vs ${closeB}`);

const definedVars = new Set([...css.matchAll(/(--[\w-]+)\s*:/g)].map(m => m[1]));
const usedVars = new Set([...css.matchAll(/var\((--[\w-]+)/g)].map(m => m[1]));
const undefVars = [...usedVars].filter(v => !definedVars.has(v));
check('Todas las var(--*) usadas están definidas', undefVars.length === 0, undefVars.join(', '));

check('Media queries responsive presentes (1024/900/600)', ['1024px','900px','600px'].every(bp => css.includes(bp)));
check('prefers-reduced-motion respetado', css.includes('prefers-reduced-motion'));

/* ---------- 4. Contenido según prompt ---------- */
console.log('\n[4] Contenido requerido por el diseño');
const requiredTexts = [
  'Encontrá el depto ideal', 'atención personalizada',
  'Explorá las mejores', '¿Por qué elegir', 'somos tu aliado',
  '¿Tenés dudas? Estamos para ayudarte', 'PUBLICÁ TU PROPIEDAD'.toLowerCase(),
  '$ 480.000', '$ 650.000', '$ 690.000', '$ 520.000',
  '$ 380.000', '$ 420.000', '$ 450.000', '$ 1.500.000',
  '380 454 8961', 'Mariano Moreno 234', 'La Rioja',
  'Tasaciones', 'Administración', 'Newsletter'
];
const requiredUrls = ['wa.me/5493804548961', 'socten_inmobiliaria', 'socteninmobiliaira', 'maps.app.goo.gl'];
// Normalizar: quitar tags y colapsar espacios para comparar texto visible
const visibleText = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').toLowerCase();
const missingTexts = requiredTexts.filter(t => !visibleText.includes(t.toLowerCase()));
check('Textos clave del diseño presentes', missingTexts.length === 0, missingTexts.join(' | '));

const missingUrls = requiredUrls.filter(u => !html.includes(u));
check('URLs de contacto reales presentes (WhatsApp/IG/FB/maps)', missingUrls.length === 0, missingUrls.join(' | '));

const cardCount = (html.match(/class="card reveal"/g) || []).length;
check('8 tarjetas de propiedades', cardCount === 8, `encontradas: ${cardCount}`);

const badgeBrand = (html.match(/badge--brand/g) || []).length;
const badgeDark = (html.match(/badge--dark/g) || []).length;
check('4 badges DESTACADA + 4 NUEVA', badgeBrand === 4 && badgeDark === 4, `brand=${badgeBrand} dark=${badgeDark}`);

check('Botón flotante de WhatsApp presente', /class="wa-float"/.test(html) && /wa\.me\/5493804548961/.test(html));

const counters = (html.match(/data-count=/g) || []).length;
check('6 contadores animados (4 hero + 2 nosotros)', counters === 6, `encontrados: ${counters}`);

const sections = ['inicio','propiedades','servicios','nosotros','contacto'];
check('5 secciones ancladas', sections.every(s => htmlIds.has(s)));

/* ---------- 5. JS funciones clave ---------- */
console.log('\n[5] Funcionalidades JS implementadas');
const jsFeatures = {
  'Preloader con fallback': /setTimeout\(onIntroDone, 4000\)/.test(js),
  'Navbar scroll': /is-scrolled/.test(js),
  'Menú hamburguesa + Escape': /Escape/.test(js),
  'IntersectionObserver reveals': /IntersectionObserver/.test(js) && /is-visible/.test(js),
  'Contadores con easing': /animateCounter/.test(js) && /requestAnimationFrame/.test(js),
  'Parallax hero': /parallaxHero/.test(js),
  'Tilt 3D': /data-tilt/.test(js) && /rotateX/.test(js),
  'Botones magnéticos': /data-magnetic/.test(js),
  'Validación email regex': /EMAIL_RE/.test(js),
  'Formato es-AR en números': /es-AR/.test(js),
  'Año automático': /getFullYear/.test(js)
};
for (const [name, cond] of Object.entries(jsFeatures)) check(name, cond);

/* ---------- Resumen ---------- */
console.log(`\n========================================`);
console.log(`RESULTADO: ${passed} pasados, ${failed} fallidos`);
console.log(`========================================`);
process.exit(failed ? 1 : 0);
