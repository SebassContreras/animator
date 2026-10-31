// Generates scene.json beside this file (compact scene for Lienzo's scene_build) from brief.md; colours come from palette.json.
// Template: copy the folder to videos/<slug>/, then replace the shot below with the brief's shots, reusing lib/ pieces first.
// Run: node videos/<slug>/scene.gen.cjs
const fs = require("fs");
const W = 1080, H = 1920, D = 4;
const { checkPalette } = require("../../lib/palette.cjs");
const C = checkPalette(require("./palette.json"));
const { sceneHelpers, nativeShot } = require("../../lib/scene.cjs");
// Fonts used today, until this generator reads them from brand.lock.json (011/T010)
const FONTS = { heading: { family: "Montserrat", weight: 800 }, body: { family: "Montserrat", weight: 500 } };

const { rect, ell } = require("../../lib/primitives.cjs");
const { label } = sceneHelpers({ w: W, h: H, duration: D, palette: C, fonts: FONTS });

// Shot 1 · placeholder (0–4): each top-level element names its shot
const s1 = [
  rect("s1-bg", 0, 0, W, H, C.background.base, { name: "Shot 1 · background", shot: "s1" }),
  ell("s1-subject", 340, 660, 400, 400, C.main.base, { name: "Shot 1 · main subject", shot: "s1" }),
  label("t1", "Shot 1 · title", "Title", 1240, 88, 0.3, D, { shot: "s1" }),
];

const scene = {
  size: [W, H], duration: D, fps: 30, defaults: "flat",
  background: { color: C.background.base, gradient: false, dots: false, spotlight: 0 },
  shots: [nativeShot("s1", "Shot 1 · placeholder", 0, D)],
  elements: [...s1],
};
fs.writeFileSync(__dirname + "/scene.json", JSON.stringify(scene, null, 1));
