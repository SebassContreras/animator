# 002 — shared-lib — Design

## Approach

- D1@1 (implements R1, R2): `lib/` gets one module per responsibility: `primitives.cjs` (rect, ell, path, group, flat), `scene.cjs` (shot, text, fade to black), `environment.cjs` (sea, particles), `objects.cjs` (heart), `motion.cjs` (heartbeat) and `palette.cjs` (palette check). A piece goes in only if both ringana generators use it after the refactor, or it is a primitive (R1@2); the v2-only pieces (rays, seabed, halo, frond, drop, capsule, eye, sparkle, pop, silhouette) stay in `videos/ringana-omega-v2/scene.gen.cjs`, and R1's list names the module each joins once a second video uses it (spec 004).
- D2@1 (implements R2, R5): A piece is shared only when v1 and v2 differ in values, not in structure; differing values become parameters with v1's value as the default, and optional keys are spread conditionally so a key v1 never wrote stays absent from its JSON. Pieces that differ in structure (drop, capsule, sparkle, eye, silhouette) are not forced into one function. _(judgement, no standard)_
- D3@1 (implements R3): Every colour a `lib/` piece draws is a parameter (a hex string); `lib/` holds no hex literal except the fully transparent hit box behind `text` (opacity 0, never drawn). `fadeToBlack` takes its colour too.
- D4@1 (implements R3, R1): `scene.cjs` exports a factory `sceneHelpers({ w, h, duration, palette })` returning `{ shot, text, fadeToBlack }`, because all three need the frame size and duration and `text` needs the palette; `environment`, `objects` and `motion` export plain functions with explicit arguments (frame size, colours, timing). _(standard: dependency injection by closure — https://nodejs.org/api/modules.html#modules-commonjs-modules)_
- D5@1 (implements R4): `palette.json` maps each role to `{ base, shadow?, highlight? }` with `#RRGGBB` values; `lib/palette.cjs` exports a pure `checkPalette(object)` that returns the object or throws an `Error` naming the first bad role, and each generator does `const C = checkPalette(require("./palette.json"))` and reads `C.<role>.<tone>`. Mapping: v1 `sea`/`sea2` → `sea.base`/`sea.highlight`, `algae` → `alga`; v2 `sea0`/`sea`/`sea2` → `sea.shadow`/`.base`/`.highlight`, `<role>Dark`/`<role>Light` → `.shadow`/`.highlight`, `cap*` → `capsule`.
- D6@1 (implements R5): The refactor moves one module at a time and runs the existing golden test (`tests/videos/scenes.test.cjs`, from 001/T009) after each step; the fixtures in `tests/videos/fixtures/` are never regenerated in this spec. _(standard: golden-master / characterization testing — https://en.wikipedia.org/wiki/Characterization_test)_
- D7@1 (implements R6): `primitives.cjs` keeps `flat()` as the single place that sets `gradient: false`, `shadow.enabled: false` and `border.width: 0`; a caller's `fill`/`shadow` overrides still win.
- D8@1 (implements R7): `lib/` and its tests use only Node built-ins (`node:test`, `node:assert/strict`, `fs`, `path`); no `dependencies` or `devDependencies` are added (A9, A10).

## Deliverables

- New: `lib/scene.cjs`, `lib/environment.cjs`, `lib/objects.cjs`, `lib/motion.cjs`, `lib/palette.cjs`.
- New tests: `tests/lib/primitives.test.cjs`, `tests/lib/palette.test.cjs`, `tests/lib/scene.test.cjs` (mirroring `lib/`).
- Changed: `videos/ringana-omega/{palette.json,scene.gen.cjs}`, `videos/ringana-omega-v2/{palette.json,scene.gen.cjs}`.
- Unchanged: `lib/primitives.cjs` (already flat), `tests/videos/scenes.test.cjs` and its fixtures, `videos/viaje/`.

## Sequencing

1. Palette check and tests (T001–T002), then reshape each palette (T003–T004): every later step reads `C.<role>.<tone>`.
2. Primitives flat test (T005) before anything is built on top of them.
3. Modules one at a time, both generators switched in the same task, golden test green after each (T006–T010).
4. Clean-checkout run of the full suite last (T011).

## Trade-offs

- D1 — Pros: `lib/` holds only proven, shared code (A5, A13); no dead abstraction. Cons: the richest pieces (frond, capsule, drop) stay inside one generator, so a third video would copy them. Mitigation: R1's module map tells spec 004 exactly where each goes, and `v2/learnings.md` lists them as promotion candidates.
- D2 — Pros: v1 stays byte-identical without a forest of options. Cons: conditional spreads (`...(amount ? { amount } : {})`) are slightly less obvious than plain keys. Mitigation: one comment per spread naming the video that omits the key; the golden test catches any key-order slip.
- D3 — Pros: R3 holds without exceptions that matter; a theme swap is a palette swap. Cons: call sites get longer (`fadeToBlack("#000000")`). Mitigation: the palette can carry a `shadow`/`ink` role later; for now the literal sits in the video, where colours belong.
- D4 — Pros: frame, duration and palette are injected once, not threaded through ~40 calls; easy to test with a fake palette. Cons: two styles in `lib/` (factory vs plain functions). Mitigation: the rule is stated in each module's header comment — factory only when every function needs the same scene context.
- D5 — Pros: one shape for every video; fail-fast with the role name instead of `undefined` colours in Lienzo; pure function, no file I/O in `lib/`. Cons: renaming keys touches every colour reference in both generators. Mitigation: the golden test proves every rename; v1 has 9 roles and v2 21, small enough for one task each.
- D6 — Pros: any behavioural drift is caught at the step that caused it. Cons: byte equality relies on JSON key order. Mitigation: `JSON.stringify` follows property insertion order for string keys (https://tc39.es/ecma262/#sec-ordinaryownpropertykeys), so building objects in the same order is enough; no fixture is ever regenerated to "fix" a diff.
- D7 — Pros: A12 enforced in one function. Cons: `flat()` spreads the caller's object over defaults, so a caller can silently pass `shadow` without `enabled`. Mitigation: the R6 test covers both the default and an explicit override.
- D8 — Pros: `node --test tests/` runs anywhere Node 24 is installed. Cons: no assertion helpers beyond `node:assert`. Mitigation: `deepStrictEqual`/`throws` cover every planned test.
- Lienzo as vendor (A2, A8): `primitives.cjs` is the anti-corruption layer over Lienzo's compact element schema — the only module that knows its field names and defaults; every other `lib/` module builds on primitives, so a schema change lands in one file.
