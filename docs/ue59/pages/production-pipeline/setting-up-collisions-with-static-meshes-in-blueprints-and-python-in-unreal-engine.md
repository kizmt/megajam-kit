# Setting up Collisions with Static Meshes in Blueprints and Python

https://dev.epicgames.com/documentation/en-us/unreal-engine/setting-up-collisions-with-static-meshes-in-blueprints-and-python-in-unreal-engine?application_version=5.9

> Describes how to set up collision properties for a Static Mesh in the Unreal Editor using Blueprints or Python.

[image: Setting up Collisions with Static Meshes in Blueprints and Python]

In order to make a Static Mesh part of the physics simulation in a Level, you have to set it up with a **Collision Mesh**. This represents the bounds of the Static Mesh object within the physics simulation. The physics system uses this Collision Mesh whenever it needs to check whether other physical objects collide with your mesh, and whenever you conduct a high-performance raycast to test for collisions against your mesh. You could use the visible geometry of the Static Mesh as its Collision Mesh, but the visible geometry is typically far too detailed. Physical interactions do not usually need this high level of accuracy in order to provide realistic results. Therefore, you can improve the performance of the physics system by making your Collision Meshes as simple as possible.

You can create simplified collision representations for your Static Meshes automatically in the Static Mesh Editor:

Click image for full size.

For details, see Setting Up Collisions With Static Meshes (-> setting-up-collisions-with-static-meshes-in-unreal-engine).

In some cases, you may need to create these Collision Mesh representations programmatically, instead of doing it by hand in the Static Mesh Editor. For example, if you need to set up a large number of Static Mesh objects in the same Project, it may not be feasible to open each one in turn. Or, you may want to carry out the collision setup as one step in a larger automated pipeline for importing and managing content.

The following sections illustrate how you can use Blueprints and Python to apply the different types of Collision Meshes shown above to your Static Mesh Assets automatically in the Unreal Editor.

You can't yet use Blueprint or Python to import another Static Mesh and use it as a custom Collision Mesh. To do this, you have to either:

- Use the Static Mesh Editor user interface to import the Collision Mesh from a supported file format.

- Import the Collision Mesh at the same time as the visible Static Mesh, using a special naming convention to indicate that it represents the geometry you want to use for collision testing. For details, see FBX Static Mesh Pipeline (-> fbx-static-mesh-pipeline-in-unreal-engine), or Datasmith Overview (-> datasmith-plugins-overview).

Blueprints
 Python

You'll find the nodes you'll need to manage Static Mesh collisions under the **Editor Scripting > Static Mesh** category.

To use these nodes, your Blueprint class must be derived from an Editor-only class, such as the **PlacedEditorUtilityBase** class. For details, see Scripting the Editor using Blueprints (-> scripting-and-automating-the-unreal-editor).

Setting up collisions modifies the Static Mesh Asset. Assuming you want to keep the changes you make, you'll also need to use a node like **Save Asset** or **Save Loaded Asset** afterward.

You'll find most of the functions you'll need to manage Static Mesh collisions in the `unreal.EditorStaticMeshLibrary` class.

Setting up LODs modifies the Static Mesh Asset. Assuming you want to keep the changes you make, you'll also need to use a function like `unreal.EditorAssetLibrary.save_asset()` or `unreal.EditorAssetLibrary.save_loaded_asset()` afterward.

## Adding Simplified Collision Shapes

To add a new simplified collision shape to a Static Mesh, use the **Add Simple Collisions** node (you need to add **Static Mesh Editor Subsystem** as a target for this node to work). Use the **Shape Type** input to control what kind of collision shape you want to add. These options match the ones available in the **Collision** menu of the Static Mesh Editor:

Click image for full size.

To add a new simplified collision shape to a Static Mesh, use the `unreal.EditorStaticMeshLibrary.add_simple_collisions()` function. Pass it:

 The `unreal.StaticMesh` object you want to modify.
 An item from the `unreal.ScriptingCollisionShapeType` enumeration that indicates what type of collision primitive you want to create. These options match the ones available in the **Collision** menu of the Static Mesh Editor.

For example:

import unreal
 asset_path = "/Game/ArchVis/Mesh"
 def add_box_collision (static_mesh):
 # You could instead use .SPHERE, .CAPSULE, .NDOP10_X, .NDOP10_Y, .NDOP10_Z, .NDOP18, .NDOP26
 shape_type = unreal.ScriptingCollisionShapeType.BOX
 unreal.EditorStaticMeshLibrary.add_simple_collisions(static_mesh, shape_type)
 unreal.EditorAssetLibrary.save_loaded_asset(static_mesh)
 # get a list of all Assets in the path.
 all_assets = unreal.EditorAssetLibrary.list_assets(asset_path)
 # load them all into memory.
 all_assets_loaded = [unreal.EditorAssetLibrary.load_asset(a) for a in all_assets]
 # filter the list to include only Static Meshes.
 static_mesh_assets = unreal.EditorFilterLibrary.by_class(all_assets_loaded, unreal.StaticMesh)
 # run the function above on each Static Mesh in the list.
 list(map(add_box_collision, static_mesh_assets))

Note that this adds a new collision shape to whatever other simplified collision shapes already existed for the Static Mesh, if any. If you want to remove the existing collision shapes first, see Removing All Simple Collisions below.

Click image for full size.

## Auto-Generating Convex Collisions

To auto-generate a convex collision shape for a Static Mesh from its visible geometry, use the **Set Convex Decomposition Collisions** node (you need to add **Static Mesh Editor Subsystem** as a target for this node to work).

Click image for full size.

The inputs in this node exactly match the options you are asked to supply when you choose **Collisions > Auto Convex Collisions** in the Static Mesh Editor user interface. They control the complexity and fidelity of the generated Collision Meshes. In general, larger values lead to Collision Meshes that are closer to the visible geometry of the Static Mesh, but more expensive to simulate at runtime.

To auto-generate a convex collision shape for a Static Mesh from its visible geometry, use the `unreal.EditorStaticMeshLibrary.set_convex_decomposition_collisions()` function. Pass it:

 The `unreal.StaticMesh` object you want to modify.
 Three integers that define the maximum hull count, maximum number of vertices per hull, and hull precision. These parameters exactly match the options you are asked to supply when you choose **Collisions > Auto Convex Collisions** in the Static Mesh Editor user interface. They control the complexity and fidelity of the generated collision meshes. In general, larger values lead to collision meshes that are closer to the visible geometry of the Static Mesh, but more expensive to simulate at runtime.

For example:

import unreal
 asset_path = "/Game/ArchVis/Mesh"
 def set_convex_collision (static_mesh):
 unreal.EditorStaticMeshLibrary.set_convex_decomposition_collisions(static_mesh, 4, 12, 460000)
 unreal.EditorAssetLibrary.save_loaded_asset(static_mesh)
 # get a list of all Assets in the path.
 all_assets = unreal.EditorAssetLibrary.list_assets(asset_path)# load them all into memory.
 all_assets_loaded = [unreal.EditorAssetLibrary.load_asset(a) for a in all_assets]# filter the list to include only Static Meshes.
 static_mesh_assets = unreal.EditorFilterLibrary.by_class(all_assets_loaded, unreal.StaticMesh)# run the function above on each Static Mesh in the list.
 list(map(set_convex_collision, static_mesh_assets))

All existing Collision Meshes are automatically removed from the Static Mesh before the new mesh is generated.

Note that this method tends to produce less predictable and regular results than using a simplified collision primitive. It's best used on irregular meshes, or when you can tune the generation settings visually in order to make sure that the results you generate are simple enough and a good match for the visible geometry of your Static Mesh.

Click image for full size.

## Removing All Simple Collisions

You can clear all the Collision Meshes assigned to your Static Mesh using the **Remove Collisions** node (you need to add **Static Mesh Editor Subsystem** as a target for this node to work).

Click image for full size.

After this, the mesh will not be found by any "simple" physics collision tests, but will still be found by "detailed" tests that consider the visible geometry of the Static Mesh. See also Simple vs Complex Collision (-> simple-versus-complex-collision-in-unreal-engine).

You can clear all the Collision Meshes assigned to your Static Mesh using the `unreal.EditorStaticMeshLibrary.remove_collisions()` function.

For example:

import unreal
 asset_path = "/Game/ArchVis/Mesh"
 def remove_collisions (static_mesh):
 unreal.EditorStaticMeshLibrary.remove_collisions(static_mesh)
 unreal.EditorAssetLibrary.save_loaded_asset(static_mesh)
 # get a list of all Assets in the path.
 all_assets = unreal.EditorAssetLibrary.list_assets(asset_path)# load them all into memory.
 all_assets_loaded = [unreal.EditorAssetLibrary.load_asset(a) for a in all_assets]# filter the list to include only Static Meshes.
 static_mesh_assets = unreal.EditorFilterLibrary.by_class(all_assets_loaded, unreal.StaticMesh)# run the function above on each Static Mesh in the list.
 list(map(remove_collision, static_mesh_assets))

After this, the mesh will not be found by any "simple" physics collision tests, but will still be found by "detailed" tests that consider the visible geometry of the Static Mesh. See also Simple vs Complex Collision (-> simple-versus-complex-collision-in-unreal-engine).

## Using an LOD for Collisions

If you have already set up Levels of Detail (LODs) for your Static Mesh, you can use one of the less-detailed LODs as the Collision Mesh.

Call the `set_editor_property()` function on the `unreal.StaticMesh` object to set the `lod_for_collision` property to the index of the LOD you want to use. For example:

import unreal
 asset_path = "/Game/ArchVis/Mesh"
 def use_lod_for_collisions (static_mesh):
 static_mesh.set_editor_property("lod_for_collision", 3)
 unreal.EditorAssetLibrary.save_loaded_asset(static_mesh)
 # get a list of all Assets in the path.
 all_assets = unreal.EditorAssetLibrary.list_assets(asset_path)
 # load them all into memory.
 all_assets_loaded = [unreal.EditorAssetLibrary.load_asset(a) for a in all_assets]
 # filter the list to include only Static Meshes.
 static_mesh_assets = unreal.EditorFilterLibrary.by_class(all_assets_loaded, unreal.StaticMesh)
 # run the function above on each Static Mesh in the list.
 list(map(use_lod_for_collision, static_mesh_assets))

See also How To Set LOD Collision (-> creating-and-using-lods-in-unreal-engine).

You can't yet set up a custom Collision Mesh via Blueprint or Python. To import a custom mesh and use it for a Static Mesh's Collision Mesh in the physics simulation, you have to either:

- Use the Static Mesh Editor user interface to import the Collision Mesh from a supported file format.

- Import the Collision Mesh at the same time as the visible Static Mesh, using a special naming convention to indicate that it represents the geometry you want to use for collision testing. For details, see FBX Static Mesh Pipeline (-> fbx-static-mesh-pipeline-in-unreal-engine), or Datasmith Overview (-> datasmith-plugins-overview).

- editor
- blueprints
- python
- collision
- how-to
- physics
- scripting
- variant manager

On this page

- Adding Simplified Collision Shapes (-> setting-up-collisions-with-static-meshes-in-blueprints-and-python-in-unreal-engine)
- Auto-Generating Convex Collisions (-> setting-up-collisions-with-static-meshes-in-blueprints-and-python-in-unreal-engine)
- Removing All Simple Collisions (-> setting-up-collisions-with-static-meshes-in-blueprints-and-python-in-unreal-engine)
