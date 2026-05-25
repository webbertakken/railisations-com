import type { ReactNode } from "react";
import { SiteFooter } from "./site-footer";
import { SiteShell } from "./site-shell";

export type LegalLayoutProps = {
  title: string;
  lastUpdated?: string;
  children: ReactNode;
};

export function LegalLayout({ title, lastUpdated, children }: LegalLayoutProps) {
  return (
    <SiteShell>
      <main className="flex w-full flex-grow flex-col">
        <article className="prose-legal mx-auto w-full max-w-[680px] px-margin-mobile md:px-margin-desktop py-12 md:py-20">
          <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg text-primary mb-2 font-semibold tracking-tight">
            {title}
          </h1>
          {lastUpdated && (
            <p className="font-label-sm text-label-sm text-on-surface-variant/70 mb-8 tracking-widest uppercase">
              Last updated: {lastUpdated}
            </p>
          )}
          <div className="font-body-lg text-body-lg text-on-surface space-y-6 [&_h2]:font-headline-sm [&_h2]:text-headline-sm [&_h2]:text-primary-fixed [&_h2]:mt-10 [&_h2]:mb-3 [&_p]:text-on-surface-variant [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-4 [&_a:hover]:text-primary-fixed-dim [&_ul]:list-disc [&_ul]:pl-6 [&_li]:text-on-surface-variant [&_li]:my-1 [&_strong]:text-on-surface">
            {children}
          </div>
        </article>
      </main>
      <SiteFooter />
    </SiteShell>
  );
}
