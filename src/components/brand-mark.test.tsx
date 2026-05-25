import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { BrandLogo, BrandMark } from "./brand-mark";

describe("BrandLogo", () => {
  it("renders an aria-hidden SVG by default", () => {
    const { container } = render(<BrandLogo />);
    const svg = container.querySelector("svg");
    expect(svg).not.toBeNull();
    expect(svg?.getAttribute("aria-hidden")).toBe("true");
    expect(svg?.getAttribute("role")).toBe(null);
  });

  it("uses an accessible label when one is provided", () => {
    render(<BrandLogo label="Railisations gear" />);
    const svg = screen.getByRole("img", { name: "Railisations gear" });
    expect(svg.tagName.toLowerCase()).toBe("svg");
  });

  it("merges a className onto the root SVG", () => {
    const { container } = render(<BrandLogo className="size-12 custom" />);
    const svg = container.querySelector("svg");
    expect(svg?.getAttribute("class")).toContain("size-12");
    expect(svg?.getAttribute("class")).toContain("custom");
  });
});

describe("BrandMark", () => {
  it("renders the full Railisations wordmark with a lowercase 'ai'", () => {
    render(<BrandMark />);
    const root = screen.getByTestId("brand-mark");
    expect(root.textContent).toBe("Railisations");
  });

  it("highlights the 'ai' letters in a lighter copper", () => {
    render(<BrandMark />);
    const highlight = screen.getByText("ai");
    expect(highlight.tagName.toLowerCase()).toBe("span");
    expect(highlight.className).toContain("text-primary-fixed");
  });

  it("uses the display-lg Playfair scale on desktop and -mobile size below md", () => {
    render(<BrandMark />);
    const root = screen.getByTestId("brand-mark");
    expect(root.className).toContain("font-display-lg");
    expect(root.className).toContain("text-display-lg-mobile");
    expect(root.className).toContain("md:text-display-lg");
  });
});
