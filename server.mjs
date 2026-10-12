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

const server = http.createServer((req, res) => {
  for (const [name, value] of Object.entries(SECURITY_HEADERS)) res.setHeader(name, value);
  compress(req, res, () => handler(req, res));
});

const port = Number(process.env.PORT ?? 4321);
const host = process.env.HOST ?? '0.0.0.0';
server.listen(port, host, () => console.log(`Kaptativa escuchando en http://${host}:${port}`));
