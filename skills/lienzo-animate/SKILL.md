---
name: lienzo-animate
description: Build complex animated scenes in Lienzo (the JSON canvas editor) through its MCP tools or `pnpm lienzo` CLI — illustrated objects (cars, trees, characters, landscapes) drawn from paths and shapes, motion with keyframes and loops, parallax, reusable symbols, and multi-shot videos with native shots, transitions and camera moves. Use whenever the user asks Lienzo for an animation, a scene, a reel/story, "una animación", "un video", "tomas/planos", or anything beyond a static card.
---

# Lienzo: complex animations

Lienzo draws a JSON scene with Canvas 2D. What `scene_preview` shows is what gets exported.
Shots are native: a scene-level `shots` list, and each element says which `shot` it belongs to. Shots have `transition`s (fade, slide, zoom) and a `camera` that moves only that shot's elements (see `references/shots-camera.md`).

## Required workflow

1. **Project.** `project_list`; if none fits, `project_create`. Every scene tool needs `project` (there is no default). `project_inspect` shows its brand, assets and fonts; `asset_add` brings in a local file.
   - **Brand drift.** If the brand has `brand.lock.json` (at `videos/<brand>/brand.lock.json` or local), re-run `project_inspect`, write a fresh snapshot to a temp file with the `lienzo-storyboard` step 1 command, and compare it with `brand.lock.json`. If they differ, show the user the changed keys and replace the lock only when they accept; otherwise build with the saved lock. The lock is the record of the brand the video was last built with.
2. **Shot list.** If you were given a brief from the `lienzo-storyboard` skill (`videos/<brand>/<video>/brief.md`), it is your spec. If its Sources section says verification is "pending", stop and run `lienzo-research` in verify mode first. Follow its timings, palette, layer names, positions and text exactly, and do not redesign it, and never change or add factual text: on-screen facts come only from the verified brief. If a shot cannot be built as written, build the closest version and report the gap. Without a brief, write a table first: shot, start–end (s), what is seen, what moves, text. Total duration = end of the last shot. For anything beyond a simple scene, suggest running `lienzo-storyboard` first.
3. **Compact scene.** Edit `videos/<brand>/<video>/scene.gen.cjs` (copied from `videos/_template/` by `lienzo-storyboard`), run `node videos/<brand>/<video>/scene.gen.cjs`, then write ONE scene with `scene_build` (`compact` = the contents of `videos/<brand>/<video>/scene.json`, + `save` + `overwrite: true`; with the CLI, `--json @file`). A large compact scene (tens of KB) is built with the CLI, `pnpm lienzo scene_build --json @<file>`, the file holding `{ project, compact, save, overwrite }`, or via MCP by passing `compactFile` (absolute path) to `scene_build` (Lienzo 090). Read its `notices` (missing fonts). **Audio belongs to the Lienzo scene:** the voice is made with `scene_generate_speech` and timed with `scene_update` (or in the editor); generators never write `audioTracks`, and `scene_build` with `overwrite` keeps the stored scene's audio. The brief holds the voice script only. Use `defaults: "flat"`, one `shots` entry per shot, and `shot` on each top-level element. See `references/compact-format.md`.
4. **Look.** `scene_validate`, then `scene_preview` at least once per shot, plus just before and after each cut. Actually look at the image, and critique it with `lienzo-art-direction` → `references/review.md`.
5. **Measure.** `scene_inspect_layout` with `times` at the same moments (it skips elements not visible at that time). Text widths are only reliable for text with `w` (see gotchas); trust the image.
6. **Fix and repeat** steps 3–5 until every shot looks right.
7. **Export.** `scene_export` with `format: "mp4"` (or `gif` for short loops).
8. **Close out** (only after the user approves the export). Write every finding of the session into `videos/<brand>/<video>/learnings.md` under its kind: `Piece` (goes to `lib/`), `Rule` (goes to a skill), `Engine` (a Lienzo limitation) or `Local` (stays in the video). Show the classification to the user, who can move or drop any finding. For the confirmed `Piece` and `Rule` findings, open a promotion spec `NNN-promote-<brand>-<video>` in the Animator repo with `spectrace-plan` (one R item per finding); do not promote anything in this step, the spec's tasks do it and add `— promoted: <path>` to the finding. For each `Engine` finding, ask the user whether to open a Lienzo spec for it (in the Lienzo repo) and end the finding with `— tracks: Lienzo spec <NNN>` (three digits); a finding already tracked by a Lienzo issue may end with `— tracks: <issue URL>` instead. Sections with no findings must be left empty with zero bullets (never `- None.`, which fails `tests/videos/learnings.test.cjs`).

## Joint mode (the user corrects in the editor)

Lienzo has "Modo conjunto" (joint mode): the editor shows each change the agent writes and, once the agent has been idle for 3 s, the user edits by hand and their changes are saved to the file.

- Do not take screenshots if the user says they will review it. Build, save and hand over the turn.
- When you come back, **always read the scene with `scene_get`** before touching anything. The user's changes win.
- Use targeted changes (`element_update`, `keyframe_set`, `shot_set`, `scene_update`); nested elements are reached with a `group/child` path. **Never** run `scene_build` + `overwrite` on a scene the user corrected, unless you first carry their changes into the generator or the compact JSON.
- When the user reports problems in words, fix them at the source (generator/compact JSON), confirm the scene file has no manual edits (compare with your last saved copy), then rebuild.
- Note what the user corrected in `videos/<brand>/<video>/learnings.md`: it shows what is wrong in the way you build, and close-out (step 8) classifies it.

## Large scenes: use a generator

Every video builds from its generator, `videos/<brand>/<video>/scene.gen.cjs`, which outputs the compact JSON with helpers such as `nativeShot()`, `label()`, `rect()`, `heart()`. Dangerous defaults get fixed once and pieces are reused. Start from `videos/_template/scene.gen.cjs` (smallest working generator); `videos/ringana/omega-v2/scene.gen.cjs` is the full example.

### Start from lib/

Before drawing a piece, check the Animator repo's `lib/` and reuse what is there. Every piece takes its colours from the palette (`C.<role>.<tone>`).

- `lib/primitives.cjs` — `rect`, `ell`, `path`, `group`, `flat`: flat by default (gradient and shadow off). `path`'s `d` is one string or a list of them: a list gives one shape per `d`, in order (morph frames, or layers with `mode: "layers"`).
- `lib/scene.cjs` — `nativeShot(id, name, start, end, camera?, transition?)`: a `shots` entry; `sceneHelpers({ w, h, duration, palette, fonts })` (`fonts` = `brandFonts(lock)`, required) → `label` (centred `text` with `w`, colour `palette.text.base`, the heading font unless `extra.font: "body"`; `extra.shot` binds it), `fadeToBlack`, and the legacy `shot` (group) and `text` (rect + label) used by ringana-omega-v2.
- `lib/environment.cjs` — `sea(id, frame, deep, light, name?, extra?)`: full-frame gradient backdrop; `particles(id, name, box, { …, color }, extra?)`; `blob(id, name, box, top, bottom, extra?)`: organic blob filling `box` with a vertical `top` → `bottom` gradient (Soft depth backdrop, proven in ringana-skin-perfection).
- `lib/objects.cjs` — `heart(id, x, y, color)`; `teardrop(tones, prefix?)`: a three-tone teardrop symbol (`{ w: 100, h: 120, children }`) from a role's `{ base, shadow, highlight }`, e.g. `symbols: { drop: teardrop(C.moisture) }` (optional `prefix` prevents duplicate IDs when embedding multiple drops); `metricCard`: tech counter card with rounded rect (`radius: 32`), border, optional glow, and embedded counter/title (proven in pulse-speed); `radialLayout`: calculates coordinates `{ x, y, angle }` distributed evenly on a circle (proven in pulse-chaos).
- `lib/motion.cjs` — `heartbeat(t0, beats, opts)`: scale pulse tracks; `countUp(steps)`: `label.text` track for a counting number (colourless); it only drives the legacy rect `label.text`. To count a number up, use the `counter` kind (`from`, `to`, `prefix`, `suffix`, `progress` track): `text` has no animatable text path (proven in ringana-skin-perfection).
- `lib/palette.cjs` — `checkPalette(require("./palette.json"))`; `tones(base)` → `{ shadow, highlight }` derived in OKLCH (shadows cooler, highlights warmer); `resolvePalette(lock, require("./palette.json"))`: the palette a generator uses (brand colours, then `palette.json` overrides and story roles, derived tones for any tone left out; fails naming each missing required role).
- `lib/brand.cjs` — `brandLock(inspect)`: the `brand.lock.json` snapshot from a `project_inspect` result; `checkBrandLock(require("./brand.lock.json"))`: checks it and returns it; `brandFonts(lock)` → `{ heading, body, mono?, accent? }`, each `{ family, weight }` (Inter 800 / 400 when the brand declares none); `brandNotices(inspect)`: array of uninstalled font/weight warnings from `project_inspect`.

A new piece stays in the video's generator; it moves to `lib/` only after the video worked (or, for a wrapper of a Lienzo feature, once it renders right in `scene_preview`), through close-out (see `ARCHITECTURE.md` § Learning Promotion Seam).

## Rules that fail most often (read `references/gotchas.md`)

- Set `"defaults": "flat"` on every scene: shapes otherwise get a gradient, a shadow and a border. It does not cover the background (`gradient`, `dots`, `spotlight` off). Paths have no stroke and fills are opaque by default (Lienzo 063).
- A `path` with several `shapes` morphs between them unless `"mode": "layers"`.
- Group children use **local coordinates** (0..cw, 0..ch). Always set `cw`/`ch` equal to `w`/`h`.
- **Centred text:** `at: "center"` works with bundled fonts; with any other font give the text `x: 0`, `w` = frame width and `align: "center"`.
- Fade anything with `opacity` (every kind has it, animatable) or `anim` `fade`; between shots use the shot's `transition`.
- Tracks hold their last value unless the track has `repeat: "loop"` / `"pingpong"` (and `until`). Continuous motion either repeats or lasts to the end of its shot.
- Rotation and scale pivot on `origin` (default the box centre): set it to the joint.
- Gradient angle: 0 = left→right, 90 = top→bottom.
- Seamless loops: integer `loop.cycles`, and cyclic tracks whose period divides the duration.
- Repeated pieces (trees, people, icons): define a `symbol` once and place `use` instances.
- Unknown fields raise validation notices in `scene_validate` / `scene_build`: check property names with `component_list`.
- Give every shot, object and main piece a readable `name` so the user can find it in the layers panel.

## References

- `references/compact-format.md` — compact scene format and tools.
- `references/elements.md` — which component to use for what, and its fields.
- `references/motion.md` — entry/loop/exit, keyframes, channels, easings.
- `references/shots-camera.md` — native shots, transitions, camera (pan/zoom), parallax; group shots as the legacy pattern.
- `references/drawing.md` — drawing objects with paths (car, tree, house, person).
- `references/recipes.md` — copy-ready recipes.
- `references/gotchas.md` — verified mistakes and how to avoid them.
- `examples/car-road-tree.json` — verified scene: car on a road → cut → tree shot with zoom. Its render is `examples/car-road-tree.mp4`. It predates native shots (legacy group shots): copy its drawing, not its shot structure.

Start from `videos/_template/scene.gen.cjs` and adapt the example's pieces instead of starting from scratch.
