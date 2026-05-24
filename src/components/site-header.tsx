"use client";

import { animated, useSpring } from "@react-spring/web";
import { Search } from "lucide-react";
import { useMounted } from "@/hooks/use-mounted";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

type NavItem = { label: string; href: string; active?: boolean };

const NAV: ReadonlyArray<NavItem> = [
  { label: "Lessons", href: "#", active: true },
  { label: "Archive", href: "#" },
  { label: "Resources", href: "#" },
  { label: "Contact", href: "#" },
];

export type SiteHeaderProps = {
  onSearch?: () => void;
  onSignIn?: () => void;
};

export function SiteHeader({ onSearch, onSignIn }: SiteHeaderProps) {
  const reduced = useReducedMotion();
  const mounted = useMounted();
  const animate = mounted && !reduced;
  const slide = useSpring({
    transform: animate ? "translateY(0%)" : "translateY(0%)",
    opacity: 1,
    from: animate ? { transform: "translateY(-100%)", opacity: 0 } : undefined,
    reset: animate,
    config: { tension: 200, friction: 22 },
    immediate: !animate,
  });

  return (
    <animated.header
      style={slide}
      className="bg-surface border-outline-variant sticky top-0 z-50 w-full border-b shadow-[0_4px_20px_rgba(0,0,0,0.4)]"
    >
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-margin-mobile md:px-margin-desktop py-4">
        <a
          href="#top"
          className="font-display-lg text-display-lg-mobile md:text-display-lg text-primary font-semibold tracking-tight"
        >
          Copper Lessons
        </a>
        <nav aria-label="Primary" className="hidden items-center gap-8 md:flex">
          {NAV.map((item) => (
            <a
              key={item.label}
              href={item.href}
              aria-current={item.active ? "page" : undefined}
              className={
                item.active
                  ? "font-body-md text-body-md text-primary border-primary border-b-2 pb-1 font-bold transition-colors duration-200"
                  : "font-body-md text-body-md text-on-surface-variant hover:text-primary font-medium transition-colors duration-200"
              }
            >
              {item.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-4">
          <button
            type="button"
            aria-label="Search"
            onClick={() => onSearch?.()}
            className="hover:bg-surface-variant text-primary hidden h-10 w-10 items-center justify-center rounded-full transition-colors md:flex"
          >
            <Search className="size-5" aria-hidden />
          </button>
          <button
            type="button"
            onClick={() => onSignIn?.()}
            className="bg-primary hover:bg-primary-container text-on-primary font-label-sm text-label-sm rounded-full px-6 py-2 font-medium transition-colors duration-200"
          >
            Sign In
          </button>
        </div>
      </div>
    </animated.header>
  );
}
