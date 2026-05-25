import { chromium } from "@playwright/test";

const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 1280, height: 900 },
  deviceScaleFactor: 2,
  colorScheme: "dark",
  reducedMotion: "reduce",
});
const page = await ctx.newPage();
await page.goto("http://127.0.0.1:4444/", { waitUntil: "networkidle" });
await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight - 900));
await page.waitForTimeout(400);
await page.screenshot({ path: "designs/snapshots/epilogue.png" });
console.log("wrote designs/snapshots/epilogue.png");
await browser.close();
