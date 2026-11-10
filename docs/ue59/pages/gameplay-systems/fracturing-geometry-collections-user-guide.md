# Fracturing Geometry Collections User Guide

https://dev.epicgames.com/documentation/en-us/unreal-engine/fracturing-geometry-collections-user-guide?application_version=5.9

> Overview of the various methods of fracturing Geometry Collections.

[image: Fracturing Geometry Collections User Guide]

You can find similar information in video format in the Epic Developer Community site by watching the Fracture and Clustering tutorials.

The **Fracture Mode** is an editor mode that contains a wide variety of tools for creating, fracturing, and manipulating **Geometry Collections**. Geometry Collections are the asset type used by Chaos Destruction for simulating real-time fracturing in Unreal Engine.

The available fracturing tools provide users with a lot of control over how the Geometry Collection is fractured. This includes the number of fractured pieces and how they relate to each other (fracture hierarchy).

Each fracture tool uses a different method, or algorithm, to generate different fracture patterns. Each method comes with a variety of options to further customize the generated pattern, including adding randomization.

In this guide you will learn to use the various fracturing tools available in the Fracture Mode.

Before learning about the Fracture Mode, you should know how to create Geometry Collections from Actors in the Level. If you are not familiar with the process, refer to the Geometry Collections User Guide (-> chaos-destruction-key-concepts-in-unreal-engine).

## Fracture the Geometry Collection

Before using the fracturing tools, create a Geometry Collection from a Static Mesh Actor in your Level and select it.

 [image: Create a Geometry Collection from a Static Mesh Actor in your Level]

You can now access the available fracture tools under the **Fracture** section of the **Fracture Mode** panels. Each tool can be applied to the Geometry Collection as a whole, or to selected fractured pieces (individual bones) after fracturing.

Click the image for full size.

When applying a fracture method to the Geometry Collection, a new fracture level is created. This is reflected in the Geometry Collection's **Fracture Hierarchy** window.

Click the image for full size.

A Geometry Collection's fracture hierarchy resembles a tree structure. It contains a root bone with one or more child bones which make up the fractured pieces. Each child bone can, in turn, contain its own child bones.

The levels in the fracture hierarchy represent the structure of the tree, with four levels representing a tree-like structure with three branching levels of child bones.

 [image: A 4 level fracture hierarchy]

You can use different fracturing tools each time you fracture the Geometry Collection, creating different fracture patterns per level in the Fracture Hierarchy.

You can select multiple bones (fractured pieces) in the Geometry Collection by holding **CTRL** and selecting them directly in the viewport. You can also use the provided selection tools (-> fracture-mode-selection-tools-user-guide) to quickly select a set of bones directly.

### Reset the Geometry Collection

After fracturing the Geometry Collection, you can reset it to its original state by clicking the **Reset** button under the **Generate** section. This sets the Geometry Collection to its original state when it was created without any applied fracturing. This can be helpful when trying different fracture methods until you find the configuration that provides the desired results.

 [image: Click the Rest button to reset the Geometry Collection to its initial state]
 [image: You can reset a Geometry Collection to its original state by clicking the Reset button]

### View Settings

The **View Settings** help you visualize what the Geometry Collection looks like after applying any fracture operation.

 [image: Common view options]

| Option | Description |
| --- | --- |
| **Explode Amount** | Displays what the Geometry Collection will look like when it fractures during gameplay. A value of 1 will separate all bones and will show what a completely fractured Geometry Collection looks like. |
| **Hide UnSelected** | Hides the bones that are not currently selected in the Geometry Collection. This helps you focus on specific bones while applying a fracture method. |
| **Fracture Level** | Defines which fracture level to visualize. Selecting All will display the bones for all fracture levels. |

Click the image for full size.

 [image: Changing the Explode values from 0 to 1]

### Common options included with most fracture methods

All fracture tools have these **Common Fracture** options:

 [image: Common Fracture options for all fracture methods]

| Option | Description |
| --- | --- |
| **Random Seed** | This value is used to generate the random fracturing pattern over the Geometry Collection. A -1 means a random seed value will be used every time a new fracture operation is applied. Specifying a value generates a fracture pattern tied to that seed number, which when entered will always generate that same fracture pattern. |
| **Chance to Fracture** | Sets the chance that a bone is likely to be fractured during the fracture operation where 1 is equal to 100%, meaning all bones will be fractured. 0 is equal to 0% chance of any bone being fractured. |
| **Group Fracture** | Generates a fracture pattern across all selected meshes. |
| **Draw Sites** | Draws points in the center of the bones to be cut out by the fracture pattern. |
| **Draw Diagram** | Draws the fracture pattern diagram on top of the Geometry Collection. |
| **Grout** | Defines the amount of space to leave between cut piece. |

 [image: A fractured Geometry Collection with grout]

Most fracture methods share these **Noise** options:

- **Amplitude**: Defines the size of the perlin noise displacement in centimeters. A value of 0 indicates that no noise will be used when generating the fracture pattern. [image: Amplitude: 0] [image: Amplitude: 30]

- **Frequency**: Defines the period of the perlin noise. Smaller values produce a smoother noise pattern, and larger ones produce a rougher noise pattern. [image: Amplitude: 5, Frequency: 0] [image: Amplitude: 5, Frequency: 200]

- **Persistence**: Defines the persistence of the perlin noise layers. For each layer (octave) after the first, the **amplitude** of the perlin noise will be scaled by this factor. [image: Amplitude: 5, Persistence: 0.5] [image: Amplitude: 5, Persistence: 1]

- **Lacunarity**: Defines the lacunarity of the perlin noise layers. For each layer (octave) after the first, the **frequency** of the perlin noise will be scaled by this factor. [image: Amplitude: 5, Lacunarity: 2] [image: Amplitude: 5, Lacunarity: 4]

- **Octave Number**: Defines the number of fractal layers (octaves) of perlin noise that will be applied to the fracture pattern. Each layer is additive, with Amplitude and Frequency scaled by Persistence and Lacunarity, respectively. Smaller values (1-2) will generate smooth patterns, while larger values will generate more craggy patterns. [image: Amplitude: 5, Octave Number: 1] [image: Amplitude: 5, Octave Number: 8]

- **Point Spacing**: Distance (in centimeters) between vertices on cut surfaces where noise is added. Larger spacing between vertices results in more efficient meshes with fewer triangles. However, this also results in lower overall resolution to see the shape of the added noise.

## Use the Fracture Tools

Each Fracture tool has its own settings that provide relevant options to achieve the desired results.

### Uniform Fracture

The **Uniform** tool uses a Voronoi algorithm to generate the fracture pattern. Enter a minimum and maximum number of Voronoi sites (or number of fractured pieces) and the algorithm will choose a random value within the range.

 [image: You can enter a minimum and maximum number of Voronoi sites]

In the fractured Geometry Collections below, the one on the left has the **Min** and **Max Voronoi Sites** set to **20**. This means that the fractured Geometry Collection will have 20 fractured pieces. The example on the right has the **Min** and **Max Voronoi Sites** set to **100**.

|  |  |
| --- | --- |
| [image: Min / Max Voronoi Sites: 20] | [image: Min / Max Voronoi Sites: 100] |
| 20 Voronoi Sites | 100 Voronoi Sites |
| Click image for full size. | Click image for full size. |

### Cluster Fracture

The **Cluster** fracture tool is an extension of the Uniform fracture method where both use a Voronoi algorithm when generating their fracture pattern. While the Uniform Voronoi method produces a relatively even distribution of sites, the Cluster method gathers its sites together into islands of close proximity, creating a more varied fracture pattern compared to the uniform method.

 [image: Cluster fracture tool options]

| Option | Description |
| --- | --- |
| **Min Num Clusters** | Defines the minimum number of Voronoi clusters that will be created. |
| **Max Num Clusters** | Defines the maximum number of Voronoi clusters that will be created. |
| **Min Sites per Cluster** | Defines the minimum number of Voronoi sites per cluster. |
| **Max Sites per Cluster** | Defines the maximum number of Voronoi sites per cluster. |
| **Min Dist from Center** | Defines the minimum cluster radius. The cluster radius offset will be added to this value. |
| **Max Dist from Center** | Defines the maximum cluster radius (in centimeters). The Cluster Radius Offset will be added to this value. |
| **Cluster Radius Offset** | Defines the radius offset of the cluster (in centimeters) that is added to the minimum and maximum distance from the center. |

The examples below use the following Cluster settings as a starting point:

| Setting | Value |
| --- | --- |
| **Min Num Clusters** | 2 |
| **Max Num Clusters** | 2 |
| **Min Sites per Cluster** | 5 |
| **Max Sites per Cluster** | 5 |
| **Min Dist from Center** | 0.1 |
| **Max Dist from Center** | 0.1 |
| **Cluster Radius Offset** | 0 |

The following have also been set under the Common Fracture settings:

- **Draw Sites**: Enabled

- **Draw Diagram**: Disabled

In the example below you can see the difference between setting the **Min** / **Max Number of Clusters** from **2** to **5**.

 [image: Min / Max Num Clusters: 2]

 [image: Min / Max Num Clusters: 5]

In the example below you can see the difference between setting the **Min** / **Max Sites per Cluster** from **5** to **10**.

 [image: Min / Max Sites Per Cluster: 5]

 [image: Min / Max Sites Per Cluster: 10]

In the example below you can see the difference between setting the **Min** / **Max Distance from Center** from **0.1** to **0.2**.

 [image: Min / Max Dist from Center: 0.1]

 [image: Min / Max Dist from Center: 0.2]

In the example below you can see the difference between setting the **Cluster Radius Offset** from **0** to **10**.

 [image: Cluster Radius Offset: 0]

 [image: Cluster Radius Offset: 10]

### Radial Fracture

The **Radial** fracture tool creates a distribution of Voronoi sites that operate from a center point and radiate outwards. The center position is controlled by manipulating the gizmo inside the Viewport.

 [image: Radial fracture tool gizmo]

If you want to place it at a specific location, you can enter the **Center** and **Normal** rotation (1) of the center point directly in the **Radial Voronoi** options. To activate those fields, **disable** the **Use Gizmo** checkbox (2) in the **Placement Controls** section.

 [image: Radial Voronoi options]

The Radial fracture tool comes with the following options:

- **Center**: Defines the center location of the generated fracture pattern. This option is only available if you disable the **Use Gizmo** checkbox.

- **Normal**: Defines the normal rotation of the plane used to generate the fracture pattern. This option is only available if you disable the **Use Gizmo** checkbox.

- **Radius**: Defines the radius of the pattern from the center location. [image: Radius: 50] [image: Radius: 100]

- **Angular Steps**: Defines the number of angular steps used to generate the fracture pattern. These steps subdivide the circumference of the diagram. [image: Angular Steps: 5] [image: Angular Steps: 20]

- **Radial Steps**: Defines the number of radial steps used to generate the fracture pattern. This affects the number of times the pattern is divided outwards from the center. [image: Radial Steps: 5] [image: Radial Steps: 20]

- **Angle Offset**: Defines an angular offset (in degrees) used for every radial step. [image: Angle Offset: 0] [image: Angle Offset: 35]

- **Variability**: Defines the amount to randomly space each generated Voronoi site (in centimeters). [image: Variability: 0] [image: Variability: 5]

### Planar Fracture

The **Planar** fracture tool is used to create a planar cut in the Geometry Collection. As cuts are created in the Geometry Collection, the gizmo resets to the centroid of your current selection. This is helpful if you are trying to make deliberate cuts as you select different Bones in the Viewport.

You can disable the gizmo resetting to the center of your current selection by disabling **Center on Selection** under the **Placement Controls** section.

 [image: Disable the Center on Selection checkbox under the Placement Controls section]

It's important to note that the plane used for each cut extends to infinity, meaning that even if the gizmo displays the plane at a specific size, the cut will extend in the plane's direction to cut the entire Geometry Collection.

You can also forgo using the gizmo by disabling **Use Gizmo** under the **Placement Controls** section.

 [image: Disable the Use Gizmo checkbox under the Placement Controls section]

Disabling the gizmo enables you to set a **Number of Cuts** under the **Plan Cut** section. This results in a random number of cuts to the Geometry Collection.

 [image: You can now enter a specific Number of Cuts under the Plane Cut section]

In the example below you can see the difference between setting the **Number of Cuts** from **1** to **10**.

 [image: Number of Cuts: 1]

 [image: Number of Cuts: 10]

You can change the placement of these cuts by changing the **Random Seed** value under the **Common Fracture** section.

 [image: Random Seed: 20]

 [image: Random Seed: 40]

### Slice Fracture

The **Slice** fracture tool is an extension of the **Planar** fracture tool with the added ability to set the number of cuts along each axis. This allows for initial cuts to be aligned into columns and rows. Slices can also have random angles and offset variations applied to them.

| Option | Description |
| --- | --- |
| **Slices X** | Defines the number of slices along the X axis. |
| **Slices Y** | Defines the number of slices along the Y axis. |
| **Slices Z** | Defines the number of slices along the Z axis. |
| **Random Angle Variation** | Defines the maximum angle (in degrees) to randomly rotate each slicing plane. |
| **Random Offset Variation** | Defines the maximum distance (in centimeters) to randomly shift each slicing plane. |

In the example below you can see the difference between setting the **Random Angle Variation** from **0** to **35**.

 [image: Random Angle Variation: 0]

 [image: Random Angle Variation: 35]

In the example below you can see the difference between setting the **Random Offset Variation** from **0** to **50**.

 [image: Random Offset Variation: 0]

 [image: Random Offset Variation: 50]

### Brick Fracture

The Brick fracture tool is considered experimental and may receive significant changes in future versions of the engine.

The **Brick** fracture tool generates a customizable brick pattern. You can specify how the bricks are arranged and their size for when the pattern is applied to the Geometry Collection.

| Option | Description |
| --- | --- |
| **Bond** | Sets the brick bond pattern that determines how the bricks are arranged in the fracture pattern. You can select from: Stretcher, Stack, English, Header, and Flemish. |
| **Brick Length** | Defines the brick length in centimeters. |
| **Brick Height** | Defines the brick height in centimeters. |
| **Brick Depth** | Defines the brick depth in centimeters. |

The Example below shows the **Stretcher** bond method applied to the Geometry Collection.

 [image: Example of the Stretcher bond method]

### Mesh Fracture

The **Mesh** fracture tool uses the shape of a Static Mesh to generate the fracture pattern. This is useful if you want to create very specific pattern shapes.

Drag a **Static Mesh** into the level and place it so it intersects the Geometry Collection.

 [image: Drag a Static Mesh into the level]

Click **Mesh** and go to the **Mesh Cut** section in the **Fracture** panel.

 [image: Go to the Mesh Cut section in the Fracture panel]

Click the **Cutting Actor** dropdown. Select the Static Mesh actor you dragged into the level. Alternatively, you can click the Eye-Dropper button and click on the Static Mesh in the viewport.

 [image: Select the Static Mesh actor from the list]

Click **Fracture** to cut the Geometry Collection in the shape of the Cutting Actor. To see the results, select the **Cutting Actor** in the **Viewport** and move it.

 [image: Move the Cutting Actor outside of the Geometry Collection to the see the results]

The following **Cut Distributions** are available with the tool:

 [image: Cut Distribution options available]

| Option | Description |
| --- | --- |
| **Single Cut** | Generates a single cut at the current location of the Cutting Actor. |
| **Uniform Random** | Scatters the Cutting Actor in a uniform random distribution around the Geometry Collection's bounding box. |
| **Grid** | Arranges the Cutting Actor in a regular grid pattern across the Geometry Collection. |

The following options are available for the **Uniform Random** Cut Distribution:

 [image: Uniform Random Cut Distribution options]

| Option | Description |
| --- | --- |
| **Number to Scatter** | Defines the number of Actors to randomly scatter. |
| **Min Scale Factor** | Defines the minimum scale factor to apply to the cutting meshes. A random scale will be chosen between Min and Max. |
| **Max Scale Factor** | Defines the maximum scale factor to apply to the cutting meshes. A random scale will be chosen between Min and Max. |
| **Random Orientation** | Whether to randomly vary the orientation of the cutting actors. |
| **+/- Roll Range** | Defines the range that will be used to pick a random roll (rotation in X axis) for the cutting Actors. |
| **+/- Pitch Range** | Defines the range that will be used to pick a random pitch (rotation in Y axis) for the cutting Actors. |
| **+/- Yaw Range** | Defines the range that will be used to pick a random yaw (rotation in Z axis) for the cutting Actors. |

In the example below you can see the difference between setting the **Number to Scatter** from **5** to **10**.

 [image: Number to Scatter: 5]

 [image: Number to Scatter: 10]

In the example below you can see the difference between **enabling** and **disabling** the **Random Orientation**.

 [image: Random Orientation: Enabled]

 [image: Random Orientation: Disabled]

The following options are available for the Grid Cut Distribution:

 [image: Grid Distribution options]

| Option | Description |
| --- | --- |
| **Grid Width** | Defines the number of cutting meshes to add to the X-axis of the grid. |
| **Grid Depth** | Defines the number of cutting meshes to add to the Y-axis of the grid. |
| **Grid Height** | Defines the number of cutting meshes to add to the Z-axis of the grid. |
| **Variability** | Defines the magnitude of the random displacement of the cutting Actors. |
| **Min Scale Factor** | Defines the minimum scale factor to apply to the cutting Actors. |
| **Max Scale Factor** | Defines the maximum scale factor to apply to the cutting Actors. |
| **Random Orientation** | Whether to randomly vary the orientation of the cutting Actors. |

In the example below you can see the difference between **enabling** and **disabling** the **Random Orientation**.

 [image: Random Orientation: Enabled]

 [image: Random Orientation: Disabled]

### Custom Fracture

The **Custom** fracture tool is the most extensive fracturing tool included with the Fracture Mode.

 [image: Custom fracture tool options]

| Option | Description |
| --- | --- |
| **Pattern** | Defines the pattern used to generate the Voronoi sites. |
| **Normal Offset** | Defines the offset value used for each vertex's normal direction. |
| **Variability** | Defines the amount to randomly offset each Voronoi site in centimeters. |
| **Sites to Add** | Defines the number of Voronoi sites to add to the pattern. |
| **Skip Fraction** | Defines the fraction of points that will not be fractured (skipped). |
| **Skip Mode** | Defines the method used for skipping the points that will not be fractured. |

With this tool, the **Fracture Diagram** is considered its own entity that can be moved relative to the Geometry Collection. This is useful when looking to create more customized fracture patterns.

|  |  |
| --- | --- |
| [image: The gizmo is centered] | [image: The gizmo is moved to a corner] |
| The gizmo is centered | The gizmo is moved to a corner |
| Click image for full size. | Click image for full size. |

To better visualize the fracture diagram, you can freeze positional data for the fracture sites. Under the **Common Fracture** section, enable **Draw Sites** and disable **Draw Diagram**.

 [image: Enable the Draw Sites checkbox and disable the Draw Diagram checkbox]

In addition, under the **Live Voronoi Sites** section. set the **Pattern** to **Centered** and set the **Variability** to **40**.

 [image: Select the Centered Pattern and set the Variability to 40]

Doing this enables you to move the gizmo to a desired location on the Geometry Collection. In the Fracture Mode panel under the **Custom Voronoi** section, click the **Freeze Live Sites**.

 [image: Click the Freeze Live Sites button under the Custom Voronoi section]

|  |  |
| --- | --- |
| [image: The gizmo is placed at the top left corner] | [image: The gizmo is moved revealing the frozen sites] |
| The gizmo is placed at the top left corner | The gizmo is moved revealing the frozen sites |
| Click image for full size. | Click image for full size. |

You can continue this process to deliberately place sites on the Geometry Collection. Once you are ready, click **Fracture** to see the results of all the sites placed on the Geometry Collection.

 [image: The fractured Geometry Collection]

Since the fracture diagram is separate from the Geometry Collection, you can make changes to the Geometry Collection without affecting the fracture itself.

For example, if you set the **Sites to Add** to **2000**, scale down the Geometry Collection to the shape of a column and click **Fracture**, you get the fracture pattern applied to the current shape of the Geometry Collection.

 [image: Set the Sites to Add to 2000]
 [image: Scale the Geometry Collection]

Rescale the Geometry Collection to its original size and notice how the fracture pattern is now stretched, resembling splinters of wood.

 [image: Rescale the Geometry Collection to its original size]

Because the fracture diagram isn't directly tied to the Geometry Collection, when you rescale the Geometry Collection, the fracture diagram remains the same. This means that you can create unique fracture patterns that fit a stylistic choice for your project, like this one with elongated fractures.

- physics
- chaos
- destruction

On this page

- Fracture the Geometry Collection (-> fracturing-geometry-collections-user-guide)
- Reset the Geometry Collection (-> fracturing-geometry-collections-user-guide)
- View Settings (-> fracturing-geometry-collections-user-guide)
- Common options included with most fracture methods (-> fracturing-geometry-collections-user-guide)
- Use the Fracture Tools (-> fracturing-geometry-collections-user-guide)
- Uniform Fracture (-> fracturing-geometry-collections-user-guide)
- Cluster Fracture (-> fracturing-geometry-collections-user-guide)
- Radial Fracture (-> fracturing-geometry-collections-user-guide)
- Planar Fracture (-> fracturing-geometry-collections-user-guide)
- Slice Fracture (-> fracturing-geometry-collections-user-guide)
- Brick Fracture (-> fracturing-geometry-collections-user-guide)
- Mesh Fracture (-> fracturing-geometry-collections-user-guide)
- Custom Fracture (-> fracturing-geometry-collections-user-guide)
