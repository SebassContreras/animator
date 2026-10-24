// Generates scene.json beside this file (compact scene for Lienzo's scene_build). Run: node videos/viaje/scene.gen.cjs
const fs = require("fs");
const { car: libCar, house: libHouse } = require("../../lib/objects.cjs");
const { cloud: libCloud, dashes: libDashes } = require("../../lib/environment.cjs");
const { nameAll } = require("../../lib/scene.cjs");
const W = 1080, H = 1920, D = 12;
const flat = (o) => ({ border: { width: 0 }, shadow: { enabled: false }, ...o, fill: { gradient: false, opacity: 1, ...(o.fill || {}) } });
const rect = (id, x, y, w, h, color, extra = {}) => flat({ id, kind: "rect", x, y, w, h, radius: 0, fill: { color }, ...extra });
const ell = (id, x, y, w, h, color, extra = {}) => flat({ id, kind: "ellipse", x, y, w, h, fill: { color }, ...extra });
const path = (id, x, y, w, h, d, color, extra = {}) => flat({ id, kind: "path", x, y, w, h, view: { x: 0, y: 0, w, h }, shapes: [{ d }], fill: { color }, ...extra });
const group = (id, x, y, w, h, children, extra = {}) => ({ id, kind: "group", x, y, w, h, cw: w, ch: h, children, ...extra });
const shot = (id, a, b, children, extra = {}) => group(id, 0, 0, W, H, children, {
  name: id,
  anim: {
    ...(a > 0 ? { in: { kind: "fade", delay: a, duration: 0.1 } } : {}),
    ...(b < D ? { out: { kind: "fade", delay: b - 0.1, duration: 0.1 } } : {}),
  },
  ...extra,
});
const title = (id, text, y, color, a, b) => rect(id, 0, y, W, 130, "#000000", {
  fill: { color: "#000000", opacity: 0 },
  label: { text, font: "Inter", size: 80, weight: 800, color, align: "center" },
  anim: {
    in: { kind: "slide", from: "down", delay: a + 0.2, duration: 0.5 },
    ...(b < D ? { out: { kind: "fade", delay: b - 0.1, duration: 0.1 } } : {}),
  },
});

const CAR = { glass: "#BFDBFE", light: "#FEF3C7", tyre: "#111827", rim: "#9CA3AF", spokes: "#4B5563" };
const car = (id, x, y, body, extra = {}) => libCar(id, x, y, { ...CAR, body }, { spin: D, ...extra });
const house = (id, x, w, h, wall, roof, litAt) =>
  libHouse(id, x, 1300, w, h, { wall, roof, window: "#1E293B", lit: "#FDE047", door: "#451A03" }, litAt);

const dashes = (id, y, period) => libDashes(id, y, period, { width: W, color: "#F9FAFB" });
const cloud = (id, x, y, s, dx) => libCloud(id, x, y, s, dx, "#FFFFFF", 3);

// Shot 1: countryside, 0-3 s
const s1 = shot("toma-1-campo", 0, 3, [
  rect("s1-sky", 0, 0, W, H, "#7DD3FC", { fill: { color: "#7DD3FC", gradient: true, color2: "#E0F2FE", angle: 90 } }),
  ell("s1-sun", 780, 220, 170, 170, "#FDE047", { bgGlow: { enabled: true, color: "#FDE047", blur: 80, strength: 1 } }),
  cloud("s1-cloud1", 120, 300, 1, 60),
  cloud("s1-cloud2", 600, 520, 0.7, 40),
  group("s1-hills", 0, 880, W * 2, 320, [
    path("s1-hills-a", 0, 0, W, 320, "M0 320 Q180 60 360 240 T720 180 T1080 140 V320 Z", "#86EFAC"),
    path("s1-hills-b", W, 0, W, 320, "M0 140 Q180 60 360 240 T720 180 T1080 320 V320 H0 Z", "#86EFAC"),
  ], { tracks: { x: [[0, 0, "linear"], [3, -120]] } }),
  rect("s1-grass", 0, 1180, W, 740, "#22C55E"),
  rect("s1-road", 0, 1300, W, 320, "#374151"),
  // period = shot length: tracks hold their last value, so a shorter period freezes the road
  dashes("s1-dashes", 1450, 3),
  car("s1-car", 290, 1180, "#EF4444"),
]);

// Shot 2: tree close-up, 3-6 s
const s2 = shot("toma-2-arbol", 3, 6, [
  rect("s2-sky", 0, 0, W, H, "#FDE68A", { fill: { color: "#FDE68A", gradient: true, color2: "#FDBA74", angle: 90 } }),
  path("s2-ground", 0, 1400, W, 520, "M0 120 Q540 0 1080 120 V520 H0 Z", "#15803D"),
  rect("s2-trunk", 490, 1000, 100, 460, "#78350F", { radius: 20 }),
  // box centred on the trunk top (y 1000) so swing pivots there and the crown stays attached
  group("s2-crown", 240, 560, 600, 880, [
    ell("s2-leaf-a", 0, 160, 340, 340, "#16A34A"),
    ell("s2-leaf-b", 260, 160, 340, 340, "#15803D"),
    ell("s2-leaf-c", 120, 0, 360, 360, "#22C55E"),
  ], { anim: { loop: { kind: "swing", amount: 2, cycles: 4 } } }),
  { id: "s2-leaves", kind: "particles", x: 140, y: 600, w: 800, h: 900, count: 18, speed: 1, drift: 120, seed: 3,
    dot: { size: 8, color: "#65A30D", opacity: 1 }, link: { opacity: 0 } },
], { tracks: { "@scale": [[3, 1, "linear"], [6, 1.12]] } });

// Shot 3: town at dusk, 6-9 s
const s3 = shot("toma-3-pueblo", 6, 9, [
  rect("s3-sky", 0, 0, W, H, "#7C3AED", { fill: { color: "#7C3AED", gradient: true, color2: "#F97316", angle: 90 } }),
  ell("s3-sun", 440, 980, 200, 200, "#FB923C", { tracks: { y: [[6, 980, "linear"], [9, 1120]] } }),
  house("s3-house1", 60, 280, 300, "#FDE68A", "#B91C1C", 6.6),
  house("s3-house2", 400, 300, 380, "#E5E7EB", "#1D4ED8", 7.0),
  house("s3-house3", 760, 260, 260, "#FCA5A5", "#065F46", 7.4),
  rect("s3-road", 0, 1300, W, 320, "#1F2937"),
  rect("s3-ground", 0, 1620, W, 300, "#14532D"),
  car("s3-car", -520, 1180, "#2563EB", { tracks: { x: [[6, -520, "linear"], [9, 1100]] } }),
]);

// Shot 4: night, 9-12 s
const s4 = shot("toma-4-noche", 9, D, [
  rect("s4-sky", 0, 0, W, H, "#020617", { fill: { color: "#020617", gradient: true, color2: "#1E1B4B", angle: 90 } }),
  { id: "s4-stars", kind: "particles", x: 0, y: 0, w: W, h: 1200, count: 80, speed: 1, drift: 0, seed: 7,
    dot: { size: 3, color: "#F8FAFC", opacity: 1 }, link: { opacity: 0 } },
  ell("s4-moon", 700, 260, 200, 200, "#F1F5F9", { bgGlow: { enabled: true, color: "#E2E8F0", blur: 90, strength: 1 } }),
  path("s4-hills", 0, 1250, W, 670, "M0 200 Q270 60 540 180 T1080 120 V670 H0 Z", "#0F172A"),
  rect("s4-road", 0, 1400, W, 220, "#111827"),
  car("s4-car", 290, 1240, "#EF4444"),
]);

const fadeBlack = rect("fade-negro", 0, 0, W, H, "#000000", {
  fill: { color: "#000000", opacity: 0 },
  tracks: { "fill.opacity": [[11, 0, "ease-in"], [12, 1]] },
});

// Readable names so the user finds pieces in the layers panel (learnings.md)
const NAMES = {
  "toma-1-campo": "Toma 1 · campo", "toma-2-arbol": "Toma 2 · árbol", "toma-3-pueblo": "Toma 3 · pueblo", "toma-4-noche": "Toma 4 · noche",
  "s1-sky": "Cielo", "s1-sun": "Sol", "s1-cloud1": "Nube 1", "s1-cloud2": "Nube 2", "s1-hills": "Colinas", "s1-grass": "Pasto",
  "s1-road": "Carretera", "s1-dashes": "Marcas de carretera", "s1-car": "Coche rojo",
  "s2-sky": "Cielo", "s2-ground": "Loma", "s2-trunk": "Tronco", "s2-crown": "Copa del árbol", "s2-leaves": "Hojas flotando",
  "s3-sky": "Cielo", "s3-sun": "Sol poniente", "s3-house1": "Casa amarilla", "s3-house2": "Casa blanca", "s3-house3": "Casa rosa",
  "s3-road": "Carretera", "s3-ground": "Pasto", "s3-car": "Coche azul",
  "s4-sky": "Cielo nocturno", "s4-stars": "Estrellas", "s4-moon": "Luna", "s4-hills": "Colinas", "s4-road": "Carretera", "s4-car": "Coche rojo",
  t1: "Título 1", t2: "Título 2", t3: "Título 3", t4: "Título 4", "fade-negro": "Fundido a negro",
};
const PARTS = { "-body": "carrocería", "-glass": "ventanas", "-light": "faro", "-wl": "rueda trasera", "-wr": "rueda delantera", "-roof": "tejado", "-wall": "pared", "-win2": "ventana 2", "-win": "ventana 1", "-door": "puerta" };
const ENDINGS = { "-rim": " (llanta)", "-spokes": " (radios)" };
const scene = {
  size: [W, H], duration: D, fps: 30,
  background: { color: "#000000", gradient: false, dots: false, spotlight: 0 },
  elements: [s1, s2, s3, s4,
    title("t1", "Un día de viaje", 440, "#0F172A", 0, 3),
    title("t2", "Paradas con sombra", 260, "#7C2D12", 3, 6),
    title("t3", "Pueblos al atardecer", 360, "#FFFFFF", 6, 9),
    title("t4", "Fin del viaje", 700, "#F8FAFC", 9, D),
    fadeBlack],
};
nameAll(scene.elements, NAMES, PARTS, ENDINGS);
fs.writeFileSync(__dirname + "/scene.json", JSON.stringify(scene, null, 1));
