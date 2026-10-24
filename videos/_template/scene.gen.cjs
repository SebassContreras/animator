// Generates scene.json beside this file (compact scene for Lienzo's scene_build) from brief.md; colours come from palette.json.
// Template: copy the folder to videos/<slug>/, then replace the shot below with the brief's shots, reusing lib/ pieces first.
// Run: node videos/<slug>/scene.gen.cjs
const fs = require("fs");
const W = 1080, H = 1920, D = 4;
const { checkPalette } = require("../../lib/palette.cjs");
const C = checkPalette(require("./palette.json"));
const { sceneHelpers } = require("../../lib/scene.cjs");

const { rect, ell } = require("../../lib/primitives.cjs");
const { shot, text } = sceneHelpers({ w: W, h: H, duration: D, palette: C });

// Shot 1 · placeholder (0–4)
const s1 = shot("shot-1", "Shot 1 · placeholder", 0, D, [
  rect("s1-bg", 0, 0, W, H, C.background.base, { name: "Background" }),
  ell("s1-subject", 340, 660, 400, 400, C.main.base, { name: "Main subject" }),
]);

const scene = {
  size: [W, H], duration: D, fps: 30,
  background: { color: C.background.base, gradient: false, dots: false, spotlight: 0 },
  elements: [s1,
    text("t1", "Text · title", "Title", 1240, 88, 0.3, D)],
};
fs.writeFileSync(__dirname + "/scene.json", JSON.stringify(scene, null, 1));
