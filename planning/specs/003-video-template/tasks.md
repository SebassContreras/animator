# 003 — video-template — Tasks

- [x] T001 [agent] [status:done] Add `videos/_template/palette.json` with roles `background`, `main`, `secondary`, `accent`, `text` from Bright science (`main`/`secondary`/`accent` with `shadow`/`highlight` at ∓15 % HSL lightness); `checkPalette` accepts it
      covers: D3@1, D1@1
      changes: videos/_template/palette.json (+7 -0)
- [x] T002 [agent] [status:done] Add `videos/_template/scene.gen.cjs`: one shot (background rect, `main` ellipse, `text` title) from `lib/` and the palette, no hex literal, writes `scene.json` beside itself; add `videos/_template/scene.json` and `videos/tmp-*/` to `.gitignore`
      covers: D4@1, D1@1, A8@1, A11@1, A12@1
      changes: .gitignore (+2 -0), videos/_template/scene.gen.cjs (+25 -0)
- [x] T003 [agent] [status:done] Test in `tests/videos/template.test.cjs` that a copy of `_template` under `videos/tmp-*` runs its generator and writes a scene with `size`, `duration`, non-empty `elements` and the copy's palette background; temp folder removed in `after`
      covers: R2@1, D6@1
      kind: test
      changes: tests/videos/template.test.cjs (+28 -0)
- [x] T004 [agent] [status:done] Generate the template scene and run `pnpm lienzo scene_build` without `save` from the local Lienzo repo on it; record the result in the task report
      covers: D7@1, R2@1
      changes: none
- [x] T005 [agent] [status:done] Add `videos/_template/brief.md` (verbatim copy of the brief-template block, placeholders kept) and `videos/_template/research.md` (title + pointer to the fact-sheet template)
      covers: D2@1, D1@1
      changes: videos/_template/brief.md (+66 -0), videos/_template/research.md (+3 -0)
- [x] T006 [agent] [status:done] Add `videos/_template/learnings.md` with sections `## Piece`, `## Rule`, `## Engine`, `## Local`, one placeholder bullet each
      covers: D5@1, D1@1
      changes: videos/_template/learnings.md (+19 -0)
- [x] T007 [agent] [status:done] In `skills/lienzo-storyboard/SKILL.md`, add step 0a (create `videos/<slug>/` with the `fs.cpSync` one-liner) and make steps 0 and 7 fill `research.md` and `brief.md` in place
      covers: D8@1
      changes: skills/lienzo-storyboard/SKILL.md (+6 -3)
- [x] T008 [agent] [status:done] In `skills/lienzo-art-direction/SKILL.md` step 1, write the chosen style into `videos/<slug>/palette.json` under the five roles; in `brief-template.md`, note the palette table mirrors `palette.json` and that `videos/_template/brief.md` must change with it
      covers: D9@1, D2@1
      changes: skills/lienzo-art-direction/SKILL.md (+1 -1), skills/lienzo-storyboard/references/brief-template.md (+5 -4), videos/_template/brief.md (+4 -3)
- [x] T009 [agent] [status:done] In `skills/lienzo-animate/SKILL.md`, make step 3 run `node videos/<slug>/scene.gen.cjs` then `scene_build` from its `scene.json`; add "Start from lib/" (one line per module, reuse first, new pieces stay local until promoted); point the multi-shot example to `videos/_template/` and ringana-omega-v2
      covers: D10@1, A13@1
      changes: skills/lienzo-animate/SKILL.md (+15 -2)
- [x] T010 [human] [status:done] Approve the first video made from the template (copied with storyboard step 0a, built through the generator)
      covers: R3@1, R4@1
      changes: none
