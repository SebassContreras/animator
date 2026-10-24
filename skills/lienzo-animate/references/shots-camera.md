# Shots, cuts and camera

Lienzo has no shots or camera. Build them like this (verified in `examples/car-road-tree.json`):

## Shot = full-screen group

```json
{ "id": "shot-1", "name": "Shot 1 · road", "kind": "group", "x": 0, "y": 0, "w": 1080, "h": 1920, "cw": 1080, "ch": 1920,
  "anim": { "out": { "kind": "fade", "delay": 2.9, "duration": 0.1 } },
  "children": [ ... ] }
```

- The first shot only has `out`. Middle shots have `in` and `out`. The last one only `in`.
- Shot from A to B: `in.delay = A`, `out.delay = B - out.duration`.
- The shot must cover everything (a 1080×1920 sky/backdrop `rect` as first child), or the scene background or the previous shot shows through.
- Order in `elements`: shots in chronological order. The later one sits on top.
- Every moving thing inside a shot must keep moving until B (tracks freeze after their last keyframe).

## Transitions

| Transition | How |
|---|---|
| Hard cut | `out` and `in` `fade` with `duration` 0.1 at the same second |
| Cross-fade | shot B enters with a 0.5–1 s `fade` while A is still visible (no `out` on A until B is opaque) |
| Fade to black | full-screen black `rect` with `fill.opacity` tracks 0→1→0 around the cut |
| Wipe | shot B with `in` `slide` `from: "right"`, large `amount` |
| Zoom in | shot B with `in` `zoom` |

## Camera

The camera is the shot group itself (or a "world" group inside it):

- **Slow zoom (Ken Burns):** `"@scale": [[A, 1, "linear"], [B, 1.15]]` on the shot. Scales from the centre.
- **Pan:** the world is bigger than the canvas (e.g. `w: 3240, cw: 3240`) and you animate its `x` from 0 to -2160.
- **Zoom to a point:** animate the world group's `x, y, w, h` together (with fixed `cw`/`ch`) to frame an area.
- **Shake:** `loop` `wobble` or `jello` with a small `amount`.
- `scene_inspect_layout` reports `out_of_bounds` when the shot scales beyond the canvas. Expected for zoom/pan.

## Parallax (depth)

Layers at different speeds, each looping over an exact period:

| Layer | Shift per loop |
|---|---|
| far mountains | 0–10 % of the width |
| mid trees | 50 % |
| road and markings | 100 % (one pattern period) |

Repeated pattern: a group twice as wide with the pattern twice, and `x` from `0` to `-width` over the loop duration. The last frame then matches the first.

## Shot list template

| Shot | Start–end | Framing | Motion | Text |
|---|---|---|---|---|
| 1 | 0–3 | wide, road | car still in X, world scrolls, wheels spin | "Off to the countryside" |
| 2 | 3–6 | tree shot | zoom 1→1.15, crown `swing` | "…and some shade" |
