// Asset pipeline for Lite Metal Industries.
// Recombines PDF soft-masks into clean product cut-outs, optimizes project
// photos, derives an atmospheric texture, and renders favicon + OG art.
import sharp from "sharp";
import { mkdirSync } from "node:fs";
import { join } from "node:path";

const SRC = "../_pdf_assets";
const OUT = "public/images";
const dirs = ["products", "projects", "atmos"];
dirs.forEach((d) => mkdirSync(join(OUT, d), { recursive: true }));
mkdirSync("public", { recursive: true });

/* ---------------------------------------------------------------------------
   1. Product cut-outs — recombine alpha, trim, gentle normalize, transparent.
--------------------------------------------------------------------------- */
const products = [
  { slug: "capacitor-control-panel", img: "prod-001.png", mask: "prod-002.png" },
  { slug: "logic-control-panel", img: "prod-003.png", mask: "prod-004.png" },
  { slug: "plc-panel", img: "prod-009.png", mask: "prod-010.png" },
  { slug: "lighting-control-panel", img: "prod-007.png", mask: "prod-008.png" },
  { slug: "fire-fighting-control-panel", img: "prod-014.png", mask: "prod-015.png" },
  { slug: "three-phase-transformer", img: "prod-020.png", mask: "prod-021.png" },
  { slug: "ac-drive-panel", img: "prod-018.png", mask: "prod-019.png" },
  { slug: "power-control-panel", img: "prod-025.png", mask: "prod-026.png" },
  { slug: "power-distribution-board", img: "prod-029.png", mask: "prod-030.png" },
];

for (const p of products) {
  const rgba = await sharp(join(SRC, p.img))
    .joinChannel(join(SRC, p.mask))
    .png()
    .toBuffer();
  await sharp(rgba)
    .trim({ threshold: 12 })
    // Unify the old scans: pull back colour casts, lift a touch, gentle sharpen.
    .modulate({ saturation: 0.86, brightness: 1.04 })
    // Source scans are low-res (~300–600px); don't upscale (pointless bytes,
    // no real detail). Cap at native size and lean on quality + gentle sharpen.
    .resize(900, 900, { fit: "inside", withoutEnlargement: true })
    .sharpen({ sigma: 0.6 })
    .webp({ quality: 92, alphaQuality: 100 })
    .toFile(join(OUT, "products", `${p.slug}.webp`));
  console.log("product:", p.slug);
}

/* ---------------------------------------------------------------------------
   2. Project photos — the marquee fountain work + panel installs.
--------------------------------------------------------------------------- */
const projects = [
  { name: "fountain-of-joy", src: "proj-001.png", w: 1800 },
  { name: "biswa-bangla", src: "proj-002.png", w: 1400 },
  { name: "eco-park", src: "proj-003.png", w: 1400 },
  { name: "krishna-river", src: "proj-010.png", w: 1200 },
  { name: "vfd-mumbai", src: "proj-020.png", w: 1200 },
];

for (const p of projects) {
  await sharp(join(SRC, p.src))
    .resize({ width: p.w, withoutEnlargement: true })
    .webp({ quality: 90 })
    .toFile(join(OUT, "projects", `${p.name}.webp`));
  console.log("project:", p.name);
}

/* ---------------------------------------------------------------------------
   3. Atmosphere — LMI's own dark granite texture, darkened for overlays.
--------------------------------------------------------------------------- */
await sharp(join(SRC, "prod-000.png"))
  .extract({ left: 1100, top: 300, width: 2200, height: 2400 })
  .resize({ width: 1600 })
  .modulate({ brightness: 0.7, saturation: 0.6 })
  .webp({ quality: 70 })
  .toFile(join(OUT, "atmos", "stone.webp"));
console.log("atmos: stone");

/* ---------------------------------------------------------------------------
   4. Favicon + OG art.
--------------------------------------------------------------------------- */
const NAVY = "#0d1a2b";
const PAPER = "#f6f4ef";
const ACCENT = "#34a8c6";

// Monogram drawn as geometry (no font dependency) — stacked L + M bars.
const monogram = (s, stroke) => `
  <g fill="none" stroke="${stroke}" stroke-width="${s * 0.07}" stroke-linecap="square">
    <path d="M ${s * 0.26} ${s * 0.28} V ${s * 0.72} H ${s * 0.46}" />
    <path d="M ${s * 0.54} ${s * 0.72} V ${s * 0.28} L ${s * 0.66} ${s * 0.52} L ${s * 0.78} ${s * 0.28} V ${s * 0.72}" />
  </g>`;

const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="12" fill="${NAVY}"/>
  ${monogram(64, PAPER)}
  <rect x="20" y="50" width="24" height="2.4" fill="${ACCENT}"/>
</svg>`;

import { writeFileSync } from "node:fs";
writeFileSync("public/favicon.svg", faviconSvg);

await sharp(Buffer.from(faviconSvg)).resize(32, 32).toFile("public/favicon.ico");
await sharp(Buffer.from(faviconSvg)).resize(180, 180).png().toFile("public/apple-touch-icon.png");
console.log("favicon set");

// OG art — branded, text drawn with a system serif/mono (rendered by sharp).
const og = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="${NAVY}"/>
  <rect x="0" y="0" width="1200" height="6" fill="${ACCENT}"/>
  <g transform="translate(80,70) scale(1.3)">${monogram(64, PAPER)}</g>
  <rect x="92" y="156" width="40" height="3" fill="${ACCENT}"/>
  <text x="80" y="330" font-family="Georgia, 'Times New Roman', serif" font-size="92" fill="${PAPER}">Lite Metal Industries</text>
  <text x="83" y="392" font-family="Georgia, serif" font-size="34" font-style="italic" fill="#9fb1c2">LT control panels &amp; control transformers</text>
  <text x="80" y="556" font-family="monospace" font-size="22" letter-spacing="3" fill="#9fb1c2">KOLKATA  ·  ISO 9001:2015  ·  40+ YEARS</text>
</svg>`;
await sharp(Buffer.from(og)).png().toFile("public/og.png");
console.log("og.png");
