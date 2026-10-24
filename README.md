# Animator

Skills that let an agent build complex animations with [Lienzo](../lienzo-agente): drawn objects, motion, parallax, and multi-shot videos with cuts and camera moves.

## Contents

- `skills/lienzo-research/` — the researcher: searches the web before scripting and fact-checks every claim in a brief, with sources and verdicts.
- `skills/lienzo-storyboard/` — the director: turns an idea into an artistic, buildable brief (concept, style, palette, shot list, motion, text).
- `skills/lienzo-art-direction/` — the art director: named styles, object design, motion polish and a frame-critique checklist, used by the storyboard and the builder.
- `skills/lienzo-animate/` — the builder: executes a brief in Lienzo. Workflow, references, recipes, known pitfalls, and a verified example scene with its MP4.
- `briefs/` — briefs written by `lienzo-storyboard`, one per piece.
- `lab/` — test scenes built with the skill. `viaje.gen.cjs` generates a 12 s, four-shot video.
- `LOG.md` — findings from each session using the skill against real Lienzo.
- `LIENZO-IMPROVEMENTS.md` — engine limitations found along the way, prioritized and ready to turn into specs.

## Install

1. Set up Lienzo and its MCP server. From the Lienzo repo:

   ```sh
   pnpm install
   claude mcp add lienzo -- pnpm lienzo mcp
   ```

2. Copy or link the skills where your agent reads skills:

   ```sh
   # Claude Code, for all your projects
   cp -r skills/lienzo-research skills/lienzo-storyboard skills/lienzo-art-direction skills/lienzo-animate ~/.claude/skills/
   # or only inside the Lienzo repo
   cp -r skills/lienzo-research skills/lienzo-storyboard skills/lienzo-art-direction skills/lienzo-animate ../lienzo-agente/.claude/skills/
   ```

## How to use

1. Describe your idea: "I want a 15 s reel about how a seed becomes a forest."
2. If the idea states real facts, `lienzo-research` researches it and writes `briefs/<slug>.research.md` with sources.
3. `lienzo-storyboard` proposes a concept and writes `briefs/<slug>.md`. Review and adjust it.
4. `lienzo-research` verifies every claim in the brief and corrects or removes what is not backed by sources.
5. Ask the agent to build it. `lienzo-animate` follows the brief's "Build prompt" section.
6. Review in Lienzo's joint mode and report fixes in words or by hand.

## Try the example

From the Lienzo repo, with an existing project:

```sh
pnpm lienzo scene_build --json @build.json   # {"compact": <example>, "project": "<slug>", "save": "car", "overwrite": true}
pnpm lienzo scene_export --scene car --project <slug> --format mp4
```

Regenerate the lab scene:

```sh
node lab/viaje.gen.cjs   # writes lab/viaje.json
```
