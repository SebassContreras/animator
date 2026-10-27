# Architecture

Project-wide decisions.

## Container

- A6@1: The repo holds three things: `skills/` (global knowledge as agent skills), `lib/` (shared generator code) and `videos/` (one folder per video) — why: separates what is reused from what belongs to one piece.
- A7@1: A video folder `videos/<slug>/` contains `brief.md`, `research.md` (when the piece states facts), `palette.json`, `scene.gen.cjs`, `scene.json` and `learnings.md` — why: everything about one video in one place; a new video copies a known shape.
- A8@1: Lienzo is an external tool: generators only write compact scene JSON; building, previewing and exporting go through Lienzo's MCP tools or `pnpm lienzo` CLI — why: generators stay pure and testable without Lienzo running.

## Stack

- A9@1: Node 24, CommonJS `.cjs`, no runtime dependencies; pnpm for any package work — why: what the generators already use; nothing to install.
- A10@1: Tests use the built-in `node --test` — why: no dependency, ships with Node.

## Conventions

- A1@1: SRP / Separation of Concerns: one file or module = one responsibility; split a unit that does two things — why: avoids tangled dependencies and eases testing.
- A2@1: Service Layer + Anti-Corruption: never call third-party libraries or APIs directly from business logic; wrap them in your own interface and inject it — why: the domain stays swappable.
- A3@1: DRY by composition, not inheritance: extract shared logic into injectable helpers — why: flexibility and low coupling.
- A4@1: Testability by default: small interfaces, pure functions, injected dependencies — why: predictable, testable code without fragile mocks.
- A5@1: KISS / YAGNI: abstract only with 2+ uses, 2+ vendors or a test that needs it — why: avoids accidental complexity.
- A11@1: Shared pieces in `lib/` take colours from a palette argument and never hardcode a video's colours — why: the same piece serves any theme or brand.
- A12@1: Primitives are flat by default (gradient and shadow off) — why: Lienzo turns both on by default and that was the most common defect.
- A13@2: A learning moves from a video's `learnings.md` to `lib/` (reusable piece) or a skill (rule) only after it worked in a real video, and the promotion is recorded as a spec task; a `lib/` helper or skill rule that only wraps a Lienzo feature may be promoted once it renders correctly in `scene_preview` — why: global knowledge holds only proven things and stays traceable, and engine features can be proven without making a video.
- A14@1: Every new video goes through `lienzo-art-direction` (named style + frame review) — why: the redesigned ringana-omega v2 was rated "much, much better" than the flat v1.
- A15@1: All repo content and on-screen text are in English; conversation with the user is in Spanish — why: user rule.

## Still to define

- CI: what has to pass before a change is accepted.
