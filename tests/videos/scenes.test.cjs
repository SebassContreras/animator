// Golden tests: each generator must keep writing the scene it wrote before its pieces moved to lib/ (001/R4, 005/R6).
const { test } = require("node:test");
const assert = require("node:assert/strict");
const { execFileSync } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

const root = path.join(__dirname, "..", "..");
const generate = (slug) => {
  execFileSync(process.execPath, [path.join(root, "videos", slug, "scene.gen.cjs")], { cwd: __dirname });
  return fs.readFileSync(path.join(root, "videos", slug, "scene.json"), "utf8");
};
const fixture = (slug) => fs.readFileSync(path.join(__dirname, "fixtures", `${slug}.scene.json`), "utf8");

test("ringana-omega generator writes scene.json beside itself, byte-identical to the pre-move scene", () => {
  // Arrange
  const expected = fixture("ringana-omega");
  // Act
  const actual = generate("ringana-omega");
  // Assert
  assert.equal(actual, expected);
});

test("ringana-omega-v2 generator writes scene.json beside itself, byte-identical to the pre-move scene", () => {
  // Arrange
  const expected = fixture("ringana-omega-v2");
  // Act
  const actual = generate("ringana-omega-v2");
  // Assert
  assert.equal(actual, expected);
});

test("viaje generator writes the same scene values as before its pieces moved to lib/", () => {
  // Arrange: values, not bytes: lib/ primitives may write keys in another order (005/R6)
  const expected = JSON.parse(fixture("viaje"));
  // Act
  const actual = JSON.parse(generate("viaje"));
  // Assert
  assert.deepEqual(actual, expected);
});
