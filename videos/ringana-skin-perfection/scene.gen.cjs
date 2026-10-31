// Generates scene.json beside this file: the FRESH skin perfection reel (brief.md), style Soft depth adapted to the ringana brand.
// Colours and fonts come from the brand (brand.lock.json); palette.json holds only the story roles (skin, cream, blush, sage, moisture).
// Run: node videos/ringana-skin-perfection/scene.gen.cjs
const fs = require("fs");
const W = 1080, H = 1920, D = 20;
const { checkBrandLock, brandFonts } = require("../../lib/brand.cjs");
const { resolvePalette } = require("../../lib/palette.cjs");
const lock = checkBrandLock(require("./brand.lock.json"));
const C = resolvePalette(lock, require("./palette.json"));
const F = brandFonts(lock);
const { sceneHelpers, nativeShot } = require("../../lib/scene.cjs");
const { rect, ell, path, group } = require("../../lib/primitives.cjs");

const { label } = sceneHelpers({ w: W, h: H, duration: D, palette: C, fonts: F, textMotion: { amount: 30, inDuration: 0.5, easeIn: "cubic-out", easeOut: "cubic-in" } });

// Text inside the 80 px side margins (brief: `w` 920 at x 80); `hold` drops the exit so the line stays to the end.
const say = (id, name, str, y, size, a, b, extra = {}) => {
  const t = { ...label(id, name, str, y, size, a, b, extra), x: 80, w: W - 160 };
  if (extra.hold) delete t.anim.out;
  return t;
};
const body = (extra = {}) => ({ font: "body", ...extra });

// Soft shadow, only on focal objects (Soft depth): low opacity, large blur.
const SOFT = { enabled: true, color: "#000000", opacity: 0.12, blur: 40, x: 0, y: 14 };

// --- Recurring objects ---------------------------------------------------------------

// Organic blob in a 100×100 view; vertical two-colour gradient of its role (Soft depth: gradients on big shapes).
const BLOB = "M52 4 C74 2 95 18 97 44 C99 70 82 95 54 97 C26 99 4 82 3 54 C2 26 24 6 52 4 Z";
const blob = (id, name, x, y, w, h, top, bottom, extra = {}) => path(id, x, y, w, h, BLOB, bottom, {
  name, view: { x: 0, y: 0, w: 100, h: 100 }, ...extra,
  fill: { gradient: true, color: top, color2: bottom, angle: 90, ...(extra.fill || {}) },
});
// slow breathing on a back blob (pingpong 1 → 1.02, 3 s)
const breathe = (t0, until, amount = 1.02) => ({ "@scale": { keys: [[t0, 1, "ease-in-out"], [t0 + 1.5, amount]], repeat: "pingpong", until } });

// Teardrop, point up, in a 100×120 view: shadow drop, base drop up-left of it, highlight dot top-left (light from the top-left).
const TEAR = "M50 0 C62 24 90 52 90 78 C90 102 72 118 50 118 C28 118 10 102 10 78 C10 52 38 24 50 0 Z";
const tear = (role) => ({ w: 100, h: 120, children: [
  path("shade", 0, 0, 100, 120, TEAR, C[role].shadow),
  path("core", 0, 0, 92, 110, TEAR, C[role].base, { view: { x: 0, y: 0, w: 100, h: 120 } }),
  ell("shine", 30, 62, 18, 22, C[role].highlight, { fill: { opacity: 0.85 } }),
] });

// Skin cell: pill with the shadow tone bottom-right, base up-left of it, highlight sliver top-left.
const cellSymbol = { w: 210, h: 120, children: [
  rect("shade", 0, 0, 210, 120, C.skin.shadow, { radius: 60 }),
  rect("core", 0, 0, 202, 112, C.skin.base, { radius: 56 }),
  rect("shine", 30, 20, 70, 16, C.skin.highlight, { radius: 8, fill: { opacity: 0.9 } }),
] };

const symbols = { cell: cellSymbol, droplet: tear("moisture"), creamdrop: tear("cream") };
const use = (id, symbol, x, y, w, h, extra = {}) => ({ id, kind: "use", symbol, x, y, w, h, ...extra });

// Cell rows in a brick pattern: widths vary ±10 px so the rows are not mechanical; the gap stays 28 px.
const GAP = 28, ROW_Y = [880, 1028, 1176], CELL_H = 120;
const ROWS = [
  { x: 78, ws: [214, 204, 216, 206] },
  { x: -41, ws: [206, 218, 200, 212, 210] },
  { x: 72, ws: [208, 214, 202, 216] },
];
const cellBoxes = ROWS.flatMap((row, r) => {
  let x = row.x;
  return row.ws.map((w, i) => { const box = { r, i, x, y: ROW_Y[r], w, h: CELL_H }; x += w + GAP; return box; });
});
// vertical gaps between neighbouring cells of a row (where moisture escapes and mortar fills)
const gaps = ROWS.flatMap((row, r) => {
  let x = row.x;
  return row.ws.slice(0, -1).map((w) => { x += w; const g = { r, x: x + GAP / 2, y: ROW_Y[r] }; x += GAP; return g; });
}).filter((g) => g.x > 60 && g.x < W - 60);

const cells = (id, shot) => group(id, 0, 0, W, H, cellBoxes.map((b, k) => use(`${id}-${k + 1}`, "cell", b.x, b.y, b.w, b.h, { name: `Cell ${k + 1}` })), {
  name: "Skin cells", shot, tracks: { "@scale": { keys: [[0, 1, "ease-in-out"], [1.5, 0.99]], repeat: "pingpong" } },
});
const backdrop = (id, shot) => rect(id, 0, 0, W, H, C.background.base, { name: "Backdrop", shot });

// --- Shot 1 · Thirsty skin (0–3.5) ---------------------------------------------------
// Droplets escape from the gaps: rise 320 px and fade, twice, staggered 0.25 s (moisture being lost).
const ESCAPE = [0, 2, 4, 5, 7, 8];
const escaping = ESCAPE.map((gi, i) => {
  const g = gaps[gi], s = [68, 84, 62, 78, 66, 80][i], x = g.x - s / 2, y0 = g.y + 20, t0 = 0.2 + i * 0.25;
  return use(`s1-drop-${i + 1}`, "droplet", x, y0, s, s * 1.2, {
    name: `Escaping drop ${i + 1}`,
    tracks: {
      y: [[t0, y0, "cubic-in"], [t0 + 1.4, y0 - 320, "hold"], [t0 + 1.45, y0, "cubic-in"], [t0 + 2.85, y0 - 320]],
      opacity: [[t0, 1, "cubic-in"], [t0 + 1.4, 0, "hold"], [t0 + 1.45, 1, "cubic-in"], [t0 + 2.85, 0]],
    },
  });
});
const s1 = [
  backdrop("s1-bg", "s1"),
  blob("s1-back", "Back blob", -110, 350, 1300, 1300, C.blush.highlight, C.skin.base, { shot: "s1", opacity: 0.7, tracks: { x: [[0, -110, "linear"], [3.5, -90]] } }),
  cells("s1-cells", "s1"),
  group("s1-moisture", 0, 0, W, H, escaping, { name: "Escaping moisture", shot: "s1" }),
  blob("s1-front", "Front blob", -180, 1560, 600, 500, C.blush.base, C.blush.shadow, { shot: "s1", opacity: 0.8 }),
  say("t1", "Shot 1 · title", "Dry skin?\nWeakened barrier?", 330, 72, 0.4, 3.2, { shot: "s1" }),
];

// --- Shot 2 · The cream lands (3.5–7) ------------------------------------------------
// Mortar: an orange pill grows in every gap from its centre, staggered from the centre outwards (the barrier closes).
const byCentre = [...gaps].sort((a, b) => Math.abs(a.x - W / 2) + a.r * 40 - (Math.abs(b.x - W / 2) + b.r * 40));
const mortar = byCentre.map((g, k) => {
  const t = 5.2 + k * 0.08, cy = g.y + CELL_H / 2;
  return rect(`s2-mortar-${k + 1}`, g.x - 10, cy, 20, 0, C.accent.base, {
    name: `Ceramide ${k + 1}`, radius: 10,
    tracks: { y: [[t, cy, "cubic-out"], [t + 0.4, g.y + 4]], h: [[t, 0, "cubic-out"], [t + 0.4, CELL_H - 8]] },
  });
});
// horizontal bands between the rows, growing from the centre
const bands = [1000, 1148].map((y, k) => {
  const t = 5.5 + k * 0.1;
  return rect(`s2-band-${k + 1}`, W / 2, y + 4, 0, 20, C.accent.base, {
    name: `Ceramide band ${k + 1}`, radius: 10,
    tracks: { x: [[t, W / 2, "cubic-out"], [t + 0.5, 40]], w: [[t, 0, "cubic-out"], [t + 0.5, W - 80]] },
  });
});
// Drop → film: one path with two shapes (same command structure), its shadow copy 8 px down-right, a highlight that fades as it spreads.
const DROP = "M450 0 C480 60 570 120 570 190 C570 250 515 290 450 290 C385 290 330 250 330 190 C330 120 420 60 450 0 Z";
const FILM = "M450 270 C700 270 900 285 900 315 C900 345 700 360 450 360 C200 360 0 345 0 315 C0 285 200 270 450 270 Z";
const MORPH = [[4.7, 0, "ease-in-out"], [5.4, 1]];
const morphing = (id, x, y, color) => flatPath(id, x, y, 900, 360, [DROP, FILM], color, { tracks: { morph: MORPH } });
function flatPath(id, x, y, w, h, ds, color, extra = {}) {
  return { ...path(id, x, y, w, h, ds[0], color, extra), shapes: ds.map((d) => ({ d })) };
}
const DROP_Y = [[3.5, -420], [3.7, -420, "cubic-out"], [4.5, 570]];
const cream = group("s2-cream", 90, 0, 910, 370, [
  morphing("s2-cream-shade", 8, 8, C.cream.shadow),
  morphing("s2-cream-core", 0, 0, C.cream.base),
  ell("s2-cream-shine", 360, 80, 40, 70, C.cream.highlight, { name: "Highlight", tracks: { opacity: [[4.7, 1, "ease-in"], [5.0, 0]] } }),
], { name: "Cream drop", shot: "s2", tracks: { y: DROP_Y } });
const creamShadow = ell("s2-cream-shadow", 430, 852, 220, 36, C.skin.shadow, {
  name: "Drop shadow", shot: "s2", fill: { opacity: 0.3 },
  tracks: { opacity: [[3.7, 0, "cubic-out"], [4.5, 1]], x: [[4.7, 430, "ease-in-out"], [5.4, 90]], w: [[4.7, 220, "ease-in-out"], [5.4, 900]] },
});
// Kept moisture: droplets rise only to the film, then bob (moisture stays in).
const KEPT = [3, 5, 6, 8];
const kept = KEPT.map((gi, i) => {
  const g = gaps[gi], s = [64, 58, 72, 62][i], x = g.x - s / 2, y0 = g.y + 20, t0 = 3.6 + i * 0.2, top = 900 + i * 14;
  return use(`s2-drop-${i + 1}`, "droplet", x, y0, s, s * 1.2, {
    name: `Kept drop ${i + 1}`,
    tracks: { y: { keys: [[t0, y0, "cubic-out"], [t0 + 1.2, top, "ease-in-out"], [t0 + 2.2, top + 8, "ease-in-out"], [t0 + 3.2, top]], repeat: "none" } },
  });
});
const s2 = [
  backdrop("s2-bg", "s2"),
  blob("s2-back", "Back blob", -90, 350, 1300, 1300, C.blush.highlight, C.skin.base, { shot: "s2", opacity: 0.7, tracks: { x: [[3.5, -90, "linear"], [7, -70]] } }),
  cells("s2-cells", "s2"),
  group("s2-mortar", 0, 0, W, H, [...bands, ...mortar], { name: "Ceramide mortar", shot: "s2" }),
  group("s2-moisture", 0, 0, W, H, kept, { name: "Kept moisture", shot: "s2" }),
  creamShadow,
  cream,
  blob("s2-front", "Front blob", -180, 1560, 600, 500, C.blush.base, C.blush.shadow, { shot: "s2", opacity: 0.8 }),
  say("t2", "Shot 2 · title", "Ceramides strengthen the skin barrier", 330, 72, 5.0, 6.8, { shot: "s2" }),
];

// --- Shot 3 · Moisture, held (7–10.5) ------------------------------------------------
const inside = [[330, 820, 80], [520, 900, 56], [660, 800, 64], [430, 960, 44], [760, 930, 50]].map(([x, y, s], i) => use(`s3-drop-${i + 1}`, "droplet", x, y, s, s * 1.2, {
  name: `Moisture ${i + 1}`,
  tracks: { y: { keys: [[7, y, "ease-in-out"], [7 + 1.2 + i * 0.2, y - 12]], repeat: "pingpong" } },
}));
const pill = (id, name, x, t, text) => rect(id, x, 1240, 380, 96, C.surface.base, {
  name, shot: "s3", radius: 48, shadow: SOFT,
  label: { text, font: F.body.family, size: 40, weight: F.body.weight, color: C.text.base, align: "center" },
  anim: { in: { kind: "slide", from: "down", amount: 40, delay: t, duration: 0.5, easing: "cubic-out" } },
});
const s3 = [
  backdrop("s3-bg", "s3"),
  blob("s3-back", "Back blob", -110, 310, 1300, 1300, C.blush.highlight, C.skin.base, { shot: "s3", opacity: 0.7, tracks: breathe(7, 10.5) }),
  group("s3-cell", 190, 720, 700, 420, [
    rect("s3-cell-shade", 0, 0, 700, 420, C.skin.shadow, { radius: 210 }),
    rect("s3-cell-core", 0, 0, 680, 400, C.skin.base, { radius: 200 }),
    rect("s3-cell-shine", 120, 52, 180, 26, C.skin.highlight, { radius: 13, fill: { opacity: 0.9 } }),
  ], { name: "Big cell", shot: "s3", tracks: breathe(7, 10.5, 0.99) }),
  group("s3-moisture", 0, 0, W, H, inside, { name: "Moisture inside", shot: "s3" }),
  pill("s3-ectoin", "Ectoin pill", 120, 8.0, "Ectoin"),
  pill("s3-hyaluronic", "Hyaluronic acid pill", 580, 8.15, "Hyaluronic acid"),
  say("t3", "Shot 3 · title", "Ectoin + hyaluronic acid", 330, 72, 7.4, 10.3, { shot: "s3" }),
  say("t3b", "Shot 3 · support", "Moisturising", 1440, 48, 8.6, 10.3, body({ shot: "s3" })),
];

// --- Shot 4 · Plant actives (10.5–13.5) ----------------------------------------------
const FAR_HILL = "M0 560 L0 260 Q180 40 380 200 Q520 300 640 160 Q820 -20 1080 220 Q1140 250 1200 240 L1200 560 Z";
const NEAR_HILL = "M0 560 L0 380 Q240 200 470 330 Q700 450 880 300 Q980 230 1080 280 Q1140 300 1200 290 L1200 560 Z";
const LEAF = (w, h) => `M${w / 2} ${h} C${-w * 0.15} ${h * 0.6} ${w * 0.15} ${h * 0.12} ${w * 0.5} 0 C${w * 0.85} ${h * 0.12} ${w * 1.15} ${h * 0.6} ${w / 2} ${h} Z`;
const LEAF_SHADE = (w, h) => `M${w / 2} ${h} L${w * 0.5} 0 C${w * 0.85} ${h * 0.12} ${w * 1.15} ${h * 0.6} ${w / 2} ${h} Z`;
const leaf = (id, x, y, angle) => group(id, x, y, 70, 220, [
  path(`${id}-base`, 0, 0, 70, 220, LEAF(70, 220), C.sage.base),
  path(`${id}-shade`, 0, 0, 70, 220, LEAF_SHADE(70, 220), C.sage.shadow),
], { name: "Leaf", origin: "bottom", tracks: { "@rotate": [[10.5, angle]] } });
const flower = (id, x, y, s, tone, t) => ell(id, x, y, s, s * 0.82, C.blush[tone], {
  name: "Flower", tracks: { "@scale": [[t, 0.8, "cubic-out"], [t + 0.4, 1]], opacity: [[t, 0, "cubic-out"], [t + 0.4, 1]] },
});
const willowherb = group("s4-willowherb", 300, 860, 400, 860, [
  path("s4-stem", 0, 0, 400, 860, "M190 860 C196 640 214 360 226 120 L244 122 C232 360 216 640 210 860 Z", C.sage.shadow),
  leaf("s4-leaf-1", 120, 470, -42),
  leaf("s4-leaf-2", 222, 370, 38),
  leaf("s4-leaf-3", 132, 250, -34),
  leaf("s4-leaf-4", 214, 160, 30),
  flower("s4-flower-1", 206, 96, 64, "base", 11.3),
  flower("s4-flower-2", 168, 46, 54, "highlight", 11.4),
  flower("s4-flower-3", 246, 52, 56, "highlight", 11.5),
  flower("s4-flower-4", 196, 0, 50, "base", 11.6),
  flower("s4-flower-5", 236, 140, 46, "highlight", 11.7),
], {
  name: "Alpine willowherb", shot: "s4", origin: "bottom",
  tracks: { "@scale": [[10.6, 0, "cubic-out"], [11.4, 1]] },
  anim: { loop: { kind: "swing", amount: 3, cycles: 6 } },
});
const s4 = [
  backdrop("s4-bg", "s4"),
  path("s4-far", 0, 1150, W + 120, 560, FAR_HILL, C.sage.highlight, { name: "Far hills", shot: "s4", fill: { opacity: 0.45 }, tracks: { x: [[10.5, 0, "linear"], [13.5, -30]] } }),
  path("s4-near", 0, 1300, W + 120, 560, NEAR_HILL, C.sage.highlight, { name: "Near hills", shot: "s4", fill: { opacity: 0.85 }, tracks: { x: [[10.5, 0, "linear"], [13.5, -45]] } }),
  willowherb,
  ell("s4-drop-shadow", 700, 1180, 190, 34, C.skin.shadow, { name: "Drop shadow", shot: "s4", fill: { opacity: 0.3 }, tracks: { opacity: [[11.2, 0, "cubic-out"], [11.7, 1]] } }),
  use("s4-bakuchiol", "creamdrop", 720, 980, 150, 180, {
    name: "Bakuchiol drop", shot: "s4",
    tracks: { opacity: [[11.2, 0, "cubic-out"], [11.7, 1]], y: { keys: [[11.2, 980, "ease-in-out"], [12.5, 960]], repeat: "pingpong" } },
  }),
  blob("s4-front", "Front blob", 760, 1600, 500, 400, C.sage.base, C.sage.shadow, { shot: "s4", opacity: 0.85, tracks: { x: [[10.5, 760, "linear"], [13.5, 700]] } }),
  say("t4", "Shot 4 · title", "Bakuchiol &\nAlpine willowherb", 330, 72, 11.0, 13.3, { shot: "s4" }),
];

// --- Shot 5 · Measured (13.5–17) ------------------------------------------------------
const WAVY = "M0 60 C90 0 170 0 260 60 C350 120 430 120 520 60 C580 20 640 20 700 60 L700 74 C640 34 580 34 520 74 C430 134 350 134 260 74 C170 14 90 14 0 74 Z";
const CALM = "M0 60 C90 40 170 40 260 60 C350 80 430 80 520 60 C580 47 640 47 700 60 L700 74 C640 61 580 61 520 74 C430 94 350 94 260 74 C170 54 90 54 0 74 Z";
const card = (id, name, prefix, to, caption, tIn, tCount, tOut) => group(id, 120, 780, 840, 300, [
  rect(`${id}-bg`, 0, 0, 840, 300, C.surface.base, { radius: 60, shadow: SOFT }),
  rect(`${id}-bar`, 40, 50, 12, 200, C.accent.base, { name: "Accent bar", radius: 6 }),
  { id: `${id}-num`, kind: "counter", name: "Number", x: 0, y: 40, w: 840, h: 140, from: 0, to, decimals: 0, prefix, suffix: " %",
    font: F.heading.family, weight: F.heading.weight, size: 110, color: C.text.base, align: "center",
    tracks: { progress: [[tCount, 0, "cubic-out"], [tCount + (to > 20 ? 0.8 : 1.0), 1]] } },
  { id: `${id}-caption`, kind: "text", name: "Caption", x: 0, y: 190, w: 840, align: "center", text: caption,
    font: F.body.family, size: 44, weight: F.body.weight, color: C.text.base },
], {
  name, shot: "s5",
  anim: {
    in: { kind: "slide", from: "down", amount: 30, delay: tIn, duration: 0.5, easing: "cubic-out" },
    ...(tOut ? { out: { kind: "fade", delay: tOut - 0.25, duration: 0.25, easing: "cubic-in" } } : {}),
  },
});
const s5 = [
  backdrop("s5-bg", "s5"),
  blob("s5-back", "Back blob", -110, 330, 1300, 1300, C.blush.highlight, C.skin.base, { shot: "s5", opacity: 0.5, tracks: breathe(13.5, 17) }),
  flatPath("s5-wrinkle", 190, 560, 700, 140, [WAVY, CALM], C.skin.shadow, { name: "Wrinkle line", shot: "s5", tracks: { morph: [[13.9, 0, "ease-in-out"], [14.9, 1]] } }),
  card("s5-card-1", "Stat card · wrinkle depth", "−", 14, "wrinkle depth in 2 weeks*", 13.7, 13.9, 15.4),
  card("s5-card-2", "Stat card · skin barrier", "Up to ", 49, "better skin barrier*", 15.5, 15.6),
  say("t5", "Shot 5 · footnote", "*RINGANA study, 23 participants, 2 weeks.", 1620, 30, 13.8, 17, body({ shot: "s5" })),
];

// --- Shot 6 · The product (17–20) ------------------------------------------------------
const sprig = (id, x, y) => group(id, x, y, 60, 110, [
  rect(`${id}-stem`, 27, 30, 6, 80, C.sage.shadow, { radius: 3 }),
  path(`${id}-l`, 0, 10, 30, 64, LEAF(30, 64), C.sage.base, { tracks: { "@rotate": [[17, -30]] } }),
  path(`${id}-r`, 30, 0, 30, 64, LEAF(30, 64), C.sage.base, { tracks: { "@rotate": [[17, 30]] } }),
], { name: "Sprig mark" });
const bottle = group("s6-bottle", 420, 580, 240, 600, [
  rect("s6-body-shade", 0, 170, 240, 430, C.cream.shadow, { radius: 40, shadow: SOFT }),
  rect("s6-body", 0, 170, 192, 430, C.cream.base, { radius: 40 }),
  rect("s6-body-shine", 26, 210, 40, 340, C.cream.highlight, { radius: 20 }),
  rect("s6-cap-shade", 0, 0, 240, 186, C.surface.shadow, { radius: 30 }),
  rect("s6-cap", 0, 0, 200, 186, C.background.base, { radius: 30 }),
  sprig("s6-sprig", 90, 300),
], {
  name: "FRESH skin perfection bottle", shot: "s6",
  tracks: {
    y: [[17.2, 640, "cubic-out"], [17.9, 580]],
    opacity: [[17.2, 0, "cubic-out"], [17.9, 1]],
    "@scale": { keys: [[18, 1, "ease-in-out"], [19.5, 1.01]], repeat: "pingpong" },
  },
});
const s6 = [
  backdrop("s6-bg", "s6"),
  blob("s6-back", "Back blob", -10, 350, 1100, 1100, C.blush.highlight, C.skin.base, { shot: "s6", opacity: 0.7, tracks: breathe(17, 20) }),
  ell("s6-pedestal-shadow", 260, 1250, 560, 50, C.skin.shadow, { name: "Pedestal shadow", shot: "s6", fill: { opacity: 0.35 }, tracks: { opacity: [[17.1, 0, "cubic-out"], [17.6, 1]] } }),
  group("s6-pedestal", 280, 1180, 520, 90, [
    rect("s6-ped", 0, 0, 520, 90, C.blush.base, { radius: 45 }),
    rect("s6-ped-top", 30, 8, 460, 18, C.blush.highlight, { radius: 9 }),
  ], { name: "Pedestal", shot: "s6", tracks: { opacity: [[17.1, 0, "cubic-out"], [17.6, 1]] } }),
  bottle,
  say("t6", "Shot 6 · product name", "RINGANA\nFRESH skin perfection", 1330, 64, 17.6, D, { shot: "s6", hold: true }),
  say("t6b", "Shot 6 · support", "Recovery cream", 1510, 44, 17.9, D, body({ shot: "s6", hold: true })),
];

// --- Scene ------------------------------------------------------------------------------
const fade = { kind: "fade", duration: 0.4 };
const push = (a, b, z0, z1) => ({ zoom: z0, tracks: { zoom: [[a, z0, "linear"], [b, z1]] } });
const scene = {
  size: [W, H], duration: D, fps: 30, defaults: "flat",
  background: { color: C.background.base, gradient: false, dots: false, spotlight: 0 },
  symbols,
  shots: [
    nativeShot("s1", "Shot 1 · Thirsty skin", 0, 3.5, push(0, 3.5, 1, 1.04)),
    { ...nativeShot("s2", "Shot 2 · The cream lands", 3.5, 7, push(3.5, 7, 1.04, 1.08)), transition: fade },
    { ...nativeShot("s3", "Shot 3 · Moisture, held", 7, 10.5, push(7, 10.5, 1, 1.04)), transition: fade },
    { ...nativeShot("s4", "Shot 4 · Plant actives", 10.5, 13.5), transition: fade },
    { ...nativeShot("s5", "Shot 5 · Measured", 13.5, 17, push(13.5, 17, 1, 1.03)), transition: fade },
    { ...nativeShot("s6", "Shot 6 · The product", 17, D, push(17, D, 1, 1.04)), transition: fade },
  ],
  elements: [...s1, ...s2, ...s3, ...s4, ...s5, ...s6],
};
fs.writeFileSync(__dirname + "/scene.json", JSON.stringify(scene, null, 1));
