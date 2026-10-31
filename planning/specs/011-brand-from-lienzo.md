# 011 — brand-from-lienzo

## Goal
A video starts from its brand and records only what it changes. The Lienzo project owns the brand
(palette, fonts, canvas defaults, brand guide, assets, a scene's audio); Animator reads it into a
read-only snapshot, fills in what the video leaves out, and keeps no second copy. Verification: a
copied template with a brand snapshot and an empty `palette.json` builds from the brand's colours
and fonts; `omega-v2` still generates its golden scene byte for byte; `pnpm test` passes.

## Context (audit of 2026-10-31, project `ringana`, video `ringana-omega-v2`)
- Everything is configured per video. Brand knowledge (audience, tone, Montserrat, the product's
  aubergine, the food-supplement disclaimer, "text only, no logo") sits inside
  `videos/ringana-omega-v2/brief.md`.
- The only link to the brand is prose: `lienzo-storyboard` step 1 ("read `project_inspect` for brand
  colours and fonts") and `styles.md` ("brand colours replace them by role"). The agent copies
  values by hand, so a brand change never reaches a video.
- `lib/scene.cjs` hardcodes `font: "Montserrat"` in `text` and `label`: RINGANA's font sits in
  the shared library, against `ARCHITECTURE.md` invariant 3. A video for another brand would be in
  Montserrat.
- Role names differ: Lienzo's palette has `primary` (and `surface`); Animator's has `main`.
- `omega-v2/palette.json` has none of the five roles `DESIGN.md` requires (`sea`, `alga`,
  `drop`…), and passes, because `checkPalette` only checks hex values.
- Voice: `scene_build` with `overwrite` keeps the stored scene's audio, so nothing is lost. But
  the brief's voice starts (0.5, 3.4, 9.2, 14.3, 17.4, 21.3 s) no longer match the Lienzo scene
  (0.5, 2.1, 7.1, 12.8, 16.8, 21.3 s): two places hold the same data and they have drifted.

## Requirements
- R1: Each video has `brand.lock.json`, a read-only snapshot of its Lienzo project taken from
  `project_inspect`: `project`, `palette`, `fonts`, `canvas` and `guide` (`null` when the project
  has none). It is refreshed, never edited by hand. Partitions: full brand, brand with only
  `primary`, no fonts, `guide: null`, missing `project` (invalid), unknown key (invalid).
- R2: Animator uses Lienzo's role names: `background`, `primary`, `secondary`, `accent`, `text`
  (required after resolution) and `surface` (optional). `main` is gone from `lib/`, the template,
  the skills and the docs.
- R3: `resolvePalette(lock, overrides)` returns the palette a generator uses. Each brand role gets
  `shadow` and `highlight` derived from its `base` with the D3 rule (perceptual lightness plus a
  small hue shift, not a plain lightness change). `palette.json` overrides any role or single
  tone and adds the video's own story roles (`sea`, `alga`…). A required role missing after the
  merge fails with an error that names it and says where to set it (Lienzo brand or
  `palette.json`). Partitions: no overrides, a tone override, a whole-role override, a story role,
  a missing required role, a bad hex, base `#000000` and `#FFFFFF` (derivation clamps; the
  highlight of white is white), a dark base (OKLCH L < 40), a near-grey base (no hue shift), a
  saturated base whose shifted tone falls out of sRGB (chroma is reduced until it fits), and a
  base whose hue is within 6° of the target (it stops at the target, never past it).
- R4: Fonts come from the brand: `sceneHelpers` takes `fonts` (`heading` and `body`, each
  `{ family, weight }`) resolved from the lock, and `lib/` names no font family. Partitions:
  heading and body declared, only body, none (falls back to the system default in `DESIGN.md`).
- R5: Precedence is written down and followed: what the video's brief or `palette.json` sets wins;
  anything it leaves out comes from the brand; anything the brand lacks comes from the system
  defaults (`DESIGN.md` and the skills). The brief template has a `## Brand` section (project,
  snapshot date, overrides) and lists only overrides and story roles in its palette table.
- R6: The skills read the brand at fixed steps:
  - `lienzo-storyboard` step 1 writes the snapshot and applies the guide (audience, tone,
    mandatory text, disclaimers);
  - `lienzo-art-direction` writes only overrides and story roles;
  - `lienzo-research` takes claim rules from the guide;
  - `lienzo-animate` step 1 refreshes the snapshot and reports any drift from the brief before
    building.

  When the brand lacks something (no guide, missing role, no fonts), the agent proposes values and
  writes them to Lienzo (`project_update`) only after the user agrees.
- R7: A scene's audio belongs to the Lienzo scene. Generators never write `audioTracks`, and
  `scene_build` with `overwrite` keeps them. The brief holds the voice script only, and points to
  the Lienzo scene for timings.
- R8: `ringana-omega-v2` is migrated:
  - it has a snapshot of project `ringana`;
  - its `palette.json` holds only story roles and overrides;
  - its generator uses `resolvePalette` and brand fonts;
  - its brief has the `## Brand` section, and its voice timings point to Lienzo;
  - its `scene.json` stays byte-identical to the golden fixture.
- R9: The storyboard's length guidance is based on data and separates the two goals. For
  completion (an explanation or a product message), 15–30 s; for reach, 45–60 s, only if the
  story holds; never over 90 s. The duration defaults to the brand's `canvas.duration` unless the
  brief sets one.

### Who it serves
Every new video for an existing brand: it starts from the brand and states only what differs.

### Out of scope
- Storing the brand guide or asset folders in Lienzo (Lienzo spec 086).
- Lienzo's `custom` colours. They have no role, so they are not mapped; a video that needs one
  adds a story role.
- Versioning Lienzo brand data (a Lienzo roadmap idea).

### Dependencies
- Lienzo 086: `project_inspect` returns `guide`, and `ringana` declares its fonts and has a clean
  manifest.
- 004 (close-out). Its promotion rules are unchanged.

### Owner split
Agent tasks. The user approves each write to the Lienzo brand (R6) and the migrated brief.

## Design
### Approach

- D1 (R1): `lib/brand.cjs` exports two pure functions:
  - `brandLock(inspect)` picks `manifest.project`, `manifest.palette`, `manifest.fonts`,
    `manifest.canvas` and `guide` from a `project_inspect` result;
  - `checkBrandLock(lock)` validates the shape and throws on a missing `project` or an unknown key.

  The agent writes `JSON.stringify(brandLock(result), null, 1)` to `videos/<slug>/brand.lock.json`.
  Generators read the file, never Lienzo, so they stay pure (`ARCHITECTURE.md` invariant 2) and
  the golden tests stay reproducible. _(standard: lockfiles as pinned, generated snapshots —
  https://pnpm.io/git#lockfiles)_
- D2 (R2): Roles follow Lienzo's `ColorPaletteSchema` (`primary`, `secondary`, `accent`,
  `background`, `surface`, `text`). The owner sets the vocabulary, so no mapping table is needed.
  `DESIGN.md`'s "never rename these five" rule now lists `primary` instead of `main`.
  _(source: `lienzo/src/model/project.ts`)_
- D3 (R3): `tones(base)` in `lib/palette.cjs` works in OKLCH, because HSL lightness does not match
  perceived lightness across hues (yellow and blue at the same HSL L look far apart). The shadow
  and the highlight are computed like this:
  - **shadow:** L − 12 points (− 8 when the base L is under 40, where there is little room left),
    chroma × 0.85, and the hue rotated up to 6° toward 300 (blue-violet) along the shorter arc;
  - **highlight:** L + 12 points (at most 97, never below the base), chroma kept, and the hue
    rotated up to 6° toward 100 (yellow);
  - a near-grey base (chroma < 0.02) gets no hue shift;
  - if a tone falls outside sRGB, its chroma is lowered until it fits (CSS Color 4 gamut mapping),
    and the result is rounded to `#RRGGBB`.

  It is pure and deterministic, and overrides always beat derived tones.

  Shading toward black or toward a lighter value of the same hue makes colours muddy. Illustrators
  instead shift shadows toward a cool hue and highlights toward a warm one. The numbers are
  calibrated on `omega-v2`'s hand-picked tones, the approved quality bar. All five of its shaded
  roles follow the same pattern: shadow ΔL −7…−16, highlight ΔL +10…+16, hue shift ≤ 11°, shadows
  toward violet, highlights toward yellow. A prototype of this rule lands at a mean ΔE(OKLab) of
  0.027 from those tones (max 0.044). _(standards: CSS Color Module Level 4, OKLab/OKLCH and gamut
  mapping — https://www.w3.org/TR/css-color-4/#ok-lab, https://www.w3.org/TR/css-color-4/#gamut-mapping;
  OKLCH vs HSL for tonal ramps — https://colorbox.io/oklch-vs-hsl; hue shifting in shadows and
  highlights — https://www.slimesalad.com/forum/viewtopic.php?p=116457,
  https://en.wikipedia.org/wiki/Tint,_shade_and_tone)_
- D4 (R3): `resolvePalette(lock, overrides)` works in four steps:
  1. turn each brand hex into `{ base, ...tones(base) }`;
  2. merge `overrides` per role and per tone (an override role may be a story role);
  3. run the existing `checkPalette`;
  4. check the five required roles.

  `checkPalette` stays as it is, as the hex/tone check.
- D5 (R4): `brandFonts(lock)` in `lib/brand.cjs` returns:
  - `heading`: the family of the `heading` role, at its highest weight;
  - `body`: the family of the `body` role, at its lowest weight.

  A missing heading falls back to body, and no fonts at all falls back to the system default
  named in `DESIGN.md` (assumed: Lienzo's bundled sans; chosen at implementation). `sceneHelpers`
  requires `fonts`; `text` and `label` use `fonts.heading` unless `extra.font` says `body`.
  _(source: Lienzo `BrandFontSchema` roles)_
- D6 (R5): The brief template gains `## Brand`, with project, snapshot date and "Overrides: <list>
  or none". Its palette table lists only overrides and story roles. One sentence states the
  precedence. `DESIGN.md` gets a "Brand inheritance" section with the same rule.
- D7 (R6): Skill edits name the exact tool and file at each step. Storyboard step 1:
  `project_inspect` → `brand.lock.json` → read `guide`. Animate step 1: re-run `project_inspect`
  and, if the snapshot changed since the brief, show the diff and ask before building. The brand
  write-back (`project_update`) is an explicit step with user confirmation, never a side effect of
  making a video.
- D8 (R7): `lienzo-animate` states that `scene_generate_speech` / `scene_update` own the voice
  and that generators leave `audioTracks` out. The brief template's "Audio" section keeps the
  script and drops start times. _(source: Lienzo `scene_build`: "Overwriting keeps the stored
  scene's audio unless `audioTracks` is given")_
- D9 (R8): The migration of `omega-v2` keeps its story roles (`sea`, `alga`, `drop`, `capsule`,
  `organ`, `body`, `seabed`, `fg`, `algaFar`, `low`) in `palette.json`. The generator only uses
  those and `text`, so the output does not change when `ringana`'s brand palette is corrected
  (Lienzo 086/T012). Fonts resolve to Montserrat 800 / 500 from the snapshot. The golden test is
  the proof.
- D11 (R9): `skills/lienzo-storyboard/references/craft.md` gets a "Platform length" note above its
  duration table:
  - completion falls as length grows (Reels: about 78 % at 15 s in a 50-Reel test; TikTok: 0–10 s
    completes best and 21–34 s averages 62 % vs 48 % over 60 s);
  - reach and engagement peak at 45–60 s for brand Reels (Socialinsider, 6 M Reels, H1 2026);
  - Instagram says there is no single ideal length, and long Reels get less distribution.

  So the default band is 15–30 s, and 45–60 s is a deliberate choice for reach. Storyboard step 1
  takes `canvas.duration` from the snapshot as the default and states any change in the brief.
  _(sources, mostly vendor studies, so directional: https://www.bytecap.io/research/best-instagram-reels-length,
  https://creatorhouse.app/blog/instagram-reel-length-2026-test,
  https://www.highviz.io/blog/how-long-should-instagram-reels-be/,
  https://www.fanpagekarma.com/insights/optimal-tiktok-video-length/,
  https://www.opus.pro/blog/tiktok-length-format-retention-data,
  https://buffer.com/resources/instagram-reels-length)_
- D10 (R1, R3, R4): `tests/lib/brand.test.cjs` and `tests/lib/palette.test.cjs` are table-driven
  over the partitions in R1, R3 and R4, with AAA structure and no branches in test bodies. The
  template test edits the snapshot (brand colour flows through) and `palette.json` (override wins).
  _(source: `TESTING.md`, standard: `node:test` — https://nodejs.org/api/test.html)_

### Deliverables

- New:
  - `lib/brand.cjs`;
  - `tests/lib/brand.test.cjs`;
  - `videos/_template/brand.lock.json` (neutral sample brand, today's template colours under
    Lienzo role names);
  - `videos/ringana-omega-v2/brand.lock.json`.
- Changed:
  - code: `lib/palette.cjs` (`tones`, `resolvePalette`), `lib/scene.cjs` (`fonts`, no family
    names);
  - template: `videos/_template/{palette.json,scene.gen.cjs,brief.md}`;
  - migrated video: `videos/ringana-omega-v2/{palette.json,scene.gen.cjs,brief.md}`;
  - skills: `skills/lienzo-storyboard/` (SKILL.md, `references/brief-template.md`,
    `references/craft.md`),
    `skills/lienzo-art-direction/` (SKILL.md, `references/styles.md`),
    `skills/lienzo-research/references/claims.md`, `skills/lienzo-animate/SKILL.md`;
  - tests: `tests/lib/palette.test.cjs`, `tests/videos/template.test.cjs`;
  - docs: `ARCHITECTURE.md`, `DESIGN.md`, `PRODUCT.md`, `README.md`, `CHANGES.md`.
- Unchanged: `videos/ringana-omega-v2/scene.json` and its golden fixture.

### Sequencing

1. `lib/` first (T001–T007), with its tests, so the template and the migration build on checked
   pieces.
2. Then the template and its test (T008–T010). After that, every new video copies the new shape.
3. Then the skills and docs (T011–T017).
4. The `omega-v2` migration (T018–T021) waits for Lienzo 086/T012 (clean `ringana` with declared
   fonts) and its guide.

### Trade-offs

- D1. Pros: generators stay pure and testable offline, and the snapshot shows exactly what brand
  a video was built with. Cons: a snapshot is a copy and can go stale. Mitigation: it is never
  edited by hand, and animate step 1 refreshes it and reports drift before every build.
- D2. Pros: one vocabulary across both repos, and no mapping code. Cons: renaming `main` touches
  the template, the skills and the docs. Mitigation: `omega-v2` never used `main`, so no
  generated scene changes, and a repo-wide search confirms nothing still says `main`.
- D3. Pros: every brand colour gets depth tones with no manual work, in the same style as the
  approved piece: perceptually even steps and lively, non-muddy shadows. Cons: OKLCH conversion
  and gamut mapping add about 60 lines of colour math to `lib/` (no dependencies allowed), and one
  fixed rule cannot suit every material. Mitigation: the math is the published CSS Color 4
  matrices and is tested against reference values; any tone can be overridden in `palette.json`;
  T005 reports how far the rule lands from `omega-v2`'s hand-picked tones.
- D4. Pros: `palette.json` shrinks to what the video changes. Cons: one more step between
  `palette.json` and the colours on screen. Mitigation: the error names the role and both places
  it can be set.
- D5. Pros: fonts follow the brand, and `lib/` holds no brand. Cons: `sceneHelpers` gets one more
  required argument. Mitigation: only two generators exist (template, `omega-v2`), and both are
  updated in this spec.
- D7. Pros: brand data is only written on purpose. Cons: one more confirmation for the user.
  Mitigation: it happens only when the brand lacks something, once per brand.
- D8. Pros: a single owner for voice timing, which the user tunes in Lienzo's editor. Cons: the
  repo alone cannot rebuild the voice into a new scene. Mitigation: `scene_generate_speech` with
  the brief's script recreates it; the Lienzo issue
  https://github.com/SebassContreras/lienzo/issues/10 tracks carrying tracks between scenes.

## Tasks
- [ ] 011/T001 [agent] `lib/brand.cjs`: `brandLock(inspect)` and `checkBrandLock(lock)` — covers R1, D1
- [ ] 011/T002 [agent] Table test (`tests/lib/brand.test.cjs`) for the R1 partitions — covers R1, D10
- [ ] 011/T003 [agent] `lib/palette.cjs`: `tones(base)` (OKLCH: shadow L −12 / −8 under L 40, C ×0.85, hue ≤6° toward 300; highlight L +12 capped at 97 and never below the base, hue ≤6° toward 100; no shift for near-grey; gamut-map by lowering chroma) and `resolvePalette(lock, overrides)` with the required-role check — covers R2, R3, D2, D3, D4
- [ ] 011/T004 [agent] Table test (`tests/lib/palette.test.cjs`) for the R3 partitions, including `#000000`, `#FFFFFF`, a dark base, a near-grey base, an out-of-gamut case and the stop-at-target hue case, plus sRGB↔OKLab round-trips against CSS Color 4 reference values — covers R3, D3, D10
- [ ] 011/T005 [agent] Verify: report the ΔE(OKLab) between `tones()` and each hand-picked tone in `videos/ringana-omega-v2/palette.json` (expected mean ≈ 0.03); no assertion, the report informs any retuning — covers D3
- [ ] 011/T006 [agent] `lib/brand.cjs`: `brandFonts(lock)`; `lib/scene.cjs`: `sceneHelpers` requires `fonts`, and no font family is named in `lib/` — covers R4, D5
- [ ] 011/T007 [agent] Table test of `brandFonts` and `sceneHelpers` font use for the R4 partitions; Verify: `grep -rn "Montserrat" lib/` returns nothing — covers R4, D10
- [ ] 011/T008 [agent] Template: add `brand.lock.json` (neutral brand, Lienzo role names), reduce `palette.json` to `{}`, use `resolvePalette` and `brandFonts` in `scene.gen.cjs`, and use `primary` instead of `main` — covers R1, R2, R3, R4
- [ ] 011/T009 [agent] Template `brief.md` and `skills/lienzo-storyboard/references/brief-template.md`: add the `## Brand` section, state the precedence, list only overrides and story roles in the palette table, keep the voice script only — covers R5, R7, D6, D8
- [ ] 011/T010 [agent] `tests/videos/template.test.cjs`: a brand colour in the snapshot reaches the scene, and a `palette.json` override beats it — covers R3, R5, D10
- [ ] 011/T011 [agent] `lienzo-storyboard` step 1: write the snapshot from `project_inspect`, apply the guide, and propose plus confirm a `project_update` when the brand lacks something — covers R6, D7
- [ ] 011/T012 [agent] `lienzo-art-direction` SKILL.md and `references/styles.md`: `palette.json` holds only overrides and story roles; roles use `primary`; "Bright science" shading ("same hue, −15 % lightness") is replaced by the D3 rule (derived tones; shadows cooler, highlights warmer) — covers R2, R3, R6, D2, D3
- [ ] 011/T013 [agent] `lienzo-storyboard/references/craft.md`: add the "Platform length" note with its sources; storyboard step 1 takes the default duration from the snapshot — covers R9, D11
- [ ] 011/T014 [agent] `lienzo-research/references/claims.md`: claim rules and disclaimers come from the brand guide, and the RINGANA example points to it — covers R6
- [ ] 011/T015 [agent] `lienzo-animate` SKILL.md: step 1 refreshes the snapshot and reports drift; the `lib/` list shows `brand.cjs`, `resolvePalette` and `fonts`; audio belongs to the Lienzo scene — covers R6, R7, D7, D8
- [ ] 011/T016 [agent] `ARCHITECTURE.md` (Lienzo owns the brand; `brand.lock.json` in the video folder; data-flow diagram) and `DESIGN.md` (roles, derived tones, "Brand inheritance") — covers R2, R5, D2, D6
- [ ] 011/T017 [agent] `PRODUCT.md`, `README.md` and `CHANGES.md` (`main` → `primary`; palette ownership moves to the Lienzo project); Verify: a repo-wide search finds no `main` palette role — covers R2, R5
- [ ] 011/T018 [agent] `omega-v2`: write `brand.lock.json` from `project_inspect` of `ringana` (after Lienzo 086/T012–T013) — covers R8, D9
- [ ] 011/T019 [agent] `omega-v2`: `palette.json` keeps only story roles; `scene.gen.cjs` uses `resolvePalette` and `brandFonts`; Verify: the golden test passes byte for byte — covers R8, D9
- [ ] 011/T020 [agent] `omega-v2/brief.md`: add the `## Brand` section, move brand content now held by the Lienzo guide out of the brief, and replace the voice start times with a pointer to the Lienzo scene — covers R5, R7, R8
- [ ] 011/T021 [human] Review the migrated `omega-v2` brief and the `ringana` brand it now inherits from — covers R8
