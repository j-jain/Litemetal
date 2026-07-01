// Sanity Studio configuration. The Studio is embedded in the Astro site at
// /studio (see astro.config.mjs) and ships with the site on Vercel — there is
// no separate `sanity deploy` step.
import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './src/sanity/schemaTypes';

// Vite exposes PUBLIC_-prefixed env vars to the bundled Studio.
const projectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID;
const dataset = import.meta.env.PUBLIC_SANITY_DATASET || 'production';

// Custom desk structure so the single Site Settings document opens as a
// singleton (no "create new" list) while everything else is a normal list.
const singletonTypes = new Set(['siteSettings']);

export default defineConfig({
  name: 'lite-metal-industries',
  title: 'Lite Metal Industries',
  projectId,
  dataset,
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            S.listItem()
              .title('Site Settings')
              .id('siteSettings')
              .child(
                S.document().schemaType('siteSettings').documentId('siteSettings'),
              ),
            S.divider(),
            S.documentTypeListItem('product').title('Products'),
            S.documentTypeListItem('clientSector').title('Clients (by sector)'),
            S.documentTypeListItem('fountainProject').title('Special Projects'),
            S.documentTypeListItem('installation').title('Panel Installations'),
          ]),
    }),
    visionTool(),
  ],
  schema: {
    types: schemaTypes,
    // Hide the singleton from the global "create" menu.
    templates: (templates) =>
      templates.filter((t) => !singletonTypes.has(t.schemaType)),
  },
  document: {
    // Remove "duplicate"/"delete" actions for the singleton.
    actions: (input, context) =>
      singletonTypes.has(context.schemaType)
        ? input.filter(({ action }) =>
            ['publish', 'discardChanges', 'restore'].includes(action ?? ''),
          )
        : input,
  },
});
