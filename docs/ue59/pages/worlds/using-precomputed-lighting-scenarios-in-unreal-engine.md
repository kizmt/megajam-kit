# Precomputed Lighting Scenarios

https://dev.epicgames.com/documentation/en-us/unreal-engine/using-precomputed-lighting-scenarios-in-unreal-engine?application_version=5.9

> An overview of using multiple lighting setups for a single scene.

[image: Precomputed Lighting Scenarios]

**Unreal Engine** has support for using different **Precomputed Lighting Scenarios** in levels. This allows a single level to store and display multiple lighting setups, giving you the flexibility of dynamic lighting, but at the fixed cost of pre-computed lighting.
Having the ability to change between different Precomputed Lighting Scenarios is of particular importance for Virtual Reality (VR) or Architectural Visualization projects that require high quality renderings with the benefits of fast performance measures.
As you read through this reference, you'll learn how to use Precomputed lighting in your projects.

 [image: Day Scenario]

 [image: Night Scenario]

In the above image; the Directional Light, Sky Light, and Skybox have been placed in a Lighting Scenario level called **Day Scenario**. The Spotlights for the streetlights have been placed in a different Lighting Scenario level called **Night Scenario**.

## Feature Limitations

While Precomputed Lighting scenarios have a lot of advantages, there are some disadvantages and limitations that you'll need to be aware of while using them. In the following section, you'll go over some of these limitations and how you can avoid (or work around) them.

- Only one Lighting Scenario level should be visible at any time in a game.
- When a Lighting Scenario level is present, Lightmap data from all Sublevels will be placed inside of it so that only the Day Scenario Lightmaps are loaded when it's daytime. As a result, Lightmaps will no longer be streamed by Sublevels.
- Sublevel Lightmap data is stored in the Lighting Scenarios BuiltData package. Registering Reflection Captures from other Sublevels modifies the active lighting scenario's BuiltData. Loading a sublevel twice and only loading a lighting scenario's BuiltData once will produce the following error: C++ ```
Error: Reflection capture /Game/Environments/Levels/Your_Level_Name.level_name:PersistentLevel.SphereReflectionCapture_1.NewReflectionComponent uploaded twice without reloading its lighting scenario level.
``` Error: Reflection capture /Game/Environments/Levels/Your_Level_Name.level_name:PersistentLevel.SphereReflectionCapture_1.NewReflectionComponent uploaded twice without reloading its lighting scenario level.The Lighting scenario level must be loaded once for each time the reflection capture is uploaded.

## Using Lighting Scenarios

To use Lighting Scenarios in your project, you will need to do the following:

- First go to **Window** > **Levels** to open up the **Levels Manager**.[image: Open Levels Manager window]
- With the **Levels Manager** open, right-click on a Sub level in the **Levels** menu, go to **Lighting Scenario**, and select the **Change to Lighting Scenario** option to make the level a **Lighting Scenario** level.[image: Changing Level Lightning Scenario option]When a **Lighting Scenario** level is visible, its Lightmaps will be applied to the world.
- Make sure the Level Streaming method is set to Blueprint by right-clicking on the Sublevel, going to **Change Streaming Method**, and selecting **Blueprint** (if it's not already selected).[image: Selecting Level Streaming Method option]
- Now place any light or Static Meshes (-> static-meshes) your project needs into either of the lighting levels and then build each level's lighting as you would with any other level.[image: Building Lightning of the Level]
- Once the lighting has finished building, open up the Blueprint of the **Persistent Level** and then add a **Load Stream Level (by name)** node, connecting it to the **Event Begin Play** node.[image: Add Load Stream Level node]
- Connect the **Event Begin Play** node to the **Load Stream Level** node and then input the name of the Level you want to load. Also, make sure to check both **Make Visible After Load** and **Should Block on Load** to make sure you can see the newly loaded level.[image: Adjust Blueprint script for streaming]
- Press the **Play** button to launch the project and when the first level loads, it should now be using the Day level lighting. To use Night level lighting, you can use the same setup, but you'll need to change the level name to your night time level (instead of the day time level). [image: Day Lighting] [image: Night Lighting]

Although there are some notable limitations, using Precomputed Lighting Scenarios can provide your project with many benefits; such as improved performance and the ability to change to baked lighting (to meet your project's needs).

- rendering
- lighting
- shadows

On this page

- Feature Limitations (-> using-precomputed-lighting-scenarios-in-unreal-engine)
- Using Lighting Scenarios (-> using-precomputed-lighting-scenarios-in-unreal-engine)
