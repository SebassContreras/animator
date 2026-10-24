# 007 — promote-ringana-omega-v2 — Design

## Approach

- D1@1 (implements R1, R2): The command goes inline under the redesign step of `lienzo-art-direction/SKILL.md` as a fenced block, exactly as it worked: `ffmpeg -i v1.mp4 -i v2.mp4 -filter_complex "[0:v]scale=540:-2[a];[1:v]scale=540:-2[b];[a][b]hstack" -map 1:a? out.mp4`, followed by one line on grabbing mid-shot frames for `references/review.md`. _(standard: FFmpeg `hstack` filter — https://ffmpeg.org/ffmpeg-filters.html#hstack-1)_

## Deliverables

- Changed: `skills/lienzo-art-direction/SKILL.md`, `videos/ringana-omega-v2/learnings.md`.

## Trade-offs

- D1. Pros: the agent copies one proven command, no tool to maintain. Cons: an ffmpeg dependency the skill does not install. Mitigation: ffmpeg is already required by the measuring rules (006/R4); the skill says so in the same line.
