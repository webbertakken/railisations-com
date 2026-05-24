"use client";

import { animated, useSpring } from "@react-spring/web";
import { Cog } from "lucide-react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

export type TimelineNodeVariant = "mobile" | "desktop";

export type TimelineNodeProps = {
  active: boolean;
  variant: TimelineNodeVariant;
  /** Accessible label, e.g. the lesson title. */
  label: string;
};

export function TimelineNode({ active, variant, label }: TimelineNodeProps) {
  const reduced = useReducedMotion();

  // Endless gentle rotation on the active node; subtle pulse on inactive ones.
  const spring = useSpring({
    from: { transform: "rotate(0deg)" },
    to: { transform: "rotate(360deg)" },
    loop: true,
    config: { duration: active ? 12000 : 28000 },
    pause: reduced,
  });

  const sizeCls = variant === "mobile" ? "w-5 h-5" : "w-6 h-6";
  const iconCls = variant === "mobile" ? "size-3" : "size-3.5";
  const activeCls = active ? "node-active" : "";

  return (
    <span
      aria-label={`${label} milestone`}
      className={`rivet-node ${sizeCls} ${activeCls} rounded-full`.trim()}
    >
      <animated.span style={spring} className="flex items-center justify-center">
        <Cog className={`${iconCls} text-[#2e1500]`} strokeWidth={2.5} aria-hidden />
      </animated.span>
    </span>
  );
}
