# Craft: telling it visually

## Creative angles

Pick the one that makes the message felt, not just stated.

| Angle | Shape of the story | Good for |
|---|---|---|
| Journey | A → road → B | progress, onboarding, "how we got here" |
| Transformation | before → change → after (morph, colour shift) | products, habits, results |
| Contrast | two worlds side by side or one after another | problem/solution, old/new |
| Metaphor | an object stands for the idea (seed = startup, bridge = integration) | abstract or technical topics |
| Build-up | pieces assemble into a whole | systems, teams, features |
| Countdown / list | numbered beats with a payoff | tips, steps, rankings |
| Reveal | hide → hint → reveal | launches, surprises |
| Loop | an endless cycle that makes a point | routines, flows, GIFs |

## Platform length

Checked 2026-10-31. Pick the length from the goal. Band ends are included (15 and 30 s are inside). The sources are vendor studies, so read them as a direction, not a law.

- **Completion** (an explanation or a product message): **15–30 s**, the default. Completion falls as length grows: Reels at 15 s averaged 78 % completion in a 50-Reel test ([CreatorHouse](https://creatorhouse.app/blog/instagram-reel-length-2026-test)); on TikTok 0–10 s completes best ([Fanpage Karma](https://www.fanpagekarma.com/insights/optimal-tiktok-video-length/)), and 21–34 s averages 62 % vs 48 % over 60 s ([Opus](https://www.opus.pro/blog/tiktok-length-format-retention-data)). The 15 s lower bound is a house rule: below it an explanation barely fits (see the 5–8 s row below). A shorter piece (a loop, a single image) is fine when chosen on purpose.
- **Reach**: **45–60 s**, only when the brief states reach as the goal, and only with a story that holds that long. Among brand Reels, 45–60 s has the highest engagement (0.35 %) and views (10,374); 120–180 s comes second for engagement (0.33 %) ([Socialinsider, 9.8 M Reels, Jan–Jun 2026](https://www.socialinsider.io/blog/instagram-reels-length/)).
- **Past 180 s**: engagement drops to 0.15 % and views to 4,428, below every shorter length, and Socialinsider reports such Reels are not placed in the Reels tab ([Socialinsider](https://www.socialinsider.io/social-media-benchmarks/social-media-video-statistics)).
- Instagram's head, Adam Mosseri, says there is no one perfect length: the goal is to keep people watching (as reported by [Buffer](https://buffer.com/resources/instagram-reels-length), undated).

A brand guide's own length rules replace all of this.

## Pacing (short social video)

| Duration | Shots | Notes |
|---|---|---|
| 5–8 s | 1–2 | one strong image, one line of text |
| 10–15 s | 3–5 | hook → 2–3 beats → payoff |
| 20–30 s | 5–8 | needs a clear middle; vary framing |

- **Hook in 1–2 s:** movement or a striking image in the first frame. Never open on an empty background.
- **Shot length:** 2–4 s. Under 1.5 s reads as a flash; over 5 s needs motion inside the shot.
- **Rhythm:** alternate wide and close shots. Speed up toward the climax, slow down at the end.
- **Ending:** hold the final image ≥ 1.5 s with the message; for loops, make the last frame match the first.

## Framing

- **Wide:** sets the place. **Medium:** the subject in context. **Close-up:** detail or emotion.
- Rule of thirds: on 1080×1920, strong lines at x 360/720 and y 640/1280. Put the subject on one, the text on another.
- Leave a safe margin of 80 px on the sides and 220 px top and bottom for social UI.
- One focal point per shot. Everything else is darker, smaller or slower.

## Colour

- 1 dominant (60 %), 1 secondary (30 %), 1 accent (10 %) for the thing to look at.
- Time of day sells mood: day = blues and greens; dusk = purples and oranges; night = navy with one warm light.
- Keep text contrast ≥ 4.5:1 against what is behind it.
- Change the palette between shots only when the story changes (time, place, emotion).

## Motion language

| Feeling | Motion |
|---|---|
| calm | slow linear drift, gentle `swing`/`float`, long fades |
| energy | fast slides, `pop`, `back-out`/`elastic-out` easing |
| progress | left → right, upward moves, growing scale |
| tension | slow zoom-in, `wobble`, darkening |
| resolution | settle with `ease-out`, then stillness |

- Motion should continue for the whole shot; frozen elements look broken.
- Stagger entries (0.1–0.2 s) instead of having everything appear at once.
- Parallax (far slow, near fast) adds depth for free.

## Text on screen

- ≤ 7 words per line, ≤ 2 lines at once, ≥ 1.5 s per line.
- One typeface, two weights. Title 72–96 px, support 40–56 px on 1080-wide canvases.
- Long titles take the low end: a 20-character title fits at 72 px on a 1080-wide canvas; 88 px was cut off.
- Text enters after the image (0.2–0.4 s later), so the eye lands on the image first.

## Voice-over

- One clip per shot, placed with `audioTracks[].startOffset`; one clip for the whole script does not fit the shots.
- The voice does not repeat the on-screen text: short, varied lines; numbers and terms stay on screen. One sentence may run across a cut as a single clip.
- Never split one sentence into two clips: the gap makes it sound broken.
- Keep the brand out of the voice unless the user asks for it.
