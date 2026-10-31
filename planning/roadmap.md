# Roadmap

Specs in execution order. `Status` (`todo`, `in progress`, `done`) is maintained directly by agents and humans as specs progress.

> Historical note: Specs 001–010 not listed here were finished under the legacy spectrace format; they live in git history. See [CHANGES.md](../CHANGES.md).

| ID  | Spec | Status | Depends on |
|-----|------|--------|------------|
| 004 | learning-promotion | done | — |
| 011 | brand-from-lienzo | done | 004, Lienzo 086 |
| 012 | platform-length | done | 011 |
| 013 | promote-ringana-skin-perfection | done | 011, 004 |

## Ideas

Anything worth doing later. Ideas can be added freely without debate; they are converted into specs when prioritized.

From the repo review of 2026-10-31, highest impact first:

- **Prove the pipeline end to end.** Only one real video existed, and its Lienzo scene (`omega-v2`) was deleted. `ringana-skin-perfection` (Soft depth, 2026-10-31) is the second; its findings are spec 013. Make 1–2 more, different videos (one fiction without research, in Night glow or Bold graphic); their `learnings.md` feed the specs below.
- **Grow `lib/`.** It holds a heart, a gradient backdrop, particles, `heartbeat`, `countUp` and text helpers; `shot`/`text` are legacy forms kept for ringana-omega-v2. Promote recurring pieces from new videos (and candidates from omega-v2: halo, light rays, three-tone capsule/drop). Soft depth, Bold graphic and Night glow in `styles.md` have no verified piece yet.
- **Scripts instead of inline one-liners.** The template copy and the brand snapshot are long `node -e` commands inside `SKILL.md`. Make them repo scripts (e.g. `pnpm video:new <slug>`, `pnpm brand:lock <inspect.json> <slug>`, `pnpm brand:drift <slug>`) that are tested and behave the same on PowerShell and bash.
- **Install that matches how skills resolve paths.** README says `cp -r skills/lienzo-* ~/.claude/skills/`, but the skills use repo-relative paths (`videos/_template`, `lib/`), so copies go stale and only work from the Animator repo. Document "work from this repo" or use project-level skills / a symlink. `skills-lock.json` points at a local `../spectrace`, which others cannot reproduce.
- **`scene-lint`: check readability on `scene.json`.** Tests guard shape (golden scene byte for byte, lib list), not the DESIGN.md numbers. A pure checker can flag text contrast < 4.5:1, titles < 64 px on 1080-wide canvases, > 7 words per line, lines on screen < 1.5 s, and a final hold < 1.5 s, without Lienzo. The byte-for-byte golden test also blocks harmless `lib/` changes; consider a structural comparison.
- **Light close-out path.** Every promotion needs a `NNN-promote-<slug>` spec. Allow a fast path for one-line `Rule` findings (e.g. a new entry in `gotchas.md`) so small learnings get promoted instead of dropped.
