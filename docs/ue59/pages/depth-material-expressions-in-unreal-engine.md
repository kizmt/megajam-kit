# Depth Material Expressions

https://dev.epicgames.com/documentation/en-us/unreal-engine/depth-material-expressions-in-unreal-engine?application_version=5.9

> Material expressions that deal with depth of the pixel being rendered.

[image: Depth Material Expressions]

## DepthFade

The **DepthFade** Material Expression is used to hide unsightly seams that occur when translucent objects intersect with opaque ones.

| Property | Description |
| --- | --- |
| **Fade Distance** | World space distance over which the fade should take place. This is used if the FadeDistance input is unconnected. |
| Inputs |  |
| **Opacity** | Takes in the existing opacity for the object prior to the depth fade. |
| **FadeDistance** | World space distance over which the fade should take place. |

In the comparison below, a translucent sphere intersects an opaque one (green). Note the smoother transition when DepthFade is used.

 [image: Without Depth Fade]

 [image: With Depth Fade]

The Material network for this example is pictured below.

 [image: Depth Fade Material Graph]

## PixelDepth

The **PixelDepth** Material Expression outputs the depth, or distance from the camera, of the pixel currently being rendered.

|  |  |
| --- | --- |
| [image: Pixel Depth Example] |  |
| Result | Material Graph (Click to enlarge.) |

In this example, the Material network was applied to the floor. Notice how the linear interpolation blends between the two colors as the floor recedes beyond 2048 units. A Power expression was used to boost the contrast between the two colors and yield a more meaningful visual result.

## SceneDepth

The **SceneDepth** Material Expression outputs the existing scene depth. This is similar to PixelDepth (-> depth-material-expressions-in-unreal-engine), except that PixelDepth can sample the depth only at the pixel currently being drawn, whereas SceneDepth can sample depth at **any location**.

Only translucent materials may utilize SceneDepth.

| Inputs | Description |
| --- | --- |
| **UVs** | Takes in UV texture coordinates used to determine how the depth "texture" is sampled. |

|  |  |
| --- | --- |
| [image: Scene Depth Example] |  |
| Result | Material Graph (Click to enlarge.) |

In this example, we have applied the material network to a translucent sphere. Notice how the SceneDepth node is reading the pixels behind the sphere, rather than the ones on its surface.

The resulting normalized depth is linear in the 0.0 to 1.0 range.

- materials
- shaders

On this page

- DepthFade (-> depth-material-expressions-in-unreal-engine)
- PixelDepth (-> depth-material-expressions-in-unreal-engine)
- SceneDepth (-> depth-material-expressions-in-unreal-engine)
