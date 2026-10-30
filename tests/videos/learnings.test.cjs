// Learnings format: the video's learnings.md has the four kind sections and links every engine finding (004/R1, 004/R5).
const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.join(__dirname, "..", "..");
const KINDS = ["Piece", "Rule", "Engine", "Local"];
const TRACKED = /— tracks: https:\/\/github\.com\/[^/\s]+\/lienzo\/issues\/\d+$/;

// Registered active video workspaces subject to learnings format invariants
const VIDEOS = fs.readdirSync(path.join(root, "videos"), { withFileTypes: true })
  .filter((entry) => entry.isDirectory() && !entry.name.startsWith("_"))
  .map((entry) => entry.name);

// Splits learnings.md into its `## ` sections: [{ heading, bullets }] in file order.
const sections = (slug) => fs.readFileSync(path.join(root, "videos", slug, "learnings.md"), "utf8")
  .split(/\r?\n(?=## )/).slice(1)
  .map((block) => {
    const [heading, ...lines] = block.split(/\r?\n/);
    return { heading: heading.slice(3).trim(), bullets: lines.filter((l) => l.startsWith("- ")) };
  });

const untracked = (slug) => {
  const engineSection = sections(slug).find((s) => s.heading === "Engine");
  if (!engineSection) return [];
  return engineSection.bullets.filter((b) => !TRACKED.test(b));
};

// Parameterized table tests asserting structure and tracking invariants across videos
for (const slug of VIDEOS) {
  test(`${slug} learnings has the four kind sections once and in order`, () => {
    // Arrange / Act
    const headings = sections(slug).map((s) => s.heading);
    // Assert
    assert.deepEqual(headings, KINDS);
  });

  test(`every ${slug} engine finding links the Lienzo issue that tracks it`, () => {
    // Arrange / Act
    const missing = untracked(slug);
    // Assert
    assert.deepEqual(missing, []);
  });
}
