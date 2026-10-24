# 006 — promote-ringana-omega — Design

## Approach

- D1@1 (implements R1): `countUp(steps)` returns `{ "label.text": steps }`, a track object the caller spreads into `tracks`. Both ringana generators write the same literal today (two uses, so A5 allows it); the existing golden tests prove the output stays byte-identical. _(judgement, no standard)_
- D2@1 (implements R2, R3, R4, R5, R6): Each rule goes into the file and section where an agent already looks for that kind of rule: research tactics in `sources.md` → "Search tactics", claims in `claims.md` → "Unsafe simplifications", build traps as rows in the `gotchas.md` table, text size in `craft.md` → "Text on screen", and a new `craft.md` → "Voice-over" section. One line per rule, numbers kept. _(judgement, no standard)_
- D3@1 (implements R3): The claims rule names Regulation (EU) No 432/2012 and links the EU register of health claims as its source. _(standard: EU Register of nutrition and health claims — https://food.ec.europa.eu/food-safety/labelling-and-nutrition/nutrition-and-health-claims/eu-register-health-claims_en)_

## Deliverables

- Changed: `lib/motion.cjs`, `videos/ringana-omega/scene.gen.cjs`, `videos/ringana-omega-v2/scene.gen.cjs`, `skills/lienzo-research/references/{sources,claims}.md`, `skills/lienzo-animate/references/gotchas.md`, `skills/lienzo-storyboard/references/craft.md`, `videos/ringana-omega/learnings.md`.

## Sequencing

1. `countUp` (T001) with the golden tests green; then its unit test (T002).
2. Skill rules (T003–T006) in any order.
3. `— promoted:` marks last (T007).

## Trade-offs

- D1. Pros: the count-up becomes a named intent instead of a raw track. Cons: a very thin helper. Mitigation: it has two real uses and is the place to later add number formatting, nothing more now (A5).
- D2. Pros: no new reference files; rules land where the skill already sends the agent. Cons: `craft.md` grows. Mitigation: the voice-over section is short (four lines).
- D3. Pros: the rule cites the legal source, not a blog. Cons: the register's URL can move. Mitigation: the regulation number is named too, which is stable.
