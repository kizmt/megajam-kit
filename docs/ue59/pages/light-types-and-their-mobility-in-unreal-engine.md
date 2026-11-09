# Light Types and Their Mobility

https://dev.epicgames.com/documentation/en-us/unreal-engine/light-types-and-their-mobility-in-unreal-engine?application_version=5.9

> The available types of lights to choose from and how their mobility settings affect lighting in the scene.

[image: Light Types and Their Mobility]

Unreal Engine provides several types of light to create nearly any type of lighting scenario and to work with small to large scale worlds. Each of these types of lights also has its own mobility option to define how it interacts with the other Actors in the scene and how the lighting system will utilize the light.

## Types of Lights

The types of lights available in the Editor make it possible to light your world in various styles and configurations to achieve the look you want for your project. With these light types, you can light any size scenes from large sprawling worlds to small localized interiors.

Unreal Engine provides the following types of lights:

- **Directional Lights** are the primary outdoor light, or any light that needs to appear as if it's casting light from extreme, or near infinite, distances.
- **Sky Light** captures the background of the scene and applies it to the Level's geometry.
- **Point Lights** act as a light bulb, casting light in all directions from a single point.
- **Spot Lights** emit light from a single point in a direction limited by a set of cones.
- **Rect Lights** emit light from a rectangular surface in a direction.

**Directional** and **Sky Lights** are useful for large exteriors or to provide lighting and shadowing through interior openings. For large exteriors, Directional Lights are most effective for lighting dense foliage and other geometry more efficiently.

|  |  |
| --- | --- |
| [image: directional light] Directional Light | [image: sky light] Sky Light |

**Point**, **Spot**, and **Rect Lights** are useful for lighting smaller localized areas. Their type and properties can help define their shape and look within a given scene. These types of lights also share a lot of the same properties.

|  |  |  |
| --- | --- | --- |
| [image: point light] Point Light | [image: spot light] Spot Light | [image: rectangular area light] Rectangular Area Light |

### Overview of Light Types

- [image: Directional Lights] Directional LightsThe basics of undestanding directional lights. (-> directional-lights-in-unreal-engine)

- [image: Sky Lights] Sky LightsThe basics of undestanding sky lighting. (-> sky-lights-in-unreal-engine)

- [image: Point Lights] Point LightsThe basics of undestanding point lights. (-> point-lights-in-unreal-engine)

- [image: Spot Lights] Spot LightsThe basics of undestanding spot lights. (-> spot-lights-in-unreal-engine)

- [image: Rectangular Area Lights] Rectangular Area LightsThe basics of undestanding rectangular area lights. (-> rectangular-area-lights-in-unreal-engine)

## Light Mobility

Each type of Actor in a scene has its own **Mobility** setting that controls whether it is allowed to move or change in some way during gameplay. For Light Actors, the mobility selection defines how the light will be treated in the scene when a light build is taking place.

It's important to choose the type of light mobility that makes the most sense for your project as they will impact performance, look, and design choice. Some features of lights are limited in their functionality or not entirely supported for some platforms or machines. For example, dynamic shadowing is not supported for all types of lights on mobile platforms.

Each Light Actor has three mobility states:

[image: light mobility selection]

| Mobility State | Description |
| --- | --- |
| **Static** | This mobility is reserved for Light Actors that are not intended to move or update in any way during gameplay.Static lights will contribute to pre-calculated lightmaps using Lightmass (-> lightmass-basics-in-unreal-engine). These lights will illuminate the scene and generate lighting data for any Actors set to Static and Stationary, but for Movable ones, they will be lit by lighting data stored in the Indirect Lighting Cache (-> indirect-lighting-cache-in-unreal-engine) or Volumetric Lightmaps (-> volumetric-lightmaps-in-unreal-engine) to light them. |
| **Stationary** | This mobility is reserved for Actors that can during gameplay, but not move.These lights can change in some way during gameplay, such as having their color or intensity changed, or turned completely off. Stationary Lights contribute to pre-calculated lightmaps using Lightmass (-> lightmass-basics-in-unreal-engine), but they can also cast dynamic shadows for movable objects. Stationary lights come with added cost and are limited by the number of lights that can affect a single object at any given time. For example, A single object can only be affected by up to four Stationary Lights at any time. |
| **Movable** | This mobility is reserved for Light Actors that need to be added, removed, or moved during gameplay.These lights only cast dynamic shadows. In addition to being able to move them during gameplay, they can also change their color, intensity, and other light properties as needed.Care must be taken when using lights with this mobility since their shadowing cost is the most costly. However, non-shadowing Movable lights are very inexpensive to calculate, and carry a lower cost than lights that are set to Static since there is no lighting data that needs to be saved to disk. |

### Overview of Light Mobility

- [image: Movable Light Mobility] Movable Light MobilityFully dynamic lights capable of changing all its properties during runtime. (-> movable-light-mobility-in-unreal-engine)

- [image: Stationary Light Mobility] Stationary Light MobilityPartially dynamic and precomputed lighting capable of changing some of its properties during runtime. (-> stationary-light-mobility-in-unreal-engine)

- [image: Static Light Mobility] Static Light MobilityPrecomputed lighting baked into textures that cannot change and has no lighting cost during runtime. (-> static-light-mobility-in-unreal-engine)

- rendering
- lights

On this page

- Types of Lights (-> light-types-and-their-mobility-in-unreal-engine)
- Overview of Light Types (-> light-types-and-their-mobility-in-unreal-engine)
- Light Mobility (-> light-types-and-their-mobility-in-unreal-engine)
- Overview of Light Mobility (-> light-types-and-their-mobility-in-unreal-engine)
