import { defineConfig } from 'astro/config';

import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  site: 'https://cardstonsmiles.com',
  output: 'static',
  build: {
    assets: 'assets',
    outDir: 'public2', // This will build your project into the public folder
  },
  server: {
    port: 3000,
    host: true,
  },
  integrations: [react()]
});
