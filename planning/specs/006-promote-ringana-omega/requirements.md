# 006 — promote-ringana-omega — Requirements

## What's being built

The promotion of the piece and the rules `ringana-omega` proved (004 close-out of a migrated video).

## Who it serves

Every future video with a number that counts up, facts from a brand, health claims or a voice-over.

## Requirements

- R1@1: `lib/motion.cjs` exports `countUp(steps)`, which turns `[[t, text], …]` into a `label.text` track, and both ringana generators use it with byte-identical output.
- R2@1: `skills/lienzo-research/references/sources.md` says: when a brand site blocks crawlers, open the official page in the user's browser with `pwa-nav` or ask for the page text; look for linked PDFs (studies, data sheets) first.
- R3@1: `skills/lienzo-research/references/claims.md` says health claims stay inside the EU authorised wording (Reg. 432/2012), seller claims are left out, and a brand's own study is attributed on screen.
- R4@1: `skills/lienzo-animate/references/gotchas.md` has two rows: a missing font falls back to a serif (check `font_list`, run `font_install`), and `audioDuration` can be wrong (measure with `ffmpeg -af silencedetect`).
- R5@1: `skills/lienzo-storyboard/references/craft.md` says a 20-character title fits at 72 px, not 88 px, on a 1080-wide canvas.
- R6@1: `skills/lienzo-storyboard/references/craft.md` has a voice-over section: one clip per shot placed with `startOffset`; the voice does not repeat the on-screen text; never split one sentence into two clips; keep the brand out of the voice unless asked.
- R7@1: Each promoted finding in `videos/ringana-omega/learnings.md` ends with `— promoted: <path>`.

## Out of scope

- Changing either ringana video on screen.

## Dependencies

004 (close-out that opened this spec), 002 (lib).

## Owner split

Agent tasks only.
