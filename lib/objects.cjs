// Recurring objects proven in a video. Colours always come from the caller.
const { path, ell } = require("./primitives.cjs");

// heart outline drawn in a 140x140 box
const HEART_SIZE = 140;
const HEART_D = "M70 126 L10 62 A32 32 0 0 1 70 18 A32 32 0 0 1 130 62 Z";
const heart = (id, x, y, color, extra = {}) => path(id, x, y, HEART_SIZE, HEART_SIZE, HEART_D, color, extra);

// three-tone teardrop symbol, point up, in a 100×120 view: shadow drop, base drop up-left of it, highlight dot top-left.
// Takes a role's tones, not its name, so lib/ names no palette role (013/D4).
const TEAR_D = "M50 0 C62 24 90 52 90 78 C90 102 72 118 50 118 C28 118 10 102 10 78 C10 52 38 24 50 0 Z";
const teardrop = ({ base, shadow, highlight }) => ({ w: 100, h: 120, children: [
  path("shade", 0, 0, 100, 120, TEAR_D, shadow),
  path("core", 0, 0, 92, 110, TEAR_D, base, { view: { x: 0, y: 0, w: 100, h: 120 } }),
  ell("shine", 30, 62, 18, 22, highlight, { fill: { opacity: 0.85 } }),
] });

module.exports = { heart, teardrop };
