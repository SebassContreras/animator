---
name: lienzo-art-direction
description: Give a Lienzo animation a designed look instead of a programmed one — pick a named visual style, design each object's shape, shading and depth, polish the motion (overshoot, follow-through, stagger), and critique rendered frames against a checklist. Use when writing the "Visual style" and "Layers" of a `lienzo-storyboard` brief, when `lienzo-animate` reviews previews, or when the user asks for "más diseño", "mejor estilo", "que se vea más pro", references or a style for a piece.
---

# Lienzo art direction

You are the art director. `lienzo-storyboard` decides **what** the story shows; you decide **how it looks and feels**. `lienzo-animate` builds what you specify. You never write scene JSON.

## When it runs

1. **In the brief (storyboard step 3).** Choose one style from `references/styles.md` and copy its rules into the brief's "Visual style". Write its colours, adapted to the brand, into `videos/<slug>/palette.json` under the roles `background`, `main`, `secondary`, `accent` and `text` (each `{ base, shadow?, highlight? }`; add roles if the piece needs more, never rename these five), and repeat the same roles and hexes in the brief's palette table. Design every recurring object with `references/shapes.md`. Add motion polish from `references/motion-polish.md` to each shot's Motion lines.
2. **In the build (animate step 4).** After each `scene_preview`, critique the frame with `references/review.md`. Report failures as concrete fixes (layer, property, value), not opinions.
3. **On request.** When the user wants references, give them from `references/review.md` → "Where to look", with what to take from each one.

## Principles

- **One style per piece.** Mixing styles reads as a mistake. Change the palette only when the story changes (see `lienzo-storyboard` → `craft.md`).
- **Silhouette first.** An object must be recognisable as a solid black shape. Then add tones, then details.
- **Fewer, better pieces.** 3–5 tones per object, ≤ 30 elements per shot. Detail goes on the focal object only.
- **Nothing still, nothing linear.** Every entry eases and settles; every shot has ambient life.
- **Design inside Lienzo.** Every rule here maps to something Lienzo can do (paths, flat fills, two-stop gradients, glows, keyframes, easings). If a style needs more, use the substitution in `lienzo-storyboard` → `feasibility.md`.

## Trade-offs

| Decision | Pro | Con | Mitigation |
|---|---|---|---|
| A closed library of named styles | consistent, fast, buildable | pieces can look alike | the brief may tweak palette and type; add a style to `styles.md` once it worked in a real piece |
| Separate skill, not more text in `craft.md` | storyboard stays about story; design rules have one home | one more skill to install and invoke | storyboard step 3 and animate step 4 call it explicitly |
| Critique from frames, not from JSON | judges what the viewer sees | previews cost time | review only the frames the animate workflow already previews |
| Rules of thumb with numbers | the builder never guesses | numbers come from practice, not standards | log what the user corrects in `LOG.md` and update the numbers |

## Verified example

`videos/ringana-omega-v2/brief.md` + `videos/ringana-omega-v2/scene.gen.cjs` (scene `omega-v2`, project `ringana`): the v1 piece redesigned with this skill; the user rated it "much, much better" (2026-10-24). To redesign an existing piece the same way:

1. Keep story, text, facts, timing and voice; write a short `-v2` brief with only the style and the changes per shot.
2. Copy the v1 generator, swap flat pieces for three-tone ones, add planes, ambient motion and polish.
3. Build as a new scene, copy `audioTracks` from v1, export, and compare side by side with ffmpeg `hstack` (see `LOG.md`).

## References

- `references/styles.md` — named styles: palette roles, shapes, shading, type, motion.
- `references/shapes.md` — designing an object: silhouette, tones, light, depth, detail.
- `references/motion-polish.md` — easing, overshoot, follow-through, stagger, ambient life, mapped to Lienzo.
- `references/review.md` — frame critique checklist and where to look for references.
