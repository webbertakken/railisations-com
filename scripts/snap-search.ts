import { chromium } from "@playwright/test";

const URL = process.env.URL ?? "http://127.0.0.1:4444/";
const OUT = "designs/snapshots/search-open.png";

const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 1280, height: 800 },
  deviceScaleFactor: 2,
  colorScheme: "dark",
});
const page = await ctx.newPage();
await page.goto(URL, { waitUntil: "networkidle" });
await page.getByRole("button", { name: /search/i }).click();
await page.getByRole("searchbox").fill("frict");
await page.screenshot({ path: OUT, fullPage: false });
await browser.close();
console.log("wrote", OUT);
