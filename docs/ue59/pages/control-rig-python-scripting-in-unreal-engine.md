# Python Scripting for Rigging with Control Rig

https://dev.epicgames.com/documentation/en-us/unreal-engine/control-rig-python-scripting-in-unreal-engine?application_version=5.9

> Extend and customize the Control Rig Rigging process using Python scripting.

Use Python scripting in Control Rig to automate workflows and create tools for the rigging process. You can also use the **Control Rig Python Log **to reverse-engineer commands and copy scripts to share to other projects.

This document provides an overview of Python scripting in Control Rig, the Control Rig Python Log, and a few scripting examples.

#### Prerequisites

- You have a Control Rig Asset open.

- You have some experience with Python scripting in Unreal Engine.

## Scripting Overview

Python is primarily used in Control Rig to interact with the Rig Graph, which consists of multiple modules:

| Module Name | Description |
| --- | --- |
| **ControlRig** | Contains the runtime for the rigs. |
| **ControlRigDeveloper** | Contains all of the functionality to make changes to rigs. |
| **ControlRigEditor** | Contains front-end and user-interface logic. |

The Control Rig Graph has been implemented using the **Model - View - Controller** design pattern. The model is the graph itself using the following terminology:

| Control Rig Python Terms | Description |
| --- | --- |
| **RigUnit** | A C++ struct defining a function for a rig (Example: FRigUnit_GetBoneTransform). |
| **Pin** | A single input or output of a function. |
| **Link** | A connection between two pins. |
| **Node** | A visual representation of a RigUnit. |
| **Graph** | A directed graph containing all nodes and links within a rig. |
| **PinPath** | A string describing the address of a pin within the graph (Example: NodeA.Translation.X). |
| **Controller** | An object used to make changes in the graph. |
| **RigElementKey** | Chosen from Bone, Control, Null, or Curve. |
| **Bone** | An element of the rig in the skeleton used for deformation. |
| **Control** | An element of the rig used for interaction. |
| **Null** | An element of the rig used for intermediate transforms. |
| **Curve** | An element of the rig used to store a float channel. |
| **Shape** | A visual representation of a Control in the Viewport. |
| **Hierarchy** | A container storing all Bones, Controls, Nulls, and Curves within the rig. |
| **HierarchyController** | Similar to the Controller, the HierarchyController is used to make changes to the hierarchy. |
| **Compiler** | An object to turn a Control Rig graph into a high performance runtime. |
| **VM** | The virtual machine runtime used to execute the rig. |
| **Constant** | A value that does not change at runtime. |
| **Parameter** | A value that can be used as an input to or output from the rig |
| **Variable** | A value that can be changed and runtime and is retained following executions of the rig. |
| **ControlRigBlueprint** | The asset containing the Graph, the Controller, Compiler and VM. |
| **Factory** | An object responsible for creating and importing new objects. This is used throughout the Unreal Editor to create assets. |

Python is enabled from the **Python Editor Script Plugin**, which itself is enabled by default in Unreal Engine. The plugin also automatically enables when the **Control Rig Plugin** is enabled, as it is a dependency.

### Accessing Control Rig

The first step when scripting is to access the main object you will be interacting with, in this case the **ControlRigBlueprint** object. There are several ways to access it, however your first command will usually be to load the ControlRigDeveloper module in order to make changes to Control Rig.

```
unreal.load_module('ControlRigDeveloper')
```

unreal.load_module('ControlRigDeveloper')

To access an existing rig, load the asset with the following example command:

```
rig = unreal.load_object(name = '/Game/ControlRig/Samples/Mannequin_ControlRig', outer = None)
```

rig = unreal.load_object(name = '/Game/ControlRig/Samples/Mannequin_ControlRig', outer = None)

You can also load any currently open Control Rig Asset using:

```
rigs = unreal.ControlRigBlueprint.get_currently_open_rig_blueprints()
```

rigs = unreal.ControlRigBlueprint.get_currently_open_rig_blueprints()

Creating a new Control Rig Asset is done using:

```
factory = unreal.ControlRigBlueprintFactory()
rig = factory.create_new_control_rig_asset(desired_package_path = '/Game/TestRig')
```

factory = unreal.ControlRigBlueprintFactory()
rig = factory.create_new_control_rig_asset(desired_package_path = '/Game/TestRig')

Lastly, you can create a Control Rig Asset based on a Skeleton or Skeletal Mesh with the following example code:

```
# load a skeletal mesh
mesh = unreal.load_object(name = '/Game/Mannequin/Character/Mesh/SK_Mannequin.SK_Mannequin', outer = None)

# create a control rig for the mesh
factory = unreal.ControlRigBlueprintFactory
rig = factory.create_control_rig_from_skeletal_mesh_or_skeleton(selected_object = mesh)
```

# load a skeletal mesh
mesh = unreal.load_object(name = '/Game/Mannequin/Character/Mesh/SK_Mannequin.SK_Mannequin', outer = None)

# create a control rig for the mesh
factory = unreal.ControlRigBlueprintFactory
rig = factory.create_control_rig_from_skeletal_mesh_or_skeleton(selected_object = mesh)

## Python Log

The **Python Log** provides a text log of all the actions that you performed within the Control Rig Editor. This includes actions within the viewport, the hierarchy, and the graph. Use this to reference commands to use in your Python scripts.

To access the log, click **Window > Message Log** from the main Control Rig menu, then select **Control Rig Python Log** from the Message Log sidebar.

 [image: control rig python log]

You can now perform actions in the Rig Graph and see them recorded in the log.

 [image: python log record actions]

If you want to save a command to share or use elsewhere, you can select any line from the log and press **Ctrl + C** to copy it, then you can paste in any text editor. You can also select multiple lines by holding **Shift**.

 [image: python log copy paste]

You can test commands by pasting them into the **Output Log** and executing them, ensuring the log type is set to Python. In this example, a new control is created.

 [image: python output log command]

### Python Context

Python context is used to contextualize which Control Rig asset should be affected when running Python commands. By default, no context is set when viewing a Control Rig. You can set the context for the current Control Rig by clicking **Run Python Context** within the **Class Settings** Details panel.

 [image: run python context]

This will execute a series of commands that bind the current Control Rig Asset to the Python context. This allows for commands copied from the Python Log to be pasted and executed within this Control Rig Asset.

 [image: run python context commands]

```
blueprint.get_controller_by_name('').set_node_selection([])
import unreal
blueprint = unreal.load_object(name = '/Game/ShowAndTell202009/Pretzel/Mannequin_FBIK_CtrlRig', outer = None)
library = blueprint.get_local_function_library()
library_controller = blueprint.get_controller(library)
hierarchy = blueprint.hierarchy
hierarchy_controller = hierarchy.get_controller()
```

blueprint.get_controller_by_name('').set_node_selection([])
import unreal
blueprint = unreal.load_object(name = '/Game/ShowAndTell202009/Pretzel/Mannequin_FBIK_CtrlRig', outer = None)
library = blueprint.get_local_function_library()
library_controller = blueprint.get_controller(library)
hierarchy = blueprint.hierarchy
hierarchy_controller = hierarchy.get_controller()

### Copy Python Script

You can also copy the entirety of a Control Rig's nodes, rig elements, and properties to your clipboard. This can then be pasted into an external script editor, or back to the Output Log to execute on another Control Rig. Copy Python Script is useful for sharing, debugging and comparing the logic between different rigs. Similar to copying individual commands, copying whole rigs can also be useful for reverse-engineering Python commands from Control Rigs.

To copy a Control Rig, click **Copy Python Script **within the **Class Settings** Details panel.

 [image: copy python script]

## Python Script Examples

### Adding Nodes

Since nodes are visual representations of **RigUnit **structs, you will need access to the unit in order to add a node to the graph.

```
unreal.load_module('ControlRigDeveloper')

# get an array of all available units
units = unreal.ControlRigBlueprint.get_available_rig_units()

# print details about the units
for unit in units:
      print(unit.get_path_name())
      print(unreal.EditorAssetLibrary.get_metadata_tag(unit, 'Keywords'))
```

unreal.load_module('ControlRigDeveloper')

# get an array of all available units
units = unreal.ControlRigBlueprint.get_available_rig_units()

# print details about the units
for unit in units:
 print(unit.get_path_name())
 print(unreal.EditorAssetLibrary.get_metadata_tag(unit, 'Keywords'))

Next, you will need to access the Controller. The Controller is the central object used to make changes to the graph.

```
controller = rig.get_controller()
```

controller = rig.get_controller()

To add a node to the graph you can use the `add_struct_node`, `add_comment_node`, `add_parameter_node` or `add_variable_node` functions. The example below focuses on the struct node, which is the most common type. A struct node is a visual representation of a RigUnit, therefore most of the nodes in a graph are struct nodes.

```
# get the unit - you might also get this by path or similar
unit = unreal.RigUnit_MathFloatAdd.static_struct()

# add the node to the graph provided the unit struct, the method (is always Execute) and 2D position in the graph
node = controller.add_unit_node(script_struct = unit, method_name = "Execute", position = unreal.Vector2D(0, 0))
```

# get the unit - you might also get this by path or similar
unit = unreal.RigUnit_MathFloatAdd.static_struct()

# add the node to the graph provided the unit struct, the method (is always Execute) and 2D position in the graph
node = controller.add_unit_node(script_struct = unit, method_name = "Execute", position = unreal.Vector2D(0, 0))

### Editing the Hierarchy

In addition to editing the graph, you can also edit the hierarchy using Python code. Each rig element in the Control Rig hierarchy is identified using **RigElementKey**, which contains the name and the type of the element. When you create or interact with elements in the hierarchy you will need to use this key.

Control Rig elements are structs, which means they are copied using their total values. As a result, if you change an element you may have to set it again in the hierarchy.

**Hierarchy **can be used to query elements, get or set global / local transforms, and reset elements back to their initial values.

**HierarchyController **can be used to add, remove and edit elements. You can also use it to rename and re-parent elements if needed.

To perform an inspection of the current hierarchy, you can use the following Python code:

```
# access the hierarchy object
hierarchy = rig.hierarchy

# get all element keys and print them
elements = hierarchy.get_all_keys()
for element in elements:
      print(element)
```

# access the hierarchy object
hierarchy = rig.hierarchy

# get all element keys and print them
elements = hierarchy.get_all_keys()
for element in elements:
 print(element)

To create a rig element, such as a bone, you can use the following code:

```
# access the hierarchy controller object
hierarchy_ctrlr = rig.get_hierarchy_controller()

# add a new bone
new_bone_key = hierarchy_ctrlr.add_bone(name = "MyBone", parent = unreal.RigElementKey(), transform = unreal.Transform())

# add a new child bone to a parent that is 10 units away on Z
child_transform = unreal.Transform(location = [0, 0, 10])

new_child_bone_key = hierarchy_ctrlr.add_bone(name = "ChildBone", parent = new_bone_key, transform = child_transform)
```

# access the hierarchy controller object
hierarchy_ctrlr = rig.get_hierarchy_controller()

# add a new bone
new_bone_key = hierarchy_ctrlr.add_bone(name = "MyBone", parent = unreal.RigElementKey(), transform = unreal.Transform())

# add a new child bone to a parent that is 10 units away on Z
child_transform = unreal.Transform(location = [0, 0, 10])

new_child_bone_key = hierarchy_ctrlr.add_bone(name = "ChildBone", parent = new_bone_key, transform = child_transform)

### Variable and Asset Manipulation

To create a Control Rig variable with getter and setter nodes, you can use the following code:

```
rig.add_member_variable("MyVariable", "Transform", is_public = True, is_read_only = False, default_value ="")

# Create variable getter node
controller.add_variable_node_from_object_path(MyVariable, 'FTransform', '/Script/CoreUObject.Transform', is_getter = True, default_value = '', position = unreal.Vector2D(), node_name = 'MyVariable_Getter')

# Create variable setter node
controller.add_variable_node_from_object_path(MyVariable, 'FTransform', '/Script/CoreUObject.Transform', is_getter = False, default_value = '', position = unreal.Vector2D(), node_name = 'MyVariable_Setter')
```

rig.add_member_variable("MyVariable", "Transform", is_public = True, is_read_only = False, default_value ="")

# Create variable getter node
controller.add_variable_node_from_object_path(MyVariable, 'FTransform', '/Script/CoreUObject.Transform', is_getter = True, default_value = '', position = unreal.Vector2D(), node_name = 'MyVariable_Getter')

# Create variable setter node
controller.add_variable_node_from_object_path(MyVariable, 'FTransform', '/Script/CoreUObject.Transform', is_getter = False, default_value = '', position = unreal.Vector2D(), node_name = 'MyVariable_Setter')

The preview mesh can also be changed using the following code:

```
# load a skeletal mesh
mesh = unreal.load_object(name = '/Game/Mannequin/Character/Mesh/SK_Mannequin.SK_Mannequin', outer = None)

# create a new (empty) asset
factory = unreal.ControlRigBlueprintFactory()
rig = factory.create_new_control_rig_asset(desired_package_path = '/Game/TestRig')

# set the preview mesh
rig.set_preview_mesh(preview_mesh = mesh)
```

# load a skeletal mesh
mesh = unreal.load_object(name = '/Game/Mannequin/Character/Mesh/SK_Mannequin.SK_Mannequin', outer = None)

# create a new (empty) asset
factory = unreal.ControlRigBlueprintFactory()
rig = factory.create_new_control_rig_asset(desired_package_path = '/Game/TestRig')

# set the preview mesh
rig.set_preview_mesh(preview_mesh = mesh)

The Control Rig can be compiled using any of the following code, depending on your context:

```
# force a recompile of the VM
rig.recompile_vm()

# compile the VM if there are pending changes
rig.recompile_vm_if_required()

# request a compilation if auto compile is enabled and the editor is open
rig.request_auto_vm_recompilation()

# request the control rig to run an init pass (initialize all units)
rig.request_control_rig_init()

# request the control rig to run a full blueprint compile
unreal.BlueprintEditorLibrary.compile_blueprint(rig)
```

# force a recompile of the VM
rig.recompile_vm()

# compile the VM if there are pending changes
rig.recompile_vm_if_required()

# request a compilation if auto compile is enabled and the editor is open
rig.request_auto_vm_recompilation()

# request the control rig to run an init pass (initialize all units)
rig.request_control_rig_init()

# request the control rig to run a full blueprint compile
unreal.BlueprintEditorLibrary.compile_blueprint(rig)

## Editor Startup

Python scripts can be loaded upon editor startup, which is useful for loading custom tools and built-in Python functions. You can locate this script and sample scripting functions from your project directory, under the following folder path:

```
Engine\Plugins\Animation\ControlRig\Content\Python
```

Engine\Plugins\Animation\ControlRig\Content\Python

Within this folder is the init_unreal.py script, which contains the following code:

```
import RigHierarchy.add_controls_for_selected
import RigHierarchy.add_null_above_selected
import RigHierarchy.align_items

RigHierarchy.add_controls_for_selected.run()
RigHierarchy.add_null_above_selected.run()
RigHierarchy.align_items.run()
```

import RigHierarchy.add_controls_for_selected
import RigHierarchy.add_null_above_selected
import RigHierarchy.align_items

RigHierarchy.add_controls_for_selected.run()
RigHierarchy.add_null_above_selected.run()
RigHierarchy.align_items.run()

 [image: init_unreal.py python custom command]

This code loads example scripts which enable extra functionality.

For example, **add_controls_for_selected** enables functionality for creating controls on selected bones with additional rules. These rules are determined by the custom Python script located in Engine\Plugins\Animation\ControlRig\Content\Python\RigHierarchy\add_controls_for_selected.py.

 [image: add controls for selected]

- animation
- python
- control rig
- scripting

On this page

- Prerequisites (-> control-rig-python-scripting-in-unreal-engine)
- Scripting Overview (-> control-rig-python-scripting-in-unreal-engine)
- Accessing Control Rig (-> control-rig-python-scripting-in-unreal-engine)
- Python Log (-> control-rig-python-scripting-in-unreal-engine)
- Python Context (-> control-rig-python-scripting-in-unreal-engine)
- Copy Python Script (-> control-rig-python-scripting-in-unreal-engine)
- Python Script Examples (-> control-rig-python-scripting-in-unreal-engine)
- Adding Nodes (-> control-rig-python-scripting-in-unreal-engine)
- Editing the Hierarchy (-> control-rig-python-scripting-in-unreal-engine)
- Variable and Asset Manipulation (-> control-rig-python-scripting-in-unreal-engine)
- Editor Startup (-> control-rig-python-scripting-in-unreal-engine)
