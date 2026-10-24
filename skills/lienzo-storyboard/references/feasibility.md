# Feasibility: what Lienzo can build

Source of truth: the `lienzo-animate` skill (`references/gotchas.md`). Update this file when Lienzo changes.

## Works well

- Flat illustration from simple shapes and SVG paths: vehicles, trees, houses, clouds, hills, cities, icons, simple characters.
- Multi-shot videos with hard cuts, cross-fades, fade to black, wipes and zoom-ins.
- Camera: slow zoom, pan across a wide world, zoom to an area, shake.
- Parallax scrolling, spinning wheels, swaying, floating, pulsing, glows.
- Colour changes over time (lights turning on, sky shifting).
- Shape morphs between paths, strokes that draw themselves on.
- Text with entry/exit animations; counters, progress bars, charts, lists, code blocks, chat bubbles.
- Still or gently drifting particles (stars, dust, fireflies).
- 3D primitives, 3D text and `.glb` models; PNG/SVG images from the project.
- Voice-over with synced subtitles (`scene_generate_speech`).

## Needs a substitution

| Idea | Substitute with |
|---|---|
| Falling rain, snow or leaves | a tall group of drops/flakes with a looping vertical move |
| Twinkling stars | still particles plus a few star shapes with a `pulse` loop |
| Character walking | body bobbing (`float`) + legs swinging around the hip pivot, world scrolling behind |
| Realistic people, faces, photos | flat stylised figures, or an `image` from the project |
| Rotation around a joint (arm, door, crown) | allowed, but describe the joint so the builder can set the pivot |
| Multi-stop or radial gradient skies | two-colour vertical gradient + a soft glow circle (sun/moon) |
| Text wrapping inside a box | write the line breaks yourself |
| Many copies of a complex object | fine, but keep it ≤ 3 instances per shot to stay editable |

## Not possible today

- Frame-by-frame or hand-drawn animation, fluid/smoke simulation, physics, real lighting on 2D shapes.
- Video clips as input.
- Blur/masks authored in the brief are only partly supported; avoid relying on them.

## Budget

- Keep each shot under ~30 elements; the user must be able to find and fix things in the layers panel.
- Name every object in the brief; the builder will use those names.
