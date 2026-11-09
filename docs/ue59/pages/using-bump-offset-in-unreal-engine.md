# Using Bump Offset

https://dev.epicgames.com/documentation/en-us/unreal-engine/using-bump-offset-in-unreal-engine?application_version=5.9

> Guide for using the Bump Offset node in your Materials.

[image: Using Bump Offset]

The **Bump Offset** Material Expression can improve the illusion of depth on a surface by modifying the UV coordinates of a Material. Bump Offset displaces texels on the surface of an object, creating an impression of parallax and giving an illusion that the surface has more details than it actually does. The Bump Offset expression is typically used alongside a normal map, and can improve upon the impression of depth provided by the normal map alone.

This tutorial demonstrates how to use the Bump Offset node in your Materials.

## Bump Offset

**Bump Offset** is the Unreal Engine term for what is commonly known as parallax mapping. The Bump Offset expression is one way to improve the illusion of depth in a Material without adding additional polygons. Bump Offset Materials use a grayscale height map to provide depth information. The brightest values in the height map are displaced toward the camera, and receive the most parallax (shift) when the camera moves across the surface. Darker areas in the height map appear further away, and shift the least.

## Finding the Bump Offset Material Expression

You can find the Bump Offset Material Expression by searching for it in the **Palette** search box, or by right-clicking in the Material Graph and selecting it in the context menu.

 [image: Add the Bump Offset Node]

Bump Offset also has a Material Editor hotkey (-> placing-material-expressions-and-functions-in-unreal-engine). Hold down the **B key** and **left-click** anywhere in the Material Graph to spawn a BumpOffset node.

When searching for the Bump Offset Material Expression, you will see another Material Expression called **BumpOffset_Advanced**. Bump Offset Advanced is a Material Function that was created to add some extra controls that are not available in the regular Bump Offset node. Although Bump Offset Advanced has additional inputs and outputs, they both use the same underlying principles to manipulate the UVs of a surface and create an illusion that the object has more detail than it actually does.

## Using the Bump Offset Material Expression

Use the following steps to create a Material that uses Bump Offset.

This tutorial uses textures from the Unreal Engine **Starter Content**. If you did not include the Starter Content in your project, read the migrating content (-> migrating-assets-in-unreal-engine)
page for information about how to move assets between projects. This way you can import the Starter Content into your current project.

- **Right-click** in the Content Browser and choose **Material** from the **Create Basic Asset** section in the context menu. Rename the Material something like 'BumpOffset'. [image: Create new Material]

- **Double-click** the Material asset in the Content Browser to open it in the Material Editor. [image: Open Material]

- This example uses three texture samples to pass data into the **Base Color, Roughness, and Normal** inputs. In the Content Browser, navigate to **Content > Starter Content > Textures** and find the three textures listed below. **T_Brick_Clay_New_D**

- **T_Brick_Clay_New_M**

- **T_Brick_Clay_New_N**

Drag all three textures from the Content Browser into your Material Graph to add them as Texture Samples. Your graph should look like the image below.

 [image: Add texture samples to Material]

- Connect the texture samples to the Main Material Node (-> using-the-main-material-node-in-unreal-engine) as shown in the image below. [image: Connect textures to Main Material node] Connect the RGB output of **T_Brick_Clay_New_D** to the **Base Color** input.

- Connect the **Red** channel of the **T_Brick_Clay_New_M** texture to the **Roughness** input. Make sure in this case you use the **R** output pin and not the RGB.

- Connect the RGB output of **T_Brick_Clay_New_N** to the **Normal** input.

- Use one of the three methods above (-> using-bump-offset-in-unreal-engine) to add a Bump Offset Material Expression to your graph. [image: Add Bump Offset to graph]

- The Bump Offset expression will modify the UVs of the three Texture Samples already in your graph. Connect the output pin of the BumpOffset node to the **UVs** pin on the Texture Samples. Your graph should look like the one below. [image: Connect BumpOffset Expression to UVs] When you first connect from the Bump Offset Material Expression to the UVs input on any of the three textures, an error message will appear along the bottom of the BumpOffset node. The Bump Offset Material Expression requires a height map to function correctly, and one has not yet been provided. After you connect a texture to the **Height** input, this error will disappear.

- The Bump Offset Material Expression requires a black and white height map in its **Height** input. The **T_Brick_Clay_New_D** Texture Sample used for the Material's Base Color also has height information stored in its **Alpha channel**. Select the T_Brick_Clay_New_D texture sample and press **Ctrl + D** to duplicate the node. Move the node to the left side of the graph and then connect the **A** output to the **Height** input on the BumpOffset node.

- It is necessary to modify the settings in the Bump Offset expression to prevent an effect known as "UV swimming" where the parallax effect is too strong, causing the textures to appear to slide across the surface of the mesh when the camera moves. Select the BumpOffset node in the graph, and in the Details Panel change the **Height Ratio** value from 0.05 to **0.005**. [image: Height Ratio Value]

- Once the Height Ratio is set, make sure to compile your Material by clicking **Save** or **Apply** in the toolbar. Once the Material is compiled and saved, you can apply it to objects in your level. [image: Apply Material]

Move the slider back and forth to see the sphere with and without Bump Offset. Note how the illusion of depth on the bricks is enhanced when Bump Offset is used. This effect is even more apparent when the camera is in motion.

 [image: Without Bump Offset]
 [image: With Bump Offset]

**A brick Material before and after BumpOffset is added.**

## Conclusion

Using the Bump Offset Material Expression is a cheap and very effective way to add additional depth information to your Materials without adding extra 3D geometry. However keep in mind that the Bump Offset Material Expression does not actually modify the silhouette of a mesh or change the geometry. The illusion of depth is effective most of the time, but can break down in situations where the viewer can move their camera in such a way that it is parallel to the surface on which the Bump Offset Material is applied.

- materials

On this page

- Bump Offset (-> using-bump-offset-in-unreal-engine)
- Finding the Bump Offset Material Expression (-> using-bump-offset-in-unreal-engine)
- Using the Bump Offset Material Expression (-> using-bump-offset-in-unreal-engine)
- Conclusion (-> using-bump-offset-in-unreal-engine)
