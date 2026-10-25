# 004 — learning-promotion — Tasks

- [x] T001 [agent] [status:done] In `videos/_template/learnings.md`, make the Piece and Rule placeholders show the optional `— promoted: <path>` suffix and the Engine placeholder the required `— tracks: <url>` suffix
      covers: D1@1
      changes: videos/_template/learnings.md (+4 -4)
- [x] T002 [agent] [status:done] Move the `viaje` session of `LOG.md` into `videos/viaje/learnings.md`, one bullet per finding under its kind; add `— promoted:` only where a search finds the rule today; engine bullets end `— tracks: TODO`; the report drafts an issue title and body per engine finding
      covers: D2@1, D3@1, R1@1, R3@1
      changes: videos/viaje/learnings.md (+41 -1)
- [x] T003 [agent] [status:done] Same as T002 for the `ringana` / `omega` session into `videos/ringana-omega/learnings.md`
      covers: D2@1, D3@1, R1@1, R3@1
      changes: videos/ringana-omega/learnings.md (+37 -1)
- [x] T004 [agent] [status:done] Same as T002 for the `omega-v2` session into `videos/ringana-omega-v2/learnings.md`
      covers: D2@1, D3@1, R1@1, R3@1
      changes: videos/ringana-omega-v2/learnings.md (+22 -1)
- [x] T005 [human] [status:done] File one issue in the Lienzo repo per engine finding (drafts in the T002–T004 reports) and give the agent the URLs
      covers: D4@1
      changes: none
- [x] T006 [agent] [status:done] Replace every `— tracks: TODO` in the three videos' `learnings.md` with its Lienzo issue URL
      covers: D4@1, R5@1
      changes: videos/ringana-omega-v2/learnings.md (+1 -1), videos/ringana-omega/learnings.md (+3 -3), videos/viaje/learnings.md (+9 -9)
      └─ blocked: waiting for T005: Lienzo issue URLs
- [x] T007 [agent] [status:done] Test in `tests/videos/learnings.test.cjs` that each video's `learnings.md` has the four headings once and in order, and that every `## Engine` bullet ends with `— tracks: https://…`
      covers: R1@1, R5@1, D7@1
      kind: test
      changes: tests/videos/learnings.test.cjs (+60 -0)
      └─ blocked: waiting for T006: engine bullets still end in TODO
- [x] T008 [agent] [status:done] Re-point every mention of `LOG.md` outside history (`README.md`, `planning/product.md`, `skills/lienzo-art-direction/SKILL.md`, `skills/lienzo-art-direction/references/motion-polish.md`, the `videos/viaje/scene.gen.cjs` comment) to the video's `learnings.md` or the skill file that holds the rule; golden tests stay green
      covers: D5@1
      changes: README.md (+0 -1), skills/lienzo-art-direction/SKILL.md (+2 -2), skills/lienzo-art-direction/references/motion-polish.md (+1 -1), videos/viaje/scene.gen.cjs (+1 -1)
- [x] T009 [agent] [status:done] Delete `LOG.md`; `trace check` reports no file that mentions it
      covers: D5@1, R4@1
      changes: LOG.md (+0 -78)
- [x] T010 [agent] [status:done] Add step 8 "Close out" to `skills/lienzo-animate/SKILL.md`: after approval, write findings by kind, confirm the classification with the user, open a `NNN-promote-<slug>` spec (spectrace-start + spectrace-plan) for confirmed Piece/Rule findings, and ask the user to file Lienzo issues for Engine findings; in Joint mode, replace "Log what the user corrected" with a pointer to `learnings.md`
      covers: D6@1, R2@1, A13@2
      changes: skills/lienzo-animate/SKILL.md (+2 -1)
      └─ reviewed 2026-10-25: A13@2 only adds a route for Lienzo-feature wrappers; the video-proven route this task built still holds
- [ ] T011 [human] [status:todo] On the next approved video, run close-out and confirm the classification and the promotion spec it opens
      covers: R2@1
- [x] T012 [agent] [status:done] List the unmarked Piece and Rule findings of `viaje`, `ringana-omega` and `ringana-omega-v2`, with the target file proposed for each, in the task report
      covers: D8@1
      changes: none
- [x] T013 [human] [status:done] Confirm, move or drop each finding listed in T012
      covers: D8@1
      changes: none
- [x] T014 [agent] [status:done] For each video with confirmed findings, open its `NNN-promote-<slug>` spec with spectrace-start (one R item per finding) and plan it with spectrace-plan
      covers: D8@1, R2@1, A13@2
      changes: none
      └─ reviewed 2026-10-25: A13@2 only adds a route for Lienzo-feature wrappers; the video-proven route this task built still holds
      └─ blocked: waiting for T013: user confirmation of the T012 list
