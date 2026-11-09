# Using Colored Translucent Shadows

https://dev.epicgames.com/documentation/en-us/unreal-engine/using-colored-translucent-shadows-in-unreal-engine?application_version=5.9

> Guide for setting up and using Colored Translucent Shadows

[image: Using Colored Translucent Shadows]

This tutorial explains how to configure an Unreal Engine Material to cast colored translucent shadows. There are many applications where this feature is useful, but a common example is the colored light transmitted through stained glass windows.

 [image: Stained Glass example image]

Translucent shadow color in Unreal Engine.

## Translucent Shadow Color

Translucent Shadow Color is the term used to describe how shadows can be tinted by the color of translucent surfaces they travel through. This is also known as **transmission**. The amount of colored light that is transmitted through a Material is determined by its **Opacity** value between 0 and 1, and the intensity of the light cast onto the Material.

- For example, if the Opacity value is set to **0**, the Material is fully transparent and would not transmit any color or cast any shadows.

- If the Opacity is set to **1**, the Material is fully opaque and transmits no light at all.

- When the Opacity value is something **between 0 and 1**, the light transmitted through that object is tinted by the **Base Color** of the Material, and the shadows inherit some of the color.

### Compatibility with Various Lighting Systems

Translucent Shadow Color is not supported by every one of Unreal Engine's lighting and global illumination systems. The chart below breaks down which lighting features support translucent colored shadows.

| Lighting System | Translucent Colored Shadows |
| --- | --- |
| CPU Lightmass | Yes, Static lights only |
| GPU Lightmass | Yes, Static lights only |
| Lumen Global Illumination | No |
| Hardware Ray Tracing | No |
| Path Tracer | Yes, requires Thin Translucent Shading Model |

The notable omission on this list is **Lumen Global Illumination**, which does not currently support translucent shadow color.

Because Lumen Global Illumination is enabled by default in all new UE5 projects, this means you will need to manually disable Lumen in either the **Project Settings** or **PostProcessVolume** if you want to use colored translucent shadows in your Level.

The sections below explain how to setup a scene and Material to cast translucent colored shadows.

## Disabling Lumen in UE5

Use the following steps to disable Lumen Global Illumination in the current Level.

- Click the **Create** icon in the toolbar and select **Volumes** > **PostProcessVolume**. [image: Create PostProcessVolume]

- Select the PostProcessVolume in the Level, and in the Details Panel search for **"extent"**. Enable the **Infinite Extent (Unbound)** setting so the PostProcessVolume affects the whole Level. [image: Enable Infinite Extent]

- Search for **Global Illumination** in the Details Panel. Enable the **Method** setting, and use the drop-down to change the Global Illumination Method from **Lumen** to **None**. [image: Global Illumination Method] This setting disables dynamic Global Illumination in the current Level, however you can still use Lightmass to bake Global Illumination from Static lights.

## Lighting Setup

The most important consideration with regard to lighting is that you can only cast colored translucent shadows from a Light Actor with its **Mobility** set to **Static**. You can use any of the following light types.

- Directional Light

- Point Light

- Spot Light

- Rect Light

All examples on this page use a Directional Light in the Unreal Engine **Time of Day** Level template. Select the **Directional Light** in the Outliner, and change the **Mobility** to **Static** in the Details Panel.

 [image: Static light Mobility]

Indirect lighting can wash out colored shadows, making them appear less saturated than the Base Color of the Material. If you are having trouble seeing colored translucent shadows in your Level, consider reducing the **Indirect Lighting Intensity** of your light source, or try using a dimmer environment.

## Material Setup

### Material Properties

You can use any of the Blend Modes and Shading Models listed below to cast colored translucent shadows.

- **Blend Mode:** Translucent, Additive, AlphaComposite, or Modulate

- **Shading Model:** Default Lit, Unlit, or Thin Translucent

Using the **Modulate** Blend Mode will require you to disable **Mobile Separate Translucency** in the Details Panel properties.

#### Two Sided

Enabling the **Two Sided** property is optional, but it is necessary if you intend the player to view both sides of the mesh with the Material. If **Two Sided** is disabled, the light must be cast onto the visible side of the Material in order for it to cast colored shadows.

### Creating a Lit Translucent Material

- Create a new **Material** asset and open it in the Material Editor (-> unreal-engine-material-editor-user-guide). Click anywhere in the Material Graph to display the Material Properties (-> unreal-engine-material-properties) in the Details Panel.

- In the Details Panel, change the **Blend Mode** to **Translucent**. [image: Change Blend Mode to Translucent]

- Enable the **Two Sided** Material property (optional). [image: Enable Two Sided option]

- Scroll down and expand the **Translucency** section. Set the **Lighting Model** to **Surface Translucency Volume**. [image: Translucency Lighting Mode drop-down]

- Add a **Texture Sample** to the Material Graph. This example uses a colorful geometric pattern to simulate a stained glass window, but any colorful texture will work. Images with highly saturated colors will produce more vibrant shadows than images with low saturation. Connect the **RGB** Output of the Texture Sample to the **Base Color** input on the Main Material Node (-> using-the-main-material-node-in-unreal-engine). [image: Stained Glass Texture Sample]

- Create a **Scalar Parameter** and rename it **Opacity**. Select the Scalar Parameter and set the **Default Value** to a value between 0 and 1 in the Details Panel. You can also set the **Slider Max** value to **1** to limit the value range of the Opacity slider. [image: Scalar Parameter values]

- Connect the Scalar Parameter to the **Opacity** input. Your Material Graph should look like the image below. [image: Default Lit Material Graph]

- Click **Apply** and **Save** in the Toolbar to compile the Material and save the asset. [image: Compile and save Material]

## Build Lighting

Close the Material Editor and apply the Material to a Static Mesh in your Level. This example uses a simple plane from the Unreal Engine Starter Content. The Directional Light is angled roughly perpendicular to the plane so the shadow will fall directly onto the ground below.

In the Toolbar go to **Build** > **Build Lighting Only** to bake your lighting. Colored translucent shadows should appear when the Lightmass build finishes.

 [image: Build Lightmass for Level]

### Shadow Sharpness

Several things can affect the sharpness of the shadows, including the lightmap resolution of the mesh receiving the transmitted shadow color, the source angle of the light, and the quality of the texture sample. If your result is blurry and unfocused like the image below, it is very likely the lightmap resolution is too low on the receiving mesh.

 [image: Blurry lighmass results]

Select the Static Mesh upon which the shadows are falling—in this case the Floor asset. In the Details Panel, scroll down to the **Lighting** section. Enable the **Overriden Light Map Res** setting, and enter new Light Map resolution.

 [image: Override Lightmass Resolution]

Depending on the size of the static mesh, you may need a relatively large resolution to see sharp shadows. The slider below shows what happens when the Light Map resolution is gradually increased.

 [image: Light Map resolution 1024]
 [image: Light Map resolution 1024]
 [image: Light Map resolution 2048]
 [image: Light Map resolution 3072]

**Light Map resolution increased from 256 to 1024, 2048 and finally 3072.**

In this case there is a drastic improvement from **256** up to **2048**, but diminishing returns when the resolution is pushed to 3072. Larger Light Maps have a performance cost, so be careful not to use a higher resolution than is necessary.

## Material Variations

### Opacity and Shadow Saturation

The Opacity value of the Material will affect the saturation and intensity of the shadows. In the comparison below, the three slides show what happens when the **Opacity** value is increased from 0.2 to 0.9. In an outdoor environment like this, the colored shadows are easier to see with higher Opacity values. However, in a dim interior lower opacity values may yield better results.

 [image: Opacity Value 0.2]
 [image: Opacity Value 0.5]
 [image: Opacity Value 0.5]

**Material Opacity at 0.2, 0.5, and 0.9.**

### Masked Opacity

Opacity masks work as expected when casting colored translucent shadows. You can use the alpha channel of a texture, or plug a black and white texture into the **Opacity** input to control which parts of the Material are visible and cast shadows. If you are unfamiliar with the process, read more about texture masking here (-> using-texture-masks-in-unreal-engine).

The example below shows a masked Material casting colored translucent shadows. None of the Material properties were changed, but the Material graph was modified as shown below.

 [image: Colored Shadows with Opacity Mask]

Instead of plugging the **Opacity** Scalar Parameter directly into the Main Material Node, it is multiplied by a black and white Texture Sample. The black regions of the mask are transparent, while the white circular region is visible.

This is the result after the lighting is rebuilt.

 [image: Colored translucent shadows from masked Material]

## Colored Shadows with the Path Tracer

The Path Tracer is Beta feature and requires several settings to be enabled in Project Settings. Read about enabling the Path Tracer on this page.

Dynamic colored shadows are supported by the Path Tracer, but only when the Material uses the **Thin Translucent** Shading Model. Follow the steps below to modify the above Material so it can cast colored translucent shadows with the Path Tracer.

- Click anywhere in the background of the Material Graph to display the Material Properties in the Details Panel.

- Change the **Shading Model** to Thin Translucent. [image: Thin Translucent Shading Model]

- Scroll down to the **Translucency** section and change the **Lighting Mode** to **Surface Forward Shading**. [image: Surface Forward Shading]

- Search for "thin translucent" in the right-click menu or Material Palette and add a **ThinTranslucentMaterialOutput** node to your graph. [image: Thin Translucent Material Node]

- Drag a second connection from the **RGB** output of the Texture Sample to the **Transmittance Color** input on the Thin Translucent Material node. The rest of the graph is unchanged from previous examples, and should look like the image below. [image: Thin Translucent Material Graph]

- Compile the Material and apply it to a mesh in your Level.

The video below shows the results of the Thin Translucent stained glass Material when the Path Tracer is enabled. The colored shadows are fully dynamic in Path Tracing mode and update immediately if the plane or light source are rotated. The video also demonstrates what happens when changes are made to the Opacity of the Material and Source Angle of the Directional Light.

- materials

On this page

- Translucent Shadow Color (-> using-colored-translucent-shadows-in-unreal-engine)
- Compatibility with Various Lighting Systems (-> using-colored-translucent-shadows-in-unreal-engine)
- Disabling Lumen in UE5 (-> using-colored-translucent-shadows-in-unreal-engine)
- Lighting Setup (-> using-colored-translucent-shadows-in-unreal-engine)
- Material Setup (-> using-colored-translucent-shadows-in-unreal-engine)
- Material Properties (-> using-colored-translucent-shadows-in-unreal-engine)
- Two Sided (-> using-colored-translucent-shadows-in-unreal-engine)
- Creating a Lit Translucent Material (-> using-colored-translucent-shadows-in-unreal-engine)
- Build Lighting (-> using-colored-translucent-shadows-in-unreal-engine)
- Shadow Sharpness (-> using-colored-translucent-shadows-in-unreal-engine)
- Material Variations (-> using-colored-translucent-shadows-in-unreal-engine)
- Opacity and Shadow Saturation (-> using-colored-translucent-shadows-in-unreal-engine)
- Masked Opacity (-> using-colored-translucent-shadows-in-unreal-engine)
- Colored Shadows with the Path Tracer (-> using-colored-translucent-shadows-in-unreal-engine)

Related documents

Opacity Material Functions

 [image: Opacity Material Functions] (-> opacity-material-functions-in-unreal-engine)Lit Translucency

 [image: Lit Translucency] (-> lit-translucency-in-unreal-engine)
