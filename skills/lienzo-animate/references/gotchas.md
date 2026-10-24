# Verified mistakes

All of these were reproduced against Lienzo while writing and testing this skill.

| Symptom | Cause | Fix |
|---|---|---|
| Shapes with a dark gradient and a shadow you never asked for | rect/ellipse/path/polygon/star default to `fill.gradient: true` and `shadow.enabled: true` | `"fill": {"gradient": false, ...}`, `"shadow": {"enabled": false}`, `"border": {"width": 0}` |
| Only the first shape of a path shows | several `shapes` = morph frames, not layers | one `path` per colour layer |
| Group child in a strange place | children use local coords; default `cw/ch` of 100 stretches the content | always `cw = w`, `ch = h` |
| Text off-centre with `at` | the text measurer underestimates width (about 1/4 of the real width) | full-width transparent `rect` with a centred `label` (recipe) |
| `at` inside a group does nothing useful | `at` resolves against the scene and is not applied properly to children | explicit coordinates on children |
| No `opacity` on `group`, `rect`, `ellipse` | the field does not exist | group: `anim.in/out fade`; shapes: `fill.opacity` |
| `effects` disappears | `scene_build` drops it | `element_update` afterwards, top level, full object `{blur, blend, mask}` |
| `element_update` says "No existe el elemento" | it only sees top-level elements | rebuild with `scene_build` + `overwrite` (only if the user has not edited the scene) |
| Gradient in the wrong direction | 0° = left→right | 90° = top→bottom, 180° = right→left |
| Jump when the GIF/MP4 repeats | the loop does not close | integer `cycles`; tracks that end at the start value or shift by exactly one period |
| `out_of_bounds` from `scene_inspect_layout` on a zooming shot | the shot grows through `@scale` | expected; ignore it |
| Absurd text widths in `scene_inspect_layout` `boxes` | same text measurer | trust `scene_preview` |
| `Invalid input` at `compact.elements.N` with no detail | the union of kinds hides the real field | validate that element's children one by one with `scene_build` without `save` |
| Particles invalidate the whole shot | `speed` and `count` are integers (`speed` ≥ 1, laps per loop) | `speed: 1` for slow motion, lower `drift` |
| `out_of_bounds` warnings for a shot that is no longer visible | `scene_inspect_layout` ignores `anim.in/out` | ignore warnings outside the shot's window |
| The user's corrections disappear | `scene_build` + `overwrite` rewrites the scene | in joint mode, `scene_get` and targeted edits (see SKILL.md) |
| Something "stops" halfway through a shot | tracks hold their last value; the loop was shorter than the shot | put the last keyframe at the end of the shot (or scene) |
| A rotating piece comes loose (crown, arm) | `@rotate` and `swing` turn around the box centre | centre the group's box on the joint (see recipes) |
| A `polygon` triangle does not touch the wall | `sides: 3` is a regular inscribed triangle; its base sits at ~75 % of the box | use a `path` `M0 h L w/2 0 L w h Z` |
| "Still" particles move | `particles` always wander | `drift: 0` for still stars |
| The user cannot find what to fix | too many elements with technical ids | give every shot, object and piece a readable `name` ("Shot 2 · tree crown") |
