# 009 — keep-omega-v2 — Requirements

## What's being built

The repo keeps one video, `videos/ringana-omega-v2/` (the one the user rated best), and drops the earlier videos and the `lib/` pieces only they used.

## Who it serves

The user and the agents that build videos: one reference video, no pieces nobody uses.

## Requirements

- R1@1: `videos/viaje/` and `videos/ringana-omega/` are removed, with their golden fixtures and the tests that ran them; `videos/ringana-omega-v2/` and `videos/_template/` stay unchanged.
- R2@1: `lib/` no longer exports `car`, `house`, `cloud`, `dashes` or `nameAll`, and their tests and their lines in the `lienzo-animate` "Start from lib/" list are gone.
- R3@1: No README, planning or skill text points to a removed video or piece as something that exists now.

## Out of scope

- Migrating or translating the removed videos.
- The `+0.4` in the shot fade-out delay of `lib/scene.cjs` (left open: may be a bug).
- Finished specs 001–008 and `.spectrace/changes/`: they are history.

## Dependencies

007, 008.

## Owner split

Agent tasks only.
