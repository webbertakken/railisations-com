import { render, screen } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { lessons } from "@/data/lessons";
import { Timeline } from "./timeline";

const populated = lessons.filter((l) => l.title.length > 0);

describe("Timeline", () => {
  it("renders one card per populated lesson (mobile + desktop variants)", () => {
    const { container } = render(<Timeline />);
    // Each lesson row paints two articles (mobile + desktop layouts).
    // Placeholder (empty-title) lessons are skipped.
    const articles = container.querySelectorAll("article");
    expect(articles.length).toBe(populated.length * 2);
  });

  it("paints a copper spine both for desktop and mobile rails", () => {
    const { container } = render(<Timeline />);
    const spines = container.querySelectorAll(".copper-spine");
    expect(spines.length).toBe(2);
  });

  it("renders the populated lesson titles in their original chronological order", () => {
    const { container } = render(<Timeline />);
    const titles = Array.from(container.querySelectorAll("article h3"))
      .map((h) => h.textContent)
      .filter((_, i) => i % 2 === 0);
    expect(titles).toEqual(populated.map((l) => l.title));
  });

  it("server-renders every populated title with the spine fully extended", () => {
    const html = renderToString(<Timeline />);
    for (const lesson of populated) {
      expect(html).toContain(lesson.title);
    }
    // SSR fast-path: spine ends at scaleY(1), opacity:1.
    expect(html).toContain("scaleY(1)");
  });

  it("closes the timeline with the SuggestionPrompt epilogue", () => {
    render(<Timeline />);
    const epilogue = screen.getByRole("heading", {
      level: 3,
      name: /have a lesson worth adding/i,
    });
    expect(epilogue).toBeInTheDocument();
    // DOM order: epilogue lands AFTER the final lesson title.
    const finalLesson = screen.getAllByRole("heading", {
      level: 3,
      name: populated[populated.length - 1]!.title,
    })[0]!;
    const order = finalLesson.compareDocumentPosition(epilogue);
    expect(order & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });
});
