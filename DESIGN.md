# Visual Design & Art Direction Standards

This document defines the visual design system, art direction standards, and aesthetic conventions for Animator. AI agents must follow these guidelines when creating video storyboards, palettes, and animations.

---

## 🎨 Visual Identity & Principles

### 1. Hard Language Rules
- **Repository & Output:** English in every code file, Markdown document, and on-screen text.
- **Human Interaction:** Spanish in conversation and chat with the user.

### 2. Context-Aware Art Direction
- Every new video must go through `lienzo-art-direction` (named style + frame review).
- Pick one named visual style from `skills/lienzo-art-direction/references/styles.md` to guide motion, typography, and staging.
- **Anti-Preference:** Avoid videos that feel "programmed" (raw default easing, linear mechanical motion, frozen idle frames, unconsidered layouts) instead of crafted and directed.

---

## 🌈 Palette Tokens & Primitives

### 1. Palette Structure (`palette.json`)
Every video maintains its color tokens in `videos/<slug>/palette.json`:
- **Roles:** Defined semantic roles (primary, secondary, background, text, accent).
- **Tones:** Each role supports structured tones (`base`, `shadow`, `highlight`) so components can shade depth reliably.

### 2. Primitive Defaults
- **Flat by Default:** All geometric primitives (`rect`, `ell`, `path`) must have `gradient: false` and `shadow: false` by default.
- *Rationale:* Lienzo's engine enables gradients and shadows by default, which frequently produces muddy or unintended visual artifacts unless explicitly requested by the art direction.

---

## 👁️ Typography & Readability

- **Contrast:** Maintain high text contrast (minimum 4.5:1 ratio against backgrounds).
- **Legibility:** Use phone-readable font sizes and adequate breathing room (`skills/lienzo-storyboard/references/craft.md`).
- **Pacing:** Give viewers sufficient dwell time to read on-screen copy before transitioning shots.

---

## 🚀 Learning & Refinement Promotion

- A visual pattern or reusable element moves from a video's `learnings.md` to `lib/` (as a reusable component) or to a skill only after it has been proven to render cleanly in a real video or verified in `scene_preview`.
- Global skills and `lib/` must only contain proven, durable visual patterns.
