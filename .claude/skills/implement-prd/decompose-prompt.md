# Decompose a PRD module into `{module}-tasks.json`

Used by `implement-prd` Step 3. Reads one PRD module markdown file and produces a Ralph-style task list at `{prd-dir}/{module}-tasks.json` validated against `tasks-schema.json` (sibling file).

## Inputs

- `MODULE_PRD_PATH` — repo-relative path to the module markdown (e.g. `Brain/PRDs/05_02_2026/membership-flow/membership-flow.md`, or for multi-part PRDs a part file like `membership-flow-login.md`).

## Output

A single JSON file matching `tasks-schema.json`. Filename: same dir as the PRD module, suffix `-tasks.json` instead of `.md`.

## Decomposition rules (HARD)

1. **Atomic size.** Each task = 5–30 minutes of focused work for a fresh sub-agent. If a task feels bigger, split it.
2. **File scope cap.** Each task touches **≤5 files**. >5 means split. Files MUST be listed in the `files` array — the loop uses this to scope lint and route the agent.
3. **Single concern.** One task = one logical change (add a component, wire one route, add one prop, write one query, add a hook, register one route). Never bundle "build the feature" into a task.
4. **Dependency ordering.** Tasks ordered T01, T02, … in the order they should execute. Use `depends_on` ONLY for non-sequential prereqs (e.g. T05 depends on T02 but not T03/T04). The loop picks the lowest-id eligible task.
5. **Acceptance copy-down.** For each task, copy 1–3 bullets verbatim from the module PRD's User Stories or Implementation Decisions sections that this specific task satisfies. Each bullet ≤100 chars. Don't invent acceptance — if no PRD bullet applies, the task is probably scaffolding and should be merged into the next real task. If the task is a cascade-safe refactor (see rule #12), include "cascade-tolerant prop signature" as one acceptance bullet so the sub-agent's brief flags the pattern.
6. **Validation gates.** Default: `["typecheck", "lint:touched"]`. Add `test:targeted` only if the PRD lists test files for the task. Never add `build` per-task (too slow); reserve `build` for end-of-loop.
7. **Agent routing.** Set top-level `agent` to whichever sub-agent owns most of the work — usually `frontend-engineer` for this project. Per-task `agent` overrides only when a single task crosses the boundary (e.g. `ux-design-expert` for a pure design-decision task, `general-purpose` for a repo-wide refactor).
8. **No commit tasks.** Never include "commit changes" or "open PR" as a task. The loop honors the no-commit rule.
9. **No verification-only tasks.** Verification is Step 5/6 of the orchestrator, not a task. Don't create T0X "verify everything works".
10. **Description length cap.** `description` ≤ **600 characters**. Hard cap — if you can't fit the task in 600 chars it's not atomic; split it. The PRD is the source of truth; the description is a pointer.
11. **Batch siblings.** When N tasks differ only in input/target (per-file content migrations, parallel rename ops, multiple stories of the same shape) and the **combined** file list is ≤5, BATCH them into one task. Each cold sub-agent costs ~30–60s of orientation; batching cuts that tax. Example: instead of T16/T17/T18/T19 each migrating one MDX post, emit one task whose `files` lists all 4 MDX paths and whose `description` lists each post's title+source+author+cover mapping. Don't batch when tasks have meaningfully different validation surfaces or when one's failure would block the others' independent value.
12. **Cascade-safe shared-type refactors.** When a PRD changes a shared type used by N call sites and you decompose into per-file refactor tasks (one task per consumer), every task **before** the type-unification landing task must use **structural Pick props with new-only fields marked optional** instead of importing the new type directly. This keeps each task's project-wide typecheck green during the cascade. Mark the cascade-closing task in its description (e.g., "closes the cascade — sub-agent should also tighten upstream structural props back to direct `BlogPost` imports if cheap").

## Task description content

The `description` field is a **pointer**, not a re-implementation of the PRD. A fresh sub-agent has access to the PRD module file (path injected by the loop) — it should read the PRD for detail. Description should answer: *what action, where, and which PRD section explains why.*

Include:

- Concrete action verb ("Add", "Refactor", "Delete", "Create").
- Target — file path or component/function name.
- One-line summary of the change.
- PRD section pointer ("See PRD §Implementation Decisions / Filter UX") for non-obvious decisions.

DO NOT include:

- **Code snippets of any length.** Point to the PRD section or source file; the sub-agent reads it. Embedded code rots when the PRD is updated.
- **Line-number references** ("port from src/foo.ts lines 23–61"). Line numbers shift on every edit. Say "port the rule table from `src/foo.ts`" — the agent greps.
- **Verbatim PRD prose.** If you find yourself copying paragraphs from the PRD into the description, replace with `See PRD §<section>`.
- **Type signatures, interface bodies, or shape definitions.** These belong in the PRD; the agent reads them there.
- Acceptance criteria (those go in `acceptance`, ≤3 bullets, ≤100 chars each).
- Boilerplate ("be careful", "follow best practices") — sub-agents already have CLAUDE.md.

### Tight description (✓ — ~250 chars)

```
"Refactor src/lib/scholarship-utils.ts: delete local matchesEligibilityTags; import { matches, type Tag } from @/lib/eligibility; rename 5th param of filterAndSort to selectedTags: Tag[]; call matches(s, selectedTags) in the .filter() callback. See PRD §Filter wiring."
```

### Bloated description (✗ — 2,500+ chars, BAD)

Anything that embeds full type definitions, multi-line code blocks, line-number maps, or copies decision rationale paragraph-by-paragraph from the PRD. If your description grows past ~600 chars, the cause is almost always one of those four — strip them and point to the PRD section instead.

## Output template

```json
{
  "module": "<module-slug>",
  "prd_path": "<MODULE_PRD_PATH>",
  "agent": "frontend-engineer",
  "tasks": [
    {
      "id": "T01",
      "title": "<short imperative>",
      "description": "<self-contained instructions>",
      "files": ["<path1>", "<path2>"],
      "depends_on": [],
      "acceptance": ["<bullet copied from PRD>"],
      "validation": ["typecheck", "lint:touched"],
      "passes": false,
      "attempts": 0,
      "notes": ""
    }
  ]
}
```

## After writing

1. Validate against `tasks-schema.json` (mental check or `ajv` if available).
2. Print a summary table to the user: `id | title | files | acceptance count`.
3. **Stop and ask the user to review/edit the tasks.json** before the loop runs. Mirrors the `write-a-prd` review pause.
