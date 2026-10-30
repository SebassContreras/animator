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
- Wrap external tools and APIs (such as Lienzo engine integrations or third-party utilities) in adapter interfaces.
- Generator code and domain logic depend on interfaces and pure data contracts, not vendor-specific internals.

### 5. Small Interfaces & Pure Functions
- Prefer small function signatures and pure functions that take inputs (e.g., coordinates, dimensions, palette) and return deterministic scene element objects.
- Pure functions ensure generator code can be unit-tested without disk or engine side-effects.

### 6. Follow the Stack's Standards
- Strictly adhere to Node 24 CommonJS (`.cjs`) conventions.
- Zero runtime dependencies: keep the runtime lean and free of unnecessary npm packages.
- Standard casing conventions:
  - `kebab-case`: files, directories, Markdown documents (e.g., `scene.gen.cjs`, `004-learning-promotion.md`).
  - `camelCase`: functions, variables, object properties (e.g., `makePalette`, `nativeShot`).
  - `UPPER_SNAKE_CASE`: constants, default configuration objects.

### 7. Document Trade-offs
- Every significant technical choice has trade-offs.
- Document pros, cons, and active mitigations directly in the relevant spec, code comments, or `CHANGES.md`.
