# Module 5: Home Page Polish

> Part of the [UX/UI Audit](ux-audit-overview.md) — Priority: P1

## Problem Statement

The home page has four targeted issues: commented-out mobile hero content leaving a dead zone above the fold, a design system color token violation in the WhatsNext section, a barely-perceptible marquee speed, and a heading hierarchy problem. These are quick-fix items that don't require architectural changes.

## Solution

Fix the four identified issues to bring the home page into full design system compliance and improve the mobile experience.

## User Stories

1. As a mobile user, I want to see brand identity content in the hero section above the fold, so that the first impression communicates what Modern Scholar is.
2. As a user scrolling the WhatsNext section, I want label text colors to use design system tokens, so that the visual language is consistent.
3. As a user viewing the featured scholarships section, I want the marquee to scroll at a perceptible speed, so that I notice the continuous content motion and understand there are many scholarships.
4. As a screen reader user, I want the heading hierarchy to be semantically correct (no `h3` before `h1`), so that I can navigate the page structure logically.

## Implementation Decisions

### 1. Restore Mobile Hero Content

Review the commented-out content at lines 68-92 of `hero-section.tsx`. Either un-comment and update, or replace with appropriate mobile-first hero content (brand name, tagline, CTA). The hero should have meaningful content at every breakpoint.

**Components affected**: `hero-section.tsx`

### 2. Fix WhatsNext Color Token

Replace `text-gray-300` with a design system token at `slide-content.tsx` line 107. Use the appropriate `colors.body` value from the panel's color scheme, or use `text-on-surface-variant` / `text-white/70` depending on the slide background color.

**Components affected**: `whats-next/slide-content.tsx`

### 3. Increase Marquee Speed

Reduce marquee animation duration from `200s`/`190s` to `40-60s` in `featured-scholarships.tsx`. At the current speed, the motion is imperceptible — users cannot tell the content is scrolling, which defeats the purpose of the infinite marquee pattern.

**Components affected**: `featured-scholarships.tsx`

### 4. Fix Heading Hierarchy

Change the `h3` "Modern Scholar" at `hero-section.tsx` line 113 to a `<span>` or `<p>` with `aria-hidden="true"`. The `h1` at line 124 ("Your scholarship journey starts here") should be the first and only heading in the hero section.

**Components affected**: `hero-section.tsx`

## Testing Decisions

- **Modules to test**: Heading hierarchy (unit test: verify no h3 appears before h1 in hero DOM), mobile hero content rendering (Playwright: viewport 375px, verify content exists above fold)
- **Prior art**: Existing Playwright setup

## Out of Scope

- Hero section redesign or 3D scene changes
- Featured scholarships card redesign
- WhatsNext section structural changes
- FAQ section redesign

## Further Notes

- These are all small, targeted fixes. Total estimated scope is under a day of work.
- The hero Spline scene re-mounts on theme change due to `key={resolvedTheme}`. This is a performance concern shared with the contact page — consider a unified fix in Module 1 if the Spline wrapper is centralized.
- The featured scholarships section could benefit from a mobile click affordance on cards (the `data-cursor` approach is desktop-only), but this is a minor enhancement that can be deferred.
