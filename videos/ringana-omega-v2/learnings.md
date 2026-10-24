# ringana-omega-v2 — Learnings

What this video taught, one bullet per finding, under its kind (004/R1). Close-out promotes `Piece` and `Rule` findings. A promoted finding ends with `— promoted: <repo path>`; every `Engine` finding ends with `— tracks: <url>`.

Session 2026-10-24, scene `omega-v2`: the art-direction pass that redesigned the first `ringana-omega` piece (since removed) without touching story, text, facts or voice. Exports in Lienzo: `omega-v2.mp4` and `omega-compare.mp4` (v1 | v2 side by side).

## Piece

- Flat primitives (`rect`, `ell`, `path`, `group`, `flat`) shared by both ringana generators; the v1 output was byte-identical after the move. — promoted: lib/primitives.cjs

## Rule

- Big halos (400–520 px) are plain discs at 4–12 % opacity; `bgGlow` only on small focal objects, because a large one washes the frame white. — promoted: skills/lienzo-animate/references/drawing.md
- The art-direction pass (three tones per object, three planes, ambient motion, overshoot and stagger) is the default for every new piece. — promoted: skills/lienzo-art-direction/SKILL.md
- Compare two versions side by side: `ffmpeg -i v1.mp4 -i v2.mp4 -filter_complex "[0:v]scale=540:-2[a];[1:v]scale=540:-2[b];[a][b]hstack" -map 1:a? out.mp4`, then grab frames at mid-shot times and run the review checklist on them. — promoted: skills/lienzo-art-direction/SKILL.md

## Engine

- Voice tracks had to be copied by hand from `omega.json` into the new scene: `scene_generate_speech` keeps one clip, and nothing carries `audioTracks` between scenes. — tracks: https://github.com/SebassContreras/lienzo/issues/10

## Local

- The review checklist caught both defects (focal point, contrast) on the first preview pass.
- User verdict: "much, much better" than v1; v2 is the verified example in `lienzo-art-direction`.
