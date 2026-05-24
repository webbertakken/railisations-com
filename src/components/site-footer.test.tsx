import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { SiteFooter } from "./site-footer";

describe("SiteFooter", () => {
  it("renders brand and all legal links", () => {
    render(<SiteFooter />);
    expect(screen.getByText("Copper Lessons")).toBeInTheDocument();
    for (const label of ["Privacy Policy", "Terms of Service", "Accessibility"]) {
      expect(screen.getByRole("link", { name: label })).toBeInTheDocument();
    }
  });

  it("emits a copyright line with the current year", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2027-03-14T00:00:00Z"));
    render(<SiteFooter />);
    expect(
      screen.getByText(/© 2027 Industrial Heritage Archives\. All rights reserved\./),
    ).toBeInTheDocument();
    vi.useRealTimers();
  });

  it("uses the inverse-surface background", () => {
    const { container } = render(<SiteFooter />);
    const footer = container.querySelector("footer");
    expect(footer?.className).toContain("bg-inverse-surface");
  });
});
