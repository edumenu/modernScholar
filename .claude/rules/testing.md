---
applies_to: ["**/*.test.{ts,tsx}", "**/*.stories.tsx", "vitest.config.ts", "vitest.setup.ts"]
load_when: "writing, debugging, or running tests"
---

# Testing Rules

Three Vitest projects are configured: `unit`, `component`, `storybook`. Each has a different runner.

## Commands

```bash
npm test                  # unit + component
npm run test:unit         # node-env unit tests (scripts, lib, hooks logic)
npm run test:component    # browser-env (Playwright) component + page tests
npm run test:storybook    # storybook stories as tests
npm run test:all          # everything
npm run test:watch        # watch unit + component
npm run test:coverage     # coverage for unit + component
```

## Critical rules

1. **Pick the right project**:
   - Pure logic, no DOM → `unit` (jsdom-free, fastest).
   - React component, page render, anything touching the DOM → `component` (Playwright browser).
   - Visual regression / story-as-test → `storybook`.
2. **Never start `next dev` from a test.** Use the component project's Playwright browser env instead.
3. **Co-locate `__tests__/` folders** next to the code under test (`src/app/__tests__/`, `src/hooks/__tests__/`, `src/lib/__tests__/`, `src/data/__tests__/`, `scripts/utils.test.ts`).
4. **Storybook stories double as docs.** When you add a new primitive in `components/ui/`, add a `<component>.stories.tsx` next to it.

## Where to look for examples

- Page integration: `src/app/__tests__/` (e.g. privacy/terms/cookies legal pages).
- Hook tests: `src/hooks/__tests__/`.
- Pure util tests: `src/lib/__tests__/`, `scripts/utils.test.ts`.
- Story-as-test: any `*.stories.tsx` under `components/blog/`, `components/scholarships/`.

## QA reports

Human-readable QA findings live in `qa-reports/` and `Brain/audits/`. Reference them when triaging regressions — they are append-only history, don't mutate.
