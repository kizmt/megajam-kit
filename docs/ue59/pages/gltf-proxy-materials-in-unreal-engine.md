# glTF Proxy Materials

https://dev.epicgames.com/documentation/en-us/unreal-engine/gltf-proxy-materials-in-unreal-engine?application_version=5.9

> How to pre-bake complex materials into runtime-friendly proxies

[image: glTF Proxy Materials]

**glTF proxy Materials** are baked versions of the Materials in your Unreal Engine Levels. They are optimized for glTF export, and most commonly used to export Materials at runtime. Because Material baking, and other techniques the glTF exporter relies on, are not possible at runtime, proxy materials are the only way to export a Material properly.

glTF proxy Materials are also useful for:

- **Previewing**: When you generate a proxy Material, you see exactly what your Unreal Engine Material looks like when you export it to glTF.

- **Performance**: Using glTF proxy materials speeds up glTF exports because the exporter no longer needs to do any Material baking, which is the most time-consuming part of the export process.

Some Unreal Engine Materials use mesh-specific data such as world position, vertex colors, and so on. The glTF exporter can bake Unreal Engine Materials with mesh-specific data, but it cannot create proxy materials with mesh-specific data. If you need to create proxies for Materials that use mesh-specific data, you must create a proxy with each mesh individually.

## Create a glTF Proxy Material

When you create a glTF proxy Material from an Unreal Engine Material, the proxy appears in a `GLTF` subfolder of the folder that contains the source Material. It has the same name as the source Material, prefixed with `MI_GLTF`.

To create a glTF proxy Material, do the following:

- In the **Content Browser**, right-click a Material.

- From the right-click menu, select **Create GLTF Proxy Material**.

When you create a proxy material, the glTF exporter automatically creates a reference to it in the Unreal Engine Material's **Asset User Data** array.

To see or modify the reference, do the following:

- In the **Content Browser**, select the Asset and edit it.

- In the **Details** panel, expand the **Asset User Data** section.

- Locate the **Asset User Data** row, and click **Add Element (+)**. A new **Index** row appears.

- From the dropdown list in the new Index row, select **GLTF Material Export Options**.

- Expand the **Index > General** section.

- In the **Proxy** settings, you can see or modify the reference to the glTF proxy Material.

- gltf
- gl transmission format
- import / export

On this page

- Create a glTF Proxy Material (-> gltf-proxy-materials-in-unreal-engine)
