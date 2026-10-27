# Product

## What this is

Animator is a set of agent skills plus a small Node library for making animated videos with Lienzo. Each video lives in its own folder with its theme, brief, research, palette, generator and learnings. What a video proves to work is promoted to a shared library (`lib/`) or to the skills, so every new video starts from everything already learned.

## Who uses it

The user and the coding agents that research, storyboard, art-direct and build Lienzo videos with these skills.

## Current MVP scope

- One folder per video with a fixed set of files.
- A shared generator library whose pieces take the palette as a parameter.
- A template to start a new video.
- A close-out step that promotes each video's learnings to `lib/` or the skills.
- One reference video, `ringana-omega-v2`, with its learnings in `learnings.md` (the earlier videos were removed in spec 009).

## Not for now

- Changes to Lienzo itself (engine improvements are tracked in the Lienzo repo).
- Producing new videos.
- Publishing the skills to a registry.

## Docs
- README.md — what it is, install, usage
- AGENTS.md — how agents work in this repo
