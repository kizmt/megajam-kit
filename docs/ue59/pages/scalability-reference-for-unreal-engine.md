# Scalability Reference

https://dev.epicgames.com/documentation/en-us/unreal-engine/scalability-reference-for-unreal-engine?application_version=5.9

> Scalability options, properties, and console variables.

[image: Scalability Reference]

The Scalability settings provide a way for you to adjust the quality of various features in order to maintain the best performance for your game on different platforms and hardware.

## Scalability Settings

You can access the Scalability settings in the editor through the Viewport **Performance and Scalability** menu. The **Viewport Scalability **settings contain shortcuts to the most commonly-used settings defined in the `BaseScalability.ini` file, while **Material Quality Level** sets the global material quality setting.

[image: Viewport Performance and Scalability menu and Scalability Groups window]

## Resolution Scale

Unreal Engine can render a scene in lower resolution and scale the image up to the target resolution. As 2D User interfaces usually cost less performance and suffer more from lower resolution, Unreal Engine does not apply this technique to UI. There is a minor cost for the up-sampling pass, but usually, it is worth the effort.

[image: AA resolution scale comparison] Left: 50% no AA, Middle: 50% with AA, Right: 100% (no resolution scale) with AA

Having a softer input image helps the up-sampling step. This means this scalability options benefits from another scalability option: the anti-aliasing quality.

You can access this setting with the **r.ScreenPercentage** console variable. It takes in a value from 10-100 with -1 also equaling 100%.

## View Distance

Objects can be culled based on their distance to the viewer. By default, all objects are not distance culled (desired max draw distance of 0). On top of the designer specified value, there is a global scalability setting that works like a multiplier (**r.ViewDistanceScale**). Here you can see some grass objects (desired max draw distance of 1000):

[image: View distance examples] left: r.ViewDistanceScale 0.4, middle: r.ViewDistanceScale 0.7, right: r.ViewDistanceScale 1.0 (default)

## Anti-Aliasing

[image: AA settings examples] From the left: r.PostProcessAAQuality 0 to 6. The first 3 equal the Low, Medium, High, Epic settings in the Scalability Groups > AA (TSR) settings.

Adjusting the anti-aliasing quality level using the **r.PostProcessAAQuality** console command adjusts the quality of whichever anti-aliasing method you are using (FXAA or temporal AA).

- For either anti-aliasing method, a value of 0 used with **r.PostProcessAAQuality** disables the effect.
- For FXAA, the effect of values 2, 4, and 6, can be seen in the above image; the smoothing of jagged edges becomes better and better.
- Values above 6 have no effect.

For temporal AA, there is a trade off between fill speed of the effect and quality, the higher the value you use:

- r.PostProcessAAQuality 2 with temporal AA is fast to settle but jitter caused by the effect will be more pronounced.
- r.PostProcessAAQuality 4 settles slower but does not jitter.

## Post Processing - sg.PostProcessQuality

[image: Post process quality settings examples] sg.PostProcessQuality set from 0 on the left to 3 on the right.

The **Scalability Groups > Post Processing** option adjusts the quality of the post processing effects in accordance with the settings found in the `BaseScalability.ini` file located in the folder at `[UE_InstallPath]/Engine/Config`. The **Low** setting equates to sg.PostProcessQuality 0 and **Epic** to sg.PostProcessQuality 3.

| sg.PostProcessQuality 0 | sg.PostProcessQuality 1 |
| --- | --- |
| Config @@BLOCK0@@ | Config @@BLOCK1@@ |
| sg.PostProcessQuality 2 | sg.PostProcessQuality 3 |
| Config @@BLOCK2@@ | Config @@BLOCK3@@ |

## Shadows - sg.ShadowQuality

[image: Shadow Quality settings examples] sg.ShadowQuality set from 0 on the left to 3 on the right.

The **Scalability Groups > Shadows** option adjusts the quality of dynamic shadows in accordance with the settings found in the `BaseScalability.ini` file located in the folder at `[UE_InstallPath]/Engine/Config`. The **Low **setting equates to sg.ShadowQuality 0 and **Epic **to sg.ShadowQuality 3.

| sg.ShadowQuality 0 | sg.ShadowQuality 1 |
| --- | --- |
| Config @@BLOCK4@@ | Config @@BLOCK5@@ |
| sg.ShadowQuality 2 | sg.ShadowQuality 3 |
| Config @@BLOCK6@@ | Config @@BLOCK7@@ |

## Textures - sg.TextureQuality

A modern rendering engine requires a lot more GPU memory (textures, meshes, GBuffer, depth buffer, shadow maps). Some of those memory usage costs scale with the screen resolution (for example, GBuffer), others with specific quality settings (for example, shadow maps). Another large memory usage cost comes from the textures used (usually compressed and streamed).

You can instruct the streaming system to manage more aggressively (smaller pool size, culling unused textures) or to have less or more detail in the mip level computation. This can have effects on the image quality, how much you can notice texture streaming artifacts, and how smoothly the game runs (updates require expensive memory transfers). The results can vary, depending on the media (for example, a faster or slower hard drive or SSD). Streaming from DVD or Blu-Ray adds much more latency, so avoid those.

The texture quality also affects the texture filtering mode (**r.MaxAnisotropy**). Limiting the anisotropic sample count reduces texture bandwidth, but does not save texture memory.

| sg.TextureQuality 0 | sg.TextureQuality 1 |
| --- | --- |
| Config @@BLOCK8@@ r.Streaming.MipBias=2.5 r.MaxAnisotropy=0 r.Streaming.PoolSize=200 | Config @@BLOCK9@@ r.Streaming.MipBias=1 r.MaxAnisotropy=2 r.Streaming.PoolSize=400 |
| sg.TextureQuality 2 | sg.TextureQuality 3 |
| Config @@BLOCK10@@ r.Streaming.MipBias=0 r.MaxAnisotropy=4 r.Streaming.PoolSize=700 | Config @@BLOCK11@@ r.Streaming.MipBias=0 r.MaxAnisotropy=8 r.Streaming.PoolSize=1000 |

The effect of this feature is heavily dependent on your game and hardware. If you do not have many textures, to the point where loading and using the full resolution mip maps does not use all of the memory pool Unreal Engine has devoted to textures, you will not actually see a difference between high and low settings (outside of the change to the Anisotropy settings).

## Effects - sg.EffectsQuality

The **Scalability Groups > Effects** option adjusts the quality of many different types of effects in accordance with the settings found in the `BaseScalability.ini` file located in the folder at `[UE_InstallPath]/Engine/Config`. The **Low **setting equates to sg.EffectsQuality 0 and **Epic **to sg.EffectsQuality 3.

| sg.EffectsQuality 0 | sg.EffectsQuality 1 |
| --- | --- |
| Config @@BLOCK12@@ | Config @@BLOCK13@@ |
| sg.EffectsQuality 2 | sg.EffectsQuality 3 |
| Config @@BLOCK14@@ | Config @@BLOCK15@@ |

## Detail Mode

Each placed Actor has a Detail Mode property in the Rendering category. This setting defines the minimum detail level for an Actor to render.

[image: Actor Detail Mode property in the Rendering section.]

The scalability mode can be changed from the console:

 Config

```
r.DetailMode 1
```

r.DetailMode 1

The cvar values map to the settings for the Detail Mode property as follows:

- r.DetailMode 0 = Low
- r.DetailMode 1 = Medium
- r.DetailMode 2 =High

[image: Detail Mode settings examples]

It is easy to use this to disable decals, detail objects, lights, or individual particle effects. Make sure to only use this on objects that have no effect on gameplay, otherwise, you will run into problems with network gameplay, save games, or consistency.

## Material Quality Level

[image: Material Quality Level in the Viewport Performance and Scalability menu.]

Materials can use the **Quality Switch** Material Expression node to disable some expensive Material parts that have a minor effect on the final look. To see the effect of this, you need to toggle to the **Low Quality** mode.

[image: Blueprint Node layout for Material Quality]

Setting the **Material Quality Level** to Low or High determines which expressions get evaluated for this material (the low or high pin). The default pin fills in either high or low (or both) if they have no inputs. This material contains two reasonably high-cost Perlin noise operations when set to high:

This example is to demonstrate the **Material Switch Node**. The
**Noise** nodes are expensive making them good for this example, but they
should be used sparingly as there are cheaper ways to create this
effect.

[image: Material Quality Level settings example] left: Material Quality Level set to low, right: Material Quality Level set to high

[image: Material Quality Level shader cost] left: Material Quality Level set to low, right: Material Quality Level set to high. Shader Complexity mode shows that the high quality material is more costly than other shaders, with darker greens meaning more costly shaders.

Using the quality switch causes more shaders to be compiled (shader permutation).

This feature is not for distance LOD as you cannot have two quality levels at the same time. The feature can be used to reduce:

- Shader computations (for example, disable fuzz layer).Use **Shader Complexity** mode (**Alt+8** in the editor) and instruction count to verify your optimization.

- Texture lookups (no detail bump map).
- Memory bandwidth (for example, using fewer textures).You need to profile on actual hardware to verify this.

Most material editor outputs only affect the pixel shader. World position offset and all tessellation outputs affect the other shader types. Pixels shaders only cost a lot if they occupy large portions of the screen (a skybox for example), while other shaders only matter if the object is not culled (inside the view, not hidden behind opaque objects).

## Skeletal Mesh LOD Bias

[image: Skeletal mesh LOD bias]

Skeletal meshes can have static Level of Details models. Using the console variable **r.SkeletalMeshLODBias**, you can globally bias the LOD level. Depending on the quality of your first or second LOD, it can be a good idea to have this option in the scalability settings. Here you can see the scalability setting on top of the distance dependent LOD.

## Grass and Foliage Scalability

The **Scalability Groups > Foliage** option adjusts how many foliage meshes are rendered at one time in accordance with the settings found in the `BaseScalability.ini` file located in the folder at `[UE_InstallPath]/Engine/Config`. The **Low **setting equates to FoliageQuality 0 and **Epic **to FoliageQuality 3.

For Foliage Static Meshes to work with the Scalability settings you must
 enable the Enable Density Scaling option. You can read more about how
to set this up in theFoliage Mode (-> foliage-mode-in-unreal-engine) documentation.

| FoliageQuality 0 | FoliageQuality 1 |
| --- | --- |
| Config @@BLOCK17@@ [FoliageQuality@0] foliage.DensityScale=0 grass.DensityScale=0 | Config @@BLOCK18@@ [FoliageQuality@1] foliage.DensityScale=0.4 grass.DensityScale=0.4 |
| FoliageQuality 2 | FoliageQuality 3 |
| Config @@BLOCK19@@ [FoliageQuality@2] foliage.DensityScale=0.8 grass.DensityScale=0.8 | Config @@BLOCK20@@ [FoliageQuality@3] foliage.DensityScale=1.0 grass.DensityScale=1.0 |

## Customizing Scalability Settings

You can customize any of the Scalability Settings used in your Unreal Engine project. In the following example we will add and the change the Scalability Settings for the Foliage by doing the following:

- Go to your projects Config folder and create a new `.ini` file called `DefaultScalability.ini`.[image: Create a new ini file]
- Open up the newly created `DefaultScalability.ini` file and add the following lines of code to it. Config ```
[FoliageQuality@0]
foliage.DensityScale=.25
grass.DensityScale=.25

[FoliageQuality@1]
foliage.DensityScale=0.50
grass.DensityScale=0.50

[FoliageQuality@2]
foliage.DensityScale=0.75
```
- Save the file and now when the Scalability settings for **Foliage** are changed, the amount of Foliage and Landscape Grass Static Meshes that are spawned will be reduced or increased based on which setting was picked.

- scalability

On this page

- Scalability Settings (-> scalability-reference-for-unreal-engine)
- Resolution Scale (-> scalability-reference-for-unreal-engine)
- View Distance (-> scalability-reference-for-unreal-engine)
- Anti-Aliasing (-> scalability-reference-for-unreal-engine)
- Post Processing - sg.PostProcessQuality (-> scalability-reference-for-unreal-engine)
- Shadows - sg.ShadowQuality (-> scalability-reference-for-unreal-engine)
- Textures - sg.TextureQuality (-> scalability-reference-for-unreal-engine)
- Effects - sg.EffectsQuality (-> scalability-reference-for-unreal-engine)
- Detail Mode (-> scalability-reference-for-unreal-engine)
- Material Quality Level (-> scalability-reference-for-unreal-engine)
- Skeletal Mesh LOD Bias (-> scalability-reference-for-unreal-engine)
- Grass and Foliage Scalability (-> scalability-reference-for-unreal-engine)
- Customizing Scalability Settings (-> scalability-reference-for-unreal-engine)
