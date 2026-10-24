---
name: lienzo-animate
description: Build complex animated scenes in Lienzo (the JSON canvas editor) through its MCP tools or `pnpm lienzo` CLI — illustrated objects (cars, trees, characters, landscapes) drawn from paths and shapes, motion with keyframes, parallax, and multi-shot videos with cuts and camera moves. Use whenever the user asks Lienzo for an animation, a scene, a reel/story, "una animación", "un video", "tomas/planos", or anything beyond a static card.
---

# Lienzo: complex animations

Lienzo draws a JSON scene with Canvas 2D. What `scene_preview` shows is what gets exported.
There is no native camera or "shot": **build them with groups** (see `references/shots-camera.md`).

## Required workflow

1. **Project.** `project_list`; if none fits, `project_create`. Every scene tool needs `project`.
2. **Shot list.** If you were given a brief from the `lienzo-storyboard` skill (`videos/<slug>/brief.md`), it is your spec. If its Sources section says verification is "pending", stop and run `lienzo-research` in verify mode first. Follow its timings, palette, layer names, positions and text exactly, and do not redesign it, and never change or add factual text: on-screen facts come only from the verified brief. If a shot cannot be built as written, build the closest version and report the gap. Without a brief, write a table first: shot, start–end (s), what is seen, what moves, text. Total duration = end of the last shot. For anything beyond a simple scene, suggest running `lienzo-storyboard` first.
3. **Compact scene.** Edit `videos/<slug>/scene.gen.cjs` (copied from `videos/_template/` by `lienzo-storyboard`), run `node videos/<slug>/scene.gen.cjs`, then write ONE scene with `scene_build` (`compact` = the contents of `videos/<slug>/scene.json`, + `save` + `overwrite: true`; with the CLI, `--json @file`). Each shot is a full-size `group`. See `references/compact-format.md`.
4. **Look.** `scene_preview` at least once per shot, plus just before and after each cut. Actually look at the image, and critique it with `lienzo-art-direction` → `references/review.md`.
5. **Measure.** `scene_inspect_layout` with `times` at the same moments. Its text widths are NOT reliable (see gotchas); trust the image.
6. **Fix and repeat** steps 3–5 until every shot looks right.
7. **Export.** `scene_export` with `format: "mp4"` (or `gif` for short loops).

## Joint mode (the user corrects in the editor)

Lienzo has "Modo conjunto" (joint mode): the editor shows each change the agent writes and, once the agent has been idle for 3 s, the user edits by hand and their changes are saved to the file.

- Do not take screenshots if the user says they will review it. Build, save and hand over the turn.
- When you come back, **always read the scene with `scene_get`** before touching anything. The user's changes win.
- Use targeted changes (`element_update`, `keyframe_set`). **Never** run `scene_build` + `overwrite` on a scene the user corrected, unless you first carry their changes into the generator or the compact JSON.
- When the user reports problems in words, fix them at the source (generator/compact JSON), confirm the scene file has no manual edits (compare with your last saved copy), then rebuild.
- Log what the user corrected: it shows what is wrong in the way you build.

## Large scenes: use a generator

Every video builds from its generator, `videos/<slug>/scene.gen.cjs`, which outputs the compact JSON with helpers such as `shot()`, `rect()`, `car()`. Dangerous defaults get fixed once and pieces are reused. Start from `videos/_template/scene.gen.cjs` (smallest working generator); `videos/ringana-omega-v2/scene.gen.cjs` is the full example.

### Start from lib/

Before drawing a piece, check the Animator repo's `lib/` and reuse what is there. Every piece takes its colours from the palette (`C.<role>.<tone>`).

- `lib/primitives.cjs` — `rect`, `ell`, `path`, `group`, `flat`: flat by default (gradient and shadow off).
- `lib/scene.cjs` — `sceneHelpers({ w, h, duration, palette })` → `shot`, `text`, `fadeToBlack`.
- `lib/environment.cjs` — `sea` (full-frame gradient backdrop), `particles`.
- `lib/objects.cjs` — `heart`.
- `lib/motion.cjs` — `heartbeat` (scale pulse tracks).
- `lib/palette.cjs` — `checkPalette(require("./palette.json"))`.

A new piece stays in the video's generator; it moves to `lib/` only after the video worked, through close-out (Animator A13).

## Rules that fail most often (read `references/gotchas.md`)

- Rect, ellipse, path, polygon and star come with **gradient and shadow on by default**: always set `"fill": {"gradient": false, ...}` and `"shadow": {"enabled": false}` unless you want them.
- Several entries in a `path`'s `shapes` **morph**; they do not stack. One colour layer = one `path`.
- Group children use **local coordinates** (0..cw, 0..ch). Always set `cw`/`ch` equal to `w`/`h`.
- **Do not use `at` to centre text**: it measures widths wrong. For centred text use a full-width transparent `rect` with a `label` (recipe in `references/recipes.md`).
- `group` **has no `opacity`**: cuts are made with the group's `anim.in`/`anim.out` of kind `fade`.
- **Tracks do not repeat**: after the last keyframe the value freezes. Continuous motion must last until the end of its shot.
- **Everything rotates around the centre of its box.** To pivot elsewhere, centre the group's box on the pivot.
- Gradient angle: 0 = left→right, 90 = top→bottom.
- Seamless loops: integer `loop.cycles`, and cyclic tracks whose last keyframe returns to the start state (or shifts by exactly one period).
- Give every shot, object and main piece a readable `name` so the user can find it in the layers panel.

## References

- `references/compact-format.md` — compact scene format and tools.
- `references/elements.md` — which component to use for what, and its fields.
- `references/motion.md` — entry/loop/exit, keyframes, channels, easings.
- `references/shots-camera.md` — shots, cuts, fades, camera (pan/zoom), parallax.
- `references/drawing.md` — drawing objects with paths (car, tree, house, person).
- `references/recipes.md` — copy-ready recipes.
- `references/gotchas.md` — verified mistakes and how to avoid them.
- `examples/car-road-tree.json` — verified scene: car on a road → cut → tree shot with zoom. Its render is `examples/car-road-tree.mp4`.

Start by copying and adapting the example instead of starting from scratch.
