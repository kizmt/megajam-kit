# Atmosphere Material Expressions

https://dev.epicgames.com/documentation/en-us/unreal-engine/atmosphere-material-expressions-in-unreal-engine?application_version=5.9

> Material Expressions that affect fog and other atmospheric level effects.

[image: Atmosphere Material Expressions]

Learn to use this **Deprecated** feature, but use caution when shipping with it.

## Atmospheric Fog Color

The **Atmospheric Fog Color** Material Expression allows you to query the current color of the level's Atmospheric Fog, at any position in World Space. If no World Position is fed into it, then the world position of the pixel in question is used. This is useful when you need Materials to appear to fade into a distant fog color.

In the example below, The Base Color is being set using an Atmospheric Fog node, with the World Position receiving a simple network that queries the location that is always 50,000 units behind the object, relative to the position of the camera.

 [image: Atmosphere Material Expression]

The Atmospheric Fog Color Material Expression is deprecated in Unreal Engine 5, and should not be used. Instead, you should use the **Sky Atmosphere Component**, which is documented on this page. You may also want to consider using Volumetric Fog.

- materials
- shaders
- deprecated

On this page

- Atmospheric Fog Color (-> atmosphere-material-expressions-in-unreal-engine)
