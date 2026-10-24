# RINGANA omega 3 · v2 (art direction pass)

Same piece as `briefs/ringana-omega.md`: identical idea, concept, shot list, timings, on-screen text, facts and voice-over. Only the look changes, made with the `lienzo-art-direction` skill. Generator: `lab/ringana-omega-v2.gen.cjs`, scene `omega-v2` in project `ringana`.

## Visual style
- **Style:** Bright science — keeps the dark sea and the product's aubergine; keeps Montserrat (brand) instead of a rounded sans.
- **References:** Kurzgesagt (flat shading, glow on the focal object, layered depth); TED-Ed (simple organ icons).
- **Palette:** each colour of v1 gets a shadow and a highlight tone.
  | Role | Shadow | Base | Highlight |
  |---|---|---|---|
  | sea (gradient) | #072630 | #0E3B43 | #1A6470 |
  | algae | #2E6E52 | #4FA37B | #8FD3A8 |
  | omega drop | #C9861C | #F2B33D | #FFE08A |
  | capsule | #3A1020 | #5B1F33 | #8A3A55 |
  | organ | #D9533A | #FF7A59 | #FFB199 |
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
