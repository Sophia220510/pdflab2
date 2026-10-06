import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const output = resolve(".work/ads");
await mkdir(output, { recursive: true });
const source = pathToFileURL(resolve("ads/creative.html")).href;
const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
  for (let scene = 1; scene <= 7; scene++) {
    await page.goto(`${source}?scene=${scene}`, { waitUntil: "load" });
    const images = await page.evaluate(async () =>
      Promise.all([...document.querySelectorAll(".scene.active img")].map(async (image) => {
        await image.decode();
        return image.naturalWidth > 0;
      })),
    );
    if (images.some((loaded) => !loaded)) throw new Error(`Broken image in scene ${scene}`);
    const dimensions = await page.evaluate(() => {
      const active = document.querySelector(".scene.active");
      return { height: active.scrollHeight, width: active.scrollWidth };
    });
    await page.screenshot({ path: resolve(output, `scene-${scene}.png`) });
    if (dimensions.height > 1920 || dimensions.width > 1080)
      throw new Error(`Scene ${scene} overflows 1080x1920: ${JSON.stringify(dimensions)}`);
    console.log(`Rendered scene ${scene}`);
  }
} finally {
  await browser.close();
}
