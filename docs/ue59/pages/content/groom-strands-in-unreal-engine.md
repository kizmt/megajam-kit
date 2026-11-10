# Groom Strands

https://dev.epicgames.com/documentation/en-us/unreal-engine/groom-strands-in-unreal-engine?application_version=5.9

> Configure settings for strand geometry.

[image: Groom Strands]

The **Strands** panel in the Groom Asset Editor (-> groom-asset-editor-user-guide-in-unreal-engine) is where you can configure settings for the strand geometry that makes up your groom. Each groom is divided into groups, and each group has its own properties and settings.

 [image: Groom Asset Editor Strands Properties Panel]

The top part of each hair group displays statistics about that grouping. This includes:

 [image: Groom Asset Editor LOD Groups]

- Number of curves and points for rendered **strands**.

- Number of curves and points for **guides**.

- **Maximum width** of individual rendered strands.

- The minimum, maximum, and average number of **points per curve**.

- The groom's available **attributes**, such as Root UV, per point color, clump IDs, and so on.

The following settings are part of every hair group:

 [image: Groom Asset Editor Strands Group Properties]

| Property | Description |
| --- | --- |
| **Material** | Material used for the rendering strands. |
| **Hair Width** | Specifies the width of the hair in centimeters. |
| **Hair Root Scale** | Scaling factor applied in each curve root, and linearly interpolated from the root to the tip. |
| **Hair Tip Scale** | Scaling factor applied on each curve tip, and linearly interpolated from the root to the tip. |
| **Hair Shadow Density** | Scaling factor applied on voxelization to increase or decrease hair transmission. |
| **Hair Raytracing Radius Scale** | Scaling factor applied on hair geometry being ray-traced. Only applied when Hardware Ray Tracing is enabled. |
| **Use Hair Raytracing Geometry** | Enables ray tracing to use hair geometry. When not in use, ray tracing effects like shadows use the hair voxelization as a geometry proxy. |
| **Voxelize** | Enable strands voxelization for casting shadows and environment occlusion. |
| **Use Stable Rasterization** | When enabled, this ensures that hair geometry is snapped to pixels to avoid aliasing. Groups of hair might appear thicker, while isolated hair should remain thin. This should be used only on grooms with small and scattered hair. |
| **Scatter Scene Lighting** | When enabled, hair is lit with the scene color. You can use this for vellus and short hair to bring light from the surrounding surfaces, like skin. |

## Visualizing Hair Groups

You can visualize the different groups within a groom asset by selecting **View > Groups** within the preview window. The color of each group matches the color of the **Group ID** sections within the **Strands** details panel.

 [image: Groom Asset Editor Strands Group ID visualization]

The color of the hair groups in the preview window match that of the colored Group IDs in the Strands details panel.

- rendering
- physics
- hair
- metahumans
- grooms

On this page

- Visualizing Hair Groups (-> groom-strands-in-unreal-engine)
