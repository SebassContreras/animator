# Testing Standards & Verification Guidelines

This document governs testing philosophy, contract invariants, test partitioning, and test hygiene for Animator. AI agents must follow these rules when writing automated tests or auditing test suites.

---

## 🧪 Testing Invariants & Input Partitioning

Automated tests must assert observable contracts rather than surface-level happy-path anecdotes.

### 1. Systematic Input Partitioning
Systematically cover the observable space:
- **Valid Nominal Cases:** Typical valid inputs (e.g., standard palette roles, dimensions).
- **Boundary Values:** Extreme dimensions, 0-duration shots, coordinate origins (`(0, 0)`).
- **Malformed & Missing Inputs:** Malformed color hexes, missing required palette roles (`base`), and undefined options.
- **Contract Adherence:** Generators produce valid, well-formed scene JSON elements.

### 2. Testing Philosophy
- **Behavior, Not Coverage:** Test observable behaviors, element coordinates, and deterministic output structures rather than chasing raw coverage percentages.
- **Unit Before Integration:** Test shared library pieces in `lib/` with fast, isolated unit tests before running full video scene renders.
- **What to Skip:** Do not test code without logic (pure declarative configuration objects or simple getters) nor external Lienzo engine behaviors.
- **Regression First:** Write a failing regression test before every bug fix. Never weaken a test to make code pass.
- **Visual Quality:** Not unit-tested. It is checked by eye on Lienzo previews with the `lienzo-art-direction` review checklist.
- **Tripwire Rule:** If a spec's tests exceed three times its requirements (`R` items), stop and justify the reason in the task report. It is a tripwire, not a cap.

---

## 🗂️ Test Layout & Guard Tests

- **`tests/lib/`:** Unit tests for each `lib/` module.
- **`tests/videos/`:** Golden test (a generator keeps writing its fixture scene in `tests/videos/fixtures/` byte for byte), template test (a copy of `videos/_template/` runs unedited), and the `learnings.md` format test.
- **`tests/skills/`:** Every `lib/` export must be listed in `lienzo-animate` → "Start from lib/". Adding an export means updating that list in the same change.
- **Traceability:** Each test file opens with a comment naming the spec items it proves (e.g., `(002/R4)`).

---

## 🧼 Test Hygiene & Structure

### 1. AAA / Given-When-Then Structure
- Structure every test into **Arrange**, **Act**, and **Assert**.
- Use descriptive test names stating the expected outcome (e.g., `test("rect is flat by default", ...)`).

### 2. Clean Test Bodies
- No conditional branching (`if`/`else`), ternary operators, or manual loops inside test execution blocks. Branching in tests hides unexercised code paths.

### 3. Mocking & Boundary Isolation
- **Do not mock the unit under test:** Exercise real functions from `lib/`.
- Mock or stub only external boundary interactions (filesystem or child processes) when non-deterministic.

---

## ⚡ Execution Commands

- **Narrowest Execution (one file/module):**
  ```sh
  node --test tests/<path>.test.cjs
  ```
- **Full Test Suite:**
  ```sh
  pnpm test
  ```
  *(Runs `node --test "tests/**/*.test.cjs"`; a bare folder argument fails on Node 24.)*
- **Run Rule:** A task runs only the narrowest command covering the files it touched. The full suite runs at session end or when a shared module in `lib/` changed. There is no affected-only mode.
