# Landscape Ramp Tool

https://dev.epicgames.com/documentation/en-us/unreal-engine/landscape-ramp-tool-in-unreal-engine?application_version=5.9

> This is an overview of the Ramp painting tool.

[image: Landscape Ramp Tool]

The **Ramp** tool enables you to select two locations on your Landscape and create a flat ramp between the two points, with a falloff you specify for the sides.

## Using the Ramp Tool

- In the Landscape toolbar, in the **Sculpt** tab, select the **Ramp** tool. [image: Ramp Selection]

- In the viewport, **Left-click** and drag or simply Left-click in two different places on your Landscape to mark the beginning and end points of the ramp. [image: Beginning And End Points Of The Ramp] If you change your mind about adding a ramp after starting to set the beginning and end points, you can click **Reset** to clear them.

- Select either marker and adjust its position. In this case, it has been moved along the Z-axis above the Landscape surface. [image: Moved Ramp]

- When you are satisfied with the position, click the **Add Ramp** button in the Tool Settings to create the ramp. [image: Add Ramp] Now you have a ramp that has been sculpted into your heightmap. [image: Ramp]

## Tool Settings

|  |  |
| --- | --- |
| [image: Ramp Tool] | [image: Ramp Tool Properties] |

| **Property** | **Description** |
| --- | --- |
| **Ramp Width** | Sets the width of the ramp. |
| **Side Falloff** | Sets the edge falloff on the sides of the ramp where it merges inot the rest of the landscape. This falloff gives a softness to the edge flow on these sides. A setting of **0** means no falloff; a setting of **1** means all falloff and no flat surface for the ramp. |

- landscape

On this page

- Using the Ramp Tool (-> landscape-ramp-tool-in-unreal-engine)
- Tool Settings (-> landscape-ramp-tool-in-unreal-engine)
