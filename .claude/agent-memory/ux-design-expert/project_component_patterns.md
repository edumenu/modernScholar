---
name: Cross-cutting Component Patterns
description: Key patterns found across layout, navigation, buttons, animation, and cursor components in Modern Scholar
type: project
---

Header: ScrollAnimatedHeader uses direct DOM ref manipulation + useMotionValueEvent to avoid re-renders. Hides at scroll > 600px. Three glassPill groups: logo pill, nav links pill (with spring-animated active indicator), theme toggle pill. Desktop only — mobile handled by MobileMenuButton (lg:hidden). Skip-to-content link present but incorrectly placed inside ScrollAnimatedHeader wrapper (outside <header> tag).

Mobile menu: Full-height slide-in drawer from right, animated SVG Bezier curve on left edge, 0.8s cubic-bezier easing. Links animate with stagger (0.05 * index delay). Social links are placeholder hrefs (#). No close-on-route-change behavior.

Footer: Fixed-position sticky footer revealed via clip-path scroll trick. Uses `relative h-[50vh]` wrapper + `fixed bottom-0` inner div. Large decorative "Modern Scholar" text at 8vw with text-on-surface/8 opacity. No scroll-to-top button. Legal/social links are placeholder hrefs.

Button system: Base Button (button.tsx) + ButtonLink (navigation) + CTAButton (hero/section CTAs). All share magnetic ripple effect logic (position-tracked, enter/leave/move/snap states). CTAButton is a separate component — NOT a CVA variant of Button — with fixed w-50 width and circle-plus-label layout. Ripple in Button uses circOut easing at 0.3s; CTAButton uses easeOut at 0.5s — inconsistency.

Card: bg-surface-container-low, rounded-lg, shadow-md. No hover state defined at card level. CardTitle uses font-heading text-base font-medium.

AnimatedSection: useInView with once:true, margin:-80px. 8 presets (fadeUp/Down/Left/Right/scaleIn/blurIn/slideUp/none). No prefers-reduced-motion check.

AnimatedLines: Measures actual rendered line breaks via pretext lib (useContainerWidth + useTextLines). Supports lines mode and chars mode. Chars mode uses 1.2s/0.6s duration with [0.4,0,0,1] or [0.22,1,0.36,1] easing. No prefers-reduced-motion check.

ParallaxLayer: Thin wrapper around useParallax hook, renders motion.div. No reduced-motion check visible at component level (may be in hook).

PageShell: main#main-content, max-w-7xl, px-6/md:px-8, [&>*+*]:mt-22 for section rhythm. Footer is outside PageShell — correct.

CustomCursor: Spring-animated dot (10x10px) in primary-400. Three variants: default (visible), fade (opacity:0 — hides on interactive elements), text (60x30px pill with label). Controlled by cursorEnabled setting + hasPointer media query. Respects prefers-reduced-motion by switching to snap spring config. Pathname-tracked for cursor state reset.

globals.css: View transitions defined for theme toggle (sweep-down clip-path 0.5s). Scrollbar hidden globally (scrollbar-width:none). Custom cursor CSS via html.custom-cursor-active class. page-padding-y utility (10rem top/bottom).

**Why:** These patterns establish the interaction language across the entire site. Understanding them prevents duplication and ensures new components integrate cleanly.
**How to apply:** When building new components, match these patterns. New buttons should use CVA variants on the base Button, not new standalone components. New animations should check AnimatedSection presets before creating custom ones.
