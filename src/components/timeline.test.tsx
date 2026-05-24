import { render, screen } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { lessons } from "@/data/lessons";
import { Timeline } from "./timeline";

describe("Timeline", () => {
  it("renders one row per lesson in the supplied order", () => {
    render(<Timeline />);
    const headings = screen.getAllByRole("heading", { level: 3 });
    // Mobile + desktop each render the title, so 20 lessons -> 40 headings.
    expect(headings).toHaveLength(lessons.length * 2);
  });

  it("paints a copper spine both for desktop and mobile rails", () => {
    const { container } = render(<Timeline />);
    const spines = container.querySelectorAll(".copper-spine");
    expect(spines.length).toBe(2);
  });

  it("renders the lesson titles in their original chronological order", () => {
    render(<Timeline />);
    const titles = screen
      .getAllByRole("heading", { level: 3 })
      .map((h) => h.textContent)
      .filter((t, i) => i % 2 === 0);
    expect(titles).toEqual(lessons.map((l) => l.title));
  });

  it("server-renders all 20 titles with the spine fully extended", () => {
    const html = renderToString(<Timeline />);
    for (const lesson of lessons) {
      expect(html).toContain(lesson.title);
    }
    // SSR fast-path: spine ends at scaleY(1), opacity:1.
    expect(html).toContain("scaleY(1)");
  });
});
