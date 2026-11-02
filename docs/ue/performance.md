# Performance rules (UE 5.8.4, RTX 4060 8 GB)

The goal: never dig a hole we can't climb out of in 93 hours. These rules come from Epic's 5.8 docs
(links at the bottom) plus what we measured on the target PC. Check them when adding content, not after the
game feels slow.

## The bar (single definition; other docs point here)

Smoothness and reach come before raw frame rate: no render lag, no visible frame drops, and weaker PCs can still
play. The right frame rate depends on the game, so the bar has a fixed part and a per-game part.

**Every game (fixed).** Packaged build on the target PC (RTX 4060, 4K output), measured with `gen/perf/bench.ts
--target-fps <target>`, which prints PASS/FAIL per variant:
- **No hitches:** no frame longer than twice the target frame time (after the skipped warm-up frames). Usual
  causes: shader/PSO compiles, asset loads or spawns mid-play, a garbage-collection spike.
- **Steady pacing:** the 1% low (p99 frame time) within 20% of the average fps.
- **At or above the target:** the slowest 5% of frames (p95) at or above the game's target fps.
- **A settings menu that scales:** quality preset, resolution scale, frame cap and vsync, applied and saved through
  `UGameUserSettings` (`SetOverallScalabilityLevel`, `SetResolutionScaleNormalized`, `SetFrameRateLimit`,
  `SetVSyncEnabled`, then `ApplySettings` and `SaveSettings`). This is what lets a weaker PC play. Applying a preset
  overwrites the shipped mix (full Lumen: High GI/reflections/shadows; Lumen Lite: Medium GI/reflections, High
  shadows; Epic elsewhere) and `GameUserSettings.ini`
  keeps it, so the menu's default/"recommended" preset must reproduce the shipped mix (or ship High overall).
  On a Lumen game the presets scale the lighting too: **Medium is Lumen Lite** (weaker PCs keep dynamic bounce
  light), **Low turns Lumen off** (unshadowed sky light). Check that the Medium and Low looks still read.

**Per game (chosen at the style lock, recorded in the project's `DECISIONS.md`):**
- **Target fps** on the target PC at 4K output with the shipped defaults: about 60 for a slow, heavy-looking game,
  120 or more for fast action. Until it's chosen, use 60.
- **Low-end check:** the same target on the Low preset at 1080p output (`--res 1920x1080` plus a variant setting the
  `sg.*` groups to 0). The target PC on Low is still far faster than a low-end PC; this checks that the settings
  really scale. (Unverified: that `-DPCVars` applies `sg.*`. Confirm it the first time in the game log or with a
  visible difference. If it doesn't, use `-ExecCmds="scalability 0"` instead, also untested.)

(`node gen/perf/bench.ts` launches the packaged build per variant, cvars via `-DPCVars`, no repackage;
`node gen/perf/csv_report.ts <csv> --target-fps <target>` summarises a single run.)

## Display + render defaults (measured 2026-10-24 on an empty test level, packaged, RTX 4060, 4K monitor)

| Variant (4K output, internal 1080p unless noted) | avg fps | p95 fps | GPU ms |
|---|---|---|---|
| UE defaults (Epic, TSR history 200%, template clouds, motion blur) | 64 | 61 | 14.8 |
| + TSR history 100% | 81 | 76 | 11.6 |
| + no volumetric clouds, no motion blur ("lean") | 98 | 88 | 9.7 |
| **lean + High GI/reflections/shadows (Lumen-path default)** | **120** | **108-110** | **7.5** |
| lean + internal 1440p (Epic) | 71 | 66 | 13.5 |
| lean + internal 1440p + High | 83 | 76 | 11.5 |
| lean + internal 1620p (75%) | 61 | 56 | 16.0 |

Facts:
- The game is GPU-bound (game thread ~2 ms). The biggest costs were **TSR at Epic (200% history, ~3 ms)** and the
  template level's **VolumetricCloud (~2.5 ms)**. Our models/materials cost under 1 ms.
- Internal resolution is the expensive crispness lever: 1080p -> 1440p internal costs ~4 ms at 4K output.
- Desktop screen percentage defaults to "based on display resolution": 4K display -> 1080p internal (50%), 1440p ->
  ~900p (`r.ScreenPercentage` 0 = `r.ScreenPercentage.Default.Desktop.Mode`, mapped in `BaseEngine.ini`
  `[Rendering.AutoScreenPercentage]`). **The render-path pick names the internal resolution at 4K**; left unset it is
  50%, which thin foliage shows as grain under TSR. Compare candidates on foliage in motion, not on a still frame.
- High-DPI: without `bAllowHighDPIInGameMode=True` a 150%-scaled 4K monitor gives the game 2560x1440 and Windows
  stretches it (soft). With it the window is true 3840x2160 (verified with `-ExecCmds="HighResShot 1"` -> 3840x2160 PNG).
  The CSV/log `systemresolution` metadata still says 2560x1440: it is recorded before DPI awareness is set. Ignore it.
- In WindowedFullscreen (the default mode) the saved `ResolutionSizeX/Y` is ignored; the desktop resolution is used.
- Unreal stores `<Build>\<Project>\Saved\Config\Windows\GameUserSettings.ini` on the first run (`<Build>` as defined
  in `debugging.md`); it overrides `DefaultGameUserSettings.ini` afterwards. Delete it when testing new defaults.

The config behind the "lean" rows is SETUP step 7b (this table is the Lumen path at 1080p internal; the no-Lumen
path is in "Render paths"). **Don't place a VolumetricCloud** (use SkyAtmosphere + a cheap sky). The empty test
scene is the floor: real content adds cost, so re-bench after each big content round against the GPU frame budget
("Bench lessons").

## Render paths (measured on a prototype, packaged, 4K output, RTX 4060)

One data point, not a rule: a stylized prototype (glossy look, 12 animated characters on screen, a ~550 m open
level), benched on every render path on the same frame. Other genres and looks will land differently; use the method
(same frame, true 1:1, something moving) and re-measure. avg / p95 fps:

| Path | fps | Look |
|---|---|---|
| Lumen GI + Lumen reflections + TSR 1080p internal | 101 / 95 | Soft bounce; **grainy contact shadows under moving characters** (Lumen GI noise) |
| Lumen GI + SSR + SMAA 1080p | 157 / 147 | Soft, but dithered speckle on silhouettes |
| No Lumen + TSR 1080p | 132 / 124 | Dark undersides until the bounce stand-ins are added (`lighting.md`) |
| No Lumen + SMAA 1080p | 217 / 199 | Fastest, but lower detail (see below) and dark undersides |
| **No Lumen + TSR 1260p + bounce stand-ins** | **122 / 117** | **Best balance for that game: smooth shadows in motion, crisp, close to the Lumen look** |
| No Lumen + TSR 1440p | 103 / 99 | Slightly sharper than 1260p, no headroom |
| Lumen + TSR 1440p / 1620p / native 4K | 77 / 66 / 43 | Crisper, unplayable budgets |

**Lumen Lite** (Medium GI + Medium reflections: Irradiance final gather + SSR; `lighting.md` "Scalability") wasn't on
this prototype's bench. Epic: each Lumen level costs roughly half the one above, and Medium targets 60 fps on low-end
PCs. `bench.ts`'s built-in comparison includes it (`lumenlite-1080p`): measure it at the style lock with the others.

Facts behind the table:
- **Grain under moving characters is Lumen GI noise, not shadows or resolution.** Same VSM settings with GI off gave
  smooth contact shadows at 1260p and 1440p, still and in motion. When choosing a path, capture a running character's
  feet at true 1:1 (a still plus a 1 s clip), not only a static frame.
- **Non-temporal AA below 100% (SMAA/FXAA + screen percentage) is a lower-detail path, not a cheap crisp one.** In
  5.8.4 the automatic negative texture mip bias (`SceneVisibility.cpp`, only with `TemporalUpscale`) and the Nanite
  view LOD bias apply only with temporal upscaling, and VSM penumbra noise is left unresolved.
- **Virtual shadow maps were cheaper than cascaded ones** in a Nanite scene (shadow depths 0.9 vs 2.6 ms): many large
  meshes land in every cascade. "VSM off" is not a free win; measure it.
- TSR costs ~2.1-2.6 ms at 4K output from 1080p, ~3.7 ms from 1440p. `r.TSR.History.ScreenPercentage=200` adds ~3.2 ms.
- With TSR/TAA, post-processing runs at output resolution (~1 ms at 4K); with a spatial upscale at internal resolution.
  PP materials set Before Tonemapping still run at internal resolution (Epic's `BlendableLocation` enum): put
  outlines and other neighbour-sampling passes there (`materials.md` "Stylized looks").
- **Past ~200 fps the render thread sets the frame.** With ~110 draw calls, `EventWait/Visibility` took 1.4 ms;
  `r.AllowOcclusionQueries=0` (small open scenes) took p95 173 -> 190 fps. When GPU ms < frame ms, read the render
  thread column before trimming the GPU.
- `r.DynamicGlobalIlluminationMethod` / `r.ReflectionMethod` are read every frame (unless a PPV overrides them), so
  `bench.ts` variants with `-DPCVars` compare paths without repackaging.
- A canvas HUD with outlined text cost ~0.5 ms at 4K. Measure the HUD on its own when it lands.
- Bloom off and lower VSM resolution changed p95 by 0-4 fps (noise) on this content.
- **WPO wind on fine foliage blurs under TSR** (proven on a prototype, 4K output, 1080 internal lines). Leaves or
  florets under about one internal pixel lose detail as soon as they move, even slowly and with correct motion
  vectors: TSR clamps the history on moving pixels (`show VisualizeTSR` + `r.TSR.Visualize 3` lights every moving
  bush, nothing when calm), so moving foliage shows the raw internal resolution. Detail score (mean |Laplacian|):
  wind as shipped 16.8, WPO off 29.7. No TSR cvar helped (history 200%, thin-geometry relaxation, velocity weight
  clamping: 16-17.6); `r.Nanite.Foliage=0` 18.6; only more input pixels moved it (66.7% 18.9). What worked: **fade
  fine-foliage wind out near the camera in the material** (per instance: `ObjectPositionWS` to `CameraPositionWS`,
  `Distance`, `saturate((End - d) / (End - Start))` times the WPO), 3 -> 6 m: 45.7 vs 50 with no wind, no pop. The
  per-component WPO disable distance alone popped; set it just past the fade's end. The bend causes it, not the
  flutter. While the camera moves, every variant scores about the same (the camera's motion sets the floor). Decide
  at the style lock which plants move and out to what distance, and judge it on the 4K output.
- **Many animated characters:** enable the Animation Budget Allocator plugin (stable, ships with 5.8, off by
  default; `a.Budget.Enabled=1`, `a.Budget.BudgetMs`) and use its budgeted skeletal mesh component for non-player
  characters. 12 characters needed ~0.6 ms of animation, under a 1 ms budget, so it only matters at larger counts.

### Bench lessons (packaged, 4K output, RTX 4060)

- **On the 4060 at 4K output, a near-empty Lumen HWRT room already costs most of a high-fps budget** (measured: p95
  108-110 on the empty test level above, less in a real room): budget from the bench, not the template level. Over
  ~5% background GPU load (`nvidia-smi` before and after) is a dirty result.
- **When the director watches a bench, only `current` is the game as it ships**; the other built-in runs are
  comparison render paths with their own artifacts (an SSR variant showed a reflection the shipped Lumen config had
  fixed, and was taken for the fix failing). `bench.ts` says which kind each run is; `--only current` runs the
  shipped config alone.
- **TSR at 4K output costs ~2.3 ms whatever the internal resolution.** GPU frame budget for everything else ≈
  1000 / target fps − ~2.3 ms TSR − ~1 ms margin: 60 fps ≈ 13 ms, 90 fps ≈ 8 ms, 120 fps ≈ 5 ms.
- **"Lumen ms" undercounts with async compute.** With `r.Lumen.AsyncCompute 1` the CSV showed only ~0.45 ms of Lumen
  passes, because screen probe gather (~1.1 ms) runs on the compute queue and its time hides inside "Lights". With
  `r.Lumen.AsyncCompute 0` Lumen was ~2.3 ms; async compute saved only ~0.3 ms. Compare the GPU-total delta against a
  no-Lumen variant, or bench Lumen variants once with async off.
- `-ExecCmds="stat gpu"` drew nothing in the packaged build. A game cvar that runs the command from the player
  controller ~1 s after BeginPlay works.
- `r.Lumen.ScreenProbeGather.DownsampleFactor` defaults to **16** in 5.8.4 (probe tile size in pixels). Lower values
  mean more probes and more cost: 2 is not a cheap setting.
- `r.Lumen.Reflections.Allow 0` with `r.ReflectionMethod 1` falls back to SSR (on purpose, in
  `ShouldRenderScreenSpaceReflections`).
- Game cvars from a static `FAutoConsoleVariableRef` in the game module are set by `-DPCVars` in a packaged build
  (verified), so game switches work as bench variants.

## Budgets (packaged build, 4K output)

| Thing | Budget | Why |
|---|---|---|
| Frame | "The bar" above (no hitches, steady pacing, p95 at the game's target); `stat unit` after every big change, `bench.ts` per milestone | Fix slowness the round it appears |
| Unique generated props | Set by texture memory (8 GB VRAM), not a count. Estimate from one prototype: ~20-40 for a 5-10 min game | Each carries three textures (colour, normal, ORM); a prototype's props measured ~25k tris |
| Textures per prop | 2K hero, 1K small/background (`--tex 1024`) | Texture memory is the real 8 GB limit |
| Dynamic shadow-casting lights | Keep few (sun + a handful) | Each one re-renders shadows |
| Packaged zip | under 1 GB; zip excludes the ~350 MB `.pdb` (`package.ps1` keeps it beside the build) | The jam's size limit |

## Geometry

- **Nanite on for every static prop** (pipeline does it). Epic: enable "wherever possible". Without it a generated
  prop draws all its triangles at every distance (they import with one LOD) - the Unity-style "too many LODs/polys"
  trap.
- Nanite supports **Opaque and Masked** materials only. Translucent (glass, water) needs a non-Nanite mesh/material.
- Exceptions to "Nanite on": meshes used **as particles** in Niagara (keep small, non-Nanite, no collision/shadows;
  see `vfx.md`) and translucent/glass meshes (`materials.md`).
- Nanite skeletal meshes: use animation LODs, not geometry LODs; morph targets unsupported.
- **Nanite on plants: pick the shape preservation per size** (Static Mesh > Nanite Settings,
  `MeshNaniteSettings.shape_preservation`; rehearsal on 5.8.4). With the default, thin foliage vanishes at distance:
  trees with 10-14 cm leaves read as bare sticks beyond ~60 m (Nanite simplifies thin triangles away), and
  `PRESERVE_AREA` alone did not fix that. `VOXELIZE` (Nanite Foliage, Experimental: `features.md`) suits trees and big
  shrubs (5-7 m trees looked right). On small, thin plants (grass clumps 0.4-1.1 m) it turned every clump into a
  speckled leafy blob 3-8 m from the gameplay camera; `PRESERVE_AREA` (or Nanite off) gave real blades, proven by
  toggling the one setting. Leaf size and cluster density in the source mesh matter too. Check each plant on the
  gameplay camera and from its farthest gameplay view after import, before placing it in bulk.
- **Voxelize foliage can carry WPO wind** (crowns moved in a two-frame capture; `NaniteVertexFactory.ush` evaluates
  WPO for voxel clusters). Give every material slot of a plant the same WPO or leaves detach from stems, and set a
  WPO disable distance on the foliage types and components. Untested: whether far voxel bricks keep the offset.
- Many copies of one prop (rocks, crates, trees): place as **instances** (instanced static mesh / PCG), not hundreds of
  separate actors.
- Collision: imported props get one auto **convex hull** (cheap). For openings and walk-in shapes use authored
  boxes or `asset.ts --hulls N`. Static world architecture (walls, buildings, long or curved meshes) uses
  complex-as-simple (`physics.md` "Collision for generated meshes").

## Materials and shaders

- **One master material + instances** (`M_PBR_Master`, `MI_<Name>`). Never per-asset materials: each new material
  is a new set of shaders to compile and a new stall.
- Master material usage flags: a flag missing in a **packaged** build = default grey material (details and the full
  flag list: `materials.md`). `materials.ts` sets them.
- Shader compiles after a material change make things render grey for a while in the editor. Wait before judging a
  screenshot.

## Textures and memory

- Streaming pool is shared by all textures; over budget = blurry textures (engine drops top mips). Watch for
  blurriness after adding many props; `--tex 1024` for anything small or far.
- **The engine's pool is only 800 MB at High** (`BaseScalability.ini`: `r.Streaming.PoolSize` 400 / 600 / 800 / 1000 /
  3000 for TextureQuality 0 / 1 / 2 / 3 / Cine). A dense 4K scene with 2K textures blurred at 5 m (low mips), and a
  restart didn't help; a live `r.Streaming.PoolSize 3000` A/B made the same camera sharp (proven). Set the pool per
  quality level in `Config/DefaultScalability.ini` (SETUP step 7b). On Windows `PoolSizeVRAMPercentage=70` and
  `r.Streaming.LimitPoolSizeToVRAM=1` cap a large pool to the card's free VRAM, so a big Epic/Cine pool is safe on
  weaker cards. Check with `stat streaming` (Over budget) or the live A/B.
- Normal maps: `TC_Normalmap`, sRGB off. AO/roughness/metallic are packed into one ORM texture (`TC_Masks`, sRGB off;
  `gen/blender/pack_orm.py`), so each prop has 3 textures. (`materials.ts` handles the settings.)

## CPU / gameplay code

- **Tick off by default** in C++ (`PrimaryActorTick.bCanEverTick = false`) unless the actor truly changes every frame.
  Use timers, events, or a tick interval instead. Epic: don't poll a value every frame for occasional changes.
- **Pool** frequently spawned things (projectiles, pickups, VFX) instead of spawn/destroy; spread big spawns across
  frames.
  Size the pool for the peak count and log a warning when it runs dry, so an undersized pool shows up in the log.
- **Stagger enemy thinking:** decisions (target choice, path requests, line-of-sight traces) on a timer every
  0.1-0.3 s with a random first delay per enemy, so they don't all think on the same frame. Movement and animation
  still update every frame.
- Heavy work in one Blueprint event runs in one frame and hitches. Keep logic in C++ (our convention anyway).
- UI runs on the game thread: avoid per-frame bindings in widgets; update on change.
- Load big assets asynchronously; avoid giant hard-reference chains (one asset dragging in half the game).
- **Runtime components on streamed actors get a unique name.** A World Partition actor that made a component in
  BeginPlay with `NewObject<UStaticMeshComponent>(this, TEXT("Glow"))` hitched ~20 ms whenever its cell streamed out
  and back before GC: the same actor returned, NewObject replaced the live component of that name, and the game
  thread waited for its render resources ("Gamethread hitch waiting for resource cleanup ... overwrite took
  20.47ms"). `MakeUniqueObjectName(this, Class, TEXT("Glow"))` removed it.

## Measuring (do this, don't guess)

- In editor: viewport > Show FPS; console `stat unit` (frame / game / draw / GPU ms), `stat gpu`, `stat rhi`.
  Game ms highest = CPU/gameplay bound; GPU highest = rendering bound.
- `MegajamTools.run_console_command` can issue these from scripts.
- Final truth is the **packaged** build on the target PC (Epic: profile on target hardware). Package daily from day 2.
- Deep dive: Unreal Insights (CPU/GPU timing per frame), RenderDoc (single GPU frame).

## Sources (5.8)

- Nanite: https://dev.epicgames.com/documentation/en-us/unreal-engine/nanite-virtualized-geometry-in-unreal-engine?application_version=5.8
- Common memory and CPU performance considerations: https://dev.epicgames.com/documentation/en-us/unreal-engine/common-memory-and-cpu-performance-considerations-in-unreal-engine?application_version=5.8
- Profiling intro: https://dev.epicgames.com/documentation/en-us/unreal-engine/introduction-to-performance-profiling-and-configuration-in-unreal-engine?application_version=5.8
- Texture streaming configuration: https://dev.epicgames.com/documentation/en-us/unreal-engine/texture-streaming-configuration-in-unreal-engine?application_version=5.8
- BlendableLocation enum (PP material resolution): https://dev.epicgames.com/documentation/en-us/unreal-engine/python-api/class/BlendableLocation?application_version=5.8
- Measured on the target PC 2026-10-24: generated props import with 1 LOD, Nanite off, one convex hull; enabling Nanite
  took ~0.7 s per mesh; MIs needed the Nanite usage flag.
