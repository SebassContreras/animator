# 015 — promote-pulse-and-botanica-learnings

## Goal
Promote proven components, fixes and rules from `pulse-speed`, `pulse-chaos` and `botanica-fresh` into `lib/` and agent skills. Verification: `pnpm test` passes (including `tests/skills/lib-list.test.cjs` and new unit tests); `lib/` exports `metricCard`, `radialLayout`, prefix-aware `teardrop`, and color-override `label`; each promoted finding in the video `learnings.md` files ends with `— promoted: <path>`.

## Context
- Close-out of `pulse-speed`, `pulse-chaos` (brand `pulse-metrics`), and `botanica-fresh` (brand `botanica-lab`), approved 2026-11-02.
- The `stat card` left out of scope in Spec 013 (which required 2+ consumers per `ENGINEERING.md § KISS`) now has its second concrete consumer in `pulse-speed`. It is promoted as `metricCard`.
- `teardrop` (promoted in 013 as a symbol definition) caused duplicate ID fatal errors when instantiated multiple times directly as element groups in `botanica-fresh`. Adding optional prefixing solves this while preserving backwards compatibility.
- `label` in `lib/scene.cjs` hardcoded `palette.text.base`, preventing colored text labels in `pulse-speed`.
- `pulse-chaos` proved radial network graph generation combining `(cos, sin)` node layout with dynamic `line` connectors (`from`/`to` target bindings).
- `skills/lienzo-animate` was missing explicit rules regarding Lienzo's dead keyframe easing check (Lienzo Spec 065/R4) and dynamic `line` connector semantics.

### Who it serves
Future video storyboards and generators requiring tech metrics, network architectures, custom-colored labels, and multi-symbol scene graphs without ID collisions.

### Out of scope
- Full dynamic graph rendering widget (`radialLayout` provides coordinate distribution only; node rendering and Lienzo native `line` connections remain in generator space).
- Re-exporting or re-rendering existing videos in Lienzo.

### Dependencies
- 014 (brand hierarchy and git ignore), 013 (first object promotions to `lib/objects.cjs`).

### Owner split
Agent tasks.

## Requirements
- R1: `lib/scene.cjs` `label` accepts `extra.color` (falling back to `palette.text.base`). Finding: Rule "label extra.color" in `pulse-speed`. Partitions: `extra.color` specified as custom hex string, `extra.color` undefined in options, `extra` omitted entirely. Invariant: when `extra.color` is omitted or undefined, returned text element has `color: palette.text.base` byte-identical to previous behavior.
- R2: `lib/objects.cjs` `teardrop(tones, prefix = "")` prefixes each child element's `id` with `prefix` (`${prefix}shade`, `${prefix}core`, `${prefix}shine`). Finding: Piece `teardrop symbol prefixing` in `botanica-fresh`. Partitions: `prefix` omitted / empty string `""` vs non-empty prefix string (e.g. `"drop1_"`). Invariant: when `prefix` is omitted or empty, child IDs remain `"shade"`, `"core"`, `"shine"`, keeping existing symbol definitions byte-identical; when `prefix` is supplied, non-colliding IDs prevent fatal duplicate ID errors across multiple instances.
- R3: `lib/objects.cjs` exports `metricCard({ id, x, y, w, h, title, from, to, prefix, suffix, color, borderGlow, extra? })`: a tech metric card combining a rounded rect background (`radius: 32`), border, optional glow, and an embedded `counter` + title. Finding: Piece in `pulse-speed` (2nd consumer fulfilling 013/Out of scope). Partitions: nominal options, optional `prefix`/`suffix` (specified vs omitted), `borderGlow` (enabled vs omitted), `extra` options passthrough. Invariant: returns a `group` element with background rect (`radius: 32`), title text, and embedded counter element preserving counter range.
- R4: `lib/objects.cjs` exports `radialLayout({ cx, cy, radius, count, startAngle = 0 })` returning an array of `{ x, y, angle }` coordinates for distributing $N$ nodes evenly on a circle. Finding: Piece in `pulse-chaos`. Partitions: `count = 0` (empty array), `count = 1` (single node at `startAngle`), `count > 1` (symmetrically spaced nodes), `startAngle` specified vs default 0, `radius = 0` vs positive radius. Invariant: array length strictly equals `count`; returned points satisfy $x = cx + \text{radius} \cdot \cos(a)$ and $y = cy + \text{radius} \cdot \sin(a)$; angular spacing between consecutive nodes is $(2\pi)/\text{count}$.
- R5: `skills/lienzo-animate/references/gotchas.md` and `references/motion.md` document that keyframe tracks must omit easing on their trailing keyframe (or use `"auto"`/`"linear"`) because Lienzo explicitly warns that easings only interpolate towards a subsequent keyframe. Finding: Rule in `pulse-speed`.
- R6: `skills/lienzo-animate/references/elements.md` documents dynamic `line` connectors using `from: "<source-id>"` and `to: "<target-id>"` and global scene ID uniqueness. Findings: Rules in `pulse-chaos` and `botanica-fresh`.
- R7: `skills/lienzo-animate/SKILL.md` ("Start from lib/") lists `metricCard` and `radialLayout`. `tests/skills/lib-list.test.cjs` passes. Invariant: every export in `lib/objects.cjs` is listed under `### Start from lib/`.

## Design
- D1 (R1): In `lib/scene.cjs`, `label()` sets `color: extra.color || palette.text.base` (comment cites `(015/D1)`).
- D2 (R2): In `lib/objects.cjs`, `teardrop(tones, prefix = "")` sets `id: `${prefix}${name}`` for `shade`, `core`, `shine` (comment cites `(015/D2)`).
- D3 (R3): In `lib/objects.cjs`, `metricCard` builds a `group` containing a flat `rect` (with `radius: 32`, border, optional `borderGlow`), a top title `text`, and a centered `counter` element (comment cites `(015/D3)`).
- D4 (R4): In `lib/objects.cjs`, `radialLayout` calculates points around `(cx, cy)` using trigonometry `cx + radius * Math.cos(a)`, `cy + radius * Math.sin(a)` with angles evenly spaced by `(2 * Math.PI) / count` starting at `startAngle` (comment cites `(015/D4)`).
- D5 (R5, R6): Text additions to skills references (`gotchas.md`, `motion.md`, `elements.md`) documenting trailing keyframe easing constraints and dynamic `line` connector syntax.
  _(Sources: Lienzo Spec 065 / `lienzo/src/core/interpolate.ts` for dead keyframe check; Lienzo Spec 044 / `lienzo/src/components/line/descriptor.ts` for dynamic line binding)_
- D6 (R7): Update `skills/lienzo-animate/SKILL.md` under `### Start from lib/` to list `metricCard` and `radialLayout`, guarded by `tests/skills/lib-list.test.cjs`.
- D7 (all): Append `— promoted: <path>` to the confirmed findings in `videos/pulse-metrics/speed/learnings.md`, `videos/pulse-metrics/chaos/learnings.md`, and `videos/botanica-lab/fresh/learnings.md` (004/R1).

### Trade-offs & Mitigations
- D1. Pros: allows high-contrast accent-colored labels in dark/glow visual styles. Cons: color override could cause palette drift if callers pass raw hexes. Mitigation: generators must pass tones from `palette` (e.g. `C.accent.base`), maintaining brand adherence.
- D2. Pros: eliminates duplicate ID collision fatal errors when embedding multiple teardrop groups. Cons: caller manages prefix naming manually. Mitigation: default `prefix = ""` preserves 100% byte-compatibility with existing Spec 013 symbol definitions.
- D3. Pros: encapsulates recurring tech metric card pattern across multiple consumers (`pulse-speed`, `ringana-skin-perfection`). Cons: fixed card geometry (`radius: 32`). Mitigation: `extra` parameter enables merging custom styles, shadows, and animation tracks.
- D4. Pros: pure mathematical layout utility with zero engine coupling; clean separation between node geometry and scene element rendering. Cons: caller must map points to elements and connect lines. Mitigation: pure coordinate output adheres to SRP and maximizes styling flexibility.

## Tasks
- [x] 015/T001 [agent] `lib/scene.cjs` `label` accepts `extra.color` (D1, comment `(015/D1)`); table test in `tests/lib/scene.test.cjs` covering partitions (`extra.color` specified, `extra.color` undefined in options, `extra` omitted) asserting invariant fallback to `palette.text.base`; `node --test tests/lib/scene.test.cjs` — covers R1, D1
  - verified: `node --test tests/lib/scene.test.cjs` passes 9/9 tests including all 3 color partition table cases
- [x] 015/T002 [agent] `lib/objects.cjs` `teardrop(tones, prefix = "")` (D2, comment `(015/D2)`); table test in `tests/lib/objects.test.cjs` covering partitions (`prefix` omitted, `prefix: ""`, `prefix: "drop1_"`) asserting child IDs prefixing and equivalence class for avoiding duplicate ID collisions across instances; `node --test tests/lib/objects.test.cjs` — covers R2, D2
  - verified: `node --test tests/lib/objects.test.cjs` passes 8/8 tests asserting prefix formatting and distinct ID set size
- [x] 015/T003 [agent] `lib/objects.cjs` exports `metricCard` (D3, comment `(015/D3)`); table test in `tests/lib/objects.test.cjs` over nominal inputs, optional `prefix`/`suffix`, `borderGlow` boolean/object, and `extra` passthrough, asserting group descriptor structure and counter bounds; `node --test tests/lib/objects.test.cjs` — covers R3, D3
  - verified: `node --test tests/lib/objects.test.cjs` passes 11/11 tests asserting group structure, radius: 32, and counter properties
- [x] 015/T004 [agent] `lib/objects.cjs` exports `radialLayout` (D4, comment `(015/D4)`); table test in `tests/lib/objects.test.cjs` covering partitions (`count: 0`, `count: 1`, `count: 5`, specified `startAngle` vs default 0) asserting array length, trigonometry invariant $(cx + r\cos(a), cy + r\sin(a))$, and angular spacing; `node --test tests/lib/objects.test.cjs` — covers R4, D4
  - verified: `node --test tests/lib/objects.test.cjs` passes 16/16 tests asserting count, angles, and coordinate trigonometry
- [x] 015/T005 [agent] `skills/lienzo-animate/SKILL.md` under "Start from lib/": list `metricCard` and `radialLayout`; `node --test tests/skills/lib-list.test.cjs` — covers R7, D6
  - verified: `node --test tests/skills/lib-list.test.cjs` passes 7/7 module checks
- [x] 015/T006 [agent] `skills/lienzo-animate/references/gotchas.md` and `references/motion.md`: document trailing keyframe easing rule and Lienzo dead easing check — covers R5, D5
  - verified: inspected gotchas.md table and motion.md tracks section documenting dead trailing easing rule
- [x] 015/T007 [agent] `skills/lienzo-animate/references/elements.md`: document dynamic `line` connectors (`from`/`to` target bindings) and scene-wide ID uniqueness constraint — covers R6, D5
  - verified: inspected elements.md dynamic line entry and Global ID uniqueness section
- [x] 015/T008 [agent] Mark promoted findings: append `— promoted: <path>` to confirmed findings in `videos/pulse-metrics/speed/learnings.md`, `videos/pulse-metrics/chaos/learnings.md`, and `videos/botanica-lab/fresh/learnings.md` — covers D7
  - verified: confirmed all promoted findings end with — promoted: <path> across speed, chaos, and fresh learnings.md
- [x] 015/T009 [agent] Verify: full test suite passes with `pnpm test` across all unit, video, and skill guard tests — covers R1–R7
  - verified: `pnpm test` ran 145 tests across all suites with 145 passing and 0 failures
