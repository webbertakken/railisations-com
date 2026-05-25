import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { SUGGEST_URL } from "@/lib/links";

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-surface-container-low border-outline-variant mt-auto w-full border-t">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center gap-4 px-margin-mobile md:px-margin-desktop py-8 md:py-10">
        <nav aria-label="Legal" className="flex flex-wrap justify-center gap-6">
          <a
            href={SUGGEST_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="font-label-sm text-label-sm text-primary hover:text-primary-fixed-dim inline-flex items-center gap-1 transition-colors"
          >
            Suggest a lesson
            <ArrowUpRight className="size-3.5" aria-hidden />
          </a>
          <Link
            href="/privacy/"
            className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary-fixed-dim transition-colors"
          >
            Privacy Policy
          </Link>
          <Link
            href="/terms/"
            className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary-fixed-dim transition-colors"
          >
            Terms of Service
          </Link>
          <Link
            href="/accessibility/"
            className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary-fixed-dim transition-colors"
          >
            Accessibility
          </Link>
        </nav>
        <p className="font-label-sm text-label-sm text-on-surface-variant/70 text-center">
          © {year} Railisations. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
