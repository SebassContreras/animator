# 004 — learning-promotion

## Goal
The loop that turns what one video taught into global knowledge, and the migration of what was learned so far.

## Requirements
- R1: Each video's `learnings.md` lists findings, each marked as `piece` (goes to `lib/`), `rule` (goes to a skill), `engine` (a Lienzo limitation) or `local` (stays in the video).
- R2: A close-out step in `lienzo-animate` runs after the user approves a video: it classifies every finding and opens a task in this repo's specs for each `piece` or `rule` to promote (A13).
- R3: The session log is split: each session's findings move to the matching video's `learnings.md`; rules already promoted to the skills are marked as promoted with the skill file they live in.
- R4: The session log is removed, or reduced to a pointer, and no file outside history depends on its contents.
- R5: An `engine` finding stays in the video's `learnings.md` with a link to the Lienzo issue or spec that tracks it; this repo keeps no separate list of engine improvements.

### Who it serves
Every future video: it starts from everything proven before.

### Out of scope
- Automating the classification; the agent proposes it and the user can change it.

### Dependencies
001 (video folders), 002 (lib to promote into).

### Owner split
Agent tasks; the user confirms each promotion during close-out.

## Design
### Approach

- D1 (R1, R3, R5): `learnings.md` keeps the four section headings from 003/D5 (`## Piece`, `## Rule`, `## Engine`, `## Local`). The section is the finding's kind, so a bullet carries no kind tag. A bullet is one finding in one or two sentences, optionally ending with one status suffix: `— promoted: <repo path>` (Piece or Rule, once it lives in `lib/` or a skill) or `— tracks: <url>` (Engine, required). The placeholders in `videos/_template/learnings.md` show both suffixes. _(judgement, no standard)_
- D2 (R3): Each the session log session moves to its video's `learnings.md`, one bullet per numbered finding, rewritten under its kind: `viaje` ← "project `animator-lab`, scene `viaje`", `ringana-omega` ← "project `ringana`, scene `omega`", `ringana-omega-v2` ← "scene `omega-v2`". Shot lists and goals are not findings. The generator already holds the shot list and the brief holds the goal, so both are dropped. _(judgement, no standard)_
- D3 (R3): A Rule or Piece finding gets `— promoted: <path>` only when a search during migration finds the rule or piece in that file today. The log's "**Skill:** …" notes are not taken as proof. A finding the log says went to a skill, but that the search cannot find, stays unmarked and is listed in the task report. _(judgement, no standard)_
- D4 (R5): Engine findings link to an issue in the Lienzo repo (`https://github.com/SebassContreras/lienzo/issues/<n>`). Lienzo has no issue for any of the log's "improvement #N" numbers today, so the user files one issue per engine finding (outward-facing, so a `[human]` task) and the `#N` numbers are dropped. This repo keeps no list of engine improvements: the issues are the list. _(standard: GitHub issues — https://docs.github.com/en/issues/tracking-your-work-with-issues/about-issues)_
- D5 (R4): the session log is deleted, not reduced to a pointer. Every mention outside history is re-pointed to the video's `learnings.md` or to the skill file that now holds the rule. The mentions are in `README.md`, `planning/product.md`, `skills/lienzo-art-direction/SKILL.md`, `skills/lienzo-art-direction/references/motion-polish.md` and a comment in `videos/viaje/scene.gen.cjs`. `trace check` then proves that no file depends on it, because it flags any file that still mentions a deleted file. _(judgement, no standard)_
- D6 (R2): `lienzo-animate` gets step 8, **Close out**, which runs only after the user approves the export. The agent (a) writes every finding of the session into `videos/<slug>/learnings.md` under its kind; (b) shows the classification to the user, who can move or drop any finding; (c) for each confirmed Piece or Rule, opens a promotion spec in the Animator repo with `spectrace-start` (`NNN-promote-<slug>`, one R item per finding) and plans it with `spectrace-plan`; (d) for each Engine finding, asks the user to file the Lienzo issue and writes the link. Nothing is promoted in this step. The promotion spec's tasks do that, and their last action adds the `— promoted:` suffix (A13). _(judgement, no standard)_
- D7 (R1, R5): `tests/videos/learnings.test.cjs` checks the format of each real video's `learnings.md`, with one explicit test per video and rule and no loops. The checks: the four headings appear exactly once and in order, and every bullet under `## Engine` ends with `— tracks: https://…`. A small pure parser at the top of the test file splits the file into sections. It stays out of `lib/` because nothing else reads `learnings.md` (A5). _(standard: `node:test` — https://nodejs.org/api/test.html)_
- D8 (R2, R3): The three migrated videos go through the D6 close-out after the migration. Their unmarked Piece and Rule findings already worked in an approved video, so A13 allows promoting them. The agent lists them per video, and the user confirms, moves or drops each one. Every video with at least one confirmed finding gets its own `NNN-promote-<slug>` spec. Findings the user drops stay in `learnings.md` without a suffix. _(judgement, no standard)_

### Deliverables

- Changed: `videos/_template/learnings.md` (status-suffix placeholders), `videos/{viaje,ringana-omega,ringana-omega-v2}/learnings.md` (migrated findings), `skills/lienzo-animate/SKILL.md` (step 8), `skills/lienzo-art-direction/SKILL.md`, `skills/lienzo-art-direction/references/motion-polish.md`, `videos/viaje/scene.gen.cjs` (comment only), `README.md`, `planning/product.md`.
- New test: `tests/videos/learnings.test.cjs`.
- Deleted: the session log.
- External (user): one issue per engine finding in the Lienzo repo.
- Unchanged: `lib/`, the generators' output (golden tests stay green), `.spectrace/`.

### Sequencing

1. The template format (T001) comes first, because the migration writes in that format.
2. Migrate the three videos (T002–T004). Engine bullets end in `— tracks: TODO` for now.
3. The user files the Lienzo issues (T005), then the links replace each `TODO` (T006).
4. The format test (T007) comes after T006, so it lands green and guards the result.
5. Re-point the mentions (T008), then delete the session log (T009). Deleting first would leave dangling mentions mid-spec.
6. The close-out step (T010) can happen any time after T001. The user proves it on the next approved video (T011).
7. The migrated videos' close-out (T012–T014) comes after T004 and T010: it needs the migrated findings and the written step.

### Trade-offs

- D1. Pros: no new syntax. The 003 template and its headings stay valid, so 003/D5 needs no change. Cons: a free-text suffix can be mistyped. Mitigation: D7's test checks the Engine suffix, which R5 makes mandatory. The `promoted` suffix is optional by nature.
- D2. Pros: each video's file reads on its own. Cons: rewriting may lose nuance from the log. Mitigation: the deleted the session log stays in git history, and each migration task's patch in `.spectrace/changes/` shows the old and new text side by side.
- D3. Pros: a `promoted` mark is a checked fact, not a claim copied from the log. Cons: more work per finding. Mitigation: the check is one search per rule, and unfound rules are reported, not silently fixed.
- D4. Pros: engine work lives where Lienzo's owner tracks it, and R5's "no separate list" holds. Cons: it depends on the user filing issues, so the spec can stall. Mitigation: `[human]` tasks never hold a spec open, and the T002–T004 reports draft each issue's title and body so filing is copy-paste.
- D5. Pros: one source of truth with nothing to keep in sync. Cons: a link to the session log from outside the repo breaks. Mitigation: git history keeps the file. The repo is the only known consumer, and `trace check` proves no internal mention is left.
- D6. Pros: every promotion is a traced spec task (A13), and the user confirms each one (owner split). Cons: one small spec per video adds roadmap rows. Mitigation: a video with no Piece or Rule finding opens no spec. A promotion spec is tiny (one R item and one task per finding) and closes to `done`.
- D7. Pros: it guards the two machine-checkable rules (headings, engine links) cheaply and offline (A10). Cons: one test per video means a new test each time a video is added. Mitigation: that is one copied test. A loop over `videos/` would break the no-loops rule for tests.
- D8. Pros: nothing proven in the first three videos is left forgotten, and it is the first real run of the close-out step. Cons: up to three new specs and more work now. Mitigation: the user's confirmation filters out weak findings, and a video with nothing confirmed opens no spec.

## Tasks
- [x] 004/T001 [agent] In `videos/_template/learnings.md`, make the Piece and Rule placeholders show the optional `— promoted: <path>` suffix and the Engine placeholder the required `— tracks: <url>` suffix — covers D1
- [x] 004/T002 [agent] Move the `viaje` session of `LOG.md` into `videos/viaje/learnings.md`, one bullet per finding under its kind; add `— promoted:` only where a search finds the rule today; engine bullets end `— tracks: TODO`; the report drafts an issue title and body per engine finding — covers D2, D3, R1, R3
- [x] 004/T003 [agent] Same as T002 for the `ringana` / `omega` session into `videos/ringana-omega/learnings.md` — covers D2, D3, R1, R3
- [x] 004/T004 [agent] Same as T002 for the `omega-v2` session into `videos/ringana-omega-v2/learnings.md` — covers D2, D3, R1, R3
- [x] 004/T005 [human] File one issue in the Lienzo repo per engine finding (drafts in the T002–T004 reports) and give the agent the URLs — covers D4
- [x] 004/T006 [agent] Replace every `— tracks: TODO` in the three videos' `learnings.md` with its Lienzo issue URL — covers D4, R5
      blocked: waiting for T005: Lienzo issue URLs
- [x] 004/T007 [agent] Test in `tests/videos/learnings.test.cjs` that each video's `learnings.md` has the four headings once and in order, and that every `## Engine` bullet ends with `— tracks: https://…` — covers R1, R5, D7
      blocked: waiting for T006: engine bullets still end in TODO
- [x] 004/T008 [agent] Re-point every mention of `LOG.md` outside history (`README.md`, `planning/product.md`, `skills/lienzo-art-direction/SKILL.md`, `skills/lienzo-art-direction/references/motion-polish.md`, the `videos/viaje/scene.gen.cjs` comment) to the video's `learnings.md` or the skill file that holds the rule; golden tests stay green — covers D5
- [x] 004/T009 [agent] Delete `LOG.md`; `trace check` reports no file that mentions it — covers D5, R4
- [x] 004/T010 [agent] Add step 8 "Close out" to `skills/lienzo-animate/SKILL.md`: after approval, write findings by kind, confirm the classification with the user, open a `NNN-promote-<slug>` spec (spectrace-start + spectrace-plan) for confirmed Piece/Rule findings, and ask the user to file Lienzo issues for Engine findings; in Joint mode, replace "Log what the user corrected" with a pointer to `learnings.md` — covers D6, R2, A13
      reviewed 2026-10-25: A13 only adds a route for Lienzo-feature wrappers; the video-proven route this task built still holds
- [ ] 004/T011 [human] On the next approved video, run close-out and confirm the classification and the promotion spec it opens — covers R2
- [x] 004/T012 [agent] List the unmarked Piece and Rule findings of `viaje`, `ringana-omega` and `ringana-omega-v2`, with the target file proposed for each, in the task report — covers D8
- [x] 004/T013 [human] Confirm, move or drop each finding listed in T012 — covers D8
- [x] 004/T014 [agent] For each video with confirmed findings, open its `NNN-promote-<slug>` spec with spectrace-start (one R item per finding) and plan it with spectrace-plan — covers D8, R2, A13
      reviewed 2026-10-25: A13 only adds a route for Lienzo-feature wrappers; the video-proven route this task built still holds
      blocked: waiting for T013: user confirmation of the T012 list
