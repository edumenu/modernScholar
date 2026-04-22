---
name: Full Platform Audit Findings
description: Critical and major issues from full UX/UI audit of all pages (April 2026) — heading hierarchy, design system violations, a11y gaps, animation issues, content strategy
type: project
---

Full audit completed April 2026. Key findings:

**Why:** Complete audit of Hero, Featured Scholarships, What's Next, FAQ sections against design system and animation best practices.

**How to apply:** Use these as a checklist before implementing any redesign work on the home page.

## Critical Issues Found
- h3 "Modern Scholar" rendered before h1 in hero (hero-section.tsx line 113) — wrong heading hierarchy
- Empty dead zone on mobile hero top due to all brand content being commented out (lines 68–92)
- No click affordance on scholarship cards for mobile users — only data-cursor custom cursor works (desktop only)
- Hardcoded `text-gray-300` in What's Next labels (slide-content.tsx line 107) — design system violation
- `will-change: transform` unconditional on 6 composited elements — GPU overload on mobile
- Spline double-load on dark mode — full scene re-fetch because key={resolvedTheme} causes re-mount on mount

## Major Animation Issues
- `opacityRange={[1, 0.7]}` on bottom hero ParallaxLayer fades headline immediately on scroll (line 98)
- CTAButton delay={0.7} too long for a primary CTA — should be max 0.4s
- rightX parallax values [50, 0, 50] in slide-content.tsx wrong direction — both start/end at 50px instead of leading scroll direction
- Competing parallax directions on FAQ two-column split create layout-bug appearance
- AnimatedSection fadeUp on marquee rows conflicts with ParallaxLayer vertical transform — jank on entrance

## Design System Violations
- WhatsNext panel backgrounds use raw hex (#6d3532, #96a498, #bb6659) — not OKLCH tokens, not dark-mode aware
- Section eyebrow labels all use identical text-tertiary — no tonal differentiation between sections
- Section vertical padding inconsistent: hero py-20/pb-28, featured py-30, FAQ min-h-[75vh] no padding, What's Next px-6 py-20 (reduced motion only)
- h2 section headings use font-medium inconsistently — Featured and FAQ use medium, What's Next uses bold

## Layout Issues
- Hardcoded h-110 (440px) on WhatsNext left column flex container (slide-content.tsx line 82) breaks mobile
- aspect-video container forces all three visual components into wrong shape
- FAQ min-h-[75vh] with no py-* causes edge collision with adjacent sections
- Card images recycle scholarship-1 through scholarship-6 for all 15 items — stutter in marquee
- Marquee speed 200s/190s is imperceptibly slow — reduce to 40–60s
