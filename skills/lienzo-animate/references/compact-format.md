# Compact format and tools

`scene_build` takes `{ compact, project, save?, overwrite? }`. Without `save` it only returns the expanded scene and its `notices` (missing fonts, …); read them. Every field is optional and filled with the component's defaults.
The full JSON schema lives in the Lienzo repo: `schemas/compact-scene.json`; component fields in its `docs/components.md`.

```json
{
  "size": "Story",
  "duration": 6,
  "fps": 30,
  "defaults": "flat",
  "background": { "color": "#87CEEB", "gradient": false, "dots": false, "spotlight": 0 },
  "symbols": { "tree": { "w": 200, "h": 300, "children": [ ... ] } },
  "shots": [
    { "id": "s1", "name": "Shot 1 · road", "start": 0, "end": 3 },
    { "id": "s2", "name": "Shot 2 · tree", "start": 3, "end": 6, "transition": { "kind": "fade", "duration": 0.5 }, "camera": { "zoom": 1.1 } }
  ],
  "elements": [ { "id": "sun", "kind": "ellipse", "shot": "s1", "x": 760, "y": 260, "w": 180, "h": 180 } ],
  "audioTracks": [ { "assetId": "...", "startOffset": 0, "volume": 1 } ]
}
```

- `size`: `[w, h]`, `"1080x1920"` or a preset by name (`"Story"`). Vertical reel/story = `[1080, 1920]`; square = `[1080, 1080]`; landscape = `[1920, 1080]`.
- `defaults: "flat"`: turns off the default gradient, shadow and border of shapes (not a path's `stroke`, not the background). Always set it.
- `background`: a partial object or a background preset name (`preset_list`). Turn off `gradient`, `dots` and `spotlight` explicitly when you want a plain colour.
- `shots`: native shots, transitions and camera (see `shots-camera.md`).
- `symbols` + `kind: "use"`: define a piece once and place instances (`symbol`, `x, y, w, h`, `overrides` keyed by child id).
- `audioTracks`: the scene's audio; `scene_build` keeps the stored audio unless you pass it.
- Element: `kind` + the component's fields, plus shortcuts:
  - `id`: stable and readable (`car`, `wheel-l`). Tracks, lines, masks and `group/child` targets need it.
  - `name`: label shown in the editor's layers panel. Make it human ("Shot 2 · tree crown").
  - `shot`: id of the shot it belongs to (top-level elements only); it is visible only in that shot.
  - `preset`: start from a preset (`preset_list`, `preset_get`).
  - `at`: `"center"`, `"top"`, … or `{anchor, offset:[dx,dy]}`. Inside a group it resolves against the group's box. Not for text without `w` (see gotchas).
  - `fit: "canvas"`: covers the whole canvas.
  - `from` / `to`: ids a `line` connects.
  - `opacity` (0–1, every kind, animatable) and `origin` (pivot for rotate/scale: anchor name, `[x, y]` or `{x, y}` in box fractions).
  - `tracks`: `{ "x": [[t, value, easing?], ...] }`, or `{ "@rotate": { "keys": [...], "repeat": "loop" | "pingpong", "until": 6 } }`.
  - `anim`: `"fade"` (entry shortcut) or `{in, loop, out}`.
  - `animPreset`: `"name"` or `{name, start}` from `presets/animations/`.
  - `effects`: partial `{blur, blend, mask}`, merged with the defaults.
  - `children`: only on `group`.

## Tools (MCP, or `pnpm lienzo <tool> --json '{...}'` from the Lienzo repo)

Every scene, asset and export tool needs `project` (no default). Targets are an `id` or a `group/child` path. Patches deep-merge: objects key by key, arrays replaced whole; in `scene_update` a `null` deletes a key. Errors come back as `{ code, message, path }`.

| Area | Tool | Use |
|---|---|---|
| Project | `project_list` / `project_create` / `project_inspect` | pick, create or read a project (brand, assets, presets, scenes) |
| | `project_update` / `project_delete` | brand name, palette, fonts, default canvas; delete |
| | `asset_add` | copy a local file (image, svg, glb, audio, font; ≤ 20 MB) into `assets/`, returns the `src` |
| Scene | `scene_list` / `scene_get` | list scenes; read the expanded JSON |
| | `scene_build` | build/save the compact scene (the main route) |
| | `scene_create` | empty scene (`mode: "static"` or `"video"`) |
| | `scene_update` | patch `width`, `height`, `duration`, `fps`, `mode`, `audio`, `audioTracks`, `symbols` |
| | `scene_rename` / `scene_delete` | manage scene files (`name`) |
| | `background_set` | background from a preset or `values` |
| | `shot_set` | create, edit or `remove` a shot (start, end, transition, camera) |
| | `scene_generate_speech` | TTS voice + synced subtitles; `asTrack: true` + `startOffset` adds one track per shot |
| Check | `scene_validate` | first failing path + notices, without saving |
| | `scene_inspect_layout` | overlaps, off-canvas, broken lines, contrast, drawn boxes at `times` |
| | `scene_preview` | PNG at time `t` (`scale` 0.3–0.5; `out` saves it in `exports/`) |
| | `scene_export` | `format`: `png`, `gif`, `mp4` (WebM without H.264) |
| Elements | `component_list` | kinds and the animatable paths of each |
| | `element_add` / `element_update` / `element_remove` | targeted edits (`parent` inserts in a group, `at` re-centres) |
| | `element_move` | layer order: `front`, `back`, `forward`, `backward` or an index |
| | `element_group` / `element_ungroup` | group 2+ top-level elements, or ungroup |
| | `image_trim` | crop an image's transparent margin (changes `crop`, not the file) |
| Motion | `keyframe_set` / `keyframe_remove` | one keyframe at `path`, `t` (`repeat`, `until` on the track) |
| | `animation_list` / `animation_save` | animation presets (`animPreset`) |
| Presets | `preset_list` / `preset_get` | element and background presets |
| | `preset_validate` / `preset_save` / `preset_rename` / `preset_delete` | project presets (built-ins are read-only) |
| Fonts | `font_list` / `font_install` | available fonts; install a Google family or a local file |

With the CLI, pass large objects with `--json @file.json` (an absolute path; the CLI runs from the Lienzo repo). While you are still drafting, rebuilding with `scene_build` + `overwrite: true` beats many `element_update` calls. Once the user has edited the scene, switch to targeted edits (see joint mode in SKILL.md).
