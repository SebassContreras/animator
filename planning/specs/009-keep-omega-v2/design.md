# 009 — keep-omega-v2 — Design

## Approach

- D1@1 (implements R1): Delete both folders and `tests/videos/fixtures/{viaje,ringana-omega}.scene.json`; drop their tests from `tests/videos/scenes.test.cjs` and `tests/videos/learnings.test.cjs`, keeping the ringana-omega-v2 ones. _(judgement, no standard)_
- D2@1 (implements R2): Remove the five pieces from `lib/objects.cjs`, `lib/environment.cjs` and `lib/scene.cjs` (with the private `wheel`); delete the objects and environment lib tests, drop the `nameAll` test; the lib-list test (008/D2) keeps the skill list in step. _(judgement, no standard)_
- D3@1 (implements R3): The README example list and regenerate command, the storyboard skill's example brief, `planning/product.md` and the `lib/primitives.cjs` header point to ringana-omega-v2 only. A14's "why" stays: it records why the rule was made. _(judgement, no standard)_
- D4@1 (implements R1, R3): `research.md` moves from the removed v1 folder into `videos/ringana-omega-v2/`, and v2's brief is inlined so it no longer cites v1; v2's learnings, generator header and the `recipes.md` "Tested in" line point to the v2 path. _(judgement, no standard)_

## Deliverables

- Removed: `videos/viaje/`, `videos/ringana-omega/`, two fixtures, two lib tests.
- Moved: `videos/ringana-omega/research.md` → `videos/ringana-omega-v2/research.md`.
- Changed: `lib/objects.cjs`, `lib/environment.cjs`, `lib/scene.cjs`, `lib/primitives.cjs`, tests, `README.md`, `planning/product.md`, `skills/lienzo-animate/SKILL.md`, `skills/lienzo-storyboard/SKILL.md`, `skills/lienzo-animate/references/recipes.md`, `videos/ringana-omega-v2/{brief,learnings}.md`, `videos/ringana-omega-v2/scene.gen.cjs`.

## Sequencing

1. Videos first (T001): after it, the five pieces have no consumer.
2. Then the pieces (T002), then the docs (T003).
3. Last, v2 stops citing v1 (T004).

## Trade-offs

- D1/D2. Pros: one reference video and no dead code. Cons: proven pieces (car, house, road) are lost. Mitigation: they stay in git history and in `.spectrace/changes/005-*.patch`.
- D3. Pros: docs describe the repo as it is. Cons: a reader of an old spec or A14 meets names that no longer exist. Mitigation: specs 001–008 and A14 are marked as history (out of scope), and `trace check` lists every mention of a deleted path as pending.
- D4. Pros: v2 is self-contained; deleting v1 breaks no link. Cons: the inlined brief is longer and duplicates what v1 said. Mitigation: v1 is gone, so there is only one copy left; the test suite still regenerates v2 byte-identical.
