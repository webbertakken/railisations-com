import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { SiteShell } from "./site-shell";

beforeEach(() => {
  Element.prototype.scrollIntoView = vi.fn();
});

describe("SiteShell", () => {
  it("renders the header above its children and a closed search overlay", () => {
    render(
      <SiteShell>
        <p>page body</p>
      </SiteShell>,
    );
    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByText("page body")).toBeInTheDocument();
    const dialog = screen.getByRole("dialog", { hidden: true });
    expect(dialog.hasAttribute("open")).toBe(false);
  });

  it("opens the overlay when the search button is clicked", async () => {
    const user = userEvent.setup();
    render(
      <SiteShell>
        <p>x</p>
      </SiteShell>,
    );
    await user.click(screen.getByRole("button", { name: /search/i }));
    expect(screen.getByRole("dialog").hasAttribute("open")).toBe(true);
  });

  it("opens the overlay via Cmd/Ctrl+K", async () => {
    const user = userEvent.setup();
    render(
      <SiteShell>
        <p>x</p>
      </SiteShell>,
    );
    await user.keyboard("{Meta>}k{/Meta}");
    expect(screen.getByRole("dialog").hasAttribute("open")).toBe(true);
    await user.keyboard("{Escape}");
    expect(screen.getByRole("dialog", { hidden: true }).hasAttribute("open")).toBe(false);
    await user.keyboard("{Control>}k{/Control}");
    expect(screen.getByRole("dialog").hasAttribute("open")).toBe(true);
  });

  it("scrolls to the selected lesson after a search hit, then clears the highlight", async () => {
    const user = userEvent.setup();
    const scroll = vi.fn();
    const target = document.createElement("div");
    target.id = "lesson-june-2021";
    target.scrollIntoView = scroll;
    document.body.appendChild(target);

    render(
      <SiteShell highlightMs={20}>
        <p>x</p>
      </SiteShell>,
    );
    await user.click(screen.getByRole("button", { name: /search/i }));
    await user.type(screen.getByRole("searchbox"), "autocomp");
    await user.keyboard("{Enter}");
    expect(scroll).toHaveBeenCalledTimes(1);
    expect(target.getAttribute("data-highlight")).toBe("true");

    // Real timer (20ms) elapses quickly and the attribute is removed.
    await new Promise((r) => setTimeout(r, 60));
    expect(target.hasAttribute("data-highlight")).toBe(false);

    target.remove();
  });

  it("falls back to a hash navigation when the lesson is not on the current page", async () => {
    const user = userEvent.setup();
    const assign = vi.fn();
    Object.defineProperty(window, "location", {
      configurable: true,
      value: { ...window.location, hash: "", assign },
    });

    render(
      <SiteShell>
        <p>legal page body</p>
      </SiteShell>,
    );
    await user.click(screen.getByRole("button", { name: /search/i }));
    await user.type(screen.getByRole("searchbox"), "autocomp");
    await user.keyboard("{Enter}");
    expect(assign).toHaveBeenCalledWith("/#lesson-june-2021");
  });

  it("applies the highlight pulse when arriving with a matching /#lesson-... hash", async () => {
    const target = document.createElement("div");
    target.id = "lesson-june-2021";
    document.body.appendChild(target);

    Object.defineProperty(window, "location", {
      configurable: true,
      value: { ...window.location, hash: "#lesson-june-2021" },
    });

    render(
      <SiteShell highlightMs={20}>
        <p>x</p>
      </SiteShell>,
    );

    await new Promise((r) => requestAnimationFrame(() => r(undefined)));
    expect(target.getAttribute("data-highlight")).toBe("true");
    await new Promise((r) => setTimeout(r, 60));
    expect(target.hasAttribute("data-highlight")).toBe(false);

    target.remove();
  });

  it("does not apply a highlight when the hash points at a non-existent id", async () => {
    Object.defineProperty(window, "location", {
      configurable: true,
      value: { ...window.location, hash: "#lesson-nonexistent" },
    });

    render(
      <SiteShell highlightMs={20}>
        <p>x</p>
      </SiteShell>,
    );
    await new Promise((r) => requestAnimationFrame(() => r(undefined)));
    // No element has data-highlight on the document.
    expect(document.querySelector("[data-highlight]")).toBeNull();
  });

  it("does nothing when the page loads without any hash", async () => {
    Object.defineProperty(window, "location", {
      configurable: true,
      value: { ...window.location, hash: "" },
    });

    render(
      <SiteShell>
        <p>x</p>
      </SiteShell>,
    );
    await new Promise((r) => requestAnimationFrame(() => r(undefined)));
    expect(document.querySelector("[data-highlight]")).toBeNull();
  });
});
