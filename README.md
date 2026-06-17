# Lite Metal Industries — website

A fresh, static marketing site for Lite Metal Industries (LT control panels and
control transformers, Kolkata). Built with [Astro](https://astro.build), shipping
almost no JavaScript. Editorial, flat, no gradients.

## Commands

```bash
npm install        # one time
npm run dev        # local dev server with hot reload
npm run build      # static build to ./dist
npm run preview    # serve the built ./dist locally
```

Node 18+ is required (built and tested on Node 24).

## Deploying

`npm run build` outputs a fully static site to `dist/`. Host it anywhere:

- **Vercel / Netlify / Cloudflare Pages** — point the project at this folder,
  build command `npm run build`, output directory `dist`.
- **Any web server** — upload the contents of `dist/` to the web root.

Before going live, set the real domain in [`astro.config.mjs`](astro.config.mjs)
(`site: 'https://www.litemetalindustries.com'`). It feeds the canonical URLs,
sitemap, Open Graph tags, and JSON-LD.

## Editing content

All copy and data live in plain TypeScript files, no CMS:

- [`src/data/site.ts`](src/data/site.ts) — company name, tagline, contact
  details (phones, email, office + factory addresses), facilities, stats, nav.
- [`src/data/products.ts`](src/data/products.ts) — the ten product lines.
- [`src/data/projects.ts`](src/data/projects.ts) — fountain projects + installations.
- [`src/data/clients.ts`](src/data/clients.ts) — client roster, grouped by sector.

Section layout lives in [`src/components/`](src/components); design tokens
(colours, type, spacing, motion) in [`src/styles/tokens.css`](src/styles/tokens.css).

## Images

Product and project photos were extracted from the company portfolio PDF and
cleaned with `scripts/process-images.mjs` (uses `sharp`). Optimised WebP files
sit in `public/images/`. To regenerate after dropping new source images into
`../_pdf_assets/`, run `npm run assets`.

Client logos are shown as a typographic wall rather than low-resolution logo
scans. To switch to real logos, supply high-resolution files and adapt
`src/components/Clients.astro`.

## Hero video

The hero plays a short branded reel (`public/video/hero.mp4`, muted, looping,
with `public/video/hero-poster.webp` as the still and reduced-motion fallback).

The reel is authored as an HTML + GSAP composition in
[`video/index.html`](video/index.html) and rendered to MP4 by
`scripts/render-video.mjs` (drives the GSAP timeline frame-by-frame with Chrome,
encodes with ffmpeg). Re-render with:

```bash
node scripts/render-video.mjs   # needs Chrome + ffmpeg on the machine
```

## Contact form

By default the enquiry form opens the visitor's email client with the message
pre-filled (no backend required). To collect submissions through a service
instead, add a `<form action="https://formspree.io/f/your-id" method="POST">`
endpoint in [`src/components/Contact.astro`](src/components/Contact.astro) and
remove the `e.preventDefault()` mailto handler.

## Notes

- Phone numbers and addresses are published to support trust and local SEO
  (LocalBusiness structured data).
- Structured data, sitemap, robots.txt, Open Graph image, and favicons are all
  generated at build time.
