# Visual Design & Art Direction Standards

This document defines the visual design system, art direction standards, and aesthetic conventions for Animator. AI agents must follow these guidelines when creating video storyboards, palettes, and animations.

The skills hold the detailed rules and numbers. This file summarizes them; if the two differ, the skill wins, and this file is updated to match.

---

## 🎨 Visual Identity & Principles

### 1. Art Direction
- Every new video must go through `lienzo-art-direction` (named style + frame review with `skills/lienzo-art-direction/references/review.md`).
- **One style per piece:** pick one named style from `skills/lienzo-art-direction/references/styles.md` to guide shapes, shading, type, and motion.
- **Fewer, better pieces:** 3–5 tones per object, ≤ 30 elements per shot; detail goes on the focal object only.
- **Anti-Preference:** Avoid videos that feel "programmed" (raw default easing, linear mechanical motion, frozen idle frames, unconsidered layouts) instead of crafted and directed.

---

## 🌈 Palette Tokens & Primitives

### 1. Palette Structure (`palette.json`)
A video's palette is resolved by `resolvePalette(lock, require("./palette.json"))` in `lib/palette.cjs`: the brand's colours from `brand.lock.json`, then `videos/<slug>/palette.json`, which holds only overrides and story roles.
- **Roles:** Lienzo's `background`, `primary`, `secondary`, `accent`, and `text` (required after resolution) and `surface` (optional). Add story roles when a piece needs more; never rename these five.
- **Tones:** Each role is `{ base, shadow?, highlight? }` with `#RRGGBB` values, so components can shade depth. A tone left out is derived by `tones(base)` in OKLCH: shadow −12 L (−8 under L 40), chroma ×0.85, hue up to 6° toward blue-violet; highlight +12 L (at most 97), hue up to 6° toward yellow. Shadows stay cool and highlights warm, never muddy.
- **Single source:** hex values live only in `palette.json` and the brand; the brief's palette table names each override and story role with what it paints.

### Brand inheritance
What the video sets wins; anything it leaves out comes from the brand; anything the brand lacks comes from the system:

| Value | Video | Brand (`brand.lock.json`) | System |
|---|---|---|---|
| colour role or tone | `palette.json` | brand palette + derived tones | none: a missing required role fails, naming it |
| fonts | the generator passes its own `fonts` to `sceneHelpers` | `brandFonts(lock)`: heading at its heaviest weight, body at its lightest | `DEFAULT_FONTS`: Inter 800 / Inter 400 |
| duration | the brief | `canvas.duration`, confirmed by the user | never reached |

Of the canvas, only `duration` is inherited; `width`, `height` and `fps` stay in each generator.

### 2. Primitive Defaults
- **Flat Scenes:** Every compact scene sets `"defaults": "flat"`, and the background turns off `gradient`, `dots`, and `spotlight` explicitly.
- **Flat Primitives:** `lib/primitives.cjs` (`rect`, `ell`, `path`) emit no gradient, no shadow, and no border unless the caller overrides them.
- *Rationale:* Lienzo turns gradients, shadows, and borders on by default, which produces muddy visual artifacts unless the art direction asks for them.

---

## 👁️ Typography & Readability

- **Language:** All on-screen text is English.
- **Contrast:** Text contrast ≥ 4.5:1 against what is behind it.
- **Legibility:** Titles ≥ 64 px on 1080-wide canvases; ≤ 7 words per line and ≤ 2 lines on screen at once (`skills/lienzo-storyboard/references/craft.md`).
- **Pacing:** Each line stays on screen ≥ 1.5 s; the final image holds ≥ 1.5 s with the message.
