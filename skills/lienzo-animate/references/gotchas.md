# Verified mistakes

All of these were reproduced against Lienzo (after its spec 062) with probe scenes built with `scene_build` and checked in `scene_preview`.

| Symptom | Cause | Fix |
|---|---|---|
| Shapes with a dark gradient, a shadow and a border you never asked for | rect/ellipse/path/polygon/star default to `fill.gradient: true`, `shadow.enabled: true` and a border | `"defaults": "flat"` at the scene level (or per shape `fill.gradient: false`, `shadow.enabled: false`, `border.width: 0`) |
| A path has a light-blue outline even with `defaults: "flat"` | `path` defaults to `stroke: {width: 3, color: "#93c5fd"}`; `flat` does not touch `stroke` | `"stroke": {"width": 0}` on every filled path |
| Shapes look slightly see-through | `fill.opacity` defaults to `0.9` | `"fill": {"opacity": 1, ...}` when the colour must be exact |
| A radial or multi-stop fill draws as a flat colour | `defaults: "flat"` sets `fill.gradient: false`, which also turns off `type: "radial"` and `stops` | set `"gradient": true` on that fill |
| Background has a gradient, dots and a spotlight you never asked for | the background defaults keep `gradient`, `dots` and `spotlight: 0.35` even when you give a `color` | `"background": {"color": ..., "gradient": false, "dots": false, "spotlight": 0}` |
| Only the first shape of a path shows | `mode` defaults to `"morph"`: several `shapes` are morph frames | `"mode": "layers"`, each shape with its own `fill` (a colour string) |
| Group child in a strange place or clipped away | children use local coords (0..cw, 0..ch); default `cw/ch` is 100; `at` on a child resolves against the group's `w`/`h`, not `cw`/`ch` | always `cw = w`, `ch = h` |
| Text with `at` sits off-centre | without `w`, the measured width is still short (~844 px measured vs ~920 px drawn for an 80 px headline), so the left edge is too far right | centred text: `text` with `x: 0`, `w` = frame width, `align: "center"`; never `at` on text without `w` |
| `scene_inspect_layout` box widths for text without `w` are too small | same measurement | give text a `w`; trust `scene_preview` |
| A field you set has no effect and there is no notice | unknown keys are dropped silently (e.g. `color` on `particles`; its colour is `dot.color`) | check the field names with `component_list` / `docs/components.md`; read the expanded element `scene_build` returns |
| `particles` draw a network of lines | `link` is on by default | `"link": {"distance": 0}` (or `width`/`opacity` 0) for plain dots |
| Gradient in the wrong direction | 0° = left→right | 90° = top→bottom, 180° = right→left |
| Jump when the GIF/MP4 repeats | the loop does not close | integer `cycles`; tracks that end at the start value, or `repeat: "loop"` with a period that divides the duration |
| A `polygon` triangle does not touch the box | `fit` defaults to `"circle"`: a regular inscribed triangle | `"fit": "box"` |
| A rotating piece comes loose (crown, arm) | `@rotate`, `@scale` and loops turn around `origin`, default the box centre | set `origin` to the joint (`"bottom"`, `[0.5, 0.9]`, …) |
| The user's corrections disappear | `scene_build` + `overwrite` rewrites the scene | in joint mode, `scene_get` and targeted edits (see SKILL.md) |
| The user cannot find what to fix | too many elements with technical ids | give every shot, object and piece a readable `name` ("Shot 2 · tree crown") |
| Text renders in another font | the font is not installed in the project | read the `notices` of `scene_build` / `scene_validate` ("no está instalada"); `font_install` each family used |
| A shot's `transition` (fade, slide, zoom) does nothing visible; both shots show at once | the renderer ignores `transition.kind`; it only widens both shots' windows by `duration` | no `transition`; build fades with `anim.in` / `opacity` (see shots-camera) |
| A group in a shot with a `camera` is in the wrong place or gone | the camera is applied again inside each group (engine fault) | native camera only for shots without groups; else legacy group shot with `@scale` / `x` |
| A caption or logo without `shot` zooms or pans | the active shot's camera moves every element | no native camera while a shot-less element is on screen |
| A `rect` has rounded corners | `radius` defaults to a non-zero value | `"radius": 0` |
| `out_of_bounds` on a legacy group shot that zooms | the shot group grows through `@scale` | expected for group shots; native shots move the camera instead |
