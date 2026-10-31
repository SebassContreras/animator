# 014 — skill-drift-after-011

## Goal
The skills agree with spec 011 everywhere: briefs hold no hex values, audio belongs to the Lienzo
scene, and the brand's fonts replace a style's type. Verification: a search of `skills/` finds no
instruction to write hex values into a brief, to copy `audioTracks` by hand, or to put
`audioTracks` in a generator's compact scene.

## Context
- Found in the repo review of 2026-10-31 (roadmap → Ideas, "Fix skill drift after spec 011").
- 011 moved the brand into Lienzo (`brand.lock.json`), left `palette.json` with overrides and
  story roles only, and made audio the Lienzo scene's (`scene_generate_speech`, `scene_update`).

## Requirements
- R1: `lienzo-storyboard` SKILL.md step 3 asks `lienzo-art-direction` for overrides and story roles
  by role name, not for "4–6 hex colours"; hex values live only in `palette.json` and the brand.
- R2: `lienzo-art-direction` → "Verified example" step 3 no longer tells the builder to copy
  `audioTracks` from v1: the voice of a new scene is made with `scene_generate_speech`
  (`asTrack`, `startOffset`), or its tracks are set with `scene_update`.
- R3: `lienzo-animate/references/compact-format.md` shows no `audioTracks` in the example a
  generator copies, and says the scene's audio is set in Lienzo, never by a generator (011).
- R4: `lienzo-art-direction/references/styles.md` says the brand's fonts replace a style's
  suggested type (as in `ringana-omega-v2` and `ringana-skin-perfection`, both Montserrat).

### Who it serves
The agents that follow the skills: one rule per topic, no contradictions to resolve mid-build.

### Out of scope
- Rewriting the omega-v2 brief or its generator.

### Dependencies
- 011.

### Owner split
Agent tasks.

## Design
### Approach
- D1 (R1–R4): text edits in the four files; each new sentence points to the rule's home
  (`DESIGN.md` → Brand inheritance for colours and fonts, `lienzo-animate` step 3 for audio).
- D2 (R1–R4): a `Verify:` task searches `skills/` for `hex colours`, `copy \`audioTracks\`` and
  `"audioTracks"` in compact examples, and records what is left and why.

### Trade-offs
- D1. Pros: no new rules, only removed contradictions. Cons: none beyond the edit. Mitigation: —

## Tasks
- [ ] 014/T001 [agent] `skills/lienzo-storyboard/SKILL.md` step 3: overrides and story roles by role name (R1) — covers R1, D1
- [ ] 014/T002 [agent] `skills/lienzo-art-direction/SKILL.md` → "Verified example" step 3: voice by `scene_generate_speech` / `scene_update`, not a hand copy (R2) — covers R2, D1
- [ ] 014/T003 [agent] `skills/lienzo-animate/references/compact-format.md`: drop `audioTracks` from the example, say audio is set in Lienzo (R3) — covers R3, D1
- [ ] 014/T004 [agent] `skills/lienzo-art-direction/references/styles.md`: brand fonts replace a style's type (R4) — covers R4, D1
- [ ] 014/T005 [agent] Verify: search `skills/` as D2 says; record `verified:` under the task — covers R1–R4, D2
