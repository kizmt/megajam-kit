# Modeling Mode Overview

https://dev.epicgames.com/documentation/en-us/unreal-engine/modeling-mode-in-unreal-engine?application_version=5.9

> Learn the basics of the Modeling editor mode.

[image: Modeling Mode Overview]

Learn to use this **Beta** feature, but use caution when shipping with it.

The **Modeling** editor mode, also known as **Modeling Mode**, provides a toolset for creating, sculpting, and editing 3D geometry directly in Unreal Engine (UE). These tools offer workflows for topology edits, UV creation, multiple material assignments, collision editing, and texture baking.

This overview outlines:

- How to access the mode and its tools

- The core concepts behind the tools and their workflow

- The basics of working with the tools

Before using Modeling Mode, we recommend understanding the following topics:

- Asset (-> assets-and-content-packs-in-unreal-engine)

- Actor (-> actors-and-geometry-in-unreal-engine)

- Component (-> basic-components-in-unreal-engine)

- Level Editor (-> level-editor-in-unreal-engine)

## Accessing Modeling Mode

To access Modeling Mode, click the **Select Mode** dropdown and then click **Modeling**. Alternatively, press **SHIFT+5** to switch to this mode immediately. To learn more about the various modes, see Level Editor Mode (-> level-editor-modes-in-unreal-engine).

 [image: Accessing Modeling Mode]

If **Modeling** does not appear in the mode dropdown, ensure the editor is enabled in your Plugins.

**Edit** > **Plugins** > **Modeling Tools Editor Mode**

To learn more, see Working with Plugins (-> working-with-plugins-in-unreal-engine).

 [image: Modeling Editor Plugin]

When you click the mode, Modeling Mode's user interface (UI) appears with multiple panels to help streamline your workflow.

 [image: Mode Toolbar and Modeling panel in Modeling Mode]

| Number | **Panel** | **Description** |
| --- | --- | --- |
| 1 | **Tool Category ** | Categories organize a grouping of related tools. See Tool Categories (-> modeling-mode-in-unreal-engine) for more information. |
| 2 | **Tool Palette** | Consists of tools of the selected category. To learn more about all the available tools, see Modeling Tools (-> modeling-tools-in-unreal-engine). |
| 3 | **Tool Properties** | Settings related to the selected tool. |
| 4 | **Modeling Mode Quick Settings** | Access to common settings such as path location for assets, gizmo, element section, and new mesh objects. |

### Help Line

An additional panel with tooltips, such as hotkey commands, is available in the Bottom Toolbar (-> level-editor-toolbar-in-unreal-engine) of the **Level Editor** when using Modeling Mode.

Click image to expand.

## Understanding Key Concepts

Although many tools in Modeling Mode are similar to their counterparts in other modeling software, there are a few essential differences in how Modeling Mode structures mesh editing that you should know before you begin working with it.

### Terminology

The modeling tools are usable when working on various types of Unreal Engine (UE) actors, such as static meshes, dynamic meshes, or volumes. These are collectively referred to as "meshes" or "meshes", except when a tool is only usable for a specific actor type.

### Triangles and PolyGroups

Unreal Engine renders all models as triangulated meshes. In other words, when you import or create a mesh, its surface is automatically broken up into triangles (tris) regardless of whether they were already defined in a different environment. This conversion to triangles provides several guarantees:

- UE can't import or create a model that it can't render.

- UE's rendering is portable across all platforms, as all graphics drivers universally recognize triangles.

- UE does not need to spend time and resources resolving quadrilateral (quad) polygons and n-gons (polygons with more than 4 sides) into triangles at runtime.

In Modeling Mode, you can edit the triangles of your mesh using the **Triangle Edit** tool. This tool is one of the most low-level topology editing tools, based entirely on direct selection and editing of tris and vertices. Although Unreal Engine does not natively recognize quads or n-gons, it does support **PolyGroups**, which can mimic those features. PolyGroups are arbitrary collections of triangles that various tools in Modeling Mode can define. You can then manipulate these groupings for traditional box modeling with the PolyGroup Edit (-> polygroup-edit-tool-in-unreal-engine) tool, create UVs with the UV tools (-> uvs-category-in-unreal-engine), and more.

When creating a mesh using one of the primitive shapes in the **Create** category, you can configure the PolyGroups of your new mesh using the **PolyGroup Mode** setting.

 [image: Creating PolyGroups in Unreal Engine]

Additionally, you can assign PolyGroups with the following tools:

- **Tri Select** (Triangle Selection)

- **Generate PolyGroups**

- **Paint PolyGroups**

Click image to expand.

To learn more about creating and using PolyGroups, see Understanding PolyGroups (-> understanding-polygroups-in-unreal-engine).

### Tools, Undo History, and Accepting Changes

Most tools in Modeling Mode do not apply changes to meshes immediately. Instead, the tool previews the mesh with your changes in place, and the **Tool Confirmation** panel displays a **Cancel** and **Accept** button.

 [image: Accept and Cancel Buttons]

If you exit Modeling Mode or press **Cancel**, your changes are discarded, and the mesh reverts to what it looked like before you started editing it. When you press **Accept**, you exit the tool, and all changes you made to the mesh while using the tool are applied to the underlying mesh. Changes are also applied when you switch from an active tool session to another tool.

While using a tool, you can undo or redo individual changes. However, once you accept the changes, UE's undo history system only tracks the state of the mesh before and after the tool is active. For example, you can undo each brush stroke within the **Vertex Sculpt** tool. Once you click **Accept**, exiting the sculpt tool, you can only undo the combined result of all the brush strokes. Undo reverts your mesh to its state before you start the tool.

### Meshes, Assets, and Project Settings

The type of actor you choose to represent your mesh determines how Modeling Mode handles the creation and editing process. When creating a new mesh using the **Create** category, you use **Output Type** to select the desired actor. You can choose between the following actors as your target mesh:

- **Static Mesh:** Represents your model and is saved in the Content Browser. An instance of the mesh is placed in the level.

- **Dynamic Mesh:** Represents your model and is saved in the level only.

- **Volume:** Represents an area that triggers a behavior and is saved in the level only.

These types have various use cases and benefits. You can change the actor type of the current mesh using tools such as **Convert** and **Transfer**. Use the Project Settings (-> working-with-meshes-in-unreal-engine) to configure the creation and selection of meshes and the saving of assets.

To continue learning about how output types are handled and how to adjust settings for your workflow, see the Working with Meshes (-> working-with-meshes-in-unreal-engine) documentation.

## Using Modeling Mode

### Creating a Mesh

To create a new mesh, follow these steps:

- Open the **Create** category.

- Click any predefined primitive shape and move your mouse cursor into the **Viewport**. A template of the shape follows your cursor and snaps to the level grid.

- Click where you want to add the mesh in your level.

The editor creates the shape using the parameters you configured in the **Tool Properties** panel.

You can also create custom meshes using tools in the Create category. For example, you can use the **Extrude Polygon** tool to draw an outline for a mesh and then extrude it to create a 3D shape.

Several tools, such as **Extrude Polygon** and **Extrude Path**, use a grid to draw shapes. To control the position of the grid, **Ctrl + Click** your desired location.

### Editing a Mesh

Most of the other tools in Modeling Mode are built around editing an existing mesh in your game's world. For example, if you select **Triangle Edit** or **PolyGroup Edit** and then click a mesh, you can perform topological modeling operations.

Individual operations in the **Triangle Edit** and **PolyGroup Edit** tools, such as **Extrude**, **Push Pull**, or **Cut Faces**, appear in the Tool Properties panel. After you make your edits, click the **Accept** button to finalize your changes or click **Cancel** to discard them.

You can select any mesh in your world and edit it using these tools, including meshes that were not created in Modeling Mode. For example, you can use the Lattice (-> lattice-tool-in-unreal-engine) tool on a high-resolution mesh to quickly reshape it.

If you plan to edit a high-resolution model, we highly recommend duplicating the asset using the **Duplicate** tool to preserve the original mesh.

### Gizmo

Modeling Mode has a dedicated gizmo for unique and quick mesh transformations. By default, scale, rotate, and translate (move) are combined into one gizmo.

 [image: Modeling Gizmo]

To use an individual modeling gizmo consistent with the Level Editor's standard translation, rotation, and scale, follow these steps:

- Click the settings icon in **Modeling Mode Quick Settings**.

- Disable** Combined Gizmo**.

Click image to expand.

In addition to the modeling gizmo's structure, you can:

- Switch between relative and absolute grid snapping by toggling **World Grid Snapping**.

- Use the **Transform Panel** for numerical input for world space and local delta values.

The Transform Panel shows directly in the Viewport and is available for several modeling and UV tools.

 [image: Numerical Input]

#### Gizmo Hotkeys

You can use the gizmo hotkeys listed in the table for certain tools. Specific modeling tools have additional gizmo attributes, such as a repositionable grid for **Extrude Polygon**, **Extrude Path**, and the **Patten** tool. Use the **Help Line** to indicate when you can use these hotkeys.

| Hotkey | Description |
| --- | --- |
| **Ctrl Hold** | Aligns the selected gizmo transform to the scene. Excludes scale. |
| **Crtl + Click** | Repositions the gizmo grid to the hit normal. |
| **Shift + Crtl + Click** | Repositions the gizmo grid to the hit surface, keeping the current orientation. |
| **Middle Mouse + Translate** | Repositions the gizmo. |
| **Q** | Toggles orientation lock. Only active with the local coordinate system. |

### Mesh Element Selection

Modeling Mode provides the option for direct mesh element selection for a more consistent and optimized workflow. The **Mesh Element Selection** lets artists select a mesh, select the element, and then invoke an operation without using an intermediate tool such as **PolyGroup Edit** or **Triangle Edit**.

To enable the tool, follow these steps:

- Click the settings icon in **Modeling Mode Quick Settings**.

- Select **Mesh Element Selection**.

- Exit and re-enter **Modeling Mode**.

Additionally, when the setting is enabled, a **Select** category with tools for editing mesh selections becomes available.

### Custom Tool Presets

As you use the various tools in Modeling Mode, you may establish workflows that involve repetitive settings for specific tools. Instead of repeatedly entering these settings, you can use the **Presets** option when selecting a tool. With custom presets, you can save current tool settings, reload these settings in the future, and manage which collections of presets are active and enabled for a project or user.

 [image: Create Custom Preset]
 [image: Preset Manager]

## Tool Categories

| **Category** | **Description** |
| --- | --- |
| **Faves** | Top-level menu containing your favorite tools. Right-click any tool to add it to the Favorites category. |
| **Create** | Build new meshes from predefined primitives, paths, or splines. |
| **Select** | Edit element selections. **Mesh Element Select** must be enabled in the **Modeling Mode Quick Settings***. |
| **XForm** | Adjust the placement or representation of a mesh. |
| **Deform** | Sculpt or distort a mesh as a whole or in specific areas. |
| **Model** | Perform granular mesh editing. |
| **Mesh** | Processing tools for inspecting, optimizing, and editing a mesh's geometry. |
| **Voxel** | Convert a mesh into voxels to perform volumetric operations before converting it back into a mesh. |
| **Bake** | Generate textures and vertex color data for meshes. |
| **UVs** | Edit the UV coordinates of a mesh, changing how textures are mapped to the surface. |
| **Attributes** | Inspect and adjust the secondary properties of a mesh. |
| **Misc** | Additional utility tools such as managing LODs and volume conversion. |

To learn more about these categories and their specific tools, see Modeling Tools (-> modeling-tools-in-unreal-engine).

- animation
- landscape
- modeling
- geometry
- beta

On this page

- Accessing Modeling Mode (-> modeling-mode-in-unreal-engine)
- Help Line (-> modeling-mode-in-unreal-engine)
- Understanding Key Concepts (-> modeling-mode-in-unreal-engine)
- Terminology (-> modeling-mode-in-unreal-engine)
- Triangles and PolyGroups (-> modeling-mode-in-unreal-engine)
- Tools, Undo History, and Accepting Changes (-> modeling-mode-in-unreal-engine)
- Meshes, Assets, and Project Settings (-> modeling-mode-in-unreal-engine)
- Using Modeling Mode (-> modeling-mode-in-unreal-engine)
- Creating a Mesh (-> modeling-mode-in-unreal-engine)
- Editing a Mesh (-> modeling-mode-in-unreal-engine)
- Gizmo (-> modeling-mode-in-unreal-engine)
- Gizmo Hotkeys (-> modeling-mode-in-unreal-engine)
- Mesh Element Selection (-> modeling-mode-in-unreal-engine)
- Custom Tool Presets (-> modeling-mode-in-unreal-engine)
- Tool Categories (-> modeling-mode-in-unreal-engine)
