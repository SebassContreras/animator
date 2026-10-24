# Interview ledger

Answers taken from the conversation of 2026-10-24 (the user asked to create the specs directly; quoted words are the user's, in Spanish).

| dimension | status | answer |
|-----------|--------|--------|
| idea-detail | covered | "generar algo mas concreto a la hora de lab, tener algo mas generico para reutilizar o cosas que ya sepamos y en cada video nuevo volver a usar … cada video debe tener su tematica su brief su investigacion y su paleta de colores, despues lo encontrado que sabemos que funciona o aprendimos en cada video pasarlo al conocimiento global para que se aplique en todos los videos" |
| project-type | covered | software: agent skills (Markdown) + a Node generator library that writes Lienzo compact scenes |
| goal | covered (drafted) | Structure Animator so each video is a self-contained folder (theme, brief, research, palette, generator, learnings) and what works is promoted to a shared library and the skills, reused by every new video. |
| audience | covered | the user and the agents that build Lienzo videos with these skills |
| mvp | covered (drafted) | in: video folders, shared lib with injected palettes, video template, promotion workflow. not: changes to Lienzo itself, new videos, publishing the skills |
| done-when | covered (drafted) | a new video starts from the template, its generator only adds what is new, and its learnings end up in lib/ or the skills with a recorded decision |
| constraints-hard | covered | everything in the repo and the videos in English, chat in Spanish; pnpm only; no Claude co-author in commits |
| stakeholders | skipped | solo project |
| codebase | covered | existing: skills/ (Markdown), lab/*.gen.cjs (Node CommonJS), briefs/. Markdown is read by symbol, .cjs at file level |
| automatability | covered | agents build and refactor; the user reviews videos in Lienzo's joint mode and approves the look ("quedo mucho mucho mejor") |
| runtime | covered | Node 24 (installed), CommonJS .cjs, no dependencies |
| framework | covered | none; Lienzo is an external tool reached through its MCP server or `pnpm lienzo` CLI |
| toolchain | covered (drafted) | pnpm; tests with the built-in `node --test` |
| datastore | skipped | none: files in git |
| data-model | covered | video folder, palette, compact scene JSON, learnings |
| interface | covered | generator scripts (`node videos/<slug>/scene.gen.cjs`) and skills |
| identity | skipped | none |
| hosting | skipped | local only |
| ci | open | |
| env-secrets | skipped | none |
| verification | covered (drafted) | unit tests only; visual checks are done by eye on previews (lienzo-art-direction review checklist) |
| third-party | covered | Lienzo (local repo ../lienzo-agente), Kokoro for voice-over, ffmpeg for comparisons |
| observability | skipped | n/a |
| helper-skills | covered | spectrace installed in .agents/skills ("lo cambie a agentes") |
| agent-rules | covered | the ten principles pasted by the user (KISS/YAGNI, SRP, DRY by composition, service layer, small interfaces, behaviour tests, test hygiene, stack standards, web research, trade-offs) |
| visual-surface | covered | yes: the videos |
| palette | covered | per video, in the video folder |
| typography | covered | per video; fonts installed in the Lienzo project |
| density-mode | skipped | per video |
| brand-refs | covered | lienzo-art-direction → review.md "Where to look" |
| tone | covered | English for repo and videos; Spanish chat |
| accessibility | covered | text contrast ≥ 4.5:1, phone-readable sizes (lienzo-storyboard craft.md) |
| code-conventions | covered | match existing generators; readable `name` on every element |
| anti-preferences | covered | videos that look "programmed" instead of designed |
| preference-strength | covered | English is a hard rule; style choices are defaults |
