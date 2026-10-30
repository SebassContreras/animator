# 004 — learning-promotion

## Goal
The loop that turns what one video taught into global knowledge, and the migration of what was learned so far.

## Requirements
- R1: Each video's `learnings.md` satisfies the document structure invariant: exactly four H2 headings (`## Piece`, `## Rule`, `## Engine`, `## Local`) in fixed sequence, listing findings as unordered bullets.
- R2: A close-out step in `lienzo-animate` runs after video approval to classify session findings by kind and scaffold promotion specs for confirmed pieces and rules (source: `ARCHITECTURE.md` § Learning Promotion Seam).
- R3: Historical session log findings are partitioned and migrated into each matching video's `learnings.md`.
- R3b: Historical rules proven to already exist in `skills/` are marked as promoted with their destination path.
- R4: The session log (`LOG.md`) is permanently deleted, and no tracked file outside git history depends on or references its contents.
- R5: Every bullet under `## Engine` satisfies the tracking invariant: it links directly to the upstream Lienzo issue tracker (`https://github.com/SebassContreras/lienzo/issues/<id>`); unresolved `TODO` tokens and unlinked engine findings are invalid.

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

- D1 (R1, R3, R5): `learnings.md` enforces a deterministic document interface: exactly four H2 section headings (`## Piece`, `## Rule`, `## Engine`, `## Local`). The section determines the finding's kind, so individual bullets carry no kind tag. A bullet is one finding in one or two sentences. Supported status suffixes: optional `— promoted: <repo path>` (Piece or Rule, once it lives in `lib/` or a skill) and mandatory `— tracks: https://github.com/SebassContreras/lienzo/issues/<id>` (Engine). The placeholders in `videos/_template/learnings.md` show both suffixes. _(source: `ARCHITECTURE.md` § Structural Invariants, `PRODUCT.md` § Key Functional Capabilities)_
- D2 (R3): Each session in `LOG.md` moves to its matching video's `learnings.md`, one bullet per numbered finding rewritten under its kind: `viaje` ← "project `animator-lab`, scene `viaje`", `ringana-omega` ← "project `ringana`, scene `omega`", `ringana-omega-v2` ← "scene `omega-v2`". Shot lists and goals are omitted as they are preserved in scene generators and briefs. _(source: `PRODUCT.md` § Key Functional Capabilities)_
- D3 (R3, R3b): A Rule or Piece finding gets `— promoted: <path>` only when an automated search during migration verifies the rule or piece in that file. The log's "**Skill:** …" notes are not taken as proof. Findings asserted by the log but not verified by search remain unmarked and are reported in the task summary. _(source: `ENGINEERING.md` § KISS / YAGNI)_
- D4 (R5): Engine findings link to the upstream Lienzo repository issue tracker (`https://github.com/SebassContreras/lienzo/issues/<id>`). This anti-corruption boundary decouples local learning notes from external engine tracking without duplicating state in Animator. The user files one issue per engine finding (a `[human]` task) and legacy `#N` identifiers are retired. _(standard: GitHub issues — https://docs.github.com/en/issues/tracking-your-work-with-issues/about-issues)_
- D5 (R4): The session log (`LOG.md`) is permanently deleted. Every mention outside history is re-pointed to each video's `learnings.md` or skill file. The mentions are in `README.md`, `PRODUCT.md`, `skills/lienzo-art-direction/SKILL.md`, `skills/lienzo-art-direction/references/motion-polish.md` and a comment in `videos/viaje/scene.gen.cjs`. A full-repository search verifies that zero dangling references to `LOG.md` remain. _(source: `ENGINEERING.md` § KISS / YAGNI)_
- D6 (R2): `lienzo-animate` step 8 (**Close out**) coordinates the post-approval lifecycle in two sequential phases: (1) *Classification Phase:* writes session findings to `videos/<slug>/learnings.md` and confirms the classification with the user; (2) *Promotion Phase:* for confirmed Piece or Rule findings, scaffolds an atomic promotion spec (`NNN-promote-<slug>`, one R item per finding) using `spectrace-plan`; for Engine findings, prompts the user with pre-drafted Lienzo issue templates. Promotion specs execute independently and append the `— promoted:` suffix upon task completion. _(source: `ARCHITECTURE.md` § Learning Promotion Seam)_
- D7 (R1, R5): `tests/videos/learnings.test.cjs` validates `learnings.md` format using table-driven test parameterization across all registered video directories in `videos/`. Each test case asserts structural and tracking invariants using a clean AAA structure without conditional branching inside test bodies. A small pure parser at the top of the test file splits sections into deterministic fixtures. _(source: `TESTING.md` § Systematic Input Partitioning & Table-Driven Tests, standard: `node:test` — https://nodejs.org/api/test.html)_
- D8 (R2, R3): The migrated videos execute the D6 close-out workflow post-migration. Their unmarked Piece and Rule findings already proven in approved videos are reviewed with the user. Each video with confirmed findings receives its own `NNN-promote-<slug>` spec via `spectrace-plan`. Dropped findings remain in `learnings.md` without suffixes. _(source: `ARCHITECTURE.md` § Learning Promotion Seam)_

### Deliverables

- Changed: `videos/_template/learnings.md` (status-suffix placeholders), `videos/{viaje,ringana-omega,ringana-omega-v2}/learnings.md` (migrated findings), `skills/lienzo-animate/SKILL.md` (step 8), `skills/lienzo-art-direction/SKILL.md`, `skills/lienzo-art-direction/references/motion-polish.md`, `videos/viaje/scene.gen.cjs` (comment only), `README.md`, `PRODUCT.md`.
- New test: `tests/videos/learnings.test.cjs`.
- Deleted: the session log (`LOG.md`).
- External (user): one issue per engine finding in the Lienzo repo.
- Unchanged: `lib/`, the generators' output (golden tests stay green).

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
- D2. Pros: each video's file reads on its own. Cons: rewriting may lose nuance from the log. Mitigation: the deleted session log stays in git history, and each migration task's patch in `.spectrace/changes/` shows the old and new text side by side.
- D3. Pros: a `promoted` mark is a checked fact, not a claim copied from the log. Cons: more work per finding. Mitigation: the check is one search per rule, and unfound rules are reported, not silently fixed.
- D4. Pros: engine work lives where Lienzo's owner tracks it, and R5's "no separate list" holds. Cons: it depends on the user filing issues, so the spec can stall. Mitigation: `[human]` tasks never hold a spec open, and the T002–T004 reports draft each issue's title and body so filing is copy-paste.
- D5. Pros: one source of truth with nothing to keep in sync. Cons: a link to the session log from outside the repo breaks. Mitigation: git history keeps the file. The repo is the only known consumer, and full-repository grep proves no internal mention is left.
- D6. Pros: every promotion is a traced spec task, and the user confirms each one (owner split). Cons: one small spec per video adds roadmap rows. Mitigation: a video with no Piece or Rule finding opens no spec. A promotion spec is tiny (one R item and one task per finding) and closes to `done`.
- D7. Pros: automated invariant verification across all existing and future videos with zero code duplication. Cons: requires maintaining a table fixture of video slugs. Mitigation: register video slugs in a deterministic array feeding parameterized tests, keeping test bodies strictly AAA and branch-free.
- D8. Pros: nothing proven in the first three videos is left forgotten, and it is the first real run of the close-out step. Cons: up to three new specs and more work now. Mitigation: the user's confirmation filters out weak findings, and a video with nothing confirmed opens no spec.

## Tasks
- [x] 004/T001 [agent] In `videos/_template/learnings.md`, make the Piece and Rule placeholders show the optional `— promoted: <path>` suffix and the Engine placeholder the required `— tracks: <url>` suffix — covers D1
- [x] 004/T002 [agent] Move the `viaje` session of `LOG.md` into `videos/viaje/learnings.md` under its kind sections, verify existing promotions via search, set engine tracking to TODO, and draft Lienzo issue templates — covers D2, D3, R1, R3
- [x] 004/T003 [agent] Migrate the `ringana` / `omega` session into `videos/ringana-omega/learnings.md` under its kind sections, verify existing promotions, and draft Lienzo issue templates — covers D2, D3, R1, R3
- [x] 004/T004 [agent] Migrate the `omega-v2` session into `videos/ringana-omega-v2/learnings.md` under its kind sections, verify existing promotions, and draft Lienzo issue templates — covers D2, D3, R1, R3
- [x] 004/T005 [human] File one issue in the Lienzo repo per engine finding (drafts in the T002–T004 reports) and give the agent the URLs — covers D4
- [x] 004/T006 [agent] Replace every `— tracks: TODO` in the three videos' `learnings.md` with its Lienzo issue URL — covers D4, R5
      blocked: waiting for T005: Lienzo issue URLs
- [x] 004/T007 [agent] Test in `tests/videos/learnings.test.cjs` using parameterized table-driven tests that each video's `learnings.md` satisfies structural and engine tracking invariants across partitions — covers R1, R5, D7
      blocked: waiting for T006: engine bullets still end in TODO
- [x] 004/T008 [agent] Re-point every mention of `LOG.md` outside history (`README.md`, `PRODUCT.md`, `skills/lienzo-art-direction/SKILL.md`, `skills/lienzo-art-direction/references/motion-polish.md`, the `videos/viaje/scene.gen.cjs` comment) to the video's `learnings.md` or the skill file that holds the rule; golden tests stay green — covers D5
- [x] 004/T009 [agent] Delete `LOG.md` and verify via repository-wide search that no tracked files retain dangling references to it — covers D5, R4
- [x] 004/T010 [agent] Add step 8 "Close out" to `skills/lienzo-animate/SKILL.md`: after approval, write findings by kind, confirm classification with the user, open a `NNN-promote-<slug>` spec using `spectrace-plan` for confirmed Piece/Rule findings, and ask the user to file Lienzo issues for Engine findings; in Joint mode, point to `learnings.md` — covers D6, R2
      reviewed 2026-10-25: Promotion workflow supports both video-proven and Lienzo native-feature wrappers
- [x] 004/T011 [human] On the next approved video, run close-out and confirm the classification and the promotion spec it opens — covers R2
      verified: confirmed close-out workflow and promotion spec generation on approved video
- [x] 004/T012 [agent] List the unmarked Piece and Rule findings of `viaje`, `ringana-omega` and `ringana-omega-v2`, with the target file proposed for each, in the task report — covers D8
- [x] 004/T013 [human] Confirm, move or drop each finding listed in T012 — covers D8
- [x] 004/T014 [agent] For each video with confirmed findings, scaffold its `NNN-promote-<slug>` spec using `spectrace-plan` (one R item per finding) — covers D8, R2
      reviewed 2026-10-25: Promotion workflow supports both video-proven and Lienzo native-feature wrappers
      blocked: waiting for T013: user confirmation of the T012 list
