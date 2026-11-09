# Ambient Lighting Volumes

https://dev.epicgames.com/documentation/en-us/unreal-engine/ambient-lighting-volumes-in-unreal-engine?application_version=5.9

> Use Ambient Lighting Volumes to darken or tint the diffuse sky lighting inside a box or sphere.

Learn to use this **Experimental** feature, but use caution when shipping with it.

An **Ambient Lighting Volume** is a placeable box or sphere that tints the diffuse sky lighting on surfaces inside it. Use one where a single Sky Light (-> sky-lights-in-unreal-engine) lights the whole level too evenly: to darken the ambient light under a bridge or in an alley, or to give one area a colored cast, without adding lights or changing the Sky Light itself. Each volume fades out softly at its edges, and you can overlap several of them.

Ambient Lighting Volumes work on top of a Movable Sky Light, when Lumen isn't the global illumination method. They tint only the sky's diffuse contribution: direct lights, reflections, and baked lighting are unaffected.

## Enabling Ambient Lighting Volumes in a Project

Ambient Lighting Volumes are supported by default, so you can place one in any project without changing a setting. The support is controlled by **Support Ambient Lighting Volumes** in **Project Settings > Engine > Rendering > Optimizations**. If your project doesn't use Ambient Lighting Volumes, you can disable this setting to remove their shader code and save some performance. Changing this setting requires an editor restart.

You'll find the **Ambient Lighting Volume** actor in the **Lights** category of the **Place Actors** panel, after the **Sky Light**.

## What an Ambient Lighting Volume Tints

An Ambient Lighting Volume multiplies the diffuse sky lighting on surfaces inside it by its **Tint** color. Tint values range from 0 to 1, so a volume can only darken or color the sky lighting, never brighten it. A white tint leaves the lighting unchanged, and black removes the sky's diffuse contribution completely. The default tint is a mid gray, which halves the sky lighting inside the volume.

The volume affects the lighting on opaque surfaces, based on where each pixel is in the world. It isn't a fog or a visible effect on its own: an Ambient Lighting Volume in empty space, with no surfaces inside it, doesn't change the image.

## Volume Shape and Soft Transition

Each volume is either a box or a sphere, set by **Volume Shape**. You size the volume with the actor's **Scale**, not with a separate extent property. The volume's half-size in each axis, or its radius, equals the scale in centimeters. A newly placed volume has a scale of 500, which makes a 10-meter box. You can rotate a box volume, and scaling a sphere unevenly makes an ellipsoid.

**Soft Transition Distance** sets how far inside the volume's boundary the tint fades from full strength to nothing. The fade happens inside the volume, so the outer boundary is where the volume's influence ends. In the viewport, the volume shows two wireframes: the outer boundary, and an inner one where the tint reaches full strength. The default is 50 cm.

## Overlapping Volumes

Where volumes overlap, their tints multiply. Two volumes with the default gray tint darken the overlap to a quarter of the original sky lighting. Because the tints multiply, the order in which volumes are applied doesn't change the result.

Each view applies up to 32 volumes. When more than that are in view, the renderer keeps the volumes with the highest **Volume Sort Priority**, and then the ones closest to the camera, and ignores the rest. Raise a volume's priority to make sure it's kept. Volumes whose tint is white have no effect, so the renderer skips them.

## Using Ambient Lighting Volumes

### Placing an Ambient Lighting Volume

- Make sure your level has a **Sky Light** with its **Mobility** set to **Movable**.
- In the **Place Actors** panel, open the **Lights** category and drag **Ambient Lighting Volume** into the level. You can also use the **Add** menu in the main toolbar: under **Place Actors**, open **Lights** and choose **Ambient Lighting Volume**.
- Move, rotate, and scale the volume to cover the area you want to tint.
- In the **Details** panel, set **Tint** to the color you want to multiply the sky lighting by.
- Adjust **Soft Transition Distance** until the edge of the effect blends into the surrounding lighting.

### Tinting at Runtime with Blueprint

To change a volume's tint during gameplay, for example to darken an area as an event happens, call **Set Tint** on its **Ambient Lighting Volume** component. Set Tint clamps the color to the 0 to 1 range. The other properties are read-only in Blueprint, but because the component is Movable, you can move and scale the volume at runtime. You can also add an **Ambient Lighting Volume** component to your own Blueprint actors.

**Volume Shape**, **Tint**, and **Soft Transition Distance** can also be animated in Sequencer.

### Visualizing Ambient Lighting Volumes

To see where volumes apply, enable the **Ambient Lighting Volumes** visualization in the viewport's **Show > Visualize** menu. It overlays the screen with a color for the number of volumes that affect each screen tile, and shows the number of visible volumes. This visualization is available in the editor only.

## Ambient Lighting Volume Settings

### Details Panel

These settings control the volume's shape, its tint, and how it fades at its edges.

|  |  |
| --- | --- |
| **Property** | **Description** |
| **Volume Shape** | The shape of the volume: **Box** or **Sphere**. The actor's scale sets its size. |
| **Tint** | The color that the sky lighting is multiplied by inside the volume, from 0 to 1 per channel. White has no effect. The default is a mid gray. |
| **Soft Transition Distance** | The distance, in centimeters, over which the volume's influence fades from full to zero, measured inward from its boundary. The minimum is 0.1. |

### Sorting

This setting decides which volumes are kept when more volumes are in view than the renderer applies.

|  |  |
| --- | --- |
| **Property** | **Description** |
| **Volume Sort Priority** | Overrides the sorting by distance, from -127 to 127. A volume with a lower value is treated as farther away, so when too many volumes are in view, volumes with lower values are dropped first. |

### Project Settings

|  |  |
| --- | --- |
| **Property** | **Description** |
| **Support Ambient Lighting Volumes** | Enables rendering support for Ambient Lighting Volumes. Disable it if your project doesn't use them, for better performance. Requires an editor restart. Enabled by default. |

## Limitations in This Release

- **Movable Sky Lights only.** The volume tints dynamic sky lighting. Static and Stationary Sky Lights have their diffuse lighting baked, so the volume has no effect on it.
- **No effect with Lumen global illumination.** When Lumen is the **Dynamic Global Illumination Method**, Lumen provides the sky lighting, and Ambient Lighting Volumes don't change it.
- **Diffuse only.** Reflections from the sky, reflection captures, Screen Space Reflections, and Lumen reflections aren't tinted, so shiny surfaces can look brighter than their surroundings inside a dark volume.
- **Opaque surfaces only.** Translucent materials and volumetric fog aren't affected.
- **Desktop renderer requirements.** On the desktop renderer, the volume works with the deferred renderer when the project uses Substrate materials. It has no effect with the forward renderer or with ray traced sky lighting.
- **Mobile.** On mobile, the volume works with the mobile deferred renderer only.
- **Up to 32 volumes per view.** Beyond that, the lowest-priority and farthest volumes are ignored.

## Troubleshooting

### An Ambient Lighting Volume has no effect

Check these causes in order:

- The level's Sky Light isn't Movable, or the level has no Sky Light.
- The project uses Lumen for global illumination.
- The volume's **Tint** is white.
- The surfaces you're looking at are translucent, or the effect you expect is in reflections.
- The project doesn't use Substrate, or it uses the forward renderer.
- **Support Ambient Lighting Volumes** is disabled in the project settings. In this case, the viewport shows the message: "There are Ambient Lighting Volumes in the scene, but your project does not support rendering them. This can be enabled from the project settings panel (`r.SupportAmbientLightingVolumes`)." Enable the setting and restart the editor.

### The edge of the tinted area is a hard line

Increase **Soft Transition Distance**. Remember that the fade happens inside the volume, so you may need to scale the volume up to keep full strength over the same area.

## Additional Notes

### Performance

When volumes are in view, the renderer runs a compute pass that sorts them into screen tiles, then tests each pixel against the volumes in its tile during the sky lighting pass. This work appears as **AmbientLightingVolumes** in the GPU profiler. Volumes with a white tint cost nothing. If you don't use the feature, disabling **Support Ambient Lighting Volumes** removes its shader code entirely.

### Data Layers and World Partition

Ambient Lighting Volumes can be assigned to Data Layers and can be spatially loaded in World Partition levels, like other placed actors.

## More Information

- Sky Lights (-> sky-lights-in-unreal-engine)
- Local Fog Volumes (-> local-fog-volumes-in-unreal-engine)
- Lumen Global Illumination and Reflections (-> lumen-global-illumination-and-reflections-in-unreal-engine)
- Distance Field Ambient Occlusion (-> distance-field-ambient-occlusion-in-unreal-engine)

On this page

- Enabling Ambient Lighting Volumes in a Project (-> ambient-lighting-volumes-in-unreal-engine)
- What an Ambient Lighting Volume Tints (-> ambient-lighting-volumes-in-unreal-engine)
- Volume Shape and Soft Transition (-> ambient-lighting-volumes-in-unreal-engine)
- Overlapping Volumes (-> ambient-lighting-volumes-in-unreal-engine)
- Using Ambient Lighting Volumes (-> ambient-lighting-volumes-in-unreal-engine)
- Placing an Ambient Lighting Volume (-> ambient-lighting-volumes-in-unreal-engine)
- Tinting at Runtime with Blueprint (-> ambient-lighting-volumes-in-unreal-engine)
- Visualizing Ambient Lighting Volumes (-> ambient-lighting-volumes-in-unreal-engine)
- Ambient Lighting Volume Settings (-> ambient-lighting-volumes-in-unreal-engine)
- Details Panel (-> ambient-lighting-volumes-in-unreal-engine)
- Sorting (-> ambient-lighting-volumes-in-unreal-engine)
- Project Settings (-> ambient-lighting-volumes-in-unreal-engine)
- Limitations in This Release (-> ambient-lighting-volumes-in-unreal-engine)
- Troubleshooting (-> ambient-lighting-volumes-in-unreal-engine)
- An Ambient Lighting Volume has no effect (-> ambient-lighting-volumes-in-unreal-engine)
- The edge of the tinted area is a hard line (-> ambient-lighting-volumes-in-unreal-engine)
- Additional Notes (-> ambient-lighting-volumes-in-unreal-engine)
- Performance (-> ambient-lighting-volumes-in-unreal-engine)
- Data Layers and World Partition (-> ambient-lighting-volumes-in-unreal-engine)
- More Information (-> ambient-lighting-volumes-in-unreal-engine)
