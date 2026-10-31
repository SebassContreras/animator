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
Every video keeps its color tokens in `videos/<slug>/palette.json`, validated by `checkPalette` in `lib/palette.cjs`:
- **Roles:** `background`, `main`, `secondary`, `accent`, and `text`. Add roles when a piece needs more; never rename these five.
- **Tones:** Each role is `{ base, shadow?, highlight? }` with `#RRGGBB` values, so components can shade depth.
- **Single source:** The brief's palette table mirrors `palette.json`; if they differ, `palette.json` wins.

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
