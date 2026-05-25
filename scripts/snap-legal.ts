import { chromium } from "@playwright/test";

const URL = process.env.URL ?? "http://127.0.0.1:4444";

const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 1280, height: 1200 },
  deviceScaleFactor: 2,
  colorScheme: "dark",
  reducedMotion: "reduce",
});
const page = await ctx.newPage();

for (const slug of ["privacy", "terms", "accessibility"]) {
  await page.goto(`${URL}/${slug}/`, { waitUntil: "networkidle" });
  await page.screenshot({ path: `designs/snapshots/${slug}.png`, fullPage: true });
  console.log("wrote", `designs/snapshots/${slug}.png`);
}

await browser.close();
