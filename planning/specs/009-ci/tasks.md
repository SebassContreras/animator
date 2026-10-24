# 009 — ci — Tasks

- [x] T001 [agent] [status:done] Add `.github/workflows/ci.yml`: push to `main` and pull requests, `contents: read`, checkout, pnpm/action-setup, setup-node 24, setup-python 3.x, `pnpm test`, `python .spectrace/trace.py check`; pin each action to the current major checked on its releases page
      covers: D1@1, D2@1, R1@1, A9@1, A10@1
      changes: .github/workflows/ci.yml (+25 -0)
- [x] T002 [agent] [status:done] Append A16 (CI on GitHub Actions; a change is accepted only when `pnpm test` and `trace check` pass) to `planning/architecture.md`, add its line to `AGENTS.md`, remove "Still to define: CI"
      covers: D3@1, R2@1
      changes: AGENTS.md (+1 -0)
- [x] T003 [agent] [status:done] Push and watch the first run with `gh run watch`; the task closes only when the run is green
      covers: D4@1, R3@1
      changes: none
- [ ] T004 [human] [status:todo] Open the Actions tab on GitHub and confirm the first CI run is green
      covers: R3@1
