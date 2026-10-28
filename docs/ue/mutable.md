# Mutable: runtime customisation (UE 5.8.4)

Read this only when a game needs customisation or variety that the player sees: a character or vehicle creator,
varied enemies, NPCs or customers from shared parts, weapon crafting. Otherwise skip Mutable: a plain character
pipeline is faster. Status: production-ready per Epic's 5.8 announcement, though the 5.8.4 `Mutable.uplugin` still
says Beta and is off by default. Its add-ons (Population, Clothing, Dataflow, grooms) are Experimental. Untested in
the kit's prototypes: give the first round a time box to prove it for the idea.

## What can be scripted (checked against the 5.8.4 headers)

- **By hand in the editor:** the Customizable Object (CO) graph itself. No API adds nodes or links pins (the graph is
  a private editor-only property; node classes are private). Python can only create an empty CO
  (`CustomizableObjectEditorFunctionLibrary.new_customizable_object`) and compile it.
- **From code (C++, Blueprint, editor Python):** everything else: instances, parameters, compile, update, randomise.
- So: build **one template CO** by hand, driven by parameters and Data Table nodes, and let code create the variety.
  Plan the graph-editor time into the round, and have the director build it by hand (the session can create and compile the
  empty CO and drive instances from code).

## Minimal runtime setup (game module needs `CustomizableObject`)

1. `UCustomizableObject* CO = LoadObject<...>(...)`; `UCustomizableObjectInstance* Inst = CO->CreateInstance();`
2. Add a `UCustomizableSkeletalComponent` as a child of the actor's `USkeletalMeshComponent`; call
   `SetCustomizableObjectInstance(Inst)` and `SetComponentName("Body")` (must match the Mesh Component node name in
   the graph). Its members are private in 5.8: doc samples that assign `CustomizableObjectInstance` directly, or use
   the component's `UpdatedDelegate`, don't compile.
3. Set parameters: `SetEnumParameterSelectedOption(Param, OptionName)`, `SetIntParameterSelectedOption` (option
   name, not index), `SetFloat...`, `SetColor...`, `SetBool...`, `SetSkeletalMesh...`, `SetProjector...` (the old
   `SetProjectorValue` calls are deprecated). `SetCurrentState(Name)` for states.
4. `Inst->UpdateSkeletalMeshAsync()`: always async; **nothing applies until it is called**, and it updates every
   actor sharing that instance. Completion with a result: `UpdateSkeletalMeshAsyncResult(delegate)`, whose
   `FUpdateContext` carries `UpdateResult` (`EUpdateResult`; check it, failures call back too). The instance's
   `UpdatedDelegate` only passes the instance, no result.
- Queries for building UIs or randomisers: `GetParameterCount/Name/TypeByName`, `GetEnumParameterNumValues/Value`.
- Save a configuration: `SaveDescriptor` / `LoadDescriptor`.

## Variety

- `SetRandomValues()` / `SetRandomValuesFromStream(Stream)`, or your own logic over the parameter queries when the
  variety must stay readable (built-in randomisation gives no control over combinations).
- **Table node:** a Data Table becomes an enum of options (weapons, outfits, colours). Rows' meshes must share
  layout, LOD count and section count; material instances need the same parent material.
- Skip Mutable Population (Experimental; the wiki calls it discontinued): spawn instances from your own code.
- **Baking:** "Bake Instance" (CO or instance editor) turns a configuration into a normal skeletal mesh with no
  runtime cost (and no runtime change). The fallback when runtime generation causes trouble, and fine for fixed NPCs.

## Building the template (5.8 graph)

- Base Object, a Skeletal Mesh Component node with a **Reference Skeletal Mesh** (mandatory: shown until the first
  update, and the source of data for merged meshes), fed by a Skeletal Mesh Parameter (swap the whole mesh) or
  Object Group > Child Objects (parts), or a Table node.
- Merging parts: Skeletal Mesh Parameters through their **Mutable** pin (round; generated, can be modified) into
  Skeletal Mesh Merge, not the Object pin (triangle; faster, switch only). Check the result under Generated
  Resources.
- Colour: expose the material parameter on the section's pins and connect a Color Parameter (a Color Constant can't
  change at runtime). Recompile after every graph change; Switch nodes may need a refresh after enum changes.
- Useful features: Remove Unseen (clip hidden geometry under clothes), Shape Variations / body morphs with cloth
  refit, Color Patterns and Skin Tone (texture layers), Projectors (decals baked at generation), Material Merging
  (fewer draw calls), Macros (reusable sub-graphs). Height: Skeletal Mesh Reshape, not morphs (morphs don't move
  bones). Mutable never changes animation.

## Performance and packaging

- Updates take "a fraction of a second" on worker threads: never put gameplay-critical changes on them.
- Working memory peaks at ~2x the largest uncompressed texture or mesh (`mutable.WorkingMemory` cvar).
- **States** for a customisation screen: list its parameters as Runtime Parameters, optionally Build Only First LOD
  or Live Update Mode (fast, memory-heavy); use a plain state in play.
- Packaging compiles COs at cook (max optimisation): package early. Child COs aren't packaged; source references are
  editor-only. Profile with the CO editor's Performance Analyzer or Unreal Insights.

## Jam rules

- The plugin is engine tooling: COs built during the jam from generated or made parts are the game's own content.
- Learn the patterns from Epic's docs and tutorials (below); never build the game on a sample project (rule 7(d): no
  obvious extension of an Epic tutorial).

## References

- Mutable wiki (the real manual; use its 5.8 pages, not the "(v5.5)" ones):
  https://github.com/anticto/Mutable-Documentation/wiki (Using-Mutable-from-Code, Table, States, Baking-Instances,
  Packaging-Projects, Resource-Usage, FAQ).
- 5.8 tutorials: Simple Customizable Object
  https://dev.epicgames.com/community/learning/tutorials/WbGX/unreal-engine-mutable-simple-customizable-object and
  Merging Skeletal Meshes https://dev.epicgames.com/community/learning/tutorials/VxO6/unreal-engine-mutable-merging-skeletal-meshes.
  Older (5.5) tutorials on the hub: https://dev.epicgames.com/community/learning/tutorials/yjw9/unreal-engine-mutable-tutorials
- Epic's 5.8 docs page is a stub pointing to the wiki; the C++ page exists for 5.7:
  https://dev.epicgames.com/documentation/unreal-engine/using-mutable-from-cplusplus-in-unreal-engine?application_version=5.7
- Headers: `Engine/Plugins/Mutable/Source/CustomizableObject/Public/MuCO/` (`CustomizableObject.h`,
  `CustomizableObjectInstance.h`, `CustomizableSkeletalComponent.h`, `CustomizableObjectSystem.h`).
