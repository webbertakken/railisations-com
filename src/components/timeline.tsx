"use client";

import { animated, useSpring } from "@react-spring/web";
import { lessons } from "@/data/lessons";
import { useMounted } from "@/hooks/use-mounted";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { lessonId } from "@/lib/ids";
import { SuggestionPrompt } from "./suggestion-prompt";
import { TimelineRow } from "./timeline-row";

// Skip placeholder entries that haven't been written yet so the page
// only ever renders populated lessons.
const visibleLessons = lessons.filter((lesson) => lesson.title.length > 0);

export function Timeline() {
  const reduced = useReducedMotion();
  const mounted = useMounted();
  const animate = mounted && !reduced;
  const spine = useSpring({
    transform: "scaleY(1)",
    opacity: 1,
    from: animate ? { transform: "scaleY(0)", opacity: 0 } : undefined,
    reset: animate,
    config: { tension: 80, friction: 22 },
    immediate: !animate,
  });

  return (
    <section
      aria-labelledby="lessons-heading"
      className="mx-auto flex w-full max-w-[1280px] flex-grow flex-col items-center px-margin-mobile md:px-margin-desktop py-12 md:py-20"
    >
      <h2 id="lessons-heading" className="sr-only">
        Lessons timeline
      </h2>
      <div className="relative flex w-full justify-center">
        {/* Desktop spine */}
        <animated.div
          style={{ ...spine, transformOrigin: "top center" }}
          aria-hidden
          className="copper-spine absolute top-0 bottom-0 left-1/2 z-0 hidden -translate-x-1/2 rounded-full md:block"
        />
        {/* Mobile spine */}
        <animated.div
          style={{ ...spine, transformOrigin: "top center" }}
          aria-hidden
          className="copper-spine absolute top-0 bottom-0 left-[8px] z-0 rounded-full md:hidden"
        />

        <ol className="relative z-10 flex w-full list-none flex-col gap-6 pt-8 pb-16 md:gap-12">
          {visibleLessons.map((lesson, index) => (
            <li key={lesson.date} id={lessonId(lesson.date)} className="scroll-mt-28">
              <TimelineRow lesson={lesson} index={index} />
            </li>
          ))}
        </ol>
      </div>
      <SuggestionPrompt />
    </section>
  );
}
