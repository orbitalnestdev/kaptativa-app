const purgecss = require('@fullhuman/postcss-purgecss')({
  content: ['./src/**/*.{astro,html,js,jsx,svelte,ts,tsx,vue}'],
  safelist: [/active/, /open/, /light-bg/, /dark-bg/, /success/, /error/, /active-tab/, /dragover/, /active-template-card/, /active-block-card/, /reunion-comercial/, /soporte-tecnico/, /today/, /scrolled/, /header-scrolled/, /reveal/]
});

module.exports = {
  plugins: [
    ...(process.env.NODE_ENV === 'production' ? [purgecss] : [])
  ]
};
