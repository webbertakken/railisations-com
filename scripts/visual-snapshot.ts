import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";

const URL = process.env.URL ?? "http://127.0.0.1:4400/";
const OUT_DIR = "designs/snapshots";

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  const browser = await chromium.launch();
  try {
    // Desktop snapshot
    const desktop = await browser.newContext({
      viewport: { width: 1280, height: 800 },
      deviceScaleFactor: 2,
      colorScheme: "dark",
      reducedMotion: "reduce",
    });
    const desktopPage = await desktop.newPage();
    await desktopPage.goto(URL, { waitUntil: "networkidle" });
    await desktopPage.screenshot({
      path: `${OUT_DIR}/desktop.png`,
      fullPage: true,
    });
    console.log("wrote", `${OUT_DIR}/desktop.png`);

    // Mobile snapshot
    const mobile = await browser.newContext({
      viewport: { width: 412, height: 915 },
      deviceScaleFactor: 2,
      colorScheme: "dark",
      reducedMotion: "reduce",
      isMobile: true,
      hasTouch: true,
    });
    const mobilePage = await mobile.newPage();
    await mobilePage.goto(URL, { waitUntil: "networkidle" });
    await mobilePage.screenshot({
      path: `${OUT_DIR}/mobile.png`,
      fullPage: true,
    });
    console.log("wrote", `${OUT_DIR}/mobile.png`);

    // Hero crop (matches the design poster framing)
    const heroPage = await desktop.newPage();
    await heroPage.goto(URL, { waitUntil: "networkidle" });
    await heroPage.setViewportSize({ width: 1280, height: 1200 });
    await heroPage.screenshot({ path: `${OUT_DIR}/hero.png`, fullPage: false });
    console.log("wrote", `${OUT_DIR}/hero.png`);
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
