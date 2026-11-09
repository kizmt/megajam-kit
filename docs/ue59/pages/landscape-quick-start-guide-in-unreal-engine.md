# Landscape Quick Start Guide

https://dev.epicgames.com/documentation/en-us/unreal-engine/landscape-quick-start-guide-in-unreal-engine?application_version=5.9

> Learn to create a Landscape, sculpt it, create a new layered Landscape Material, and paint layers on a Landscape.

The Landscape system inside of Unreal Engine 5 (UE5) is a collection of tools for creating expansive outdoor environments. This guide teaches you the basics you need to build your first Landscape.

## Before You Begin

Before starting this guide, ensure you have an Unreal Engine project. We recommend a project that uses the First Person or Third Person template, so you have a character that can walk the Landscape and check its scale and slopes.

For more information about creating Unreal Engine projects, see Creating a New Project (-> creating-a-new-project-in-unreal-engine).

You'll also need a basic level with no floor to work in. To set up a new empty level for your Landscape, follow these steps:

- In your UE project, create a new level using **File > New Level** and select the **Basic **level template. [image: Create a new level]

- Select the **Floor** in the level and press the **Delete** key to remove it from the level. [image: New level in your project]

## 1 - Creating a new Landscape

Switching to Landscape Mode opens the Landscape panel with all the tools you need to manipulate your Landscape.

To create a new default Landscape actor in an empty level, follow these steps:

- Click the **Landscape** option in the **Modes** dropdown menu. [image: Select Landscape in the Modes menu] After you select **Landscape **mode, the **Landscape **panel appears with the following set of Landscape tools. [image: Landscape tools]

- For this tutorial, keep all default settings and then click **Create** to add a default Landscape to your level. When Unreal Engine generates the new Landscape, you should have something that looks like this: [image: Creating a Landscape] > **note:** To learn more about the settings in the Landscape tool's **Manage **mode, see Creating Landscapes (-> creating-landscapes-in-unreal-engine).

- To ensure your player doesn't spawn under your Landscape, select the **PlayerStart** actor and move it up slightly on the Z axis.

> **note:** For large open worlds, Unreal Engine uses World Partition. World Partition (-> world-partition-in-unreal-engine) stores your world in a single level divided into a grid and automatically loads and unloads grid cells based on distance from the player. Landscape works natively with World Partition; you edit the Landscape as one object, and Unreal Engine splits it into sections that load and unload separately in the editor and at runtime. This makes it practical to build and edit Landscapes too large to load all at once.

## 2 - Working with the Landscape Tools

Let's get familiar with some of the tools and keyboard inputs that are most commonly used to interact with the Landscape system.

The Landscape tool has three modes, Manage, Sculpt, and Paint, accessible by clicking on their icons at the top of the Landscape panel. Each mode provides different methods for you to interact with the Landscape.

Here is an overview of what you can do with each mode:

| Icon | Mode | Description |
| --- | --- | --- |
| [image: Manage mode] | Manage mode | Create new Landscapes, import or export Landscape data, and modify Landscape components. For more information about Manage mode, refer to Landscape Manage Mode (-> landscape-manage-mode-in-unreal-engine). |
| [image: Sculpt mode] | Sculpt mode | Modify the shape of your Landscape by selecting and using specific tools. Sculpt mode also has the Landscape Copy Tool (-> landscape-copy-tool-in-unreal-engine) to copy and paste parts of your Landscape. For more information about Sculpt mode, refer to Landscape Sculpt Mode (-> landscape-sculpt-mode-in-unreal-engine). |
| [image: Paint mode] | Paint mode | Modify the appearance of parts of your Landscape by painting textures on  it, based on the layers defined in the Landscape's Material. For more information about Paint mode, refer to Landscape Paint Mode (-> landscape-paint-mode-in-unreal-engine). |

### Interacting with the Landscape Tools

While each of the three modes within the Landscape tools allows you to interact with the Landscape differently, the keyboard and mouse keys that you use are similar.

Here is an overview of some of the most common keys, key combinations, and mouse buttons that you'll use when working with the Landscape tool.

| Common Controls | Operation |
| --- | --- |
| **Left Mouse Button (LMB)** | Raise or increase the heightmap or selected layer's weight. For example, in Sculpting mode, this raises the Landscape heightmap. In Paint mode, this increases the weight of the selected target layer under the brush, so that layer shows more strongly. |
| **Shift + LMB** | Lower or decrease the heightmap or selected target layer's weight. For example, in Sculpting mode, this lowers the Landscape heightmap. In Paint mode, this decreases the weight of the selected target layer under the brush, so that layer shows less strongly. |
| **Ctrl + Z** | Undo last action. |
| **Ctrl + Y** | Redo last undone action. |

## 3 - Sculpting the Landscape

You can find all of the tools used for sculpting in the **Sculpt**
 tab in the Landscape panel.

For this part of the Landscape tutorial, you are going to start with a completely flat section of the Landscape and then build up the details as you go along. When finished, you'll be familiar with the various Landscape tools.

> **note:** Working with the Landscape tools requires trial and error, and your results will differ from the example Landscape in the sculpting instructions below. Instead of matching the tutorial's example exactly, focus on understanding how each Landscape tool works and how all the tools work together to produce a final product.

To sculpt your Landscape, follow these steps:

- Find a section of the Landscape that you want to work with. For this tutorial, you are not going to be filling in the entire Landscape but just a section of it. For ease of use, set a camera bookmark by pressing **Ctrl + 1**  on the keyboard. With a camera bookmark, you can quickly return to a pulled-back view and check how your entire Landscape is looking as you shape it. If you press the **1** key, your camera will return to the bookmarked view. [image: Find a Landscape section to work with]

- With the bookmark set, begin painting in the larger details for hills and valleys using the **Sculpt tool**. You can change the value of the Brush Size and Strength either in the Landscape panel or the Landscape toolbar located just above the viewport. These are the brush settings used to sculpt the sample Landscape in the screenshot: | Tool Used | Brush Size | Strength Setting | | --- | --- | --- | | **Sculpt tool** | 8192 | 0.29 | When completed, you should have something that looks like this: [image: Sculpting hills and valleys]

- After you block out the hills and valleys, use the **Smooth tool** to help refine the look and feel of them. Using this tool smooths your Landscape  features and makes them seem more natural. Be careful not to smooth away  all your features! These are the brush settings used to create the sample Landscape in the screenshot below: | Tool Used | Brush Size | Strength Setting | | --- | --- | --- | | **Smooth tool** | 2048 | 0.29 | [image: Smoothing your Landscape]

- Now that you smoothed out the Landscape, it is time to add some flat mesa-like sections using the **Flatten tool**.  The Flatten tool captures the height information of the location of your first click and raises or lowers the heightmap to meet that point as you drag around the brush. These are the brush settings used to create the sample Landscape in the screenshot below: | Tool Used | Brush Size | Strength Setting | | --- | --- | --- | | **Flatten tool** | 2048 | 0.29 | [image: Flatten your Landscape]

- Use the **Ramp tool **to add some flat ramps between the mesas. To create a flat path between two points, click your landscape to set a start point and an end point for your ramp and then click **Add Ramp**. Use the translation gizmo to move the start and end points in any direction to shape your ramp. These are the ramp settings used to create the sample Landscape in the screenshot below: | Tool Used | Ramp Width | Side Falloff | | --- | --- | --- | | **Ramp tool** | 2000 | 0.40 | [image: Creating Ramps in your Landscape]

- Use the **Erosion **tool to wear down steep slopes and give your Landscape a weathered look. It simulates thermal erosion, where soil moves from higher to lower ground. This tool helps shave away parts of your hills to create mountain peaks and ridges. These are the brush settings used to create the sample Landscape in the screenshot below: | Tool Used | Brush Size | Strength Setting | | --- | --- | --- | | **Erosion tool** | 693 | 0.25 | [image: Erode your Landscape]

- Add more erosion effects with Hydro Erosion. The **Hydro Erosion tool **simulates how water will erode Landscape details over time. Like the **Smooth Tool**,  be careful not to erode away all your detail. These are the brush settings used to create the sample Landscape in the screenshot below: | Tool Used | Brush Size | Strength Setting | | --- | --- | --- | | **Hydro ******Erosion | 2048 | 0.29 | [image: Using Hydro Erosion on your Landscape]

- To break up the surface of the Landscape even more, use the **Noise tool**. The Noise tool adds random noise to the surface of the Landscape by randomly moving the Landscape vertices up or down or both at the same time. These are the brush settings used to create the sample Landscape in the screenshot below: | Tool Used | Brush Size | Strength Setting | | --- | --- | --- | | **Noise t****ool** | 2048 | 0.29 | [image: Using the Noise Tool on your Landscape]

- Use the **Smooth tool** again to smooth out some of the more jagged areas of the Landscape to give it a more natural look. This can help even out too-deep areas that the player might get stuck in if they fall. These are the brush settings used to adjust the sample Landscape: | Tool Used | Brush Size | Strength Setting | | --- | --- | --- | | **Smooth tool** | 1121 | 0.16 |

To learn more about each sculpting tool, see the Sculpt Mode (-> landscape-sculpt-mode-in-unreal-engine) pages.

## 4 - Creating Landscape Materials

After you finish sculpting the Landscape, add some layered Materials to your project so you can paint your Landscape and give it a real-world look.

### Folder Setup

First, set up some folders to organize your texture and Material content.

> **info:** For more information about working with folders in the Content Browser, see Folders (-> sources-panel-reference-in-unreal-engine).

To create new folders for your Material assets, follow these steps:

- Create a new folder named `Landscape` in your project's **Content** folder.

- Then inside the Landscape folder, create 3 new folders: - `Materials` - `Resources` - `Textures`

Your Landscape folder should look like this:

### Migrating Textures

Now that you have the folders in place, you need to migrate some textures from a Fab sample content project so you have some assets to work with.

To migrate sample textures from the example content to your project, follow these steps:

- In **Epic Games Launcher**, go to **Fab**, search for and select the **Content Examples** project, and click **Add to My Library**.

- In the UE **Library **tab, create and launch a new project based on this Fab Library sample.

- In the **Content Browser**, go to `/Content/ExampleContent/Landscapes/Textures/`.

- Select the following assets: - `T_GroundGrass_D` - `T_GroundGrass_N` - `T_Granite_Rock_visscjf_4K_D` - `T_Granite_Rock_visscjf_4K_N` - `T_Noise_N`

- Right-click your selection and go to **Asset Actions > Migrate**.

- In the **Asset Report** dialog, confirm the list of textures you want to migrate and click **OK**.

- For the destination, go to your Landscape project and select its **Content **folder. Click **Select Folder**.

- Return to your Landscape project, find the migrated textures in the `/Content/ExampleContent/Landscapes/Textures` folder, and move them to the `/Landscape/Textures` folder you created earlier.

### Creating the Landscape Material

To create a material for your Landscape and add your textures, follow these steps:

- Navigate to the **Materials** folder in the **Content Browser**.

- **Right-click** in the **Content Browser** and select **Material** from the asset list.

- Name the newly-created material something that will help you find it, like `M_Landscape` for example.

- Open the material by double-clicking it.

- Select the Material root node (the node that has the same name as your Material). In the Details panel, enable **Use Material Attributes**. The root node’s pins collapse into a single **Material Attributes **pin.

- Add 3 **MakeMaterialAttributes** nodes to the graph, one for each layer you'll paint on your Landscape (grass, rock, and snow). Using the Material Attributes method is useful when creating a Material with layers. You can bundle each layer's properties into a single node and then blend all layers with one Landscape Layer Blend node. > **tip:** To make these nodes take up less space in your graph, you can collapse them or use **SetMaterialAttributes **nodes instead. With **SetMaterialAttributes**, you manually add attributes instead of working with the entire set by default.

- Right-click the Material Graph, search for `landscape`, and add a **LandscapeLayerCoords** UV node. This node helps generate UV coordinates used to map the Landscape Material to the Landscape Actor. [image: Landscape Layer Coordinates UV node]

- Add 5 **Texture Sample** nodes for your textures' color maps and normal maps. Line them up vertically between the **LandscapeCoords **node and Material Attributes nodes.

- Click the top **Texture Sample** node. In the **Details **panel, click the **Texture **list and add the `T_GroundGrass_D` texture. Repeat this process to add the following textures to the remaining **Texture Sample** nodes: - `T_Granite_Rock_visscjf_4K_D` - `T_GroundGrass_N` - `T_Granite_Rock_visscjf_4K_N` - `T_Noise_N`

- Add a **Vector Parameter** (**V + Left-click**), name it **Snow**, and change its **Default Value** to white.

- Connect the **LandscapeCoords **node to the UVs of each of the **Texture Sample** nodes.

- Connect each layer's texture to a **MakeMaterialAttributes **node: - Connect the base color **Texture Sample **nodes' and **Snow **node's **RGB **pins to the corresponding **MakeMaterialAttributes** node's **BaseColor **pin. - Connect the normal **Texture Sample **nodes' **RGB** pins to the corresponding **MakeMaterialAttributes **node's **Normal **pin.

### Layering Textures in the Material

After you add the Material nodes and connect the **LandscapeCoords** to the textures' UVs, it is time to add and set up the **Landscape Layer Blend** node. The **Landscape Layer Blend**
 node blends layers using Weight blending, Height
blending, or Alpha blending. For this tutorial, we'll focus on Weight blending and Height blending:

- **Weight blending** uses each layer's painted weight to determine which to display. Use Weight blending where you want two surfaces to blend seamlessly into each other, such as rock into sand.

- **Height blending** uses each layer's painted weight with an additional height value often taken from the Texture Sample's Alpha channel. Use it when you want one surface to sit naturally on top of another, such as grass or snow on top of dirt or rock. In this tutorial, we'll show an example of height blending on the grass layer.

To layer the textures together in your Material and set up blending, follow these steps:

- Add a** Landscape Layer Blend **node to the Material Graph. The node is empty by default.

- Click the node to select it. In the **Details **panel, next to the **Layers **setting, click the **plus (+)** button until you have 3 layers.

- Enter the following values into the three layers: | Layer Name | Blend Type | Preview Weight | | --- | --- | --- | | Grass | LB **Height **Blend | 0.0 | | Rock | LB Weight Blend | 1.0 | | Snow | LB Weight Blend | 0.0 | > **note:** When you set a layer’s **Blend Type** to **LB Height Blend**, a **Height **pin for that layer appears on the **Layer Blend** node. You'll connect a grayscale height texture to this pin, where lighter values are higher. In areas where layers meet, the layer appears on its high points first, which makes the transition look more natural.

- Connect the layers to the **Landscape Layer Blend** node: - Connect the grass layer's **MakeMaterialAttributes **node to the **Layer Grass **pin. - Connect the rock layer's **MakeMaterialAttributes **node to the **Layer Rock **pin. - Connect the snow layer's **MakeMaterialAttributes **node to the** Layer Snow** pin. - Connect the grass** Texture Sample** node's alpha (**A**) pin to the **Height Grass **pin.

- Connect the Landscape Layer Blend node's output to the Material root node's Material Attributes pin.

- Add 3 **Constant **nodes to control the roughness of each layer and connect them to the **MakeMaterialAttributes **nodes' **Roughness **pins. For example, you could set a Roughness of 0.85 for grass, 0.7 for rock, and 0.5 for snow.

- Right-click each **MakeMaterialAttributes **node and select **Collapse Nodes **to save space in your graph.

- Save your Material. It should look like this:

> **note:** For more in-depth information about using the **Landscape Layer Blend** node or to troubleshoot any issues, please read the Landscape Material (-> landscape-material-expressions-in-unreal-engine) page.
> See the Materials (-> unreal-engine-materials)pages to learn more about Materials in Unreal Engine.

## 5 - Painting a Landscape

With your Landscape Material created, you can now apply the Material to the Landscape and begin using the Paint tools.

### Setting Up the Landscape for Painting

Before you can begin painting the Landscape, there is some setup you need to do first.

To apply your Landscape Material to the Landscape, follow these steps:

- Find your Material in the **Content Browser**. This should be located under a folder labeled **Materials** you created in the previous section. Click on it to select it. [image: Find your material]

- With the Landscape Material selected in the **Content Browser**, select the Landscape in the world. Then in the **Details** panel, expand the **Landscape** section and look for the **Landscape Material** property. [image: Landscape material input]

- Apply the Material to the Landscape using the **Use Selected Asset from the Content Browser** arrow icon. You can also drag the Material asset from the **Content Browser** to the **Details** panel and drop it on the **Landscape Material** input. [image: Apply the material to the Landscape]

After adding the Material, your view should look like this:

[image: Landscape with material applied]

> **tip:** Your Landscape has no paint data yet, so it may look colorless, black, or blue as it reflects the ambient lighting and the color of the sky.

Now that you applied the Landscape Material, you are almost ready to start
painting. Before you can paint, you must create and assign
three **Landscape Layer Info Objects**. If you try to paint before you assign the **Landscape Layer Info Objects**, you get the following warning message.

[image: Layer info warning message]

You need to create three **Landscape Layer Info Objects**, one for each layer that you want to paint.

To set up paint layers, follow these steps:

- In the Landscape tools, click **Paint** mode. [image: Landscape paint mode]

- Above the Layers list, override the **Default Layer Asset Path** and set to your `/Landscape/Resources` folder. In a later step, Ureal Engine creates layer info assets in this folder. Layer info assets can be saved anywhere in your project, but it helps to keep them in one shared folder. A layer like Snow usually has the same settings on every landscape, so one shared asset avoids duplicates scattered across your level folders.

- In the Landscape panel, in the **Target Layers** section, next to **Layers**, click the **Create Layers From Assigned Materials **button.

- Above your layers, click the** Auto-Fill Target Layer Assets** button.

- In the **Auto-Fill Target Layer Assets** dialog, add a checkmark to **Create new assets in the default folder if none are found**, and click** Unassigned Layers Only**.

> **tip:** You'll notice each layer says **No Weight Blending**. This setting is separate from the Blend Type you chose in the Layer Blend node.
> With weight blending, layers share each spot on the landscape: painting more grass means less rock. This works well for ground surfaces like grass, dirt, and rock. Without weight blending, each layer is independent, so you can paint effects like snow or moss on top of other layers without reducing them. To change this setting, open the **Landscape Layer** asset from the **Content Browser**.
> For more information, see Landscape Paint Mode (-> landscape-paint-mode-in-unreal-engine).

### Painting the Landscape

Now that you created and applied the Landscape Layer Info Objects, you can begin to paint your Landscape.  You'll use the **Paint** tool to apply textures to your Landscape.

> **note:** The **Paint **tool is not painting color directly on the Landscape. It is painting weight values which are interpreted by the Landscape Material. In this example, the Material blends the textures based on each target layer's weight, but a Material can use weight values however you like.

To paint a layer on the Landscape, click the layer you want to apply, and press and hold the **Left Mouse Button** to paint that texture on the area under your brush.

> **tip:** If you'd like to start by applying one layer to the entire Landscape so it's no longer black, in the Paint tools, right-click a paint layer and select **Fill Layer**.

[image: Landscape picking layers to paint]

Remember you can use **Ctrl+Z** and **Ctrl+Y** to undo and redo your paint strokes.

> **tip:** When using the Paint tools, you might find it easier to paint over a mistake instead of trying to erase it using **Shift + Left Mouse Button**.
> However, painting over a mistake only works with weight-blended layers. With layers that don’t use weight blending, painting a new layer doesn’t reduce the layers already there. If a layer isn’t showing up or looks mixed with another layer, select the unwanted layer and paint over the area with **Shift + LMB** to decrease its weight.

When you finish painting, you should have something that looks like this.

[image: Landscape final paint]

To learn more about Landscape painting tools, see the Paint Mode (-> landscape-paint-mode-in-unreal-engine) documentation.

### Adjusting the Mapping Scale

The scale of the
Textures on your Landscape can start too big or too small. To fix this,
 open your Landscape Material and select the **Landscape Coords** node. With that node selected, adjust the **Mapping Scale** in the **Details**
 panel and save the Material. When the Material is re-compiled, check
the scale in the viewport. If the scale is not to your liking, repeat the processes above until you get the results you want.

[image: Landscape texture size]

Here is a comparison between a **Mapping Scale** of **0.5** on the Left and **5.0** on the Right.

### Checking Painted Layers

There are two visualization modes you can use to check where your paint layers are blended into your Landscape. In the Viewport toolbar, click Lit (the View mode settings menu), go to Visualizers, and select Layer Usage or Layer Debug. For example, the Layer Debug view shows where each layer appears on the Landscape and where layers are blended.

## 6 - External Creation Tools

While the default Landscape tools do have the ability to meet all of
your sculpting and painting needs, there could be some situations where
you might want some extra control over your Landscape's look and feel.
The following is a list of software packages that could help you obtain
the results you are looking for if you cannot get them from using the
Landscape tools.

| Tool | Description |
| --- | --- |
| Houdini | Procedural terrain generation in Houdini uses a collection of heightfield nodes to let you use layer shapes and add noise to define the look of your digital landscapes. Use advanced erosion tools for more control over details such as fluvial lines, river banks, debris, and new hierarchical scattering for more efficient placement of elements into landscapes. You can then export height and/or mask layers to create terrain in UE5, or you can wrap up your terrain networks into Houdini Digital Assets that will open up in UE5 using the Houdini Engine plug-in. When Digital Assets include heightfield nodes, they will integrate seamlessly with Unreal Engine's native Terrain tools. |
| Mudbox | While primarily a tool for digital sculpting and painting 3D meshes, Mudbox can also be used to generate heightmap data for your Landscape. You can read more about how Mudbox might be able to help you out with your Landscape by checking out their website. |
| Terragen | Terragen is another powerful fully procedural terrain creation software. Much like World Machine, it can be used to build, texture, and export both heightmaps and textures for your Landscape. You can read more about how Terragen might be able to help you out with your Landscape by checking out their website. |
| World Machine | World Machine is a powerful procedural terrain creation software. It can be used to build, texture, and export both heightmaps and textures for your Landscape. You can read more about how World Machine might be able to help you out with your Landscape by checking out their website. |
| ZBrush | ZBrush is another digital sculpting and painting tool that can be used to generate heightmap data for your Landscape. You can read more about how ZBrush might be able to help you out with your Landscape by checking out their website. |
