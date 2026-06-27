// Builds brand assets from the real LMI logo (../../Picture1.png).
// Outputs the on-page logo plus favicon / apple-touch / OG art so the whole
// site uses the company's actual mark instead of the drawn monogram.
import sharp from "sharp";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const SRC = "../Picture1.png"; // sits one level above litemetal-site/
const PUBLIC = "public";
const IMG = join(PUBLIC, "images");
mkdirSync(IMG, { recursive: true });

const NAVY = "#0d1a2b";
const PAPER = "#f6f4ef";
const ACCENT = "#34a8c6";

/* 1. On-page logo — trim the transparent margin, cap size, keep alpha. */
const logoBuf = await sharp(SRC)
  .trim({ threshold: 1 })
  .resize(480, 480, { fit: "inside", withoutEnlargement: true })
  .png()
  .toBuffer();
writeFileSync(join(IMG, "logo.png"), logoBuf);
const logoMeta = await sharp(logoBuf).metadata();
console.log("logo.png", logoMeta.width, "x", logoMeta.height);

/* Square version padded onto a paper rounded tile — used for the favicon,
   apple-touch icon and the OG chip so the colored mark always reads. */
const tile = (size, pad, radius) => {
  const inner = size - pad * 2;
  const bg = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">
       <rect width="${size}" height="${size}" rx="${radius}" fill="${PAPER}"/>
     </svg>`
  );
  return sharp(SRC)
    .trim({ threshold: 1 })
    .resize(inner, inner, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toBuffer()
    .then((mark) =>
      sharp(bg)
        .composite([{ input: mark, gravity: "center" }])
        .png()
        .toBuffer()
    );
};

/* 2. Favicon (SVG with embedded raster so the colored mark stays crisp). */
const favPng = await tile(64, 6, 12);
const favB64 = favPng.toString("base64");
const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <image href="data:image/png;base64,${favB64}" width="64" height="64"/>
</svg>`;
writeFileSync(join(PUBLIC, "favicon.svg"), faviconSvg);

/* 3. favicon.ico (32) + apple-touch (180). */
await sharp(await tile(64, 6, 12)).resize(32, 32).toFile(join(PUBLIC, "favicon.ico"));
await sharp(await tile(180, 18, 36)).resize(180, 180).png().toFile(join(PUBLIC, "apple-touch-icon.png"));
console.log("favicon set");

/* 4. OG art — navy field, logo on a paper chip, existing title text. */
const ogChip = await tile(120, 14, 22);
const ogBg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="${NAVY}"/>
  <rect x="0" y="0" width="1200" height="6" fill="${ACCENT}"/>
  <text x="80" y="330" font-family="Georgia, 'Times New Roman', serif" font-size="92" fill="${PAPER}">Lite Metal Industries</text>
  <text x="83" y="392" font-family="Georgia, serif" font-size="34" font-style="italic" fill="#9fb1c2">LT control panels &amp; control transformers</text>
  <text x="80" y="556" font-family="monospace" font-size="22" letter-spacing="3" fill="#9fb1c2">KOLKATA  ·  ISO 9001:2015  ·  40+ YEARS</text>
</svg>`;
await sharp(Buffer.from(ogBg))
  .composite([{ input: ogChip, left: 80, top: 70 }])
  .png()
  .toFile(join(PUBLIC, "og.png"));
console.log("og.png");
