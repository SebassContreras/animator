// Generates scene.json beside this file: same story, text and timing as ../ringana-omega/scene.gen.cjs,
// redesigned with lienzo-art-direction (style "Bright science", see brief.md); colours come from palette.json.
// Run: node videos/ringana-omega-v2/scene.gen.cjs
const fs = require("fs");
const { rect, ell, path, group } = require("../../lib/primitives.cjs");
const W = 1080, H = 1920, D = 24;
const { checkPalette } = require("../../lib/palette.cjs");
const C = checkPalette(require("./palette.json"));
const { sceneHelpers } = require("../../lib/scene.cjs");
const { heart } = require("../../lib/objects.cjs");
const { heartbeat } = require("../../lib/motion.cjs");
const { sea: seaFill, particles } = require("../../lib/environment.cjs");

const { shot, text, fadeToBlack } = sceneHelpers({ w: W, h: H, duration: D, palette: C, textMotion: { amount: 30, inDuration: 0.45, easeIn: "cubic-out", easeOut: "cubic-in" } });

// Environment: lit sea with three planes, light rays and plankton
const sea = (id) => seaFill(id, { w: W, h: H }, C.sea.shadow, C.sea.highlight);
const rays = (id, t0, t1) => group(id, 0, 0, W, H, [140, 470, 760].map((x, i) => rect(`${id}-${i}`, x, -400, 120 + i * 40, 2200, "#FFFFFF", {
  fill: { opacity: 0.045 }, tracks: { "@rotate": [[t0, 18]] },
})), { name: "Light rays", tracks: { x: [[t0, -30, "linear"], [t1, 30]] } });
const plankton = (id, y, h, count, color = "#FFFFFF", opacity = 0.35, seed = 3) =>
  particles(id, "Plankton", { x: 0, y, w: W, h }, { count, drift: 40, seed, size: 6, color, opacity });
const bubbles = (id) => particles(id, "Bubbles", { x: 0, y: 700, w: W, h: 1100 }, { count: 10, drift: 60, seed: 5, size: 16, color: "#FFFFFF", opacity: 0.25 });

// Frond: leaf with shadow on the right (light from top-left) and a highlight on the left.
// The group is twice the frond's height so `swing` pivots on the base.
const frond = (id, name, x, baseY, w, h, tones, swing, cycles) => {
  const leaf = `M${w / 2} ${h} C${-w * 0.15} ${h * 0.6} ${w * 0.15} ${h * 0.12} ${w * 0.5} 0 C${w * 0.85} ${h * 0.12} ${w * 1.15} ${h * 0.6} ${w / 2} ${h} Z`;
  const shade = `M${w / 2} ${h} L${w * 0.5} 0 C${w * 0.85} ${h * 0.12} ${w * 1.15} ${h * 0.6} ${w / 2} ${h} Z`;
  const shine = `M${w * 0.4} ${h * 0.85} C${w * 0.12} ${h * 0.6} ${w * 0.25} ${h * 0.25} ${w * 0.45} ${h * 0.1} C${w * 0.33} ${h * 0.35} ${w * 0.3} ${h * 0.6} ${w * 0.4} ${h * 0.85} Z`;
  const parts = [path(`${id}-leaf`, 0, 0, w, h, leaf, tones[0])];
  if (tones[1]) parts.push(path(`${id}-shade`, 0, 0, w, h, shade, tones[1]));
  if (tones[2]) parts.push(path(`${id}-shine`, 0, 0, w, h, shine, tones[2], { fill: { opacity: 0.7 } }));
  return group(id, x, baseY - h, w, h * 2, parts, { name, anim: { loop: { kind: "swing", amount: swing, cycles } } });
};
const seabed = (id, y, color) => path(id, 0, y, W, H - y, `M0 120 Q270 10 540 70 T1080 40 V${H - y} H0 Z`, color, { name: "Seabed" });

// Recurring objects, three tones each
const drop = (id, x, y, s, extra = {}) => group(id, x, y, s, s, [
  ell(id + "-shade", 0, 0, s, s, C.drop.shadow, { bgGlow: { enabled: true, color: C.drop.base, blur: s * 0.6, strength: 0.9 } }),
  ell(id + "-core", 0, 0, s * 0.9, s * 0.9, C.drop.base),
  ell(id + "-shine", s * 0.2, s * 0.16, s * 0.26, s * 0.26, "#FFFFFF", { fill: { opacity: 0.75 } }),
], extra);
const capsule = (id, x, y, w, h, extra = {}) => {
  const r = h / 2;
  const lower = `M0 ${r} H${w} A${r} ${r} 0 0 1 ${w - r} ${h} H${r} A${r} ${r} 0 0 1 0 ${r} Z`;
  return group(id, x, y, w, h, [
    rect(id + "-shell", 0, 0, w, h, C.capsule.base, { radius: r }),
    path(id + "-shade", 0, 0, w, h, lower, C.capsule.shadow, { fill: { opacity: 0.55 } }),
    rect(id + "-seam", w / 2 - 3, 0, 6, h, C.capsule.shadow, { fill: { opacity: 0.5 } }),
    rect(id + "-shine", w * 0.12, h * 0.14, w * 0.5, h * 0.16, C.capsule.highlight, { radius: h * 0.08 }),
    ell(id + "-spark", w * 0.08, h * 0.16, h * 0.16, h * 0.16, "#FFFFFF", { fill: { opacity: 0.8 } }),
  ], extra);
};
// plain low-opacity disc: a bgGlow here washes the whole frame out
const halo = (id, cx, cy, r, color, opacity = 0.12) => ell(id, cx - r, cy - r, 2 * r, 2 * r, color, { name: "Halo", fill: { opacity } });
// silhouette in local coords of a 1080x1920 frame; head centre at (540, top+110)
const torsoD = "M0 700 V230 Q0 80 150 70 L370 70 Q520 80 520 230 V700 Z";
const silhouette = (id, top, opacity = 0.16) => [
  halo(id + "-halo", 540, top + 520, 520, C.body.base, 0.04),
  ell(id + "-head", 430, top, 220, 220, C.body.base, { name: "Silhouette · head", fill: { opacity } }),
  rect(id + "-neck", 500, top + 200, 80, 90, C.body.base, { name: "Silhouette · neck", fill: { opacity } }),
  path(id + "-torso", 280, top + 200, 520, 700, torsoD, C.body.base, { name: "Silhouette · torso", fill: { opacity } }),
];
const spark = (id, x, y, s, color, cycles) => path(id, x, y, s, s,
  `M${s / 2} 0 L${s * 0.6} ${s * 0.4} L${s} ${s / 2} L${s * 0.6} ${s * 0.6} L${s / 2} ${s} L${s * 0.4} ${s * 0.6} L0 ${s / 2} L${s * 0.4} ${s * 0.4} Z`,
  color, { name: "Sparkle", anim: { loop: { kind: "pulse", amount: 0.3, cycles } } });

// Shot 1 · algae sea (0–3): far / middle / foreground planes
const s1 = shot("shot-1", "Shot 1 · algae sea", 0, 3, [
  sea("s1-sea"), rays("s1-rays", 0, 3), plankton("s1-plankton", 0, 1500, 30),
  group("s1-far", 0, 0, W, H, [
    frond("s1-far-0", "Far alga 1", 120, 1640, 70, 300, [C.algaFar.base], 4, 3),
    frond("s1-far-1", "Far alga 2", 330, 1620, 60, 240, [C.algaFar.base], 4, 3),
    frond("s1-far-2", "Far alga 3", 700, 1630, 80, 340, [C.algaFar.base], 4, 3),
    frond("s1-far-3", "Far alga 4", 900, 1650, 60, 220, [C.algaFar.base], 4, 3),
  ], { name: "Far plane", tracks: { x: [[0, 0, "linear"], [3, -15]] } }),
  bubbles("s1-bubbles"),
  group("s1-mid", 0, 0, W, H, [
    seabed("s1-bed", 1720, C.seabed.base),
    frond("s1-alga-0", "Alga 1", 40, 1800, 110, 520, [C.alga.base, C.alga.shadow, C.alga.highlight], 6, 3),
    frond("s1-alga-1", "Alga 2", 230, 1790, 90, 380, [C.alga.base, C.alga.shadow, C.alga.highlight], 7, 3),
    frond("s1-alga-2", "Central alga", 450, 1810, 150, 640, [C.alga.base, C.alga.shadow, C.alga.highlight], 5, 3),
    frond("s1-alga-3", "Alga 4", 660, 1800, 100, 450, [C.alga.base, C.alga.shadow, C.alga.highlight], 7, 3),
    frond("s1-alga-4", "Alga 5", 840, 1810, 120, 560, [C.alga.base, C.alga.shadow, C.alga.highlight], 6, 3),
  ], { name: "Middle plane", tracks: { x: [[0, 0, "linear"], [3, -35]] } }),
  group("s1-fg", 0, 0, W, H, [
    frond("s1-fg-0", "Foreground alga left", -60, 2000, 200, 700, [C.fg.base], 5, 3),
    frond("s1-fg-1", "Foreground alga right", 940, 2000, 180, 560, [C.fg.base], 6, 3),
  ], { name: "Foreground plane", tracks: { x: [[0, 0, "linear"], [3, -70]] } }),
], { tracks: { "@scale": [[0, 1, "linear"], [2.4, 1.05, "ease-in"], [3.4, 2.5]] } });

// Shot 2 · alga → drop → 3 capsules (3–6.5)
const pop = (t, extra = {}) => ({ "@scale": [[3, 0], [t, 0, "back-out"], [t + 0.6, 1]], ...extra });
const s2 = shot("shot-2", "Shot 2 · from alga to capsule", 3, 6.5, [
  sea("s2-sea"), rays("s2-rays", 3, 6.5), plankton("s2-plankton", 0, H, 30, "#FFFFFF", 0.3, 8),
  halo("s2-halo", 540, 800, 380, C.drop.base, 0.08),
  group("s2-alga-wrap", 0, 0, W, H, [
    frond("s2-alga", "Central alga", 465, 1040, 150, 480, [C.alga.base, C.alga.shadow, C.alga.highlight], 4, 2),
  ], { name: "Central alga", tracks: { "@scale": [[3, 1, "ease-in"], [4.1, 0]] } }),
  drop("s2-drop", 460, 720, 160, { name: "Omega drop", tracks: { "@scale": [[3, 0], [3.3, 0, "back-out"], [4.1, 1, "ease-in-out"], [4.5, 1.08, "ease-in"], [4.75, 0]] } }),
  capsule("s2-cap-l", 160, 740, 300, 130, { name: "Capsule left", anim: { loop: { kind: "float", amount: 8, cycles: 4 } },
    tracks: pop(4.55, { "@rotate": [[3, 0], [4.55, 0, "back-out"], [5.25, -25]], x: [[3, 390], [4.55, 390, "back-out"], [5.25, 60]] }) }),
  capsule("s2-cap-r", 620, 740, 300, 130, { name: "Capsule right", anim: { loop: { kind: "float", amount: 8, cycles: 5 } },
    tracks: pop(4.65, { "@rotate": [[3, 0], [4.65, 0, "back-out"], [5.35, 25]], x: [[3, 390], [4.65, 390, "back-out"], [5.35, 720]] }) }),
  capsule("s2-cap-c", 390, 700, 300, 130, { name: "Capsule centre", anim: { loop: { kind: "float", amount: 8, cycles: 3 } }, tracks: pop(4.5) }),
], { tracks: { "@scale": [[3, 1, "linear"], [6.5, 1.04]] } }, 0.4);

// Shot 3 · heart (6.5–10)
const trail = (id, d, s, x) => drop(id, x, 1500, s, { name: "Omega trail", tracks: { y: [[6.5, 1500], [6.7 + d, 1500, "ease-in-out"], [7.5 + d, 905]], "@scale": [[7.5 + d, 1], [7.65 + d, 0]] } });
const s3 = shot("shot-3", "Shot 3 · heart", 6.5, 10, [
  sea("s3-bg"), plankton("s3-plankton", 0, H, 24, "#FFFFFF", 0.25, 11),
  group("s3-world", 0, 0, W, H, [
    ...silhouette("s3-sil", 260),
    halo("s3-heart-halo", 560, 930, 150, C.organ.base, 0.08),
    group("s3-heart", 490, 860, 140, 140, [
      heart("s3-heart-base", 0, 0, C.organ.base, { bgGlow: { enabled: true, color: C.organ.base, blur: 60, strength: 0.6 } }),
      path("s3-heart-shade", 0, 0, 140, 140, "M70 126 L130 62 A32 32 0 0 0 70 18 Z", C.organ.shadow, { fill: { opacity: 0.5 } }),
      ell("s3-heart-shine", 26, 34, 30, 22, C.organ.highlight),
    ], { name: "Heart", tracks: { "@scale": heartbeat(7.6, 4, { dip: 0.96, peak: 1.18, ease: "ease-in-out" }) } }),
    trail("s3-trail-2", 0.16, 22, 549),
    trail("s3-trail-1", 0.08, 34, 543),
    drop("s3-drop", 535, 1500, 50, { name: "Omega drop", tracks: { y: [[6.5, 1500], [6.7, 1500, "ease-in-out"], [7.5, 905]], "@scale": [[7.5, 1], [7.7, 0]] } }),
  ], { name: "Body", tracks: { y: [[9.5, 0, "ease-in"], [10.4, 600]], "@scale": [[6.5, 1, "linear"], [9.5, 1.04]] } }),
], {}, 0.4);

// Shot 4 · brain & vision (10–13.5): head close-up
const eye = (id, side, x) => group(id, x, 760, 160, 150, [
  ell(`${id}-white`, 5, 30, 150, 90, "#FFFFFF"),
  ell(`${id}-iris`, 50, 45, 60, 60, C.drop.base),
  ell(`${id}-pupil`, 66, 61, 28, 28, C.sea.shadow),
  ell(`${id}-glint`, 84, 56, 12, 12, "#FFFFFF"),
], { name: `Eye ${side}`, tracks: { "@scale": [[11.2, 0.1, "back-out"], [11.7, 1]] } });
const s4 = shot("shot-4", "Shot 4 · brain & vision", 10, 13.5, [
  sea("s4-bg"), plankton("s4-plankton", 0, H, 24, "#FFFFFF", 0.25, 13),
  group("s4-head", 0, 0, W, H, [
    halo("s4-halo", 540, 700, 520, C.body.base, 0.04),
    ell("s4-skull", 190, 300, 700, 820, C.body.base, { name: "Head", fill: { opacity: 0.16 } }),
    group("s4-brain", 300, 360, 480, 320, [
      ell("s4-b1", 0, 80, 200, 180, C.organ.shadow), ell("s4-b3", 280, 70, 200, 190, C.organ.shadow),
      ell("s4-b2", 120, 0, 220, 200, C.organ.base), ell("s4-b4", 80, 150, 200, 170, C.organ.base), ell("s4-b5", 220, 150, 200, 170, C.organ.base),
      ell("s4-b-shine-1", 160, 30, 70, 40, C.organ.highlight), ell("s4-b-shine-2", 40, 110, 50, 30, C.organ.highlight),
    ], { name: "Brain", bgGlow: { enabled: true, color: C.organ.base, blur: 80, strength: 0.5 },
      tracks: { "@scale": [[10, 0.6], [10.5, 0.6, "back-out"], [11.2, 1], [12, 1.06, "ease-in-out"], [12.8, 1], [13.5, 1.04]] },
      anim: { in: { kind: "fade", delay: 10.5, duration: 0.6 } } }),
    eye("s4-eye-l", "left", 325), eye("s4-eye-r", "right", 595),
    group("s4-sparks", 0, 0, W, H, [
      spark("s4-spark-1", 250, 330, 50, C.drop.highlight, 3), spark("s4-spark-2", 790, 300, 36, C.drop.highlight, 4), spark("s4-spark-3", 840, 620, 44, C.drop.highlight, 3),
    ], { name: "Sparkles", anim: { in: { kind: "fade", delay: 11.3, duration: 0.4 } } }),
  ], { name: "Head close-up", tracks: { "@scale": [[10, 1.1, "ease-out"], [12.6, 1, "ease-in"], [13.5, 0.7]] } }),
], {}, 0.4);

// Shot 5 · vitamins (13.5–16.5): icons on badges, staggered pop
const icon = (id, name, x, t, children) => group(id, x, 1110, 200, 200, [
  ell(`${id}-badge-shadow`, 0, 12, 200, 200, C.sea.shadow, { fill: { opacity: 0.6 } }),
  ell(`${id}-badge`, 0, 0, 200, 200, C.sea.highlight),
  ell(`${id}-badge-shine`, 30, 20, 140, 60, "#FFFFFF", { fill: { opacity: 0.06 } }),
  ...children,
], { name, tracks: { "@scale": [[13.5, 0], [t, 0, "back-out"], [t + 0.5, 1]] }, anim: { loop: { kind: "float", amount: 5, cycles: 4 } } });
const s5 = shot("shot-5", "Shot 5 · vitamins", 13.5, 16.5, [
  sea("s5-bg"), plankton("s5-plankton", 0, H, 24, C.drop.highlight, 0.25, 17),
  ...silhouette("s5-sil", 120, 0.1),
  icon("s5-shield", "Icon · shield (immunity)", 130, 14.0, [
    path("s5-shield-p", 45, 30, 110, 135, "M55 0 L110 20 L110 68 Q110 115 55 135 Q0 115 0 68 L0 20 Z", C.drop.base),
    path("s5-shield-s", 45, 30, 110, 135, "M55 0 L110 20 L110 68 Q110 115 55 135 Z", C.drop.shadow),
  ]),
  icon("s5-bone", "Icon · bone", 440, 14.3, [
    rect("s5-bone-bar", 50, 88, 100, 26, C.drop.base, { radius: 13 }),
    ell("s5-bone-a", 26, 66, 38, 38, C.drop.base), ell("s5-bone-b", 26, 98, 38, 38, C.drop.base),
    ell("s5-bone-c", 136, 66, 38, 38, C.drop.base), ell("s5-bone-d", 136, 98, 38, 38, C.drop.base),
    rect("s5-bone-s", 50, 104, 100, 10, C.drop.shadow, { radius: 5 }),
  ]),
  icon("s5-cell", "Icon · cell", 750, 14.6, [
    ell("s5-cell-m", 30, 30, 140, 140, C.drop.base, { fill: { opacity: 0.45 } }),
    ell("s5-cell-n", 72, 72, 56, 56, C.drop.base),
    ell("s5-cell-ns", 76, 76, 20, 20, "#FFFFFF", { fill: { opacity: 0.7 } }),
    spark("s5-spark", 135, 15, 50, "#FFFFFF", 4),
  ]),
], { tracks: { "@scale": [[13.5, 1, "linear"], [16.5, 1.03]] } }, 0.4);

// Shot 6 · Omega-3 Index gauge (16.5–20.5); 0–12 % mapped onto x 120..960
const gx = (v) => 120 + (v / 12) * 840;
const zone = (id, name, a, b, color, extra = {}) => rect(id, gx(a) + 4, 905, gx(b) - gx(a) - 8, 50, color, { name, radius: 25, ...extra });
const s6 = shot("shot-6", "Shot 6 · the proof", 16.5, 20.5, [
  sea("s6-bg"), plankton("s6-plankton", 0, H, 20, "#FFFFFF", 0.2, 19),
  rect("s6-track", 96, 885, 888, 90, C.sea.shadow, { name: "Gauge · track", radius: 45 }),
  zone("s6-zone-low", "Gauge · low", 0, 4, C.low.base),
  zone("s6-zone-mid", "Gauge · medium", 4, 8, C.drop.base),
  zone("s6-zone-opt", "Gauge · optimal", 8, 12, C.alga.base, { bgGlow: { enabled: true, color: C.alga.base, blur: 40, strength: 0.5 } }),
  ...[["Low", 0, 4], ["Medium", 4, 8], ["Optimal", 8, 12]].map(([t, a, b], i) => rect(`s6-lbl-${i}`, gx(a), 995, gx(b) - gx(a), 50, "#000000", {
    name: `Gauge label · ${t}`, fill: { color: "#000000", opacity: 0 }, label: { text: t, font: "Montserrat", size: 32, weight: 500, color: C.text.base, align: "center" } })),
  group("s6-needle", gx(4.84) - 80, 740, 160, 160, [
    rect("s6-needle-val", 0, 0, 160, 76, "#FFFFFF", { radius: 38,
      label: { text: "4.8%", font: "Montserrat", size: 40, weight: 800, color: C.sea.shadow, align: "center" },
      tracks: { "label.text": [[16.5, "4.8%"], [17.6, "5.9%"], [18.3, "7.0%"], [19, "7.9%"]] } }),
    path("s6-needle-tri", 55, 72, 50, 40, "M0 0 L50 0 L25 40 Z", "#FFFFFF"),
  ], { name: "Needle", tracks: { x: [[16.5, gx(4.84) - 80], [17, gx(4.84) - 80, "cubic-out"], [19, gx(7.87) - 80]], "@scale": [[19, 1, "ease-out"], [19.15, 1.1, "ease-in-out"], [19.4, 1]] } }),
], { tracks: { "@scale": [[16.5, 1, "linear"], [20.5, 1.03]] } }, 0.4);

// Shot 7 · closing (20.5–24)
const s7 = shot("shot-7", "Shot 7 · closing", 20.5, D, [
  sea("s7-bg"), rays("s7-rays", 20.5, 24), plankton("s7-plankton", 0, H, 34, C.drop.highlight, 0.35, 23),
  halo("s7-halo", 540, 950, 420, C.capsule.highlight, 0.14),
  capsule("s7-capsule", 240, 820, 600, 260, { name: "Hero capsule",
    anim: { in: { kind: "pop", delay: 20.6, duration: 0.6, easing: "back-out" }, loop: { kind: "swing", amount: 6, cycles: 2 } } }),
  rect("s7-shine", -300, 700, 120, 500, "#FFFFFF", { name: "Shine", fill: { opacity: 0.18 }, tracks: { x: [[20.5, -300], [21.2, -300, "ease-in-out"], [22.2, 1200]], "@rotate": [[20.5, 20]] } }),
  spark("s7-spark-1", 200, 760, 46, C.drop.highlight, 3), spark("s7-spark-2", 840, 1080, 36, C.drop.highlight, 4),
], { tracks: { "@scale": [[20.5, 1, "linear"], [24, 1.04]] } }, 0.4);

const fadeBlack = fadeToBlack("#000000");

const scene = {
  size: [W, H], duration: D, fps: 30,
  background: { color: C.sea.shadow, gradient: false, dots: false, spotlight: 0 },
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
