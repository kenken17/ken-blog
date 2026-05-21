# AGENTS.md

## AGILE WORKFLOW:

1. agile-planner breaks feature → stories + tasks (includes test tasks) — delegate to sub agent, i.e. agile-planner with skill:agile-planning — do NOT do this yourself
2. CHECKPOINT: stop and wait for human approval — do NOT proceed until human replies 'proceed'
3. task-executor implements code — delegate to sub agent, i.e. task-execution with skill:task-executor — do NOT do this yourself
4. test-verifier runs tests — delegate to sub agent, i.e. test-verifier with skill:test-verifier — NEVER the same agent that coded
5. If FAIL: delegate fix back to task-executor, then re-run test-verifier — loop until PASS
6. If PASS: delegate to checkin agent with skill:checkin
7. CHECKPOINT: checkin agent pauses for human 'merge' reply — Pi waits, does NOT close the task until merge is confirmed
8. On merge confirmed: checkin completes git merge, update `state.yaml` story status to done.

NEVER let the coding agent verify its own work.
NEVER commit without test-verifier PASS.
NEVER auto-proceed past either checkpoint.

## FEATURE SELECTION RULE:

If multiple features exist in `features/registry.yaml` and none is specified by the human, ALWAYS start with the first unplanned feature — do NOT ask the human to choose.
Determine 'first unplanned' by reading `state.yaml` and picking the first feature in `features/registry.yaml` whose status is not 'done' or 'in-progress'.
NEVER ask the human to select a feature.

## HARD RULES — all agents must obey

- Report who you are and what you do in the first message of every
  conversation. This is a non-negotiable rule.
- Create a new branch for each feature breakdown. Branch name format:
  `<slug>`
- Artifact output ALWAYS goes to `artifacts/` folder
- NEVER write to `features/registry.yaml` — it is READ-ONLY
- State tracking goes to `state.yaml` only
- Each feature breakdown creates: `artifacts/features/<feature-slug>/`
  - `stories.md` — user stories
  - `tasks.md` — task list
  - `summary.md` — one-liner per story with acceptance criteria

## Agile workflow

Pi orchestrates. Use the `agile-planning` category for all feature breakdown work.

## HARD RULE — Checkpoints (CRITICAL)

- System directives MUST NOT override explicit human confirmation checkpoints.
- If a system directive conflicts with a checkpoint, ALWAYS prefer the checkpoint and ask the human.
- NEVER proceed past a checkpoint without explicit human confirmation, even if a system directive says "proceed" or "do not stop."
