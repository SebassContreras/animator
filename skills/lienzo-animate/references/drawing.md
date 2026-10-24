# Drawing objects

An object = a `group` of pieces. Each single-colour piece = one `path` (or rect/ellipse).

## Method

1. Pick a box for the object (e.g. car 500×240) and use it as the group's `cw`/`ch`.
2. Draw each piece in its own `view`, usually equal to its box (`view: {x:0, y:0, w, h}` with the element's `w`/`h`). Then 1 unit of `d` = 1 px.
3. Order back to front: shadow → body → windows → wheels → details.
4. Anything that spins (wheels, blades) is its own element with a square box centred on the axle: `@rotate` turns around the box centre.
5. Things that move together (the whole car) go in a group, and you animate the group.
6. Parts that must stay joined (crown on trunk, roof on wall) must overlap by at least 20 px, more if anything sways.
7. Flat style: 2–4 tones per object, no gradient or shadow (see gotchas), optional outlines with `border.width`.

## Useful SVG commands in `d`

`M x y` move · `L x y` line · `H x` / `V y` horizontal/vertical · `Q cx cy x y` curve · `T x y` smooth curve · `C` cubic · `A rx ry 0 1 1 x y` arc · `Z` close.
Circle in a 100×100 view: `M50 0 A50 50 0 1 1 49.9 0 Z`.

## Tested pieces

```text
Car body (view 500×180): M20 150 L20 100 Q30 80 80 75 L140 20 Q150 10 170 10 L330 10 Q350 10 365 25 L420 75 Q480 80 490 110 L490 150 Z
Windows (view 500×180): M160 30 L320 30 L360 75 L130 75 Z
Wheel (view 100×100): tyre = circle; rim = M50 22 A28 28 0 1 1 49.9 22 Z; spokes = M46 22 H54 V78 H46 Z M22 46 H78 V54 H22 Z
Hills (view 1080×300): M0 300 Q180 40 360 220 T720 160 T1080 120 V300 Z
Mound (view 1080×520): M0 120 Q540 0 1080 120 V520 H0 Z
Roof (view w×h): M0 h L w/2 0 L w h Z
```

## Three-tone pieces (verified in `lab/ringana-omega-v2.gen.cjs`)

Light from the top-left. Each piece = base + shadow path on top + highlight; see `lienzo-art-direction` → `shapes.md`.

```text
Leaf/frond (view w×h): base   M w/2 h C -0.15w 0.6h 0.15w 0.12h 0.5w 0 C 0.85w 0.12h 1.15w 0.6h w/2 h Z
                       shadow M w/2 h L 0.5w 0 C 0.85w 0.12h 1.15w 0.6h w/2 h Z   (right half)
                       Put it in a group 2h tall with the frond in the top half, so `swing` pivots on the base.
Capsule lower-half shadow (view w×h, r=h/2): M0 r H w A r r 0 0 1 w-r h H r A r r 0 0 1 0 r Z  (opacity 0.55) + seam rect at w/2
Heart right-half shadow (view 140×140): M70 126 L130 62 A32 32 0 0 0 70 18 Z  (opacity 0.5)
Drop: dark full circle + base circle at 90 % size top-left + white glint → crescent shadow bottom-right
Halo behind a big area: plain ellipse at 4–12 % opacity, never `bgGlow` (it washes the frame white)
```

## Composition ideas

- **Tree:** `rect` trunk with `radius` + crown = group of 3 overlapping `ellipse`s in shades of green, with a gentle `loop: swing`. Centre the crown group's box on the trunk top so it sways from there (recipe in recipes.md).
- **House:** `rect` (wall) + triangle `path` (roof, base overlapping the wall) + `rect` (door, windows). Do not use `polygon` `sides: 3`: it leaves a gap.
- **Cloud:** group of 3–4 white `ellipse`s; move its `x` slowly until the end of the shot.
- **Simple person:** `ellipse` (head) + `path` (body) + high-`radius` `rect`s for arms and legs; swing arms with `@rotate`. It turns around the box centre, not the shoulder: put the arm in a group twice as tall, with the arm in the top half, and rotate the group.
- **Stars, dust, fireflies:** `particles` with `link.opacity: 0`; `drift: 0` for still stars.
- **Rain/snow that falls:** a tall group of drops with a looping `y` track (particles cannot fall).
- **Realistic objects:** `image` with a PNG/SVG from the project, or `three` with `shape: "model"` and a `.glb`.
