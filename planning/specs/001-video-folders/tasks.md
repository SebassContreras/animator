# 001 — video-folders — Tasks

- [x] T001 [agent] [status:done] Move ringana-omega v1 brief, research, generator and scene into videos/ringana-omega/ with the fixed names
      covers: D1@1, D2@1
      changes: briefs/ringana-omega.md → videos/ringana-omega/brief.md (+0 -0), briefs/ringana-omega.research.md → videos/ringana-omega/research.md (+0 -0), lab/ringana-omega.gen.cjs → videos/ringana-omega/scene.gen.cjs (+0 -0), lab/ringana-omega.json → videos/ringana-omega/scene.json (+0 -0)
- [x] T002 [agent] [status:done] Move ringana-omega v2 brief, generator and scene into videos/ringana-omega-v2/; brief links to ../ringana-omega/research.md
      covers: D1@1, D2@1
      changes: briefs/ringana-omega-v2.md → videos/ringana-omega-v2/brief.md (+1 -1), lab/ringana-omega-v2.gen.cjs → videos/ringana-omega-v2/scene.gen.cjs (+0 -0), lab/ringana-omega-v2.json → videos/ringana-omega-v2/scene.json (+0 -0)
- [x] T003 [agent] [status:done] Move viaje generator, scene and brief (from skills/lienzo-storyboard/examples/viaje.md) into videos/viaje/ and delete lab/viaje.baseline.json
      covers: D1@1, D2@1, D4@1
      changes: lab/viaje.baseline.json (+0 -7679), skills/lienzo-storyboard/examples/viaje.md → videos/viaje/brief.md (+1 -1), lab/viaje.gen.cjs → videos/viaje/scene.gen.cjs (+2 -2), lab/viaje.json → videos/viaje/scene.json (+0 -0)
- [x] T004 [agent] [status:done] Move lab/lib/compact.cjs to lib/primitives.cjs and update the generators' require paths
      covers: D2@1, A6@1
      changes: lab/lib/compact.cjs → lib/primitives.cjs (+0 -0), videos/ringana-omega-v2/scene.gen.cjs (+1 -1), videos/ringana-omega/scene.gen.cjs (+1 -1)
- [x] T005 [agent] [status:done] Write palette.json for both ringana videos, make their generators read it and write scene.json beside themselves; outputs byte-identical to commit f8bb08f
      covers: D3@1
      changes: videos/ringana-omega-v2/palette.json (+23 -0), videos/ringana-omega-v2/scene.gen.cjs (+5 -12), videos/ringana-omega/palette.json (+11 -0), videos/ringana-omega/scene.gen.cjs (+4 -4)
- [x] T006 [agent] [status:done] Create learnings.md stubs in the three video folders pointing to their LOG.md session
      covers: D6@1
      changes: videos/ringana-omega-v2/learnings.md (+3 -0), videos/ringana-omega/learnings.md (+3 -0), videos/viaje/learnings.md (+3 -0)
- [x] T007 [agent] [status:done] Rewrite old paths in the four skills to videos/<slug>/ and drop LIENZO-IMPROVEMENTS.md from lienzo-storyboard feasibility
      covers: D5@1
      changes: skills/lienzo-animate/SKILL.md (+2 -2), skills/lienzo-animate/references/drawing.md (+1 -1), skills/lienzo-animate/references/recipes.md (+1 -1), skills/lienzo-art-direction/SKILL.md (+1 -1), skills/lienzo-art-direction/references/styles.md (+1 -1), skills/lienzo-research/SKILL.md (+2 -2), skills/lienzo-research/references/fact-sheet-template.md (+2 -2), skills/lienzo-storyboard/SKILL.md (+4 -4), skills/lienzo-storyboard/references/brief-template.md (+2 -2), skills/lienzo-storyboard/references/feasibility.md (+1 -1)
- [x] T008 [agent] [status:done] Rewrite old paths in README.md and LOG.md and remove the LIENZO-IMPROVEMENTS.md entry from README
      covers: D5@1
      changes: LOG.md (+5 -5), README.md (+6 -7), briefs/.gitkeep (+0 -0), videos/ringana-omega/brief.md (+2 -2)
- [x] T009 [agent] [status:done] Add node --test golden test: run each ringana generator and assert scene.json equals the f8bb08f snapshot
      covers: R4@1
      kind: test
      changes: package.json (+9 -0), tests/videos/fixtures/ringana-omega-v2.scene.json (+5711 -0), tests/videos/fixtures/ringana-omega.scene.json (+2835 -0), tests/videos/scenes.test.cjs (+31 -0)
