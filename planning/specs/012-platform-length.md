# 012 — platform-length

## Goal
The storyboard chooses a video's length from data, and keeps the two goals apart: completion and
reach. Verification: `craft.md` has a dated "Platform length" note with each figure beside its
source, and storyboard step 1 flags, within its one round of questions, a duration outside the
guide's length rules or, without them, outside the default band.

## Context
- Moved out of 011 (its former R9/D11) during the 2026-10-31 audit: it is content guidance, not
  part of reading the brand from Lienzo.
- `ringana`'s brand guide already states these bands for that brand ("Default 15–30 s… 45–60 s
  only when reach is the goal… Never over 90 s"). This spec makes its two bands the default for
  any brand; its 90 s ceiling stays a `ringana` rule (D3).
- `ringana`'s guide keeps its own copy of the bands as a brand decision; it does not follow later
  changes to the default. Removing it is the user's call (011/R6: brand data is written only
  after the user agrees).
- `craft.md`'s pacing table (5–8 s, 10–15 s, 20–30 s) says how many shots fit a length, not which
  length to choose.

## Requirements
- R1: `skills/lienzo-storyboard/references/craft.md` has a dated "Platform length" note that
  separates the two goals: completion (an explanation or a product message), 15–30 s; reach,
  45–60 s, chosen only when the brief states reach as the goal. It warns that past 180 s
  engagement and views fall below every shorter length. Every figure (each bound and each
  statistic) sits beside the source it comes from; a figure no source supports is labelled a
  house rule. Invariant: the band figures appear only in this note.
- R2: Storyboard step 1 checks the duration d (seconds, 0 < d ≤ 600 as Lienzo allows) chosen
  under 011/R9 and the goal the brief states (`completion` by default, or `reach`). With no
  length rules in the guide:

  | Partition | Goal | Boundary values | Result |
  |---|---|---|---|
  | 15 ≤ d ≤ 30 | any | 15, 30 | accepted |
  | 45 ≤ d ≤ 60 | `reach` | 45, 60 | accepted as a deliberate choice |
  | 45 ≤ d ≤ 60 | `completion` | 45, 60 | flagged |
  | d < 15, 30 < d < 45, 60 < d ≤ 180 | any | 5 (Lienzo's default), 14.9, 30.1, 44.9, 60.1, 180 | flagged |
  | d > 180 | any | 180.1 | flagged, quoting the note's 180 s warning |

  Flagged: step 1 says so and asks the user, in its one round of questions, to confirm the value
  or pick one in the band. When the guide states length rules, they replace the whole default,
  bands and warning (011/R5: what is closer to the video wins). Partitions: d inside the guide's
  rules → accepted; outside them → flagged; d a guide rule forbids → refused, and step 1 asks
  for a value the guide allows (`ringana`: 30 accepted, 30.1 flagged, 90 flagged, 90.1 refused).
  Invariant: every brief records d, its origin, the goal and the result (accepted, or confirmed
  by the user).

### Who it serves
Every new video: its length is a deliberate choice backed by data.

### Out of scope
- Platform-specific formats other than length (aspect ratio, safe areas).

### Dependencies
- 011: storyboard step 1 already takes the duration from the brief or the brand (011/R9).

### Owner split
Agent tasks. The user confirms any flagged duration.

## Design
### Approach

- D1 (R1): `craft.md` gets a "Platform length" note above its pacing table:
  - completion falls as length grows: Reels at 15 s averaged 78 % completion in a 50-Reel test
    _(CreatorHouse, May 2026: https://creatorhouse.app/blog/instagram-reel-length-2026-test)_;
    on TikTok 0–10 s completes best _(Fanpage Karma, about February 2026:
    https://www.fanpagekarma.com/insights/optimal-tiktok-video-length/)_, and 21–34 s averages
    62 % vs 48 % over 60 s _(Opus, author's own analysis:
    https://www.opus.pro/blog/tiktok-length-format-retention-data)_;
  - among brand Reels, 45–60 s has the highest engagement (0.35 %) and views (10,374); 120–180 s
    comes second for engagement (0.33 %); past 180 s engagement drops to 0.15 % and views to
    4,428, below every shorter length, and Socialinsider reports that such Reels are not placed
    in the Reels tab _(source: Socialinsider, 9.8 M Reels from brands, January–June 2026,
    https://www.socialinsider.io/blog/instagram-reels-length/,
    https://www.socialinsider.io/social-media-benchmarks/social-media-video-statistics)_;
  - Instagram's head, Adam Mosseri, says there is no one perfect length and the goal is to keep
    people watching, as reported by Buffer _(undated; no primary source found on Instagram's
    sites: https://buffer.com/resources/instagram-reels-length)_.

  So the default band is 15–30 s, and 45–60 s is a deliberate choice for reach, which needs a
  story that holds that long (advice, not a check). The 15 s lower bound is a house rule (from
  `ringana`'s guide): the data favours shorter, but below 15 s an explanation or product message
  barely fits (the pacing table's 5–8 s row holds one image and one line). A shorter length
  (loops, a single image) is fine when chosen on purpose. The note is dated and calls its
  sources directional (all are vendor studies).
- D2 (R2): Storyboard step 1, right after 011/D11 picks the duration, applies the R2 table. The
  band comes from the guide's length rules, which are the duration figures the guide states
  (e.g. `ringana`'s "## Format and length"), or, when it states none or there is no guide, from
  craft.md's "Platform length" note; step 1 names the note and does not restate its figures.
  When the duration came from `canvas.duration` and is flagged, D11's confirmation and the band
  question are one question. The brief's Duration line records the value, its origin, the goal
  and the result.
- D3 (R2): The default has no hard ceiling; only a guide rule refuses a length (`ringana`: "Never
  over 90 s"). 90 s is not a platform limit: in Socialinsider's data 60–90 s and 90–120 s have
  the same engagement as 30–45 s (0.30 %), the drop comes past 180 s, and no primary source
  supports a 90 s cut. A guide's rules replace the whole default, ceiling included (011/R5).
  _(source: Socialinsider, as in D1)_

### Trade-offs

- D1. Pros: the default band rests on data, and reach is a deliberate choice. Cons: the sources
  are vendor studies, and platform ranking changes, so the numbers age; the band flags the 5–8 s
  and 10–15 s rows of the pacing table below it, which suit loops and single-image pieces.
  Mitigation: the note is dated and calls its sources directional, it says a shorter length is
  fine when chosen on purpose, the user confirms a flagged length once, and a brand guide's own
  rules win.
- D2. Pros: Lienzo's 5 s default or an accidental long video is caught before the brief is
  written, and the figures have one home. Cons: one more question when the length is unusual,
  and step 1 must open craft.md. Mitigation: the question shares step 1's single round with
  D11's confirmation, the brief records the answer, and the note is short.
- D3. Pros: no rule without a source, and the default has two results only (accepted, flagged);
  a brand that wants a hard cap writes it in its guide. Cons: a 4-minute video is flagged, not
  stopped. Mitigation: the question quotes the 180 s warning, and Lienzo still caps a scene at
  600 s.

## Tasks
- [x] 012/T001 [agent] Verify: map each remaining D1 figure (78 % at 15 s in a 50-Reel test, TikTok 0–10 s and 21–34 s vs over 60 s completion) to the URL that states it; cite it in D1, reword it as reported by its secondary source, or drop it; drop any URL that supports no figure; record `verified:` under the task. Socialinsider and Mosseri were checked on 2026-10-31 (D1) — covers R1, D1
  - verified: 2026-10-31. 78 % at 15 s → CreatorHouse (50 Reels, 5 cohorts); 0–10 s → Fanpage Karma; 62 % vs 48 % → Opus. highviz.io states none of the figures and bytecap.io could not be read: both dropped from D1.
- [x] 012/T002 [agent] `skills/lienzo-storyboard/references/craft.md`: add the "Platform length" note, dated, above the pacing table: the two bands, the 15 s house rule, the short-format line and the 180 s warning, each figure beside its source as T001 left D1 — covers R1, D1
- [x] 012/T003 [agent] `lienzo-storyboard` SKILL.md step 1 "Duration": after 011/D11's value, apply the R2 table with the guide's length rules or, without them, craft.md's "Platform length" note (named, figures not restated); refuse only what a guide rule forbids; fold the question into step 1's single round — covers R2, D2, D3
- [x] 012/T004 [agent] `skills/lienzo-storyboard/references/brief-template.md` and `videos/_template/brief.md`: the Duration line records the goal and the band result; run `node --test tests/videos/template.test.cjs` — covers R2, D2
- [x] 012/T005 [agent] Review: walk each R2 row (5, 14.9, 15, 30, 30.1, 44.9, 45 and 60 with each goal, 60.1, 180, 180.1, and `ringana`'s guide at 30, 30.1, 90, 90.1) through the finished step 1 text; record under the task what it prescribes per row; a row left undecided reopens T003 — covers R2, D3
  - verified: 2026-10-31. Step 1 + craft.md: 5, 14.9, 30.1, 44.9, 60.1, 180 → flagged (5 from `canvas.duration` in one question with its confirmation); 15, 30 → accepted (ends included, stated in the note); 45, 60 → accepted with `reach`, flagged with `completion`; 180.1 → flagged quoting the 180 s warning; `ringana` 30 → accepted, 30.1 and 90 → flagged, 90.1 → refused. No row left undecided.
