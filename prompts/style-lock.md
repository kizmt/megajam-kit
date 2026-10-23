# Style lock — run first, before any gameplay

Goal: a look Scott approves, written down precisely enough that every later asset and scene can be
checked against it. Budget: ~3 hours of the jam, ~1 hour in practice runs.

## 1. Direction (Scott, 15 min)
Scott gives: the theme take, 3–5 mood words, 2–3 real-world or game references for *feel only*
(no copying), and one sentence on what the player should feel in the first 10 seconds.

## 2. Key art (Claude, 30 min)
1. **Directions in words first (free).** Write 2–3 distinct directions as short paragraphs (setting, light,
   palette, material feel, character idea), all for the same scene. Scott often picks or merges from the text
   alone; then only that direction gets images. (Practice run 2026-10-24: Scott picked from the text.)
2. **Images for the chosen direction(s)** (image model, cost stated first): per direction, 2 key frames of the
   game's main view (different parts of the level) + **1 character sheet** (the player character in a few
   colour variants). The character sheet becomes the reference for `gen/character.ts` concepts.
3. Present side by side. Scott picks or asks for changes. Repeat once at most.
4. Copy the approved images into `art/reference/` (the screenshots in step 4 are compared against them).

## 3. Write `art/style-lock.md`
Concrete and checkable, never vague adjectives:
- **Palette:** 5–7 hex values with roles (key light, shadow, accent, UI, hazard).
- **Lighting:** time of day, sun angle and colour, sky, fog density and colour, exposure range.
- **Post-process:** colour grading LUT or curve notes, bloom, vignette, outline/cel settings.
- **Materials:** one master material approach (flat, toon, painted, PBR). Roughness range.
- **Shape language:** proportions, silhouette rules, level of detail, scale of player vs world.
- **Asset prompt prefix:** the exact text prepended to every image-to-3D concept prompt.
- **Don'ts:** what would break the look.

## 4. Build the look in-engine *before* the game (Claude, 1–1.5 h)
Graybox room + sky + fog + post-process volume + master material + 3 generated hero props.
Capture `art/camera-set.md` shots and compare with the key art. Iterate lighting and post until
Scott says it matches. This scene becomes the template every level is built from.

## 5. Freeze
Scott approves. From here, any change to the look goes through `art/style-lock.md` first.

## Why this order
Mismatched generated assets look cohesive under a strong, consistent lighting/post/material setup,
and look like an asset flip under default lighting. The look is set by the scene, not the meshes.
