# 003 — video-template — Requirements

## What's being built

A starting point for every new video and the skill steps that use it.

## Who it serves

The agent and the user when a new video begins.

## Requirements

- R1@1: `videos/_template/` contains the files of A7 with placeholders: a brief following `lienzo-storyboard`'s template, an empty `research.md`, a `palette.json` with the roles of the default style, a minimal `scene.gen.cjs` that builds one shot from `lib/` and the palette, and a `learnings.md` with the sections used in 004.
- R2@1: Copying `_template` to a new slug and running its generator writes a valid compact scene that `pnpm lienzo scene_build` accepts.
- R3@1: `lienzo-storyboard` creates the video folder from the template and writes the brief, research link and palette there; `lienzo-art-direction` fills `palette.json` from the chosen style.
- R4@1: `lienzo-animate` builds from `videos/<slug>/scene.gen.cjs` and starts from `lib/` pieces before drawing new ones.

## Out of scope

- A CLI to scaffold videos (copying the folder is enough, A5).

## Dependencies

002 for the generator in the template.

## Owner split

Agent tasks; the user approves the first video made from the template.
