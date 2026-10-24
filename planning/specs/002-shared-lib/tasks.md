# 002 — shared-lib — Tasks

- [ ] T001 [agent] [status:todo] Add `lib/palette.cjs` with a pure `checkPalette(object)` that returns the palette or throws naming the first role without a `#RRGGBB` `base` or with a bad `shadow`/`highlight`
      covers: D5@1, D1@1
- [ ] T002 [agent] [status:todo] Test `checkPalette` in `tests/lib/palette.test.cjs`: a valid three-tone and one-tone palette pass; a missing `base` and a bad hex each throw with the role name
      covers: R4@1
      kind: test
- [ ] T003 [agent] [status:todo] Reshape `videos/ringana-omega/palette.json` into tone roles and make its generator read `checkPalette(require("./palette.json"))`; golden test stays green
      covers: D5@1, D6@1
- [ ] T004 [agent] [status:todo] Reshape `videos/ringana-omega-v2/palette.json` into tone roles and make its generator read `checkPalette(require("./palette.json"))`; golden test stays green
      covers: D5@1, D6@1
- [ ] T005 [agent] [status:todo] Test in `tests/lib/primitives.test.cjs` that `rect`, `ell` and `path` come out with gradient and shadow off and border 0, and that an explicit `fill.gradient`/`shadow` override is kept
      covers: R6@1, D7@1
      kind: test
- [ ] T006 [agent] [status:todo] Add `lib/scene.cjs` with `sceneHelpers({ w, h, duration, palette })` → `{ shot, text, fadeToBlack }` (text motion as parameters, v1 defaults) and switch both ringana generators to it; golden test stays green
      covers: D1@1, D2@1, D3@1, D4@1, D6@1
- [ ] T007 [agent] [status:todo] Test in `tests/lib/scene.test.cjs` that `text` built from two different palettes gets two different label colours
      covers: R3@1
      kind: test
- [ ] T008 [agent] [status:todo] Add `lib/environment.cjs` with `sea` and `particles` (colours and frame as arguments) and switch both ringana generators to it; golden test stays green
      covers: D1@1, D2@1, D3@1, D6@1
- [ ] T009 [agent] [status:todo] Add `lib/objects.cjs` with `heart` (colour as argument) and switch both ringana generators to it; golden test stays green
      covers: D1@1, D3@1, D6@1
- [ ] T010 [agent] [status:todo] Add `lib/motion.cjs` with `heartbeat(t0, beats, { base, dip, peak, ease })` (v1 defaults) and switch both ringana generators to it; golden test stays green
      covers: D1@1, D2@1, D6@1
- [ ] T011 [agent] [status:todo] On a clean checkout with no `node_modules`, run `node --test tests/` and confirm it passes and `package.json` declares no dependencies
      covers: D8@1, R7@1, A9@1, A10@1
