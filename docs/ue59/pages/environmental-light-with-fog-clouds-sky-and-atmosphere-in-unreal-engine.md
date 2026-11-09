# Environmental Light with Fog, Clouds, Sky and Atmosphere

https://dev.epicgames.com/documentation/en-us/unreal-engine/environmental-light-with-fog-clouds-sky-and-atmosphere-in-unreal-engine?application_version=5.9

> Components and tools that enable users to build immersive worlds with environment lighting from fog, clouds, sky and atmosphere.

[image: Environmental Light with Fog, Clouds, Sky and Atmosphere]

Unreal Engine provides a set of components that allow for designers and artists to create immersive worlds with physically based lighting at large — or even small — scale while working efficiently to do so. These environment lighting components for atmosphere, clouds, fog, and lighting all work seamlessly together to create a unified experience that supports fully dynamically lit worlds.

The tools and features in this page will help you get started with creating your own worlds.

## Light Mixer

The **Light Mixer** is a dockable editor window where you can add, edit, and reference properties of Directional, Point, Spot, and Rect Lights in your Level.

For artists and designers, this window simplifies and can speed up your workflow by having them availabl and editable in one location. This includes lights that are components of scene Actors or of Blueprints. You can use Collections to organize them as well.

[image: Light Mixer Panel]

For more information, see Light Mixer (-> using-the-light-mixer-in-unreal-engine).

## Environment Light Mixer

The **Environment Light Mixer** is a dockable editor window where you can add, edit, and reference properties of environment lighting components for sky, clouds, atmosphere lights, and a sky light.

For artists and designers, this window simplifies and can speed up your workflow by having them all available in one location.

For more information, see Environment Light Mixer (-> environment-light-mixer-in-unreal-engine).

## Fog Effects

Fog effects are useful for adding ambiance to the world and setting the mood for environments. This includes creating multi-layered fog for high and low-lying areas, and volumetric effects for light shafts.

[image: volumetric fog]

The Sky Atmosphere (-> sky-atmosphere-component-in-unreal-engine) includes its own scattering and height fog simulation, but also works well with the Exponential Height Fog to support all types of lights in the scene.

 [image: Sky Atmosphere's Height Fog]

 [image: Sky Atmosphere | with Exponential Height Fog]

When the Project Setting **Support Sky Atmosphere Affecting Height Fog** is enabled, any contribution from Exponential Height Fog is additive. The Sky Atmosphere's height fog is applied on top of the Exponential Height Fog colors. However, should the **Fog Inscattering Color** and **Directional Inscattering Color** be set to black, the Sky Atmosphere will directly affect and influence the coloring of any Exponential Height Fog in the scene.

Additionally, you can used locally placed fog volumes to create fog effects in large or small areas of your scene. These local fog volumes support all platforms and volumetric fog effects when enabled.

[image: Placed Local Fog Volumes in a scene.]

### Fog Effects Topics

- [image: Exponential Height Fog] Exponential Height FogAn overview of the height-based, distant fog system. (-> exponential-height-fog-in-unreal-engine)

- [image: Local Fog Volumes] Local Fog VolumesAn overview of locally placed volumes to create height-based fog effects. (-> local-fog-volumes-in-unreal-engine)

- [image: Volumetric Fog] Volumetric FogAn overview of the volumetric fog and lighting options available with the Exponential Height Fog Component. (-> volumetric-fog-in-unreal-engine)

## Atmosphere, Cloud, and World Lighting Effects

The lighting components for Sky Atmosphere, Volumetric Clouds, Directional Lights, and Sky Light make up the majority of your enviornment lighting. These components all work seamlessly together dynamically lit large worlds possible.

[image: enviornment lighting components]

In your Levels, you can use the following components:

- Up to two Directional Lights for the sun and moon, two suns, or any combination.
- A single Sky Light with optional real-time capturing.
- A Sky Atmosphere with its own height fog.
- Volumetric Clouds with or without a sky dome mesh.

With **Real Time Capture** enabled on the Sky Light, use the keyboard shortcut **Right Ctrl + L** (first Directional Light) or **Right Ctrl + Right Shift + L** (second Directional Light) in combination with moving the mouse to change lighting dynamically and see the results instantly.

### Atmosphere, Clouds, and World Lighting Topics

- [image: Sky Atmosphere Component] Sky Atmosphere ComponentA physically-based sky and atmosphere rendering system with time-of-day features and ground-to-space view transitions featuring aerial perspective. (-> sky-atmosphere-component-in-unreal-engine)

- [image: Volumetric Cloud Component] Volumetric Cloud ComponentReal-time cloud rendering using volumetric materials. (-> volumetric-cloud-component-in-unreal-engine)

- [image: Directional Lights] Directional LightsThe basics of undestanding directional lights. (-> directional-lights-in-unreal-engine)

- [image: Sky Lights] Sky LightsThe basics of undestanding sky lighting. (-> sky-lights-in-unreal-engine)

- [image: Heterogeneous Volumes] Heterogeneous VolumesUse the Heterogeneous Volume component to render volume-domain materials that sample from Sparse Volume Textures. (-> heterogeneous-volumes-in-unreal-engine)

### Atmosphere, Clouds, and World Lighting Properties Reference

- [image: Sky Atmosphere Component Properties] Sky Atmosphere Component PropertiesSettings and property reference for the Sky Atmosphere Component. (-> sky-atmosphere-component-properties-in-unreal-engine)

- [image: Volumetric Cloud Component Properties] Volumetric Cloud Component PropertiesSettings and property reference for the Volumetric Clouds Component. (-> volumetric-cloud-component-properties-in-unreal-engine)

## Material and Sparse Volume Texture Assets

- [image: Sparse Volume Textures] Sparse Volume TexturesAn asset that stores baked simulation data representing volumetric media, such as smoke, fire, and water. (-> sparse-volume-textures-in-unreal-engine)

- [image: Volumetric Cloud Material] Volumetric Cloud MaterialThe default volumetric material used to create various types of cloud types, shapes, and effects. (-> volumetric-cloud-material-in-unreal-engine)

- environment
- rendering
- lighting
- fog
- clouds
- atmosphere
- sky

On this page

- Light Mixer (-> environmental-light-with-fog-clouds-sky-and-atmosphere-in-unreal-engine)
- Environment Light Mixer (-> environmental-light-with-fog-clouds-sky-and-atmosphere-in-unreal-engine)
- Fog Effects (-> environmental-light-with-fog-clouds-sky-and-atmosphere-in-unreal-engine)
- Fog Effects Topics (-> environmental-light-with-fog-clouds-sky-and-atmosphere-in-unreal-engine)
- Atmosphere, Cloud, and World Lighting Effects (-> environmental-light-with-fog-clouds-sky-and-atmosphere-in-unreal-engine)
- Atmosphere, Clouds, and World Lighting Topics (-> environmental-light-with-fog-clouds-sky-and-atmosphere-in-unreal-engine)
- Atmosphere, Clouds, and World Lighting Properties Reference (-> environmental-light-with-fog-clouds-sky-and-atmosphere-in-unreal-engine)
- Material and Sparse Volume Texture Assets (-> environmental-light-with-fog-clouds-sky-and-atmosphere-in-unreal-engine)
