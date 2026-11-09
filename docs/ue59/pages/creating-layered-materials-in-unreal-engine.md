# Creating Layered Materials

https://dev.epicgames.com/documentation/en-us/unreal-engine/creating-layered-materials-in-unreal-engine?application_version=5.9

> An introductory document on the Layered Materials technique in Unreal Engine.

[image: Creating Layered Materials]

This tutorial demonstrates the process of creating a simple **Layered Material** comprised of two layers: chrome and snow. The final Layered Material uses a world-aligned blend to automatically place snow on the upward facing surfaces of the mesh, effectively switching between the two Materials. The blend function always checks for the top surface, meaning even as you rotate the object, the snow Material remains on top, as shown in the image below:

[image: World aligned layered Material]

Generally when creating Layered Materials, it is common to create each layer as a Material and copy/paste your node network into a new Material Function. To save time, this tutorial builds each layer within Functions to begin with.

## Simple Chrome

|  |  |
| --- | --- |
| Chrome Textures |  |
|  |  |
| T_ExampleLayers_Metal_1_BC.png | T_ExampleLayers_Metal01_N.png |
| (Right-click and Save As) | (Right-click and Save As) |

The base layer is a simple chrome Material with some subtle surface imperfections to add visual interest. To help demonstrate editability, the Material includes several inputs that allow you to fine-tune the overall look.

- Right-click in the **Content Browser**, click **Materials** and select **Material Function** in the context menu.[image: Create Material Function]
- Name the Material Function **Layer_Chrome**.[image: Rename function]
- **Double-click** the Material Function to open it in the Material Editor.[image: New Material function in editor]
- **Right-click** in the Material Graph, and then search for and select **Make Material Attributes** in the context menu.[image: Add Make Material Attributes from context menu]
- Connect the **Make Material Attributes** node to the **Output Result** node.[image: Connect Make Material Attributes]

### Chrome Material Network

The Material Graph for the chrome layer is shown below, with a breakdown beneath the image so you can replicate it easily. The two textures used are **T_ExampleLayers_Metal_1_BC.png** for the Base Color and Roughness, and **T_ExampleLayers_Metal01_N.png** for the normal map, both downloadable at the top of this page.

[image: Chrome Material Network] Click to enlarge image.

See the following notes explaining the four comment blocks in the Material Graph.

- **Base Color** - For the Base Color, a Linear Interpolate (LERP) is used to blend between the base chrome color and a very dark gray value (0.3). For the base color, create a **Function Input** node and name it **Tint**. Make sure the input type is set to **Vector3** in the Details Panel, which allows you to input a color into the function to change the tint of the chrome. The red channel of the **T_ExampleLayers_Metal_1_BC** texture is used to drive the interpolation between the two values.[image: Input type vector 3]
- **Metallic** - Since this is a metal Material, a value of 1 is passed into the Metallic input.
- **Roughness** - Roughness should generally be very low for a chrome Material, but some subtle variation can add depth to the overall look of the Material. In this case, the red channel of the chrome texture is used to LERP between values of 0.2 and 0.4. This means darker areas on the texture map will have slightly higher roughness than the light areas.
- **Customizable Normal** - This network simply takes in a tangent space normal map and separates the green and red channels, which control the bulk of the map's detail. Each channel is multiplied by a value supplied from another Function Input. This input is set to a Scalar type and named **Normal Multiplier**, with a default value of 1.0. Using an **AppendVector node**, the results are appended together and then appended to the blue channel of the normal map. The result is that the user has the power to adjust the height of the normal by changing the Normal Multiplier value.

Make sure you compile and save your Material Function (-> unreal-engine-material-functions-overview) when finished.

## Simple Snow

|  |  |
| --- | --- |
| Snow Textures |  |
|  |  |
| T_Cave_Ice_Tiling_D.png | T_Cave_Ice_Noise_N.png |
| (Right-click and Save As) | (Right-click and Save As) |

Download the two textures above and import them into Unreal Engine. Follow the steps below to create a second Material Function for the snow layer.

- Right-click in the **Content Browser**, click **Materials** and select **Material Function** in the context menu.[image: Create Material Function]
- Name the Material Function **Layer_Snow**.[image: Rename function]
- **Double-click** the Material Function to open it in the Material Editor.[image: New Material Function]
- **Right-click** in the Material Graph, and search for **Make Material Attributes** in the context menu, and add it to the graph.[image: Add Make Material Attributes from context menu]
- Connect the **Make Material Attributes** node to the **Output Result** node.[image: Connect Make Material Attributes]

### Snow Layer Network

Below is a simple breakdown of the snow Material Graph. This layer uses the **T_Cave_Ice_Tiling_D.png** and **T_Cave_Ice_Noise_N.png** textures, both downloadable at the top of this page.

[image: Snow Material network]

- **Base Color** - This is the only relatively sophisticated part of the network, and only because it uses the **FuzzyShading** Material Function. This function simply keeps the texture from getting too dark when the Material is receiving light. This is similar to the way light passes through fibrous surfaces. This makes it perfect for velvet, moss, or in this case, snow. Some contrast is removed from the Base Color texture (T_Cave_Ice_Tiling_D.png) by raising it to the power of 0.3.Next, plug the result into a FuzzyShading Material Function, which you can insert from the Functions tab in the Material Editor palette. Set **Core Darkness** to 0, **Power** to 1, and**EdgeBrightness** to 0.5. Finally, multiply the whole thing by a very pale blue color (R=0.8, G=0.9, B=0.95) to give it a cold, icy color cast.
- **Metallic** - This is a non-metallic surface, so Metallic is set to 0.
- **Roughness** - Snow should shine a little bit when the light hits it just right, so the red channel of the T_Cave_Ice_Tiling_D.png texture is used to drive a Lerp between 0.6 and 0.3.
- **Normal** - The normal map on its own is a little bit too strong. One way to reduce the effect of the tangent space normal map is to double the strength of the blue channel. This is done by multiplying the normal map by a Constant3 Vector with a value of (1,1,2).

Save your result when finished!

## Layered Material

You can now create a Material and blend the two layer functions together. This example is configured so that the snow always appears on the top of the surface. The Material also contains some parameters to make it customizable in Material instances.

- In the **Content Browser**, click the **Add New** button and choose Material from the context menu.[image: Create new Material]
- Name your new Material **Mat_SnowyChrome**.[image: Rename your Material]
- **Double-click** the Material to open it in the Material Editor.[image: Open new Material in Material Editor]
- Drag your **Layer_Chrome** and **Layer_Snow** Material Functions from the **Content Browser** into the Material Graph.[image: Drag layers into Material Graph]
- Click in the background of the Material Graph to display the base Material Properties in the Details panel. Enable **Use Material Attributes** by checking the box.[image: Enable Use Material Attributes]
- From the Palette, add a **MatLayerBlend_Simple** Material Function, as well as a **WorldAlignedBlend** Function. The MatLayerBlend_Simple will execute the transition from chrome to snow, and the World_Aligned_Blend will power the Layer Blend based on the direction the surface is pointed.

### Layered Material Network

Below is a breakdown of the Mat_SnowyChrome Material network, along with descriptions for each of the commented areas.

[image: Layered Material graph]

- **Chrome Setup** - Two parameters are connected to the Layer_Chrome Material Function. The first is a Scalar Parameter named **Chrome Normal**, which is used to drive the **NormalMultiplier** input. The second is a Vector Parameter named **ChromeTint** that is driving the **Tint** input. These parameters allow you to alter the strength of the normal map, and change the tint of the chrome when the Material is instanced later.
- **Snow Setup** - No additional nodes are needed. The Layer_Snow Material Function is plugged directly into the blend node.
- **World Aligned Blend Setup** - The WorldAlignedBlend node controls the position and sharpness of the Material blend. Set the **Blend Sharpness** value to 10. Then create a Scalar Parameter named **BlendBias** and connect it to the **Blend Bias** input. This allows you to adjust the vertical position on your mesh where the blend occurs.
- **MatLayerBlend** - This node contains the logic used to drive the blend. In this case, the base Material is Layer_Chrome and the top Material is Layer_Snow. The WorldAlignedBlend is plugged into the Alpha input to drive the the transition.

Save your Material when done!

## Instancing a Layered Material

Since this Material contains two parameters, you can now create a Material Instance and customize aspects of the Material Layers.

- If you included the Starter Content in your project, you will have a set of chairs and a table to apply the new Material to. If not, feel free to place some of your own assets in the scene.
- Right-click on the **Mat_SnowyChrome** Material and choose **Create Material Instance** in the context menu. The default name should be fine.[image: Create Material Instance]
- Drag the Material Instance asset from the **Content Browser** onto one of the objects in the scene.[image: Apply Material instance from Content Browser]
- **Double-click** the Material Instance to open it in the Material Instance Editor. You can override the tint of the chrome, the depth of the chrome's normal map, and how much snow has fallen on top of it.

- materials
- shaders

On this page

- Simple Chrome (-> creating-layered-materials-in-unreal-engine)
- Chrome Material Network (-> creating-layered-materials-in-unreal-engine)
- Simple Snow (-> creating-layered-materials-in-unreal-engine)
- Snow Layer Network (-> creating-layered-materials-in-unreal-engine)
- Layered Material (-> creating-layered-materials-in-unreal-engine)
- Layered Material Network (-> creating-layered-materials-in-unreal-engine)
- Instancing a Layered Material (-> creating-layered-materials-in-unreal-engine)
