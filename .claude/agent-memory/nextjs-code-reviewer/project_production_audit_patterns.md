---
name: Production Audit Findings (April 2026)
description: Key structural gaps found during production readiness audit — missing route files, metadata gaps, exposed key, FAQ a11y
type: project
---

Critical gaps confirmed during full production readiness audit (2026-04-22), updated 2026-05-08:

1. **`global-error.tsx` still missing** — `src/app/error.tsx` exists now but `global-error.tsx` does not. Layout-level crashes (providers, Header, Footer) have no fallback.
2. **robots.ts and sitemap.ts now exist** — both correct, but privacy/terms/cookies pages are absent from sitemap.
3. **No opengraph-image** file (static or generated) anywhere.
4. **Exposed API key** — `.env` contains a Firecrawl API key. `.env` (without `.local`) is gitignored via `.env*` glob, but this needs verification.
5. **Home page (`src/app/page.tsx`) has no metadata export** — falls back only to the root layout's generic title/description. Still missing as of 2026-05-08.
6. **Blog/contact/privacy/terms/cookies metadata uses a plain object** (`export const metadata = {...}`) instead of typed `Metadata` from next. Still untyped as of 2026-05-08.
7. **FAQ accordion is missing `aria-controls`/`id` pairing** — `aria-expanded` is present but the controlled region has no `id` for association.
8. **`BlogGrid` uses `useState` for category/search** instead of `useQueryState` — filters are not URL-persisted, unlike the scholarship grid.
9. **`blog/page.tsx`** — no segment-level `loading.tsx` or `error.tsx`. Async `getAllPosts()` call has no loading skeleton at the blog segment level.
10. **`contact/page.tsx`** — no segment-level `loading.tsx`.
11. **Legal pages (`/privacy`, `/terms`, `/cookies`)** now exist in src/app but are placeholder stubs; absent from sitemap.ts.
12. **`featured-scholarships.tsx` defines a local `Scholarship` interface** that duplicates the canonical type in `src/data/scholarships.ts`.

**Why:** Full production readiness audit requested to find issues before launch.
**How to apply:** Prioritize loading/error/not-found files, metadata typing, and the FAQ aria fix as immediate blocking issues. The API key and missing legal pages are also high priority.
