# Direct Lighting

https://dev.epicgames.com/documentation/en-us/unreal-engine/features-and-properties-of-lights-in-unreal-engine?application_version=5.9

> An overview of the various properties and features that lights support.

[image: Direct Lighting]

Lights in Unreal Engine contain a large set of properties to work with, which are partly dependent on the Light's mobility and type (-> light-types-and-their-mobility-in-unreal-engine).

Light properties are found in the **Details** panel when a light is selected in the Level. Depending on the set **Mobility** of **Static**, **Stationary**, or **Movable** determines what features and properties of the light are supported for the selected light.

[image: directional light properties] Light properties of a Directional Light.

## Things to Consider for Lights and their Properties

Before diving into the specific features and properties of Lights, you'll want to consider the following:

- What types of lights does your scene require to light it?
- What Mobility should your lights have?
- Lights with different mobilities can be mixed and matched as needed to light a scene. However, considerations must be considered for what that means for the lighting, shadows, and assets it affects within the Level. Not all properties support every mobility or light type.
- Shadowing (-> shadowing-in-unreal-engine) is a broad subject with lighting. Mobilities, type of light, or even enabled lighting features in the Project Settings can affect how lighting works within the project.
- Some types of lights complement other standalone features, such as one for Environmental Lighting (-> lighting-the-environment-in-unreal-engine).

## Setting Properties for Lights

The properties and features of lights can be found in the **Details** panel when a light is selected in the Level.

Each light must have its **Mobility** set to **Static**, **Stationary**, or **Movable**.

[image: light mobility selection]

All properties of lights are listed no matter what selection is made, but the mobility affects some properties that are supported. For example, Lightmass settings only affect mobilities set to Static or Stationary.

Explore the topics below to learn about some of the features and properties you can use with the Lights in your scenes and projects.

### General Light Features and Properties Topics

A listing of general concepts and features related to all, or most, types of lights you can use. These can be individual features of lights you can use, or properties of lights that work with larger features, like Global Illumination.

- [image: MegaLights] MegaLightsA whole new direct lighting path to place many dynamic and shadowed area lights in a scene. (-> megalights-in-unreal-engine)

- [image: Physical Lighting Units] Physical Lighting UnitsAn overview of using physically based lighting units with light sources. (-> using-physical-lighting-units-in-unreal-engine)

- [image: Global Illumination] Global IlluminationA collection of topics on the global illumination options available to choose from. (-> global-illumination-in-unreal-engine)

- [image: Shadowing] ShadowingAn overview of available shadowing methods and the properties they support. (-> shadowing-in-unreal-engine)

- [image: Reflections Environment] Reflections EnvironmentSystems for how reflections are captured and displayed on reflective surfaces. (-> reflections-environment-in-unreal-engine)

- [image: Light Types and Their Mobility] Light Types and Their MobilityThe available types of lights to choose from and how their mobility settings affect lighting in the scene. (-> light-types-and-their-mobility-in-unreal-engine)

- [image: Mesh Distance Fields] Mesh Distance FieldsAn overview of Mesh Distance Fields and its available features that you can use when developing your games. (-> mesh-distance-fields-in-unreal-engine)

- [image: Lighting Channels] Lighting ChannelsAn overview of using channels of a light source to light specific surfaces. (-> using-lighting-channels-in-unreal-engine)

- [image: IES Light Profiles] IES Light ProfilesAn overview of setting up and using IES textures with lights. (-> using-ies-light-profiles-in-unreal-engine)

- [image: Light Functions] Light FunctionsAn overview of using materials to mask a light's projected area. (-> using-light-functions-in-unreal-engine)

## Directional Light Features and Properties Topics

The following features work with Directional Lights (-> directional-lights-in-unreal-engine).

- [image: Light Shafts] Light ShaftsAn overview of using Direcitonal Light to simulate light scattering through the atmosphere. (-> using-light-shafts-in-unreal-engine)

- [image: Sky Atmosphere Component] Sky Atmosphere ComponentA physically-based sky and atmosphere rendering system with time-of-day features and ground-to-space view transitions featuring aerial perspective. (-> sky-atmosphere-component-in-unreal-engine)

- [image: Volumetric Cloud Component] Volumetric Cloud ComponentReal-time cloud rendering using volumetric materials. (-> volumetric-cloud-component-in-unreal-engine)

## Sky Light Features and Properties Topics

The following features work with a Sky Light (-> sky-lights-in-unreal-engine).

- [image: Environmental Light with Fog, Clouds, Sky and Atmosphere] Environmental Light with Fog, Clouds, Sky and AtmosphereComponents and tools that enable users to build immersive worlds with environment lighting from fog, clouds, sky and atmosphere. (-> environmental-light-with-fog-clouds-sky-and-atmosphere-in-unreal-engine)

- rendering
- lighting
- lights

On this page

- Things to Consider for Lights and their Properties (-> features-and-properties-of-lights-in-unreal-engine)
- Setting Properties for Lights (-> features-and-properties-of-lights-in-unreal-engine)
- General Light Features and Properties Topics (-> features-and-properties-of-lights-in-unreal-engine)
- Directional Light Features and Properties Topics (-> features-and-properties-of-lights-in-unreal-engine)
- Sky Light Features and Properties Topics (-> features-and-properties-of-lights-in-unreal-engine)
