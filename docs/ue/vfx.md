# VFX with Niagara (UE 5.8.4, RTX 4060 8 GB)

Effects are a cheap way to make the game look alive, and judges notice them. They also cause hitches and
GPU overdraw. These rules come from Epic's 5.8 Niagara agent skills (on disk), the 5.8 headers, and the 5.8 docs
(links at the bottom). The rule: **start from an engine template, spawn and drive from C++, pool anything repeated.**

## Setup facts (5.8 on GIZMO)

| Thing | Status | Notes |
|---|---|---|
| `Niagara` plugin | On by default | C++ module `Niagara` in Build.cs (see `cpp.md`) |
| `NiagaraToolsets` (MCP tools + 7 agent skills) | **Experimental**, editor-only, off by default | Pulled in by `AllToolsets`, which we enable |
| Lightweight (stateless) emitters | Since 5.4. Templates ship in 5.8 | Toolset **can't edit them** (see below) |
| `NiagaraFluids` | Beta | Grid gas/fire sims. Too slow to set up for a jam. Skip it |
| `NiagaraNanite` (Nanite mesh renderer) | Experimental, off | Skip it |
| Heterogeneous Volumes / Sparse Volume Textures | Experimental (unverified for 5.8) | For volumetric smoke/fire. Skip it: expensive and immature |

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

## Templates on disk (`/Niagara/DefaultAssets/Templates/`)

- **Systems:** `SimpleExplosion`, `RadialBurst`, `DirectionalBurst`, `AttributeReaderTrails`, plus lightweight
  `MinimalLightweight`, `FountainLightweight`, `DirectionalBurstLightweight`.
- **Emitters:** `SimpleSpriteBurst`, `OmnidirectionalBurst`, `DirectionalBurst`, `ConfettiBurst`, `UpwardMeshBurst`,
  `Fountain`, `BlowingParticles`, `HangingParticulates`, `RecycleParticlesInView`, `SingleLoopingParticle`,
  `LocationBasedRibbon`, `StaticBeam`, `DynamicBeam`, `Minimal`.
- **BehaviorExamples** (reference for learning or copying, not shipping): `SubUVAnimation`, `RibbonID`, `RibbonShapes`,
  `SpawnGroups`, `MeshOrientation`, `SpriteFacingAndAlignment`, `RendererVisibility`, `PlayAudio`, `KillParticles`, ...
- **Materials (`/Niagara/DefaultAssets/`):** `DefaultSpriteMaterial`, `DefaultRIbbonMaterial` (sic), `DefaultDecalMaterial`,
  `M_DepthFade_SpriteSimple` (soft sprite, good for dust and smoke).
- No Starter Content and no Cascade `P_Fire`-style assets on GIZMO. Fire and smoke flipbooks must be made or
  generated. Fab packs ARE allowed by the jam rules (Official Rules 15(c)): list them in SOURCED_ASSETS.md and
the submission; they are not scored, so use them for filler, not hero effects.

## Jam effect recipes

Costs: **S** = a few dozen CPU particles. **M** = hundreds, or large translucent sprites. **L** = GPU thousands, or
big overdraw.

| Effect | Start from | Key params / setup | Sim | Pool | Cost |
|---|---|---|---|---|---|
| Pickup idle sparkle | `HangingParticulates` emitter, small sphere | ~10-20 tiny additive sprites, random size and life, color from `User.Color` | CPU | Component on pickup actor | S |
| Pickup collect burst | `OmnidirectionalBurst` / `RadialBurst` | Burst 20-40, short life 0.3-0.6 s, drag, additive emissive | CPU | AutoRelease | S |
| Impact / hit | `DirectionalBurst` system | Orient to hit normal (`User.Normal`, Vector3), sparks velocity-aligned, gravity | CPU | AutoRelease | S |
| Dust puff | `SimpleSpriteBurst` (Epic's quick start does exactly this) | 4-8 big soft sprites, `M_DepthFade_SpriteSimple`, alpha fade out, slow expand | CPU | AutoRelease | M (overdraw) |
| Footstep dust | Copy of dust puff, smaller | 2-4 sprites, life <0.5 s. Trigger from C++ (anim notify -> C++ handler) | CPU | AutoRelease | S |
| Explosion | `SimpleExplosion` system | Scale via `User.` float, add one-particle Light renderer flash | CPU | AutoRelease | M |
| Fire / torch | `Fountain` (low velocity, upward) or `SingleLoopingParticle` + flipbook (`SubUVAnimation` example) | Additive, color over life orange to dark, curl noise. Put the **light on the actor** (PointLight + C++ flicker), not a particle light | CPU | Component on torch | S-M |
| Smoke column | `BlowingParticles` / `Fountain` | Few big translucent sprites, depth fade, rotate, fade in/out. Keep the count low | CPU | Component | M-L (overdraw) |
| Magic trail / ribbon | `LocationBasedRibbon` | NiagaraComponent on projectile, World space, ribbon width/color over life | CPU | ManualRelease or actor component | S |
| Beam / laser | `StaticBeam` / `DynamicBeam` | Beam end via `User.` Position param | CPU | Component | S |
| Fireflies / motes | `HangingParticulates` in a big box | 50-300 particles, emissive additive, curl noise. Maybe 2-3 with a Light renderer (separate emitter) | GPU if >~100 | Placed in level | S-M |
| Rain / snow | `RecycleParticlesInView` (or `Fountain` from above) attached to the player | GPU, fixed bounds around camera. Rain = velocity-aligned stretched sprites. Snow = slow drift + noise | GPU | Component on pawn | M |
| Confetti / win | `ConfettiBurst` | Mesh or sprite tumble, gravity, drag | CPU | AutoRelease | S |
| Debris chunks | `UpwardMeshBurst` | Low-poly particle mesh, collision only if needed | CPU | AutoRelease | S-M |

Lightweight variants (`*Lightweight` templates) are the cheapest for simple bursts and fountains. But they're fixed-function
(limited modules, no scratchpads or dynamic inputs) and the MCP toolset can't edit them. Use one only when the
user wants it and the effect is hand-tuned in the editor.

## CPU vs GPU sim

- System and Emitter scripts **always run on CPU**. Only Particle scripts move to GPU. GPU doesn't remove the
  per-emitter cost.
- GPU dispatches in fixed waves. "A simulation of 1 particle can potentially take up the same resources as one with
  64 particles" (Epic). **CPU for small bursts (<~100). GPU for sustained hundreds or more** (weather, motes).
- **Light, Decal and Component renderers are CPU-only** and force the emitter to CPU. Events are CPU-only too.
- GPU depth-buffer collision self-collides with the particles' own pixels. Enable **Partial Depth**.
- Our game is likely GPU-bound at 1440p with Lumen. Don't move cheap sims to GPU "for speed".

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
- **Translucency and overdraw are the real GPU cost** at 1440p. Prefer fewer, smaller sprites. Check with view mode
  *Optimization Viewmodes > Shader Complexity / Quad Overdraw*. A few huge smoke sprites filling the screen can cost
  more than a thousand sparks.
- **Particle-only meshes:** no collision, no shadow casting, Distance Field Resolution Scale 0, no extra UVs.
  **Contradiction with `performance.md` "Nanite on for every static prop":** that rule is for level props. Particle
  meshes are tiny, low-poly, non-Nanite meshes (the Nanite renderer is the Experimental `NiagaraNanite`).
- Measure with `stat Niagara`, `stat gpu`, and the Niagara Debugger (Tools > Debug) (unverified menu path).

## Effect Types and scalability

- Epic's first step: create core **Effect Types** and assign one to **every** system. Effect Types give distance
  cull, max instances (total and per system), view-frustum / not-rendered cull, cull proxies, and global-budget scaling.
- Make two at project start (**with user confirmation**, per the skill): `FXT_Gameplay` (tighter cull, higher
  priority, burst: instant cull OK) and `FXT_Ambient` (looping: add a delay so effects don't pop). `FXT_` isn't in
  `naming.md` yet.
- Per-emitter and per-renderer scalability gates switch pieces off at low Effects quality, and gated-off pieces cost
  nothing. Use them to drop the light renderer and extra emitters at Low and Medium.

## Materials, lights and Lumen

- **Prefer Masked over Translucent** (skill). Use Translucent only for real soft blending (smoke, dust). For sparks,
  magic and motes, use **Additive + Unlit emissive** (no lighting cost, reads as glowing with bloom).
- **Material usage flags** matter. *Used with Niagara Sprites / Ribbons / Mesh Particles*: set only those needed.
  A missing flag in a packaged build gives the default material (same trap as `performance.md`).
- Use **one master particle material + MIs** (kit rule). Per-particle data reaches the material through
  `Particle Color` and `Dynamic Parameter` nodes. **Silent failure:** if the material lacks the Dynamic Parameter
  node or index the module writes, writes are dropped with no error.
- **SubUV flipbooks need three things to match:** the renderer's Sub Image size matches the texture grid, a SubUV
  Animation module runs in Particle Update, and its renderer input points at that renderer.
- Translucent materials ignore Metallic, Specular, Roughness and Normal unless Translucency Lighting Mode is a
  Directional mode. Turn on Two Sided for anything seen from both sides.
- **Light renderer** = hero accents only: one particle, low count, short life, never on high-count emitters. No
  material. It forces CPU. `bAffectsTranslucency` and `bAllowMegaLights` say "use with caution": **leave
  MegaLights off** (kit: MegaLights not used, `lighting.md`). Particle lights don't cast shadows. `bAlphaScalesBrightness`
  lets you fade lights with alpha.
- **Lumen:** emissive sprites don't light the world through Lumen GI, because particles aren't in the Lumen scene
  (unverified for 5.8). For a glow that lights surroundings, use a Light renderer particle or a real light on the
  actor. Torches and campfires should use an actor PointLight with shadows off, counted against `performance.md`'s
  "few dynamic shadow-casting lights" budget.

## Verified against

- On GIZMO, 2026-10-24: UE 5.8 `NiagaraToolsets.uplugin` (Experimental, EnabledByDefault false, listed in
  `AllToolsets.uplugin`). I read all 7 skill `.py` files in full and the tool lists in `NiagaraToolset_{System,Component,
  Blueprint,Assets,Info}.h`.
- From headers: `NiagaraFunctionLibrary.h` (SpawnSystemAtLocation/Attached signatures, defaults `bAutoDestroy=true`,
  `bAutoActivate=true`, `ENCPoolMethod::None`, `bPreCullCheck=true`), `NiagaraComponent.h` (SetVariable* setters,
  ReleaseToPool, OnSystemFinished), `NiagaraComponentPoolMethodEnum.h`, `NiagaraLightRendererProperties.h`,
  `NiagaraEffectType.h`, `Classes\NiagaraSystem.h` (bRequireCurrentFrameData=true, bFixedBounds, WarmupTime=0).
- Template and material asset names come from listing `Engine\Plugins\FX\Niagara\Content\DefaultAssets`. Plugin
  statuses come from the `NiagaraFluids`, `NiagaraNanite` and `NiagaraPreviewContent` `.uplugin` files.
- Not tested in a running editor. The C++ snippet compiles in principle but has not been built yet.

## Sources (5.8)

- Scalability and best practices: https://dev.epicgames.com/documentation/en-us/unreal-engine/scalability-and-best-practices-for-niagara?application_version=5.8
- Lightweight emitters overview: https://dev.epicgames.com/documentation/en-us/unreal-engine/niagara-lightweight-emitters-overview?application_version=5.8
- Quick start (Simple Sprite Burst -> dust cloud): https://dev.epicgames.com/documentation/en-us/unreal-engine/quick-start-for-niagara-effects-in-unreal-engine?application_version=5.8
- Skills: `C:\Program Files\Epic Games\UE_5.8\Engine\Plugins\Experimental\Toolsets\NiagaraToolsets\Content\Python\skills\*.py`
- Tools: `...\NiagaraToolsets\Source\NiagaraToolsets\Private\NiagaraToolset_*.h`
- Runtime API: `C:\Program Files\Epic Games\UE_5.8\Engine\Plugins\FX\Niagara\Source\Niagara\Public\{NiagaraFunctionLibrary,NiagaraComponent,NiagaraComponentPoolMethodEnum,NiagaraLightRendererProperties}.h`
