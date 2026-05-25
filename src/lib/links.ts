/**
 * External outbound links. Centralised so the URL builder logic is
 * unit-testable and the discussion-template copy lives in one place
 * (not buried inside JSX).
 */

const REPO = "webbertakken/railisations-com";

const SUGGEST_BODY = [
  "Thanks for sharing! Use these prompts if they help:",
  "",
  "**What's the lesson?**",
  "",
  "**Why does it matter?**",
  "",
  "**A short summary (2-3 sentences):**",
  "",
  "---",
  "*Suggested via railisations.com*",
].join("\n");

/**
 * Pre-filled "new discussion" URL: opens GitHub Discussions in the
 * `Ideas` category with the lesson-suggestion template ready to edit.
 */
export const SUGGEST_URL = `https://github.com/${REPO}/discussions/new?category=ideas&title=${encodeURIComponent(
  "Lesson idea: ",
)}&body=${encodeURIComponent(SUGGEST_BODY)}`;
