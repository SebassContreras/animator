# 001 — video-folders — Design

## Approach

- D1@1 (implements R1, R2, R3): Each video lives at `videos/<slug>/` with fixed file names: `brief.md`, `research.md`, `palette.json`, `scene.gen.cjs`, `scene.json`, `learnings.md`; v2's brief links to `../ringana-omega/research.md` instead of copying it.
- D2@1 (implements R1, R2, R3, R5): Files move with `git mv` so their history follows them; `lab/lib/compact.cjs` moves to `lib/primitives.cjs` (A6) and generators require it from there.
- D3@1 (implements R1, R2, R4): Each ringana generator reads its colours from `palette.json` (for now the same role → hex map it had inline; 002 reshapes it into tones) and writes `scene.json` beside itself with `__dirname`; the output is compared byte by byte with the files in commit `f8bb08f`. _(judgement, no standard)_
- D4@1 (implements R3): `lab/viaje.baseline.json` is deleted: nothing in the repo reads or names it. _(judgement, no standard)_
- D5@1 (implements R5, R6, R7): Every path to `briefs/`, `lab/` or `examples/viaje.md` in the skills, `README.md` and `LOG.md` is rewritten to `videos/<slug>/…`, and the mentions of `LIENZO-IMPROVEMENTS.md` are removed (README and `lienzo-storyboard` feasibility).
- D6@1 (implements R1, R2): `learnings.md` starts as a stub naming the `LOG.md` session it comes from; spec 004 moves the content.

## Deliverables

- `videos/ringana-omega/`, `videos/ringana-omega-v2/`, `videos/viaje/`, `lib/primitives.cjs`.
- Updated: `skills/*/SKILL.md` and references that name old paths, `README.md`, `LOG.md`.

## Sequencing

Move files (T001–T004) before rewriting references (T007–T008); palette and output check (T005) after the generators moved.

## Open questions

- `viaje` keeps its own inline helpers and colours until it is reworked (002 out of scope); it gets no `palette.json` yet.

## Trade-offs

- D1 — Pros: one known shape per video; easy to find and copy. Cons: fixed names force every video into the same files even when one is empty. Mitigation: `research.md` is optional when the piece states no facts (A7).
- D2 — Pros: `git mv` keeps blame reachable; one shared `lib/` instead of a hidden `lab/lib/`. Cons: git does not store renames, it detects them by similarity (≥50%) and needs `git log --follow`; editing a file in the same commit as its move can break detection. Mitigation: commit the pure moves (T001–T004) before T005 edits the generators.
- D3 — Pros: colours leave the code, ready for 002; `__dirname` makes output independent of the working directory; byte-for-byte comparison leaves no doubt. Cons: byte equality is brittle to key order or whitespace; a JSON palette loses comments. Mitigation: keep the inline map's key order in `palette.json` and lock the output with the golden test (T009).
- D4 — Pros: removes an unused file (YAGNI). Cons: the baseline is lost from the working tree. Mitigation: grep confirmed no reader; it stays recoverable from commit `f8bb08f`.
- D5 — Pros: no stale paths left for agents to follow. Cons: rewriting `LOG.md` touches a history-like file. Mitigation: only paths change, never the narrative; R5 stays guarded by `trace check`, which flags mentions of deleted paths, so it needs no separate test.
- D6 — Pros: the folder shape is complete now without doing 004's work. Cons: stubs are temporary debt. Mitigation: each stub names its `LOG.md` session and 004 depends on 001.
