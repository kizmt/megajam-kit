# Sharing Data Between Vertex Color and Texture Color Painting Modes

https://dev.epicgames.com/documentation/en-us/unreal-engine/how-to-share-vertex-color-data-between-instances-in-unreal-engine?application_version=5.9

> This demonstrates how you can share color data between vertex and texture color modes.

There are situations when it’s useful to maintain both **Vertex Color** and **Texture Color** data on an instance of a painted mesh, like when one platform supports one mesh painting method but not another. For example, platforms with lower-end specifications may not support the virtual textures that are required to use texture color data. In this case, the platform running the project would need to use vertex color data.

To deploy your content to a range of platforms, you need a way to copy data between mesh painting modes supported by these platforms without needing to do the work twice.

To be able to have both vertex and texture color data with your project, you must:

- Copy existing color data between vertex color and texture color painting modes.

- Paint texture color data automatically to vertex color data.

In the following sections, both of these options are explained along with any further configuration needed.

## Copying Between Vertex Color and Texture Color

To transfer painted color data between the Vertex Color and Texture Color painting modes , you can use the From Texture and From Vertex tools.

To copy data between these tools:

- **Texture Color to Vertex Color Copying** To copy color data from the Texture Color’s Mesh Paint Texture to the vertex color of any selected mesh components, select the **Vertex Color** painting method in the Mesh Paint panel, and use the **From Texture** tool .

- **Vertex Color to Texture Color Copying** To copy color data from Vertex Color onto any selected mesh components, select the **Texture Color** painting method in Mesh Paint panel, and use the **From Vertex**. If there’s no existing Mesh Paint Texture for this mesh, one is created when the color data is copied over.

The **Paint** tool settings in each mesh paint mode has a **Color View Mode** under the **Visualization** category where you can select different color channels to inspect the color data. For more information on the color view mode and its visualization setting, see the “Visualization Settings” section of Mesh Paint Mode Tools and Settings (-> mesh-paint-tool-reference-in-unreal-engine)

Vertex Color Mode with RGB Channels selected.

You can switch between the Vertex Color and Texture Color modes to see the current color data of each. The examples below show the result of copied data between one another. Notice that there is a slight difference in the Texture Color mode’s copy of vertex color data due to texture interpolation instead of vertex interpolation.

|  |  |
| --- | --- |
|  |  |
| Vertex Color Mode after copying Texture Color Data | Texture Color Mode after copying Vertex Color Data |

For any Nanite-enabled mesh, per-instance vertex color cannot be visualized, even if it exists. To view this color data, you must temporarily disable Nanite in the editor. You can use one of the following ways to do this:

- Use the console command `r.Nanite 0`.

- On the mesh component, check the box for **Disallow Nanite** to force the component to use the fallback mesh when Nanite is enabled on the mesh.

## Painting to both Vertex Color and Texture Color

The Texture Color mode includes an option to automatically transfer the results of all painting to the Vertex Color mode when the Painting tool setting for **Propagate to Vertex Color** is enabled.

## Stripping Texture Colors From Your Cooked Build

For projects deploying to multiple platforms, you can disable features that you don’t need or that might not be supported. This can save package overhead by removing things like mesh paint textures from a cooked build. For example, if the platform doesn’t support Nanite meshes, you can use a console variable to disable mesh paint textures that are virtual textures per-platform using their device configuration files.

To disable mesh paint textures for a platform, add the following console variable to the platform engine configuration (*.ini) file in the “Console Variables” section:

r.MeshPaintVirtualTexture.Support False

## Setting up a Material for both Vertex Color and Texture Color

If your project is using both Vertex Color and Texture Color for painting a mesh, you can set up the mesh’s material to select between these two color data sets with some logic in the material graph.

Below is a simplified example showing the **MeshPaintTextureReplace** node handling the path for Vertex Color (top) with the Default path, and Texture Color (bottom) with MeshPaintTexture path. This example can be adapted to the requirements of the platforms you’re developing for:

To learn more about setting up materials for mesh painting, see these pages:

- Setting Up a Vertex Color Material for Mesh Painting (-> setting-up-a-vertex-color-material-for-mesh-painting-in-unreal-engine)

- Setting Up a Material and Mesh for Texture Color Painting (-> setting-up-a-material-and-mesh-for-texture-color-painting-in-unreal-engine)

- materials
- reference
- building virtual worlds
- mesh paint tool
- vertex color

On this page

- Copying Between Vertex Color and Texture Color (-> how-to-share-vertex-color-data-between-instances-in-unreal-engine)
- Painting to both Vertex Color and Texture Color (-> how-to-share-vertex-color-data-between-instances-in-unreal-engine)
- Stripping Texture Colors From Your Cooked Build (-> how-to-share-vertex-color-data-between-instances-in-unreal-engine)
- Setting up a Material for both Vertex Color and Texture Color (-> how-to-share-vertex-color-data-between-instances-in-unreal-engine)
