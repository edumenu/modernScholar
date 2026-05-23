# Verification Report: Expires Soon Scholarships

**PRD:** [coming-soon-scholarships.md](./coming-soon-scholarships.md)
**Date:** 2026-05-23
**Status:** Complete
**Branch:** worktree-expires-soon-scholarships (uncommitted)

> Post-PRD copy change: section renamed `Coming Soon` → `Expires Soon` for active-voice deadline framing. Symbol, file, label, glossary, and heading all renamed; PRD doc kept as-authored history.

## What Shipped

- [x] Home section filters scholarships to deadlines in the current calendar month, anchored against `SESSION_DATE`.
- [x] Ascending sort by parsed deadline, cap 10.
- [x] Rollover to next month when current month yields zero remaining; heading swaps to `Expires in {NextMonth}`.
- [x] ParallaxLayer + AnimatedSection + CoverflowCarousel shell preserved unchanged.
- [x] Eyebrow `Curated for you` retained; subtitle unchanged; CTA unchanged.
- [x] Component / file / test renamed `Featured → ExpiresSoon`. Old files deleted.
- [x] `(home)/page.tsx` import / JSX / ErrorBoundary label `Expires Soon`.
- [x] `error-boundary.tsx` JSDoc example updated.
- [x] Glossary entry: `Expires Soon Carousel`.

## Files Touched

| File | Change |
| ---- | ------ |
| `src/components/home/expires-soon-scholarships.tsx` | New component; inline month-filter helper + rollover branch. |
| `src/components/home/__tests__/expires-soon-scholarships.component.test.tsx` | New test; `getActiveCarouselNames` mirrors filter; rollover `describe` block (`2026-11-30T12:00:00Z` → December). |
| `src/components/home/featured-scholarships.tsx` | Deleted. |
| `src/components/home/__tests__/featured-scholarships.component.test.tsx` | Deleted. |
| `src/app/(home)/page.tsx` | Symbol swap + ErrorBoundary label `Expires Soon`. |
| `src/components/ui/error-boundary/error-boundary.tsx` | JSDoc usage example only. |
| `.context/glossary.md` | `Expires Soon Carousel` entry. |

## Issues

- None.

## Next

User reviews diff in worktree, then commit/merge.
