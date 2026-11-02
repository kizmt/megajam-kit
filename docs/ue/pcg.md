# PCG: procedural placement (UE 5.8.4)

The kit's single note on PCG: the supervised MCP workflow, what the nodes do, which plugins, Epic's skill rules,
the PCGToolset tool list, and recipes for dressing a small level with our Nanite props. Use PCG for rule-based
placement only; hero props are placed by hand.

## Supervised agent workflow (mandatory; PCG via MCP is Experimental)

1. Load `PCGToolset` and **`Skill_PCGGraphGeneration` first** (without it the agent misreads concepts).
2. Find a similar example graph (PCG SampleContent, PCGPrimitives examples, project graphs) and adapt it; build new
   only if none fits.
3. The director selects the assets/actors to use in the editor; don't let the agent search broadly.
4. Plan / list nodes to change before executing; execute in small steps; supervise.
5. Use **Dataview** (`GetNodeDataView`) to inspect generated point attributes (the agent can't read them otherwise).
Other skills: `Skill_InstantLevelOperations` (quick batch placement without a graph: try first for simple jobs),
`Skill_PCGShapeGrammarDefinition` (modules along a spline), `Skill_PCGInstancingOnMeshActor` (surface detail).

## Plugins and status (read from the .uplugin files on this PC)

| Plugin | Status in 5.8 | Default | Why we need it |
|---|---|---|---|
| `PCG` (Procedural Content Generation Framework) | no beta/experimental flag (production) | **on** | Core framework |
| `PCGGeometryScriptInterop` | **Beta** | off | Mesh Sampler (sample points on a static mesh); PCGPrimitives depends on it |
| `PCGToolset` | **Experimental**, editor-only | off (pulled in by `AllToolsets`) | MCP tools for graphs + the PCG skills |
| `PCGPrimitives` | **Experimental** | off | Primitive subgraphs + example graphs the skill relies on (pulls in PCGGeometryScriptInterop, PCGBiomeCore, PCGBiomeSample, PCGExternalDataInterop) |
| PCG GPU processing | Beta (docs); GPU Static Mesh Spawner Experimental | - | Not for us (see Performance) |
| PCG Editor Mode | Experimental (docs) | in PCG | Optional hand tools (see below) |

- **Gotcha:** `PCGToolset` defaults its example/primitive/instant folders to `/PCGPrimitives/Examples`,
  `/PCGPrimitives/Primitives`, `/PCGPrimitives/Instants` (`PCGToolsetSettings.cpp`). If **PCGPrimitives is not
  enabled**, `Skill_PCGGraphGeneration` gets empty example/primitive lists and the agent falls back to raw native
  nodes. Enable PCGPrimitives in the jam project (Edit > Plugins, restart) before any PCG work.
- Folders are configurable: Project Settings > Plugins > PCG Toolset (Subgraph / Example Graph / Instant Graph
  Directories). Add `/Game/PCG` to Example Graph Directories once we have our own graphs worth reusing.

## Core concepts (5 lines each, enough to read a graph)

- **PCG Graph** (`UPCGGraph` asset): node graph; data flows left to right from the component's input to spawners.
  A graph only shows something if it has a **spawn-type node** (Static Mesh Spawner, Spawn Actor, `Spawn_Assets`).
- **PCG Component** (`UPCGComponent`): runs a graph on an actor; the actor's bounds/shape are the "Input". Has
  **Seed** (default 42), **Generation Trigger**, **Editing Mode**. Generated ISMs live as managed components.
- **PCG Volume** (`APCGVolume`): a box volume with a PCG Component; the normal way to place a graph instance.
  `SpawnGraphInstance` makes one (its docstring suggests scale 25x25x10 at the origin; size it to the room instead).
- **Graph Instance**: per-volume overrides of the graph's **Graph Parameters** (meshes, density, spacing...).
- **Points**: transform, bounds (extents), color, **density** (0-1), steepness, seed. Static attributes start with
  `$` (`$Position`, `$Density`, `$Scale`, `$Seed`); dynamic ones are metadata. Domains: `@Data` (one value per
  data), `@Points`, `@Elements` (attribute sets). Docs and the skill disagree on the default when no domain is
  given (Data vs Points): always write the domain explicitly. Prefer existing `$` attributes over new ones.
- **Spatial data** (surfaces, volumes, splines, primitives) is *sampled* into points; points are filtered/
  transformed; spawners turn points into instances.
- Debug in graph editor: select node, **D** = debug render points, **A** = inspect (attribute list), **E** =
  enable/disable. Agent equivalent: `GetNodeDataView` (the "Dataview").

## Node cheat-sheet (C++ class in `Engine/Plugins/PCG/Source/PCG/Public/Elements/`)

| Node | Class | Key settings (defaults) | Use |
|---|---|---|---|
| Surface Sampler | `UPCGSurfaceSamplerSettings` | PointsPerSquaredMeter 0.1, PointExtents 50, Looseness 1, bUnbounded false, bApplyDensityToPoints true | Regular-grid scatter on a surface (landscape, ray-hit surface) |
| Spline Sampler | `UPCGSplineSamplerSettings` | Dimension OnSpline/OnHorizontal/OnVertical/OnVolume; Mode Subdivision/Distance/NumberOfSamples; DistanceIncrement 100; InteriorSampleSpacing 100; bProjectOntoSurface false | Along a path, or inside a closed spline (OnHorizontal) |
| Volume Sampler | `UPCGVolumeSamplerSettings` | voxel grid size | 3D grid; costly on big volumes |
| Mesh Sampler | `UPCGMeshSamplerSettings` (GeometryScriptInterop, Beta) | SamplingMethod OnePointPerTriangle / OnePointPerVertex / Poisson; bVoxelize; VoxelSize 100 | Points on a static mesh's triangles. Costly; Poisson is not frame-bound |
| World Ray Hit Query | `UPCGWorldRayHitSettings` | Ignore PCG Hits, Apply Metadata From Landscape, actor filtering | Turns physics geometry (our floor meshes) into a surface to sample |
| Get Actor Data / Get Spline Data | `UPCGDataFromActorSettings` / `UPCGGetSplineSettings` | Actor Filter (by tag/class), Mode | Pull a tagged spline/actor into the graph |
| Density Filter | `UPCGDensityFilterSettings` | lower/upper bound | Cheapest filter; prefer over Attribute Filter |
| Filter By Attribute | `UPCGFilterByAttributeSettings` | attribute + op | Filter by any attribute (steepness, normal...) |
| Spatial Noise | `UPCGSpatialNoiseSettings` | Perlin etc. to attribute/density | Natural clumping before Density Filter |
| Normal To Density | `UPCGNormalToDensitySettings` | Normal, Offset, Strength | Keep flat-ish points (no props on walls) |
| Transform Points | `UPCGTransformPointsSettings` | random offset/rotation/scale, Uniform Scale, Recompute Seed | Jitter; random yaw 0-360 |
| Bounds Modifier | `UPCGBoundsModifierSettings` | scale/set bounds | Set footprint before Self Pruning |
| Self Pruning | `UPCGSelfPruningSettings` | PruningType LargeToSmall/SmallToLarge/AllEqual/None, RadiusSimilarityFactor 0.25, bRandomizedPruning true | Removes overlapping points (uses point bounds) |
| Difference | `UPCGDifferenceSettings` | Density Function Minimum/Clamped Subtraction/Binary; Mode Inferred/Continuous/Discrete | Cut points by another shape (keep paths clear) |
| Distance | `UPCGDistanceSettings` | to nearest point of 2nd input | Distance-based culling/density |
| Copy Points | `UPCGCopyPointsSettings` | source x target | Clusters around anchor points |
| Static Mesh Spawner | `UPCGStaticMeshSpawnerSettings` | MeshSelectorType (Weighted / ByAttribute / WeightedByCategory), bApplyMeshBoundsToPoints true, bAllowDescriptorChanges true, bSetupCullingCells false | Points to instanced meshes |

## Our floors may not be Landscape: sampling static mesh floors

- Surface Sampler needs **surface data**. Landscape gives it directly (`Get Landscape Data`); a static mesh floor
  does not. Options, cheapest first:
  1. **World Ray Hit Query -> Surface Sampler**: rays fire down through the volume and hit whatever has collision
     (our floors/blockout). Turn **Ignore PCG Hits** on so props don't stack on earlier props. Epic sample:
     `/PCG/SampleContent/SimpleForest/PCGGraphs/SimpleForestWorldRayHits`. (Exact pin wiring: verify by opening it.)
  2. **Primitive `Scatter_points_onto_Mesh_Actor`** (`/PCGPrimitives/Examples/Utilities/`): Poisson on a chosen
     mesh actor; driven by `Skill_PCGInstancingOnMeshActor` (rules below). Good for "detail on this one mesh".
  3. **Mesh Sampler** (Beta): exact triangles of a mesh; costly, use on small meshes only.
- The floor needs **collision** for ray hits; our generated props have a convex hull, blockout boxes have simple
  collision. Hidden/no-collision geometry is invisible to option 1.

## Splines as input

- Put a Spline Component on an actor (or let the agent call `DrawSpline` so the director draws it), give the actor a
  **tag**, read it with **Get Spline Data** (Actor Filter by tag). Splines are not inside the volume automatically.
- Open spline = path (props along it: OnSpline + Distance mode). Closed spline = area (OnHorizontal fills the
  interior, `InteriorSampleSpacing`). Difference with a spline-derived shape keeps a walkway clear.
- For modular runs (fences, walls), use `Skill_PCGShapeGrammarDefinition` / primitive `Place_OnSpline`, not raw nodes.

## Instancing and Nanite (verified in source)

- Static Mesh Spawner emits **ISM** components by default (`PCGISMDescriptor.cpp`). If a descriptor asks for HISM
  and the mesh **has Nanite**, PCG downgrades it to ISM (`PCGActorHelpers.cpp`: "less efficient to put Nanite
  meshes inside of HISMs"), as long as `bAllowDescriptorChanges` stays true. Our Nanite props => ISM: correct.
- One ISM per (mesh, descriptor) per component: 5 prop meshes = ~5 draw batches regardless of instance count.
- Materials: instances use the mesh's `MI_<Name>`; master material needs the **instanced** usage flag (see
  `materials.md`; missing flag = grey in packaged build). No per-instance material overrides.
- Collision on instances follows the descriptor/mesh (convex hull). For tiny clutter, turn collision off in the
  spawner's descriptor to save physics cost (unverified exact field name; check in Details).

## Editor vs runtime generation (decision)

- Generation Trigger: `GenerateOnLoad` (default), `GenerateOnDemand`, `GenerateAtRuntime` (scheduler + radius,
  for huge worlds). Editing Mode: `Normal` (results dirty and **save** with the level), `Preview` (not saved),
  `LoadAsPreview`.
- **Decision for the jam: generate in the editor, Editing Mode Normal, non-partitioned, CPU.** The level is small;
  baked-in instances mean no runtime cost, no hitch, deterministic screenshots. Runtime generation, HiGen,
  partitioning and GPU are for open worlds. Verify in the first packaged build that PCG props appear (unverified
  that cooked builds never regenerate GenerateOnLoad components).
- Deterministic: same graph + same seeds = same result. Component **Seed** (42) combines with each node's seed;
  change the volume seed to reroll a layout. Moving the volume changes positions-derived results.

## Performance

- Point count is the cost. Start sparse (PointsPerSquaredMeter 0.01-0.05 for props this size), increase later.
  Check the Dataview count before spawning: thousands of instances of a few props are fine with Nanite (one
  prototype's props measured ~25k tris); millions of points is an editor freeze. The real limit is unique props'
  texture memory (8 GB VRAM, `performance.md` "Budgets").
- Order: sample -> cheap filters (Density Filter) -> Self Pruning -> spawn. Filter before expensive nodes.
- Volume Sampler and Mesh Sampler (Poisson) scale badly; keep volumes tight to the play area.
- GPU path (Beta; GPU spawner Experimental): runtime-only instances, no collision/navigation/HLOD. **Don't use.**
- Each graph change regenerates in the editor; keep volumes small while iterating.

## PCG Editor Mode (Experimental, optional)

- Modes dropdown > **PCG**. Tools: **Draw Spline** (things along a spline), **Draw Spline Surface** (fill a closed
  area), **Paint** (raycast placement like Foliage mode, Shift erases), **Volume** (draw a PCG volume).
- Tool graphs ship in `/PCG/EdMode/` (`DrawSpline/SpacingTool`, `SplineMeshTool`, `Paint/PlaceTool`,
  `Volume/ScatterTool`, `DrawSplineSurface/AreaTool`). A graph appears in a tool only if its Compatible Tool Tags
  are set. Empty tool list = Editor Preferences > PCG Editor Mode Settings > Reset To Defaults.
- Useful for the director to hand-paint clutter with our props; the agent doesn't drive it.

## Where Epic's graphs live (on disk; content path in brackets)

- `Engine/Plugins/PCG/Content/SampleContent/` [`/PCG/SampleContent`]: SimpleForest (+ WorldRayHits variant),
  HiGenForest, MeshSockets, SpawnPointsFromPoints, Grammar, FlatnessDetection (each with a `.umap`).
- `Engine/Plugins/PCG/Content/GraphTemplates/`: `TPL_Sampler_Spline`, `TPL_Sampler_SplineInterior`,
  `TPL_Sampler_Volume`, `TPL_Sampler_CollisionData`, `TPL_Showcase_SimpleForest`, ...
- `Engine/Plugins/Experimental/PCGPrimitives/Content/` [`/PCGPrimitives`]: `Examples/Basics/` (40+ small graphs:
  `Basics_FilterPointsBasedOnDistanceFrom`, `Basics_SpawnAssetsInsideASquareShape`, `Basics_FillAreaWithFittingAssets`,
  `Basics_SpawnAssetsAlongSpline_as_a_Tool`, `Basics_WireParameterToAssetArrayPin`...), `Examples/Forest|Park|Road|
  Utilities/` (`Scatter_points_onto_Mesh_Actor`, `Asset_grid_with_Frame`), `Primitives/` (Fill_, Filter_, Place_,
  Spawn_Assets, Transform_Jitter...), `Instants/` (Place_AlongSpline, SnapTo, AlignTo, Spline_ProjectToSurface).

## Epic's PCG skills (rules extracted from the .uasset text, `PCGToolset/Content/Skills/`)

Skills: `Skill_PCGGraphGeneration`, `Skill_InstantLevelOperations`, `Skill_PCGInstancingOnMeshActor`,
`Skill_PCGShapeGrammarDefinition`, `Skill_PCGAssetZoo`, `Skill_PCGBiomeCore`, `Skill_PCGBiomeCoreRefinement`,
`Skill_PCGMeshPartition` (needs Mesh Terrain; skip). They are Blueprint assets (`UAgentSkill`); the graph skill
fills `{Subgraphs}`, `{Nodes}`, `{Examples}`, `{Instant Graphs}` at load time from the folders above.

**Skill_PCGGraphGeneration rules:**
- Prefer **primitive nodes** (subgraphs, `AddSubgraphNode`, `GetGraphSchema`) over native nodes
  (`AddNode`, `GetNativeNodeSchema`); native only when asked or no primitive fits.
- Reuse before rebuilding: existing graph fits -> `SpawnGraphInstance` with overrides; close -> duplicate then edit
  (the skill says `DuplicateGraph`, which PCGToolset does not expose: use the editor toolset's asset `duplicate`).
- Workflow: load several example graphs (always some `Basics_*`) -> gather schemas -> `open_editor_for_asset` ->
  build (params set in the `AddNode` call, not a later `UpdateNode`) -> parameterize -> spawn -> execute.
- Every asset/mesh choice is a **graph parameter**, wired via a **Get Graph Parameter** native node into the
  target's parameter pin (never into the In pin; no inline binding through `UpdateNode` JSON).
- Asset-array params: `type: "SoftObjectPath"` + `containerType: "Array"`. Not `Object`/`SoftObject` (overrides
  fail with `PropertyBagMissingObject`). Verify with `GetGraphSchema`. Pattern: `Basics_WireParameterToAssetArrayPin`.
- Attribute names must match explicitly between nodes (`OutputAttributeName` -> downstream `InputSource`);
  unnamed outputs are called `None`.
- Node comments: real newlines, not `\n` escapes; verify with `GetNodeInfo`.
- **On errors after `ExecuteGraphInstance`: do NOT auto-fix** ("error messaging is not reliable"); report to the
  director with suggested fixes and wait.
- One graph per session unless asked; prefer programmatic (scripted) tool calling for whole-graph builds;
  no screenshot feedback loops unless asked.

**Skill_PCGInstancingOnMeshActor:** Poisson can explode on big/scaled meshes. Measure target (bounds x world
scale) and asset bounds, derive `Scale_offset` from the ratio, start `Percent_Size_limit_for_sampling` 0.5,
random Z rotation 180, tune density in order: lower Percent_Size_limit -> raise Max_Points_Per_Mesh -> lower
Sampling_Radius; max 4 iterations.

**Asset paths (both skills):** call `load_asset` on content-browser paths to get the soft path with the
`.AssetName` suffix, e.g. `"/Game/Props/Rock/SM_Rock.SM_Rock"`; pass as plain strings in JSON params.

**Skill_PCGAssetZoo:** lines assets up with `/PCGPrimitives/Examples/Utilities/Asset_grid_with_Frame`; handy
for the director to review a batch of generated props side by side.

## PCGToolset MCP tools (`UPCGToolset`, `UPCGSpatialToolset`)

- Graph: `CreateGraph(Name, Path="/Game/PCG")`, `GetGraphStructure`, `GetGraphSchema`, `SetGraphParams`,
  `RemoveGraphParams`, `GetGraphDescription`, `SetGraphDescription`.
- Instances: `ListGraphInstances`, `SpawnGraphInstance(Graph, Name, Transform, JsonParams)`,
  `ExecuteGraphInstance(PCGVolume)` (returns messages), `Get/Set/ResetGraphInstanceParams`.
- Nodes: `ListNativeNodes(bCommonOnly=true)`, `ListAvailableSubgraphs`, `GetNativeNodeSchema`, `AddNode`,
  `AddSubgraphNode`, `UpdateNode`, `SetNodeComment`, `GetNodeInfo`, `RepositionNode`, `RemoveNode`,
  `ConnectNodePins` (may auto-insert conversion nodes), `DisconnectNodePins`.
- Data: `GetNodeDataView(PCGVolume, Node, PinLabel="Out", AttributeName, StartIndex, EndIndex)`. First call enables
  inspection; re-execute, then read. **Never run it/Execute on two volumes sharing a graph at once: freeze.**
- Comments: `AddCommentBox`, `UpdateCommentBox`, `RemoveCommentBox`. Other: `DrawSpline(ActorLabel, ActorTag,
  bRedraw, bClosedSpline)` (waits for the director to draw). Spatial: `RunPCGInstantGraph(Graph, Params)`
  (fire-and-forget).

## Recipes (node chains; build by adapting the named example)

1. **Scatter props on a mesh floor** (start from `SimpleForestWorldRayHits` or `Basics_SpawnAssetsInsideASquareShape`):
   PCG Volume over the room -> World Ray Hit Query (Ignore PCG Hits) -> Surface Sampler (PointsPerSquaredMeter
   0.02, PointExtents ~ prop half-size) -> Normal To Density + Density Filter (drop slopes/walls) ->
   Transform Points (yaw 0-360, scale 0.8-1.2) -> Bounds Modifier -> Self Pruning (LargeToSmall) ->
   Static Mesh Spawner (Weighted: the director's 3-5 SM_ props, from a graph param).
2. **Props along a path spline** (start from `TPL_Sampler_Spline` / `Basics_SpawnAssetsAlongSpline_as_a_Tool`):
   Get Spline Data (tag `PCG_Path`) -> Spline Sampler (OnSpline, Distance, DistanceIncrement 300-600,
   bProjectOntoSurface on) -> Transform Points (side offset +-200 Y, random yaw) -> Self Pruning -> Spawner.
3. **Fill an area but keep the walkway clear:** recipe 1 into **Difference** (second input = Spline Sampler OnSpline
   of the path with widened bounds, Mode Discrete) -> Spawner. Or Distance to the path points -> Density Filter.
4. **Clusters around anchors:** sparse points (recipe 1, very low density) -> Copy Points with a small radial
   point set -> Transform Points -> Self Pruning -> Spawner (`Basics_SpawnAssetsAroundOtherPoints`).
5. **Quick one-off batch without a graph:** `Skill_InstantLevelOperations` / `RunPCGInstantGraph` with
   `Instant_Place_AlongSpline` or `Instant_Place_SnapTo`.

## Verified against

- Plugin status/defaults: `.uplugin` files under `C:\Program Files\Epic Games\UE_5.8\Engine\Plugins\` (`PCG\`,
  `PCGInterops\PCGGeometryScriptInterop\`, `Experimental\PCGPrimitives\`, `Experimental\Toolsets\PCGToolset\`,
  `Experimental\Toolsets\AllToolsets\`); `<Project>.uproject`.
- Toolset tools/defaults: `...\PCGToolset\Source\PCGToolset\Public\PCGToolset.h`, `PCGSpatialToolset.h`,
  `PCGToolsetSkills.h`, `Private\PCGToolsetSettings.cpp`.
- Skill rules: UTF-16 text inside `...\PCGToolset\Content\Skills\Skill_*.uasset`.
- Node classes/defaults: `...\PCG\Source\PCG\Public\Elements\` (`PCGSurfaceSampler.h`, `PCGSplineSampler.h`,
  `PCGSelfPruning.h`, `PCGStaticMeshSpawner.h`, `PCGWorldQuery.h`, ...), `PCGGeometryScriptInterop\...\PCGMeshSampler.h`.
- ISM default + Nanite HISM->ISM: `...\PCG\Source\PCG\Private\Helpers\PCGActorHelpers.cpp` (~l.131-155),
  `PCGISMDescriptor.cpp`. Seeds: `PCGComponent.h` (Seed = 42), `PCGSettings.h`. Triggers/editing modes: `PCGComponent.h`.
- Sample/template/example graph lists: directory listings of the Content folders above.
- Unverified: exact wiring of SimpleForestWorldRayHits; descriptor collision field name; cooked-build behaviour of
  GenerateOnLoad; recipe numbers (starting points, tune with Dataview).

## Sources (5.8)

- PCG framework hub: https://dev.epicgames.com/documentation/en-us/unreal-engine/procedural-content-generation-framework-in-unreal-engine?application_version=5.8
- PCG overview: https://dev.epicgames.com/documentation/en-us/unreal-engine/procedural-content-generation-overview?application_version=5.8
- PCG Editor Mode: https://dev.epicgames.com/documentation/en-us/unreal-engine/pcg-editor-mode-in-unreal-engine?application_version=5.8
- GPU processing: https://dev.epicgames.com/documentation/en-us/unreal-engine/using-pcg-with-gpu-processing-in-unreal-engine?application_version=5.8
- Development guides: https://dev.epicgames.com/documentation/en-us/unreal-engine/pcg-development-guides?application_version=5.8
- Generation modes: https://dev.epicgames.com/documentation/en-us/unreal-engine/using-pcg-generation-modes-in-unreal-engine?application_version=5.8
- Node reference: https://dev.epicgames.com/documentation/en-us/unreal-engine/procedural-content-generation-framework-node-reference-in-unreal-engine?application_version=5.8
- PCG + LLMs via MCP: https://dev.epicgames.com/documentation/en-us/unreal-engine/working-with-pcg-and-llms-using-unreal-mcp-in-unreal-engine?application_version=5.8
