// Read-only Sanity client used at build time to fetch published content.
import { createClient } from '@sanity/client';

const projectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID;
const dataset = import.meta.env.PUBLIC_SANITY_DATASET || 'production';

if (!projectId) {
  throw new Error(
    'Missing PUBLIC_SANITY_PROJECT_ID. Copy .env.example to .env and set your Sanity project id.',
  );
}

export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion: '2024-01-01',
  useCdn: false, // build-time fetch — always the freshest published content
});
