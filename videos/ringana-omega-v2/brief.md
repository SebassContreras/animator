# RINGANA omega 3 · v2 (art direction pass)

The art-direction redesign of the first ringana-omega piece (since removed): same idea, concept, shot list, timings, on-screen text, facts and voice-over, made with the `lienzo-art-direction` skill. Where "Visual style" or "Changes per shot" differ from the shots or objects below, they win. Facts and sources: `research.md` (same folder). Generator: `scene.gen.cjs`, built from project `ringana`'s brand. Its Lienzo scene `omega-v2` was deleted on 2026-10-31 and is not rebuilt.

## Idea
- **Message:** BEYOND omega gives you 960 mg of plant-based omega 3 (from microalgae) a day for your heart, brain and vision.
- **Audience:** from the brand guide (adults interested in natural wellbeing; for BEYOND omega, people who eat little or no fish).
- **Platform / format:** Instagram/TikTok reel, 1080×1920, 30 fps
- **Duration:** 24 s — set by this brief (the brand's `canvas.duration` is 20 s)
- **Mandatory text / brand:** from the brand guide: the product name "RINGANA BEYOND omega", the food-supplement disclaimer, the text-only brand mark, English on screen.

## Brand
- **Lienzo project:** `ringana` (snapshot in `brand.lock.json`)
- **Overrides:** `text` (white on the dark sea; the brand's text is black)
- **Precedence:** what this video sets (`palette.json`, this brief) wins; anything it leaves out comes from the brand; anything the brand lacks comes from the system defaults (`DESIGN.md` → Brand inheritance).

## Concept
- **Angles considered:** (a) the journey of a golden drop through the body; (b) from the algae sea to the capsule; (c) a gauge that fills from "low" to "optimal" omega 3.
- **Chosen:** (a)+(b) closed with a short (c). A microalga becomes a capsule; its drop travels through the body and lights up the heart, brain and eyes; a gauge then shows the study result. Origin, benefit and proof are told in one journey.
- **Story in one line:** algae in the sea → capsule (960 mg) → lights up heart, brain, eyes → vitamins → Omega-3 Index gauge rises → product + disclaimer.

## Visual style
- **Style:** Bright science — keeps the dark sea and the product's aubergine; uses the brand fonts (Montserrat 800 / 500) instead of a rounded sans.
- **References:** Kurzgesagt (flat shading, glow on the focal object, layered depth); TED-Ed (simple organ icons).
- **Palette:** overrides and story roles only; hex values (hand-picked shadow and highlight tones) live in `palette.json`.
  | Role | What it paints |
  |---|---|
  | sea | the backdrop gradient |
  | seabed, fg, algaFar | the seabed, the dark foreground fronds, the pale far algae |
  | alga | the mid algae and the alga that becomes the capsule |
  | drop | the golden omega drop and the gold accents |
  | capsule | the aubergine capsules and the hero capsule |
  | organ | the heart and the lit organs |
  | body | the body silhouette |
  | low | the gauge's low zone |
  | text | override: all on-screen text, white |
- **Light:** from the top-left in every shot; shadow tone on the right/bottom half of each object.

## Changes per shot
1. **Algae sea:** fronds are leaf paths (base, shadow, highlight) that pivot on their base; three planes with parallax (pale far algae, mid algae on a seabed, dark foreground fronds out of frame); light rays; plankton; slow push-in before the zoom.
2. **Alga → capsule:** the drop pops in with overshoot; capsules pop in staggered (`back-out`, 0.05–0.1 s apart) and keep floating; capsules have two halves (seam), a shadow and a glint; soft gold halo.
3. **Heart:** shouldered torso; heart with shadow and highlight; the drop leaves two trailing drops (follow-through); beats with anticipation (0.96 → 1.18 → 1); slow push-in.
4. **Brain & vision:** two-tone brain with highlights; eyes with pupils and glints that open with overshoot; sparkles.
5. **Vitamins:** icons sit on badges with a shadow; staggered pop and float.
6. **Proof:** gauge as pill segments on a dark track; optimal zone glows; value in a white pill that punches when it stops.
7. **Closing:** three-tone hero capsule pops in, halo, rays, gold plankton, sparkles.

All text: slide in with `cubic-out`, fade out with `cubic-in`. Every shot has ambient motion.

## Shot list
| # | Start–end | Framing | Content | Motion | Text | Transition out |
|---|---|---|---|---|---|---|
| 1 | 0–3 | wide | Sea with algae | algae sway, bubbles rise | "Omega 3 without fish?" | zoom into one alga |
| 2 | 3–6.5 | close-up | Alga → golden drop → aubergine capsule ×3 | scale/fade change | "From microalgae" [F2] / "960 mg EPA + DHA a day" [F3] | cross-fade 0.4 s |
| 3 | 6.5–10 | medium | Silhouette; drop rises to the heart | drop travels, heart beats | "Normal heart function" [F5] | camera moves up |
| 4 | 10–13.5 | medium | Head: brain and eyes light up | glow + pulse | "Normal brain & vision" [F6, F7] | camera pulls back |
| 5 | 13.5–16.5 | wide | Full silhouette + shield/bone/cell icons | icons cascade in | "+ vitamins D3, K2 & E" [F4, F8–F10] | wipe up |
| 6 | 16.5–20.5 | center | Omega-3 Index gauge | needle 4.8% → 7.9%, near the green 8–12 % zone | "+63.5% Omega-3 Index in 90 days*" [F12, F13] | cross-fade |
| 7 | 20.5–24 | center | Large capsule + name | capsule sways, shine | "RINGANA BEYOND omega" [F1] + disclaimer | fade to black |

## Shots

### Shot 1 · Algae sea (0–3 s)
- **Purpose:** hook with an unexpected question.
- **Framing:** wide, full background.
- **Layers (back to front):**
  - Background: rect #0E3B43, 0,0,1080,1920, gradient to #145560 at the top.
  - Algae: 6 elongated ellipses #4FA37B, base at y=1500–1920, height 300–600.
  - Bubbles: 10 white circles of 10–30 px, opacity 0.3.
- **Motion:** algae rotate ±6° in a 2 s loop (calm); bubbles rise 400 px.
- **Text:** "Omega 3 without fish?" — 88 px, centered at y=500, in at 0.3 s, out at 2.7 s.
- **Transition out:** zoom 1→2.5 into the central alga.

### Shot 2 · From alga to capsule (3–6.5 s)
- **Purpose:** plant origin and the daily dose.
- **Framing:** close-up.
- **Layers (back to front):**
  - Background: same as shot 1.
  - Central alga: ellipse #4FA37B.
  - Omega drop: 160 px circle #F2B33D + highlight.
  - Capsules ×3: rounded rects 300×130 #5B1F33 with a white highlight at 30 %, in a fan at the center.
- **Motion:** the alga scales to 0 while the drop grows 0→1 (3.2–4.2 s); the drop splits into 3 capsules that fan out (4.4–5.2 s) = "3 capsules a day".
- **Text:** "From microalgae" [F2] — 88 px, y=1400, 3.4–4.8 s; then "960 mg EPA + DHA a day" [F3] — 72 px, y=1400, 4.9–6.4 s.
- **Transition out:** cross-fade 0.4 s.

### Shot 3 · Heart (6.5–10 s)
- **Purpose:** first benefit.
- **Framing:** medium, torso.
- **Layers (back to front):**
  - Background #0E3B43.
  - Silhouette: head (220 px circle) + torso (rounded rect 420×700), #E8EFEA at 15 %.
  - Heart: 2 circles + triangle #FF7A59, 140 px, at x≈560, y≈900.
  - Small omega drop, 50 px, #F2B33D.
- **Motion:** the drop travels up to the heart (6.7–8 s); the heart beats (scale 1→1.15, 3 times) = life.
- **Text:** "Normal heart function" [F5] — 72 px, y=1500, 7.8–9.8 s.
- **Transition out:** camera moves up 600 px to the head.

### Shot 4 · Brain and vision (10–13.5 s)
- **Purpose:** second and third benefit.
- **Framing:** medium, head.
- **Layers (back to front):**
  - Enlarged head of the silhouette.
  - Brain: cloud of 5 circles #FF7A59, opacity 0.8.
  - Eyes: 2 white ellipses with #F2B33D irises.
- **Motion:** the brain glows 0→1 (10.5–11.5 s); the eyes open (scale Y 0.1→1 at 11.7 s).
- **Text:** "Normal brain & vision" [F6, F7] — 72 px, y=1500, 11–13.3 s.
- **Transition out:** camera pulls back to the full silhouette.

### Shot 5 · Extras (13.5–16.5 s)
- **Purpose:** the vitamins that come with the omega 3.
- **Framing:** wide.
- **Layers (back to front):**
  - Full silhouette.
  - 3 icons in a row at y=1250: shield (immunity), bone, cell with a spark; #F2B33D.
- **Motion:** icons appear with scale 0→1, 0.3 s apart.
- **Text:** "+ vitamins D3, K2 & E" [F4] — 72 px, y=1500; 40 px labels under the icons: "Immunity" [F8], "Bones" [F9], "Cells" [F10].
- **Transition out:** wipe up 0.4 s.

### Shot 6 · The proof (16.5–20.5 s)
- **Purpose:** show a measurable result, without overpromising.
- **Framing:** center.
- **Layers (back to front):**
  - Background #0E3B43.
  - Gauge bar: rounded rect 840×60 at x=120, y=900, split into 3 zones: 0–4 % #E4572E, 4–8 % #F2B33D, 8–12 % #4FA37B. Labels 32 px under it: "Low", "Medium", "Optimal".
  - Needle: triangle + "4.8%" label, white.
- **Motion:** the needle slides from 4.8% (x≈400) to 7.9% (x≈670) between 17 and 19 s with ease-out; the label counts up. It stops at the edge of the green zone = progress, honest.
- **Text:** "+63.5% Omega-3 Index in 90 days*" [F12] — 64 px, y=600, 17–20.3 s; footnote 28 px at y=1100: "*RINGANA study, 27 people, 3 capsules/day" [F12].
- **Transition out:** cross-fade 0.4 s.

### Shot 7 · Closing (20.5–24 s)
- **Purpose:** product and brand.
- **Framing:** center.
- **Layers (back to front):**
  - Background.
  - Large capsule 600×260 #5B1F33 at the center.
  - Diagonal shine.
- **Motion:** the capsule slowly sways ±8°; the shine crosses it between 21 and 22 s.
- **Text:** "RINGANA BEYOND omega" [F1] — 88 px, y=1300. 28 px disclaimer at y=1760, two lines: "Food supplement. Not a substitute for a varied diet or medical advice. Adults only."
- **Transition out:** fade to black 0.5 s.

## Recurring objects
- **Omega drop:** circle #F2B33D + white circle at 25 % in the top-left, opacity 0.6.
- **Capsule:** rounded rect #5B1F33 (2.3:1) + white highlight ellipse at 30 % along the top edge.
- **Silhouette:** 220 px head + neck + rounded torso, #E8EFEA at 15 %.

## Audio (optional)
- Voice-over: Kokoro (local), voice `af_bella`, one clip per shot. Voice timings belong to the Lienzo scene, not this brief (that scene was deleted on 2026-10-31). No music yet. Script:
  "Omega 3 without fish? / It comes straight from microalgae. Nine hundred sixty milligrams, every day. / Supporting a normal heart, your brain, and your vision. / With vitamins D3, K2 and E. / In their own study, levels rose sixty-three percent in ninety days. / BEYOND omega."

## Sources
- **Fact sheet:** `research.md` (same folder)
- **Verification:** passed on 2026-10-24 against the official product page and RINGANA's study PDF
- **Facts per shot:** 2: F2, F3 · 3: F5 · 4: F6, F7 · 5: F4, F8–F10 · 6: F12, F13 · 7: F1

## Feasibility notes
- Alga→capsule transformation → scale and cross-fade between shapes.
- Detailed organs → simple composed shapes.
- Gauge needle count-up → a text element updated by keyframes, or 4 discrete steps (4.8 → 6.0 → 7.0 → 7.9) if Lienzo can't animate numbers.

## Build prompt
> Use the lienzo-animate skill to build `videos/ringana-omega-v2/brief.md` in project `ringana` as scene `omega-v2`.
> Follow the brief exactly: shot timings, palette, layer names and text strings.
> Use a generator script. Save the scene, then hand over for joint-mode review.
