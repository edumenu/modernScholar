---
name: Scholarships page architecture
description: URL state shape, filter semantics, and dimmed-card behavior for the /scholarships page
type: project
---

The /scholarships page filters/sorts via `useScholarshipFilters` (src/hooks/use-scholarship-filters.ts) using Nuqs URL params:

- `q` (string) — search across `name + eligibility + description + provider`
- `level` (string) — one of EDUCATION_LEVELS or absent for "All"
- `sort` (string) — "deadline" (default, omitted from URL) or "amount"
- `tags` (comma-separated array) — eligibility tags from src/lib/eligibility.ts
- `min`, `max` (integers) — award amount bounds (defaults 0, 100_000)
- `month` (lowercase month name) — hard filter on deadline month, or absent for "all"
- `layout` (string) — "grid" (default, omitted) or "list" (URL-persisted as of 2026-05-07)
- `page` (integer, default 1)

**Filter semantics (in `src/lib/scholarship-utils.ts` `filterAndSort`):**
- Search, eligibility tags, award range, and `month` are HARD filters — non-matching items are excluded entirely.
- Education level is a SOFT filter — non-matching items are kept but marked `matches: false` and rendered DIMMED (opacity 0.4) AFTER all matching items. Pagination counts both tiers.
- Within-category eligibility tags use OR semantics, across-category uses AND.
- Award range excludes "Varies" entries (parseAwardAmount returns 0) when narrowed from defaults — `expired Varies` rows also disappear when range is narrowed.
- After level partitioning, an extra partition runs to push **expired entries to the bottom regardless of sort mode**. Two dim signals can compose at the card layer (filter-mismatch + expired).

**Layout state IS now URL-persisted** via `?layout=list` (changed from earlier — was `useState`-only previously). Refresh preserves layout choice.

**Hero stats** (`scholarship-hero.tsx:11-39`) compute `totalScholarships`, `educationLevelsCount`, `maxAmount`, `closingSoon` at MODULE LOAD as JS constants from `activeScholarships` (deadline ≥ SESSION_DATE). They never re-render based on the active query. As of 2026-05-07: 181 active out of 211 corpus.

**All-dimmed-page banner** (`scholarship-grid.tsx:136-147`): if every visible card on the page is `!matches` AND matches exist elsewhere, a "Jump to page N" CTA appears.

**Pagination**: `getPageNumbers()` always shows first + last + current±1 with ellipses. Out-of-range pages are normalized to `safePage` via a useEffect that calls `setPage(safePage)`. Negative/non-numeric pages decode to 1 and the URL param is stripped.

**Mobile breakpoint**: `useMediaQuery("(max-width: 1023px)")` — at 1023px and below, the mobile filter sheet (bottom-anchored) is used; at 1024+, the inline desktop filter row appears. iPad portrait (768) is mobile by this rule.

**Comparison store** (`src/stores/comparison.ts`) is plain Zustand — NOT persisted. Refresh / full-nav clears the selection set. SPA navigation preserves it.
