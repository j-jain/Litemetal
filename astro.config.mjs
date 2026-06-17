// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Update `site` to the production domain before deploying.
export default defineConfig({
  site: 'https://www.litemetalindustries.com',
  output: 'static',
  integrations: [sitemap()],
  build: {
    inlineStylesheets: 'auto',
  },
  image: {
    // Astro's built-in sharp service handles AVIF/WebP generation.
    service: { entrypoint: 'astro/assets/services/sharp' },
  },
});
