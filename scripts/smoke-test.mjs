// Prueba de humo del build de producción: levanta server.mjs y verifica rutas, redirecciones,
// archivos que no deben publicarse, compresión, cabeceras de seguridad y sitemap.
// Uso: npm test  (compila y corre esta prueba)
import { spawn } from 'node:child_process';
import { readFileSync } from 'node:fs';

const PORT = 4399;
const BASE = `http://127.0.0.1:${PORT}`;
const soluciones = ['tiendas-online', 'mayoristas', 'gastronomia', 'gimnasios-y-clubes', 'turnos-y-cursos', 'inmobiliarias', 'asociaciones-y-mutuales', 'servicios-profesionales'];
const servicios = ['agentes-ia', 'automatizacion', 'desarrollo-software', 'diseno-web', 'email-marketing', 'publicidad-digital', 'seo-geo', 'social-media'];

const checks = [
  ...['/', '/contacto/', '/nosotros/', '/servicios/', '/soluciones/', '/precios/', '/proyectos/', '/inmobiliarias/', '/llms.txt', '/robots.txt', '/sitemap-index.xml'].map((p) => [p, 200]),
  ...soluciones.map((s) => [`/soluciones/${s}/`, 200]),
  ...servicios.map((s) => [`/servicios/${s}/`, 200]),
  ['/home2', 301], ['/blog', 301], ['/inmo-demo', 301],
  ['/Realstate/prompt.md', 404], ['/Realstate/tests/test-static.cjs', 404], ['/logo-proposals', 404],
];
const REQUIRED_HEADERS = ['strict-transport-security', 'x-content-type-options', 'x-frame-options', 'referrer-policy', 'content-security-policy-report-only'];

const server = spawn(process.execPath, ['server.mjs'], { env: { ...process.env, PORT: String(PORT), HOST: '127.0.0.1' }, stdio: 'ignore' });
const failures = [];
const fail = (msg) => failures.push(msg);

try {
  for (let i = 0; i < 50; i++) {
    try { await fetch(BASE + '/robots.txt'); break; } catch { await new Promise((r) => setTimeout(r, 100)); }
  }

  for (const [path, expected] of checks) {
    const res = await fetch(BASE + path, { redirect: 'manual' });
    if (res.status !== expected) fail(`${path}: esperaba ${expected}, respondió ${res.status}`);
  }

  const home = await fetch(BASE + '/', { headers: { 'accept-encoding': 'br, gzip' } });
  if (!/br|gzip/.test(home.headers.get('content-encoding') || '')) fail('La home no viene comprimida');
  for (const h of REQUIRED_HEADERS) if (!home.headers.get(h)) fail(`Falta la cabecera ${h}`);
  const html = await home.text();
  if (/fonts\.googleapis\.com/.test(html)) fail('La home todavía carga Google Fonts');
  if (!/"@type":"ProfessionalService"/.test(html)) fail('La home no tiene el JSON-LD ProfessionalService');

  const sol = await (await fetch(BASE + '/soluciones/tiendas-online/')).text();
  if (!/"@type":"FAQPage"/.test(sol)) fail('Tiendas online no tiene el JSON-LD FAQPage');

  const sitemap = readFileSync('dist/client/sitemap-0.xml', 'utf8');
  for (const hidden of ['/home-anterior', '/logo-proposals', '/admin', '/blog']) {
    if (sitemap.includes(hidden)) fail(`El sitemap incluye ${hidden}`);
  }
} finally {
  server.kill();
}

if (failures.length) {
  console.error(`✗ ${failures.length} problema(s):\n- ` + failures.join('\n- '));
  process.exit(1);
}
console.log(`✓ Prueba de humo OK (${checks.length} rutas, compresión, cabeceras, JSON-LD y sitemap)`);
