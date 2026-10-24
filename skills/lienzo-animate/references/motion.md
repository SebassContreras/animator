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
- `loop` kinds: `float, pulse, breathe, bounce, flash, heartbeat, jello, swing, tada, wobble, highlight`. `cycles` = whole cycles per scene, for seamless loops. Loops rotate/scale around the centre of the box.
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

- Tuple `[t, value, easing]`; the easing shapes the segment **from** that keyframe to the next. Before the first and after the last, the value holds.
- Animatable paths per kind: `component_list`. Common ones: `x, y, w, h, opacity` (not on rect/ellipse/group: use `fill.opacity`), `fill.color`, and the channels `@rotate` (degrees, around the box centre) and `@scale` (around the centre).
- Easings: `linear, ease-in, ease-out, ease-in-out, quad-*, cubic-*, back-*, bounce-*, elastic-*` (`-in`, `-out`, `-in-out`).
- **Tracks do not repeat**: after the last keyframe the value freezes. Continuous motion must last until the end of its shot.
- Instant change: two keyframes one frame apart (1/fps s).
- Spinning wheel: `@rotate` `[[0,0,"linear"],[D, 360*n]]`. To match the spin to the travel: degrees per second ≈ speed(px/s) / (π·diameter) · 360.

## Animation presets

`animPreset: {"name": "...", "start": 1.2}` copies a preset from `presets/animations/` starting at second `start`. Useful to repeat the same entry on many elements.
