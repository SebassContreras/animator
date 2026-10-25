# Motion

Three layers combine on each element, in this order: **tracks** (keyframes), then **anim** (`in`, `loop`, `out`).

## anim

```json
"anim": {
  "in":   { "kind": "slide", "from": "down", "amount": 20, "delay": 0.2, "duration": 0.5, "easing": "cubic-out" },
  "loop": { "kind": "float", "amount": 6, "cycles": 2 },
  "out":  { "kind": "fade", "delay": 2.9, "duration": 0.1 }
}
```

- `in` / `out` kinds: `fade, pop, slide, zoom, rotate, bounce, flip, back`, plus `draw` on `path` (draws the stroke on).
- `delay` = the scene second it starts. Before its `in`, the element is **not visible** (fade). After its `out`, neither. This defines visibility windows.
- `loop` kinds: `float, pulse, breathe, bounce, flash, heartbeat, jello, swing, tada, wobble, highlight`. `cycles` = whole cycles per scene, for seamless loops. Loops rotate/scale around `origin` (default the box centre).
- `from` (slide direction): `up, down, left, right`.
- `group.stagger` (s): spreads the group's `in`/`out` over its children, one after another.

## tracks (keyframes)

```json
"tracks": {
  "x":       [[0, 0, "linear"], [3, -1080]],
  "@rotate": [[0, 0, "linear"], [3, 1080]],
  "fill.color": [[0, "#22C55E"], [2, "#F59E0B", "ease-in-out"]]
}
```

- Tuple `[t, value, easing]`; the easing shapes the segment **from** that keyframe to the next. Before the first and after the last, the value holds, unless the track repeats.
- Animatable paths per kind: `component_list`. Common ones: `x, y, w, h, opacity` (every kind, groups included; a group's opacity multiplies its children's), `fill.color`, and the channels `@rotate` (degrees) and `@scale`, both around `origin`.
- Easings: `linear, ease, ease-in, ease-out, ease-in-out, quad-*, cubic-*, back-*, bounce-*, elastic-*` (`-in`, `-out`, `-in-out`), plus `step`/`hold` (the value jumps at the next keyframe).
- **Repeat:** the object form `{ "keys": [...], "repeat": "loop" | "pingpong", "until": 6 }` replays the keys (pingpong goes back and forth) until `until` (default: the scene end). A plain array does not repeat: the value freezes after the last keyframe. `keyframe_set` takes `repeat` and `until` too.
- Instant change: a `step`/`hold` easing, or two keyframes one frame apart (1/fps s).
- Spinning wheel: `@rotate` `{ "keys": [[0,0,"linear"],[1, 360]], "repeat": "loop" }` (one turn per second), or `[[0,0,"linear"],[D, 360*n]]`. To match the spin to the travel: degrees per second ≈ speed(px/s) / (π·diameter) · 360.

## origin

`origin` is the pivot of `@rotate`, `@scale` and loop transforms: an anchor (`"center"`, `"top"`, `"bottom-left"`, …), `[x, y]` or `{x, y}` in fractions of the box (default `[0.5, 0.5]`).

## Animation presets

`animPreset: {"name": "...", "start": 1.2}` copies a preset from `presets/animations/` starting at second `start`. Useful to repeat the same entry on many elements. `animation_list` lists them, `animation_save` adds one.
