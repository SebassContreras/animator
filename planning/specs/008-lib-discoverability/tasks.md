# 008 — lib-discoverability — Tasks

- [x] T001 [agent] [status:done] Test in `tests/skills/lib-list.test.cjs` (one test per `lib/` module) that every export is named in backticks in the "Start from lib/" section of `skills/lienzo-animate/SKILL.md`; confirm it fails today on the six promoted pieces
      covers: R2@1, D2@1, D3@1
      kind: test
      changes: tests/skills/lib-list.test.cjs (+37 -0)
- [x] T002 [agent] [status:done] Add `car`, `house`, `cloud`, `dashes`, `nameAll` and `countUp` to "Start from lib/" with their colour arguments; the T001 test passes
      covers: D1@1, R1@1
      changes: skills/lienzo-animate/SKILL.md (+4 -4)
