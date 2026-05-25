"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { Search } from "lucide-react";
import type { Lesson } from "@/data/lessons";
import { lessons as DEFAULT_LESSONS } from "@/data/lessons";
import { searchLessons } from "@/lib/search";

export type SearchOverlayProps = {
  open: boolean;
  onClose: () => void;
  onSelect: (lesson: Lesson) => void;
  /** Defaults to the full lesson set; injectable for tests / future filtering. */
  source?: ReadonlyArray<Lesson>;
};

export function SearchOverlay({
  open,
  onClose,
  onSelect,
  source = DEFAULT_LESSONS,
}: SearchOverlayProps) {
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [query, setQuery] = useState("");
  const [activeIndexState, setActiveIndex] = useState(0);
  const [prevOpen, setPrevOpen] = useState(open);
  const listboxId = useId();

  // Reset query + activeIndex on every open->true transition. The
  // "setState during render" pattern keeps React 19's no-setState-in-
  // effect lint rule happy without needing a ref dance.
  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) {
      setQuery("");
      setActiveIndex(0);
    }
  }

  const results = useMemo(() => searchLessons(query, source), [query, source]);

  // Clamp activeIndex at render time so it can never address past the
  // end of the result list - no setState in an effect required.
  const activeIndex =
    results.length === 0 ? 0 : Math.min(activeIndexState, results.length - 1);

  // Show / hide the native <dialog>. The effect only runs on `open`
  // transitions, so showModal()/close() are never called twice.
  useEffect(() => {
    const node = dialogRef.current!;
    if (open) {
      node.showModal();
      inputRef.current?.focus();
    } else {
      node.close();
    }
  }, [open]);

  // Document-level ESC listener: the native <dialog> already cancels on
  // ESC in real browsers, but we keep an explicit handler so tests +
  // edge cases (focus on backdrop, JSDOM, etc.) close reliably too.
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const commit = useCallback(
    (lesson: Lesson) => {
      onSelect(lesson);
      onClose();
    },
    [onSelect, onClose],
  );

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (results.length === 0) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((i) => (i + 1) % results.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((i) => (i - 1 + results.length) % results.length);
    } else if (event.key === "Enter") {
      event.preventDefault();
      // `results.length > 0` guard above guarantees a non-undefined entry.
      commit(results[activeIndex]!);
    }
  };

  return (
    <dialog
      ref={dialogRef}
      aria-label="Search lessons"
      onClose={onClose}
      // Click on the dialog element fires only when the backdrop is
      // hit; the inner panel below stops propagation.
      onClick={onClose}
      className="bg-surface-container-low text-on-surface ambient-shadow vintage-card max-w-[min(640px,calc(100vw-2rem))] w-full rounded-xl p-0 backdrop:bg-black/70 backdrop:backdrop-blur-sm"
    >
      <div
        role="presentation"
        onKeyDown={handleKeyDown}
        className="flex max-h-[min(70vh,640px)] w-full flex-col overflow-hidden rounded-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <label className="border-outline-variant flex items-center gap-3 border-b px-4 py-3">
          <Search className="text-primary size-5" aria-hidden />
          <input
            ref={inputRef}
            type="search"
            role="searchbox"
            aria-label="Search lessons"
            aria-controls={listboxId}
            aria-activedescendant={
              results.length > 0 ? `${listboxId}-opt-${activeIndex}` : undefined
            }
            placeholder="Search lessons by title, date, or theme..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActiveIndex(0);
            }}
            className="font-body-md text-body-md placeholder:text-on-surface-variant/60 text-on-surface flex-1 bg-transparent outline-none"
          />
          <kbd className="font-label-sm text-label-sm text-on-surface-variant/70 border-outline-variant rounded border px-1.5 py-0.5">
            ESC
          </kbd>
        </label>

        {results.length === 0 ? (
          <p className="font-body-md text-body-md text-on-surface-variant px-4 py-8 text-center">
            No lessons match &ldquo;{query}&rdquo;.
          </p>
        ) : (
          <ul
            id={listboxId}
            role="listbox"
            aria-label="Search results"
            className="flex-1 overflow-y-auto py-2"
          >
            {results.map((lesson, idx) => {
              const isActive = idx === activeIndex;
              return (
                <li
                  key={lesson.date}
                  id={`${listboxId}-opt-${idx}`}
                  role="option"
                  aria-selected={isActive}
                  onMouseEnter={() => setActiveIndex(idx)}
                  onClick={() => commit(lesson)}
                  className={`flex cursor-pointer items-baseline justify-between gap-4 px-4 py-2 transition-colors ${
                    isActive ? "bg-surface-container-high" : "hover:bg-surface-container"
                  }`}
                >
                  <span className="font-headline-sm text-body-lg text-on-surface flex-1 truncate">
                    {lesson.title}
                  </span>
                  <span className="font-label-sm text-label-sm text-primary tracking-widest uppercase">
                    {lesson.date}
                  </span>
                </li>
              );
            })}
          </ul>
        )}

        <p className="border-outline-variant text-on-surface-variant/70 font-label-sm text-label-sm flex items-center justify-between border-t px-4 py-2">
          <span>
            <kbd className="border-outline-variant rounded border px-1.5 py-0.5">↑</kbd>{" "}
            <kbd className="border-outline-variant rounded border px-1.5 py-0.5">↓</kbd> navigate
          </span>
          <span>
            <kbd className="border-outline-variant rounded border px-1.5 py-0.5">Enter</kbd> jump
          </span>
        </p>
      </div>
    </dialog>
  );
}
