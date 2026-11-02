# VFX with Niagara (UE 5.8.4, RTX 4060 8 GB)

Effects are a cheap way to make the game look alive, and judges notice them. They also cause hitches and
GPU overdraw. These rules come from Epic's 5.8 Niagara agent skills (on disk), the 5.8 headers, and the 5.8 docs
(links at the bottom). The rule: **start from an engine template, spawn and drive from C++, pool anything repeated.**

## Setup facts (5.8 on the target PC)

| Thing | Status | Notes |
|---|---|---|
| `Niagara` plugin | On by default | C++ module `Niagara` in Build.cs (see `cpp.md`) |
| `NiagaraToolsets` (MCP tools + 7 agent skills) | **Experimental**, editor-only, off by default | Pulled in by `AllToolsets`, which we enable |
| Lightweight (stateless) emitters | Since 5.4. Templates ship in 5.8 | Toolset **can't edit them** (see below) |
| `NiagaraFluids` | Beta | Grid gas/fire sims. Too slow to run live in a jam game; use it only to bake flipbooks (see "Fire and smoke") |
| `NiagaraNanite` (Nanite mesh renderer) | Experimental, off | Skip it |
| Heterogeneous Volumes / Sparse Volume Textures | Experimental (5.8 docs) | For volumetric smoke/fire. Skip it: costly, shadows Experimental. Mood smoke: Local Fog Volumes (`lighting.md`) or sprites |

## Epic's Niagara agent skills: load them before any Niagara MCP work

These are in `Engine\Plugins\Experimental\Toolsets\NiagaraToolsets\Content\Python\skills\`:
`fundamentals`, `renderers`, `optimization`, `level_placement`, `blueprint_interop`, `custom_hlsl`, `cleanup`
(classes `Niagara<Name>Skill`). Load them with `AgentSkillToolset.GetSkills`, as in `lighting.md`. The exact
skill path string is unverified. Their rules, distilled:

- **Search, present, confirm (`level_placement`).** For any "place/spawn smoke, fire, spark, impact, trail..."
  request, search the project and engine for candidate VFX assets. List the matches with their path and a short
  description, then **stop and wait for the user to pick one**. Never place the first match. If nothing fits,
  say so. **Don't author a new system unless the user explicitly asks.**
- **Cleanup (`cleanup`).** Never remove or modify anything without confirmation. Show a per-item table (location,
  what, why), then wait. Watch for stranded readers: modules that run but do nothing, dynamic inputs that read
  attributes no module writes any more, and User params with nothing driving them.
- **Templates.** Search for templates, emitters, materials and modules across `/Niagara/` **and** `/NiagaraToolsets/`,
  and don't stop at the first hit. Gotcha: in 5.8 the NiagaraToolsets plugin ships **no content** (Python only), so
  templates actually come from `/Niagara/DefaultAssets/Templates/`.
- **Read module descriptions and tooltips before using a module.** Module names drift from what modules do. Only
  include hidden or unexposed scripts when asked.
- **Stack order.** System, then Emitter, then Particle, each with Spawn (once) and Update (every tick). In Particle
  Update the order is forces, then collision, then the velocity solve (exactly once).
- **Loop behavior** is Once, Infinite or Multiple. Check that it matches intent. Life Cycle Mode "Self" doesn't
  change looping.
- **Set initial values on Initialize Particle first.** For ranges ("10 to 20"), use the module's min/max mode,
  never a single value.
- **Hue shift does nothing on white.** Set the base color to red (1,0,0) for hue shift to work.
- **Coordinate space: default to World.** Attaching sets the spawn origin. The space setting controls what happens
  after spawn. Use Local only when particles must rigidly follow the actor. Keep `Position` data as `Position` (LWC).
- **Scale is 1 uu = 1 cm.** Check size, velocity and lifetime against the real-world object.
- **Verify state.** After edits, open the Niagara editor so stack errors surface (`GetStackIssues`,
  `GetSystemCompileState`). Trace every velocity-affecting and appearance-affecting input chain against the
  *stated* intent.
- **HLSL expressions are a last resort.** An expression must be a single rvalue, with no declarations and no
  `return`. Basic math only: `smoothstep` etc. aren't on the CPU VM and silently diverge.
- **Effect Types are shared assets.** Never create one without confirming first (`optimization`).
- **Out of scope for the toolset:** Lightweight Emitters and Niagara Data Channels. Say so; don't work around it.

### NiagaraToolsets MCP tools (from `NiagaraToolset_*.h`)

| Toolset | Tools |
|---|---|
| `NiagaraToolset_Assets` | `GetAssetDiscoveryInfo`, `FindNiagaraScripts`, `GetNiagaraScriptDigest` |
| `NiagaraToolset_System` | `CreateNiagaraSystem(Name, Path, TemplateSystem)`; schema `Get{System,Emitter,Renderer,DataInterface,StackInput,Module,DynamicInput}Schema`; read `GetSystemSummary/EmitterSummary/*Topology/GetUserVariables/Get*Data/Get*InputValues/GetDynamicInputChain/GetSystemDependencies`; edit `Set{System,Emitter,Renderer}Data`, `Add/RemoveUserVariables`, `Add/RemoveEmitter`, `Add/RemoveRenderer`, `Add/RemoveModule`, `SetModuleEnabled`, `AddSetParametersModule`, `Add/RemoveSetParameterEntry`, `SetStackInputData`; check `GetSystemCompileState`, `GetStackIssues`, `ApplyStackIssueFix` |
| `NiagaraToolset_Component` | `SetSystem`, `GetUserVariables`, `GetVariable`, `SetVariable` (on a placed component) |
| `NiagaraToolset_Blueprint` | `ConstructNiagaraBPWrapperFromSystem/FromComponent` (we don't need these: C++ owns spawning) |
| `NiagaraToolset_Info` | `UEnum_Info` |

Workflow: `CreateNiagaraSystem` from a **template system**, giving it an `FXS_` name. Then change params with
`SetStackInputData`/`SetRendererData`, expose `User.` params for C++, and finish with `GetStackIssues`.

### Niagara over MCP: traps (found building fire, sparks and trails in a prototype)

- **Unknown fields are silently ignored, and a bad write can crash later.** `AddUserVariables` entries are
  `{name, type, defaultValue}`; passing `{variable: {name, type}, defaultValue}` returned `null` with no error but
  added a `User.None` of Unknown type ("Invalid parameter found ... User.None" on every compile), and the next
  `GetUserVariables` hit `Assertion failed: InCount > 0` (`NiagaraVariant.cpp`) and took the editor down. Check every
  write against the `describe_toolset` schema; after `AddUserVariables` run `GetStackIssues` and grep the log for
  "Invalid parameter"; never call `GetUserVariables` on a system that logged it. **Save a new system before editing
  it**, so a crash costs only the edits.
- **Curve data interfaces written with `SetStackInputData` leave a stale LUT** ("Post CopyToInternal LUT generation is
  out of sync"). A written curve on `ScaleSpriteSize` scaled every sprite to 0 with no error. Workaround: disable the
  module and take the size from the spawn range. (Untested: setting the curve in the UI, or recompiling after.)
- **`AddModule` appends at the end of the stack.** A force added after `SolveForcesAndVelocity` raises a dependency
  issue; `ApplyStackIssueFix` moves it, but can report "compile in flight" while having applied anyway: re-check with
  `GetStackIssues`.
- **`SetRendererData`** reads back PascalCase keys (`Material`), but the write that worked used camelCase (`material`).
- **Large outputs:** `describe_toolset NiagaraToolsets.NiagaraToolset_System` and `AddEmitter` exceed the tool-result
  limit; parse the saved file instead.
- **Sprite Rotation Mode: Unset with the renderer still binding `Particles.SpriteRotation`** (which nothing writes)
  turned 9-14 cm sprites into ~20 x 150 cm stretched quads at fixed angles, visible only in the packaged build. For
  upright sprites use **Direct Angle (Degrees)** with angle 0. When a sprite effect looks wrong, swap in
  `/Niagara/DefaultAssets/DefaultSpriteMaterial` to see the real quads. Enum inputs read back over MCP as
  `NewEnumeratorN`; Sprite Rotation Mode is 0 Direct Angle (Degrees), 1 Direct Normalized Angle, 2 Random, 3 Unset.
- **A system that is compiling draws nothing**, with no log error: edits looked like they broke the effect until
  `GetSystemCompileState` said `UpToDate`. That call blocks up to 120 s, then throws "Timed out after 120 seconds
  waiting for Niagara System compile to complete": a wait loop must catch it and poll again. Compiles need "Use Less
  CPU when in Background" off (SETUP step 8).

## Templates on disk (`/Niagara/DefaultAssets/Templates/`)

- **Systems:** `SimpleExplosion`, `RadialBurst`, `DirectionalBurst`, `AttributeReaderTrails`, plus lightweight
  `MinimalLightweight`, `FountainLightweight`, `DirectionalBurstLightweight`. What's inside (check before using):
  - `DirectionalBurst` = a burst emitter **plus a `LocationBasedRibbon` emitter fed by a location event**. For plain
    sparks, `RemoveEmitter` the ribbon and remove `GenerateLocationEvent` from the burst emitter.
  - `RadialBurst` = two ribbon emitters plus `OmnidirectionalBurst`. For a death puff keep only the burst.
- **The `LocationBasedRibbon` emitter template has no spawn module** (it relies on that event): added on its own it
  spawns nothing. Add `SpawnRate` (or Spawn Per Unit) to its emitter update. Its leftover event handler (source None)
  stays in the stack; `RemoveModule` can't address it (`ParticleEventScript` not found), and it is harmless.
- **Emitters:** `SimpleSpriteBurst`, `OmnidirectionalBurst`, `DirectionalBurst`, `ConfettiBurst`, `UpwardMeshBurst`,
  `Fountain`, `BlowingParticles`, `HangingParticulates`, `RecycleParticlesInView`, `SingleLoopingParticle`,
  `LocationBasedRibbon`, `StaticBeam`, `DynamicBeam`, `Minimal`.
- **BehaviorExamples** (reference for learning or copying, not shipping): `SubUVAnimation`, `RibbonID`, `RibbonShapes`,
  `SpawnGroups`, `MeshOrientation`, `SpriteFacingAndAlignment`, `RendererVisibility`, `PlayAudio`, `KillParticles`, ...
- **Materials (`/Niagara/DefaultAssets/`):** `DefaultSpriteMaterial`, `DefaultRIbbonMaterial` (sic), `DefaultDecalMaterial`,
  `M_DepthFade_SpriteSimple` (soft sprite, good for dust and smoke).
- No Starter Content and no Cascade `P_Fire`-style assets on the target PC. Fire and smoke flipbooks must be made or
  generated. Sourced packs follow CLAUDE.md "Jam compliance" (the licence
  must allow AI use); they are not scored, so filler only, never hero effects.

## Jam effect recipes

Costs: **S** = a few dozen CPU particles. **M** = hundreds, or large translucent sprites. **L** = GPU thousands, or
big overdraw.

**Judge every effect in a `-game` clip at gameplay distance**, not the Niagara preview: preview-sized sparks vanish
at third-person distance.

| Effect | Start from | Key params / setup | Sim | Pool | Cost |
|---|---|---|---|---|---|
| Pickup idle sparkle | `HangingParticulates` emitter, small sphere | ~10-20 tiny additive sprites, random size and life, color from `User.Color` | CPU | Component on pickup actor | S |
| Pickup collect burst | `OmnidirectionalBurst` / `RadialBurst` | Burst 20-40, short life 0.3-0.6 s, drag, additive emissive | CPU | AutoRelease | S |
| Impact / hit | `DirectionalBurst` system (remove its ribbon emitter, see Templates) | Orient to hit normal (`User.Normal`, Vector3), sparks velocity-aligned, gravity | CPU | AutoRelease | S |
| Dust puff | `SimpleSpriteBurst` (Epic's quick start does exactly this) | 4-8 big soft sprites, `M_DepthFade_SpriteSimple`, alpha fade out, slow expand | CPU | AutoRelease | M (overdraw) |
| Footstep dust | Copy of dust puff, smaller | 2-4 sprites, life <0.5 s. Trigger from C++ (anim notify -> C++ handler) | CPU | AutoRelease | S |
| Explosion | `SimpleExplosion` system | Scale via `User.` float, add one-particle Light renderer flash | CPU | AutoRelease | M |
| Fire / torch | Template sprite emitter + `M_DepthFade_SpriteSimple` with a soft sphere mask (no fire content ships), or a flipbook (`SubUVAnimation` example) | See "Fire" below. Put the **light on the actor** (PointLight + C++ flicker), not a particle light | CPU | Component on torch | S-M |
| Smoke column | `BlowingParticles` / `Fountain` | Few big translucent sprites, depth fade, rotate, fade in/out. Keep the count low | CPU | Component | M-L (overdraw) |
| Magic trail / ribbon | `LocationBasedRibbon` | NiagaraComponent on projectile, World space, ribbon width/color over life | CPU | ManualRelease or actor component | S |
| Beam / laser | `StaticBeam` / `DynamicBeam` | Beam end via `User.` Position param | CPU | Component | S |
| Fireflies / motes | `HangingParticulates` in a big box | 50-300 particles, emissive additive, curl noise. Maybe 2-3 with a Light renderer (separate emitter) | GPU if >~100 | Placed in level | S-M |
| Rain / snow | `RecycleParticlesInView` (or `Fountain` from above) attached to the player | GPU, fixed bounds around camera. Rain = velocity-aligned stretched sprites. Snow = slow drift + noise | GPU | Component on pawn | M |
| Confetti / win | `ConfettiBurst` | Mesh or sprite tumble, gravity, drag | CPU | AutoRelease | S |
| Debris chunks | `UpwardMeshBurst` | Low-poly particle mesh, collision only if needed | CPU | AutoRelease | S-M |

Lightweight variants (`*Lightweight` templates) are the cheapest for simple bursts and fountains. But they're
fixed-function (limited modules, no scratchpads or dynamic inputs) and the MCP toolset can't edit them. Use one only
when the user wants it and the effect is hand-tuned in the editor.

**Fire and smoke:** no fire or smoke content ships. Two routes, in order:
1. **Bake a flipbook** with the Niagara Flipbook Baker (Niagara editor toolbar > Baker) from a Niagara Fluids
   template (`/NiagaraFluids/Templates/Gas/2D/Systems/`: `Grid2D_Gas_SmokeFire`, `Grid2D_Gas_Explosion`,
   `Grid2D_Gas_Smoke`, `Grid2D_Gas_MovingFire`). Defaults: 8x8 frames, 1024 px, SceneColorHDR; power-of-2 sizes, and
   frames per second x duration = frame count or frames repeat. **Baking is UI only** (no script API in 5.8: the
   agent sets it up, the director clicks Bake). Fluids is Beta and off by default: add `NiagaraFluids` to the
   `.uproject` and restart. **Tested on the target PC, 5.8.4 (2026-10-28): `Grid2D_Gas_SmokeFire` simulates and
   bakes** (despite a 2026-07 forum report). Use the sheet through `M_VFX_Master` with `UseFlipbook` (below).
   The sheet is game content (rule 7(h)): bake it during the jam. Procedure, from the test:
   - Duplicate the template into the project first (`EditorAssetLibrary.duplicate_asset`); bake from the copy.
   - Open it, toolbar **Baker > Open Baker Tab**. Settings sit under the Live Sim / Baked Sim previews:
     **Frame Size**, **Atlas Texture Size**, **Source Binding** (None = SceneColorHDR), then a row above the frame
     strip: **Time Range** (start/end s), **Frames Per Dimension**. The Bake button is the chef's-hat icon at the
     left of the Baker toolbar; the result saves as `<System>_BakedAtlas_<OutputName>` next to the system.
   - **Camera:** a 2D gas sim is a flat plane, edge-on in the default perspective view (a thin sliver). Pick an
     orthographic view in the Baker toolbar's camera dropdown that shows it face-on, then F and zoom.
   - **Fill the frame:** the settled fire should fill ~80% of each cell. The first test bake used ~30% of the cell
     (wasted resolution). Check by dragging across the frame strip.
   - **Start after it settles:** scrub the main timeline and start the Time Range once the fire stops growing.
     Flames settle within ~1 s; the smoke plume keeps building for several seconds, so a SmokeFire sheet loops with a
     pop in the smoke. For a looping sheet bake fire and smoke separately (the fire-only templates), or play each
     particle through the sheet once (random start frame, life = sheet length) so no loop is ever seen.
   - **Save All** after baking: Ctrl+S in the system editor saves only the system, not the new texture.
   - The Baker's **Texture Address** setting didn't reach the texture asset (still Wrap). Run
     `node gen/vfx/vfx.ts flipbook <texture path>` after every bake: Clamp, colour compression, Effects group, save.
     The asset is RGBA16F HDR; it exports only as `.exr`.
   - **Playing it (tested end to end, 2026-10-28):** instance with `UseFlipbook` + `FlipbookColor` on and the sheet
     in `FlipbookColorTexture`; sprite renderer Sub Image Size 8x8, Sub Image Blend on; a **SubUV Animation** module
     set to **Define SubUV Setup Manually = Manual** with Manual SubImage Size 8x8. In the default Automatic mode
     with no Sprite Renderer linked it stays on frame 0 with no error. Its default Linear mode plays the sheet once
     over each particle's life.
2. **Fallback, no flipbook:** eroding noise panned up `SM_VFX_Cone` / `SM_VFX_Tornado` mesh particles (kit meshes
   below), plus a few soft sprites. Reads well in stylized games.
Not image models: frames drift in size and position between cells (2026 reports), fine for single masks only.

Captures in an unfocused editor show no particles: warm them up first (`debugging.md` "Particles in editor captures").

## Kit VFX building blocks (`gen/vfx/vfx.ts`)

Everything here is generated by code during the jam, so it is the game's own content (no Fab pack, no image model).
`node gen/vfx/vfx.ts all` makes the set in `/Game/Kit/VFX/`; `instance` makes one look. Status: textures and meshes
generate and were checked (seamless tiling, shapes); the whole set builds in a clean 5.8.4 project, the instances
render correctly on static cards, and a sprite burst with `MI_VFX_HitSpark` was tested in Niagara with Dynamic
Parameter x (erosion) and y (emissive) confirmed, and a baked colour flipbook played through `FlipbookColor`
(2026-10-28). Not yet tested: z (distortion), the grayscale `FlipbookTexture` path.

**Wiring an emitter to `M_VFX_Master` (tested):**
- **Dynamic Material Parameters writes 0 to all four channels by default** (all four "Write" toggles on): adding
  the module sets y (emissive multiplier) to 0 and the particles vanish with no error. Set Index 0 to
  **(0, 1, 1, 0)** right after adding it, then drive x (erosion) over life. Without the module the material
  falls back to (0, 1, 1, 0) by itself.
- **Sprite size vs thin masks.** The templates' sprites are 3-7 cm; at that size the thin `T_VFX_Spark` streak is
  under a pixel and nothing shows. Give spark sprites a long, narrow **non-uniform** size (e.g. 4 x 30 cm) or at
  least ~20 cm uniform.
- **Velocity Aligned** points the texture's **V** axis (top) along the velocity, so streak textures are drawn
  vertically, head at the top (`T_VFX_Spark` is).
- **`/Niagara/DefaultAssets/DefaultSystem` is not empty:** it contains a `Fountain` emitter. Remove it
  (`RemoveEmitter`) after `AddEmitter`, or it renders default sprites alongside yours.
- **When nothing renders, check in this order** (proven on a prototype where glows, wisps and puffs drew nothing in
  daylight): 1) `fx.Niagara.DumpComponents`: are there live particles? 2) `fx.DumpParticleData 1` for one frame: is
  the colour right? 3) switch the instance to translucent for a capture: **black sprites mean the emissive is too low
  for the exposure**, and a near-black additive sprite adds nothing. With
  `r.DefaultFeature.AutoExposure.ExtendDefaultLuminanceRange=True` and a sunlit scene, EmissiveStrength 8-200 read as
  near black; 1200-3000 read (match a known unlit glow in the level: there, a flame needed 3000). An additive
  marker in daylight needed hundreds (faint at 150 from 30 m, clear at 300-600): sweep it in a `-game` shot at the
  play distance before choosing. The master's default (5) and the `vfx.ts` examples suit night or indoor scenes.
  Translucent keeps a coloured glow's hue over a bright sky; additive washes it toward white.
- Then swap the renderer to `/Niagara/DefaultAssets/DefaultSpriteMaterial`: particles
  showing = a material/size problem, not the simulation or the capture. Set Sub Image Size back to 1x1 for that
  check: with 8x8 the default material shows only its empty top-left 1/64 and proves nothing.
- **`SingleLoopingParticle` has no sprite size set:** its particle is zero-sized until you set Initialize
  Particle's Sprite Size Mode (e.g. Random Uniform, min = max). Its life = the 1 s loop; Loop Duration is hidden
  behind Loop Duration Mode, and `SetStackInputData` refuses hidden inputs ("VisibleCondition evaluates false").
- **Save the system after MCP edits**, not only before: the toolset edits the loaded asset, and an editor restart
  silently threw away a system's added module and renderer changes.

- **Textures** (`textures`, 512 px grayscale, linear, `TC_Masks`, Effects LOD group): shapes are Clamp
  (`T_VFX_SoftCircle`, `Glow`, `Ring`, `Shockwave`, `Spark`, `Star4`, `Arc`, `SmokePuff`, `Gradient`); tileable ones are
  Wrap (`T_VFX_Trail`, `Noise`, `NoiseFine` (gradient fBm), `VoronoiCells`, `VoronoiEdges`). Descriptions:
  `gen/vfx/textures.ts`.
- **`M_VFX_Master`** (`master`): unlit, two-sided, translucent; one material for sprites, ribbons and mesh particles.
  Mask texture warped by panning noise, a noise dissolve, particle colour, depth fade, and switches:
  `IsAdditive` (glows, sparks, magic), `ErosionFromAlpha` (particle colour alpha drives the dissolve: use it with
  Lightweight emitters, which can't write a Dynamic Parameter), `SteppedAlpha` (hard toon edge), `UseFlipbook`
  (SubUV sheet: grayscale mask in `FlipbookTexture`), `FlipbookColor` (with `UseFlipbook`: a colour Baker sheet in
  `FlipbookColorTexture`, alpha = shape, RGB = colour). `EdgeFade` (0..1, scalar) fades a mesh particle's
  silhouette where it turns edge-on: set ~1 on every mesh effect, otherwise swirls and shields show hard cut-out
  sides. Dynamic Parameter index 0: x erosion, y emissive multiplier, z distortion multiplier. Full parameter
  list: `gen/unreal/py/build_vfx_material.py`.
- **One instance per effect look** (`instance <Name> '<json>'` -> `MI_VFX_<Name>`): e.g. spark =
  `{"additive":true,"textures":{"MaskTexture":"/Game/Kit/VFX/Textures/T_VFX_Spark"},"scalars":{"EmissiveStrength":15}}`;
  slash = mask `T_VFX_Arc`, `DistortionStrength` 0.05, dissolve over life; smoke = mask `T_VFX_SmokePuff`,
  translucent, `NoisePanV` 0.05, `EmissiveStrength` ~1 with a dark tint.
- **Meshes** (`meshes`, Blender, non-Nanite): `SM_VFX_Cone`, `Tornado`, `Cylinder`, `Dome`, `Ring`, `Arc`, `Plane`, 1 m
  across, pivot at the base, U around/along (seam duplicated so U panning loops), V up/outward. Use them in a Mesh
  renderer with an `M_VFX_Master` instance: pan the noise along U or V and erode over life. Slashes (`Arc`), tornadoes
  and flames (`Tornado`, `Cone`), shockwaves and shields (`Ring`, `Dome`) look far better as meshes than as sprites.
  Mask on a mesh must tile along U (`T_VFX_Trail`, the noise or Voronoi textures): a Clamp shape mask such as
  `SmokePuff` wraps around once and shows as a wedge with a hard seam (tested). Add `EdgeFade` 1.

### What makes effects read as professional (apply to every effect)

- **One dominant shape** per effect (ring, slash, burst); everything else is secondary and smaller.
- **Timing: fast punch, brief hold, slow fade.** Most of the energy in the first 0.05-0.15 s, short particle
  lives, then a slower dissipation (erosion or alpha over life). Long-lived clutter reads as amateur.
- **Value hierarchy:** the brightest value at the focal point. Colour over life: white-hot core -> saturated main
  colour -> dark or desaturated edge/residue. One primary and one secondary colour per effect.
- **Layering:** a typical hit = flash (Star4/Glow, 1-2 frames) + main shape (Shockwave ring or Arc) + sparks
  (velocity-aligned `T_VFX_Spark`) + residue (a few dust/smoke puffs). Each layer is cheap; together they sell it.
- **Gameplay first:** effects must say what happened (helpful vs harmful, who hit whom) and never hide the target.
- Judge in a `-game` clip at gameplay distance and at full speed (above), not in the Niagara preview.

### 5.8 traps (forum reports, 2026)

- **GPU ribbons:** links shuffle in 5.8. Keep weapon trails on CPU ribbons.
- **A system made only of Lightweight (stateless) emitters failed to save in 5.8.2:** include one regular emitter, or
  re-check in 5.8.4.
- Many identical impacts: Niagara Data Channels (one system per area handles every impact written to the channel)
  are Epic's 5.7+ pattern. The NiagaraToolsets can't author Data Channels or Lightweight emitters; that is editor
  UI or Python.

## CPU vs GPU sim

- System and Emitter scripts **always run on CPU**. Only Particle scripts move to GPU. GPU doesn't remove the
  per-emitter cost.
- GPU dispatches in fixed waves. "A simulation of 1 particle can potentially take up the same resources as one with
  64 particles" (Epic). **CPU for small bursts (<~100). GPU for sustained hundreds or more** (weather, motes).
- **Light, Decal and Component renderers are CPU-only** and force the emitter to CPU. Events are CPU-only too.
- GPU depth-buffer collision self-collides with the particles' own pixels. Enable **Partial Depth**.
- The game is likely GPU-bound at 4K output (`performance.md`). Don't move cheap sims to GPU "for speed".

## Spawning and driving from C++ (kit rule: C++ owns VFX)

```cpp
#include "NiagaraFunctionLibrary.h"
#include "NiagaraComponent.h"   // Build.cs: "Niagara"

UPROPERTY(EditDefaultsOnly, Category="FX") TObjectPtr<UNiagaraSystem> ImpactFX; // FXS_Impact, set in BP subclass/data

// One-shot, fire-and-forget, pooled:
UNiagaraComponent* NC = UNiagaraFunctionLibrary::SpawnSystemAtLocation(
    this, ImpactFX, Hit.ImpactPoint, Hit.ImpactNormal.Rotation(), FVector(1.f),
    /*bAutoDestroy*/ true, /*bAutoActivate*/ false, ENCPoolMethod::AutoRelease, /*bPreCullCheck*/ true);
if (NC) { NC->SetVariableLinearColor(TEXT("Color"), Tint); NC->SetVariableVec3(TEXT("Normal"), Hit.ImpactNormal); NC->Activate(true); }

// Following a target you don't own:
UNiagaraFunctionLibrary::SpawnSystemAttached(TrailFX, Mesh, NAME_None, FVector::ZeroVector, FRotator::ZeroRotator,
    EAttachLocation::SnapToTarget, /*bAutoDestroy*/ true, /*bAutoActivate*/ true, ENCPoolMethod::AutoRelease);
```

- **Returns null** when pre-culled (Effect Type distance or visibility), so always null-check.
- **Spawn mechanism by lifetime** (blueprint_interop skill, in C++ terms). Part of the actor's identity (trail, idle
  glow, torch) means a `UNiagaraComponent` subobject with `bAutoActivate=false`, then `Activate()`/`Deactivate()`.
  World one-shots use `SpawnSystemAtLocation`. Use `SpawnSystemAttached` only when it must follow something you don't
  own, because it pays per-frame transform parenting. Don't stack mechanisms.
- **User params.** Pass the bare name, **no `User.` prefix**. The type must match exactly: a wrong type is a
  **silent no-op**. World points are `SetVariablePosition` (LWC). Directions, normals and velocities are
  `SetVariableVec3`. There's no enum setter: set the int. Setters: `SetVariable{Float,Int,Bool,Vec2,Vec3,Vec4,
  Position,LinearColor,Quat,Actor,Object,Material,StaticMesh,Texture}`.
- User params are evaluated every frame. Keep them few, and don't bind expensive data interfaces to them.
- `Deactivate()` stops spawning and lets particles finish. `DeactivateImmediate()` kills them. `OnSystemFinished` fires at the end.

## Pooling (ENCPoolMethod, from `NiagaraComponentPoolMethodEnum.h`)

| Method | Use | Rule |
|---|---|---|
| `None` (default) | Rare one-offs | New component each time. **The default leaks one allocation per spawn for repeating effects** (skill) |
| `AutoRelease` | Impacts, pickups, footsteps, puffs | Fire and forget. **Touching the component after the spawn tick is unsafe**, so set params immediately |
| `ManualRelease` | Auras, channels, anything you modify over time | You own it. **Must call `ReleaseToPool()`** or it leaks. Don't touch it after release |

- Pooling pays off for frequent, moderate-volume effects. For a once-per-level effect the bookkeeping costs more.
- Pool size and priming are in System properties > Performance. Priming cuts runtime allocations but **hitches if the
  asset loads dynamically** (Epic). Kill switch for debugging: `FX.NiagaraComponentPool.Enable 0`.

## Cost rules (fit `performance.md` budgets)

- **Emitter count is the main lever.** Each emitter has fixed CPU overhead. Use one emitter with several renderers
  (Sprite + Light) and spawn groups instead of N near-identical emitters. Use attribute readers, not Event Handlers.
- **Fixed bounds** on every system (cheapest, and they work on GPU). Don't oversize them: oversized bounds keep the
  effect "visible" off-screen. Dynamic bounds are CPU-only. Use Programmable bounds for GPU emitters that need
  scaled or moving bounds.
- **No warmup** (`WarmupTime` 0): Epic says it "can very easily lead to hitches". **Spread big bursts across frames.**
- Turn **Require Current Frame Data** off on static or non-moving systems (it defaults to on). Keep it on for
  projectiles and muzzle FX. Turn off owner-velocity inheritance when the system isn't attached to a moving object.
  Keep Trim Attributes on.
- **Sort mode None** unless blending looks wrong. Sorting costs GPU time and index-buffer memory.
- **Translucency and overdraw are the real GPU cost** at 4K output. Prefer fewer, smaller sprites. Check with view mode
  *Optimization Viewmodes > Shader Complexity / Quad Overdraw*. A few huge smoke sprites filling the screen can cost
  more than a thousand sparks.
- **Particle-only meshes:** no collision, no shadow casting, Distance Field Resolution Scale 0, no extra UVs.
  **Exception to `performance.md` "Nanite on for every static prop"** (listed there): that rule is for level props.
  Particle meshes are tiny, low-poly, non-Nanite meshes (the Nanite renderer is the Experimental `NiagaraNanite`).
- Measure with `stat Niagara`, `stat gpu`, and the Niagara Debugger (Tools > Debug) (unverified menu path).

## Effect Types and scalability

- Epic's first step: create core **Effect Types** and assign one to **every** system. Effect Types give distance
  cull, max instances (total and per system), view-frustum / not-rendered cull, cull proxies, and global-budget scaling.
- Make two at project start (**with user confirmation**, per the skill): `FXT_Gameplay` (tighter cull, higher
  priority, burst: instant cull OK) and `FXT_Ambient` (looping: add a delay so effects don't pop). `FXT_` is the
  kit prefix (`naming.md`).
- Per-emitter and per-renderer scalability gates switch pieces off at low Effects quality, and gated-off pieces cost
  nothing. Use them to drop the light renderer and extra emitters at Low and Medium.

## Materials, lights and Lumen

- **Prefer Masked over Translucent** (skill). Use Translucent only for real soft blending (smoke, dust). For sparks,
  magic and motes, use **Additive + Unlit emissive** (no lighting cost, reads as glowing with bloom). The kit's
  `M_VFX_Master` covers both (translucent, or `IsAdditive` instances); for a crisp masked look use `SteppedAlpha`.
- **Material usage flags** matter. *Used with Niagara Sprites / Ribbons / Mesh Particles*: set only those needed.
  A missing flag in a packaged build gives the default material (`materials.md`, usage flags). The same goes for
  an overlay or hit-flash material built by script and put on a character: set `bUsedWithSkeletalMesh`. `-game` and
  packaged runs can't add flags (PIE adds them silently), so grep a `-game` log for "missing usage flag".
- Use **one master particle material + MIs** (kit rule). Per-particle data reaches the material through
  `Particle Color` and `Dynamic Parameter` nodes. **Silent failure:** if the material lacks the Dynamic Parameter
  node or index the module writes, writes are dropped with no error.
- **SubUV flipbooks need three things to match:** the renderer's Sub Image size matches the texture grid, a SubUV
  Animation module runs in Particle Update, and its renderer input points at that renderer.
- Translucent materials ignore Metallic, Specular, Roughness and Normal unless Translucency Lighting Mode is a
  Directional mode. Turn on Two Sided for anything seen from both sides.
- **Light renderer** = hero accents only: one particle, low count, short life, never on high-count emitters. No
  material. It forces CPU. `bAffectsTranslucency` and `bAllowMegaLights` say "use with caution": **leave
  MegaLights off** (kit: MegaLights not used, `lighting.md`). Particle lights don't cast shadows.
  `bAlphaScalesBrightness` lets you fade lights with alpha.
- **Lumen:** emissive sprites don't light the world through Lumen GI, because particles aren't in the Lumen scene
  (unverified for 5.8). For a glow that lights surroundings, use a Light renderer particle or a real light on the
  actor. Torches and campfires should use an actor PointLight with shadows off, counted against `performance.md`'s
  "few dynamic shadow-casting lights" budget.
- **Additive particles don't appear in Lumen reflections or screen traces**; what reflects is the light's specular, so
  shape it with the light's source radius / length.

## Verified against

- On the target PC, 2026-10-24: UE 5.8 `NiagaraToolsets.uplugin` (Experimental, EnabledByDefault false, listed in
  `AllToolsets.uplugin`). I read all 7 skill `.py` files in full and the tool lists in `NiagaraToolset_{System,Component,
  Blueprint,Assets,Info}.h`.
- From headers: `NiagaraFunctionLibrary.h` (SpawnSystemAtLocation/Attached signatures, defaults `bAutoDestroy=true`,
  `bAutoActivate=true`, `ENCPoolMethod::None`, `bPreCullCheck=true`), `NiagaraComponent.h` (SetVariable* setters,
  ReleaseToPool, OnSystemFinished), `NiagaraComponentPoolMethodEnum.h`, `NiagaraLightRendererProperties.h`,
  `NiagaraEffectType.h`, `Classes\NiagaraSystem.h` (bRequireCurrentFrameData=true, bFixedBounds, WarmupTime=0).
- Template and material asset names come from listing `Engine\Plugins\FX\Niagara\Content\DefaultAssets`. Plugin
  statuses come from the `NiagaraFluids`, `NiagaraNanite` and `NiagaraPreviewContent` `.uplugin` files.
- The C++ snippet compiles in principle but has not been built yet. The "Niagara over MCP" traps and the template
  contents were found in a running 5.8.4 editor and `-game` builds of a prototype (2026-10).

## Sources (5.8)

- Scalability and best practices: https://dev.epicgames.com/documentation/en-us/unreal-engine/scalability-and-best-practices-for-niagara?application_version=5.8
- Heterogeneous volumes: https://dev.epicgames.com/documentation/en-us/unreal-engine/heterogeneous-volumes-in-unreal-engine?application_version=5.8
- Lightweight emitters overview: https://dev.epicgames.com/documentation/en-us/unreal-engine/niagara-lightweight-emitters-overview?application_version=5.8
- Quick start (Simple Sprite Burst -> dust cloud): https://dev.epicgames.com/documentation/en-us/unreal-engine/quick-start-for-niagara-effects-in-unreal-engine?application_version=5.8
- Skills: `C:\Program Files\Epic Games\UE_5.8\Engine\Plugins\Experimental\Toolsets\NiagaraToolsets\Content\Python\skills\*.py`
- Tools: `...\NiagaraToolsets\Source\NiagaraToolsets\Private\NiagaraToolset_*.h`
- Runtime API: `C:\Program Files\Epic Games\UE_5.8\Engine\Plugins\FX\Niagara\Source\Niagara\Public\{NiagaraFunctionLibrary,NiagaraComponent,NiagaraComponentPoolMethodEnum,NiagaraLightRendererProperties}.h`
