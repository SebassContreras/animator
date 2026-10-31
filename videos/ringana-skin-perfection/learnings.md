# ringana-skin-perfection — Learnings

What this video taught, one bullet per finding, under its kind (004/R1). Close-out promotes `Piece` and `Rule` findings. A promoted finding ends with `— promoted: <repo path>`; every `Engine` finding ends with `— tracks: <url>`.

Session 2026-10-31, scene `skin-perfection` (project `ringana`), export `skin-perfection.mp4`. First piece in the Soft depth style. Draft classification, awaiting the user's review at close-out.

## Piece

- `blob(id, name, x, y, w, h, top, bottom)`: an organic blob in a 100×100 view with a vertical two-colour gradient; the Soft depth backdrop and foreground plane in every shot (generator `blob`). — promoted: lib/environment.cjs
- `tear(role)`: a three-tone teardrop symbol (shadow drop, base drop up-left of it, highlight dot) for drops of any role (generator `tear`). — promoted: lib/objects.cjs
- `flatPath(id, x, y, w, h, [d0, d1], color)`: a path with several shapes for `morph`; `lib/primitives.cjs` `path` takes one shape only. A three-tone morph = the same shapes twice, the shadow copy 8 px down-right (generator `morphing`, drop → film). — promoted: lib/primitives.cjs
- `card(...)`: a stat card (surface pill, accent bar, `counter` with prefix and suffix, caption) that slides in and fades out (generator `card`).

## Rule

- Count a number up with the `counter` kind (`from`, `to`, `prefix`, `suffix`, `progress` track): `text` has no animatable text path, and `countUp` in `lib/motion.cjs` only drives the legacy rect `label.text`. — promoted: skills/lienzo-animate/SKILL.md
- A symbol placed much larger than its definition scales its details too: a highlight sliver became a sign-like bar at 3.3×. Draw large variants at their own size. — promoted: skills/lienzo-animate/references/drawing.md
- Break two-line titles by hand with `\n`: the automatic wrap broke "Dry skin? Weakened barrier?" after "Weakened", and the product name before "perfection". — promoted: skills/lienzo-storyboard/references/craft.md
- Grow a piece along one axis with `w`/`h` plus `x`/`y` tracks (there is no per-axis scale channel); the ceramide mortar grows that way from its centre. — promoted: skills/lienzo-animate/references/drawing.md
- A layer that drifts with an `x` track needs its drift added to its width, or its edge shows (the hills in shot 4). — promoted: skills/lienzo-animate/references/drawing.md
- Large compact scenes (36 KB here) go through the CLI, `pnpm lienzo scene_build --json @<file>`, with `{ project, compact, save, overwrite }` in the file, instead of inline in the MCP call. — promoted: skills/lienzo-animate/SKILL.md
- `videos/_template/learnings.md` ships placeholder bullets, so `tests/videos/learnings.test.cjs` fails as soon as the template is copied; the template should ship empty sections. — promoted: videos/_template/learnings.md
- ringana.com renders with JavaScript: a plain fetch gets an empty shell. With `browser-nav`, `snapshot` lists headings and buttons but not paragraph text, so the open panels were read from `screenshot`s (cookies: "Save Selection" with only the essential ones). — promoted: skills/lienzo-research/references/sources.md
- Kokoro clips carry about 0.4 s of silence at the start and 0.6 s at the end (`ffmpeg silencedetect`, −40 dB): a 5-word line lasts about 3 s, so six clips nearly fill 20 s. Write voice lines of ≤ 5 words for 3 s shots, and check that the clips' total fits before placing them. — promoted: skills/lienzo-storyboard/references/craft.md

## Engine

- `scene_inspect_layout` reports `low_contrast` for black text "on #0b1220" in shots 1–3, while the scene background and each shot's backdrop are #FFFFFF and the text sits on a light blob (cause: unframed groups counted with their default `bodyColor`). — tracks: Lienzo spec 087
- No per-axis scale channel (`@scaleX` / `@scaleY`): one-axis growth needs `w`/`h` and position tracks together. — tracks: Lienzo spec 088
- `scene_generate_speech` reports only `audioDuration`; the silence around the voice is invisible. — tracks: Lienzo spec 089
- `scene_build` over MCP takes the compact scene inline only; a 36 KB scene needs the CLI. — tracks: Lienzo spec 090

## Local

- Soft depth on a white brand: the brand's white replaces the style's warm off-white; the orange accent is never text (3.2:1 on white), only the mortar and the card bars.
- Shot 2 has about 33 elements (12 cells, 12 mortar pieces), a little over the ≤ 30 budget; the cells are one symbol, so the layers panel stays readable.
- The page calls the study a "Research Centre study"; the user chose the footnote "RINGANA study, 23 participants, 2 weeks." (brand guide wording).
