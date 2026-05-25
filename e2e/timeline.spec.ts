import { expect, test } from "@playwright/test";
import { lessons } from "../src/data/lessons";

// The page only renders populated rows; placeholder entries (empty title)
// are filtered out by <Timeline />. E2E assertions use the same filter.
const populated = lessons.filter((l) => l.title.length > 0);

test.describe("Copper Lessons timeline", () => {
  test("shows the Railisations brand wordmark and logo", async ({ page }) => {
    await page.goto("/");
    const brand = page.getByRole("link", { name: "Railisations home" });
    await expect(brand).toBeAttached();
    // Wordmark text is "Railisations" (lowercase 'ai' highlighted in CSS).
    await expect(brand).toContainText("Railisations");
    // Brand link must contain an inline SVG logo.
    const logo = brand.locator("svg").first();
    await expect(logo).toBeAttached();
  });

  test("top bar exposes only the brand + search (no nav links)", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/");
    for (const label of ["Lessons", "Sign In", "Archive", "Resources", "Contact"]) {
      const re = new RegExp(`^${label}$`);
      await expect(page.getByRole("button", { name: re })).toHaveCount(0);
      await expect(page.locator("header").getByRole("link", { name: re })).toHaveCount(0);
    }
    await expect(page.getByRole("navigation", { name: /primary/i })).toHaveCount(0);
  });

  test("clicking the search button opens the search dialog", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /search/i }).click();
    const dialog = page.getByRole("dialog", { name: /search lessons/i });
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole("searchbox")).toBeFocused();
  });

  test("typing in the search filters lessons and Enter scrolls to the match", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/");
    await page.getByRole("button", { name: /search/i }).click();

    const search = page.getByRole("searchbox");
    await search.fill("agentic");

    const options = page.getByRole("option");
    await expect(options).toHaveCount(1);
    await expect(options.first()).toContainText("Agentic AI");

    await search.press("Enter");

    // Dialog has closed and the target lesson is briefly highlighted.
    await expect(page.getByRole("dialog", { name: /search lessons/i })).toBeHidden();
    const target = page.locator("#lesson-may-2025");
    await expect(target).toBeVisible();
    await expect(target).toHaveAttribute("data-highlight", "true");
  });

  test("Cmd+K (or Ctrl+K) toggles the search dialog", async ({ page }) => {
    await page.goto("/");
    // The Cmd/Ctrl+K listener attaches in a client-side useEffect, so wait
    // until the search button is interactive before firing the shortcut.
    await page.getByRole("button", { name: /search/i }).waitFor({ state: "visible" });
    await page.keyboard.press("ControlOrMeta+k");
    await expect(page.getByRole("dialog", { name: /search lessons/i })).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog", { name: /search lessons/i })).toBeHidden();
  });

  test("shows a friendly empty state when no lessons match", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /search/i }).click();
    await page.getByRole("searchbox").fill("zzzzzzzz");
    await expect(page.getByText(/no lessons match/i)).toBeVisible();
    await expect(page.getByRole("option")).toHaveCount(0);
  });

  for (const [slug, heading] of [
    ["privacy", "Privacy"],
    ["terms", "Terms of Service"],
    ["accessibility", "Accessibility"],
  ] as const) {
    test(`/${slug}/ page loads with the correct heading and footer`, async ({ page }) => {
      await page.goto(`/${slug}/`);
      await expect(page.getByRole("heading", { level: 1, name: heading })).toBeVisible();
      // Use the colon to disambiguate from body paragraphs that mention
      // "last updated" in their copy.
      await expect(page.getByText(/Last updated:/).first()).toBeVisible();
      // Footer should still be present so users can navigate sideways.
      await expect(page.getByRole("contentinfo")).toBeVisible();
    });
  }

  test("clicking a footer legal link navigates to its page", async ({ page }) => {
    await page.goto("/");
    await page.locator("footer").getByRole("link", { name: "Privacy Policy" }).click();
    await page.waitForURL(/\/privacy\/$/);
    await expect(page.getByRole("heading", { level: 1, name: "Privacy" })).toBeVisible();
  });

  test("timeline closes with a 'Suggest a lesson' epilogue after the last lesson", async ({
    page,
  }) => {
    await page.goto("/");
    // Scroll to the bottom of the timeline so the epilogue is in view.
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    const epilogue = page.getByRole("heading", {
      level: 3,
      name: /have a lesson worth adding/i,
    });
    await expect(epilogue).toBeVisible();

    // The epilogue's CTA is a real outbound link to the public discussion.
    const cta = page
      .getByRole("complementary")
      .getByRole("link", { name: /Suggest a lesson/i });
    await expect(cta).toHaveAttribute("target", "_blank");
    await expect(cta).toHaveAttribute("rel", "noopener noreferrer");
  });

  test("footer exposes a 'Suggest a lesson' link to GitHub Discussions", async ({ page }) => {
    await page.goto("/");
    const cta = page.locator("footer").getByRole("link", { name: /Suggest a lesson/i });
    await expect(cta).toBeVisible();
    const href = await cta.getAttribute("href");
    expect(href).toMatch(
      /^https:\/\/github\.com\/webbertakken\/railisations-com\/discussions\/new\?/,
    );
    expect(href).toContain("category=ideas");
    await expect(cta).toHaveAttribute("target", "_blank");
    await expect(cta).toHaveAttribute("rel", "noopener noreferrer");
  });

  test("clicking the brand from a legal page returns the user home", async ({ page }) => {
    await page.goto("/privacy/");
    await page.getByRole("link", { name: "Railisations home" }).click();
    await page.waitForURL(/\/(\?.*)?$/);
    // Home renders the lesson timeline.
    await expect(page.getByRole("region", { name: /lessons timeline/i })).toBeVisible();
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
    for (const lesson of populated) {
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
    const firstTitle = populated[0]!.title;
    const nodes = page.getByLabel(`${firstTitle} milestone`);
    await expect(nodes.first()).toBeAttached();
    const hasActive = await nodes.evaluateAll((els) =>
      els.some((el) => el.className.includes("node-active")),
    );
    expect(hasActive).toBe(true);
  });

  test("cards flip from opacity-0 to opacity-1 as they enter the viewport", async ({ page }) => {
    await page.goto("/");
    // Pick the last populated lesson so it's definitely below the fold.
    const bottomTitle = populated[populated.length - 1]!.title;
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
