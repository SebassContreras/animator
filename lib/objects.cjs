// Recurring objects proven in a video. Colours always come from the caller.
const { path, ell, rect, group } = require("./primitives.cjs");

// heart outline drawn in a 140x140 box
const HEART_SIZE = 140;
const HEART_D = "M70 126 L10 62 A32 32 0 0 1 70 18 A32 32 0 0 1 130 62 Z";
const heart = (id, x, y, color, extra = {}) => path(id, x, y, HEART_SIZE, HEART_SIZE, HEART_D, color, extra);

// three-tone teardrop symbol, point up, in a 100×120 view: shadow drop, base drop up-left of it, highlight dot top-left.
// Takes a role's tones, not its name, so lib/ names no palette role (013/D4).
// prefix allows instantiating multiple teardrops without duplicate child IDs (015/D2).
const TEAR_D = "M50 0 C62 24 90 52 90 78 C90 102 72 118 50 118 C28 118 10 102 10 78 C10 52 38 24 50 0 Z";
const teardrop = ({ base, shadow, highlight }, prefix = "") => ({ w: 100, h: 120, children: [
  path(`${prefix}shade`, 0, 0, 100, 120, TEAR_D, shadow),
  path(`${prefix}core`, 0, 0, 92, 110, TEAR_D, base, { view: { x: 0, y: 0, w: 100, h: 120 } }),
  ell(`${prefix}shine`, 30, 62, 18, 22, highlight, { fill: { opacity: 0.85 } }),
] });

// tech metric card combining a rounded rect background (radius: 32), border, optional glow, and an embedded counter + title (015/D3).
const metricCard = ({ id, x, y, w, h, title, from = 0, to, prefix, suffix, color, borderGlow, extra = {} }) => {
  // (016/D3) Strip card styling keys before forwarding extra to outer group
  const {
    bgColor, border, titleY, titleFont, titleSize, titleWeight, titleColor,
    counterY, counterH, counterSize, counterColor, glow, ...groupExtra
  } = extra;

  const bg = rect(`${id}-bg`, 0, 0, w, h, bgColor || "#00000000", {
    name: `${id} · background`,
    radius: 32,
    ...(border ? { border } : {}),
    ...(borderGlow ? { borderGlow: typeof borderGlow === "object" ? borderGlow : { enabled: true, color: color || "#ffffff", blur: 20, strength: 1.2 } } : {}),
  });

  const titleEl = {
    id: `${id}-title`, kind: "text", name: `${id} · title`,
    x: 0, y: titleY || 40, w, align: "center", text: title,
    font: titleFont, size: titleSize || 36, weight: titleWeight || 600, color: titleColor || color,
  };

  const counterEl = {
    id: `${id}-counter`, kind: "counter", name: `${id} · counter`,
    x: 0, y: counterY || Math.round(h * 0.35), w, h: counterH || Math.round(h * 0.35),
    from, to, size: counterSize || 96, color: color || counterColor,
    ...(prefix ? { prefix } : {}),
    ...(suffix ? { suffix } : {}),
    ...(glow ? { glow } : {}),
  };

  return group(id, x, y, w, h, [bg, titleEl, counterEl], groupExtra);
};

// radialLayout calculates points around (cx, cy) distributed evenly on a circle (015/D4).
const radialLayout = ({ cx, cy, radius, count, startAngle = 0 }) => {
  if (!count || count <= 0) return [];
  const step = (2 * Math.PI) / count;
  return Array.from({ length: count }, (_, i) => {
    const angle = startAngle + i * step;
    return {
      x: cx + radius * Math.cos(angle),
      y: cy + radius * Math.sin(angle),
      angle,
    };
  });
};

module.exports = { heart, teardrop, metricCard, radialLayout };
