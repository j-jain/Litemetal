# Sanity CMS — setup & handoff

The site now pulls **Products, Clients, Special Projects, and Site/Contact info**
from Sanity at build time, and hosts an embedded Studio at **`/studio`**. The
site stays fully static; publishing an edit triggers a Vercel rebuild
(~1–2 min) via a webhook.

Everything code-side is done. Below are the one-time account steps only **you**
can do (they need interactive login / dashboard access).

---

## 1. Create the Sanity project & get the Project ID

```bash
cd litemetal-site
npx sanity login       # opens browser; create a free account or log in
```

Then create the project + a `production` dataset:

- Easiest: go to **https://www.sanity.io/manage** → **Create new project** →
  name it "Lite Metal Industries" → it creates a `production` dataset. Copy the
  **Project ID** shown on the project page.

> ⚠️ Do **not** run `npx sanity init` inside `litemetal-site/` — it would
> scaffold/overwrite `sanity.config.ts`. The config is already written. If you
> prefer the CLI, run `sanity init` in a throwaway folder just to create the
> project, then delete that folder.

## 2. Create a write token (for the one-time content migration only)

sanity.io/manage → your project → **API** → **Tokens** → **Add token** →
permission **Editor** → copy it.

## 3. Fill `.env` (local, gitignored)

```bash
cp .env.example .env
```

Edit `.env`:

```
PUBLIC_SANITY_PROJECT_ID=your_project_id
PUBLIC_SANITY_DATASET=production
SANITY_WRITE_TOKEN=your_editor_token
```

## 4. Seed the current content into Sanity (one time)

```bash
npm run seed
```

Uploads the existing product/project images and creates all documents so the
CMS starts pre-populated matching today's site.

## 5. Run locally to verify

```bash
npm run dev
```

- `http://localhost:4321/` — the site, now served from Sanity.
- `http://localhost:4321/studio` — the CMS. Log in and you'll see everything.

## 6. CORS (so the Studio can talk to the API)

sanity.io/manage → **API** → **CORS origins** → **Add**:
- `http://localhost:4321` (allow credentials)
- your production domain, e.g. `https://www.litemetalindustries.com` (allow credentials)
- your Vercel preview domain, e.g. `https://litemetal.vercel.app` (allow credentials)

## 7. Vercel environment variables

In the Vercel project → **Settings → Environment Variables**, add (all environments):
- `PUBLIC_SANITY_PROJECT_ID` = your project id
- `PUBLIC_SANITY_DATASET` = `production`

> Do **not** add `SANITY_WRITE_TOKEN` to Vercel — the site only reads.

## 8. Rebuild-on-publish (Vercel Deploy Hook + Sanity webhook)

1. Vercel → **Settings → Git → Deploy Hooks** → create one (name: "Sanity
   publish", branch: your production branch) → copy the URL.
2. sanity.io/manage → **API → Webhooks → Create webhook**:
   - **URL**: the Vercel deploy hook URL
   - **Trigger on**: Create, Update, Delete
   - **Filter/Dataset**: `production`
   - Leave projection empty; method POST.

Now publishing any content change auto-redeploys the site.

---

## Editing content day-to-day

Go to `yourdomain.com/studio` (or `/studio` locally). Edit Products, Clients,
Special Projects, or Site Settings, hit **Publish** — the site rebuilds and the
change goes live in a minute or two.

**Ordering:** each item has an **Order** number (lower = first). Change it to
reorder.

## Notes

- Images are served from Sanity's CDN as WebP. The old files in
  `public/images/products` and `public/images/projects`, and
  `scripts/process-images.mjs`, can be retired once you've confirmed the seeded
  site looks right — leaving them in place for now does no harm.
- Want edits to appear **instantly** instead of after a rebuild? That means
  switching to SSR (add `@astrojs/vercel`, drop `studioRouterHistory: 'hash'`).
  Not needed for a brochure/catalog site, but it's the escape hatch.
