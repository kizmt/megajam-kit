# Materials (UE 5.8.4, RTX 4060 8 GB)

Rule zero: **one master material, many instances.** Props get `MI_<Name>` parented to `/Game/Kit/Materials/M_PBR_Master`
(built by `gen/unreal/materials.mjs`). Before making any material, load Epic's agent skill `MaterialBasicsSkill`
(`editor_toolset/skills/material_basics.py`). Its decision order is ours:
1. Search for an existing Material/MI that covers the need. 2. If a parent fits, make an **MI**. 3. Make a new Material
only when nothing is close. Search `/Engine/Functions` for a Material Function before writing graph logic by hand.

## Exceptions to "one master" (domain-locked, cannot be an MI of M_PBR_Master)

Blend mode, domain and shading model are per-Material, not per-instance. So a few extra **masters** are allowed, each
with instances. Keep this list short; every new Material is new shaders to compile.

| Master | Domain / blend | Use |
|---|---|---|
| `M_PBR_Master` | Surface / Opaque | Everything static/skeletal (Nanite) |
| `M_Glass` (optional) | Surface / Translucent | Windows, bottles, visors. Non-Nanite mesh |
| `M_Decal` (optional) | Deferred Decal / Translucent | Grime, scorch, signage |
| `PPM_<Look>` (optional) | Post Process | Cel shading, outlines, damage vignette |
| `MPC_Global` | Material Parameter Collection | Global wetness, tint, time (not a material) |

Naming: Epic's 5.8 list has `PPM_` for post-process materials; `MPC_` is not in Epic's list or our `naming.md` yet
(proposed). Masked foliage/fences: a Masked variant would need its own master too (or one static switch, see below).

## Master + instance best practice

- **MI (constant)** = editor-time values, no recompile, edits show instantly. **MID** = runtime values from code.
- **Static switches cost shaders, not frame time.** Each combination of static parameters used by any MI compiles a new
  shader set (Epic skill: 2 switches = 4, 4 = 16). An MI that overrides a static switch gets its own permutation.
  Prefer **scalar params + Lerp** (a few ALU instructions, zero new shaders) for toggles; use a static switch only to
  strip an expensive branch (e.g. triplanar, extra texture). Max 1-2 on the master.
- **Parameter groups:** set `Group` on every parameter (materials.mjs uses `Textures`). Proposed groups:
  `Textures`, `Color`, `Surface`, `Emissive`, `Global`. Neutral defaults (multiply by 1, lerp by 0) so existing MIs
  don't change when params are added.
- Adding parameters to the master recompiles it and all its MIs once (editor shows grey meanwhile). Batch master
  changes; don't iterate on the master during the last day.
- Neutral normal is (0,0,1) (pure blue), not zero (Epic skill). Default normal texture fill is 128,128,255: correct.
- Metallic is binary (0/1) except rust/dust; very matte = high Roughness, not Specular 0; leave Specular at 0.5
  (Epic PBR page). AI textures often have grey "metallic" noise: clamp or override per MI if props look dirty-chrome.

## Proposed master material v2

Not built yet. Each item: what, nodes (all verified in the 5.8 Python stub / engine content), cost, why.

| # | Add | Nodes | Cost | Why |
|---|---|---|---|---|
| 1 | `Tint` (vector, white) multiplies BaseColor | VectorParameter, Multiply | ~1 ALU | Recolour variants of one prop without new textures |
| 2 | `HueShift` (scalar, 0) | MaterialFunctionCall -> `/Engine/Functions/Engine_MaterialFunctions02/HueShift` | ~10-20 ALU (unverified count) | Palette variety for PCG-scattered copies |
| 3 | `Saturation` (scalar, 1) | Desaturation | few ALU | Pull loud AI textures toward one art direction |
| 4 | `RoughnessMul` (1), `RoughnessAdd` (0), `MetallicOverride` (-1 = use texture) | ScalarParameter, Multiply, Add, Lerp | few ALU | Fix AI roughness/metal maps per MI, no re-gen |
| 5 | `NormalStrength` (1) | Multiply on normal.xy (or `FlattenNormal` fn) | ~2 ALU | Tame over-strong generated normals |
| 6 | Emissive: `EmissiveTex` (default black), `EmissiveColor` (black), `EmissiveStrength` (0) | TextureSampleParameter2D, Multiply | **+1 texture sample** | Screens, runes, lamps, pickups glow + bloom |
| 7 | **ORM packing**: one `ORM` texture (R=AO, G=Roughness, B=Metallic), `TC_Masks`, sRGB off, `SAMPLERTYPE_MASKS` | TextureSampleParameter2D, outputs R/G/B to AO/Roughness/Metallic | **-1 sample, -1 texture asset per prop** vs today (4 -> 3 incl. AO) | Texture memory is our real 8 GB limit (`performance.md`) |
| 8 | `Wetness` from `MPC_Global` | CollectionParameter, Lerp roughness down / basecolor darker | few ALU, 1 uniform | Rain/time-of-day mood on everything at once |
| 9 | Per-object flash/dissolve via **Custom Primitive Data** | ScalarParameter with `use_custom_primitive_data` + `primitive_data_index` | ~ALU only | Hit flash/highlight per actor without a MID |
| 10 | (Optional static switch) `UseTriplanar` | MaterialFunctionCall -> `/Engine/Functions/Engine_MaterialFunctions01/Texturing/WorldAlignedTexture` | 3x samples per texture when on | Level geometry/blockout with bad UVs |

Item 7 needs the pipeline to pack textures (Blender prep or a node step) and rename to `T_<Name>_ORM`. Do 1, 4, 6, 7, 9
first; they're the visual/perf wins. Keep `bUsedWithNanite/SkeletalMesh/InstancedStaticMeshes` and add any new usage
the game needs **before packaging**: `bUsedWithSplineMeshes`, `bUsedWithNiagaraMeshParticles`,
`bUsedWithGeometryCollections` (Chaos destruction), `bUsedWithMorphTargets` (all exist on UMaterial in 5.8). Missing flag
in a packaged build = default material.

## Domains, blend modes, Nanite

- Nanite supports **Opaque and Masked** only. Unsupported material on a Nanite mesh = default material + Output Log
  warning. Translucent = non-Nanite mesh.
- Masked and World Position Offset work with Nanite but cost more (programmable raster; unverified on the 5.8 page). WPO is "supported, but
  limited": clamp displacement. Custom UVs / Vertex Interpolator are evaluated 3x per pixel under Nanite. Custom HLSL
  nodes "might result in artifacts". Prefer Opaque; use Masked only where the cutout is visible (leaves, fences).
- Blend modes in 5.8: Opaque, Masked, Translucent, Additive, Modulate, AlphaComposite, AlphaHoldout,
  TranslucentColoredTransmittance (Substrate).
- Fades/dissolves on Nanite props: Masked + `DitherTemporalAA` fn (`/Engine/Functions/Engine_MaterialFunctions02/Utility/`)
  keeps Nanite and avoids translucency (dither is smoothed by TSR; can shimmer, unverified).

## Glass / translucency

- Separate `M_Glass` master, non-Nanite mesh. Blend Translucent. Lighting Mode **Surface TranslucencyVolume** to get
  scene reflections, or **Surface ForwardShading** for specular from multiple lights (+ needs SSR). Thin Translucent
  shading model (+ Surface ForwardShading) = tinted glass.
- Lumen: with **High Quality Translucency Reflections** (project setting) Lumen gives mirror reflections on the frontmost
  translucent layer; deeper layers fall back to glossy Radiance Cache reflections. Single Layer Water gets mirror reflections.
- Lit translucent surfaces are lit via a volume texture: "missing direct specular", can look low-res. Fine for small glass.
- Cost: **overdraw**: every stacked translucent layer re-shades the pixel. Check Shader Complexity view (green cheap,
  red expensive). Keep glass small on screen, avoid layered glass. Use Translucency Sort Priority to fix sorting.
- Translucent colored shadows need static lighting/Lightmass: **not available to us (Lumen-only)**.

## Substrate (on by default in our 5.8 project)

- Epic's 5.8 hub labels Substrate **Beta** ("use caution when shipping"). But it's **enabled by default for new
  projects**, and our `SmokeTest/Config/DefaultEngine.ini` has `r.Substrate=True`, `r.Substrate.ProjectGBufferFormat=0`
  (Blendable GBuffer: "performance in parity with the non-Substrate path", no cook overhead, meant for 60 Hz).
- Decision: **leave it on, author with legacy inputs.** Non-Substrate materials (our master: BaseColor/Normal/
  Roughness/Metallic pins) "work out-of-the-box" and are converted at compile time. Don't toggle `r.Substrate` mid-jam
  (restart + full recompile; Substrate-node materials render black if disabled).
- Don't use "Convert to Substrate" on the master: permanent, irreversible. Don't use Adaptive GBuffer (higher cost,
  +15% cook, forces DBuffer).
- Under Substrate, translucent blend modes are TranslucentColoredTransmittance / TranslucentGreyTransmittance
  (grey is cheaper). Glass look via Slab: high SSS MFP + IOR 1.514. Extra slabs cost almost linearly: one slab only.
- The output pin `MP_FRONT_MATERIAL` is the Substrate root; MCP `connect_to_output` with `MP_BaseColor` etc. works for
  legacy authoring (as materials.mjs does today).

## Emissive with Lumen

- Emissive surfaces light the scene through Lumen's Final Gather "with no additional performance cost". But small, very
  bright emissive areas cause **noise**, and small objects are culled from the Lumen Scene (only screen traces see
  them, so their light pops when off-screen).
- Rule: emissive for **glow + bloom + soft fill on large surfaces**; a real Movable light (no/limited shadows) where
  gameplay needs reliable light. Emissive values > 1 drive bloom; keep strength a parameter.

## Global effects: Material Functions and MPCs

- **Material Function (`MF_`)**: reusable graph snippet; editing it updates every material using it. Via MCP:
  `create_function`, add `MaterialExpressionFunctionInput/Output` (function-only: `add_expression` refuses them in a
  Material), then in the master add `MaterialExpressionMaterialFunctionCall` and set its `material_function`.
- **MPC (`MPC_Global`)**: up to 1024 scalar + 1024 vector params; a material can reference at most **2** MPCs.
  Updating values is cheap and hits every referencing material. **Changing the number of params recompiles all
  referencing materials**: add all params up front (Wetness, WorldTint, WindStrength, PulseTime...).
- C++: `UKismetMaterialLibrary::SetScalarParameterValue(this, MPC, "Wetness", 0.7f)` /
  `SetVectorParameterValue(...)`. Renamed MPC params break Blueprint references (not materials).

## Gameplay feedback from C++

- Cheapest per actor: **Custom Primitive Data**: `Mesh->SetCustomPrimitiveDataFloat(0, 1.f)` /
  `SetCustomPrimitiveDataVector4(...)`, read by a parameter with Use Custom Primitive Data. No new material instance.
  Instances: `PerInstanceCustomData` node.
- **MID** when you need texture swaps or per-slot control:
  `UMaterialInstanceDynamic* Mid = Mesh->CreateDynamicMaterialInstance(0);` (or
  `UMaterialInstanceDynamic::Create(Parent, Outer)`), then `SetScalarParameterValue`, `SetVectorParameterValue`,
  `SetTextureParameterValue`. Create once (BeginPlay), cache the pointer, update on events, not every tick.
- Avoid `SetScalarParameterValueOnMaterials` in hot paths: it creates MIDs on every slot (unverified).
- Static switches can't be changed at runtime (compile-time only).

## Stylized looks (if the art direction goes non-PBR)

| Approach | Cost | Notes |
|---|---|---|
| **Post-process cel** (`PPM_Toon`: quantize light from SceneTexture) | One full-screen pass | Global, easy, one asset. Hits sky/fog too: mask with depth or Custom Stencil |
| **Outlines, post-process edge detect** (depth/normal) | One full-screen pass, several neighbour samples | Best value outline; works with Nanite |
| **Outlines, Custom Depth/Stencil per object** | Extra depth draw for marked meshes + PP pass | Highlight interactables; set Render Custom Depth + Stencil Value |
| **Substrate Toon BSDF + Toon Profile asset** | Per-material shading | New in 5.8, **Experimental** (release notes); forum reports of artifacts. Practice run first |
| Inverted-hull outlines | 2x triangles, extra material | Avoid: awkward with Nanite |

Post-process materials: domain Post Process, output Emissive only, read `PostProcessInput0` (not SceneColor), add to a
Post Process Volume's Blendables. **After Tonemapping** is the cheapest location; Before Tonemapping works in HDR.
Epic: use PP materials sparingly, prefer built-in volume settings (color grading, bloom, vignette) when they do the job.

## World-aligned / triplanar textures

- `WorldAlignedTexture` / `WorldAlignedNormal` functions (`Engine_MaterialFunctions01/Texturing`) project by world
  position: no UVs, no seams on scaled blockout geometry. ~3x the texture samples (one per axis) and textures swim
  on moving actors. Use for static level geometry (walls, rocks, ground), not props (AI props have UVs).

## Decals

- Domain **Deferred Decal**, blend Translucent or AlphaComposite (DBuffer; Modulate silently falls back). DBuffer
  decals are on by default and required with Substrate. Nanite meshes **receive** projected decals; mesh decals
  (translucent) can't be Nanite.
- Cost = screen coverage x material complexity. Turn off Receives Decals on actors that don't need them; higher Sort
  Order draws on top.

## Performance and shader compiles

- Count matters more than graph size: texture samples (each prop = 4 today, 3 with ORM), translucent overdraw, full-
  screen PP passes. Check Material Editor Stats (instruction/sampler counts) and Shader Complexity view.
- Every new Material / static permutation = shader compiles in editor (grey meshes until done) and more PSOs at runtime.
- **PSO precaching** is on by default in 5.8: if a component's PSOs aren't ready the engine **skips drawing it**
  (pop-in) rather than hitching (`r.PSOPrecache.ProxyCreationWhenPSOReady`). Few masters/permutations = fewer PSOs.
  Test first-run hitches in the packaged build with `-clearPSODriverCache`; `r.PSOPrecache.Validation=1` logs misses.
  A loading screen can wait on `FShaderPipelineCache::NumPrecompilesRemaining()`.

## MCP MaterialTools (what the agent can build)

- `create_material` / `create_function` / `create_parameter_collection`; `add_expression(material, expression_class
  {refPath:'/Script/Engine.MaterialExpressionX'}, x, y)`; `list_expression_classes(material, search)` to discover;
  `connect_expressions(from, out, to, in)`; `connect_to_output(expr, out, MP_*)`; `get_expression_input_names` /
  `get_expression_output_names` (empty string = default output); `get_expression_inputs` / `get_property_input`
  to verify wiring; `rename_parameter_group`; `layout_expressions`; `delete_unused_expressions`; `recompile`.
- Gotchas: call `recompile` **once** after a batch of edits (it raises with the compile errors; read them).
  `delete_unused_expressions` doesn't recompile. No tool for usage flags, blend mode or domain: set them with
  `ObjectTools.set_properties` (`BlendMode`, `MaterialDomain`, `bUsedWith*`), as materials.mjs does. Texture sampler
  type must match compression (Normal/`TC_Normalmap`, Masks/`TC_Masks`, LinearGrayscale/`TC_Grayscale`) or compile fails.
  `create_material` itself warns: prefer an MI.
- Setting `material_function` on a FunctionCall through generic `set_properties` may not refresh its pins; check with
  `get_expression_input_names` and recompile (unverified).

## Verified against

- `editor_toolset/skills/material_basics.py` and `editor_toolset/toolsets/material.py` (UE 5.8 install), read 2026-10-24.
- `Engine/Source/Runtime/Engine/Public/Materials/Material.h` (bUsedWith* flags), `MaterialInstanceDynamic.h`,
  `Classes/Components/PrimitiveComponent.h`, `MeshComponent.h`, `Classes/Kismet/KismetMaterialLibrary.h`.
- `SmokeTest/Intermediate/PythonStub/unreal.py`: all expression classes named above exist except
  WorldAlignedTexture/HueShift/DitherTemporalAA, which are Material Functions (assets found under `Engine/Content/Functions`).
  `MaterialExpressionSubstrateToonBSDF` and `ToonProfile` exist. Blend modes / shading models from the stub enums.
- `SmokeTest/Config/DefaultEngine.ini`: `r.Substrate=True`, `ProjectGBufferFormat=0`.
- Unverified: HueShift instruction count; FunctionCall pin refresh via set_properties; Substrate Toon artifacts (forum only).

## Sources (5.8)

- Materials hub: https://dev.epicgames.com/documentation/en-us/unreal-engine/unreal-engine-materials?application_version=5.8
- Instanced materials: https://dev.epicgames.com/documentation/en-us/unreal-engine/instanced-materials-in-unreal-engine?application_version=5.8
- Material functions: https://dev.epicgames.com/documentation/en-us/unreal-engine/material-functions-in-unreal-engine?application_version=5.8
- MPCs: https://dev.epicgames.com/documentation/en-us/unreal-engine/using-material-parameter-collections-in-unreal-engine?application_version=5.8
- Physically based materials: https://dev.epicgames.com/documentation/en-us/unreal-engine/physically-based-materials-in-unreal-engine?application_version=5.8
- Substrate hub / overview: https://dev.epicgames.com/documentation/en-us/unreal-engine/substrate-materials-in-unreal-engine?application_version=5.8 ,
  https://dev.epicgames.com/documentation/en-us/unreal-engine/overview-of-substrate-materials-in-unreal-engine?application_version=5.8
- Transparency: https://dev.epicgames.com/documentation/en-us/unreal-engine/using-transparency-in-unreal-engine-materials?application_version=5.8
- Lit translucency: https://dev.epicgames.com/documentation/en-us/unreal-engine/lit-translucency-in-unreal-engine?application_version=5.8
- Lumen GI/reflections + technical details: https://dev.epicgames.com/documentation/en-us/unreal-engine/lumen-global-illumination-and-reflections-in-unreal-engine?application_version=5.8 ,
  https://dev.epicgames.com/documentation/en-us/unreal-engine/lumen-technical-details-in-unreal-engine?application_version=5.8
- Post process materials: https://dev.epicgames.com/documentation/en-us/unreal-engine/post-process-materials-in-unreal-engine?application_version=5.8
- Decal materials: https://dev.epicgames.com/documentation/en-us/unreal-engine/decal-materials-in-unreal-engine?application_version=5.8
- Nanite: https://dev.epicgames.com/documentation/en-us/unreal-engine/nanite-virtualized-geometry-in-unreal-engine?application_version=5.8
- PSO precaching: https://dev.epicgames.com/documentation/en-us/unreal-engine/pso-precaching-for-unreal-engine?application_version=5.8
- 5.8 release notes (Substrate Toon = Experimental): https://dev.epicgames.com/documentation/unreal-engine/unreal-engine-5-8-release-notes
- Naming (PPM_): https://dev.epicgames.com/documentation/en-us/unreal-engine/recommended-asset-naming-conventions-in-unreal-engine-projects?application_version=5.8
