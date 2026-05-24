# Site launch plan - Copper Lessons timeline

Goal: ship a pixel-perfect, fully animated static implementation of the
"Victorian Timeline (Industrial Serif)" design from
`designs/timeline.zip` using Next.js 15 + React 19 + Tailwind 4 +
react-spring, with 100% unit-test coverage and Playwright E2E proof.
Do NOT deploy; verify locally only.

## Scope decisions

- Stack: Next.js 15 (App Router) static export + React 19 + Tailwind v4
  + @react-spring/web + Lucide-React (cog icon, replaces Material
  Symbols dependency for offline static builds).
- Fonts: Playfair Display (display + body serif) and Montserrat (UI
  labels), via `next/font/google` for self-hosting and zero CLS.
- Output: `next build` with `output: 'export'` produces `./out`.
  `wrangler.toml` flipped to point `[assets].directory = "./out"`.
- Worker `src/index.js` (host-canonicalisation redirect) is preserved.
- Testing: Vitest + @testing-library/react for unit (100% statements/
  branches/functions/lines via v8). Playwright for E2E (Chromium +
  Mobile Chrome) against the static `out/` served by `serve`.
- Observability: route handler-free, so log via `reportWebVitals` hook
  (next 15 `useReportWebVitals`) sending to `console.info` with
  structured JSON; expose a hook seam for future Sentry/PostHog.
- All animated leaf components are client components (`"use client"`)
  but the page tree itself is a server component for static export
  friendliness.

## Ambiguities resolved

- DESIGN.md mentions Newsreader/Inter; `code.html` ships Playfair
  Display + Montserrat. The user said pixel-perfect of the design,
  so the rendered `code.html` wins -> Playfair + Montserrat.
- "Same example text" -> keep the "Copper Lessons" brand and the 20
  lessons verbatim (Jan 2021 -> Aug 2025).
- Worker `src/index.js` currently redirects every non-canonical host
  to `www.railisations.com`. The brand on the page is "Copper Lessons"
  even though the worker domain is railisations.com - that is fine
  because the user asked for the same example text.

## Tasks

### 1. Bootstrap project skeleton - DONE
- [x] Init `package.json` with Next 16, React 19, Tailwind 4,
      @react-spring/web 10, lucide-react, eslint flat config, prettier,
      vitest 4, @testing-library/react, @vitest/coverage-v8, jsdom,
      playwright, serve, web-vitals, with `overrides.next.postcss` to
      eliminate the only known transitive CVE.
- [x] `tsconfig.json` strict + bundler resolution + path alias `@/*`.
- [x] `next.config.ts` with `output: 'export'`, `trailingSlash: true`,
      `images.unoptimized`.
- [x] `.gitignore` updated.
- [x] `eslint.config.mjs` + `.prettierrc.json` + `.prettierignore`.

### 2. Tailwind 4 + design tokens - DONE
- [x] `postcss.config.mjs` registers `@tailwindcss/postcss`.
- [x] `src/app/globals.css` declares the full Nocturnal Copper palette
      via `@theme`, plus typography scale and spacing tokens.
- [x] Ports `.copper-spine`, `.copper-connector`, `.rivet-node`,
      `.node-active`, `.vintage-card`, `.rivet*`, `.ambient-shadow`,
      `.card-hover` and a `prefers-reduced-motion` reset.

### 3. App shell - DONE
- [x] `src/app/layout.tsx`: Playfair + Montserrat via `next/font/google`,
      `<html className="dark">`, full metadata, viewport, `WebVitals`.
- [x] `src/app/page.tsx`: composes header + timeline + footer.
- [x] `src/app/icon.svg`: static SVG cog favicon (next/og requires
      runtime - incompatible with `output: 'export'`).
- [x] `site-header.tsx`: sticky, slide-in (mount-gated), active link.
- [x] `site-footer.tsx`: brand + legal nav + dated copyright.

### 4. Timeline - DONE
- [x] `lessons.ts`: frozen literal of 20 entries.
- [x] `timeline.tsx`: container with desktop + mobile copper spines,
      ordered list of rows, mount-gated `scaleY` spine reveal.
- [x] `timeline-row.tsx`: alternating desktop layout, connector spring,
      mobile rail; honours reduced motion + IntersectionObserver.
- [x] `timeline-node.tsx`: brass cog rivet, looping rotation that
      pauses on reduced motion, glow flag on active node.
- [x] `lesson-card.tsx`: vintage card with four rivets and the
      entrance fade/translate spring.

### 5. Animations + observability - DONE
- [x] `use-in-view.ts`: one-shot IntersectionObserver wrapper.
- [x] `use-reduced-motion.ts`: media-query hook with cleanup.
- [x] `use-mounted.ts`: `useSyncExternalStore`-based SSR gate (passes
      React 19's `react-hooks/set-state-in-effect` lint rule).
- [x] `web-vitals.tsx`: `useReportWebVitals` -> JSON to `console.info`.
- [x] Header slide, spine reveal, row connector, date fade, card
      entrance, node loop - all react-spring, all mount-gated.

### 6. Unit tests (100% coverage) - DONE (45 tests)
- [x] Vitest + jsdom + v8, thresholds enforced at 100/100/100/100.
- [x] `src/test/setup.ts` stubs `IntersectionObserver` + `matchMedia`.
- [x] Coverage map (excluded server-only `layout.tsx`, `page.tsx`,
      `icon.svg`): all components, all hooks, data, web-vitals.

### 7. End-to-end (Playwright) - DONE (12 specs)
- [x] `playwright.config.ts`: dark colour scheme, reduced-motion via
      `contextOptions`, Chromium + Mobile Chrome, `serve out` web
      server, 1280x800 default viewport.
- [x] `e2e/timeline.spec.ts` covers brand, active nav, all 20 lessons
      in order, sticky header, active node glow, scroll-triggered
      `data-in-view` flip.
- [x] `scripts/visual-snapshot.ts` produces desktop / mobile / hero
      PNGs against the live preview for design review.

### 8. Tooling glue - DONE
- [x] npm scripts include `verify` (lint -> typecheck -> coverage ->
      build -> e2e), `format`/`format:check`, `e2e:install`.
- [x] `.github/workflows/ci.yml`: install, lint, typecheck, coverage,
      build, playwright browser install, e2e, artefact upload on fail.
- [x] `wrangler.toml` flipped to `./out`; legacy `public/` removed;
      worker host-canonicalisation preserved; deploy deferred.
- [x] `README.md` rewritten with quick start, architecture map,
      design tokens, observability hook.

### 9. Local verification
- [x] `npm install`.
- [x] `npm run verify` -> all green.
- [x] Hand-eyeball Playwright report screenshots vs the design PNG.
- [x] Commit in logical TDD batches (`test:` then `feat:` etc.).
- [x] Stop here. Do not deploy.
