# RINGANA FRESH skin perfection · recovery cream reel

## Idea
- **Message:** FRESH skin perfection is a rich recovery cream with ceramides for the skin barrier, measured at 14 % less wrinkle depth in 2 weeks on average.
- **Audience:** from the brand guide: adults interested in natural wellbeing, RINGANA customers and partners; here, people with dry or demanding skin.
- **Platform / format:** Instagram reel / TikTok, 1080×1920, 30 fps
- **Duration:** 20 s — the brand's `canvas.duration`, confirmed by the user (2026-10-31) — goal: completion — accepted (guide: 15–30 s default)
- **Mandatory text / brand:** the product name with the brand first, "RINGANA FRESH skin perfection"; the study footnote with its sample size; English on screen. No food-supplement disclaimer (it is a cosmetic).

## Brand
- **Lienzo project:** `ringana` (snapshot in `brand.lock.json`)
- **Overrides:** none
- **Precedence:** what this video sets (`palette.json`, this brief) wins; anything it leaves out comes from the brand; anything the brand lacks comes from the system defaults (`DESIGN.md` → Brand inheritance).

## Concept
- **Angles considered:** (a) build-up: the skin barrier as soft cells with gaps that a cream drop seals, ceramides as the mortar; (b) origin: the resurrection plant and Alpine willowherb become a cream; (c) ritual: one cream for face, neck, lips and eyes, morning to night.
- **Chosen:** (a), with (b) as one beat — the barrier is the product's clearest page claim, and cells closing up show it without hype.
- **Story in one line:** moisture escapes between the cells → a cream drop spreads into a film and ceramides fill the gaps → moisture stays → the actives → the measured result → the product.

## Visual style
- **Style:** Soft depth — kept: organic blobs and pills, two-colour vertical gradients on big shapes, a soft shadow only under the focal object, `cubic-out` / `ease-in-out`, long fades, slow `breathe`, no bounces. Changed: the brand's white background instead of the warm off-white, the brand fonts (Montserrat 800 / 500) instead of DM Sans, and the brand's orange as the accent. The brand guide prefers Bright science; Soft depth was chosen with the user to fit a cosmetic and to test a style with no verified piece yet.
- **References:** the product page's own photography (white pedestal, cream texture, bright background); Buck and Oddfellows reels (soft organic shapes, slow eased motion).
- **Palette:** overrides and story roles only; hex values live in `palette.json`, brand roles come from the brand
  | Role | What it paints |
  |---|---|
  | skin | the skin cells and the big backdrop blobs |
  | cream | the cream drop, the film and the bottle body |
  | blush | the foreground blobs, the pedestal and the willowherb flowers |
  | sage | the willowherb stem and leaves, the far hills |
  | moisture | the moisture droplets |
  | `accent` (brand) | the ceramide mortar and the accent bars of the stat cards — never text: orange on white is 3.2:1 |
  | `surface` (brand) | the stat cards and the ingredient pills |
- **Shapes:** round family only: pills and blobs, corner radius ≈ 50 % of the short side on cells and pills; no outlines.
- **Light:** from the top-left in every shot; the shadow tone on the bottom-right of each object, the highlight on its top-left edge (tones derived by `tones`).
- **Typography:** brand fonts; titles 72 px heading, support 44–48 px body, footnote 30 px body; all text `text` (black).
- **Mood:** calm, caring, precise
- **Motion language:** slow and soft: entries `cubic-out` 0.5–0.7 s, moves `ease-in-out`, exits `cubic-in`; ambient `breathe` (scale 0.98–1.02, 3 s) and slow drift; camera push-in ≈ 4 % per shot. Text slides in 30 px with `cubic-out` and fades out with `cubic-in` (brand guide).

## Shot list
| # | Start–end | Framing | Content | Motion | Text | Transition out |
|---|---|---|---|---|---|---|
| 1 | 0–3.5 | close-up | Skin cells with gaps; moisture droplets escape | droplets rise and fade, cells breathe | "Dry skin? Weakened barrier?" [F7] | cross-fade 0.4 s |
| 2 | 3.5–7 | close-up | A cream drop lands, spreads into a film; orange mortar fills the gaps | drop descends, morphs to film, mortar grows | "Ceramides strengthen the skin barrier" [F2] | cross-fade 0.4 s |
| 3 | 7–10.5 | medium | One cell, close; droplets float inside; two ingredient pills | droplets float, cell breathes, pills slide in | "Ectoin + hyaluronic acid" / "Moisturising" [F4] | cross-fade 0.4 s |
| 4 | 10.5–13.5 | medium | Alpine willowherb grows in front of soft hills; a bakuchiol drop floats | stem grows from its base, sways; hills drift | "Bakuchiol & Alpine willowherb" [F3, F5] | cross-fade 0.4 s |
| 5 | 13.5–17 | center | Two stat cards, one after the other; a wrinkle line smooths | numbers count up, line morphs flatter | "−14 %" / "wrinkle depth in 2 weeks*" then "Up to 49 %" / "better skin barrier*" [F9] + footnote [F8] | cross-fade 0.4 s |
| 6 | 17–20 | center | The bottle on a pedestal | bottle rises into place, breathes | "RINGANA FRESH skin perfection" / "Recovery cream" [F1] | hold to the end |

## Shots

### Shot 1 · Thirsty skin (0–3.5 s)
- **Purpose:** hook: the problem the page lists first, shown as moisture leaving.
- **Framing:** close-up of a skin surface seen as soft cells; slow push-in 1 → 1.04.
- **Layers (back to front):**
  - Back blob: organic blob path ≈ 1300×1300 centred at (540, 1000), vertical gradient `skin.highlight` (top) → `skin.base` (bottom), opacity 0.7.
  - Skin cells (group "Skin cells"): 3 rows of 4 pills ≈ 210×120, radius 60, in a brick pattern (rows offset by half a pill), top row at y 880, row step 148, gap 28 px; each cell `skin.base` with a `skin.shadow` crescent bottom-right and a `skin.highlight` sliver top-left; sizes vary ±8 % and positions ±6 px so the rows are not mechanical. Name them "Cell 1" … "Cell 12".
  - Moisture droplets (group "Escaping moisture"): 6 teardrops 36–56 px, `moisture.base` with a `moisture.highlight` dot, starting inside the gaps between the cells.
  - Front blob: `blush.shadow` blob ≈ 600×500 at bottom-left, partly out of frame (x −180, y 1560), opacity 0.8.
- **Motion:**
  - Droplets: rise 320 px and fade to 0 over 1.4 s with `cubic-in`, staggered 0.25 s, `repeat: loop` until 3.5 s — moisture is being lost.
  - Cells: `breathe` 0.98–1.0, 3 s; back blob drifts 20 px right, linear.
- **Text:** "Dry skin? Weakened barrier?" [F7] — 72 px heading, `w` 920 at x 80 (wraps to 2 lines), y 330, in 0.4 s, out 3.2 s.
- **Transition out:** cross-fade 0.4 s.

### Shot 2 · The cream lands (3.5–7 s)
- **Purpose:** the product acts: a film on top, ceramides in the gaps.
- **Framing:** same close-up as shot 1 (the cells redrawn in this shot at the same place), push-in 1.04 → 1.08.
- **Layers (back to front):**
  - Back blob and skin cells: as in shot 1.
  - Ceramide mortar (group "Ceramide mortar"): one `accent.base` pill in each gap (28 px wide, the gap's length), radius 14.
  - Cream drop: blob path ≈ 240×290 (rounded teardrop, point up), `cream.base` with a `cream.shadow` crescent bottom-right and a `cream.highlight` sliver top-left; soft shadow ellipse 220×40 `skin.shadow` at 30 % under it on the cells (the only `shadow` of the shot).
  - Cream film: the same path's second shape — a wide flat blob 900×90 lying over the top row of cells at y 840 (`path` morph between the two shapes).
  - Kept moisture: 6 droplets as in shot 1, now under the film.
- **Motion:**
  - Drop: enters from y −300 to y 560 (3.7–4.5 s, `cubic-out`, no overshoot), holds 0.2 s, then morphs into the film (4.7–5.4 s, `ease-in-out`); its shadow ellipse widens with it.
  - Mortar: each pill scales X 0 → 1 from its centre, `cubic-out` 0.4 s, staggered 0.08 s from the centre outwards, 5.2–6.2 s — the barrier closes.
  - Droplets: rise only until the film, then bob ±8 px (`float`, 2 s) — moisture stays in.
- **Text:** "Ceramides strengthen the skin barrier" [F2] — 72 px heading, `w` 920 at x 80, y 330, in 5.0 s, out 6.8 s.
- **Transition out:** cross-fade 0.4 s.

### Shot 3 · Moisture, held (7–10.5 s)
- **Purpose:** the moisturising actives.
- **Framing:** medium: one cell fills the frame's middle; push-in 1 → 1.04.
- **Layers (back to front):**
  - Back blob: as in shot 1, centred at (540, 960).
  - Big cell: pill 700×420 at (190, 720), radius 210, `skin.base` with shadow crescent and highlight sliver, a 30 px `cream.base` film along its top edge.
  - Droplets inside (group "Moisture inside"): 5 teardrops 50–80 px, `moisture` tones, spread inside the cell, sizes 1 : 0.7 : 0.5.
  - Ingredient pills: two `surface.base` pills 380×96, radius 48, with a soft shadow (low opacity, large blur), at (120, 1240) and (580, 1240); each holds a 40 px body label: "Ectoin", "Hyaluronic acid".
- **Motion:**
  - Droplets: `float` ±12 px, periods 2.4–3.2 s, each a different phase.
  - Cell: `breathe` 0.98–1.0, 3 s.
  - Pills: slide up 40 px and fade in, `cubic-out` 0.5 s, at 8.0 s and 8.15 s.
- **Text:** "Ectoin + hyaluronic acid" [F4] — 72 px heading, y 330, in 7.4 s, out 10.3 s. "Moisturising" [F4] — 48 px body, y 1440, in 8.6 s, out 10.3 s. (The pill labels are names, not extra lines: two text lines plus two labels.)
- **Transition out:** cross-fade 0.4 s.

### Shot 4 · Plant actives (10.5–13.5 s)
- **Purpose:** origin: the plant actives behind the cream.
- **Framing:** medium; three planes with parallax.
- **Layers (back to front):**
  - Far hills: two rounded mountain blobs across the frame bottom third (y 1150–1700), `sage.highlight` at 60 % and 40 % opacity — atmospheric, the farthest lightest.
  - Alpine willowherb: a stem path from (440, 1700) up to (520, 900), `sage.base` with a `sage.shadow` side; 4 leaf blobs along it (3 tones of sage); at its top a spike of 5 small `blush` flower blobs (base, shadow, highlight). Group height twice the plant so `swing` pivots on the base.
  - Bakuchiol drop: rounded teardrop 150×180 `cream` tones at (720, 980), soft shadow ellipse under it.
  - Front blob: `sage.shadow` blob ≈ 500×400 at bottom-right, partly out of frame.
- **Motion:**
  - Willowherb: grows `@scale` Y 0 → 1 from its base (10.6–11.4 s, `cubic-out`), flowers pop in staggered 0.1 s (fade + scale 0.8 → 1, no overshoot), then `swing` ±3°, 3 s.
  - Drop: fades in at 11.2 s and `float`s ±10 px, 2.6 s.
  - Hills: drift 30 px left, linear; front blob drifts 60 px left (parallax).
- **Text:** "Bakuchiol & Alpine willowherb" [F3, F5] — 72 px heading, `w` 920 at x 80, y 330, in 11.0 s, out 13.3 s.
- **Transition out:** cross-fade 0.4 s.

### Shot 5 · Measured (13.5–17 s)
- **Purpose:** proof, attributed and without overpromising.
- **Framing:** center, still background, push-in 1 → 1.03.
- **Layers (back to front):**
  - Back blob: `skin` gradient blob as in shot 1, opacity 0.5.
  - Wrinkle line: a soft wavy path 700×120 at (190, 560), 14 px wide pill-ended stroke in `skin.shadow`; second shape almost flat (amplitude ÷ 3).
  - Stat card 1: `surface.base` pill 840×300 at (120, 780), radius 60, soft shadow; a 12×200 `accent.base` bar at its left inside edge; number "−14 %" 120 px heading at y 820; label "wrinkle depth in 2 weeks*" 44 px body at y 960, both `text`.
  - Stat card 2: same card at the same place; "Up to 49 %" 120 px heading; label "better skin barrier*" 44 px body.
  - Footnote: "*Research Centre study, 23 participants, 2 weeks." 30 px body, `w` 920 at x 80, y 1620.
- **Motion:**
  - Card 1 in at 13.7 s (slide 30 px + fade, `cubic-out` 0.5 s); its number counts −0 → −14 % (13.9–14.9 s, steps of 2); the wrinkle line morphs flatter over the same time (`ease-in-out`). Card 1 out at 15.4 s (fade `cubic-in` 0.25 s).
  - Card 2 in at 15.5 s; its number counts 0 → 49 % (15.6–16.4 s, steps of 7); out with the shot.
  - Footnote: fades in at 13.8 s, stays to 17 s.
- **Text:** "−14 %" + "wrinkle depth in 2 weeks*" [F9] (13.7–15.4 s); "Up to 49 %" + "better skin barrier*" [F9] (15.5–17 s); footnote [F8] (13.8–17 s). Card 2 holds 1.5 s.
- **Transition out:** cross-fade 0.4 s.

### Shot 6 · The product (17–20 s)
- **Purpose:** name the product and hold the final image.
- **Framing:** center; slow push-in 1 → 1.04.
- **Layers (back to front):**
  - Back blob: big `skin` gradient blob centred at (540, 900), `breathe` 3 s.
  - Pedestal: `blush.base` pill 520×90 at (280, 1180) with a `blush.highlight` top edge; soft shadow ellipse 560×50 under it.
  - Bottle (group "FRESH skin perfection bottle", focal, the only `shadow`): body rounded rect 240×430 at (420, 740), radius 40, `cream.base`, a `cream.highlight` stripe on the left third, a `cream.shadow` band on the right fifth; cap rounded rect 240×170 at (420, 580), radius 30, `background.base` (white) with a `surface.shadow` right band; a small `sage.base` sprig mark centred on the body at y 900.
- **Motion:**
  - Bottle: rises 60 px and fades in (17.2–17.9 s, `cubic-out`), then `breathe` 0.99–1.01, 3 s; pedestal fades in first (17.1 s), the bottle 0.1 s after.
- **Text:** "RINGANA FRESH skin perfection" [F1] — 64 px heading (long title: low end), `w` 920 at x 80 (wraps to 2 lines), y 1330, in 17.6 s, stays to the end. "Recovery cream" [F1] — 44 px body, y 1510, in 17.9 s, stays to the end. Final hold 2.1 s.
- **Transition out:** none; the last frame holds.

## Recurring objects
- **Skin cell:** pill (≈ 1.75 : 1), radius 50 % of its height; base `skin.base`, shadow crescent bottom-right `skin.shadow`, highlight sliver top-left `skin.highlight`. Varies ±8 % in size.
- **Moisture droplet:** teardrop path, point up, `moisture.base` with a `moisture.highlight` dot top-left at 70 % opacity.
- **Cream drop / bakuchiol drop:** rounded teardrop, `cream` three tones, with a soft shadow ellipse under it.
- **Back blob:** one organic blob path reused at different sizes, vertical two-colour gradient of its role, low opacity.

## Audio (optional)
- None in this version: no voice-over and no music. Decision: this test checks the visual pipeline and a new style first; voice can be added in the Lienzo scene later.

## Sources
- **Fact sheet:** `videos/ringana-skin-perfection/research.md`
- **Verification:** passed on 2026-10-31 against the official product page (open question: study attribution, see research.md)
- **Facts per shot:** 1: F7 · 2: F2, F12 · 3: F4 · 4: F3, F5 · 5: F8, F9 · 6: F1

## Feasibility notes
- Drop spreading into a film → one `path` with two shapes morphing (no `"mode": "layers"`).
- Mortar closing the gaps → pills scaling X from their centre (`origin` at the centre).
- Wrinkle line smoothing → path morph between a wavy and a nearly flat shape.
- Counting numbers → `countUp` track on a label (`lib/motion.cjs`), stepped.
- Plant growing → `@scale` Y from 0 with `origin` at the stem base.
- Cells in shots 1 and 2 are drawn once as a function and placed in both shots (native shots do not share elements).

## Build prompt
> Use the lienzo-animate skill to build `videos/ringana-skin-perfection/brief.md` in project `ringana` as scene `skin-perfection`.
> Follow the brief exactly: shot timings, palette, layer names and text strings.
> Use a generator script. Save the scene, then export mp4 for review.
