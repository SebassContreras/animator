# Product Vision & Scope

This document defines the product purpose, target audience, core user problems, and functional boundaries for Animator. AI agents must consult this document to understand the *why* and *what* before proposing features or modifying scope.

---

## 1. Value Proposition & Vision

Animator is a set of agent skills plus a shared Node library for making animated videos with Lienzo. Each video lives in its own folder with its theme, brief, research, brand snapshot, palette overrides, generator, and learnings. The brand (colours, fonts, canvas defaults, guide) belongs to the Lienzo project; a video starts from it and records only what it changes. What a video proves to work is promoted to a shared library (`lib/`) or to the skills, so every new video starts from everything already learned.

---

## 2. Target Audience & Personas

- **Primary Persona:** The human creator/director creating Lienzo video animations.
- **Agent Collaborators:** AI coding agents that research, storyboard, art-direct, and build Lienzo videos using these skills.

---

## 3. Core Problems Solved

| Problem | How Animator Solves It |
|---|---|
| Video animation logic is repetitive and hard to reuse across pieces | Centralizes reusable components in `lib/` and encodes motion/storyboard patterns into agent skills |
| Lienzo video setups drift in structure | Enforces a deterministic folder structure per video (`brief.md`, `brand.lock.json`, `palette.json`, `scene.gen.cjs`, `scene.json`, `learnings.md`) |
| Visual defects (unwanted gradients/shadows, low contrast) recur across videos | Art-direction standards and flat-by-default primitives prevent common visual regressions |

---

## 4. Key Functional Capabilities

1. **Deterministic Video Folders:** One folder per video (`videos/<slug>/`) with a fixed set of files.
2. **Palette-Driven Shared Library:** Shared generator library (`lib/`) whose components take the palette and the fonts as parameters rather than hardcoding a brand's colours or fonts.
3. **Template Bootstrapping:** Template to spin up a new video quickly.
4. **Learning Promotion Pipeline:** Systematic close-out step that promotes proven video learnings to `lib/` or agent skills.
5. **Reference Artifact:** Canonical reference video (`ringana-omega-v2`) with documented learnings.

---

## 5. Non-Goals & Boundaries

- **Lienzo Engine Modifications:** Engine improvements are tracked and implemented in the Lienzo repository itself.
- **New Videos as Roadmap Work:** Specs improve the skills and `lib/`. Making a new video is a use of the skills (README § Make a video), not a spec; `videos/<slug>/` holds the reference video and the sources for learning promotion.
- **Registry Publishing:** Publishing skills to an external public registry is out of scope for now.
