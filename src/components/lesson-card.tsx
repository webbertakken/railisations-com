"use client";

import { animated, useSpring } from "@react-spring/web";
import { useMounted } from "@/hooks/use-mounted";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

export type LessonCardSize = "sm" | "md";

export type LessonCardProps = {
  title: string;
  desc: string;
  /** `sm` = mobile headline-sm, `md` = desktop headline-md. */
  size: LessonCardSize;
  /** Drives the entrance spring; cards stay at translateY(24px), opacity 0 until in view. */
  inView: boolean;
};

const RIVETS = ["rivet-tl", "rivet-tr", "rivet-bl", "rivet-br"] as const;

export function LessonCard({ title, desc, size, inView }: LessonCardProps) {
  const reduced = useReducedMotion();
  const mounted = useMounted();
  const animate = mounted && !reduced;
  // SSR + reduced-motion path keeps the card in its final state.
  // Pure opacity fade - no translateY slide.
  const spring = useSpring({
    opacity: !animate || inView ? 1 : 0,
    config: { tension: 320, friction: 26, clamp: false },
    immediate: !animate,
  });

  const headingClass =
    size === "sm"
      ? "font-headline-sm text-headline-sm text-on-surface"
      : "font-headline-md text-headline-md text-on-surface";

  return (
    <animated.article
      style={spring}
      data-in-view={inView ? "true" : "false"}
      className="vintage-card card-hover ambient-shadow bg-surface-container relative flex w-full flex-col gap-3 overflow-hidden rounded-xl p-6 transition-all duration-300"
    >
      {RIVETS.map((cls) => (
        <span key={cls} className={`rivet ${cls}`} aria-hidden />
      ))}
      <h3 className={headingClass}>{title}</h3>
      <p className="font-body-md text-body-md text-on-surface-variant">{desc}</p>
    </animated.article>
  );
}
