---
name: project-scholarship-grid
description: Scholarship grid geometry, card structure, and grid rendering details for reference when designing inline components
metadata:
  type: project
---

Grid renders in `scholarship-grid.tsx`. Two layouts: grid and list.

Grid layout: `grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4`, gap-4. Each card sits in a `div` with `aspect-3/4 w-full`.

Card (`scholarship-card.tsx`): `rounded-2xl`, background from `tint.bg` (classification-tinted surface token), `shadow-[0_6px_32px_rgba(32,26,25,0.07)]`, `flex flex-col`, `overflow-hidden`. Padding is `px-6` throughout. Bottom CTA row is `px-6 pb-6 pt-5`. No glass — purely tonal surface.

Page size is 12 cards per page. CTA slot would therefore appear once per page if inserted at position 9-12.

**Why:** Needed for designing an inline CTA card that matches the grid's proportions and visual language without looking foreign.

**How to apply:** Any inline CTA card must match `rounded-2xl`, use tonal surface tokens (no glass at Z-1), maintain `aspect-3/4` in grid view, and use the same `px-6` padding rhythm.
