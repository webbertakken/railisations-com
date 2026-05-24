"use client";

import { animated, useSpring } from "@react-spring/web";
import { lessons } from "@/data/lessons";
import { useMounted } from "@/hooks/use-mounted";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { TimelineRow } from "./timeline-row";

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
      className="flex w-full flex-grow justify-center px-margin-mobile md:px-margin-desktop max-w-[1280px] mx-auto py-12 md:py-20"
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

        <ol className="relative z-10 flex w-full list-none flex-col gap-12 pt-8 pb-16 md:gap-24">
          {lessons.map((lesson, index) => (
            <li key={lesson.date}>
              <TimelineRow lesson={lesson} index={index} />
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
