# 005 — promote-viaje — Design

## Approach

- D1@2 (implements R6): A golden test for `viaje`, written before any move, pins today's `scene.json` as `tests/videos/fixtures/viaje.scene.json` and compares the parsed JSON with `assert.deepEqual`, not the bytes. `lib/primitives.cjs` writes `fill` after the caller's extra keys while viaje's local copies wrote it before, and JSON key order has no meaning for Lienzo. _(standard: golden-file testing, as in `tests/videos/scenes.test.cjs`)_
- D2@1 (implements R1, R2, R3, R4): Each piece moves as it is, with today's hexes turned into parameters: `car(id, x, y, colors, { spin, ...extra })` with `colors = { body, glass, light, tyre, rim, spokes }`; `house(id, x, y, w, h, colors, litAt)` with `colors = { wall, roof, window, lit, door }`; `cloud(id, x, y, s, dx, color, period)`; `dashes(id, y, period, { width, color })`. Built on `lib/primitives.cjs`, so they stay flat (A12). No default colours, so no hex lives in `lib/` (A11). _(judgement, no standard)_
- D3@1 (implements R5): `nameAll` takes the id map and the part map as arguments instead of reading viaje's constants, and it mutates in place like today. The Spanish names stay in viaje's generator as data. _(judgement, no standard)_
- D4@1 (implements R1, R2, R3, R4, R5): One test per piece's observable rule, in `tests/lib/objects.test.cjs`, `tests/lib/environment.test.cjs` and `tests/lib/scene.test.cjs`: car wheels spin for the whole `spin` length; the house windows switch to `lit` at `litAt`; the dashes track period equals the `period` given; `nameAll` names a child "<parent> · <part>". The colour pass-through is covered by the golden test (D1), not repeated. _(standard: `node:test` — https://nodejs.org/api/test.html)_

## Deliverables

- Changed: `lib/objects.cjs`, `lib/environment.cjs`, `lib/scene.cjs`, `videos/viaje/scene.gen.cjs`, `videos/viaje/learnings.md`, `tests/videos/scenes.test.cjs`, `tests/lib/*.test.cjs`.
- New: `tests/videos/fixtures/viaje.scene.json`.

## Sequencing

1. Golden test first (T001), green on today's generator.
2. Move the pieces (T002–T004), keeping the golden test green after each one.
3. Unit tests (T005), then the `— promoted:` marks (T006).

## Trade-offs

- D1. Pros: proves the move changes nothing on screen, without copying viaje's old primitives into `lib/` just to keep key order. Cons: any later intended change to viaje needs a fixture refresh. Mitigation: refresh the fixture in the same task that changes viaje, as the ringana tests do.
- D2. Pros: the code is already proven in an approved video, and the move is mechanical. Cons: today only viaje uses these pieces, so A5's "2+ uses" is not met yet. Mitigation: no new abstraction is added, only the hexes become parameters (A11 demands that), and A13 says a proven piece belongs in `lib/`.
- D3. Pros: the helper serves any language and video. Cons: callers write two maps. Mitigation: the maps are plain data, which viaje already has.
- D4. Pros: each test checks one rule that once broke a real video. Cons: four test tasks' worth of files. Mitigation: one task writes them all, within the 3× tripwire (7 R items).
