import { defineConfig } from 'astro/config';

import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  site: 'https://cardstonsmiles.com',
  output: 'static',
  build: {},
  server: {
    port: 3000,
    host: true,
  },
  integrations: [react()]
});
