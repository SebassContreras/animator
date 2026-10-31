// teardrop takes a role's tones: each child gets its own (013/R4).
const { test } = require("node:test");
const assert = require("node:assert/strict");
const { teardrop } = require("../../lib/objects.cjs");

const TONES = { base: "#3399cc", shadow: "#226688", highlight: "#bbeeff" };
const CASES = [["shade", "shadow"], ["core", "base"], ["shine", "highlight"]];

for (const [child, tone] of CASES) {
  test(`teardrop ${child} takes the ${tone} tone`, () => {
    // Act
    const { children } = teardrop(TONES);
    // Assert
    assert.equal(children.find((c) => c.id === child).fill.color, TONES[tone]);
  });
}
