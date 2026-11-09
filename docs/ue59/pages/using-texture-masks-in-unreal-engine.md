# Using Texture Masks

https://dev.epicgames.com/documentation/en-us/unreal-engine/using-texture-masks-in-unreal-engine?application_version=5.9

> This page describes how to use Texture Masking in your Materials.

[image: Using Texture Masks]

When creating 3D assets, you might find that you need the ability to define different surface types within the same Material.
A simple and cheap way to achieve this is to use a **Texture Mask** that defines which parts of a surface should be affected by which section of the Material.

This tutorial covers how you can use texture masking inside your Unreal Engine Materials.

## Texture Masks

A **Texture Mask** is a grayscale texture, or a single channel (R, G, B, or A) of a texture, used to limit the area of an effect inside a **Material**.

Masks are frequently contained within a single channel of another texture, such as the **Alpha Channel** of the Diffuse or Normal map. In other cases, a single image file often contains the Roughness, Metallic, and Ambient Occlusion masks, each one occupying a single channel.

This is called channel packing, and is a good way to improve Material performance by reducing the number of texture samples required by the Material.
Technically, any channel of any texture can be thought of and used as a texture mask.

Here is an example of what the Texture Mask for the **SM_Chair** Static Mesh from the Starter Content looks like.

[image: RGB chair masks]

In fact, this image file contains a different black and white mask in each of the four color channels (RGBA).

[image: RGBA Masks separated]

## Creating a Texture Mask

You can create a texture mask in any 2D image manipulation program. You can also bake masks directly from geometry in your primary content creation program, or with a dedicated texturing tool like Marmoset Toolbag, Xnormal, or Substance Painter/Designer.

When creating masks by hand, you will generally start with an image that shows the UV layout of your mesh. In this example, the intent is to mask the seat cushions. The corresponding UVs are highlighted in the image below. To mask a specific part of the model, you need to paint that region of the image pure white, while leaving all the other areas black.

[image: Starter chair UVs]

As shown above, this allows you to apply specific surface properties to the masked region. In this case, the mask is used to give the cushions an orange color.

[image: Cushions mask breakdown]

When creating a Texture Mask you should always use either pure black or white and never color information. Using any other type of color could result in strange artifacts when using the mask inside Unreal.

## Exporting a Texture Mask

When you are done painting your mask texture, you can either export it as a single image or you can pack multiple masks together into the R, G, B, and A channels of a single image and export that.
This is commonly referred to as RGB channel packing and is the preferred method when creating masks, as it offers considerable performance and memory savings with very little extra work.

If do you pack something into the alpha channel of a texture, make sure that you remember to enable alpha exporting in whatever 2D image manipulation software you use.
 If not, you run the risk of the alpha channel not being exported with the texture.

## Using Texture Masks

You can use mask textures a number of different ways inside the Unreal Material Editor. Common uses include defining an emissive light source, defining which parts of a mesh are metal and non-metal, or mapping different colors to different portions of a model as shown in the chair example.

The following section demonstrates some of the most common ways to use texture masking in Unreal Engine.

### Emissive Mask

One of the most common uses for a mask texture, is to control the emissive sections of a Material. This is usually done by first creating an emissive mask texture, which uses pure white to define the sections of the Material that should emit light. Two parameters usually accompany an emissive mask:

- To change the color of the light emission, you can multiply the emissive mask by a color defined by a **Vector Parameter**.
- To change the intensity of the emissive light, you can multiply it by a **Scalar Parameter**. Increase the value in the Scalar parameter to increase the brightness of the emission.

The four nodes highlighted in the graph below show an emissive mask multiplied by parameters that control the color and brightness of the light. The sphere only emits light in regions that correspond to the white parts of the emissive mask. The rest of the sphere displays the base color texture.

[image: Emissive node graph]

### Material Masking

A second common use for texture masks is to store different kinds of texture information within the individual R, G, B, and Alpha channels of the. The Material on the SM_Chair Static Mesh that comes with the Starter Content is a perfect example of this technique.

You can find SM_Chair and all the content that goes with it by first selecting the **Starter Content** folder in the **Content Browser** and then entering "chair" into the search box.
This will display all the content that is related to the chair. If you do not see the chair, it probably means that you did not include the Starter Content with your project.
To fix this, you will need to either create a new project or try the Migrating Assets Tool (-> migrating-assets-in-unreal-engine) to move the chair content from another project
into this one.

Opening up the chair Material, M_Chair, we can see a perfect example of Texture Mapping in action.

[image: Starter content chair Material]

In this Material, the mask texture, **T_Chair_M** is used to map specific surface properties to different regions on the mesh. The texture mask helps define which sections are metal or non-metal, and is also used to assign different roughness and color values to different parts of the chair.

In the following image, you can see a breakdown of how each channel in the mask texture is used. On the left side is the composite RGB image, or what the image looks like if you view it as a texture. The middle column shows the black and white masks contained in each color channel (R, G, B, A from top to bottom.) The images on the far right show which part of the chair the mask targets; the white parts of the chair correspond to the white section in the mask.

[image: Chair regions masked]

Here is a breakdown of what type of information is stored inside each channel of the chair mask texture.

- **Red Channel**: Ambient Occlusion information. In the Material, this is used to help add subtle contact shadows where two surfaces are close together.[image: Red channel - Ambient occlusion]
- **Green Channel**: Metallic Mask. In the Material, this is used to define which parts are supposed to be metal. This is also used to help define what color the metal should be. [image: Green channel - metalness mask]
- **Blue Channel**: Non-Metallic Mask. In the Material, this is used to define which parts are non-metal. This mask also helps to define the color of the non-metal parts.[image: Blue Channel - Nonmetal Mask]
- **Alpha Channel**: Whole object Mask. This is not currently used by the Material.

All put together, the chair looks like this in an Unreal level:

[image: Chair in level]

## Masking Tips & Tricks

Texture masking is a very powerful tool, especially when combined with other tools in Unreal Engine. The following section presents some tips and tricks for making the most of texture masking in your work.

### Texture Masking and Material separate

Using texture masking and Material Instances together is a great way to add an almost endless amount of variety to any assets.
For example, you can use a texture mask to define which areas should have certain properties, like color, and then use different Material Instances to customize these properties in the Instance Editor. Read more about Material Instancing here (-> instanced-materials-in-unreal-engine).

[image: Multiple color instances of the Starter Content chair.]

When Material masks are used along with Material Instancing, you can allow artists to quickly and easily change color and other values within the Material. This approach produces highly customizable assets, as seen with the SM_Chair in the image above.

### Masking and Channel Artifacts

Because of a quirk with DirectX, the **green channel** of a texture will often offer the best compression. If any of your masks suffer greatly from compression artifacts, first try placing the information into the green channel of the image to see if that helps. If that does not fix the issue, then try using the Alpha channel to store the mask.

Be careful when trying to use the Alpha channel of a texture to store Mask information. Adding an Alpha channel to a texture will greatly increase the memory footprint of that texture and if
you do this enough, you could lose all the saving you gained by packing different masks in to the RGB channels of the texture.

### sRGB and Mask Textures

When packing multiple Mask Textures into a single texture, you should uncheck sRGB in the Texture Editor, as masks should not be gamma corrected.

[image: Disable SRGB]

If you disable sRGB for a texture that was previously sampled in a Material, the sample type is not automatically updated in existing 2D Texture Sampler nodes. You need to make sure that you adjust the node type in any existing 2D Texture Sampler Nodes. If you do not change the **Sampler Type**, your Material will fail to compile and the following message is displayed in the Stats log.

[image: Incorrect sampler type]

To fix this error, all you need to do is to change the Sampler Type from the default of Color to Linear Color and the warning will go away.
For good measure, you should re-compile the Material to make sure that the changes were successful. Once completed, the warning will go away.

## Conclusion

Texture Masking is a very powerful concept that once mastered allows you to create an almost endless amount of variation with very little source content.
Remember that you only have four available channels in any image file to use for texture masks, so use each channel wisely.
Do not forget to disable sRGB on your mask textures, as it can greatly help to increase the mask's sharpness.

- materials
- uv mapping
- texturing
- shaders

On this page

- Texture Masks (-> using-texture-masks-in-unreal-engine)
- Creating a Texture Mask (-> using-texture-masks-in-unreal-engine)
- Exporting a Texture Mask (-> using-texture-masks-in-unreal-engine)
- Using Texture Masks (-> using-texture-masks-in-unreal-engine)
- Emissive Mask (-> using-texture-masks-in-unreal-engine)
- Material Masking (-> using-texture-masks-in-unreal-engine)
- Masking Tips & Tricks (-> using-texture-masks-in-unreal-engine)
- Texture Masking and Material separate (-> using-texture-masks-in-unreal-engine)
- Masking and Channel Artifacts (-> using-texture-masks-in-unreal-engine)
- sRGB and Mask Textures (-> using-texture-masks-in-unreal-engine)
- Conclusion (-> using-texture-masks-in-unreal-engine)

Related documents

Textures

 [image: Textures] (-> textures-in-unreal-engine)Texture Format Support and Settings

 [image: Texture Format Support and Settings] (-> texture-format-support-and-settings-in-unreal-engine)Texture Asset Editor

 [image: Texture Asset Editor] (-> texture-asset-editor-in-unreal-engine)Texture Material Expressions

 [image: Texture Material Expressions] (-> texture-material-expressions-in-unreal-engine)Using the Emissive Material Input

 [image: Using the Emissive Material Input] (-> using-the-emissive-material-input-in-unreal-engine)Material Instances

 [image: Material Instances] (-> instanced-materials-in-unreal-engine)
