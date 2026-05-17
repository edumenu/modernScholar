# Verification Report: Mobile Fixes Phase 3 — Per-Page

**PRD:** [mobile-fixes-phase-3-per-page.md](./mobile-fixes-phase-3-per-page.md)
**Date:** 2026-05-17
**Status:** Complete
**Branch:** fix/mobile-320px-overflow (uncommitted; Phase 2 also pending on same branch)

## What Shipped

- [x] Home hero `<h2>` → `<h1>` (id preserved).
- [x] `ScholarshipGrid` totalPages now derives from `sortedItems.filter(matches).length / PAGE_SIZE`.
- [x] `ScholarshipCard`: `role="button"` removed; hidden overlay activation button added (z-0); article retains `onClick` for direct clicks; compare button bumped to `size-11`; arrow Button `aria-hidden` + `tabIndex={-1}` to eliminate duplicate AT label.
- [x] `BlogCard`: inner `<Button>Read Blog</Button>` replaced with non-interactive `<span>`; stopPropagation hack removed.
- [x] `BlogDetail`: back link is `<ButtonLink variant="ghost" size="default">`; defensive `useEffect` removes any body `<p>` duplicating the excerpt.
- [x] `RelatedPosts`: prev/next `icon-sm` → `icon`.
- [x] `FilterSheet`: checkbox `pointer-coarse:py-3`; accordion `pointer-coarse:py-2.5`.
- [x] `BlogFilters`: search pill `py-2.5`; chips `min-h-11`.
- [x] `MobileMenu`: Escape closes menu + restores focus to trigger; social anchors `flex size-11 rounded-full` with sr-only labels. Lenis not at fault.
- [x] `NotFoundClient`: H1 bumped to `text-3xl md:text-4xl`; `aria-hidden` on Iconify icons.
- [x] `/privacy`: last-updated `LegalSection` + SECTIONS entry dropped; explicit `id="gdpr-rights"` / `id="ccpa-rights"` on `LegalSubsection`s.
- [x] `/terms`: last-updated `LegalSection` + SECTIONS entry dropped.
- [x] `/cookies`: storage table wrapped in `role="region"` with right-edge gradient hint.
- [x] MDX heading hierarchy: 12 `### ` → `## ` substitutions across `ScholarshipBlogs.md` + 4 generated `content/blog/*.mdx`; `CLAUDE.md` authoring doc updated; downstream `extractHeadings()` regex in `src/lib/blog.ts` updated to match `## `.

## Files Touched

| File | Change |
| --- | --- |
| src/components/home/hero-section.tsx | h2 → h1 |
| src/components/scholarships/scholarship-grid.tsx | totalPages from filtered matches |
| src/components/scholarships/scholarship-card.tsx | overlay button + article onClick + arrow aria-hidden + compare size-11 |
| src/components/scholarships/filter-sheet.tsx | checkbox/accordion `pointer-coarse:` padding |
| src/components/blog/blog-card.tsx | inner Button → span; drop stopPropagation |
| src/components/blog/blog-detail.tsx | ButtonLink back-link + defensive p trim |
| src/components/blog/related-posts.tsx | prev/next size icon |
| src/components/blog/blog-filters.tsx | search pill py-2.5; chips min-h-11 |
| src/components/ui/header/mobile-menu.tsx | Escape handler + restore focus + social anchor sizing |
| src/components/ui/four-oh-four/not-found-client.tsx | H1 sizing + aria-hidden icons |
| src/app/privacy/page.tsx | drop last-updated; explicit subsection IDs |
| src/app/terms/page.tsx | drop last-updated |
| src/app/cookies/page.tsx | table region + gradient hint |
| src/lib/blog.ts | `extractHeadings` regex `^###` → `^##` (+ doc comments) |
| src/lib/__tests__/blog.test.ts | h3 → h2 fixtures + name |
| ScholarshipBlogs.md, content/blog/*.mdx (×4) | 12 in-post `###` → `##` |
| CLAUDE.md | authoring convention now h2 |

## Issues

- Agent A flagged PRD line ref `not-found-client.tsx:49` was off (actual H1 at line 219, icons at 74/267). Applied at correct lines.
- Agent B flagged downstream `src/lib/blog.ts:extractHeadings` regex coupled to `### `; fixed in main thread (would have broken ReadingProgress TOC).
- ScholarshipCard tests broke after overlay-button refactor (duplicate aria-label, click-card test no longer fired). Fixed: dropped arrow Button's aria-label + restored article `onClick`. Now all 14 specs pass.
- Pre-existing test failures (unchanged by this PRD): `scholarships.test.ts` × 2 (corpus has dup IDs + "Feburary" typos); `not-found.component.test.tsx` × 1 (test expects "Error 404" text that isn't in the component on `main`).

## Next

`npm run build` clean. 380 / 383 specs pass (3 pre-existing fails confirmed via stash). Awaiting Playwright + manual mobile QA sweep per PRD Testing Decisions; commit pending Phase 2 + 3 bundle.
