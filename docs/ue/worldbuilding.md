# World building (UE 5.8): decisions and pointers

Most of Epic's world-building pages are hubs; detail lives one level down (to be distilled in the knowledge-base
session). The decisions below already apply.

## Lighting: Lumen only, no baking

- **Decision:** dynamic lighting with **Lumen** (global illumination + reflections) and **Virtual Shadow Maps**.
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

## Splines

- Spline Component / Spline Mesh Component for paths, roads, rails, fences, rivers-as-paths. Subpages: Blueprint Spline
  Components Overview + property references. Logic in C++ per our convention.

## Water

- Water plugin: rivers, lakes, oceans via splines, with buoyancy and Single Layer Water shading; designed to work with
  Landscape. Stability status not stated on the page: treat as **test in a practice run before relying on it**.
  Water is translucent-style shading: not Nanite (see `performance.md`).

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
