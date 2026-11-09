# Crafting Mesh Terrain

https://dev.epicgames.com/documentation/en-us/unreal-engine/crafting-mesh-terrain-in-unreal-engine?application_version=5.9

> Learn how to craft your mesh terrain using modifiers, and the sculpt and paint tools.

[image: Crafting Mesh Terrain]

Learn to use this **Experimental** feature, but use caution when shipping with it.

## Level Requirements

You must use **Mesh Partition** in a **World Partition level**. When creating a new level make sure to select an **Open World level**.

[image: Mesh terrain level options]

## Create Mesh Partition Actor

To create the base of a mesh partition actor you have 3 options available:

- Create Rectangle
- Import Heightmap
- Convert Mesh

### Create Rectangle

The **Create Rectangle** tool establishes a flat grid as the base for your mesh partition, making it the approach most similar to creating a conventional landscape.

[image: Create Mesh Partition Rectangle settings]

| Setting | Description |
| --- | --- |
| Mesh |  |
| **Size** | Size in default units (cm). |
| **Resolution** | Number of quads created on each XY axis. |
| Sections |  |
| **Generation** | Automatic (based on max triangles)Explicit (based on Layout and Resolution) |
| **Max Triangles** | Maximum number of triangles allowed per section. This controls the automatic partitioning of the imported mesh into manageable sections. You can later combine and split these sections manually as desired using the Split and Merge tools. This is only available if the Sections Generation is set to Automatic. |
| **Layout** | Defines the number of sections on the X-Y axis. |
| **Resolution** | Defines a specific resolution for each section (the number of quads on the X-Y axis). |
| **Save and Unload** | When enabled, automatically unloads created base sections in the world partition when created. This is useful when creating a very large mesh partition that is difficult to load all at once. |
| Add |  |
| **Existing Mesh Partition** | Gives you the option to add the new rectangle grid to an existing mesh partition actor instead of creating a new one. |
| **New Mesh Partition Definition** | Select a mesh partition definition to assign to the newly created mesh partition. |

### Import Heightmap

The **Import Heightmap** tool gives you a way to create a grid deformed by a selected heightmap as your mesh partition base.

[image: Mesh Terrain Import Heightmap settings]

| Setting | Description |
| --- | --- |
| Heightmap |  |
| **Filename** | Browse to the desired heightmap file. |
| Mesh |  |
| **Resolution** | Number of quads created on each XY axis. |
| **Size** | Size in default units (cm). |

### Convert Mesh

**Convert Mesh** gives you a method to turn a static mesh actor into a mesh partition actor and split it into base sections.

[image: Mesh Terrain Convert Tool settings]

| Setting | Description |
| --- | --- |
| Split |  |
| **Number Of Sections Per Side** | This controls how many sections the mesh is split into. For example, a value of 3 means splitting the grid into 9 (3x3) sections. |
| Add |  |
| **Existing Mesh Partition** | If selected, the convert operation adds the new mesh to an existing mesh partition instead of creating a new one. |
| **New Mesh Partition Definition** | Select a mesh partition definition to assign to the newly created mesh partition. |

## Edit Mesh Partition Sections

When working with mesh partition sections, you can use the **Edit** tools to modify them in a variety of ways. You can modify the mesh itself, as follows:

- **Convert **existing meshes into mesh partition sections.
- **Expand **a mesh partition by adding sections at the edges.
- **Merge **two or more mesh partition sections into one.
- **Stitch **a static mesh into a mesh partition.
- **Split **an existing mesh partition section into custom sections using a brush tool.
- **Resection **one or more mesh partition sections by merging them then splitting them into even sections.

You can also modify or inspect other features of the mesh:

- **Edit Pivot** to modify the pivot point for the selected mesh.
- **Bake Transform** to bake in rotation and scale changes applied to the selected mesh.
- **Edit Attributes** such as normals and tangents for the selected mesh.
- **Inspect **to get detailed information about the selected mesh.

[image: Mesh Terrain Edit tools]

Be aware of the difference between a mesh partition preview section and a mesh partition section. Mesh partition preview sections are transient and only visible in the editor viewport. You must generate compiled sections to use them with PIE or cooked games.

Many of the Create and Edit tools available in Mesh Terrain mode are also available in Modeling mode under MeshPartition. Tools with the same name have the same functionality, but Mesh Terrain mode has additional tools and more comprehensive functionality.

### Convert

The **Convert** tool converts an existing mesh into a mesh partition section. To use it, select an existing mesh, then click the tool in the Edit menu. You are presented with the **Convert Tool** properties.

| Property | Definition |
| --- | --- |
| Split |  |
| **Layout** | Defines whether to split the converted mesh into sections along the X, Y, or Z axes, defined individually per axis. |
| Add |  |
| **Existing Mega Mesh** | Adds the converted mesh to an existing mesh partition. |
| New Mega Mesh Definition | Adds an existing mesh partition definition to the converted mesh. |

You can only choose one of the **Add** options for your converted mesh. They are mutually exclusive.

[image: Convert Tool properties]

When you are done configuring the properties, click **Accept** on the popup message to finalize the conversion.

[image: Convert accept or cancel popup]

### Expand

The **Expand **tool adds sections to the edge of an existing mesh partition. To use it, select an existing mesh partition section, then click the tool in the Edit menu. You are presented with the **Expand Tool** properties.

| Property | Description |
| --- | --- |
| Settings |  |
| **Corner Threshold Degrees** | Defines how sharp the angle must be to warrant corner placement. Lower values require sharper corners, so are more tolerant of curved boundary edges.The default value is 135 degrees. |
| **Min Span Size** | Defines the minimum span size when expanding the mesh.The default value is 1. |
| Expand Type | Determines which algorithm to use to expand the mesh. Options are:**Extrude**: Extrudes one or more topology edges simultaneously.**Mirror**: Mirrors the mesh across the selected edge or corner. |
| Extrude |  |
| **Num Steps** | The number of steps to expand outwards. |
| **Step Size** | The size of each outward step. |
| **Extrude Direction** | Defines the method for determining extrude direction. Options are:**Local Extrude Frames**: Each vertex extrudes along its local frame.**Single Direction**: All vertices extrude in the same direction. |
| **Adjust to Extrude Evenly** | When enabled, UE adjusts extrude direction so extruded edges parallel original edges. Enabled by default. Only available when Extrude Direction is set to Local Extrude Frames. |
| **Use Unselected for Frames** | When enabled, use unselected neighbors to set extruded frames. Disabled by default. Only available when Extrude Direction is set to Local Extrude Frames. |
| Mirror |  |
| **Should Mirror Corners** | Determines whether to mirror across topological corners as well as edges. Enabled by defaults. Only available when Expand Type is set to Mirror. |
| Visualization |  |
| **Render New Sections** | When enabled, UE renders potential new sections in different colors. Disabled by default. |

[image: Expand properties]

When you are done configuring the properties, click **Accept **on the popup message to finalize the expansion.

[image: Expand tool accept or cancel popup]

### Split

The **Split **tool splits an existing mesh partition section into custom sections using a brush tool to select the triangles to split out. To it, select an existing mesh partition section you want to split into two separate sections, then click the tool in the Edit menu. You are presented with the **Select Triangles** properties.

| Property | Description |
| --- | --- |
| Brush |  |
| **Size** | Defines the size of the brush relative to the mesh. |
| Brush - Advanced |  |
| **Specify Radius** | Enable to set a specific radius for the brush. Disabled by default. |
| **Radius** | Defines a specific radius for the brush. Only available when Specify Radius is enabled. |
| Mesh Element Visualization |  |
| **Visible** | When disabled, no mesh elements are visible. Enabled by default. |
| **Show [Mesh Element]** | There are seven different mesh elements you can show by enabling the associated property.Wireframe (disabled by default)BordersUV SeamsNormal SeamsTangent SeamsColor SeamsGroup Boundaries (disabled by default) |
| Mesh Element Visualization - Advanced |  |
| **Thickness Scale** | Multiplies the edge thickness by the value. The default is 1.0. |
| **[Mesh Element] Color** | There are seven different mesh elements whose color you can define using the associated property. For each property, you can either set specific RGBA values or use the UE Color Picker to select a color.WireframeBoundary EdgeUV SeamsNormal SeamsTangent SeamsColor SeamsGroup Boundaries |
| **Depth Bias** | Shifts the depth of the lines by the value. The default value is 0.2. |

[image: Select Triangles properties]

When you are done configuring the properties, use the brush to select triangles to split into a new mesh partition section.

[image: Paint triangles to split]

Click **Accept **on the confirmation pop-up message to finalize the triangle selection for the split.

[image: Select Triangles accept or cancel popup]

### Stitch

The **Stitch** tool adds a static mesh to a mesh partition section, creating a single combined mesh partition section. To use it, select a static mesh and a mesh partition section, then click the tool in the Edit menu. You are presented with the **Stitch Tool** properties.

| Property | Description |
| --- | --- |
| **FillHole** | Optional. Fills holes in the stitched static mesh. Throws an error message if there are no holes to fill when you attempt to use it. |
| **Weld** | Optional. Welds the static mesh and the mesh partition together if they have two edges touching. Throws an error message if there are no edges touching when you attempt to use it. |

[image: Stitch Tool properties]

Click **Accept **on the confirmation pop-up message to finalize stitching the static mesh to the mesh partition section.

[image: Stitch Tool accept or cancel popup]

### Merge

The **Merge **tool merges two or more existing mesh partition sections into one mesh partition section. To use it, select two or more existing mesh partition sections, then click the tool in the Edit menu. You are presented with the **Merge Tool** properties.

| Property | Description |
| --- | --- |
| **Weld Edges** | When enabled, the seams between merged sections are removed. Enabled by default.There's currently no use case for disabling this feature, so we recommend leaving it enabled. |

[image: Merge Tool properties]

Click **Accept **on the confirmation pop-up message to finalize the merge.

[image: Merge Tool accept or cancel popup]

### Resection

The **Resection **tool gives you a way to evenly separate one or more existing mesh partition sections, by first merging then splitting them into new mesh partition sections along whichever axes you designate. To use it, select one or more mesh partition sections, then click the tool in the Edit menu. You are presented with the **Mesh Partition Resection Tool** properties.

| Property | Description |
| --- | --- |
| **Weld Edges** | When enabled, the seams between merged sections are removed. Enabled by default.There's currently no use case for disabling this feature, so we recommend leaving it enabled. |
| **Layout** | Defines whether to split the resectioned mesh into sections along the X, Y, or Z axes, defined individually per axis. |

[image: Mesh Partition Resection Tool options]

Click **Accept **on the confirmation pop-up message to finalize the resection.

[image: Mesh Partition Resection Tool accept or cancel popup]

### Edit Pivot

The **Edit Pivot **tool gives you a way to modify a mesh partition's pivot point and associated transformation gizmos. To use it, select one or more mesh partition sections, then click the tool in the Edit menu. If you selected multiple meshes, the initial pivot point is the shared pivot for all selected meshes. You are presented with the **Edit Pivot** properties.

This tool modifies the selected static mesh asset, not just the mesh partition. If you don't want to modify the original asset, duplicate it in the Content Browser first.

| Property | Description |
| --- | --- |
| Options |  |
| **Apply to All LODs** | When enabled, changes to the pivot point also apply to all LOD meshes. Enabled by default. |
| Snap Dragging |  |
| **Snap Drag Position** | When enabled, you can use click-drag to reposition the pivot. Disabled by default. |
| **Snap Drag Rotation** | When enabled, you can use click-drag to reorient the pivot. Disabled by default. |
| **Rotation Mode** | Defines the rotation mode. Only available when Snap Drag Rotation is enabled. Options are:**Align**: Snap-drag aligns the pivot Z axis and target normals in the same direction.**Align Mirror**: Snap-drag aligns the pivot Z axis and target normals in opposite directions. |
| Box Positions |  |
| **Positions** | Click the associated button to select a new box position. Options are:CenterBottomTopLeftFrontBackWorldOrigin |
| **Use World Box** | When enabled, use the world-space bounding box for the target object, instead of the object-space bounding box. Disabled by default. |

[image: Edit Pivot properties]

When you are done editing the pivot point, click **Accept **to finalize the changes.

[image: Edit Pivot accept or cancel popup]

### Bake Transform

The **Bake Transform** tool gives you a way to make scale and rotation transformations permanent for meshes you select. To do so, select the mesh partition sections you transformed, then click the tool in the Edit menu. You are presented with the **Bake Transform** properties.

This tool modifies the selected static mesh asset, not just the mesh partition. If you don't want to modify the original asset, duplicate it in the Content Browser first.

| Property | Definition |
| --- | --- |
| Options |  |
| **Apply to All LODs** | When enabled, the baked transforms apply to all LODs. Has no effect on meshes that lack LODs. Enabled by default. |
| **Bake Rotation** | When enabled, rotation transforms are baked. Enabled by default. |
| **Bake Scale** | You can choose between three options for Bake Scale:**Bake Full Scale**: Bake all scale information, so the component has scale of 1 on all axes. (Default)**Bake Nonuniform Scale**: Bake all nonuniform scaling, so the component has uniform scaling on all axes.**Do Not Bake Scale**: Disables baking scale transforms. |
| **Recenter Pivot** | When enabled, recenters the pivot after baking the transform data. Disabled by default. |

[image: Bake Transform properties]

When you are done, click **Accept **to bake the transforms into the selected meshes.

[image: Bake Transform accept or cancel popup]

### Edit Attributes

The **Edit Attributes** tool gives you access to two features you can use to clean up your mesh partition sections. To do so, select one or more meshes whose attributes you want to edit, then select the tool in the Edit menu. You are presented with the **Edit Attributes** properties.

| Property | Description |
| --- | --- |
| Normals |  |
| **Reset Hard Normals** | Click this button to remove any hard edges or split normals, setting all normals to a single averaged vertex normal. |
| **Discard Tangents** | Click this button to clear tangents from the selected mesh. |

[image: Edit Attributes properties]

When you are done, click **Complete **to close the window.

[image: Edit Attributes complete popup]

### Inspect

The **Inspect **tool gives you granular control over the visibility of the mesh partitions, so you can show only the elements you want to see. You can also review read-only data about the selected mesh partition. To do so, click the tool in the Edit menu. You are shown the **Mesh Inspector** properties.

| Property | Definition |
| --- | --- |
| Options |  |
| Visibility toggles | Visibility toggle properties all function the same way. When enabled, the associated element is visible, when disabled, not visible. The following toggles are available:**Wireframe **(default enabled)**Boundary Edges** (default enabled)**Bowtie Vertices** (default enabled)**Polygon Borders** (default disabled)**UVSeams** (default disabled)**UVBowties** (default disabled)**Missing UV**s (default disabled)**Normal Seams** (default disabled)**Tangent Seams** (default disabled)**Normal Vectors** (default disabled)**Tangent Vectors** (default disabled)**Draw Hidden Edges and Seams** (default enabled) |
| **Show Indices** | Draws the mesh indices of the selected type. A maximum of 500 indices are drawn. Options are:**None **(default)**Vertex ID****Triangle ID****Group ID****Edge ID** |
| Options- Advanced |  |
| **Normal Length** | Defines the length of the line segments representing normal vectors. The default value is 5. Only available when Normal Vectors are enabled. |
| **Tangent Length** | Defines the length of the line segments representing tangent vectors. The default value is 5. Only available when Tangent Vectors are enabled. |
| PolyGroup Layer |  |
| **Active PolyGroup** | Select the PolyGroup layer used from a dropdown menu. If there are no PolyGroup layers, the only option available is **Default**. |
| Preview Material |  |
| **Material Mode** | Select the material used to render the mesh from a dropdown menu. Options are:**Original **(default)**Flat Shaded****Grey****Transparent****Tangent Normal****Vertex Color****Group Color****Checkerboard****Override** |
| Mesh Statistics |  |
| **Mesh** | Read only. Displays a count of triangles (T), vertices (V), and edges (E). |
| Mesh Statistics- Advanced |  |
| **UV** | Read only. Displays the UV0 channel. |
| **Attributes** | Read only, Displays the Normals channel. |
| Mesh Analysis |  |
| **Surface Area** | Read only. Displays the surface area of the selected mesh. |
| **Volume** | Read only. Displays the volume of the selected mesh. |

[image: Mesh Inspector properties, part 1]

[image: Mesh Inspector properties, part 2]

When you are done, click **Complete **to close the window.

[image: Mesh Inspector complete popup]

## Build Compiled Sections

Mesh partition preview sections are transient and only visible in the editor viewport. For gameplay use (for PIE or a cooked game), you must generate compiled sections. These are the true runtime representations of the mesh partition data.

To build a compiled mesh partition, proceed as follows:

- Create a mesh partition, then open the **Build** menu in the editor
- Click **Build Mesh Partitions**.
- Wait for the build to complete (this might take some time as it does more work than for preview sections).

## Assign a Mesh Partition Definition

As explained in the Mesh Partition Definition documentation (-> mesh-partition-definition-in-unreal-engine), a definition holds an important configuration setting for your mesh partition actor. Here is how to assign one to your actor:

- In your level, select your **mesh partition actor**.
- In the **Details** panel, find the **Mesh Partition Definition** setting, then assign your MPD_ asset from the Content Browser.

[image: Select a mesh partition definition]

## Using Mesh Terrain Modifiers

Now that you have a base mesh partition actor you can start to shape up your world. Open the **Mesh Terrain Mode** from the editor toolbar, then go to the **Modifiers **tab. There are a lot of different modifiers that you can use. Depending on the type of input you want to provide you can select a different modifier. Most of the modifiers move the vertices of the terrain based on an input.

- A texture modifier uses the values of the texture to displace the terrain.
- Splines, noise, sculpt, and mesh also use different inputs to displace the terrain.
- There are additional modifiers that alter the topology of the terrain, they can remesh or subdivide the terrain to provide additional resolution for finer detail.
- A boolean modifier adds or subtracts a section of the mesh and merges the triangles from the source.

You can combine the different methods in a variety of ways to achieve different terrain structures and optimize topology. Modifiers are added by a drag and drop from the toolbar.

### Modifier Basic Parameters

|  |  |
| --- | --- |
| Parameter | Description |
| Affected Mesh Partition | The affected mesh terrain is normally automatically set but you can adjust it if you want to disconnect a modifier or wish to reassign it to a different mesh terrain. |
| Priority Layer | The priority layer is the primary layer that impacts the build order. The layers are defined in the mesh partition definition. |
| Layer Sub-Priority | You can define a sub-priority if needed. For example, if two modifiers need to exist on a specific layer but you need one to build after another you can set the value to a higher number. |
| Projection Plane | The projection plane shows the primary plane size and orientation of the modifiers projection. |
| Local Bounds | Displays the local bounds in yellow (like a volume) of the modifier component. |
| World Bounds | The world bounds displays the complete world space bounds of the component; this can be helpful to see the area being evaluated for any particular modifier. |
| Disabled in Editor | Disabling the modifier in editor effectively turns the modifier off in the current session. It will be active in the build. |
| Disabled in Build | Disables the modifier both in editor and in build. |
| Base Growth | When the Mesh Partition builder builds modifiers, it initially only considers modifiers whose bounding boxes overlap the original base bounds (known as "bases") that contribute to that section. Base growth enables a modifier to conceptually "grow" the original base bounding box in a specified direction. This enables following modifiers to intersect the updated base bounds. |

#### Coverage and Extent

Just like the Modifier settings, there is a general set of coverage values that define the size and coverage area of the modifier. Modifiers can have slightly different options for coverage depending on the functionality.

[image: Modifier coverage settings]

[image: How coverage settings affect terrain modifiers]

### Adding Weight Channels

Most modifiers have the additional option to write data to weight channels. You can use weight channels defined in the mesh partition definition in the material setup for blending texture sets, other rendering attributes, or use them in PCG.

For example, here we show a Patch modifier writing into the Gravel weight channel defined in this specific mesh partition definition, and used by the mesh partition material to apply gravel texture on the terrain.

[image: Mesh terrain weight channels]

### Adjusting Priorities

The build priority is important to remember when crafting your terrain. The ability to layer different modifiers makes complex terrain development possible while maintaining flexibility for changes. The mesh partition definition defines a desired order that you can assign modifiers to. In addition to the **priority layers** you can also set a **sub-priority**. You can use the sub-priority to control the build order of all the modifiers set on a specific layer.

Understanding the build priority and layers can improve the development process by giving you a way to control how the world is built, meaning you can hide complex local details in a different layer from larger structural changes.

To understand priority layers, here's an egg-shaped Boolean modifier assigned to the first priority layer. Then we assigned a texture modifier using the Unreal Engine logo to a second priority layer. The order is important otherwise the texture modifier wouldn't have mesh partition geometry to affect.

 [image: Mesh terrain modifier priority levels example]

### Controlling Mesh Resolution

Mesh terrain is not constrained to uniform resolution. There are two major concepts to remember when setting up your mesh terrain.

- The number of sections. In general, you do not want the sections to be too large. Large sections mean that any change to a modifier can have a larger impact since the mesh terrain builder recalculates the entire section even if it is a small change.
- The resolution of the section. The resolution you define when you create or convert to mesh terrain is the base resolution you are working with. You can modify this resolution, and it does not have to be a uniform change in resolution, meaning you can easily change resolution locally to the point of interest that needs it.

You can change the resolution in a number of ways, either directly on the base mesh if desired or more often using modifiers.

You can control local resolution using the remesh modifier, or the spline remesh modifier. Both of those modifiers have the additional ability to switch between Remesh mode and Tessellate mode.In addition to modifying the resolution with modifiers, you can adjust the number of base sections by using either the section merge tool or split tool from the edit tab.

#### Remesh vs Tessellation

You can use the remesh modifier in either Remesh mode or Tesselate mode.

Remesh generates new uniform triangles, tesselate subdivides existing triangles.

In most cases, and depending on the settings, tesselate is faster and remesh is slower.

##### Remesh

Remesh creates new triangles uniformly, or non-uniformly if you use a density mask. **Target Edge Length** is the main parameter to adjust in Remesh mode. It also has an additional option to use a weight channel to control the remesh density.

[image: Mesh partition remesh mode settings]

 [image: Mesh partition remesh mode in action] Toggling a remesh modifier ON/OFF in Remesh mode.

##### Tesselate

[image: Mesh partition tesselate mode settings]

 [image: Mesh partition tesselate mode in action] Toggling a remesh modifier ON/OFF in Tesselate mode.

#### Texture Modifiers

Another way to control the mesh resolution is using a texture modifier that has an **Adaptative Tessellation** option.

[image: Mesh partition adaptive tesselation]

 [image: Mesh partition adaptive tesselation in action] Toggling adaptative tessellation ON/OFF on the texture modifier.

## Sculpting and Painting

The **Sculpt** modifier gives you a way to both sculpt and paint the mesh partition.

[image: Mesh terrain sculpt modifier]

Selecting a Sculpt modifier provides you access to use the Sculpt and Paint tab.

[image: Mesh terrain mode sculpt and paint tabs]

Here’s an example of using a sculpt brush with a Sculpt modifier selected.

Here’s an example of using a paint brush with a Sculpt modifier selected.

Sculpt modifiers also support having local mesh layers within the modifier itself, which you can use to organize your work.

[image: Mesh terrain local mesh layers for sculpting.]

#### Rendering Material Modes

Various material modes are available in the Sculpt and Paint tools.

|  |  |  |  |  |
| --- | --- | --- | --- | --- |
| Existing Material | Diffuse | Grey | Soft | Normal |
| [image: Existing material rendering material mode] | [image: Diffuse rendering material mode] | [image: Grey rendering material mode] | [image: Soft rendering material mode] | [image: Normal rendering material mode] |

[image: Mesh terrain rendering material mode settings] Custom Material Mode gives you a way to use your own material for sculpting or painting.

## Using Water Body Tools

Mesh terrain is compatible with the water system, but requires you to do a quick setup by adding a Mesh Partition component to the actor.

[image: Water body actors]

[image: Adding mesh terrain to a water body actor]

### Lake and River

When you use a **WaterBodyLake** or **WaterBodyRiver** actor, add a corresponding **LakeModifier** or **RiverModifier**, then configure the modifier component by assigning the **affected mesh partition** and setting a **priority layer**.

[image: Adding a water body modifier and selecting a priority layer]

### Water Body Terraforming

Find the terrain section in the Water Body component to configure the terraforming effect of your lakes and rivers.

Not all the terrain carving functionality from the water landscape integration has been translated yet.

[image: Water body mesh terrain settings]

### Weight Channels

e Water Body tools can also affect mesh partition weight channels in order to apply materials or other effects if needed.

When you select the Water Body component, you find a **Layer Weightmap** **Settings**
 section where you can add specific weight channels. Weight channels
need to be present in the mesh partition definition to be rendered.

[image: Water body weight channels]

[image: Water body weight channel settings]

#### Island

The regular Island Water Body tool is not needed for mesh partition. You can instead replace it with a regular spline modifier, as the Island doesn't affect the water itself, only the terrain.

Here is an example of how to set this up:

- Set a Lake Water Body on the Water priority layer (defined in this specific mesh partition definition) with a sub-priority of 1.
- Add a regular spline modifier to shape the island set on the same Water priority layer with a sub-priority of 2.

[image: Setting up an island water body for mesh partition]

#### Ocean

You don't need any specific setup for the Ocean Water Body tool, it does not require any mesh terrain modifier as you don't need it to affect the terraforming. The ocean spline is only used to crop the ocean water underneath the terrain.

|  |  |
| --- | --- |
| [image: Ocean water body] | [image: Ocean water body spline] |

## Creating Terrain Holes

To create holes on the terrain, you can use a **Boolean** **modifier **set to **Trim**.

[image: Mesh terrain Boolean modifier]

Proceed as follows:

- Drag and drop a **Boolean** modifier on your **mesh terrain**.
- Set **Mesh Source Mode** to **StaticMesh**.
- Select a StaticMesh from the Content Browser (for example, EditorSphere).
- Set **Boolean Op** to **Trim**.

[image: Mesh terrain create hole Boolean settings]

[image: Placing the static mesh for the create hole Boolean.]

If you get jagged triangles like in the image below, it is because these triangles are not fully within the modifier bounds.

[image: Mesh terrain Boolean triangle errors]

To fix this, increase the value of the **Expand Operator Bounds** setting. On vertical surface cases like this example, increasing only the Z axis is sufficient, as it is the longer vertically stretched triangles that are problematic.

[image: Mesh terrain expand operator setting]

[image: Mesh terrain create hole Boolean triangles error corrected]

## Blueprints and Mesh Terrain

You can build a wide variety of tools with Blueprints to work on mesh terrain.

[image: Mesh terrain Blueprint]

Above is a simple example of a dynamic mesh Blueprint using a spline and a Boolean modifier. In the Blueprint event graph, the spline is used to create a dynamic mesh, then that dynamic mesh is used by the Boolean modifier.

You can use this to create either tunnels or arches. For example:

|  |  |
| --- | --- |
| [image: Tunnel created using a mesh terrain Blueprint.] | [image: Arch created using a mesh terrain Blueprint.] |

- landscape
- mesh terrain

On this page

- Level Requirements (-> crafting-mesh-terrain-in-unreal-engine)
- Create Mesh Partition Actor (-> crafting-mesh-terrain-in-unreal-engine)
- Create Rectangle (-> crafting-mesh-terrain-in-unreal-engine)
- Import Heightmap (-> crafting-mesh-terrain-in-unreal-engine)
- Convert Mesh (-> crafting-mesh-terrain-in-unreal-engine)
- Edit Mesh Partition Sections (-> crafting-mesh-terrain-in-unreal-engine)
- Convert (-> crafting-mesh-terrain-in-unreal-engine)
- Expand (-> crafting-mesh-terrain-in-unreal-engine)
- Split (-> crafting-mesh-terrain-in-unreal-engine)
- Stitch (-> crafting-mesh-terrain-in-unreal-engine)
- Merge (-> crafting-mesh-terrain-in-unreal-engine)
- Resection (-> crafting-mesh-terrain-in-unreal-engine)
- Edit Pivot (-> crafting-mesh-terrain-in-unreal-engine)
- Bake Transform (-> crafting-mesh-terrain-in-unreal-engine)
- Edit Attributes (-> crafting-mesh-terrain-in-unreal-engine)
- Inspect (-> crafting-mesh-terrain-in-unreal-engine)
- Build Compiled Sections (-> crafting-mesh-terrain-in-unreal-engine)
- Assign a Mesh Partition Definition (-> crafting-mesh-terrain-in-unreal-engine)
- Using Mesh Terrain Modifiers (-> crafting-mesh-terrain-in-unreal-engine)
- Modifier Basic Parameters (-> crafting-mesh-terrain-in-unreal-engine)
- Coverage and Extent (-> crafting-mesh-terrain-in-unreal-engine)
- Adding Weight Channels (-> crafting-mesh-terrain-in-unreal-engine)
- Adjusting Priorities (-> crafting-mesh-terrain-in-unreal-engine)
- Controlling Mesh Resolution (-> crafting-mesh-terrain-in-unreal-engine)
- Remesh vs Tessellation (-> crafting-mesh-terrain-in-unreal-engine)
- Remesh (-> crafting-mesh-terrain-in-unreal-engine)
- Tesselate (-> crafting-mesh-terrain-in-unreal-engine)
- Texture Modifiers (-> crafting-mesh-terrain-in-unreal-engine)
- Sculpting and Painting (-> crafting-mesh-terrain-in-unreal-engine)
- Rendering Material Modes (-> crafting-mesh-terrain-in-unreal-engine)
- Using Water Body Tools (-> crafting-mesh-terrain-in-unreal-engine)
- Lake and River (-> crafting-mesh-terrain-in-unreal-engine)
- Water Body Terraforming (-> crafting-mesh-terrain-in-unreal-engine)
- Weight Channels (-> crafting-mesh-terrain-in-unreal-engine)
- Island (-> crafting-mesh-terrain-in-unreal-engine)
- Ocean (-> crafting-mesh-terrain-in-unreal-engine)
- Creating Terrain Holes (-> crafting-mesh-terrain-in-unreal-engine)
- Blueprints and Mesh Terrain (-> crafting-mesh-terrain-in-unreal-engine)
