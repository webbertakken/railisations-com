import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderToString } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { SiteHeader } from "./site-header";

describe("SiteHeader", () => {
  it("renders the Railisations wordmark inside the brand link", () => {
    render(<SiteHeader />);
    const brand = screen.getByRole("link", { name: /Railisations/i });
    expect(brand).toBeInTheDocument();
    expect(brand.textContent).toBe("Railisations");
  });

  it("points the brand link at the site root (not an in-page anchor)", () => {
    render(<SiteHeader />);
    const brand = screen.getByRole("link", { name: /Railisations home/i });
    expect(brand.getAttribute("href")).toBe("/");
  });

  it("renders the brass gear logo alongside the wordmark", () => {
    const { container } = render(<SiteHeader />);
    // The brand link wraps the inline cog SVG (aria-hidden) + the wordmark.
    const logo = container.querySelector("header a[href='/'] svg");
    expect(logo).not.toBeNull();
    expect(logo?.getAttribute("aria-hidden")).toBe("true");
  });

  it("renders no secondary nav links (brand + search only)", () => {
    render(<SiteHeader />);
    for (const label of ["Lessons", "Archive", "Resources", "Contact", "Sign In"]) {
      expect(screen.queryByRole("link", { name: new RegExp(`^${label}$`) })).toBeNull();
      expect(screen.queryByRole("button", { name: label })).toBeNull();
    }
    // The <nav> element itself should no longer be present.
    expect(screen.queryByRole("navigation", { name: /primary/i })).toBeNull();
  });

  it("forwards search clicks to the provided handler", async () => {
    const user = userEvent.setup();
    const onSearch = vi.fn();
    render(<SiteHeader onSearch={onSearch} />);
    await user.click(screen.getByRole("button", { name: /search/i }));
    expect(onSearch).toHaveBeenCalledTimes(1);
  });

  it("tolerates the absence of a search handler without throwing", async () => {
    const user = userEvent.setup();
    render(<SiteHeader />);
    await user.click(screen.getByRole("button", { name: /search/i }));
    expect(screen.getByRole("banner")).toBeInTheDocument();
  });

  it("renders without any entrance animation (no off-screen / faded initial state)", () => {
    const html = renderToString(<SiteHeader />);
    expect(html).toContain("Railisations");
    // The slide-down spring was removed; the header should never appear
    // off-screen or faded out on the first paint.
    expect(html).not.toMatch(/translateY\(-100%\)/);
    expect(html).not.toMatch(/opacity:\s*0[;"]/);
  });
});
