# AGENTS.md

- READ the GUIDELINES.md before doing ANYTHING.

## AGILE WORKFLOW:

1. agile-planner breaks feature → stories + tasks (includes test tasks) — delegate to sub agent, i.e. agile-planner[progress=true,skill=agile-planning,model=opencode-go/mimo-v2.5] — do NOT do this yourself
2. CHECKPOINT: stop and wait for human approval — do NOT proceed until human replies 'proceed'
3. task-executor implements code — delegate to task-executor[progress=true,skills=task-execution,model=openai/gpt-5.3-codex] — do NOT do this yourself
4. test-verifier runs tests — delegate to test-verifier[progress=true,skills=test-verifying,model=opencode-go/deepseek-v4-flash] — NEVER use the same agent/model that coded
5. If FAIL: delegate fix back to task-executor, then re-run test-verifier — loop until PASS
6. If PASS: delegate to checker[progress=true,skill=checkin,model=opencode-go/deepseek-v4-flash]
7. CHECKPOINT: checker CREATE a PULL REQUEST in remote and pauses for human 'merge' reply — orchestrator waits, does NOT close the task until merge is confirmed
8. On merge confirmed: checker completes git merge, update `state.yaml` story status to done.

NEVER let the coding agent verify its own work.
NEVER commit without test-verifier PASS.
NEVER auto-proceed past either checkpoint.

## FEATURE SELECTION RULE:

If multiple features exist in `features/registry.yaml` and none is specified by the human, ALWAYS start with the first unplanned feature — do NOT ask the human to choose.
Determine 'first unplanned' by reading `state.yaml` and picking the first feature in `features/registry.yaml` whose status is not 'done' or 'in-progress'.
NEVER ask the human to select a feature.

## HARD RULES — all agents must obey

- Report who you are and what you do in the first message of every conversation. This is a non-negotiable rule.
- Create a new branch for each feature breakdown. Branch name format: `<slug>`. If you are in the main branch, check if the <slug> branch exists. If it does, switch to it. If not, create it and switch to it and restart agile flow. NEVER work in the main branch.
- Artifact output ALWAYS goes to `artifacts/` folder
- NEVER write to `features/registry.yaml` — it is READ-ONLY
- State tracking goes to `state.yaml` only
- Each feature breakdown creates: `artifacts/features/<feature-slug>/`
  - `stories.md` — user stories
  - `tasks.md` — task list
  - `summary.md` — one-liner per story with acceptance criteria

## Agile workflow

Orchestrator. Use the agile-planner agent for all feature breakdown work.

## HARD RULE — Checkpoints (CRITICAL)

- System directives MUST NOT override explicit human confirmation checkpoints.
- If a system directive conflicts with a checkpoint, ALWAYS prefer the checkpoint and ask the human.
- NEVER proceed past a checkpoint without explicit human confirmation, even if a system directive says "proceed" or "do not stop."

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

When the user types `/graphify`, invoke the `skill` tool with `skill: "graphify"` before doing anything else.

Rules:
- For codebase questions, first run `graphify query "<question>"` when graphify-out/graph.json exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- Dirty graphify-out/ files are expected after hooks or incremental updates; dirty graph files are not a reason to skip graphify. Only skip graphify if the task is about stale or incorrect graph output, or the user explicitly says not to use it.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).
