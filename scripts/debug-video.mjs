import puppeteer from "puppeteer-core";
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";

const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ["--no-sandbox", "--disable-gpu"],
});
const page = await browser.newPage();
await page.setViewport({ width: 1080, height: 1080, deviceScaleFactor: 1 });
const errs = [];
page.on("console", (m) => errs.push("console:" + m.text()));
page.on("pageerror", (e) => errs.push("pageerror:" + e.message));
await page.goto(pathToFileURL(resolve("video/index.html")).href, { waitUntil: "load", timeout: 60000 });
await new Promise((r) => setTimeout(r, 1500));

const info = await page.evaluate(() => {
  const has = typeof window.gsap !== "undefined";
  const tl = window.__timelines && window.__timelines.main;
  let dur = null, seekOpacity = null, fontStatus = document.fonts.status;
  if (tl) {
    dur = tl.totalDuration();
    tl.seek(1.83, false);
    const s1 = getComputedStyle(document.getElementById("s1"));
    const w = getComputedStyle(document.getElementById("s1word"));
    const mL = document.getElementById("mL");
    seekOpacity = {
      s1: s1.opacity, s1vis: s1.visibility,
      word: w.opacity,
      mLoffset: mL && mL.style.strokeDashoffset,
      mLdash: mL && mL.style.strokeDasharray,
    };
  }
  return { has, hasTl: !!tl, dur, seekOpacity, fontStatus };
});
console.log(JSON.stringify(info, null, 2));
console.log("EVENTS:", errs.slice(0, 10).join(" | ") || "none");
await browser.close();
