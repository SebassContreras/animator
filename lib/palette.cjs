// Palette: checks palette.json, derives depth tones in OKLCH and resolves a video's palette from its brand.
// Pure: generators pass require("./palette.json") and get the same object back, or an Error naming the bad role.
const HEX = /^#[0-9A-Fa-f]{6}$/;
const TONES = ["base", "shadow", "highlight"];

const checkPalette = (palette) => {
  for (const [role, entry] of Object.entries(palette)) {
    if (typeof entry !== "object" || entry === null || !HEX.test(entry.base)) throw new Error(`palette role "${role}" needs a #RRGGBB base`);
    for (const key of Object.keys(entry)) {
      if (!TONES.includes(key)) throw new Error(`palette role "${role}" has unknown tone "${key}"`);
      if (!HEX.test(entry[key])) throw new Error(`palette role "${role}" has a bad ${key}: ${entry[key]}`);
    }
  }
  return palette;
};

// sRGB ↔ OKLab with the CSS Color 4 sample-code matrices (011/D3)
const mul = (m, [x, y, z]) => m.map(([a, b, c]) => a * x + b * y + c * z);
const LIN_SRGB_TO_XYZ = [
  [506752 / 1228815, 87881 / 245763, 12673 / 70218],
  [87098 / 409605, 175762 / 245763, 12673 / 175545],
  [7918 / 409605, 87881 / 737289, 1001167 / 1053270],
];
const XYZ_TO_LIN_SRGB = [
  [12831 / 3959, -329 / 214, -1974 / 3959],
  [-851781 / 878810, 1648619 / 878810, 36519 / 878810],
  [705 / 12673, -2585 / 12673, 705 / 667],
];
const XYZ_TO_LMS = [
  [0.819022437996703, 0.3619062600528904, -0.1288737815209879],
  [0.0329836539323885, 0.9292868615863434, 0.0361446663506424],
  [0.0481771893596242, 0.2642395317527308, 0.6335478284694309],
];
const LMS_TO_OKLAB = [
  [0.210454268309314, 0.7936177747023054, -0.0040720430116193],
  [1.9779985324311684, -2.42859224204858, 0.450593709617411],
  [0.0259040424655478, 0.7827717124575296, -0.8086757549230774],
];
const OKLAB_TO_LMS = [
  [1, 0.3963377773761749, 0.2158037573099136],
  [1, -0.1055613458156586, -0.0638541728258133],
  [1, -0.0894841775298119, -1.2914855480194092],
];
const LMS_TO_XYZ = [
  [1.2268798758459243, -0.5578149944602171, 0.2813910456659647],
  [-0.0405757452148008, 1.112286803280317, -0.0717110580655164],
  [-0.0763729366746601, -0.4214933324022432, 1.5869240198367816],
];

const toLinear = (c) => (Math.abs(c) <= 0.04045 ? c / 12.92 : Math.sign(c) * ((Math.abs(c) + 0.055) / 1.055) ** 2.4);
const toGamma = (c) => (Math.abs(c) <= 0.0031308 ? c * 12.92 : Math.sign(c) * (1.055 * Math.abs(c) ** (1 / 2.4) - 0.055));

const rgbToOklch = (rgb) => {
  const [L, a, b] = mul(LMS_TO_OKLAB, mul(XYZ_TO_LMS, mul(LIN_SRGB_TO_XYZ, rgb.map(toLinear))).map(Math.cbrt));
  return { L, C: Math.hypot(a, b), h: ((Math.atan2(b, a) * 180) / Math.PI + 360) % 360 };
};
const hexToOklch = (hex) => rgbToOklch([1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255));
const oklchToRgb = ({ L, C, h }) => {
  const rad = (h * Math.PI) / 180;
  const lms = mul(OKLAB_TO_LMS, [L, C * Math.cos(rad), C * Math.sin(rad)]).map((v) => v ** 3);
  return mul(XYZ_TO_LIN_SRGB, mul(LMS_TO_XYZ, lms)).map(toGamma);
};
const oklab = ({ L, C, h }) => [L, C * Math.cos((h * Math.PI) / 180), C * Math.sin((h * Math.PI) / 180)];
const deltaEOK = (p, q) => Math.hypot(...oklab(p).map((v, i) => v - oklab(q)[i]));
const clip = (rgb) => rgb.map((c) => Math.min(1, Math.max(0, c)));
const inGamut = (rgb) => rgb.every((c) => c >= -0.000075 && c <= 1.000075);
const toHex = (rgb) => "#" + clip(rgb).map((c) => Math.round(c * 255).toString(16).padStart(2, "0").toUpperCase()).join("");

// CSS Color 4 gamut mapping: binary search on OKLCH chroma, JND 0.02, ε 0.0001 (011/D3)
const JND = 0.02, EPSILON = 0.0001;
const gamutMap = (origin) => {
  if (origin.L >= 1) return [1, 1, 1];
  if (origin.L <= 0) return [0, 0, 0];
  if (inGamut(oklchToRgb(origin))) return oklchToRgb(origin);
  let clipped = clip(oklchToRgb(origin));
  if (deltaEOK(rgbToOklch(clipped), origin) < JND) return clipped;
  let min = 0, max = origin.C, minInGamut = true;
  while (max - min > EPSILON) {
    const current = { ...origin, C: (min + max) / 2 };
    if (minInGamut && inGamut(oklchToRgb(current))) { min = current.C; continue; }
    clipped = clip(oklchToRgb(current));
    const E = deltaEOK(rgbToOklch(clipped), current);
    if (E < JND) {
      if (JND - E < EPSILON) return clipped;
      minInGamut = false;
      min = current.C;
    } else {
      max = current.C;
    }
  }
  return clipped;
};

// Hue rotated up to `max` degrees toward `target` along the shorter arc, never past it
const towards = (h, target, max) => {
  const delta = ((target - h + 540) % 360) - 180;
  return (h + Math.sign(delta) * Math.min(max, Math.abs(delta)) + 360) % 360;
};

// Depth tones from a base (011/D3): shadows darker, less chroma, cooler; highlights lighter, warmer.
const NEAR_GREY = 0.02, HUE_SHIFT = 6, SHADOW_HUE = 300, HIGHLIGHT_HUE = 100;
const tones = (base) => {
  const { L, C, h } = hexToOklch(base);
  const shift = C >= NEAR_GREY;
  const shadow = { L: Math.max(0, L - (L < 0.4 ? 0.08 : 0.12)), C: C * 0.85, h: shift ? towards(h, SHADOW_HUE, HUE_SHIFT) : h };
  const highlight = { L: Math.max(L, Math.min(0.97, L + 0.12)), C, h: shift ? towards(h, HIGHLIGHT_HUE, HUE_SHIFT) : h };
  return { shadow: toHex(gamutMap(shadow)), highlight: toHex(gamutMap(highlight)) };
};

// Lienzo's role names, required after resolution (011/R2); `surface` is optional
const REQUIRED_ROLES = ["background", "primary", "secondary", "accent", "text"];

// The palette a generator uses (011/D4): brand bases, palette.json overrides per role and tone, derived tones for the rest
const resolvePalette = (lock, overrides) => {
  const merged = Object.fromEntries(Object.entries(lock.palette).map(([role, base]) => [role, { base }]));
  for (const [role, entry] of Object.entries(overrides)) merged[role] = { ...merged[role], ...entry };
  checkPalette(merged);
  const palette = Object.fromEntries(Object.entries(merged).map(([role, entry]) => [role, { base: entry.base, ...tones(entry.base), ...entry }]));
  const missing = REQUIRED_ROLES.filter((role) => !palette[role]);
  if (missing.length) {
    throw new Error(`palette is missing required role(s) ${missing.map((r) => `"${r}"`).join(", ")}: set them in the Lienzo brand (project_update palette) or in palette.json`);
  }
  return palette;
};

module.exports = { checkPalette, tones, resolvePalette };
