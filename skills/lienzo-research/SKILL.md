---
name: lienzo-research
description: Research a topic on the web before an animation is scripted, and fact-check every claim in a Lienzo brief against reliable sources, so no video states things that are false or invented. Produces a fact sheet with sources and confidence, and a verdict per claim. Use whenever a storyboard or animation talks about real facts — science, history, health, numbers, products, how something works — or when the user asks to "investigar", "verificar", "validar", "que sea real", "con fuentes", "fact-check".
---

# Lienzo research and fact-check

You make sure every animation tells the truth. Two modes:

- **Research** (before the storyboard): learn the topic and produce a fact sheet the storyboard must build from.
- **Verify** (after the storyboard): check every factual claim in a brief and mark it verified, corrected or removed.

Both write to `videos/<slug>/research.md` using `references/fact-sheet-template.md`.

## Research mode

1. **Frame the question.** From the user's idea, list what the video needs to know: key facts, numbers, steps of a process, dates, names, common misconceptions. 5–15 questions.
2. **Search.** For each question, run web searches; send independent searches in parallel. Prefer the source types in `references/sources.md`. Open the pages you cite; never cite from a search snippet alone.
3. **Cross-check.** A fact is **verified** when two independent reliable sources agree, or one primary source states it (official body, original paper, the product's own docs for product facts). Otherwise it is **uncertain**.
4. **Record.** One row per fact: ID (`F1`, `F2`…), the fact in one plain sentence, the exact number with unit and date, sources (title + URL + date accessed), status, notes.
5. **Write the simple version.** For each fact, add a phrasing short enough for the screen (≤ 7 words) that stays true. Simplifying must not change the meaning (see `references/claims.md`).
6. **Flag myths.** List popular claims about the topic that are false or disputed, so the storyboard does not use them.

## Verify mode

1. **Extract claims.** Read the brief (`videos/<slug>/brief.md`). Every on-screen text, voice-over line and visual that asserts something about the world is a claim. Visual claims count: a chart's proportions, an order of steps, a map, an icon that implies a fact.
2. **Match.** Link each claim to a fact ID from the fact sheet. Claims with no match get researched now (same rules as research mode).
3. **Judge** each claim with one verdict:
   - **verified** — matches a verified fact, including its simplification.
   - **corrected** — close but wrong in a detail (number, date, wording); give the corrected text.
   - **uncertain** — sources disagree or are weak; propose softer wording ("about", "up to", "studies suggest") or removal.
   - **false** — contradicted by reliable sources; must be removed or replaced.
4. **Patch the brief.** Edit the brief's text strings with corrections, and add a "Sources" section listing the fact IDs used per shot. Do not change creative choices that are not factual.
5. **Report** to the user: a table of claims and verdicts, what you changed, and anything that needs their decision.

## Rules

- **Never invent a source, quote, statistic or URL.** If you cannot find it, the fact is uncertain.
- **Numbers carry their context:** unit, date, place and population ("38 % of adults in Spain, 2023"), even if the screen shows only "38 %".
- **Newer beats older** for anything that changes (prices, records, populations, laws, product features). Note the date of each number.
- **Quote the source's meaning, not your memory.** If your knowledge and the source disagree, the source wins; note the disagreement.
- **Health, finance and legal topics** need official or peer-reviewed sources; add a short disclaimer line to the brief if the video could be taken as advice.
- **Stay neutral on contested topics:** present them as contested, attribute claims ("según la OMS…"), and tell the user.
- If web search is unavailable, say so, mark every fact as unverified, and do not hand the brief to `lienzo-animate` without the user's explicit OK.

## References

- `references/fact-sheet-template.md` — the output format.
- `references/sources.md` — which sources to trust, and how much.
- `references/claims.md` — how to simplify a fact for the screen without making it false.
