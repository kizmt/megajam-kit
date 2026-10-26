# World building (UE 5.8): decisions and pointers

Most of Epic's world-building pages are hubs; detail lives one level down (to be distilled in the knowledge-base
session). The decisions below already apply.

## Lighting: dynamic only, no baking (Lumen or not by art style)

- **Decision:** dynamic lighting and **Virtual Shadow Maps**. Lumen GI + reflections for realistic looks; for stylized
  looks no Lumen, with the stand-ins in `lighting.md` "No-Lumen look" (render paths: `performance.md`, SETUP 7b).
  All lights **Movable**. No Lightmass, no "Build Lighting", no Lightmass Importance Volume.
- Why: no bake time, lighting changes show instantly in screenshots (our verification loop), and Epic's Nanite page says
  to disable lightmap UV generation when not baking.
- **Do not follow** the Level Designer Quick Start's baking steps (Lightmass Importance Volume, Build > Lighting Quality,
  Starter Content). That guide predates this workflow.
- Before touching outdoor lighting, load Epic's agent skill: `AgentSkillToolset.GetSkills` ->
  `.../editor_toolset/skills/default_outdoor_lighting_PY.DefaultOutdoorLightingSkill`.
- Outdoor stack (Basic level already has it): Directional Light (Atmosphere Sun Light on), Sky Atmosphere, Sky Light,
  Exponential Height Fog, Volumetric Cloud. Mood comes mostly from sun angle/colour, fog and post-process exposure.
- Keep dynamic shadow-casting lights few (see `performance.md`).
- To verify on the jam project: Project Settings > Rendering: Dynamic GI = Lumen, Reflections = Lumen,
  Shadow Map Method = Virtual Shadow Maps (5.x defaults; confirm, don't assume).

## Blockout and level organisation

- Block out with simple geometry first (boxes, Modeling Mode, Shift+5), test with PIE, then swap in generated props.
  Gameplay space before set dressing.
- Organise actors with Outliner folders (`SceneTools.set_actor_folder`) per area/room: `Lighting/`, `Gameplay/`,
  `Props/<Area>/`, `Audio/`. Layers are for visibility groups (hide other rooms while working).
- Orthographic Top view to check room spacing; exact transforms in Details (or via MCP).

## PCG (procedural placement)

- Use for **rule-based** placement: scattering props/rocks/vegetation, filling an area, along a path. Not for one-off
  hero placement (place those directly).
- PCG via MCP is **Experimental**. Epic's agent workflow (mandatory for us):
  1. Load `PCGToolset` and **`Skill_PCGGraphGeneration` first** (without it the agent misreads concepts).
  2. Find a similar example graph (PCG plugin SampleContent, project graphs) and adapt it; build new only if none fits.
  3. Scott selects the assets/actors to use in the editor; don't let the agent search broadly.
  4. Plan / list nodes to change before executing; execute in small steps; supervise.
  5. Use **Dataview** to inspect generated point attributes (the agent can't read them directly).
  Other skills: `Skill_InstantLevelOperations` (quick batch placement without a graph: try first for simple jobs),
  `Skill_PCGShapeGrammarDefinition` (modules along a spline), `Skill_PCGInstancingOnMeshActor` (surface detail).
- Pairs with our pipeline: generate 4-6 props, then let PCG dress the level with instanced copies (cheap, see `performance.md`).

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
  packaged build early. Most jam games should not.

Judge it in the 60-second video: if the extra scale doesn't show there, cut it.

## Splines

- Spline Component / Spline Mesh Component for paths, roads, rails, fences, rivers-as-paths. Subpages: Blueprint Spline
  Components Overview + property references. Logic in C++ per our convention.

## Water

- Water plugin: rivers, lakes, oceans via splines, with buoyancy and Single Layer Water shading; designed to work with
  Landscape. Stability status not stated on the page: treat as **test in a practice run before relying on it**.
  Water uses its own Single Layer Water shading model (not ordinary translucency); Nanite compatibility unverified
(see `materials.md`, `performance.md`).

## Sources (5.8)

- Level Designer Quick Start: https://dev.epicgames.com/documentation/en-us/unreal-engine/level-designer-quick-start-in-unreal-engine?application_version=5.8
- Level Editor: https://dev.epicgames.com/documentation/en-us/unreal-engine/level-editor-in-unreal-engine?application_version=5.8
- Lighting: https://dev.epicgames.com/documentation/en-us/unreal-engine/lighting-the-environment-in-unreal-engine?application_version=5.8
- PCG: https://dev.epicgames.com/documentation/en-us/unreal-engine/procedural-content-generation-framework-in-unreal-engine?application_version=5.8
- PCG + LLMs via MCP: https://dev.epicgames.com/documentation/en-us/unreal-engine/working-with-pcg-and-llms-using-unreal-mcp-in-unreal-engine?application_version=5.8
- Splines: https://dev.epicgames.com/documentation/en-us/unreal-engine/blueprint-splines-in-unreal-engine?application_version=5.8
- Water: https://dev.epicgames.com/documentation/en-us/unreal-engine/water-system-in-unreal-engine?application_version=5.8

## Next level down (knowledge-base session)

Lumen overview + technical details, Virtual Shadow Maps, light mobility, environment lighting (fog/sky/clouds),
post-process & exposure, PCG Overview / Editor Mode / Development Guides, Spline Components Overview, Water Body Actors.
