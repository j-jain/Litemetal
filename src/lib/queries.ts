// Build-time content getters. Each returns the SAME shape the old hardcoded
// data files exported, so the .astro components need no changes. Images are
// resolved to sized WebP CDN URL strings here.
import { sanityClient } from './sanity';
import { imgUrl } from './image';

// ---- Shapes (mirror the original src/data/*.ts interfaces) ----

export interface Product {
  slug: string;
  name: string;
  category: string;
  blurb: string;
  image?: string;
  feature?: boolean;
}

export interface ClientGroup {
  sector: string;
  clients: string[];
}

export interface Project {
  name: string;
  place: string;
  state: string;
  scope: string;
  image: string;
  tall?: boolean;
}

export interface Install {
  name: string;
  place: string;
  state: string;
}

// Loosely typed settings object — matches the old `site` const's shape.
export interface SiteSettings {
  name: string;
  legalName: string;
  shortName: string;
  tagline: string;
  metaTitle: string;
  metaDescription: string;
  yearsExperience: number;
  certification: string;
  msme: boolean;
  email: string;
  partner: { name: string; role: string };
  phones: { display: string; e164: string }[];
  landline: { display: string; e164: string };
  office: Record<string, unknown>;
  factory: Record<string, unknown>;
  facilities: { area: string; unit: string; name: string; role: string }[];
  statesServed: string[];
  stats: { value: string; label: string }[];
  fountainNote: string;
}

// Image display widths (CDN serves one size per URL; pick generously).
const PRODUCT_IMG_W = 1100;
const PROJECT_IMG_W = 1600;

// ---- Getters ----

export async function getProducts(): Promise<Product[]> {
  const docs = await sanityClient.fetch<any[]>(
    `*[_type == "product"] | order(order asc){ name, "slug": slug.current, category, blurb, image, feature }`,
  );
  return docs.map((d) => ({
    slug: d.slug,
    name: d.name,
    category: d.category,
    blurb: d.blurb,
    image: imgUrl(d.image, PRODUCT_IMG_W),
    feature: !!d.feature,
  }));
}

export async function getClientGroups(): Promise<ClientGroup[]> {
  return sanityClient.fetch<ClientGroup[]>(
    `*[_type == "clientSector"] | order(order asc){ sector, clients }`,
  );
}

export async function getFountainProjects(): Promise<Project[]> {
  const docs = await sanityClient.fetch<any[]>(
    `*[_type == "fountainProject"] | order(order asc){ name, place, state, scope, image, tall }`,
  );
  return docs.map((d) => ({
    name: d.name,
    place: d.place,
    state: d.state,
    scope: d.scope,
    image: imgUrl(d.image, PROJECT_IMG_W) ?? '',
    tall: !!d.tall,
  }));
}

export async function getInstallations(): Promise<Install[]> {
  return sanityClient.fetch<Install[]>(
    `*[_type == "installation"] | order(order asc){ name, place, state }`,
  );
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const s = await sanityClient.fetch<SiteSettings | null>(
    `*[_type == "siteSettings"][0]`,
  );
  if (!s) {
    throw new Error(
      'No siteSettings document found in Sanity. Run `npm run seed` to populate content.',
    );
  }
  return s;
}
