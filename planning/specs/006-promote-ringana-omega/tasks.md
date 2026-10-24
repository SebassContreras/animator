# 006 — promote-ringana-omega — Tasks

- [x] T001 [agent] [status:done] Add `countUp(steps)` to `lib/motion.cjs` and use it in both ringana generators; golden tests green
      covers: D1@1, R1@1
      changes: lib/motion.cjs (+4 -1), videos/ringana-omega-v2/scene.gen.cjs (+2 -2), videos/ringana-omega/scene.gen.cjs (+2 -2)
- [x] T002 [agent] [status:done] Test in `tests/lib/motion.test.cjs` that `countUp` writes the given steps as a `label.text` track
      covers: R1@1
      kind: test
      changes: tests/lib/motion.test.cjs (+13 -0)
- [x] T003 [agent] [status:done] Add the blocked-site (`pwa-nav` or pasted text) and PDFs-first tactics to `skills/lienzo-research/references/sources.md` → "Search tactics"
      covers: D2@1, R2@1
      changes: skills/lienzo-research/references/sources.md (+2 -0)
- [x] T004 [agent] [status:done] Add the EU authorised-wording rule (Reg. 432/2012, with the register link) to `skills/lienzo-research/references/claims.md`
      covers: D2@1, D3@1, R3@1
      changes: skills/lienzo-research/references/claims.md (+6 -0)
- [x] T005 [agent] [status:done] Add the missing-font and wrong-`audioDuration` rows to `skills/lienzo-animate/references/gotchas.md`
      covers: D2@1, R4@1
      changes: skills/lienzo-animate/references/gotchas.md (+2 -0)
- [x] T006 [agent] [status:done] In `skills/lienzo-storyboard/references/craft.md`, add the 72 px / 20-character note to "Text on screen" and a "Voice-over" section with the four voice rules
      covers: D2@1, R5@1, R6@1
      changes: skills/lienzo-storyboard/references/craft.md (+8 -0)
- [x] T007 [agent] [status:done] End each promoted finding in `videos/ringana-omega/learnings.md` with `— promoted: <path>`
      covers: R7@1
      changes: videos/ringana-omega/learnings.md (+11 -11)
- [x] T008 [agent] [status:done] Remove `tests/lib/motion.test.cjs`: `countUp` has no logic, so the test could not fail for a real bug (AGENTS.md "Skip"); the ringana golden tests already prove R1
      covers: R1@1
      retires: T002
      changes: tests/lib/motion.test.cjs (+0 -13)
