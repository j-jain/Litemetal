// Build labeled contact sheets so product/project photos can be mapped.
import sharp from "sharp";
import { join } from "node:path";

const DIR = "../_pdf_assets";
const CELL = 300;
const PAD = 16;
const COLS = 4;

// Product RGB + mask pairs (image, mask) in PDF order across pages 4-6.
const productPairs = [
  ["prod-001.png", "prod-002.png"],
  ["prod-003.png", "prod-004.png"],
  ["prod-005.png", "prod-006.png"],
  ["prod-007.png", "prod-008.png"],
  ["prod-009.png", "prod-010.png"],
  ["prod-014.png", "prod-015.png"],
  ["prod-016.png", "prod-017.png"],
  ["prod-018.png", "prod-019.png"],
  ["prod-020.png", "prod-021.png"],
  ["prod-025.png", "prod-026.png"],
  ["prod-027.png", "prod-028.png"],
  ["prod-029.png", "prod-030.png"],
  ["prod-031.png", "prod-032.png"],
];

// Candidate project photos (large, no mask needed for most).
const projectImgs = [
  "proj-001.png", "proj-002.png", "proj-003.png", "proj-004.png",
  "proj-008.png", "proj-010.png", "proj-011.png", "proj-013.png",
  "proj-016.png", "proj-020.png", "proj-021.png", "proj-023.png",
];

async function recombine(imgPath, maskPath) {
  // Join the soft mask as the alpha channel, then trim transparent border.
  const rgba = await sharp(join(DIR, imgPath))
    .joinChannel(join(DIR, maskPath))
    .png()
    .toBuffer();
  return sharp(rgba).trim({ threshold: 10 }).toBuffer();
}

function label(i, name) {
  const svg = `<svg width="${CELL}" height="28" xmlns="http://www.w3.org/2000/svg">
    <rect width="100%" height="100%" fill="#111"/>
    <text x="8" y="19" font-family="monospace" font-size="14" fill="#fff">[${i}] ${name}</text>
  </svg>`;
  return Buffer.from(svg);
}

async function sheet(cells, outName) {
  const rows = Math.ceil(cells.length / COLS);
  const W = COLS * (CELL + PAD) + PAD;
  const H = rows * (CELL + 28 + PAD) + PAD;
  const composites = [];
  for (let i = 0; i < cells.length; i++) {
    const col = i % COLS;
    const row = Math.floor(i / COLS);
    const x = PAD + col * (CELL + PAD);
    const y = PAD + row * (CELL + 28 + PAD);
    const img = await sharp(cells[i].buf)
      .resize(CELL, CELL, { fit: "contain", background: "#ffffff" })
      .flatten({ background: "#ffffff" })
      .toBuffer();
    composites.push({ input: label(i, cells[i].name), left: x, top: y });
    composites.push({ input: img, left: x, top: y + 28 });
  }
  await sharp({ create: { width: W, height: H, channels: 3, background: "#888" } })
    .composite(composites)
    .png()
    .toFile(join(DIR, outName));
  console.log(`wrote ${outName} (${cells.length} cells)`);
}

const prodCells = [];
for (let i = 0; i < productPairs.length; i++) {
  const [img, mask] = productPairs[i];
  prodCells.push({ buf: await recombine(img, mask), name: img.replace(".png", "") });
}
await sheet(prodCells, "_sheet_products.png");

const projCells = [];
for (const f of projectImgs) {
  projCells.push({ buf: await sharp(join(DIR, f)).toBuffer(), name: f.replace(".png", "") });
}
await sheet(projCells, "_sheet_projects.png");
