import { describe, expect, it } from "vitest";
import { SUGGEST_URL } from "./links";

describe("SUGGEST_URL", () => {
  it("points at the public discussions endpoint for the railisations repo", () => {
    expect(SUGGEST_URL).toMatch(
      /^https:\/\/github\.com\/webbertakken\/railisations-com\/discussions\/new\?/,
    );
  });

  it("pre-fills the Ideas category", () => {
    expect(SUGGEST_URL).toContain("category=ideas");
  });

  it("pre-fills the title with a 'Lesson idea: ' prefix", () => {
    const params = new URL(SUGGEST_URL).searchParams;
    expect(params.get("title")).toBe("Lesson idea: ");
  });

  it("pre-fills a markdown body with the prompt template", () => {
    const params = new URL(SUGGEST_URL).searchParams;
    const body = params.get("body") ?? "";
    expect(body).toContain("What's the lesson?");
    expect(body).toContain("Why does it matter?");
    expect(body).toContain("Suggested via railisations.com");
  });
});
