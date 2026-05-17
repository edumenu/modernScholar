# PRD — Mobile Fixes Phase 1: Critical (P0)

> Eliminate the two horizontal-scroll breakages flagged in `Brain/audits/mobile-audit-2026-05-17.md` at 320px width.

## Problem Statement

- `/privacy` overflows the viewport horizontally at 320px (`docScrollWidth 346` vs `vw 320`) because the Callout's `flex-1` child lacks `min-w-0` and contains an unbreakable email string.
- `/contact` overflows similarly at 320px because the email row's flex parent lacks `min-w-0`, letting the 239px email span + 34×34 copy button push past the viewport.
- Horizontal scroll on a content page is a P0 layout failure — it indicates a broken page on the smallest supported viewport.

## Location

`Brain/PRDs/05_17_2026/mobile-fixes-phase-1-critical/mobile-fixes-phase-1-critical.md`

## Solution

- Callout content slot: gain `min-w-0 [overflow-wrap:anywhere]` so long unbreakable strings wrap instead of forcing parent width.
- Contact email row: outer flex container gains `min-w-0`; email span gains `min-w-0 truncate`; convert plain `<span>` to `<a href="mailto:…">` while at it.
- Both fixes are mechanical, single-line className additions. No layout redesign.

## User Stories

1. As a mobile visitor on a 320px device, I want `/privacy` to fit my screen so I can read the policy without dragging sideways.
2. As a mobile visitor on a 320px device, I want `/contact` to fit my screen so I can tap the email address without panning the document.
3. As a screen-reader user, I want the contact email rendered as a real `<a href="mailto:">` so I can activate the standard "open in mail app" action.

## Implementation Decisions

**Modules**
- `Callout` (existing, `src/components/blog/callout.tsx:72`): add `min-w-0 [overflow-wrap:anywhere]` to the `data-slot="callout-content"` div. Fix benefits every callout site-wide.
- `ContactFormSection` (existing, `src/components/contact/contact-form-section.tsx:345-350`): add `min-w-0` to the outer flex; swap `<span>{CONTACT_EMAIL}</span>` for `<a href={\`mailto:${CONTACT_EMAIL}\`} className="min-w-0 truncate …">`.

**Key decisions**
- Fix at the component level, not the page — Callout is reused; site-wide guarantee beats local patch.
- Use `[overflow-wrap:anywhere]` not `break-all` — only breaks unbreakable runs; normal copy wraps on word boundaries.
- Email becomes a real `<a>` now, not later — costs one line and unblocks long-press copy + mailto activation simultaneously.

**Dependencies**: none new.

## Testing Decisions

- **Test**: Playwright @ 320×720 visiting `/privacy` and `/contact`, asserting `document.documentElement.scrollWidth <= window.innerWidth`.
- **Test**: Visual sanity at 375×812 — confirm no regression in Callout layout or contact email row.
- **Skip**: Unit tests for the className change — no behavior to test; visual regression is the meaningful signal.
- **Prior art**: Existing mobile QA screenshots in `Brain/audits/screenshots/` form the visual baseline.

## Out of Scope

- Touch-target fixes for the copy-email button (covered in Phase 2).
- Refactoring Callout structure beyond the single className addition.
- Reformatting the rest of `/privacy` or `/contact`.

## Open Questions

- None — both fixes are mechanical and the file:line targets are confirmed.
