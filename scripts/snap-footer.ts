import { chromium } from "@playwright/test";

const URL = process.env.URL ?? "http://127.0.0.1:4444/";
const OUT = "designs/snapshots/footer.png";

const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 1280, height: 800 },
  deviceScaleFactor: 2,
  colorScheme: "dark",
});
const page = await ctx.newPage();
await page.goto(URL, { waitUntil: "networkidle" });
const footer = page.locator("footer");
await footer.scrollIntoViewIfNeeded();
await footer.screenshot({ path: OUT });
await browser.close();
console.log("wrote", OUT);
