"use client";

import { Search } from "lucide-react";
import Link from "next/link";
import { BrandLogo, BrandMark } from "./brand-mark";

export type SiteHeaderProps = {
  onSearch?: () => void;
};

export function SiteHeader({ onSearch }: SiteHeaderProps) {
  return (
    <header className="bg-surface border-outline-variant sticky top-0 z-50 w-full border-b shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-margin-mobile md:px-margin-desktop py-4">
        <Link
          href="/"
          aria-label="Railisations home"
          className="group flex items-center gap-3 md:gap-4 transition-opacity hover:opacity-90"
        >
          <BrandLogo className="size-8 md:size-10 drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)] transition-transform group-hover:rotate-12" />
          <BrandMark />
        </Link>
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Search lessons"
            onClick={() => onSearch?.()}
            className="hover:bg-surface-variant text-primary flex h-10 w-10 items-center justify-center rounded-full transition-colors"
          >
            <Search className="size-5" aria-hidden />
          </button>
        </div>
      </div>
    </header>
  );
}
