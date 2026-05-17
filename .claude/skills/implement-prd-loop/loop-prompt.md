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

### 1. Pick next task(s)

Read `TASKS_JSON`. Select the task where:

- `passes == false`
- All `depends_on` ids reference tasks where `passes == true`
- Lowest `id` among eligible candidates

If none exist → write `ALL TASKS COMPLETE` to `PROGRESS_TXT`, do NOT call `ScheduleWakeup`, return to orchestrator.

### 1.5. Try to fan out in parallel

After picking the primary task, look for additional eligible tasks (same `passes == false` + deps-satisfied criteria) whose `files` arrays do **NOT overlap** with the primary OR with each other. Take up to **2 additional** tasks (cap at 3 total per iteration).

**Skip parallel mode entirely** when any of these is true:
- The primary task is the cascade-closing one (highest `depends_on` count in the whole tasks.json) — single-stream that for safety so its agent sees a stable filesystem.
- Any candidate has `attempts >= 1` — it's already failed once; isolate the retry to make root cause clear.
- Two candidates would write to the same directory of `__tests__/` (test files can interact via shared fixtures even when paths differ).

When in parallel mode, treat the chosen tasks as a **batch**. Steps 3–6 below apply to each task in the batch; the only batched step is `typecheck` in §4.

### 2. Load context

Read the last ~20 lines of `PROGRESS_TXT`. This carries forward decisions, gotchas, and prior failures across fresh contexts. Do NOT re-explore the codebase — that's what progress.txt exists to prevent. (Window is 20 lines because each PASS line is capped at ~200 chars in Step 5; long carry-forward lives in the task's `notes` field, not here.)

### 3. Spawn sub-agent(s)

Use `Agent` tool. `subagent_type` = task-level `agent` field if present, else module-level `agent` from `TASKS_JSON`.

**Parallel mode:** issue ALL Agent calls for the batch as multiple tool uses **in a single message**. Per the Agent tool description: "When you launch multiple agents for independent work, send them in a single message with multiple tool uses so they run concurrently." Do NOT chain them serially — that defeats the entire fan-out.

**Brief format** (self-contained — sub-agent has no conversation memory). When in parallel mode, append this line to the brief so the sub-agent knows not to grep sibling files mid-edit:

```
Sibling tasks running in parallel (do NOT read/import their files; they're being modified concurrently): [<comma-separated task ids and their files>]
```

```
You are implementing ONE task from a PRD module under the Ralph loop.

PRD module: <MODULE_PRD>
Task ID: <id>
Title: <title>
Description: <description>
Files you may create/modify (DO NOT touch others): <files>
Acceptance you must satisfy: <acceptance bullets>

Recent progress notes (decisions/gotchas from prior tasks):
<last 20 lines of PROGRESS_TXT>

Hard rules:
- The description is a pointer, not a spec. If you need code shapes, type signatures, or rationale, READ THE PRD MODULE FILE (path above) and grep the source files in your `files` list. Don't ask for more detail in the description — fetch it yourself.
- Do NOT commit code. Do NOT stage files. Do NOT push.
- Stay inside the `files` list. If you discover you need another file, STOP and report — don't expand scope.
- Follow CLAUDE.md conventions: Next.js 16 App Router (read node_modules/next/dist/docs/ before writing Next-specific code per AGENTS.md), TailwindCSS v4 with OKLCH tokens, Motion for declarative animations, Base UI for primitives, Noto Serif (headings) + Poppins (body) typography.
- Glassmorphism only on Z-2+ floating elements (sticky nav, modals, dropdowns, tooltips) — never on cards/forms/sidebars per the SystemDesign.md rules.
- Match existing patterns (see `src/components/ui/` for primitives, `src/components/<page>/` for page sections).
- Time budget: if your first approach is taking longer than ~10 minutes of tool calls, stop and pick the simplest viable alternative. Note the reason in your gotcha. (Audit found one Storybook task spent 45 min trying to render real MDX in stories before a JSX-through-the-map fallback would have worked in 3 min.)
- Report back: 1-line summary of what you changed (≤80 chars), and at most ONE gotcha worth carrying forward (≤80 chars). Anything longer goes in the task's `notes` field, not progress.txt.
```

### 4. Run validation gates

For each entry in task `validation`:

- `typecheck` → `npx tsc --noEmit`
- `lint:touched` → `npx eslint <files from task>` (only the files listed in the task's `files` array)
- `test:targeted` → `npx vitest run <test paths>` — run only tests whose paths are in the task's `files` array, or co-located `*.test.ts` / `*.test.tsx` files for those paths
- `build` → reserved for end-of-loop; should NOT appear per-task

Capture stdout+stderr for each gate. ALL must exit 0.

**Parallel mode validation:**
- `typecheck` runs **once** for the whole batch (the project-wide command is the same regardless of task count). Cheaper.
- `lint:touched` runs **once per task** with that task's scoped files only — keeps attribution clean.
- `test:targeted` runs **once per task**.
- If `typecheck` fails in a parallel batch, you can't tell which task broke it from the failure alone. Mark **every** task in the batch as `passes:false`, increment each `attempts`, and on the next iteration **disable parallel mode for at least one cycle** so the offending task surfaces in isolation.

### 5. On all gates pass

- Use `Edit` tool to flip the task's `passes` field from `false` to `true` in `TASKS_JSON`. (Edit the exact `"passes": false` line for that task — match enough surrounding context, e.g. the task's `id` line above it, to be unique.)
- If the sub-agent reported a substantive carry-forward (cross-file cascade, design decision, jsdom limitation, etc.), write it to the task's `notes` field in `TASKS_JSON` via `Edit`. The progress.txt line stays terse.
- Append **ONE LINE** (≤200 chars total) to `PROGRESS_TXT` in this exact shape:
  ```
  [YYYY-MM-DD HH:MM] T<id> PASS — <verb-phrase ≤80 chars>. Files: <comma-separated>. <one optional gotcha clause ≤80 chars>
  ```
  In **parallel mode**, append one line per task in the batch (same timestamp is fine). No multi-sentence essays. No "ORCHESTRATOR CASCADE" paragraphs. Cross-file cascades and architectural decisions go in the task's `notes` field, not here. The progress.txt is a scannable timeline; `notes` is the long-form record.
- Call `ScheduleWakeup` with `delaySeconds: 60`, `prompt: <<autonomous-loop-dynamic>>`, `reason: "next Ralph task"`. (60s is the runtime floor — the way to shrink elapsed time is fewer iterations via task batching at decomposition time AND parallel fan-out at runtime, not shorter delays here.)

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
