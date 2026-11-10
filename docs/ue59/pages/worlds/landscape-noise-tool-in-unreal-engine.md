# Landscape Noise Tool

https://dev.epicgames.com/documentation/en-us/unreal-engine/landscape-noise-tool-in-unreal-engine?application_version=5.9

> This is an overview of the Noise painting tool.

[image: Landscape Noise Tool]

The **Noise** tool applies a noise filter to produce variations in the surface of the Landscape heightmap.

## Using the Noise Tool

In this example, the Noise tool is used to paint on the Landscape, similarly to how Sculpt would be used. Variations are painted around the area that raise and lower the heightmap based
on the tool settings. This enables you to paint grand or subtle variations into your Landscape.

Use the left mouse button control to sculpt with Noise for your Landscape heightmap:

| Controls | Operation |
| --- | --- |
| **Left Mouse Button** | Heightens or increases the heightmap or selected layer's weight. |

 [image: Before]

 [image: After]

In this example, Noise has been painted onto the smooth Landscape surface giving it variations in different heights based on the strength and property values used.

## Tool Settings

|  |  |
| --- | --- |
| [image: Noise Tool] | [image: Noise Tool Properties] |

| Property | Description |
| --- | --- |
| **Tool Strength** | Controls how much effect each brush stroke has. |
| **Noise Mode** | Determines whether to apply: all noise effects, only the noise effects that result in raising the heightmap, or only the noise effects that result in lowering the heightmap.**Both**: Raises and lowers values (for painted values of Noise) to the heightmap when the mouse click is activated.**Add**: Raises values (when painting Noise to the heightmap) when the mouse click is activated.**Sub**: Lowers values (when painting Noise to the heightmap) when the mouse click is activated. |
| **Noise Scale** | The size of the perlin noise filter used. The noise filter is related to position and scale, which means if you do not change **Noise Scale**, the same filter is applied to the same position many times. |

The brush strength determines the amount of raising or lowering that can happen when using the Noise tool.

- landscape

On this page

- Using the Noise Tool (-> landscape-noise-tool-in-unreal-engine)
- Tool Settings (-> landscape-noise-tool-in-unreal-engine)
