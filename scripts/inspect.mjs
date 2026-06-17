import sharp from "sharp";
import { readdirSync } from "node:fs";
import { join } from "node:path";

const DIR = "../_pdf_assets";
const files = readdirSync(DIR).filter((f) => f.endsWith(".png")).sort();

for (const f of files) {
  try {
    const m = await sharp(join(DIR, f)).metadata();
    console.log(
      `${f.padEnd(16)} ${String(m.width).padStart(5)}x${String(m.height).padEnd(5)}  ch:${m.channels}  alpha:${m.hasAlpha}  ${(m.size ? (m.size / 1024).toFixed(0) + "K" : "")}`
    );
  } catch (e) {
    console.log(`${f}  ERROR ${e.message}`);
  }
}
