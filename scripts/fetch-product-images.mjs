// Processes the sourced product photos (_product_src/) into the webp assets the
// Products & services grid renders. Sources are free, commercial-use Pixabay
// photos (no attribution required) — see public/images/products/credits.md.
// Feature tiles render 16:9 (span two columns); the rest render 4:3. Output is
// object-fit: cover, so we crop to the tile aspect and keep a cohesive, lightly
// desaturated look that matches the site's muted palette.
import sharp from "sharp";
import { mkdirSync } from "node:fs";
import { join } from "node:path";

const SRC = "_product_src";
const OUT = "public/images/products";
mkdirSync(OUT, { recursive: true });

// feature flag mirrors src/data/products.ts (16:9 wide tiles)
const items = [
  { slug: "power-distribution-board", feature: true },
  { slug: "power-control-panel" },
  { slug: "capacitor-control-panel", feature: true },
  { slug: "ac-drive-panel" },
  { slug: "plc-panel" },
  { slug: "logic-control-panel" },
  { slug: "fire-fighting-control-panel" },
  { slug: "lighting-control-panel" },
  { slug: "three-phase-transformer" },
  { slug: "cable-duct-fabrication" },
];

for (const it of items) {
  const [w, h] = it.feature ? [1600, 900] : [1000, 750];
  await sharp(join(SRC, `${it.slug}.jpg`))
    .resize(w, h, { fit: "cover", position: "centre" })
    .modulate({ saturation: 0.9, brightness: 1.02 })
    .sharpen({ sigma: 0.6 })
    .webp({ quality: 82 })
    .toFile(join(OUT, `${it.slug}.webp`));
  console.log("product:", it.slug, `${w}x${h}`);
}
