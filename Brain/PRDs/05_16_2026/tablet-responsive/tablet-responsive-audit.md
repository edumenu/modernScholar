# PRD — Tablet Responsive Audit Remediation

> Fix the issues surfaced by the 2026-05-16 tablet-viewport audit. Full findings, fix recipes, and verification plan live in `tablet-responsive-audit-decisions.md`. Source screenshots in `screenshots/`. QA findings in `findings/`.

## Problem Statement
- 40-capture audit (10 routes × 2 viewports × 2 themes) surfaced **1 P0, 10 P1, 12 P2, 7 P3** issues.
- Home page crashes to the global error boundary at 1024×768 dark; every legal page renders the wrong "Last updated" date for users west of UTC; blog bad-slug throws a Next.js dev 500 (production correctly serves the static `404.html` — dev nuisance only, P3).
- Legal pages just landed on `feature/legal-pages` — the TZ bug ships to production with the branch unless fixed first.

## Location
`Brain/PRDs/05_16_2026/tablet-responsive-audit.md`
Companion: `Brain/PRDs/05_16_2026/tablet-responsive-audit-decisions.md`

## Solution
- Three sprints: ship-blockers (P0 + critical P1), per-route P1, then P2 polish. P3 to backlog.
- Six cross-cutting fixes applied once each — focus ring, prose measure, touch targets, AnimatedLines heading semantics, Spline Suspense fallbacks, font preload trimming.
- Per-route P1/P2 fixes for `/`, `/scholarships`, `/contact`, `/blog`, `/blog/[slug]`, `/cookies`, `/privacy`, `/terms`, `/not-found`, `/blog/[slug]/not-found`.
- No new design tokens or component primitives. One optional addition: `<ErrorBoundary>` wrapper around home sections.

## User Stories
1. As a tablet user, I want every page to render without crashing across viewport × theme combinations.
2. As a keyboard user, I want a visible focus ring on every interactive element (WCAG 2.4.7).
3. As a screen reader user, I want one H1 per page and no duplicated heading text.
4. As a reader, I want long-form prose at ≤75 ch line length on tablet landscape.
5. As a touch user, I want tap targets ≥44×44 px (WCAG 2.5.5).
6. As a visitor, I want the legal "Last updated" date correct in my timezone.

## Implementation Decisions

**Modules to touch** — one bullet per file:
- `src/app/(home)/page.tsx` + `src/components/home/hero-section.tsx` — section-level `ErrorBoundary`, instrument dark-landscape Spline URL race.
- `src/components/legal/legal-layout.tsx` — `Intl.DateTimeFormat` `timeZone: "UTC"` + `max-w-2xl` prose width.
- `src/app/globals.css` — global `:focus-visible` rule using `var(--secondary)`.
- `src/components/blog/reading-progress.tsx`, `blog-card.tsx`, `blog-card-featured.tsx`, `blog-filters.tsx`, `blog-detail-content.tsx`, `blog-detail.tsx` — touch targets, `max-w-[65ch]` prose, cover image cap, "Back to Blog" hit area.
- `src/components/ui/animatedLines/animated-lines.tsx` — `aria-hidden` + `sr-only` pattern centralized for all hero headings.
- `src/components/ui/four-oh-four/not-found-client.tsx` — static `ZeroRing` fallback, theme-fade Spline container, footer-aware height.
- `src/components/contact/contact-form-section.tsx` + `contact-hero.tsx` — theme-aware `MobileContactImage`, `font-bold` hero, surface tokens replacing hand-coded hex.
- `src/components/scholarships/scholarship-grid.tsx` + `scholarship-card.tsx` — `md:grid-cols-3 lg:grid-cols-4`, compare-chip containment.
- `src/app/privacy/page.tsx` + `src/app/terms/page.tsx` — remove duplicate trailing "Last updated" sections.
- `src/components/ui/footer/footer.tsx` + `src/components/ui/header/*` — `min-h-[44px]` on nav links.

**Key decisions** — one line each:
- Cross-cutting fixes first — focus ring, prose, touch targets, AnimatedLines each hit 4–10 routes; fix once.
- Sprint split, not single PR — keeps Sprint 1 (ship-blockers) reviewable and fast.
- Blog bad-slug behavior is correct in production (static `404.html` serves the global not-found UI) — dev-only 500 is a P3 DX nuisance, not a Sprint 1 item.
- Defer P3 nits to backlog — pagination touch targets, font preload trim, Spline pre-mount aesthetic, /terms numbering decision, blog dev-500 polish.
- All fixes use existing OKLCH surface tokens and Tailwind v4 utilities — no new tokens.
- Glassmorphism rules from `CLAUDE.md` followed — every card/form fix uses tonal surface tiers, never glass.

**No schema, API, or dependency changes.**

## Testing Decisions
- **Test**: Vitest unit test on `formatLastUpdated("2026-05-14")` — asserts "May 14, 2026" in a `TZ=America/New_York` run.
- **Test**: Playwright re-run of the 40-capture matrix after Sprint 1 — compare against the baseline in `screenshots/`.
- **Test**: axe accessibility audit on `/`, `/blog`, `/blog/<slug>` after Sprint 2 — one H1, focus ring present, no duplicated heading text.
- **Skip**: visual regression tests for Sprint 3 P2 polish — manual spot-check is sufficient given the small surface.
- **Prior art**: existing Vitest setup (`package.json` `test` script) + the Playwright MCP harness used in this audit.

## Out of Scope
- Mobile viewports (<768 px) and desktop viewports (≥1280 px) — separate audits.
- Performance and network audits.
- Storybook component audit.
- New design tokens, component primitives, or library upgrades.
- `LogoLoader` restart-tolerance work that gates re-enabling `reactStrictMode: true` (see Q4).

## Open Questions
1. **Q1** — Suppress global `<Footer>` on `/not-found` and `/error`?
ans: Suppress on `/not-found`
2. **Q2** — Legal section numbering: harmonize across all three, strip from `/terms`, or document terms-only numbering as intentional?
ans: harmonize across all three, strip from `/terms`
3. **Q3** — When to fix `LogoLoader` so `reactStrictMode: true` can be re-enabled?
ans: before Sprint 1 starts
4. **Q4** — MDX in-post headings: change `###` to `##` at source (Option A) or remap `h3 → h2` in `mdx-components.tsx` (Option B)?
ans: Option A
