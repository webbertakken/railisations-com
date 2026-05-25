# railisations.com — Railisations

Static, fully animated **Railisations** site built on the **Victorian Timeline
(Industrial Serif)** layout from the **Nocturnal Copper** design system, rendered
with Next.js 16 + React 19 + Tailwind v4 + `@react-spring/web` 10, hosted on
Cloudflare Workers static assets.

Branding: the wordmark **Railisations** highlights the inner `AI` in the
lighter copper (`--color-primary-fixed` / `#ffdcc2`); the rest sits on the
luminous copper (`--color-primary` / `#ffb77a`). The brass cog favicon is
used inline as the header logo (see `src/components/brand-mark.tsx`).

## Quick start

```bash
npm install
npm run dev               # Next.js dev server at http://localhost:3000
```

## Build + verify (everything is broken until proven otherwise)

```bash
npm run verify            # lint + typecheck + unit (100% coverage) + build + e2e
```

Individual steps:

- `npm run lint` — ESLint flat config (`next/core-web-vitals`, `next/typescript`)
- `npm run typecheck` — `tsc --noEmit` in strict mode
- `npm run test:coverage` — Vitest + jsdom, hard 100% statements/branches/functions/lines
- `npm run build` — `next build` (Turbopack) → `./out` static export
- `npm run e2e` — Playwright (Chromium + Mobile Chrome) against `./out`

Useful one-off:

```bash
npx tsx scripts/visual-snapshot.ts   # writes desktop/mobile/hero PNGs to designs/snapshots/
```

## Deployment

Static export lives in `./out` and is served by `wrangler` via the `[assets]` binding in
`wrangler.toml`. The `src/index.js` worker performs host canonicalisation
(`www.railisations.com`) before delegating to `env.ASSETS.fetch`.

```bash
# Deferred. Do not run until the new design is signed off.
# npx wrangler deploy
```

## Architecture cheatsheet

```
src/
├── app/                  # Next 16 App Router
│   ├── layout.tsx        # fonts + viewport + WebVitals
│   ├── page.tsx          # composes header + timeline + footer
│   ├── icon.svg          # brass gear favicon
│   └── globals.css       # Tailwind v4 @theme + bespoke copper utilities
├── components/           # Client components, all "use client"
│   ├── brand-mark.tsx    # <BrandLogo /> + <BrandMark /> ("Railisations")
│   ├── site-header.tsx
│   ├── site-footer.tsx
│   ├── timeline.tsx
│   ├── timeline-row.tsx
│   ├── timeline-node.tsx
│   ├── lesson-card.tsx
│   └── web-vitals.tsx    # useReportWebVitals -> console.info JSON
├── data/lessons.ts       # frozen 20-entry lesson set (verbatim from design)
├── hooks/
│   ├── use-in-view.ts    # IntersectionObserver wrapper
│   ├── use-mounted.ts    # SSR-safe animation gating
│   └── use-reduced-motion.ts
└── test/setup.ts         # jsdom IntersectionObserver + matchMedia stubs
```

## Design tokens

Pulled from `designs/timeline.zip` (`nocturnal_copper/DESIGN.md`):

- Surfaces `#131313` → `#393939`, outlined with `outline-variant #534438`.
- Primary copper `#ffb77a` (luminous), container copper `#d98c45`.
- Typography: **Playfair Display** (display + body), **Montserrat** (labels/UI).
- 8-px spatial rhythm, 64-px desktop / 20-px mobile margins, 1280-px container cap.
- Bespoke utilities `.copper-spine`, `.copper-connector`, `.rivet-node`,
  `.node-active`, `.vintage-card`, `.rivet`, `.ambient-shadow`, `.card-hover`.

## Observability

`useReportWebVitals` in `src/components/web-vitals.tsx` emits structured JSON to
`console.info('[web-vital]', …)` for every CLS/LCP/INP/FCP/TTFB sample. Swap the
sink for Sentry/PostHog by editing that single file.
