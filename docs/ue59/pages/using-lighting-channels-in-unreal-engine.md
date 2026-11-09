# Lighting Channels

https://dev.epicgames.com/documentation/en-us/unreal-engine/using-lighting-channels-in-unreal-engine?application_version=5.9

> An overview of using channels of a light source to light specific surfaces.

[image: Lighting Channels]

**Lighting Channels** allow dynamic lights to only affect objects when their lighting channels overlap. This is primarily intended for cinematic use to give users powerful control over how **Actors** are lit. At the moment, **Unreal Engine** supports up to 3 lighting channels.

## Usage

By default, Directional Lights, Spot Lights, Point Lights, and all Actors that can be affected by lights (Static Meshes, Skeletal Meshes, etc.) have **Lighting Channel 0** enabled. If you would like a lightable **Actor** to be affected by another **Lighting Channel**, you must enable that channel on both the Actor and the light.

### Example

[image: Example of using Lightning Channels]

In the above image, the white Directional Light can only affect **Channel 0**, which includes the mannequin on the left and the background Static Meshes, while the purple Point Light can only affect **Channel 1**, which only includes the mannequin on the right.

You can see how the properties are set here:

[image: Properties for setting up the Lightning Channels]

Click for full image.

For lights, the property can be found in the **Advanced** pulldown menu of the **Light** category in the **Details** panel. For Actors that can be lit, you can find the **Lighting Channels** properties in the **Lighting** category of the **Details** panel.

## Limitations

Lighting channel influence is applied dynamically. This means it won't work with Static Lights or Static Mesh Actors with Static Mobility. Static Mesh Actors with **Mobility** set to **Movable** do work, however. You'll need to use either **Stationary** or **Movable** lights.

Lighting channels will only affect direct lighting on opaque materials. So, translucent or masked materials will not work.

## Performance

The performance impact of using **Lighting Channels** is minimal, but also non-zero. In a scene with 1 directional light, Radeon 7870, at 1080p for example:

| Lighting Channels Satus | Time in ms |
| --- | --- |
| **off** | 0.42ms StandardDeferredLighting 1 draws 1 prims 3 verts |
| **on** | 0.08ms CopyStencilToLightingChannels 1 draws 1 prims 3 verts 0.45ms StandardDeferredLighting 1 draws 1 prims 3 verts |

## On Mobile

As of Unreal Engine 4.13, Lighting Channels works on mobile renderers with the following features supported:

- Multiple directional lights are supported in different channels.
- Each primitives can only be affected by one directional, and it will use the directional light from first lighting channel it has set.
- CSM shadows from stationary or movable directional lights cast only on primitives with matching lighting channels.
- Dynamic point lights fully support lighting channels.

- rendering
- lighting
- shadows

On this page

- Usage (-> using-lighting-channels-in-unreal-engine)
- Example (-> using-lighting-channels-in-unreal-engine)
- Limitations (-> using-lighting-channels-in-unreal-engine)
- Performance (-> using-lighting-channels-in-unreal-engine)
- On Mobile (-> using-lighting-channels-in-unreal-engine)
