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
  integrations: [
    sitemap({
      filter: (page) => 
        !page.includes('/admin') &&
        !page.includes('/checkout') &&
        !page.includes('/logo-proposals') &&
        !page.includes('/presupuestos/') &&
        !page.includes('/demo-sistema') &&
        !page.includes('/inmo-demo') &&
        !page.includes('/api/'),
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
