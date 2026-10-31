# Styles

Pick one per piece and copy its block into the brief's "Visual style". Hex values are starting points; the brand's colours (`brand.lock.json`) replace them by role, and `palette.json` holds only overrides and story roles.

Add a style here only after it worked in a real piece (note the brief).

Used in: Bright science → `videos/ringana-omega-v2/brief.md`.

## Bright science (explainers, facts, products)

Rounded, vivid, friendly; in the spirit of Kurzgesagt or TED-Ed.

- **Palette:** dark saturated background (#1B1F4B), 2 vivid roles (`primary` #FF6B6B, `secondary` #4ECDC4), 1 warm accent (#FFE66D), text #FFFFFF.
- **Shapes:** rounded geometry, corner radius ≈ 15–25 % of the short side; no outlines.
- **Shading:** flat. One shadow tone on the side away from the light and one highlight tone on the lit edge, both derived by `tones(base)` (OKLCH: shadow −12 L, hue toward blue-violet; highlight +12 L, hue toward yellow), so shadows stay cool and lively, never muddy. Glow (`bgGlow`) only on small focal objects; behind big areas use a plain disc at 4–12 % opacity, since a large `bgGlow` washes the frame white (ringana-omega v2).
- **Type:** one rounded sans (e.g. Nunito, Poppins), 800 for titles, 500 for support.
- **Motion:** `back-out` entries, gentle `float` on everything that is not ground, particles for atmosphere.

## Soft depth (wellness, lifestyle, premium products)

Calm, airy, layered.

- **Palette:** light warm background (#F6F1EB), 2 muted roles (`primary` #9DB5A0, `secondary` #E3B5A4), 1 deep accent (#3D405B), text #3D405B.
- **Shapes:** organic blobs and pills, large radius; objects sit on soft shadow ellipses.
- **Shading:** two-colour vertical gradients (light top → slightly darker bottom) on big shapes; `shadow` enabled only on the focal object, low opacity, large blur.
- **Type:** one elegant sans or serif (e.g. DM Sans, Playfair Display), 600 / 400.
- **Motion:** `cubic-out` and `ease-in-out`, long fades, slow `breathe`; no bounces.

## Bold graphic (promos, announcements, tips lists)

Loud, high contrast, poster-like.

- **Palette:** 1 flat background (#FFD23F), black #111111, 1 punch colour (#EE4266), white #FFFFFF.
- **Shapes:** hard geometry, thick black outlines (`border.width` 6–10 on 1080 wide), offset hard shadow = a black copy shifted 12 px down-right.
- **Shading:** none besides the offset shadow.
- **Type:** one heavy grotesk (e.g. Archivo Black, Anton), uppercase titles.
- **Motion:** fast `pop` / `elastic-out`, hard cuts on the beat, `@scale` punch (1 → 1.08 → 1) on key words.

## Night glow (tech, data, space, moody stories)

Dark, luminous, focused.

- **Palette:** navy-to-black gradient background (#0B1026 → #000000), 1 glow colour (#7B5CFF), 1 secondary glow (#00D1FF), text #EAF0FF.
- **Shapes:** thin lines and outlined shapes (`border.width` 2–4), few filled areas.
- **Shading:** glow circles behind lights; lines `draw` on.
- **Type:** one geometric sans or mono (e.g. Space Grotesk, JetBrains Mono).
- **Motion:** strokes drawing on, slow camera drift, `pulse` on lights, still particles as stars.
