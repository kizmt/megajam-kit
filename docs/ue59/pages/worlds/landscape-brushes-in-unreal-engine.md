# Landscape Brushes

https://dev.epicgames.com/documentation/en-us/unreal-engine/landscape-brushes-in-unreal-engine?application_version=5.9

> Guide to the brushes available for modifying Landscapes.

[image: Landscape Brushes]

The **Landscape** tool's **Brush** defines the size and shape of the area of the Landscape that will be affected by either sculpting or painting. Brushes can have different shapes, sizes, and falloffs. Brushes should be a familiar concept to anyone who has experience using Photoshop or a similar image-editing application.

You can set the brush type and falloff in either the **Sculpt** or **Paint** tab of the Landscape toolbar. Settings can also be adjusted in the Landscape panel.

[image: Brush Settings] Brush Settings

| Property | Description |
| --- | --- |
| **Brush Size** | Determines the size of the brush in Unreal Units including the falloff. Within this area, the brush will have at least some effect. |
| **Brush Falloff** | Determines the percentage from the brush's extents where the falloff should begin. Essentially, this determines how hard the brush's edges are. A falloff of 0.0 means the brush will have full effect throughout with hard edges. A falloff of 1.0 means the brush will only have full effect at its center, and the effect will be reduced throughout its entire area to the edge. |
| **Use Clay Brush** | Clay Brush allows for an organic, additive approach to sculpting your Landscape. Similar to working with digital clay. If enabled, the editor uses a Clay Brush. |
| **Apply Without Moving** | When left-clicking, the brush continuously applies action regardless of cursor movement. Enables precise editing when mouse position needs to be stationary. |

The size and falloff of the current brush is displayed in the viewport as a pair of concentric circles.

|  |  |  |
| --- | --- | --- |
| [image: Falloff of 0.0] | [image: Falloff of 0.5] | [image: Falloff of 1.0] |
| Falloff: 0.0 | Falloff: 0.5 | Falloff: 1.0 |

## Circle

[image: Circle Brush]

The **Circle** brush applies the current tool in a circular area, with a falloff defined both numerically and by type.

[image: Circle Brush in use]

### Circle Brush Falloff Type

| Icon | Type | Description |
| --- | --- | --- |
| [image: Smooth Falloff] | **Smooth** | A linear falloff that has been smoothed to round off the sharp edges where the falloff begins and ends. |
| [image: Linear Falloff] | **Linear** | A sharp linear falloff, without rounded edges. |
| [image: Spherical Falloff] | **Sphere** | A half-ellipsoid-shaped falloff that begins smoothly and ends sharply. |
| [image: Tip Falloff] | **Tip** | A falloff with an abrupt start and a smooth ellipsoidal end. The opposite of the **Sphere** falloff. |

Below is an example of each of these falloff types when operating on the heightmap, with the same radius and falloff:

|  |  |  |  |
| --- | --- | --- | --- |
| [image: Smooth Falloff example] | [image: Linear Falloff example] | [image: Spherical Falloff example] | [image: Tip Falloff example] |
| **Smooth** | **Linear** | **Spherical** | **Tip** |

## Alpha

[image: Alpha Brush]

The **Alpha** brush is similar to the Pattern brush, but instead of tiling the texture across the Landscape as you paint, it orients the brush texture in the direction of your painting and drags the shape as you move the cursor.

[image: Dragging a Brush Alpha]

### Alpha Brush Settings

[image: Alpha Brush Settings] Alpha Brush Settings.

| Setting | Description |
| --- | --- |
| **Texture** | Sets the Texture to be used, assigned from the **Content Browser**. |
| **Texture Channel** | Sets the Alpha brush's contents to the data from the corresponding channel of the texture that is currently assigned. |
| **Brush Size** | Sets the size of the brush. |
| **Use Clay Brush** | If selected, uses a clay brush. |
| **Auto-Rotate** | Rotates the brush to follow the mouse cursor. |
| **Texture Rotation** | Rotates the brush texture. When combined with Auto-Rotate, this sets the starting rotation of the texture. |

## Pattern

[image: Pattern Brush]

The **Pattern** brush allows you to use an arbitrary shape for the brush by sampling a single color channel from a texture to use as the alpha for the brush. The texture pattern is tiled as the brush is painted.

For example, the textures below could be used as the alpha:

|  |  |
| --- | --- |
| [image: Pattern-brush-of-black-dots-on-white-background] | [image: Pattern-brush-checkerboard] |

Those would result in the following brushes:

| Brush Pattern | Pattern Result |
| --- | --- |
| [image: Pattern-brush-dot-template] | [image: Pattern-brush-template-result] |
| [image: Pattern-brush-square-template] | [image: Pattern-brush-square-result] |

### Pattern Brush Settings

[image: Pattern Brush Settings] Pattern Brush Settings

| Setting | Description |
| --- | --- |
| **Texture** | Sets the Texture to be used, assigned from the **Content Browser**. |
| **Texture Channel** | Sets the Pattern brush's contents to the data from the corresponding channel of the texture that is currently assigned. |
| **Brush Size** | Sets the size of the brush. |
| **Brush Falloff** | Sets the brush falloff. |
| **Use Clay Brush** | Enables you to use a clay brush. |
| **Use World Space** | Tile the pattern in World-Space scale and position. |
| **Texture Scale** | Sets the size of the sampled texture in relation to the surface of the Landscape. |
| **Texture Rotation** | Sets the rotation of the sampled texture in relation to the surface of the Landscape. |
| **Texture Pan [U/V]** | Sets the offset of the sampled texture on the surface of the Landscape. |

## Component

[image: Component Brush]

The **Component** brush is used for operating on individual components. The cursor becomes limited to a single component at a time:

[image: Component Brush selection]

The Component brush is the only brush available when you are using tools that operate on the individual component level.

### Component Brush Settings

| Setting | Description |
| --- | --- |
| **Brush Size** | The number of components in the XY axis that are affected. Size 1 means 1x1, 2 means 2x2, etc. |
| **Include Border** | When true, it affects all pixels of the component including its border. The border is shared by neighboring components and all components will be modified when enabled. |

## Gizmo

[image: Gizmo Brush]

The **Gizmo** brush is used for modifying your Landscape with **Landscape Gizmos**, which are tools that you use to perform actions to a specific localized area of the Landscape.

The Gizmo brush is available only when you are using the Copy/Paste tool in Sculpt mode.

For more information about Gizmos, see Landscape Copy Tool (-> landscape-copy-tool-in-unreal-engine).

- landscape

On this page

- Circle (-> landscape-brushes-in-unreal-engine)
- Circle Brush Falloff Type (-> landscape-brushes-in-unreal-engine)
- Alpha (-> landscape-brushes-in-unreal-engine)
- Alpha Brush Settings (-> landscape-brushes-in-unreal-engine)
- Pattern (-> landscape-brushes-in-unreal-engine)
- Pattern Brush Settings (-> landscape-brushes-in-unreal-engine)
- Component (-> landscape-brushes-in-unreal-engine)
- Component Brush Settings (-> landscape-brushes-in-unreal-engine)
- Gizmo (-> landscape-brushes-in-unreal-engine)
