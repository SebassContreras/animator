# 008 — lib-discoverability — Design

## Approach

- D1@1 (implements R1): The section keeps its shape, one bullet per module (`lib/<module>.cjs` — `name(args)`: what it is), and adds the promoted pieces: `car` and `house` (objects), `cloud` and `dashes` (environment), `nameAll` (scene) and `countUp` (motion). Each bullet names the colour argument (`colors = { … }` or `color`), because A11 means the caller always passes it. _(judgement, no standard)_
- D2@1 (implements R2): `tests/skills/lib-list.test.cjs` reads each `lib/` module's exports with `require` and reads the text of the "Start from lib/" section. It asserts that the list of exports missing from that text is empty. There is one test per module (six tests), none with a loop or branch; a shared helper, `missing(module)`, does the filtering. A name counts only when it appears in backticks (`` `name` `` or `` `name(``), the format every bullet uses. _(standard: `node:test` — https://nodejs.org/api/test.html)_
- D3@1 (implements R2): Close-out (step 8) and the promotion specs need no new rule. The suite fails as soon as a promoted export is not listed, so whoever adds a piece to `lib/` adds its line in the same task. _(judgement, no standard)_

## Deliverables

- Changed: `skills/lienzo-animate/SKILL.md`.
- New test: `tests/skills/lib-list.test.cjs`.

## Sequencing

1. The test comes first (T001). It fails today on the six unlisted exports, which proves it can fail.
2. Update the section (T002), and the test goes green.

## Trade-offs

- D1. Pros: one glance shows every reusable piece and what to pass it. Cons: a hand-written line can describe a piece wrongly. Mitigation: each line is short, and a wrong signature fails the first time a generator uses it.
- D2. Pros: the drift that just happened (six pieces promoted, none listed) can no longer happen silently. Cons: a name that happens to appear elsewhere in the section passes the check. Mitigation: only backticked names count, which matches the bullet format.
- D3. Pros: no extra step to forget. Cons: the failure appears only when the tests run. Mitigation: `pnpm test` runs at session end (AGENTS.md → Testing).
