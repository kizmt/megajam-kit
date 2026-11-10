# Transform and Property Tracks

https://dev.epicgames.com/documentation/en-us/unreal-engine/cinematic-transform-and-property-tracks-in-unreal-engine?application_version=5.9

> Sequencer's Property Tracks are used to animate an Actor's common variables or properties such as transform, floats, or color.

[image: Transform and Property Tracks]

Sequencer contains various **Property Tracks **you can use to animate Actors' common property types. Using these tracks, you can animate properties such as Transform, Color, or Booleans. This guide provides an overview of the various Property Track types that exist in Sequencer.

#### Prerequisites

- You have an understanding of Sequencer (-> how-to-make-movies-in-unreal-engine) and its Interface.

## Transform Track

One of the most commonly-used tracks in Sequencer is the **Transform track**. You can use this track to animate the movement of objects, cameras, and characters in your scene.

 [image: sequencer transform track]

### Creation

By default, whenever a Static Mesh (-> static-meshes), Skeletal Mesh (-> skeletal-mesh-assets-in-unreal-engine), or Camera (-> cinematic-cameras-in-unreal-engine) is added to Sequencer, a Transform track will automatically be added under them.

To manually add a Transform track, click **Add Track (+)** on your Actor Track (-> cinematic-actor-tracks-in-unreal-engine), and select **Transform**.

 [image: add transform track]

The automatic adding of the Transform track under certain tracks is enabled from the **Project Settings**, and can be customized to occur for other Actor class types under the Track Setting Project Setting (-> cinematic-editor-and-project-settings-in-unreal-engine).

### Usage

Transform tracks can be expanded to view individual channels or axes. Selecting these channel or axis tracks and pressing **Enter **will allow you to place keyframes on those specific tracks.

 [image: expand transform track channel]

Channels and axes can also be disabled and removed from view if you don't need them. To do this, right-click the transform section and enable or disable channels under the **Active Channels** category. Removing any channel or axis will cause those tracks to not be evaluated by Sequencer and to not respond to Auto Keying (-> sequencer-cinematic-toolbar-in-unreal-engine).

 [image: transform track channels]

### Properties

The Transform track section contains properties to assist with improving control on your Transforms. Right-click a Transform track section and select Properties to view them.

 [image: transform track properties]

The **Use Quaternion Interpolation** option enables quaternion linear interpolation between transform keyframes. Quaternion interpolation helps reduce **Gimbal lock** and other Euler-based problems with rotations.

|  |  |
| --- | --- |
|  |  |
| Use Quaternion Interpolation Disabled | Use Quaternion Interpolation Enabled |

**Show 3D Trajectory** contains options for drawing trajectory paths for the Transform track.

 [image: show 3d trajectory]

These options include:

- **Only When Selected,** which will only draw the trajectory when the object or track is selected.

- **Always, **which will always draw the trajectory regardless of selection.

- **Never, **which will never draw the trajectory.

Regardless of the chosen trajectory setting, the trajectory will always hide when Game View (-> using-editor-viewports-in-unreal-engine) is enabled.

## Property Tracks

Sequencer supports the animating of various properties. Properties can be added to your Actor Track (-> cinematic-actor-tracks-in-unreal-engine) in Sequencer by clicking **Add Track (+)** on your Actor and choosing one from the **Properties **category.

 [image: sequencer property track]

### Boolean

Boolean tracks are used to animate boolean properties. Boolean tracks can only be set to enabled or disabled, and do not interpolate. The timeline will be colored **red** when set to disabled, and **green **when enabled.

 [image: sequencer boolean track]

Booleans are also represented in the curve editor by values of **0** (disabled) and **1** (enabled).

### Integer

Integer tracks are used to animate integer properties and do not interpolate.

 [image: sequencer integer track]

### Float

Float tracks are used to animate scalar float properties. Float keyframes interpolate and can use custom tangents and curves.

 [image: sequencer float track]

To assist with visualizing float value changes, you can enable float curves to be displayed in-line within a float track section.

 [image: float track curve display]

To enable the float track curve display, right-click on a float track section and select **Display > Show Curve**.

 [image: float track curve display]

### Vectors

Sequencer supports animating Vector 2, 3, and 4 properties using their respective tracks. All Vector tracks interpolate and can have custom tangents and curves.

 [image: sequencer vector track]

### Color

The Color track is used to animate color-specific properties in Sequencer, such as on lights or materials. The Color track supports interpolation and will also display the color set at each keyframe along the timeline so you can preview your colors at a glance.

 [image: sequencer color track]

To help with color selection, you can double-click a Color track keyframe to bring up the **Color Picker**. Once a color is selected, click the **OK **button and the keyframe will now be set to that color.

 [image: sequencer color picker]

The Color track supports animating both **Color **and **Linear Color** spaces.

### String

The String track is used to animate different String values. String values do not interpolate between keyframes.

 [image: sequencer string track]

### Enum

The Enum Track is used to animate different enumerated values. Enum values do not interpolate between keyframes.

 [image: sequencer enum track]

### Object

The Object Track is used to animate different Object and Asset values. Object values do not interpolate between keyframes.

 [image: sequencer object track]

### UMG Properties

Sequencer supports animating properties from UI Elements in the Creating User Interfaces (-> creating-user-interfaces-with-umg-and-slate-in-unreal-engine). The two main tracks used for UMG are the **Margin **and **Widget Transform Tracks**.

 [image: sequencer umg ui property tracks]

## Overridable Channels

Some properties can be overridden to output animation data other than normal keyframes or curves. For example, you can override float channels or individual X/Y/Z channels on transform axes to output random perlin noise. This can be useful to create procedural noise-based animation, rather than manually animating noise.

 [image: sequencer animate noise]

Currently only float/double and transform tracks support overridable channels.

To override a channel navigate either to a Float Track (-> cinematic-transform-and-property-tracks-in-unreal-engine) or an individual axis channel of a Transform Track (-> cinematic-transform-and-property-tracks-in-unreal-engine), right-click the track and select **Override with Double Perlin Noise**.

 [image: override with double perlin noise]

You can modify noise parameters by right-clicking the track and navigating to **Double Perlin Noise Parameters**, where both the **Frequency** and **Amplitude** can be edited.

 [image: double perlin noise parameters]

Noise channels animate relative to a value of **0**. If you want your noise to animate between certain value ranges, such as between **100 - 200**, then you can create extra additive Sections (-> creating-animation-keyframes-in-unreal-engine), and convert those channels to noise. This way, you can have the base section at a specific value, and then noise will apply additively to that base.

 [image: layer additive noise]

If you have overridden multiple channels within a section, you can right-click on the section and edit all noise parameters at the same time under the **Perlin Noise Channels** menu.

 [image: change multiple noise properties]

- sequencer
- track

On this page

- Prerequisites (-> cinematic-transform-and-property-tracks-in-unreal-engine)
- Transform Track (-> cinematic-transform-and-property-tracks-in-unreal-engine)
- Creation (-> cinematic-transform-and-property-tracks-in-unreal-engine)
- Usage (-> cinematic-transform-and-property-tracks-in-unreal-engine)
- Properties (-> cinematic-transform-and-property-tracks-in-unreal-engine)
- Property Tracks (-> cinematic-transform-and-property-tracks-in-unreal-engine)
- Boolean (-> cinematic-transform-and-property-tracks-in-unreal-engine)
- Integer (-> cinematic-transform-and-property-tracks-in-unreal-engine)
- Float (-> cinematic-transform-and-property-tracks-in-unreal-engine)
- Vectors (-> cinematic-transform-and-property-tracks-in-unreal-engine)
- Color (-> cinematic-transform-and-property-tracks-in-unreal-engine)
- String (-> cinematic-transform-and-property-tracks-in-unreal-engine)
- Enum (-> cinematic-transform-and-property-tracks-in-unreal-engine)
- Object (-> cinematic-transform-and-property-tracks-in-unreal-engine)
- UMG Properties (-> cinematic-transform-and-property-tracks-in-unreal-engine)
- Overridable Channels (-> cinematic-transform-and-property-tracks-in-unreal-engine)
