// Environment pieces: backdrops and ambient particles. Colours and frame size always come from the caller.
const { rect, ell, group } = require("./primitives.cjs");

// full-frame vertical gradient: `light` at the top, `deep` at the bottom
const sea = (id, frame, deep, light, name = "Deep sea") => rect(id, 0, 0, frame.w, frame.h, deep, {
  name, fill: { gradient: true, color: light, color2: deep, angle: 90 },
});

// Lienzo particle field without links; `box` = { x, y, w, h }
const particles = (id, name, box, { count, drift, seed, size, color, opacity }) => ({
  id, name, kind: "particles", x: box.x, y: box.y, w: box.w, h: box.h, count, speed: 1, drift, seed,
  dot: { size, color, opacity }, link: { opacity: 0 },
});

// cloud of three ellipses at scale `s`, drifting left by `dx` over `period` seconds (parallax layer)
const cloud = (id, x, y, s, dx, color, period) => group(id, x, y, 300 * s, 140 * s, [
  ell(id + "-a", 0, 40 * s, 140 * s, 100 * s, color),
  ell(id + "-b", 80 * s, 0, 150 * s, 140 * s, color),
  ell(id + "-c", 170 * s, 40 * s, 130 * s, 100 * s, color),
], { tracks: { x: [[0, x, "linear"], [period, x - dx]] } });

// road markings over twice the frame `width`, sliding one width per `period`;
// tracks hold their last value, so give `period` = the shot length or the road freezes
const dashes = (id, y, period, { width, color }) => group(id, 0, y, width * 2, 20,
  Array.from({ length: 8 }, (_, i) => rect(`${id}-${i}`, i * 270, 0, 160, 20, color, { radius: 4 })),
  { tracks: { x: [[0, 0, "linear"], [period, -width]] } });

module.exports = { sea, particles, cloud, dashes };
