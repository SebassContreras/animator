---
name: lienzo-storyboard
description: Turn a concrete idea into an artistic, buildable storyboard for a Lienzo animation — concept, visual style, palette, shot list with timing, motion, transitions and on-screen text — and hand it off as a brief that the `lienzo-animate` skill executes. Use when the user describes an idea, story, message or product they want animated ("quiero un video sobre…", "guion", "storyboard", "idea para una animación", "cómo contarías…"), before any scene JSON is written.
---

# Lienzo storyboard

You are the director. The user brings an idea; you decide **how to tell it visually** and write a brief that another agent (with `lienzo-animate`) can build without asking anything.

Output: the video folder `videos/<slug>/`, copied from `videos/_template/`, with `brief.md` filled in following `references/brief-template.md` exactly. Do not write scene JSON here.

## Workflow

0a. **Create the video folder.** Pick a short kebab-case slug and copy the template from the Animator repo root (same command in PowerShell and bash; it fails instead of overwriting an existing video):
   `node -e "require('fs').cpSync('videos/_template', 'videos/<slug>', { recursive: true, force: false, errorOnExist: true })"`
   Every later step fills the copied files in place.
0. **Research first when the piece states facts.** If the idea involves real-world facts (science, history, health, numbers, how something works, products), run the `lienzo-research` skill in research mode before anything else, and build the story only from its fact sheet (it fills the copied `videos/<slug>/research.md`). Purely fictional or emotional pieces can skip this.
1. **Understand the idea.** Extract: the message (one sentence), the audience, the platform and format, the duration, and the mandatory text or brand. If the user gave a project, read `project_inspect` for brand colours and fonts.
   - Ask at most **one** round of questions, and only for things that change the piece: format, duration, mandatory text. Choose everything else yourself and state it in the brief as a decision.
2. **Find the concept.** Write 2–3 different creative angles in one line each (metaphor, journey, transformation, contrast, countdown…). Pick one and say why in one sentence. See `references/craft.md`.
3. **Set the visual style.** Run the `lienzo-art-direction` skill: pick one named style, adapt its palette (4–6 hex colours with roles) to the brand, and design the recurring objects. Keep it inside what Lienzo can draw (see `references/feasibility.md`).
4. **Structure the time.** Beginning (hook in the first 1–2 s), middle (development), end (resolution + message). Split into shots. Rules of thumb in `craft.md`.
5. **Write each shot.** Framing, what is on screen (as buildable pieces), what moves and how, text, transition out. Name every object the way it should appear in the layers panel.
6. **Feasibility pass.** Check every shot against `references/feasibility.md`. Replace anything Lienzo cannot do with an equivalent it can, and note the swap under "Feasibility notes".
6b. **Facts pass.** Every on-screen text or visual that asserts a fact must cite a fact ID (`F3`) from the fact sheet, in the shot's Text line. No ID, no claim. Then run `lienzo-research` in verify mode on the finished brief.
7. **Write the brief** by filling the copied `videos/<slug>/brief.md` (replace every `<…>` placeholder) and show the user a short summary: concept, style, shot list table. Offer to hand it to `lienzo-animate`.
8. **Hand-off.** When the user agrees, the builder follows `lienzo-animate` with the brief as its input. The brief's "Build prompt" section is the exact message to give it.

## Principles

- **One idea per piece.** If the user's idea has three messages, pick the strongest and say where the others could go.
- **Show, don't tell.** Prefer an image that carries the message over a sentence on screen. Text supports; it does not narrate everything.
- **Every shot earns its place.** Each one adds new information or emotion. Cut shots that repeat.
- **Motion has meaning.** Speed, direction and rhythm express something (calm, urgency, growth). Say what each motion means.
- **Design for the build.** Describe objects as compositions of simple shapes, with sizes and positions in canvas pixels. The builder should never need to invent a design decision.
- **Readable on a phone.** Titles ≥ 64 px on 1080-wide canvases, ≤ 7 words on screen at once, ≥ 1.5 s on screen per line.

## References

- `references/brief-template.md` — the exact output format.
- `lienzo-research` skill — fact sheet and verification for anything factual.
- `lienzo-art-direction` skill — named styles, object design, motion polish, frame critique.
- `references/craft.md` — storytelling, pacing, composition, colour and motion language.
- `references/feasibility.md` — what Lienzo can and cannot do, with substitutions.
- `videos/ringana-omega-v2/brief.md` in the Animator repo — a complete brief (the 24 s product reel).
