---
name: Mobile Audit Findings 2026-05-17
description: P0/P1 ship-blockers and cross-cutting themes from 2026-05-17 mobile audit of 9 routes at 375px and 320px
type: project
---

Full plan at `Brain/audits/mobile-audit-2026-05-17.md`. QA findings at `Brain/audits/qa-findings-2026-05-17.md`.

**Why:** Comprehensive mobile QA pass to validate production readiness at 375px and 320px viewports across all 9 live routes.

**How to apply:** Use when implementing any mobile layout, touch targets, or legal page improvements. Check the phased plan before starting work to avoid duplicating fixes.

## P0 (fix immediately)
- `/privacy` at 320px: horizontal scroll caused by `Callout` flex child missing `min-w-0`. Fix: add `min-w-0 [overflow-wrap:anywhere]` to `data-slot="callout-content"` div in `src/components/blog/callout.tsx` line 72.
- `/contact` at 320px (de-facto P0): email row flex overflow — add `min-w-0` to flex container at `src/components/contact/contact-form-section.tsx` line 345.

## Top cross-cutting P1 themes
1. **Sub-44px touch targets system-wide** — `button.tsx` `icon-sm` (32px) and `sm` (32px) size variants; filter chips with `py-2` (34px); SheetClose button (34px); scholarship card compare button (32px). Pattern: add `min-h-11` or `@media (pointer: coarse)` override. Affects: scholarships, blog, contact, mobile menu footer.
2. **Legal pages have no in-page TOC** — `/cookies` (6 sections), `/privacy` (10 sections + 2 H3s), `/terms` (17 sections) all have heading IDs ready but no jump-nav UI. Fix: add `<details>/<summary>` collapsible TOC to `LegalLayout` component accepting a `sections` prop.
3. **Heading hierarchy inconsistencies** — `/` has no `<h1>` (hero is `<h2>`); `/blog/[slug]` skips H1→H3 (needs `## ` not `### ` in ScholarshipBlogs.md); `/not-found` H1 only 24px visually dominated by CTA buttons.

## Notable per-route findings
- **Pagination stale count** (`/scholarships`): `totalPages` uses `sortedItems.length` (full corpus ~421) instead of `sortedItems.filter(i => i.matches).length` — shows 38 pages for a 22-result filter.
- **Nested interactive elements** — `ScholarshipCard` uses `role="button"` on `<article>` containing child `<button>` elements (ARIA violation); `BlogCard` wraps `<Button>` inside `<Link>`; `BlogDetail` back-button is `<Link><Button>` — all fixable by using `ButtonLink` or hidden overlay button patterns.
- **Blog post duplicate excerpt** at top of article — hero renders `frontmatter.excerpt` and MDX body starts with same sentence. Fix: remove redundant trailing paragraph from MDX or add defensive check in layout.
- **Privacy "Last updated" appears 4 times** — remove the trailing `<LegalSection id="last-updated">` from `/privacy` and `/terms` pages; `LegalLayout` header already surfaces the date.
- **Callout accessible name** — `aria-label={label}` on `<aside>` already correct. The visible `<p>{label}</p>` is intentional design. No change needed.
- **404 floating icons** — outer `aria-hidden="true"` div should suppress them from AT; if Iconify still exposes `role="img"` on individual SVGs, add `aria-hidden="true"` prop to each `<Icon>` component inside `FloatingElements`.
