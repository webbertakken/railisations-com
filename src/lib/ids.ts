/**
 * Stable DOM id for a lesson, derived from its date label.
 * Used by the search overlay to deep-link / scroll-into-view.
 */
export function lessonId(date: string): string {
  const slug = date
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return `lesson-${slug}`;
}
