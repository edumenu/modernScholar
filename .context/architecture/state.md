# State Architecture

Where each kind of state lives and which mechanism owns it. **Pick the right layer first — moving state across layers is expensive.**

## Layers (in order of preference)

1. **URL (nuqs)** — Anything shareable, reload-survivable, or back/forward-meaningful. Filters, search, pagination, open tabs.
2. **Component local (`useState`)** — Ephemeral UI: open/closed accordions, hover state, animation triggers.
3. **Zustand store** — Cross-component client state that must survive route changes but **not** reloads, or that needs explicit persistence (localStorage) — comparison set, hero loader, settings.
4. **Server / RSC props** — Anything derived from the data pipeline. Pass through props; don't lift into a store.

## Zustand stores (`src/stores/`)

| Store | Purpose | Persistence |
|-------|---------|-------------|
| `comparison.ts` | Set of scholarship IDs selected for side-by-side compare. Rehydrated by `ComparisonRehydrator` on mount. | localStorage |
| `hero-loader-store.ts` | Whether the home hero (Spline) has finished its initial load — used to coordinate sibling animations. | in-memory |
| `settings-store.ts` | User settings (theme overrides, motion overrides). | localStorage |

**Conventions:**
- One store per concern. Don't merge unrelated state into a "global" store.
- Co-locate the slice's selectors with the store (`useComparisonScholarships`, etc.).
- Use `subscribeWithSelector` only when truly needed.

## URL state (nuqs)

Wired once via `<NuqsAdapter>` in root layout. Reference pattern:

- `src/hooks/use-scholarship-filters.ts` — composes multiple `useQueryState` parsers into a single typed hook returning `{ filters, setFilters, reset }`.

When adding new filter dimensions:
1. Add the parser in `use-scholarship-filters.ts`.
2. Surface the control via `scholarship-filters.tsx` (desktop) or `scholarship-filters-mobile.tsx` (mobile sheet).
3. Mirror in `blog-filters.tsx` if blog needs the same dimension.

## Theming

- `next-themes` owns `theme` (`light` / `dark` / `system`).
- `class` strategy: theme class is applied to `<html>`.
- View Transitions API drives the crossfade.
- **Never** read theme during server render — it's gated by the `<ThemeProvider>` client boundary.

## Motion preferences

- `MotionConfigProvider` sets `reducedMotion="user"` globally.
- For per-component overrides, pass `transition` or read `useReducedMotion()` — but prefer respecting the global config.
