# Capsule Shadows Overview

https://dev.epicgames.com/documentation/en-us/unreal-engine/capsule-shadows-overview-in-unreal-engine?application_version=5.9

> An overview on using physics capsules for dynamic soft shadowing of Skeletal Meshes.

[image: Capsule Shadows Overview]

Unreal Engine supports soft shadowing for characters in lit areas with **Capsule Shadows** using a capsule representation of a Skeletal Mesh from a Physics Asset. This shadowing method grounds a character to the scene with soft area shadowing, especially in indirectly lit areas, which is not possible when using traditional shadow mapping techniques.

## Character Capsule Representation

A Physics Asset (-> physics-asset-editor-in-unreal-engine) is used to create an approximate representation of the character to support very soft shadowing. Since the capsules are attached to the bones of the character, this
allows for the shadow to move and cast accurately within the scene.

 [image: Character with Capsule Representation]

 [image: Capsule Representation Only]

The shadows on the ground in the Physics Asset viewport are not representative of Capsule Shadows.

## Usage

Open your Skeletal Mesh, and in the **Asset Details** panel, use the **Shadow Physics Asset** selection to assign your Physics Asset that will be used for Capsule Shadows.

## Capsule Shadow Settings

| Property | Description |
| --- | --- |
| **Capsule Direct Shadow** | This will enable soft shadowing from direct (movable) lights when the capsule representation is assigned to the Skeletal Mesh's Shadow Physics Asset slot. |
| **Capsule Indirect Shadow** | This will enable soft shadowing from precomputed lighting (lightmaps and skylight) when the capsule representation is assigned to the Skeletal Mesh's Shadow Physics Asset slot. |
| **Capsule Indirect Shadow Min Visibility** | This will allow artists to control how dark the capsule shadow, in indirectly lit areas, can be. |

### Capsule Indirect Shadows

When you enable **Capsule Indirect Shadow**, the capsule representation of the character will be used to cast a directional soft shadow based on the volume lighting samples (-> indirect-lighting-cache-in-unreal-engine)
placed and computed by Lightmass during a lighting build. Capsule Indirect Shadows enables your characters to feel grounded in these areas where traditional shadow mapping will not work very well.

When Capsule Indirect Shadow is enabled, your character will cast a soft shadow that can ground them in areas with only bounce lighting.

 [image: Capsule Indirect Shadow Enabled]

 [image: Capsule Indirect Shadow Disabled]

In an open area with only a Sky Light as the light source, there will be little directionality, since light is coming from all around. This produces a subtle soft "blob" shadow below
the character when using precomputed lighting.

 [image: Indirect Capsule Shadows Enabled]

 [image: Indirect Capsule Shadows Disabled]

In an enclosed area where light is coming through an opening, the indirect lighting cache (-> indirect-lighting-cache-in-unreal-engine) is used to
give directionality and softness to the capsule shadow by interpolating between the placed volume lighting samples as the character moves through the space. At the doorway, the character's shadow will be
less intense with little directionality, but as the character moves further away from the doorway, the shadow's intensity and directionality will increase.

#### Indirect Minimum Shadow Visibility

Artists are afforded additional control by adjusting the **Capsule Indirect Shadow Min Visibility**. This enables you to adjust how dark the capsule shadow will be in indirectly lit areas, using precomputed lighting. This can be be useful to reduce any self-shadowing from a capsule in these areas, or to soften the shadow's intensity, so that it blends nicely with surrounding shadows.

 [image: Capsule Shadow Indirect Min Visibility: 0.1 (Default)]

 [image: Capsule Shadow Indirect Min Visibility: 0.45]

### Capsule Direct Shadows

Enabling **Capsule Direct Shadow** on light sources enables you to define how soft area shadowing is for the shadow caster on a shadow receiver based on the angle of the light or the size of the light source.

Capsule Shadows for direct lighting should be used as a scalability option for cheaper shadows than rendering highly detailed polygonal Skeletal Meshes into shadowmaps. For additional information, see the sections directly below for specific mobilities required for the light source. Also, see the "Limitations" section below.

#### Light Source Angle

For a Directional Light, the **Source Angle** property enables you specify the Sun's angle in degrees to soften shadows.

This property works for all light mobilities (Static, Stationary, and Movable) when **Capsule Direct Shadow** is enabled.

 [image: Light Source Angle: 1.0 (Default)]

 [image: Light Source Angle: 2.0]

#### Source Radius

For Spot and Point Lights, the **Source Radius** sets the size of the light source emitting light; the larger the source the softer the shadows and smaller, the more hard the shadow contacts are.

Capsule Direct Shadowing requires that the light source have its mobility set to **Stationary** and that lighting has been built for the scene before the **Source Radius** on the light will have any effect.

 [image: Source Radius: 5.0]

 [image: Source Radius: 15.0]

Once lighting has been built for your scene, you can adjust the **Source Radius** property without having to rebuild lighting. This property only affects movable actors with Capsule Shadows or Mesh Distance Fields enabled.

## Performance

The GPU performance cost of Capsule Shadows is proportional to the number of capsules used, the number of characters, and the screen size that their shadow affects.

Using a Radeon 7870 at 1080p, for example:

| GPU Cost with 10 Capsules | Time in milliseconds (ms) |
| --- | --- |
| **A single character on screen** | 0.29 ms |
| **Each additional character on screen** | 0.05 ms |

This implementation is very efficient, since it computes shadowing at half resolution with a depth-aware upsample, while using screen tile culling to reduce the amount of shadowing work to only happen where it is needed.

## Limitations

- Not compatible with Virtual Shadow Maps (-> virtual-shadow-maps-in-unreal-engine).
- Requires DirectX 11, due to tiled deferred implementation using compute shaders.
- Movable Point and Spot Lights are not currently supported.
- Self-shadowing artifacts can exist for arbitrary mesh shapes.
- Can only use Sphyls and Spheres for capsule representation.
- When capsule shadows get so soft that they become ambient occlusion, there's an artifact in the shadowing that causes a hard line.
- Movable Point and Spot lights are not supported because it costs more to remove one object out of the whole scene shadows and do a per-object shadow for it. Stationary lights are always going to be a per-object shadows method so Capsule Direct Shadow for faster shadow rendering makes sense.

- rendering
- lighting
- shadows

On this page

- Character Capsule Representation (-> capsule-shadows-overview-in-unreal-engine)
- Usage (-> capsule-shadows-overview-in-unreal-engine)
- Capsule Shadow Settings (-> capsule-shadows-overview-in-unreal-engine)
- Capsule Indirect Shadows (-> capsule-shadows-overview-in-unreal-engine)
- Indirect Minimum Shadow Visibility (-> capsule-shadows-overview-in-unreal-engine)
- Capsule Direct Shadows (-> capsule-shadows-overview-in-unreal-engine)
- Light Source Angle (-> capsule-shadows-overview-in-unreal-engine)
- Source Radius (-> capsule-shadows-overview-in-unreal-engine)
- Performance (-> capsule-shadows-overview-in-unreal-engine)
- Limitations (-> capsule-shadows-overview-in-unreal-engine)
