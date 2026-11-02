# Architecture & Decision Changes

This document maintains a permanent ledger of architectural pivots, deprecated decisions, and significant scope modifications. It prevents agents from reintroducing rejected patterns and provides context on why the system evolved.

---

## 🔄 Change Protocol

When an existing architectural design or requirement needs to change:

1. **Document the Rationale:** Add a new entry to the [Change Log](#change-log) below with date, what changed, why, and what was replaced.
2. **Update the Spec:** In the affected spec (`planning/specs/NNN-name.md`):
   - Strike through the obsolete item and point to the replacement (e.g., `- ~~D1: Sessions in localStorage~~ → D2`).
   - Add explicit cleanup tasks to remove obsolete code, tests, and documentation.
3. **Update Root Context:** If the change modifies system boundaries or visual guidelines, update `PRODUCT.md`, `ARCHITECTURE.md`, or `DESIGN.md` accordingly.

---

## 📜 Change Log

### 2026-11-02 — Brand Directory Hierarchy and User Video Git-Ignorance

- **Scope:** `videos/` folder structure, `ARCHITECTURE.md`, `PRODUCT.md`, `DESIGN.md`, `README.md`, skills (`skills/lienzo-*`), `.gitignore`, and video test suites (`tests/videos/`).
- **What Changed:**
  - Videos are organized hierarchically by brand: `videos/<brand>/<video>/`.
  - Brand identity, guide, and snapshot live at the brand level: `videos/<brand>/brand.lock.json` and `videos/<brand>/brand.md`.
  - Individual video artifacts live under their respective brand: `videos/<brand>/<video>/` (`brief.md`, `palette.json`, `scene.gen.cjs`, `scene.json`, `learnings.md`, and optional `research.md`).
  - RINGANA is migrated from flat root folders to its brand folder `videos/ringana/` (`omega-v2`, `skin-perfection`), treated as a regular brand rather than a special fixture.
  - User video workspaces (`videos/*`) are ignored in `.gitignore`, preserving only `videos/.gitkeep` and `videos/_template/`, matching Lienzo's `projects/*` privacy and anti-bloat model.
  - Generators resolve `brand.lock.json` from `./brand.lock.json` (local override) or `../brand.lock.json` (brand root), and import `lib/` regardless of folder depth.
  - Video test suites (`tests/videos/`) recursively discover videos and run golden tests when fixtures/generators exist locally.
- **Why:**
  - Flat `videos/<slug>/` previously mixed tool library development with user video production, bloated git history with generated scene JSONs, lacked a dedicated brand container for shared brand guides, and duplicated brand snapshots per video.
- **Replaced Items:**
  - Flat `videos/<slug>/` layout, committing user video folders to git, and per-video duplication of brand knowledge.


### 2026-10-31 — Research Principle Gated by Decision Impact

- **Scope:** `ENGINEERING.md` §8, `AGENTS.md`, `ARCHITECTURE.md`, spectrace skills.
- **What Changed:**
  - ENGINEERING.md §8 now requires research only when the decision needs it and cites sources as `Source: <url> (accessed YYYY-MM-DD)`.
  - Principle lists in AGENTS.md and ARCHITECTURE.md name research and trade-offs; spectrace skills updated to the current suite.
- **Why:**
  - Spectrace added principle 7: research is required only when the choice is hard to reverse, depends on a fact outside the repository, or breaks a factual tie. Mandatory research on every choice invites invented citations and ritual browsing; gating it keeps citations where they change the decision.
- **Replaced Items:**
  - §8 "Verify Against Official Sources" (research every non-trivial choice).

### 2026-10-31 — Engine Findings Tracked by Lienzo Specs

- **Scope:** `learnings.md` format (004/R5, 004/D4), `lienzo-animate` close-out, spec 013.
- **What Changed:**
  - An `Engine` finding may end with `— tracks: Lienzo spec <NNN>` instead of a Lienzo issue URL; issue URLs stay valid (omega-v2). Close-out asks whether to open a Lienzo spec, not to file an issue.
- **Why:**
  - The user wants engine work written as specs in the Lienzo repo, where its planning already lives, and no GitHub issues.
- **Replaced Items:**
  - 004/R5 and 004/D4 → 013/R11 and 013/D7 (tasks 013/T008, T009).

### 2026-10-31 — Brand From Lienzo (spec 011)

- **Scope:** `lib/`, the video template, `ringana-omega-v2`, the skills, and the root contracts.
- **What Changed:**
  - The Lienzo project owns the brand. Each video has `brand.lock.json`, a snapshot written from `project_inspect` by `brandLock` (`lib/brand.cjs`), and `palette.json` holds only overrides and story roles.
  - Palette roles go back to Lienzo's names: `main` → `primary` (plus optional `surface`), reversing the 2026-10-31 governance entry below, so both repos share one vocabulary.
  - `resolvePalette` merges brand colours and overrides and derives missing tones with `tones(base)` (OKLCH, CSS Color 4 gamut mapping); a missing required role fails, naming it.
  - `lib/` names no brand font: `sceneHelpers` requires `fonts` (`brandFonts(lock)`), with Inter 800 / 400 as the system default.
  - A scene's audio belongs to the Lienzo scene; briefs keep the voice script only. The brief's palette table no longer repeats hex values.
- **Why:**
  - Brand values were copied into each video by hand, so brand changes never reached a video, and duplicated data (voice timings, palette hexes) drifted.
- **Replaced Items:**
  - The `main` palette role, hand-picked brand colours in each `palette.json`, and Montserrat hardcoded in `lib/scene.cjs`.

### 2026-10-31 — Governance: Align Contracts With Spectrace 0.32

- **Scope:** Root contracts, spec 004, roadmap, and ignore files.
- **What Changed:**
  - Restored project rules lost in the 2026-10-30 migration: sync before status (`AGENTS.md`), the test run rule, regression-first, and visual-quality checks (`TESTING.md`), and verification against official sources (`ENGINEERING.md`).
  - Single responsibility: language and learning-promotion rules left `DESIGN.md` (owned by `AGENTS.md` and `ARCHITECTURE.md`); flat-primitive rule left `AGENTS.md` (owned by `DESIGN.md`).
  - `ENGINEERING.md` § DIP now states the real Lienzo boundary (scene JSON) instead of requiring speculative adapters.
  - `PRODUCT.md` non-goal "Producing New Videos" reworded: videos are made with the skills, but making one is not spec work. This matches the README and `videos/`.
  - `DESIGN.md` now matches the skills: palette roles `background`/`main`/`secondary`/`accent`/`text` (was "primary"), scene-level `defaults: "flat"`, and the readability numbers from `craft.md`. The skills win when the two differ.
  - `ARCHITECTURE.md` directory map lists `.agents/skills/`, `videos/_template/`, the `lib/` modules, and the test folders. `TESTING.md` documents the guard tests (golden, template, lib-list). `README.md` adds art direction and close-out to "Make a video".
  - Removed stale `blocked:` notes on done tasks and the `.spectrace/changes/` reference in spec 004; dropped `.spectrace/` entries from `.gitignore`.
- **Why:**
  - Keep each contract single-purpose and consistent with the `spectrace-init` upgrade checklist.
- **Replaced Items:**
  - Legacy `.spectrace/` runtime paths and the local `core.hooksPath=.githooks` setting.

### 2026-10-30 — Governance: Upgrade to Spectrace 7-Contract Suite

- **Scope:** Repository governance, agent execution protocol, and contract structure.
- **What Changed:**
  - Migrated repository governance to the Spectrace 7-contract progressive disclosure suite: `PRODUCT.md`, `ARCHITECTURE.md`, `ENGINEERING.md`, `DESIGN.md`, `TESTING.md`, `CHANGES.md`, and `AGENTS.md`.
  - Upgraded Spectrace skills (`spectrace-init`, `spectrace-plan`, `spectrace-change`, `spectrace-review`) to latest versions.
  - Retired obsolete `.githooks/` and mandatory commit trailers (`Spec: NNN/TNNN`) in favor of standard Conventional Commits.
  - Relocated durable decisions out of `planning/` (`product.md`, `architecture.md`, `styles.md`, `changes.md`) directly to the project root.
- **Why:**
  - Decoupled root contracts provide immediate discovery for modern AI agents without searching nested folders.
  - Pure Markdown and standard Git conventions eliminate cross-platform shell hook failures.
- **Replaced Items:**
  - Retired `.githooks/` and trailer verification scripts.

### 2026-10-25 — Lienzo Features Promoted Without a Video

- **Scope:** Learning promotion rule (`lib/` and skills).
- **What Changed:**
  - Lienzo native features can now be promoted to `lib/` and skills once proven in `scene_preview`, without requiring a full end-to-end video production.
- **Why:**
  - Lienzo 051–062 added native shots, camera, opacity, origin and more; skills and `lib/` needed updates without waiting to remake old videos.
- **Tasks:**
  - 010/T005, 010/T006.
