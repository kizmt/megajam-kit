# World building (UE 5.8): decisions and pointers

Most of Epic's world-building pages are hubs. The decisions below apply; detail lives in `lighting.md`, `pcg.md`,
`procedural-assets.md` and `materials.md`. Scripted landscapes, World Partition, foliage and the Water plugin have
their own sections below.

## Lighting: dynamic only, no baking (Lumen or not by art style)

- All lighting rules (render path, outdoor stack without a VolumetricCloud, the outdoor-lighting agent skill) live in
  `lighting.md`; the render path and its settings are SETUP.md step 7b and `performance.md` "Render paths". Skip the Level Designer Quick Start's baking steps.

## Blockout and level organisation

- Block out with simple geometry first (boxes, Modeling Mode, Shift+5), test with PIE, then swap in generated props.
  Gameplay space before set dressing.
- **Script-built blockout needs simple collision**, proven by a downward trace before building nav
  (`editor-scripting.md` section C).
- Organise actors with Outliner folders (`SceneTools.set_actor_folder`) per area/room: `Lighting/`, `Gameplay/`,
  `Props/<Area>/`, `Audio/`. Layers are for visibility groups (hide other rooms while working).
- Orthographic Top view to check room spacing; exact transforms in Details (or via MCP).

## PCG (procedural placement)

- Use for **rule-based** placement: scattering props/rocks/vegetation, filling an area, along a path. Not for one-off
  hero placement (place those directly).
- PCG via MCP is **Experimental** and follows Epic's supervised agent workflow (load `Skill_PCGGraphGeneration`
  first, adapt an example graph, the director picks the assets, small supervised steps, inspect with Dataview): the full
  workflow, skills, tools and recipes are in `pcg.md`.
- Pairs with our pipeline: generate 4-6 props, then let PCG dress the level with instanced copies (cheap, see `performance.md`).

## Foliage and landscape grass (5.8.4, from the rehearsal)

Nanite settings for plants (Voxelize vs Preserve Area, wind): `performance.md` "Geometry".

- **`GrassDensity` is instances per 100 m² (10 m × 10 m), not per 10 m²** as the `FGrassVariety` header comment says:
  the engine divides the component area in cm² by 1000 × 1000 (`LandscapeGrass.cpp`). A field set for 3 patches per m²
  at 18 / 12 / 0.8 came out 10× too sparse; 180 / 120 / 8 gave the carpet. Check the result with `grass.PrintStats` or
  a capture, not the number.
- **A texture that feeds `LandscapeGrassOutput` must be `never_stream`** (or small enough to stay resident). The grass
  map build streams in only the heightmap and weightmaps (`LandscapeGrassMapsBuilder.cpp`), so it read a low, blurred
  mip of a 4096² density map: grass grew across a clearing that the ground colour (same sample) showed bare.
  Regenerate with `grass.FlushCache` after the change.
- **Landscape grass can draw in PIE and be missing from every packaged build.** A cooked build takes each landscape
  component's grass types from the saved package; the editor refreshes them in memory every tick without dirtying
  the package, and PIE copies the in-memory world, so it hides the fault. Proven in the rehearsal: the World
  Partition proxies were saved before the landscape material got its `LandscapeGrassOutput`, and 0/90 proxy packages
  referenced the grass type. After adding or changing a `LandscapeGrassOutput` or the grass types: load every
  landscape proxy, `Modify()` and save it (or Build > Build Grass Maps, then save), and check one packaged build for
  grass. The editor also saves grass-map data into the proxies (+0.8 MB each); the cook strips it under runtime
  generation, and the zip size didn't change.
- **Reading placed foliage from Python doesn't work in a World Partition level:**
  `InstancedFoliageActor.get_instance_transforms(ft)` returned 0 transforms while the components held hundreds.
  Reading each `FoliageInstancedStaticMeshComponent` works (`c.get_instance_transform(i, True)`), but components don't
  name their foliage type, and types that share a mesh can't be told apart. So to move foliage, re-run the script that
  placed it (`remove_all_instances` + `add_instances` from its own data); give each placement script its own foliage
  types so a re-run never touches another script's instances.

## Ambition on a budget: making a small game feel big

Ambition and Innovation is judged, but the jam is four days and rule 1 (small scope) stands. Ambition reads from what
the player *sees and does*, not from how many square metres exist. Cheapest first:

- **A world beyond the playable space.** Keep play in one space and show a big world past its edges: a view through a
  window or over a wall, distant silhouettes (low-poly meshes or cards, no collision, no shadows), layered height fog
  for depth, a strong sky. Large backdrop meshes can break Lumen's sky occlusion: see `lighting.md` (keep backdrops
  reasonably sized, or out of Lumen).
- **Scale contrast.** A small player next to one huge structure (a statue, a gate, a machine) reads as epic for the
  cost of one asset. Verticality (looking up or down a shaft) does the same.
- **One set piece.** A single scripted moment (a collapse, a reveal, a boss entrance) with Sequencer
  (`cinematics-video.md`) does more for ambition than a larger map. It also gives the trailer its best shot.
- **Density by instancing.** PCG and instanced meshes fill space cheaply (`pcg.md`); generated kit pieces
  (`procedural-assets.md`) assembled as Level Instances or Packed Level Actors make many rooms from few meshes.
- **Ambition in the mechanic.** A novel verb, a system that reacts to the player, or AI powering a system in the game
  (rules 7(a) allow it) can score as Innovation with no extra world at all.
- **Only if the game truly needs an open space:** World Partition (streaming grid, One File Per Actor), HLODs for
  distant cells and Level Instances. Know they exist; budget at least a day of the jam if you use them, and test the
  packaged build early. Most jam games should not. Scripting traps: "World Partition from Python" below; test
  traps (unsaved scripted moves, streaming round the view target, the runtime grid not in Python): `editor-scripting.md`
  and `debugging.md` F.

Judge it in the 60-second video: if the extra scale doesn't show there, cut it.

## Foliage

- **Changing a foliage type's collision doesn't reach placed foliage.** Setting BlockAll on
  `FoliageType_InstancedStaticMesh.body_instance` left existing instances without collision:
  `FFoliageInfo::UpdateComponentSettings` (InstancedFoliage.cpp) only copies body-instance properties, creates no
  physics bodies for components that were NoCollision, and doesn't dirty the foliage actors. Fix:
  `InstancedFoliageActor.remove_all_instances` + `add_instances` for that type, then save the level.
- **Wind on fine foliage blurs at 4K under TSR**: fade it out near the camera in the material and decide at the style
  lock which plants move (`performance.md` "Render paths").

## Splines

- Spline Component / Spline Mesh Component for paths, roads, rails, fences, rivers-as-paths. Subpages: Blueprint Spline
  Components Overview + property references. Logic in C++ per our convention.

## Landscape from Python (5.8.4, from the rehearsal)

- **Python can spawn a `Landscape` actor but can't import heights into it** (no exposed `Import`). A tiny
  editor-module C++ function library that calls `ALandscape::Import` with raw uint16 heights and per-layer uint8
  weights does it in one call (read the exact 5.8.4 signature in `Landscape.h` before writing it).
- **Author the fields outside the editor.** The editor's Python has no numpy. Generate heights and layer weights with
  numpy in Blender's bundled Python, write raw files, read them in the editor with `array` (`PIPELINE.md`).
- **World Partition:** after the import call `ChangeGridSize(LandscapeInfo, n)`, or the landscape stays one
  unstreamed actor (n = 2 components per proxy gave 56 proxies of 254 m). See "World Partition from Python".
- **Carving roads into the heightfield:** don't carve by "distance to the nearest route segment": where two parts of a
  route at different heights pass close (a hairpin, a switchback), it makes steps (8 m seen). Carve the route in
  sequential chunks, each blending over the previous result, and blend a keyed path height into the natural ground
  over ~60 m.
- **Carving streams with a fall:** carve each reach on its own side of the fall. Carved by distance to the whole
  stream line, the gentle valley below shaved the brink above into a ramp. Keep the higher ground under a "hanging
  valley" mask, clipped to behind the lip's cross line (or it leaks into the pool below and makes it shallower).
- **Verify every carve:** compute the largest height step between neighbouring cells along the route (the rehearsal
  checked max |dH| per 50 cm cell; after the chunked carve no step was over 3 m).
- **"N Landscape actors with physical materials need to be rebuilt"** appears after any landscape material change or
  re-import (it compares a per-component material hash, `Landscape.cpp` `UpdatePhysicalMaterialTasksStatus`). With no
  Landscape Physical Material Output node in the material the rebuild has nothing to bake: it only updates hashes and
  dirties the proxies.
- Water bodies can dig into the landscape (`affects_landscape`): see "Water".

## World Partition from Python (5.8.4, from the rehearsal)

Only for a game that truly needs an open space (see "Ambition on a budget").

- **Create:** `LevelEditorSubsystem.new_level(path, is_partitioned_world=True)` makes a WP map (and its HLOD layer
  assets). Open or create a map in its own `run_python` call; work in that map in the next call.
- **Opening a WP level from a script loads none of its streamed actors.** After `load_level` only the always-loaded
  actors exist (103 of 290 in the rehearsal: water bodies, walls and props were missing). Load them before counting,
  editing or capturing anything:
  ```python
  wpl = unreal.WorldPartitionBlueprintLibrary
  wpl.load_actors([d.guid for d in wpl.get_actor_descs() if d.is_spatially_loaded])
  ```
  The "No Loaded Region(s)" banner stays, but every actor is in the outliner and the viewport. Filter the descs by
  `bounds` to load one region. It happens again after every editor reopen. Level and capture scripts should count the
  loaded spatially loaded descs first and either load them or refuse with "World Partition: N of M actors loaded".
- **Unloaded cells look broken, not missing:** captures show the editor's coarse HLOD stand-ins (props as shards,
  buildings as blobs). It looks like a Nanite or streaming-pool problem and is not (raising
  `r.Nanite.Streaming.StreamingPoolSize` changed nothing). Load the actors.
- **Always-loaded actors:** the light stack, the water zone and ocean, and landmarks seen from far need
  `actor.set_editor_property("is_spatially_loaded", False)`, or they stream out.
- **Far views:** the default runtime grid streams cells only within 256 m, and a landscape HLOD is a coarse 256 px
  bake, so a walk built on far reveals (a town seen from a crest) loses them. Setting `is_spatially_loaded = False`
  on every `LandscapeStreamingProxy` keeps the landscape loaded; statics can stay streamed with HLODs. Measure the
  memory cost. Runtime grid ranges are not editable from Python in 5.8.4.
- **Copying actors between levels:** select them, console `EDIT COPY` (the clipboard gets T3D; check it with
  PowerShell `Get-Clipboard`), open the target map, `EDIT PASTE`. To copy a whole level, see `editor-scripting.md`
  (Levels row).

## Foliage from Python (5.8.4)

- Create a `FoliageType_InstancedStaticMesh` (factory `FoliageType_InstancedStaticMeshFactory`, property `mesh`),
  then `InstancedFoliageActor.add_instances(world, ft, transforms)` / `remove_all_instances(world, ft)`.
- Collision on the type's `BodyInstance`: `set_editor_property("collision_profile_name", ...)` and
  `collision_enabled` (there is no `set_collision_profile_name` in Python).
- Thin grass goes black against the sun with Default Lit: `materials.md` "Lessons". Thin Nanite leaves vanish at
  distance: `performance.md` "Geometry".

## Water (Water plugin: Experimental in 5.8.4)

`Water.uplugin` has `IsExperimentalVersion: true`, so `features.md` rules apply (practice run, packaged build,
fallback). Rivers, lakes and oceans come from splines, with buoyancy and the Single Layer Water (SLW) shading model
(not ordinary translucency). Nanite compatibility unverified (Nanite takes only Opaque/Masked materials:
`performance.md` "Geometry"). The rehearsal built a sea, rivers, lakes and a waterfall entirely from Python; the
facts below are from it (proven unless marked). Perf: the water's own cost was not isolated.

### How the water zone draws (read first: it explains most artefacts)

- A `WaterZone` renders its bodies from a **water info texture** (2 m texels for a 4 km zone at 2048). Inside a
  body's spline ribbon the surface comes from the spline (smooth); outside it, from the texels (2 m steps).
- Every body also draws a dilated **skirt** into the water info: `shape_dilation`, default 4096 cm, past both ends and
  both sides. It is a top-down depth pass, so the highest skirt wins; where a skirt is above the ground,
  `WaterInfoMerge.usf` squashes it to 64 cm under the ground.
- The zone redraws the texture only when bodies change. `zone.call_method("ForceUpdateWaterInfoTexture")` redraws it
  (it does not rebuild bodies).
- **Scripted spline and width edits fire no change event.** Bodies built from Python keep their spawn shape (2 spline
  mesh segments, ~55 m bounds) and draw nothing. `on_water_body_changed(...)` on the actor and the component are
  deprecated **empty functions** in the 5.8 headers, so calling them does nothing. What works is a same-value set
  with forced notify (it runs PostEditChangeProperty -> OnWaterBodyChanged -> UpdateAll, and this property also flags
  the shape as changed; the default notify mode skips a same-value set):
  ```python
  v = comp.get_editor_property("max_wave_height_offset")
  comp.set_editor_property("max_wave_height_offset", v, notify_mode=unreal.PropertyAccessChangeNotifyMode.ALWAYS)
  ```
- Use component-level calls: the actor's `set_water_material` is deprecated too.
- `set_is_temporarily_hidden_in_editor` hides a body's tiles but does not redraw the water info. A hide test tells
  you which body draws an artefact, not whose water info causes it.

### Sea recipe

1. Spawn `unreal.WaterZone`; set `zone_extent`. On its `WaterMeshComponent` set `far_distance_material`
   (`/Water/Materials/WaterSurface/Water_FarMesh`) and `far_distance_mesh_extent`.
2. Spawn `unreal.WaterBodyOcean`; on its component set `ocean_extents` and `affects_landscape` False (on, it dug a
   trench along the spline into the landscape).
3. **Pin the body to its zone:** `comp.set_water_zone_override(zone)`. A body finds its zone by bounds when created
   and can miss it (seen: the zone's `owned_water_bodies` listed the rivers but not the ocean; suspected a destroyed
   zone from a previous run in the World Partition actor descriptors). `FillWaterZoneWithOcean` returns early when
   the ocean has no zone.
4. **Set the coastline spline.** The ocean fills *outside* its spline. The default spline is a closed 200 m square
   around the actor, which cuts a square hole in the sea (it showed the ground below as a dark patch 600 m out).
   Use `get_water_spline()`, `clear_spline_points()`, `add_spline_point(..., unreal.SplineCoordinateSpace.WORLD)`,
   `set_closed_loop(True)`: the real coastline, or a small loop buried under land.
5. `comp.call_method("FillWaterZoneWithOcean")` (a CallInEditor function). Call it again after every spline change:
   only that regenerated the ocean mesh.
6. **In a later `run_python` call:** `zone.call_method("ForceUpdateWaterInfoTexture")`. In the same call as the spawn
   it redraws before the ocean's meshes exist and the sea doesn't render. Then assert the ocean is in
   `zone.get_editor_property("owned_water_bodies")` and capture.
7. **If the zone is bigger than the landscape,** add a flat seabed (a scaled cube with a sea-floor material, no
   collision, no shadow) a little below the landscape's deepest edge, spanning the whole zone. Over the void, depth
   absorption maxes out and the sea draws as a dark band round the island.
8. World Partition: zone and ocean `is_spatially_loaded` False.

Result with no material work: teal shallows, waves and reflections; the terrain's intersection makes the shoreline.
Expected in the log: many "WaterInfoMesh_N has some nearly zero tangents/bi-normals" warnings from the plugin's own
meshes (harmless). **Shallows tint:** the water material's `Absorption` vector is a per-channel distance; the default
(10, 150, 350) made pale sand under shallow water pure cyan, (40, 150, 280) gave a pale teal.

### Rivers and lakes

- After every scripted spline or width edit (`add_spline_point`, `set_river_width_at_spline_input_key`), rebuild with
  the forced-notify set above, then `ForceUpdateWaterInfoTexture` in a later call.
- **A river's width must reach under its banks everywhere.** Where the ribbon stops short of the shore, the edge
  falls back to the 2 m texels and draws a sawtooth waterline with gaps of bare bed. Fit each spline point's width to
  the carved channel (walk out from the centre line until the ground rises above the water level), plus 2-3 m under
  the bank; the terrain then cuts the surface cleanly.
- **Rivers only on gentle grades.** Stretches steeper than ~15% stood up as stepped vertical slabs. A spline that runs
  past a cliff lip hangs over the drop and blends into the pool below as a flat wall. Build falls as meshes.
- **A river that ends at a drop (or runs along a cliff edge): lower `shape_dilation` to 100-300 cm.** With the
  default 4096 cm its skirt spread its level over a pool 26 m below, and the pool's water mesh hugged the steep walls
  as translucent "flames" up to 8 m high (at 300 cm two small peaks were left; at 100 cm none). Start the lower
  pool's spline a few metres clear of the river's end, then `ForceUpdateWaterInfoTexture`.
- **Lakes:** the spline ring must run counter-clockwise: a clockwise ring drew no water (reverse the points if the
  ring's signed area is negative).
- **Lake waves are ocean-sized by default:** the factory copies `WaterEditorSettings.WaterBodyLakeDefaults`
  (`/Water/Waves/GerstnerWaves_Lake`, max wave 508 cm), and `WaterWavesAssetReference.water_waves_asset` is private.
  Build waves in Python instead:
  ```python
  gw = unreal.GerstnerWaterWaves(outer=lake, name="LakeWaves")
  gen = gw.get_editor_property("gerstner_wave_generator")   # GerstnerWaterWaveGeneratorSimple: set its fields
  # ... e.g. 8 waves, 1.5-9 m long, 0.4-3 cm high (gave a calm lake, max 11.5 cm)
  gw.set_editor_property("gerstner_wave_generator", gen, notify_mode=unreal.PropertyAccessChangeNotifyMode.ALWAYS)
  lake.set_water_waves(gw)   # the ALWAYS set triggers RecomputeWaves
  ```

### Waterfalls and custom bodies

- **A `WaterBodyCustom` used as falling or decorative water turns the screen underwater** anywhere below its top and
  inside its collision (seen 10 m out from a fall and 4 m above its pool). The underwater check
  (`UWaterSubsystem::ComputeUnderwaterPostProcess`) sweeps for water-body collision, then compares the view height
  with the body's level, which is its top; the collision is the FBX import's auto convex hull, covering the space
  under the arc. Fix on the `WaterBodyCustomComponent` (the mesh copies the component's collision on every update, so
  setting it on the mesh does not stick): `set_collision_enabled(NO_COLLISION)`,
  `set_collision_profile_name("NoCollision")`, `underwater_post_process_settings.enabled = False`,
  `set_underwater_post_process_material(None)`, then rebuild with the forced-notify set.
- **The plugin's river materials don't work on a plain mesh.** `Water_Material_River` and its static-mesh variant
  `Water_Material_River_LOD` both showed nothing on a fall sheet (the main one also drew a black blob), and their
  colour comes from depth over the bed anyway. Make a separate translucent material and match the river's colour by
  measuring captures. Foam and spray overlays: `materials.md` "Scripted materials" (DepthFade over SLW, foam cut).

### Judging water in captures

- **Water in a cliff's shadow reads as "missing water":** SLW in shade went near-black, the tone of the wet bed. Check
  with shadows off before rebuilding anything; in a gorge, plan fill light or a water colour that holds in shade.
- **Straight after a water rebuild, a capture can show the underwater post process** (seen with the camera 3.5 m above
  a river; cause suspected: collision or water info not settled). Wait a few seconds or capture twice before judging;
  `r.Water.EnableUnderwaterPostProcess 0` confirms it.

### Querying water in gameplay code

- **"Is this point in the water?" needs your own containment test** (read on disk, 5.8.4).
  `UWaterBodyComponent::TryQueryWaterInfoClosestToWorldLocation` (`WaterBodyComponent.cpp`) gives the surface z at the
  closest spline key (or the component's z for a flat body), i.e. depth, but never checks the river's width or the
  lake's shore. A river's half width is `RiverWidth.Eval(key) / 2`: `RiverWidth` is the **full** width, despite the
  header's "from center in each direction" (`WaterBodyRiverComponent.cpp` halves it). For a lake, test the closed
  spline as a polygon.
- Iterate bodies with `FWaterBodyManager::ForEachWaterBodyComponent(World, ...)` (`WaterBodyManager.h`). C++ use
  needs `"Water"` in the Build.cs and the Water plugin listed in the `.uproject` (it may only be mounted as another
  plugin's dependency). Water bodies stream with World Partition like any actor: re-collect them, don't cache them
  once at BeginPlay. In Python, `get_water_body_type()` is on the `WaterBody` actor, not its component.

## Sources (5.8)

- Level Designer Quick Start: https://dev.epicgames.com/documentation/en-us/unreal-engine/level-designer-quick-start-in-unreal-engine?application_version=5.8
- Level Editor: https://dev.epicgames.com/documentation/en-us/unreal-engine/level-editor-in-unreal-engine?application_version=5.8
- Lighting: https://dev.epicgames.com/documentation/en-us/unreal-engine/lighting-the-environment-in-unreal-engine?application_version=5.8
- PCG: https://dev.epicgames.com/documentation/en-us/unreal-engine/procedural-content-generation-framework-in-unreal-engine?application_version=5.8
- PCG + LLMs via MCP: https://dev.epicgames.com/documentation/en-us/unreal-engine/working-with-pcg-and-llms-using-unreal-mcp-in-unreal-engine?application_version=5.8
- Splines: https://dev.epicgames.com/documentation/en-us/unreal-engine/blueprint-splines-in-unreal-engine?application_version=5.8
- Water: https://dev.epicgames.com/documentation/en-us/unreal-engine/water-system-in-unreal-engine?application_version=5.8

