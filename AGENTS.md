# Animator

Agent skills plus a shared Node library for making Lienzo videos: one folder per video, and what each video proves to work is promoted to the shared library and the skills. For: the user and the agents that build Lienzo videos. Type: software (agent skills + Node library).

## Doc map

- `planning/product.md` — what this is, who it's for, out of scope.
- `planning/architecture.md` — project-wide decisions (A items).
- `planning/styles.md` — style detail.
- `planning/roadmap.md` — specs, order, status.
- `planning/specs/NNN-name.md` — one file per spec: goal, requirements (R), design (D), tasks, changes.
- `skills/` — the global knowledge: research, storyboard, art direction, animate.

## Stack & conventions

- Repo = `skills/` + `lib/` + `videos/<slug>/` (A6); fixed files per video (A7).
- Generators only write compact JSON; Lienzo builds and exports (A8).
- Node 24, CommonJS `.cjs`, no dependencies, pnpm (A9); tests with `node --test` (A10).
- `lib/` pieces take a palette argument, never hardcoded colours (A11); flat by default (A12).
- Promote a learning only after it worked in a real video (or, for a wrapper of a Lienzo feature, in `scene_preview`), as a spec task (A13).
- Every video goes through `lienzo-art-direction` (A14).

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

<!-- spectrace -->
## Planning

Work is planned in `planning/`:

```
planning/product.md      what this is, who it's for, stack, how to run and test, docs
planning/roadmap.md      specs in order, their status, and a free "Ideas" list
planning/specs/NNN-name.md  one file per spec
```

A spec file:

```markdown
# 003 — login

## Goal
What should work when this spec is done, and how we'll know.

## Requirements
- R1: A user signs in with email and password.

## Design
- ~~D1 (R1): Sessions live in localStorage.~~ → D2
- D2 (R1): Sessions live in an httpOnly cookie.

## Tasks
- [x] 003/T001 [agent] Login form — covers R1
- [ ] 003/T002 [agent] Session cookie middleware — covers D2
- [ ] 003/T003 [agent] Remove the localStorage session code — replaces D1
- [ ] 003/T004 [human] Create the mail provider account — covers R1
      blocked: waiting for billing approval

## Changes
- 2026-10-12: D1 → D2. Why: localStorage is readable by any script. Work: T003.
```

- `R`/`D` labels are never reused; a replaced item stays, struck through, with `→`.
- A task ends with `— covers` and the R or D items it implements, comma-separated
  (`covers R2, D3`); a cleanup task ends with `— replaces D1` (or
  `— covers D3; replaces D1`). Items of another spec are written `006/D1`, both
  after `→` and in `covers`/`replaces`.
- `[agent]`: any agent does it. `[human]`: the user does it; agents report and skip it.
- `## Changes` appears with the first change.
- **Docs are deliverables.** `product.md` → `## Docs` lists the docs the project keeps
  and what each describes. A doc changes inside the task whose work it describes, so
  `git blame` on any doc line leads to a commit, its `Spec:` and the decision behind it.
- A task whose text starts with `Review:` is closed only with an indented
  `reviewed: <files read> — found <what>` line under it. Anything it finds becomes a
  new task placed before it.
- Roadmap table: `| ID | Spec | Status | Depends on |`. `Spec` is the name after
  `NNN-`; `Depends on` is `—` or spec IDs separated by commas. `Status` (`todo`,
  `in progress`, `done`) is written by the git hook from the `[agent]` checkboxes —
  never by hand.

## Working on tasks

Git hooks in `.githooks/` keep this honest: they write the roadmap `Status`, refuse a
commit whose `Spec:` task isn't ticked or that ticks an `[agent]` task without any work
outside `planning/`, and refuse a ticked `Review:` task without its `reviewed:` note.
Never bypass them (`--no-verify`); when one refuses, fix what it says.

1. `git pull` and `git status`. If `git config core.hooksPath` isn't `.githooks`, run
   `git config core.hooksPath .githooks`; if `.githooks/` itself is missing, tell the
   user to run the `spectrace-plan` skill, which reinstalls it. Uncommitted changes in
   `planning/`,
   `AGENTS.md`, `.githooks/` or `.gitattributes` (fresh specs, a spectrace install) →
   commit them first as `docs(planning): <what>`. Leave other untracked files
   alone. Open `planning/roadmap.md` and take the first `[ ]` `[agent]` task of the
   first spec not `done` whose dependencies are done (or the task you were asked for).
2. Read the spec. Do only that task, then verify it: run the project's tests, or run
   the thing itself when there are no tests yet.
3. **Close it with one commit**: the change, the task's `[x]`, and a trailer. Stage
   the files you touched by name, never `git add -A`.

   ```
   feat(login): session cookie middleware

   Spec: 003/T002
   ```

   The `Spec:` line goes in the message's last paragraph, together with any other
   trailer (`Co-Authored-By:`…) and no blank line between them — git only reads that
   paragraph as trailers. A change that belongs to no spec on purpose (a typo, a
   chore) carries `Spec: none` instead.

   Two small tasks that only make sense together (a function and its test) may share a
   commit with one `Spec:` line each. A task is closed only when that commit exists —
   never leave a ticked box uncommitted or a commit without its trailer.
4. **A `Review:` task** needs eyes that didn't write the code: hand it to a fresh
   agent (a subagent given only the task text and the spec) when your harness can;
   otherwise do it yourself and write `reviewed (self):`. Read the files, don't skim.
5. Stuck: add `blocked: <reason>` under the task, commit it, tell the user, move on.
6. **A convention or decision in the way** — or two items of a spec that contradict
   each other: these files describe the current state, not laws. Don't work around one
   and don't pick a side silently. Propose the simplest change to the user (the
   `spectrace-change` skill applies it). If the user isn't there to answer, mark the
   task `blocked: conflicts D2: <why>; propose: <change>`, commit, and move on.
7. **A new idea or a bug found mid-task**: add a line to the roadmap's `## Ideas` (or
   a task to the right spec) and keep going. Nothing is out of scope; it's just later.

What a spec built: `git log --grep "Spec: 003/" --stat`.
<!-- /spectrace -->
