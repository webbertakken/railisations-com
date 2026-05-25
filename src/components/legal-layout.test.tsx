import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { LegalLayout } from "./legal-layout";

describe("LegalLayout", () => {
  it("renders the title as an h1 in the Playfair display scale", () => {
    render(
      <LegalLayout title="Privacy">
        <p>body copy</p>
      </LegalLayout>,
    );
    const heading = screen.getByRole("heading", { level: 1, name: "Privacy" });
    expect(heading.className).toContain("font-display-lg");
  });

  it("renders body content inside an <article>", () => {
    const { container } = render(
      <LegalLayout title="Terms">
        <p>hello world</p>
      </LegalLayout>,
    );
    const article = container.querySelector("article");
    expect(article).not.toBeNull();
    expect(within(article as HTMLElement).getByText("hello world")).toBeInTheDocument();
  });

  it("shows the last-updated date when provided", () => {
    render(
      <LegalLayout title="Accessibility" lastUpdated="May 2026">
        <p>x</p>
      </LegalLayout>,
    );
    expect(screen.getByText(/last updated/i)).toHaveTextContent("Last updated: May 2026");
  });

  it("omits the last-updated line when no date is given", () => {
    render(
      <LegalLayout title="Accessibility">
        <p>x</p>
      </LegalLayout>,
    );
    expect(screen.queryByText(/last updated/i)).toBeNull();
  });

  it("includes the global footer (legal nav)", () => {
    render(
      <LegalLayout title="Privacy">
        <p>x</p>
      </LegalLayout>,
    );
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Terms of Service" })).toBeInTheDocument();
  });
});
