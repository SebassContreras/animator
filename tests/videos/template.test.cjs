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

// Table test covering brand.lock.json resolution partitions (016/R1, D1)
const RESOLUTION_CASES = [
  ["nested brand video with only parent lock", { parent: { project: "parent-brand", bg: "#112233" }, local: null, expectedBg: "#112233" }],
  ["nested brand video with both parent and local lock (parent wins)", { parent: { project: "parent-brand", bg: "#112233" }, local: { project: "local-brand", bg: "#445566" }, expectedBg: "#112233" }],
  ["standalone template with local lock", { parent: null, local: { project: "local-brand", bg: "#778899" }, expectedBg: "#778899" }],
];

for (const [name, { parent, local, expectedBg }] of RESOLUTION_CASES) {
  test(`brand lock resolution partition: ${name}`, (t) => {
    const brandDir = fs.mkdtempSync(path.join(root, "videos", "tmp-brand-"));
    t.after(() => fs.rmSync(brandDir, { recursive: true, force: true }));
    const videoDir = path.join(brandDir, "video");
    fs.cpSync(path.join(root, "videos", "_template"), videoDir, { recursive: true });

    const baseLock = JSON.parse(fs.readFileSync(path.join(videoDir, "brand.lock.json"), "utf8"));

    if (parent) {
      const parentLock = { ...baseLock, project: parent.project, palette: { ...baseLock.palette, background: parent.bg } };
      fs.writeFileSync(path.join(brandDir, "brand.lock.json"), JSON.stringify(parentLock, null, 1));
    }
    if (local) {
      const localLock = { ...baseLock, project: local.project, palette: { ...baseLock.palette, background: local.bg } };
      fs.writeFileSync(path.join(videoDir, "brand.lock.json"), JSON.stringify(localLock, null, 1));
    } else {
      fs.rmSync(path.join(videoDir, "brand.lock.json"), { force: true });
    }

    execFileSync(process.execPath, [path.join(videoDir, "scene.gen.cjs")]);
    const scene = JSON.parse(fs.readFileSync(path.join(videoDir, "scene.json"), "utf8"));
    assert.equal(scene.background.color, expectedBg);
  });
}

// Table test covering canvas dimensions, duration, and FPS inheritance (016/R2, D2)
const CANVAS_CASES = [
  ["nominal template lock", { width: 1080, height: 1920, duration: 4, fps: 30 }, [1080, 1920], 4, 30],
  ["custom landscape 60fps lock", { width: 1920, height: 1080, duration: 12, fps: 60 }, [1920, 1080], 12, 60],
];

for (const [name, canvasConfig, expectedSize, expectedDuration, expectedFps] of CANVAS_CASES) {
  test(`canvas inheritance partition: ${name}`, (t) => {
    const scene = runCopy(t, ({ read, write }) => {
      const lock = read("brand.lock.json");
      lock.canvas = canvasConfig;
      write("brand.lock.json", lock);
    });
    assert.deepEqual(scene.size, expectedSize);
    assert.equal(scene.duration, expectedDuration);
    assert.equal(scene.fps, expectedFps);
    assert.equal(scene.shots[0].end, expectedDuration);
  });
}
