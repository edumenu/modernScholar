# Ralph Loop — single iteration

Reusable per-iteration prompt invoked by `implement-prd` Step 4 via the `loop` skill (dynamic-pacing). Each invocation = ONE task. Loop chains itself via `ScheduleWakeup` until all tasks `passes:true` or halt condition hit.

## State files (paths injected by the orchestrator)

- `TASKS_JSON` — `{prd-dir}/{module}-tasks.json`
- `PROGRESS_TXT` — `{prd-dir}/{module}-progress.txt`
- `MODULE_PRD` — `{prd-dir}/{module}.md`

## Iteration steps

### 0. Check global iteration cap

Read header line from `PROGRESS_TXT` of form `MAX_ITER=<N>` (orchestrator writes this in Step 4 = `tasks.length * 3`). Count existing iteration log entries (lines matching `^\[\d{4}-\d{2}-\d{2}`). If count `>= N`:

- Append `HALT — global iteration cap (<N>) reached. Possible decomposition issue or runaway retries. Awaiting user.` to `PROGRESS_TXT`.
- Do NOT call `ScheduleWakeup`. Return to orchestrator with halt status.

### 1. Pick next task

Read `TASKS_JSON`. Select the task where:

- `passes == false`
- All `depends_on` ids reference tasks where `passes == true`
- Lowest `id` among eligible candidates

If none exist → write `ALL TASKS COMPLETE` to `PROGRESS_TXT`, do NOT call `ScheduleWakeup`, return to orchestrator.

### 2. Load context

Read the last ~50 lines of `PROGRESS_TXT`. This carries forward decisions, gotchas, and prior failures across fresh contexts. Do NOT re-explore the codebase — that's what progress.txt exists to prevent.

### 3. Spawn sub-agent

Use `Agent` tool. `subagent_type` = task-level `agent` field if present, else module-level `agent` from `TASKS_JSON`.

Brief format (self-contained — sub-agent has no conversation memory):

```
You are implementing ONE task from a PRD module under the Ralph loop.

PRD module: <MODULE_PRD>
Task ID: <id>
Title: <title>
Description: <description>
Files you may create/modify (DO NOT touch others): <files>
Acceptance you must satisfy: <acceptance bullets>

Recent progress notes (decisions/gotchas from prior tasks):
<last 50 lines of PROGRESS_TXT>

Hard rules:
- Do NOT commit code. Do NOT stage files. Do NOT push.
- Stay inside the `files` list. If you discover you need another file, STOP and report — don't expand scope.
- Follow CLAUDE.md conventions: Next.js 16 App Router (read node_modules/next/dist/docs/ before writing Next-specific code per AGENTS.md), TailwindCSS v4 with OKLCH tokens, Motion for declarative animations, Base UI for primitives, Noto Serif (headings) + Poppins (body) typography.
- Glassmorphism only on Z-2+ floating elements (sticky nav, modals, dropdowns, tooltips) — never on cards/forms/sidebars per the SystemDesign.md rules.
- Match existing patterns (see `src/components/ui/` for primitives, `src/components/<page>/` for page sections).
- Report back: 1-line summary of what you changed, and any decision/gotcha worth carrying forward in progress.txt.
```

### 4. Run validation gates

For each entry in task `validation`:

- `typecheck` → `npx tsc --noEmit`
- `lint:touched` → `npx eslint <files from task>` (only the files listed in the task's `files` array)
- `test:targeted` → `npx vitest run <test paths>` — run only tests whose paths are in the task's `files` array, or co-located `*.test.ts` / `*.test.tsx` files for those paths
- `build` → reserved for end-of-loop; should NOT appear per-task

Capture stdout+stderr for each gate. ALL must exit 0.

### 5. On all gates pass

- Use `Edit` tool to flip the task's `passes` field from `false` to `true` in `TASKS_JSON`. (Edit the exact `"passes": false` line for that task — match enough surrounding context, e.g. the task's `id` line above it, to be unique.)
- Append one line to `PROGRESS_TXT`:
  ```
  [YYYY-MM-DD HH:MM] T<id> PASS — <one-line summary from sub-agent>. Files: <comma-separated>. Notes: <if sub-agent flagged anything>.
  ```
- Call `ScheduleWakeup` with `delaySeconds: 60`, `prompt: <<autonomous-loop-dynamic>>`, `reason: "next Ralph task"`.

### 6. On any gate fail

- Increment task `attempts` (init to 0 in schema; +1 each failure). Use `Edit` tool to update the value in `TASKS_JSON`.
- Append to `PROGRESS_TXT`:
  ```
  [YYYY-MM-DD HH:MM] T<id> FAIL (attempt N/3) — <gate that failed>. Error excerpt: <last 5 lines of stderr>.
  ```
- If `attempts >= 3`:
  - Append `HALT — task T<id> exhausted retries. Awaiting user intervention.` to `PROGRESS_TXT`.
  - Do NOT call `ScheduleWakeup`. Return to orchestrator with halt status so it can ask the user.
- Else: call `ScheduleWakeup` to retry — same task picks up next iteration because `passes` is still `false`.

### 7. Constraints

- Iteration runs in fresh context. Only persistent state: git, `TASKS_JSON`, `PROGRESS_TXT`, the PRD files. Never assume any in-memory state survives.
- Never edit any file outside the current task's `files` list (except `TASKS_JSON` and `PROGRESS_TXT`).
- Never commit. Stage-only is fine for sub-agents that need it; final commit is the user's call.
- Never expand the task list. If decomposition is wrong, halt and ask the user to re-run Step 3 of the orchestrator.
