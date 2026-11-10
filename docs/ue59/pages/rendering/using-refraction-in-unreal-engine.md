# Using Refraction

https://dev.epicgames.com/documentation/en-us/unreal-engine/using-refraction-in-unreal-engine?application_version=5.9

> A guide for using Refraction in your Materials.

[image: Using Refraction]

When light passes from one medium to another, say from air to water, the direction that that light is traveling is altered where the two mediums meet. This lighting phenomenon is referred to as refraction and happens because the speed of a light wave can change when the light passes into a different type of Material. In Unreal Engine you can simulate this lighting phenomena in your Materials by using the **Refraction** input on the Main Material Node (-> using-the-main-material-node-in-unreal-engine).

## Refraction

**Refraction** is the term used to describe the change in direction of a light wave due to a change in its transmission medium. In other words, when light comes in contact with certain surfaces, like water or glass, the light is bent or redirected because those surfaces affect the speed at which light travels through them.

You can see a classic example of refraction by dipping a pencil into a bowl of water. The pencil will appear to bend or change directions at the spot where the pencil intersects the water. The illustration below shows how refraction works.

 [image: Refraction illustration]

**X** shows the true physical position of the pencil when it is dipped in water. The light rays from the submerged portion of the pencil are refracted at the air-water interface, changing speed and direction. From the camera's perspective, the pencil appears to bend at the surface of the water, with the tip appearing at position **Y** instead of its true position **X**.

## Index of Refraction or IOR

**Index of Refraction** or IOR is an optical measurement that describes the extent to which light is bent, or refracted, when it enters a particular Material. Index of refraction can be measured, and real-world values for common surfaces are well known. When creating refractive Materials in Unreal Enging, it is best to use real-world IOR values to give your Materials a better sense of realism. The table below lists measured IOR values for some common surface types.

| Material | IOR Value |
| --- | --- |
| **Air** | 1.00 |
| **Water** | 1.33 |
| **Ice** | 1.31 |
| **Plexiglass** | 1.49 |
| **Glass** | 1.52 |
| **Diamond** | 2.42 |

## Using Refraction in Materials

Follow the instructions below to create a Material that uses refraction.

This tutorial uses assets from the Unreal Engine Starter Content. If you did not include the Starter Content in your project, read the Migrating Assets (-> migrating-assets-in-unreal-engine) page to learn how to migrate the Starter Content into your current project.

- **Right-click** in the **Content Browser** and select **Material** from the Create Basic Asset section in the context menu. Rename the Material **RefractionMaterial**. [image: Create Material asset]

- **Double-click** the Material asset to open it in the Material Editor. [image: Open Refraction Material]

- In the Details Panel, change the **Blend Mode** from **Opaque** to **Translucent.** Expand the Translucency section and change the **Lighting Model** from **Volumetric Non Directional** to **Surface Translucency Volume**. Changing these settings will enable the **Refraction** pin on the Main Material Node. When completed, your **Details** panel properties should look like this. [image: Details panel properties]

- Search for the following Material Expression nodes and add them to your graph in the quantites listed below. Your Material Graph should look like the image below. **Constant** x 3

- **Scalar Parameter** x 2

- **Lerp** x 1

- **Fresnel** x 1

 [image: Material Graph with required nodes]

- Begin wiring up the Material as shown below. Change the Constant value flowing into Base Color and Metallic to **1**. Rename one of the Scalar Parameters **Opacity,** give it a default value of **0.3** and connect it to the Opacity input. [image: Base Color, Metallic, Roughness nodes]

- Rename the second Scalar Parameter **IOR** and change its default value to **1.52** (the IOR of glass). Finish wiring up the Material as shown in the outlined portion of the image. [image: Fresnel refraction logic] Because glass does not refract light the same way from all viewing angles, a **Fresnel** Material Expression is used to blend between the two values in the **Lerp** node. Glass does not refract as much light when viewed straight-on, but produces noticeable refraction at glancing angles. The Fresnel node reproduces this effect — the **Constant** value in input A is mapped to the center of the Material, and the **IOR parameter** in input B is mapped to the edges where the sphere curves away from the camera. Read the page on Using Fresnel in Materials (-> using-fresnel-in-your-unreal-engine-materials) for a better understanding of how the Fresnel Material Expression works.

- Click **Apply** and **Save** in the Toolbar to compile the Material and save the asset. After the Material is saved you can close the Material Editor. [image: Compile and save Material]

- Find the **RefractionMaterial** asset in the Content Browser, **right-click** on the thumbnail and select **Create Material Instance** from the context menu.

- Drop a few objects into your scene to test the Material. The example below uses assets from the **Shapes** folder in the **Starter Content**, but any object is suitable. Drag the **RefractiveMaterial_Inst** asset from the Content Browser onto the meshes in your scene. Note how the sphere appears to refract light at the edges, but not in the center where the geometry is directly in front of the camera. This is the result of the Fresnel logic described above. [image: Apply refractive Material instance]

- Double click on the **RefractionMasterial_Inst** to open it in the Material Instance Editor. Enable the **IOR parameter** by checking the box next to the parameter name. Once enabled, you can set the IOR to different values to simulate different surface interaction. The video below shows how the refraction changes when the value is set to 1.0 (air), 1.33 (water), 1.52 (glass), and 2.42 (diamond).

## Refraction Tips & Tricks

This section presents some ways you can use Refraction in combination with other aspects of the Material Editor to create complex and interesting refractive surfaces.

### Refraction & Normal Maps

Adding an option to use a normal map with your refractive Material will yield some very interesting results, especially in areas where the Normal map has a lot of interesting detail. Follow the steps below to modify the **RefractiveMaterial** created above so that it works with normal maps.

- First find a normal map to use. For this example, **T_Water_N** from Starter Content was used, however any normal texture will work. Open the **RefractionMaterial** asset and drag the normal texture from the **Content Browser** into the Material Graph. [image: Add normal map to graph]

- **Right-click** on the normal map Texture Sampler and select **Convert to Parameter.** Rename the parameter **Normal Map** and connect it to the **Normal** input on the Main Material Node. By parameterizing the texture, you give artists a way to override it in a Material Instance (-> instanced-materials-in-unreal-engine) without editing the parent Material.

- Click **Apply** and **Save** in the Toolbar and then close the Material. [image: Compile and save Material]

- In the Material Instance Editor you should now see the **Normal Map** parameter listed under Global Texture Parameter Values. You can override the Normal Map by enabling the parameter and choosing a different texture from the drop-down menu. [image: Normal Map parameter]

- By changing the Normal map, you can change the Material's refraction in interesting ways. Here are some examples using only the Normal maps you can find in the Textures folder of the Starter Content. [image: Normal Map examples]

### Refraction and Movement

Combining refraction with motion is a key component in many types of Materials. Ripples on water are one example, but the technique is similarly useful in a lot of VFX Materials such as heat haze, distortion from a large explosion, or energy effects.

The graph below shows one way to add organic looking motion to the normals. Duplicate the normal map, and connect them to the A and B inputs on a Lerp node. Add two **Panner** Material Expressions to the graph and connect them to the UVs of the normal map textures.

 [image: Normal map animation graph]

Change the values in the **Panner** nodes to add motion to the textures. Making some of the values negative moves the texture in the opposite direction, and is a good way to create organic, random looking motion. Here are the values used for the two Panners in this example.

 [image: Panner motion values]

The result is shown in the video below. In its current state it resembles an oily, metallic looking fluid, but with some modifications it could be the basis for a water Material.

### Refraction Depth Bias

**Refraction depth bias** is a way to prevent closer objects from rendering into the distorted surface at acute viewing angles. However this can increases the disconnect between the surface and where the refraction starts.
You can adjust the **Refraction Depth Bias** in the following two places.

- **Material Editor** - You can find the **Refraction Depth Bias** in the **Details** panel under the Material section. You will need to press the white triangle (Highlighted in Green) to expose this property. [image: Refraction Depth Bias in Material Editor]

- **Material Instance Editor** - You can find the **Refraction Depth Bias** in the **General** section of the **Details** panel. [image: Refraction Depth Bias in Instance Editor]

## Conclusion

Adding refraction to your Materials is a great way to get realistic looking results for translucent Materials like glass and water. Remember to consult the choart at the top of the document and use correct IOR values for the type of surface you are trying to simulate. IOR values come from real world measurements, so pushing the IOR higher or lower than what it is supposed to be is not recommend if you are striving for realism. In VFX and other looser applications of refraction, you can of course experiment and use values that suit your desired aesthetic.

- materials
- shaders

On this page

- Refraction (-> using-refraction-in-unreal-engine)
- Index of Refraction or IOR (-> using-refraction-in-unreal-engine)
- Using Refraction in Materials (-> using-refraction-in-unreal-engine)
- Refraction Tips & Tricks (-> using-refraction-in-unreal-engine)
- Refraction & Normal Maps (-> using-refraction-in-unreal-engine)
- Refraction and Movement (-> using-refraction-in-unreal-engine)
- Refraction Depth Bias (-> using-refraction-in-unreal-engine)
- Conclusion (-> using-refraction-in-unreal-engine)

Related documents

Material Inputs

 [image: Material Inputs] (-> material-inputs-in-unreal-engine)
