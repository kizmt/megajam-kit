# Landscape Smooth Tool

https://dev.epicgames.com/documentation/en-us/unreal-engine/landscape-smooth-tool-in-unreal-engine?application_version=5.9

> This is an overview of the Smooth painting tool.

[image: Landscape Smooth Tool]

The **Smooth** tool will soften the heightmaps painted values to give your Landscape a smoother flow and appearance by getting rid of jagged artifacts that can sometimes happen after using the Sculpting or Erosion tools.

## Using the Smooth Tool

In this example, the Smooth tool is used to soften some of the harder edge artifacts that can happen when using the various Landscape tools.

Use the following controls to sculpt your Landscape heightmap:

| **Controls** | **Operation** |
| --- | --- |
| **Left Mouse Button** | Smoothens and softens the heightmap or selected layer's weight. |

 [image: Before Smoothing]

 [image: After Smoothing]

The Brush Strength determines the amount of smoothing that can happen when using the Smooth tool.

## Tool Settings

|  |  |
| --- | --- |
| [image: Landscape Smooth Button] | [image: Smooth Tool Properties] |

| **Property** | **Description** |
| --- | --- |
| **Tool Strength** | Controls how much smoothing occurs with each brush stroke. |
| **Filter Kernel Scale** | Sets the scale multiplier for the smoothing filter kernel for the radius that smoothing will be performed over. Higher values smooth out bigger details, while lower values only smooth out smaller details. |
| **Detail Smooth** | If checked, performs a detail-preserving smoothing using the specified detail-smoothing value. Larger-detail smoothing values remove more details, while smaller values preserve more details. |

- landscape

On this page

- Using the Smooth Tool (-> landscape-smooth-tool-in-unreal-engine)
- Tool Settings (-> landscape-smooth-tool-in-unreal-engine)
