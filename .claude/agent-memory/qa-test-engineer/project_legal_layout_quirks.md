---
name: Legal layout shared-chrome quirks
description: Known behaviors and gotchas in src/components/legal/legal-layout.tsx that affect all three policy pages
type: project
---

`/cookies`, `/privacy`, and `/terms` all share `src/components/legal/legal-layout.tsx`. Notable quirks worth knowing before editing any of the three pages:

- `formatLastUpdated()` parses the ISO date as UTC (`new Date(\`${iso}T00:00:00Z\`)`) then formats it with the default-locale Intl formatter, which uses **local** time. So the visible "Last updated" text is off by one day in any timezone west of UTC. The `<time datetime="…">` attribute still has the correct ISO, so a11y / SEO read correctly.
- Article width is capped at `max-w-3xl` (48 rem ≈ 768 px). At tablet landscape (1024 px) the article fills the cap, producing ~96 ch line length — over the ~75 ch readability target.
- The header eyebrow renders the formatted date with `text-secondary` color in uppercase tracked-out styling — easy to miss visually.
- Each `LegalSection` wraps its `<h2>` with `id="<section-id>-heading"` while the parent `<section>` carries `id="<section-id>"`. Anchor URLs like `/cookies#what-we-store` target the section. There is no in-article TOC component as of this branch.
- `LegalSubsection` uses `<h3>` Noto Serif 20 px. Only `/privacy` uses subsections currently (the two GDPR/CCPA blocks under "Your rights").
- The `<aside aria-label="Summary">` TL;DR card uses `border-l-4 border-primary` with `bg-surface-container` — flat tonal layering, not glass (correct per the design system: glass is for Z-2+ floating elements only).

**Why this matters:** any change to `formatLastUpdated`, to `max-w-3xl`, or to the section-id pattern propagates to all three policy pages at once. Conversely, page-level inconsistencies (e.g. `/privacy` and `/terms` both render a redundant `<LegalSection id="last-updated">` at the bottom that shows the raw ISO date) live in the page files, not the layout.

**How to apply:** When testing a change to one of the three policies, also verify the other two (and probably also a unit test on `formatLastUpdated` with a non-UTC fake clock).
