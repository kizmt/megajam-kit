# Volumetric Cloud Material

https://dev.epicgames.com/documentation/en-us/unreal-engine/volumetric-cloud-material-in-unreal-engine?application_version=5.9

> The default volumetric material used to create various types of cloud types, shapes, and effects.

[image: Volumetric Cloud Material]

The Volumetric Clouds (-> volumetric-cloud-component-in-unreal-engine) component is driven by a volume material. This volumetric cloud material includes parameters in named categories that are simple, clear, and easy to understand when defining the types and shapes of clouds you want, and making them look like storm clouds.

## Recommended Workflow with the Volumetric Cloud Material

The material used for rendering clouds with the volumetric cloud component is located in the Engine Content folder under `Engine/EngineSky/VolumetricClouds`. The material is named `m_SimpleVolumetricCloud_Inst` and is derived from `m_SimpleVolumetricClouds`.

Making changes to any content in the Engine Content folder directly has an effect on any projects and components that references this material. For this reason, we strongly recommend you make material instances of this material in your project’s Content folder. This way, you can make many variations to support different cloud types and shapes without overwriting the original material that is used by default.

Default look and location of Volumetric Cloud Shader in Blank Game Template.

## Cloud Material Instance Settings

When you open the Volumetric Cloud material instance or create one of your own from the original, you will find the parameters are grouped into categories that define the look, shape, and effects of different clouds.

Volumetric cloud parameter groups in a material instance.

### Cloud Layout

The **Cloud Layouts** parameters are broken into textures and cloud types. The textures define the shapes, location, and mask for the cloud material and parameters to control the different types of clouds.

Volumetric Cloud Shader Layout Parameters.

The cloud type parameters use color channels to align with different types of cloud formations. There are four types of cloud types aligned with the red, green, blue, and alpha channels of the cloud textures. These cloud types are:

|  |  |  |  |
| --- | --- | --- | --- |
|  |  |  |  |
| Stratocumulus | Altostratus | Cirrostratus | Nimbostratus (Storm) |

The Cloud Type section has the following settings:

| Property | Description |
| --- | --- |
| Cloud Type Textures |  |
| **Layout_CloudHeightProfile** | This texture describes the shape of the clouds as the altitude changes. Each channel of this texture describes the profile shape and relative altitude of a different cloud type, where R (red) is Stratocumulus, G (green) is Altostratus, B (blue) is Cirrostratus, and A (alpha) is Nimbostratus. |
| **Layout_CloudGlobalPattern** | This texture defines the world location for each type of cloud where each channel describes a different cloud type. The channels represent the following: R (red) is Stratocumulus, G (green) is Altostratus, B (blue) is Cirrostratus, and A (alpha) is Nimbostratus. |
| **Layout_GlobalCloudMask** | This texture is used to add clouds to or remove clouds from the global pattern texture (Layout_CloudGlobalPattern) in the masked region. Each channel of this texture applies to a different cloud type where R (red) is Stratocumulus, G (green) is Altostratus, B (blue) is Cirrostratus, and A (alpha) is Nimbostratus. |
| Cloud Type Parameters |  |
| **Layout_CloudType** | These parameters control the visibility for each different cloud type individually, where R (red) is Stratocumulus, G (green) is Altostratus, B (blue) is Cirrostratus, and A (alpha) is Nimbostratus. |
| **Layout_CloudGlobalScale** | These parameters control the distance over which the layout region textures (Layout_GlobalCloudMask and Layout_CloudGlobalPattern) repeat. This is measured in kilometers (km). |
| **Layout_CloudPerTypeScale** | These parameters control the scale of the cloud global pattern (Layout_CloudGlobalPattern) texture for each of the cloud types, where R (red) is Stratocumulus, G (green) is Altostratus, B (blue) is Cirrostratus, and A (alpha) is Nimbostratus. |
| **Layout_GlobalTexturePlacement** | This vector controls the offset and rotation (around the world Z axis) of the layout region textures (Layout_GlobalCloudMask and Layout_CloudGlobalPattern). |
| **Layout_WindControls** | This vector controls the strength of the wind along each world axis (x, y, or z), where the value for each can be positive or negative. The Alpha channel can be used to uniformly increase or decrease the strength of the wind. |
| **Layout_CloudTypeMask** | These parameters specify how strongly the global cloud mask (Layout_GlobalCloudMask) texture affects each of the cloud types, where R (red) is Stratocumulus, G (green) is Altostratus, and B (blue) is Cirrostratus. The MaskContribution (or alpha channel) sets the overall strength of the effect. |
| **Layout_GlobalCoverage** | These parameters determine the overall amount of cloud cover to apply, where positive values increase cloud cover and negative values decrease the amount of cloud cover. |

### Cloud Shape

The **Cloud Shape** parameters are useful for defining a general cloud shape and color using a noise volume texture. In this section, there are three separate noise samplers available, each with their own controls.

Volumetric Cloud Shader Shape Parameters.

The Cloud Shape section has the following settings:

| Property | Description |
| --- | --- |
| **Noise_Texture3D** | This texture is used to break up the shapes of the clouds for authoring their general form. Each color channel of the texture describes a different noise pattern where the influence of each is determined by the Noise controls. The alpha channel of this texture is unused. |
| **UseNoise3** | This toggle enables the use of a third sample of the Noise_Texture3D in order to break up the cloud shapes with an additional level of detail (or a different method of break up). This adds Noise3_Coordinates and Noise3_MultiChannel parameters. |
| **Noise_Bias** | Each parameter in this set is subtracted from the respective NoiseTexture sample, which can have positive or negative values. This determines how the noise texture dilates or erodes the Cloud Layout without increasing the overall contrast of the noise. |
| **Noise_Strength** | Each parameter in this set is multiplied against the respective result of the biased Noise Texture sample, which can be positive or negative values. This increases or decreases the contrast of the noise and thus increases the apparent strength of the noise effect on the Cloud Layout. |
| **Noise1_Coordinates** | This parameter controls both the scale of the green channel of the Noise Texture as well as how strong an effect Wind Velocity has on this noise sample. Noise1 controls the primary breakup noise for the clouds. |
| **Noise2_Coordinates** | This parameter controls both the scale of the red channel of the Noise Texture as well as how strong an effect Wind Velocity has on this noise sample. Noise2 controls the amount and scale of distortion for Noise1. |
| **Noise3_Coordinates** | When UseNoise3 is enabled, this parameter controls both the scale of the blue channel of the Noise Texture as well as how strong an effect Wind Velocity has on this noise sample. Noise3 is added to Noise1 as an additional level of detail. Noise3 includes an additional control (Multichannel) which is used to modulate the existing noise by any combination of Noise Texture channels. |
| **Cloud_AlbedoColor** | This is the color of the clouds when they are not considered storm clouds. The Ambient Occlusion (alpha channel) of this parameter determines the strength of light occlusion for the material (and consequently how dense the shadows appear). |
| **Cloud_GlobalDensity** | This parameter controls the overall density of the cloud material, rendering them more opaque at higher values or hazier at lower values. |

### Storm

The **Storm** parameters are necessary settings useful for making a cloud system look like a storm in formation and color. Enabling this section of settings uses the Nimbostratus layer of the material.

Volumetric Cloud Shader Storm Parameters.

The Storm section has the following settings:

| Property | Description |
| --- | --- |
| **Storm_Clouds** | This value controls the strength of the blend from normal clouds to storm clouds, which have additional controls for albedo, occlusion, distortion, and optional lightning effects. |
| **Storm_LightningTexScale** | This value controls the relative scale of the lightning texture. This texture is used to determine the location of lightning flashes in the material. |
| **Storm_LightningAnim** | These parameters control the animation of the lightning in the material. The lightning flicker adds a secondary animation to the flashes. Dynamic lightning animation is used to determine the frequency of lightning flashes, such that the higher the value, the more frequently the flashes occur. Manual lightning is intended to be used when Dynamic Lightning Animation is set to 0. This will let you decide the state of the flashes independently of time (which is mostly useful when rendering still images or when manually updating time in a Sequence). |
| **Storm_LightningClouds** | These parameters control the effect of lightning on the clouds.**Source Power** controls the intensity of the core of the lightning strike.**Fill Scatter** controls the distance the lightning scatters in the clouds.**Fill Scatter Intensity** controls the brightness of the scattered light in the clouds.**Second Mip Level** controls the sharpness of the details contributed by the second lightning texture sample (where higher values are sharper). |
| **Storm_LightningColor** | These parameters control the color (RGB values) and brightness (alpha value) of the lightning flashes. |
| **Storm_LightningMask** | These parameters control how the lightning texture is masked in the material.**Lightning Mask Bias** determines at what positions in the cloud layout texture alpha channel lightning can appear.**Lightning Mask Strength** is multiplied against the bias result to compensate for lightning masks which are either too opaque or too transparent.**Cloud Texture Weight** determines the influence of the noise texture results on the lighting mask, where higher values increase the influence of the texture. |
| **Storm_AlbedoColor** | Sets the color of clouds when they are considered storm clouds. The alpha channel determines the multiplicative factor for the shadow density, with lower values resulting in darker shadows. |

### Multiscatter

The **Multiscatter** parameters are a set of controls for how light scatters in the cloud material.

Volumetric Cloud Multiscatter Parameters.

The Multiscatter section has the following settings:

| Property | Description |
| --- | --- |
| **Phase_Controls** | The cloud scattering uses a combination of two phase functions to determine how light bounces in the material.**Phase A** and **Phase B** determine the directionality of light scattering in the clouds. Positive values scatter forward, away from the source. Negative values scatter backward, towards the source. These can be defined in the range of -1 to 1.**Phase Blend** determines how strong the contribution of each phase is, where 0 is entirely Phase A and 1 is entirely Phase B. |
| **Multiscatter_Controls** | These parameters control the multiscattering approximations in the cloud material. Each value below has a valid range from 0 to 1.**Intensity** controls the overall strength of the effect.**Occlusion** determines how strongly light is attenuated.**Eccentricity** determines how uniform the scattering is. |

## Additional Notes

#### Migrating and Redirecting Materials

You can move the original material from Unreal Engine 5.4 to any later version of the engine by following the steps for Migrating Assets (-> migrating-assets-in-unreal-engine).

For content like the Sun Position Calculator (-> geographically-accurate-sun-positioning-tool-in-unreal-engine) plugin, you only need to redirect the material to its location in the engine content folder, which can be found here: **Engine > Content > EngineSky > VolumetricClouds**.

#### Engine Content Original Volumetric Clouds Textures

The Engine Content folder where the volumetric cloud material is saved also includes all the assets needed to make the material. In this folder, you’ll find new textures and assets that work with the updated volumetric cloud material. You will also find the original textures and volume textures in order to permit their reuse with the original material if you were to migrate it from Unreal Engine 5.4.

- environment
- rendering
- lighting
- clouds
- material
- volumetrics

On this page

- Recommended Workflow with the Volumetric Cloud Material (-> volumetric-cloud-material-in-unreal-engine)
- Cloud Material Instance Settings (-> volumetric-cloud-material-in-unreal-engine)
- Cloud Layout (-> volumetric-cloud-material-in-unreal-engine)
- Cloud Shape (-> volumetric-cloud-material-in-unreal-engine)
- Storm (-> volumetric-cloud-material-in-unreal-engine)
- Multiscatter (-> volumetric-cloud-material-in-unreal-engine)
- Additional Notes (-> volumetric-cloud-material-in-unreal-engine)
- Migrating and Redirecting Materials (-> volumetric-cloud-material-in-unreal-engine)
- Engine Content Original Volumetric Clouds Textures (-> volumetric-cloud-material-in-unreal-engine)
