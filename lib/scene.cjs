// Scene helpers: shots, on-screen text and the closing fade.
// `shot` and `text` are the legacy group/rect forms (ringana-omega-v2); `nativeShot` and `label` use Lienzo's native shots and text `w` (010/D3).
// A factory because all three need the same frame size and duration, and text needs the palette (002/D4) and the brand fonts (011/D5).
const { rect, group } = require("./primitives.cjs");

// Invisible hit box behind text labels: opacity 0, never drawn.
const BOX = "#000000";

// textMotion: v1 defaults; `amount` and the easings are only written when given (v1 omits them).
const sceneHelpers = ({ w, h, duration, palette, fonts, textMotion = {} }) => {
  if (!fonts) throw new Error("sceneHelpers needs fonts: pass brandFonts(lock) from lib/brand.cjs");
  const { amount, inDuration = 0.4, easeIn, easeOut } = textMotion;
  // `extra.font: "body"` picks the body font; heading otherwise. `extra.weight` still wins.
  const fontOf = (extra) => fonts[extra.font === "body" ? "body" : "heading"];

  // shot from a to b; `xin` = cross-fade length into this shot
  const shot = (id, name, a, b, children, extra = {}, xin = 0.1) => group(id, 0, 0, w, h, children, {
    name,
    anim: {
      ...(a > 0 ? { in: { kind: "fade", delay: a, duration: xin } } : {}),
      ...(b < duration ? { out: { kind: "fade", delay: b - 0.05 + 0.4, duration: 0.05 } } : {}),
    },
    ...extra,
  });

  const text = (id, name, str, y, size, a, b, extra = {}) => rect(id, 0, y, w, size * 1.6, BOX, {
    name,
    fill: { color: BOX, opacity: 0 },
    label: { text: str, font: fontOf(extra).family, size, weight: extra.weight || fontOf(extra).weight, color: palette.text.base, align: "center" },
    anim: {
      in: { kind: extra.inKind || "slide", from: "down", ...(amount ? { amount } : {}), delay: a, duration: inDuration, ...(easeIn ? { easing: easeIn } : {}) },
      out: { kind: "fade", delay: b - 0.25, duration: 0.25, ...(easeOut ? { easing: easeOut } : {}) },
    },
  });

  const fadeToBlack = (color, length = 0.5) => rect("fade-black", 0, 0, w, h, color, {
    name: "Fade to black", fill: { color, opacity: 0 }, tracks: { "fill.opacity": [[duration - length, 0, "ease-in"], [duration, 1]] },
  });

  // centred text as a native `text` element: `w` = frame width wraps and centres it
  const label = (id, name, str, y, size, a, b, extra = {}) => ({
    id, kind: "text", name, x: 0, y, w, align: "center",
    text: str, font: fontOf(extra).family, size, weight: extra.weight || fontOf(extra).weight, color: palette.text.base,
    anim: {
      in: { kind: extra.inKind || "slide", from: "down", ...(amount ? { amount } : {}), delay: a, duration: inDuration, ...(easeIn ? { easing: easeIn } : {}) },
      out: { kind: "fade", delay: b - 0.25, duration: 0.25, ...(easeOut ? { easing: easeOut } : {}) },
    },
    ...(extra.shot ? { shot: extra.shot } : {}),
  });

  return { shot, text, label, fadeToBlack };
};

// native `shots` entry; `camera` = { x, y, zoom, tracks } (do not use it on shots with groups: see shots-camera.md)
const nativeShot = (id, name, start, end, camera) => ({ id, name, start, end, ...(camera ? { camera } : {}) });

module.exports = { sceneHelpers, nativeShot };
