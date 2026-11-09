# Render Passes

https://dev.epicgames.com/documentation/en-us/unreal-engine/cinematic-render-passes-in-unreal-engine?application_version=5.9

> Learn about the different render pass layers in Movie Render Queue.

[image: Render Passes]

Movie Render Queue supports rendering different types of output images in separate passes, such as the final image, object ids, and other rendering related passes. Each render pass setting will output your movie in a separate rendering mode. You can then use them in an external post-production or compositing program of choice.

#### Prerequisites

- You have completed the prerequisite steps from the **Movie Render Queue** page.

- If you are using **Object ID's**, you must enable a plugin to use it. Navigate in the Unreal Engine menu to **Edit > Plugins**, locate **Movie Render Queue Additional Render Passes** in the **Rendering **section, and enable it. You will need to restart the editor afterward. [image: render pass plugin]

Although Movie Render Queue has the capability to output some render passes, the limitations of Deferred Rendering does not make it possible to output all passes to assemble the final image from. This means that common passes available in other rendering packages (AOV's), such as Ambient Occlusion or Sub-surface Scattering, are unavailable in Unreal Engine. This page lists the only supported passes.

## Overview

You can add **Render Passes** to your output by clicking on the **+ Setting **button and selecting any of the entries in the **Rendering** category.

 [image: render pass list]

You can enable and disable render passes as you would with any other setting, and you can select them to edit their properties, if any are available.

By default, all of your selected render passes will be output alongside each other in the final output folder. You can utilize the format string token `{render_pass}` to help organize your passes. For example, setting the following in **File Name Format** will cause your passes to separate into pass-relevant subfolders relative to the **Output Directory**:

```
	{render_pass}/{sequence_name}.{frame_number}
```

{render_pass}/{sequence_name}.{frame_number}

**Examples of some render passes that Movie Render Queue can produce.**

## Deferred Rendering

The main output from Unreal is handled by the default **Deferred Rendering** setting, which produces the final image that you see in the viewport. Some variations are provided, including **Detail Lighting**, **Lighting Only**, **Reflections**, and **Unlit**. These variations are not used in creating the final image, and are provided here for parity with the Level Editor viewport.

The Deferred Rendering options include the following:

| Render Pass | Description |
| --- | --- |
| **Deferred Rendering** | Displays the final image for the scene, matching what you see in the viewport. [image: deferred rendering] |
| **Detail Lighting** | A special shader variation which only displays lighting combined with normal maps. Can be useful to show off the geometry of a scene. [image: deferred detail lighting] |
| **Lighting Only** | Similar to Detail Lighting but without the normal maps affecting the lighting. [image: deferred lighting only] |
| **Reflections Only** | A special shader variation which makes everything in the world reflective. [image: deferred reflections only] |
| **Unlit** | A special shader variation which displays only base color, with no lighting information. [image: deferred unlit] |

All Deferred Rendering passes contain the same properties, but each render pass can be configured individually.

 [image: deferred rendering details]

| Name | Description |
| --- | --- |
| **Accumulator Includes Alpha** | If enabled, multiple temporal/spatial samples will accumulate for the alpha channel. This requires r.PostProcessing.PropagateAlpha to be set to 1 or 2, which you can enable by going to Project Settings > Rendering and using the Enable Alpha Channel Support in Post Processing setting. It also adds roughly 30% to the cost of accumulation, so you should avoid using it unless necessary. This applies to renders that use multiple temporal or spatial samples. |
| **Disable Multisample Effects** | Disables post-processing effects that blend multiple pixels together, like depth of field, temporal anti-aliasing, motion blur, and chromatic aberration, which are undesirable when using the Object Ids render pass. This setting enables you to exclude these post-processes for a rendering job without having to manually disable them within your scene. |
| **Use 32Bit Post Process Materials** | Enabling this will cause the post process materials to write to 32 bit quality, instead of 16 bit. |
| **Additional Post Process Materials** | An array of additional post-process render passes to include. Includes MovieRenderQueue_WorldDepth and MovieRenderQueue_MotionVectors by default. The material must be Enabled in order for the pass to render. |
| **Add Default Layer** | Creates an extra stencil layer that contains all objects not already contained in the Stencil Layers array. This default layer will render separately, enabling you to create renders that exclude small groups of objects for later re-compositing. |
| **Stencil Layers** | A list of stencil layers, which contain groups of objects in the scene. The scene will be re-rendered with all objects and then pixels that don't contain objects on the specified layer will be clipped and turned black. Post Processing is then applied which preserves the ability to use DoF, Motion Blur and TAA. |

### Post Process Render Pass

Post Process Render Passes are additional render passes you can specify from the Deferred Renderer. **You must output them in the .exr format** as they contain color and metadata information beyond what can be displayed and interpreted from the other formats.

#### World Depth

The **World Depth** is the depth written in world units stored in the red channel. This can be used to re-create the **Depth of Field **in post production. The camera focal length and shutter size can be read from the EXR metadata to automatically match the in-game depth of field.

 [image: world depth render pass]

An example of the **Nuke ZDefocus2** node can be found below. This will read the metadata from the EXR file and produce a similar blur to what is found in realtime. You must re-adjust the focal_point property after pasting, so that it samples the WorldDepth texture correctly.

World Depth with ZDefocus Nuke node

```
	set cut_paste_input [stack 0]
	version 12.0 v3
	push $cut_paste_input
	add_layer {FinalImageMovieRenderQueue_WorldDepth FinalImageMovieRenderQueue_WorldDepth.red FinalImageMovieRenderQueue_WorldDepth.green FinalImageMovieRenderQueue_WorldDepth.blue FinalImageMovieRenderQueue_WorldDepth.alpha}
	ZDefocus2 {
	z_channel FinalImageMovieRenderQueue_WorldDepth.red
	math depth
	fill_foreground false
	center {{"[metadata exr/unreal/camera/FinalImage/focalDistance]"}}
	focal_point {960 540}
	size {{"((input.height*(focalLength*focalLength / (fstop * (focalDistance - focalLength)))*.5 / sensorWidth)/10)" x1 26}}
	max_size 100
	filter_type bladed
	legacy_resize_mode false
	show_legacy_resize_mode false
	blades {{"[metadata exr/unreal/camera/FinalImage/dofDiaphragmBladeCount]"}}
	name ZDefocus1
	selected true
	xpos 959
	ypos 229
	addUserKnob {20 User}
	addUserKnob {7 focalLength l "Focal Length"}
	focalLength {{"[metadata exr/unreal/camera/FinalImage/focalLength]"}}
	addUserKnob {7 focalDistance l "Focal Distance"}
	focalDistance {{"[metadata exr/unreal/camera/FinalImage/focalDistance]"}}
	addUserKnob {7 sensorWidth l "Sensor Width"}
	sensorWidth {{"[metadata exr/unreal/camera/FinalImage/sensorWidth]"}}
	addUserKnob {7 fstop l Fstop}
	fstop {{"[metadata exr/unreal/camera/FinalImage/fstop]"}}
	}
```

set cut_paste_input [stack 0]
 version 12.0 v3
 push $cut_paste_input
 add_layer {FinalImageMovieRenderQueue_WorldDepth FinalImageMovieRenderQueue_WorldDepth.red FinalImageMovieRenderQueue_WorldDepth.green FinalImageMovieRenderQueue_WorldDepth.blue FinalImageMovieRenderQueue_WorldDepth.alpha}
 ZDefocus2 {
 z_channel FinalImageMovieRenderQueue_WorldDepth.red
 math depth
 fill_foreground false
 center {{"[metadata exr/unreal/camera/FinalImage/focalDistance]"}}
 focal_point {960 540}
 size {{"((input.height*(focalLength*focalLength / (fstop * (focalDistance - focalLength)))*.5 / sensorWidth)/10)" x1 26}}
 max_size 100
 filter_type bladed
 legacy_resize_mode false
 show_legacy_resize_mode false
 blades {{"[metadata exr/unreal/camera/FinalImage/dofDiaphragmBladeCount]"}}
 name ZDefocus1
 selected true
 xpos 959
 ypos 229
 addUserKnob {20 User}
 addUserKnob {7 focalLength l "Focal Length"}
 focalLength {{"[metadata exr/unreal/camera/FinalImage/focalLength]"}}
 addUserKnob {7 focalDistance l "Focal Distance"}
 focalDistance {{"[metadata exr/unreal/camera/FinalImage/focalDistance]"}}
 addUserKnob {7 sensorWidth l "Sensor Width"}
 sensorWidth {{"[metadata exr/unreal/camera/FinalImage/sensorWidth]"}}
 addUserKnob {7 fstop l Fstop}
 fstop {{"[metadata exr/unreal/camera/FinalImage/fstop]"}}
 }

#### Motion Vectors

**Motion Vectors** are stored in the **0,1** coordinate space for X and Y, where **0.5, 0.5** is no motion.

 [image: motion vector render pass]

In Nuke, the **VectorBlur** node can be used to apply motion vectors to your image. Unreal stores motion vectors normalized to the entire screen which may be unlike other rendering packages. As a result, in the Nuke VectorBlur node the uv_offset is set to -0.5 (to rescale to /[-.5, .5/] instead of /[0, 1/]) and then the motion blur scale is driven by the width of your image.

Motion Vector with VectorBlur Nuke node

```
	set cut_paste_input [stack 0]
	version 12.0 v3
	push $cut_paste_input
	add_layer {FinalImageMovieRenderQueue_MotionVectors FinalImageMovieRenderQueue_MotionVectors.red FinalImageMovieRenderQueue_MotionVectors.green FinalImageMovieRenderQueue_MotionVectors.blue FinalImageMovieRenderQueue_MotionVectors.alpha}
	VectorBlur2 {
	uv FinalImageMovieRenderQueue_MotionVectors
	uv_offset -0.5
	blur_type uniform
	scale {{input.width}}
	soft_lines true
	name Unreal_VectorBlur
	selected true
	xpos 1338
	ypos -93
	}
```

set cut_paste_input [stack 0]
 version 12.0 v3
 push $cut_paste_input
 add_layer {FinalImageMovieRenderQueue_MotionVectors FinalImageMovieRenderQueue_MotionVectors.red FinalImageMovieRenderQueue_MotionVectors.green FinalImageMovieRenderQueue_MotionVectors.blue FinalImageMovieRenderQueue_MotionVectors.alpha}
 VectorBlur2 {
 uv FinalImageMovieRenderQueue_MotionVectors
 uv_offset -0.5
 blur_type uniform
 scale {{input.width}}
 soft_lines true
 name Unreal_VectorBlur
 selected true
 xpos 1338
 ypos -93
 }

Depending on your software of choice, you may need to rescale the X and Y channels of the motion vectors independently, as other software may expect them to be in pixel values and not normalized to the screen. By normalizing them to the screen the X and Y channels have different strengths.

### Stencil Layers

Stencil Layers allow for layered rendering of your sequence based on objects within **Layers (-> layers-panel-in-unreal-engine)**.

The entire scene is rendered for each layer, and actors that belong to a layer are rendered into the **Stencil Buffer**. The stencil buffer is then used to clip pixels that fall outside of the actors in their layer. This allows for shadow casting objects to cast shadows onto other actors and layers.

Once rendered to the stencil buffer, a post-processing effect is applied that takes each pixel and writes black with translucency into the pixel. This happens after translucency but before Post Processing, and then post processing is applied to this layer. The alpha channel can be preserved, which will allow you to know in post production which pixels were actually affected, and by how much.

Below is an example of three Stencil Layers alongside the default layer. You can see that post processing effects, such as depth of field, have been correctly applied, and that objects in the foreground have been clipped out of background images as well. These images can be added back together to create a similar result to the final render, though it may require un-premultiplying the data.

 [image: stencil layer render pass]

Below is an example from Nuke which applies a simple hue shift to one of the layers specified in the original image. The original image was rendered with alpha channel accumulation enabled and the Tone Curve disabled in the Color Output setting.

 [image: stencil layer nuke tint]

To properly recombine multiple images like this they should be exported in linear space (disabling the Tone Curve in the Color Output setting). You should use an OCIO-based workflow for this kind of post production work.

The Stencil Layers are not a true layer system, as translucent objects will show opaque objects from other layers behind them, and background layers will show black holes where foreground objects occlude them.
Stencil layers do not support per-layer post processing materials, As they will match the additional post-process materials of the base layer, and are only compatible with materials that support **Custom Depth/Stencil**.

## Path Tracer

The Path Tracer outputs an image based on the **** rendering method. It has similar details to the Deferred Rendering passes.

 [image: path tracer render details]

The Path Tracer rendering mode accumulates path data each frame that renders. This results in a noisy image as the pixels of the image are filled in, especially if the contents of the camera frame changes significantly.

To reduce this noise, you can increase the number of **Spatial Samples** in your **Anti-Aliasing** settings.

 [image: path tracer spatial samples]

This will render the image multiple times, and the additional samples will enable the path tracer to more effectively fill in the gaps. A large number of **Spatial Samples** is required to effectively denoise a Path Tracer render, and this will greatly increase the amount of time required to output the images.

**Increasing the Spatial Samples Anti-Aliasing property will reduce the noise in a Path Tracer render.**

The Path Tracer render mode is currently experimental, and not all material shading modes are supported at this time.

## Object ID's

The **Object Ids** render pass outputs an image where each actor in the scene is assigned an ID. These ID's can be completely unique per actor, or grouped based on certain properties.

 [image: object id render pass details]

You can use this image in a post production suite to select individual objects in a scene and create a mask for them, enabling you to selectively apply adjustments to specific objects.

 [image: Original Image (No Post-Processing)]

 [image: Object ID Pass]

### Setup

The Object Ids pass has specific requirements in order to render correctly:

- Enable **Disable Multisample Effects** for any render passes that you intend to composite together with the Object Id pass. This will exclude motion blur, depth of field, anti-aliasing, and other post-processes that would blend multiple layers of pixels, ensuring that all objects maintain crisp edges. This is required for the object ID pass to line up with the final image correctly. [image: disable multisample effects]

- Under the **Deferred Renderer** setting, expand the **Additional Post Process Materials** and enable both the **MovieRenderQueue_WorldDepth** and **MovieRenderQueue_MotionVectors** materials. [image: additional post process materials]

- Add the **Anti-aliasing** setting to your job and set the **Spatial Sample Count** to at least **8**. Also enable **Override Anti Aliasing** and set **Anti Aliasing Method** to **None**. [image: object id anti aliasing] This will allow you to overcome the limitation where TAA is not supported. Using **Temporal Sample Count **is unlikely to produce the desired results due to the lack of motion blur covering the gap between each sample; you will simply end up with multiple copies of the object faintly superimposed over each other.

- Add the **.exr Sequence** output mode to your settings and deactivate or remove any other export formats. Ensure that the **Multilayer** property is **enabled**. [image: object id exr]

When you start the Movie Render Queue with these settings in place, it will output a multi-layered EXR that includes the Final Image, Object Ids, World Depth, and Motion Vectors.

The Object Ids are stored in the EXR file using the **Cryptomatte** specification, and plugins to read this data are available for third party software.

The Object Ids render pass is experimental in Unreal Engine. It is only available in the Unreal Editor, and can not be used in shipping builds.

### Object ID Grouping

By default, unique colors or ID's are assigned to every actor or component in the level. You can change this on the **Object Ids** **Id Type** property.

 [image: object id group]

| ID Type | Description |
| --- | --- |
| **Full** | The default behavior. A unique ID is created for every material applied to each primitive on all actors in the level. |
| **Material** | ID's will be grouped based on their material or material instance. Material instances will group with their parent material. |
| **Actor** | ID's will be grouped by the same actor instance. |
| **Actor With Hierarchy** | ID's will be grouped by the same actor instances. Actors in different **World Outliner (-> outliner-in-unreal-engine)** folders will be separately grouped relative to those folders. |
| **Folder** | ID's will be grouped by actors within **World Outliner (-> outliner-in-unreal-engine)** folders. All actors within these folders will be merged into one ID. |
| **Layer** | ID's will be grouped by actors assigned in **Layers (-> layers-panel-in-unreal-engine)**. Actors that belong to multiple layers may cause unreliable outcomes. |

### Combining Object Id, Depth and Velocity in Post

By combining multiple spatial samples, depth, and velocity you can produce a similar result to Unreal's post processing pipeline; **Depth of Field** via the depth map and **Motion Blur** via the velocity texture. You can use Object Id's to pick objects and color correct them before applying these post process passes.

To preserve the correct bright highlights through depth of field and motion blur, the scene should be rendered with the tone curve disabled. Do this by adding a Color Output item and enable the **Disable Tone Curve** property. This will output HDR Linear values in the sRGB colorspace. After applying depth of field and motion blur you can now convert it to your desired colorspace (from Linear sRGB).

 [image: disable tone curve]

You must also set **Velocity Path** to **Write during base pass**. Do this by navigating in the main Unreal Engine menu to **Edit > Project Settings > Engine > Rendering** and set **Velocity Path** to **Write during base pass**. The editor must be restarted after changing this project setting.

 [image: output velocities during base pass]

Additionally, the `r.BasePassForceOutputsVelocity` variable must be set to 1. You can do this engine-wide by editing /Engine/Config/ConsoleVariables.ini, or you can apply it as a **Console Variable** during your render.

 [image: base pass console command]

Below is an example Nuke graph which uses the ZDefocus and VectorBlur nodes. For the velocity texture to be used in Nuke, the Red and Green channels of it need to be swapped (RG_TO_GR in the graph below, using a ShuffleCopy node).

This Nuke graph takes an exr rendered with 8 spatial samples, object id pass, motion vectors and world depth. Depth of Field information is automatically pulled from the exr metadata. The cryptomatte nodes are used to create masks of the Newton's Cradle device, and then are used as masks for a simple hue shift. After the hue shifting is applied the previously mentioned ZDefocus node is applied, and then the VectorBlur.

 [image: nuke graph example]

ObjectID, ZDefocus, and VectorBlur Nuke nodes

```
	set N56cf6800 [stack 0]
	add_layer {ActorHitProxyMask00 ActorHitProxyMask00.red ActorHitProxyMask00.green ActorHitProxyMask00.blue ActorHitProxyMask00.alpha}
	add_layer {ActorHitProxyMask01 ActorHitProxyMask01.red ActorHitProxyMask01.green ActorHitProxyMask01.blue ActorHitProxyMask01.alpha}
	add_layer {ActorHitProxyMask02 ActorHitProxyMask02.red ActorHitProxyMask02.green ActorHitProxyMask02.blue ActorHitProxyMask02.alpha}
	Cryptomatte {
	name Cryptomatte1
	xpos 66
	ypos -87
	matteOutput alpha
	matteList LivingRoom/CoffeeTable/BP_NewtonsCradle.NewtonsCradle
	cryptoLayer ActorHitProxyMask
	expression "((ActorHitProxyMask00.red == 30057640.0) ? ActorHitProxyMask00.green : 0.0) + ((ActorHitProxyMask00.blue == 30057640.0) ? ActorHitProxyMask00.alpha : 0.0) + ((ActorHitProxyMask01.red == 30057640.0) ? ActorHitProxyMask01.green : 0.0) + ((ActorHitProxyMask01.blue == 30057640.0) ? ActorHitProxyMask01.alpha : 0.0) + ((ActorHitProxyMask02.red == 30057640.0) ? ActorHitProxyMask02.green : 0.0) + ((ActorHitProxyMask02.blue == 30057640.0) ? ActorHitProxyMask02.alpha : 0.0) + 0"
	keyedName ""
	previewExpression0 "((mantissa(abs(ActorHitProxyMask00.red)) * 1 % 0.25) * ActorHitProxyMask00.green + (mantissa(abs(ActorHitProxyMask00.blue)) * 1 % 0.25) * ActorHitProxyMask00.alpha + (mantissa(abs(ActorHitProxyMask01.red)) * 1 % 0.25) * ActorHitProxyMask01.green + (mantissa(abs(ActorHitProxyMask01.blue)) * 1 % 0.25) * ActorHitProxyMask01.alpha)"
	previewExpression1 "((mantissa(abs(ActorHitProxyMask00.red)) * 16 % 0.25) * ActorHitProxyMask00.green + (mantissa(abs(ActorHitProxyMask00.blue)) * 16 % 0.25) * ActorHitProxyMask00.alpha + (mantissa(abs(ActorHitProxyMask01.red)) * 16 % 0.25) * ActorHitProxyMask01.green + (mantissa(abs(ActorHitProxyMask01.blue)) * 16 % 0.25) * ActorHitProxyMask01.alpha)"
	previewExpression2 "((mantissa(abs(ActorHitProxyMask00.red)) * 64 % 0.25) * ActorHitProxyMask00.green + (mantissa(abs(ActorHitProxyMask00.blue)) * 64 % 0.25) * ActorHitProxyMask00.alpha + (mantissa(abs(ActorHitProxyMask01.red)) * 64 % 0.25) * ActorHitProxyMask01.green + (mantissa(abs(ActorHitProxyMask01.blue)) * 64 % 0.25) * ActorHitProxyMask01.alpha)"
	previewExpression3 ""
	previewChannel none
	in00 ActorHitProxyMask00
	in01 ActorHitProxyMask01
	in02 ActorHitProxyMask02
	in03 none
	in04 none
	in05 none
	in06 none
	in07 none
	in08 none
	in09 none
	in10 none
	in11 none
	}
	push $N56cf6800
	Dot {
	name Dot1
	xpos 13
	ypos -171
	}
	Dot {
	name Dot2
	xpos 13
	ypos -32
	}
	HueShift {
	inputs 1+1
	saturation 2.32
	color_saturation 0.94
	hue_rotation 88
	name HueShift1
	xpos 66
	ypos -36
	}
	Dot {
	name Dot3
	xpos 194
	ypos -32
	}
	Dot {
	name Dot4
	xpos 194
	ypos -206
	}
	add_layer {FinalImageMovieRenderQueue_WorldDepth FinalImageMovieRenderQueue_WorldDepth.red FinalImageMovieRenderQueue_WorldDepth.green FinalImageMovieRenderQueue_WorldDepth.blue FinalImageMovieRenderQueue_WorldDepth.alpha}
	ZDefocus2 {
	z_channel FinalImageMovieRenderQueue_WorldDepth.red
	math depth
	fill_foreground false
	center {{"[metadata exr/unreal/camera/FinalImage/focalDistance]"}}
	focal_point {960 540}
	size {{"((input.height*(focalLength*focalLength / (fstop * (focalDistance - focalLength)))*.5 / sensorWidth)/10)" x1 26}}
	max_size 100
	filter_type bladed
	legacy_resize_mode false
	show_legacy_resize_mode false
	blades {{"[metadata exr/unreal/camera/ActorHitProxyMask/dofDiaphragmBladeCount]"}}
	name ZDefocus1
	xpos 296
	ypos -216
	addUserKnob {20 User}
	addUserKnob {7 focalLength l "Focal Length"}
	focalLength {{"[metadata exr/unreal/camera/FinalImage/focalLength]"}}
	addUserKnob {7 focalDistance l "Focal Distance"}
	focalDistance {{"[metadata exr/unreal/camera/FinalImage/focalDistance]"}}
	addUserKnob {7 sensorWidth l "Sensor Width"}
	sensorWidth {{"[metadata exr/unreal/camera/FinalImage/sensorWidth]"}}
	addUserKnob {7 fstop l Fstop}
	fstop {{"[metadata exr/unreal/camera/FinalImage/fstop]"}}
	}
	set N62ca2800 [stack 0]
	push $N62ca2800
	add_layer {FinalImageMovieRenderQueue_MotionVectors FinalImageMovieRenderQueue_MotionVectors.red FinalImageMovieRenderQueue_MotionVectors.green FinalImageMovieRenderQueue_MotionVectors.blue FinalImageMovieRenderQueue_MotionVectors.alpha}
	ShuffleCopy {
	inputs 2
	in FinalImageMovieRenderQueue_MotionVectors
	in2 none
	red green
	green red
	out FinalImageMovieRenderQueue_MotionVectors
	name RG_TO_GR
	xpos 296
	ypos -178
	}
	Add {
	value -0.5
	name Subtract_05
	xpos 296
	ypos -152
	}
	Multiply {
	channels FinalImageMovieRenderQueue_MotionVectors
	value {0.5625 1 1 1}
	name MultiplyByAspectRatio
	xpos 296
	ypos -114
	}
	Add {
	value 0.5
	name Add_05
	xpos 296
	ypos -76
	}
	VectorBlur2 {
	uv FinalImageMovieRenderQueue_MotionVectors
	mv_presets "V-Ray Velocity"
	uv_offset -0.5
	blur_type uniform
	scale {{width}}
	soft_lines true
	maskChannelInput FinalImageMovieRenderQueue_WorldDepth.red
	name VectorBlur3
	xpos 296
	ypos -38
	}
	Viewer {
	frame 1
	frame_range 1-100
	colour_sample_bbox {0.8895833492 -0.2208333313 0.890625 -0.2197916657}
	samplepoints {{0.8895833492 -0.2208333313}
	}
	name Viewer1
	xpos 292
	ypos 12
	}
```

set N56cf6800 [stack 0]
 add_layer {ActorHitProxyMask00 ActorHitProxyMask00.red ActorHitProxyMask00.green ActorHitProxyMask00.blue ActorHitProxyMask00.alpha}
 add_layer {ActorHitProxyMask01 ActorHitProxyMask01.red ActorHitProxyMask01.green ActorHitProxyMask01.blue ActorHitProxyMask01.alpha}
 add_layer {ActorHitProxyMask02 ActorHitProxyMask02.red ActorHitProxyMask02.green ActorHitProxyMask02.blue ActorHitProxyMask02.alpha}
 Cryptomatte {
 name Cryptomatte1
 xpos 66
 ypos -87
 matteOutput alpha
 matteList LivingRoom/CoffeeTable/BP_NewtonsCradle.NewtonsCradle
 cryptoLayer ActorHitProxyMask
 expression "((ActorHitProxyMask00.red == 30057640.0) ? ActorHitProxyMask00.green : 0.0) + ((ActorHitProxyMask00.blue == 30057640.0) ? ActorHitProxyMask00.alpha : 0.0) + ((ActorHitProxyMask01.red == 30057640.0) ? ActorHitProxyMask01.green : 0.0) + ((ActorHitProxyMask01.blue == 30057640.0) ? ActorHitProxyMask01.alpha : 0.0) + ((ActorHitProxyMask02.red == 30057640.0) ? ActorHitProxyMask02.green : 0.0) + ((ActorHitProxyMask02.blue == 30057640.0) ? ActorHitProxyMask02.alpha : 0.0) + 0"
 keyedName ""
 previewExpression0 "((mantissa(abs(ActorHitProxyMask00.red)) * 1 % 0.25) * ActorHitProxyMask00.green + (mantissa(abs(ActorHitProxyMask00.blue)) * 1 % 0.25) * ActorHitProxyMask00.alpha + (mantissa(abs(ActorHitProxyMask01.red)) * 1 % 0.25) * ActorHitProxyMask01.green + (mantissa(abs(ActorHitProxyMask01.blue)) * 1 % 0.25) * ActorHitProxyMask01.alpha)"
 previewExpression1 "((mantissa(abs(ActorHitProxyMask00.red)) * 16 % 0.25) * ActorHitProxyMask00.green + (mantissa(abs(ActorHitProxyMask00.blue)) * 16 % 0.25) * ActorHitProxyMask00.alpha + (mantissa(abs(ActorHitProxyMask01.red)) * 16 % 0.25) * ActorHitProxyMask01.green + (mantissa(abs(ActorHitProxyMask01.blue)) * 16 % 0.25) * ActorHitProxyMask01.alpha)"
 previewExpression2 "((mantissa(abs(ActorHitProxyMask00.red)) * 64 % 0.25) * ActorHitProxyMask00.green + (mantissa(abs(ActorHitProxyMask00.blue)) * 64 % 0.25) * ActorHitProxyMask00.alpha + (mantissa(abs(ActorHitProxyMask01.red)) * 64 % 0.25) * ActorHitProxyMask01.green + (mantissa(abs(ActorHitProxyMask01.blue)) * 64 % 0.25) * ActorHitProxyMask01.alpha)"
 previewExpression3 ""
 previewChannel none
 in00 ActorHitProxyMask00
 in01 ActorHitProxyMask01
 in02 ActorHitProxyMask02
 in03 none
 in04 none
 in05 none
 in06 none
 in07 none
 in08 none
 in09 none
 in10 none
 in11 none
 }
 push $N56cf6800
 Dot {
 name Dot1
 xpos 13
 ypos -171
 }
 Dot {
 name Dot2
 xpos 13
 ypos -32
 }
 HueShift {
 inputs 1+1
 saturation 2.32
 color_saturation 0.94
 hue_rotation 88
 name HueShift1
 xpos 66
 ypos -36
 }
 Dot {
 name Dot3
 xpos 194
 ypos -32
 }
 Dot {
 name Dot4
 xpos 194
 ypos -206
 }
 add_layer {FinalImageMovieRenderQueue_WorldDepth FinalImageMovieRenderQueue_WorldDepth.red FinalImageMovieRenderQueue_WorldDepth.green FinalImageMovieRenderQueue_WorldDepth.blue FinalImageMovieRenderQueue_WorldDepth.alpha}
 ZDefocus2 {
 z_channel FinalImageMovieRenderQueue_WorldDepth.red
 math depth
 fill_foreground false
 center {{"[metadata exr/unreal/camera/FinalImage/focalDistance]"}}
 focal_point {960 540}
 size {{"((input.height*(focalLength*focalLength / (fstop * (focalDistance - focalLength)))*.5 / sensorWidth)/10)" x1 26}}
 max_size 100
 filter_type bladed
 legacy_resize_mode false
 show_legacy_resize_mode false
 blades {{"[metadata exr/unreal/camera/ActorHitProxyMask/dofDiaphragmBladeCount]"}}
 name ZDefocus1
 xpos 296
 ypos -216
 addUserKnob {20 User}
 addUserKnob {7 focalLength l "Focal Length"}
 focalLength {{"[metadata exr/unreal/camera/FinalImage/focalLength]"}}
 addUserKnob {7 focalDistance l "Focal Distance"}
 focalDistance {{"[metadata exr/unreal/camera/FinalImage/focalDistance]"}}
 addUserKnob {7 sensorWidth l "Sensor Width"}
 sensorWidth {{"[metadata exr/unreal/camera/FinalImage/sensorWidth]"}}
 addUserKnob {7 fstop l Fstop}
 fstop {{"[metadata exr/unreal/camera/FinalImage/fstop]"}}
 }
 set N62ca2800 [stack 0]
 push $N62ca2800
 add_layer {FinalImageMovieRenderQueue_MotionVectors FinalImageMovieRenderQueue_MotionVectors.red FinalImageMovieRenderQueue_MotionVectors.green FinalImageMovieRenderQueue_MotionVectors.blue FinalImageMovieRenderQueue_MotionVectors.alpha}
 ShuffleCopy {
 inputs 2
 in FinalImageMovieRenderQueue_MotionVectors
 in2 none
 red green
 green red
 out FinalImageMovieRenderQueue_MotionVectors
 name RG_TO_GR
 xpos 296
 ypos -178
 }
 Add {
 value -0.5
 name Subtract_05
 xpos 296
 ypos -152
 }
 Multiply {
 channels FinalImageMovieRenderQueue_MotionVectors
 value {0.5625 1 1 1}
 name MultiplyByAspectRatio
 xpos 296
 ypos -114
 }
 Add {
 value 0.5
 name Add_05
 xpos 296
 ypos -76
 }
 VectorBlur2 {
 uv FinalImageMovieRenderQueue_MotionVectors
 mv_presets "V-Ray Velocity"
 uv_offset -0.5
 blur_type uniform
 scale {{width}}
 soft_lines true
 maskChannelInput FinalImageMovieRenderQueue_WorldDepth.red
 name VectorBlur3
 xpos 296
 ypos -38
 }
 Viewer {
 frame 1
 frame_range 1-100
 colour_sample_bbox {0.8895833492 -0.2208333313 0.890625 -0.2197916657}
 samplepoints {{0.8895833492 -0.2208333313}
 }
 name Viewer1
 xpos 292
 ypos 12
 }

Additionally, because Unreal Engine stores motion vectors normalized [0-1] in both X and Y you will need to rescale the Red channel to ImageHeight and ImageWidth (1080, 1920 in this example), or 0.5625. To do this rescaling, subtract 0.5 from the velocity channel, multiply it by 0.5625, and then add 0.5 back to the velocity channel before plugging it into the VectorBlur node. Failing to rescale the red channel will result in an incorrect angle for the motion blur.

Like Stencil Layers this feature is intended to be used in combination with an OCIO-based workflow. Depth of field must be applied to images in linear space in order to determine which highlights are bright enough to create bokeh. By disabling the tone curve the look of your image changes. By using an OCIO based workflow you can both visualize the final look in viewport and re-apply the look to your images in post production to recreate the look.

If you would like to experiment with Nuke node creation, you can **download the frames and nuke file** from the above example.

## UI Renderer

The **UI Renderer** will render **Slate (-> slate-user-interface-programming-framework-for-unreal-engine)** or **UMG (-> umg-editor-reference-for-unreal-engine)** Widgets added to the Viewport as a separate output with alpha. You can combine this with your final images in a compositing program to add any UI elements you want to render.

## VT Pending Mips

VT (Virtual Textures (-> virtual-texturing-in-unreal-engine) Pending Mips is a render pass designed to be used in conjunction with the Prestreaming Recorder (-> cinematic-rendering-export-formats-in-unreal-engine). This pass exports Virtual Texture mip debugging frames to your output directory, which can be used to debug your pre-streaming cache.

This debug render pass will not show Virtual Texture information on Nanite geometry. If you are using lots of Nanite geometry, use the `r.nanite 0` console command, which causes all meshes to revert to their non-Nanite versions, and debug information to be better visible.

- rendering
- movie render queue
- output formats
- render passes
- output

On this page

- Prerequisites (-> cinematic-render-passes-in-unreal-engine)
- Overview (-> cinematic-render-passes-in-unreal-engine)
- Deferred Rendering (-> cinematic-render-passes-in-unreal-engine)
- Post Process Render Pass (-> cinematic-render-passes-in-unreal-engine)
- World Depth (-> cinematic-render-passes-in-unreal-engine)
- Motion Vectors (-> cinematic-render-passes-in-unreal-engine)
- Stencil Layers (-> cinematic-render-passes-in-unreal-engine)
- Path Tracer (-> cinematic-render-passes-in-unreal-engine)
- Object ID's (-> cinematic-render-passes-in-unreal-engine)
- Setup (-> cinematic-render-passes-in-unreal-engine)
- Object ID Grouping (-> cinematic-render-passes-in-unreal-engine)
- Combining Object Id, Depth and Velocity in Post (-> cinematic-render-passes-in-unreal-engine)
- UI Renderer (-> cinematic-render-passes-in-unreal-engine)
- VT Pending Mips (-> cinematic-render-passes-in-unreal-engine)
