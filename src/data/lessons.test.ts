import { describe, expect, it } from "vitest";
import { lessons } from "./lessons";

describe("lessons", () => {
  it("has 20 entries", () => {
    expect(lessons).toHaveLength(20);
  });

  it("preserves the chronological order from the design", () => {
    const first = lessons[0];
    const last = lessons[lessons.length - 1];
    expect(first?.date).toBe("JANUARY 2021");
    expect(last?.date).toBe("AUGUST 2025");
  });

  it("each entry exposes a non-empty date, title and description", () => {
    for (const lesson of lessons) {
      expect(lesson.date).toMatch(/^[A-Z]+ \d{4}$/);
      expect(lesson.title.length).toBeGreaterThan(0);
      expect(lesson.desc.length).toBeGreaterThan(0);
    }
  });

  it("is frozen (cannot be mutated at runtime)", () => {
    expect(Object.isFrozen(lessons)).toBe(true);
    expect(() => {
      (lessons as unknown as Array<unknown>).push({});
    }).toThrow();
  });
});
