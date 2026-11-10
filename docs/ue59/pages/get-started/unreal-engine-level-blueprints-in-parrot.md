# Level Blueprints in Parrot

https://dev.epicgames.com/documentation/en-us/unreal-engine/unreal-engine-level-blueprints-in-parrot?application_version=5.9

> Learn how Parrot uses Level Blueprints.

## Level Editor

The first thing you see after opening Parrot is the level editor (-> BlueprintAPI). By default, the project opens the Main Menu map. You can use the default editor layout or customize it. For more information about the level editor in Unreal Engine and how it compares to Unity, see Unity to Unreal Engine Overview (-> unity-to-unreal-engine-overview).

## Level Blueprints

In Unreal, each level or map you make has its own integrated blueprint. It acts as a level-wide event graph, where you can do level-specific setup, trigger level events, and trigger transitions to new levels. Logic implemented in the level blueprint won’t be portable and reusable in other places or levels. For more information, see Level Blueprint (-> level-blueprint-in-unreal-engine).

Parrot uses level blueprints to manage level sequences. For more information, see Sequences in Parrot (-> unreal-engine-sequences-in-parrot).

## Open A Level Blueprint

At the top of the editor viewport, click the **World Blueprint** button and then click **Open Level Blueprint**. This opens the level blueprint for the current level.

[image: Click the World Blueprint button and then click Open Level Blueprint]
