# 012 — platform-length

## Goal
The storyboard chooses a video's length from data, and keeps the two goals apart: completion and
reach. Verification: `craft.md` has a sourced "Platform length" note, and storyboard step 1 flags
a duration outside the default band before the brief is written.

## Context
- Moved out of 011 (its former R9/D11) during the 2026-10-31 audit: it is content guidance, not
  part of reading the brand from Lienzo.
- `ringana`'s brand guide already states these bands for that brand ("Default 15–30 s… 45–60 s
  only when reach is the goal… Never over 90 s"). This spec makes them the default for any brand.
- `craft.md`'s pacing table (5–8 s, 10–15 s, 20–30 s) says how many shots fit a length, not which
  length to choose.

## Requirements
- R1: `skills/lienzo-storyboard/references/craft.md` separates the two goals: for completion (an
  explanation or a product message), 15–30 s; for reach, 45–60 s, only if the story holds; never
  over 90 s. Each figure cites its source.
- R2: Storyboard step 1 checks the duration that 011/D11 chose against the band. Partitions:
  - inside 15–30 s → accepted;
  - 45–60 s with reach stated as the goal → accepted as a deliberate choice;
  - any other value up to 90 s (for example Lienzo's default 5 s) → step 1 says so and asks the
    user to confirm it or pick a value in the band;
  - over 90 s → not accepted.

  When the brand guide sets its own length rules, they win over this default (011/R5: what is
  closer to the video wins).

### Who it serves
Every new video: its length is a deliberate choice backed by data.

### Out of scope
- Platform-specific formats other than length (aspect ratio, safe areas).

### Dependencies
- 011: storyboard step 1 already takes the duration from the brief or the brand (011/D11).

### Owner split
Agent tasks. The user confirms any duration outside the band.

## Design
### Approach

- D1 (R1): `craft.md` gets a "Platform length" note above its pacing table:
  - completion falls as length grows (Reels: about 78 % at 15 s in a 50-Reel test; TikTok: 0–10 s
    completes best and 21–34 s averages 62 % vs 48 % over 60 s);
  - reach and engagement peak at 45–60 s for brand Reels (Socialinsider, 6 M Reels, H1 2026);
  - Instagram says there is no single ideal length, and long Reels get less distribution.

  So the default band is 15–30 s, and 45–60 s is a deliberate choice for reach. The note is
  dated and calls its sources directional. _(sources, mostly vendor studies, so directional:
  https://www.bytecap.io/research/best-instagram-reels-length,
  https://creatorhouse.app/blog/instagram-reel-length-2026-test,
  https://www.highviz.io/blog/how-long-should-instagram-reels-be/,
  https://www.fanpagekarma.com/insights/optimal-tiktok-video-length/,
  https://www.opus.pro/blog/tiktok-length-format-retention-data,
  https://buffer.com/resources/instagram-reels-length. The Socialinsider figure and Instagram's
  statement still need their own sources: T001)_
- D2 (R2): Storyboard step 1, right after 011/D11 picks the duration, compares it with the
  guide's length rules when there are any, and with the D1 band otherwise. It states the result
  in the brief next to the duration.

### Trade-offs

- D1. Pros: the default band rests on data, and reach is a deliberate choice. Cons: the sources
  are vendor studies, and platform ranking changes, so the numbers age. Mitigation: the note is
  dated and calls its sources directional, the brief can set any length up to 90 s, and a brand
  guide's own rules win.
- D2. Pros: a short default (Lienzo's 5 s) or an accidental long video is caught before the brief
  is written. Cons: one more question when the length is unusual. Mitigation: the brief records
  the answer, so it is asked once per video.

## Tasks
- [ ] 012/T001 [agent] Verify: find the primary source of the Socialinsider figure (6 M Reels, H1 2026) and Instagram's own statement on Reel length; cite them in D1, or reword each as reported by its secondary source — covers D1
- [ ] 012/T002 [agent] `skills/lienzo-storyboard/references/craft.md`: add the dated "Platform length" note with its sources above the pacing table — covers R1, D1
- [ ] 012/T003 [agent] `lienzo-storyboard` step 1: check the chosen duration against the guide's length rules or the D1 band, ask the user to confirm a value outside it, refuse over 90 s, and state the result in the brief — covers R2, D2
