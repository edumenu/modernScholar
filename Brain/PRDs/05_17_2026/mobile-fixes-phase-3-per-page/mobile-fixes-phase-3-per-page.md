# PRD — Mobile Fixes Phase 3: Per-Page (P1)

> Remaining route-specific P1 findings from `Brain/audits/mobile-audit-2026-05-17.md` after cross-cutting fixes land. 21 items spanning hierarchy, semantics, nested interactives, and route-local touch targets.

## Problem Statement

- Heading hierarchy is broken on multiple routes: `/` has no `<h1>`, `/blog/[slug]` skips H1→H3, `/not-found` H1 is undersized.
- Several cards nest interactive elements (`<button>` inside `<a>`, `<article role="button">` with child `<button>`s) — invalid HTML and assistive-tech ambiguity.
- `/scholarships` pagination shows stale page count when a filter is active (UI says 38 pages, filtered set has 22).
- `/privacy` and `/terms` each render a redundant "Last updated" section; legal-page H3s lack IDs.
- Route-local touch-target overrides remain after the Phase 2 Button/Sheet pass: per-card icons, accordions, search pills, carousel arrows.
- Mobile menu doesn't close on Escape (likely Lenis or focus-trap interception).

## Location

`Brain/PRDs/05_17_2026/mobile-fixes-phase-3-per-page/mobile-fixes-phase-3-per-page.md`

## Solution

- Correct heading semantics page-by-page; document the MDX H2/H3 convention so future blog posts follow.
- Replace nested interactives with parent-only activation + overlay button pattern.
- Compute `totalPages` from filtered match count, not the full sorted corpus.
- Strip duplicate "Last updated" sections and add IDs to GDPR/CCPA H3s.
- Apply remaining sub-44 touch fixes at per-callsite level after Phase 2.
- Add Escape handler to mobile menu and verify Lenis KeyboardPlugin does not swallow.

## User Stories

1. As a screen-reader user, I want every page to start with one `<h1>` and never skip a heading level so I can build a correct document outline.
2. As a keyboard user, I want assistive tech to expose card actions unambiguously (one role per element).
3. As a `/scholarships` user with a filter applied, I want pagination to reflect the filtered result count so I don't tap into empty pages.
4. As a mobile user, I want the menu to close when I press Escape, the same as every other modal.
5. As a `/privacy` or `/terms` reader, I want the "Last updated" date in exactly one place so I'm not confused by conflicting dates.
6. As a touch user on cards and carousels, I want every action ≥ 44px so I don't mis-tap.

## Implementation Decisions

**Modules**
- `HeroSection` (`src/components/home/hero-section.tsx:109`): `<h2 id="hero-heading">` → `<h1>`; keep `aria-labelledby` reference.
- `ScholarshipGrid` (`src/components/scholarships/scholarship-grid.tsx:87`): `totalPages` from `sortedItems.filter(i => i.matches).length`. Grid still renders dimmed non-matches inside the active page slice.
- `ScholarshipCard` (`src/components/scholarships/scholarship-card.tsx:139, 252-263`): remove `role="button"` from `<motion.article>`; add hidden `absolute inset-0 opacity-0` activation button; icon-buttons stay at higher z-index; bump compare button `size-8` → `size-11`.
- `BlogCard` (`src/components/blog/blog-card.tsx:137-175`): replace inner `<Button>Read Blog</Button>` with styled `<span>`; parent `<Link>` activates the card. Removes `stopPropagation` hack.
- `BlogDetail` (`src/components/blog/blog-detail.tsx:51`): swap `<Link><Button size="sm">` for `<ButtonLink href="/blog" variant="ghost" size="default">`.
- `RelatedPosts` (`src/components/blog/related-posts.tsx:87-95`): Prev/Next `size="icon-sm"` → `size="icon"` (or `size-11` override).
- `FilterSheet` (`src/components/scholarships/filter-sheet.tsx:163-181, 222, 255-279`): checkbox row `py-1.5` → `py-3`, accordion `py-2` → `py-2.5`.
- `BlogFilters` (`src/components/blog/blog-filters.tsx:69, 147-163`): search pill `py-2` → `py-2.5`; chips `min-h-11`.
- `MobileMenu` (`src/components/ui/header/mobile-menu.tsx`): add `onKeyDown` Escape handler that calls `setIsOpen(false)` and restores focus to trigger; verify Lenis `KeyboardPlugin` not intercepting. Social anchors gain `flex size-11 items-center justify-center rounded-full` icon-button shape with `<span className="sr-only">`.
- `NotFoundClient` (`src/components/ui/four-oh-four/not-found-client.tsx:49, 219`): bump H1 `text-2xl md:text-3xl` → `text-3xl md:text-4xl`; add `aria-hidden="true"` directly to each Iconify `<Icon>`.
- Privacy page (`src/app/privacy/page.tsx`): remove final `<LegalSection id="last-updated">` block; add IDs to GDPR/CCPA H3s (or fix `LegalSubsection` auto-derivation).
- Terms page (`src/app/terms/page.tsx`): remove final `<LegalSection id="last-updated" title="17. Last updated">`.
- Cookies page (`src/app/cookies/page.tsx`): wrap table in `<div role="region" aria-label="…" className="relative overflow-x-auto">` with right-edge gradient `after:` pseudo.
- MDX blog convention: `### ` → `## ` in `ScholarshipBlogs.md` source; convert existing files in `content/blog/`; document in `CLAUDE.md`. Defensive check in BlogDetail: if first body `<p>` equals `frontmatter.description`, skip rendering.

**Key decisions**
- ScholarshipCard uses a hidden full-overlay activation button rather than dropping the role — preserves keyboard activation on the whole card without nesting buttons inside an `<article role="button">`.
- BlogCard's "Read Blog" affordance is purely visual; converting to `<span>` removes invalid nested-interactive HTML and the `stopPropagation` patch in one move.
- MDX hierarchy fix is content-side (source convention) plus a layout-side defensive skip — cheaper than rewriting `mdx-components.tsx` mapping.
- Pagination logic stays inside `ScholarshipGrid`; no shared store change required.

**Dependencies**: none new.

## Testing Decisions

- **Test**: Playwright @ 375 — assert exactly one `<h1>` on `/`, `/blog/[slug]`, `/not-found`, and that heading levels never skip.
- **Test**: `/scholarships?level=K-12` — assert `totalPages` matches the filtered count.
- **Test**: Mobile menu — open via hamburger, press Escape, assert closed and focus restored to trigger.
- **Test**: Snapshot blog post body — assert excerpt is not repeated as first paragraph.
- **Test**: ScholarshipCard — keyboard activation triggers expand exactly once; icon buttons fire independently.
- **Skip**: Per-callsite touch-target probes already covered by the Phase 2 sweep; only assert the deltas changed here.
- **Prior art**: existing `/scholarships` filter tests under `tests/` (extend the same harness).

## Out of Scope

- `/terms` CSS-counter heading numbers (deferred to Phase 4 v2).
- Cookie table card-layout redesign (Phase 4 hides Category column instead).
- Off-canvas carousel `inert` (Phase 4).
- Animations or visual redesign beyond the className/markup deltas listed.

## Open Questions

- None — every item has a confirmed file:line and class delta.
