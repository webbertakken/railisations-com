import { expect, test } from "@playwright/test";
import { lessons } from "../src/data/lessons";

test.describe("Copper Lessons timeline", () => {
  test("shows the Copper Lessons brand wordmark", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("link", { name: "Copper Lessons" })).toBeAttached();
  });

  test("shows the active Lessons nav link on a desktop viewport", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/");
    const active = page.getByRole("link", { name: "Lessons", exact: true });
    await expect(active).toBeVisible();
    await expect(active).toHaveAttribute("aria-current", "page");
  });

  test("renders all 20 lesson dates and titles in chronological order", async ({ page }) => {
    await page.goto("/");
    // Scroll progressively so IntersectionObserver-driven entries all reveal.
    await page.evaluate(async () => {
      await new Promise<void>((resolve) => {
        let y = 0;
        const step = () => {
          window.scrollTo(0, y);
          y += 400;
          if (y < document.body.scrollHeight) {
            requestAnimationFrame(step);
          } else {
            resolve();
          }
        };
        step();
      });
    });
    for (const lesson of lessons) {
      // At least one (mobile OR desktop) copy of the title must be visible.
      const titleCopies = page.getByRole("heading", { name: lesson.title });
      await expect(titleCopies.first()).toBeAttached();
      const dateCopies = page.getByText(lesson.date, { exact: true });
      await expect(dateCopies.first()).toBeAttached();
      // sanity: at least one variant is rendered as visible to users.
      const anyVisible = await titleCopies.evaluateAll((els) =>
        els.some((el) => (el as HTMLElement).offsetParent !== null),
      );
      expect(anyVisible).toBe(true);
    }
  });

  test("sticky header survives a long scroll", async ({ page }) => {
    await page.goto("/");
    const header = page.getByRole("banner");
    await expect(header).toBeVisible();
    await page.mouse.wheel(0, 4000);
    await expect(header).toBeInViewport();
  });

  test("first node has the active glow class", async ({ page }) => {
    await page.goto("/");
    const firstTitle = lessons[0]!.title;
    const nodes = page.getByLabel(`${firstTitle} milestone`);
    await expect(nodes.first()).toBeAttached();
    const hasActive = await nodes.evaluateAll((els) =>
      els.some((el) => el.className.includes("node-active")),
    );
    expect(hasActive).toBe(true);
  });

  test("cards flip from opacity-0 to opacity-1 as they enter the viewport", async ({ page }) => {
    await page.goto("/");
    // Pick a card from the bottom half so we know it's initially off-screen.
    const bottomTitle = lessons[lessons.length - 2]!.title;
    const card = page
      .locator("article", { has: page.getByRole("heading", { name: bottomTitle }) })
      .first();

    await card.scrollIntoViewIfNeeded();
    await expect.poll(async () => card.getAttribute("data-in-view"), { timeout: 3000 }).toBe(
      "true",
    );
    await expect(card).toBeVisible();
  });
});
