# Physically Based Materials

https://dev.epicgames.com/documentation/en-us/unreal-engine/physically-based-materials-in-unreal-engine?application_version=5.9

> An overview of the primary physically based Material inputs and how best to use them.

[image: Physically Based Materials]

This document is designed to provide guidelines and best practices for working within Unreal Engine's **physically based Materials** system. It assumes that you have some familiarity with the Material creation process in Unreal. If you are completely new to Materials in Unreal, you may prefer to start with the Essential Material Concepts (-> essential-unreal-engine-material-concepts) page.

This page focuses only on the Material attributes that are directly related to the physically based shading workflow. For a complete breakdown of all inputs on the Main Material node, see the Material Inputs (-> material-inputs-in-unreal-engine) page.

## What Does Physically Based Mean?

**Physically based rendering** (PBR) means that surfaces approximate the way light behaves in the real world, as opposed to the way we intuitively think it should. Materials that adhere to PBR principles are more accurate and typically more natural looking than a shading workflow that relies fully on artist intuition to set parameters.

Physically based Materials work equally well in all lighting environments. In addition, Material values can be less complex and interdependent, resulting in a more user-friendly Material creation workflow. These benefits are applicable even for non-photorealistic rendering, as evident in films from Pixar [4] (-> physically-based-materials-in-unreal-engine) and Disney [3] (-> physically-based-materials-in-unreal-engine).

For an in depth technical look at Unreal Engine's physically based Material and shading model, refer to this SIGGRAPH presentation 2 (-> physically-based-materials-in-unreal-engine).

## PBR Material Attributes

These are the Material attributes that are directly related to the physically based aspect of Unreal Materials.

- Base Color (-> physically-based-materials-in-unreal-engine)

- Roughness (-> physically-based-materials-in-unreal-engine)

- Metallic (-> physically-based-materials-in-unreal-engine)

- Specular (-> physically-based-materials-in-unreal-engine)

All of these inputs are designed to accept values between 0 and 1. In the case of Base Color this means a color or texture sample with RGB values that fall between 0 and 1.

Physically based values can be measured from real world Materials. Some examples are given below.

### Base Color

Base Color defines the overall color of the Material. The Base Color input accepts a **Vector3 (RGB)** value where each channel is automatically clamped between 0 and 1.

 [image: Base Color]

If taken from the real world, this is the color when photographed using a polarizing filter (polarization removes the specular of nonmetals when aligned).

**Measured BaseColor values for nonmetals (intensity only):**

| Material | BaseColor Intensity |
| --- | --- |
| Charcoal | 0.02 |
| Fresh asphalt | 0.02 |
| Worn asphalt | 0.08 |
| Bare soil | 0.13 |
| Green grass | 0.21 |
| Desert sand | 0.36 |
| Fresh concrete | 0.51 |
| Ocean Ice | 0.56 |
| Fresh snow | 0.81 |

**Measured BaseColors for metals:**

| Material | BaseColor (R, G, B) |
| --- | --- |
| Iron | (0.560, 0.570, 0.580) |
| Silver | (0.972, 0.960, 0.915) |
| Aluminum | (0.913, 0.921, 0.925) |
| Gold | (1.000, 0.766, 0.336) |
| Copper | (0.955, 0.637, 0.538) |
| Chromium | (0.550, 0.556, 0.554) |
| Nickel | (0.660, 0.609, 0.526) |
| Titanium | (0.542, 0.497, 0.449) |
| Cobalt | (0.662, 0.655, 0.634) |
| Platinum | (0.672, 0.637, 0.585) |

### Roughness

The Roughness input controls how rough or smooth a Material's surface is. In the Material this manifests as how sharp or blurry reflections appear on the Material.

Rough Materials scatter reflected light in more directions than smooth Materials, which results in diffuse, sometimes subtle reflections. Smooth surfaces reflect light more uniformly, resulting in clear, focused reflections or specular highlights.

- A Roughness of 0 (smooth) results in a mirror reflection.

- A Roughness of 1 (rough) results in a diffuse or matte surface.

Roughness values from 0 to 1. Nonmetal top, metal bottom.

 [image: Roughness value 0]
 [image: Roughness value 0]
 [image: Roughness value 0]
 [image: Roughness value 0]
 [image: Roughness value 0]
 [image: Roughness value 0]
 [image: Roughness value 0]
 [image: Roughness value 0]
 [image: Roughness value 0]
 [image: Roughness value 0]
 [image: Roughness value 0]
 [image: Roughness value 0]
 [image: Roughness value 0]
 [image: Roughness value 0]
 [image: Roughness value 0]
 [image: Roughness value 0]
 [image: Roughness value 0]
 [image: Roughness value 0]
 [image: Roughness value 0]
 [image: Roughness value 0]
 [image: Roughness value 0]

**Roughness values from 0 to 1.**

#### Mapping Roughness

Roughness is frequently mapped on objects using a grayscale texture to add physical variation to a surface. Dark areas on a roughness map appear mirrorlike on the Material, while light areas are rough and appear less reflective.

The video below shows the Roughness value increasing from 0 to 1, with a perlin texture controlling the distribution of **light (rough)** and **dark (smooth)** values. At 0, the Material preview is completely mirrorlike. At 1, the Material is perfectly matte. In-between values are more interesting, as parts of the surface appear smooth and parts appear rough.

Roughness maps are frequently used to add scruffs, smudges, or other imperfections to Materials like plastic and metal.

#### Roughness vs. Specular

The interplay between roughness and specular is an important point to understand, particularly if you were working in Unreal Engine before the PBR workflow was adopted.

**Specularity** refers to the amount of specular light reflected by a surface. This value is inherent to the Material type, and usually the default value of 0.5 is accurate. The Specular input is **not used for reflection/specularity maps** or to add surface variation. These should be handled in the Roughness map.

### Metallic

The Metallic input accepts a value between 0 and 1, and defines whether your Material behaves as a metal or nonmetal.

In most cases, you should treat Metallic as a binary property in Unreal Engine. For pure surfaces, such as pure metal, pure stone, pure plastic, and so on, you should set Metallic to **either 0 or 1**, not anything in between. When creating hybrid surfaces like corroded, dusty, or rusty metals, you may find that you need some value between 0 and 1.

- **Nonmetals** have a Metallic value of 0. This is the default value.

- **Metals** have a Metallic value of 1.

 [image: Metallic values]

Metallic values 0 to 1.

You may be reluctant at first to make any Material completely metallic. Resist the impulse to use partial values unless you have a good reason.

This example shows how a surface changes when Metallic is increased from 0 to 1 on a Material with relatively low Roughness.

 [image: Metallic value 0]
 [image: Metallic value .1]
 [image: Metallic value .2]
 [image: Metallic value .3]
 [image: Metallic value .4]
 [image: Metallic value .5]
 [image: Metallic value .6]
 [image: Metallic value .7]
 [image: Metallic value .8]
 [image: Metallic value .9]
 [image: Metallic value 1]

**Metallic values from 0 to 1.**

#### Mapping Metallic

Metals and nonmetals are often present in the same Material. Consider a metal panel, with a coat of paint covering some or all of the metal.

Paint is a nonmetal, so the Metallic value should be 0 in any regions covered by paint. Anywhere the metal panel is visible, the Metalic value should be 1.

This should be handled with a black and white mask passed into the Metallic input. Paint does not blend with metal, it sits on top of it. Your Metallic map should not contain intermediate grayscale values, only black and white. You could also use Material Layers to achieve similar results.

### Specular

The Specular input takes a value between 0 and 1, and controls how much specular light the surface reflects.

- A Specular value of 0 is fully non-reflective.

- A Specular value of 1 is fully reflective.

Unreal Engine uses a **default Specular of 0.5**, which represents approximately 4% specular reflection. This value is accurate for a vast majority of materials.

For very diffuse Materials, you may be inclined to set this to zero. Resist! All Materials have specular, see this post for examples [5] (-> physically-based-materials-in-unreal-engine).. The correct way to make very diffuse Materials is to use a high Roughness value.

### Cavity Maps

One reason to modify Specular is to add micro occlusion or small scale shadowing, say from cracks represented in the normal map. These are sometimes referred to as cavities.
Small scale geometry, especially details only present in the high poly and baked into the normal map, will not be picked up by the renderer's real-time shadows.

To capture this shadowing, you can generate a cavity map, which is typically an AO map with very short trace distance. This is multiplied by the final BaseColor before output and multiplied with 0.5 (Specular default) as the Specular output.

To be clear this is BaseColor = CavityOldBaseColor, Specular = Cavity0.5.

For advanced use, this can be used to control the index of refraction (IOR). We have not found this to be necessary for 99% of Materials. Below are Specular values based off of measured IOR.

**Measured Specular Values:**

| Material | Specular |
| --- | --- |
| Glass | 0.5 |
| Plastic | 0.5 |
| Quartz | 0.570 |
| Ice | 0.224 |
| Water | 0.255 |
| Milk | 0.277 |
| Skin | 0.35 |

 [image: Specular value 0]
 [image: Specular value .1]
 [image: Specular value .2]
 [image: Specular value .3]
 [image: Specular value .4]
 [image: Specular value .5]
 [image: Specular value .6]
 [image: Specular value .7]
 [image: Specular value .8]
 [image: Specular value .9]
 [image: Specular value 1]

**Specular values from 0 to 1**

Example measured Materials. Top: Charcoal, fresh concrete, worn asphalt. Bottom: Copper, iron, gold, aluminum, silver, nickel, titanium

## References

**1**. Lagarde, Feeding a physically based shading model

**2**. Karis, Real Shading in Unreal Engine 4

**3**. Burley, Physically-Based Shading at Disney

**4**. Smits, Reflection Model Design for WALL-E and Up

**5**. Hable, Everything is Shiny

- materials
- rendering
- shaders
- pbr

On this page

- What Does Physically Based Mean? (-> physically-based-materials-in-unreal-engine)
- PBR Material Attributes (-> physically-based-materials-in-unreal-engine)
- Base Color (-> physically-based-materials-in-unreal-engine)
- Roughness (-> physically-based-materials-in-unreal-engine)
- Mapping Roughness (-> physically-based-materials-in-unreal-engine)
- Roughness vs. Specular (-> physically-based-materials-in-unreal-engine)
- Metallic (-> physically-based-materials-in-unreal-engine)
- Mapping Metallic (-> physically-based-materials-in-unreal-engine)
- Specular (-> physically-based-materials-in-unreal-engine)
- Cavity Maps (-> physically-based-materials-in-unreal-engine)
- References (-> physically-based-materials-in-unreal-engine)
