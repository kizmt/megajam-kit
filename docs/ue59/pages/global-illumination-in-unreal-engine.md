# Global Illumination

https://dev.epicgames.com/documentation/en-us/unreal-engine/global-illumination-in-unreal-engine?application_version=5.9

> A collection of topics on the global illumination options available to choose from.

[image: Global Illumination]

**Global illumination** (sometimes referred to as indirect lighting and indirect illumination) simulates lighting interactions with geometry and material surfaces to add accurate lighting to scenes. Global illumination also takes into account absorption and reflectiveness of the materials in which it interacts.

Simulating the way in which light behaves in a 3D world is handled in one of two ways: using lighting that supports movement and interaction, or precomputed lighting that doesn't require scenes to be overly dynamic or interactive with lighting.

Unreal Engine provides multiple lighting paths to choose from for global illumination solutions, and often they are not exclusive to one another and can be seamlessly blended. For example, it is possible to have both dynamic lighting and baked lighting within the same scene.

For comparison, the list below highlights some of the benefits of choosing a precomputed or dynamic global illumination path for your project:

|  |  |
| --- | --- |
| Ideal for scenes where lighting doesn't need to change.Performance costs are relative to the memory required to load and store the lightmap textures.Quality and accuracy of results is set by the texture resolution of the lightmap texture being baked and applied to geometry.Supports Static Mesh and BSP geometry by default.Static Meshes require setting up a Lightmap UV to store lighting data.Can be used in combination with dynamic lighting. | Ideal for times where lighting needs to change, such as turning a light on or off, or a time-of-day system.Large, open-world environments present impractical requirements for baked lighting (even without a time-of-day system). Bake times, memory usage, texture storage and playback are considerable factors to use dynamic GI.Performance costs can be significantly more expensive to calculate in real-time depending on the method being used.Quality and accuracy is often traded with performance. Some Dynamic GI methods are limited by real-time usage.Supports all geometry types by default.Can be used in combination with precomputed lighting. |

## Precomputed Global Illumination

The light baking system in Unreal Engine computes lighting data on the CPU, or GPU, using the Lightmass Global Illumination system. This method of precomputing lighting is used to achieve high-quality results that aren't compromised by real-time limitations by storing the information in textures that are then applied to geometry. This method of lighting cannot be changed dynamically and is ideal for projects where lighting doesn't need to change, or for mobile projects where dynamic lighting is limited.

- **CPU-based Lightmass** uses the CPU with a separate program called Unreal Swarm (-> unreal-swarm-in-unreal-engine) to compute and generate lighting data. This method can use a single machine or distribute lighting data to build farms.
- **GPU-based Lightmass** uses your current machine's NVIDIA GPU which supports DirectX 12 and ray tracing to compute and generate lighting data.

### Precomputed Global Illumination Methods

- [image: CPU Lightmass Global Illumination] CPU Lightmass Global IlluminationA run down of all the features and settings of Lightmass. (-> cpu-lightmass-global-illumination-in-unreal-engine)

- [image: GPU Lightmass Global Illumination] GPU Lightmass Global IlluminationLearn about the GPU-based system for generating precomputed lighting data. (-> gpu-lightmass-global-illumination-in-unreal-engine)

### Precomputed Global Illumination Supporting Topics

- [image: Indirect Lighting Cache] Indirect Lighting CacheCached indirect lighting samples used for global illumination of dynamic objects and unbuilt scene preview. (-> indirect-lighting-cache-in-unreal-engine)

- [image: Volumetric Lightmaps] Volumetric LightmapsVolumetric lighting samples used for global illumination of dynamic objects and unbuild scene previews. (-> volumetric-lightmaps-in-unreal-engine)

- [image: Lightmass Portals] Lightmass PortalsHelp increase the quality of baked interior lighting. (-> lightmass-portals-in-unreal-engine)

- [image: Unreal Swarm] Unreal SwarmAn overview of Unreal Swarm, our task distribution system for computationally expensive applications, including Unreal Lightmass, the high-quality static global illumination solver. (-> unreal-swarm-in-unreal-engine)

- [image: Lightmass Basics] Lightmass BasicsHigh level introduction to Lightmass. (-> lightmass-basics-in-unreal-engine)

## Dynamic Global Illumination

The dynamic global illumination methods in Unreal Engine provide real-time scalable solutions for dynamic indirect lighting in your projects. This means being able to place, move, and light objects in the world without additional costs of baking lighting or having additional set up. Dynamic indirect lighting also means being able to accurately simulate time-of-day transitions or something as simple as turning a light on and off and having light bounce and reflect accurately.

[image: lumen-global-illumination]

- **Lumen** is a fully dynamic global illumination and reflection system that is designed for next-generation consoles. It is the default dynamic global illumination system and uses multiple ray tracing methods to solve global illumination and reflections at scale.

### Dynamic Global Illumination Topics

- [image: Lumen Global Illumination and Reflections] Lumen Global Illumination and ReflectionsTake a look at a high-level overview of Lumen's dynamic global illumination and reflections features. (-> lumen-global-illumination-and-reflections-in-unreal-engine)

- [image: Screen Space Global Illumination] Screen Space Global IlluminationAn overview of dynamic global illumination using a screen space effect. (-> screen-space-global-illumination-in-unreal-engine)

- [image: Hardware Ray Tracing] Hardware Ray TracingAn overview of the features that use hardware to render real-time ray traced results. (-> hardware-ray-tracing-in-unreal-engine)

- rendering
- lighting
- global illumination

On this page

- Precomputed Global Illumination (-> global-illumination-in-unreal-engine)
- Precomputed Global Illumination Methods (-> global-illumination-in-unreal-engine)
- Precomputed Global Illumination Supporting Topics (-> global-illumination-in-unreal-engine)
- Dynamic Global Illumination (-> global-illumination-in-unreal-engine)
- Dynamic Global Illumination Topics (-> global-illumination-in-unreal-engine)
