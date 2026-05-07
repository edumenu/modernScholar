---
name: Scholarships All-Corpus Refactor Patterns
description: Key patterns and pitfalls from the seasonal-filter removal / full-catalog refactor (feature/scholarships-all-corpus, May 2026)
type: project
---

Dropped seasonal gate; full corpus shown year-round. Expired scholarships dim + sort to bottom.

**Architecture decisions locked by PRD:**
- `isExpired` / `getReopenLabel` / `getExpiredBadge` live in `lib/expired-status.ts` — single source of truth for all 4 card surfaces
- `filterAndSort` in `lib/scholarship-utils.ts` owns month filter and expired-tier partitioning
- Month filter is a hard filter (excluded entries disappear vs. education-level dim behavior)
- `SESSION_DATE` snapshot at module load (scholarship-grid.tsx) is intentional for v1
- `seasonalScholarships` prop name on filter components is a deferred rename (misleading but cosmetic)

**Known type duplication:**
- `Month` type is defined independently in both `lib/scholarship-utils.ts` (as a union literal) and `hooks/use-scholarship-filters.ts` (as `(typeof MONTHS)[number]`). They align at runtime but are structurally separate. `filterAndSort` imports from `lib/scholarship-utils` while hook imports from itself. Fix: export from one place.

**activeFilterStrip visibility condition:**
- `scholarship-grid.tsx` line 168–174 manually re-enumerates all filter conditions (including `month !== "all"`) instead of consuming `filters.hasActiveFilters`. This is correct but fragile — a new filter added to the hook won't auto-appear in the strip gate unless this block is also updated.

**`monthCounts` computed in two places:**
- `scholarship-filters.tsx` and `scholarship-filters-mobile.tsx` both contain identical `useMemo` that parses deadline strings to build `Record<Month, number>`. Could be extracted to a util function, but the duplication is contained.

**`hasActiveFilters` in mobile sheet is local:**
- `scholarship-filters-mobile.tsx` line 107–113 computes its own `hasActiveFilters` that excludes the `month` param (month is visible above the sheet, not inside it). This is intentional UX separation, not a bug.

**`filterBadgeCount` in mobile sheet also excludes month** (line 114–119) — same intentional separation.

**`isExpired` boundary behavior:**
- `isExpired` returns `deadline < today` (strict less-than). `isScholarshipActive` returns `deadline >= today` (today = not yet expired). These are strict inverses. Boundary case: deadline exactly equal to today → active in both, not expired. Confirmed consistent.

**Next.js 16 compliance (reviewed May 2026):**
- ScholarshipsPage (`app/scholarships/page.tsx`) has no dynamic params/searchParams — no async migration needed.
- ScholarshipHeroStats re-reads query state via `useQueryState` (nuqs) in a Client Component — this is correct, not a Next.js 16 async-params issue because it uses the nuqs hook, not the page `searchParams` prop.
- ScholarshipHero runs module-level computation (`activeScholarships`, `closingSoon`) at Server Component import time using `SESSION_DATE` — this is intentional and consistent. No `"use client"` directive so it is correctly a Server Component.

**Dead-reference check (May 2026):**
- `profile-setup.tsx` and `stores/profile.ts` are deleted. No remaining import of either was found across the reviewed files. Safe.

**ExpiredStamp "use client" boundary:**
- `expired-stamp.tsx` has `"use client"` but contains no hooks or browser APIs — it is a pure presentational component. The directive is unnecessary overhead. Can be safely made a Server Component.

**IIFE pattern in ExpandedScholarship:**
- `expanded-scholarship.tsx` uses an IIFE `(() => { ... })()` inside JSX to scope `overlayTint` / `expired` locals. This is a pattern to watch — it obscures control flow and makes the component harder to read. Should be extracted to a sub-component or computed before the return.

**Comparison button accessibility gap:**
- In `scholarship-card.tsx` and `scholarship-list-card.tsx`, the `TooltipTrigger` uses a `render` prop with a bare `<button>` that renders its content *outside* the trigger element (the Icon is a sibling of the trigger wrapper). The actual button element rendered by the trigger is empty — the Icon is placed outside. This creates a button with no visible label text and potentially no accessible name at the icon's DOM position.

**Why:** PRD locked these decisions after verification. Flag only bugs, not design choices.
**How to apply:** In future reviews touching the scholarship page, verify these invariants are maintained without re-litigating the PRD.
