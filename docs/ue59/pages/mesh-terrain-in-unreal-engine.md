# Mesh Terrain

https://dev.epicgames.com/documentation/en-us/unreal-engine/mesh-terrain-in-unreal-engine?application_version=5.9

> Explore the foundations of the Mesh Terrain experimental plugin.

[image: Mesh Terrain]

Learn to use this **Experimental** feature, but use caution when shipping with it.

## What is Mesh Terrain?

**Mesh Terrain** is a new experimental technology for developing larger, more feature-rich worlds. Since the terrain is not based on classic height field workflows like the existing landscape tools, you are free to make more complex terrain with overhangs, tunnels, sheer cliff walls, and any type of shape you can imagine.

In addition, you no longer need to keep the resolution uniform across the entire landscape. Important points of interest can have higher resolution for improved visuals or gameplay, while sparse distant landscapes can have very low resolution. Developing your terrain is based on non-destructive modifiers which means you can layer effects on top of each other without changing the base level. You can stack, duplicate, and transform modifiers, creating a more iterative development workflow.

### Terminology

|  |  |
| --- | --- |
| **Mesh Partition** | The system, actor, and geometry. |
| **Mesh Terrain** | Refers to the tooling and workflows. |
| **Base sections** | When you first create a mesh partition, you can split the base mesh into a number of sections. We refer to those as base sections. |
| **Compiled sections** | Compiled sections are for runtime only and are decoupled from the editor preview sections. |
| **Preview ******sections | Preview sections are for the editor only. It gives us the freedom we need to handle the data properly in-editor to reduce contention on revision control. |
| **Mesh Partition Definition** | A data asset file used to configure several aspects of the mesh partition. Acts as a recipe which defines how a mesh partition is constructed. |
| **Weight Channels** | Attributes that live on the mesh partition vertices and get baked to a texture 2D array for compiled sections. You can paint it manually using modifiers, or inject it with other modifiers or PCG. |
| **Modifiers** | Modifiers are actor components which can deform and alter the mesh partition geometry and weight channels. They can be attached to any actor in the scene. |
| **Priority Layers** | Layers used to control the writing order of Mesh Terrain modifiers. |

### Mesh Terrain Resources

- [image: Accessing Mesh Terrain] Accessing Mesh TerrainLearn how to set up your project to use Mesh Terrain, and access the features in the editor. (-> accessing-mesh-terrain-in-unreal-engine)
- [image: Crafting Mesh Terrain] Crafting Mesh TerrainLearn how to craft your mesh terrain using modifiers, and the sculpt and paint tools. (-> crafting-mesh-terrain-in-unreal-engine)
- [image: Mesh Partition Definition] Mesh Partition DefinitionAn overview of how to set up a mesh partition definition. (-> mesh-partition-definition-in-unreal-engine)
- [image: Mesh Terrain Material] Mesh Terrain MaterialAn overview of how to use mesh terrain material. (-> mesh-terrain-material-in-unreal-engine)
- [image: PCG and Mesh Terrain] PCG and Mesh TerrainAn overview of how to use PCG with mesh terrain. (-> pcg-and-mesh-terrain-in-unreal-engine)
- [image: Runtime Virtual Textures and Mesh Terrain] Runtime Virtual Textures and Mesh TerrainAn overview of using runtime virtual textures with mesh terrain. (-> runtime-virtual-textures-and-mesh-terrain-in-unreal-engine)

- landscape
- mesh terrain

On this page

- What is Mesh Terrain? (-> mesh-terrain-in-unreal-engine)
- Terminology (-> mesh-terrain-in-unreal-engine)
- Mesh Terrain Resources (-> mesh-terrain-in-unreal-engine)
