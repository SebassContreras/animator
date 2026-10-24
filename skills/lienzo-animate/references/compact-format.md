# Compact format and tools

`scene_build` takes `{ compact, project, save?, overwrite? }`. Every field is optional and filled with the component's defaults.
The full JSON schema lives in the Lienzo repo: `schemas/compact-scene.json`.

```json
{
  "size": [1080, 1920],
  "duration": 6,
  "fps": 30,
  "background": { "color": "#87CEEB", "gradient": true, "color2": "#E0F2FE", "angle": 90, "dots": false, "spotlight": 0 },
  "elements": [ { "id": "sun", "kind": "ellipse", "x": 760, "y": 260, "w": 180, "h": 180 } ]
}
```

- `size`: `[w, h]`, `"1080x1920"` or a preset by name (`"story"`). Vertical reel/story = `[1080, 1920]`; square = `[1080, 1080]`; landscape = `[1920, 1080]`.
- `background`: a partial object or a background preset name (`preset_list`).
- Element: `kind` + the component's fields, plus shortcuts:
  - `id`: stable and readable (`car`, `wheel-l`). Tracks, lines and masks need it.
  - `name`: label shown in the editor's layers panel. Make it human ("Shot 2 · tree crown").
  - `preset`: start from a preset (`preset_list`, `preset_get`).
  - `at`: `"center"`, `"top"`, … or `{anchor, offset:[dx,dy]}`. Top level only and **not for text** (see gotchas).
  - `fit: "canvas"`: covers the whole canvas.
  - `from` / `to`: ids a `line` connects.
  - `tracks`: `{ "x": [[t, value, easing?], ...], "@rotate": [...] }`.
  - `anim`: `"fade"` (entry shortcut) or `{in, loop, out}`.
  - `animPreset`: `"name"` or `{name, start}` from `presets/animations/`.
  - `children`: only on `group`.

## Tools (MCP, or `pnpm lienzo <tool>` from the Lienzo repo)

| Tool | Use |
|---|---|
| `component_list` | kinds and the animatable paths of each |
| `preset_list` / `preset_get` | element and background presets |
| `scene_build` | build/save the compact scene (the main route) |
| `scene_validate` | validate without saving |
| `scene_get` | read the expanded scene |
| `element_update` / `keyframe_set` | targeted edits without rebuilding (top-level elements only) |
| `scene_preview` | PNG at time `t` (`scale` 0.3–0.5 is enough) |
| `scene_inspect_layout` | off-canvas, overlaps, contrast, boxes (`times`) |
| `scene_export` | `format`: `png`, `gif`, `mp4` |

With the CLI, pass large objects with `--json @file.json`. While you are still drafting, rebuilding with `scene_build` + `overwrite: true` beats many `element_update` calls. Once the user has edited the scene, switch to targeted edits (see joint mode in SKILL.md).
