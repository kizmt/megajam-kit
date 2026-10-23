# Performance rules (UE 5.8.4, RTX 4060 8 GB)

The goal: never dig a hole we can't climb out of in 93 hours. These rules come from Epic's 5.8 docs
(links at the bottom) plus what we measured on GIZMO. Check them when adding content, not after the
game feels slow.

## Display + render defaults (measured 2026-10-24, packaged SmokeTest, GIZMO 4K monitor)

Target: **100+ fps at 4K output** on the RTX 4060. Measure with `node gen/perf/bench.ts` (launches the packaged
build per variant, cvars via `-DPCVars`, no repackage) and `node gen/perf/csv_report.ts <csv>`.

| Variant (4K output, internal 1080p unless noted) | avg fps | p95 fps | GPU ms |
|---|---|---|---|
| UE defaults (Epic, TSR history 200%, template clouds, motion blur) | 64 | 61 | 14.8 |
| + TSR history 100% | 81 | 76 | 11.6 |
| + no volumetric clouds, no motion blur ("lean") | 98 | 88 | 9.7 |
| **lean + High GI/reflections/shadows (kit default)** | **120** | **108-110** | **7.5** |
| lean + internal 1440p (Epic) | 71 | 66 | 13.5 |
| lean + internal 1440p + High | 83 | 76 | 11.5 |
| lean + internal 1620p (75%) | 61 | 56 | 16.0 |

Facts:
- The game is GPU-bound (game thread ~2 ms). The biggest costs were **TSR at Epic (200% history, ~3 ms)** and the
  template level's **VolumetricCloud (~2.5 ms)**. Our models/materials cost under 1 ms.
- Internal resolution is the expensive crispness lever: 1080p -> 1440p internal costs ~4 ms at 4K output.
- Desktop screen percentage defaults to "based on display resolution": 4K display -> 1080p internal (50%), 1440p -> ~900p.
- High-DPI: without `bAllowHighDPIInGameMode=True` a 150%-scaled 4K monitor gives the game 2560x1440 and Windows
  stretches it (soft). With it the window is true 3840x2160 (verified with `-ExecCmds="HighResShot 1"` -> 3840x2160 PNG).
  The CSV/log `systemresolution` metadata still says 2560x1440: it is recorded before DPI awareness is set. Ignore it.
- In WindowedFullscreen (the default mode) the saved `ResolutionSizeX/Y` is ignored; the desktop resolution is used.
- Unreal stores `<Build>\<Project>\Saved\Config\Windows\GameUserSettings.ini` on the first run; it overrides
  `DefaultGameUserSettings.ini` afterwards. Delete it when testing new defaults.

Config (SETUP step 7b applies it): `DefaultEngine.ini` `[/Script/Engine.RendererSettings] r.DefaultFeature.MotionBlur=False`,
`[/Script/Engine.UserInterfaceSettings] bAllowHighDPIInGameMode=True`; `DefaultScalability.ini`
`[AntiAliasingQuality@3]` and `@Cine` `r.TSR.History.ScreenPercentage=100`; `DefaultGameUserSettings.ini`
`[ScalabilityGroups] sg.GlobalIlluminationQuality=2 sg.ReflectionQuality=2 sg.ShadowQuality=2`.
**Don't place a VolumetricCloud** (use SkyAtmosphere + a cheap sky). The empty test scene is the floor: real content
adds cost, so re-bench after each big content round and keep ~8 ms GPU headroom in mind.

## Budgets (packaged build, 4K output)

| Thing | Budget | Why |
|---|---|---|
| Frame | 100+ fps (10 ms) at 4K output; `stat unit` after every big change, `bench.ts` per milestone | Fix slowness the round it appears |
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
  = default grey material. `materials.ts` sets them.
- Shader compiles after a material change make things render grey for a while in the editor. Wait before judging a screenshot.

## Textures and memory

- Streaming pool is shared by all textures; over budget = blurry textures (engine drops top mips). Watch for
  blurriness after adding many props; `--tex 1024` for anything small or far.
- Normal maps: `TC_Normalmap`, sRGB off. Roughness/metallic: grayscale, sRGB off. (`materials.ts` handles it.)
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
