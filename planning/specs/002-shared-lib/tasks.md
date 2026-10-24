# 002 — shared-lib — Tasks

- [x] T001 [agent] [status:done] Add `lib/palette.cjs` with a pure `checkPalette(object)` that returns the palette or throws naming the first role without a `#RRGGBB` `base` or with a bad `shadow`/`highlight`
      covers: D5@1, D1@1
      changes: lib/palette.cjs (+17 -0)
- [x] T002 [agent] [status:done] Test `checkPalette` in `tests/lib/palette.test.cjs`: a valid three-tone and one-tone palette pass; a missing `base` and a bad hex each throw with the role name
      covers: R4@1
      kind: test
      changes: tests/lib/palette.test.cjs (+27 -0)
- [x] T003 [agent] [status:done] Reshape `videos/ringana-omega/palette.json` into tone roles and make its generator read `checkPalette(require("./palette.json"))`; golden test stays green
      covers: D5@1, D6@1
      changes: videos/ringana-omega/palette.json (+8 -9), videos/ringana-omega/scene.gen.cjs (+36 -35)
- [x] T004 [agent] [status:done] Reshape `videos/ringana-omega-v2/palette.json` into tone roles and make its generator read `checkPalette(require("./palette.json"))`; golden test stays green
      covers: D5@1, D6@1
      changes: videos/ringana-omega-v2/palette.json (+11 -21), videos/ringana-omega-v2/scene.gen.cjs (+62 -61)
- [x] T005 [agent] [status:done] Test in `tests/lib/primitives.test.cjs` that `rect`, `ell` and `path` come out with gradient and shadow off and border 0, and that an explicit `fill.gradient`/`shadow` override is kept
      covers: R6@1, D7@1
      kind: test
      changes: tests/lib/primitives.test.cjs (+37 -0)
- [x] T006 [agent] [status:done] Add `lib/scene.cjs` with `sceneHelpers({ w, h, duration, palette })` → `{ shot, text, fadeToBlack }` (text motion as parameters, v1 defaults) and switch both ringana generators to it; golden test stays green
      covers: D1@1, D2@1, D3@1, D4@1, D6@1
      changes: lib/scene.cjs (+39 -0), videos/ringana-omega-v2/scene.gen.cjs (+3 -18), videos/ringana-omega/scene.gen.cjs (+3 -19)
- [x] T007 [agent] [status:done] Test in `tests/lib/scene.test.cjs` that `text` built from two different palettes gets two different label colours
      covers: R3@1
      kind: test
      changes: tests/lib/scene.test.cjs (+19 -0)
- [x] T008 [agent] [status:done] Add `lib/environment.cjs` with `sea` and `particles` (colours and frame as arguments) and switch both ringana generators to it; golden test stays green
      covers: D1@1, D2@1, D3@1, D6@1
      changes: lib/environment.cjs (+15 -0), videos/ringana-omega-v2/scene.gen.cjs (+5 -7), videos/ringana-omega/scene.gen.cjs (+5 -5)
- [x] T009 [agent] [status:done] Add `lib/objects.cjs` with `heart` (colour as argument) and switch both ringana generators to it; golden test stays green
      covers: D1@1, D3@1, D6@1
      changes: lib/objects.cjs (+9 -0), videos/ringana-omega-v2/scene.gen.cjs (+2 -2), videos/ringana-omega/scene.gen.cjs (+2 -2)
- [x] T010 [agent] [status:done] Add `lib/motion.cjs` with `heartbeat(t0, beats, { base, dip, peak, ease })` (v1 defaults) and switch both ringana generators to it; golden test stays green
      covers: D1@1, D2@1, D6@1
      changes: lib/motion.cjs (+13 -0), videos/ringana-omega-v2/scene.gen.cjs (+2 -6), videos/ringana-omega/scene.gen.cjs (+2 -6)
- [x] T011 [agent] [status:done] On a clean checkout with no `node_modules`, run `node --test tests/` and confirm it passes and `package.json` declares no dependencies
      covers: D8@1, R7@2, A9@1, A10@1
      changes: AGENTS.md (+1 -1)
      └─ reviewed 2026-10-24: same check, with the command that works on Node 24
      └─ blocked: conflicts 002/R7: on Node 24 'node --test tests/' treats the folder as a module and fails; the suite passes (10/10) with 'node --test "tests/**/*.test.cjs"' (pnpm test)
