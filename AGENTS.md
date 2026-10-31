# AGENTS.md

Instructions and operational constraints for AI coding agents.

## 🚀 Quick Reference & Commands
- **Environment:** Node 24+, CommonJS (`.cjs`), pnpm.
- **Verification:**
  - Narrowest test: `node --test tests/<path>.test.cjs`
  - Full suite: `pnpm test`
- **Language Hard Rule:** English in all code files, markdown documents, and on-screen text; Spanish only in conversation with the user.
- **Commits:** Standard Conventional Commits (`feat:`, `fix:`, `docs:`, `refactor:`). No rigid hook trailers or custom formats.
- **Spectrace Skills:** `.agents/skills/spectrace-*` are installed from `../spectrace` (pinned in `skills-lock.json`). Never edit them here; change them in spectrace and reinstall.

## 🧭 Repository Blueprint & Pointers
This codebase uses a progressive disclosure model with clear separation of concerns across 7 root contracts:
- **[PRODUCT.md](./PRODUCT.md):** Product vision, target audience, core user problems, and functional boundaries. Read before proposing scope changes or features.
- **[ARCHITECTURE.md](./ARCHITECTURE.md):** System topology, directory layout, layer boundaries, and structural patterns. Read before modifying structural code.
- **[ENGINEERING.md](./ENGINEERING.md):** Code quality standards, craftsmanship principles (KISS/YAGNI, SRP, DRY, DIP/ACL), and stack conventions. Read before writing or refactoring modules.
- **[DESIGN.md](./DESIGN.md):** Visual design system, palette tokens, art direction rules, and animation standards. Read before writing scene generators, palettes, or visual styles.
- **[TESTING.md](./TESTING.md):** Testing standards, contract invariants, input partitioning, and test hygiene. Read before writing or auditing tests.
- **[CHANGES.md](./CHANGES.md):** Historical log of architecture pivots, deprecated decisions, and migration reasons. Consult when altering existing behavior.
- **[planning/roadmap.md](./planning/roadmap.md):** Ordered roadmap of specs, dependencies, current statuses, and backlog ideas.

---

## 📋 Task Execution Workflow

Agents execute work incrementally using the specs in `planning/`:

1. **Find Next Task:**
   - Open `planning/roadmap.md`. Find the first spec with status `todo` or `in progress` whose dependencies are `done`.
   - Open the corresponding spec file in `planning/specs/NNN-name.md`.
   - Take the first uncompleted agent task: `- [ ] NNN/TNNN [agent] ...`.
   - Note: Skip `[human]` tasks and notify the user if one blocks execution.

2. **Execute & Follow Constraints:**
   - Implement only the scope described by the task.
   - Respect structural boundaries in [ARCHITECTURE.md](./ARCHITECTURE.md), craftsmanship principles in [ENGINEERING.md](./ENGINEERING.md), design guidelines in [DESIGN.md](./DESIGN.md), and test requirements in [TESTING.md](./TESTING.md).
   - Maintain documentation integrity: do not delete or alter comments/docstrings unrelated to your changes.

3. **Verify:**
   - Run the narrowest test covering the touched files, as described in [TESTING.md](./TESTING.md). Never mark a task done without verifying.
   - For `Verify:` or `Review:` tasks, perform the explicit check and record results under the task (e.g., `verified: <summary>`). Code audits against the root contracts use `spectrace-review`.

4. **Close Task & Commit:**
   - Mark the checkbox as completed: `- [x] NNN/TNNN [agent] ...`.
   - If all tasks in the spec are complete, update the spec's status to `done` in `planning/roadmap.md`.
   - Stage touched files by name and commit with a clear Conventional Commit message.

5. **Contradictions or Changes:** Propose them to the user; the `spectrace-change` skill applies them to `CHANGES.md` and the affected specs.

6. **New Ideas:** Add them to `planning/roadmap.md` under `## Ideas`.

---

## ⚠️ Critical Rules & Boundary Conditions
1. **Never Bypass Checks:** Never use `--no-verify` or bypass lint/test checks.
2. **Never Break Working Specs:** If an existing requirement needs to change, follow the protocol in [CHANGES.md](./CHANGES.md) instead of silently breaking old assumptions.
3. **Keep `planning/` Clean:** Only actionable specs and the roadmap belong in `planning/`. Durable architecture and governance belong at the root.
4. **When Blocked:** Add an indented `blocked: <reason>` line below the task, commit the note, inform the user, and move to unblocked work.
5. **No Speculative Abstractions:** Never introduce premature interfaces, adapters, or base classes for single-use cases. Abstract only for 2+ concrete consumers or vendors.
6. **Sync Before Status:** Run `git pull` and `git status` before reporting pending tasks or answering "what's next".
