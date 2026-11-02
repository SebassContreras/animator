// brandLock / checkBrandLock over the R1 partitions and invariant, brandFonts over the R4 partitions (011/R1, R4, D1, D5, D10).
const { test } = require("node:test");
const assert = require("node:assert/strict");
const { brandLock, checkBrandLock, brandFonts } = require("../../lib/brand.cjs");

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

// brandFonts over the R4 partitions: [partition, lock fonts, expected { heading, body }]
const font = (family, role, weights) => ({ family, role, weights });
const INTER = { heading: { family: "Inter", weight: 800 }, body: { family: "Inter", weight: 400 } };
const FONT_CASES = [
  ["heading and body declared", [font("Montserrat", "heading", [800]), font("Lato", "body", [500])], { heading: { family: "Montserrat", weight: 800 }, body: { family: "Lato", weight: 500 } }],
  ["only body (heading = body)", [font("Lato", "body", [400])], { heading: { family: "Lato", weight: 400 }, body: { family: "Lato", weight: 400 } }],
  ["only heading (body = heading)", [font("Oswald", "heading", [700])], { heading: { family: "Oswald", weight: 700 }, body: { family: "Oswald", weight: 700 } }],
  ["no fonts (system default)", [], INTER],
  ["only accent and mono (system default)", [font("Caveat", "accent", [400]), font("JetBrains Mono", "mono", [400])], INTER],
  ["two fonts with the same role (the first wins)", [font("Oswald", "heading", [700]), font("Poppins", "heading", [800]), font("Lato", "body", [400])],
    { heading: { family: "Oswald", weight: 700 }, body: { family: "Lato", weight: 400 } }],
  ["several weights (heading highest, body lowest)", [font("Inter", "heading", [400, 800, 600]), font("Inter", "body", [700, 400, 600])],
    { heading: { family: "Inter", weight: 800 }, body: { family: "Inter", weight: 400 } }],
];

for (const [name, fonts, expected] of FONT_CASES) {
  test(`brandFonts: ${name}`, () => {
    // Arrange
    const lock = { ...LOCK, fonts };
    // Act
    const result = brandFonts(lock);
    // Assert
    assert.deepEqual(result, expected);
  });
}

// Table test covering brandFonts mono and accent role partitions (016/R4, D4)
const FONT_ROLE_CASES = [
  [
    "heading, body, mono and accent declared",
    [
      font("Montserrat", "heading", [800]),
      font("Lato", "body", [400]),
      font("JetBrains Mono", "mono", [400, 700]),
      font("Playfair", "accent", [600, 900]),
    ],
    {
      heading: { family: "Montserrat", weight: 800 },
      body: { family: "Lato", weight: 400 },
      mono: { family: "JetBrains Mono", weight: 400 },
      accent: { family: "Playfair", weight: 900 },
    }
  ],
  [
    "only heading and body preserves byte-identical output",
    [font("Montserrat", "heading", [800]), font("Lato", "body", [400])],
    { heading: { family: "Montserrat", weight: 800 }, body: { family: "Lato", weight: 400 } }
  ],
  [
    "no fonts declares defaults without mono or accent",
    [],
    INTER
  ],
];

for (const [name, fonts, expected] of FONT_ROLE_CASES) {
  test(`brandFonts role partition: ${name}`, () => {
    assert.deepEqual(brandFonts({ fonts }), expected);
  });
}

const { brandNotices } = require("../../lib/brand.cjs");

// Table test covering brandNotices inspect.notices partitions (016/R7, D7)
const BRAND_NOTICES_CASES = [
  ["inspect without notices field returns empty array", {}, []],
  ["inspect with empty notices array returns empty array", { notices: [] }, []],
  ["inspect with notice strings returns copy of notices", { notices: ["Font missing", "Weight missing"] }, ["Font missing", "Weight missing"]],
  ["inspect null or undefined returns empty array", undefined, []],
];

for (const [name, input, expected] of BRAND_NOTICES_CASES) {
  test(`brandNotices partition: ${name}`, () => {
    assert.deepEqual(brandNotices(input), expected);
  });
}
