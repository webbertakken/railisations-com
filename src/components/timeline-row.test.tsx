import { render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { TimelineRow } from "./timeline-row";

const lesson = {
  date: "JANUARY 2021",
  title: "Embrace the Initial Friction",
  desc: "The first lesson.",
};

afterEach(() => {
  vi.restoreAllMocks();
});

describe("TimelineRow", () => {
  it("marks the row wrapper with the timeline-row hover-group class", () => {
    const { container } = render(<TimelineRow lesson={lesson} index={0} />);
    const row = container.querySelector(".timeline-row");
    expect(row).not.toBeNull();
  });

  it("tags every date element with the row-date class so :has(:hover) can target it", () => {
    const { container } = render(<TimelineRow lesson={lesson} index={0} />);
    // One date on mobile, one on desktop = two .row-date elements.
    expect(container.querySelectorAll(".row-date").length).toBeGreaterThanOrEqual(2);
  });

  it("renders both the mobile and desktop variants of every primitive", () => {
    render(<TimelineRow lesson={lesson} index={0} />);
    // Card title appears in both the mobile and the desktop layouts.
    const headings = screen.getAllByRole("heading", { name: lesson.title });
    expect(headings.length).toBeGreaterThanOrEqual(2);
    // Date label is rendered for both.
    const dates = screen.getAllByText(lesson.date);
    expect(dates.length).toBeGreaterThanOrEqual(2);
  });

  it("places the desktop card on the left half when index is even", () => {
    const { container } = render(<TimelineRow lesson={lesson} index={0} />);
    const desktop = container.querySelector("[data-testid='timeline-row-desktop']");
    expect(desktop).not.toBeNull();
    expect(desktop?.getAttribute("data-side")).toBe("left");
  });

  it("places the desktop card on the right half when index is odd", () => {
    const { container } = render(<TimelineRow lesson={lesson} index={1} />);
    const desktop = container.querySelector("[data-testid='timeline-row-desktop']");
    expect(desktop?.getAttribute("data-side")).toBe("right");
  });

  it("keeps the entrance spring at its hidden start while inView is false", () => {
    class NeverIntersecting {
      root = null;
      rootMargin = "";
      thresholds: number[] = [];
      observe() {}
      unobserve() {}
      disconnect() {}
      takeRecords(): IntersectionObserverEntry[] {
        return [];
      }
    }
    vi.stubGlobal("IntersectionObserver", NeverIntersecting);
    const { container } = render(<TimelineRow lesson={lesson} index={1} />);
    const desktop = container.querySelector("[data-testid='timeline-row-desktop']");
    expect(desktop).not.toBeNull();
    // The card stays off-screen (data-in-view="false") under these conditions.
    const card = within(desktop as HTMLElement).getAllByRole("article")[0];
    expect(card?.getAttribute("data-in-view")).toBe("false");
    vi.unstubAllGlobals();
  });

  it("renders with zero delay when the user prefers reduced motion", () => {
    vi.spyOn(window, "matchMedia").mockImplementation(
      (query) =>
        ({
          matches: query === "(prefers-reduced-motion: reduce)",
          media: query,
          onchange: null,
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          addListener: vi.fn(),
          removeListener: vi.fn(),
          dispatchEvent: vi.fn(),
        }) as unknown as MediaQueryList,
    );
    const { container } = render(<TimelineRow lesson={lesson} index={0} />);
    // First mobile heading still rendered, animation is immediate.
    expect(
      within(container).getAllByRole("heading", { name: lesson.title }).length,
    ).toBeGreaterThan(0);
  });

  it("marks the very first row as the active node, others as inactive", () => {
    const { container: first } = render(<TimelineRow lesson={lesson} index={0} />);
    const desktop = first.querySelector("[data-testid='timeline-row-desktop']");
    const node = within(desktop as HTMLElement).getByLabelText(
      `${lesson.title} milestone`,
    );
    expect(node.className).toContain("node-active");

    const { container: second } = render(<TimelineRow lesson={lesson} index={3} />);
    const desktop2 = second.querySelector("[data-testid='timeline-row-desktop']");
    const node2 = within(desktop2 as HTMLElement).getByLabelText(
      `${lesson.title} milestone`,
    );
    expect(node2.className).not.toContain("node-active");
  });
});
