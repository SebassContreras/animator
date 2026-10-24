// Road markings loop over the period given, so a shot-long period never freezes the road (005/R4).
const { test } = require("node:test");
const assert = require("node:assert/strict");
const { dashes } = require("../../lib/environment.cjs");

test("dashes slide one frame width over exactly the period given", () => {
  // Arrange
  const d = dashes("d", 0, 3, { width: 1080, color: "#FFFFFF" });
  // Act
  const last = d.tracks.x.at(-1);
  // Assert
  assert.deepEqual(last, [3, -1080]);
});
