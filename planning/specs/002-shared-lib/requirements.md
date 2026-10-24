# 002 — shared-lib — Requirements

## What's being built

`lib/` with the generator code that more than one video uses, split by responsibility, and with colours injected through a palette.

## Who it serves

Every generator in `videos/`.

## Requirements

- R1@2: `lib/` has one module per responsibility — primitives, scene helpers, environment, objects, motion — and this list names the module each piece joins when R2 lets it in: primitives (rect, ellipse, path, group), scene helpers (shot, text, fade to black), environment (sea, light rays, particles, seabed, halo), objects (capsule, drop, frond, heart, eye, sparkle), motion (pop with overshoot, heartbeat). Pieces used by only one video stay in its generator until a second one uses them.
- R2@1: A piece moves into `lib/` only if at least two videos use it, or it is a primitive; everything else stays in the video's generator (A5, A13).
- R3@1: Every colour a `lib/` piece draws comes from an argument; a test that passes two different palettes gets two different colours in the output.
- R4@1: `videos/<slug>/palette.json` maps roles to `{ base, shadow, highlight }` hex values (one-tone roles may give only `base`), and the generator reads its colours from it.
- R5@1: After the refactor, `ringana-omega` and `ringana-omega-v2` generators write scenes byte-identical to before; a test fails if either output changes.
- R6@1: Primitives produce flat elements (gradient and shadow off) unless the caller asks otherwise; a test proves it.
- R7@2: `pnpm test` (`node --test "tests/**/*.test.cjs"`) passes with no dependencies installed.

## Out of scope

- Moving `viaje` onto `lib/` (its helpers differ; done when the piece is reworked).
- A plugin or package system.

## Dependencies

None beyond the roadmap.

## Owner split

All agent tasks.
