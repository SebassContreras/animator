# 005 — promote-viaje — Tasks

- [x] T001 [agent] [status:done] Add `tests/videos/fixtures/viaje.scene.json` from today's generator and a golden test for viaje in `tests/videos/scenes.test.cjs`
      covers: D1@2, R6@2
      kind: test
      └─ reviewed 2026-10-24: fixture still valid; T007 changes the comparison to parsed JSON (R6@2, D1@2)
      changes: tests/videos/fixtures/viaje.scene.json (+2805 -0), tests/videos/scenes.test.cjs (+10 -1)
- [x] T002 [agent] [status:done] Move `car` (with its wheels) and `house` to `lib/objects.cjs` with colours as arguments; viaje imports them; golden test green
      covers: D2@1, R1@1, R2@1, R6@2, A11@1
      changes: lib/objects.cjs (+37 -2), videos/viaje/scene.gen.cjs (+6 -24), videos/viaje/scene.json (+120 -120)
      └─ blocked: conflicts 005/R6: lib primitives write fill after extra keys, so viaje's JSON keeps its values but changes key order
- [x] T003 [agent] [status:done] Move `cloud` and `dashes` to `lib/environment.cjs` with colour and width as arguments; viaje imports them; golden test green
      covers: D2@1, R3@1, R4@1, R6@2, A11@1
      changes: lib/environment.cjs (+15 -2), videos/viaje/scene.gen.cjs (+3 -8)
- [x] T004 [agent] [status:done] Move `nameAll` to `lib/scene.cjs` taking the name and part maps as arguments; viaje passes its maps; golden test green
      covers: D3@1, R5@1, R6@2
      changes: lib/scene.cjs (+14 -1), videos/viaje/scene.gen.cjs (+3 -6)
- [x] T005 [agent] [status:done] Unit tests: car wheels spin over `spin`, house windows switch to `lit` at `litAt`, dashes period equals `period`, `nameAll` names a child "<parent> · <part>"
      covers: D4@1, R1@1, R2@1, R4@1, R5@1
      kind: test
      changes: tests/lib/environment.test.cjs (+13 -0), tests/lib/objects.test.cjs (+25 -0), tests/lib/scene.test.cjs (+10 -1)
- [x] T006 [agent] [status:done] End each promoted Piece in `videos/viaje/learnings.md` with `— promoted: <lib file>`
      covers: R7@1
      changes: videos/viaje/learnings.md (+5 -5)
- [x] T007 [agent] [status:done] Make the viaje golden test compare the parsed scene with `assert.deepEqual` instead of the bytes
      covers: D1@2, R6@2
      kind: test
      changes: tests/videos/scenes.test.cjs (+5 -5), videos/viaje/scene.gen.cjs (+1 -1)
