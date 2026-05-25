"use client";

import { useCallback, useEffect, useState } from "react";
import type { Lesson } from "@/data/lessons";
import { lessonId } from "@/lib/ids";
import { SearchOverlay } from "./search-overlay";
import { SiteHeader } from "./site-header";

const DEFAULT_HIGHLIGHT_MS = 1600;

function highlight(target: HTMLElement, durationMs: number) {
  target.setAttribute("data-highlight", "true");
  window.setTimeout(() => target.removeAttribute("data-highlight"), durationMs);
}

export type SiteShellProps = {
  children: React.ReactNode;
  /** Optional override for the post-jump highlight pulse (ms). */
  highlightMs?: number;
};

/**
 * Client wrapper that owns the search overlay state and wires it up
 * to the static page tree. Stays slim so the page itself remains a
 * server component compatible with `output: 'export'`.
 */
export function SiteShell({ children, highlightMs = DEFAULT_HIGHLIGHT_MS }: SiteShellProps) {
  const [open, setOpen] = useState(false);

  const close = useCallback(() => setOpen(false), []);

  // Cmd/Ctrl + K opens the overlay (common pattern).
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const onSelect = useCallback(
    (lesson: Lesson) => {
      const id = lessonId(lesson.date);
      const target = document.getElementById(id);
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "center" });
        highlight(target, highlightMs);
      } else {
        // The lesson isn't on the current page (we're on a legal page).
        // Send the user home with a hash so the home page scrolls to it.
        window.location.assign(`/#${id}`);
      }
    },
    [highlightMs],
  );

  // When the page loads with a /#lesson-... hash (e.g. via search from a
  // legal page), apply the copper highlight pulse on top of the browser's
  // native anchor scroll.
  useEffect(() => {
    if (!window.location.hash) return;
    const id = window.location.hash.slice(1);
    const target = document.getElementById(id);
    if (!target) return;
    const raf = requestAnimationFrame(() => highlight(target, highlightMs));
    return () => cancelAnimationFrame(raf);
  }, [highlightMs]);

  return (
    <>
      <SiteHeader onSearch={() => setOpen(true)} />
      {children}
      <SearchOverlay open={open} onClose={close} onSelect={onSelect} />
    </>
  );
}
