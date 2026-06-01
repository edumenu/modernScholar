---
name: project_remotion_intro
description: Remotion video project structure and design conventions for the Modern Scholar intro reel
metadata:
  type: project
---

Remotion intro video project lives at `/Users/edemdumenu/Documents/Workspace/DearModernScholar/modern-scholar-intro/`. It is a 1080×1920 vertical reel, 300 frames at 30fps (10 seconds), composed in `src/Intro.tsx` with `src/Root.tsx` as the composition root.

**Scene structure (frame offsets):**
- BrandIntro: from=0, dur=65 — logo + wordmark + tagline + ambient particles
- HomeReveal: from=50, dur=95 — HomeLayout wrapped in PageReveal
- ScholarshipsReveal: from=130, dur=85 — ScholarshipsLayout wrapped in PageReveal
- BlogsReveal: from=200, dur=80 — BlogsLayout wrapped in PageReveal
- CtaOutro: from=265, dur=35 — PRIMARY sweep + wordmark + brandUrl

**Key design decisions:**
- PageReveal accepts `children: React.ReactNode` (not a `src` string) — each scene passes its layout component as children
- All animation is pure `interpolate()` + `spring()` from `remotion` — no Motion/framer-motion
- All styling is inline `style={{}}` props using brand color constants at top of file — no Tailwind
- Particles use `random("seed-string")` for deterministic positions across renders
- CROSSFADE = 15 frames for all enter/exit transitions

**Brand color constants defined in Intro.tsx:**
- SURFACE, SURFACE_CONTAINER, SURFACE_CONTAINER_LOW
- PRIMARY, PRIMARY_FG, PRIMARY_TINTED_BG, SECONDARY_TINTED_BG, TERTIARY_TINTED_BG
- ON_SURFACE, ON_SURFACE_VARIANT, ON_SURFACE_MUTED
- SAGE, TERRACOTTA, OUTLINE_VARIANT

**Why:** No screenshot PNGs required — scenes are fully recreated as JSX, making the video self-contained and editable without re-capturing screenshots.

**How to apply:** When adding new scenes or modifying the video, keep all animation as deterministic frame functions, use the color constants (never hardcode hex), and wrap new scenes in PageReveal with children.
