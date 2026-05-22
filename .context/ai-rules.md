# Project-Wide AI Rules

These apply on **every** task in this repo, regardless of file path.

Sections marked _(Karpathy)_ are adapted from the [Karpathy Guidelines](https://github.com/multica-ai/andrej-karpathy-skills) — behavioural rules derived from common LLM coding pitfalls. They bias toward caution over speed; use judgment on trivial tasks.

## Critical

1. **This is Next.js 16, not the version you trained on.** Read the relevant doc in `node_modules/next/dist/docs/` before writing route code. Heed deprecation notices. (Mirrored in `AGENTS.md`.)
2. **Don't add features, refactor, or introduce abstractions beyond what the task requires.** A bug fix doesn't need surrounding cleanup; three similar lines is better than a premature abstraction.
3. **Default to writing no comments.** Only add one when the WHY is non-obvious: a hidden constraint, a subtle invariant, a workaround. Never explain WHAT well-named code already says.
4. **No backwards-compatibility shims.** No renaming-unused `_vars`, no `// removed` placeholders, no re-exports for moved code. Delete what's unused.

## Think before coding _(Karpathy)_

**Don't assume. Don't hide confusion. Surface tradeoffs.**

- State assumptions explicitly. If uncertain, ask (unless the user has asked you to work without interruption — then make the reasonable call and continue).
- If multiple interpretations of the request exist, present them rather than picking silently.
- If a simpler approach exists than what was requested, say so. Push back when warranted.
- If something is unclear, name what's confusing instead of guessing.

## Simplicity first _(Karpathy)_

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios — validate at system boundaries only (user input, external APIs).
- Self-check: "Would a senior engineer say this is overcomplicated?" If yes, rewrite.

## Surgical changes _(Karpathy)_

**Touch only what you must. Clean up only your own mess.**

- Don't "improve" adjacent code, comments, or formatting that's outside the scope of the change.
- Don't refactor things that aren't broken.
- Match existing style in the file, even if you'd do it differently elsewhere.
- If you spot unrelated dead code, **mention it — don't delete it.** (Exception: the rule above on backwards-compat shims still applies to code _your_ change orphans.)
- When your edit makes an import/variable/function unused, remove it. Don't leave orphans behind.
- The test: every changed line should trace directly to the user's request.

## Goal-driven execution _(Karpathy)_

**Define success criteria. Loop until verified.**

Translate vague tasks into verifiable goals before writing code:

- "Add validation" → write tests for invalid inputs, then make them pass.
- "Fix the bug" → write a test that reproduces it, then make it pass.
- "Refactor X" → ensure the relevant `npm test` / `npm run lint` / `npm run build` passes before and after.

For UI/visual changes (which don't have a unit test), the verification is running the dev server and using the feature in a browser — say so explicitly instead of claiming success from a type-check alone.

For multi-step work, state a brief plan inline:

```
1. <step> → verify: <check>
2. <step> → verify: <check>
```

## Editing conventions

- Edit existing files; don't create new ones unless required.
- Never create documentation files (`*.md`, `README.md`) unless explicitly asked.
- Use `cn()` from `@/lib/utils` for every classname — never raw template strings.
- Path alias: `@/` → `src/`.

## When uncertain

- Read the rule file from `.claude/rules/<domain>.md` matching the path you're editing.
- Read the deep ref it points to if the rule defers there.
- For Next.js specifics, the local docs at `node_modules/next/dist/docs/` are authoritative.
- For design system specifics beyond the rule summary, `SystemDesign.md` is authoritative.

## What lives where (reminder)

- Rules → `.claude/rules/<domain>.md`
- Deep refs, ADRs, glossary, prompts → `.context/`
- PRDs, audits, code-review outputs → `Brain/`
- Generated artifacts → `scripts/output/`, `src/data/scholarships-enriched.json`, `content/blog/*.mdx`
