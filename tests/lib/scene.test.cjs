// lib/ pieces take their colours from the palette argument (002/R3, A11).
// label extra.color overrides palette.text.base (015/R1, D1).
const { test } = require("node:test");
const assert = require("node:assert/strict");
const { sceneHelpers, nativeShot } = require("../../lib/scene.cjs");

const FONTS = { heading: { family: "Montserrat", weight: 800 }, body: { family: "Montserrat", weight: 500 } };

const labelColour = (palette) => {
  const { text } = sceneHelpers({ w: 1080, h: 1920, duration: 10, palette, fonts: FONTS });
  return text("t", "Text", "Hello", 100, 60, 0, 5).label.color;
};

test("text from two different palettes gets two different label colours", () => {
  // Arrange
  const warm = { text: { base: "#FFE08A" } };
  const cold = { text: { base: "#8FD3FF" } };
  // Act
  const colours = [labelColour(warm), labelColour(cold)];
  // Assert
  assert.deepEqual(colours, ["#FFE08A", "#8FD3FF"]);
});

test("label is a frame-wide centred text element coloured from the palette", () => {
  // Arrange
  const { label } = sceneHelpers({ w: 1080, h: 1920, duration: 10, palette: { text: { base: "#FFE08A" } }, fonts: FONTS });
  // Act
  const el = label("t", "Text", "Hello", 100, 60, 0, 5, { shot: "s1" });
  // Assert
  assert.deepEqual([el.kind, el.x, el.w, el.align, el.color, el.shot], ["text", 0, 1080, "center", "#FFE08A", "s1"]);
});

// Table test covering extra.color partitions: custom color, undefined in extra, extra omitted (015/R1, D1)
const LABEL_COLOR_CASES = [
  ["custom extra.color", { color: "#FF5500" }, "#FF5500"],
  ["extra.color undefined", { color: undefined }, "#FFE08A"],
  ["extra omitted", undefined, "#FFE08A"],
];

for (const [name, extra, expected] of LABEL_COLOR_CASES) {
  test(`label color partition: ${name}`, () => {
    // Arrange
    const { label } = sceneHelpers({ w: 1080, h: 1920, duration: 10, palette: { text: { base: "#FFE08A" } }, fonts: FONTS });
    // Act
    const el = extra ? label("t", "Text", "Hello", 100, 60, 0, 5, extra) : label("t", "Text", "Hello", 100, 60, 0, 5);
    // Assert
    assert.equal(el.color, expected);
  });
}

test("nativeShot writes a shots entry and omits camera when none is given", () => {
  // Arrange
  const camera = { zoom: 1.2 };
  // Act
  const shots = [nativeShot("s1", "Shot 1", 0, 3), nativeShot("s2", "Shot 2", 3, 6, camera)];
  // Assert
  assert.deepEqual(shots, [
    { id: "s1", name: "Shot 1", start: 0, end: 3 },
    { id: "s2", name: "Shot 2", start: 3, end: 6, camera: { zoom: 1.2 } },
  ]);
});

// Any hardcoded family fails, not only Montserrat: every text piece takes the fonts it is given (011/R4, D10).
const SENTINEL = { heading: { family: "Test Sans", weight: 123 }, body: { family: "Test Serif", weight: 321 } };
const pieces = sceneHelpers({ w: 1080, h: 1920, duration: 10, palette: { text: { base: "#FFFFFF" } }, fonts: SENTINEL });
const FACE_CASES = [
  ["label", (extra) => pieces.label("t", "Text", "Hello", 100, 60, 0, 5, extra)],
  ["text", (extra) => pieces.text("t", "Text", "Hello", 100, 60, 0, 5, extra).label],
];

for (const [piece, make] of FACE_CASES) {
  test(`${piece} uses the heading font it is given, and the body font with extra.font "body"`, () => {
    // Act
    const faces = [make({}), make({ font: "body" }), make({ weight: 900 })].map((el) => [el.font, el.weight]);
    // Assert
    assert.deepEqual(faces, [["Test Sans", 123], ["Test Serif", 321], ["Test Sans", 900]]);
  });
}

test("sceneHelpers without fonts names what to pass", () => {
  // Act + Assert
  assert.throws(() => sceneHelpers({ w: 1080, h: 1920, duration: 10, palette: {} }), /brandFonts/);
});

// Table test covering label font role resolution partitions (016/R4, D4)
const ALL_FONTS = {
  heading: { family: "Montserrat", weight: 800 },
  body: { family: "Lato", weight: 400 },
  mono: { family: "JetBrains Mono", weight: 400 },
  accent: { family: "Playfair", weight: 900 },
};

const LABEL_FONT_CASES = [
  ["extra.font: mono", { font: "mono" }, "JetBrains Mono", 400],
  ["extra.font: accent", { font: "accent" }, "Playfair", 900],
  ["extra.font: body", { font: "body" }, "Lato", 400],
  ["extra.font: heading", { font: "heading" }, "Montserrat", 800],
  ["extra.font omitted defaults to heading", {}, "Montserrat", 800],
  ["extra omitted defaults to heading", undefined, "Montserrat", 800],
];

for (const [name, extra, expectedFamily, expectedWeight] of LABEL_FONT_CASES) {
  test(`label font partition: ${name}`, () => {
    const { label } = sceneHelpers({ w: 1080, h: 1920, duration: 10, palette: { text: { base: "#fff" } }, fonts: ALL_FONTS });
    const el = extra !== undefined ? label("t", "Text", "Test", 100, 40, 0, 5, extra) : label("t", "Text", "Test", 100, 40, 0, 5);
    assert.equal(el.font, expectedFamily);
    assert.equal(el.weight, expectedWeight);
  });
}

// Table test covering label anim.out omission (016/R6, D6)
const LABEL_OUT_CASES = [
  ["extra.out: false omits anim.out", { out: false }, false],
  ["extra.out omitted includes default anim.out", {}, true],
  ["extra omitted entirely includes default anim.out", undefined, true],
];

for (const [name, extra, expectOut] of LABEL_OUT_CASES) {
  test(`label out partition: ${name}`, () => {
    const { label } = sceneHelpers({ w: 1080, h: 1920, duration: 10, palette: { text: { base: "#fff" } }, fonts: FONTS });
    const el = extra !== undefined ? label("t", "Title", "Text", 100, 40, 0, 5, extra) : label("t", "Title", "Text", 100, 40, 0, 5);
    assert.ok(el.anim.in);
    if (expectOut) {
      assert.ok(el.anim.out);
      assert.equal(el.anim.out.kind, "fade");
    } else {
      assert.equal(el.anim.out, undefined);
    }
  });
}

// Table test covering nativeShot transition partitions (016/R6, D6)
const NATIVE_SHOT_CASES = [
  ["camera and transition omitted", [undefined, undefined], { hasCamera: false, hasTransition: false }],
  ["camera provided, transition omitted", [{ zoom: 1.2 }, undefined], { hasCamera: true, hasTransition: false }],
  ["camera undefined, transition provided", [undefined, { kind: "fade", duration: 0.4 }], { hasCamera: false, hasTransition: true }],
  ["both camera and transition provided", [{ zoom: 1.1 }, { kind: "slide", duration: 0.5 }], { hasCamera: true, hasTransition: true }],
];

for (const [name, [camera, transition], expected] of NATIVE_SHOT_CASES) {
  test(`nativeShot transition partition: ${name}`, () => {
    const s = nativeShot("s", "Shot", 0, 4, camera, transition);
    assert.equal(s.id, "s");
    assert.equal(s.name, "Shot");
    assert.equal(s.start, 0);
    assert.equal(s.end, 4);
    assert.equal(Boolean(s.camera), expected.hasCamera);
    assert.equal(Boolean(s.transition), expected.hasTransition);
    if (expected.transition) {
      assert.deepEqual(s.transition, transition);
    }
  });
}
