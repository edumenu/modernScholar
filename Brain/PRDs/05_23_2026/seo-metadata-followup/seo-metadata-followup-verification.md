# Verification Report: SEO & Metadata Follow-up

**PRD:** `Brain/PRDs/05_23_2026/seo-metadata-followup/seo-metadata-followup.md`
**Date:** 2026-05-23
**Status:** Partial — Module 2 blocked on user-supplied asset
**Branch:** main (uncommitted)

## What Shipped

- [x] Module 1 — Root `metadataBase`, `title.template`, OG + Twitter defaults
- [x] Module 3 — All 7 pages: suffix dropped, `openGraph` added; `alternates.canonical` on `/scholarships` + 3 legal pages
- [ ] Module 2 — Static 1200x630 PNG at `src/app/opengraph-image.png` — cannot author binary; metadata already references the path so asset wires up on drop
- [x] Module 4 — Blog detail `generateMetadata`: `type: "article"`, `publishedTime`, `modifiedTime`, `authors`, image w/h/alt, `twitter`, canonical
- [x] Module 5 — `siteJsonLd()` mounted on home, `blogPostJsonLd()` mounted on blog detail; `<JsonLd>` server component; `toAbsoluteUrl` lifted to `src/lib/url.ts`
- [x] Tests — unit (`structured-data`, 13 cases) + component (`blog-detail-metadata`, 7 cases) + e2e spec (3 scenarios, well-formed, not executed)
- [x] `npm run lint` — 0 errors. `npm run test:unit` + `test:component` — new tests 20/20 pass; pre-existing failures unrelated (Feburary typo in CSV, scholarship-card test)

## Files Touched

| File | Change |
| --- | --- |
| `src/app/layout.tsx` | Added metadataBase, title.template, root OG/Twitter defaults |
| `src/app/(home)/page.tsx` | title.absolute, OG url+images, mounted JsonLd |
| `src/app/scholarships/page.tsx` | Dropped suffix, added OG, canonical |
| `src/app/{blog,contact}/page.tsx` | Dropped suffix, added OG |
| `src/app/{privacy,terms,cookies}/page.tsx` | Dropped suffix, added OG, canonical |
| `src/app/blog/[slug]/page.tsx` | Full article OG + Twitter, canonical, JsonLd mount, toAbsoluteUrl import lifted |
| `src/lib/url.ts` (new) | Lifted `toAbsoluteUrl` shared by blog detail + structured-data |
| `src/lib/structured-data.ts` (new) | Typed builders: `siteJsonLd`, `blogPostJsonLd` |
| `src/components/ui/json-ld.tsx` (new) | Server component emitting `<script type=application/ld+json>` |
| `src/lib/__tests__/structured-data.test.ts` (new) | 13 unit assertions |
| `src/app/__tests__/blog-detail-metadata.test.ts` (new) | 7 generateMetadata assertions (uses vi.mock to stub client imports) |
| `e2e/seo-metadata.spec.ts` (new) | Playwright `<head>` + JSON-LD assertions for `/`, `/blog`, `/blog/<slug>` |

## Issues

- Home page title doesn't end in `| Modern Scholar` so suffix-drop reading of PRD M3 would have produced a double-stamp; used `title.absolute` (also for blog "Post Not Found" fallback) — fixed.
- `JsonLdGraph` widened from `Record<string,unknown>` to `object` so narrow node types pass without index-signature widening — fixed.
- Module 2 PNG must come from user — blocked.

## Next

User supplies `src/app/opengraph-image.png` (1200x630). Review diff. After merge, validate with Facebook Sharing Debugger + Google Rich Results Test on `/blog/<slug>`. Nothing committed yet.
