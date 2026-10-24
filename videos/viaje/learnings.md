# viaje — Learnings

What this video taught, one bullet per finding, under its kind (004/R1). Close-out promotes `Piece` and `Rule` findings. A promoted finding ends with `— promoted: <repo path>`; every `Engine` finding ends with `— tracks: <url>`.

Session 2026-10-24, project `animator-lab`: a 12 s vertical video with 4 shots, built in joint mode.

## Piece

- `car` with spinning `wheel`s: a group with the body and two wheels whose rotation loops for the whole shot (`scene.gen.cjs` → `car`, `wheel`). — promoted: lib/objects.cjs
- `house` with a `path` roof that overlaps the wall and windows that light up at a given time (`scene.gen.cjs` → `house`). — promoted: lib/objects.cjs
- `cloud` drifting across the sky as a parallax layer (`scene.gen.cjs` → `cloud`). — promoted: lib/environment.cjs
- Road `dashes` that loop with a period equal to the shot length, so the road never freezes (`scene.gen.cjs` → `dashes`). — promoted: lib/environment.cjs
- `nameAll` gives every group and main piece a readable `name` so the user finds it in the layers panel (`scene.gen.cjs` → `nameAll`). — promoted: lib/scene.cjs

## Rule

- `Invalid input` at `compact.elements.N` names no field: validate that element's children one by one until the culprit shows. — promoted: skills/lienzo-animate/references/gotchas.md
- `particles.speed` is an integer ≥ 1 (laps per loop), not a continuous speed; `0.3` invalidates the whole shot. — promoted: skills/lienzo-animate/references/gotchas.md
- `particles` only float around their place (`drift`); falling leaves or rain need a group of drops with a looping `y` track. — promoted: skills/lienzo-animate/references/drawing.md
- Ignore `scene_inspect_layout` warnings for a shot outside its visibility window. — promoted: skills/lienzo-animate/references/gotchas.md
- A scene with more than one shot is built from a generator script that fixes the dangerous defaults once. — promoted: skills/lienzo-animate/SKILL.md
- Joint mode: never rebuild with `scene_build` + `overwrite` on a scene the user corrected; read `scene_get`, apply targeted changes, or carry the user's edits into the generator first. — promoted: skills/lienzo-animate/SKILL.md
- Tracks hold their last value: a looping track's period must equal the shot length, or the motion "stops" mid-shot. — promoted: skills/lienzo-animate/references/gotchas.md
- `swing` turns around the box centre: to pivot on a point (tree crown on its trunk), centre the group's box on that point. — promoted: skills/lienzo-animate/references/recipes.md
- `polygon` with `sides: 3` is a regular inscribed triangle whose base sits at ~75 % of the box; draw triangles with `path`. — promoted: skills/lienzo-animate/references/gotchas.md
- Still stars need `drift: 0`; `particles` wander otherwise. — promoted: skills/lienzo-animate/references/gotchas.md
- Give every shot, group and main piece a readable `name` ("Shot 2 · tree crown"). — promoted: skills/lienzo-animate/references/gotchas.md

## Engine

- `scene_build` validation errors lose the inner path of the compact union (`compact.elements.3: Invalid input`), so the faulty field is not named. — tracks: https://github.com/SebassContreras/lienzo/issues/1
- `particles` cannot fall or stay still by speed: points always wander around their place, and `speed` has a minimum of 1. — tracks: https://github.com/SebassContreras/lienzo/issues/2
- `scene_inspect_layout` ignores `anim.in`/`anim.out`, so it reports `out_of_bounds` for shots that are not visible at that time. — tracks: https://github.com/SebassContreras/lienzo/issues/3
- Compact scenes have no reusable pieces: repeated objects (car, houses, shots) must be written out in full or produced by an external generator. — tracks: https://github.com/SebassContreras/lienzo/issues/4
- Joint mode: `scene_build` + `overwrite` wipes the user's manual edits with no warning or merge. — tracks: https://github.com/SebassContreras/lienzo/issues/5
- A looping track cannot be told to repeat over the shot; it holds its last value after its last keyframe. — tracks: https://github.com/SebassContreras/lienzo/issues/6
- `swing` has no pivot setting; it always turns around the element's box centre. — tracks: https://github.com/SebassContreras/lienzo/issues/7
- `polygon` `sides: 3` is inscribed in the box, so a triangle never touches the box's bottom edge. — tracks: https://github.com/SebassContreras/lienzo/issues/8
- Elements get technical ids and no readable name by default, so a scene with 100+ nested elements is hard to edit by hand. — tracks: https://github.com/SebassContreras/lienzo/issues/9

## Local

- The user reviewed in the editor and reported four problems in words instead of editing by hand, because they could not find the elements among so many.
