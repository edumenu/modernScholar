---
name: Eligibility / Award Filter Feature Review
description: Patterns, bugs, and decisions found in the eligibility-tag + award-range filter feature (FilterSheet, Slider, Checkbox, scholarship-utils)
type: project
---

Key findings from the eligibility/award filter feature review (2026-04-29):

**Architecture decisions confirmed:**
- OR-within-category, AND-across-categories/flat-tags filter logic in `matchesEligibilityTags()` — intentional and correct
- "Varies" awards (parseAwardAmount returns 0) excluded when range is narrowed — intentional design choice, documented inline
- `awardRange` and `eligibilityTags` are local React state (not URL-persisted) — eligible for URL persistence improvement
- `SESSION_DATE` module-level date snapshot prevents mid-session season crossing — intentional, documented

**Bugs found:**
- `Slider` component has a double-sync anti-pattern: it owns internal state AND syncs from props via useEffect, causing a two-render flicker on every parent state update. The internal state is unnecessary — Radix Slider renders thumbs from `value` prop directly.
- `ActiveFilterStrip` is wrapped in `<AnimatePresence>` in scholarship-grid.tsx but the strip itself returns `null` when inactive — the exit animation never fires because `AnimatePresence` can't see a keyed child exiting. Needs a keyed wrapper child inside the `AnimatePresence`.
- `Checkbox` `onCheckedChange` signature accepts `boolean` but Base UI may pass `boolean | 'indeterminate'` — type narrowing needed.
- The accordion expand button in FilterSheet/FiltersMobile has no `aria-expanded` or `aria-controls` attribute.

**Code quality:**
- `toggleTag` logic is duplicated verbatim in FilterSheet and ScholarshipFiltersMobile — should be extracted to a shared hook or utility.
- `clearAll` / `clearFilters` logic is also duplicated across FilterSheet, ActiveFilterStrip, and ScholarshipGrid.
- `formatAwardChip` in ActiveFilterStrip is an inline function that regenerates on every render — harmless but could be memoized.
- Left-over commented-out code in scholarship-filters.tsx (Sort dropdown trigger children).
- ScholarshipGridSkeleton renders both BentoGridSkeleton (lg:flex) and MobileGridSkeleton (lg:hidden) but ScholarshipGrid only renders a single uniform grid — skeleton is mismatched with actual layout.

**Why:** These patterns indicate the feature was built quickly across multiple files. The Slider bug and AnimatePresence wrapping issue are the most impactful.
**How to apply:** Flag Slider internal state and AnimatePresence keying immediately in future reviews of this area. Watch for toggleTag/clearAll duplication if new filter types are added.
