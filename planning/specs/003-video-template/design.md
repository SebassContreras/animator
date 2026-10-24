# 003 — video-template — Design

## Approach

- D1@1 (implements R1): `videos/_template/` holds exactly five committed files: `brief.md`, `research.md`, `palette.json`, `scene.gen.cjs` and `learnings.md`. `scene.json` is not committed; it is the generator's output, and `videos/_template/scene.json` goes in `.gitignore`. The leading underscore keeps the folder at the top of `videos/` and marks it as not a video. _(judgement, no standard)_
- D2@1 (implements R1): `brief.md` is a copy of the fenced block in `skills/lienzo-storyboard/references/brief-template.md` with its `<…>` placeholders left in place. `research.md` holds only its title and a line pointing to `skills/lienzo-research/references/fact-sheet-template.md`, so it stays empty until research runs. _(judgement, no standard)_
- D3@1 (implements R1, R3): `palette.json` uses the fixed role set `background`, `main`, `secondary`, `accent` and `text`, one per palette slot that every style in `lienzo-art-direction/references/styles.md` names. The default values are **Bright science**, the style of ringana-omega v2. `main`, `secondary` and `accent` carry `shadow` and `highlight` at −15 % and +15 % HSL lightness (the styles.md shading rule); `background` and `text` carry only `base`. A video can add roles, but it never renames these five. The shape is the 002/D5 shape, so `checkPalette` validates it unchanged. _(judgement, no standard)_
- D4@1 (implements R1, R2, R4): `scene.gen.cjs` follows the ringana generators' layout: header comment and run line, `checkPalette(require("./palette.json"))`, `sceneHelpers({ w: 1080, h: 1920, duration: 4, palette: C })`, and a single `shot` with a full-frame `background` rect, one `main` ellipse and one `text` title, then `fs.writeFileSync(__dirname + "/scene.json", JSON.stringify(scene, null, 1))`. It reads only `lib/` and `./palette.json` through paths relative to itself, and it holds no hex literal, so a copied folder runs with no edits. _(standard: CommonJS `__dirname` — https://nodejs.org/api/modules.html#__dirname)_
- D5@1 (implements R1): `learnings.md` has one section per 004/R1 kind: `## Piece` (goes to `lib/`), `## Rule` (goes to a skill), `## Engine` (Lienzo limitation, with an issue link) and `## Local` (stays in the video). Each section holds a placeholder bullet. Spec 004 adopts these headings rather than defining its own (see Sequencing). _(judgement, no standard)_
- D6@1 (implements R2): `tests/videos/template.test.cjs` checks R2 at the unit level. It copies `_template` into `fs.mkdtempSync(path.join(root, "videos", "tmp-"))`, a sibling of the real videos so the generator's `../../lib/` paths still resolve, and runs the copy's generator with `execFileSync`. It then asserts that `scene.json` parses and has `size`, `duration` and a non-empty `elements`, and that the background colour comes from the copy's palette. An `after` hook deletes the temp folder, and `videos/tmp-*/` goes in `.gitignore`. _(standard: `node:test` hooks — https://nodejs.org/api/test.html#afterfn-options; `fs.mkdtempSync` — https://nodejs.org/api/fs.html#fsmkdtempsyncprefix-options)_
- D7@1 (implements R2): Lienzo is not called from the test suite (A8, A9). Acceptance by `scene_build` is checked once, by an agent task that runs `pnpm lienzo scene_build` without `save` from the local Lienzo repo against the generated `scene.json`. That is the validate-only route in `lienzo-animate/references/gotchas.md`. _(judgement, no standard)_
- D8@1 (implements R3): `lienzo-storyboard` gets a new step 0a. Before research or the brief, it creates the folder with a Node one-liner: `node -e "require('fs').cpSync('videos/_template', 'videos/<slug>', { recursive: true, force: false, errorOnExist: true })"`. The command is the same in PowerShell and bash, and it fails rather than overwrite an existing video. Steps 0 and 7 then fill `research.md` and `brief.md` in place instead of creating them. _(standard: `fs.cpSync` — https://nodejs.org/api/fs.html#fscpsyncsrc-dest-options)_
- D9@1 (implements R3): `lienzo-art-direction` "When it runs" step 1 writes the chosen style's colours into `videos/<slug>/palette.json` under the D3 roles. The brief's palette table repeats the same role names and hexes, and the template's table header says that it mirrors `palette.json`. _(judgement, no standard)_
- D10@1 (implements R4): `lienzo-animate` step 3 becomes: edit `videos/<slug>/scene.gen.cjs`, run `node videos/<slug>/scene.gen.cjs`, then `scene_build` with `compact` read from `videos/<slug>/scene.json`. A new "Start from lib/" paragraph lists the `lib/` modules with one line each, says to reuse a piece before drawing a new one, and says that a new piece stays in the video's generator until promoted (A13). The multi-shot paragraph points to `videos/_template/scene.gen.cjs` instead of `videos/viaje/`. _(judgement, no standard)_

## Deliverables

- New: `videos/_template/{brief.md,research.md,palette.json,scene.gen.cjs,learnings.md}`.
- New test: `tests/videos/template.test.cjs`.
- Changed: `.gitignore` (`videos/_template/scene.json`, `videos/tmp-*/`), `skills/lienzo-storyboard/SKILL.md`, `skills/lienzo-storyboard/references/brief-template.md` (palette table note), `skills/lienzo-art-direction/SKILL.md`, `skills/lienzo-animate/SKILL.md`.
- Unchanged: `lib/` (the template only consumes it), the existing videos and their golden tests.

## Sequencing

1. Palette, then generator, then test (T001–T003): the generator reads the palette, and the test runs the generator.
2. Lienzo acceptance (T004) after the test is green.
3. Brief, research and learnings files (T005–T006) can happen at any point before the skill edits that point to them.
4. Skill edits (T007–T010) last, because they name files that must exist.
5. Spec 004's design must use D5's four headings for `learnings.md`. The roadmap already orders 003 before 004, so nothing else is needed.

## Trade-offs

- D1. Pros: the template never drifts from a stale committed output, and the underscore makes its role obvious. Cons: a fresh copy has no `scene.json` until the generator runs. Mitigation: D10 makes running the generator the first build step.
- D2. Pros: there is one source for the brief format, and copying it is cheap. Cons: `brief.md` and `brief-template.md` can drift apart. Mitigation: T005 copies the template verbatim, and the brief-template edit in T008 notes that the template folder must be updated alongside it.
- D3. Pros: every video and every style share the same five role names, so `lib/` calls and skill text can name roles without guessing. Cons: a style with a different structure (Bold graphic has black plus a punch colour) has to be mapped onto the roles. Mitigation: extra roles are allowed. The five are a floor, not a cap, and `checkPalette` accepts any role.
- D4. Pros: the template proves the `lib/` path end to end and is the smallest working example. Cons: a single shot is less rich as an example than viaje. Mitigation: D10 points to ringana-omega-v2 as the full example alongside the template.
- D6. Pros: this tests the observable behaviour R2 describes (copy, run, get a scene) without Lienzo. Cons: the test writes inside the repo's `videos/` folder. Mitigation: a unique `mkdtemp` name, removal in an `after` hook, and a `.gitignore` entry in case a crash leaves the folder behind.
- D7. Pros: the suite stays dependency-free and offline (A9, A10). Cons: a later Lienzo schema change would not fail the suite. Mitigation: `lienzo-animate` builds every real video with `scene_build`, so a break shows up the first time it matters, and `primitives.cjs` is the only module that knows the schema (002 trade-offs).
- D8. Pros: one command works across shells, and it refuses to clobber an existing folder. Cons: `node -e` with quoting is harder to read than `cp -r`. Mitigation: the skill shows the exact command with `<slug>` as its only variable.
- D9. Pros: `palette.json` is the single machine source, and the brief stays human-readable. Cons: the hexes are written twice. Mitigation: both are written in the same art-direction step, and the brief says that `palette.json` wins.
- D10. Pros: the build goes through the generator, so `lib/` reuse becomes the default path. Cons: joint mode (where the user edits in Lienzo) and generator rebuilds can conflict. Mitigation: the existing joint-mode rule stays. Never rebuild with `overwrite` before carrying the user's edits into the generator.

## Open questions

- 004's design may want more structure inside each `learnings.md` section, such as a status like "promoted → file". If so, 004 changes the template through `spectrace-change`.
