import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { SiteFooter } from "./site-footer";

describe("SiteFooter", () => {
  it("renders the legal links and the Suggest-a-lesson CTA, no brand mark", () => {
    render(<SiteFooter />);
    expect(screen.queryByTestId("brand-mark")).toBeNull();
    expect(screen.queryByRole("img")).toBeNull();
    for (const label of [
      /Suggest a lesson/i,
      "Privacy Policy",
      "Terms of Service",
      "Accessibility",
    ]) {
      expect(screen.getByRole("link", { name: label })).toBeInTheDocument();
    }
  });

  it("opens the Suggest-a-lesson link in a new tab against the public GitHub discussion", () => {
    render(<SiteFooter />);
    const link = screen.getByRole("link", { name: /Suggest a lesson/i });
    expect(link.getAttribute("href")).toMatch(
      /^https:\/\/github\.com\/webbertakken\/railisations-com\/discussions\/new\?/,
    );
    expect(link.getAttribute("target")).toBe("_blank");
    expect(link.getAttribute("rel")).toBe("noopener noreferrer");
  });

  it("stacks the legal links above a centered copyright (no two-column md layout)", () => {
    const { container } = render(<SiteFooter />);
    const wrapper = container.querySelector("footer > div");
    expect(wrapper?.className).toContain("flex-col");
    expect(wrapper?.className).not.toContain("md:flex-row");

    const copyright = screen.getByText(/©.+Railisations/);
    expect(copyright.className).toContain("text-center");
    expect(copyright.className).not.toContain("md:text-right");

    // DOM order: legal nav first, copyright second.
    const nav = screen.getByRole("navigation", { name: /legal/i });
    const order = nav.compareDocumentPosition(copyright);
    expect(order & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it("emits a copyright line owned by Railisations with the current year", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2027-03-14T00:00:00Z"));
    render(<SiteFooter />);
    expect(
      screen.getByText(/© 2027 Railisations\. All rights reserved\./),
    ).toBeInTheDocument();
    vi.useRealTimers();
  });

  it("uses a dark, slightly elevated surface and warm muted text", () => {
    const { container } = render(<SiteFooter />);
    const footer = container.querySelector("footer");
    expect(footer?.className).toContain("bg-surface-container-low");
    expect(footer?.className).not.toContain("bg-inverse-surface");
    expect(footer?.className).toContain("border-outline-variant");
  });

  it("renders the legal nav links in the warm muted on-surface tone", () => {
    render(<SiteFooter />);
    const terms = screen.getByRole("link", { name: "Terms of Service" });
    expect(terms.className).toContain("text-on-surface-variant");
  });

  it("points the legal links at their real pages", () => {
    render(<SiteFooter />);
    // Next's Link strips the trailing slash in some test environments
    // (vitest doesn't load next.config.ts), so accept either form. The
    // static build still emits the canonical /privacy/ at runtime.
    expect(
      screen.getByRole("link", { name: "Privacy Policy" }).getAttribute("href"),
    ).toMatch(/^\/privacy\/?$/);
    expect(
      screen.getByRole("link", { name: "Terms of Service" }).getAttribute("href"),
    ).toMatch(/^\/terms\/?$/);
    expect(
      screen.getByRole("link", { name: "Accessibility" }).getAttribute("href"),
    ).toMatch(/^\/accessibility\/?$/);
  });
});
