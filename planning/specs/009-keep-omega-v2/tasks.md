# 009 — keep-omega-v2 — Tasks

- [x] T001 [agent] [status:done] Remove `videos/viaje/` and `videos/ringana-omega/`, their fixtures and their scene and learnings tests
      covers: R1@1, D1@1
      changes: tests/videos/fixtures/ringana-omega.scene.json (+0 -2835), tests/videos/fixtures/viaje.scene.json (+0 -2805), tests/videos/learnings.test.cjs (+1 -29), tests/videos/scenes.test.cjs (+1 -19), videos/ringana-omega/brief.md (+0 -144), videos/ringana-omega/learnings.md (+0 -39), videos/ringana-omega/palette.json (+0 -10), videos/ringana-omega/research.md (+0 -35), videos/ringana-omega/scene.gen.cjs (+0 -147), videos/ringana-omega/scene.json (+0 -2835), videos/viaje/brief.md (+0 -119), videos/viaje/learnings.md (+0 -43), videos/viaje/scene.gen.cjs (+0 -121), videos/viaje/scene.json (+0 -2805)
- [x] T002 [agent] [status:done] Remove `car`, `house`, `cloud`, `dashes`, `nameAll` from `lib/`, their tests and their "Start from lib/" lines
      covers: R2@1, D2@1
      changes: lib/environment.cjs (+2 -15), lib/objects.cjs (+3 -38), lib/scene.cjs (+1 -14), skills/lienzo-animate/SKILL.md (+4 -4), tests/lib/environment.test.cjs (+0 -13), tests/lib/objects.test.cjs (+0 -25), tests/lib/scene.test.cjs (+1 -10)
- [x] T003 [agent] [status:done] Point README, product, storyboard skill and the primitives header to ringana-omega-v2 only
      covers: R3@1, D3@1
      changes: README.md (+3 -3), lib/primitives.cjs (+1 -1), skills/lienzo-storyboard/SKILL.md (+1 -1)
- [x] T004 [agent] [status:done] Move `research.md` from the removed v1 folder into `videos/ringana-omega-v2/` and repoint v2's brief, learnings and generator header, and the `recipes.md` "Tested in" line, so nothing cites a removed path
      covers: R1@1, R3@1, D4@1
      changes: skills/lienzo-animate/references/recipes.md (+1 -1), videos/ringana-omega-v2/brief.md (+128 -1), videos/ringana-omega-v2/learnings.md (+1 -1), videos/ringana-omega-v2/research.md (+35 -0), videos/ringana-omega-v2/scene.gen.cjs (+1 -1)
