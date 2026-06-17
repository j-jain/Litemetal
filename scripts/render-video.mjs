// Render the hyperframes composition (video/index.html) to MP4.
// Drives the registered GSAP timeline (window.__timelines.main) frame by frame
// with the installed Chrome, then encodes the PNG frames with ffmpeg.
import puppeteer from "puppeteer-core";
import { spawnSync } from "node:child_process";
import { mkdirSync, rmSync, readdirSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { resolve, join } from "node:path";

const CHROME =
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const FFMPEG =
  "C:\\Users\\Jaidityaa Jain\\ffmpeg-dl\\x\\ffmpeg-master-latest-win64-gpl\\bin\\ffmpeg.exe";

const SIZE = 1080;
const FPS = 30;
const HTML = resolve("video/index.html");
const FRAMES = resolve("video/_frames");
const OUT = resolve("public/video/hero.mp4");

rmSync(FRAMES, { recursive: true, force: true });
mkdirSync(FRAMES, { recursive: true });
mkdirSync(resolve("public/video"), { recursive: true });

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: [
    "--no-sandbox",
    "--disable-gpu",
    "--force-color-profile=srgb",
    "--hide-scrollbars",
    `--window-size=${SIZE},${SIZE}`,
  ],
});

const page = await browser.newPage();
await page.setViewport({ width: SIZE, height: SIZE, deviceScaleFactor: 1 });

console.log("loading composition…");
await page.goto(pathToFileURL(HTML).href, {
  waitUntil: "load",
  timeout: 60000,
});

// Wait for the timeline + fonts to be ready, then pause it for manual seeking.
await page.waitForFunction(
  "window.__timelines && window.__timelines.main && document.fonts.status === 'loaded'",
  { timeout: 30000 }
);
const duration = await page.evaluate(() => {
  const tl = window.__timelines.main;
  tl.pause(0);
  return tl.totalDuration();
});

const frames = Math.round(duration * FPS);
console.log(`duration ${duration.toFixed(2)}s -> ${frames} frames @ ${FPS}fps`);

for (let i = 0; i < frames; i++) {
  const t = i / FPS;
  await page.evaluate((tt) => {
    window.__timelines.main.seek(tt, false);
  }, t);
  // let the browser paint the seeked state
  await page.evaluate(
    () => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)))
  );
  const name = String(i).padStart(4, "0") + ".png";
  await page.screenshot({
    path: join(FRAMES, name),
    clip: { x: 0, y: 0, width: SIZE, height: SIZE },
    optimizeForSpeed: true,
  });
  if (i % 30 === 0) process.stdout.write(`  frame ${i}/${frames}\r`);
}
console.log("\ncaptured", readdirSync(FRAMES).length, "frames");
await browser.close();

console.log("encoding mp4…");
const enc = spawnSync(
  FFMPEG,
  [
    "-y",
    "-framerate", String(FPS),
    "-i", join(FRAMES, "%04d.png"),
    "-c:v", "libx264",
    "-pix_fmt", "yuv420p",
    "-crf", "20",
    "-preset", "slow",
    "-movflags", "+faststart",
    OUT,
  ],
  { stdio: "inherit" }
);
if (enc.status !== 0) {
  console.error("ffmpeg failed", enc.status);
  process.exit(1);
}
console.log("wrote", OUT);
