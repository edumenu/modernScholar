---
name: implement-prd
description: Implement a PRD (Product Requirements Document) from Brain/PRDs/. Triggers when the user wants to start building, coding, or executing a feature that has a PRD or plan written. Use when the user says any of: "implement the PRD", "build the feature", "execute the plan", "go ahead and build it", "start implementing", "the PRD is ready", "the PRD is approved", "implement the module", "build from the PRD", "time to implement", "go ahead and implement", or any variation referencing implementing, building, executing, coding, or constructing a feature from a PRD, plan, or spec in Brain/PRDs/. Also triggers when the user mentions a specific PRD file path or references a PRD by name and asks you to build/implement/execute it.
---

This skill implements a PRD from `Brain/PRDs/` via a Ralph-style loop: each module is decomposed into atomic tasks, then a fresh sub-agent executes one task per iteration, validating + appending progress between runs.

## Companion files (sibling to this SKILL.md)

- `tasks-schema.json` — JSON Schema for `{module}-tasks.json`.
- `decompose-prompt.md` — rules for breaking a module PRD into tasks.json (used in Step 3).
- `loop-prompt.md` — single-iteration prompt the loop re-runs (used in Step 4).

## Communication Mode

Activate the `caveman:caveman` skill (full level) for all user-facing communication during this skill. Drop articles, filler, pleasantries, and hedging. Fragments OK. Keep technical substance exact. Code, commits, PRs, verification reports, sub-agent briefs, and security warnings stay in normal prose. Revert on "stop caveman" or "normal mode".

## Workflow

### Step 1: Find the PRD

- Look in `Brain/PRDs/` for the most recent PRD file (or the one specified by the user).
- Convention: `Brain/PRDs/<MM_DD_YYYY>/<featureName>/<feature-name>/<feature-name>.md`.
- If the PRD is a directory with a `<feature>-overview.md` plus `<feature>-<part>.md` files, treat each part file as an independent module.
- Read the overview + every module file thoroughly before proceeding.

### Step 2: Git context

Ask the user: worktree, new branch, or existing branch?

- **Worktree**: Create from current base branch. Path: `../modern-scholar-<feature-name>`. Branch: `feature/<feature-name>`.
- **New branch**: Same naming, no worktree.
- **Existing branch**: Work where the user currently is.

Branch types: `feature/` — new functionality, `fix/` — bug fixes, `chore/` — maintenance/config/deps, `refactor/` — code restructuring, `hotfix/` — urgent production fixes.

### Step 3: Decompose modules into `tasks.json` (Ralph step)

For each unimplemented module file in the PRD directory:

1. Read `decompose-prompt.md` (sibling file) for the decomposition rules.
2. Produce `{prd-dir}/{module}-tasks.json` matching `tasks-schema.json`.
3. Validate the JSON conforms to the schema (mental check; field names, enum values, ≤5 files per task, ≥1 acceptance bullet per task).
4. Print a summary table to the user: `id | title | files | acceptance count`.
5. **Stop and ask the user to review/edit the `tasks.json` before the loop runs.** This mirrors the review pause in `write-a-prd`.

If multiple modules: decompose each into its own tasks.json. Loop runs them in module order (Module 1 fully complete before Module 2 starts) unless the user overrides.

### Step 4: Run the Ralph loop

Once the user approves `tasks.json`:

1. Create `{prd-dir}/{module}-progress.txt` with header:
   ```
   # Ralph Progress — <module>
   Started: <ISO timestamp>
   MAX_ITER=<tasks.length * 3>
   ---
   ```
   The `MAX_ITER` line is the global iteration cap. Loop reads it in Step 0 and halts if exceeded (protects against decomposition errors or runaway retry cascades).
2. Tell the user:
   > Starting Ralph loop for module `<module>`. Each iteration runs ONE task in a fresh sub-agent. Say "stop loop" to halt at any time. Progress streams to `{module}-progress.txt`.
3. Invoke the `loop` skill in dynamic-pacing mode (no interval). Pass the `loop-prompt.md` content as the per-iteration prompt, with the three state paths injected:
   - `TASKS_JSON` = `{prd-dir}/{module}-tasks.json`
   - `PROGRESS_TXT` = `{prd-dir}/{module}-progress.txt`
   - `MODULE_PRD` = `{prd-dir}/{module}.md`
4. The loop is responsible for: pick task → spawn sub-agent → run validation gates → flip `passes` or increment `attempts` → append to `progress.txt` → schedule next iteration.
5. The loop exits naturally when:
   - All tasks `passes:true` → write `ALL TASKS COMPLETE` to progress.txt and proceed to Step 5.
   - Any task hits `attempts >= 3` → write `HALT` to progress.txt, return to user with the failing task's error excerpt and ask how to proceed (override, edit task, skip).

Cross-module: when one module completes, ask the user before starting the next module's loop. Don't auto-chain modules — keeps a human checkpoint between major chunks.

### Step 5: Verify

After all loops finish (or the user accepts a partial halt):

- Run end-of-loop quality gates that were too expensive per-task:
  - `npm run build` — full Next.js production build.
  - `npm run lint` — full project lint sweep.
  - Existing test suites if PRD's "Testing Decisions" section mentions them (`npx vitest run`).
- Re-read modified files via `git diff` to spot anything the per-task lint/typecheck missed (cross-file regressions, dead imports, etc.).
- If the changes involve UI, open Chrome and smoke test the relevant pages: golden path, edge cases, dark/light mode if applicable.

### Step 6: Write Verification Report

Create `{prd-dir}/{module}-verification.md` per module. Source data:

- **Changes Made** table: `git diff --stat` for files touched while this module's loop was running.
- **Verification Checklist**: every task's `acceptance` bullets, checked if `passes:true`, unchecked + annotated with the failure note if not.
- **Issues Found**: any tasks left `passes:false`, plus end-of-loop build/test failures.
- **Notes**: highlights from `{module}-progress.txt` (decisions, gotchas, follow-ups).

Template:

```markdown
# Verification Report: <PRD Title — Module N>

**PRD:** <link to module PRD file>
**Tasks file:** <link to {module}-tasks.json>
**Progress log:** <link to {module}-progress.txt>
**Date:** <today's date>
**Status:** Complete | Partial | Blocked

## Changes Made

| File         | Change Summary   |
| ------------ | ---------------- |
| path/to/file | What was changed |

## Verification Checklist

- [x] <acceptance bullet> — T01 passed
- [ ] <acceptance bullet> — T07 failed: <one-line error>

## Issues Found

Any tasks left passes:false, plus end-of-loop failures. Empty if none.

## Notes

Decisions/gotchas surfaced during the loop (sourced from progress.txt highlights).
```

If verification reveals a problem, add a fix-up task to `tasks.json` (next available id), set `passes:false`, and rerun the loop for that one task. Do NOT mark anything Complete that isn't actually passing.

### Important

- **DO NOT commit code unless the user explicitly asks.** The loop and sub-agents stage-only. Code stays uncommitted on the branch until the user reviews the full diff.
- Respect "Out of Scope" sections strictly.
- If a sub-agent reports it needs files outside the task's `files` list, halt and ask — never auto-expand scope.
- All implementation goes through specialized sub-agents (`frontend-engineer` by default) — this skill orchestrates, it doesn't edit code itself.
