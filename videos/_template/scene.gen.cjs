// Generates scene.json beside this file (compact scene for Lienzo's scene_build) from brief.md.
// Colours and fonts come from the brand (../brand.lock.json or local brand.lock.json); palette.json holds only overrides and story roles.
// Run: node videos/<brand>/<video>/scene.gen.cjs
const fs = require("fs");
const path = require("path");
const root = path.resolve(__dirname, fs.existsSync(path.join(__dirname, "../../../lib")) ? "../../.." : "../..");
const { checkBrandLock, brandFonts } = require(path.join(root, "lib/brand.cjs"));
const { resolvePalette } = require(path.join(root, "lib/palette.cjs"));
// (016/D1) Parent brand.lock.json takes precedence over local brand.lock.json
const parentLock = path.join(__dirname, "../brand.lock.json");
const localLock = path.join(__dirname, "brand.lock.json");
const lockPath = fs.existsSync(parentLock) ? parentLock : localLock;
const lock = checkBrandLock(require(lockPath));
// (016/D2) Inherit canvas dimensions, duration, and FPS from brand lock
const { width: W, height: H, duration: D, fps: FPS } = lock.canvas;
const C = resolvePalette(lock, require("./palette.json"));
const { sceneHelpers, nativeShot } = require(path.join(root, "lib/scene.cjs"));
const { rect, ell } = require(path.join(root, "lib/primitives.cjs"));
const { label } = sceneHelpers({ w: W, h: H, duration: D, palette: C, fonts: brandFonts(lock) });

// Shot 1 · placeholder (0–4): each top-level element names its shot
const s1 = [
  rect("s1-bg", 0, 0, W, H, C.background.base, { name: "Shot 1 · background", shot: "s1" }),
  ell("s1-subject", 340, 660, 400, 400, C.primary.base, { name: "Shot 1 · main subject", shot: "s1" }),
  label("t1", "Shot 1 · title", "Title", 1240, 88, 0.3, D, { shot: "s1" }),
];

const scene = {
  size: [W, H], duration: D, fps: FPS, defaults: "flat",
  background: { color: C.background.base, gradient: false, dots: false, spotlight: 0 },
  shots: [nativeShot("s1", "Shot 1 · placeholder", 0, D)],
  elements: [...s1],
};
fs.writeFileSync(__dirname + "/scene.json", JSON.stringify(scene, null, 1));
