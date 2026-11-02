// blob fills the caller's box with the caller's gradient; extra merges in (013/R3).
const { test } = require("node:test");
const assert = require("node:assert/strict");
const { blob } = require("../../lib/environment.cjs");

const BOX = { x: -110, y: 350, w: 1300, h: 900 };
const pick = (e, keys) => Object.fromEntries(keys.map((k) => [k, e[k]]));

const CASES = [
  ["box gives the position and size", {}, (e) => pick(e, ["x", "y", "w", "h"]), BOX],
  ["top and bottom give the gradient", {}, (e) => pick(e.fill, ["gradient", "color", "color2", "angle"]), { gradient: true, color: "#ffeeee", color2: "#cc8888", angle: 90 }],
  ["extra.fill merges and keeps the gradient", { fill: { opacity: 0.5 } }, (e) => pick(e.fill, ["gradient", "color", "opacity"]), { gradient: true, color: "#ffeeee", opacity: 0.5 }],
  ["extra shot and tracks pass through", { shot: "s1", tracks: { x: [[0, 1]] } }, (e) => pick(e, ["shot", "tracks", "name"]), { shot: "s1", tracks: { x: [[0, 1]] }, name: "Back blob" }],
];

for (const [partition, extra, read, expected] of CASES) {
  test(`blob: ${partition}`, () => {
    // Act
    const e = blob("b", "Back blob", BOX, "#ffeeee", "#cc8888", extra);
    // Assert
    assert.deepEqual(read(e), expected);
  });
}

const { sea, particles } = require("../../lib/environment.cjs");

// Table test covering sea and particles extra parameter partitions (016/R5, D5)
const SEA_CASES = [
  ["extra omitted produces nominal gradient rect", undefined, { shot: undefined, opacity: undefined, gradient: true, angle: 90 }],
  ["extra shot and opacity pass through", { shot: "s1", opacity: 0.8 }, { shot: "s1", opacity: 0.8, gradient: true, angle: 90 }],
  ["extra.fill merges into gradient fill", { fill: { opacity: 0.4 } }, { shot: undefined, opacity: undefined, gradient: true, angle: 90, fillOpacity: 0.4 }],
];

for (const [name, extra, expected] of SEA_CASES) {
  test(`sea extra partition: ${name}`, () => {
    const el = extra !== undefined ? sea("s", { w: 1080, h: 1920 }, "#000", "#fff", "Sea", extra) : sea("s", { w: 1080, h: 1920 }, "#000", "#fff");
    assert.equal(el.kind, "rect");
    assert.equal(el.w, 1080);
    assert.equal(el.h, 1920);
    assert.equal(el.shot, expected.shot);
    assert.equal(el.opacity, expected.opacity);
    assert.equal(el.fill.gradient, expected.gradient);
    assert.equal(el.fill.angle, expected.angle);
    if (expected.fillOpacity !== undefined) {
      assert.equal(el.fill.opacity, expected.fillOpacity);
    }
  });
}

const PARTICLE_CASES = [
  ["extra omitted produces nominal particles descriptor", undefined, { shot: undefined, opacity: undefined }],
  ["extra shot passes through", { shot: "s2" }, { shot: "s2", opacity: undefined }],
  ["extra shot and opacity pass through", { shot: "s1", opacity: 0.75 }, { shot: "s1", opacity: 0.75 }],
];

for (const [name, extra, expected] of PARTICLE_CASES) {
  test(`particles extra partition: ${name}`, () => {
    const box = { x: 0, y: 0, w: 500, h: 500 };
    const opts = { count: 10, drift: 0.5, seed: 1, size: 4, color: "#fff", opacity: 0.9 };
    const el = extra !== undefined ? particles("p", "Stars", box, opts, extra) : particles("p", "Stars", box, opts);
    assert.equal(el.kind, "particles");
    assert.equal(el.shot, expected.shot);
    assert.equal(el.opacity, expected.opacity);
    assert.equal(el.count, 10);
  });
}
