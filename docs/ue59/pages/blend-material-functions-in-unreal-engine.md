# Blend Material Functions

https://dev.epicgames.com/documentation/en-us/unreal-engine/blend-material-functions-in-unreal-engine?application_version=5.9

> Functions designed to blend one color with another, similar to blend modes in popular image editing applications.

[image: Blend Material Functions]

A **Blend** is a type of function that performs mathematical calculations in the color information of a texture so that one texture can blend into another in a particular manner.

Blends will always have a Base and a Blend input, both of which are Vector3. These will each take in a texture and the two will be blended in some way. The manner in which the blend takes place depends on the type of blend function used.

## Blend Functions

Below is a list of all of the blend material functions.

### Blend_ColorBurn

**Blend_ColorBurn** blends the textures in such a way that the darker the Blend color the more of that color will be used in the final result. If the Blend color is white, no change takes place.

| Item | Description |
| --- | --- |
| Inputs |  |
| **Base (Vector3)** | The base, or original texture that will be blended with the Blend texture in some way. |
| **Blend (Vector3)** | The blend texture, which is combined with the base in some way based on the type of blend operation taking place. |

 [image: Color Burn]

|  |  |  |  |
| --- | --- | --- | --- |
|  | [image: Base] | [image: Blend] | [image: Color Burn Blend] |
|  | Base | Blend | Result |

### Blend_ColorDodge

**Blend_ColorDodge** lightens the result by inverting the Base color and dividing it by the Blend color.

| Item | Description |
| --- | --- |
| Inputs |  |
| **Base (Vector3)** | The base, or original texture that will be blended with the Blend texture in some way. |
| **Blend (Vector3)** | The blend texture, which is combined with the base in some way based on the type of blend operation taking place. |

 [image: Color Dodge]

|  |  |  |  |
| --- | --- | --- | --- |
|  | [image: Base] | [image: Blend] | [image: Color Dodge Blend] |
|  | Base | Blend | Result |

### Blend_Darken

**Blend_Darken** works by choosing the darker value for each pixel of the Base and Blend colors. A white Blend color does not produce a change.

| Item | Description |
| --- | --- |
| Inputs |  |
| **Base (Vector3)** | The base, or original texture that will be blended with the Blend texture in some way. |
| **Blend (Vector3)** | The blend texture, which is combined with the base in some way based on the type of blend operation taking place. |

 [image: Darken]

|  |  |  |  |
| --- | --- | --- | --- |
|  | [image: Base] | [image: Blend] | [image: Darken Blend] |
|  | Base | Blend | Result |

### Blend_Difference

**Blend_Difference** creates a sort of inversion-style effect by subtracting the Base from the Blend and then taking the absolute value of the result.

| Item | Description |
| --- | --- |
| Inputs |  |
| **Base (Vector3)** | The base, or original texture that will be blended with the Blend texture in some way. |
| **Blend (Vector3)** | The blend texture, which is combined with the base in some way based on the type of blend operation taking place. |

 [image: Difference]

|  |  |  |  |
| --- | --- | --- | --- |
|  | [image: Base] | [image: Blend] | [image: Difference Blend] |
|  | Base | Blend | Result |

### Blend_Exclusion

**Blend_Exclusion** halves both the Base and Blend textures, combines them, and then does a partial inversion on the result.

| Item | Description |
| --- | --- |
| Inputs |  |
| **Base (Vector3)** | The base, or original texture that will be blended with the Blend texture in some way. |
| **Blend (Vector3)** | The blend texture, which is combined with the base in some way based on the type of blend operation taking place. |

 [image: Exclusion]

|  |  |  |  |
| --- | --- | --- | --- |
|  | [image: Base] | [image: Blend] | [image: Exclusion Blend] |
|  | Base | Blend | Result |

### Blend_HardLight

Like a harsher version of Blend_Overlay, **Blend_HardLight** will either screen or multiply the Base and Blend together. The function does a comparison on the Blend color such that wherever the Blend is brighter than 50% gray, the Base and Blend will be combined via a Screen operation. If the Blend is darker than 50% gray, the Base will be multiplied by the Blend as in the Multiply function. The contrast of the final result is then boosted for a harsh output.

| Item | Description |
| --- | --- |
| Inputs |  |
| **Base (Vector3)** | The base, or original texture that will be blended with the Blend texture in some way. |
| **Blend (Vector3)** | The blend texture, which is combined with the base in some way based on the type of blend operation taking place. |

 [image: Hard Light]

|  |  |  |  |
| --- | --- | --- | --- |
|  | [image: Base] | [image: Blend] | [image: Hard Light Blend] |
|  | Base | Blend | Result |

### Blend_Lighten

**Blend_Lighten** compares each pixel of the Base and Blend colors and returns the brighter result.

| Item | Description |
| --- | --- |
| Inputs |  |
| **Base (Vector3)** | The base, or original texture that will be blended with the Blend texture in some way. |
| **Blend (Vector3)** | The blend texture, which is combined with the base in some way based on the type of blend operation taking place. |

 [image: Lighten]

|  |  |  |  |
| --- | --- | --- | --- |
|  | [image: Base] | [image: Blend] | [image: Lighten Blend] |
|  | Base | Blend | Result |

### Blend_LinearBurn

**Blend_LinearBurn** adds Base color to the Blend color and then subtracts 1 from the result.

| Item | Description |
| --- | --- |
| Inputs |  |
| **Base (Vector3)** | The base, or original texture that will be blended with the Blend texture in some way. |
| **Blend (Vector3)** | The blend texture, which is combined with the base in some way based on the type of blend operation taking place. |

 [image: Linear Burn]

|  |  |  |  |
| --- | --- | --- | --- |
|  | [image: Base] | [image: Blend] | [image: Linear Burn Blend] |
|  | Base | Blend | Result |

### Blend_LinearDodge

**Blend_LinearDodge** adds the Base color to the Blend color.

| Item | Description |
| --- | --- |
| Inputs |  |
| **Base (Vector3)** | The base, or original texture that will be blended with the Blend texture in some way. |
| **Blend (Vector3)** | The blend texture, which is combined with the base in some way based on the type of blend operation taking place. |

 [image: Linear Dodge]

|  |  |  |  |
| --- | --- | --- | --- |
|  | [image: Base] | [image: Blend] | [image: Linear Dodge Blend] |
|  | Base | Blend | Result |

### Blend_LinearLight

**Blend_LinearLight** is a linear version of Blend_Overlay, providing harsher results. The function does a comparison on the Blend color such that wherever the Blend is brighter than 50% gray, the Base and Blend will be combined via a Screen operation. If the Blend is darker than 50% gray, the Base will be multiplied by the Blend as in the Multiply function.

| Item | Description |
| --- | --- |
| Inputs |  |
| **Base (Vector3)** | The base, or original texture that will be blended with the Blend texture in some way. |
| **Blend (Vector3)** | The blend texture, which is combined with the base in some way based on the type of blend operation taking place. |

 [image: Linear Light]

|  |  |  |  |
| --- | --- | --- | --- |
|  | [image: Base] | [image: Blend] | [image: Linear Light Blend] |
|  | Base | Blend | Result |

### Blend_Overlay

**Blend_Overlay** will either screen or multiply the Base and Blend together. The function does a comparison on the Blend color such that wherever the Blend is brighter than 50% gray, the Base and Blend will be combined via a Screen operation. If the Blend is darker than 50% gray, the Base will be multiplied by the Blend as in the Multiply function.

| Item | Description |
| --- | --- |
| Inputs |  |
| **Base (Vector3)** | The base, or original texture that will be blended with the Blend texture in some way. |
| **Blend (Vector3)** | The blend texture, which is combined with the base in some way based on the type of blend operation taking place. |

 [image: Overlay]

|  |  |  |  |
| --- | --- | --- | --- |
|  | [image: Base] | [image: Blend] | [image: Overlay Blend] |
|  | Base | Blend | Result |

### Blend_PinLight

Like Blend_Overlay, **Blend_PinLight** will either lighten or darken the Base and Blend together. The function does a comparison on the Blend color such that wherever the Blend is brighter than 50% gray, the Base and Blend will be combined via a Screen operation. If the Blend is darker than 50% gray, the Base will be multiplied by the Blend as in the Multiply function. The contrast is softened, making this a less harsh version of Overlay.

| Item | Description |
| --- | --- |
| Inputs |  |
| **Base (Vector3)** | The base, or original texture that will be blended with the Blend texture in some way. |
| **Blend (Vector3)** | The blend texture, which is combined with the base in some way based on the type of blend operation taking place. |

 [image: Pin Light]

|  |  |  |  |
| --- | --- | --- | --- |
|  | [image: Base] | [image: Blend] | [image: Pin Light Blend] |
|  | Base | Blend | Result |

### Blend_Screen

**Blend_Screen** lightens the Base by the Blend color. It does this by doing a "one minus" on both colors, multiplying them together, and taking a one-minus of the result.

| Item | Description |
| --- | --- |
| Inputs |  |
| **Base (Vector3)** | The base, or original texture that will be blended with the Blend texture in some way. |
| **Blend (Vector3)** | The blend texture, which is combined with the base in some way based on the type of blend operation taking place. |

 [image: Screen]

|  |  |  |  |
| --- | --- | --- | --- |
|  | [image: Base] | [image: Blend] | [image: Screen Blend] |
|  | Base | Blend | Result |

### Blend_SoftLight

**Blend_SoftLight** is a softer version of Overlay. The function does a comparison on the Blend color such that wherever the Blend is brighter than 50% gray, the Base and Blend will be combined via a Screen operation. If the Blend is darker than 50% gray, the Base will be multiplied by the Blend as in the Multiply function. The contrast is softened, making this a less harsh version of Overlay.

| Item | Description |
| --- | --- |
| Inputs |  |
| **Base (Vector3)** | The base, or original texture that will be blended with the Blend texture in some way. |
| **Blend (Vector3)** | The blend texture, which is combined with the base in some way based on the type of blend operation taking place. |

 [image: Soft Light]

|  |  |  |  |
| --- | --- | --- | --- |
|  | [image: Base] | [image: Blend] | [image: Soft Light Blend] |
|  | Base | Blend | Result |

- materials

On this page

- Blend Functions (-> blend-material-functions-in-unreal-engine)
- Blend_ColorBurn (-> blend-material-functions-in-unreal-engine)
- Blend_ColorDodge (-> blend-material-functions-in-unreal-engine)
- Blend_Darken (-> blend-material-functions-in-unreal-engine)
- Blend_Difference (-> blend-material-functions-in-unreal-engine)
- Blend_Exclusion (-> blend-material-functions-in-unreal-engine)
- Blend_HardLight (-> blend-material-functions-in-unreal-engine)
- Blend_Lighten (-> blend-material-functions-in-unreal-engine)
- Blend_LinearBurn (-> blend-material-functions-in-unreal-engine)
- Blend_LinearDodge (-> blend-material-functions-in-unreal-engine)
- Blend_LinearLight (-> blend-material-functions-in-unreal-engine)
- Blend_Overlay (-> blend-material-functions-in-unreal-engine)
- Blend_PinLight (-> blend-material-functions-in-unreal-engine)
- Blend_Screen (-> blend-material-functions-in-unreal-engine)
- Blend_SoftLight (-> blend-material-functions-in-unreal-engine)
