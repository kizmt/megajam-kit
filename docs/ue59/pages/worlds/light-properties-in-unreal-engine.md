# Light Properties

https://dev.epicgames.com/documentation/en-us/unreal-engine/light-properties-in-unreal-engine?application_version=5.9

> This page covers the Details panel properties that Directional, Point, Spot, Rect, and Sky Lights share.

Every light you place in a level has a light component, and most of that component's properties come from shared base classes rather than from the light type itself. Settings such as shadow biasing, contact shadows, lighting channels, and MegaLights work the same way on every light that has them. This page describes those shared properties once, so each light type's page can focus on what makes that light different. For the properties that only one light type has, such as a Spot Light's cone angles or a Rect Light's barn doors, see Properties by Light Type (-> light-properties-in-unreal-engine).

Not every light has every property. Sky Lights capture distant parts of the level and apply them as lighting, so they share only the core brightness, shadowing, and ray tracing settings. Directional, Point, Spot, and Rect Lights share the rest of the settings on this page, and Point, Spot, and Rect Lights also share **Light Profiles**, **Intensity Units**, and **Inverse Exposure Blend**. When a property is limited to some light types, the description says so.

To see these properties, select a light in the level and open the **Details** panel.

## Property Reference

### Light

The Light category holds the settings you'll change most: how bright the light is, its color, and whether it casts shadows. For guidance on choosing intensity values, see Physical Lighting Units (-> using-physical-lighting-units-in-unreal-engine).

| **Property** | **Description** |
| --- | --- |
| **Intensity** | Total energy that the light emits. Directional Lights use lux, Sky Lights use a scale (shown as **Intensity Scale** for most source types), and Point, Spot, and Rect Lights use the units set by **Intensity Units**. |
| **Intensity Units** | The units used for **Intensity**: Unitless, Candelas, Lumens, EV, or Nits. Changing the units converts the current value so the light's brightness stays the same. Newly placed lights use the **Light Units** setting in **Project Settings > Engine > Rendering > Default Settings**, which is Candelas by default. Point, Spot, and Rect Lights only. |
| **Light Color** | The color that the light emits. Note that the color can change the light's effective intensity. |
| **Use Temperature** | Whether to use **Temperature** to set the light's color. When disabled, the light uses white (D65). Not available on Sky Lights. |
| **Temperature** | The color temperature of the light in Kelvin. White (D65) is 6500 K. Not available on Sky Lights. |
| **Affects World** | Whether the light contributes to the scene at all. This can't be changed at runtime. To turn a light off during gameplay, change its **Visible** property instead. |
| **Cast Shadows** | Whether the light casts any shadows. |
| **Indirect Lighting Intensity** | Scales the light's contribution to indirect (bounced) lighting. A value of 0 disables global illumination from this light. |
| **Volumetric Scattering Intensity** | Intensity of the volumetric scattering from this light, as a scale on **Intensity** and **Light Color**. |

### Light (Advanced)

The rest of the Light category's properties are in its advanced section, which you can expand at the bottom of the category. They're grouped below by what they control.

#### Lighting and Translucency

These settings fine-tune how the light's energy reaches surfaces, including translucent and subsurface materials.

| **Property** | **Description** |
| --- | --- |
| **Specular Scale** | Multiplier on specular highlights. Use only with great care! Any value besides 1 is not physical! Not available on Sky Lights. |
| **Diffuse Scale** | Multiplier on diffuse lighting. Use only with great care! Any value besides 1 is not physical! Not available on Sky Lights. |
| **Affect Translucent Lighting** | Whether the light affects translucency. Disabling this can save GPU time when there are many small lights. |
| **Transmission** | Whether light from this light passes through surfaces that use subsurface scattering profiles. Requires the light to be Movable. |
| **Inverse Exposure Blend** | Blends between the light's intensity and its intensity divided by exposure. This keeps gameplay lights at a consistent brightness as the camera's exposure changes. Point, Spot, and Rect Lights only. |

#### Shadows

These settings control which objects cast shadows from the light, and how the light's shadow maps are biased and filtered. Contact shadows add short, sharp screen space shadows where objects meet surfaces. **Shadow Bias**, **Shadow Slope Bias**, and **Shadow Filter Sharpen** apply to conventional shadow maps. Virtual Shadow Maps (-> virtual-shadow-maps-in-unreal-engine) use their own project-wide settings instead. For more information, see Contact Shadows (-> contact-shadows-in-unreal-engine).

| **Property** | **Description** |
| --- | --- |
| **Cast Static Shadows** | Whether the light casts shadows from static objects. Requires **Cast Shadows**. |
| **Cast Dynamic Shadows** | Whether the light casts shadows from dynamic objects. Requires **Cast Shadows**. |
| **Cast Translucent Shadows** | Whether the light can cast dynamic shadows through translucent objects. Enabled by default on Directional Lights. Not available on Sky Lights. |
| **Cast Volumetric Shadow** | Whether the light shadows volumetric fog. Disabling this can save GPU time. Enabled by default on Directional and Sky Lights. |
| **Cast Deep Shadow** | Whether the light casts high quality self-shadowing on hair strands, at an extra GPU cost. |
| **Deep Shadow Layer Distribution** | How the deep shadow layers used for hair strands are spread out, from 0 (evenly spaced) to 1 (exponential, which gives more detail on small nearby features). |
| **Cast Shadows From Cinematic Objects Only** | Whether the light casts shadows only from components with **Cast Cinematic Shadow** enabled. Not available on Sky Lights. |
| **Shadow Resolution Scale** | Scales the resolution of the shadow maps used to shadow this light. Not available on Sky Lights. |
| **Shadow Bias** | Controls how accurate the light's self-shadowing is. Lower values start shadows closer to the casting surface, but can cause shadowing artifacts. Not available on Sky Lights. |
| **Shadow Slope Bias** | Works with **Shadow Bias** to control self-shadowing accuracy, adding more bias to surfaces at a steep angle to the light. Not available on Sky Lights. |
| **Shadow Filter Sharpen** | How much to sharpen shadow filtering for this light. Not available on Sky Lights. |
| **Contact Shadow Length** | The length of the screen space ray trace for sharp contact shadows. A value of 0 disables contact shadows. Not available on Sky Lights. |
| **Contact Shadow Length In World Space Units** | Whether **Contact Shadow Length** is in world space units instead of screen space units. Not available on Sky Lights. |
| **Contact Shadow Casting Intensity** | Intensity of the contact shadows cast by primitives with **Contact Shadow** enabled. A value of 0 casts no shadow. Not available on Sky Lights. |
| **Contact Shadow Non Casting Intensity** | Intensity of the contact shadows cast by primitives with **Contact Shadow** disabled. A value of 0 casts no shadow. Not available on Sky Lights. |
| **Force Cached Shadows For Movable Primitives** | Whether to cache shadows for movable primitives for this light, even when cached shadows are disabled for movable primitives in the project. Not available on Sky Lights. |

#### Ray Tracing and MegaLights

These settings control how the light works with hardware ray tracing and with MegaLights, which renders many shadowed lights at a stable cost. For more information, see Hardware Ray Tracing (-> hardware-ray-tracing-in-unreal-engine) and MegaLights (-> megalights-in-unreal-engine).

| **Property** | **Description** |
| --- | --- |
| **Cast Ray Traced Shadows** | Whether the light casts ray traced shadows: Disabled, Use Project Setting, or Enabled. |
| **Affect Ray Tracing Reflections** | Whether the light affects objects in ray traced reflections. |
| **Affect Ray Tracing Global Illumination** | Whether the light affects ray traced global illumination. |
| **Allow MegaLights** | Whether this light can use MegaLights when MegaLights is enabled in the project settings or a Post Process Volume. Directional Lights aren't rendered through MegaLights by default. Not available on Sky Lights. |
| **MegaLights Shadow Method** | The shadowing method MegaLights uses for this light. Ray Tracing gives a fixed cost and correct area shadows. Virtual Shadow Map has a higher cost per light, but casts shadows directly from Nanite geometry. Default uses the project's MegaLights shadow method. Not available on Sky Lights. |
| **Override Ray End Bias** | Whether to use the **Ray End Bias** value on this light. Not available on Sky Lights. |
| **Ray End Bias** | Bias for the end of a shadow ray. Use it to fix self-occlusion artifacts between the light and nearby geometry, such as a lamp's enclosure mesh. Not available on Sky Lights. |

#### Lighting Channels

Lighting channels limit which objects a light affects. A light only lights objects that share at least one of its channels. For more information, see Lighting Channels (-> using-lighting-channels-in-unreal-engine).

| **Property** | **Description** |
| --- | --- |
| **Lighting Channels** | The lighting channels this light affects. Lighting channels apply to opaque materials, direct lighting, and dynamic lighting and shadowing. Not available on Sky Lights. |
| **View Lighting Channels** | Controls which views this light affects. Not available on Sky Lights. |

### Light Profiles

Light profiles use IES data, measured from real-world light fixtures, to shape how light spreads from the light. These properties are available on Point, Spot, and Rect Lights. For more information, see IES Light Profiles (-> using-ies-light-profiles-in-unreal-engine).

| **Property** | **Description** |
| --- | --- |
| **IES Texture** | The IES profile used for the light. IES files are ASCII data that Unreal Engine stores as textures. They aren't image files. |
| **Use IES Intensity** | If disabled, the light's **Intensity** sets how much light it produces. If enabled, the IES profile's brightness in lumens is used instead, and **Intensity** is unavailable. |
| **IES Intensity Scale** | Scale for the IES profile's brightness, as IES values can easily overexpose a scene. Requires **Use IES Intensity**. |

### Lightmass

These settings control how Lightmass treats the light when you build lighting. They affect only the precomputed lighting from Static and Stationary lights, and are available on every light type except Sky Lights. For more information, see Lightmass Basics (-> lightmass-basics-in-unreal-engine).

| **Property** | **Description** |
| --- | --- |
| **Indirect Lighting Saturation** | A value of 0 completely desaturates the light in Lightmass. A value of 1 leaves it unchanged. |
| **Shadow Exponent** | Controls the falloff of shadow penumbras. |
| **Use Area Shadows for Stationary Light** | Whether to use area shadows for a Stationary light's precomputed shadow maps. Area shadows get softer as distance from the caster grows, but need a higher lightmap resolution. |

### Light Function

A light function uses a material to filter the light's intensity, for example to make a light flicker or to project a pattern. These properties are available on every light type except Sky Lights. For more information, see Light Functions (-> using-light-functions-in-unreal-engine).

| **Property** | **Description** |
| --- | --- |
| **Light Function Material** | The light function material applied to this light. |
| **Light Function Scale** | Scales the light function projection. |
| **Fade Distance** | The distance at which the light function is completely faded to **Disabled Brightness**. Use it to hide aliasing from light functions applied in the distance. |
| **Disabled Brightness** | Brightness factor applied to the light when it has a light function but the function is disabled, for example beyond the **Fade Distance**. |

### Performance

These settings fade out and stop rendering the light beyond a set distance from the camera. Use them to save the cost of lights that are too far away to make a visible difference. They affect only Point, Spot, and Rect Lights. Directional Lights also show these properties, but they have no effect there.

| **Property** | **Description** |
| --- | --- |
| **Max Draw Distance** | The distance from the camera at which the light stops rendering lighting and shadows. A value of 0 means there's no max draw distance. |
| **Max Distance Fade Range** | The distance over which the light fades out as it approaches **Max Draw Distance**, so it doesn't pop. Requires **Max Draw Distance** to be greater than 0. |

### Distance Field Shadows

These settings control ray traced distance field shadows, which use Mesh Distance Fields (-> mesh-distance-fields-in-unreal-engine) to cast soft area shadows with sharp contacts. They have a low cost for each object, so they work well for lights that affect many meshes. These properties are available on every light type except Sky Lights.

| **Property** | **Description** |
| --- | --- |
| **Distance Field Shadows** | Whether to use ray traced distance field area shadows. Enabled by default on Directional Lights. Requires **Generate Mesh Distance Fields** to be enabled in the project settings. |
| **Ray Start Offset Depth Scale** | Controls how far ray traced shadows are offset from the receiving surface as the camera gets farther away. Larger values reduce self-shadowing artifacts on low-resolution distance fields. |

### Ray Tracing

This setting controls the quality of the light's ray traced shadows, which are used when hardware ray tracing is enabled and **Cast Ray Traced Shadows** is on.

| **Property** | **Description** |
| --- | --- |
| **Samples Per Pixel** | The number of rays traced for each pixel when this light casts ray traced shadows. Higher values give smoother soft shadows at a higher cost. Sky Lights use 4 by default, and other lights use 1. |

## Properties by Light Type

Each light type adds its own properties to the ones on this page. You can find them on these pages:

| **Light Type** | **Properties Specific to This Light** |
| --- | --- |
| Directional Lights (-> directional-lights-in-unreal-engine) | Source angles, atmosphere and cloud settings, light shafts, cascaded shadow maps, and dynamic shadow distances |
| Point Lights (-> point-lights-in-unreal-engine) | Attenuation radius, source radius and length, and falloff |
| Spot Lights (-> spot-lights-in-unreal-engine) | Inner and outer cone angles, plus the Point Light properties |
| Rect Lights (-> rectangular-area-lights-in-unreal-engine) | Source width and height, barn doors, source texture, and light function cone angle |
| Sky Lights (-> sky-lights-in-unreal-engine) | Real time capture, source type and cubemap, lower hemisphere, distance field ambient occlusion, and cloud ambient occlusion |
