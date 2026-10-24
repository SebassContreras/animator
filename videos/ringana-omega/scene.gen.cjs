// Generates scene.json beside this file (compact scene for Lienzo's scene_build) from brief.md; colours come from palette.json.
// Run: node videos/ringana-omega/scene.gen.cjs
const fs = require("fs");
const W = 1080, H = 1920, D = 24;
const { checkPalette } = require("../../lib/palette.cjs");
const C = checkPalette(require("./palette.json"));
const { sceneHelpers } = require("../../lib/scene.cjs");
const { heart } = require("../../lib/objects.cjs");
const { heartbeat } = require("../../lib/motion.cjs");
const { sea, particles } = require("../../lib/environment.cjs");

const { rect, ell, path, group } = require("../../lib/primitives.cjs");
const { shot, text, fadeToBlack } = sceneHelpers({ w: W, h: H, duration: D, palette: C });

// Recurring objects
const drop = (id, x, y, s, extra = {}) => group(id, x, y, s, s, [
  ell(id + "-core", 0, 0, s, s, C.drop.base, { bgGlow: { enabled: true, color: C.drop.base, blur: s * 0.5, strength: 0.8 } }),
  ell(id + "-shine", s * 0.18, s * 0.15, s * 0.3, s * 0.3, "#FFFFFF", { fill: { opacity: 0.6 } }),
], extra);
const capsule = (id, x, y, w, h, extra = {}) => group(id, x, y, w, h, [
  rect(id + "-shell", 0, 0, w, h, C.capsule.base, { radius: h / 2 }),
  rect(id + "-shine", w * 0.15, h * 0.14, w * 0.7, h * 0.18, "#FFFFFF", { radius: h * 0.09, fill: { opacity: 0.3 } }),
], extra);
// silhouette in local coords of a 1080x1920 frame; head centre at (540, top+110)
const silhouette = (id, top) => [
  ell(id + "-head", 430, top, 220, 220, C.body.base, { name: "Silhouette · head", fill: { opacity: 0.15 } }),
  rect(id + "-neck", 500, top + 200, 80, 80, C.body.base, { name: "Silhouette · neck", fill: { opacity: 0.15 } }),
  rect(id + "-torso", 330, top + 260, 420, 700, C.body.base, { name: "Silhouette · torso", radius: 140, fill: { opacity: 0.15 } }),
];

// Shot 1 · algae sea (0–3)
const alga = (i, x, h, w) => ell(`s1-alga-${i}`, x, 1920 - h + 60, w, h, C.alga.base, {
  name: `Alga ${i + 1}`, anim: { loop: { kind: "swing", amount: 6, cycles: 3 } },
});
const s1 = shot("shot-1", "Shot 1 · algae sea", 0, 3, [
  sea("s1-sea", { w: W, h: H }, C.sea.base, C.sea.highlight),
  particles("s1-bubbles", "Bubbles", { x: 0, y: 700, w: W, h: 1100 }, { count: 14, drift: 60, seed: 5, size: 14, color: "#FFFFFF", opacity: 0.3 }),
  alga(0, 60, 520, 90), alga(1, 220, 380, 80), alga(2, 400, 600, 110), alga(3, 610, 450, 90), alga(4, 790, 560, 100), alga(5, 950, 340, 80),
], { tracks: { "@scale": [[0, 1, "linear"], [2.4, 1, "ease-in"], [3.4, 2.5]] } });

// Shot 2 · alga → drop → 3 capsules (3–6.5)
const s2 = shot("shot-2", "Shot 2 · from alga to capsule", 3, 6.5, [
  sea("s2-sea", { w: W, h: H }, C.sea.base, C.sea.highlight),
  ell("s2-alga", 470, 560, 140, 480, C.alga.base, { name: "Central alga", tracks: { "@scale": [[3, 1, "ease-in"], [4.2, 0]] } }),
  drop("s2-drop", 460, 720, 160, { name: "Omega drop", tracks: { "@scale": [[3, 0, "ease-in"], [3.2, 0, "ease-out"], [4.2, 1, "ease-in"], [4.5, 1, "ease-in"], [4.8, 0]] } }),
  capsule("s2-cap-l", 160, 740, 300, 130, { name: "Capsule left", tracks: { "@scale": [[3, 0], [4.5, 0, "ease-out"], [5.2, 1]], "@rotate": [[3, 0], [4.5, 0, "ease-out"], [5.2, -25]], x: [[3, 390], [4.5, 390, "ease-out"], [5.2, 60]] } }),
  capsule("s2-cap-r", 620, 740, 300, 130, { name: "Capsule right", tracks: { "@scale": [[3, 0], [4.5, 0, "ease-out"], [5.2, 1]], "@rotate": [[3, 0], [4.5, 0, "ease-out"], [5.2, 25]], x: [[3, 390], [4.5, 390, "ease-out"], [5.2, 720]] } }),
  capsule("s2-cap-c", 390, 700, 300, 130, { name: "Capsule centre", tracks: { "@scale": [[3, 0], [4.5, 0, "ease-out"], [5.2, 1]] } }),
], {}, 0.4);

// Shot 3 · heart (6.5–10)
const s3 = shot("shot-3", "Shot 3 · heart", 6.5, 10, [
  rect("s3-bg", 0, 0, W, H, C.sea.base, { name: "Background" }),
  group("s3-world", 0, 0, W, H, [
    ...silhouette("s3-sil", 260),
    heart("s3-heart", 490, 860, C.organ.base, { name: "Heart", tracks: { "@scale": heartbeat(7.6, 4) },
      bgGlow: { enabled: true, color: C.organ.base, blur: 60, strength: 0.6 } }),
    drop("s3-drop", 535, 1500, 50, { name: "Omega drop", tracks: { y: [[6.5, 1500], [6.7, 1500, "ease-in-out"], [7.5, 905]], "@scale": [[7.5, 1], [7.7, 0]] } }),
  ], { name: "Body", tracks: { y: [[9.5, 0, "ease-in"], [10.4, 600]] } }),
], {}, 0.4);

// Shot 4 · brain & vision (10–13.5): head close-up
const s4 = shot("shot-4", "Shot 4 · brain & vision", 10, 13.5, [
  rect("s4-bg", 0, 0, W, H, C.sea.base, { name: "Background" }),
  group("s4-head", 0, 0, W, H, [
    ell("s4-skull", 190, 300, 700, 820, C.body.base, { name: "Head", fill: { opacity: 0.15 } }),
    group("s4-brain", 300, 360, 480, 320, [
      ell("s4-b1", 0, 80, 200, 180, C.organ.base), ell("s4-b2", 120, 0, 220, 200, C.organ.base), ell("s4-b3", 280, 70, 200, 190, C.organ.base),
      ell("s4-b4", 80, 150, 200, 170, C.organ.base), ell("s4-b5", 220, 150, 200, 170, C.organ.base),
    ], { name: "Brain", tracks: { "@scale": [[10, 0.6], [10.5, 0.6, "ease-out"], [11.2, 1], [12, 1.06, "ease-in-out"], [12.8, 1], [13.5, 1.04]] },
      anim: { in: { kind: "fade", delay: 10.5, duration: 0.6 } } }),
    ell("s4-eye-l", 330, 790, 150, 90, "#FFFFFF", { name: "Eye left", tracks: { "@scale": [[11.2, 0.1], [11.7, 1]] } }),
    ell("s4-eye-r", 600, 790, 150, 90, "#FFFFFF", { name: "Eye right", tracks: { "@scale": [[11.2, 0.1], [11.7, 1]] } }),
    ell("s4-iris-l", 375, 805, 60, 60, C.drop.base, { name: "Iris left", tracks: { "@scale": [[11.2, 0], [11.7, 1]] } }),
    ell("s4-iris-r", 645, 805, 60, 60, C.drop.base, { name: "Iris right", tracks: { "@scale": [[11.2, 0], [11.7, 1]] } }),
  ], { name: "Head close-up", tracks: { "@scale": [[10, 1.1, "ease-out"], [12.6, 1, "ease-in"], [13.5, 0.7]] } }),
], {}, 0.4);

// Shot 5 · vitamins (13.5–16.5)
const icon = (id, name, x, t, children) => group(id, x, 1110, 200, 200, children, {
  name, tracks: { "@scale": [[13.5, 0], [t, 0, "ease-out"], [t + 0.4, 1]] },
});
const s5 = shot("shot-5", "Shot 5 · vitamins", 13.5, 16.5, [
  rect("s5-bg", 0, 0, W, H, C.sea.base, { name: "Background" }),
  ...silhouette("s5-sil", 120).map((e) => ({ ...e, fill: { ...e.fill, opacity: 0.1 } })),
  icon("s5-shield", "Icon · shield (immunity)", 130, 14.0, [path("s5-shield-p", 30, 10, 140, 170, "M70 0 L140 25 L140 85 Q140 145 70 170 Q0 145 0 85 L0 25 Z", C.drop.base)]),
  icon("s5-bone", "Icon · bone", 440, 14.3, [
    rect("s5-bone-bar", 30, 85, 140, 30, C.drop.base, { radius: 15 }),
    ell("s5-bone-a", 0, 60, 45, 45, C.drop.base), ell("s5-bone-b", 0, 95, 45, 45, C.drop.base),
    ell("s5-bone-c", 155, 60, 45, 45, C.drop.base), ell("s5-bone-d", 155, 95, 45, 45, C.drop.base),
  ]),
  icon("s5-cell", "Icon · cell", 750, 14.6, [
    ell("s5-cell-m", 10, 10, 180, 180, C.drop.base, { fill: { opacity: 0.45 } }),
    ell("s5-cell-n", 65, 65, 70, 70, C.drop.base),
    path("s5-spark", 140, 0, 60, 60, "M30 0 L37 23 L60 30 L37 37 L30 60 L23 37 L0 30 L23 23 Z", "#FFFFFF"),
  ]),
], {}, 0.4);

// Shot 6 · Omega-3 Index gauge (16.5–20.5); 0–12 % mapped onto x 120..960
const gx = (v) => 120 + (v / 12) * 840;
const s6 = shot("shot-6", "Shot 6 · the proof", 16.5, 20.5, [
  rect("s6-bg", 0, 0, W, H, C.sea.base, { name: "Background" }),
  rect("s6-zone-low", gx(0), 900, gx(4) - gx(0), 60, C.low.base, { name: "Gauge · low" }),
  rect("s6-zone-mid", gx(4), 900, gx(8) - gx(4), 60, C.drop.base, { name: "Gauge · medium" }),
  rect("s6-zone-opt", gx(8), 900, gx(12) - gx(8), 60, C.alga.base, { name: "Gauge · optimal" }),
  ...[["Low", 0, 4], ["Medium", 4, 8], ["Optimal", 8, 12]].map(([t, a, b], i) => rect(`s6-lbl-${i}`, gx(a), 980, gx(b) - gx(a), 50, "#000000", {
    name: `Gauge label · ${t}`, fill: { color: "#000000", opacity: 0 }, label: { text: t, font: "Montserrat", size: 32, weight: 500, color: C.text.base, align: "center" } })),
  group("s6-needle", gx(4.84) - 70, 760, 140, 140, [
    rect("s6-needle-val", 0, 0, 140, 60, "#000000", { fill: { color: "#000000", opacity: 0 },
      label: { text: "4.8%", font: "Montserrat", size: 40, weight: 800, color: C.text.base, align: "center" },
      tracks: { "label.text": [[16.5, "4.8%"], [17.6, "5.9%"], [18.3, "7.0%"], [19, "7.9%"]] } }),
    path("s6-needle-tri", 45, 80, 50, 50, "M0 0 L50 0 L25 50 Z", "#FFFFFF"),
  ], { name: "Needle", tracks: { x: [[16.5, gx(4.84) - 70], [17, gx(4.84) - 70, "ease-out"], [19, gx(7.87) - 70]] } }),
], {}, 0.4);

// Shot 7 · closing (20.5–24)
const s7 = shot("shot-7", "Shot 7 · closing", 20.5, D, [
  sea("s7-bg", { w: W, h: H }, C.sea.base, C.sea.highlight, "Background"),
  capsule("s7-capsule", 240, 820, 600, 260, { name: "Hero capsule", anim: { loop: { kind: "swing", amount: 8, cycles: 2 } } }),
  rect("s7-shine", -300, 700, 120, 500, "#FFFFFF", { name: "Shine", fill: { opacity: 0.18 }, tracks: { x: [[20.5, -300], [21, -300, "ease-in-out"], [22, 1200]], "@rotate": [[20.5, 20]] } }),
], {}, 0.4);

const fadeBlack = fadeToBlack("#000000");

const scene = {
  size: [W, H], duration: D, fps: 30,
  background: { color: C.sea.base, gradient: false, dots: false, spotlight: 0 },
  elements: [s1, s2, s3, s4, s5, s6, s7,
    text("t1", "Text · hook", "Omega 3 without fish?", 440, 88, 0.3, 2.9),
    text("t2a", "Text · from microalgae", "From microalgae", 1360, 88, 3.4, 4.9),
    text("t2b", "Text · daily dose", "960 mg EPA + DHA a day", 1370, 72, 4.9, 6.5),
    text("t3", "Text · heart", "Normal heart function", 1480, 72, 7.8, 10),
    text("t4", "Text · brain & vision", "Normal brain & vision", 1480, 72, 11, 13.5),
    text("t5", "Text · vitamins", "+ vitamins D3, K2 & E", 1480, 72, 13.7, 16.5),
    { ...text("t5a", "Label · immunity", "Immunity", 1330, 40, 14.1, 16.5, { weight: 500 }), x: 80, w: 300 },
    { ...text("t5b", "Label · bones", "Bones", 1330, 40, 14.4, 16.5, { weight: 500 }), x: 390, w: 300 },
    { ...text("t5c", "Label · cells", "Cells", 1330, 40, 14.7, 16.5, { weight: 500 }), x: 700, w: 300 },
    text("t6", "Text · study result", "+63.5% Omega-3 Index in 90 days*", 560, 60, 17, 20.5),
    text("t6n", "Text · study footnote", "*RINGANA study, 27 people, 3 capsules/day", 1120, 30, 17.2, 20.5, { weight: 500, inKind: "fade" }),
    text("t7", "Text · product", "RINGANA BEYOND omega", 1290, 72, 21, 24.3),
    text("t7d1", "Disclaimer 1", "Food supplement. Not a substitute for a varied diet", 1740, 28, 21.3, 24.3, { weight: 500, inKind: "fade" }),
    text("t7d2", "Disclaimer 2", "or medical advice. Adults only.", 1790, 28, 21.3, 24.3, { weight: 500, inKind: "fade" }),
    fadeBlack],
};
// the last texts must not fade out before the end
scene.elements.filter((e) => /^t7/.test(e.id)).forEach((e) => delete e.anim.out);
fs.writeFileSync(__dirname + "/scene.json", JSON.stringify(scene, null, 1));
