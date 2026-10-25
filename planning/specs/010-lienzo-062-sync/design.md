# 010 — lienzo-062-sync — Design

## Approach

- D1@1 (implements R3): Each gotcha is checked with a small probe scene built with `scene_build` (no `save`) and, where it is visual, `scene_preview`, in a scratch project; the probes are not kept in the repo. _(judgement, no standard)_
- D2@1 (implements R1, R2, R4): `lienzo-animate` is rewritten in place: SKILL.md workflow and rules, `compact-format.md` (fields and full tool table), `shots-camera.md` (native shots first, group shots as legacy), `motion.md` (repeat, origin, opacity), `elements.md`, `recipes.md` and `drawing.md` where they use a workaround. _(judgement, no standard)_
- D3@1 (implements R5, A13): `lib/scene.cjs` gets two pure helpers beside the old ones: `nativeShot(id, name, start, end, opts)` returns a `shots` entry, and `sceneHelpers` returns `label(id, name, str, y, size, a, b, extra)`, a `text` element with `w` = frame width and `align: "center"`. Old helpers are untouched, so the golden test still holds. _(judgement, no standard)_
- D4@1 (implements R6): The template generator writes `defaults: "flat"` and a `shots` array, binds elements with `shot`, and uses the new helpers. _(judgement, no standard)_
- D5@1 (implements R7): The other three skills are grepped for every removed limit (camera, opacity, loops, text centring, morph-only paths) and reworded. _(judgement, no standard)_

## Deliverables

- Changed: `skills/lienzo-*/**`, `lib/scene.cjs`, `tests/lib/scene.test.cjs`, `videos/_template/scene.gen.cjs`, `tests/videos/template.test.cjs` if it pins the old shape.

## Sequencing

1. Probes (T001) first: the docs state only what the probes confirmed.
2. Then `lienzo-animate` docs (T002–T004), lib (T005), template (T006), other skills (T007).

## Trade-offs

- D3. Pros: no video changes and two ways to make shots during the transition. Cons: `lib/` holds old and new helpers side by side. Mitigation: the skill marks the old ones legacy (used by ringana-omega-v2 only).
- D1. Pros: docs match the engine, not its specs. Cons: probes are not kept. Mitigation: each confirmed fact is written in the gotcha row or reference itself.
