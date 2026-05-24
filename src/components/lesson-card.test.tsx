import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { LessonCard } from "./lesson-card";

describe("LessonCard", () => {
  it("renders the headline and copy with the supplied heading level", () => {
    render(
      <LessonCard
        title="Embrace the Initial Friction"
        desc="A first lesson."
        size="md"
        inView
      />,
    );
    expect(screen.getByRole("heading", { level: 3, name: "Embrace the Initial Friction" }))
      .toBeInTheDocument();
    expect(screen.getByText("A first lesson.")).toBeInTheDocument();
  });

  it("paints exactly four rivets", () => {
    const { container } = render(
      <LessonCard title="A" desc="B" size="md" inView />,
    );
    const rivets = container.querySelectorAll(".rivet");
    expect(rivets).toHaveLength(4);
    expect(container.querySelector(".rivet-tl")).not.toBeNull();
    expect(container.querySelector(".rivet-tr")).not.toBeNull();
    expect(container.querySelector(".rivet-bl")).not.toBeNull();
    expect(container.querySelector(".rivet-br")).not.toBeNull();
  });

  it("uses a smaller headline class for mobile size", () => {
    render(<LessonCard title="Mobile" desc="m" size="sm" inView />);
    const heading = screen.getByRole("heading", { name: "Mobile" });
    expect(heading.className).toContain("text-headline-sm");
  });

  it("uses a larger headline class for desktop size", () => {
    render(<LessonCard title="Desktop" desc="d" size="md" inView />);
    const heading = screen.getByRole("heading", { name: "Desktop" });
    expect(heading.className).toContain("text-headline-md");
  });

  it("toggles its data-in-view attribute based on inView", () => {
    const { rerender, container } = render(
      <LessonCard title="X" desc="Y" size="md" inView={false} />,
    );
    const article = container.querySelector("article");
    expect(article).not.toBeNull();
    expect(article?.getAttribute("data-in-view")).toBe("false");
    rerender(<LessonCard title="X" desc="Y" size="md" inView />);
    expect(article?.getAttribute("data-in-view")).toBe("true");
  });
});
