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
