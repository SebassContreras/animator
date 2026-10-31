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
