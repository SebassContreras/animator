# ringana-omega — Learnings

What this video taught, one bullet per finding, under its kind (004/R1). Close-out promotes `Piece` and `Rule` findings. A promoted finding ends with `— promoted: <repo path>`; every `Engine` finding ends with `— tracks: <url>`.

Session 2026-10-24, project `ringana`, scene `omega`: a 24 s vertical reel about RINGANA BEYOND omega, with a voice-over. Export `projects/ringana/exports/omega.mp4` in Lienzo.

## Piece

- Numeric count-up built from `label.text` keyframes (4.8% → 5.9% → 7.0% → 7.9%) (`scene.gen.cjs`, gauge shot). — promoted: lib/motion.cjs

## Rule

- When a brand site blocks crawlers (`robots.txt: disallow: /`), open the official page in the user's real browser with `pwa-nav` (`open <url> --launch --allow-origin`) from the start, or ask the user to paste the product page text. — promoted: skills/lienzo-research/references/sources.md
- Look for linked PDFs (studies, data sheets) first: they hold the richest facts, and `pwa-nav` snapshots do not show body text inside tabs. — promoted: skills/lienzo-research/references/sources.md
- Official sources can change the brief a lot (a study with numbers became a new shot): research before the storyboard, not after.
- Health claims stay inside the EU authorised wording (Reg. 432/2012); seller claims are left out, and a brand's own study is attributed on screen. — promoted: skills/lienzo-research/references/claims.md
- Everything in the repo and in the video is in English; chat with the user is in Spanish. — promoted: AGENTS.md
- Check `font_list` and run `font_install` before building; a missing font falls back to a serif. — promoted: skills/lienzo-animate/references/gotchas.md
- 88 px is too big for a 20-character title on a 1080-wide canvas; 72 px fit. — promoted: skills/lienzo-storyboard/references/craft.md
- Build large compact scenes (45 KB) through the CLI with `pnpm lienzo scene_build --json @file`, not inline through MCP. — promoted: skills/lienzo-animate/references/compact-format.md
- Voice-over: one clip per shot, placed with `audioTracks[].startOffset`; one clip for the whole script does not fit the shots. — promoted: skills/lienzo-storyboard/references/craft.md
- The voice must not repeat the on-screen text: short, varied lines; numbers and terms stay on screen; one sentence may run across a cut as a single clip. — promoted: skills/lienzo-storyboard/references/craft.md
- Never split one sentence into two clips; the gap makes it sound broken. — promoted: skills/lienzo-storyboard/references/craft.md
- Keep the brand out of the voice unless the user asks for it. — promoted: skills/lienzo-storyboard/references/craft.md
- Measure real audio length with `ffmpeg -af silencedetect` on the export; do not trust `audioDuration`. — promoted: skills/lienzo-animate/references/gotchas.md

## Engine

- `scene_generate_speech` keeps only one clip: each call replaces `scene.audio`, so several clips must be written by hand as `audioTracks`, and a later `scene_build` + `overwrite` erases them. It should append a track with `startOffset`. — tracks: https://github.com/SebassContreras/lienzo/issues/10
- `audioDuration` can be wrong: a merged clip reported 1.5 s but sounds for about 2.7 s. — tracks: https://github.com/SebassContreras/lienzo/issues/11
- A font that is not installed in the project falls back to a serif with no warning from `scene_build`. — tracks: https://github.com/SebassContreras/lienzo/issues/12

## Local

- The first fact sheet came from third-party retailer data and was marked uncertain until the official page and study were read.
- The brand's study (+63.5 % Omega-3 Index in 90 days, 27 people, 3 capsules/day) became the gauge shot.
- The first brief was written in Spanish and had to be redone.
- Voice: Kokoro `af_bella` (female), approved by the user.
- The user preferred "BEYOND omega." alone over "BEYOND omega. By RINGANA."
