import { describe, expect, it } from "vitest";
import { lessonId } from "./ids";

describe("lessonId", () => {
  it("slugifies a 'MONTH YEAR' date into a stable anchor", () => {
    expect(lessonId("JANUARY 2021")).toBe("lesson-january-2021");
    expect(lessonId("AUGUST 2025")).toBe("lesson-august-2025");
  });

  it("collapses runs of whitespace and strips non-alphanumerics", () => {
    expect(lessonId("  March    2024 ")).toBe("lesson-march-2024");
    expect(lessonId("MAY 2025!")).toBe("lesson-may-2025");
  });
});
