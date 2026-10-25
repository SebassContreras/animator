# Feasibility: what Lienzo can build

Source of truth: the `lienzo-animate` skill (`references/gotchas.md`). Update this file when Lienzo changes.

## Works well

- Flat illustration from simple shapes and SVG paths: vehicles, trees, houses, clouds, hills, cities, icons, simple characters.
- Multi-shot videos (native shots) with hard cuts, cross-fades, fade to black, wipes and zoom-ins (the builder makes fades with element fades, not the shot's transition).
- Camera: slow zoom, pan across a wide world, zoom to an area, shake.
- Parallax scrolling, spinning wheels, swaying, floating, pulsing, glows.
- Colour changes over time (lights turning on, sky shifting); fading any element or group in and out.
- Radial and multi-stop gradients; windows/cards that crop their content.
- Text that wraps inside a box.
- Repeated objects (trees, people, icons) drawn once and reused.
- Shape morphs between paths, strokes that draw themselves on.
- Text with entry/exit animations; counters, progress bars, charts, lists, code blocks, chat bubbles.
- Particles that drift, stay still and twinkle, or fall (stars, dust, fireflies, snow, rain).
- 3D primitives, 3D text and `.glb` models; PNG/SVG images from the project.
- Voice-over with synced subtitles (`scene_generate_speech`).

## Needs a substitution

| Idea | Substitute with |
|---|---|
| Character walking | body bobbing (`float`) + legs swinging around the hip pivot, world scrolling behind |
| Realistic people, faces, photos | flat stylised figures, or an `image` from the project |
| Rotation around a joint (arm, door, crown) | allowed; describe the joint so the builder can set the pivot (`origin`) |
| Camera move over grouped objects (zoom or pan across a scene of compound pieces) | allowed; the builder moves the shot's group, not the native camera |
| Falling leaves that tumble | `fall` particles with a leaf as `template` |

## Not possible today

- Frame-by-frame or hand-drawn animation, fluid/smoke simulation, physics, real lighting on 2D shapes.
- Video clips as input.
- Animated shot transitions as such (the shot's own fade/slide/zoom is not drawn); ask for the effect and the builder fades or slides the elements.

## Budget

- Keep each shot under ~30 elements; the user must be able to find and fix things in the layers panel.
- Name every object in the brief; the builder will use those names.
