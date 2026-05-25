import { describe, expect, it } from "vitest";
import { lessons } from "./lessons";

describe("lessons", () => {
  it("exposes a frozen readonly array", () => {
    expect(Object.isFrozen(lessons)).toBe(true);
    expect(() => {
      (lessons as unknown as Array<unknown>).push({});
    }).toThrow();
  });

  it("contains at least one populated lesson", () => {
    const populated = lessons.filter((l) => l.title.length > 0);
    expect(populated.length).toBeGreaterThan(0);
  });

  it("every populated entry has a date, title, and description string", () => {
    const populated = lessons.filter((l) => l.title.length > 0);
    for (const lesson of populated) {
      expect(typeof lesson.date).toBe("string");
      expect(lesson.date.length).toBeGreaterThan(0);
      expect(typeof lesson.title).toBe("string");
      expect(typeof lesson.desc).toBe("string");
      expect(lesson.desc.length).toBeGreaterThan(0);
    }
  });

  it("permits placeholder entries with empty title/date/desc for future content", () => {
    // The data file may carry blank rows the operator is yet to fill in;
    // the Timeline component filters them out before rendering.
    const blanks = lessons.filter((l) => l.title.length === 0);
    for (const lesson of blanks) {
      expect(lesson.date).toBe("");
      expect(lesson.title).toBe("");
      expect(lesson.desc).toBe("");
    }
  });
});
