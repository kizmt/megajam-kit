# Color Correct Regions

https://dev.epicgames.com/documentation/en-us/unreal-engine/color-correct-regions-in-unreal-engine?application_version=5.9

> Details on applying color grading using volumes on your level's environment with Color Correct Regions.

[image: Color Correct Regions]

With **Color Correction Regions**, you can adjust and correct the colors of the environment and objects in your scene. For example, in an in-camera VFX scenario, you can match the lighting and shadows between the real-world set and the environment displayed on the LED walls.

 [image: A scene with a Color Correction Region applying a fuchsia color in a sphere volume to the environment.]

At the end of this page, you will be familiar with adding Color Correction Regions to your level and modifying their settings.

There are two types of Color Correction Actors in Unreal Engine:

**Color Correction Regions (CCR):** Use CCR to apply color correction to any Actors inside a shaped volume (Sphere, Box, Cylinder, or Cone).

**Color Correction Windows (CCW):** Use CCW to apply color correction to any Actors behind a flat plane, relative to the position of your camera.

## Add Color Correction Regions to your scene

To add a **Color Correction Region** (Either CCR or CCW) to your scene, follow these steps:

- In the Editor's main menu, choose **Edit** > **Plugins** to open the **Plugins** window. [image: The Edit menu in Unreal Engine]

- In the **Plugins** window, find **Color Correction Regions** in the **Other** section. Check the **Enabled** checkbox to enable the plugin. [image: The Plugins window with the Color Corection Regions plugin highlightd]

- Restart the engine.

- In the Editor's main menu, choose **Edit** > **Project Settings** to open the Project Settings window.

- In the **Project Settings** window, go to **Engine** > **Rendering**, and change the **Custom Depth Stencil Path** to **Enabled With Stencil**. [image: The Project Settings window with the Custom Depth Stencil Path option highlighted] **Custom Depth Stencil Path **must be set to **Enabled With Stencil ** to use Color Correct Regions.

- In the** Place Actors** panel, select the **Volumes **category. [image: The Place Actors window with the CCR and CCW volumes highlighted]

- Drag the **Color Correction Region** Asset or **Color Correction Window** Asset into the level. [image: The Unreal Editor showing the Place Actors window and two mannequins in the Viewport with the CCR and CCW volumes highlighted]

- After you place your CCR or CCW volume in your level, you can modify the following settings in the **Details **panel to apply color grading to your level.

## Adjust Color Correction Region settings

CCR and CCW mostly use the same settings, however the **Type** and **Priority** settings are different for each type of Color Correction Region.

| **Property** | **Description** |
| --- | --- |
| Type | Determines the shape of the region. **CCR options:** Sphere Box Cylinder Cone **CCW options:** Square Circle |
| Priority | **CCR:** When multiple Color Correction Regions overlap, the priority of the regions determines what order the color grading of the regions are applied to the level. **CCW:** The **Priority** property does not appear in the Details panel for CCW. The priority of CCWs is based on the distance of the CCW from the camera. Regions closer to the camera have a higher priority and are applied first. |
| Intensity | Use this setting to control the strength of other Color Grading settings. |
| Inner and Outer | Use this setting to control the Region's falloff area. |
| Falloff | Use this setting with **Inner and Outer** to control the strength and area of falloff. |
| Invert | If checked, color grading is applied to everything in the level except for the area of this Color Correction Region. |
| Temperature Type | Select the type of color temperature control for this region. **White Balance:** White Balance is the conventional color temperature control method. **Color Temperature:** Color Temperature is the reverse of white balance **Temperature (Legacy):** Temperature (Legacy) uses an older algorithm to modify color temperature. This algorithm can be faster than **White Balance** or **Color Temperature**, but the end results may not be comparable to conventional color correction algorithms. |
| Temperature | Use this setting to adjust the applied color temperature in kelvins. |
| Tint | Use this setting to adjust the tint of the color correction. Lower values adjust the color towards pink, higher values adjust the color towards green |
| Color Grading Settings | Color grading settings such as Gamma, Highlights, Midtones, and Shadow. |
| Enabled | If unchecked, this region will not be visible in your scene and it will not apply any color corrections. |

## Per Actor Color Correction

 [image: The Viewport showing two mannequins and a Color Correct Region. One actor is not affected by the Color Correct Region]

You can use Per Actor Color Correction to selectively apply color correction to Actors in your scene.

There are two Per Actor CC modes:

- **Exclude Selected Actors: ** Use this setting to exclude selected Actors from this Color Correction Region. The region does not apply color correction to the selected Actors.

- **Affect Only Selected Actors: ** Use this setting to _only _include the selected Actors. This region only applies color correction to the selected Actors.

To enable Per Actor Color Correction, select your Color Correction Volume, go to the **Details** panel, and check the **Enable Per Actor CC** checkbox.

 [image: The Per Actor Color Correction section of the Details panel]

After enabling Per Actor CC, you can select Actors to include or exclude from this Color Correction Region by adding them to the Actor Selection.

- Click the **+** icon to add an element to the Actor Selection.

- Select your Actor from the dropdown menu, or use the eyedropper tool to select an Actor from your viewport.

- vfx
- color correct

On this page

- Add Color Correction Regions to your scene (-> color-correct-regions-in-unreal-engine)
- Adjust Color Correction Region settings (-> color-correct-regions-in-unreal-engine)
- Per Actor Color Correction (-> color-correct-regions-in-unreal-engine)
