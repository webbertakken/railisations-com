import { chromium } from "@playwright/test";

const URL = process.env.URL ?? "http://127.0.0.1:4444/";

const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 1280, height: 1200 },
  deviceScaleFactor: 2,
  colorScheme: "dark",
});
const page = await ctx.newPage();
await page.goto(URL, { waitUntil: "networkidle" });

// Hover the *date* on row 2 (APRIL 2021) - proves both fixes at once:
//   1. The date itself brightens from luminous copper to primary-fixed
//      (#ffdcc2), so the in-place color override beats Tailwind utils.
//   2. The card on the OTHER side of the spine ("Iterative Refinement
//      is Key") lights up, plus the gear node + connector, even though
//      the pointer is far away from the card.
// Park the page so row 2 (APRIL 2021) is squarely in view.
await page.evaluate(() => window.scrollTo(0, 200));
await page.waitForTimeout(300);

const row = page
  .locator('[data-testid="timeline-row-desktop"]')
  .filter({ hasText: "Iterative Refinement is Key" })
  .first();
await row.waitFor({ state: "visible", timeout: 5000 });
const date = row.locator(".row-date", { hasText: "APRIL 2021" });
await date.hover();
await page.waitForTimeout(400);

const rowBox = await row.boundingBox();
if (rowBox === null) throw new Error("row not in viewport");
await page.screenshot({
  path: "designs/snapshots/hover-date.png",
  clip: { x: 0, y: Math.max(0, rowBox.y - 30), width: 1280, height: rowBox.height + 60 },
});
console.log("wrote designs/snapshots/hover-date.png");

// Now hover an EMPTY pocket inside row 2's left half (the wrapper around
// the date, but well above the date text itself). The cross-highlight
// must NOT fire because none of the four primitive classes own that pixel.
const leftHalf = row.locator("> div").first();
const leftBox = await leftHalf.boundingBox();
if (leftBox === null) throw new Error("left half not in viewport");
await page.mouse.move(leftBox.x + 5, leftBox.y + 5);
await page.waitForTimeout(400);
await page.screenshot({
  path: "designs/snapshots/hover-empty-space.png",
  clip: { x: 0, y: Math.max(0, rowBox.y - 30), width: 1280, height: rowBox.height + 60 },
});
console.log("wrote designs/snapshots/hover-empty-space.png");


await browser.close();
