// teardrop takes a role's tones: each child gets its own (013/R4).
// prefix allows instantiating multiple teardrops without duplicate child IDs (015/R2, D2).
// metricCard combines rounded rect, title, and counter (015/R3, D3).
// radialLayout calculates points around (cx, cy) distributed evenly on a circle (015/R4, D4).
const { test } = require("node:test");
const assert = require("node:assert/strict");
const { teardrop, metricCard, radialLayout } = require("../../lib/objects.cjs");

const TONES = { base: "#3399cc", shadow: "#226688", highlight: "#bbeeff" };
const CASES = [["shade", "shadow"], ["core", "base"], ["shine", "highlight"]];

for (const [child, tone] of CASES) {
  test(`teardrop ${child} takes the ${tone} tone`, () => {
    // Act
    const { children } = teardrop(TONES);
    // Assert
    assert.equal(children.find((c) => c.id === child).fill.color, TONES[tone]);
  });
}

// Table test covering teardrop prefix partitions and duplicate ID equivalence class (015/R2, D2)
const PREFIX_CASES = [
  ["prefix omitted", undefined, ["shade", "core", "shine"]],
  ["prefix empty string", "", ["shade", "core", "shine"]],
  ["prefix drop1_", "drop1_", ["drop1_shade", "drop1_core", "drop1_shine"]],
  ["prefix drop2-", "drop2-", ["drop2-shade", "drop2-core", "drop2-shine"]],
];

for (const [name, prefix, expectedIds] of PREFIX_CASES) {
  test(`teardrop prefix partition: ${name}`, () => {
    // Act
    const { children } = prefix !== undefined ? teardrop(TONES, prefix) : teardrop(TONES);
    // Assert
    assert.deepEqual(children.map((c) => c.id), expectedIds);
  });
}

test("multiple teardrops with distinct prefixes avoid duplicate IDs in a scene graph", () => {
  // Arrange & Act
  const drop1 = teardrop(TONES, "d1_");
  const drop2 = teardrop(TONES, "d2_");
  const allIds = [...drop1.children, ...drop2.children].map((c) => c.id);
  // Assert
  assert.equal(new Set(allIds).size, allIds.length);
});

// Table test covering metricCard nominal inputs, prefix/suffix, borderGlow, and extra passthrough (015/R3, D3)
const METRIC_CARD_CASES = [
  [
    "nominal options without glow or prefix",
    { id: "c1", x: 100, y: 200, w: 800, h: 500, title: "LATENCY", from: 0, to: 100, color: "#ffffff" },
    { hasGlow: false, hasPrefix: false, hasSuffix: false, radius: 32 },
  ],
  [
    "options with prefix, suffix and boolean borderGlow",
    { id: "c2", x: 50, y: 50, w: 600, h: 400, title: "USAGE", from: 10, to: 99, prefix: "$", suffix: "%", color: "#00ffcc", borderGlow: true },
    { hasGlow: true, hasPrefix: true, hasSuffix: true, radius: 32 },
  ],
  [
    "options with custom borderGlow object and extra",
    { id: "c3", x: 0, y: 0, w: 500, h: 300, title: "REQUESTS", from: 0, to: 5000, color: "#ffaa00", borderGlow: { enabled: true, blur: 30 }, extra: { shot: "s1" } },
    { hasGlow: true, hasPrefix: false, hasSuffix: false, radius: 32, shot: "s1" },
  ],
];

for (const [name, input, expected] of METRIC_CARD_CASES) {
  test(`metricCard partition: ${name}`, () => {
    // Act
    const card = metricCard(input);
    // Assert
    assert.equal(card.kind, "group");
    assert.equal(card.id, input.id);
    assert.equal(card.w, input.w);
    assert.equal(card.h, input.h);
    assert.equal(card.children.length, 3);

    const [bg, title, counter] = card.children;
    assert.equal(bg.radius, expected.radius);
    assert.equal(title.text, input.title);
    assert.equal(counter.kind, "counter");
    assert.equal(counter.from, input.from);
    assert.equal(counter.to, input.to);

    if (expected.hasGlow) {
      assert.ok(bg.borderGlow && bg.borderGlow.enabled);
    }
    if (expected.hasPrefix) {
      assert.equal(counter.prefix, input.prefix);
    }
    if (expected.hasSuffix) {
      assert.equal(counter.suffix, input.suffix);
    }
    if (expected.shot) {
      assert.equal(card.shot, expected.shot);
    }
  });
}

// Table test covering radialLayout partitions: count = 0, count = 1, count > 1, startAngle (015/R4, D4)
const RADIAL_CASES = [
  ["count 0 returns empty array", { cx: 500, cy: 500, radius: 200, count: 0 }, 0],
  ["count negative returns empty array", { cx: 500, cy: 500, radius: 200, count: -3 }, 0],
  ["count 1 returns single point at startAngle", { cx: 100, cy: 100, radius: 50, count: 1, startAngle: 0 }, 1],
  ["count 4 evenly spaces angles by pi/2", { cx: 0, cy: 0, radius: 100, count: 4, startAngle: 0 }, 4],
  ["custom startAngle offset", { cx: 200, cy: 300, radius: 100, count: 3, startAngle: Math.PI / 2 }, 3],
];

for (const [name, input, expectedCount] of RADIAL_CASES) {
  test(`radialLayout partition: ${name}`, () => {
    // Act
    const points = radialLayout(input);
    // Assert
    assert.equal(points.length, expectedCount);
    if (expectedCount > 0) {
      for (const p of points) {
        const expectedX = input.cx + input.radius * Math.cos(p.angle);
        const expectedY = input.cy + input.radius * Math.sin(p.angle);
        assert.ok(Math.abs(p.x - expectedX) < 1e-9);
        assert.ok(Math.abs(p.y - expectedY) < 1e-9);
      }
      if (expectedCount > 1) {
        const step = (2 * Math.PI) / input.count;
        assert.ok(Math.abs((points[1].angle - points[0].angle) - step) < 1e-9);
      }
    }
  });
}

// Table test covering metricCard property filtering partitions and unknown fields equivalence class (016/R3, D3)
const FORBIDDEN_GROUP_KEYS = [
  "bgColor", "border", "titleY", "titleFont", "titleSize", "titleWeight", "titleColor",
  "counterY", "counterH", "counterSize", "counterColor", "glow"
];

const CARD_FILTER_CASES = [
  [
    "styling keys stripped while shot and tracks preserved",
    {
      id: "card1", x: 10, y: 20, w: 400, h: 250, title: "RPS", from: 0, to: 100,
      extra: {
        bgColor: "#112233", border: { width: 2, color: "#fff" }, titleY: 30, titleFont: "Inter",
        titleSize: 24, titleWeight: 700, titleColor: "#ffffff", counterY: 100, counterH: 80,
        counterSize: 64, counterColor: "#00ffcc", glow: { enabled: true },
        shot: "s2", tracks: { opacity: [[0, 0], [1, 1]] }, name: "Custom Metric"
      }
    },
    { shot: "s2", name: "Custom Metric", hasTracks: true }
  ],
  [
    "group-only extra keys without styling keys",
    {
      id: "card2", x: 0, y: 0, w: 300, h: 200, title: "LATENCY",
      extra: { shot: "s1" }
    },
    { shot: "s1", hasTracks: false }
  ],
  [
    "extra omitted entirely",
    {
      id: "card3", x: 0, y: 0, w: 300, h: 200, title: "EMPTY"
    },
    { hasTracks: false }
  ],
];

for (const [name, input, expected] of CARD_FILTER_CASES) {
  test(`metricCard filtering partition: ${name}`, () => {
    const card = metricCard(input);
    for (const key of FORBIDDEN_GROUP_KEYS) {
      assert.equal(Object.prototype.hasOwnProperty.call(card, key), false, `group must not have key "${key}"`);
    }
    if (expected.shot) {
      assert.equal(card.shot, expected.shot);
    }
    if (expected.name) {
      assert.equal(card.name, expected.name);
    }
    if (expected.hasTracks) {
      assert.ok(card.tracks);
    }
    assert.equal(card.children.length, 3);
  });
}
