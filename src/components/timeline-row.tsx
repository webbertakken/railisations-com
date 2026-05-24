"use client";

import { animated, useSpring } from "@react-spring/web";
import type { Lesson } from "@/data/lessons";
import { useInView } from "@/hooks/use-in-view";
import { useMounted } from "@/hooks/use-mounted";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { LessonCard } from "./lesson-card";
import { TimelineNode } from "./timeline-node";

export type TimelineRowProps = {
  lesson: Lesson;
  index: number;
};

type Side = "left" | "right";

function DesktopDate({ date }: { date: string }) {
  return (
    <span className="font-label-md text-label-md text-primary font-bold tracking-[0.2em] uppercase">
      {date}
    </span>
  );
}

export function TimelineRow({ lesson, index }: TimelineRowProps) {
  const reduced = useReducedMotion();
  const mounted = useMounted();
  const animate = mounted && !reduced;
  const { ref, inView } = useInView<HTMLDivElement>();
  const isActive = index === 0;
  const cardSide: Side = index % 2 === 0 ? "left" : "right";

  const connector = useSpring({
    width: !animate || inView ? "64px" : "0px",
    config: { tension: 180, friction: 24 },
    delay: animate ? 120 : 0,
    immediate: !animate,
  });

  const dateSpring = useSpring({
    opacity: !animate || inView ? 1 : 0,
    transform: !animate || inView ? "translateY(0px)" : "translateY(16px)",
    config: { tension: 220, friction: 26 },
    delay: animate ? 80 : 0,
    immediate: !animate,
  });

  return (
    <div ref={ref} className="relative flex w-full items-start pl-12 md:justify-center md:pl-0">
      {/* Mobile node (always left rail) */}
      <span className="absolute top-6 left-[6px] z-20 -translate-x-1/2 md:hidden">
        <TimelineNode active={isActive} variant="mobile" label={lesson.title} />
      </span>

      {/* Mobile column */}
      <div className="flex w-full flex-col gap-2 md:hidden" data-testid="timeline-row-mobile">
        <span className="font-label-sm text-label-sm text-primary mb-1 font-bold tracking-widest uppercase">
          {lesson.date}
        </span>
        <LessonCard title={lesson.title} desc={lesson.desc} size="sm" inView={inView} />
      </div>

      {/* Desktop row */}
      <div
        className="relative hidden w-full items-center md:flex"
        data-testid="timeline-row-desktop"
        data-side={cardSide}
      >
        {/* Centred gear node */}
        <span className="absolute top-1/2 left-1/2 z-20 -translate-x-1/2 -translate-y-1/2">
          <TimelineNode active={isActive} variant="desktop" label={lesson.title} />
        </span>

        {/* Horizontal connector */}
        <animated.span
          style={connector}
          className={`copper-connector pointer-events-none absolute top-1/2 z-10 hidden -translate-y-1/2 md:block ${
            cardSide === "left" ? "right-1/2" : "left-1/2"
          }`}
          aria-hidden
        />

        {/* Left half */}
        <div className="flex w-1/2 items-center justify-end pr-16">
          {cardSide === "left" ? (
            <div className="z-20 w-full max-w-[480px]">
              <LessonCard title={lesson.title} desc={lesson.desc} size="md" inView={inView} />
            </div>
          ) : (
            <animated.div style={dateSpring} className="flex items-center">
              <DesktopDate date={lesson.date} />
            </animated.div>
          )}
        </div>

        {/* Right half */}
        <div className="flex w-1/2 items-center justify-start pl-16">
          {cardSide === "right" ? (
            <div className="z-20 w-full max-w-[480px]">
              <LessonCard title={lesson.title} desc={lesson.desc} size="md" inView={inView} />
            </div>
          ) : (
            <animated.div style={dateSpring} className="flex items-center">
              <DesktopDate date={lesson.date} />
            </animated.div>
          )}
        </div>
      </div>
    </div>
  );
}
