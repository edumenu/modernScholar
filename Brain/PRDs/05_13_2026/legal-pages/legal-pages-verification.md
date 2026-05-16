# Verification Report: Legal Pages (Privacy, Terms, Cookies)

**PRD:** [legal-pages.md](legal-pages.md)
**Decisions doc:** [legal-pages-decisions.md](legal-pages-decisions.md)
**Tasks file:** [legal-pages-tasks.json](legal-pages-tasks.json)
**Progress log:** [legal-pages-progress.txt](legal-pages-progress.txt)
**Date:** 2026-05-14
**Branch:** `feature/legal-pages`
**Status:** Complete

## Changes Made

| File                                                                | Change Summary                                                                                                                                  |
| ------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/lib/legal-constants.ts`                                        | NEW — centralizes CONTACT_EMAIL, CONTROLLERS, GOVERNING_LAW, DISPUTE_VENUE, RESPONSE_WINDOW_DAYS, BREACH_WINDOW_HOURS, LAST_UPDATED per policy. |
| `src/components/legal/legal-layout.tsx`                             | NEW — server component owning PageTransition + page-padding-y + max-w-3xl + last-updated label + H1 + optional TL;DR card + contact footer.    |
| `src/components/legal/legal-section.tsx`                            | NEW — H2 wrapper with id + scroll-mt-24 for future anchor targeting.                                                                            |
| `src/components/legal/legal-subsection.tsx`                         | NEW — H3 wrapper used for GDPR/CCPA nesting in the rights section.                                                                              |
| `src/app/privacy/page.tsx`                                          | REWRITE — 12-section Privacy Policy: TL;DR, who we are, what we collect, why, where data goes, retention, GDPR + CCPA rights, COPPA, transfers, changes, contact, last updated. Stripe/Vercel voice. Callout(type=tip) for parental line. |
| `src/app/terms/page.tsx`                                            | REWRITE — 17-section Terms of Service: acceptance, about, eligibility, scholarship-data (Callout warning), editorial, acceptable use, IP, third-party links, AS-IS, limitation, indemnity, termination, NC governing law, disputes, changes, contact, last updated. |
| `src/app/cookies/page.tsx`                                          | REWRITE — 7-section Cookie Policy: TL;DR, real `<table>` of localStorage keys (theme / ms-comparison / ms-settings), what we don't use list (GA, Meta Pixel, ads), Spline + Iconify CDN note, browser-level clear instructions, changes, contact. |
| `src/components/legal/__tests__/legal-layout.component.test.tsx`    | NEW — vitest jsdom render test asserting H1, last-updated `<time>`, TL;DR content, child H2.                                                    |
| `src/app/{privacy,terms,cookies}/__tests__/*.component.test.tsx`    | NEW — per-route render tests: single H1, contact email, "Last updated" string, heading-hierarchy walk (no skipped levels).                      |
| `Brain/future/Todos.md`                                             | APPEND — PO Box reminder once LLC formed; manual 30-day deletion-request runbook.                                                               |
| `Brain/future/breach-runbook.md`                                    | NEW — internal-only 72-hour incident plan (Detect / Contain / Assess / Notify / Post-mortem).                                                   |

## Verification Checklist

### T01 — Legal infrastructure
- [x] LegalLayout owns chrome: last-updated label, H1, optional TL;DR, contact footer
- [x] Single edit to legal-constants.ts updates date across all three policies
- [x] No glassmorphism — Z-1 surfaces only; tokens are surface-container / on-surface

### T02 — Privacy Policy
- [x] Plain-language summary of what we do with user data (GDPR + CCPA covered)
- [x] Cites exact data inventory: theme, ms-comparison, ms-settings, Spline, Iconify
- [x] Under-13 disclaimer + parental contact line present (Callout type=tip)

### T03 — Terms of Service
- [x] Medium-strength scholarship disclaimer: AS-IS, user must verify, no liability for missed deadlines (Callout type=warning)
- [x] Light anti-scraping clause prohibits systematic extraction without permission
- [x] Governing law = North Carolina; no arbitration clause; editorial content owned by Modern Scholar

### T04 — Cookie Policy
- [x] Table of localStorage keys with names, purposes, lifetimes (theme, ms-comparison, ms-settings)
- [x] Explicit "what we don't use" list: GA, Meta Pixel, advertising cookies
- [x] Third-party CDN note: Spline + Iconify see IP but set no first-party cookies

### T05 — Tests
- [x] LegalLayout test asserts H1, last-updated label, TL;DR content, and child section H2 render
- [x] Per-route tests assert single H1, contact email, "Last updated" string
- [x] Heading hierarchy assertion: no skipped levels (H1→H2→optional H3) per route

### T06 — Brain side-artifacts
- [x] Todos.md captures PO Box deferred until LLC formation + deletion-request runbook
- [x] breach-runbook.md exists with 72-hour notification plan and internal-only scope

## End-of-loop gates

| Gate                    | Result                                                                                          |
| ----------------------- | ----------------------------------------------------------------------------------------------- |
| `npm run build`         | ✓ Pass — all 16 routes built, including `/privacy`, `/terms`, `/cookies` as static.             |
| `npm run lint`          | ✓ Pass — 0 errors. 9 warnings, all pre-existing in unrelated test files (Motion mock unused vars). |
| `npx vitest run --project=component` | ✓ 88/89 pass — the 1 failure is `not-found.component.test.tsx` (pre-existing; last touched commit c4793b3 — out of scope). 4 new legal tests + 12 prior legal-related assertions all green. |
| Browser smoke `/privacy`, `/terms`, `/cookies` | ✓ Pass — all three pages render full content, TL;DR + sections + tables + callouts visible, 0 console errors per route. |

## Issues Found

- **`src/app/__tests__/not-found.component.test.tsx` failing on `main`-baseline content.** The test asserts `getByRole("heading", { name: /turned the page/i })` but the current `src/app/not-found.tsx` does not render that string. Last touched in commit `c4793b3` ("Huge refactor of every single page with best practices"), which pre-dates this branch. Recommend a separate fix-up PR.
- **9 pre-existing ESLint warnings** in `src/components/home/__tests__/featured-scholarships.component.test.tsx` and `src/components/scholarships/__tests__/scholarship-card.component.test.tsx` (unused Motion mock destructured props prefixed with `_`). Not regressions; left as-is.

## Notes

- **Iteration count:** 4 iterations (parallel fan-out used in iter 1 [T01+T06] and iter 2 [T02+T03+T04]; T04 retried solo in iter 3; T05 cascade-closer in iter 4). 6 tasks in 4 iters under the MAX_ITER=12 budget.
- **Lint gotcha surfaced in T03/T04:** `react/no-unescaped-entities` is strict on bare apostrophes/double-quotes inside JSX text. T04 attempt 1 failed lint with 13 errors; attempt 2 fixed them with `&apos;` / `&quot;`. Captured in T03/T04 `notes` for future authors.
- **Date-format TZ caveat:** `Intl.DateTimeFormat("en-US", ...)` in `LegalLayout` is timezone-sensitive — tests assert on the `<time>` `dateTime` ISO attribute + a month/year regex rather than an exact day.
- **PRD vs harness reality:** PRD §Testing Decisions called for Playwright via `@vitest/browser-playwright`, but that provider is wired only for the Storybook project in `vitest.config.ts`. Tests were implemented in the existing `*.component.test.tsx` jsdom pattern (mirrors `src/app/__tests__/not-found.component.test.tsx`). Same intent, available harness.
- **Mid-flight smoke (Step 4.5) deliberately skipped:** PRD adds no URL query params, no nuqs state mirrors, no interactive components — only static prose. End-of-loop browser smoke covered the visual-rendering risk.
- **Sitemap untouched:** `lastModified` is git-derived; editing the page files naturally bumps it. Hand-maintained `LAST_UPDATED.{policy}` in `legal-constants.ts` is for user-facing display only — separation intentional per PRD §Sitemap & robots.
- **No commits made.** Branch `feature/legal-pages` is staged-locally only; awaiting user review of the full diff before any commit.
