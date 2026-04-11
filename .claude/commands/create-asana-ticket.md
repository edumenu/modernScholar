---
description: Create an Asana task in the Scholarship Website project
argument-hint: [task type] [short title or description]
---

Create an Asana task in the **Scholarship Website** project using the Asana MCP tools.

User input: `$ARGUMENTS`

## Steps

1. **Parse the user input.** Extract:
   - **Task type** (e.g. `Task`, `Bug`, `Feature`, `Milestone`, `Subtask`). If the user didn't specify one, ask via `AskUserQuestion` and present the common types as options.
   - **Title / name** — the short headline of the task.
   - **Description / context** — anything else the user provided.

2. **Gather missing details.** Before creating the task, use `AskUserQuestion` to fill in any of these that aren't already clear from the input. Ask only for the ones that are missing — don't re-ask what the user already gave you:
   - Name (title)
   - Description (acceptance criteria, reproduction steps for bugs, user stories for features, etc.)
   - Due date — optional
   - Assignee — optional, no default
   - Followers — optional
   - Parent task — only if the task type is `Subtask` or the user mentions a parent task
   - Which section to place the task in (e.g. To Do, In Progress, Backlog)

3. **Resolve the workspace and project.**
   - Call `mcp__plugin_asana_asana__asana_list_workspaces` to get the workspace ID.
   - Call `mcp__plugin_asana_asana__asana_typeahead_search` with `query: "Scholarship Website"` and `resource_type: "project"` to find the project GID.
   - If the project is not found, inform the user and ask for clarification.
   - Call `mcp__plugin_asana_asana__asana_get_project_sections` with the project GID to get available sections and their IDs.

4. **Format the description nicely.** Use clear sections appropriate to the task type:
   - **Bug:** `Problem`, `Steps to Reproduce`, `Expected`, `Actual`, `Environment` (only include sections you have info for).
   - **Feature / Task:** `Summary`, `Acceptance Criteria`, `Notes`.
   - **Milestone:** `Goal`, `Scope`, `Success Criteria`.
   - Keep it concise — no filler.

5. **Confirm with the user before creating.** Show a short preview: task type, name, section, due date, assignee, and the formatted description. Ask for explicit confirmation via `AskUserQuestion` ("Create this task?" / "Edit first" / "Cancel").

6. **Create the task** using `mcp__plugin_asana_asana__asana_create_task` with:
   - `project_id` from step 3
   - `name` — the task title
   - `notes` — the formatted description
   - `section_id` — from step 3 (matching the user's chosen section)
   - `resource_subtype` — map the task type: `default_task` for Task/Bug/Feature, `milestone` for Milestone
   - Any optional fields gathered in step 2 (`due_on`, `assignee`, `followers`)
   - For subtasks, use `parent` instead of `project_id`

7. **Report back.** Print the new task name, GID, and the browse URL (`https://app.asana.com/0/0/<TASK_GID>/f`).

## Rules

- Default project is **Scholarship Website** unless the user specifies another.
- Never invent acceptance criteria, reproduction steps, or due dates — ask the user instead.
- If the user provides a PRD file path or pastes PRD content, use it as the basis for the description (summarize if very long).
- If the project has custom fields, call `mcp__plugin_asana_asana__asana_get_project` with `opt_fields: "custom_fields,custom_fields.name,custom_fields.enum_options"` to discover them and ask the user about relevant ones.
- Do not add comments or change task status after creation unless the user asks.

## Example prompts for the user

- /create-asana-ticket Bug Login page throws 500 on Safari
- /create-asana-ticket Feature Add dark mode toggle to settings
- /create-asana-ticket Task Update scholarship listing page design
- /create-asana-ticket # will prompt for type + details
