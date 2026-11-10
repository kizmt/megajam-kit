# Skeleton Editing

https://dev.epicgames.com/documentation/en-us/unreal-engine/skeleton-editing-in-unreal-engine?application_version=5.9

> Create and edit skeleton assets using the Skeleton Editing tools.

You can use the Unreal Engine (UE) Skeleton Editing tools to edit and modify existing skeletons, and to perform actions such as renaming bones, editing the placement of bones, or changing the hierarchy of bones.

You can also create new Skeleton assets for any Static Mesh without the need to import an FBX file by using tools like Bone Creation and Skin Weight Painting. In conjunction with tools like Control Rig and Sequencer, you can use UE to Skin and Animate Characters entirely within the editor.

#### Prerequisites

- Enable the **Skeletal Mesh Editing Tools** Plugin (-> working-with-plugins-in-unreal-engine). Navigate in the **Menu Bar** to **Edit > Plugins** and locate **Skeletal Mesh Editing Tools **in the **Animation** section, or use the **Search Bar**. Enable the plugin and restart the editor.

- Your project contains a Static Mesh object that you can create a skeleton for, or a Skeletal Mesh character that you can edit for the skeleton asset.

## Create a Skeletal Mesh

**Right-click **any Static Mesh object in the **Content Browser** and select the **Convert to Skeletal Mesh** option in the context menu.

[image: ImageAltText]

After selecting the **Convert to Skeletal Mesh** option, a menu will appear allowing you to select an existing skeleton asset that will be bound to the Static Mesh, or you can select **Create New**, to create a new skeleton asset.

[image: ImageAltText]

When creating a new skeleton asset, a single `root` bone will be created at the origin point of the Static Mesh.

[image: ImageAltText]

## Editing a Skeleton Asset

After creating a new skeleton asset, or selecting an existing asset you wish to edit, open the skeleton in the Skeleton Editor. After opening the Editor, select the **Editing Tools** button in the **Toolbar **to begin editing the skeleton.

Here you can reference an overview of the tools and panels of the Skeleton Editor.

[image: ImageAltText]

- **Tools Panel**
- **Skeleton Tree**
- **Details/Asset Details/Preview**

### Create and Edit Bones

To start creating bones, select the **Skeleton **mode in the Tools Panel.

[image: ImageAltText]

Using the **Edit Skeleton **tool will let you place bones within the mesh in the viewport.

Activate the **Add** mode** **(**N**), then select a bone in the viewport and drag the new bone to the correct length and position on the character. The first selected bone will act as the parent to the new bone.

After creating any new bones, select **Accept** to confirm the new bone and its placement.

Use the **Axis Length** and the **Axis Thickness** to visualize what direction the new bones are pointing.

When enabled, **Update Children **property will move any bones parented to the selected bone when edited. This is useful for adjusting entire chains.

### Parenting Bones

Bones can be reparented in the Skeleton hierarchy, by selecting bones in the Skeleton Tree panel and dragging and dropping the bone to a new parent.

### Renaming Bones

Bones can be **Renamed **(**F2**) by right-clicking on the bone and selecting the **Rename Bone** option from the context menu.

[image: ImageAltText]

You can also bulk rename bones by multi-selecting a chain. Additionally, you can use a hashtag (**#**) operator at the end of the name to rename many bones using a successive numeral. For example you can multi-select a chain and rename the first bone to `tail_##1`, and after entering the change, the first bone would become `tail_001` with its successive bones becoming `tail_002`, `tail_003`, and so on.

### Edit Mode

You can edit existing bones in the skeleton by selecting the **Edit Mode**, using tools such as the Orient Bones (-> skeleton-editing-in-unreal-engine) and Mirror Bones (-> skeleton-editing-in-unreal-engine) tools.

[image: ImageAltText]

### Orient Bones

Bones need to point the correct direction so they rotate in a desirable manner. This is called **Bone Orientation**. To orient your bones, select the chain you want to orient and expand the Orient section.

You can reference a list of the bone orientation properties and a description of their function:

| Property | Description |
| --- | --- |
| **Primary** | Set the direction the bones will face, which is typically the **X**-axis. |
| **Secondary** | Set the axis that will represent the up direction of the bones. |
| **Use Plane as Secondary** | When enabled, this property will build a plane through the bones to help you orient. |
| **Secondary Target** | Set the position to use for the secondary axis. |
| **Orient Children** | When enabled, this property will orient all children below the selected bone. |

You can also manually orient bones by selecting the bone and using the Rotate Gizmo (**R**), or by explicitly specifying a transform value on each axis (**X**, **Y**, and **Z**).

### Mirror Bones

To expedite the skeleton creation process, you can use the Mirror Bones tool to mirror a bone chain in order to copy limbs or other mirrored bone structures. To mirror a bone chain, select the chain or bones you would like to mirror and use the **Mirror** button in the** Edit** mode.

You can reference a list of the mirrored bones properties and a description of their function:

| Property | Description |
| --- | --- |
| **Mirrox Axis** | Set the axis plane to mirror across. |
| **Mirror Rotation** | When enabled, the rotation across the plane will be inverted. This is typically necessary for animation. |
| **Left String** | Define the naming that will be used to search on the left side. |
| **Right String** | Define the naming that will be used to search on the right side |
| **Mirror Children** | When enabled, mirrored bones will also mirror all of their children within the selected bone chain. |

## Skin Weights

When adding new bones to your Skeletal Mesh, the **Bind Skin** tool will help you add **skin weights **for those bones to have an influence on the geometry of the mesh.** **

****Skin weights are values assigned to each vertex of the skeletal mesh's geometry that represent the influence a bone has to deform the vertex when the bone moves. Each vertex can be influenced by multiple bones in the skeleton.

As a user, you need to assign a weight to each vertex for each bone to tell it which bones it should be attached to. Each vertex contains a value from `0.0` to `1.0` for every bone, where a value of `0` means that vertex is completely unaffected by the bone and a value of `1` means that vertex is fully attached to the bone. Values between `0` and `1` allow a vertex to be partially affected by a bone.

It's not practical to set the skin weight for each vertex individually, so instead, painting skin weight maps provides a better solution to create elegant deformations on an entire character.

Skin weight values for each vertex are normalized, meaning the total weight on each vertex must equal `1`. This ensures that when the skeleton, as a whole, is translated, the vertices in the mesh move with it. If the total weight on a vertex were less than 1, the vertex movement would appear delayed from the skeleton's movement. Conversely, if the total value were greater than 1, the vertex would move more than the skeleton. For this reason, a total value of 1 is enforced by Unreal Engine by normalizing the Skin Weight values for each vertex of the mesh.

For example, if a vertex on the elbow has a value of `0.7` on the forearm bone, then the remaining `0.3` weight** **will be assigned to one or more other bones. In this case, it likely belongs to the upper arm.

When you edit a vertex weight, UE will automatically normalize the other weights to ensure that the total value is always equal to 1, which may result in UE automatically adjusting values of skin weights.

Where the vertex has only one influence, and only one bone with a weight greater than `0`, you cannot meaningfully modify the weight on that bone. Setting the weight to anything other than `1.0` will trigger the normalization procedure which will set the value back to `1.0`, regardless of the value you assign. Once a vertex has a non-zero weight assigned to multiple bones, the normalization procedure will dump extra weight onto the other influences as needed to achieve the weight set by the user.

Consider the previous example with a vertex with a weight of 0.7 on the forearm and 0.3 on the upper arm. If the user attempts to remove weight on the forearm, perhaps by setting it to a lower value of 0.6, then the normalization procedure will automatically change the upper arm value from 0.3 to 0.4, to maintain a total value of 1.

It is best to only explicitly add vertex weights, allowing the normalization procedure to remove weight as needed to achieve the desired value.

If you want a bone to have less influence, it is better to add additional weight to a different bone. This allows you to be explicit about where the influence belongs, rather than relying on normalization to split it evenly among the other influences.

### Binding Skin Weights

To begin painting skin weights, select the **Skin **mode in the **Tools **panel, then select the **Bind Skin** tool to set your asset baseline settings.

[image: ImageAltText]

You can reference a list of the Bind Skin tool properties and a description of their functionality:

| Property | Description |
| --- | --- |
| **Binding Type** | Select the method to use for binding. You can select from the following methods:**Direct Distance**: Uses straight-line distance between bones and vertices to bind vertices to their nearest bones.**Geodesic Voxel**: Uses the distance within a voxelized signed distance field to bind vertices to bones. |
| **Stiffness** | Set the stiffness of the binding. Lower values allow more distant bones to contribute to the bind. |
| **Max Influences** | Set the maximum number of bones that will influence each vertex. |
| **Voxel ResolutionVoxel Resolution** | When the **Binding Type** is set to **Geodesic Voxel**, you can use this property to set the resolution of the voxelized grid. High values can impact performance, but may help resolve finer details. |

### Paint Weights

Once you have a set of base weights, you can paint skin weight maps to set the area of the mesh each bone has influence over. To begin** **painting skin weight maps, select the **Edit Weights** button** **within the **Skin** mode.

[image: ImageAltText]

Select which tool you want to use to paint skin weight maps on your mesh. There are two Weight Editing modes:

- Brush (-> skeleton-editing-in-unreal-engine): Uses a paint brush tool to paint weights on the entire mesh. This mode is primarily used for painting weights on large areas, or simple structures.
- Vertices (-> skeleton-editing-in-unreal-engine): Uses a selection tool that you can use to select individual vertices to edit skin weights. This mode is primarily used for detailed weight editing and masking.

[image: ImageAltText]

#### Brush Mode

To begin painting weights using the **Brush **mode, select a bone from the hierarchy in the Skeleton Tree panel. This will display the weights assigned to that bone on the mesh.

[image: ImageAltText]

The Brush mode contains a set of brush **Operations **to help you edit weights:

| Operation | Description |
| --- | --- |
| **Add** | This mode is the default brush that will add weights to the current weight values until the maximum value of `1.0` is reached. |
| **Replace** | This mode replaces current weights, minus the strength value. |
| **Multiply** | This mode multiplies current weights by the strength value. |
| **Relax** | This mode applies the average of the connected vertex weights, by edges, to the current weights. This mode operates similarly to smoothing. |

You can also select from two **types **of brushes:

| Brush | Description |
| --- | --- |
| **Surface** | The Surface brush affects vertices proportional to the distance along the surface of the mesh, known as **Geodesic Distance**. This is useful when painting in tight spots with high curvature, like lips. The Surface brush will not affect the top lip when painting the bottom, or vice versa. |
| **Volume** | The Volumetric brush affects vertices proportional to the straight line distance from the brush center to the vertex. Regardless of connectivity or distance along the mesh. |

Each brush can also be modified with the following settings:

| Setting | Description |
| --- | --- |
| **Radius** | Set the size of the brush. |
| **Strength** | Set the strength of the brush that influences the result of the brush operations. |
| **Falloff** | Set the exponential falloff of the brush, or how the brush fluences point surrounding the center of the brush. |

After selecting your brush and mode, you can begin to paint the skin weight map for the selected bone by dragging the brush tool on the mesh in the viewport.

The **B **hotkey can be used to visually edit the **brush size** and **strength.**

Hold down **B** and **drag left and right** to edit the **Radius **of the brush.

[image: ImageAltText]

Hold down **B** and **drag up and down** to edit the **strength **of the brush.

When you are finished with your weight edits, hit **Accept **to finalize your new weights and exit the tool.

If you are not happy with the result, you can easily undo the modifications even after accepting the weights by using **CTRL + Z.**

#### Vertices Mode

Using the **Vertices **mode, you can select specific vertices you want to edit weights on using the **Marquee** selection tool.

You can reference a list of the Vertices Mode operations and a description of their functionality:

| Operation | Description |
| --- | --- |
| **Mirroring** | Mirrors the currently selected bones and vertice weights to the opposite side based on the **Mirror Plane** direction. |
| **Flood Weights** | Flood the selected weights using the **Brush Operations**. You can flood weights by selecting vertices and a bones and using the **Add** operation.If weights on a bone are flooded to `0.0`, or no weight, that bone's weights will be sent back to the root bone of the hierarchy. |
| **Prune Weights** | Weights below the given threshold value will be removed. This is particularly useful for improving performance. |

To smooth hard perimeters of weight maps, select vertices, a bone, and use the **Relax **operation.

### Mirror Weights

To expedite the skin weight painting workflow, you can mirror symmetrical structures, such as limbs or other mirrored structures, using the **Mirror **button. To mirror a structure, select the bone, bone chain, or vertices you want to mirror, then select the** Mirror** button in the **Tools** panel under the **Edit Weights** tab.

When using the Vertices mode, if no vertices are selected, the operations will run on all vertices affected by the selected bone. This can be useful for mirroring weights for the entire left side of a character to the right side.

### Paint Attribute Maps

**Attribute maps **are per-vertex weight maps that can be painted to send as data elsewhere in Unreal Engine, such as the Deformer Graph (-> deformer-graph-in-unreal-engine). To create a new attribute map to paint on, navigate to the **Edit Attributes **tab, give your map a new name, and execute **Add Weight Map Layer**.

[image: ImageAltText]

This new map will now display in the **Vertex Attributes **section under the **Attributes Inspector.**

After creating a new attribute map, you can paint the map by selecting the **Paint Maps **tab in the **Tool **panel. Choose the type map you want to paint under **Selected Attribute,** then begin painting the mesh by dragging the **Viewport**.

## Hotkey Reference

Reference a list of the available hotkeys for each of the Skeleton Creation modes.

### Weight Editing

| Hotkey | Description |
| --- | --- |
| **B** (Hold) (drag-left-right) | Change radius size of the brush. |
| **B** (Hold) (drag-up-down) | Change strength of the brush. |
| **Shift** | Relax the brush. |
| **Ctrl** | Invert the current brush. |
| **Middle-Mouse Click** (on a bone) | Visually select influence to paint. |
| **F** | Frame camera on selected vertices or bones. |

### Bone Editing

| Hotkey | Description |
| --- | --- |
| **N** | Create New Bone |
| **ESC** | Edit bone |
| **B** | Reparent |
| **Shift** + **P** | Disconnect (unparent) |
| **Delete** | Remove bone |

## Python API

Reference the Python API for the Skeleton Editing tools that you can use to write scripts to automate your workflow.

### Accessing Bones and Weights

 C++

```
mesh_path = "/Game/Characters/Mannequins/Meshes/SKM_Quinn_Simple"

asset_editor = unreal.EditorAssetLibrary()

skel_mesh = asset_editor.load_asset(mesh_path)
```

mesh_path = "/Game/Characters/Mannequins/Meshes/SKM_Quinn_Simple"

asset_editor = unreal.EditorAssetLibrary()

skel_mesh = asset_editor.load_asset(mesh_path)

### Load the Modifier Libraries

 C++

```
# load the weight modifier

weight_modifier = unreal.SkinWeightModifier()

# load the skeleton modifier

skeleton_modifier = unreal.SkeletonModifier()
```

# load the weight modifier

weight_modifier = unreal.SkinWeightModifier()

# load the skeleton modifier

skeleton_modifier = unreal.SkeletonModifier()

### Creating New Bones

 C++

```
# Create two bones, a and b

skeleton_modifier.set_skeletal_mesh(skel_mesh)

skeleton_modifier.add_bones(["a", "b"],["root", "root"], [unreal.Transform(), unreal.Transform()])
```

# Create two bones, a and b

skeleton_modifier.set_skeletal_mesh(skel_mesh)

skeleton_modifier.add_bones(["a", "b"],["root", "root"], [unreal.Transform(), unreal.Transform()])

### Parenting Bones

 C++

```
# Parent bone b to bone a

skeleton_modifier.parent_bone("b", "a")
```

# Parent bone b to bone a

skeleton_modifier.parent_bone("b", "a")

### Commit Changes

 C++

```
# Commit the changes

skeleton_modifier.commit_skeleton_to_skeletal_mesh()
```

# Commit the changes

skeleton_modifier.commit_skeleton_to_skeletal_mesh()

- animation
- skeletons
- skin weight

On this page

- Prerequisites (-> skeleton-editing-in-unreal-engine)
- Create a Skeletal Mesh (-> skeleton-editing-in-unreal-engine)
- Editing a Skeleton Asset (-> skeleton-editing-in-unreal-engine)
- Create and Edit Bones (-> skeleton-editing-in-unreal-engine)
- Parenting Bones (-> skeleton-editing-in-unreal-engine)
- Renaming Bones (-> skeleton-editing-in-unreal-engine)
- Edit Mode (-> skeleton-editing-in-unreal-engine)
- Orient Bones (-> skeleton-editing-in-unreal-engine)
- Mirror Bones (-> skeleton-editing-in-unreal-engine)
- Skin Weights (-> skeleton-editing-in-unreal-engine)
- Binding Skin Weights (-> skeleton-editing-in-unreal-engine)
- Paint Weights (-> skeleton-editing-in-unreal-engine)
- Brush Mode (-> skeleton-editing-in-unreal-engine)
- Vertices Mode (-> skeleton-editing-in-unreal-engine)
- Mirror Weights (-> skeleton-editing-in-unreal-engine)
- Paint Attribute Maps (-> skeleton-editing-in-unreal-engine)
- Hotkey Reference (-> skeleton-editing-in-unreal-engine)
- Weight Editing (-> skeleton-editing-in-unreal-engine)
- Bone Editing (-> skeleton-editing-in-unreal-engine)
- Python API (-> skeleton-editing-in-unreal-engine)
- Accessing Bones and Weights (-> skeleton-editing-in-unreal-engine)
- Load the Modifier Libraries (-> skeleton-editing-in-unreal-engine)
- Creating New Bones (-> skeleton-editing-in-unreal-engine)
- Parenting Bones (-> skeleton-editing-in-unreal-engine)
- Commit Changes (-> skeleton-editing-in-unreal-engine)
