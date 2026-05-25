import { describe, expect, it } from "vitest";
import type { Lesson } from "@/data/lessons";
import { lessons } from "@/data/lessons";
import { nearSubstring, searchLessons } from "./search";

describe("searchLessons", () => {
  it("returns the populated lessons unchanged for an empty / whitespace query", () => {
    const populated = lessons.filter((l) => l.title.length > 0);
    expect(searchLessons("", lessons).map((l) => l.title)).toEqual(
      populated.map((l) => l.title),
    );
    expect(searchLessons("   ", lessons).map((l) => l.title)).toEqual(
      populated.map((l) => l.title),
    );
  });

  it("matches a full title substring (case-insensitive)", () => {
    const out = searchLessons("CODE AUTOCOMPLETION", lessons);
    expect(out[0]?.title).toBe("Code autocompletion");
  });

  it("matches a partial word in the title", () => {
    const out = searchLessons("autocomp", lessons);
    expect(out[0]?.title).toBe("Code autocompletion");
  });

  it("matches words from the description", () => {
    const out = searchLessons("midjourney", lessons);
    expect(out[0]?.title).toBe("Image generation");
  });

  it("matches by the formatted date", () => {
    const out = searchLessons("May, 2025", lessons);
    expect(out[0]?.date).toBe("May, 2025");
  });

  it("matches every lesson sharing a year", () => {
    const titles = searchLessons("2022", lessons).map((l) => l.title);
    expect(titles).toEqual(["Image generation", "Conversational AI"]);
  });

  it("tolerates a single typo (insert / delete / substitute)", () => {
    // 'autocompltion' is 'autocompletion' with one missing letter.
    const out = searchLessons("autocompltion", lessons);
    expect(out[0]?.title).toBe("Code autocompletion");
  });

  it("does not over-match short noisy queries", () => {
    // Three letters that happen to appear in several descriptions
    // shouldn't flood the result list.
    const out = searchLessons("ai", lessons);
    // Should only hit actual substring matches in title/desc/date.
    for (const lesson of out) {
      const haystack = `${lesson.title} ${lesson.desc} ${lesson.date}`.toLowerCase();
      expect(haystack).toContain("ai");
    }
  });

  it("ranks title matches above description matches", () => {
    const out = searchLessons("agentic", lessons);
    expect(out[0]?.title).toBe("Agentic AI");
  });

  it("is stable for lessons of equal score (preserves source order)", () => {
    const tiny: ReadonlyArray<Lesson> = [
      { date: "A", title: "alpha", desc: "x" },
      { date: "B", title: "alpha", desc: "x" },
    ];
    const out = searchLessons("alpha", tiny);
    expect(out.map((l) => l.date)).toEqual(["A", "B"]);
  });

  it("ranks lessons of higher score above lower-score ones", () => {
    const mixed: ReadonlyArray<Lesson> = [
      { date: "A", title: "alphabet", desc: "alpha is fun" }, // 100 + 30 = 130
      { date: "B", title: "beta", desc: "alpha appears" }, // 30
      { date: "C", title: "gamma", desc: "alpha alpha" }, // 30
    ];
    const out = searchLessons("alpha", mixed);
    expect(out.map((l) => l.date)).toEqual(["A", "B", "C"]);
  });

  it("skips placeholder rows with an empty title", () => {
    const withBlank: ReadonlyArray<Lesson> = [
      { date: "Jun, 2021", title: "Code autocompletion", desc: "blah" },
      { date: "", title: "", desc: "" },
    ];
    expect(searchLessons("", withBlank).map((l) => l.title)).toEqual([
      "Code autocompletion",
    ]);
    expect(searchLessons("autocomp", withBlank)).toHaveLength(1);
  });

  it("fuzzy-matches in the description when no title hit applies", () => {
    // 'midjurney' (typo) appears only in description of Image generation.
    const out = searchLessons("midjurney", lessons);
    expect(out[0]?.title).toBe("Image generation");
  });
});

describe("nearSubstring", () => {
  it("returns true for any target on an empty query", () => {
    expect(nearSubstring("", "anything")).toBe(true);
  });

  it("matches exact substrings without invoking the edit-distance loop", () => {
    expect(nearSubstring("abc", "xxabcyy")).toBe(true);
  });

  it("declines short queries to avoid noisy fuzzy matches", () => {
    expect(nearSubstring("rest", "resilience")).toBe(false);
  });

  it("tolerates one substitution at equal length", () => {
    expect(nearSubstring("frict", "frxct")).toBe(true);
  });

  it("tolerates one deletion (query longer than window)", () => {
    expect(nearSubstring("frictt", "xxfrictyy")).toBe(true);
  });

  it("tolerates one insertion (query shorter than a window)", () => {
    expect(nearSubstring("frcti", "xxfricti")).toBe(true);
  });

  it("rejects strings with more than one edit", () => {
    expect(nearSubstring("abcde", "axxde")).toBe(false);
  });
});
