# Mobile Depth of Field

https://dev.epicgames.com/documentation/en-us/unreal-engine/mobile-depth-of-field-in-unreal-engine?application_version=5.9

> Setting up and using depth of field on mobile platforms.

[image: Mobile Depth of Field]

The following depth of field (DOF) method provides an optimized and low-cost depth of field effect for mobile platforms using the Forward rendering path.

## Gaussian

Gaussian depth of field has been removed for use with the **Deferred Renderer** and **Desktop Forward Renderer** and only supports mobile platforms. To use this Gaussian DOF while working in Editor on a desktop computer, enable one of the mobile platform previewers using the Mobile Previewer.

The **Gaussian** depth of field method blurs the scene using a standard Gaussian blur (or smoothing) function. Gaussian DOF blur foreground and background uses a fixed-size Gaussian blur kernel, which is very fast on lower-end hardware, such as mobile. This enables performance to be maintained with lower overhead costs where performance is critical.

 [image: No Depth of Field]

 [image: Gaussian Depth of Field]

## Visualizing Depth of Field

These layers, including transition regions, can be visualized using the **Depth of Field layers** show flag in the Level Viewport under **Show > Visualize**.

 [image: Final Scene]

 [image: Depth of Field Visualization]

Visualizing the **Depth of Field Layers** also includes useful information relevant to the DOF method selected by including the properties and their currently set values.

 [image: Information relevant to the DOF method selected by including the properties and their currently set values]

## Focal Distance

The **Focal Distance **represents the focal region and the angle of view that will be captured. A longer focal length has a shallow depth of field causing objects to be more blurred outside of the focal region while shorter focal lengths have a wider depth of field with sharper focus and fewer objects out of focus. The f-stop number can stay the same and changing the lens size adjusts how shallow or wide the depth of field effect is.

Click image for full size.

Once you've set the **Focal Distance** and the **Focal Region**, you can use the **Near Transition** and **Far Transition** to adjust the distance between the focal region and the fully blurred scene. In addition, you can even adjust the **Near Blur Size** and the **Far Blur Size** to further tweak the look of Gaussian DOF.

 [image: Gaussian DOF]

Gaussian DOF with adjusted values for Near/Far Transition and Blur Size to produce a nice depth of field effect.

In this example, the following values have been set to produce a soft depth of field effect for near and far regions.

- Focal Distance: **215**

- Scale: **2500**

- Near Transition: **500**

- Far Transition: **400**

- Near Blur Size: **2.0**

- Far Blur Size: **2.5**

## Available Settings

The Gaussian DOF settings and properties can be found under the Post Process Volume's **Details** panel in the **Lens** category under **Mobile Depth of Field**.

| Property | Description |
| --- | --- |
| **High Quality Gaussian DOF on Mobile** | Enables HQ Gaussian on high-end mobile platforms. |
| **Focal Region** | Artificial region where all content is in focus starting after DepthOfFieldFocalDistance. This value is measured in Unreal Units (cm). |
| **Near Transition Region** | The distance in Unreal Units from the focal region on the side nearer to the camera over which the scene transitions from focused to blurred when using Bokeh or Gaussian DOF. |
| **Far Transition Region** | The distance in Unreal units from the focal region on the side farthest from the camera over which the scene transitions from focused to blurred when using Bokeh or Gaussian DOF. |
| **Scale** | This blends the DOF in the scene. A value of 0 turns it off. |
| **Near Blur Size** | The maximum size (in percent of the view width) of the near blur for Gaussian-based DOF. Note that performance cost scales with size. |
| **Far Blur Size** | The maximum size (in percent of the view width) of the far blur for Gaussian-based DOF. Note that performance cost scales with size. |
| **Occlusion** | The occlusion tweak factor of 1. Using a value of 0.18 gets natural occlusion and a value of 0.4 solves layer color leaking issues. |
| **Sky Distance** | Artificial distance to allow the skybox to be in focus (for example, 200000 units), where values less than 0 will disable the feature. Note that this feature can cost performance. |
| **Vignette Size** | Artificial circular mask to (near) blur content outside the radius diameter in percent of the screen width. It adds performance costs if the mask is used. |

- rendering
- lighting
- post process
- depth of field
- dof

On this page

- Gaussian (-> mobile-depth-of-field-in-unreal-engine)
- Visualizing Depth of Field (-> mobile-depth-of-field-in-unreal-engine)
- Focal Distance (-> mobile-depth-of-field-in-unreal-engine)
- Available Settings (-> mobile-depth-of-field-in-unreal-engine)
