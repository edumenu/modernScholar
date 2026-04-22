---
name: Production Audit Findings (April 2026)
description: Key structural gaps found during production readiness audit — missing route files, metadata gaps, exposed key, FAQ a11y
type: project
---

Critical gaps confirmed during full production readiness audit (2026-04-22):

1. **No loading.tsx, error.tsx, or not-found.tsx** exist anywhere in src/app. All route segments are completely unprotected for loading and error states.
2. **No robots.ts or sitemap.ts** — zero SEO crawl infrastructure.
3. **No opengraph-image** file (static or generated) anywhere.
4. **Exposed API key** — `.env` contains a Firecrawl API key. `.env` (without `.local`) is gitignored via `.env*` glob, but this needs verification.
5. **Home page (`src/app/page.tsx`) has no metadata export** — falls back only to the root layout's generic title/description.
6. **Blog page metadata uses a plain object** (`export const metadata = {...}`) instead of typed `Metadata` from next — same for scholarships and contact pages.
7. **FAQ accordion is missing `aria-controls`/`id` pairing** — `aria-expanded` is present but the controlled region has no `id` for association.
8. **`BlogGrid` uses `useState` for category/search** instead of `useQueryState` — filters are not URL-persisted, unlike the scholarship grid.
9. **`blog/page.tsx` has a `<Suspense>` with no fallback prop** — renders nothing during loading.
10. **`ScholarshipHero` runs module-level `getDeadlinesThisMonth()`** at import time — executes on every server render, not cached.
11. **Footer links to `/privacy`, `/terms`, `/cookies`** — these pages do not exist in src/app.
12. **`featured-scholarships.tsx` defines a local `Scholarship` interface** that duplicates the canonical type in `src/data/scholarships.ts`.

**Why:** Full production readiness audit requested to find issues before launch.
**How to apply:** Prioritize loading/error/not-found files, metadata typing, and the FAQ aria fix as immediate blocking issues. The API key and missing legal pages are also high priority.
