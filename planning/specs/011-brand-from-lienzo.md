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
  the shared library, against the intent of `ARCHITECTURE.md` invariant 3 (which today names
  colours only; T020 extends it to fonts). A video for another brand would be in Montserrat.
- Role names differ: Lienzo's palette has `primary` (and `surface`); Animator's has `main`.
- `omega-v2/palette.json` has none of the five roles `DESIGN.md` requires (`sea`, `alga`,
  `drop`…), and passes, because `checkPalette` only checks hex values.
- `ringana`'s brand `text` is `#000000`, while `omega-v2` draws white text (`#FFFFFF`) on a dark
  sea: a video can rightly differ from its brand, so overrides are needed.
- Voice: `scene_build` with `overwrite` keeps the stored scene's audio, so nothing is lost. But
  the brief's voice starts (0.5, 3.4, 9.2, 14.3, 17.4, 21.3 s) no longer match the Lienzo scene
  (0.5, 2.1, 7.1, 12.8, 16.8, 21.3 s): two places hold the same data and they have drifted. The
  brief's palette table repeats `palette.json`'s hexes the same way.
- The user deleted the `omega-v2` scene from Lienzo on purpose on 2026-10-31, after Lienzo 086
  closed, and it is not rebuilt; its six unused voice clips were deleted the same day. The
  video keeps its generator, `scene.json` and golden fixture in Animator, so its migration still
  proves the brand pieces; only its voice has no Lienzo scene to point to.

## Requirements
- R1: Each video has `brand.lock.json`, the snapshot of its Lienzo project in the D1 schema. The
  file is always `brandLock(result)` of a `project_inspect` result, written by the R6 skill steps;
  it is never edited by hand. Partitions (`brandLock`, `checkBrandLock`):
  - full brand → the five keys `project`, `palette`, `fonts`, `canvas`, `guide`;
  - palette with only `primary` → valid (the required roles are R10's);
  - `fonts: []` → valid;
  - no `guide` in the result → `guide: null`;
  - extra keys in the result (`name`, `createdAt`, palette `custom`…) → dropped;
  - a palette colour that is not `#RRGGBB` (Lienzo also accepts `rgb()`, `hsl()` and CSS names) →
    invalid, the error names the role;
  - missing `project` → invalid;
  - a missing canvas field → invalid, the error names it;
  - an unknown key in the lock → invalid, the error names it.

  Invariant: for every valid `project_inspect` result `x`, `checkBrandLock(brandLock(x))` does not
  throw.
- R2: Animator uses Lienzo's role names: `background`, `primary`, `secondary`, `accent`, `text`
  (required after resolution) and `surface` (optional). `main` is gone from `lib/`, the template,
  the skills and the current docs. Verify:
  `` grep -rnE '\.main\b|"main" *:|\| *main *\||`main`' lib videos skills ARCHITECTURE.md DESIGN.md PRODUCT.md README.md ``
  returns nothing; `CHANGES.md` history and `planning/` keep the old name.
- R3: `tones(base)` derives `shadow` and `highlight` from a base with the D3 rule (perceptual
  lightness plus a small hue shift, not a plain lightness change). Partitions:
  - a mid base;
  - base L exactly 40 (shadow −12) and just under 40 (shadow −8);
  - base L between 85 and 97 (highlight capped at 97);
  - base L above 97 (highlight keeps the base L);
  - `#000000` (the shadow is black) and `#FFFFFF` (the highlight is white);
  - chroma exactly 0.02 (hue shift) and just under (no hue shift);
  - a hue within 6° of the target (it stops at the target, never past it);
  - a hue on the far side of 0°/360° from the target (the shorter arc wraps through 0°);
  - a saturated base whose shifted tone falls out of sRGB (chroma is reduced until it fits).

  Invariants: every tone is `#RRGGBB`; `L(shadow) ≤ L(base) ≤ L(highlight)`, allowing 8-bit
  rounding (±0.5 L); the same base always gives the same tones.
- R4: Fonts come from the brand: `sceneHelpers` takes `fonts` (`heading` and `body`, each
  `{ family, weight }`), which `brandFonts(lock)` resolves (D5), and `lib/` names no brand font
  family. Partitions:
  - heading and body declared;
  - only body (heading = body);
  - only heading (body = heading);
  - none, or only `accent`/`mono` (both are `DEFAULT_FONTS`: Inter 800 / Inter 400);
  - two fonts with the same role (the first wins);
  - a role with several weights (heading takes the highest, body the lowest);
  - a role with one weight.
- R5: Precedence is written down and followed. What the video sets wins; anything it leaves out
  comes from the brand; anything the brand lacks comes from the system:

  | Value | Video | Brand (lock) | System |
  |---|---|---|---|
  | colour role or tone | `palette.json` | lock palette + derived tones (R3) | none: a missing required role fails (R10) |
  | fonts | the generator passes its own `fonts` to `sceneHelpers` | `brandFonts(lock)` | `DEFAULT_FONTS` (R4) |
  | duration | the brief | `canvas.duration` | never reached: Lienzo always has one (D11) |

  Of the canvas, only `duration` is inherited in this spec; `width`, `height` and `fps` stay set
  in each generator, and the lock records them so drift reports show them. The brief template has
  a `## Brand` section (the Lienzo project, and the names of the roles `palette.json` overrides,
  or "none"). Its palette table lists each override and story role with what it paints; hex
  values live only in `palette.json`.
- R6: The skills read the brand at fixed steps:
  - `lienzo-storyboard` step 1 writes the snapshot with the D7 command and applies the guide
    (audience, tone, mandatory text, disclaimers, format and length);
  - `lienzo-art-direction` writes only overrides and story roles;
  - `lienzo-research` takes claim rules from the guide;
  - `lienzo-animate` step 1 compares `brandLock(project_inspect)` with the saved
    `brand.lock.json`, shows the changed keys, and rewrites the lock only when the user accepts.

  When the brand lacks something (no guide, missing role, no fonts), the agent proposes values and
  writes them to Lienzo (`project_update`) only after the user agrees.
- R7: A scene's audio belongs to the Lienzo scene. Generators never write `audioTracks`, and
  `scene_build` with `overwrite` keeps them. The brief holds the voice script only, and points to
  the Lienzo scene for timings. Invariant: no `scene.json` a generator in `videos/` writes has an
  `audioTracks` key.
- R8: `ringana-omega-v2` is migrated:
  - it has a snapshot of project `ringana`;
  - its `palette.json` holds only its story roles and its `text` override (`#FFFFFF`);
  - its generator uses `checkBrandLock`, `resolvePalette` and brand fonts;
  - its brief has the `## Brand` section and keeps the voice script with no start times (its
    Lienzo scene was deleted, so there is nothing to point to);
  - its `scene.json` stays byte-identical to the golden fixture.
- R9: A video's duration is the brief's; when the brief sets none, the brand's
  `canvas.duration`, confirmed by the user (D11). Partitions: the brief sets one; the brief sets
  none and the brand has one. Choosing a length for the platform is spec 012.
- R10: `resolvePalette(lock, overrides)` returns the palette a generator uses (D4). `palette.json`
  overrides any role or single tone and adds the video's own story roles (`sea`, `alga`…).
  Partitions:
  - no overrides;
  - a tone override on a brand role;
  - a base-only override on a brand role (its tones re-derive from the new base);
  - a whole-role override;
  - a story role with only `base` (it gets derived tones);
  - a story role with only a tone and no `base` → invalid, the error names it;
  - each of the five required roles missing, one row per role → the error names it and says where
    to set it (Lienzo brand or `palette.json`);
  - two required roles missing → the error names both;
  - a bad hex in `palette.json` → invalid, the error names the role.

  Invariants: every tone `palette.json` sets reaches the output unchanged; the inputs are not
  mutated; the same inputs always give the same output.

### Who it serves
Every new video for an existing brand: it starts from the brand and states only what differs.

### Out of scope
- Storing the brand guide or asset folders in Lienzo (Lienzo spec 086).
- Lienzo's `custom` colours. They have no role, so they are not mapped; a video that needs one
  adds a story role.
- Versioning Lienzo brand data (a Lienzo roadmap idea).
- Inheriting the canvas `width`, `height` and `fps` (R5).
- Length guidance per platform (spec 012).

### Dependencies
- Lienzo 086: `project_inspect` returns `guide`, and `ringana` declares its fonts, all five
  required roles and a clean manifest. (On 2026-10-31, `project_inspect` of `ringana` already
  returns its guide, Montserrat 800 / 500 and all five roles, with no notices.)
- 004 (close-out). Its promotion rules are unchanged.

### Owner split
Agent tasks. The user approves each write to the Lienzo brand (R6), each lock rewrite after a
drift report (R6), and the migrated brief.

## Design
### Approach

- D1 (R1): `lib/brand.cjs` opens with
  `// Brand snapshot: builds and checks brand.lock.json and picks its fonts (011/D1, D5).` and
  exports pure functions:
  - `brandLock(inspect)` picks `manifest.project`, `manifest.palette` (without `custom`),
    `manifest.fonts`, `manifest.canvas` and `guide` (`null` when absent) from a `project_inspect`
    result;
  - `checkBrandLock(lock)` validates the schema below and returns the lock, or throws an error
    naming the bad key or role.

  The lock schema is Animator's only view of the brand; only `brandLock` reads the
  `project_inspect` shape:
  - `project`: the project slug (string);
  - `palette`: `{ primary, secondary?, accent?, background?, surface?, text? }`, each `#RRGGBB`;
  - `fonts`: `[{ family, role, weights }]`, `role` one of `heading`, `body`, `accent`, `mono`;
  - `canvas`: `{ width, height, fps, duration }`;
  - `guide`: the brand guide's Markdown, or `null`.

  The R6 skill steps write it with the D7 command, as `JSON.stringify(lock, null, 1)` (the format
  generators use for `scene.json`). Generators call
  `const lock = checkBrandLock(require("./brand.lock.json"))` once, as they call `checkPalette`
  today, and pass `lock` to `resolvePalette` and `brandFonts`. They read the file, never Lienzo,
  so they stay pure (`ARCHITECTURE.md` invariant 2) and the golden tests stay reproducible.
  _(sources: `lienzo/src/model/project.ts` `ColorPaletteSchema`, `BrandFontSchema`,
  `ProjectCanvasDefaultsSchema`; `lienzo/src/model/color.ts` `isColor`; `project_inspect` of
  `ringana` on 2026-10-31. Standard: lockfiles as pinned, generated snapshots that change only on
  an explicit install — https://pnpm.io/git#lockfiles)_
- D2 (R2): Roles follow Lienzo's `ColorPaletteSchema` (`primary`, `secondary`, `accent`,
  `background`, `surface`, `text`). The owner sets the vocabulary, so no mapping table is needed.
  `DESIGN.md`'s "never rename these five" rule now lists `primary` instead of `main`. The R2
  search is the check. _(source: `lienzo/src/model/project.ts`)_
- D3 (R3): `tones(base)` in `lib/palette.cjs` works in OKLCH, because HSL lightness does not match
  perceived lightness across hues (yellow and blue at the same HSL L look far apart). The shadow
  and the highlight are computed like this:
  - **shadow:** L − 12 points (− 8 when the base L is under 40, where there is little room left),
    chroma × 0.85, and the hue rotated up to 6° toward 300 (blue-violet) along the shorter arc;
  - **highlight:** L + 12 points (at most 97, never below the base), chroma kept, and the hue
    rotated up to 6° toward 100 (yellow);
  - a near-grey base (chroma < 0.02) gets no hue shift;
  - if a tone falls outside sRGB, its chroma is reduced with the CSS Color 4 gamut-mapping
    algorithm (binary search on OKLCH chroma, JND 0.02, ε 0.0001), so each base maps to one exact
    tone, rounded to `#RRGGBB`.

  It is pure and deterministic, and overrides always beat derived tones. The sRGB↔OKLab matrices
  are the CSS Color 4 sample code. Test reference values come from Color.js, the library by the
  CSS Color 4 editors, run once with the same rule. Lienzo's `src/engine/color.ts`
  (`rgbToOklch`, `oklchToRgb`) is a cross-check only: it clamps instead of gamut-mapping, and it
  is TypeScript in another repo.

  Shading toward black or toward a lighter value of the same hue makes colours muddy; shadows
  shifted toward a cool hue and highlights toward a warm one stay lively. The evidence for the
  numbers is `omega-v2`'s hand-picked tones, the approved quality bar. All five of its shaded
  roles follow the same pattern: shadow ΔL −7…−16, highlight ΔL +10…+16, hue shift ≤ 11°, shadows
  toward violet, highlights toward yellow. A prototype of this rule lands at a mean ΔE(OKLab) of
  0.027 from those tones (max 0.044). _(standards: CSS Color Module Level 4, OKLab/OKLCH, sample
  code and gamut mapping — https://www.w3.org/TR/css-color-4/#ok-lab,
  https://www.w3.org/TR/css-color-4/#color-conversion-code,
  https://www.w3.org/TR/css-color-4/#gamut-mapping; reference implementation —
  https://colorjs.io; OKLCH vs HSL for tonal ramps — https://colorbox.io/oklch-vs-hsl. Background
  reading on hue shifting, not evidence: https://www.slimesalad.com/forum/viewtopic.php?p=116457,
  https://en.wikipedia.org/wiki/Tint,_shade_and_tone)_
- D4 (R10, R3): `resolvePalette(lock, overrides)` works in five steps:
  1. turn each brand hex into `{ base }`;
  2. merge `overrides` per role and per tone (an override role may be a story role);
  3. run the existing `checkPalette`, so every role has a valid base before any derivation;
  4. fill each missing `shadow` and `highlight` with `tones(base)` of the merged base, for brand
     and story roles alike;
  5. check `REQUIRED_ROLES` (a constant in `lib/palette.cjs`), naming every missing role and both
     places to set it.

  `checkPalette` stays as it is, as the hex/tone check.
- D5 (R4): `brandFonts(lock)` in `lib/brand.cjs` returns `{ heading, body }`, each
  `{ family, weight }`:
  - `heading`: the first `heading` font, at its highest declared weight;
  - `body`: the first `body` font, at its lowest declared weight.

  Headlines take the heaviest cut the brand ships, and running text the regular one. A missing
  role takes the other's. With neither, both come from `DEFAULT_FONTS` (a constant in
  `lib/brand.cjs`): Inter 800 / Inter 400. Inter is Lienzo's first bundled family, the one its
  own components use, and it ships 400, 600, 700 and 800. `DESIGN.md` records the default.
  `sceneHelpers` requires `fonts`; `text` and `label` use `fonts.heading` (family and weight)
  unless `extra.font` says `body`, and `extra.weight` still overrides the weight.
  _(sources: `lienzo/src/model/fonts.ts` `FONTS`, `BUNDLED_WEIGHTS`; `lienzo/src/model/project.ts`
  `BrandFontSchema`)_
- D6 (R5): The brief template gains `## Brand`, with the Lienzo project and "Overrides: <role
  names> or none". Its palette table lists each override and story role with what it paints, and
  no hex values. One sentence states the precedence. `DESIGN.md` gets a "Brand inheritance"
  section with the R5 table, and its "Single source" line says hex values live only in
  `palette.json`.
- D7 (R6): Skill edits name the exact tool and file at each step.
  - Storyboard step 1: call `project_inspect`, save its JSON result to a temp file, then run
    `node -e "const fs=require('fs');const {brandLock,checkBrandLock}=require('./lib/brand.cjs');const [src,out]=process.argv.slice(1);fs.writeFileSync(out,JSON.stringify(checkBrandLock(brandLock(JSON.parse(fs.readFileSync(src,'utf8')))),null,1))" <temp file> videos/<slug>/brand.lock.json`,
    then read `guide`. The agent never types lock values, and never uses shell redirection, which
    re-encodes the file on PowerShell.
  - Animate step 1: re-run `project_inspect`, write the fresh lock to a temp file with the same
    command, compare it with `brand.lock.json`, show the changed keys, and replace the lock only
    when the user accepts.
  - The brand write-back (`project_update`) is an explicit step with user confirmation, never a
    side effect of making a video.
- D8 (R7): `lienzo-animate` states that `scene_generate_speech` / `scene_update` own the voice
  and that generators leave `audioTracks` out. The brief template's "Audio" section keeps the
  script and drops start times. _(source: Lienzo `scene_build`: "Overwriting keeps the stored
  scene's audio unless `audioTracks` is given")_
- D9 (R8): The migration of `omega-v2` keeps its story roles (`sea`, `alga`, `drop`, `capsule`,
  `organ`, `body`, `seabed`, `fg`, `algaFar`, `low`) and its `text` override (`#FFFFFF`;
  `ringana`'s brand `text` is `#000000`) in `palette.json`. The generator only uses those, so the
  output does not depend on `ringana`'s brand colours. The brand must still declare the five
  required roles, or `resolvePalette` fails. Fonts resolve to Montserrat 800 / 500 from the
  snapshot. The golden test is the proof. Its Lienzo scene was deleted on 2026-10-31 and is not
  rebuilt, so the brief drops the voice start times without pointing anywhere.
- D10 (R1, R3, R4, R7, R10): Tests are table-driven, with AAA structure and no branches in test
  bodies _(source: `TESTING.md`, standard: `node:test` — https://nodejs.org/api/test.html)_:
  - `tests/lib/brand.test.cjs` covers the R1 and R4 partitions and invariants;
  - `tests/lib/palette.test.cjs` covers the R3 and R10 partitions and invariants, through the
    public functions only (nothing is exported just for a test);
  - the `sceneHelpers` test uses a sentinel font, so any hardcoded family fails, not only
    Montserrat;
  - the template test edits the snapshot (a brand colour flows through) and `palette.json` (an
    override wins);
  - `tests/videos/scenes.test.cjs` gains the R7 invariant, as a table over every video;
  - `tests/skills/lib-list.test.cjs` becomes one table over every `lib/*.cjs`, so `brand.cjs`
    and any later module are guarded without a new copied test.

  Tripwire: the partition tables come to about 50 cases, above three times the 10 requirements.
  Each row is one partition or invariant named in R1, R3, R4, R7 or R10, so the excess is the
  partition list itself, not duplicated tests.
- D11 (R9): Storyboard step 1 takes the brief's duration. When the brief sets none, it takes
  `canvas.duration` from the snapshot and asks the user to confirm it, because Lienzo always has
  a value (5 s by default), so a brand that never set it looks the same as one that chose 5 s.
  When the guide has length rules, step 1 states them next to the value. The brief records the
  duration and where it came from. _(source: `lienzo/src/model/project.ts`
  `ProjectCanvasDefaultsSchema`)_

### Deliverables

- New:
  - `lib/brand.cjs`;
  - `tests/lib/brand.test.cjs`;
  - `videos/_template/brand.lock.json` (neutral sample brand: today's template colours under
    Lienzo role names, `fonts: []` so the template shows the default);
  - `videos/ringana-omega-v2/brand.lock.json`.
- Changed:
  - code: `lib/palette.cjs` (`tones`, `resolvePalette`, `REQUIRED_ROLES`), `lib/scene.cjs`
    (`fonts`, no family names);
  - template: `videos/_template/{palette.json,scene.gen.cjs,brief.md}`;
  - migrated video: `videos/ringana-omega-v2/{palette.json,scene.gen.cjs,brief.md}`;
  - skills: `skills/lienzo-storyboard/` (SKILL.md, `references/brief-template.md`),
    `skills/lienzo-art-direction/` (SKILL.md, `references/styles.md`),
    `skills/lienzo-research/references/claims.md`, `skills/lienzo-animate/SKILL.md`;
  - tests: `tests/lib/palette.test.cjs`, `tests/lib/scene.test.cjs`,
    `tests/videos/template.test.cjs`, `tests/videos/scenes.test.cjs`,
    `tests/skills/lib-list.test.cjs`;
  - docs: `ARCHITECTURE.md`, `DESIGN.md`, `PRODUCT.md`, `README.md`, and a new `CHANGES.md`
    entry.
- Unchanged: `videos/ringana-omega-v2/scene.json` and its golden fixture; past `CHANGES.md`
  entries.

### Sequencing

1. The guard test first (T001), so every new `lib/` export is checked from its first commit.
2. Then `lib/` with its tests (T002–T011). Each task lists its new exports in "Start from lib/"
   in the same change, and T010 keeps both generators on the fonts they use today, so the suite
   stays green throughout.
3. Then the template and its tests (T012–T015). After that, every new video copies the new shape.
4. Then the skills and docs (T016–T021).
5. The `omega-v2` migration (T022–T025) waits for Lienzo 086/T012–T013 (clean `ringana` with
   declared fonts, all five roles and its guide).

### Trade-offs

- D1. Pros: generators stay pure and testable offline, and the snapshot shows exactly what brand
  a video was last built with. Cons: a snapshot is a copy and can go stale. Mitigation: it is
  never edited by hand; animate step 1 compares a fresh snapshot with it and shows the changed
  keys, and the lock is rewritten only when the user accepts, as a committed lockfile changes only
  on an explicit install.
- D2. Pros: one vocabulary across both repos, and no mapping code. Cons: renaming `main` touches
  the template, the skills and the docs. Mitigation: `omega-v2` never used `main`, so no
  generated scene changes, and the R2 search confirms nothing current still says `main`.
- D3. Pros: every brand colour gets depth tones with no manual work, in the same style as the
  approved piece: perceptually even steps and lively, non-muddy shadows. Cons: OKLCH conversion
  and gamut mapping add about 60 lines of colour math to `lib/` (no dependencies allowed), and one
  fixed rule cannot suit every material. Mitigation: the math is the published CSS Color 4 sample
  code and is tested against Color.js values; any tone can be overridden in `palette.json`; T006
  reports how far the rule lands from `omega-v2`'s hand-picked tones.
- D4. Pros: `palette.json` shrinks to what the video changes, and one rule gives tones to brand
  and story roles alike. Cons: one more step between `palette.json` and the colours on screen,
  and story roles gain tones the generator may not use. Mitigation: the error names every missing
  role and both places to set it, and unused tones never reach the scene.
- D5. Pros: fonts follow the brand, and `lib/` holds no brand. Cons: `sceneHelpers` gets one more
  required argument, and a brand that declares a wide weight range (300–900) gets its extremes.
  Mitigation: only two generators exist (template, `omega-v2`), both pass `fonts` in the same
  task (T010), and a generator can pass its own `fonts`.
- D7. Pros: brand data is only written on purpose, and the lock is never typed by hand. Cons: one
  more confirmation for the user. Mitigation: it happens only when the brand lacks something
  (once per brand) or has changed since the last build.
- D8. Pros: a single owner for voice timing, which the user tunes in Lienzo's editor. Cons: the
  repo alone cannot rebuild the voice into a new scene. Mitigation: `scene_generate_speech` with
  the brief's script recreates it; the Lienzo issue
  https://github.com/SebassContreras/lienzo/issues/10 tracks carrying tracks between scenes.
- D9. Pros: the golden test proves the migration changes nothing. Cons: `omega-v2` then inherits
  only its fonts from the brand, so it does not prove colour inheritance. Mitigation: the template
  test (T014) proves a brand colour reaches the scene.
- D11. Pros: the brand's duration is used, but never silently. Cons: one more question when the
  brief sets no duration. Mitigation: the brief records the answer, so it is asked once per video.

## Tasks
- [x] 011/T001 [agent] `tests/skills/lib-list.test.cjs`: replace the six copied tests with one table over every `lib/*.cjs` read from the folder, so `brand.cjs` and any later module are guarded — covers D10
- [x] 011/T002 [agent] `lib/brand.cjs`: the header line, `brandLock(inspect)` and `checkBrandLock(lock)` with the D1 schema; the "Start from lib/" list in `skills/lienzo-animate/SKILL.md` names both in the same task — covers R1, D1
- [x] 011/T003 [agent] Table test (`tests/lib/brand.test.cjs`) of `brandLock` and `checkBrandLock` over the R1 partitions (each invalid row asserts the error names the role or key) and the invariant `checkBrandLock(brandLock(x))` for every valid row — covers R1, D1, D10
- [x] 011/T004 [agent] `lib/palette.cjs`: `tones(base)` implementing the D3 rule; the "Start from lib/" list names it in the same task — covers R3, D3
- [x] 011/T005 [agent] Table test (`tests/lib/palette.test.cjs`) of `tones` over the R3 partitions and invariants; the expected hexes are computed once with Color.js using the D3 rule and CSS gamut mapping, then written into the table; nothing is exported only for the test — covers R3, D3, D10
- [x] 011/T006 [agent] Verify: report the ΔE(OKLab) between `tones()` and each hand-picked tone in `videos/ringana-omega-v2/palette.json` (expected mean ≈ 0.03); no assertion, the report informs any retuning of D3 — covers D3
  verified: mean ΔE(OKLab) 0.023, max 0.044 over the 10 hand-picked tones (sea, alga, drop, capsule, organ; shadow and highlight), measured with Color.js `deltaE(…, "OK")`. Largest: alga shadow 0.044, alga highlight 0.040, organ shadow 0.031, sea highlight 0.030. Within the prototype's range, so D3 is not retuned.
- [x] 011/T007 [agent] `lib/palette.cjs`: `resolvePalette(lock, overrides)` with the D4 steps and `REQUIRED_ROLES`; the "Start from lib/" list names it in the same task — covers R2, R10, D2, D4
- [x] 011/T008 [agent] Table test (`tests/lib/palette.test.cjs`) of `resolvePalette` over the R10 partitions (one row per missing required role) and invariants — covers R10, D4, D10
- [x] 011/T009 [agent] `lib/brand.cjs`: `brandFonts(lock)` and its `DEFAULT_FONTS` constant (D5); the "Start from lib/" list names `brandFonts` in the same task — covers R4, D5
- [x] 011/T010 [agent] `lib/scene.cjs`: `sceneHelpers` requires `fonts`, and `text` and `label` take family and weight from it (D5); no font family is named in `lib/`. In the same task, both generators pass the fonts they use today (`{ heading: { family: "Montserrat", weight: 800 }, body: { family: "Montserrat", weight: 500 } }`) until T012 and T023 switch them to `brandFonts(lock)`, so the golden test stays green; the "Start from lib/" list shows the new `sceneHelpers` signature — covers R4, D5
- [x] 011/T011 [agent] Table test of `brandFonts` (`tests/lib/brand.test.cjs`) over the R4 partitions, and of `sceneHelpers` (`tests/lib/scene.test.cjs`): with `fonts` set to a sentinel (`"Test Sans"`, weight 123), every `text` and `label` it returns uses that family and weight. Verify: `grep -rnE '(font|family): *"' lib/` finds only the `DEFAULT_FONTS` lines in `lib/brand.cjs` — covers R4, D10
  verified: `grep -rnE '(font|family): *"' lib/` finds only `lib/brand.cjs:40` (`DEFAULT_FONTS`).
- [x] 011/T012 [agent] Template: add `brand.lock.json` (neutral sample brand, Lienzo role names, `fonts: []`), reduce `palette.json` to `{}`, use `checkBrandLock`, `resolvePalette` and `brandFonts` in `scene.gen.cjs`, and use `primary` instead of `main` — covers R1, R2, R4, R10
- [ ] 011/T013 [agent] Template `brief.md` and `skills/lienzo-storyboard/references/brief-template.md`: add the `## Brand` section (project, override role names), state the precedence, make the palette table list each override and story role with what it paints and no hex values, keep the voice script only — covers R5, R7, D6, D8
- [ ] 011/T014 [agent] `tests/videos/template.test.cjs`: a brand colour in the snapshot reaches the scene, and a `palette.json` override beats it — covers R5, R10, D10
- [ ] 011/T015 [agent] `tests/videos/scenes.test.cjs`: a table over every video with a generator in `videos/` asserts its generated scene has no `audioTracks` key — covers R7, D10
- [ ] 011/T016 [agent] `lienzo-storyboard` step 1: run `project_inspect`, write the snapshot with the D7 command, apply the guide (audience, tone, mandatory text, disclaimers, format and length), take the duration as D11 says, and propose plus confirm a `project_update` when the brand lacks something — covers R6, R9, D7, D11
- [ ] 011/T017 [agent] `lienzo-art-direction` SKILL.md and `references/styles.md`: `palette.json` holds only overrides and story roles; roles use `primary`; remove "repeat the same roles and hexes in the brief's palette table"; "Bright science" shading ("same hue, −15 % lightness") is replaced by the D3 rule (derived tones; shadows cooler, highlights warmer) — covers R2, R3, R5, R6, D2, D3, D6
- [ ] 011/T018 [agent] `lienzo-research/references/claims.md`: claim rules and disclaimers come from the brand guide, and the RINGANA example points to it — covers R6
- [ ] 011/T019 [agent] `lienzo-animate` SKILL.md: step 1 compares a fresh snapshot with `brand.lock.json`, shows the changed keys and rewrites the lock only when the user accepts (D7); audio belongs to the Lienzo scene — covers R6, R7, D7, D8
- [ ] 011/T020 [agent] `ARCHITECTURE.md`: invariant 1 adds `brand.lock.json` to the folder shape; invariant 3 becomes "Brand parameterization: shared pieces in `lib/` take colours from a palette argument and fonts from a `fonts` argument, and never name a brand's colour or font"; Lienzo owns the brand; data-flow diagram. `DESIGN.md`: roles, derived tones, `DEFAULT_FONTS`, the "Brand inheritance" section with the R5 table, and the "Single source" line (hex values only in `palette.json`) — covers R2, R4, R5, D2, D5, D6
- [ ] 011/T021 [agent] `PRODUCT.md` and `README.md` (`main` → `primary`; palette ownership moves to the Lienzo project) and a new `CHANGES.md` entry for the rename back to `primary` (past entries unchanged); Verify: the R2 search returns nothing — covers R2, R5
- [ ] 011/T022 [agent] `omega-v2`: write `brand.lock.json` from `project_inspect` of `ringana` with the D7 command (after Lienzo 086/T012–T013) — covers R8, D9
- [ ] 011/T023 [agent] `omega-v2`: `palette.json` keeps its story roles and the `text` override (`#FFFFFF`); `scene.gen.cjs` uses `checkBrandLock`, `resolvePalette` and `brandFonts`; Verify: the golden test passes byte for byte — covers R8, D9
- [ ] 011/T024 [agent] `omega-v2/brief.md`: add the `## Brand` section, move brand content now held by the Lienzo guide out of the brief, and drop the voice start times, keeping the script (the Lienzo scene was deleted on 2026-10-31) — covers R5, R7, R8
- [ ] 011/T025 [human] Review the migrated `omega-v2` brief and the `ringana` brand it now inherits from — covers R8
