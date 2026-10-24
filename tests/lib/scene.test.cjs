// lib/ pieces take their colours from the palette argument (002/R3, A11).
const { test } = require("node:test");
const assert = require("node:assert/strict");
const { sceneHelpers, nameAll } = require("../../lib/scene.cjs");

const labelColour = (palette) => {
  const { text } = sceneHelpers({ w: 1080, h: 1920, duration: 10, palette });
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

test("nameAll names a child of a named element as \"<parent> · <part>\"", () => {
  // Arrange
  const els = [{ id: "car", children: [{ id: "car-body" }] }];
  // Act
  nameAll(els, { car: "Red car" }, { "-body": "body" });
  // Assert
  assert.equal(els[0].children[0].name, "Red car · body");
});
