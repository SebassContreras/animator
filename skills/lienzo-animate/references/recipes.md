# Recipes

Tested in `examples/car-road-tree.json`, or against Lienzo with probe scenes (spec 010).

## Centred text

A `text` as wide as the frame, centred inside its box (it wraps when longer than `w`):

```json
{ "id": "title", "name": "Title", "kind": "text", "shot": "s1", "x": 0, "y": 420, "w": 1080, "align": "center",
  "text": "Off to the countryside", "font": "Inter", "size": 84, "weight": 800, "color": "#0F172A",
  "anim": { "in": { "kind": "slide", "from": "down", "delay": 0.2, "duration": 0.5 },
            "out": { "kind": "fade", "delay": 2.9, "duration": 0.1 } } }
```

Legacy videos use a transparent full-width `rect` with a centred `label` instead; it still works.

## Looping road markings

A group twice the width with the pattern repeated, shifted one width per cycle, repeating until the shot ends:

```json
{ "id": "dashes", "kind": "group", "x": 0, "y": 1450, "w": 2160, "h": 20, "cw": 2160, "ch": 20,
  "tracks": { "x": { "keys": [[0, 0, "linear"], [1, -1080]], "repeat": "loop", "until": 3 } },
  "children": [ { "kind": "rect", "x": 0, "y": 0, "w": 160, "h": 20, "...": "every 270 px up to 2160" } ] }
```

The pattern period (270 px) divides 1080, so the last frame joins the first.

## Driving car

The car stays in X and the world moves (road, hills slower). Wheels with linear `@rotate`. A `loop: float` with `amount` 4 and many `cycles` gives engine vibration.

To cross the screen, animate the car group's `x` from `-500` to `1080`.

## Wind in a tree (crown attached to the trunk)

Set the crown group's `origin` to the point where it meets the trunk; leaves overlap the trunk by ≥ 50 px:

```json
{ "id": "crown", "name": "Tree crown", "kind": "group", "x": 240, "y": 560, "w": 600, "h": 500, "cw": 600, "ch": 500,
  "origin": [0.5, 0.95],
  "anim": { "loop": { "kind": "swing", "amount": 2, "cycles": 4 } },
  "children": [ "... leaves; the trunk top is at local y 475" ] }
```

## Any pivot

To swing an arm from the shoulder or a door from its hinge: `origin` at the joint (`"top"`, `"left"`, `[x, y]` in box fractions). Legacy scenes did it with a group whose box is symmetric around the pivot.

## Lights turning on

Window `rect` with `"fill.color": [[t, "#1E293B"], [t + 0.3, "#FDE047"]]`. Stagger `t` between windows.

## Slow shot zoom

The shot's `camera.tracks.zoom` `[[3, 1, "linear"], [6, 1.15]]` (see shots-camera); groups in the shot zoom with it.

## Glowing sun or moon

`ellipse` with `"bgGlow": {"enabled": true, "color": "#FDE047", "blur": 80, "strength": 1}`.

## Still starry sky

`particles` with `count: 80`, `motion: "static"`, `twinkle: 0.4`, `dot.size: 3`, `link.distance: 0`. Falling snow or rain: `motion: "fall"`, `direction` 90, `gravity`.

## Fade to black at the end

Full-screen black `rect`, last in `elements`, with `"opacity": [[D - 1, 0, "ease-in"], [D, 1]]`.

## Repeated piece (symbol)

Define it once in `symbols`, place it with `use`; `overrides` change one child per instance:

```json
"symbols": { "tree": { "w": 200, "h": 300, "children": [ ... ] } },
"elements": [
  { "id": "tree-1", "kind": "use", "symbol": "tree", "x": 100, "y": 900, "w": 200, "h": 300 },
  { "id": "tree-2", "kind": "use", "symbol": "tree", "x": 600, "y": 950, "w": 160, "h": 240,
    "overrides": { "crown": { "fill": { "color": "#166534" } } } }
]
```

## Window or card that crops its content

A `group` with `"clip": true` (rounded by `radius`): children outside its box are cut off.

## Radial glow fill

`"fill": { "gradient": true, "type": "radial", "stops": [{ "at": 0, "color": "#FFFFFF" }, { "at": 1, "color": "#0EA5E9" }] }`. `gradient: true` is required under `defaults: "flat"`.
