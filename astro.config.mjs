import { defineConfig } from "astro/config";

import react from "@astrojs/react";

import favicons from "astro-favicons";

import robotsTxt from "astro-robots-txt";

import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: "https://cardstonsmiles.com",
  output: "static",
  build: {},
  server: {
    port: 3000,
    host: true,
  },
  integrations: [
    react(),
    favicons({
      input: { favicons: ["public/favicon.png"] },
    }),
    robotsTxt(),
    sitemap(),
  ],
});
