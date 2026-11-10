# Color Management in nDisplay

https://dev.epicgames.com/documentation/en-us/unreal-engine/color-management-in-ndisplay-in-unreal-engine?application_version=5.9

> Using nDisplay color management tools.

[image: Color Management in nDisplay]

nDisplay includes color management tools so you can apply color grading and OpenColorIO (OCIO) configurations to your displays without modifying the overall look of the Unreal project itself. These color settings can be applied to the entire nDisplay cluster, or to individual viewports and cluster nodes.

Typically, you'll want to use these nDisplay-specific color management tools after you've achieved the desired look for the project. These tools are useful for tuning the look of the content as it appears on specific displays.

The settings are exposed in the nDisplay 3D Config Editor, and also in the nDisplay Root Actor for rapid iterations. Changes made to the nDisplay Root Actor can be tracked by Level Snapshots (-> level-snapshots-in-unreal-engine).

Changes made to the nDisplay Config Asset are saved in the UAsset. Changes made to the nDisplay Root Actor are only on the instance of the config asset, and won't be saved in the UAsset.

The following sections describe how you can use color grading and OpenColorIO with your nDisplay setup.

## Color Grading

The overall behavior of the color grading settings is identical to Post Process Volume (-> color-grading-and-the-filmic-tonemapper-in-unreal-engine), with additional options provided for more specific control between nDisplay viewports and cluster nodes. For more information on the settings exposed in nDisplay, see nDisplay Root Actor Reference (-> ndisplay-root-actor-reference-for-unreal-engine).

Color grading is additive: when multiple color grading settings are enabled, they are applied in order like a stack. For example, if one color grading setting applies red, and another applies blue, the resulting color will be purple, a mix of the two.

The following sections describe the behavior of color grading when it's applied to different parts of the nDisplay cluster.

### Viewports

Color grading is applied to a viewport in the following order if they're enabled:

- Post Process Volume

- nDisplay Root Actor's Entire Cluster Color Grading

- nDisplay Root Actor's Per-Viewport Color Grading

When color grading is enabled for the entire cluster on the nDisplay Root Actor, the settings will be applied consistently to every viewport and inner frustum. The example below shows a before and after: the nDisplay cluster with color grading disabled, and the nDisplay cluster with a blue color applied.

 [image: Enable color grading for the entire cluster]
 [image: Enitire Cluster Color Grading Disabled]

 [image: Entire Cluster Color Grading Enabled]

You can also apply color grading to specific viewports in the nDisplay cluster. This is useful for when content appears to have different colors across different models and brands of displays.

In the example below, a separate color grading is only applied to the viewport rendered on the ceiling panel. The resulting color is purple because color grading is additive. The red color applied to the viewport is mixed with the blue color applied to the entire cluster.

 [image: Enable color grading on a per-viewport basis]
 [image: image alt text]

You can choose to not include the color grading settings from the entire cluster on a per-viewport scope as well. In the example below, the **Include Entire Cluster Color Grading** is unchecked for the ceiling viewport. The color of the ceiling panel turns red, because it still applies the Per-Viewport Color Grading even when the Entire Cluster Color Grading is not included.

 [image: Disabling Entire Cluster Color Grading for one viewport]
 [image: image alt text]

### Inner Frustum

Color grading is applied to the inner frustum in the following order if they're enabled:

- Post Process Volume

- nDisplay Root Actor's Entire Cluster Color Grading

- ICVFX Camera Component's All Nodes Color Grading

- ICVFX Camera Component's Per-Node Color Grading

The nDisplay Root Actor's Per-Viewport Color Grading settings will only be applied to the outer frustum. It will not affect the inner frustum.

When color grading is enabled for All Nodes on the ICVFX Camera Component, the settings will be applied to the inner frustum consistently across all cluster nodes and viewports.

 [image: Enabling inner frustum color grading for all nodes]
 [image: image alt text]

You can also apply color grading to specific cluster nodes in the nDisplay cluster. This is useful for when content appears to have different colors across different models and brands of displays.

The finest granularity of control for the inner frustum in the nDisplay cluster is per-node. This is because the inner frustum can be shared across multiple viewports when mGPU is enabled.

In the example below, a separate color grading is applied to the cluster node containing the ceiling panels. When the inner frustum moves from the back panel to the ceiling, you can see the change in color on the inner frustum.

 [image: Enabling per-node inner frustum color grading]
 [image: image alt text]

## OpenColorIO (OCIO)

The overall behavior of the OCIO settings for nDisplay is identical to OCIO (-> color-management-with-opencolorio-in-unreal-engine) for the Editor, with additional options provided for more specific control between nDisplay viewports and cluster nodes. For more information on the settings exposed in nDisplay, see nDisplay Root Actor Reference (-> ndisplay-root-actor-reference-for-unreal-engine).

Unlike color grading, OCIO settings are not additive. Typically, you will set a base OCIO profile for all viewports and the inner frustum, but can override these settings per-viewport or per-node. The OCIO profile you set for nDisplay renders will also override the OCIO profile set for the Editor.

A general OpenColorIO config is provided in the OpenColorIO Plugin's content as a starting point for using OCIO in your project. This config should be useful for most combinations of cameras and panels, but you may need to modify it for your project's needs. For in-camera VFX scenarios, you'll typically want a different **Destination Color Space** value for each combination of camera and panel that you use in your set up.

The example below shows an nDisplay cluster before applying an OCIO config to the entire cluster and the nDisplay cluster after applying the config.

 [image: Viewport OCIO Disabled]

 [image: Viewport OCIO Enabled]

Similar to the functionality for Color Grading, you can apply an OCIO configuration per viewport on the nDisplay Root Actor, in addition to the entire cluster. You can also apply an OCIO configuration on the inner frustum for all, or a subset of all, cluster nodes on the ICVFX Camera Component.

Ensure that the same viewport or node is not included in multiple OCIO overrides, since only one OCIO profile can be applied. If you do have multiple overrides connected to a viewport or node, the OCIO profile from the last override listed will be the one that is applied.

- vfx
- ndisplay

On this page

- Color Grading (-> color-management-in-ndisplay-in-unreal-engine)
- Viewports (-> color-management-in-ndisplay-in-unreal-engine)
- Inner Frustum (-> color-management-in-ndisplay-in-unreal-engine)
- OpenColorIO (OCIO) (-> color-management-in-ndisplay-in-unreal-engine)
