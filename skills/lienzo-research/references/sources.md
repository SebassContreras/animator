# Sources: what to trust

## Tiers

| Tier | Examples | Use |
|---|---|---|
| 1 · Primary / official | government statistics offices, WHO, UN, NASA, central banks, standards bodies, the original paper, a company's own docs (for its own product) | enough on its own |
| 2 · Peer-reviewed / expert | journals, systematic reviews, university pages, encyclopaedias with editorial review (Britannica), professional bodies | enough on its own for established facts; two for numbers |
| 3 · Quality press and reference | major newspapers and agencies, Wikipedia (as a map to its cited sources) | confirm with a tier 1–2 source before calling it verified |
| 4 · Weak | blogs, content farms, social media, forums, AI-generated pages, press releases about one's own results | leads only; never the sole source |

## Checks before citing

- **Independent:** two articles repeating the same press release count as one source.
- **Date:** prefer the latest data; say the year. Old numbers for changing things are "outdated".
- **Scope:** the source must say what you claim, for the same place, population and time.
- **Original:** follow citations back to the origin when a number is quoted second-hand.
- **Conflict of interest:** a company's claims about its own results need outside confirmation.
- **Language:** search in the user's language and in English; official sources are often in the local language.

## Search tactics

- Search the exact claim and its negation ("X causes Y", "X does not cause Y").
- Add `site:` for official domains (`site:who.int`, `site:ine.es`, `site:nasa.gov`).
- Add the year for statistics ("2024", "2025").
- Search "myth", "misconception" or "debunked" plus the topic to find pitfalls.
- Run independent searches in parallel.
- A brand site that blocks crawlers (`robots.txt: disallow: /`) or renders with JavaScript (a plain fetch gets an empty shell): open the official page in the user's real browser with `browser-nav` (`pwa-nav` is its legacy alias; `open <url> --launch --allow-origin`) from the start, or ask the user to paste the page text. Its `snapshot` lists headings and buttons but not paragraph text: open each panel and read it from a `screenshot`. Cookie banners get the essential-only choice (ringana.com, ringana-skin-perfection).
- Look for linked PDFs first (studies, data sheets): they hold the richest facts, and browser snapshots miss body text inside tabs.
