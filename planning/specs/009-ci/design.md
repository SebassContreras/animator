# 009 — ci — Design

## Approach

- D1@1 (implements R1): One workflow file, `.github/workflows/ci.yml`, with one job on `ubuntu-latest`, triggered by `push` to `main` and by `pull_request`. Steps: `actions/checkout`; `pnpm/action-setup`, which reads the pnpm version from `packageManager` in `package.json` so it is not repeated; `actions/setup-node` with `node-version: 24` (A9); `actions/setup-python` with `python-version: "3.x"`; then `pnpm test` and `python .spectrace/trace.py check`. There is no install step and no cache, because the repo has no dependencies (A9). _(standard: GitHub Actions workflow syntax — https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions; pnpm in CI — https://pnpm.io/continuous-integration)_
- D2@1 (implements R1): Each action is pinned to its current major tag, checked on the action's releases page when the task runs, because web search results disagree on the latest majors. `permissions: contents: read` limits the token. _(standard: GitHub Actions security hardening — https://docs.github.com/en/actions/security-for-github-actions/security-guides/security-hardening-for-github-actions)_
- D3@1 (implements R2): A16@1 is appended to `planning/architecture.md` → Stack: "CI on GitHub Actions runs `pnpm test` and `trace check` on every push to `main` and every pull request; a change is accepted only when both pass." Its operative line goes to `AGENTS.md` → "Stack & conventions", and the "Still to define: CI" bullet is removed. _(judgement, no standard)_
- D4@1 (implements R3): No test file. The workflow has no logic of its own (AGENTS.md "Skip"), so R3 is checked on the real run with `gh run watch` after the push. _(standard: GitHub CLI — https://cli.github.com/manual/gh_run_watch)_

## Deliverables

- New: `.github/workflows/ci.yml`.
- Changed: `planning/architecture.md` (A16, CI entry removed), `AGENTS.md`.

## Sequencing

1. The workflow (T001), then the A item (T002).
2. After both: push and watch the run (T003). The user then checks it on GitHub (T004).

## Trade-offs

- D1. Pros: the smallest workflow that runs both checks, and it mirrors what an agent runs locally. Cons: the runner is Linux, while the user works on Windows (the LF/CRLF warnings show line endings differ). Mitigation: the tests already split lines with `\r?\n` and compare parsed JSON where key order or line endings could vary. A Windows runner can be added if a Windows-only failure appears (YAGNI until then).
- D2. Pros: major tags pick up fixes without edits, and the read-only token limits the damage a compromised step can do. Cons: a major tag can move, and a SHA pin is stricter. Mitigation: all four actions are first-party or official. Dependabot can pin and bump them later if the repo grows.
- D3. Pros: the rule sits where agents read conventions. Cons: one more A item to keep current. Mitigation: it names only two commands, both already in `AGENTS.md` → Testing.
- D4. Pros: no test that cannot fail. Cons: a broken workflow shows up only on GitHub. Mitigation: T003 watches the first run and does not close until it is green.
