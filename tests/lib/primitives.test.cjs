// Primitives are flat unless the caller asks otherwise (002/R6, A12; 013/R2).
const { test } = require("node:test");
const assert = require("node:assert/strict");
const { rect, ell, path } = require("../../lib/primitives.cjs");

const flatness = (e) => ({ gradient: e.fill.gradient, shadow: e.shadow.enabled, border: e.border.width });
const FLAT = { gradient: false, shadow: false, border: 0 };

test("rect is flat by default", () => {
  // Arrange + Act
  const e = rect("r", 0, 0, 10, 10, "#123456");
  // Assert
  assert.deepEqual(flatness(e), FLAT);
});

test("ell is flat by default", () => {
  // Arrange + Act
  const e = ell("e", 0, 0, 10, 10, "#123456");
  // Assert
  assert.deepEqual(flatness(e), FLAT);
});

test("path is flat by default", () => {
  // Arrange + Act
  const e = path("p", 0, 0, 10, 10, "M0 0 L10 10 Z", "#123456");
  // Assert
  assert.deepEqual(flatness(e), FLAT);
});

test("an explicit gradient and shadow from the caller are kept", () => {
  // Arrange
  const extra = { fill: { gradient: true, color2: "#000000" }, shadow: { enabled: true } };
  // Act
  const e = rect("r", 0, 0, 10, 10, "#123456", extra);
  // Assert
  assert.deepEqual(flatness(e), { gradient: true, shadow: true, border: 0 });
});

// `path` takes one `d` or a list: one shape per `d`, in order; a string keeps today's output (013/R2)
const PATH_CASES = [
  ["a string", "M0 0 L10 10 Z", [{ d: "M0 0 L10 10 Z" }]],
  ["a one-element list", ["M0 0 L10 10 Z"], [{ d: "M0 0 L10 10 Z" }]],
  ["a list of several", ["M0 0 Z", "M1 1 Z", "M2 2 Z"], [{ d: "M0 0 Z" }, { d: "M1 1 Z" }, { d: "M2 2 Z" }]],
];

for (const [partition, d, shapes] of PATH_CASES) {
  test(`path with ${partition} gives one shape per d, in order`, () => {
    // Act
    const e = path("p", 0, 0, 10, 10, d, "#123456");
    // Assert
    assert.deepEqual(e.shapes, shapes);
  });
}

test("path with a one-element list deep-equals path with that string", () => {
  // Act
  const fromList = path("p", 0, 0, 10, 10, ["M0 0 Z"], "#123456");
  const fromString = path("p", 0, 0, 10, 10, "M0 0 Z", "#123456");
  // Assert
  assert.deepEqual(fromList, fromString);
});
