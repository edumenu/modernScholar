---
name: Scholarship Card Design Variants
description: Three distinct card layout options built as Storybook stories for the scholarship grid — design decisions, file locations, and distinguishing axes
type: project
---

Three scholarship card variants were designed and built as Storybook stories for user comparison. All live under `src/components/scholarships/`:

- `scholarship-card-editorial.tsx` — Option A "Editorial Ledger"
- `scholarship-card-structured.tsx` — Option B "Structured Data"
- `scholarship-card-immersive.tsx` — Option C "Immersive Tonal"
- `scholarship-card-variants.stories.tsx` — Storybook stories comparing all three

All three share: no images, classification-driven color tinting, Solar Linear icons, compare toggle, Scholarship type from `@/data/scholarships`, `useComparisonStore`, and Motion spring hover animations.

**Design differentiators:**

| Axis | Option A | Option B | Option C |
|---|---|---|---|
| Density | Medium | High | Low (most airy) |
| Underline | Short accent bar (w-12, 2px, primary, animates to w-16) | Full-width hairline rule (outline-variant/25) | Gradient fade (primary → transparent, bg-linear-to-r) |
| Metadata | Horizontal ruled row, icon+text pairs with ghost divider | Stacked badge chips (amount=primary tint, deadline=surface) | Display-size amount (text-2xl font-heading), small deadline below |
| CTA | Editorial text-link, right-aligned, always visible | Full-width Button variant="default", opacity-0 hover:opacity-100 | Icon-only circle arrow, always visible |
| Container | Tonal fill (bg-primary/secondary/tertiary-50) + ghost border | Two-tone: tinted header + surface-container-lowest body | Full-bleed tonal wash, no border, shadow-only edge |
| Hover | translateY -4px, title color → primary, underline widens | Scale 1.008 + translateY -3px, header tint deepens, CTA reveals | Scale 1.015 + translateY -3px, shadow deepens |

**Why:** User wanted three genuinely distinct options beyond just changing the underline, to pick a production design.

**How to apply:** When the user picks a variant, refactor the chosen component to replace `ScholarshipCard` in `scholarship-grid.tsx`. The `onExpand` prop matches the existing interface.

**Classification tint mapping used across all three:**
- High School → primary-50/100
- Undergraduate → secondary-50/100
- Graduate → tertiary-50/100
- K-8 → primary-50
- K-12 → secondary-50
