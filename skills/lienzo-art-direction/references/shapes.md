# Designing an object

How to draw it in Lienzo is in `lienzo-animate` → `drawing.md`. This file decides what it should look like.

## Order of design

1. **Silhouette.** One shape that reads in solid black at thumbnail size. Exaggerate the identifying feature (a car's wheels, a tree's crown, a bottle's neck).
2. **Big tones.** Base colour per piece, 3–5 tones per object in total.
3. **Light.** Choose one light direction for the whole piece (default: top-left) and keep it. Shadow tone on the far side, highlight tone on the lit edge, both as separate `path`s over the base.
4. **Detail.** Only on the focal object, and only details that are readable at final size (≥ 8 px on 1080 wide). Background objects get silhouette + one tone.

## Shape language

- Pick one family per piece: **round** (friendly, organic), **square** (stable, technical), **triangle** (energy, danger). Mix only to make a contrast on purpose.
- Vary sizes: big / medium / small in each composition (roughly 1 : 0.5 : 0.25). Equal sizes look mechanical.
- Avoid perfect symmetry and perfectly even spacing on natural things (trees, clouds, hills): shift each copy in size, tone or position.
- Same corner radius and same outline width across the piece.

## Depth without 3D

- **Three planes per shot:** background (low contrast, closer to the sky colour), middle (the subject), foreground (dark, partly out of frame, fastest parallax).
- **Atmospheric perspective:** the farther a layer, the lighter and less saturated it is.
- **Overlap:** near objects cover far ones; never line them up edge to edge.
- **Ground contact:** every standing object gets a soft shadow ellipse under it.

## Focal object

- It has the most contrast, the accent colour, the most detail and the glow.
- Everything else is darker, smaller or slower (see `craft.md` → Framing).
