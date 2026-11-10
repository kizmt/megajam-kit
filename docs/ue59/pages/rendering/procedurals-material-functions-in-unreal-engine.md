# Procedurals Material Functions

https://dev.epicgames.com/documentation/en-us/unreal-engine/procedurals-material-functions-in-unreal-engine?application_version=5.9

> Procedurally generated textures and operations, such as the creation of normal maps from existing height maps.

[image: Procedurals Material Functions]

The **Procedural** Material functions provide a quick way to make simple procedurally generated textures and masks. This saves memory over having to use imported textures.

## GeneratedBand

The **GeneratedBand** function generates a horizontal or vertical band from the default TextureCoordinates.

| Inputs | Description |
| --- | --- |
| **Width (Scalar)** | A 0-1 value that calculates the width of the procedural band. The default is 0.25. |
| **Sharpness (Scalar)** | This controls the falloff of the band's edges. A setting of 100 will produce a very sharp band with aliasing. |
| **Offset (Scalar)** | This value will slide the band around the texture space. |
| **Direction Switch (StaticBool)** | Setting this to true will cause the band to be vertical instead of horizontal. Default is false, or horizontal. |
| **Compare (Scalar)** | This is the value the texture coordinate is compared against in order to produce the band. The default is 0.5. |
| **Input Coordinates (Vector2)** | Takes in a custom set of UVs rather than the default ones already built into the function. |

 [image: Generated Band]

## GeneratedOffsetBands

Like the GeneratedBand function, **GeneratedOffsetBands** creates procedurally generated bands of texture across the UV space. However, this function can produce multiple bands instead of just one.

| Inputs | Description |
| --- | --- |
| **Width (Scalar)** | A 0-1 value that calculates the width of the procedural band. The default is 0.25. |
| **Sharpness (Scalar)** | This controls the falloff of the band's edges. A setting of 100 will produce a very sharp band with aliasing. |
| **Offset (Scalar)** | This value will slide the band around the texture space. |
| **Direction Switch (StaticBool)** | Setting this to true will cause the band to be vertical instead of horizontal. Default is false, or horizontal. |
| **Compare (Scalar)** | This is the value the texture coordinate is compared against in order to produce the band. The default is 0.5. |
| **Bands (Scalar)** | This modifies the total number of bands. |
| **Input Coordinates (Vector2)** | Takes in a custom set of UVs rather than the default ones already built into the function. |

 [image: Generated Offset Bands]

## NormalFromHeightmap

This function serves as a quick way to make a normal map out of an existing black and white heightmap, rather than having to load a separate texture into memory.

This function takes in a TextureObject (T2d) expression node, rather than a TextureSample.

| Inputs | Description |
| --- | --- |
| **Coordinates (Vector2)** | Takes in the coordinates for proper scaling/tiling of the heightmap. |
| **Height Bias (Scalar)** | This is the spread used to derive a proper height from the heightmap. Default value is 0.005. |
| **Height (Scalar)** | This controls the final strength of the normal map. Default is 8. |
| **Heightmap In (TextureObject)** | Takes in the heightmap texture from a TextureObject expression node. |

 [image: Normal From Height Map]

## NormalFromHeightmapChaos

The **NormalFromHeightMapChaos** function takes a heightmap and pans it in 4 directions, then blends the result back together to make a chaotically animated normal map.

This function is considered expensive and should be used with care.

| Inputs | Description |
| --- | --- |
| **Coordinates (Vector2)** | Takes in the coordinates for proper scaling/tiling of the heightmap. |
| **Height Bias (Scalar)** | This is the spread used to derive a proper height from the heightmap. Default value is 0.005. |
| **Height (Scalar)** | This controls the final strength of the normal map. Default is 8. |

At the time of this writing, there is currently no input for a heightmap. Such an input can be added using the steps below. However, if you see a heightmap input, then this has been corrected and the steps below are not needed.

 [image: Input correction]

- **Double-click** on the NormalFromHeightmapChaos function node to open it in a new Material Editor tab.

- Locate the **Texture Object** (T2d) expression node. It should currently have the default texture inside it.

- Create a **FunctionInput** expression node and connect it to the Texture (T2d) inputs on the 3 Motion_4WayChaos function nodes.

- In the properties for the new FunctionInput expression, set the **Input Type** property to FunctionInput_Texture2D.

- Set the **Input Name** property to "Heightmap In" to label the input.

- Connect the original Texture Object (T2d) expression node into the Preview input of the new FunctionInput expression node.

- materials
- shaders

On this page

- GeneratedBand (-> procedurals-material-functions-in-unreal-engine)
- GeneratedOffsetBands (-> procedurals-material-functions-in-unreal-engine)
- NormalFromHeightmap (-> procedurals-material-functions-in-unreal-engine)
- NormalFromHeightmapChaos (-> procedurals-material-functions-in-unreal-engine)
