import type { Lesson } from "@/data/lessons";

/**
 * Local fuzzy search over the lesson set. No external deps - the
 * dataset is fixed at 20 entries so a hand-rolled scorer is cheaper
 * (and friendlier to bundle size) than any indexer.
 *
 * "Fuzzy" here = case-insensitive multi-field substring matching with
 * a tiny 1-edit (insert / delete / substitute) typo tolerance to
 * catch obvious mis-types. We deliberately avoid arbitrary subsequence
 * matching because it produces too many false positives on a 20-item
 * dataset of short serif titles.
 *
 * Scoring (higher is better):
 *  - substring hit in title:        100
 *  - substring hit in date:          50
 *  - substring hit in description:   30
 *  - 1-edit hit in title:            15
 *  - 1-edit hit in description:       5
 */

type Scored = { lesson: Lesson; score: number; order: number };

/**
 * Returns true when `query` appears as a substring of `target` after
 * at most one edit (insert / delete / substitute). Used for typo
 * tolerance against short query strings.
 */
export function nearSubstring(query: string, target: string): boolean {
  if (query.length === 0) return true;
  if (target.includes(query)) return true;
  // Fuzzy matching gets noisy for short queries on a 20-item set;
  // require at least 5 chars before allowing a 1-edit tolerance.
  if (query.length < 5) return false;

  const max = target.length - query.length + 2;
  for (let start = 0; start < max; start++) {
    for (let len = query.length - 1; len <= query.length + 1; len++) {
      const window = target.slice(start, start + len);
      if (levenshteinAtMostOne(query, window)) return true;
    }
  }
  return false;
}

// Caller (`nearSubstring`) guarantees |a.length - b.length| <= 1.
function levenshteinAtMostOne(a: string, b: string): boolean {
  let i = 0;
  let j = 0;
  let edits = 0;
  while (i < a.length && j < b.length) {
    if (a[i] === b[j]) {
      i++;
      j++;
      continue;
    }
    if (++edits > 1) return false;
    if (a.length === b.length) {
      i++;
      j++;
    } else if (a.length > b.length) {
      i++;
    } else {
      j++;
    }
  }
  if (i < a.length || j < b.length) edits += Math.max(a.length - i, b.length - j);
  return edits <= 1;
}

// Caller (`searchLessons`) guarantees `query` is a non-empty,
// lowercased string.
function scoreLesson(query: string, lesson: Lesson): number {
  const q = query;
  const title = lesson.title.toLowerCase();
  const desc = lesson.desc.toLowerCase();
  const date = lesson.date.toLowerCase();

  let score = 0;
  if (title.includes(q)) score += 100;
  if (date.includes(q)) score += 50;
  if (desc.includes(q)) score += 30;

  if (score === 0) {
    if (nearSubstring(q, title)) score += 15;
    else if (nearSubstring(q, desc)) score += 5;
  }

  return score;
}

export function searchLessons(
  query: string,
  source: ReadonlyArray<Lesson>,
): ReadonlyArray<Lesson> {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) return source.filter((l) => l.title.length > 0);

  const scored: Scored[] = [];
  source.forEach((lesson, order) => {
    // Skip placeholder entries that haven't been written yet.
    if (lesson.title.length === 0) return;
    const score = scoreLesson(trimmed, lesson);
    if (score > 0) scored.push({ lesson, score, order });
  });

  scored.sort((a, b) => (b.score === a.score ? a.order - b.order : b.score - a.score));
  return scored.map((s) => s.lesson);
}
