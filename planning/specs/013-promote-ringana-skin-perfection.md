# 013 — promote-ringana-skin-perfection

## Goal
What the `ringana-skin-perfection` video proved reaches `lib/`, the skills and the template, so
the next video starts from it. Verification: `pnpm test` passes on a fresh copy of the template;
`lib/` exports a multi-shape `path`, `blob` and `teardrop`; each `Piece` and `Rule` finding in
`videos/ringana-skin-perfection/learnings.md` ends with `— promoted: <path>`.

## Context
- Close-out of `ringana-skin-perfection` (`lienzo-animate` step 8), approved by the user on
  2026-10-31. One R item per confirmed `Piece` or `Rule` finding; the `card` piece and the
  `Local` findings stay in the video.
- The video was the first piece in Soft depth and the first test of the pipeline after spec 011:
  it found one repo bug (R1) and several gaps in the skills.
- The `Engine` findings go to the Lienzo repo as specs, not issues (user's decision, 2026-10-31):
  Lienzo 087 contrast-unframed-groups, 088 axis-scale-channels, 089 speech-voiced-span,
  090 build-from-file. R11 changes how Animator records that link.

## Requirements
- R1: A copy of `videos/_template/` passes `tests/videos/learnings.test.cjs` with no edits: the
  template's `learnings.md` has the four kind sections and no placeholder bullets. Today the copy
  fails at once, because the Engine placeholder has no tracking URL.
- R2: `lib/primitives.cjs` `path` takes either one `d` string or a list of them; a list becomes
  one `shapes` entry per `d`, in order (morph frames, or layers with `mode: "layers"`). A single
  string keeps today's output byte for byte.
- R3: `lib/environment.cjs` exports `blob(id, name, box, top, bottom, extra?)`: an organic blob
  path in a 100×100 view, filling `box` (`{ x, y, w, h }`), with a vertical two-colour gradient
  from `top` to `bottom`. Colours come from the caller.
- R4: `lib/objects.cjs` exports `teardrop(tones)`: a three-tone teardrop symbol definition
  (`{ w: 100, h: 120, children }`; shadow drop, base drop up-left of it, highlight dot top-left)
  from a palette role's `{ base, shadow, highlight }`.
- R5: `lienzo-animate` says to count a number up with the `counter` kind (`from`, `to`, `prefix`,
  `suffix`, `progress` track), and that `countUp` in `lib/motion.cjs` only drives the legacy
  rect `label.text`.
- R6: `lienzo-animate/references/drawing.md` (or `gotchas.md`) has the three drawing rules the
  video proved: a symbol placed much larger than its definition scales its details too (draw
  large variants at their size); a layer that drifts with an `x` track needs the drift added to
  its width; one-axis growth uses `w`/`h` with `x`/`y` tracks (there is no per-axis scale).
- R7: `lienzo-storyboard/references/craft.md` → "Text on screen" says to break two-line titles by
  hand with `\n`, and → "Voice-over" that a Kokoro clip carries about 0.4 s of silence at the
  start and 0.6 s at the end (measured with `ffmpeg silencedetect`): ≤ 5 words for a 3 s shot,
  and check that the clips' total fits the scene before placing them, until Lienzo 089 reports
  the voiced span.
- R8: `lienzo-animate` (SKILL.md step 3 or `compact-format.md`) says that a large compact scene
  is built with the CLI, `pnpm lienzo scene_build --json @<file>`, the file holding
  `{ project, compact, save, overwrite }`, instead of inline in the MCP call.
- R9: `lienzo-research/references/sources.md` names `browser-nav` (it replaced `pwa-nav`) for
  brand sites rendered with JavaScript, and says its `snapshot` lists headings and buttons but not
  paragraph text: open each panel and read it from a `screenshot`; cookie banners get the
  essential-only choice.
- R10: `lienzo-art-direction/references/styles.md` marks Soft depth as used in
  `videos/ringana-skin-perfection/brief.md`, with what a white brand changes (brand white
  background, brand fonts, an accent that fails 4.5:1 on white is never text).

- R11: An `Engine` finding ends with `— tracks: Lienzo spec <NNN>` (the spec in the Lienzo repo
  that fixes it) or, as before, with a Lienzo issue URL. `tests/videos/learnings.test.cjs`,
  `videos/_template/learnings.md` and `lienzo-animate` step 8 say so; step 8 asks the user whether
  to open a Lienzo spec for each Engine finding instead of asking them to file an issue.
  Partitions: spec reference, issue URL (omega-v2's `issues/10` stays valid), neither, `TODO`,
  `Lienzo spec 87` (not three digits). Invariant: every Engine bullet in every video passes.

### Who it serves
Every next video: fewer bugs on copy, reusable Soft depth pieces, and the rules that cost a
rebuild this time.

### Out of scope
- The stat `card`: one consumer so far; it stays in the video's generator until a second video
  needs it (ENGINEERING.md § KISS).
- Rebuilding `ringana-skin-perfection` on the promoted pieces.

### Dependencies
- 011 (brand snapshot and palette roles), 004 (learning promotion).

### Owner split
Agent tasks.

## Design
### Approach
- D1 (R1): `videos/_template/learnings.md` keeps its intro line and the four `## ` headings with
  no bullets, plus one non-bullet line per section saying what goes there. A test copies the
  template like `template.test.cjs` and runs the learnings checks on the copy (the existing loop
  skips `_template`).
- D2 (R2): `path` spreads `shapes: [].concat(d).map((d) => ({ d }))`. A string gives
  `[{ d }]`, as today, so `ringana-omega-v2`'s golden scene is unchanged.
- D3 (R3): `blob` moves from the video's generator unchanged except its signature takes a `box`
  like `particles` does. Its `d` string is a constant (`BLOB_D`).
- D4 (R4): `teardrop` moves from the video's `tear(role)`, taking tones instead of a role name so
  `lib/` names no palette role (ARCHITECTURE.md § Brand Parameterization).
- D5 (R5–R10): text edits only; each one cites the video
  (`ringana-skin-perfection`) as its proof, like the existing omega-v2 notes.
- D7 (R11): the test's tracking pattern accepts either suffix:
  `— tracks: (https://github.com/<owner>/lienzo/issues/<n>|Lienzo spec \d{3})$`. A spec number
  is enough: the Lienzo roadmap holds its name and status.
- D6 (all): each task that promotes a finding appends `— promoted: <path>` to it in the video's
  `learnings.md` (004/R1). `lienzo-animate` → "Start from lib/" lists the new exports (guarded by
  `tests/skills/lib-list.test.cjs`).

### Trade-offs
- D2. Pros: one primitive for one- and many-shape paths. Cons: `d` has two types. Mitigation: the
  comment and the skill say so; a string stays the common case.
- D3/D4. Pros: Soft depth's backdrop and the drop shape are ready for the second video. Cons: one
  consumer each today (the KISS rule asks for two). Mitigation: both are palette-agnostic
  primitives with no story in them, like `particles`; the story-bound `card` stays local.

## Tasks
- [ ] 013/T001 [agent] `videos/_template/learnings.md`: four empty kind sections (D1); add a test that a copied template passes the learnings format and tracking checks; `node --test tests/videos/learnings.test.cjs` — covers R1, D1
- [ ] 013/T002 [agent] `lib/primitives.cjs` `path` takes a `d` list (D2); tests: a list gives one shape per `d` in order, a string gives today's output; `node --test tests/lib/primitives.test.cjs tests/videos/scenes.test.cjs` — covers R2, D2
- [ ] 013/T003 [agent] `lib/environment.cjs` `blob` (D3); test: box and gradient colours come from the caller; switch `videos/ringana-skin-perfection/scene.gen.cjs` to it and check its scene.json is unchanged — covers R3, D3
- [ ] 013/T004 [agent] `lib/objects.cjs` `teardrop(tones)` (D4); test: the three children take the given tones; switch the video's generator to it, scene.json unchanged — covers R4, D4
- [ ] 013/T005 [agent] `lienzo-animate` → "Start from lib/": list `path`'s `d` list, `blob` and `teardrop`; `node --test tests/skills/lib-list.test.cjs` — covers R2–R4, D6
- [ ] 013/T006 [agent] Skill text for R5 (counter), R6 (drawing rules), R7 (line breaks, voice padding), R8 (CLI build), R9 (browser-nav), R10 (Soft depth in styles.md) — covers R5–R10, D5
- [ ] 013/T007 [agent] Mark each promoted finding in `videos/ringana-skin-perfection/learnings.md` with `— promoted: <path>`; run `pnpm test` — covers D6
- [ ] 013/T008 [agent] Tracking pattern (D7) in `tests/videos/learnings.test.cjs`, with the R11 partitions as table tests; `videos/_template/learnings.md` intro and `lienzo-animate` step 8 name both suffixes — covers R11, D7
- [ ] 013/T009 [agent] `videos/ringana-skin-perfection/learnings.md` → Engine: one bullet per finding, ending `— tracks: Lienzo spec 087` (contrast), `088` (axis scale), `089` (voice silence), `090` (build from file); run `pnpm test` — covers R11
