// Scene helpers: shots, on-screen text and the closing fade.
// A factory because all three need the same frame size and duration, and text needs the palette (002/D4).
const { rect, group } = require("./primitives.cjs");

// Invisible hit box behind text labels: opacity 0, never drawn.
const BOX = "#000000";

// textMotion: v1 defaults; `amount` and the easings are only written when given (v1 omits them).
const sceneHelpers = ({ w, h, duration, palette, textMotion = {} }) => {
  const { amount, inDuration = 0.4, easeIn, easeOut } = textMotion;

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
    label: { text: str, font: "Montserrat", size, weight: extra.weight || 800, color: palette.text.base, align: "center" },
    anim: {
      in: { kind: extra.inKind || "slide", from: "down", ...(amount ? { amount } : {}), delay: a, duration: inDuration, ...(easeIn ? { easing: easeIn } : {}) },
      out: { kind: "fade", delay: b - 0.25, duration: 0.25, ...(easeOut ? { easing: easeOut } : {}) },
    },
  });

  const fadeToBlack = (color, length = 0.5) => rect("fade-black", 0, 0, w, h, color, {
    name: "Fade to black", fill: { color, opacity: 0 }, tracks: { "fill.opacity": [[duration - length, 0, "ease-in"], [duration, 1]] },
  });

  return { shot, text, fadeToBlack };
};

module.exports = { sceneHelpers };
