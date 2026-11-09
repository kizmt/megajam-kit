# Landscape Erosion Tool

https://dev.epicgames.com/documentation/en-us/unreal-engine/landscape-erosion-tool-in-unreal-engine?application_version=5.9

> This is an overview of the Erosion painting tool.

[image: Landscape Erosion Tool]

The **Erosion** tool uses a thermal erosion simulation to adjust the height of the Landscape heightmap. This simulates the transfer of soil from higher elevations to lower elevations by natural forces. The
larger the difference in elevation, the more erosion will occur. This tool also applies a noise effect on top of the erosion, if desired, to provide a more natural random appearance.

## Using the Erosion Tool

In the example above, the Erosion tool is being used on the front and back sides of the mountain face. On the front side, the incline is not as steep, so the surface is not eroded as quickly with the
settings being used. However, on the back side, the incline is much steeper and erodes much more quickly.

Use the following controls to sculpt with Erosion for your Landscape heightmap:

| Controls | Operation |
| --- | --- |
| **Left Mouse Button** | Applies erosion values that raises, lowers, or does both to the heightmap. |

 [image: Before]

 [image: After]

In the example above, Erosion is used to smooth out the more jagged regions of a hill that is being sculpted using the Sculpt tool and an alpha brush. Erosion uses noise painted onto the hillside to raise or lower the surface giving it variations in different heights based on the strength and various property values that are used.

## Tool Settings

|  |  |
| --- | --- |
| [image: Erosion Tool] | [image: Erosion Tool Properties] |

| Property | Description |
| --- | --- |
| **Tool Strength** | Controls how much effect each brush stroke has. |
| **Combined Layers Operation** | Uses the combined result of all underlying Edit Layers, when checked. |
| **Threshold** | The minimum height difference necessary for the erosion effects to be applied. Smaller values will result in more erosion being applied. |
| **Surface Thickness** | The thickness of the surface for the layer weight erosion effect. |
| **Iterations** | The number of iterations performed. Larger values result in more levels of erosion. |
| **Noise Mode** | Whether to apply noise to raise or lower the heightmap, or do both:**Both**: Raises and lowers values for all erosion effects applied to the heightmap.**Raise**: Applies erosion effects that result in raising the heightmap.**Lower**: Applies erosion effects that result in lowering the heightmap. |
| **Noise Scale** | The size of the noise filter used. The noise filter is related to position and scale, which means if you do not change **Noise Scale**, the same filter is applied to the same position many times. |
| **Use Layer Hardness** | Determines whether the tool should take into account the layer's hardness parameter. |

- landscape

On this page

- Using the Erosion Tool (-> landscape-erosion-tool-in-unreal-engine)
- Tool Settings (-> landscape-erosion-tool-in-unreal-engine)
