# Performance rules (UE 5.8.4, RTX 4060 8 GB)

The goal: never dig a hole we can't climb out of in 93 hours. These rules come from Epic's 5.8 docs
(links at the bottom) plus what we measured on GIZMO. Check them when adding content, not after the
game feels slow.

## Budgets (packaged build, 1440p internal)

| Thing | Budget | Why |
|---|---|---|
| Frame | 60 fps = 16.6 ms; check `stat unit` after every big change | Fix slowness the round it appears |
| Unique generated props | ~20-40 for a 5-10 min game | Each is ~25k tris + four 2K textures |
| Textures per prop | 2K hero, 1K small/background (`--tex 1024`) | Texture memory is the real 8 GB limit |
| Dynamic shadow-casting lights | Keep few (sun + a handful) | Each one re-renders shadows |
| Packaged zip | under 1 GB; zip excludes the ~350 MB `.pdb` (`package.ps1` keeps it beside the build) | itch limit |

## Geometry

- **Nanite on for every static prop** (pipeline does it). Epic: enable "wherever possible". Without it a generated
  prop draws all its triangles at every distance (they import with one LOD) - the Unity-style "too many LODs/polys" trap.
- Nanite supports **Opaque and Masked** materials only. Translucent (glass, water) needs a non-Nanite mesh/material.
- Exceptions to "Nanite on": meshes used **as particles** in Niagara (keep small, non-Nanite, no collision/shadows;
  see `vfx.md`) and translucent/glass meshes (`materials.md`).
- Nanite skeletal meshes: use animation LODs, not geometry LODs; morph targets unsupported.
- Many copies of one prop (rocks, crates, trees): place as **instances** (instanced static mesh / PCG), not hundreds of
  separate actors.
- Collision: imported props get one auto **convex hull** (cheap). Never use "complex as simple" on generated meshes.
  For hollow/walk-in shapes, build simple boxes/capsules.

## Materials and shaders

- **One master material + instances** (`M_PBR_Master`, `MI_<Name>`). Never per-asset materials: each new material
  is a new set of shaders to compile and a new stall.
- Master material must have usage flags set (Nanite, skeletal, instanced). A flag missing in a **packaged** build
  = default grey material. `materials.mjs` sets them.
- Shader compiles after a material change make things render grey for a while in the editor. Wait before judging a screenshot.

## Textures and memory

- Streaming pool is shared by all textures; over budget = blurry textures (engine drops top mips). Watch for
  blurriness after adding many props; `--tex 1024` for anything small or far.
- Normal maps: `TC_Normalmap`, sRGB off. Roughness/metallic: grayscale, sRGB off. (`materials.mjs` handles it.)
- Possible later win: pack roughness/metallic into one texture (ORM) to cut texture count per prop.

## CPU / gameplay code

- **Tick off by default** in C++ (`PrimaryActorTick.bCanEverTick = false`) unless the actor truly changes every frame.
  Use timers, events, or a tick interval instead. Epic: don't poll a value every frame for occasional changes.
- **Pool** frequently spawned things (projectiles, pickups, VFX) instead of spawn/destroy; spread big spawns across frames.
- Heavy work in one Blueprint event runs in one frame and hitches. Keep logic in C++ (our convention anyway).
- UI runs on the game thread: avoid per-frame bindings in widgets; update on change.
- Load big assets asynchronously; avoid giant hard-reference chains (one asset dragging in half the game).

## Measuring (do this, don't guess)

- In editor: viewport > Show FPS; console `stat unit` (frame / game / draw / GPU ms), `stat gpu`, `stat rhi`.
  Game ms highest = CPU/gameplay bound; GPU highest = rendering bound.
- `MegajamTools.run_console_command` can issue these from scripts.
- Final truth is the **packaged** build on GIZMO (Epic: profile on target hardware). Package daily from day 2.
- Deep dive: Unreal Insights (CPU/GPU timing per frame), RenderDoc (single GPU frame).

## Sources (5.8)

- Nanite: https://dev.epicgames.com/documentation/en-us/unreal-engine/nanite-virtualized-geometry-in-unreal-engine?application_version=5.8
- Common memory and CPU performance considerations: https://dev.epicgames.com/documentation/en-us/unreal-engine/common-memory-and-cpu-performance-considerations-in-unreal-engine?application_version=5.8
- Profiling intro: https://dev.epicgames.com/documentation/en-us/unreal-engine/introduction-to-performance-profiling-and-configuration-in-unreal-engine?application_version=5.8
- Texture streaming configuration: https://dev.epicgames.com/documentation/en-us/unreal-engine/texture-streaming-configuration-in-unreal-engine?application_version=5.8
- Measured on GIZMO 2026-10-24: generated props import with 1 LOD, Nanite off, one convex hull; enabling Nanite
  took ~0.7 s per mesh; MIs needed the Nanite usage flag.
