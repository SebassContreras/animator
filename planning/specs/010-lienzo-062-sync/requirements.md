# 010 — lienzo-062-sync — Requirements

## What's being built

The four `lienzo-*` skills and `lib/` brought in line with Lienzo after its specs 051–062, so agents use the native features instead of the old workarounds.

## Who it serves

The agent that plans and builds a Lienzo video.

## Requirements

- R1@1: `lienzo-animate` (SKILL.md and references) describes native `shots` (transition, camera, `shot_set`) as the way to make shots and camera moves; shots built as groups stay documented only as the legacy pattern of existing videos.
- R2@1: The skills document `opacity` on every element, `origin`, track `repeat`/`until` and `step`/`hold`, text `w` and accurate `at`, `at` relative to the parent group, `group/child` targets, partial `effects`, `defaults: "flat"`, `symbols`/`use`, `path` `mode: "layers"`, `particles` `motion`, `polygon` `fit: "box"`, group `clip`, radial and multi-stop fills, and `audioTracks` with `asTrack`/`startOffset`.
- R3@1: Every row of `skills/lienzo-animate/references/gotchas.md` is re-checked against the current Lienzo with `scene_build`/`scene_preview`; rows that no longer reproduce are removed, rows that still do are kept, and new ones found during the check are added.
- R4@1: The tool tables in the skills list the current Lienzo tools (guide of 2026-10-25), including `scene_update`, `asset_add`, `project_update`, `element_group`/`element_ungroup`, `image_trim`, `preset_save`, `animation_list`/`animation_save` and `scene_rename`/`scene_delete`.
- R5@1: `lib/scene.cjs` adds helpers for native shots and for text as a `text` element with `w` (no hidden rect); the existing helpers stay unchanged and ringana-omega-v2 keeps generating byte-identical output.
- R6@1: `videos/_template/scene.gen.cjs` starts from the native pattern (`defaults: "flat"`, `shots`, the new helpers).
- R7@1: `lienzo-storyboard`, `lienzo-art-direction` and `lienzo-research` state no feasibility limit that Lienzo no longer has.

## Out of scope

- Changing, regenerating or re-exporting existing videos (`videos/ringana-omega-v2/`, `skills/lienzo-animate/examples/car-road-tree.*`).

## Dependencies

008 (the lib list and its guard test).

## Owner split

Agent tasks only.

## Follow-up (2026-10-25)

- R8@1: After Lienzo 063, the skills no longer recommend the workarounds it fixed (shot transitions, camera over groups and shot-less elements, text width with `at`, fill-opacity and path-stroke defaults, silently ignored fields), and name a path's outline `border`, not `stroke`.
