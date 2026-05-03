---
name: Scholarships page architecture
description: URL state shape, filter semantics, and dimmed-card behavior for the /scholarships page
type: project
---

The /scholarships page filters/sorts via `useScholarshipFilters` (src/hooks/use-scholarship-filters.ts) using Nuqs URL params:

- `q` (string) — search across name + eligibility + description + provider
- `level` (string) — one of EDUCATION_LEVELS or absent for "All"
- `sort` (string) — "deadline" (default, omitted from URL) or "amount"
- `tags` (comma-separated array) — eligibility tags from src/lib/eligibility.ts
- `min`, `max` (integers) — award amount bounds (defaults 0, 100_000)
- `page` (integer, default 1)

**Filter semantics (in `src/lib/scholarship-utils.ts` `filterAndSort`):**
- Search, eligibility tags, and award range are HARD filters — non-matching items are excluded entirely.
- Education level is a SOFT filter — non-matching items are kept but marked `matches: false` and rendered DIMMED (opacity 0.4) AFTER all matching items. This preserves pagination counts but means a user who paginates past the matches sees only dimmed cards with no contextual messaging (M-3 in the 2026-05-03 report).
- Within-category eligibility tags use OR semantics, across-category uses AND.
- Award range excludes "Varies" entries (those with no parsed dollar amount) when the range is narrowed from defaults.

**Layout state is `useState`-only** (not URL-persisted), so refresh resets to grid.

**Hero stats** (totalScholarships, deadlinesThisMonth, etc.) are computed at MODULE LOAD as JS constants in `scholarship-hero.tsx` — they don't react to filters and never re-render based on the active query.

**Pagination**: `getPageNumbers()` always shows first + last + current±1 with ellipses. Out-of-range pages are normalized to `safePage` via a useEffect that calls `setPage(safePage)`. Negative/non-numeric pages decode to 1 and the URL param is stripped.

**Mobile breakpoint**: `useMediaQuery("(max-width: 1023px)")` — at 1023px and below, the mobile filter sheet (bottom-anchored) is used; at 1024+, the inline desktop filter row appears. iPad portrait (768) is mobile by this rule.
