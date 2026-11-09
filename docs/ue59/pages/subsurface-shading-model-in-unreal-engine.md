# Subsurface Shading Model

https://dev.epicgames.com/documentation/en-us/unreal-engine/subsurface-shading-model-in-unreal-engine?application_version=5.9

> Description and technical details of the subsurface shading model available in Materials.

[image: Subsurface Shading Model]

Materials have a new subsurface shading model (**MLM_Subsurface**) which is intended for materials like wax or jade which appear opaque, but lighting scatters inside them allowing a portion of the light from the opposite side of the surface to show through.

 [image: Jade Material] [image: Ice Material]

Subsurface scattering (SSS) is often used for creating realistic skin for humans or other creatures; however, the effect from this shading model is lower quality and cheaper than what would generally be used for skin rendering.

## Technical Details

The two components of subsurface lighting are a wrap-around `N dot H` term and a light backscattering term, which shows up when the light is on the other side of an SSS object. Both of these are masked by translucent self shadowing from exponential shadow maps.

## Material Input Channels

The SubsurfaceColor input channel defines the color inside the material which affects SSS lighting.

The Opacity channel of the material takes on a slightly different meaning when the material is using subsurface scattering and the MLM_Subsurface shading model. Since these types of surfaces are completely opaque, the Opacity, in this case, controls how dense the material is when it scatters light as well as:

- How much the normal affects the subsurface lighting, a more opaque material gets more normal influence.

- How far lighting makes it through the material due to self-shadowing, a smaller opacity causes light to travel further.

- How soft the shadow is on the material, a smaller opacity results in softer shadows, but softness is clamped.

Be sure to set the Opacity for any subsurface materials to a reasonable value, e.g. 0.1. The default opacity is 1, which does not produce a very convincing subsurface-type effect.

## Limitations

Additionally there are some limitations with the current implementation:

- Point light shadowing not yet supported.

- Cascaded Shadow Map seams.

- SSS materials can still receive leaked lighting through fully opaque materials if they are close enough to the shadow caster.

- Soft shadows from low opacity are limited in how soft they can be and have aliasing.

- materials
- shaders

On this page

- Technical Details (-> subsurface-shading-model-in-unreal-engine)
- Material Input Channels (-> subsurface-shading-model-in-unreal-engine)
- Limitations (-> subsurface-shading-model-in-unreal-engine)
