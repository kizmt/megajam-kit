# Navigation Mesh Resolutions User Guide

https://dev.epicgames.com/documentation/en-us/unreal-engine/navigation-mesh-resolutions-user-guide?application_version=5.9

> This guide will teach you how to use multiple resolutions within the same Navigation Mesh in Unreal Engine.

[image: Navigation Mesh Resolutions User Guide]

## Overview

The **Navigation Mesh Resolutions** feature gives users the ability to generate Navigation Mesh tiles at 3 different resolutions within the same Navigation Mesh. Users can now generate groups of tiles with a high, medium (default), or low precision setting, which can result in improvements in the generation speed of a dynamic Navigation Mesh at runtime.

In this instance, Navigation Mesh resolution refers to the accuracy and number of cells generated to cover a given navigation space. For example, a high resolution tile might subdivide a given space with more polygons to better approximate the shape of the space. However, a low resolution tile will cover the same space, but use fewer polygons. This results in faster generation of the tiles, at the cost of accuracy.

### Common Use Cases

Users can benefit from this feature in the following use cases:

| Use Case | Description |
| --- | --- |
| **Improve Generation Speed** | When using Dynamic Navigation Meshes, use low resolution tiles in open spaces or areas where AI Agents don't need good navigation accuracy. Only use default or high resolution tiles in dense areas where AI Agents need to navigate smaller spaces between obstacles. |
| **Reduce Memory Footprint** | Using low resolution tiles for your Navigation Mesh will result in a smaller memory footprint compared to using default or high resolution tiles. This can benefit games running on hardware with limited memory (like mobile). |

## Use Multiple Resolutions with your Navigation Mesh

- Click **Add + > Volumes > Nav Mesh Bounds Volume** to place a **Navigation Mesh Bounds Volume** in your level. Press '**P**' to visualize the Navigation Mesh. [image: Add a Nav Mesh Bounds volume to your level] [image: Press P to visualize the Navigation Mesh]

- Select the **RecastNavMesh-Default** Actor in the **Outliner** window. Go to the **Details** panel and **enable** the **Draw Tile Build Times** checkbox. This shows you the time in milliseconds that it took to build each Navigation Mesh tile. [image: In the Details panel, enable the Draw Tile Build Times checkbox] [image: The Navigation Mesh tiles will show their build times]

- Click **Add + > Volumes > Nav Modifier Volume** to place a **Navigation Modifier Volume** in your level. Place your Modifier Volume so it overlaps with several Navigation Mesh tiles. [image: Add a Navigation Modifier volume to your level] [image: Place the Navigation Modifier volume so it overlaps with the Navigation Mesh]

- With the **Navigation Modifier** volume selected, go to the **Details** panel, then click the **Nav Mesh Resolution** dropdown and select **Low**. You can see how the build times are significantly reduced within the Navigation Modifier Volume. [image: Click the Nav Mesh Resolution dropdown and select Low] [image: The build times are reduced within the Navigation Modifier Volume]

- You can modify Navigation Mesh tile resolutions by using a **Nav Modifier** component inside an Actor Blueprint. Add the NavModifier component, then go to the **Details** panel. Select your desired resolution from the **Nav Mesh Resolution** dropdown. [image: Add the NavModifier component to your Blueprint Actor] [image: Select your desired resolution from the Nav Mesh Resolution dropdown]

- In the example below, we created an Actor Blueprint and added the **NavModifier** component. Then, we selected the **Low** resolution setting. Notice how the Navigation tiles are rebuilt as the Actor is dragged along the **Navigation Mesh** volume. [image: As we move the Actor, the Navigation Mesh tiles are rebuilt in real time]

## Navigation Mesh Resolution Can Affect Agent Navigation

The Navigation Mesh tile resolution can affect AI Agent navigation pathing. This is especially true when the Agent must navigate between close obstacles or tight spaces.

In the image below, we added 3 obstacles to our Navigation Mesh and set the tile resolution to **Low**. Notice how there is no available path between the bottom two obstacles. This is because there isn't enough resolution available to create the polygons between those obstacles.

 [image: The Agent cannot go between the bottom two obstacles]

In the example below, we changed the tile resolution to **Default**. This resolution allows for higher density of polygons, which results in an available path between the bottom two obstacles. In this example the Agent can navigate between those obstacles and its pathing is optimized (straight line).

 [image: The Agent can now go between the bottom two obstacles]

## Optimal Settings

You can change the Navigation Mesh tile resolution settings by following these steps:

- Click **Settings > Project Settings** to open the **Project Settings**. [image: Open the Project Settings]

- Click on the **Navigation Mesh** category and scroll down to the **Generation** section. Expand the **Nav Mesh Resolution Params** struct to see the settings for each resolution level. [image: Expand the Nav Mesh Resolution Params struct]

- You can now change the **Cell Size** for each resolution level. The bigger the Cell Size, the faster it will generate. [image: Change the Cell Size for each resolution level]

For optimal performance, you can set each Cell Size as a multiple of each other and ensure the **Tile Size UU** is divisible by all the **Cell Sizes**.

## Debug Tools

You can access the Navigation Mesh tile resolution debug tools by selecting the **RecastNavMesh-Default** Actor in the **Outliner** window and going to the **Details** panel.

## Draw Tile Resolutions

Enable the **Draw Tile Resolutions** checkbox to visualize the resolution of each tile by a different color. The table below shows how each color is related to the tile resolution.

| Resolution | Color |
| --- | --- |
| **Blue** | Low resolution. |
| **Green** | Default resolution. |
| **Yellow** | High resolution. |

 [image: Enable the Draw Tile Resolutions checkbox]
 [image: Each tile color represents a different resolution]

## Build Times Heat Map

You can enable the **Draw Tile Build Times Heat Map** checkbox to visualize a heatmap of tile build times in your Navigation Mesh. Each color represents a build time range, with light blue representing low build time and red representing high build time.

 [image: Enable the Draw Tile Build Times Heat Map checkbox]
 [image: A build heatmap is displayed in the Navigation Mesh]

- ai
- navigation

On this page

- Overview (-> navigation-mesh-resolutions-user-guide)
- Common Use Cases (-> navigation-mesh-resolutions-user-guide)
- Use Multiple Resolutions with your Navigation Mesh (-> navigation-mesh-resolutions-user-guide)
- Navigation Mesh Resolution Can Affect Agent Navigation (-> navigation-mesh-resolutions-user-guide)
- Optimal Settings (-> navigation-mesh-resolutions-user-guide)
- Debug Tools (-> navigation-mesh-resolutions-user-guide)
- Draw Tile Resolutions (-> navigation-mesh-resolutions-user-guide)
- Build Times Heat Map (-> navigation-mesh-resolutions-user-guide)
