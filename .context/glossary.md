# Glossary

Domain and code terminology specific to Modern Scholar. Alphabetical.

## Domain

- **Application Status** — Derived from `deadline` + today's date at render time. Values: `open`, `closing-soon`, `expired`. Not stored in the JSON.
- **Award Range** — Dollar bracket filter on the scholarship list (e.g. `$1k–$5k`). Driven by `award-range-filter.tsx` + nuqs.
- **Cover Image** — Hero image filename listed in blog post frontmatter; resolved against `public/scholarships/`.
- **Eligibility Tag** — Machine-derived string label (e.g. `first-generation`, `stem`, `women`) attached to a scholarship by `npm run tag-eligibilities`. Not the same as free-text `eligibility`.
- **Match Badge** — Visual indicator on a scholarship card showing how well the scholarship matches the user's filter selections (`match-badge.tsx`).
- **Scholarship** — Top-level domain entity. Authored in `MasterScholarshipList.csv`, enriched into `scholarships-enriched.json`, consumed via the typed export `src/data/scholarships.ts`.

## Pipeline

- **Enriched JSON** — `src/data/scholarships-enriched.json`. The scraped + tagged output of the data pipeline. Derived; never hand-edit.
- **Link Report** — `scripts/output/link-report.json`. The output of `check-links` showing which CSV URLs are alive vs dead.
- **Master List** — `MasterScholarshipList.csv`. The hand-curated source of truth.
- **Pipeline** — The ordered run: `check-links` → `scrape-scholarships` → `tag-eligibilities`. See `.claude/rules/data-pipeline.md`.

## UI / Component

- **AnimatedLines** — Per-line stagger primitive for headings.
- **AnimatedSection** — Scroll-triggered entrance wrapper (`fadeUp` / `fadeDown` / `scaleIn`).
- **Callout** — MDX boxed insert (`<Callout type="tip|note|warning">`). Auto-generated from `What to do instead:` lines in source markdown.
- **Comparison Sheet** — Side-drawer that compares 2–3 selected scholarships. State lives in `stores/comparison.ts`. Rehydrated on load by `ComparisonRehydrator`.
- **Coverflow Carousel** — 3D-tilted horizontal carousel on the home page (`coverflow-carousel.tsx`).
- **Glass Elevated / Glass Panel / Glass Heavy** — Three glassmorphism tiers. See `.claude/rules/design-system.md`.
- **Page Shell** — Layout wrapper that constrains content width and applies vertical rhythm (`components/ui/page-shell.tsx`).
- **Pull Quote** — Large editorial blockquote primitive used in blog posts.
- **Ripple** — Click-feedback effect on `Button`, implemented via `useRipple`.
- **Smooth Scroll Provider** — Lenis-based smooth-scroll global wrapper. Setting `window.scrollTo` directly fights it.

## Theming / Tokens

- **OKLCH** — The color space used for all design tokens. See `globals.css`.
- **Tonal Surface** — Layered surface scale (`--container-lowest` … `--container-highest`) replacing flat gray cards.
- **View Transitions** — Browser-native API used by `next-themes` for light/dark crossfade.

## External

- **Base UI** — `@base-ui/react`. Headless, accessible primitive library. Default choice over Radix.
- **Lenis** — Smooth scrolling library. Wired globally via `SmoothScrollProvider`.
- **Motion** — Animation library (formerly Framer Motion). Package name is `motion`; import path `motion/react`.
- **nuqs** — URL search-param state library. Wired globally via `NuqsAdapter`.
- **Spline** — 3D scene tool (`@splinetool/react-spline`). Scenes referenced from `src/config/spline-scenes.ts`.
- **Zustand** — Client state library. Stores live in `src/stores/`.
