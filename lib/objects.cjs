// Recurring objects shared by more than one video. Colours always come from the caller.
const { rect, ell, path, group } = require("./primitives.cjs");

// heart outline drawn in a 140x140 box
const HEART_SIZE = 140;
const HEART_D = "M70 126 L10 62 A32 32 0 0 1 70 18 A32 32 0 0 1 130 62 Z";
const heart = (id, x, y, color, extra = {}) => path(id, x, y, HEART_SIZE, HEART_SIZE, HEART_D, color, extra);

// wheel of a 110x110 box that turns twice a second for `spin` seconds; colors = { tyre, rim, spokes }
const wheel = (id, x, y, colors, spin) => {
  const tracks = { "@rotate": [[0, 0, "linear"], [spin, 360 * 2 * spin]] };
  return [
    path(id, x, y, 110, 110, "M55 0 A55 55 0 1 1 54.9 0 Z", colors.tyre, { tracks }),
    path(id + "-rim", x, y, 110, 110, "M55 25 A30 30 0 1 1 54.9 25 Z", colors.rim, { tracks }),
    path(id + "-spokes", x, y, 110, 110, "M51 25 H59 V85 H51 Z M25 51 H85 V59 H25 Z", colors.spokes, { tracks }),
  ];
};

// side-view car in a 500x240 box, bobbing; wheels spin for `spin` seconds (set it to the scene length)
// colors = { body, glass, light, tyre, rim, spokes }
const car = (id, x, y, colors, { spin, ...extra }) => group(id, x, y, 500, 240, [
  path(id + "-body", 0, 0, 500, 180, "M20 150 L20 100 Q30 80 80 75 L140 20 Q150 10 170 10 L330 10 Q350 10 365 25 L420 75 Q480 80 490 110 L490 150 Z", colors.body),
  path(id + "-glass", 0, 0, 500, 180, "M160 30 L320 30 L360 75 L130 75 Z", colors.glass),
  ell(id + "-light", 470, 95, 26, 18, colors.light),
  ...wheel(id + "-wl", 70, 120, colors, spin),
  ...wheel(id + "-wr", 330, 120, colors, spin),
], { anim: { loop: { kind: "float", amount: 4, cycles: 24 } }, ...extra });

// house standing on `ground` (y of the wall's base); the roof is a path because polygon sides:3 leaves a gap
// colors = { wall, roof, window, lit, door }; windows light up at litAt and litAt + 0.4
const house = (id, x, ground, w, h, colors, litAt) => {
  // switches from `window` at `off` to `lit` at `on`
  const win = (suffix, wx, off, on) => rect(id + suffix, wx, 120 + h * 0.25, w * 0.25, h * 0.25, colors.window,
    { tracks: { "fill.color": [[off, colors.window], [on, colors.lit]] } });
  return group(id, x, ground - h - 120, w, h + 120, [
    path(id + "-roof", -20, 0, w + 40, 140, `M0 140 L${(w + 40) / 2} 0 L${w + 40} 140 Z`, colors.roof),
    rect(id + "-wall", 0, 120, w, h, colors.wall),
    win("-win", w * 0.2, litAt, litAt + 0.3),
    win("-win2", w * 0.55, litAt + 0.4, litAt + 0.7),
    rect(id + "-door", w * 0.38, 120 + h * 0.6, w * 0.24, h * 0.4, colors.door),
  ]);
};

module.exports = { heart, car, house };
