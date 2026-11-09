# Geometry Collections User Guide

https://dev.epicgames.com/documentation/en-us/unreal-engine/geometry-collections-user-guide?application_version=5.9

> Overview of the authoring process for Geometry Collections.

[image: Geometry Collections User Guide]

You can find similar information in video format in the Epic Developer Community site by watching the Chaos Destruction - Geometry Collections tutorial.

Destruction within the Chaos system starts with a **Geometry Collection** Asset. These assets can be built from one or more Static Meshes, Blueprints with Static Mesh components, and even other Geometry Collections.

Once you have a Geometry Collection, you can break it apart using the Fracture Mode (-> destruction-overview) and define the settings that determine how it breaks apart.

In this guide you will learn how to create Geometry Collections from different source objects that can be used with the Chaos Destruction system, as well as best practices for ensuring the best simulation results.

## Create Geometry Collections

### Create Geometry Collection Assets

Follow these steps to create a Geometry Collection asset.

- Select a compatible Actor in the scene, click the **Mode** dropdown and select **Fracture**. [image: Select the Fracture mode from the Select Mode dropdown] This will open the **Fracture Mode** windows that contain all the tools for fracturing your mesh. Alternatively, you can press **Shift-6** to switch to the Fracture Mode. Click for full view.

- In the **Generate** section, click **New** to create a new **Geometry Collection**. [image: Click New to create a new Geometry Collection] This asset type will be saved in the Content Browser and will be used to create your fractured mesh. (1) Select the directory location where the Geometry Collection will be saved.

- (2) Enter the name for the Geometry Collection asset.

- (3) Click Create Geometry Collection. [image: Select the directory location, enter a name for your asset and click Create Geometry Collection]

- Click Save All in the Content Browser to save the new Geometry Collection asset. [image: Click Save All in the Content Browser to save the new Geometry Collection asset]

- The Actor you selected in the scene is replaced with the Geometry Collection in the level. [image: The Static Mesh is replaced with the Geometry Collection in the level]

These steps can be used to create Geometry Collections from any combination of assets.

### Create a Geometry Collection from Static Meshes

You can create Geometry Collections by combining any number of Static Meshes in your Level.

When creating Geometry Collections from a single Static Mesh, select a Static Mesh Actor and follow the steps mentioned above. The selected Static Mesh Actor will be replaced by the new Geometry Collection in the level.

 [image: The Static Mesh is replaced with the Geometry Collection in the level]

Geometry Collections can be created from any combination of Static Meshes. Select multiple Static Mesh Actors in the Level and follow the steps detailed in Create Geometry Collection Assets.

When selecting multiple Static Meshes, the first selected Actor is used to create the Geometry Collection's pivot point.

 [image: The Static Meshes are replaced with the Geometry Collection in the level]

### Create a Geometry Collection from a Blueprint Actor

You can create Geometry Collections by combining **Blueprint Actors** that have one or more **Static Mesh components**. Their Static Mesh components are treated as regular Static Meshes when converted to a Geometry Collection.

The example below is a Blueprint Asset that has two Static Mesh components.

Click for full view.

You can convert a Blueprint Asset to a Geometry Collection by dragging it into the Level and following the steps in Creating Geometry Collections.

Click for full view.

You can also combine Blueprint Actors with Static Meshes or other Blueprint Actors by selecting them and following the steps in Create Geometry Collection Assets.

 [image: The Blueprint and Static Mesh are replaced with the Geometry Collection in the level]

### Create a Geometry Collection from other Geometry Collections

You can create new Geometry Collections from other Geometry Collections following the same process. Drag one or more Geometry Collection Assets into the Level, select them and follow the steps in Creating Geometry Collection Assets.

Click for full view.

## Fracture Geometry Collections

Now that you have a Geometry Collection, you can break it apart using the Fracture Mode (-> destruction-overview). This mode contains different types of fracture methods, as well as methods of clustering and editing fractured pieces.

In this guide you will use the standard **Uniform Voronoi** method. With this method you define a minimum and maximum number of sites to create cell volumes for fracturing. For more details about the various fracturing methods available read the Fracturing Geometry Collections User Guide (-> fracturing-geometry-collections-user-guide).

Follow these steps to fracture a Geometry Collection:

- Select a Geometry Collection in the Level, click the **Mode** dropdown and select **Fracture**. [image: Select the Fracture mode from the Select Mode dropdown] Click for full view.

- Go to the **Fracture** section and click the **Uniform** fracture button. [image: Click the Uniform fracture button]

- Leave the default settings as they appear and click **Fracture**. [image: Click Fracture] You can learn more about the fracturing process by referring to the Fracturing Geometry Collections User Guide (-> fracturing-geometry-collections-user-guide) tutorial.

- Select the **Geometry Collection** and move it above the ground. Click the **Play Mode options** button and select **Simulate** or **Selected Viewport** to see the results. [image: Click Simulate from the Play Modes option menu]

The Geometry Collection fractures on impact.

 [image: The column falls to the ground and fractures on impact]

## Change the Materials of Geometry Collections

Now that you know how to fracture Geometry Collections, you might want to change how the fractured pieces look for the external and internal surfaces.

- Follow these steps to show the Geometry Collection with its original Materials: Select a Geometry Collection and use the Level **Details** panel.

- In the **Chaos Physics** section, expand the **General** options.

- **Deselect** the **Show Bone Colors** checkbox. [image: Show bone colors] [image: Do not show bone colors]

- In the **Materials** section, each original Material ID has been duplicated from the source Asset. In the example below, **Element 1** and **Element 3** have been duplicated from **Element 0**, and **Element 2** to represent the internal surfaces when you created the Geometry Collection. [image: In the example below, Element 1 and Element 3 have been created as duplicates of Element 0, and Element 2, respectively]

- Replace the Materials in **Element 1** and **Element 3** to affect how the internal surfaces look. In the example below, red and green Materials have been added to those slots. [image: Replace the Materials in Element 1 and Element 3 to affect how the internal surfaces look]

- Click the **Play Mode** options button and select **Simulate** or **Selected Viewport** to see the results. [image: Click Simulate from the Play Modes option menu] You can see that the internal surfaces now use the newly added Materials. [image: The column falls to the ground and fractures on impact] You can also change the Materials directly inside the Geometry Collection. Double click the **Geometry Collection** in the **Content Browser** to open it. [image: Double click the Geometry Collection in the Content Browser to open it] Scroll down to the **Materials** section and replace the Materials in **Index [1]** and **Index [3]**. [image: Replace the Materials in Index [1] and Index [3]]

- Save the Geometry Collection and close the window.

## Best practices when creating Geometry Collections

Consider the following when creating your Geometry Collections.

### Geometry Collections should be "water tight"

Actors used to create the Geometry Collection should be "water tight," meaning they have no open faces or edges. Objects with open faces will perform worse when simulating and return unpredictable results.

 [image: Static Mesh with a hole]

### Geometry Collections should not have intersecting geometry

Objects that make up a Geometry Collection should not intersect each other. Because each Geometry Collection is an individual object which can be simulated, the Chaos Solver will try to push each object away from the other once simulation starts. This can cause erratic and unpredictable results.

 [image: Example of two Static Meshes that are overlapping]

Objects with overlapping geometry will be pushed away from each other.

 [image: Objects with overlapping geometry will be pushed away from each other]

Objects without overlapping geometry simulate correctly.

 [image: Objects without overlapping geometry simulate correctly]

- physics
- chaos
- destruction

On this page

- Create Geometry Collections (-> geometry-collections-user-guide)
- Create Geometry Collection Assets (-> geometry-collections-user-guide)
- Create a Geometry Collection from Static Meshes (-> geometry-collections-user-guide)
- Create a Geometry Collection from a Blueprint Actor (-> geometry-collections-user-guide)
- Create a Geometry Collection from other Geometry Collections (-> geometry-collections-user-guide)
- Fracture Geometry Collections (-> geometry-collections-user-guide)
- Change the Materials of Geometry Collections (-> geometry-collections-user-guide)
- Best practices when creating Geometry Collections (-> geometry-collections-user-guide)
- Geometry Collections should be "water tight" (-> geometry-collections-user-guide)
- Geometry Collections should not have intersecting geometry (-> geometry-collections-user-guide)
