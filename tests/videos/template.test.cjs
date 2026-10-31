// Template test: a copy of videos/_template runs as a new video with no edits (003/R2),
// takes its colours from its brand snapshot, and palette.json overrides beat the brand (011/R5, R10, D10).
const { test } = require("node:test");
const assert = require("node:assert/strict");
const { execFileSync } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

const root = path.join(__dirname, "..", "..");

// copy beside the real videos so ../../lib/ still resolves; edit its files, run it, read its scene
const runCopy = (t, edit) => {
  const dir = fs.mkdtempSync(path.join(root, "videos", "tmp-"));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  fs.cpSync(path.join(root, "videos", "_template"), dir, { recursive: true });
  const read = (file) => JSON.parse(fs.readFileSync(path.join(dir, file), "utf8"));
  const write = (file, data) => fs.writeFileSync(path.join(dir, file), JSON.stringify(data));
  edit({ read, write });
  execFileSync(process.execPath, [path.join(dir, "scene.gen.cjs")]);
  return read("scene.json");
};

test("a copied template writes a scene whose background comes from its brand snapshot", (t) => {
  // Arrange + Act
  const scene = runCopy(t, ({ read, write }) => {
    const lock = read("brand.lock.json");
    lock.palette.background = "#123456";
    write("brand.lock.json", lock);
  });
  // Assert
  assert.deepEqual(scene.size, [1080, 1920]);
  assert.ok(scene.elements.length > 0);
  assert.equal(scene.background.color, "#123456");
});

test("a palette.json override beats the brand colour", (t) => {
  // Arrange + Act
  const scene = runCopy(t, ({ write }) => write("palette.json", { background: { base: "#654321" } }));
  // Assert
  assert.equal(scene.background.color, "#654321");
});
