# Simplifying claims for the screen

Short text is where truth breaks. Shorten wording, never meaning.

## Safe simplifications

| Full fact | Screen version | Why it is safe |
|---|---|---|
| "About 71 % of Earth's surface is covered by water" | "~71 % de la superficie es agua" | keeps the scope: surface, not the whole planet |
| "Light from the Sun takes about 8 minutes 20 seconds to reach Earth" | "La luz del Sol tarda ~8 min" | rounded down with "~" |
| "Mount Everest is 8,848.86 m tall (China–Nepal survey, 2020)" | "El Everest mide 8.849 m" | rounded to the metre, same subject and unit |

## Unsafe simplifications

| Full fact | Bad screen version | Problem |
|---|---|---|
| "Risk rises 20 % in people who…" | "20 % de las personas…" | relative risk turned into a share of people |
| "Up to 50 %" | "50 %" | the maximum becomes the typical value |
| "In mice, X reduced Y" | "X reduce Y" | dropped the population |
| "Correlated with" | "Causa" | correlation turned into causation |
| "In Spain, 2023" | "En el mundo" | changed place |
| "71 % of Earth's surface is water" | "71 % del planeta es agua" | surface turned into the whole planet (water is a tiny share of its mass) |
| "Studies suggest" | "Está demostrado" | inflated certainty |

## Brand claim rules

The brand's own claim rules and disclaimers live in its Lienzo guide (`guide` in `videos/<slug>/brand.lock.json`, sections such as "Claim rules" and "Mandatory text"). Read them first: they add to the rules below and win where they are stricter. If the brand has no guide and the piece makes claims, propose the rules to the user for the guide (`project_update` → `guide`).

## Health claims

- Phrase health benefits like the EU authorised claims (Regulation (EU) No 432/2012; check the wording in the [EU Register of health claims](https://food.ec.europa.eu/food-safety/labelling-and-nutrition/nutrition-and-health-claims/eu-register-health-claims_en)), e.g. "contributes to the normal function of the heart".
- Leave out seller claims outside that wording (anti-inflammatory, disease prevention, "cellular energy").
- Attribute a brand's own study on screen, in the form its guide sets (RINGANA's guide: "RINGANA study" with the sample size, plus the study footnote).

## Visual claims

- Charts must keep proportions: a bar for 30 must be half the height of one for 60. Axes start at 0 unless labelled.
- An order of steps shown on screen must match the real process.
- Maps, flags, logos and icons imply facts. Check them too.
- Illustrative numbers (made-up examples) must be labelled as examples on screen.

## Hedging words that keep a claim true

`~`, "casi", "hasta", "más de", "alrededor de", "según <fuente>", "en <lugar>, <año>".
