import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SuggestionPrompt } from "./suggestion-prompt";

describe("SuggestionPrompt", () => {
  it("renders an aside with an editorial-style heading", () => {
    render(<SuggestionPrompt />);
    const heading = screen.getByRole("heading", {
      level: 3,
      name: /have a lesson worth adding/i,
    });
    expect(heading).toBeInTheDocument();
  });

  it("shows the copper kicker label above the headline", () => {
    render(<SuggestionPrompt />);
    expect(screen.getByText(/the story continues/i)).toBeInTheDocument();
  });

  it("offers a copper CTA link that points at the public GitHub discussion", () => {
    render(<SuggestionPrompt />);
    const cta = screen.getByRole("link", { name: /Suggest a lesson/i });
    expect(cta.getAttribute("href")).toMatch(
      /^https:\/\/github\.com\/webbertakken\/railisations-com\/discussions\/new\?/,
    );
    expect(cta.getAttribute("target")).toBe("_blank");
    expect(cta.getAttribute("rel")).toBe("noopener noreferrer");
  });
});
