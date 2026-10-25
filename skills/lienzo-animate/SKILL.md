---
name: lienzo-animate
description: Build complex animated scenes in Lienzo (the JSON canvas editor) through its MCP tools or `pnpm lienzo` CLI — illustrated objects (cars, trees, characters, landscapes) drawn from paths and shapes, motion with keyframes and loops, parallax, reusable symbols, and multi-shot videos with native shots, transitions and camera moves. Use whenever the user asks Lienzo for an animation, a scene, a reel/story, "una animación", "un video", "tomas/planos", or anything beyond a static card.
---

# Lienzo: complex animations

Lienzo draws a JSON scene with Canvas 2D. What `scene_preview` shows is what gets exported.
Shots are native: a scene-level `shots` list, and each element says which `shot` it belongs to. Shots have `transition`s (fade, slide, zoom) and a `camera` that moves only that shot's elements (see `references/shots-camera.md`).

## Required workflow

1. **Project.** `project_list`; if none fits, `project_create`. Every scene tool needs `project` (there is no default). `project_inspect` shows its brand, assets and fonts; `asset_add` brings in a local file.
2. **Shot list.** If you were given a brief from the `lienzo-storyboard` skill (`videos/<slug>/brief.md`), it is your spec. If its Sources section says verification is "pending", stop and run `lienzo-research` in verify mode first. Follow its timings, palette, layer names, positions and text exactly, and do not redesign it, and never change or add factual text: on-screen facts come only from the verified brief. If a shot cannot be built as written, build the closest version and report the gap. Without a brief, write a table first: shot, start–end (s), what is seen, what moves, text. Total duration = end of the last shot. For anything beyond a simple scene, suggest running `lienzo-storyboard` first.
3. **Compact scene.** Edit `videos/<slug>/scene.gen.cjs` (copied from `videos/_template/` by `lienzo-storyboard`), run `node videos/<slug>/scene.gen.cjs`, then write ONE scene with `scene_build` (`compact` = the contents of `videos/<slug>/scene.json`, + `save` + `overwrite: true`; with the CLI, `--json @file`). Read its `notices` (missing fonts). Use `defaults: "flat"`, one `shots` entry per shot, and `shot` on each top-level element. See `references/compact-format.md`.
4. **Look.** `scene_validate`, then `scene_preview` at least once per shot, plus just before and after each cut. Actually look at the image, and critique it with `lienzo-art-direction` → `references/review.md`.
5. **Measure.** `scene_inspect_layout` with `times` at the same moments (it skips elements not visible at that time). Text widths are only reliable for text with `w` (see gotchas); trust the image.
6. **Fix and repeat** steps 3–5 until every shot looks right.
7. **Export.** `scene_export` with `format: "mp4"` (or `gif` for short loops).
8. **Close out** (only after the user approves the export). Write every finding of the session into `videos/<slug>/learnings.md` under its kind: `Piece` (goes to `lib/`), `Rule` (goes to a skill), `Engine` (a Lienzo limitation) or `Local` (stays in the video). Show the classification to the user, who can move or drop any finding. For the confirmed `Piece` and `Rule` findings, open a promotion spec `NNN-promote-<slug>` in the Animator repo with `spectrace-start` (one R item per finding) and plan it with `spectrace-plan`; do not promote anything in this step, the spec's tasks do it and add `— promoted: <path>` to the finding. For each `Engine` finding, ask the user to file an issue in the Lienzo repo and end the finding with `— tracks: <url>`.

## Joint mode (the user corrects in the editor)

Lienzo has "Modo conjunto" (joint mode): the editor shows each change the agent writes and, once the agent has been idle for 3 s, the user edits by hand and their changes are saved to the file.

- Do not take screenshots if the user says they will review it. Build, save and hand over the turn.
- When you come back, **always read the scene with `scene_get`** before touching anything. The user's changes win.
- Use targeted changes (`element_update`, `keyframe_set`, `shot_set`, `scene_update`); nested elements are reached with a `group/child` path. **Never** run `scene_build` + `overwrite` on a scene the user corrected, unless you first carry their changes into the generator or the compact JSON.
- When the user reports problems in words, fix them at the source (generator/compact JSON), confirm the scene file has no manual edits (compare with your last saved copy), then rebuild.
- Note what the user corrected in `videos/<slug>/learnings.md`: it shows what is wrong in the way you build, and close-out (step 8) classifies it.

## Large scenes: use a generator

Every video builds from its generator, `videos/<slug>/scene.gen.cjs`, which outputs the compact JSON with helpers such as `nativeShot()`, `label()`, `rect()`, `heart()`. Dangerous defaults get fixed once and pieces are reused. Start from `videos/_template/scene.gen.cjs` (smallest working generator); `videos/ringana-omega-v2/scene.gen.cjs` is the full example.

### Start from lib/

Before drawing a piece, check the Animator repo's `lib/` and reuse what is there. Every piece takes its colours from the palette (`C.<role>.<tone>`).

- `lib/primitives.cjs` — `rect`, `ell`, `path`, `group`, `flat`: flat by default (gradient and shadow off).
- `lib/scene.cjs` — `nativeShot(id, name, start, end, camera?)`: a `shots` entry; `sceneHelpers({ w, h, duration, palette })` → `label` (centred `text` with `w`, colour `palette.text.base`; `extra.shot` binds it), `fadeToBlack`, and the legacy `shot` (group) and `text` (rect + label) used by ringana-omega-v2.
- `lib/environment.cjs` — `sea(id, frame, deep, light)`: full-frame gradient backdrop; `particles(id, name, box, { …, color })`.
- `lib/objects.cjs` — `heart(id, x, y, color)`.
- `lib/motion.cjs` — `heartbeat(t0, beats, opts)`: scale pulse tracks; `countUp(steps)`: `label.text` track for a counting number (colourless).
- `lib/palette.cjs` — `checkPalette(require("./palette.json"))`.

A new piece stays in the video's generator; it moves to `lib/` only after the video worked (or, for a wrapper of a Lienzo feature, once it renders right in `scene_preview`), through close-out (Animator A13).

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
- Unknown fields are dropped without a notice: check names with `component_list`.
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
