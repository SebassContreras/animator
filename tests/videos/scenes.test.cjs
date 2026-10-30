// Golden test: the generator must keep writing the scene it wrote before its pieces moved to lib/ (001/R4).
const { test } = require("node:test");
const assert = require("node:assert/strict");
const { execFileSync } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

const root = path.join(__dirname, "..", "..");
const normalizeEol = (str) => str.replace(/\r\n/g, "\n");
const generate = (slug) => {
  execFileSync(process.execPath, [path.join(root, "videos", slug, "scene.gen.cjs")], { cwd: __dirname });
  return fs.readFileSync(path.join(root, "videos", slug, "scene.json"), "utf8");
};
const fixture = (slug) => fs.readFileSync(path.join(__dirname, "fixtures", `${slug}.scene.json`), "utf8");

test("ringana-omega-v2 generator writes scene.json beside itself, byte-identical to the pre-move scene", () => {
  // Arrange
  const expected = normalizeEol(fixture("ringana-omega-v2"));
  // Act
  const actual = normalizeEol(generate("ringana-omega-v2"));
  // Assert
  assert.equal(actual, expected);
});
