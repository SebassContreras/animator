# 009 — keep-omega-v2 — Design

## Approach

- D1@1 (implements R1): Delete both folders and `tests/videos/fixtures/{viaje,ringana-omega}.scene.json`; drop their tests from `tests/videos/scenes.test.cjs` and `tests/videos/learnings.test.cjs`, keeping the ringana-omega-v2 ones. _(judgement, no standard)_
- D2@1 (implements R2): Remove the five pieces from `lib/objects.cjs`, `lib/environment.cjs` and `lib/scene.cjs` (with the private `wheel`); delete `tests/lib/objects.test.cjs` and `tests/lib/environment.test.cjs`, drop the `nameAll` test; the lib-list test (008/D2) keeps the skill list in step. _(judgement, no standard)_
- D3@1 (implements R3): The README example list and regenerate command, the storyboard skill's example brief, `planning/product.md` and the `lib/primitives.cjs` header point to ringana-omega-v2 only. A14's "why" stays: it records why the rule was made. _(judgement, no standard)_

## Deliverables

- Removed: `videos/viaje/`, `videos/ringana-omega/`, two fixtures, two lib tests.
- Changed: `lib/objects.cjs`, `lib/environment.cjs`, `lib/scene.cjs`, `lib/primitives.cjs`, tests, `README.md`, `planning/product.md`, `skills/lienzo-animate/SKILL.md`, `skills/lienzo-storyboard/SKILL.md`.

## Sequencing

1. Videos first (T001): after it, the five pieces have no consumer.
2. Then the pieces (T002), then the docs (T003).

## Trade-offs

- D1/D2. Pros: one reference video and no dead code. Cons: proven pieces (car, house, road) are lost. Mitigation: they stay in git history and in `.spectrace/changes/005-*.patch`.
