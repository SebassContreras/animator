# 005 — promote-viaje — Requirements

## What's being built

The promotion of the pieces `viaje` proved (004 close-out of a migrated video), from `videos/viaje/scene.gen.cjs` to `lib/`.

## Who it serves

Every future video that needs a vehicle, a town, a sky or readable layer names.

## Requirements

- R1@1: `lib/objects.cjs` exports `car` (body, glass, light and two spinning wheels) that takes its colours from a palette-like argument and the spin length as a parameter (A11, A12).
- R2@1: `lib/objects.cjs` exports `house` (path roof overlapping the wall, two windows that light up from a given time, door) with colours from an argument.
- R3@1: `lib/environment.cjs` exports `cloud` (three ellipses drifting by `dx` over a shot) with its colour from an argument.
- R4@1: `lib/environment.cjs` exports `dashes` (looping road markings whose period is a parameter, so it can equal the shot length) with its colour and width from arguments.
- R5@1: `lib/scene.cjs` exports `nameAll(elements, names, parts)`, which gives every element a readable `name` from an id map and names children as "<parent> · <part>".
- R6@2: `videos/viaje/scene.gen.cjs` uses the `lib/` versions and writes a `scene.json` whose parsed value is deep-equal to the one it wrote before the move (key order may change).
- R7@1: Each promoted finding in `videos/viaje/learnings.md` ends with `— promoted: <lib file>`.

## Out of scope

- Redesigning `viaje` or giving it a `palette.json`; its colours stay as they are.

## Dependencies

004 (close-out that opened this spec), 002 (lib).

## Owner split

Agent tasks only.
