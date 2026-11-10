# Style lock — run after `prompts/concept.md`, before any gameplay

Starts at the contest start: key art images are created art (rule 7(h)). Steps 1 and 2.1 and the audio direction in
words run in the theme window (`prompts/concept.md` step 6).

**Run this in a session started in the project folder** (`cd C:\dev\<Project>; claude`): the Unreal MCP tools load
from the project's `.mcp.json`. A planning session carried over from the theme window has none; it can still drive
the editor through the kit (`node gen\unreal\mcp.ts call ...`, `node gen\unreal\py.ts <file>`), but a fresh session
is cheaper and has the project's `CLAUDE.md`.

Goal: a look the director approves, written down precisely enough that every later asset and scene can be
checked against it. Budget: ~3 hours of the jam, ~1 hour in practice runs.

## 1. Direction (the director, 15 min)
The director gives (with the picked concept in `design/concept.md`): 3–5 mood words, 2–3 real-world or game
references for *feel only* (no copying), and one sentence on what the player should feel in the first 10 seconds.

## 2. Key art (Claude, 30 min)
1. **Directions in words first (free).** Write 2–3 distinct directions as short paragraphs (setting, light,
   palette, material feel, and the hero: the protagonist or hero object from `design/concept.md`), all for the same scene. The director can often pick or merge from the
   text alone; then only that direction gets images.
2. **Images for the chosen direction(s)** (image model, cost stated first; prices in `PIPELINE.md`): per direction,
   2 key frames of the game's main view (different parts of the level) + **1 hero sheet** (the protagonist, or the
   hero object; a front view in a neutral pose for `gen/character.ts`, plus a few colour variants), every time:
   the hero is never the template mannequin (CLAUDE.md "The hero and the budget"). The hero sheet becomes the
   reference for `gen/character.ts` concepts, and its generation starts as soon as it is approved.
   Each key frame should hold something only this game has (the hero, a landmark, a creature): a frame that could
   belong to any game is not done.
3. Present side by side. The director picks or asks for changes. Repeat once at most.
4. Copy the approved images into `art/reference/` (the screenshots in step 4 are compared against them).

## 3. Write `art/style-lock.md`
Concrete and checkable, never vague adjectives:
- **Palette:** 5–7 hex values with roles (key light, shadow, accent, UI, hazard).
- **Lighting:** time of day, sun angle and colour, sky, fog density and colour, exposure range (for an interior
  or abstract space: the key light sources, their colours and the ambient level instead of sun and sky).
  For a dark game, give a numeric black floor (e.g. "darkest 1% of pixels at luma ≥ N/255, under 1% near-black") and
  check in-engine shots against that number, not against the key art: image models crush blacks at the frame edges
  even when told not to.
- **Megascans:** yes or no, and for what (supporting surfaces, debris, decals only: `docs/ue/worldbuilding.md`
  "Quixel Megascans"). No for a stylised look.
- **Post-process:** colour grading LUT or curve notes, bloom, vignette, outline/cel settings. Name the stack
  precisely: each PP material with its Blendable Location (Before Tonemapping for outlines), the LUT file and
  intensity, tonemapper deviations (Tone Curve Amount, Expand Gamut), local exposure values, the Custom Depth-Stencil
  mode and stencil value table (e.g. 1 = interactable, 2 = hazard), and whether Substrate Toon is in (only if a
  practice run proved it). Details: `docs/ue/materials.md` "Stylized looks", `docs/ue/lighting.md` "Post-process look".
- **Materials:** one master material approach (flat, toon, painted, PBR). Roughness range.
- **Shared style values** for everything generated (`docs/ue/materials.md` "One look for every generated asset"):
  `PaletteStrength` and `PaletteColor`, `CavityStrength` and `CavityColor`, `GradientStrength` and `GradientColor`,
  `EdgeStrength` and `EdgeColor`, with colours from the palette above. Write the exact `materials.ts style ...`
  line here: it is the one place the look of every prop and the hero is set.
- **Shape language:** proportions, silhouette rules, level of detail, scale of what the player controls (if
  anything) vs the world.
- **Asset prompt prefix:** the exact text prepended to every image-to-3D concept prompt.
- **Don'ts:** what would break the look.

## 4. Build the look in-engine *before* the game (Claude, 1–1.5 h)
The main view's space (sky, or the interior's lights) + fog + post-process volume + master material + the hero (or
its first generated pass) + 3 generated signature assets, **and 3-4 pieces of the game's real shapes in the locked shape language** (the structures, surfaces or
silhouettes the key art is made of: architecture from Blender kit pieces, `docs/ue/procedural-assets.md`; organic
shapes from Tripo), not only boxes: light can't fix shape, and a look tuned on grey boxes keeps
being tuned on grey boxes (a practice run spent six light passes while every critic named shapes).
First apply `SETUP.md` 7b ("All paths" plus the chosen path; `scripts\preflight.ps1` lists any 7b setting still
missing): every capture and bench before it measures the wrong picture. The Basic level has no post-process volume: build an unbound one here, and on the Lumen path set its
`LumenMaxRoughnessToTraceReflections` to 0.25 (`SETUP.md` 7b).
Set the shared style values from the spec (`node gen/unreal/materials.ts style ...`) once the hero and the signature
assets are in, and tune them on those in the key frames' light: the test is that the assets read as one set.
Place 4-6 fixed cameras (`art/camera-set.md`: the gameplay view plus key spots; CameraActors tagged `CamSet` and
`cam:<Name>`), capture them with `gen/test/camset.ps1` and compare with the key art.
- **At most two passes of light and post only.** After that, or as soon as the critic's flaws are about shape,
  stop tuning light: the next gains are in shapes, materials and dressing.
- **Risky effects are proven here or dropped:** anything prone to shimmer or cost (volumetric clouds, water, fine
  foliage, large translucency) passes `gen/test/stability.ps1` and a bench in this scene before it is locked.
- **Re-base the references on the game:** once the director accepts the scene, its best camera-set captures join
  `art/reference/` as the target for later comparisons. AI key art is a mood target the engine can't match pixel
  for pixel; comparing every later shot only against it sets a bar the game can't reach.
The director says when it matches. This scene becomes the template every level is built from.

## Audio direction (words in the theme window, first sounds at S)
Audio is a full judging category; the look gets locked, so does the sound. Write `design/audio.md`
(principles: `docs/design.md` "Audio and pacing"; generation: `docs/elevenlabs.md`):
- **Mood:** the director's 3-5 audio mood words and 1-2 references for feel.
- **Pillars:** 3-4 rules every sound follows (e.g. "dry and close", "no reverb tails over 1 s").
- **Music approach:** cues per area or adaptive layers; which cue for calm, pressure and the climax.
- **Ambience table:** one bed per area or beat.
- **SFX list:** one line per verb from the verb table (`design/concept.md`), plus every telegraph.
- **Mix rules and checks:** what sits on top (danger, success), music under effects, nothing clips; each with a
  pass/fail check.

After S, prove the music approach early: the first cue and a few verb sounds are generated and heard in the editor
by the risk spike (S + 6 h). The first playable has a sound on every verb.

## 5. Freeze
The director approves. From here, any change to the look goes through `art/style-lock.md` first.
Append the style-lock calls to `DECISIONS.md` (started in the theme window with the concept pick): direction, render
path, lighting, palette, and the target fps (`docs/ue/performance.md` "The bar").

## Why this order
Mismatched generated assets look cohesive under a strong, consistent lighting/post/material setup,
and look like an asset flip under default lighting. The look is set by the scene, not the meshes.
