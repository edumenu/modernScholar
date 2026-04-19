---
name: Academic Curator Design System
description: Core design system tokens, rules, and patterns for Modern Scholar — OKLCH palette, glassmorphism tiers, elevation, typography
type: project
---

Typography: Noto Serif (--font-heading, weights 400/700) for headings; Poppins (--font-sans, weights 400/500/600/700) for body/UI.

Colors (OKLCH): Primary deep brownish-red oklch(0.408 0.098 25.7), Secondary sage oklch(0.480 0.0265 151.2), Tertiary terracotta oklch(0.477 0.1193 31.2), Surface/background oklch(0.9556 0.0101 32.2). Full shade scales 50–950 defined in globals.css.

Dark mode: Primary shifts to oklch(0.563 0.1256 30.7), background oklch(0.175 0.008 25.0), surface tonal layers shift from low 0.160 to high 0.360 lightness.

Glassmorphism — three tiers, all defined as CSS utility classes in globals.css:
- .glass-panel: 72% opacity, 32px blur — modals, dropdowns
- .glass-elevated: 78% opacity, 40px blur — sticky nav
- .glass-heavy: 88% opacity, 48px blur — tooltips, toasts
Glass is ONLY for Z-2+ floating elements. Never on cards, forms, sidebars, page sections.

glassPill (styles.ts): rounded-full border border-white/40 bg-white/25 backdrop-blur-2xl — used in header nav pills and mobile menu toggle.

Elevation: Z-0 solid surface, Z-1 cards (tonal), Z-2 sticky nav (glass-elevated), Z-3 dropdowns (glass-panel), Z-4 modals (glass-panel), Z-5 tooltips (glass-heavy).

Shadows: warm ambient rgba(32,26,25,0.04–0.16). Neumorphic for buttons (shadow-neu-primary/secondary/tertiary/outline). All defined as CSS custom properties in globals.css.

Radius: --radius: 1rem base, scale from sm (0.6x) to 4xl (2.6x).

Ring/focus color: sage green (--ring = secondary oklch value).

**Why:** The "Academic Curator" aesthetic rejects SaaS sterility. Every token choice reinforces a scholarly, editorial feel.
**How to apply:** Always check token usage against these specs. Deviations (e.g., raw hex colors, hardcoded rgba not from token system) are audit flags.
