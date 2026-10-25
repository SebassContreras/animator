# Elements: what to use for what

Live list: `component_list`. Coordinates: `x, y` = top-left corner; `w, h` = box.

| I need | kind | Key fields |
|---|---|---|
| Free silhouette (car, tree, mountain, person) | `path` | `shapes:[{d, fill?}]`, `mode` (`morph` default, `layers` = stacked shapes), `view:{x,y,w,h}` (coordinate system of `d`), `fill`, `border` (the outline: `width` default 0, `color`), `progress` (outline drawn 0–1) |
| Block, ground, road, sky, shot backdrop | `rect` | `radius` (default rounded: set 0), `fill{color,gradient,type,stops,color2,angle,opacity}`, `border{width,color,style}`, `shadow{enabled}`, `label{text,font,size,weight,color,align}` |
| Sun, wheel, tree crown, cloud (circles) | `ellipse` | same as rect |
| Hexagons, triangles, stars, badges | `polygon` (`sides`, `fit`) / `star` (`points`, `inner`) | same as rect. `fit: "circle"` (default) is regular and inscribed; `fit: "box"` stretches the vertices to the whole box (roofs, triangles) |
| Container, compound object, legacy shot | `group` | `w,h,cw,ch`, `children`, `anim`, `stagger`, `clip` (crop children to the box), `frame` (`browser`, `terminal`, `phone`) |
| Repeated piece | `use` | `symbol` (name in the scene's `symbols`), `x,y,w,h`, `overrides` (per child id) |
| Text | `text` | `text, font, size, weight, color, align, letterSpacing, lineHeight, opacity`; `w` = box width: wraps at words and aligns inside `[x, x+w]` |
| Icons | `icon` | `icon` (Lucide name), `color`, `stroke`, `tile` |
| Photos / PNG or SVG illustrations | `image` | `src` (from `asset_add`), `crop` (`image_trim` removes transparent margins), `radius`, `opacity` |
| Stars, dust, fireflies, snow, rain | `particles` | `count` (1–300), `motion` (`drift` default, `fall`, `static`), `direction` (deg, 90 = down), `gravity`, `twinkle` (0–1), `speed`, `drift` (px a point wanders), `seed`, `dot{size,color,opacity}` (the colour lives here), `link{distance:0}` to remove the connecting lines (on by default), `template` (any element as the particle) |
| Animated connectors and arrows | `line` / `arrow` | `from`/`to`, `bend`, `style`, `flow` |
| 3D objects | `three` | `shape` (`cube, sphere, torus, cylinder, cone, plane, text, model`), `model` (.glb), `object.rotX/Y/Z`, `spin`, `material`, `light`, `camera.*` |
| Data | `chart`, `counter`, `progress`, `table`, `list`, `steps`, `code`, `bubble`, `badge` | see `component_list` |
| Voice subtitles | `subtitles` | created by `scene_generate_speech` (`asTrack: true` + `startOffset` for one voice clip per shot, stored in `audioTracks`) |

## Effects (most kinds)

`glow`/`bgGlow`/`borderGlow` `{enabled, color, blur, strength}` for glows (sun, headlights, neon).
`effects` `{blur, blend, mask}`: `blur` softens (depth of field), `blend` is a blend mode (`normal`, `multiply`, `screen`, `overlay`…), `mask` clips the element to another element's shape (by id).
A partial object in the compact scene is merged with the defaults (`{"effects":{"blur":6}}`).

## Draw order

Array order is layer order: the first element is at the back. Same inside a group.
