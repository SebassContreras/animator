# Brief template

Copy this structure exactly. Every section is required; write "none" when it does not apply.
Units: seconds for time, canvas pixels for position and size (`x, y` = top-left corner).

````markdown
# <Title>

## Idea
- **Message:** <one sentence the viewer must take away>
- **Audience:** <who>
- **Platform / format:** <e.g. Instagram reel, 1080×1920, 30 fps>
- **Duration:** <total seconds>
- **Mandatory text / brand:** <exact strings, logo, colours> or none

## Concept
- **Angles considered:** <2–3 one-liners>
- **Chosen:** <angle> — <why, one sentence>
- **Story in one line:** <beginning → middle → end>

## Visual style
- **Style:** <name from `lienzo-art-direction` → `styles.md`> — <what this piece changes from it>
- **References:** <2–4 links, what to take from each> or none
- **Palette:**
  | Role | Hex |
  |---|---|
  | background / sky | #… |
  | main subject | #… |
  | accent | #… |
  | text | #… |
- **Shapes:** <flat / rounded / geometric / outlined…>
- **Typography:** <font, weights, sizes>
- **Mood:** <3 words>
- **Motion language:** <e.g. smooth ease-out, slow parallax, no bounces>

## Shot list
| # | Start–end | Framing | Content | Motion | Text | Transition out |
|---|---|---|---|---|---|---|
| 1 | 0–3 | … | … | … | … | cut |

## Shots

### Shot 1 · <name> (0–3 s)
- **Purpose:** <what it adds to the story>
- **Framing:** <wide / medium / close-up; camera move if any>
- **Layers (back to front):**
  - <Layer name>: <shape description, colour role, approx. box x,y,w,h>
- **Motion:**
  - <object>: <what moves, from → to, timing, easing, what it means>
- **Text:** "<exact string>" [F#] — <size, position, in/out timing> or none
- **Transition out:** <cut / cross-fade 0.5 s / fade to black / wipe / zoom>

(repeat per shot)

## Recurring objects
- **<Object name>:** <pieces and proportions, so the builder draws it once and reuses it>

## Audio (optional)
- <music mood, voice-over script> or none

## Sources
- **Fact sheet:** `briefs/<slug>.research.md` or "not needed (fiction)"
- **Verification:** passed on <date> / pending
- **Facts per shot:** 1: F1, F2 · 2: F4 …

## Feasibility notes
- <idea> → <substitution Lienzo can build> (or "all shots buildable as written")

## Build prompt
> Use the lienzo-animate skill to build `briefs/<slug>.md` in project `<project>` as scene `<scene>`.
> Follow the brief exactly: shot timings, palette, layer names and text strings.
> Use a generator script. Save the scene, then <export mp4 | hand over for joint-mode review>.
````
