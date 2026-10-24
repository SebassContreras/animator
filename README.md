# animator

Turn an idea into a finished animated video with an AI agent.

You describe what you want ("a 15 s reel about how a seed becomes a forest"). The agent researches the facts, writes a storyboard, designs the look and builds the video in Lienzo, an animation engine the agent drives through MCP tools.

This repo holds two things:

- **Agent skills** — the know-how the agent follows, one skill per role.
- **Real videos** — each one in its own folder, with everything that produced it.

## How it works

```
idea ──▶ research ──▶ storyboard ──▶ art direction ──▶ build in Lienzo ──▶ MP4
        (facts +      (brief: shots,  (style, palette,   (generator script
         sources)      timing, text)   motion polish)     → scene JSON)
```

| Skill | Role | What it produces |
|---|---|---|
| `lienzo-research` | Researcher | A fact sheet with sources; later, a check of every claim in the brief |
| `lienzo-storyboard` | Director | A buildable brief: concept, style, palette, shot list, motion, text |
| `lienzo-art-direction` | Art director | A named style, object design and a frame-review checklist |
| `lienzo-animate` | Builder | The scene in Lienzo, built from the brief |

## Repo layout

```
skills/            the four skills above
lib/primitives.cjs shared drawing helpers (rect, ell, path, group) with flat defaults
videos/<slug>/     one folder per video:
  brief.md           the storyboard
  research.md        facts and sources (when the video states facts)
  palette.json       the video's colours
  scene.gen.cjs      Node script that writes the scene
  scene.json         the compact scene Lienzo builds
  learnings.md       what this video taught us
tests/             node --test suites
planning/          specs and decisions (spectrace)
```

Example videos: `videos/viaje/` (a 12 s road trip), `videos/ringana-omega/` and its redesigned version `videos/ringana-omega-v2/` (a 24 s product reel with voice-over).

## Requirements

- Node 24+ and pnpm.
- Lienzo with its MCP server, to build and export videos. The generators and tests run without it.

## Install

1. Set up Lienzo and register its MCP server (from the Lienzo repo):

   ```sh
   pnpm install
   claude mcp add lienzo -- pnpm lienzo mcp
   ```

2. Copy the skills to where your agent reads them, e.g. Claude Code:

   ```sh
   cp -r skills/lienzo-* ~/.claude/skills/
   ```

## Make a video

1. Tell the agent your idea.
2. If it states real facts, `lienzo-research` writes `videos/<slug>/research.md` with sources.
3. `lienzo-storyboard` writes `videos/<slug>/brief.md`. Review and adjust it.
4. `lienzo-research` verifies every claim in the brief.
5. Ask the agent to build it; `lienzo-animate` follows the brief's "Build prompt".
6. Review the preview in Lienzo and ask for fixes in plain words.

## Regenerate a scene and run the tests

```sh
node videos/viaje/scene.gen.cjs   # writes videos/viaje/scene.json
pnpm test                         # generators still produce their known scenes
```

## License

[MIT](LICENSE)
