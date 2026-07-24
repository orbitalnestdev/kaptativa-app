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
  integrations: [sitemap(), react()],
  vite: {
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
