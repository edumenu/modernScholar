---
name: List Card Layout Proposals
description: Two distinct horizontal list-row card designs for the scholarship listing page — design rationale, hierarchy, responsive behavior, hover states
type: project
---

Two proposals designed for the new "list" layout toggle (GridLayout union type will add "list" alongside "bento" and "uniform"):

**Proposal A — Linear Ledger Row**
Inspired by Linear's issue list. Five-column horizontal band: classification accent bar (left edge, 4px, full height) → scholarship name + provider stacked (flex-1) → classification pills (hidden mobile) → amount (tabular mono display) → deadline → compare + CTA actions (right edge). Clean ruled separators between rows instead of individual card shadows.

**Proposal B — Editorial Spread Row**
Inspired by high-end publication content lists. Two-zone horizontal layout: LEFT ZONE (fixed ~280px) contains classification pills + bold award amount as the visual anchor, RIGHT ZONE (flex-1) contains name in Noto Serif heading weight, provider in muted small caps, then description as a single truncated line. Full-bleed tinted left zone (classification color at 6–8% opacity), white/surface right zone. Subtle bottom border as row separator.

**Classification signal:** Both proposals move the `border-t-4` top stripe to a `border-l-4` left edge bar — preserves the same CLASSIFICATION_TINTS border token but rotated for the horizontal context.

**GridLayout type update needed:** Add `"list"` to `export type GridLayout = "bento" | "uniform" | "list"` in `scholarship-filters.tsx`.

**Why:** User wants to move away from bento-only card browsing and add a scan-optimized list view toggled via `solar:hamburger-menu-line-duotone` icon.
