---
applies_to: ["src/**/*.{tsx,css}", "src/app/globals.css", "src/components/**"]
load_when: "writing or editing any visual component, page, or token"
deep_ref: "SystemDesign.md"
---

# Design System Rules — "Academic Curator"

**Authoritative deep reference:** `SystemDesign.md` (22 KB). Read it before doing custom token work.

## Critical rules (read first)

1. **No glass on cards, forms, sidebars, or page sections.** Glass is reserved for floating elements at Z-2+ only (sticky nav, dropdowns, modals, tooltips).
2. **Tokens, not hex.** Reference CSS custom properties from `globals.css` (`--color-primary`, `--color-surface`, `--container-low`, etc.). Never hard-code OKLCH or hex inside components.
3. **Always include `prefers-reduced-transparency` and `prefers-contrast: more` fallbacks** wherever glass is applied.
4. **Headings → Noto Serif (`--font-heading`). Body/UI → Poppins (`--font-sans`).** Never mix.

## Color palette (OKLCH, defined in `globals.css`)

- `--color-primary` — deep brownish-red (#76312D). CTAs, brand accents.
- `--color-secondary` — sage green (#536256). Curated content, focus rings.
- `--color-tertiary` — terracotta (#943E30). Complementary warmth.
- `--color-surface` — warm cream (#F9F3F2). Baseline background.
- `--container-lowest` → `--container-highest` — tonal layering for cards/containers.

## Typography scale

- `font-heading` (Noto Serif): page titles, section headings, editorial pull quotes.
- `font-sans` (Poppins): body, UI labels, buttons, captions.
- Weights loaded: Serif {400, 700}, Sans {400, 500, 600, 700}. Don't request other weights.

## Glassmorphism tiers (utility classes in `globals.css`)

- `glass-base` — 72% opacity, 32px blur. Sticky nav strips.
- `glass-elevated` — 78% opacity, 40px blur. Floating toolbars, comparison FAB.
- `glass-panel` — 88% opacity, 48px blur. Dropdowns, popovers, modals, sheets.

## Elevation (z-index intent, not raw values)

| Layer | Use | Surface |
|-------|-----|---------|
| Z-0 | Page sections | Solid, tonal |
| Z-1 | Cards, containers | Tonal layering, **no glass** |
| Z-2 | Sticky nav, floating bars | `glass-elevated` |
| Z-3 | Dropdowns, popovers | `glass-panel` |
| Z-4 | Modals, dialogs, sheets | `glass-panel` |
| Z-5 | Tooltips, toasts | `glass-heavy` |

## Shadows

- Ambient tinted shadows on floating elements: warm brown base, 4–6% opacity.
- Neumorphic two-tone shadow on buttons (light top/left, dark bottom/right).
- Shadow scale exposed as `--shadow-xs` … `--shadow-xl` — use the token.
