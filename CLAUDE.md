@AGENTS.md

# Modern Scholar

A scholarship discovery and curation platform with a premium editorial aesthetic. Helps students find, explore, and secure scholarships through a design-forward experience inspired by high-end literary journals.

## Tech Stack

- **Framework**: Next.js 16.2.1 (App Router) with React 19
- **Styling**: TailwindCSS v4 with OKLCH color tokens in CSS custom properties
- **Animation**: Motion (formerly Framer Motion) for declarative animations, Lenis for smooth scrolling
- **3D**: Spline (@splinetool/react-spline) for embedded 3D scenes
- **State**: Zustand for client state, Nuqs for URL search params
- **UI Primitives**: Base UI (unstyled, accessible components)
- **Theming**: next-themes with View Transitions API for light/dark switching
- **Component Variants**: class-variance-authority (CVA)
- **Icons**: Iconify React
- **Testing**: Vitest + Playwright browser testing
- **Component Dev**: Storybook 10

## Commands

```bash
npm run dev           # Start dev server (webpack mode)
npm run build         # Production build
npm run lint          # ESLint
npm run storybook     # Storybook on port 6006
```

## Project Structure

```
src/
├── app/                        # Next.js App Router
│   ├── layout.tsx              # Root layout (theme provider, smooth scroll, header/footer)
│   ├── page.tsx                # Home page
│   ├── globals.css             # Design tokens, theme variables, glassmorphism utilities
│   ├── scholarships/page.tsx   # Scholarship discovery with filtering
│   ├── blog/                   # Blog listing + [slug] detail pages
│   └── contact/page.tsx        # Contact page with Spline 3D scene
├── components/
│   ├── ui/                     # Base UI primitives (button, card, dialog, header, footer, etc.)
│   ├── home/                   # Home page sections (hero, featured scholarships, FAQ, etc.)
│   ├── scholarships/           # Scholarship page components
│   ├── blog/                   # Blog page components
│   └── contact/                # Contact page components
├── lib/utils.ts                # cn() helper (clsx + tailwind-merge)
├── hooks/                      # Custom hooks (use-media-query)
├── stores/                     # Zustand stores (settings)
└── data/                       # Static data (scholarships with types)
```

## Design System: "Academic Curator"

The full design system is documented in `SystemDesign.md`. Key essentials:

### Typography
- **Headings**: Noto Serif (weights 400, 700) — editorial authority
- **Body/UI**: Poppins (weights 400, 500, 600, 700) — clarity and utility

### Color Palette (OKLCH)
- **Primary**: Deep brownish-red (#76312D) — CTAs, brand moments
- **Secondary**: Sage green (#536256) — stability, curated content, focus states
- **Tertiary**: Terracotta (#943E30) — complementary warmth
- **Surface**: Warm cream (#F9F3F2) — baseline background
- Tonal surface layering: container-lowest through container-highest

### Glassmorphism Rules
- Applied **sparingly** to floating elements only (Z-2 and above: sticky nav, modals, dropdowns, tooltips)
- **Never** on cards, forms, sidebars, or page sections
- Three tiers: Base Glass (72% opacity, 32px blur), Elevated Glass (78%, 40px), Heavy Glass (88%, 48px)
- Always include accessibility fallbacks for `prefers-reduced-transparency` and `prefers-contrast:more`

### Elevation System
- Z-0: Page surface (solid)
- Z-1: Cards, containers (tonal layering, no glass)
- Z-2: Sticky nav, floating bars (glass-elevated)
- Z-3: Dropdowns, popovers (glass-panel)
- Z-4: Modals, dialogs (glass-panel)
- Z-5: Tooltips, toasts (glass-heavy)

## Conventions

### File & Component Naming
- Files: kebab-case (`hero-section.tsx`, `animated-lines.tsx`)
- Components: PascalCase (`HeroSection`, `ScholarshipCard`)
- Utilities: lowercase (`cn()`, `glassPill`)

### Component Patterns
- **Compound components** with `data-slot` attributes for styling (e.g., Card with CardHeader, CardTitle, CardContent)
- **CVA variants** for component prop combinations (see `button.tsx` for reference)
- **"use client"** directive on all interactive/stateful components
- **Suspense boundaries** for heavy components (Spline 3D scenes)

### Animation Patterns
- `AnimatedSection` wrapper for scroll-triggered entrance animations (fadeUp, fadeDown, scaleIn)
- `AnimatedLines` for staggered text line animations on headings
- Motion `useInView` for viewport-aware animations
- Ripple effect on buttons via custom React state
- Marquee rows with continuous scroll and pause-on-hover

### Shadows
- Ambient tinted shadows (warm brown base, 4-6% opacity) for floating elements
- Neumorphic shadows for buttons (light top/left, dark bottom/right)
- CSS custom properties for shadow scale (xs through xl)
