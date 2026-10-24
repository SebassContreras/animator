// Environment pieces: backdrops and ambient particles. Colours and frame size always come from the caller.
const { rect } = require("./primitives.cjs");

// full-frame vertical gradient: `light` at the top, `deep` at the bottom
const sea = (id, frame, deep, light, name = "Deep sea") => rect(id, 0, 0, frame.w, frame.h, deep, {
  name, fill: { gradient: true, color: light, color2: deep, angle: 90 },
});

// Lienzo particle field without links; `box` = { x, y, w, h }
const particles = (id, name, box, { count, drift, seed, size, color, opacity }) => ({
  id, name, kind: "particles", x: box.x, y: box.y, w: box.w, h: box.h, count, speed: 1, drift, seed,
  dot: { size, color, opacity }, link: { opacity: 0 },
});

module.exports = { sea, particles };
