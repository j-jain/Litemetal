// @ts-check
import { defineConfig } from 'astro/config';
import { loadEnv } from 'vite';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';
import sanity from '@sanity/astro';

// Sanity project settings come from the environment (see .env.example).
const { PUBLIC_SANITY_PROJECT_ID, PUBLIC_SANITY_DATASET } = loadEnv(
  process.env.NODE_ENV ?? 'development',
  process.cwd(),
  '',
);

// Update `site` to the production domain before deploying.
export default defineConfig({
  site: 'https://www.litemetalindustries.com',
  output: 'static',
  integrations: [
    sitemap({
      // The embedded Studio is an admin surface, not a public page.
      filter: (page) => !page.includes('/studio'),
    }),
    sanity({
      projectId: PUBLIC_SANITY_PROJECT_ID,
      dataset: PUBLIC_SANITY_DATASET || 'production',
      useCdn: false, // build-time fetch — always pull the freshest published content
      studioBasePath: '/studio', // embedded Studio lives at yoursite.com/studio
      studioRouterHistory: 'hash', // keeps the Studio working under `output: 'static'` (no server adapter)
    }),
    react(),
  ],
  build: {
    inlineStylesheets: 'auto',
  },
  image: {
    // Astro's built-in sharp service handles AVIF/WebP generation.
    service: { entrypoint: 'astro/assets/services/sharp' },
  },
});
