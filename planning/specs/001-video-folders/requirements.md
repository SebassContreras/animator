# 001 — video-folders — Requirements

## What's being built

The repo reorganised so each video is one folder under `videos/<slug>/` holding everything about it, and the old `briefs/` and `lab/` locations are gone.

## Who it serves

Agents and the user starting, finding or fixing a video.

## Requirements

- R1@1: `videos/ringana-omega/` holds v1: `brief.md`, `research.md`, `palette.json`, `scene.gen.cjs`, `scene.json`, `learnings.md`.
- R2@1: `videos/ringana-omega-v2/` holds v2 with the same files; its `research.md` is not duplicated but its brief points to `../ringana-omega/research.md`.
- R3@1: `videos/viaje/` holds the road-trip piece: brief (moved from `skills/lienzo-storyboard/examples/viaje.md`), generator, scene and `viaje.baseline.json` only if it is still needed _(judgement, no standard)_.
- R4@1: Running each moved generator writes its `scene.json` inside its own folder, byte-identical to the scene it wrote before the move.
- R5@1: `briefs/` and `lab/` no longer exist, and no file outside history names them.
- R6@1: The skills (`lienzo-storyboard`, `lienzo-research`, `lienzo-animate`, `lienzo-art-direction`) and `README.md` tell agents to read and write videos at `videos/<slug>/`.
- R7@1: `README.md` no longer names `LIENZO-IMPROVEMENTS.md`, which does not exist in this repo.

## Out of scope

- The shared library (002), the template (003), splitting `LOG.md` (004).

## Dependencies

None.

## Owner split

All agent tasks.
