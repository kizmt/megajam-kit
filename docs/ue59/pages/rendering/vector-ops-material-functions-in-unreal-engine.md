# Vector Ops Material Functions

https://dev.epicgames.com/documentation/en-us/unreal-engine/vector-ops-material-functions-in-unreal-engine?application_version=5.9

> Functions built to handle vector mathematics, such as calculating a Fresnel effect.

[image: Vector Ops Material Functions]

The VectorOps category contains special Material functions for applying various vector-based math equations.

## Fresnel

Unlike the regular Fresnel Material expression node, the Fresnel function allows you to designate your own set of vectors used to calculate the equation, as well as make other adjustments to the blend.

| Item | Description |
| --- | --- |
| Inputs |  |
| **Normal Vector (Vector3)** | The first vector used in the Fresnel operation. Typically, this is the surface normal. |
| **Camera Vector (Vector3)** | The vector of the camera's direction. |
| **Invert Fresnel (StaticBool)** | This inverts the operation, reversing the way normals are calculated to yield results. |
| **Power (Scalar)** | This value controls how quickly color falls off between the core and the edges. |
| **Use Cheap Contrast (StaticBool)** | This activates an internal CheapContrast function to boost the contrast of the Fresnel's result. |
| **Cheap contrast dark (Scalar)** | When using cheap contrast, this controls how much the dark value shows in the result. Has no effect when not using cheap contrast. |
| **Cheap contrast bright (Scalar)** | When using cheap contrast, this controls how much the bright value shows in the result. Has no effect when not using cheap contrast. |
| **Clamp Fresnel Dot Product (B)** | Clamps the result of the Fresnel Dot Product between 0 and 1. This is true by default, but you can override it with a Static Bool set to false. |

 [image: Fresnel Function]
 [image: Inverted Fresnel Function]

**Using a Static Bool to invert the Fresnel effect.**

- materials
- shaders

On this page

- Fresnel (-> vector-ops-material-functions-in-unreal-engine)
