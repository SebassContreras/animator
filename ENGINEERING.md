# Engineering Principles & Code Standards

This document defines the craftsmanship, code quality standards, and software engineering principles for Animator. AI agents must apply these principles proportionally to prevent code rot, over-engineering, and architectural drift.

---

## ⚙️ Core Engineering Principles

### 1. KISS / YAGNI — No Over-Engineering
- Apply every principle with proportionality. Start simple and direct.
- Do not introduce premature abstractions, interfaces, or factories for a single-use case.
- Abstract **only** when there are 2+ concrete consumers, 2+ distinct implementations, or when automated testing genuinely requires a boundary seam.
- **Simple > clever:** Prefer readable, straightforward JavaScript over complex metaprogramming or speculative design patterns.

### 2. SRP / Separation of Concerns
- One file / module / function = one single responsibility.
- Maximize cohesion, minimize coupling. If a unit does two unrelated things, split it cleanly.
- Keep scene generation logic, palette management, and file persistence separated.

### 3. DRY via Composition, Not Inheritance
- Avoid code duplication by extracting shared generator logic into small, injectable helper functions in `lib/`.
- Avoid inheritance hierarchies. Default to **composition + pure helper functions**.

### 4. Service Layer + Anti-Corruption / Dependency Inversion (DIP)
- The only boundary with Lienzo is the compact scene JSON contract: generators and `lib/` emit plain data and never call the Lienzo CLI or MCP tools.
- Wrap an external tool in an adapter only when code actually starts calling it (2+ call sites or a test seam), per KISS / YAGNI above.

### 5. Follow the Stack's Standards
- Strictly adhere to Node 24 CommonJS (`.cjs`) conventions.
- Zero runtime dependencies: keep the runtime lean and free of unnecessary npm packages.
- Prefer small function signatures and pure functions that take inputs (e.g., coordinates, dimensions, palette) and return deterministic scene element objects without disk or engine side-effects.
- Standard casing conventions:
  - `kebab-case`: files, directories, Markdown documents (e.g., `scene.gen.cjs`, `004-learning-promotion.md`).
  - `camelCase`: functions, variables, object properties (e.g., `makePalette`, `nativeShot`).
  - `UPPER_SNAKE_CASE`: constants, default configuration objects.
- Each `lib/` module opens with a one-line comment stating its responsibility; comments cite the spec item behind a non-obvious choice (e.g., `(010/D3)`).

### 6. Document Trade-offs
- Every significant technical choice has trade-offs.
- Document pros, cons, and active mitigations directly in the relevant spec, code comments, or `CHANGES.md`.

### 7. Validate with Research — Only When It Changes the Decision
- Research is not a ritual. Look it up only when at least one holds:
  - the choice is hard to reverse (file format, protocol, public surface, contract shape);
  - the answer is a fact outside this repository (Node API behaviour, Lienzo engine features, library versions, platform limits, licence terms);
  - two credible options tie and the tie-break is factual, not stylistic.
- Do not research what a root contract already states, what the stack's own documentation defines, or a local, reversible change you can settle by running it.
- Source order: official specification or documentation, then maintainer issue or release notes, then vendor blog. One or two sources per question; stop when a primary source settles it.
- Cite what you used where the decision lives — `D<n>` in the spec, a code comment, or `CHANGES.md` — as `Source: <url> (accessed YYYY-MM-DD)`.
- A non-obvious claim that could have a source and has none is a review finding.
