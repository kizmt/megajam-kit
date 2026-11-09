# Runtime Virtual Textures and Mesh Terrain

https://dev.epicgames.com/documentation/en-us/unreal-engine/runtime-virtual-textures-and-mesh-terrain-in-unreal-engine?application_version=5.9

> An overview of using runtime virtual textures with mesh terrain.

[image: Runtime Virtual Textures and Mesh Terrain]

Learn to use this **Experimental** feature, but use caution when shipping with it.

Setting up functional runtime virtual textures (RVT) on mesh terrain requires a few steps:

- Create RVT assets.
- Create RVT volumes in the level.
- Add a RVT transformer to the transformer pipelines assigned in the mesh partition definition.

## Create RVT assets

In the Content Browser, create your RVT assets for the mesh partition to use:

[image: Create RVT assets in the Content Browser]

## Create RVT Volumes

In your level, create RVT volumes.

[image: Create RVT volumes]

[image: RVT volumes in the outliner]

Link your RVT assets from the Content Browser to your RVT volume in the level:

[image: Link RVT assets to RVT volume]

#### Add RVT Transformer to the Transformer Pipelines

You need to add a RVT transformer for the transformer pipelines on your mesh partition definition.

That means adding it to transformer pipelines in both the Build and Preview settings.

[image: Add RVT transformers to the Build and Preview pipelines.]

Here’s an example of a Preview transformer pipeline which contains a RVT transformer. It has 3 elements to point to RVT assets in the content browser.

[image: RVT transformer in Preview transformer pipeline]

- landscape
- mesh terrain

On this page

- Create RVT assets (-> runtime-virtual-textures-and-mesh-terrain-in-unreal-engine)
- Create RVT Volumes (-> runtime-virtual-textures-and-mesh-terrain-in-unreal-engine)
- Add RVT Transformer to the Transformer Pipelines (-> runtime-virtual-textures-and-mesh-terrain-in-unreal-engine)
