# Verified mistakes

All of these were reproduced against Lienzo (after its spec 062; rows fixed by spec 063 are updated) with probe scenes built with `scene_build` and checked in `scene_preview`.

| Symptom | Cause | Fix |
|---|---|---|
| Shapes with a dark gradient, a shadow and a border you never asked for | rect/ellipse/path/polygon/star default to `fill.gradient: true`, `shadow.enabled: true` and a border | `"defaults": "flat"` at the scene level (or per shape `fill.gradient: false`, `shadow.enabled: false`, `border.width: 0`) |
| A path with a `"draw"` entrance shows an outline you did not set | since Lienzo 063 a path has no stroke by default, and `"draw"` gives it width 3 so the drawing shows | set `border.width` (a path's outline is `border`; a `stroke` key is ignored) |
| A radial or multi-stop fill draws as a flat colour | `defaults: "flat"` sets `fill.gradient: false`, which also turns off `type: "radial"` and `stops` | set `"gradient": true` on that fill |
| Background has a gradient, dots and a spotlight you never asked for | the background defaults keep `gradient`, `dots` and `spotlight: 0.35` even when you give a `color` | `"background": {"color": ..., "gradient": false, "dots": false, "spotlight": 0}` |
| Only the first shape of a path shows | `mode` defaults to `"morph"`: several `shapes` are morph frames | `"mode": "layers"`, each shape with its own `fill` (a colour string) |
| Group child in a strange place or clipped away | children use local coords (0..cw, 0..ch); default `cw/ch` is 100; `at` on a child resolves against the group's `w`/`h`, not `cw`/`ch` | always `cw = w`, `ch = h` |
| Text with `at` and no `w` sits off-centre | only with a font that is not bundled (Inter, Space Grotesk, Poppins, JetBrains Mono, Caveat, Press Start 2P): its width is estimated; bundled fonts are measured exactly since Lienzo 063 | with another font, give the text a `w` and `align: "center"` |
| A field you set has no effect | unknown keys are dropped (e.g. `color` on `particles`; its colour is `dot.color`); since Lienzo 063 each comes back as a notice ("Campo desconocido ignorado: …" with its path) | read the `notices` of `scene_build` / `scene_validate`; check names with `component_list` |
| `particles` draw a network of lines | `link` is on by default | `"link": {"distance": 0}` (or `width`/`opacity` 0) for plain dots |
| Gradient in the wrong direction | 0° = left→right | 90° = top→bottom, 180° = right→left |
| Jump when the GIF/MP4 repeats | the loop does not close | integer `cycles`; tracks that end at the start value, or `repeat: "loop"` with a period that divides the duration |
| A `polygon` triangle does not touch the box | `fit` defaults to `"circle"`: a regular inscribed triangle | `"fit": "box"` |
| A rotating piece comes loose (crown, arm) | `@rotate`, `@scale` and loops turn around `origin`, default the box centre | set `origin` to the joint (`"bottom"`, `[0.5, 0.9]`, …) |
| The user's corrections disappear | `scene_build` + `overwrite` rewrites the scene | in joint mode, `scene_get` and targeted edits (see SKILL.md) |
| The user cannot find what to fix | too many elements with technical ids | give every shot, object and piece a readable `name` ("Shot 2 · tree crown") |
| Text renders in another font | the font is not installed in the project | read the `notices` of `scene_build` / `scene_validate` ("no está instalada"); `font_install` each family used |
| A `rect` has rounded corners | `radius` defaults to a non-zero value | `"radius": 0` |
| `out_of_bounds` on a legacy group shot that zooms | the shot group grows through `@scale` | expected for legacy group shots; use the native camera instead |
