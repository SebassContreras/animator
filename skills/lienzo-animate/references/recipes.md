# Recipes

Tested in `examples/car-road-tree.json` and `videos/viaje/scene.gen.cjs`.

## Centred text (instead of `text` + `at`)

```json
{ "id": "title", "name": "Title", "kind": "rect", "x": 0, "y": 420, "w": 1080, "h": 130, "radius": 0,
  "fill": { "opacity": 0, "gradient": false }, "border": { "width": 0 }, "shadow": { "enabled": false },
  "label": { "text": "Rumbo al campo", "font": "Inter", "size": 84, "weight": 800, "color": "#0F172A", "align": "center" },
  "anim": { "in": { "kind": "slide", "from": "down", "delay": 0.2, "duration": 0.5 },
            "out": { "kind": "fade", "delay": 2.9, "duration": 0.1 } } }
```

Put it at the top level, with the same `in`/`out` window as its shot.

## Looping road markings

A group twice the width with the pattern repeated, shifted one width per loop. The loop must last the whole shot, or the road freezes and the car "stops":

```json
{ "id": "dashes", "kind": "group", "x": 0, "y": 1450, "w": 2160, "h": 20, "cw": 2160, "ch": 20,
  "tracks": { "x": [[0, 0, "linear"], [3, -1080]] },
  "children": [ { "kind": "rect", "x": 0, "y": 0, "w": 160, "h": 20, "...": "every 270 px up to 2160" } ] }
```

The pattern period (270 px) divides 1080, so the last frame joins the first.

## Driving car

The car stays in X and the world moves (road, hills slower). Wheels with linear `@rotate`. A `loop: float` with `amount` 4 and many `cycles` gives engine vibration.

To cross the screen, animate the car group's `x` from `-500` to `1080`.

## Wind in a tree (crown attached to the trunk)

Rotation is around the box centre. Make the crown group's box twice as tall and centre it on the trunk top, with the leaves in the top half overlapping the trunk by ≥ 50 px:

```json
{ "id": "crown", "name": "Tree crown", "kind": "group", "x": 240, "y": 560, "w": 600, "h": 880, "cw": 600, "ch": 880,
  "anim": { "loop": { "kind": "swing", "amount": 2, "cycles": 4 } },
  "children": [ "... leaves between local y 0 and 500; the trunk starts at scene y 1000 = local 440" ] }
```

## Any pivot

To swing an arm from the shoulder or a door from its hinge: a group whose box is symmetric around the pivot, with the piece on one side.

## Lights turning on

Window `rect` with `"fill.color": [[t, "#1E293B"], [t + 0.3, "#FDE047"]]`. Stagger `t` between windows.

## Slow shot zoom

`"tracks": {"@scale": [[3, 1, "linear"], [6, 1.15]]}` on the shot group.

## Glowing sun or moon

`ellipse` with `"bgGlow": {"enabled": true, "color": "#FDE047", "blur": 80, "strength": 1}`.

## Still starry sky

`particles` with `count: 80`, `speed: 1`, `drift: 0`, `dot.size: 3`, `link.opacity: 0`.

## Fade to black at the end

Full-screen black `rect`, last in `elements`, with `"fill.opacity": [[D - 1, 0, "ease-in"], [D, 1]]`.
