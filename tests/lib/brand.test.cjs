// brandLock / checkBrandLock over the R1 partitions and invariant (011/R1, D1, D10).
const { test } = require("node:test");
const assert = require("node:assert/strict");
const { brandLock, checkBrandLock } = require("../../lib/brand.cjs");

const CANVAS = { width: 1080, height: 1920, fps: 30, duration: 20 };
const FULL_PALETTE = { primary: "#000000", secondary: "#2D2D2D", accent: "#ED691C", background: "#FFFFFF", surface: "#F7F7F7", text: "#000000" };
const FONTS = [{ family: "Montserrat", role: "heading", weights: [800] }, { family: "Montserrat", role: "body", weights: [500] }];
const inspect = (manifest, rest = {}) => ({ manifest: { project: "ringana", palette: FULL_PALETTE, fonts: FONTS, canvas: CANVAS, ...manifest }, ...rest });

// valid project_inspect results → the expected lock
const VALID = [
  ["full brand", inspect({}, { guide: "# Guide" }), { project: "ringana", palette: FULL_PALETTE, fonts: FONTS, canvas: CANVAS, guide: "# Guide" }],
  ["palette with only primary", inspect({ palette: { primary: "#3b82f6" } }, { guide: null }), { project: "ringana", palette: { primary: "#3b82f6" }, fonts: FONTS, canvas: CANVAS, guide: null }],
  ["no fonts", inspect({ fonts: [] }, { guide: null }), { project: "ringana", palette: FULL_PALETTE, fonts: [], canvas: CANVAS, guide: null }],
  ["no guide in the result", inspect({}), { project: "ringana", palette: FULL_PALETTE, fonts: FONTS, canvas: CANVAS, guide: null }],
  ["extra keys dropped", inspect({ name: "RINGANA", createdAt: "2026-10-24T12:49:30.646Z", palette: { ...FULL_PALETTE, custom: ["#E5E5E5"] } }, { guide: null, assets: [] }),
    { project: "ringana", palette: FULL_PALETTE, fonts: FONTS, canvas: CANVAS, guide: null }],
];

for (const [name, result, expected] of VALID) {
  test(`brandLock: ${name} gives the five-key lock`, () => {
    // Act
    const lock = brandLock(result);
    // Assert
    assert.deepEqual(lock, expected);
  });

  test(`checkBrandLock(brandLock(x)) accepts ${name}`, () => {
    // Arrange
    const lock = brandLock(result);
    // Act + Assert
    assert.equal(checkBrandLock(lock), lock);
  });
}

// invalid locks → the error names the bad role or key
const LOCK = brandLock(inspect({}, { guide: null }));
const INVALID = [
  ["a palette colour in rgb()", { ...LOCK, palette: { primary: "rgb(0, 0, 0)" } }, /"primary".*#RRGGBB/],
  ["a palette colour as a CSS name", { ...LOCK, palette: { primary: "#000000", accent: "orange" } }, /"accent"/],
  ["missing project", brandLock(inspect({ project: undefined })), /"project"/],
  ["a missing canvas field", { ...LOCK, canvas: { width: 1080, height: 1920, fps: 30 } }, /"duration"/],
  ["an unknown key", { ...LOCK, version: 2 }, /"version"/],
];

for (const [name, lock, error] of INVALID) {
  test(`checkBrandLock rejects ${name}, naming it`, () => {
    // Act + Assert
    assert.throws(() => checkBrandLock(lock), error);
  });
}
