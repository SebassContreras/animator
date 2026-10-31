// Every lib/ export is named in the lienzo-animate "Start from lib/" list, so agents reuse it (008/R2).
// One table over every lib/*.cjs, so a new module is guarded without a new test (011/D10).
const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.join(__dirname, "../..");
const SKILL = fs.readFileSync(path.join(ROOT, "skills/lienzo-animate/SKILL.md"), "utf8");
const SECTION = SKILL.split("### Start from lib/")[1].split(/\r?\n##/)[0];
const MODULES = fs.readdirSync(path.join(ROOT, "lib")).filter((f) => f.endsWith(".cjs")).map((f) => f.slice(0, -4));

// exports of lib/<module>.cjs not named in backticks (`name` or `name(`) in the section
const missing = (module) => Object.keys(require(path.join(ROOT, "lib", module + ".cjs")))
  .filter((name) => !SECTION.includes("`" + name + "`") && !SECTION.includes("`" + name + "("));

for (const module of MODULES) {
  test(`every ${module} export is listed in Start from lib/`, () => {
    // Act + Assert
    assert.deepEqual(missing(module), []);
  });
}
