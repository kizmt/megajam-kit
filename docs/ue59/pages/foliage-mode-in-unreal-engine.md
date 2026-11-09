# Foliage Mode

https://dev.epicgames.com/documentation/en-us/unreal-engine/foliage-mode-in-unreal-engine?application_version=5.9

> How to render Static Mesh or Actor Foliage on the surfaces of other geometry for creating ground cover effects.

[image: Foliage Mode]

**Foliage Mode** is a set of tools that enables you to quickly paint or erase sets of **Static Meshes** or **Actor Foliage** on filter-enabled Actors and geometry. Using this mode, it is possible to populate a large outdoor environment with foliage in a short amount of time.

[image: Foliage Cottage] Foliage can quickly add detail to any outdoor environment.

For examples of the **Foliage** tool in action, see the **Foliage** section of the **Landscapes Content Examples** project.

## Foliage Edit Mode

To use the **Foliage** tool, click the **Foliage** option (**Shift+3**) in the **Modes** dropdown menu.

[image: Foliage Mode Drop Down] Click image for full size.

This will open the **Foliage** panel.

### Foliage Mode Panel

[image: Foliage Tools] Click image for full size.

| Numbers | Description |
| --- | --- |
| **1** | Tools Palette |
| **2** | Brush Options |
| **3** | Filter Options |
| **4** | Foliage Palette |
| **5** | Foliage Details |

### Foliage Types

[image: Foliage Type Drop Down] Click image for full size.

Open the **Add Foliage Type** dropdown menu to add the following:

| Foliage Type | Description |
| --- | --- |
| **Actor Foliage** | Foliage type that places Blueprint or Native Actor instances in the scene. High densities of foliage can cause performance issues. |
| **Static Mesh Foliage** | Foliage type that uses mesh instancing.This type is best for non-destructive foliage. |

Static Meshes placed with Foliage Edit Mode are automatically grouped together into batches that are rendered using hardware instancing, where many instances can be rendered with only a single draw call, while Actor Foliage comes at the same rendering cost as placing normal Actors into a scene.

## Using Foliage Mode

Foliage Mode is a collection of tools that are used to paint foliage directly on to a Landscape or other filter-enabled Actor.

### Foliage Tools

[image: Foliage Tools Palette] Click image for full size.

| Tool | Description |
| --- | --- |
| **Select** | Selects individual Foliage Instances. You can select multiple Foliage meshes by holding down the **Ctrl** button. |
| **All** | Selects all Foliage Instances. |
| **Deselect** | Clears the current selection. |
| **Invalid** | Selects any invalid Foliage Instances. |
| **Lasso** | Selects any Foliage Instances of the selected Foliage type when painted over with the brush. |
| **Paint** | Paints instances of the selected Foliage type. Erase instances of the selected Foliage type by holding down the Shift key when painting. |
| **Reapply** | Selectively changes parameters for Foliage Instances already placed in the world. Use as follows:Select the Reapply tool and then select the Foliage type you want to apply changes to in the Mesh List.In the Foliage Details section, make your changes.Paint the changes on to the Foliage Instances in the level. |
| **Single** | Paints a single instance of the selected Foliage type. |
| **Fill** | Fills the selected target with Foliage Instances. |
| **Erase** | Erases the selected Foliage type when painted over with the brush. |
| **Remove** | Removes the selected Foliage Instances. |
| **Move** | Moves the selected Foliage Instances to the current Level. |

### Brush Options

The **Brush Options** section is context sensitive and contains one or more of the following:

[image: Foliage Brush Options] Click image for full size.

| Option | Description |
| --- | --- |
| **Brush Size** | Adjusts the size of the foliage brush. |
| **Point Density** | Adjusts the density of the foliage affected by the selected tool. This is a multiplier of the **Density** property located in the selected foliage type's details. |
| **Erase Density** | Adjusts the density of the foliage that is left behind when erasing with the **Shift** key held. |
| **Single Instance Mode** | When enabled, paints a single foliage instance at the cursor location. Can be used in two modes:**All Selected**: Places a single instance of all selected foliage types.**Cycle Through Selected**: Cycles through placing a single instance of each selected foliage type, placing only one type with each mouse click. |
| **Place in Current Level** | When enabled, places instances of the selected foliage types in the current level. Otherwise places the instances of the selected foliage types in the level containing the mesh or Actor being painted on. |

### Filter Settings

Using the Filters section, you can control which surfaces the selected tool affects and which foliage types are currently active. This is also the section of the menu where new foliage types are added.

[image: Foliage Filter Options] Click image for full size.

| Option | Description |
| --- | --- |
| Landscape | Places the selected foliage types on to Landscapes. |
| Static Mesh | Places the selected foliage types on to Static Meshes. |
| BSP | Places the selected foliage types on to BSP geometry. |
| Foliage | Places the selected foliage types on to other blocking foliage geometry. |
| Translucent | Places the selected foliage types on translucent geometry. |
| Mesh List | Area in which Static Meshes and Actor Foliage used as foliage are placed.Placing the mouse pointer over a foliage type displays a checkbox that enables or disables that foliage type when using a tool.Clicking one or more foliage types displays their details in the Foliage Details located below the Mesh List area. |
| Foliage Details | Area displaying the details of the selected foliage types. Contains a variety of properties for customizing the behavior of the Static Mesh or Actor Foliage. |

For more information on adding foliage types to the Mesh List, see Adding Foliage to a Landscape Actor (-> foliage-mode-in-unreal-engine)

### Culling Settings

Foliage instances are rendered as clusters in a single draw call and each cluster is either rendered or not rendered based on occlusion. Setting a value in the **End Cull Distance** parameter in the foliage details causes the clusters to be culled beyond that distance. However, this will cause groups of meshes to disappear abruptly as the entire cluster goes out of range.

This can be reduced by adding a **Start Cull Distance** parameter and then setting up the Material appropriately. In the vertex shader, a per-instance fading factor is calculated, which goes from 1.0 at the start distance to 0.0 at the end distance. This is accessible in the Material using a **PerInstanceFadeAmount** node. When connecting that to an opacity or masking value, you can use it to fade instances over a distance before they reach the **Cull Distance End** and are removed from rendering. Lowering the value of the **FadeMultiplier** parameter will increase the speed of the fade. A value of zero will make your foliage invisible at any distance.

The example Material below multiplies the Material mask by the fading factor to thin out the foliage mesh's leaves until they completely disappear.

[image: Foliage Culling] Click image for full size.

Nanite-enabled meshes are not affected by culling distance and instance fading.

### LOD Settings

Static Mesh LOD is supported for foliage. There are a few caveats:

- You should ensure your Static Mesh has only one entry in the Elements array (visible under **LOD0**).
- Light and shadow maps are shared between all LOD levels, so all LODs need to use the same unwrapping.
- Currently, the entire cluster of instances change LODs simultaneously. We may add support for distance-based fading per instance in the future.

### Lighting

Shadow and light maps are generated individually by Lightmass as needed for each instance, and these are tiled together for each precomputed batch. There are several settings on the Static Mesh that should be checked for precomputed lighting to operate well with instanced foliage. Lightmass is less forgiving when generating shadow maps for instanced meshes, and incorrect settings could lead to black meshes after rebuilding lighting.

- **Light Map Coordinate Index**: This must be set to a valid UV channel that has a unique UV unwrapping. The Static Mesh Editor's **Generate Unique UVs** feature, which you can access from the Window menu, can quickly generate a unique unwrapping.
- **Lightmap Resolution**: This must be a small enough number so that all the shadow maps for instances in a single cluster (by default 100) can be tiled together without exceeding the maximum texture resolution (4094x4096).

### Foliage Scalability

Foliage Static Meshes can use the Scalability System to increase or decrease the amount of Foliage Instances that are currently being rendered on screen.

To use this functionality within your project:

- Navigate to the **Foliage Mesh List** and select a **foliage type**.[image: Select Foliage Type] Click image for full size.
- In the **Foliage Details**, locate the **Scalability** section.[image: Foliage Scalability Settings] Click image for full size.
- Select the checkbox for **Enable Density Scaling**.[image: Enable Density Scaling] Click image for full size.

You can now control the density of the foliage being rendered during runtime with the command `foliage.DensityScale`.

Below, you can see the density of the Foliage changes as the `foliage.DensityScale` setting is set to 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0.

 [image: Drag the slider to adjust the foliage.DensityScale setting from 0.1 to 1.0.] [image: Drag the slider to adjust the foliage.DensityScale setting from 0.1 to 1.0.] [image: Drag the slider to adjust the foliage.DensityScale setting from 0.1 to 1.0.] [image: Drag the slider to adjust the foliage.DensityScale setting from 0.1 to 1.0.] [image: Drag the slider to adjust the foliage.DensityScale setting from 0.1 to 1.0.] [image: Drag the slider to adjust the foliage.DensityScale setting from 0.1 to 1.0.] [image: Drag the slider to adjust the foliage.DensityScale setting from 0.1 to 1.0.] [image: Drag the slider to adjust the foliage.DensityScale setting from 0.1 to 1.0.] [image: Drag the slider to adjust the foliage.DensityScale setting from 0.1 to 1.0.] [image: Drag the slider to adjust the foliage.DensityScale setting from 0.1 to 1.0.]

**Drag the slider to adjust the foliage.DensityScale setting from 0.1 to 1.0.**

### Using Foliage with World Partition

In a World Partition map, the default grid size for Foliage Instances is 256 meters. This is separate from the World Partition grid size.

To change the default size of the Instanced Foliage Grid for new maps:

[image: Project Settings Foliage Instance Grid Size] Click image for full size.

- Open the Project Settings by opening the **Edit** menu and selecting the **Project Settings** option.
- In the search box, search for **Foliage**.
- Change the value of the **Instanced Foliage Grid Size** to your desired value in centimeters. In the above example, 25600 centimeters is equal to 256 meters.

The default grid size can be changed for existing maps using the **World Partition Builder Commandlet**:

[image: Foliage Grid Size Commandlet] Click image for full size.

To change the default grid size for Foliage Instances:

- In Windows, open a Command Prompt window.[image: Windows Command Prompt] Click image for full size.
- At the prompt, begin by navigating to the location of the `UnrealEditor.exe` executable file. In the above example: `c:\Builds\Home_UE5_Engine\Engine\Binaries\Win64`.[image: Begin the command line with the executable] Click image for full size.
- Next, begin the command with the name of the .exe file that will run the commandlet, `UnrealEditor.exe`.
- Add the name of the project. Here, `QAGame`.[image: Add Project Name] Click image for full size.
- Add the name of the target map.[image: Add Target Map] Click image for full size.
- Finish the command with the name of the commandlet and the following arguments:`-run=WorldPartitionBuilderCommandlet` is the name of the commandlet.
- `-Builder=WorldPartitionFoliageBuilder` is the name of the builder within the commandlet.
- `-NewGridSize` is the new value of the Instanced Foliage Grid in centimeters. In the example, a value 51200 is equal to 512 meters.[image: Finish the Command Line] Click image for full size.

- Press **Enter** and the commandlet will change your Foliage Instance Grid setting for the designated map.

## Adding Foliage to a Landscape

Painting one or more types of foliage directly on to a Landscape Actor is an excellent way to quickly add detail to any outdoor environment.

[image: Foliage Landscape Painting] Click image for full size.

- Start by creating a new Landscape Actor if your level does not already have one. Sculpt some hills to create a bit of contrast. For more information on creating and working with Landscape Actors, see Landscape Quick Start Guide.[image: Add Landscape Actor] Click image for full size.
- Open the **Modes** drop down and select the **Foliage** mode. Alternatively, you can use the hotkey **Shift + 3**.
- In the **Content Drawer**, navigate to the location of a Static Mesh that you would like to use as a foliage type, such as this **Static Mesh Cube**. Click and drag the **Static Mesh** from the **Content Drawer** to the **Mesh List** in the **Foliage** panel.[image: Drag Static Mesh from Content Drawer to Mesh List] Click image for full size.
- Select the **Paint** tool. Adjust the **Brush Size** in the **Brush Options** to **128**. Adjust the **Paint Density** to **0.3**.[image: Adjusting Foliage Paint Setting] Click image for full size.
- Select the **Static Mesh** in the **Mesh List**. Under the **Painting** section of the **Foliage Details**, change the **Radius** value to **100**. In this example, this ensures that instances of the cube that will be painted on the Landscape do not overlap.[image: Foliage Details Settings] Click image for full size.
- Next, adjust the **Min** value of the **Scale X** to **0.4** and the **Max** value to **0.8**. This will create some variety in sizes when the foliage is painted.[image: Adjusting Foliage Details Scale] Click image for full size.
- In the viewport, click and hold the **LMB** to paint foliage across the **Landscape**.[image: Foliage Landscape Painting] Click image for full size.

## Reattaching Foliage Instances

There may be times when Foliage Instances can become detached from their base component. For example, when the foliage placement is fine but the base Landscape needs to be changed.

To reattach the foliage to the underlying component, follow these steps:

- While in Foliage Mode, select the Foliage Instances you want to reattach.
- In the viewport, move the selected instances above the target component.
- Press the **End** key to snap the foliage to the ground. This will reparent the Foliage Instances to the target component. The foliage will also align to the component based on the component's normal if they were originally placed using the **Align to Normal** option. This setting is located in the **Placement** section of the Foliage type's Details.

- landscape
- open world
- foliage mode

On this page

- Foliage Edit Mode (-> foliage-mode-in-unreal-engine)
- Foliage Mode Panel (-> foliage-mode-in-unreal-engine)
- Foliage Types (-> foliage-mode-in-unreal-engine)
- Using Foliage Mode (-> foliage-mode-in-unreal-engine)
- Foliage Tools (-> foliage-mode-in-unreal-engine)
- Brush Options (-> foliage-mode-in-unreal-engine)
- Filter Settings (-> foliage-mode-in-unreal-engine)
- Culling Settings (-> foliage-mode-in-unreal-engine)
- LOD Settings (-> foliage-mode-in-unreal-engine)
- Lighting (-> foliage-mode-in-unreal-engine)
- Foliage Scalability (-> foliage-mode-in-unreal-engine)
- Using Foliage with World Partition (-> foliage-mode-in-unreal-engine)
- Adding Foliage to a Landscape (-> foliage-mode-in-unreal-engine)
- Reattaching Foliage Instances (-> foliage-mode-in-unreal-engine)
