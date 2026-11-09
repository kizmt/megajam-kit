# Particle Material Expressions

https://dev.epicgames.com/documentation/en-us/unreal-engine/particle-material-expressions-in-unreal-engine?application_version=5.9

> Expressions used for creating Materials for emitters in Particle Systems.

[image: Particle Material Expressions]

## DynamicParameter

The **DynamicParameter** expression provides a conduit for particle emitters to pass up to four values to the Material to be used in any manner. These values are set in **Cascade** by means of a **ParameterDynamic** module placed on an emitter.

| Property | Description |
| --- | --- |
| **Param Names** | An array of the names of the parameters. The values here will determine the text displayed on the outputs of the expression in the Material Editor and will be the names used to reference the parameters in the ParameterDynamic module in Cascade. |
| **Default Value** | Specifies the initial values that the parameter outputs (Vector4). |
| Outputs |  |
| **Param1** | Outputs the value of the first parameter in the Param names property. The name of this output can change based on the values in the Param Names property. |
| **Param2** | Outputs the value of the second parameter in the Param names property. The name of this output can change based on the values in the Param Names property. |
| **Param3** | Outputs the value of the third parameter in the Param names property. The name of this output can change based on the values in the Param Names property. |
| **Param4** | Outputs the value of the fourth parameter in the Param names property. The name of this output can change based on the values in the Param Names property. |

## ParticleColor

The **ParticleColor** expression ties into the current color of a given particle based on any per-particle color data defined within **Cascade**. This must be plugged into the appropriate channel (Emissive Color).

| Item | Description |
| --- | --- |
| Outputs |  |
| **RGB** | Outputs the combined RGB vector data. |
| **R** | Outputs the red channel data. |
| **G** | Outputs the green channel data. |
| **B** | Outputs the blue channel data. |
| **A** | Outputs the alpha channel data. |

 [image: Particle Color Example]

In this example, you can see where the ParticleColor expression is providing color to the particles as defined within the particle system.

## ParticleDirection

The **ParticleDirection** expression outputs Vector3 (RGB) data on a per-particle basis, representing the direction a given particle is currently traveling.

 [image: Particle Direction Example]

You can see in the comparison below how the color of the particles is changing based on the current direction each particle is traveling.

 [image: Fountain vertical]
 [image: Fountain with turbulence]

**Note how the color changes as the particles change directions.**

## ParticleMacroUV

The **ParticleMacroUV** expression outputs UV texture coordinates that can be used to map any 2d texture onto the entire particle system in a continuous way, meaning the texture will be seamless across particles. The UVs will be centered around MacroUVPosition (specified in Cascade on the ParticleSystem, under the MacroUV category) and MacroUVRadius determines the world space radius that the UVs should tile at. The ParticleMacroUV node is useful for mapping continuous noise onto particles to break up the pattern introduced by mapping a texture onto each particle with normal texture coordinates.

| Item | Description |
| --- | --- |
| Properties |  |
| **Use View Space** | If true, effectively offsets the coordinates based on the depth of each sprite and creates a parallax effect, which can be useful for giving explosions a radial blur look |

 [image: Particle Macro UV Example]

## ParticleMotionBlurFade

The **ParticleMotionBlurFade** expression outputs a value representing the amount of fade on a particle as a result of motion blur. A value of 1 represents no blur, black represents complete blur.

 [image: Particle Motion Blur Fade]

## ParticlePositionWS

The **ParticlePositionWS** expression outputs Vector3 (RGB) data representing each individual particle's position in world space.

 [image: Particle Position WS example]

In this image, ParticlePositionWS is being fed into emissive color to visualize the data. The particle system has been scaled up to show how the color is changing based on position.

## ParticleRadius

The **ParticleRadius** expression outputs the radius in Unreal units of each particle individually. This allows, for example, for changes to be made to a material once the radius has reached a certain point.

 [image: Particle Radius Example]

In this image, the particles are shifting from green to red as their radius exceeds 7 units.

## ParticleRelativeTime

The **ParticleRelativeTime** expression outputs a number between 0 and 1 representing a particle's age, with 0 being the moment of birth and 1 being the moment of death.

 [image: Particle Relative Time Example]

In this example, you can see the particle relative time fed into the emissive color, resulting in particles that are fading from black at the moment of birth to white as they approach death.

## ParticleSize

The **Particle Size** expression outputs the X and Y size of a particle sprite. This can then be used to drive some aspect of a Material.

 [image: Particle Size Example]

Click image for full view.

In the example above, Particle Size is being multiplied into Particle Color. Notice that we are masking the output so that we only use the Green channel, which corresponds to the Y-Axis, or the length of the particles. This means that as the particles stretch out, they become brighter in color. As they shrink, they will become dimmer.

## ParticleSpeed

**ParticleSpeed** outputs the current speed each particle is traveling, measured in Unreal units per second.

 [image: Particle Speed Graph]

In this example, particle speed is feeding the color of the particles, which is then divided by 10 provide more meaningful results. The particles become black as they slow down.

## SphericalParticleOpacity

The **SphericalParticleOpacity** expression creates a procedural opacity map to cause sprite particles to appear spherical. This can be much simpler than having to create an import a texture map for a similar effect.

| Item | Description |
| --- | --- |
| Inputs |  |
| **Density** | This 0-1 value controls the density of the sphere map. Lower values result in more transparent spheres. Default is 1. |

 [image: Before]

 [image: After]

 [image: Particle Spherical Opacity graph]

## ParticleSubUV

The **ParticleSubUV** expression is used to render sub-images of a texture to a particle. ParticleSubUV is similar to a flipbook, except that ParticleSubUV allows the texture animation to be manipulated in Cascade.

| Item | Description |
| --- | --- |
| Properties |  |
| **Blend** | Blends together each frame of the SubUV sprite layout, rather than instantly "popping" from one frame to the next. |
| **Texture** | Specifies the texture to use. |
| **Sampler Type** | The type of data that will be sampled and output from the node. |
| **MipValueMode** | Selects how to customize the sample's mip-level or derivatives from the default hardware computed. Affects the look and performance. |
| Inputs |  |
| **UVs** | The UV input is ignored and does nothing. |
| Outputs |  |
| **RGB** | Outputs the three-channel RGB vector value of the color. |
| **R** | Outputs the red channel of the color. |
| **G** | Outputs the green channel of the color. |
| **B** | Outputs the blue channel of the color. |
| **A** | Outputs the alpha channel of the color. If a texture does not contain an alpha channel, connecting the 'alpha' channel to something, while not technically illegal, will always result in zero (black). |

 [image: Particle Sub UV Example]

## TextureSampleParameterSubUV

The **TextureSampleParameterSubUV** expression is identical to the ParticleSubUV (-> particle-material-expressions-in-unreal-engine) except that it is a parameter that can be modified in instances of the material and through code.

| Item | Description |
| --- | --- |
| Properties |  |
| **Parameter Name** | Specifies the name used to identify the parameter in instances of the Material and through code. |
| **Group** | Provides a way to organize parameter names into groups, or categories, within a MaterialInstanceConstant. All parameters within a Material that have the same Group property name will be listed underneath that category in the Instance Editor. |
| **Blend** | Blends together each frame of the SubUV sprite layout, rather than instantly "popping" from one frame to the next. |
| **Texture** | Specifies the texture sampled by the expression. |
| **Sampler Type** | The type of data that will be sampled and output from the node. |
| **MipValueMode** | Selects how to customize the sample's mip-level or derivatives from the default hardware computed. Affects the look and performance. |
| Inputs |  |
| **UVs** | The UV input is ignored and does nothing. |
| Outputs |  |
| **RGB** | Outputs the three-channel RGB vector value of the color. |
| **R** | Outputs the red channel of the color. |
| **G** | Outputs the green channel of the color. |
| **B** | Outputs the blue channel of the color. |
| **A** | Outputs the alpha channel of the color. If a texture does not contain an alpha channel, connecting the 'alpha' channel to something, while not technically illegal, will always result in zero (black). |

- materials
- shaders

On this page

- DynamicParameter (-> particle-material-expressions-in-unreal-engine)
- ParticleColor (-> particle-material-expressions-in-unreal-engine)
- ParticleDirection (-> particle-material-expressions-in-unreal-engine)
- ParticleMacroUV (-> particle-material-expressions-in-unreal-engine)
- ParticleMotionBlurFade (-> particle-material-expressions-in-unreal-engine)
- ParticlePositionWS (-> particle-material-expressions-in-unreal-engine)
- ParticleRadius (-> particle-material-expressions-in-unreal-engine)
- ParticleRelativeTime (-> particle-material-expressions-in-unreal-engine)
- ParticleSize (-> particle-material-expressions-in-unreal-engine)
- ParticleSpeed (-> particle-material-expressions-in-unreal-engine)
- SphericalParticleOpacity (-> particle-material-expressions-in-unreal-engine)
- ParticleSubUV (-> particle-material-expressions-in-unreal-engine)
- TextureSampleParameterSubUV (-> particle-material-expressions-in-unreal-engine)
