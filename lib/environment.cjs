// Environment pieces: backdrops and ambient particles. Colours and frame size always come from the caller.
const { rect, path } = require("./primitives.cjs");

// full-frame vertical gradient: `light` at the top, `deep` at the bottom
// (016/D5) sea accepts extra = {} to merge into element and fill
const sea = (id, frame, deep, light, name = "Deep sea", extra = {}) => rect(id, 0, 0, frame.w, frame.h, deep, {
  name, ...extra, fill: { gradient: true, color: light, color2: deep, angle: 90, ...(extra.fill || {}) },
});

// Lienzo particle field without links; `box` = { x, y, w, h }
// (016/D5) particles accepts extra = {} to merge into element (shot, opacity, etc.)
const particles = (id, name, box, { count, drift, seed, size, color, opacity }, extra = {}) => ({
  id, name, kind: "particles", x: box.x, y: box.y, w: box.w, h: box.h, count, speed: 1, drift, seed,
  dot: { size, color, opacity }, link: { opacity: 0 }, ...extra,
});

// organic blob in a 100×100 view filling `box` = { x, y, w, h }; vertical gradient `top` → `bottom` (Soft depth backdrop, 013/D3)
const BLOB_D = "M52 4 C74 2 95 18 97 44 C99 70 82 95 54 97 C26 99 4 82 3 54 C2 26 24 6 52 4 Z";
const blob = (id, name, box, top, bottom, extra = {}) => path(id, box.x, box.y, box.w, box.h, BLOB_D, bottom, {
  name, view: { x: 0, y: 0, w: 100, h: 100 }, ...extra,
  fill: { gradient: true, color: top, color2: bottom, angle: 90, ...(extra.fill || {}) },
});

module.exports = { sea, particles, blob };
