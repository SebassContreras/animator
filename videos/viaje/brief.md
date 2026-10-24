# Un día de viaje

## Idea
- **Message:** A good trip is made of small moments, from the open road to a quiet night.
- **Audience:** travellers on social media.
- **Platform / format:** Instagram reel, 1080×1920, 30 fps.
- **Duration:** 12 s.
- **Mandatory text / brand:** none.

## Concept
- **Angles considered:** journey through one day; a postcard collection; a car's point of view.
- **Chosen:** journey through one day — the passing of time (day → dusk → night) carries the story without words.
- **Story in one line:** leaving by day → resting under a tree → passing a town at dusk → arriving at night.

## Visual style
- **Palette:**
  | Role | Hex |
  |---|---|
  | day sky | #7DD3FC → #E0F2FE |
  | grass | #22C55E |
  | road | #374151 |
  | car (accent) | #EF4444 |
  | dusk sky | #7C3AED → #F97316 |
  | night sky | #020617 → #1E1B4B |
  | text | #0F172A on light, #F8FAFC on dark |
- **Shapes:** flat, rounded, no outlines, no shadows.
- **Typography:** Inter 800, titles 80 px, centred.
- **Mood:** warm, nostalgic, calm.
- **Motion language:** steady linear scrolling, gentle sways, slow zoom; no bounces.

## Shot list
| # | Start–end | Framing | Content | Motion | Text | Transition out |
|---|---|---|---|---|---|---|
| 1 | 0–3 | wide | countryside, road, red car | world scrolls, wheels spin | "Un día de viaje" | cut |
| 2 | 3–6 | medium | lone tree on a hill | slow zoom, crown sways, leaves float | "Paradas con sombra" | cut |
| 3 | 6–9 | wide | three houses at dusk | windows light up, blue car crosses | "Pueblos al atardecer" | cut |
| 4 | 9–12 | wide | night hills, moon, stars | still sky, car idles | "Fin del viaje" | fade to black |

## Shots

### Shot 1 · Countryside (0–3 s)
- **Purpose:** hook and setting: we are on the road.
- **Framing:** wide, static camera.
- **Layers (back to front):**
  - Sky: full-canvas rect, day sky gradient (0,0,1080,1920).
  - Sun: yellow circle with glow (780,220,170,170).
  - Clouds 1–2: three white ellipses each (120,300) and (600,520, 70 % size).
  - Hills: light green wavy band, twice the canvas width (0,880,2160,320).
  - Grass: rect (0,1180,1080,740). Road: rect (0,1300,1080,320).
  - Road markings: white dashes 160×20 every 270 px, twice the width (y 1450).
  - Red car: see recurring objects, at (290,1180).
- **Motion:**
  - Road markings: scroll left one canvas width over the full 3 s, linear (speed = travel).
  - Hills: scroll left 120 px over 3 s (parallax, far = slow).
  - Clouds: drift left 40–60 px over 3 s.
  - Car: stays in place, light vibration; wheels spin continuously.
- **Text:** "Un día de viaje" — 80 px, y 440, slides up at 0.2 s.
- **Transition out:** cut at 3 s.

### Shot 2 · The tree (3–6 s)
- **Purpose:** a pause; slow the rhythm.
- **Framing:** medium, slow zoom-in 1 → 1.12 over the shot.
- **Layers (back to front):**
  - Sky: warm gradient #FDE68A → #FDBA74.
  - Hill: dark green mound (0,1400,1080,520).
  - Trunk: brown rounded rect (490,1000,100,460).
  - Tree crown: three overlapping green circles (240,560,600,500), overlapping the trunk top by ≥ 60 px.
  - Floating leaves: 18 small green particles around the crown.
- **Motion:**
  - Tree crown: gentle sway (2°), pivoting at the trunk top, 4 cycles.
  - Leaves: drift slowly.
- **Text:** "Paradas con sombra" — 80 px, y 260, slides up at 3.2 s.
- **Transition out:** cut at 6 s.

### Shot 3 · Town at dusk (6–9 s)
- **Purpose:** time passes; the day ends.
- **Framing:** wide, static.
- **Layers (back to front):**
  - Sky: dusk gradient. Setting sun: orange circle sinking (440,980) → (440,1120).
  - Yellow, white and pink houses: wall rect + triangle roof overlapping the wall + 2 windows + door.
  - Road and grass.
  - Blue car: same design as the red car.
- **Motion:**
  - Windows: dark → yellow, staggered from 6.6 s to 8.1 s.
  - Blue car: crosses from off-screen left (-520) to off-screen right (1100), linear over 3 s.
- **Text:** "Pueblos al atardecer" — 80 px, white, y 360, slides up at 6.2 s.
- **Transition out:** cut at 9 s.

### Shot 4 · Night (9–12 s)
- **Purpose:** arrival and calm.
- **Framing:** wide, static.
- **Layers (back to front):**
  - Night sky gradient. Stars: 80 still dots, top 1200 px.
  - Moon: pale circle with glow (700,260,200,200).
  - Dark hills, road, red car idling at (290,1240).
- **Motion:** stars still; car light vibration; wheels turning slowly.
- **Text:** "Fin del viaje" — 80 px, white, y 700, slides up at 9.2 s.
- **Transition out:** fade to black from 11 s to 12 s.

## Recurring objects
- **Car (500×240):** body path, light-blue windows, a small headlight, two wheels (110×110 each at x 70 and 330, y 120) made of tyre, rim and spokes, all spinning.
- **House:** wall rect; roof triangle 40 px wider than the wall and 140 px tall, base overlapping the wall by 20 px; two windows at 25 % height; door centred at the bottom.

## Audio (optional)
- none

## Sources
- **Fact sheet:** not needed (fiction)
- **Verification:** not needed
- **Facts per shot:** none

## Feasibility notes
- Falling leaves → floating leaves around the crown (particles cannot fall).
- Crown sway needs a pivot at the trunk top → described in shot 2.

## Build prompt
> Use the lienzo-animate skill to build `videos/viaje/brief.md` in project `animator-lab` as scene `viaje`.
> Follow the brief exactly: shot timings, palette, layer names and text strings.
> Use a generator script. Save the scene, then hand over for joint-mode review.
