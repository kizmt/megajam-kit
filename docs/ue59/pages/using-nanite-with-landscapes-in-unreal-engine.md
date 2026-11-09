# Using Nanite with Landscapes

https://dev.epicgames.com/documentation/en-us/unreal-engine/using-nanite-with-landscapes-in-unreal-engine?application_version=5.9

> An overview of how to use Nanite virtualized geometry with the Landscape system.

[image: Using Nanite with Landscapes]

Nanite is Unreal Engine's virtualized geometry system. Nanite uses an internal mesh format and rendering technology to render pixel scale detail and high object counts. Nanite's compressed data format provides support for high detail meshes and fine-grained streaming with automatic level of detail.

You can use Nanite on your Landscape to improve performance with Nanite rendering, especially with regard to Virtual Shadow Maps. In-editor performance while the non-Nanite Landscape is in use is not representative of the runtime performance of the Nanite-enabled Landscape in your project until Nanite meshes are fully rebuilt. End users of your product should expect no visual improvement or downgrade since the source data is identical.

For more information on Nanite and its advantages, see Nanite Virtualized Geometry.

Sometimes, parts of your landscape may use standard rendering, or Nanite meshes might not be fully updated. This is expected behavior. To make such issues disappear, save or cook your project.

## Technical Considerations

Nanite Landscapes stream on top of the existing Landscape data streaming since both Nanite and non-Nanite data are necessary at runtime. Non-Nanite Landscape data is required for Runtime Virtual Textures, water rendering, and more.

This means twice the amount of data is streamed. One set of data for Nanite streaming and another set for texture streaming. Enabling Nanite causes both sets of data to reside in memory.

Hierarchical Level of Detail (HLOD) and Landscape proxy streaming behaves identically to non-Nanite Landscapes.

## Enable Nanite on a Landscape

To use Nanite with your Landscape terrain, follow these steps:

- Select your Landscape in the viewport.
- In the **Details** panel, check the box next to **Enable Nanite**.

[image: The Enable Nanite checkbox in the Details panel for a Landscape.]

## Build Nanite Mesh on a Landscape

After you've enabled Nanite on a Landscape, you can build the Nanite mesh representation from Landscape data in any of the following ways:

- In the Landscape's **Details** panel, go to the **Nanite** section, and click **B****uild Data**.If **Build Data** is disabled, you can click** Rebuild Data**. The **Build Data** button is disabled when the Nanite landscape mesh is up to date and currently being rendered in the viewport.

- In the **Build** menu, select **Build Landscape**.

The build time for the Landscape depends on the size of the Landscape and the number of tiles. When complete, you can view the Nanite geometry using the Nanite visualization modes.

If the viewport shows a warning message that says **Nanite meshes need to be rebuilt**, then the Nanite landscape is not up to date (for example, after a sculpt operation).

[image: The rebuild warning message in the viewport] The uncollapsed rebuild warning message in the viewport

[image: The collapsed nofication message in the viewport] The collapsed rebuild warning message in the viewport

When you rebuild the Nanite data or save the Landscape proxy mesh, the message disappears.

When Nanite landscape data is out of date, the editor will not render the landscape using Nanite, but the game will build the out-of-date landscape at cook time. This can negatively impact cook times, so keep landscape actors up to date and regularly save updated proxies.

## Nanite Skirts

Nanite Landscape relies on standard Nanite techniques for LODs and vertex decimation. The resulting mesh won't use a regular grid topology unless the camera gets very close to it, but will contain more vertices where necessary to retain shape. Because of this, the borders between Landscape Proxy Actors have vertices that might not be evenly distributed on each side of the border. At large distances this can introduce seam artifacts, which appear as tiny holes through the landscape. These are usually small enough to be corrected by temporal anti-aliasing.

You can use the Nanite Skirt enable option to avoid seams.This functionality expands the Nanite landscape mesh by an additional row/column of vertices at the edges of the mesh and move those new vertices down by an amount specified by the **Nanite Skirt Depth**:

[image: Enable Nanite Skirt] Enable the Nanite Skirt option on your Landscape in the Details panel.

This causes neighboring Nanite Landscape meshes to criss-cross each other and prevent seam artifacts from appearing.

## Nanite Tessellation

Like other Nanite static meshes, the landscape material can specify a displacement, which allows Nanite tessellation to work on the landscape. See Nanite Tessellation (-> nanite-virtualized-geometry-in-unreal-engine) for more information.

Nanite tessellation only works if the Nanite data is up to date, which means that one or more of the landscape proxies has been sculpted since the last time Nanite data was built for it. If a landscape proxy mesh is not up to date, then the tessellation effect will not be visible on that specific proxy in the editor, though it will be visible in the final build. To see the tessellation effect in the editor, rebuild the Nanite data or save the Landscape proxy mesh.

## Useful Console Commands

The following console variables are useful when you're working with Nanite-enabled Landscapes:

| Console Command | Description |
| --- | --- |
| **Landscape.RenderNanite** | Enables Nanite rendering for Landscapes.The default value is 1. |
| **Landscape.Nanite.LiveRebuildOnModification** | Triggers a rebuild of the Nanite representation whenever a modification is performed.This function is Experimental.The default value is 0. |
| **Landscape.Nanite.MultithreadedBuild** | Enables rebuilding of Nanite-enabled Landscape meshes using multiple processor threads to improve performance when working with several Landscape components.The default value is 1. |

When you're editing Nanite-enabled Landscapes, we recommend that you keep the live rebuilding of Nanite meshes toggled off (`Landscape.LiveRebuildNaniteOnModification 0`), as this might decrease performance significantly. Landscape rendering relies on non-Nanite Landscapes until the Nanite mesh is rebuilt and up-to-date. Unreal Engine uses that version for rendering until it is fully rebuilt, so the editing experience is identical to working with non-Nanite Landscape actors.

- landscape
- building virtual worlds
- open world

On this page

- Technical Considerations (-> using-nanite-with-landscapes-in-unreal-engine)
- Enable Nanite on a Landscape (-> using-nanite-with-landscapes-in-unreal-engine)
- Build Nanite Mesh on a Landscape (-> using-nanite-with-landscapes-in-unreal-engine)
- Nanite Skirts (-> using-nanite-with-landscapes-in-unreal-engine)
- Nanite Tessellation (-> using-nanite-with-landscapes-in-unreal-engine)
- Useful Console Commands (-> using-nanite-with-landscapes-in-unreal-engine)
