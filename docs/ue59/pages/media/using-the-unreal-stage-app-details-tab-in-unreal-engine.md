# Using the Unreal Stage App Details Tab

https://dev.epicgames.com/documentation/en-us/unreal-engine/using-the-unreal-stage-app-details-tab-in-unreal-engine?application_version=5.9

> The Details tab offers the full set of Actor properties available to modify within the scene via the Unreal Stage app.

[image: Using the Unreal Stage App Details Tab]

Learn to use this **Experimental** feature, but use caution when shipping with it.

## Details Tab Properties

The available properties match the equivalent properties in the desktop Unreal Engine scene and will vary based on the type of content selected.

### Light Cards and Flags

For Light Cards and Flags, the following properties are available:

- **Color** RGB or HSV values.

- **Orientation:**

- **Mask** Toggle between a circle or square mask for the Light Card

- **Scale X and Scale Y** Sliders can provide more precise control compared to resizing with pinch zoom

- **Latitude and Longitude**

- **Longitude** Sliders can provide precise control for placement and positioning compared to touch-only

- **Spin** Sliders can provide more precise control for rotation compared to touch-only

- **Appearance:** **Temperature**

- **Tint**

- **Gain**

- **Opacity**

- **Feathering**

- **Exposure** Exposure controls include convenient buttons for quarter-, half-, and full-stop increments.

### Color Correction Regions and Windows

For Color Correction Windows, the following properties are available:

- Color Grading

- RGB or HSV values

- Color Grading Modes: **Global**

- **Shadows**

- **Midtones**

- **Highlights**

- Color Grading Properties (each available per mode): **Saturation**

- **Contrast**

- **Gamma**

- **Gain**

- **Offset**

- Orientation: Mask Toggle between a circle or square mask for the Color Correction Window

- Scale X and Scale Y Sliders can offer more fine-grain control over precise resizing than pinch zoom

- Latitude and Longitude Sliders can offer more fine-grain control over precise placement and positioning

- **Spin** Sliders can offer more fine-grain control over precise rotation than touch-only.

- **Radial Offset** Push/pull the Color Correction Window away from the LED volume representation along an axis with the nDisplay Root Actor's origin. This is useful to apply color grading behind some content in the scene but in front of others (as opposed to in front of everything in the scene visible to nDisplay).

- Appearance: Color Temperature

- Tint

- Intensity

- Inner

- Outer

- Falloff

**Color Correction Regions** do not offer appearance controls because there are no 3D placement tools in Unreal Stage. Only color grading and appearance properties can be modified in the app.

### Preview Thumbnail

The Details tab offers a preview thumbnail to provide a visual in the app while modifying properties. The preview thumbnail can be moved to any corner of the Unreal Stage UI or stowed/minimized.

### Set a Property to an Explicit Value

In addition to the sliders, properties can also be modified and set to an explicit value by double-tapping on it to bring up an input dialog and the keyboard.

- getting started
- experimental
- virtual production
- ndisplay
- icvfx
- virtual sets
- bronze

On this page

- Details Tab Properties (-> using-the-unreal-stage-app-details-tab-in-unreal-engine)
- Light Cards and Flags (-> using-the-unreal-stage-app-details-tab-in-unreal-engine)
- Color Correction Regions and Windows (-> using-the-unreal-stage-app-details-tab-in-unreal-engine)
- Preview Thumbnail (-> using-the-unreal-stage-app-details-tab-in-unreal-engine)
- Set a Property to an Explicit Value (-> using-the-unreal-stage-app-details-tab-in-unreal-engine)
