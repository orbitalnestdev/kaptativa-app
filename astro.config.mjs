// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import node from '@astrojs/node';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  site: 'https://kaptativa.com',
  output: 'server',
  adapter: node({
    mode: 'standalone'
  }),
  redirects: {
    '/inmo-demo': '/inmobiliarias/',
    '/home2': '/',
    '/blog': '/',
    '/como-digitalizar-inmobiliaria-catalogo-crm-whatsapp-ia': '/inmobiliarias/',
    '/porque-depender-solo-de-instagram-y-whatsapp-arruina-ventas-inmobiliarias': '/inmobiliarias/',
    '/agentes-ia-whatsapp-inmobiliarias-atiende-consultas-24-7': '/inmobiliarias/',
    '/crm-inmobiliario-tablero-kanban-embudo-de-ventas': '/inmobiliarias/',
    '/seo-inmobiliario-posicionar-catalogo-propiedades-google-ia': '/inmobiliarias/',
    '/como-captar-propiedades-exclusivas-portal-web-vanguardia': '/inmobiliarias/',
    '/cuanto-cuesta-pagina-web-inmobiliaria-argentina': '/inmobiliarias/',
    '/software-inmobiliario-pago-unico-sin-mensualidades': '/inmobiliarias/',
    '/sistema-tasaciones-online-para-inmobiliarias': '/inmobiliarias/',
    '/crm-para-desarrolladoras-inmobiliarias-pozo': '/inmobiliarias/',
    '/diferencias-portales-inmobiliarios-web-propia': '/inmobiliarias/',
  },
  build: {
    inlineStylesheets: 'always'
  },
  integrations: [
    sitemap({
      filter: (page) => 
        !page.includes('/admin') &&
        !page.includes('/checkout') &&
        !page.includes('/logo-proposals') &&
        !page.includes('/home-anterior') &&
        !page.includes('/presupuestos/') &&
        !page.includes('/demo-sistema') &&
        !page.includes('/api/') &&
        // Inmobiliarias se indexa por su landing propia (/inmobiliarias/)
        !page.includes('/soluciones/inmobiliarias'),
    }),
    react()
  ],
  vite: {
    build: {
      cssCodeSplit: true
    },
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react/jsx-dev-runtime',
        'react/jsx-runtime',
        'recharts'
      ]
    }
  }
});
