# 002 — shared-lib — Changes

## 2026-10-24 — R1 lists destinations, R2 decides what moves now
Why: R1 vs R2 conflict: user chose R2; v1 must stay byte-identical (R5), so v2-only pieces cannot be shared yet.
- MODIFIED R1@1 → R1@2
- Tasks: none re-pointed (no task covers R1 directly; D1@1 and D4@1 still hold); nothing built yet, nothing to retire.

## 2026-10-24 — full-suite command that works on Node 24
Why: on Node 24 `node --test tests/` treats the folder as a module and fails; `node --test "tests/**/*.test.cjs"` (`pnpm test`) runs the suite (T011 blocked on 002/R7).
- MODIFIED R7@1 → R7@2
- Tasks: T011 re-pointed to R7@2 (still valid); it also fixes the full-suite command in AGENTS.md.
