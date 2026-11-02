# 014 — brand-hierarchy-and-git-ignore

## Goal
Organize Animator videos hierarchically under their brand (`videos/<brand>/<video>/`), house brand-level preferences, guides and snapshots at `videos/<brand>/`, and align `.gitignore` with Lienzo (`videos/*` ignored except `_template/` and `.gitkeep`). Verification: `pnpm test` passes with full regression coverage across all brands.

## Context
- Animator previously kept videos in a flat structure (`videos/<slug>/`).
- Every video had its own `brand.lock.json` copied independently, with no brand-level folder in Animator.
- All user videos were tracked by git, mixing tool library code with client/user video production artifacts.
- Lienzo isolates brands as projects (`projects/<project>/`) and ignores user projects in git (`projects/*`).
- RINGANA was treated as a fixture in `videos/ringana-*` rather than a regular brand.

## Requirements
- R1: Directory layout follows `videos/<brand>/<video>/`.
- R2: Brand-level assets live at `videos/<brand>/brand.lock.json` and `videos/<brand>/brand.md`.
- R3: Video-level assets live at `videos/<brand>/<video>/`: `brief.md`, `palette.json`, `scene.gen.cjs`, `scene.json`, `learnings.md`, and optional `research.md`.
- R4: `scene.gen.cjs` resolves `brand.lock.json` from `./brand.lock.json` (override) or `../brand.lock.json` (brand root), and imports `lib/` cleanly regardless of folder depth.
- R5: `videos/*` is ignored in `.gitignore`, preserving only `videos/.gitkeep` and `videos/_template/`.
- R6: `tests/videos/` recursively discovers videos across brands and runs tests for any video present locally.
- R7: RINGANA is migrated into `videos/ringana/` (`omega-v2`, `skin-perfection`).

## Design
- D1: `videos/<brand>/` contains `brand.lock.json` (snapshot from `project_inspect`) and `brand.md` (written brand guide and preferences).
- D2: `videos/<brand>/<video>/scene.gen.cjs` reads `../brand.lock.json` (falling back to local) and resolves repo root dynamically or via `../../../lib/`.
- D3: `.gitignore` ignores `videos/*` except `.gitkeep` and `_template/`.
- D4: `tests/videos/scenes.test.cjs` and `tests/videos/learnings.test.cjs` scan `videos/` recursively for `scene.gen.cjs` and `learnings.md`.

## Tasks

- [x] 014/T001 [agent] Update `.gitignore` and `.agentignore` to ignore `videos/*` except `.gitkeep` and `_template/` — covers R5, D3
- [x] 014/T002 [agent] Create brand folders and migrate existing videos (`videos/ringana/`, `videos/pulse-metrics/`, `videos/botanica-lab/`) — covers R1, R2, R3, R7, D1
- [x] 014/T003 [agent] Update `videos/_template/scene.gen.cjs` and migrated video generators to resolve `brand.lock.json` and `lib/` cleanly — covers R4, D2
- [x] 014/T004 [agent] Update `tests/videos/` test suites (`scenes.test.cjs`, `learnings.test.cjs`, `template.test.cjs`) to support brand hierarchy — covers R6, D4
- [x] 014/T005 [agent] Update root contracts (`ARCHITECTURE.md`, `PRODUCT.md`, `DESIGN.md`, `README.md`) and skills (`skills/lienzo-*`) — covers R1, R2, R3
- [x] 014/T006 [agent] Verify full test suite passes with `pnpm test` and git status is clean — covers R6
