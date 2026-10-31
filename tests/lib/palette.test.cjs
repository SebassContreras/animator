// checkPalette accepts role → { base, shadow?, highlight? } hex maps and names the role it rejects (002/R4); tones and resolvePalette cover 011/R3, R10.
const { test } = require("node:test");
const assert = require("node:assert/strict");
const { checkPalette, tones, resolvePalette } = require("../../lib/palette.cjs");

test("a palette with three-tone and one-tone roles is returned unchanged", () => {
  // Arrange
  const palette = { sea: { base: "#0E3B43", shadow: "#072630", highlight: "#1A6470" }, text: { base: "#FFFFFF" } };
  // Act
  const result = checkPalette(palette);
  // Assert
  assert.equal(result, palette);
});

test("a role without base throws naming that role", () => {
  // Arrange
  const palette = { sea: { shadow: "#072630" } };
  // Act + Assert
  assert.throws(() => checkPalette(palette), /"sea"/);
});

test("a tone with a bad hex throws naming that role", () => {
  // Arrange
  const palette = { drop: { base: "#F2B33D", highlight: "#FFE08" } };
  // Act + Assert
  assert.throws(() => checkPalette(palette), /"drop" has a bad highlight/);
});

// tones(base) over the R3 partitions and invariants (011/R3, D3, D10).
// Expected hexes were computed once with Color.js 0.5.2 (https://colorjs.io) running the D3 rule with
// toGamut({ method: "css" }); lib/palette.cjs matched it on 3000 random bases as well.
// [partition, base, shadow, highlight]
const PARTITIONS = [
  ["a mid base (sea)", "#0E3B43", "#03252E", "#315C62"],
  ["base L just above 40 (shadow −12)", "#004E6F", "#002C49", "#297290"],
  ["base L just under 40 (shadow −8)", "#004982", "#0A3263", "#1F6EA5"],
  ["base L between 85 and 97 (highlight capped at 97)", "#04FFF2", "#07D2D1", "#BCFFF9"],
  ["base L above 97 (highlight keeps the base L)", "#E1FFF4", "#BCD6CF", "#E3FFF1"],
  ["black (shadow is black)", "#000000", "#000000", "#060606"],
  ["white (highlight is white)", "#FFFFFF", "#D7D7D7", "#FFFFFF"],
  ["chroma just over 0.02 (hue shift)", "#646659", "#44443A", "#88897B"],
  ["chroma just under 0.02 (no hue shift)", "#696F63", "#484D43", "#8C9386"],
  ["hue within 6° of the shadow target (stops at 300)", "#6D51A3", "#4D3274", "#9772C6"],
  ["hue across 0°/360° from the highlight target (wraps)", "#954D69", "#68314D", "#BE7085"],
  ["saturated base out of sRGB (chroma reduced)", "#FF0000", "#C4001E", "#FF7C59"],
];

// OKLab lightness, from Ottosson's reference (https://bottosson.github.io/posts/oklab/), independent of lib/
const lightness = (hex) => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map((c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
};
const ROUNDING = 0.005; // 8-bit rounding, ±0.5 L points

for (const [name, base, shadow, highlight] of PARTITIONS) {
  test(`tones: ${name}`, () => {
    // Act
    const result = tones(base);
    // Assert
    assert.deepEqual(result, { shadow, highlight });
  });

  test(`tones keeps L(shadow) ≤ L(base) ≤ L(highlight) and #RRGGBB for ${base}`, () => {
    // Act
    const result = tones(base);
    const [ls, lb, lh] = [result.shadow, base, result.highlight].map(lightness);
    // Assert
    assert.match(result.shadow + result.highlight, /^#[0-9A-F]{6}#[0-9A-F]{6}$/);
    assert.ok(ls <= lb + ROUNDING && lb <= lh + ROUNDING, `${ls} ≤ ${lb} ≤ ${lh}`);
  });
}

test("tones gives the same tones for the same base", () => {
  // Act
  const runs = [tones("#4FA37B"), tones("#4FA37B")];
  // Assert
  assert.deepEqual(runs[0], runs[1]);
});

// resolvePalette(lock, overrides) over the R10 partitions and invariants (011/R10, D4, D10).
const BRAND = { background: "#1B1F4B", primary: "#FF6B6B", secondary: "#4ECDC4", accent: "#FFE66D", text: "#FFFFFF" };
const lockOf = (palette) => ({ project: "sample", palette, fonts: [], canvas: { width: 1080, height: 1920, fps: 30, duration: 20 }, guide: null });
const derived = (base) => ({ base, ...tones(base) });

// [partition, overrides, role to check, expected role]
const RESOLVED = [
  ["no overrides", {}, "primary", derived("#FF6B6B")],
  ["a tone override on a brand role", { primary: { shadow: "#111111" } }, "primary", { ...derived("#FF6B6B"), shadow: "#111111" }],
  ["a base-only override re-derives the tones", { primary: { base: "#4FA37B" } }, "primary", derived("#4FA37B")],
  ["a whole-role override", { primary: { base: "#4FA37B", shadow: "#2E6E52", highlight: "#8FD3A8" } }, "primary", { base: "#4FA37B", shadow: "#2E6E52", highlight: "#8FD3A8" }],
  ["a story role with only base gets derived tones", { sea: { base: "#0E3B43" } }, "sea", derived("#0E3B43")],
];

for (const [name, overrides, role, expected] of RESOLVED) {
  test(`resolvePalette: ${name}`, () => {
    // Act
    const palette = resolvePalette(lockOf(BRAND), overrides);
    // Assert
    assert.deepEqual(palette[role], expected);
  });

  test(`resolvePalette keeps every tone palette.json sets and mutates nothing: ${name}`, () => {
    // Arrange
    const lock = lockOf(BRAND);
    const before = JSON.stringify([lock, overrides]);
    const set = Object.entries(overrides).flatMap(([r, entry]) => Object.entries(entry).map(([tone, hex]) => [r, tone, hex]));
    // Act
    const palette = resolvePalette(lock, overrides);
    // Assert
    assert.deepEqual(set.map(([r, tone]) => [r, tone, palette[r][tone]]), set);
    assert.equal(JSON.stringify([lock, overrides]), before);
  });
}

const without = (role) => Object.fromEntries(Object.entries(BRAND).filter(([r]) => r !== role));
const REJECTED = [
  ["a story role with only a tone", BRAND, { sea: { shadow: "#072630" } }, /"sea" needs a #RRGGBB base/],
  ...["background", "primary", "secondary", "accent", "text"].map((role) =>
    [`missing required role ${role}`, without(role), {}, new RegExp(`"${role}": set them in the Lienzo brand .* or in palette\.json`)]),
  ["two missing required roles", { background: "#1B1F4B", primary: "#FF6B6B", text: "#FFFFFF" }, {}, /"secondary", "accent"/],
  ["a bad hex in palette.json", BRAND, { accent: { base: "#FFE66" } }, /"accent"/],
];

for (const [name, brand, overrides, error] of REJECTED) {
  test(`resolvePalette rejects ${name}, naming it`, () => {
    // Act + Assert
    assert.throws(() => resolvePalette(lockOf(brand), overrides), error);
  });
}

test("resolvePalette gives the same palette for the same inputs", () => {
  // Act
  const runs = [resolvePalette(lockOf(BRAND), { sea: { base: "#0E3B43" } }), resolvePalette(lockOf(BRAND), { sea: { base: "#0E3B43" } })];
  // Assert
  assert.deepEqual(runs[0], runs[1]);
});
