# Elements: what to use for what

Live list: `component_list`. Coordinates: `x, y` = top-left corner; `w, h` = box.

| I need | kind | Key fields |
|---|---|---|
| Free silhouette (car, tree, mountain, person) | `path` | `shapes:[{d}]`, `view:{x,y,w,h}` (coordinate system of `d`), `fill`, `border`, `progress` (stroke drawn 0–1), `morph` |
| Block, ground, road, sky, shot backdrop | `rect` | `radius`, `fill{color,gradient,color2,angle,opacity}`, `border{width,color,style}`, `shadow{enabled}`, `label{text,font,size,weight,color,align}` |
| Sun, wheel, tree crown, cloud (circles) | `ellipse` | same as rect |
| Hexagons, stars, badges | `polygon` (`sides`) / `star` (`points`, `inner`) | same as rect. Regular and inscribed: they do not fill their box. For roofs and triangles use `path` |
| Container, shot, camera, compound object | `group` | `w,h,cw,ch`, `children`, `anim`, `stagger`, `frame` (`browser`, `terminal`, `phone`) |
| Text | `text` (left-anchored) or `rect`+`label` (centred) | `text, font, size, weight, color, align, letterSpacing, opacity` |
| Icons | `icon` | `icon` (Lucide name), `color`, `stroke`, `tile` |
| Photos / PNG or SVG illustrations | `image` | `src` (project asset), `crop`, `radius`, `opacity` |
| Stars, dust, fireflies, floating leaves | `particles` | `count` (1–300), `speed` (integer ≥ 1, laps per loop), `drift` (px a point wanders from its place; `0` = still), `seed`, `dot{size,color,opacity}`, `link{opacity:0}` to remove the connecting lines, `template` (any element as the particle). **They do not fall**: they only float inside their box. For falling rain or snow, use a group of drops with a looping `y` track |
| Animated connectors and arrows | `line` / `arrow` | `from`/`to`, `bend`, `style`, `flow` |
| 3D objects | `three` | `shape` (`cube, sphere, torus, cylinder, cone, plane, text, model`), `model` (.glb), `object.rotX/Y/Z`, `spin`, `material`, `light`, `camera.*` |
| Data | `chart`, `counter`, `progress`, `table`, `list`, `steps`, `code`, `bubble`, `badge` | see `component_list` |
| Voice subtitles | `subtitles` | created by `scene_generate_speech` |

## Effects (most kinds)

`glow`/`bgGlow`/`borderGlow` `{enabled, color, blur, strength}` for glows (sun, headlights, neon).
`effects` `{blur, blend, mask}`: `blur` softens (depth of field), `blend` is a blend mode (`normal`, `multiply`, `screen`, `overlay`…), `mask` clips the element to another element's shape (by id).
**`scene_build` drops `effects`.** Add them afterwards with `element_update` (top-level elements only) and the full object: `{"effects":{"blur":6,"blend":"normal","mask":""}}`.

## Draw order

Array order is layer order: the first element is at the back. Same inside a group.
