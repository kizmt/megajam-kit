# Hybrid Non-Nanite and Nanite Content Workflows

https://dev.epicgames.com/documentation/en-us/unreal-engine/hybrid-nonnanite-and-nanite-content-workflows?application_version=5.9

> Workflows for projects using both Nanite and Non-Nanite content.

The following sections highlight workflows you can use in your Nanite-enabled projects that need to also support non-Nanite features and platforms without duplicating assets.

## Importing a High-Resolution Mesh for Nanite

You can import a high resolution mesh to be your Nanite representation for any existing non-Nanite static meshes through the Content Browser or the Static Mesh editor.

From the Content Browser, you can use the right-click context menu on a static mesh asset to select Level of Detail > High Res > Import High Res and navigate to the file you want to import.

Alternatively, you can use the Static Mesh editor to import a high resolution mesh using the Nanite Settings in the Details panel. Click Import and navigate to the file you want to import.

Using this workflow, the pre-existing static mesh and its level of detail (LOD) chain become the fallback mesh rather than having the import process automatically generate a fallback mesh from the Nanite geometry.

This workflow respects the Disallow Nanite setting on static mesh actors in your scenes and is explained more in the Static Mesh Component Option section below.

## Material Workflows

There are two ways you can improve your non-Nanite and Nanite workflows with materials:

- By using a node in the material graph to break up logic paths.
- By using an override material only used for rendering with Nanite.

### Nanite Pass Switch Node

The Nanite Pass Switch node gives you a way to define specialized behavior in a material graph when rendered with Nanite.

Use the Default input when rendering into non-Nanite passes, to handle the material as it would be normally. Use the Nanite input for any material logic you want to simplify or be specifically rendered to Nanite passes. For example, in cases where a material uses a feature not supported by Nanite, you can keep the same logic for the Default input and use a friendlier logic for the Nanite input.

### Nanite Override Material

The Nanite Override Material slot is available on materials and material instances. When you set an override material, any Nanite-enabled meshes that have the material or material instance assigned will use the referenced Nanite override material instead. This means that you can create materials specific to Nanite workflows rather than managing logic directly inside the material graph using the Nanite Pass Switch node.

In material instances, the Nanite Override Material slot is forcibly defaulted to None so that setting the override in a parent material will not cause it to automatically be inherited in any of the child instances of that material.

In the example below, the static mesh asset for the statue has Nanite enabled and it has a material instance applied. The material instance has its Nanite override material set with some simple color changes for demonstration purposes. The static mesh actor on the left displays the Nanite override material since the mesh is being rendered with Nanite. The static mesh actor on the right displays the same material until Disallow Nanite is set on the actor, disabling the Nanite override material to show the non-Nanite base material of the material instance.

## Static Mesh Component Option: Disallow Nanite

You can set when Nanite-enabled static meshes should use their Nanite representation using the Disallow Nanite setting on individual scene actors. This means you can have a mix of Nanite and non-Nanite actors which use the same static mesh asset.

The example below shows a single Nanite-enabled static mesh asset where the left is the Nanite mesh representation and the right has Disallow Nanite enabled.

## Landscape Terrain

You can enable Nanite on landscape actors. Nanite landscape meshes are rebuilt in the background to not disrupt user workflow while in the editor. Nanite landscape does not improve landscape resolution but does provide the user the leverage of Nanite runtime features such as GPU culling, automatic geometry streaming, and LODs. It generally boosts runtime performance, especially for demanding features such as VSM.

To learn how to enable and use Nanite with your landscape, see Using Nanite with Landscapes (-> using-nanite-with-landscapes-in-unreal-engine).

## Performance of Typical Content

For comparison purposes, the following GPU timings were taken from the Unreal Engine 5 technical demo Lumen in the Land of Nanite on a PlayStation 5:

- Average render resolution of 1400p temporally upsampled to 4K.
- ~2.5 milliseconds (ms) to cull and rasterize all Nanite meshes (which was nearly everything in this demo)Nearly all geometry used was a Nanite mesh
- Nearly no CPU cost since it is 100% GPU-driven

- ~2ms to evaluate materials for all Nanite meshesSmall CPU cost with 1 draw call per material present in the scene.

When considering these GPU times together, it's approximately 4.5ms combined for what would be equivalent to Unreal Engine 4's depth prepass plus the base pass. This makes Nanite well-suited for game projects targeting 60 FPS.

Numbers like these should be expected from content that doesn't suffer from the aforementioned performance pitfalls in previous sections. Very high instance counts and large numbers of unique materials can also cause increased costs and is an area of Nanite development that we are actively working on.

On this page

- Importing a High-Resolution Mesh for Nanite (-> hybrid-nonnanite-and-nanite-content-workflows)
- Material Workflows (-> hybrid-nonnanite-and-nanite-content-workflows)
- Nanite Pass Switch Node (-> hybrid-nonnanite-and-nanite-content-workflows)
- Nanite Override Material (-> hybrid-nonnanite-and-nanite-content-workflows)
- Static Mesh Component Option: Disallow Nanite (-> hybrid-nonnanite-and-nanite-content-workflows)
- Landscape Terrain (-> hybrid-nonnanite-and-nanite-content-workflows)
- Performance of Typical Content (-> hybrid-nonnanite-and-nanite-content-workflows)
