# PRD — Coming Soon Scholarships

> Repurpose the home-page Featured Scholarships section into a Coming Soon Carousel that surfaces scholarships closing in the current calendar month, with rollover to next month when empty.

## Problem Statement

- The current Featured Scholarships section shows the first 10 scholarships in source order — no signal of urgency, no reason for a returning visitor to look again.
- Users miss applicable scholarships because nothing on the home page highlights what is about to close.
- Featuring deadline-driven scholarships gives the section a refresh cadence aligned with the calendar.

## Location

`Brain/PRDs/05_23_2026/coming-soon-scholarships/coming-soon-scholarships.md`

No companion decisions file — all rationale fits inline.

## Solution

- Filter `allScholarships` to deadlines in the current calendar month, parsed via the existing `new Date(\`${deadline}, ${deadlineYear}\`)` idiom, anchored against `SESSION_DATE`.
- Sort ascending by parsed deadline timestamp; cap at 10.
- Zero matches in current month → roll forward and filter for next month; heading swaps to `Coming in {NextMonth}`.
- Keep the existing `ParallaxLayer` + `AnimatedSection` + `CoverflowCarousel` shell unchanged. UI structure, animation, and CTA preserved.
- Glossary updated with `Coming Soon Carousel` term in `.context/glossary.md`.

## User Stories

1. As a visitor on the home page, I want to see scholarships closing this month, so that I can apply before deadlines pass.
2. As a returning visitor, I want the section's content to refresh as the calendar advances, so that I have a reason to check the home page again.
3. As a visitor at month-end, I want the section to roll forward to next month's deadlines, so that the home page never goes empty.

## Implementation Decisions

**Modules**

- `ComingSoonScholarships` (new, `src/components/home/coming-soon-scholarships.tsx`) — Replaces `FeaturedScholarships`. Computes the filtered, sorted, capped list inline in the component body using `SESSION_DATE`. Renders the existing parallax/animated/coverflow shell with dynamic heading.
- `src/app/(home)/page.tsx` (existing) — Update import + JSX usage to the new symbol.
- `src/components/ui/error-boundary/error-boundary.tsx` (existing) — Cosmetic doc-comment update; example referenced `FeaturedScholarships`.

**Key decisions**

- Filter helper inlined in the component, not lifted to `src/lib/` — single use site, ~20 lines, matches the codebase's "no abstractions for single-use code" rule.
- Reuses `SESSION_DATE` from `@/lib/session-date` — keeps the section consistent with other date-aware surfaces (cards, filters, hero).
- Calendar-month semantics, not rolling 30 days — matches the "Coming in {Month}" framing and the user's "current month" phrasing.
- Sort ascending by deadline — first card is the soonest-closing, supporting the urgency promise.
- Cap at 10 — preserves the existing coverflow stage's visual tuning.
- Rollover swaps `{Month}` only; the rest of the copy (eyebrow, subtitle, CTA) stays static.
- Eyebrow `Curated for you` retained; subtitle updates to `These scholarships close soon — apply before the month ends.`; CTA `View All Scholarships → /scholarships` unchanged.
- Component, file, and test file renamed from `FeaturedScholarships` → `ComingSoonScholarships`. Name-vs-behavior alignment outweighs the rename diff cost.
- No ADR — change is easily reversible, no architectural trade-off.

## Testing Decisions

- **Test**: `ComingSoonScholarships` — Update `getActiveCarouselNames()` helper to apply the new month-bound filter + ascending sort. Keep `FROZEN_NOW = 2026-05-07T12:00:00Z` (May has ≥10 in-month deadlines so the 10-slide assertion holds).
- **Test**: Add one new assertion for the rollover path — set frozen time to a date where the current month has zero remaining deadlines, assert heading reads `Coming in {NextMonth}` and the carousel renders next-month items.
- **Skip**: No new unit test for the inline filter helper — covered transitively by the component-level assertions.
- **Prior art**: `src/components/home/__tests__/featured-scholarships.component.test.tsx` is the file to mirror and rename.

## Out of Scope

- No changes to `CoverflowCarousel` internals — its existing `isScholarshipActive` filter remains as a safety net.
- No backend, data-pipeline, or `MasterScholarshipList.csv` changes — derivation is render-time only.
- No new utility module in `src/lib/`.
- No ADR or rule-file updates — change does not introduce a new repo-wide pattern.
- No Storybook story — none existed for the section before.
