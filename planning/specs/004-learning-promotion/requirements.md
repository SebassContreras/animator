# 004 — learning-promotion — Requirements

## What's being built

The loop that turns what one video taught into global knowledge, and the migration of what was learned so far.

## Who it serves

Every future video: it starts from everything proven before.

## Requirements

- R1@1: Each video's `learnings.md` lists findings, each marked as `piece` (goes to `lib/`), `rule` (goes to a skill), `engine` (a Lienzo limitation) or `local` (stays in the video).
- R2@1: A close-out step in `lienzo-animate` runs after the user approves a video: it classifies every finding and opens a task in this repo's specs for each `piece` or `rule` to promote (A13).
- R3@1: `LOG.md` is split: each session's findings move to the matching video's `learnings.md`; rules already promoted to the skills are marked as promoted with the skill file they live in.
- R4@1: `LOG.md` is removed, or reduced to a pointer, and no file outside history depends on its contents.
- R5@1: An `engine` finding stays in the video's `learnings.md` with a link to the Lienzo issue or spec that tracks it; this repo keeps no separate list of engine improvements.

## Out of scope

- Automating the classification; the agent proposes it and the user can change it.

## Dependencies

001 (video folders), 002 (lib to promote into).

## Owner split

Agent tasks; the user confirms each promotion during close-out.
