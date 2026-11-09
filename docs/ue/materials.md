# Materials (UE 5.8.4, RTX 4060 8 GB)

Rule zero: **one master material, many instances.** Props get `MI_<Name>` parented to `/Game/Kit/Materials/M_PBR_Master`
(built by `gen/unreal/materials.ts`). Before making any material, load Epic's agent skill `MaterialBasicsSkill`
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

Naming: `PPM_` (Epic's 5.8 list) and `MPC_` (kit convention) are both in `naming.md`. Masked foliage/fences: a
Masked variant would need its own master too (or one static switch, see below).

## Master + instance best practice

- **MI (constant)** = editor-time values, no recompile, edits show instantly. **MID** = runtime values from code.
- **Static switches cost shaders, not frame time.** Each combination of static parameters used by any MI compiles a new
  shader set (Epic skill: 2 switches = 4, 4 = 16). An MI that overrides a static switch gets its own permutation.
  Prefer **scalar params + Lerp** (a few ALU instructions, zero new shaders) for toggles; use a static switch only to
  strip an expensive branch (e.g. triplanar, extra texture). Max 1-2 on the master.
- **Parameter groups:** set `Group` on every parameter. The master uses `Textures`, `Color`, `Surface`, `Emissive`,
  `Feedback` (add `Global` for MPC-driven params). Neutral defaults (multiply by 1, lerp by 0) so existing MIs
  don't change when params are added.
- Adding parameters to the master recompiles it and all its MIs once (editor shows grey meanwhile). Batch master
  changes; don't iterate on the master during the last day.
- Neutral normal is (0,0,1) (pure blue), not zero (Epic skill). Default normal texture fill is 128,128,255: correct.
- Metallic is binary (0/1) except rust/dust; very matte = high Roughness, not Specular 0; leave Specular at 0.5
  (Epic PBR page). AI textures often have grey "metallic" noise: clamp or override per MI if props look dirty-chrome.

## Master material (v3: built 2026-10-24, `UseTintMask` switch added 2026-10-25)

**Built:** items 1, 3, 4, 5, 6, 7, 9 below, by `gen/unreal/py/build_master_material.py` (`VERSION = "3"`),
called from `materials.ts ensureMaster()`. Parameters by group (these are the real names; use them exactly):
Textures `BaseColor`, `Normal`, `ORM`, `EmissiveTexture` · Color `Tint`, `Saturation`, `UseTintMask` (static switch,
see "Tint mask" below) · Surface `RoughnessScale`, `RoughnessOffset`, `MetallicOverride` (lerp alpha) +
`MetallicValue`, `NormalStrength` (FlattenNormal), `AOStrength` · Emissive `EmissiveColor`, `EmissiveStrength`,
`UseEmissiveTexture` (static switch) · Feedback `FlashAmount` (Custom Primitive Data 0), `FlashColor`,
`FlashStrength` (20). Two static switches in total.
Texture samples: 3 (colour, normal, ORM), +1 only with `UseEmissiveTexture`. Both pipelines pack the ORM
(`gen/blender/pack_orm.py`). Not built: 2 (HueShift), 8 (Wetness MPC), 10 (triplanar); add when a game needs them.

- **Upgrading:** the script tags the asset `MegajamMasterVersion` and rebuilds the graph **in place**
  (`delete_all_material_expressions`), never delete-and-recreate: instances reference the master, and deleting a
  referenced asset opens a blocking modal dialog. Bump `VERSION` to roll out a change.
  In 5.8.4 one `delete_all_material_expressions` call removes only about half the nodes (tested: 66 → 32), so call
  it until `get_num_material_expressions` is 0 (`clear_graph` in the build scripts). Leftovers stay as orphan nodes.
- **Scripted links from a Dynamic Parameter** use the channel letters `R`/`G`/`B`/`A`; its pin names
  (`Param1`..`Param4`) fail to connect, although `get_material_expression_output_names` lists them.
- **Hit flash from C++:** `Mesh->SetCustomPrimitiveDataFloat(0, 1.f)` then fade to 0 over ~0.15 s (timer or
  timeline; not Tick). Per actor, no MID. At `FlashStrength` 20 a full flash blows out to pure white (verified):
  good as a 1-frame hit; use 3-5 for a readable glow, `FlashColor` red for damage.
- **Editor vs runtime CPD:** in editor scripts set `set_default_custom_primitive_data_float` (what the viewport shows
  and the level saves); `set_custom_primitive_data_float` is the runtime value.

The original proposal, kept for the remaining items (2, 8, 10). Rows marked **built** list the parameter names as
built; the names above are authoritative.

Each item: what, nodes (all verified in the 5.8 Python stub / engine content), cost, why.

| # | Add | Nodes | Cost | Why |
|---|---|---|---|---|
| 1 (built) | `Tint` (vector, white) multiplies BaseColor | VectorParameter, Multiply | ~1 ALU | Recolour variants of one prop without new textures |
| 2 | `HueShift` (scalar, 0) | MaterialFunctionCall -> `/Engine/Functions/Engine_MaterialFunctions02/HueShift` | ~10-20 ALU (unverified count) | Palette variety for PCG-scattered copies |
| 3 (built) | `Saturation` (scalar, 1) | Desaturation | few ALU | Pull loud AI textures toward one art direction |
| 4 (built) | `RoughnessScale` (1), `RoughnessOffset` (0), `MetallicOverride` (lerp alpha, 0 = use texture) + `MetallicValue` | ScalarParameter, Multiply, Add, Lerp | few ALU | Fix AI roughness/metal maps per MI, no re-gen |
| 5 (built) | `NormalStrength` (1) | Multiply on normal.xy (or `FlattenNormal` fn) | ~2 ALU | Tame over-strong generated normals |
| 6 (built) | Emissive: `EmissiveTexture` (default black, behind `UseEmissiveTexture`), `EmissiveColor` (white; strength 0 keeps it off), `EmissiveStrength` (0) | TextureSampleParameter2D, Multiply | **+1 texture sample** | Screens, runes, lamps, pickups glow + bloom |
| 7 (built) | **ORM packing**: one `ORM` texture (R=AO, G=Roughness, B=Metallic), `TC_Masks`, sRGB off, `SAMPLERTYPE_MASKS` | TextureSampleParameter2D, outputs R/G/B to AO/Roughness/Metallic | **3 samples per prop** (colour, normal, ORM) instead of 4 | Texture memory is our real 8 GB limit (`performance.md`) |
| 8 | `Wetness` from `MPC_Global` | CollectionParameter, Lerp roughness down / basecolor darker | few ALU, 1 uniform | Rain/time-of-day mood on everything at once |
| 9 (built) | Per-object flash/dissolve via **Custom Primitive Data** | ScalarParameter with `use_custom_primitive_data` + `primitive_data_index` | ~ALU only | Hit flash/highlight per actor without a MID |
| 10 | (Optional static switch) `UseTriplanar` | MaterialFunctionCall -> `/Engine/Functions/Engine_MaterialFunctions01/Texturing/WorldAlignedTexture` | 3x samples per texture when on | Level geometry/blockout with bad UVs |

Item 7's packing is done by `gen/blender/pack_orm.py` (`T_<Name>_orm`). Keep
`bUsedWithNanite/SkeletalMesh/InstancedStaticMeshes` (the build script sets these three) and add any new usage the game
needs **before packaging**: `bUsedWithSplineMeshes`, `bUsedWithNiagaraMeshParticles`, `bUsedWithGeometryCollections`
(Chaos destruction), `bUsedWithMorphTargets` (all exist on UMaterial in 5.8). Missing flag in a packaged build =
default material.

## Domains, blend modes, Nanite

- Nanite supports **Opaque and Masked** only. Unsupported material on a Nanite mesh = default material + Output Log
  warning. Translucent = non-Nanite mesh.
  **5.9:** the AVBOIT page mentions Nanite translucency, off by default and turned on with `r.Nanite.AllowTranslucency`
  (docs/ue59/pages/adaptive-voxelbased-order-independent-transparency-in-unreal-engine.md); the 5.9 Nanite page still
  lists Opaque and Masked only (docs/ue59/pages/nanite-virtualized-geometry-in-unreal-engine.md). Keep glass on
  non-Nanite meshes.
- Masked and World Position Offset work with Nanite but cost more (programmable raster; unverified on the 5.8 page).
  WPO is "supported, but limited": clamp displacement. Custom UVs / Vertex Interpolator are evaluated 3x per pixel under Nanite. Custom HLSL
  nodes "might result in artifacts". Prefer Opaque; use Masked only where the cutout is visible (leaves, fences).
- Blend modes in 5.8: Opaque, Masked, Translucent, Additive, Modulate, AlphaComposite, AlphaHoldout,
  TranslucentColoredTransmittance (Substrate).
- Fades/dissolves on Nanite props: Masked + `DitherTemporalAA` fn (`/Engine/Functions/Engine_MaterialFunctions02/Utility/`)
  keeps Nanite and avoids translucency (dither is smoothed by TSR; can shimmer, unverified).

## Glass / translucency

- Separate `M_Glass` master, non-Nanite mesh. Blend Translucent. Lighting Mode **Surface TranslucencyVolume** to get
  scene reflections, or **Surface ForwardShading** for specular from multiple lights (+ needs SSR).
  TranslucencyVolume (`TLM_SURFACE`) lights from the translucency volume, which ends ~50 m from the camera: for
  translucency seen from further away use `TLM_SURFACE_PER_PIXEL_LIGHTING`. Thin Translucent
  shading model (+ Surface ForwardShading) = tinted glass.
- Lumen: with **High Quality Translucency Reflections** (project setting) Lumen gives mirror reflections on the frontmost
  translucent layer; deeper layers fall back to glossy Radiance Cache reflections. Single Layer Water gets mirror reflections.
- Lit translucent surfaces are lit via a volume texture: "missing direct specular", can look low-res. Fine for small glass.
- Cost: **overdraw**: every stacked translucent layer re-shades the pixel. Check Shader Complexity view (green cheap,
  red expensive). Keep glass small on screen, avoid layered glass. Use Translucency Sort Priority to fix sorting.
- **5.9:** **AVBOIT** (Adaptive Voxel-Based Order Independent Transparency, **Experimental**) blends overlapping
  translucency correctly regardless of draw order (no sort popping). Off by default; no Project Settings entry. Turn on in
  `DefaultEngine.ini` `[SystemSettings]`: `r.OIT.Method=1`, plus `r.AVBOIT.NonNanite=1` for non-Nanite translucency and
  particles (our `M_Glass`; default 0, so without it nothing changes). Needs an SM6 desktop platform; off under MSAA and
  in debug view modes. Works with Translucent, Additive, Modulate, AlphaComposite and coloured transmittance (tinted
  glass, `r.AVBOIT.RGB` 1). The material must output only its own light: **no SceneColor, refraction or distortion**
  (they wash out to a flat filter); check with `r.AVBOIT.DebugWeightOutput 2`. Changing `r.OIT.Method` at runtime
  recreates all render state (hitch). Limits: surfaces in the same depth slice average; edges step at
  `r.AVBOIT.PixelSize` (8 px); beyond `r.AVBOIT.MaxDistance` (20000 cm) all goes in one slice. Debug views
  `r.AVBOIT.Visualize` need `r.ShaderPrint 1` and are absent in Test/Shipping
  (docs/ue59/pages/adaptive-voxelbased-order-independent-transparency-in-unreal-engine.md).
- Translucent colored shadows need static lighting/Lightmass: **not available to us (dynamic lighting only, no baking)**.

## Substrate (on by default in our 5.8 project)

- Epic's 5.8 hub labels Substrate **Beta** ("use caution when shipping"). But it's **enabled by default for new
  projects**, and a test project's `<Project>/Config/DefaultEngine.ini` has `r.Substrate=True`, `r.Substrate.ProjectGBufferFormat=0`
  (Blendable GBuffer: "performance in parity with the non-Substrate path", no cook overhead, meant for 60 Hz).
- Decision: **leave it on, author with legacy inputs.** Non-Substrate materials (our master: BaseColor/Normal/
  Roughness/Metallic pins) "work out-of-the-box" and are converted at compile time. Don't toggle `r.Substrate` mid-jam
  (restart + full recompile; Substrate-node materials render black if disabled).
- Don't use "Convert to Substrate" on the master: permanent, irreversible. Don't use Adaptive GBuffer (higher cost,
  +15% cook, forces DBuffer).
- Under Substrate, translucent blend modes are TranslucentColoredTransmittance / TranslucentGreyTransmittance
  (grey is cheaper). Glass look via Slab: high SSS MFP + IOR 1.514. Extra slabs cost almost linearly: one slab only.
- The output pin `MP_FRONT_MATERIAL` is the Substrate root; connecting the legacy pins works for legacy authoring
  (MCP `connect_to_output` with `MP_BaseColor` etc., or `MaterialEditingLibrary.connect_material_property` with
  `MP_BASE_COLOR` etc., as `build_master_material.py` does).

## Emissive with Lumen (Lumen path; the kit's single note on this)

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
  referencing materials**: add all the params the game needs up front (e.g. WorldTint, PulseTime, Wetness,
  WindStrength).
- C++: `UKismetMaterialLibrary::SetScalarParameterValue(this, MPC, "Wetness", 0.7f)` /
  `SetVectorParameterValue(...)`. Renamed MPC params break Blueprint references (not materials).

## Gameplay feedback from C++

- Cheapest per actor: **Custom Primitive Data**, no new material instance: the master's hit flash already uses it
  ("Hit flash from C++" above). Instances: `PerInstanceCustomData` node.
- **MID** when you need texture swaps or per-slot control:
  `UMaterialInstanceDynamic* Mid = Mesh->CreateDynamicMaterialInstance(0);` (or
  `UMaterialInstanceDynamic::Create(Parent, Outer)`), then `SetScalarParameterValue`, `SetVectorParameterValue`,
  `SetTextureParameterValue`. Create once (BeginPlay), cache the pointer, update on events, not every tick.
- **A MID's parent must be a Material or a Material Instance Constant, never another MID.** `SetParentInternal`
  (`MaterialInstance.cpp`) refuses a MID, logs one `LogMaterial: Warning ... is not a valid parent` and leaves the
  parent unset, so the mesh draws the default material (seen in a rehearsal: additive rays drew as dark, lit cones).
  To share one look: take `GetMaterial(i)` before `CreateDynamicMaterialInstance(i)` and build every MID from that.
- Avoid `SetScalarParameterValueOnMaterials` in hot paths: it creates MIDs on every slot (unverified).
- Static switches can't be changed at runtime (compile-time only).

## Stylized looks (if the art direction goes non-PBR)

| Approach | Cost | Notes |
|---|---|---|
| **Post-process cel** (`PPM_Toon`: quantize light from SceneTexture) | One full-screen pass | Global, easy, one asset. Hits sky/fog too: mask with depth or Custom Stencil |
| **Outlines, post-process edge detect** (depth/normal) | One full-screen pass, several neighbour samples | Best value outline; works with Nanite |
| **Outlines, Custom Depth/Stencil per object** | Extra depth draw for marked meshes + PP pass | Highlight interactables; set Render Custom Depth + Stencil Value |
| **Substrate Toon BSDF + Toon Profile asset** | Per-material shading; no Epic cost figure | New in 5.8, **Experimental**; open shadow bugs (below). Practice run first |
| Inverted-hull outlines | 2x triangles, extra material | Avoid: awkward with Nanite |

- **Pick a route in this order.** Cheapest and safest: PBR master + strong lighting + LUT/grade + one PP outline.
  Next: PP cel (quantise `PostProcessInput0` luminance, mask the sky by depth or stencil). Substrate Toon gives the
  best per-material bands with Lumen GI, but only if a practice run proved it on our lights; it is a second
  domain-locked master (shading model is per Material).
- **Post-process material basics (Epic):** domain Post Process, output **Emissive** only (alpha is "not yet
  supported": use Opacity), read `PostProcessInput0`, never SceneColor (banding). Separate Translucency is invisible
  to the SceneTexture node. Use **ViewportUV**, not SceneTextureUV, for screen-relative maths. Defaults that do
  nothing (multiply by white, lerp by 0) let volumes blend smoothly. `Is Blendable` off = one pass per instance
  (costly). Use PP materials sparingly; prefer built-in volume settings (grading, bloom, vignette) when they do
  the job.
- **Blendable Location decides the resolution (TSR on).** After Tonemapping, Before Bloom, SSR Input and Replacing the
  Tonemapper run at **display resolution (4K for us)**; "Before Translucency" (`BL_SCENE_COLOR_BEFORE_DOF`) and
  "Before Tonemapping" (`BL_SCENE_COLOR_AFTER_DOF`) always run at the internal rendering resolution (1080p-1440p for
  us), in linear HDR. Epic's page calls After Tonemapping the cheapest location: true only without an upscaler. A
  neighbour-sampling pass (outline, Kuwahara, posterize) costs up to ~4x the pixels after tonemapping (4K vs 1080p;
  `performance.md`: post at 4K ~1 ms, measured).
- **Outlines and anything reading depth go Before Tonemapping**, or they jitter: Epic shows a custom-depth outline
  after the tonemapper "jittering around 1 pixel", stable and anti-aliased once it runs before the temporal upscale.
  The input is then HDR: set the line colour in scene-linear units and check it across the exposure range.
- **Custom Depth/Stencil (per-object outlines, highlights).** Project Settings > Rendering > Post-Processing >
  **Custom Depth-Stencil Pass = Enabled with Stencil** (plain "Enabled" has no stencil; "Enabled on Demand" can stall:
  avoid). Mesh: **Render CustomDepth Pass** on + **CustomDepth Stencil Value** 1-255 (C++ `SetRenderCustomDepth(true)`,
  `SetCustomDepthStencilValue(N)`). Read `SceneTexture:CustomStencil` in the PP material, one colour per value. The
  ini cvar is `r.CustomDepth` (3 = enabled with stencil writes; `SceneUtils.cpp`, 5.8.4).
- **User Scene Textures (5.8) for cheap multi-pass PP.** A PP material writes a named target (Details > **User Scene
  Texture**, e.g. `Blur1`); a later one reads it with a **User Scene Texture** node. **User Texture Divisor** 2,2 with
  **Resolution Relative To Input** = Input halves the pass; order with **Blendable Priority**; writers "aren't
  blended". Good for a half-res glow or painterly pass, not the outline (needs full res).
- **Substrate Toon in 5.8 ("Substrate NPR Shading", Experimental).** Built on Blendable GBuffer (our
  `ProjectGBufferFormat=0`: no project change). Works with all light types, sky light and Lumen GI. Node
  `MaterialExpressionSubstrateToonBSDF` takes one **Toon Profile** asset: diffuse/specular ramps (colour curves),
  indirect scales (Lumen GI amount), ramp offset textures (break up band edges), shadow extinction with hatching
  (RGBA = 4 tones). Quantised reflections need `r.Substrate.Experimental.ToonReflectionQuantizationEnabled=1`
  (unverified in 5.8.4). **Known problems, no 5.8 patch fix:** cast shadows on Toon surfaces look blurry (Epic's
  Sebastien Hillaire: VSM enlarges the light radius on that path; fixed in main only; a user's workaround
  `r.Shadow.Virtual.SubsurfaceShadowMinSourceAngle 0`, unverified); black stripes at shadow edges on large walls
  (community report); a Toon Profile **override on an MI is ignored after an editor restart** until the master
  recompiles (community report). Assign the profile on the master and A/B the packaged build.

## World-aligned / triplanar textures

- `WorldAlignedTexture` / `WorldAlignedNormal` functions (`Engine_MaterialFunctions01/Texturing`) project by world
  position: no UVs, no seams on scaled blockout geometry. ~3x the texture samples (one per axis) and textures swim
  on moving actors. Use for static level geometry (walls, rocks, ground), not props (AI props have UVs).
- **`M_PBR_Master` has no UV tiling scalar and no world-aligned option yet** (item 10 is not built). On graybox made
  of scaled `SM_Cube`s, the 0-1 UVs stretch one texture over a whole 10 m wall. Workaround used on a prototype: rebuild
  each graybox piece as a world-space Geometry Script box (Nanite on) with box-projected UVs at 200 cm per tile
  (`GeometryScript_UVs`; see `editor-scripting.md` for the Geometry Script traps and collision). It works, but every
  resize of a graybox piece needs a re-run. A master upgrade (`UVTiling` scalar, `WorldAligned` switch with a tile
  size in cm) is planned.

## Decals

- Domain **Deferred Decal**, blend Translucent or AlphaComposite (DBuffer; Modulate silently falls back). DBuffer
  decals are on by default and required with Substrate. Nanite meshes **receive** projected decals; mesh decals
  (translucent) can't be Nanite.
- Cost = projection box screen size x material complexity; the receiving mesh's triangle count doesn't matter, so keep
  the box tight. Turn off Receives Decals on actors that don't need them. Higher Sort Order draws on top, but many
  distinct Sort Order values stop decals batching. **DecalDerivative** has "a very large performance impact": only to
  fix 2x2 block artifacts. Decal textures must not stream. Check overlaps in Shader Complexity.

## Performance and shader compiles

- Count matters more than graph size: texture samples (each prop = 3: colour, normal, ORM; +1 with an emissive
  texture), translucent overdraw, full-screen PP passes. Check Material Editor Stats (instruction/sampler counts) and Shader Complexity view.
- Every new Material / static permutation = shader compiles in editor (grey meshes until done) and more PSOs at runtime.
- **5.9:** `r.AVBOIT.Support` (default 1, read-only, restart) compiles an extra shader version of every translucent
  material on SM6 desktop even with `r.OIT.Method` 0. If the game doesn't use AVBOIT, set `r.AVBOIT.Support=0` in
  `DefaultEngine.ini` (docs/ue59/pages/adaptive-voxelbased-order-independent-transparency-in-unreal-engine.md).
- **PSO precaching** is on by default in 5.8: if a component's PSOs aren't ready the engine **skips drawing it**
  (pop-in) rather than hitching (`r.PSOPrecache.ProxyCreationStrategy`, default 1 = delay; the older
  `r.PSOPrecache.ProxyCreationWhenPSOReady` is deprecated in 5.8). Values (`EPSOPrecacheProxyCreationStrategy`,
  `PSOPrecacheComponent.h`): 0 `AlwaysCreate` (draw now, may hitch), 1 `DelayUntilPSOPrecached` (pop-in), 2
  `UseFallbackMaterialUntilPSOPrecached` (default grey material). Epic's 5.8 precaching *page* still documents the
  old cvar pair: trust the API and the console (`r.PSOPrecache.` then Tab). Few masters/permutations = fewer PSOs.
  **5.9:** the 5.9 precaching page and the 5.9 console variable reference also list only the old pair
  (`r.PSOPrecache.ProxyCreationWhenPSOReady`, `r.PSOPrecache.ProxyCreationDelayStrategy`), no `ProxyCreationStrategy`
  (docs/ue59/pages/pso-precaching-for-unreal-engine.md, docs/ue59/pages/unreal-engine-console-variables-reference.md).
  Check the console on 5.9 the same way.
  First-launch warm-up screen and the cold-cache test: `production.md` "First launch: PSO warm-up".

## MCP MaterialTools (what the agent can build)

- `create_material` / `create_function` / `create_parameter_collection`; `add_expression(material, expression_class
  {refPath:'/Script/Engine.MaterialExpressionX'}, x, y)`; `list_expression_classes(material, search)` to discover;
  `connect_expressions(from, out, to, in)`; `connect_to_output(expr, out, MP_*)`; `get_expression_input_names` /
  `get_expression_output_names` (empty string = default output); `get_expression_inputs` / `get_property_input`
  to verify wiring; `rename_parameter_group`; `layout_expressions`; `delete_unused_expressions`; `recompile`.
- Gotchas: call `recompile` **once** after a batch of edits (it raises with the compile errors; read them).
  `delete_unused_expressions` doesn't recompile. No tool for usage flags, blend mode or domain: set them with
  `ObjectTools.set_properties` (`BlendMode`, `MaterialDomain`, `bUsedWith*`), or in Python as the kit's build scripts
  do (`set_editor_property("blend_mode", ...)`, `MaterialEditingLibrary.set_material_usage`). Texture sampler
  type must match compression (Normal/`TC_Normalmap`, Masks/`TC_Masks`, LinearGrayscale/`TC_Grayscale`) or compile fails.
  For `TC_Grayscale` it also follows sRGB: sRGB off takes `SAMPLERTYPE_LINEAR_GRAYSCALE`, sRGB on
  `SAMPLERTYPE_GRAYSCALE` ("Sampler type is Grayscale, should be Linear Grayscale" fails the whole material).
  On an MI the failed permutation is quiet: the master's `EmissiveTexture` is a Color sampler, so a `TC_Grayscale`
  (or `TC_Masks`) mask there drew no glow at all. Import emissive masks sRGB with `TC_Default` (write the PNG
  sRGB-encoded); proven on a prototype.
  `create_material` itself warns: prefer an MI.
- Setting `material_function` on a FunctionCall through generic `set_properties` may not refresh its pins; check with
  `get_expression_input_names` and recompile (unverified).
- **Read back, don't trust the bool:** `MaterialEditingLibrary.set_material_instance_*_parameter_value` returned False
  even when the value was set (confirmed with the matching `get_material_instance_*_parameter_value`).
- **A connection by name gets the expression's first output.** A `VectorParameter`'s default pin (`""`) is RGB only,
  and `MaterialExpressionVertexColor` has five outputs all named `""` (RGB, R, G, B, A), so by name you always get RGB
  (5.8 `MaterialExpressions.cpp`). A mask on A (or a 4-channel mask) then breaks the **whole** material's compile
  (a landscape material drew the checker everywhere). Connect the `A` pin separately where it has one, otherwise pack
  data in R/G/B or use a second parameter. (A Custom node reading `.w` fails with "vector swizzle 'w' is out of
  bounds".)
- **Query a material's inputs one named property at a time** (`MaterialEditingLibrary.get_material_property_input_node`
  for BaseColor, Normal, Roughness, EmissiveColor, WorldPositionOffset...). Looping over every `MaterialProperty.MP_*`
  crashed the 5.8.4 editor (access violation in MaterialEditor).
- In a Custom node, sample a texture object input with `Texture2DSample(Tex, TexSampler, uv)`.

## Scripted materials: checks and traps (5.8.4, rehearsal)

- **Check every scripted build with MCP `MaterialTools.recompile`**: it raises with the real error ("(Node
  ComponentMask) Not enough components in ... for component mask 0001"). `MaterialEditingLibrary.recompile_material`
  returns nothing, and the Output Log says only "Failed to compile Material ... Default Material will be used" (grep
  for it as a second check). A failed material renders as the grey default material.
- **`MaterialExpressionComponentMask` from Python:** set `r`/`g`/`b`/`a` explicitly; don't rely on its defaults, or the
  compile can fail ("Cannot cast float3 to float2").
- **Guard every division:** a 0/0 in a world-aligned blend weight (`|Nx| / (|Nx| + |Ny|)` on flat tops) made a NaN
  that a lerp with alpha 1 did not hide: a third of the ground went black and stippled. Add an epsilon.
- **Per-instance pan speed:** the Panner's `speed_x`/`speed_y` are constants, not inputs. Feed
  `Time x ScalarParameter("FlowRate")` into its `Time` pin (pins: Coordinate, Time, Speed).
- **`TextureSampleParameter2D` nodes with the same parameter name share one value**: one MI swaps the texture of
  every layer at once. Give each layer its own name if they must differ.
- **Translucent overlays on Single Layer Water:** SLW writes depth, so a DepthFade on foam riding 5 cm above the water
  sees 5 cm of depth everywhere and erases it. Leave DepthFade off (~2 cm) on overlays; use it (e.g. 1 m) only on
  sheets well off the water (spray).
- **Noise foam on translucent water:** the average of two noise samples sits near the middle, so a low cut smears
  ~40% foam everywhere and the water reads pale. Cut high and sharp (threshold ~0.55, contrast x8).
- **A dark lit translucent film barely darkens what's behind it** (it picks up the sky's specular). For a stain (wet
  rock), use `BLEND_MODULATE` + Unlit.
- Water plugin materials on plain meshes: `worldbuilding.md` "Waterfalls and custom bodies".

## Lessons from a prototype

- **Thin Default Lit grass goes black when seen against the sun.** Two Sided Foliage shading with a subsurface colour
  fixes it (a separate master: shading model is per Material).
- **`M_PBR_Master`'s default BaseColor texture is mid-grey**, so an untextured MI that only sets `Tint` comes out dark.
  Override BaseColor with `/Engine/EngineResources/WhiteSquareTexture` for flat-colour pieces.
- **Generated textures drift from a hex palette in the prompt.** Two generated props came back redder and glossier
  than the palette. Don't re-roll: the master applies
  `BaseColor * Tint` then `Desaturation(1 - Saturation)`, so a small least-squares fit of (Saturation, Tint RGB) over
  the texture's two main colours brings it onto the palette, plus `RoughnessOffset` for gloss. No credits.
- **Tint mask (master v3):** the `UseTintMask` static switch lerps between the untinted texel and `BaseColor * Tint`
  by the base colour's alpha (alpha 1 = tint). Off by default, so existing instances render unchanged. Masked base
  colour textures compress as BC3 instead of BC1 (2x memory, masked textures only). Make one `MI_<Name>_Tintable`
  with the masked texture and the switch on, then per-variant children that change only `Tint` (they share shaders).

## Verified against

- `editor_toolset/skills/material_basics.py` and `editor_toolset/toolsets/material.py` (UE 5.8 install), read 2026-10-24.
- `Engine/Source/Runtime/Engine/Public/Materials/Material.h` (bUsedWith* flags), `MaterialInstanceDynamic.h`,
  `Classes/Components/PrimitiveComponent.h`, `MeshComponent.h`, `Classes/Kismet/KismetMaterialLibrary.h`.
- `<Project>/Intermediate/PythonStub/unreal.py`: all expression classes named above exist except
  WorldAlignedTexture/HueShift/DitherTemporalAA, which are Material Functions (assets found under `Engine/Content/Functions`).
  `MaterialExpressionSubstrateToonBSDF` and `ToonProfile` exist. Blend modes / shading models from the stub enums.
- `<Project>/Config/DefaultEngine.ini`: `r.Substrate=True`, `ProjectGBufferFormat=0`.
- Python API pages (5.8): `BlendableLocation` enum (which locations run at display vs rendering resolution),
  `ToonProfileStruct`, `MaterialExpressionSubstrateToonBSDF`.
- Unverified: HueShift instruction count; FunctionCall pin refresh via set_properties;
  whether the Toon shadow fix reached 5.8.4; which property holds a Toon Profile override on an MI.

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
- User Scene Textures: https://dev.epicgames.com/documentation/en-us/unreal-engine/post-process-material-user-scene-textures-in-unreal-engine?application_version=5.8
- BlendableLocation enum: https://dev.epicgames.com/documentation/en-us/unreal-engine/python-api/class/BlendableLocation?application_version=5.8
- ToonProfileStruct: https://dev.epicgames.com/documentation/en-us/unreal-engine/python-api/class/ToonProfileStruct
- Rendering project settings (Custom Depth-Stencil Pass): https://dev.epicgames.com/documentation/en-us/unreal-engine/rendering-settings-in-the-unreal-engine-project-settings?application_version=5.8
- Decal materials: https://dev.epicgames.com/documentation/en-us/unreal-engine/decal-materials-in-unreal-engine?application_version=5.8
- Decal actors (cost, sorting): https://dev.epicgames.com/documentation/en-us/unreal-engine/decal-actors-in-unreal-engine?application_version=5.8
- Forum (Epic reply, Hillaire) Toon blurry shadows: https://forums.unrealengine.com/t/5-8-preview-toon-bsdf-shadows-cast-on-surface-are-blurry/2736077
- Forum (community) Toon stripes: https://forums.unrealengine.com/t/ue5-8-substrate-toon-bsdf-black-stripes-bug/2736175
- Forum (community) Toon MI override: https://forums.unrealengine.com/t/ue-5-8-substrate-toon-profile-override-in-material-instance-fails-to-apply-after-restarting-the-editor/2738757
- Nanite: https://dev.epicgames.com/documentation/en-us/unreal-engine/nanite-virtualized-geometry-in-unreal-engine?application_version=5.8
- PSO precaching: https://dev.epicgames.com/documentation/en-us/unreal-engine/pso-precaching-for-unreal-engine?application_version=5.8
- EPSOPrecacheProxyCreationStrategy (5.8 API): https://dev.epicgames.com/documentation/en-us/unreal-engine/API/Runtime/Engine/EPSOPrecacheProxyCreationStrateg-
- 5.8 release notes (Substrate Toon = Experimental): https://dev.epicgames.com/documentation/unreal-engine/unreal-engine-5-8-release-notes
- Naming (PPM_): https://dev.epicgames.com/documentation/en-us/unreal-engine/recommended-asset-naming-conventions-in-unreal-engine-projects?application_version=5.8
