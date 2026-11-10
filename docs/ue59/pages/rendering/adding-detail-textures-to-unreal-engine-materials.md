# Adding Detail Textures

https://dev.epicgames.com/documentation/en-us/unreal-engine/adding-detail-textures-to-unreal-engine-materials?application_version=5.9

> A guide for using detail textures in Materials to improve appearance at close distances.

[image: Adding Detail Textures]

When viewing a Material very closely, you will notice that the textures used in the Material can break down and become pixelated. To optimize performance, textures are often scaled to a resolution that looks good from moderate distances, but may not hold up to close scrutiny.

To address this issue, you can use what is known as a **detail texture** to prevent a Material from looking pixelated when it is viewed very closely.

## Detail Texturing

**Detail texturing** allows you to give the illusion of more detail in a texture by layering a highly repeated diffuse and normal texture over the object's original diffuse and normal textures.
This gives the illusion of greater detail at close range than usually would be possible.

Here is an example of detail texturing in action.

[image: Brick Material with and without detail texture]

On the left side (labeled 1), the Material uses a detail texture to add additional high-frequency details to the surface. On the right side (labeled 2) the Material does not use a detail texture. Note that the image on the left appears sharper and more detailed than the image on the right.

## Detail Texturing Node Breakdown

If you search in the **Palette** or context menu for "detail texturing", you will find a **Detail Texturing** Material Function. While this is not the only way that you can apply detail textures to Materials, it is the fastest from a workflow perspective, since all the logic is contained within the Material Function (-> material-functions-in-unreal-engine). All you need to provide is texture inputs.

[image: Detail Texturing Material Function node]

| Property | Description |
| --- | --- |
| **Scale (S)** | This sets the scale of the detail texture. Bigger numbers result in more titling smaller numbers results in less titling. |
| **Diffuse (V3)** | This is the input for the Diffuse Texture. |
| **DetailDiffuse (T2d)** | This is the input for the Diffuse Detail Texture. This input can only accept a Texture Object. |
| **DiffuseIntensity (S)** | This controls the intensity of the Detail Diffuse Texture. |
| **Normal (V3)** | This is the input for the Normal Map Texture. |
| **DetailNormal (T2D)** | This is the input for the Normal Map Detail Texture. This input can only accept a Texture Object. |
| **NormalIntensity (S)** | This controls the intensity of the Detail Normal Map Texture. |

### Converting Texture Sample to Texture Objects

In order for the Detail Texturing Material Function to work correctly, you will need to convert the Textures you want to use as the Detail Textures from regular Texture Samples into Texture Objects. Use the following steps to do this.

- Find the Texture Sample you want to use as a detail texture.[image: Regular texture sample]
- Right click on the Texture Sample node and select **Convert To Texture Object** from the context menu.[image: Convert Texture Sample to Texture Object]
- The Texture Sample is converted to a Texture Object.[image: Texture Object node]

## How to Use Detail Texturing in your Material

There are two ways you can configure a Material to use Detail Texturing, and both of these are documented below. The main difference between the two methods is whether to use the premade Detail Texturing Material Function, or to create the detail texturing logic manually in the Material graph. Neither option is better or worse, as they produce the same results in the end. The method you choose to use depends on the needs of the specific Material and project.

All of the content used in the following sections is available in the Unreal Engine **Starter Content.** While the techniques that are shown here will work with any Textures, if you want to follow along, make sure your project includes the **Starter Content**.

Create a new Material to use for testing. **Right-click** in the **Content Browser** and choose **Material** from the Create Basic Asset section in the context menu. Give the Material a descriptive name like **DetailTexturing**.

[image: Create new Material]

### Using The Detail Texturing Material Function

- Open the Material by **double-clicking** the asset in the **Content Browser.** The Material Editor opens.
- Find the following four textures in the Starter Content. Drag them from the Content Browser into your Material graph.**T_Brick_Clay_Old_D**
- **T_Brick_Clay_Old_N**
- **T_Ground_Gravel_D**
- **T_Ground_Moss_N**

When completed, your Material Graph should look like this:

[image: Four texture sample nodes]

- **Right-click** in the Material graph and search for "Detail Texturing" in the context Menu. Click on **DetailTexturing** under the Misc category to add the Material Function to your graph.[image: Material Editor right-click search menu]
- A **DetailTexturing** Material Function is created in the Material Graph.[image: DetailTexturing Material Function in graph]
- In this example the **T_GroundGravel_D** and **T_Ground_Moss_N** will be used as detail textures. In order to connect detail textures to the Material Function they must be converted to Texture Objects. Right-click on **T_GroundGravel_D** and **T_Ground_Moss_N** and convert them to Texture Objects.[image: Detail textures converted to texture objects]
- Connect all the nodes as shown below. The two brick textures should connect to the **Diffuse** and **Normal** inputs, and the two Texture Objects should connect to the **DetailDiffuse** and **DetailNormal** pins. Pass the Diffuse output into Base Color and the Normal output into the Normal input on the Main Material Node.[image: Material Function wired]
- Additonal values are needed to control the scale and intensity of the textures. You could use either a **Constant** Material Expression or **Scalar Parameter** for these inputs. This example uses three Scalar Parameters named **Scale,** **Diffuse Intensity,** and **Normal Intensity.** The default value in all three of these nodes is set to **1.**[image: Three scalar parameters]
- Connect the Scalar Parameters to their corresponding inputs. When completed, your Material Graph should look like this.[image: Final Material graph]
- By adjusting the values in the Scalar Parameters, you can modify how the Detail Textures will look. Here is an example of what happens when you set the Scale to a value of 1, then 5, and finally 10. The detail texture tiles more times across the mesh, meaning the texture itself appears smaller or finer.[image: Detail tiling at different scales]

### Setting Up Detail Texturing Manually

If for whatever reason you cannot use the **Detail Texturing** Material Function, you can build this functionality inside the Material Graph using Material Expression nodes and the directions below.

- Duplicate the first Material in the **Content Browser** by right-clicking the thumbnail and choosing **Duplicate** from the context menu. Rename the new Material **DetailTexturing_02** and double-click to open it in the Material Editor.[image: Create another Material]
- Delete everything except the four textures. You also need to convert the two Texture Objects back to Texture Samples. Right click each Texture Object node and choose **Convert to Texture Sample** from the context menu.[image: Convert to texture sample]
- The following Material Expression nodes are needed to create detail texturing manually. You can find each of the following by searching for them in the **Palette** or using the search bar in the **right-click** context menu.**Texture Coordinate** x 1
- **Clamp** x 1
- **Scalar Parameter** x 2
- **Add** x 2
- **Multiply** x 3

When completed, the Material Graph should look like this.

[image: All required Material expression nodes]

- After you add all the nodes to your graph, begin connecting them as shown. The image below shows the correct configuration for the Base Color portion of the graph. When completed, the Material Graph should look like this.[image: Base Color Material Graph]Click image to enlarge.
- The logic created in the Base Color section to control texture scale can be reused with the normal maps. Connect the nodes as shown below.[image: Normal Map section]Click image to enlarge.
- With the Base Color and Normal map now all connected together, the Material is now ready to be compiled, saved, and used.[image: Final Material setup]Click image to enlarge.

## Detail Texturing Tip & Tricks

The following section covers some tips and tricks on different ways you can use detail texturing in your Materials.

### Distance Based Detail Texturing

When dealing with large surfaces, such as terrain, you may notice that even though your textures tile seamlessly there is noticeable repetition that weakens the appearance of the texture, especially when viewed in the distance.

To fix this, you can modify the Detail Material that was created previously to allow it to display one texture when the camera is close and another texture when the camera is far away. This is often referred to as distance-based texture blending. You can implement this by following the instructions below.

- First duplicate the **DetailTexturing_02** Material and rename it **DistanceFade**. Open the Material.
- You can delete most of the node connections from the original Material, but do not delete the four textures. You should also keep the section labeled **Scale Controls** below. Search for and add the following Material Expressions to your graph.World_Position x 1
- Camera_Position_WS x 1
- Distance x 1
- Divide x 1
- Power x 1
- Clamp x 1
- Constant x 2

When completed, the Material Graph should look like this.

[image: Distance fade nodes]

- Change the values in the two **Constant** Material expressions to **512** and **4**, and then connect the nodes in the configuration shown below. The distance at which the texture blend occurs is controlled by the first **Constant** that is plugged into the **Divide** Material expression (set to 512 in the example image). The Material graph shown below provides all the logic needed to blend textures based on distance.[image: Distance fade Material logic]
- You can now connect the distance fade logic to the rest of the gaph. First add two **Linear Interpolate (Lerp)** nodes to the graph. The Alpha input on the Lerp nodes will drive the transition between the two textures. Finish wiring up the Material as shown below.
- To preview the effect, hold down the **Right Mouse Button** in the Material preview viewport and move the mouse up and down to zoom in and out. When the camera is 512 units away from the sphere, the Material will transition from brick to gravel. If you can't see this happening, you can adjust the value in the **Constant** plugged into the Divide node. Reducing the value from 512 to something smaller will cause the transition to occur sooner.

## Conclusion

Detail Texturing is a very powerful tool that can improve the appearance of Materials by supplementing the base textures with highly repeated detail textures. Keep in mind that Detail Texturing can only help to hide pixilation to a certain point, and allowing the player's camera to zoom into objects to an unreasonable degree can negate the benefits of detail texturing. Also remember that adding detail texturing could add two or more additional texture lookups to your Material, which may present performance or memory issues, especially on mobile platforms.

- materials

On this page

- Detail Texturing (-> adding-detail-textures-to-unreal-engine-materials)
- Detail Texturing Node Breakdown (-> adding-detail-textures-to-unreal-engine-materials)
- Converting Texture Sample to Texture Objects (-> adding-detail-textures-to-unreal-engine-materials)
- How to Use Detail Texturing in your Material (-> adding-detail-textures-to-unreal-engine-materials)
- Using The Detail Texturing Material Function (-> adding-detail-textures-to-unreal-engine-materials)
- Setting Up Detail Texturing Manually (-> adding-detail-textures-to-unreal-engine-materials)
- Detail Texturing Tip & Tricks (-> adding-detail-textures-to-unreal-engine-materials)
- Distance Based Detail Texturing (-> adding-detail-textures-to-unreal-engine-materials)
- Conclusion (-> adding-detail-textures-to-unreal-engine-materials)

Related documents

Coordinates Material Expressions

 [image: Coordinates Material Expressions] (-> coordinates-material-expressions-in-unreal-engine)Customized UVs

 [image: Customized UVs] (-> customized-uvs-in-unreal-engine-materials)Texturing Material Functions

 [image: Texturing Material Functions] (-> texturing-material-functions-in-unreal-engine)Texture Material Expressions

 [image: Texture Material Expressions] (-> texture-material-expressions-in-unreal-engine)
