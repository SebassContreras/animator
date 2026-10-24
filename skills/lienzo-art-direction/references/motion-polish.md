# Motion polish

`craft.md` says what a motion means; this file makes it feel crafted. Syntax is in `lienzo-animate` → `motion.md`.

Numbers are rules of thumb from motion-design practice. Test them in the preview and log changes in `LOG.md`.

| Principle | Rule | In Lienzo |
|---|---|---|
| Ease everything | entries decelerate, exits accelerate, repositions ease both ways | in: `cubic-out`; out: `cubic-in`; moves: `ease-in-out`. `linear` only for constant travel (roads, parallax, wheels) |
| Overshoot and settle | the main object passes its target slightly, then settles | in: `pop` or `back-out`; or a track: target +5–8 % at 70 % of the time, target at 100 % |
| Anticipation | a small move against the direction before a big move | `@scale` 1 → 0.95 (0.1 s) → 1.1 → 1, or `x` −10 px before a slide right |
| Follow-through | attached parts arrive later than the body | child pieces (crown, antenna, text under a title) start 0.05–0.1 s later or `swing` once after the stop |
| Stagger | never everything at once | `group.stagger` 0.08–0.15 s; the primary element first, secondaries after |
| Squash and stretch | quick landings deform a little | `@scale` on a landing; keep it ≤ 10 % in calm styles, 0 in Soft depth |
| Ambient life | every shot keeps breathing | at least one loop per shot: `float`/`breathe` on objects, slow drift on clouds or particles, slow camera zoom (≈ 3–5 % per shot) |
| Hold | the eye needs rest | after a big entry, hold ≥ 0.5 s before the next one |

Rules:
- Exaggerate the focal object only; secondary objects move less and simpler.
- One easing family per piece (match the style in `styles.md`).
- Text settles first, decorations after.
