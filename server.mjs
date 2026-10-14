// Servidor de producción: envuelve el handler standalone de Astro para agregar
// compresión (gzip/brotli) y cabeceras de seguridad a TODAS las respuestas,
// incluidas las páginas pregeneradas y los archivos estáticos.
import http from 'node:http';
import compression from 'compression';

process.env.ASTRO_NODE_AUTOSTART = 'disabled';
const { handler } = await import('./dist/server/entry.mjs');

const compress = compression({ threshold: 1024 });

const SECURITY_HEADERS = {
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'X-Content-Type-Options': 'nosniff',
  // SAMEORIGIN (no DENY): la demo inmobiliaria se muestra en un iframe del propio sitio
  'X-Frame-Options': 'SAMEORIGIN',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=()',
  'Cross-Origin-Opener-Policy': 'same-origin',
};

// Content Security Policy en modo SOLO REPORTE: el navegador avisa en consola qué bloquearía, sin bloquear.
// Cuando no aparezcan avisos en uso real, cambiar el nombre de la cabecera a 'Content-Security-Policy'.
const appwriteOrigin = (() => {
  try { return new URL(process.env.PUBLIC_APPWRITE_ENDPOINT || '').origin; } catch { return ''; }
})();
const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://cdn.tailwindcss.com https://cdnjs.cloudflare.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com",
  "font-src 'self' data: https://fonts.gstatic.com https://cdnjs.cloudflare.com",
  "img-src 'self' data: blob: https:",
  `connect-src 'self' https://form.orbitalnest.net https://*.google-analytics.com https://*.analytics.google.com https://www.googletagmanager.com ${appwriteOrigin}`.trim(),
  "frame-src 'self' https://www.youtube.com https://cal.com https://www.google.com https://maps.google.com",
  "frame-ancestors 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
].join('; ');
SECURITY_HEADERS['Content-Security-Policy-Report-Only'] = CSP;

// Una sola URL por página: /soluciones redirige (301) a /soluciones/. Quedan afuera la API, los archivos con extensión
// y los métodos distintos de GET/HEAD (los formularios hacen POST a /api/...).
const sinBarra = (path) => path !== '/' && !path.endsWith('/') && !path.startsWith('/api/') && !path.startsWith('/_') && !/\.[a-z0-9]+$/i.test(path);

// Caché del navegador: los archivos de /_astro/ llevan hash en el nombre (no cambian nunca); capturas, logos e íconos
// cambian poco (una semana, y después se revalidan sin bloquear); app.js no tiene hash (un día).
const cacheDe = (path) => {
  if (path.startsWith('/_astro/')) return 'public, max-age=31536000, immutable';
  if (path === '/app.js') return 'public, max-age=86400, stale-while-revalidate=604800';
  if (/^\/(trabajos|integraciones|team|testimonials|Realstate)\//.test(path) || /\.(webp|png|jpe?g|svg|ico|woff2?)$/i.test(path)) return 'public, max-age=604800, stale-while-revalidate=2592000';
  return '';
};

const server = http.createServer((req, res) => {
  for (const [name, value] of Object.entries(SECURITY_HEADERS)) res.setHeader(name, value);
  const url = new URL(req.url ?? '/', 'http://local');
  if ((req.method === 'GET' || req.method === 'HEAD') && sinBarra(url.pathname)) {
    res.writeHead(301, { Location: url.pathname + '/' + url.search });
    res.end();
    return;
  }
  const cc = cacheDe(url.pathname);
  if (cc) {
    // El manejador de archivos estáticos de Astro pone max-age=0: se reemplaza por la política de arriba
    const set = res.setHeader.bind(res);
    res.setHeader = (name, value) => set(name, String(name).toLowerCase() === 'cache-control' ? cc : value);
    set('Cache-Control', cc);
  }
  compress(req, res, () => handler(req, res));
});

const port = Number(process.env.PORT ?? 4321);
const host = process.env.HOST ?? '0.0.0.0';
server.listen(port, host, () => console.log(`Kaptativa escuchando en http://${host}:${port}`));
