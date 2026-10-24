# 008 — lib-discoverability — Requirements

## What's being built

The `lienzo-animate` list of `lib/` pieces: complete now, and kept complete, so an agent reuses a promoted piece instead of drawing it again.

## Who it serves

The agent that builds a video's generator.

## Requirements

- R1@1: The "Start from lib/" section of `skills/lienzo-animate/SKILL.md` names every function that each `lib/*.cjs` module exports, with one line on what it draws or does and the arguments that carry its colours.
- R2@1: A test fails when a `lib/` module exports a function that the "Start from lib/" section does not name.

## Out of scope

- Generated documentation (JSDoc, a docs site). The list is short and hand-written.

## Dependencies

005 and 006 (the pieces to list).

## Owner split

Agent tasks only.
