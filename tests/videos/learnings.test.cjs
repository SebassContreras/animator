// Learnings format: each video's learnings.md, and the template's, has the four kind sections and tracks every engine finding (004/R1, 013/R1, 013/R11).
const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.join(__dirname, "..", "..");
const KINDS = ["Piece", "Rule", "Engine", "Local"];
// an Engine finding ends with a Lienzo issue URL or a three-digit Lienzo spec (013/D7)
const TRACKED = /— tracks: (https:\/\/github\.com\/[^/\s]+\/lienzo\/issues\/\d+|Lienzo spec \d{3})$/;
const isTracked = (bullet) => TRACKED.test(bullet);

// Recursively find all video workspaces containing learnings.md (videos/<brand>/<video> and _template)
const findLearningsDirs = (dir = path.join(root, "videos"), prefix = "") => {
  const results = [];
  if (!fs.existsSync(dir)) return results;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (!entry.isDirectory() || entry.name.startsWith(".") || entry.name.startsWith("tmp-")) continue;
    const subPath = path.join(dir, entry.name);
    const rel = prefix ? `${prefix}/${entry.name}` : entry.name;
    if (fs.existsSync(path.join(subPath, "learnings.md"))) {
      results.push({ slug: rel, path: subPath });
    } else {
      results.push(...findLearningsDirs(subPath, rel));
    }
  }
  return results;
};

const VIDEOS = findLearningsDirs();

// Splits learnings.md into its `## ` sections: [{ heading, bullets }] in file order.
const sections = (filePath) => fs.readFileSync(path.join(filePath, "learnings.md"), "utf8")
  .split(/\r?\n(?=## )/).slice(1)
  .map((block) => {
    const [heading, ...lines] = block.split(/\r?\n/);
    return { heading: heading.slice(3).trim(), bullets: lines.filter((l) => l.startsWith("- ")) };
  });

const untracked = (filePath) => sections(filePath)
  .filter((s) => s.heading === "Engine")
  .flatMap((s) => s.bullets.filter((b) => !isTracked(b)));

const TRACKING_CASES = [
  ["spec reference", "- no per-axis scale — tracks: Lienzo spec 088", true],
  ["issue URL", "- no voice span — tracks: https://github.com/SebassContreras/lienzo/issues/10", true],
  ["neither", "- no voice span", false],
  ["TODO", "- no voice span — tracks: TODO", false],
  ["two digits", "- no voice span — tracks: Lienzo spec 87", false],
  ["four digits", "- no voice span — tracks: Lienzo spec 0870", false],
  ["lower case", "- no voice span — tracks: lienzo spec 087", false],
  ["issue of another repo", "- no voice span — tracks: https://github.com/SebassContreras/animator/issues/10", false],
  ["text after the suffix", "- no voice span — tracks: Lienzo spec 089 (open)", false],
];

for (const [partition, bullet, expected] of TRACKING_CASES) {
  test(`tracking suffix: ${partition} is ${expected ? "accepted" : "rejected"}`, () => {
    // Act + Assert
    assert.equal(isTracked(bullet), expected);
  });
}

// Parameterized table tests asserting structure and tracking invariants across videos
for (const { slug, path: itemPath } of VIDEOS) {
  test(`${slug} learnings has the four kind sections once and in order`, () => {
    // Arrange / Act
    const headings = sections(itemPath).map((s) => s.heading);
    // Assert
    assert.deepEqual(headings, KINDS);
  });

  test(`every ${slug} engine finding is tracked by a Lienzo issue or spec`, () => {
    // Arrange / Act
    const missing = untracked(itemPath);
    // Assert
    assert.deepEqual(missing, []);
  });
}

test("the template's learnings sections hold no bullets", () => {
  // Arrange / Act
  const bullets = sections(path.join(root, "videos", "_template")).flatMap((s) => s.bullets);
  // Assert
  assert.deepEqual(bullets, []);
});
