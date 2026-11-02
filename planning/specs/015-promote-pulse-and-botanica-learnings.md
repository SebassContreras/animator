# 015 — promote-pulse-and-botanica-learnings

## Goal
Promote proven components, fixes and rules from `pulse-speed`, `pulse-chaos` and `botanica-fresh` into `lib/` and agent skills. Verification: `pnpm test` passes (including `tests/skills/lib-list.test.cjs` and new unit tests); `lib/` exports `metricCard`, `radialLayout`, prefix-aware `teardrop`, and color-override `label`; each promoted finding in the video `learnings.md` files ends with `— promoted: <path>`.

## Context
- Close-out of `pulse-speed`, `pulse-chaos` (brand `pulse-metrics`), and `botanica-fresh` (brand `botanica-lab`), approved 2026-11-02.
- The `stat card` left out of scope in Spec 013 (which required 2+ consumers per `ENGINEERING.md § KISS`) now has its second concrete consumer in `pulse-speed`. It is promoted as `metricCard`.
- `teardrop` (promoted in 013 as a symbol definition) caused duplicate ID fatal errors when instantiated multiple times directly as element groups in `botanica-fresh`. Adding optional prefixing solves this while preserving backwards compatibility.
- `label` in `lib/scene.cjs` hardcoded `palette.text.base`, preventing colored text labels in `pulse-speed` and `pulse-chaos`.
- `pulse-chaos` proved radial network graph generation combining `(cos, sin)` node layout with dynamic `line` connectors (`from`/`to` target bindings).
- `skills/lienzo-animate` was missing explicit rules regarding Lienzo's dead keyframe easing check (Lienzo Spec 065/R4) and dynamic `line` connector semantics.

## Requirements
- R1: `lib/scene.cjs` `label` accepts `extra.color` (falling back to `palette.text.base`). Findings: Rule in `pulse-speed` and `pulse-chaos`.
  - Invariant: when `extra.color` is omitted, the returned text element has `color: palette.text.base` byte-identical to previous behavior.
- R2: `lib/objects.cjs` `teardrop(tones, prefix = "")` prefixes each child element's `id` with `prefix` (`${prefix}shade`, `${prefix}core`, `${prefix}shine`). Finding: Piece `teardrop symbol prefixing` in `botanica-fresh`.
  - Invariant: when `prefix` is omitted or empty, child IDs remain `"shade"`, `"core"`, `"shine"`, keeping existing symbol definitions byte-identical.
- R3: `lib/objects.cjs` exports `metricCard({ id, x, y, w, h, title, from, to, prefix, suffix, color, borderGlow, extra? })`: a tech metric card combining a rounded rect background (`radius: 32`), border, optional glow, and an embedded `counter` + title. Finding: Piece in `pulse-speed` (2nd consumer fulfilling 013/Out of scope).
- R4: `lib/objects.cjs` exports `radialLayout({ cx, cy, radius, count, startAngle? })` returning an array of `{ x, y, angle }` coordinates for distributing $N$ nodes evenly on a circle, plus dynamic `line` connector descriptors. Finding: Piece in `pulse-chaos`.
- R5: `skills/lienzo-animate/references/gotchas.md` and `references/motion.md` document that keyframe tracks must omit easing on their trailing keyframe (or use `"auto"`/`"linear"`) because Lienzo explicitly warns that easings only interpolate towards a subsequent keyframe (Lienzo Spec 065). Finding: Rule in `pulse-speed`.
- R6: `skills/lienzo-animate/references/elements.md` documents dynamic `line` connectors using `from: "<source-id>"` and `to: "<target-id>"` and global scene ID uniqueness. Findings: Rules in `pulse-chaos` and `botanica-fresh`.
- R7: `skills/lienzo-animate/SKILL.md` ("Start from lib/") lists `metricCard` and `radialLayout`. `tests/skills/lib-list.test.cjs` passes.

## Design
- D1 (R1): In `lib/scene.cjs`, `color: extra.color ?? palette.text.base`.
- D2 (R2): In `lib/objects.cjs`, `teardrop(tones, prefix = "")` sets `id: `${prefix}${name}`` for `shade`, `core`, `shine`.
- D3 (R3): In `lib/objects.cjs`, `metricCard` builds a `group` containing a flat `rect` (with `radius: 32`, border, optional `borderGlow`), a top title `text`, and a centered `counter` element.
- D4 (R4): In `lib/objects.cjs`, `radialLayout` calculates points around `(cx, cy)` using trigonometry `cx + radius * Math.cos(a)`, `cy + radius * Math.sin(a)` with angles evenly spaced by `(2 * Math.PI) / count`.
- D5 (R5, R6): Text additions to skills references (`gotchas.md`, `motion.md`, `elements.md`).
- D6 (all): Append `— promoted: <path>` to the confirmed findings in `videos/pulse-metrics/speed/learnings.md`, `videos/pulse-metrics/chaos/learnings.md`, and `videos/botanica-lab/fresh/learnings.md`.

## Tasks
- [ ] 015/T001 [agent] Update `lib/scene.cjs` to support `extra.color` in `label()` and add test in `tests/lib/scene.test.cjs` — covers R1, D1
- [ ] 015/T002 [agent] Update `lib/objects.cjs` `teardrop` to accept `prefix` and add test in `tests/lib/objects.test.cjs` — covers R2, D2
- [ ] 015/T003 [agent] Export `metricCard` in `lib/objects.cjs` and add unit test in `tests/lib/objects.test.cjs` — covers R3, D3
- [ ] 015/T004 [agent] Export `radialLayout` in `lib/objects.cjs` and add unit test in `tests/lib/objects.test.cjs` — covers R4, D4
- [ ] 015/T005 [agent] Update `skills/lienzo-animate/SKILL.md` (Start from lib/) and references (`gotchas.md`, `motion.md`, `elements.md`) — covers R5, R6, R7, D5
- [ ] 015/T006 [agent] Verify full test suite passes with `pnpm test` and mark findings promoted in video `learnings.md` files — covers R1–R7, D6
