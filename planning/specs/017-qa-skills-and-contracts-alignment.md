# 017 — qa-skills-and-contracts-alignment

## Goal
Align all Animator skills (`skills/lienzo-animate`, `skills/lienzo-storyboard`, `skills/lienzo-art-direction`), root contracts (`AGENTS.md`, `DESIGN.md`, `CHANGES.md`), and QA video `learnings.md` files with the verified findings of the 2026-11-02 end-to-end QA audit (`qa/findings.md`: `F-01`, `F-09`, `F-21`, `F-22`, `F-23`, `F-24`, `F-25`, plus engine tracking `092`–`095`). Verification: `pnpm test` passes (including `tests/videos/learnings.test.cjs` and `tests/skills/lib-list.test.cjs`), and every `Piece`, `Rule`, and `Engine` finding in `videos/qa-test/*/learnings.md` carries its `— promoted: <path>` or `— tracks: Lienzo spec <NNN>` suffix.

## Context
- Source audit: [qa/findings.md](../../qa/findings.md) (`2026-11-02`, `animator` commit `32085f6` against `lienzo` commit `7b7b45c`).
- **Origin classification against prior specs (`004`–`015` and Lienzo `075`–`090`):**
  - `F-01` & `F-24` (**Regression in `014/D2` & gap between `011/D1`, Lienzo `086/R2` & `014/R2`** — `skills/lienzo-storyboard/SKILL.md:15,19-21`): Step `0a` (`SKILL.md:15`) copies `videos/_template/brand.lock.json` into `videos/<brand>/<video>/`, shadowing `../brand.lock.json`. Step `1` (`SKILL.md:19-21`) writes `brand.lock.json` without checking `inspect.notices` (added in Lienzo `086/R2`) for uninstalled brand fonts/weights (`qa/evidence/brand-fonts-notices.json`) and leaves the relation between `brand.lock.json` (`lock.guide`, `011/D1`) and `videos/<brand>/brand.md` (`014/R2`) implicit.
  - `F-09` (**New documentation gap + friction from `011/D5`** — `skills/lienzo-animate/references/compact-format.md:4`, `../lienzo/docs/components.md:93-140`): No prior video used `chart`, `steps`, `badge`, `list`, `table`, `code`, or `bubble`. `compact-format.md:4` points to `lienzo/docs/components.md`, which omits their compact schema keys, and does not warn that `brandFonts(lock)` (`011/D5`) returns `{ family, weight }` objects whereas raw components expect `F.<role>.family` string.
  - `F-21` (**Stale documentation after Lienzo `075/R4`, `080/R5` & `083/R1`** — `skills/lienzo-animate/references/compact-format.md:56-60`, `qa/evidence/v5-errors-battery.json`): The MCP tool table in `compact-format.md` kept pre-`080` parameter names and behavior:
    - Line 56: `scene_rename / scene_delete | manage scene files (name)` — `scene_rename` takes `{ project, from, to }`.
    - Line 57: `background_set | background from a preset or values` — the parameter is `patch`, not `values`.
    - Line 60: `scene_validate | first failing path + notices, without saving` — `scene_validate` returns every failing path in `errors` + `notices` (`Lienzo 075/R4`, `080/R5`, `083/R1`).
  - `F-22` (**Incomplete cleanup after closing `Lienzo 080/R6`, `Lienzo 088` & `Lienzo 090`, introduced as temporary notes in `Animator 013/R6` & `013/R8`** — `skills/lienzo-animate/SKILL.md:16,63`, `skills/lienzo-animate/references/drawing.md:49,57-58`, `skills/lienzo-animate/references/gotchas.md:24`):
    1. `SKILL.md:16`: says `until Lienzo 090 builds from a file over MCP` (added in `013/R8`; `Lienzo 090` is now `done`).
    2. `SKILL.md:63`: says `Unknown fields are dropped without a notice` (stale since `Lienzo 080/R6` and commit `ea009d7`, and contradicts `references/gotchas.md:14`).
    3. `references/drawing.md:49`: says `(there is no per-axis scale channel), until Lienzo 088 adds per-axis scale channels` (added in `013/R6`; `Lienzo 088` is now `done`).
    4. `references/drawing.md:57-58`: line 57 says `"fall" for snow and rain` and line 58 contradicts it with `(particles cannot fall)`.
    5. `references/gotchas.md:24`: says using the native shot camera avoids `out_of_bounds` on shot backgrounds, whereas `shotBox` in `lienzo/src/service/layout/layout.ts:101,165` applies `camera.zoom` to `s1-bg` as well, triggering `out_of_bounds` whenever `camera.zoom > 1`.
  - `F-23` (**Friction from `004/R1`, `013/R1` & `013/R11`** — `tests/videos/learnings.test.cjs:10,40-42`, `skills/lienzo-animate/SKILL.md:21`): `013/R1` removed placeholder bullets from `videos/_template/learnings.md`, but `skills/lienzo-animate/SKILL.md:21` never stated that empty sections must have zero bullets (writing `- None.` under `## Engine` fails `tests/videos/learnings.test.cjs:40-42`).
  - `F-25` (**Convention conflict between `2026-10-31` governance and `011/R6`** — `DESIGN.md:47`, `AGENTS.md:9`): Both documents state `"All on-screen text is English"` unconditionally, conflicting with `011/R6` (brand guide owns tone and language) when a brief or brand requires Spanish or multilingual (`ES` + `EN`) copy (`V6 formats`).

### Who it serves
Agents and authors running `lienzo-storyboard`, `lienzo-art-direction`, and `lienzo-animate`.

### Out of scope
- Engine fixes in Lienzo (covered by Lienzo specs `092`–`095`).

### Dependencies
- 016 (`qa-template-and-lib-fixes`), Lienzo specs `092`–`095` registered in `lienzo/planning/roadmap.md`.

### Owner split
Agent tasks.

## Requirements
- R1 (`F-01`, `F-24`): `skills/lienzo-storyboard/SKILL.md:15,19-21` updates the template copy one-liner at line 15 so `brand.lock.json` is not copied into `videos/<brand>/<video>/` (`filter: (s) => !s.endsWith("brand.lock.json")`), updates the snapshot one-liner at line 20 to log any `brandNotices(inspect)` warnings to `stderr`, and clarifies at line 21 that `brand.lock.json` (`guide`) is the canonical machine snapshot while `videos/<brand>/brand.md` is the human-readable brand summary mirrored from `guide`.
- R2 (`F-09`): `skills/lienzo-animate/references/compact-format.md:4` and `skills/lienzo-animate/references/elements.md` document the compact properties of `badge` (`text`, `color` for text, `fill: { color }` for pill, no `w`/`h`), `chart` (`type: "bar"|"donut"`, `data: "Label: value\n..."`, `showValues`, `showGrid`), `steps` (`layout: "horizontal"|"vertical"`, `labels: "Step 1\nStep 2"`, `current`), `list`, `table`, `code`, `bubble`, `counter`, and `progress`, plus the rule that `brandFonts(lock)` returns `{ family, weight }` objects so raw components take `F.<role>.family` while `palette.json` role overrides sit at the top level (`skills/lienzo-art-direction/SKILL.md:12`).
- R3 (`F-21`): `skills/lienzo-animate/references/compact-format.md:56-60` updates the tool reference table: `scene_rename` takes `{ project, from, to }` (line 56), `background_set` takes `preset` or `patch` (line 57), and `scene_validate` returns `{ valid, path, message, errors, notices }` with every failing path in `errors` (line 60).
- R4 (`F-22`): `skills/lienzo-animate/SKILL.md:16,63`, `skills/lienzo-animate/references/drawing.md:49,57-58`, and `skills/lienzo-animate/references/gotchas.md:24` replace the five stale/contradictory statements with the verified Lienzo `7b7b45c` behavior (`compactFile` over MCP with absolute paths, `keepAudio: true` default on `scene_build` overwrite, unknown-field notices, `@scaleX`/`@scaleY` channels, `particles` `"fall"` mode, and `camera.zoom > 1` `out_of_bounds` on `s1-bg`).
- R5 (`F-23`): `skills/lienzo-animate/SKILL.md:21` (Step 8 Close out) states that sections in `learnings.md` with no findings must be left empty with zero bullets (never `- None.`), matching `tests/videos/learnings.test.cjs:10,40-42`.
- R6 (`F-25`): `AGENTS.md:9` and `DESIGN.md:47` state that all code, markdown documentation, and specs are in English, while on-screen text and voice-over default to English unless `brief.md` or `brand.md` explicitly specifies another target language (such as Spanish or bilingual `ES` + `EN` deliverables), recorded in `CHANGES.md`.
- R7 (`qa-test` close-out): Every promoted `Piece` and `Rule` bullet across `videos/qa-test/{minimal,product,claims,dense,errors,formats,repeat}/learnings.md` ends with `— promoted: <path>`, and every `Engine` bullet ends with `— tracks: Lienzo spec <092|093|094|095>`.

## Design
- D1 (R1): Update `skills/lienzo-storyboard/SKILL.md:15,19-21` in place with `fs.cpSync('videos/_template', 'videos/<brand>/<video>', { recursive: true, force: false, errorOnExist: true, filter: (s) => !s.endsWith('brand.lock.json') })` and `brandNotices` check.
- D2 (R2): Document compact properties for 9 unused components (`badge`, `chart`, `steps`, `list`, `table`, `code`, `bubble`, `counter`, `progress`) in `skills/lienzo-animate/references/compact-format.md:4` and `references/elements.md`, plus `brandFonts` object extraction (`F.<role>.family`) and top-level `palette.json` override placement in `skills/lienzo-art-direction/SKILL.md:12`.
- D3 (R3): Correct tool signatures and return structures in `skills/lienzo-animate/references/compact-format.md:56-60` for `scene_rename` (`{ project, from, to }`), `background_set` (`patch`), and `scene_validate` (`errors` array).
- D4 (R4): Remove five stale/contradictory claims in `skills/lienzo-animate/SKILL.md:16,63`, `references/drawing.md:49,57-58`, and `references/gotchas.md:24` with verified engine behavior (`compactFile` over MCP with absolute paths, unknown-field notices, `@scaleX`/`@scaleY`, `particles` `"fall"`, and `camera.zoom > 1` `out_of_bounds` on `s1-bg`) citing Lienzo specs `063`, `088`, and `090`.
- D5 (R5): Document in `skills/lienzo-animate/SKILL.md:21` (Step 8 Close out) that sections in `learnings.md` with no findings must be left empty with zero bullets (never `- None.`).
- D6 (R6): Record the language policy refinement in `CHANGES.md` and update `AGENTS.md:9` and `DESIGN.md:47` so brief/brand-specified target languages are permitted for on-screen text and voice-over.
- D7 (R7): Update `videos/qa-test/*/learnings.md` with `— promoted: <path>` and `— tracks: Lienzo spec 092`..`095` suffixes and verify with `node --test tests/videos/learnings.test.cjs`.

### Trade-offs & Mitigations
- D1. Pros: prevents copying `_template/brand.lock.json` into video directories at the source command in `lienzo-storyboard`. Cons: slightly longer one-liner in `SKILL.md:15`. Mitigation: combined with `016/D1` (`../brand.lock.json` priority in `scene.gen.cjs`), both the copy step and the loader are protected.
- D2. Pros: agents no longer guess compact component keys (`chart`, `steps`, `badge`) or font property paths (`family` vs object). Cons: component field summary in `compact-format.md` / `elements.md` must stay in sync with Lienzo. Mitigation: keep the table concise, covering only the compact input fields used by generators.
- D3. Pros: MCP tool table reflects real tool schemas, eliminating failed tool calls. Cons: manual documentation upkeep when tool schemas evolve. Mitigation: verified against Lienzo CLI / MCP `instructions` and tests.
- D4. Pros: removes obsolete workarounds that mislead agents into using legacy CLI flags or avoiding supported features (`@scaleX`/`@scaleY`). Cons: none. Mitigation: verified directly against Lienzo commits.
- D5. Pros: prevents `learnings.test.cjs` test failures caused by placeholder bullets (`- None.`). Cons: none. Mitigation: test explicitly guards empty sections.
- D6. Pros: removes the contradiction between `DESIGN.md:47` / `AGENTS.md:9` and real-world Spanish or multilingual brand briefs (`V6 formats`) while keeping English strictly enforced for all code, specs, and repo documentation. Cons: on-screen text language depends on the brief. Mitigation: English remains the default whenever the brief does not declare a target language.
- D7. Pros: cleanly closes all QA test battery learnings with unambiguous promotion paths or Lienzo tracking specs. Cons: requires updating seven video folders. Mitigation: verified by automated test `tests/videos/learnings.test.cjs`.

## Tasks
- [x] 017/T001 [agent] Update `skills/lienzo-storyboard/SKILL.md:15,19-21`
  verified: template copy filter excludes brand.lock.json, project_inspect logs brandNotices warnings to stderr, and brand.lock.json vs brand.md distinction clarified; verified with tests/videos/template.test.cjs and tests/lib/brand.test.cjs (D1) to filter out `brand.lock.json` during template copy (`F-01`), surface `brandNotices(inspect)` warnings on `project_inspect`, and clarify `brand.lock.json` (`guide`) vs `brand.md` (`F-24`) — covers R1, D1
- [x] 017/T002 [agent] Update `skills/lienzo-animate/references/compact-format.md:4`
  verified: documented compact properties of 9 components (badge, chart, steps, counter, progress, list, table, code, bubble) in elements.md and compact-format.md, documented F.<role>.family extraction from brandFonts, and noted top-level palette.json role override placement in lienzo-art-direction/SKILL.md; verified with tests/skills/lib-list.test.cjs, `references/elements.md`, and `skills/lienzo-art-direction/SKILL.md:12` (D2) with compact component field reference (`badge`, `chart`, `steps`, `list`, `table`, `code`, `bubble`, `counter`, `progress`), `F.<role>.family` font property extraction, and top-level `palette.json` role overrides (`F-09`) — covers R2, D2
- [x] 017/T003 [agent] Update `skills/lienzo-animate/references/compact-format.md:56-60`
  verified: tool parameter schemas updated for scene_rename ({ project, from, to }), background_set (preset or patch object), and scene_validate (returns { valid, errors, notices } with all failing paths); verified against Lienzo 075/R4, 080/R5, 083/R1 tool signatures (D3) to correct tool parameters for `scene_rename` (`{ project, from, to }`), `background_set` (`patch`), and `scene_validate` (`errors` array) (`F-21`) — covers R3, D3
- [x] 017/T004 [agent] Update `skills/lienzo-animate/SKILL.md:16,63`
  verified: replaced 5 stale claims in SKILL.md (compactFile over MCP, unknown-field notices), drawing.md (@scaleX/@scaleY tracks, particles fall mode), and gotchas.md (camera.zoom > 1 layout behavior); verified against Lienzo specs 063, 088, 090 and tests/skills/lib-list.test.cjs, `references/drawing.md:49,57-58`, and `references/gotchas.md:24` (D4) to remove the 5 stale claims (`compactFile` over MCP with absolute paths, unknown-field notices, `@scaleX`/`@scaleY`, `particles` `"fall"`, `camera.zoom > 1` `out_of_bounds` on `s1-bg`) (`F-22`) — covers R4, D4
- [x] 017/T005 [agent] Update `skills/lienzo-animate/SKILL.md:21`
  verified: documented in SKILL.md:21 that empty sections in learnings.md must contain zero bullets rather than placeholder bullets like "- None."; verified with tests/videos/learnings.test.cjs (D5) to document that empty sections in `learnings.md` must contain zero bullets (`F-23`) — covers R5, D5
- [ ] 017/T006 [agent] Update `CHANGES.md`, `AGENTS.md:9`, and `DESIGN.md:47` (D6) so on-screen text and voice-over follow the language specified in `brief.md` / `brand.md` (defaulting to English) while code, specs, and markdown docs remain strictly in English (`F-25`) — covers R6, D6
- [ ] 017/T007 [agent] Update `videos/qa-test/{minimal,product,claims,dense,errors,formats,repeat}/learnings.md` (D7) to append `— promoted: <path>` to promoted `Piece`/`Rule` findings and `— tracks: Lienzo spec <092|093|094|095>` to `Engine` findings — covers R7, D7
- [ ] 017/T008 [agent] Verify: run `node --test tests/videos/learnings.test.cjs` asserting all 7 QA test workspaces carry valid tracked suffixes and clean section formatting, and `node --test tests/skills/lib-list.test.cjs` — covers R5, R7, D5, D7
- [ ] 017/T009 [agent] Verify: run full test suite (`pnpm test`) covering unit, golden, template, and skill test partitions and confirm 0 failures — covers R1–R7
