# AGENTS.md

## HARD RULES — all agents must obey

- Artifact output ALWAYS goes to `artifacts/` folder
- NEVER write to `features/registry.yaml` — it is READ-ONLY
- State tracking goes to `state.yaml` only
- Each feature breakdown creates: `artifacts/features/<feature-slug>/`
  - `stories.md` — user stories
  - `tasks.md` — task list
  - `summary.md` — one-liner per story with acceptance criteria

## Agile workflow

Sisyphus orchestrates. Use the `agile-planning` category for all feature breakdown work.
