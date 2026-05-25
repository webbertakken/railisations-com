import { ArrowUpRight } from "lucide-react";
import { SUGGEST_URL } from "@/lib/links";

/**
 * Editorial-style call-to-action that closes the timeline. Sits below
 * the final lesson ("The Journey is the Destination") and invites
 * readers to keep the story going by suggesting their own lesson on
 * GitHub Discussions.
 *
 * Deliberately text-only (no card chrome) so it feels like an
 * epilogue rather than a 21st lesson cosplaying as a CTA.
 */
export function SuggestionPrompt() {
  return (
    <aside
      aria-labelledby="suggestion-heading"
      className="mt-16 md:mt-24 mx-auto flex max-w-[520px] flex-col items-center gap-4 px-margin-mobile md:px-margin-desktop text-center"
    >
      <p className="font-label-sm text-label-sm text-primary font-bold tracking-widest uppercase">
        The story continues
      </p>
      <h3
        id="suggestion-heading"
        className="font-headline-md text-headline-md text-on-surface"
      >
        Have a lesson worth adding?
      </h3>
      <p className="font-body-md text-body-md text-on-surface-variant">
        Share an idea on GitHub Discussions. The most resonant ones land as the
        next entry on this timeline.
      </p>
      <a
        href={SUGGEST_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="font-label-md text-label-md text-primary hover:text-primary-fixed-dim mt-2 inline-flex items-center gap-1.5 underline-offset-4 underline transition-colors"
      >
        Suggest a lesson
        <ArrowUpRight className="size-4" aria-hidden />
      </a>
    </aside>
  );
}
