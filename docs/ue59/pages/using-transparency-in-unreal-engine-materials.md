# Using Transparency in Materials

https://dev.epicgames.com/documentation/en-us/unreal-engine/using-transparency-in-unreal-engine-materials?application_version=5.9

> This page explains how to use transparency in your Materials.

[image: Using Transparency in Materials]

When creating certain surface types such as water or glass, you need the ability to make the surface not only see through, but also give the surface a sense of depth and color.
In the real world, these properties are referred to as **Transparency** or **Opacity** and the two often used interchangeably to describe the same thing. In Unreal Engine, **Transparency** and **Opacity** have two distinct meanings.

- **Transparency** is used to define whether or not a surface can be seen through.

- **Opacity** is used to define degree to which a surface transmits light. In other words, the opacity value determines how transparent or opaque (how see-through / hon see-through ) a surface is.

In the following tutorial you will learn everything you need to know about how to use transparency in your Unreal Engine Materials.

## Transparency

**Transparency** is the term used to describe a surface's ability to block or allow the passage of light. For example, a brick is an object that has no transparency. Stained glass transmits some but not all light, and therefore it is a surface with transparency. You can use transparency to simulate a variety of different real world surface types, including those listed below.

- Hair

- Glass

- Water

- Smoke or Fire Visual Effects

- Clouds

- Impact Decals

- Foliage

## Transparency and Opacity

In Unreal Engine, transparency works by assigning each pixel an **Opacity** value between 0 and 1. When **Opacity** is 1, the surface is fully opaque, meaning it blocks 100% of the light that hits it. When **Opacity** is 0, the surface allows all light to pass through. Opacity values between 0 and 1 yield pixels that are partially see-through. The image below shows opacity values increasing from 0 to 1 on a Static Mesh.

 [image: Opacity values scale]

You can also define opacity with a greyscale texture. The image below demonstrates how a texture can help define which parts of a mesh should have transparency and how transparent they should be. The texture is a gradient that goes from black at the top (or fully transparent) to white at the bottom (or fully opaque). The areas in the middle have a varying degree of opacity based on how close to black or white the pixel in the texture is.

 [image: Opacity ramp]

## Using Transparency in Materials

You can set up transparent Materials using the following steps:

This tutorial uses assets from the Unreal Engine **Starter Content**. If you did not include the Starter Content in your project, read the Migrating (-> migrating-assets-in-unreal-engine)
content page for information about how to move content between projects. This way you can add the Starter Content to your current project and not have to make a new one.

- First **Right-Click** in the **Content Browser** and then select **Material** from the **Create Basic Asset** section of the context menu. [image: Create new Material]

- Name the Material **TransparentMaterial** and then open it by **Double-Clicking** the Material thumbnail in the **Content Browser**. The Material Editor opens.

- Click in the background of the Material Graph to display the Material properties in the **Details** panel. Under the **Material** section change the **Blend Mode** from **Opaque** to **Translucent**. [image: Set translucent blend mode in details properties]

- Now that the **Blend Mode** has been correctly set, add the following Material expressions to your graph. You can find the nodes by typing their names into the search bar in the Material palette. Once found **Left-click** and drag them from the palette into the Material Graph. **Vector Parameter** x 1

- **Scalar Parameter** x 1

 [image: Add parameter expressions to graph]

- Rename the Vector Parameter node to **BaseColor** and give it a color value. Connect the output of the Vector Parameter node into the **Base Color** input on the Main Material Node.

- Rename the Scalar Parameter to **Opacity** and give it a default value of 0.5. Plug the Scalar Parameter into the **Opacity** input on the Main Shader Node. [image: Completed transparent graph]

- Click **Apply** and then **Save** in the Material Editor toolbar to compile the Material and save the asset. [image: Apply and Save Material]

- Find the **TransparentMaterial** asset in the **Content Browser**, right-click the thumbnail and select **Create Material Instance** in the context menu. [image: Create Material Instance]

- Inside the **Content Browser**, navigate to the **Shapes** folder in the Starter Content. Left-click and drag the **Shape_Sphere** Static Mesh into the viewport and release the left mouse button to spawn it in the level. [image: Add sphere to level]

- Find the **TransparentMaterial_Instance** asset in the Content Browser. Left-click and drag the Material instance onto the sphere and release the left mouse button to apply it to the mesh. [image: Apply Material to object]

- Open the Material Instance by **Double-Clicking** on it in the **Content Browser**. In the Material Instance Editor, override the **OpacityAmount** parameter by checking the box next to the parameter name. Once enabled you can adjust the value of **OpacityAmount** to change how transparent the object will be.

## Transparency & Reflections

Objects that make use of transparency can display scene reflections if the following options are set. However keep in mind that having a lot of translucent Materials that have reflections enabled could cause performance issues.

- Open the **TransparentMaterial** that was created above by **double-clicking** it in the **Content Browser**. In the **Details** panel under the **Translucency** category, change the **Lighting Mode** from **Volumetric NonDirectional** to **Surface TranslucencyVolume**. [image: Surface translucency volume settings]

- Inside the Material Graph, select the **OpacityAmount** parameter and duplicate it twice by pressing **CTRL + D** on the keyboard. When completed, your Material Graph should look something like this. [image: Duplicate Material expressions]

- Rename the new Material Expression nodes to **Metallic** and **Roughness**. Set the default value of the **Metallic** Material Expression to 1.0 and set the default value of **Roughness** to 0. Then connect each Material Expression node to the corresponding input on the Main Material Node. [image: Translucent reflective Material graph]

- Click **Apply** and **Save** the Material Editor toolbar and then close the Material Editor. [image: Apply and Save Material]

- You should now be able to see reflections on the spheres in your level. [image: Transparent Material with reflections in level]

By adjusting the parameters of the Material Instance, you can make the Transparency have extremely different looking results.

## Tinted or Colored Transparency

With the **Thin Transparent** Shading Model and Material expression, you can accurately represent tinted and colored transparent Materials, such colored glass and plastics. This Shading Model enables white specular highlights with correctly tinted background color for transparent surfaces.

 [image: Standard Translucent Shading Model]

 [image: Thin Translucent Shading Model]

An example of a Thin Translucent Material Graph is shown below.

Click to enlarge image.

Configure the Material with the following properties in the **Details** panel:

- Change the **Blend Mode** to **Translucent.**

- Change the **Shading Model** to **Thin Translucent.**

- In the Translucency category, change the **Lighting Mode** to **Surface ForwardShading.**

Add a **Thin Translucent Material** expression to the graph and connect a Constant3Vector or a Vector Parameter to the input. This node controls color tint of the transparent surface.

## Translucent Colored Shadows

Translucent Materials are able to cast colored shadows with light transmission in some cases. The amount of light that passes through the Material is determined by its opacity values and how much light is being cast onto the Material.

 [image: Translucent colored shadows]

Translucent colored shadows is currently only achievable with Static Lighting (-> static-light-mobility-in-unreal-engine) and Lightmass (-> lightmass-basics-in-unreal-engine).

For additional information and usage, see Using Colored Translucent Shadows (-> using-colored-translucent-shadows-in-unreal-engine).

## Transparency & Performance

 [image: Shader complexity viewport]

Transparency, especially lit transparency, can quickly become a performance bottleneck if there are too many transparent objects in a scene. The term used to describe this problem is overdraw. **Overdraw** occurs when you have lots of objects with Transparency rendering on top of one another. The reason overdraw causes such a performance problem is because the cost of redering transparency becomes more and more expensive for each successive layer of transparency that you introduce.

To help you better identify whether this issue is happening and where, Unreal Engine has a special view mode called **Shader Complexity** mode. Shader Complexity mode shows you how complex a given surface is to render by using colors to show complexity. The more green that you see, the cheaper things are to render. The more red that you see, the more expensive that frame is to render. Use the following steps to enable Shader Complexity view mode.

- To enable **Shader Complexity**, click the **View Mode** option at the top of the Editor Viewport. By default the view mode is set to **Lit**. [image: View modes menu]

- Select the **Shader Complexity** option from the context menu. [image: Toggle shader complexity]

- After activating the **Shader Complexity** view mode, the level viewport should look like the video below.

Overdraw is demonstrated very clearly in the video as the camera rotates around the transparent spheres in the level. When the spheres are all displayed side by side, there is no overdraw and the viewport is mostly green. When all six spheres are all in the same line of sight, the areas with the most overlap turn bright red to indicate overdraw. While it is not 100 percent possible or advisable to get rid of all overdraw, this view mode can make it very helpful when trying to figure out exactly where your performance issues could be coming from.

## Translucency Sort Priority

When there are multiple transparent objects in a scene close together, you may notice that the engine sometimes has issues determining which object to render in front or behind the other transparent objects. The following example demonstrates this happeing using the Materials from above and the lit steam VFX from the Starter Content.

Notice how the steam initially renders in front of the meshes and then suddenly pops behind each sphere. To prevent this from happening, the **Translucency Sort Priority** needs to be set so that the VFX of the smoke will always render on top of other translucency in the scene. To change the **Translucency Sort Priority** on the VFX, do the following.

- First select the object or objects that you want to render on top of all other Translucency in the level. In this case, select the VFX particle system. [image: Select particle system in viewport.]

- In the **Details** panel, navigate to the **Rendering** section and then expand the **Advanced** subcategory. [image: Advanced rendering settings in Details panel]

- From the new list of options, look for **Translucency Sort Priority** and then input a value of **100**. [image: Translucency sort priority settings] By default, everything that is added to a level has a **Translucency Sort Priority** of 0. If you want something that is transparent to always draw over the top of everything else that is transparent, use positive numbers. If you want something that is transparent to always draw behind everything else that is transparent, use negative numbers.

- Now check out the steam VFX in the scene. With a **Translucency Sort Priority** set to 100, the steam will always draw on top of the other translucent objects.

- Setting the **Translucency Sort Priority** to -100 makes it so that the steam always draws behind other translucent objects.

While adjusting the **Translucency Sort Priority** can fix sorting issue in the level, it could introduce new sorting issues when spawning effects or objects during game play. Because of this, it is a good idea to define what **Translucency Sort Priority** number to use and where. For example, you could say that all spawned effects will have a **Translucency Sort Priority** of 100. So, if there are some sorting issues in the level, you can adjust the objects in the levels **Translucency Sort Priority** to be any number up to 99. This way, the spawned game effects will always render on top of everything else no matter what **Translucency Sort Priority** objects in the level have.

## Conclusion

Transparency is a very powerful tool that can help to make your 3D projects come to life. Remember to try and keep the number of transparent objects that use reflections to a minimum whenever possible, as this can easily affecct performance. Finally, make sure to regularly check Shader Complexity mode both in the editor and during game play to make sure that transparency overdraw is kept to a minimum.

- materials
- shaders

On this page

- Transparency (-> using-transparency-in-unreal-engine-materials)
- Transparency and Opacity (-> using-transparency-in-unreal-engine-materials)
- Using Transparency in Materials (-> using-transparency-in-unreal-engine-materials)
- Transparency & Reflections (-> using-transparency-in-unreal-engine-materials)
- Tinted or Colored Transparency (-> using-transparency-in-unreal-engine-materials)
- Translucent Colored Shadows (-> using-transparency-in-unreal-engine-materials)
- Transparency & Performance (-> using-transparency-in-unreal-engine-materials)
- Translucency Sort Priority (-> using-transparency-in-unreal-engine-materials)
- Conclusion (-> using-transparency-in-unreal-engine-materials)

Related documents

Opacity Material Functions

 [image: Opacity Material Functions] (-> opacity-material-functions-in-unreal-engine)
