---
applies_to: ["src/components/**/*.{tsx,ts}"]
load_when: "building or refactoring any React component"
---

# Component Rules

## Critical rules (read first)

1. **Files: kebab-case** (`scholarship-card.tsx`). **Components: PascalCase** (`ScholarshipCard`). **Utilities: lowercase camelCase** (`cn`, `glassPill`).
2. **`"use client"` is required** on every component that uses hooks, state, event handlers, browser APIs, Motion, or Spline. Server components only for static layout/data fetching.
3. **Compound components** expose subparts via `data-slot` attributes (mirror `card.tsx`: `Card`, `CardHeader`, `CardTitle`, `CardContent`, `CardFooter`).
4. **CVA for variant props.** When a component has style permutations, use `class-variance-authority` (see `button.tsx`). Don't hand-roll conditional `clsx` chains for variant logic.
5. **Wrap Spline 3D scenes in `<Suspense>`** with a skeleton fallback. Never block first paint on Spline.
6. **All classnames pass through `cn()`** from `@/lib/utils`. Direct className concatenation is not allowed.

## Directory map

```
src/components/
├── ui/             # Primitives (button, card, dialog, sheet, header, footer, …)
├── home/           # Home page sections only
├── scholarships/   # Scholarship discovery page only
├── blog/           # Blog listing + detail only
├── contact/        # Contact page only
└── legal/          # Privacy / terms / cookies
```

Each primitive in `ui/` lives in a subfolder when it has multiple files (e.g. `ui/button/`, `ui/card/`). Otherwise a single `.tsx` is fine.

## Imports

- Use `@/` alias for `src/` (e.g. `@/components/ui/button`, `@/lib/utils`, `@/data/scholarships`).
- Use `iconify-react` via `<Icon icon="…" />` — no other icon libraries.
- Use Base UI (`@base-ui/react`) for accessible primitives. Radix is only allowed where Base UI lacks coverage (currently: slider).

## Co-located files

- `<component>.stories.tsx` — Storybook story (see existing stories in `components/blog/` and `components/scholarships/`).
- `<component>.test.tsx` (rare; most tests are integration in `app/__tests__/`).

## When NOT to create a component

- Three similar JSX blocks is **better** than a premature abstraction. Extract only when the third reuse appears or shared logic is non-trivial.
- Don't wrap a primitive just to set defaults — pass props at the call site.
