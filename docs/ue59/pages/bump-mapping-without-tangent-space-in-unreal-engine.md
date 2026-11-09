# Bump Mapping Without Tangent Space

https://dev.epicgames.com/documentation/en-us/unreal-engine/bump-mapping-without-tangent-space-in-unreal-engine?application_version=5.9

> How to achieve bump mapping from 3D procedural shaders where classic tangent space does not work.

[image: Bump Mapping Without Tangent Space]

**Bump mapping** is an old trick of graphics programmers (1978 James Blinn) that creates the illusion of bump
surfaces through an adjusted shading computation without adding more geometry. Instead of using the surface
normal, a new normal is used for shading. The new normal can be adjusted by a 1d function (e.g. Perlin noise,
grayscale texture). This trick is much faster than doing real displacement mapping with minor short comings
(e.g. silhouettes, occlusion, shadows).

|  |  |  |
| --- | --- | --- |
|  |  |  |
| Without Bump Mapping | With Bump Mapping | With Bump and Normal Mapping |

In real-time rendering, we usually use a variant of bump mapping called **normal mapping** (bluish textures).
Normal maps store a color in each pixel of the texture which is actually a 3d vector with the length of 1.

There are two ways to generate a normal map:

- Create a normal map from a grayscale image - Precompute the difference of each pixel to its vertical and horizontal neighbors. Convert the two resulting numbers (derivative) to a unit normal and store as color.

- Bake the normal down from a high poly 3d model - Associate each pixel of a texture with a 3d surface location on the high poly object and store its normal encoded as color.

In order to make the resulting texture reusable at any rotations, the normal vectors stored must be in **tangent space**,
which consists of 3 vectors generally referred to as: normal, tangent and binormal. It defines how the surface is oriented.
So by converting all normal into the tangent space, we can reuse them as they are now defined relative to the
surface. Tangent space mapping depends on the UV mapping of the object because the x and y direction in the
texture defines two vectors of the tangent space (tangent and binormal) in world space. It is difficult and
takes time to produce good UV mapping without seeing tangent space artifacts.

What if we want to use a 3d grayscale function like Perlin noise? The function does not require any UV mapping
and could improve the nearby detail rendering of bump surfaces. Implementing bump mapping without requiring
tangent space makes this possible.

## ddx and ddy

In order to implement bump mapping without tangent space, we added two new material expressions to the material
editor: **ddx** and **ddy**. Each of these expressions returns an approximation of the derivative of its input.
The graphics hardware calculates this approximate derivative by shading two pixels and subtracting the results
(`ddx = right - left`, `ddy = bottom - top`).

These functions can only be used in the pixel shader and are generally only useful in Material Functions for
implementing larger effects.

| Item | Description |
| --- | --- |
| Inputs |  |
| Value | The value to calculate the derivative of. |
| Outputs |  |
| Out | The approximate derivative of the input. The type will match that of the input. For example, a scalar results in a scalar output, a 2d in a 2d output, and so on. |

ddx and ddy are computed for a 2x2 block and therefore show some blocky artifacts when used with high frequency input.

## Bump Mapping Material Functions

Several **Material Functions** (-> material-functions-in-unreal-engine) are provided
to implement bump mapping in your materials without relying on tangent-space normal maps.

### ComputeFilterWidth

 [image: Compute Filter Width]

This function makes use of **ddx and ddy** (-> bump-mapping-without-tangent-space-in-unreal-engine) to compute how quickly a value is changing over the screen. This allows to
fade out a procedural shader in the distance where it would start getting noisy. The fading results in less shimmering which is
even more noticeable in motion and extremely important for bump mapping as specularity on bumpy surfaces can produce
extreme aliasing artifacts.

The following example images show how a procedural bump map function can be faded out in the distance.

 [image: Not Using FilterWidth]

 [image: Using FilterWidth]

| Item | Description |
| --- | --- |
| Inputs |  |
| **In** | The value to compute the filter width for. |
| Outputs |  |
| **Result** | How quickly the input changes from pixel to pixel. |

### PerturbNormalLQ

The **PerturbNormalLQ** function converts a grayscale bump map input into a world-space normal.
However, because it uses **ddx and ddy** (-> bump-mapping-without-tangent-space-in-unreal-engine), which have the aforementioned 2x2 block artifacts,
the output world-space normal is of low quality.

 [image: Low Quality]

 [image: High Quality]

| Item | Description |
| --- | --- |
| Inputs |  |
| **Bump** | The scalar bump value (grayscale) to compute the world-space normal from. |
| Outputs |  |
| **WS Normal** | The computed world-space normal. |

In order to use the world-space normal this function outputs, the **tangent-space normal**
setting on the Material node must be false.

This function exists only as a reference and is not exposed to the Material Function Library.
Use the **PerturbNormalHQ** (-> bump-mapping-without-tangent-space-in-unreal-engine) function instead.

### PerturbNormalHQ

The **PerturbNormalHQ** function provides higher quality by calculating a more precise derivative than
ddx and ddy provide. It does this by computing the scalar function multiple times using three sample positions.

| Item | Description |
| --- | --- |
| Inputs |  |
| **Bump one pixel right** | The scalar bump value (grayscale) one pixel to the right of the current position. |
| **Bump center** | The scalar bump value (grayscale) at the current position. |
| **Bump one pixel down** | The scalar bump value (grayscale) one pixel down from the current position. |
| **WS Normal** | Optional. A world-space normal that is combined with the bump map. A tangent-space normal can be converted to a world-space normal with a Vector Transform (-> vector-operation-material-expressions-in-unreal-engine) expression. |
| Outputs |  |
| **WS Normal** | The combined world-space normal. |

In order to use the world-space normal this function outputs, the **tangent-space normal** setting on the Material node must be false.

### PreparePerturbNormalHQ

The **PreparePerturbNormalHQ** function computes the three sample positions needed by the **PerturbNormalHQ**
function to compute the world-space normal.

| Item | Description |
| --- | --- |
| Inputs |  |
| **Value** | The scalar bump value (grayscale) at the current position. |
| Outputs |  |
| **Value one pixel right** | The scalar bump value (grayscale) one pixel to the right of the current position. |
| **Value** | The scalar bump value (grayscale) at the current position. |
| **Value one pixel down** | The scalar bump value (grayscale) one pixel down from the current position. |
| **FilterWidth** | It also computes the filter width which is useful to fade out details in the distance. |

## Single function instead of 3 functions

You can create a material function that encapsulate your bump mapping function and evaluate it 3 times in your
other function. This hides the complexity to a certain degree.

## Using Textures

Textures can be used with the bump mapping Material Functions for better performance; however, artifacts may be
introduced due to the way in which the graphics card handles filtering textures. A normally filtered color is
interpolated with a linear interpolation, the derivative of that is a constant. That means using a grayscale
texture provides you with normals that are not smoothly interpolating of the surface.

## Notes

The described method is based on the work from Morten S. Mikkelsen (see references).

### Performance

Procedural shaders can cost quite some performance and are hard to implement without aliasing (compared to texture
mapping). We currently provide Perlin noise and although this material expression can be optimized, it will
always be a heavy operation. Using the levels feature for n levels requires most of the computations being done
n times. Evaluating the function 3 times for bump mapping hurts even more. Be aware that the cost scales with
pixel count. You can make use of all those features but we suggest them only for prototyping or in controlled situations.

### Issues

- Flipped/Mirrored UV are not handled correctly yet.

### Future Work

This method can be used to replace the explicit stored tangent space. To go in that direction, we need to get more experience.
The current implementation not only enables artists to use this for bump mapping, but it also provides a way to do research.

### References

- Bump Mapping Unparametrized Surfaces on the GPU (Morten S. Mikkelsen)

- Derivative Maps (Mikkelsen and 3D Graphics blog)

- materials
- shaders

On this page

- ddx and ddy (-> bump-mapping-without-tangent-space-in-unreal-engine)
- Bump Mapping Material Functions (-> bump-mapping-without-tangent-space-in-unreal-engine)
- ComputeFilterWidth (-> bump-mapping-without-tangent-space-in-unreal-engine)
- PerturbNormalLQ (-> bump-mapping-without-tangent-space-in-unreal-engine)
- PerturbNormalHQ (-> bump-mapping-without-tangent-space-in-unreal-engine)
- PreparePerturbNormalHQ (-> bump-mapping-without-tangent-space-in-unreal-engine)
- Single function instead of 3 functions (-> bump-mapping-without-tangent-space-in-unreal-engine)
- Using Textures (-> bump-mapping-without-tangent-space-in-unreal-engine)
- Notes (-> bump-mapping-without-tangent-space-in-unreal-engine)
- Performance (-> bump-mapping-without-tangent-space-in-unreal-engine)
- Issues (-> bump-mapping-without-tangent-space-in-unreal-engine)
- Future Work (-> bump-mapping-without-tangent-space-in-unreal-engine)
- References (-> bump-mapping-without-tangent-space-in-unreal-engine)
