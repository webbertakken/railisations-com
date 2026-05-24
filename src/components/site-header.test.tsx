import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderToString } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { SiteHeader } from "./site-header";

describe("SiteHeader", () => {
  it("displays the brand wordmark", () => {
    render(<SiteHeader />);
    expect(screen.getByRole("link", { name: "Copper Lessons" })).toBeInTheDocument();
  });

  it("marks Lessons as the active nav item", () => {
    render(<SiteHeader />);
    const lessons = screen.getByRole("link", { name: "Lessons" });
    expect(lessons.getAttribute("aria-current")).toBe("page");
    expect(lessons.className).toContain("text-primary");
    expect(lessons.className).toContain("border-primary");
  });

  it("renders the secondary nav links", () => {
    render(<SiteHeader />);
    for (const label of ["Archive", "Resources", "Contact"]) {
      const link = screen.getByRole("link", { name: label });
      expect(link).toBeInTheDocument();
      expect(link.getAttribute("aria-current")).toBeNull();
    }
  });

  it("forwards search and sign-in clicks to the provided handlers", async () => {
    const user = userEvent.setup();
    const onSearch = vi.fn();
    const onSignIn = vi.fn();
    render(<SiteHeader onSearch={onSearch} onSignIn={onSignIn} />);
    await user.click(screen.getByRole("button", { name: "Search" }));
    await user.click(screen.getByRole("button", { name: "Sign In" }));
    expect(onSearch).toHaveBeenCalledTimes(1);
    expect(onSignIn).toHaveBeenCalledTimes(1);
  });

  it("tolerates the absence of handlers without throwing", async () => {
    const user = userEvent.setup();
    render(<SiteHeader />);
    await user.click(screen.getByRole("button", { name: "Search" }));
    await user.click(screen.getByRole("button", { name: "Sign In" }));
    expect(screen.getByRole("banner")).toBeInTheDocument();
  });

  it("renders the final layout on the server (SSR fast-path)", () => {
    const html = renderToString(<SiteHeader />);
    expect(html).toContain("Copper Lessons");
    // SSR collapse: animate=false → spring starts at to-values, opacity:1.
    expect(html).toContain("opacity:1");
  });
});
