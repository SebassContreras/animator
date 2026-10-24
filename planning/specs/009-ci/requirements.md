# 009 — ci — Requirements

## What's being built

The checks a change must pass before it is accepted, run automatically on GitHub. This closes "Still to define: CI" in `planning/architecture.md`.

## Who it serves

The user and every agent that pushes to the repo.

## Requirements

- R1@1: Every push to `main` and every pull request runs `pnpm test` and `python .spectrace/trace.py check` on GitHub Actions, and the run fails if either one fails.
- R2@1: The decision is recorded as an A item in `planning/architecture.md`, with its line in `AGENTS.md`, and the "Still to define: CI" entry is removed.
- R3@1: The CI run is green on the commit that adds it.

## Out of scope

- Lienzo builds or exports in CI (A8: Lienzo is external). Visual review stays manual.
- Branch protection rules (a GitHub setting the user owns).

## Dependencies

None.

## Owner split

Agent tasks; the user checks the first run on GitHub.
