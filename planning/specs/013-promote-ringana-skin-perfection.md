# 013 — promote-ringana-skin-perfection

## Goal
What the `ringana-skin-perfection` video proved reaches `lib/`, the skills and the template, so
the next video starts from it. Verification: `pnpm test` passes, and its learnings table includes
`_template`; `lib/` exports a multi-shape `path`, `blob` and `teardrop`; each `Piece` and `Rule`
finding in `videos/ringana-skin-perfection/learnings.md` except `card` ends with
`— promoted: <path>`.

## Context
- Close-out of `ringana-skin-perfection` (`lienzo-animate` step 8), approved by the user on
  2026-10-31. One R item per confirmed `Piece` or `Rule` finding, or per target document when
  several findings go to the same one (R6, R7); each R names the findings it carries. The `card`
  piece and the `Local` findings stay in the video.
- The video was the first piece in Soft depth and the first test of the pipeline after spec 011:
  it found one repo bug (R1) and several gaps in the skills.
- The `Engine` findings go to the Lienzo repo as specs, not issues (user's decision, 2026-10-31):
  Lienzo 087 contrast-unframed-groups, 088 axis-scale-channels, 089 speech-voiced-span,
  090 build-from-file. R11 changes how Animator records that link.

## Requirements
- R1: `videos/_template/learnings.md` passes every check `tests/videos/learnings.test.cjs` runs
  on a video, so a copy of the template passes with no edits. The template has the four kind
  sections and no bullets. Today a copy fails at once, because the Engine placeholder has no
  tracking URL; the Piece and Rule placeholders are bullets too. Finding: Rule "template ships
  placeholder bullets".
- R2: `lib/primitives.cjs` `path` takes either one `d` string or a list of them; a list becomes
  one `shapes` entry per `d`, in order (morph frames, or layers with `mode: "layers"`). Finding:
  Piece `flatPath`. Partitions: a string, a one-element list, a list of several. Invariants:
  `path(…, [d])` deep-equals `path(…, d)`; a string keeps today's output byte for byte; `shapes`
  has one entry per `d`, in order. An empty list is out of contract (Lienzo rejects `shapes: []`);
  `path` does not validate it.
- R3: `lib/environment.cjs` exports `blob(id, name, box, top, bottom, extra?)`: an organic blob
  path in a 100×100 view, filling `box` (`{ x, y, w, h }`), with a vertical two-colour gradient
  from `top` to `bottom`. Colours come from the caller; `extra.fill` merges with the gradient
  instead of replacing it. Finding: Piece `blob`.
- R4: `lib/objects.cjs` exports `teardrop(tones)`: a three-tone teardrop symbol definition
  (`{ w: 100, h: 120, children }`; shadow drop, base drop up-left of it, highlight dot top-left)
  from a palette role's `{ base, shadow, highlight }`. `tones` come from `resolvePalette`, which
  always fills all three; a missing tone is out of contract. Finding: Piece `tear(role)`.
- R5: `lienzo-animate` says to count a number up with the `counter` kind (`from`, `to`, `prefix`,
  `suffix`, `progress` track), and that `countUp` in `lib/motion.cjs` only drives the legacy
  rect `label.text`. Finding: Rule "counter".
- R6: `lienzo-animate/references/drawing.md` has the three drawing rules the video proved: a
  symbol placed much larger than its definition scales its details too (draw large variants at
  their size); a layer that drifts with an `x` track needs the drift added to its width; one-axis
  growth uses `w`/`h` with `x`/`y` tracks (there is no per-axis scale), until Lienzo 088 adds
  per-axis scale channels. Findings: Rules "symbol scale", "drift width", "one-axis growth".
- R7: `lienzo-storyboard/references/craft.md` → "Text on screen" says to break two-line titles by
  hand with `\n`, and → "Voice-over" that a Kokoro clip carries about 0.4 s of silence at the
  start and 0.6 s at the end (measured with `ffmpeg silencedetect` at −40 dB): ≤ 5 words for a
  3 s shot, and check that the clips' total fits the scene before placing them, until Lienzo 089
  reports the voiced span. Findings: Rules "line breaks", "Kokoro padding".
- R8: `lienzo-animate` SKILL.md step 3 says that a large compact scene is built with the CLI,
  `pnpm lienzo scene_build --json @<file>`, the file holding `{ project, compact, save, overwrite }`,
  instead of inline in the MCP call, until Lienzo 090 builds from a file over MCP. Finding: Rule
  "large compact scenes".
- R9: `lienzo-research/references/sources.md` names `browser-nav` (`pwa-nav` is its legacy alias)
  for brand sites rendered with JavaScript, and says its `snapshot` lists headings and buttons but
  not paragraph text: open each panel and read it from a `screenshot`; cookie banners get the
  essential-only choice. Finding: Rule "ringana.com renders with JavaScript".
- R10: `lienzo-art-direction/references/styles.md` marks Soft depth as used in
  `videos/ringana-skin-perfection/brief.md`, with what a white brand changes (brand white
  background, brand fonts, an accent that fails 4.5:1 on white is never text).
- R11: An `Engine` finding ends with `— tracks: Lienzo spec <NNN>` (the spec in the Lienzo repo
  that fixes it) or, as before, with a Lienzo issue URL. `tests/videos/learnings.test.cjs`,
  `videos/_template/learnings.md` and `lienzo-animate` step 8 say so; step 8 asks the user whether
  to open a Lienzo spec for each Engine finding instead of asking them to file an issue.
  Partitions: spec reference, issue URL (omega-v2's `issues/10` stays valid), neither, `TODO`,
  `Lienzo spec 87` (two digits), `Lienzo spec 0870` (four digits), `lienzo spec 087` (lower
  case), an issue URL of another repo, text after the suffix. Invariant: every Engine bullet in
  every video and in the template passes.

### Who it serves
Every next video: fewer bugs on copy, reusable Soft depth pieces, and the rules that cost a
rebuild this time.

### Out of scope
- The stat `card`: one consumer so far; it stays in the video's generator until a second video
  needs it (ENGINEERING.md § KISS).
- Re-rendering or re-exporting `ringana-skin-perfection` in Lienzo. Its generator does switch to
  the promoted pieces (T005–T007), with an unchanged `scene.json`.

### Dependencies
- 011 (brand snapshot and palette roles), 004 (learning promotion).

### Owner split
Agent tasks.

## Design
### Approach
- D1 (R1): `videos/_template/learnings.md` keeps its intro line and the four `## ` headings with
  no bullets, plus one non-bullet line per section saying what goes there (the Engine line names
  the two D7 suffixes). The learnings test's table includes `_template` (its filter skips `_`
  folders except `_template`), so every learnings check, present or future, also runs on the
  template. The file is read in place: a copy has the same bytes. A new check asserts the
  template's sections hold zero bullets.
- D2 (R2): `path` builds `shapes: (Array.isArray(d) ? d : [d]).map((one) => ({ d: one }))`, with
  a comment citing `(013/D2)`. A string gives `[{ d }]`, as today, so `ringana-omega-v2`'s golden
  scene is unchanged. The video's `flatPath` becomes `path` with a list: it spread
  `path(…, ds[0])` and overwrote `shapes`, so the key order and the output stay the same.
  _(source: `lienzo/src/components/path/descriptor.ts`: `shapes: z.array(ShapeSchema).min(1)`,
  `PathMode = "morph" | "layers"`, 024/D1, 057/D1)_
- D3 (R3): `blob` moves from the video's generator unchanged except its signature takes a `box`
  like `particles` does. It calls `path` from `lib/primitives.cjs`. Its `d` string is a
  module-private constant (`BLOB_D`), not exported.
- D4 (R4): `teardrop` moves from the video's `tear(role)`, taking tones instead of a role name so
  `lib/` names no palette role (ARCHITECTURE.md § Brand Parameterization; comment cites
  `(013/D4)`). It builds its children with `path` and `ell` from `lib/primitives.cjs`.
- D5 (R5–R10): text edits only, one task per target document; each one cites the video
  (`ringana-skin-perfection`) as its proof, like the existing omega-v2 notes. Skill text is not
  unit-tested (TESTING.md § What to Skip): each task names the section that must hold the rule,
  and the check is reading it. R9 replaces the `pwa-nav` line in `sources.md`; it does not add a
  second one.
  _(sources: R8 — `lienzo/src/cli/args.ts`, a value starting with `@` is read from that file;
  R9 — `browser-nav/README.md`, `pwa-nav` is a legacy alias of `browser-nav`; the `snapshot`
  limit was observed on ringana.com on 2026-10-31; R7 — ffmpeg `silencedetect`,
  https://ffmpeg.org/ffmpeg-filters.html#silencedetect; R10 — WCAG 2.2 SC 1.4.3,
  https://www.w3.org/TR/WCAG22/#contrast-minimum)_
- D6 (all): each task that promotes a finding appends `— promoted: <path>` to it in the video's
  `learnings.md` (004/R1). `lienzo-animate` → "Start from lib/" lists the new exports;
  `tests/skills/lib-list.test.cjs` guards `blob` and `teardrop`, not the `d` list note (`path`
  is already listed), which is checked by reading.
- D7 (R11): the test's tracking pattern accepts either suffix:
  `— tracks: (https://github.com/<owner>/lienzo/issues/<n>|Lienzo spec \d{3})$`. A spec number
  is enough: the Lienzo roadmap holds its name and status. The pattern lives in a pure
  `isTracked(bullet)` in the test file, so the partitions are table rows over literal bullets;
  the per-video loop stays for the invariant. The file's header comment cites
  `(004/R1, 013/R1, 013/R11)`.
- D8 (R2–R4): the golden test in `tests/videos/scenes.test.cjs` becomes a table over
  `tests/videos/fixtures/<slug>.scene.json`, with `ringana-skin-perfection`'s current
  `scene.json` as its second row, added before the generator switches to the promoted pieces
  (TESTING.md § Regression First).

### Trade-offs
- D2. Pros: one primitive for one- and many-shape paths. Cons: `d` has two types. Mitigation: the
  comment and the skill say so; a string stays the common case.
- D3/D4. Pros: Soft depth's backdrop and drop are ready for the next Soft depth video. Cons: one
  consumer each, below ENGINEERING.md § 1's two; no Soft depth video is on the roadmap yet. Why
  anyway: `ARCHITECTURE.md` § Learning Promotion Seam promotes a verified Piece, and these hold no
  story content (`card` holds a counter and a caption, so it stays). Mitigation: the only call
  sites outside `lib/` are this video's generator, so the next consumer can reshape the
  signature by editing one file.
- D7. Pros: a finding can point at the Lienzo spec that fixes it, without an issue. Cons: the
  test checks the form, not that the spec exists; two suffix forms. Mitigation: step 8 writes the
  number only after the user opens the spec; the Lienzo roadmap lists it.
- D8. Pros: the generator switch is checked byte for byte, and the next golden is one row. Cons:
  the fixture must be refreshed when the video changes on purpose. Mitigation: the video is
  closed out; a deliberate change updates the fixture in the same commit.

## Tasks
- [x] 013/T001 [agent] Tracking pattern (D7) in `tests/videos/learnings.test.cjs`: pure `isTracked(bullet)` with the R11 partitions as table rows over literal bullets; header comment cites `(004/R1, 013/R1, 013/R11)`; `lienzo-animate` step 8 names both suffixes and asks the user whether to open a Lienzo spec per Engine finding; `node --test tests/videos/learnings.test.cjs` — covers R11, D7
- [x] 013/T002 [agent] `videos/ringana-skin-perfection/learnings.md` → Engine: replace the numbered list and its note with one bullet per finding, ending `— tracks: Lienzo spec 087` (contrast), `088` (axis scale), `089` (voice silence), `090` (build from file); `node --test tests/videos/learnings.test.cjs` — covers R11
- [x] 013/T003 [agent] Write the failing test first: the learnings table includes `_template`, whose four sections hold zero bullets and pass the structure and tracking checks; then empty `videos/_template/learnings.md` (D1; the Engine line names the two D7 suffixes); mark the finding `— promoted: videos/_template/learnings.md`; `node --test tests/videos/learnings.test.cjs` — covers R1, D1
- [x] 013/T004 [agent] Golden table (D8): add `ringana-skin-perfection`'s current `scene.json` as `tests/videos/fixtures/ringana-skin-perfection.scene.json`; the golden test in `tests/videos/scenes.test.cjs` becomes a table over its fixtures; `node --test tests/videos/scenes.test.cjs` — covers D8
- [x] 013/T005 [agent] `lib/primitives.cjs` `path` takes a `d` list (D2, comment `(013/D2)`); table test in `tests/lib/primitives.test.cjs` over a string, `[d]` (deep-equals the string's output) and `[d0, d1]` (one shape per `d`, in order); switch the video's `flatPath` to `path`; mark the finding `— promoted: lib/primitives.cjs`; `pnpm test` — covers R2, D2
- [x] 013/T006 [agent] `lib/environment.cjs` `blob` (D3), built on `path`; new `tests/lib/environment.test.cjs` (header cites `(013/R3)`) with a table: `box` → `x, y, w, h`; `top`/`bottom` → `fill.color`/`color2`; `extra.fill` merges and keeps the gradient; `extra.shot`/`tracks` pass through; switch the video's generator to it; mark the finding `— promoted: lib/environment.cjs`; `pnpm test` — covers R3, D3
- [x] 013/T007 [agent] `lib/objects.cjs` `teardrop(tones)` (D4, comment `(013/D4)`), built on `path` and `ell`; new `tests/lib/objects.test.cjs` (header cites `(013/R4)`) with a table: each child takes its tone (`shade`←shadow, `core`←base, `shine`←highlight); switch the video's generator to it; mark the finding `— promoted: lib/objects.cjs`; `pnpm test` — covers R4, D4
- [x] 013/T008 [agent] `lienzo-animate` → "Start from lib/": list `path`'s `d` list, `blob` and `teardrop`; `node --test tests/skills/lib-list.test.cjs` (guards `blob` and `teardrop`; the `d` list note is checked by reading) — covers R2–R4, D6
- [x] 013/T009 [agent] `skills/lienzo-animate/SKILL.md`: R5 (counter) in "Start from lib/" next to `countUp`, and R8 (CLI build, until Lienzo 090) in step 3; mark both findings `— promoted: skills/lienzo-animate/SKILL.md` — covers R5, R8, D5
- [x] 013/T010 [agent] `skills/lienzo-animate/references/drawing.md`: the three R6 rules (one-axis growth until Lienzo 088); mark the three findings `— promoted: skills/lienzo-animate/references/drawing.md` — covers R6, D5
- [x] 013/T011 [agent] `skills/lienzo-storyboard/references/craft.md`: line breaks in "Text on screen", Kokoro padding (−40 dB, until Lienzo 089) in "Voice-over"; mark both findings `— promoted: skills/lienzo-storyboard/references/craft.md` — covers R7, D5
- [x] 013/T012 [agent] `skills/lienzo-research/references/sources.md`: replace the `pwa-nav` line with the R9 `browser-nav` rule; mark the finding `— promoted: skills/lienzo-research/references/sources.md` — covers R9, D5
- [x] 013/T013 [agent] `skills/lienzo-art-direction/references/styles.md`: Soft depth used in `videos/ringana-skin-perfection/brief.md`, with what a white brand changes (R10) — covers R10, D5
- [x] 013/T014 [agent] Check that every `Piece` and `Rule` finding in `videos/ringana-skin-perfection/learnings.md` except `card` ends with `— promoted: <path>`; `pnpm test` — covers D6
