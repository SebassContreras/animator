// lib/ pieces take their colours from the palette argument (002/R3, A11).
const { test } = require("node:test");
const assert = require("node:assert/strict");
const { sceneHelpers, nativeShot } = require("../../lib/scene.cjs");

const FONTS = { heading: { family: "Montserrat", weight: 800 }, body: { family: "Montserrat", weight: 500 } };

const labelColour = (palette) => {
  const { text } = sceneHelpers({ w: 1080, h: 1920, duration: 10, palette, fonts: FONTS });
  return text("t", "Text", "Hello", 100, 60, 0, 5).label.color;
};

test("text from two different palettes gets two different label colours", () => {
  // Arrange
  const warm = { text: { base: "#FFE08A" } };
  const cold = { text: { base: "#8FD3FF" } };
  // Act
  const colours = [labelColour(warm), labelColour(cold)];
  // Assert
  assert.deepEqual(colours, ["#FFE08A", "#8FD3FF"]);
});

test("label is a frame-wide centred text element coloured from the palette", () => {
  // Arrange
  const { label } = sceneHelpers({ w: 1080, h: 1920, duration: 10, palette: { text: { base: "#FFE08A" } }, fonts: FONTS });
  // Act
  const el = label("t", "Text", "Hello", 100, 60, 0, 5, { shot: "s1" });
  // Assert
  assert.deepEqual([el.kind, el.x, el.w, el.align, el.color, el.shot], ["text", 0, 1080, "center", "#FFE08A", "s1"]);
});

test("nativeShot writes a shots entry and omits camera when none is given", () => {
  // Arrange
  const camera = { zoom: 1.2 };
  // Act
  const shots = [nativeShot("s1", "Shot 1", 0, 3), nativeShot("s2", "Shot 2", 3, 6, camera)];
  // Assert
  assert.deepEqual(shots, [
    { id: "s1", name: "Shot 1", start: 0, end: 3 },
    { id: "s2", name: "Shot 2", start: 3, end: 6, camera: { zoom: 1.2 } },
  ]);
});
