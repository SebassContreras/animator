// Vehicle and town pieces promoted from viaje keep the rules that once broke it (005/R1, 005/R2).
const { test } = require("node:test");
const assert = require("node:assert/strict");
const { car, house } = require("../../lib/objects.cjs");

const CAR = { body: "#111111", glass: "#222222", light: "#333333", tyre: "#444444", rim: "#555555", spokes: "#666666" };
const HOUSE = { wall: "#111111", roof: "#222222", window: "#333333", lit: "#444444", door: "#555555" };

test("car wheels keep spinning until the spin length given", () => {
  // Arrange
  const c = car("c", 0, 0, CAR, { spin: 12 });
  // Act
  const tyre = c.children.find((e) => e.id === "c-wl");
  // Assert
  assert.equal(tyre.tracks["@rotate"].at(-1)[0], 12);
});

test("house windows switch from the window colour to lit starting at litAt", () => {
  // Arrange
  const h = house("h", 0, 1300, 280, 300, HOUSE, 6.6);
  // Act
  const win = h.children.find((e) => e.id === "h-win");
  // Assert
  assert.deepEqual(win.tracks["fill.color"], [[6.6, "#333333"], [6.6 + 0.3, "#444444"]]);
});
