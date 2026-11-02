// Golden test: the generator must keep writing the scene it wrote before its pieces moved to lib/ (001/R4, 013/D8); no generator writes audioTracks (011/R7).
const { test } = require("node:test");
const assert = require("node:assert/strict");
const { execFileSync } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

const root = path.join(__dirname, "..", "..");
const normalizeEol = (str) => str.replace(/\r\n/g, "\n");

// Map golden fixture slug to its generator relative path under videos/
const FIXTURE_MAP = {
  "ringana-omega-v2": "ringana/omega-v2",
  "ringana-skin-perfection": "ringana/skin-perfection",
};

const generate = (relPath) => {
  execFileSync(process.execPath, [path.join(root, "videos", relPath, "scene.gen.cjs")], { cwd: __dirname });
  return fs.readFileSync(path.join(root, "videos", relPath, "scene.json"), "utf8");
};
const fixture = (slug) => fs.readFileSync(path.join(__dirname, "fixtures", `${slug}.scene.json`), "utf8");

// Recursively find all video directories containing a scene.gen.cjs generator
const findVideoGenerators = (dir = path.join(root, "videos"), prefix = "") => {
  const results = [];
  if (!fs.existsSync(dir)) return results;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (!entry.isDirectory() || entry.name.startsWith(".") || entry.name.startsWith("tmp-")) continue;
    const subPath = path.join(dir, entry.name);
    const rel = prefix ? `${prefix}/${entry.name}` : entry.name;
    if (fs.existsSync(path.join(subPath, "scene.gen.cjs"))) {
      results.push({ slug: rel, path: subPath });
    } else {
      results.push(...findVideoGenerators(subPath, rel));
    }
  }
  return results;
};

// one row per fixture: the generator keeps writing it byte for byte (013/D8)
const GOLDEN = fs.readdirSync(path.join(__dirname, "fixtures")).map((f) => f.replace(/\.scene\.json$/, ""));

for (const slug of GOLDEN) {
  const relPath = FIXTURE_MAP[slug] || slug;
  if (!fs.existsSync(path.join(root, "videos", relPath, "scene.gen.cjs"))) continue;

  test(`${slug} generator writes scene.json beside itself, byte-identical to its fixture`, () => {
    // Arrange
    const expected = normalizeEol(fixture(slug));
    // Act
    const actual = normalizeEol(generate(relPath));
    // Assert
    assert.equal(actual, expected);
  });
}

// A scene's audio belongs to the Lienzo scene: no generator writes audioTracks (011/R7, D10).
const VIDEOS = findVideoGenerators();

for (const { slug } of VIDEOS) {
  test(`${slug} generator writes no audioTracks`, () => {
    // Act
    const scene = JSON.parse(generate(slug));
    // Assert
    assert.equal("audioTracks" in scene, false);
  });
}
