# Animator

Agent skills plus a shared Node library for making Lienzo videos: one folder per video, and what each video proves to work is promoted to the shared library and the skills. For: the user and the agents that build Lienzo videos. Type: software (agent skills + Node library).

## Doc map

- `planning/product.md` — what this is, who it's for, out of scope.
- `planning/architecture.md` — project-wide decisions (A items).
- `planning/styles.md` — style detail.
- `planning/roadmap.md` — specs, order, status.
- `planning/specs/NNN-name/` — requirements (R), design (D), tasks, changes.
- `.spectrace/format.md` — how all of the above is written.
- `skills/` — the global knowledge: research, storyboard, art direction, animate.

## Stack & conventions

- Repo = `skills/` + `lib/` + `videos/<slug>/` (A6); fixed files per video (A7).
- Generators only write compact JSON; Lienzo builds and exports (A8).
- Node 24, CommonJS `.cjs`, no dependencies, pnpm (A9); tests with `node --test` (A10).
- `lib/` pieces take a palette argument, never hardcoded colours (A11); flat by default (A12).
- Promote a learning only after it worked in a real video, as a traced task (A13).
- Every video goes through `lienzo-art-direction` (A14).
- CI (GitHub Actions) runs `pnpm test` and `trace check` on every push to `main` and every PR; a change is accepted only when both pass (A16).

## Style

- **Hard rule:** English in every file and every on-screen text; Spanish only in chat with the user (A15).
- Defaults in `planning/styles.md`.

## Rules for agents

- **KISS / YAGNI — No Over-Engineering**: Proportionality; start simple and direct; abstract only for 2+ uses/vendors or isolation for testing.
- **SRP / Separation of Concerns**: One responsibility per file/module/class; split multi-concern units.
- **DRY via Composition, not Inheritance**: Extract shared logic into injectable helpers/services; avoid deep inheritance.
- **Service Layer + Anti-Corruption / Dependency Inversion**: Wrap external libraries/APIs in adapter interfaces; business logic depends on interfaces, not vendors.
- **Small Interfaces & Pure Functions**: When in doubt, prefer small interfaces, pure functions, and injected testable dependencies.
- **Testing — Behavior, not Coverage**: Test observable behavior and explicit failure modes; regression test before every bug fix; never weaken tests to pass code.
- **Testing Hygiene**: Strict Given-When-Then / Arrange-Act-Assert; clear behavior-stating test names; no conditionals/loops in tests; mock boundary dependencies only.
- **Follow the Stack's Standards**: Idiomatic conventions, official style guides, and codebase consistency.
- **Web Research for Verification**: Ground non-trivial choices, APIs, libraries, and code examples with official documentation and web research.
- **Trade-off Analysis (Pros & Cons) & Mitigations**: Detail pros and cons of technical decisions; explicitly specify and implement concrete solutions/mitigations for drawbacks.
- **Adhere to Architecture Guidelines**: Strictly follow the project-wide conventions recorded in planning/architecture.md.
- **Sync Before Status**: Always synchronize repository status (`git pull` and `git status`) before reporting pending tasks or answering queries like "what's next" / "¿qué sigue?".

## Testing

- narrowest (one file or module): `node --test tests/<path>.test.cjs`
- affected only: none (`node --test` has no affected mode)
- full suite: `pnpm test` (runs `node --test "tests/**/*.test.cjs"`; a bare folder argument fails on Node 24)
- verification: unit tests only; visual quality is checked by eye on previews with the `lienzo-art-direction` review checklist.

Hard rules:
- **Run**: a task runs only the narrowest command covering the files it touched. The full suite runs only at session end or when a shared module (config, core, public interfaces) changed.
- **Create**: tests are minimal and proportional to the requirements, at the lowest level that proves each R (unit before integration). e2e and smoke tests only if the `verification` answer asks for them.
- **Skip**: do not test code without logic (wrappers, config, getters) nor a vendor's own behavior.
- **Tripwire**: if a spec's tests exceed three times its R items, stop and justify it in the task's report. It is a tripwire, not a cap.

<!-- spectrace:protocol -->
## Working on tasks

Specs live in `planning/`; how they are written is in `.spectrace/format.md`. Run the
trace with `python3` (`python` on Windows).

When executing tasks (even across multiple specs), loop steps 1–5 for each task:
1. Synchronize with origin (`git pull` and `git status`) before checking status or answering what's next. Then `python3 .spectrace/trace.py status` — pick the `next` task, or the one you were asked for. Skip `[human]` tasks; tell the user they are theirs.
2. `python3 .spectrace/trace.py start NNN/TNNN` — before editing anything. If it lists files changed outside any task, ask the user whether to `--adopt` or `--ignore` them. Never edit files without an open task.
3. Read the spec's `requirements.md` and `design.md` (or the items printed by `start`); do only that task, following `planning/architecture.md`. To find code, `python3 .spectrace/trace.py locate "<words>"`; before editing code you did not write, `python3 .spectrace/trace.py why <path[::symbol]>` shows the decisions behind it.
4. Verify it against the task text and the R items it covers. Run the narrowest test command from `AGENTS.md` "Testing" for the files the task changed; run the full suite only if the task touched a shared module (config, core, public interfaces), or at session end.
5. `python3 .spectrace/trace.py done NNN/TNNN` — records exactly what changed. Stuck? `block NNN/TNNN "reason"`. Always close the open task before moving to the next task or next spec.
6. Before saying you're finished with the session: `python3 .spectrace/trace.py check` must exit 0 (run once at the end of the session, not after every individual task).

**When a decision is in the way**, do not work around it. Run
`block NNN/TNNN "conflicts <ref>: <why>"` (for example `conflicts 002/D3: needs two stores`),
propose the simplest direct change to that item, and let the user keep, edit or retire it
(the `spectrace-change` skill). Scope filter: what the MVP needs goes in, by the simplest
route; what it does not need is postponed without debate.

Never edit by hand: a task's status or `changes:` line, the roadmap's `Status`/`Stage`
(the trace owns them), or the meaning of an R, D or A item (the `spectrace-change` skill does it,
so the history and the trace stay right). One commit per task is welcome but optional;
if you commit, add a `Spec: NNN/TNNN` trailer.
<!-- /spectrace:protocol -->
