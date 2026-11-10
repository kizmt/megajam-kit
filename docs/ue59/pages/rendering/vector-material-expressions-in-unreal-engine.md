# Vector Material Expressions

https://dev.epicgames.com/documentation/en-us/unreal-engine/vector-material-expressions-in-unreal-engine?application_version=5.9

> Material expressions that output a vector value, such as a position or normal.

[image: Vector Material Expressions]

This page documents the available Vector Material Expressions that output vector values mapped to RGBA. These are useful for many different spatial Material effects, including getting an object's position in world space so that the Material can react, or transitioning colors on a character when they enter a specific area. There are many others that enable you to control local Material effects that you can learn more about in the examples below.

## ActorPositionWS

**ActorPositionWS** outputs Vector3 (RGB) data representing the location of the object with this material on it in world-space.

 [image: Actor Position WS expression]

In this example, ActorPositionWS is passed directly into the Base Color of the Material. As a result, each of the objects with the Material applied to them show a different color as they are moved to different locations in 3D space. Note that the result of the ActorPositionWS node is being divided by 1600 to create a nice blend-in color, rather than an abrupt pop.

## CameraPositionWS

The **CameraWorldPosition** expression outputs a three-channel vector value representing the camera's position in world space.

In the example below, Camera Position is passed into the base color of the Material. Note how the preview sphere changes color as the camera position changes.

## CameraVectorWS

The **CameraVector** expression outputs a three-channel vector value representing the direction of the camera with respect to the surface. In other words, the direction from the pixel to the camera.

**Example Usage:** CameraVector is often used to fake environment maps by connecting the CameraVector to a ComponentMask and using the X and Y channels of the CameraVector as texture coordinates.

 [image: Camera Vector example]

## Constant2Vector

The **Constant2Vector** expression outputs a two-channel vector value, in other words, two constant numbers.

| Property | Description |
| --- | --- |
| **R** | Specifies the float value of the red (first) channel of the vector the expression outputs. |
| **G** | Specifies the float value of the green (second) channel of the vector the expression outputs. |

**Examples:** (0.4, 0.6), (1.05, -0.3)

**Example Usage:** The Constant2Vector is useful for modifying texture scale or offset, as UV coordinates require two-channel values.

 [image: Constant2Vector Example]

To quickly create a Constant2Vector node, hold the **2** key and **left-click** anywhere in the background of the Material Graph.

## Constant3Vector

The **Constant3Vector** expression outputs a three-channel vector value, in other words, three constants numbers. A Constant3Vector is often used to define a solid RGB color, where each channel is assigned to a color (red, green, blue). You can double-click the Constant3Vector node in the Material Graph to summon a color picker dialog.

| Property | Description |
| --- | --- |
| **R** | Specifies the float value of the red (first) channel of the vector the expression outputs. |
| **G** | Specifies the float value of the green (second) channel of the vector the expression outputs. |
| **B** | Specifies the float value of the blue (third) channel of the vector the expression outputs. |

**Examples:** (0.4, 0.6, 0.0), (1.05, -0.3, 0.3)

In this example an Constant3Vector is multiplied by a Texture Sample to change the tint of the texture.

 [image: Constant3Vector Example]

To quickly create a Constant3Vector node, hold **3** key and **left-click** anywhere in the Material Graph.

## Constant4Vector

The **Constant4Vector** expression outputs a four-channel vector value, in other words, four constant numbers. You can use the Constant4Vector expression to define RGBA color, where each chanel is assigned to a color (red, green, blue, alpha).

| Property | Description |
| --- | --- |
| **R** | Specifies the float value of the red (first) channel of the vector the expression outputs. |
| **G** | Specifies the float value of the green (second) channel of the vector the expression outputs. |
| **B** | Specifies the float value of the blue (third) channel of the vector the expression outputs. |
| **A** | Specifies the float value of the alpha (fourth) channel of the vector the expression outputs. |

**Examples:** (0.4, 0.6, 0.0, 1.0), (1.05, -0.3, 0.3, 0.5)

In the example below, a Constant4Vector expression is used to define both the **Base Color** and **Opacity** of the Material. The top pin outputs the RGB color, while the bottom pin outputs the value in the alpha channel. The alpha value of 0.5 results in a semi-transparent Material.

 [image: Constant4Vector Example]

To quickly create a Constant4Vector, hold the **4** key and **left-click** anywhere in the background of the Material Graph.

## LightVector

When used with a **Deferred Decal** Material and Decal actor, the LightVector Material Expression outputs Vector (RGB) data, which represents the normalized (in a range between 0 and 1) position of the current pixel relative to decal projection box, in the decal's coodinate space.

If used with a **LightFunction** Material, the LightVector Material Expression outputs Vector (RGB) data representing the vector from the light to the pixel, in the light's coordinate space.

In other Material Domains, the LightVector expression is unused.

The LightVector Material Expression should only be used with the **Deferred Decal** or **LightFunction** Material Domains.

### Example

You can use the LightVector Material Expression to create a linear falloff effect for a Deferred Decal. In the graph below, there are two parameters which control the depth and falloff of the blend between the decal and the receiving surface.

The result is shown below.

## Object Bounds

The **Object Bounds** expression outputs the size of the object on which the Material is applied for each axis. The expression outputs a float3, representing the X, Y, and Z axis. If this node is plugged into Base Color, the axes correspond to R, G, and B, respectively.

 [image: Object Bounds graph]

In the video below, note how the Material changes color when the object is scaled on each axis.

## ObjectOrientation

The **ObjectOrientation** expression outputs the world-space up vector of the object on which the Material is applied. In other words, the object's local positive z-axis is pointing in this direction.

 [image: Object Orientation expression]

## ObjectPositionWS

The **ObjectPositionWS** expression outputs the world-space center position of the object's bounds. Each sphere in the image below displays a different color as they are moved to a different position in space. The RGB color channels correspond to the X, Y and Z axes in the level. This node is useful when creating spherical lighting for foliage.

 [image: Object Position Expression]

## ParticlePositionWS

The **ParticlePositionWS** expression outputs Vector3 (RGB) data representing each individual particle's position in world space.

 [image: Particle Position WS example]

In this image, ParticlePositionWS is being fed into emissive color to visualize the data. The particle system has been scaled up to show how the color is changing based on position.

## PixelNormalWS

The **PixelNormalWS** expression outputs vector data representing the direction that pixels are facing based on the current normal.

 [image: Pixel Normal WS Example]

In this example, PixelNormalWS is fed into Base Color. Notice how the normal map is used to give the per-pixel result.

## Pre-Skinned Local Normal

The **Pre-Skinned Local Normals** Vector Expression outputs a three-channel vector value representing the local surface normal for Skeletal and Static Meshes. This enables you to achieve locally-aligned tri-planar Materials and mesh aligned effects in your Materials.

In this example, the Material below is using a tri-planar texture aligned to the mesh's local surface normal.

Click to enlarge image.

|  |  |
| --- | --- |
|  |  |
| Tri-Planar Pre-Skinned Local Normal Vector Expression | Tri-Planar Material |

## Pre-Skinned Local Position

The **Pre-Skinned Local Position** Vector Expression outputs a three-channel vector value that gives access to a Skeletal Mesh's default pose position data for use in
per-vertex outputs. This enables you to have localized effects on an animated character. This vector expression can also be used with Static Meshes, which will return
the standard local position.

Click to enlarge image.

In this example, the Skeletal Mesh's default pose is used for mapping versus the default UV mapping on the right.

|  |  |
| --- | --- |
|  |  |
| Pre-Skinned Local Position Vector Expression | Skeletal Mesh's Default UV Layout |

## ReflectionVectorWS

The **ReflectionVectorWS** expression is similar in spirit to CameraVectorWS (-> vector-material-expressions-in-unreal-engine), but it outputs a three-channel vector value representing the camera direction reflected across the surface normal.

**Example Usage:** ReflectionVector is commonly used in environment maps, where the Reflection Vector is passed into the UV coordinates of a cubemap texture. This enables you to create arbitrary reflections on a Material which do not match the physical environment. You can also use the Reflection Vector to create cheap, fake reflections on translucent Materials that do not have **Surface TranslucencyVolume** or **Surface ForwardShading** enabled.

 [image: Fake translucent reflections]

## VertexNormalWS

The **VertexNormalWS** expression outputs the world-space vertex normal. It can only be used in material inputs that are executed in the vertex shader, like WorldPositionOffset. This is useful for making a mesh grow or shrink. Note that offsetting position along the normal will cause the geometry to split apart along UV seams.

In the example above, the preview sphere would seem to scale up and down with sinusoidal motion, as each of the vertices moved in their own normal directions.

## Vector Noise

The Vector Noise Material expression adds several more 3D or 4D vector noise results to use in your Materials. Due to the run-time expense of these functions, it is recommended that once a look is developed with them, all or part of the computation be baked into a Texture using the Render Targets feature.

These Material graph Expressions allow procedural looks to be developed in the engine on final assets, providing an alternative to creating procedurally generated Textures with an external tool. Inside the Vector Noise Material Expression, you will find the following Vector Noise types.

| Image | Item | Description |
| --- | --- | --- |
| [image: Cellnoise] | **Cellnoise** | Returns a random color for each cell in a 3D grid (i.e. from the mathematical floor operation applied to the node input). The results are always consistent for a given position, so can provide a reliable way to add randomness to a Material. This Vector Noise function is extremely cheap to compute, so it is not necessary to bake it into a Texture for performance. |
| [image: Perlin 3D noise] | **Perlin 3D Noise** | Returns a random color for each cell in a 3D grid (i.e. from the mathematical floor operation applied to the node input). The results are always consistent for a given position, so can provide a reliable way to add randomness to a Material. This Vector Noise function is extremely cheap to compute, so it is not necessary to bake it into a Texture for performance. |
| [image: Perlin Gradient] | **Perlin Gradient** | Computes the analytical 3D gradient of a scalar Perlin Simplex Noise. The output is four channels, where the first three (RGB) are the gradient, and the fourth (A) is the scalar noise. This noise type is useful for bumps on a surface or for flow maps. |
| [image: Perlin Curl] | **Perlin Curl** | Computes the analytical 3D curl of a vector Perlin Simplex Noise (aka Curl Noise). The output is a 3D signed curl vector and is useful for fluid or particle flow. |
| [image: Voronoi Noise] | **Voronoi** | Computes the same Voronoi noise as the scalar Noise material node. The scalar Voronoi noise scatters seed points in 3D space and returns the distance to the closest one. The Vector Noise version returns the location of the closest seed point in RGB, and the distance to it in A. Especially coupled with Cellnoise, this can allow some randomized behavior per Voronoi cell. |

Below is a simple stone bed Material using the distance component of the Voronoi Vector Noise to modulate some surface bumps and blend moss into the cracks. The seed position together with Vector Noise > Cellnoise is used to change the color and bump height per rock.

 [image: Stone blend example]

The derivative-based operations **Perlin Curl** and **Perlin Gradient** can be added together in octaves, just as regular Perlin noise can. For derivatives of more complex expressions, it is necessary to compute the gradient of the result of the expression. To help with this, place the expression to compute into a Material Function and use it with the following helper nodes.

| Item | Description |
| --- | --- |
| **Prepare3DDeriv** | Uses positions offset in a tetrahedral pattern to compute 3D derivatives. Evaluate the same 3D function at each offset position produced by this function, then feed the resulting values into Compute3DDeriv. |
| **Compute3DDeriv** | Uses positions offset in a tetrahedral pattern to compute 3D derivatives. Use with Prepare3DDeriv. |
| **GradFrom3DDeriv** | Computes 3D gradient vector from result of Prepare3DDeriv/Compute3DDeriv. |
| **CurlFrom3DDeriv** | Computes curl of a 3D vector field from result of Prepare3DDeriv/Compute3DDeriv. |

These helper Material Functions use four evaluations of the base expression spaced in a tetrahedral pattern to approximate these derivative-based operations.

Below you will find descriptions of the various noise functions you will find in the Vector Noise Material Expression.

| Item | Description |  |
| --- | --- | --- |
| Properties |  |  |
| **Function** | **Cellnoise**: Random color for each integer grid cell in 3D space. About 10 instructions. **Perlin 3D Noise**: Computational Perlin noise with 3D output, each channel output ranges from -1 to 1. About 83 instructions if only the red channel is used, 125 instructions if all three channels are used. **Perlin Gradient**: Computes the gradient of a Perlin noise function. RGB output contains the gradient vector, A is the scalar noise. About 106 instructions. **Perlin Curl**: Computes a 3D curl noise. The output is the mathematical curl of Perlin 3D Noise. About 162 instructions. **Voronoi**: The same algorithm and instruction counts as the Voronoi function in the Noise expression, but RGB is the location of the closest seed point in each Voronoi cell, and A is the distance to that seed point. |  |
| **Quality** | A look/performance setting. Lower values are faster but may look worse, higher values are slower but may look better. |  |
| **Tiling** | For noise functions that support it this allows noise to tile. This is more expensive, but useful when baking noise into a seamless wrapping texture. |  |
| **Tile Size** | When tiling, how often should the noise repeat. For Perlin noise variants, the Tile Size must be a multiple of three. |  |
|  | Inputs |  |
| **Position** | Allows the texture size to be adjusted via a 3D vector. |  |

- **Cell Noise** Material Example: Click for full image.

- **Perlin Gradient** Material Example: Click for full image.

- **Voronoi** Material Example: Click for full image.

- materials

On this page

- ActorPositionWS (-> vector-material-expressions-in-unreal-engine)
- CameraPositionWS (-> vector-material-expressions-in-unreal-engine)
- CameraVectorWS (-> vector-material-expressions-in-unreal-engine)
- Constant2Vector (-> vector-material-expressions-in-unreal-engine)
- Constant3Vector (-> vector-material-expressions-in-unreal-engine)
- Constant4Vector (-> vector-material-expressions-in-unreal-engine)
- LightVector (-> vector-material-expressions-in-unreal-engine)
- Example (-> vector-material-expressions-in-unreal-engine)
- Object Bounds (-> vector-material-expressions-in-unreal-engine)
- ObjectOrientation (-> vector-material-expressions-in-unreal-engine)
- ObjectPositionWS (-> vector-material-expressions-in-unreal-engine)
- ParticlePositionWS (-> vector-material-expressions-in-unreal-engine)
- PixelNormalWS (-> vector-material-expressions-in-unreal-engine)
- Pre-Skinned Local Normal (-> vector-material-expressions-in-unreal-engine)
- Pre-Skinned Local Position (-> vector-material-expressions-in-unreal-engine)
- ReflectionVectorWS (-> vector-material-expressions-in-unreal-engine)
- VertexNormalWS (-> vector-material-expressions-in-unreal-engine)
- Vector Noise (-> vector-material-expressions-in-unreal-engine)
