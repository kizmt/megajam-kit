# Reflections Material Functions

https://dev.epicgames.com/documentation/en-us/unreal-engine/reflections-material-functions-in-unreal-engine?application_version=5.9

> Functions for aiding in the calculation of values for a variety of reflection types.

[image: Reflections Material Functions]

This example shows off the real-time reflection capabilities of Unreal Engine. The scene shows a subway terminal with a lot of water leaks, grimy ceramic tiles, dilapidated pipe work, and other worn-out environment details. In this document, we will give an overview of some of the Functions that you can use to manipulate reflections like these.

## ViewAlignedReflection

This function takes in a spherical reflection texture and aligns it to the view. The calculation can be offset by inputting a custom reflection vector.

| Inputs | Description |
| --- | --- |
| **ReflectionVector (Vector 3)** | Takes in an existing reflection vector that needs to be aligned to the view. |
| **ReflectionTexture (TextureObject)** | Takes in an existing reflection texture, which needs to be spherical. |
| Outputs |  |
| **Texture** | Outputs the resulting view-based reflection texture. |
| **UVs** | Outputs the UV coordinates of the reflection texture so they can be reapplied elsewhere. |

 [image: View Aligned Reflection]

## WorldAlignedReflection

This function takes in an incoming sphere-based reflection texture and aligns it to the world coordinates. The calculation can be offset by inputting a custom reflection vector.

| Inputs | Description |
| --- | --- |
| **ReflectionVector (Vector 3)** | Takes in an existing reflection vector that needs to be aligned to the view. |
| **ReflectionTexture (TextureObject)** | Takes in an existing reflection texture, which needs to be spherical. |
| Outputs |  |
| **WorldReflection** | Outputs the world-based reflection texture. |
| **WorldReflectionShadowed** | Outputs a more highly contrasted version of the texture that can be applied in shadowed areas. |

 [image: WorldAlignedReflection]

## CustomReflectionVector

This function uses a normal map to generate a reflection vector independent of the default reflection vector and the normal's input on the base shader.

| Inputs | Description |
| --- | --- |
| **Normal (Vector3)** | Takes in a normal map to be used as the basis for the custom reflection vector. |

 [image: Custom Reflection Vector]

- materials
- shaders

On this page

- ViewAlignedReflection (-> reflections-material-functions-in-unreal-engine)
- WorldAlignedReflection (-> reflections-material-functions-in-unreal-engine)
- CustomReflectionVector (-> reflections-material-functions-in-unreal-engine)
