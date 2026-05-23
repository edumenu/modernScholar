---
applies_to: ["**/*.test.{ts,tsx}", "**/*.stories.tsx", "vitest.config.ts", "vitest.setup.ts"]
load_when: "writing, debugging, or running tests"
---

# Testing Rules

Three Vitest projects + one Playwright e2e suite are configured. Each has a different runner.

## Commands

```bash
npm test                  # unit + component
npm run test:unit         # node-env unit tests (scripts, lib, hooks logic)
npm run test:component    # jsdom component + page tests
npm run test:storybook    # storybook stories as tests (Playwright browser)
npm run test:e2e          # Playwright e2e tests against `npm run dev`
npm run test:all          # vitest projects (unit + component + storybook)
npm run test:watch        # watch unit + component
npm run test:coverage     # coverage for unit + component
```

## Critical rules

1. **Pick the right project**:
   - Pure logic, no DOM → `unit` (node env, fastest).
   - React component or page render, jsdom-compatible APIs → `component` (jsdom).
   - Visual regression / story-as-test → `storybook` (real Playwright browser).
   - Anything that needs real layout, real scroll, or globals like `window.__lenis` (Lenis dimensions, smooth scrolling, IntersectionObserver-driven entrance animations) → `e2e` (Playwright, drives `npm run dev`). jsdom returns 0 for scroll/layout measurements and is the wrong fit.
2. **Never start `next dev` from inside a vitest test.** If you need a live server, write a Playwright e2e in `e2e/` — its `webServer` config starts dev for you.
3. **Co-locate `__tests__/` folders** next to the code under test (`src/app/__tests__/`, `src/hooks/__tests__/`, `src/lib/__tests__/`, `src/data/__tests__/`, `scripts/utils.test.ts`). E2e specs live in the top-level `e2e/` directory.
4. **Storybook stories double as docs.** When you add a new primitive in `components/ui/`, add a `<component>.stories.tsx` next to it.

## Where to look for examples

- Page integration: `src/app/__tests__/` (e.g. privacy/terms/cookies legal pages).
- Hook tests: `src/hooks/__tests__/`.
- Pure util tests: `src/lib/__tests__/`, `scripts/utils.test.ts`.
- Story-as-test: any `*.stories.tsx` under `components/blog/`, `components/scholarships/`.
- E2e against a live dev server: `e2e/*.spec.ts` (e.g. `scholarships-layout-toggle.spec.ts`). Use `window.__lenis` (exposed in dev/test by `LenisRouteResizer`) to assert Lenis state.

## QA reports

Human-readable QA findings live in `qa-reports/` and `Brain/audits/`. Reference them when triaging regressions — they are append-only history, don't mutate.
