# 005 — promote-viaje — Changes

## 2026-10-24 — viaje golden compares values, not bytes
Why: `lib/primitives.cjs` writes `fill` after the caller's extra keys, so moving viaje's pieces to `lib/` keeps every value but reorders keys; copying the old key order into `lib/` would fork the primitives.
- MODIFIED R6@1 → R6@2
- MODIFIED D1@1 → D1@2
- Tasks: T007 changes the comparison; T001 re-pointed to D1@2, R6@2 (its fixture stays valid); T002–T004 re-pointed to R6@2
