# Shots, cuts and camera

Shots are native: a scene-level `shots` list, and each top-level element names its `shot`. Edit them later with `shot_set`.

## Native shots

```json
"shots": [
  { "id": "s1", "name": "Shot 1 · road", "start": 0, "end": 3 },
  { "id": "s2", "name": "Shot 2 · tree", "start": 3, "end": 6, "camera": { "zoom": 1.1 } }
],
"elements": [
  { "id": "road-bg", "kind": "rect", "shot": "s1", "x": 0, "y": 0, "w": 1080, "h": 1920, ... },
  { "id": "tree-bg", "kind": "rect", "shot": "s2", "x": 0, "y": 0, "w": 1080, "h": 1920, ... },
  { "id": "caption", "kind": "text", "x": 0, "y": 1600, "w": 1080, "align": "center", ... }
]
```

- An element with `shot` is drawn only from the shot's `start` to its `end`. Its `anim` delays and track times stay in **scene seconds**.
- An element without `shot` is drawn for the whole scene (logos, captions, voice subtitles).
- Shots in chronological order; each shot needs a full-frame backdrop as its first element, or the background shows through.
- `scene_inspect_layout` skips elements outside their shot, so its warnings only cover what is visible.

## Transitions (Lienzo 063)

A shot's `transition: {kind, duration}` plays over `duration` **before its `start`** (entering) and **after its `end`** (leaving), so consecutive shots overlap there:

| `kind` | Entering | Leaving |
|---|---|---|
| `cut` (or none) | appears at `start` | disappears at `end` |
| `fade` | opacity 0 → 1, over the previous shot | opacity 1 → 0 |
| `slide` | comes in from the right edge | goes out to the left |
| `zoom` | grows 0.8 → 1 while fading in | shrinks while fading out |

- Cross-fade A → B: give B `transition: {kind: "fade", duration: d}`; A stays drawn under it until its `end` (= B's `start`).
- Fade to black (no native kind): full-screen black `rect` with no `shot`, last in `elements`, `opacity` track 0→1→0 around the cut.

## Camera (verified 2026-10-25)

`camera: {x, y, zoom, tracks}` translates and scales around the frame centre: `x`/`y` move the content (positive `x` moves it right), `zoom` > 1 enlarges. `tracks` animate `x`, `y` and `zoom` in scene seconds (`shot_set` edits them).

Since Lienzo 063 the camera moves only the elements of its own shot, groups included (applied once, at any depth), and never elements without `shot` (captions, logos and subtitles stay put). It is the way to pan and zoom; the legacy pattern below is only for existing videos.

## Legacy: shot = full-screen group

Used by existing videos (ringana-omega-v2, `examples/car-road-tree.json`). New scenes use native shots and camera.

```json
{ "id": "shot-1", "name": "Shot 1 · road", "kind": "group", "x": 0, "y": 0, "w": 1080, "h": 1920, "cw": 1080, "ch": 1920,
  "anim": { "out": { "kind": "fade", "delay": 2.9, "duration": 0.1 } },
  "children": [ ... ] }
```

- First shot only has `out`, middle shots `in` and `out`, the last only `in`. Shot from A to B: `in.delay = A`, `out.delay = B - out.duration`.
- Cross-fade: shot B enters with a 0.5–1 s `fade` while A is still visible.
- **Slow zoom (Ken Burns):** `"@scale": [[A, 1, "linear"], [B, 1.15]]` on the shot group (pivot = `origin`, default centre). `scene_inspect_layout` then reports `out_of_bounds`; expected.
- **Pan:** a "world" group wider than the canvas (`w: 3240, cw: 3240`) whose `x` goes from 0 to -2160.
- **Zoom to a point:** set the shot group's `origin` to that point and animate `@scale`.
- **Shake:** `loop` `wobble` or `jello` with a small `amount`.

## Parallax (depth)

Layers at different speeds, each looping over an exact period:

| Layer | Shift per loop |
|---|---|
| far mountains | 0–10 % of the width |
| mid trees | 50 % |
| road and markings | 100 % (one pattern period) |

Repeated pattern: a group twice as wide with the pattern twice, and `x` from `0` to `-width` with `repeat: "loop"` on the track. Each cycle then ends where it started.

## Shot list template

| Shot | Start–end | Framing | Motion | Text |
|---|---|---|---|---|
| 1 | 0–3 | wide, road | car still in X, world scrolls, wheels spin | "Off to the countryside" |
| 2 | 3–6 | tree shot | zoom 1→1.15, crown `swing` | "…and some shade" |
