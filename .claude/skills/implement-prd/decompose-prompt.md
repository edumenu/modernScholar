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
5. **Acceptance copy-down.** For each task, copy 1–3 bullets verbatim from the module PRD's User Stories or Implementation Decisions sections that this specific task satisfies. Don't invent acceptance — if no PRD bullet applies, the task is probably scaffolding and should be merged into the next real task.
6. **Validation gates.** Default: `["typecheck", "lint:touched"]`. Add `test:targeted` only if the PRD lists test files for the task. Never add `build` per-task (too slow); reserve `build` for end-of-loop.
7. **Agent routing.** Set top-level `agent` to whichever sub-agent owns most of the work — usually `frontend-engineer` for this project. Per-task `agent` overrides only when a single task crosses the boundary (e.g. `ux-design-expert` for a pure design-decision task, `general-purpose` for a repo-wide refactor).
8. **No commit tasks.** Never include "commit changes" or "open PR" as a task. The loop honors the no-commit rule.
9. **No verification-only tasks.** Verification is Step 5/6 of the orchestrator, not a task. Don't create T0X "verify everything works".

## Task description content

The `description` field must be self-contained — a fresh sub-agent reading ONLY the task object and the PRD module file should be able to execute. Include:

- Concrete change ("Add `seatLimit?: number` prop to `ScholarshipCard` and pass through from `ScholarshipList`").
- Any non-obvious decision the PRD made ("Use `useTransition` for filter updates because the list is large — see PRD §Implementation Decisions").
- Pointer to the PRD section if the agent needs more context ("See PRD §Implementation Decisions / Filter UX").

DO NOT include:

- Code snippets longer than 5 lines (they rot; let the agent read the PRD).
- Acceptance criteria (those go in `acceptance`).
- Boilerplate ("be careful", "follow best practices") — sub-agents already have CLAUDE.md.

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
