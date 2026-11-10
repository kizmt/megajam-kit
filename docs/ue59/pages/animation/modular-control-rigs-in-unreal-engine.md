# Modular Control Rigs

https://dev.epicgames.com/documentation/en-us/unreal-engine/modular-control-rigs-in-unreal-engine?application_version=5.9

> Use Modular Rigging tools to quickly rig characters in Unreal Engine.

[image: Modular Control Rigs]

Learn to use this **Experimental** feature, but use caution when shipping with it.

A **Modular Control Rig **is a digital animation rig in Unreal Engine that has been created by combining a series of pre-built Control Rig assets called **Modules**. A **Module **is a Control Rig component that represents a part of the character’s body, such as an Arm, Leg, or Spine, that can be used to automatically create a set of controls and rig the part of the body, enabling it to receive animation data. Modules can be **connected **together to form a complete animation rig for articulation to drive a skeleton.

This document will provide an overview of how to rig characters using the Modular Control Rig framework.

[image: ImageAltText]

Creating a Modular Control Rig, by combining a series of Models is called **Visual Rigging. **Visual Rigging allows you to build and connect Modules together entirely in the viewport utilizing the **Schematic Overlay**.

## Getting Started

Here you can read about how to get started rigging characters using the Modular Rigging framework.

#### Prerequisites

- You have a Skeletal Mesh character in your project. For the example workflow included in this document, the Mannequin character is used.
- Enable the **Control Rig Modules** Plugin. Navigate in the **Menu Bar** to **Edit > Plugins** and locate the **Control Rig Modules** plugin in the **Animation** section, or use the **Search Bar**. Enable the Plugin and restart the editor.

[image: ImageAltText]

This plugin is not required to use Modular Control Rigs in Unreal Engine, however it contains the pre configured Modules (-> modular-control-rigs-in-unreal-engine) that the included workflow example uses, and is recommended to get started using Modular Control Rigs. This plugin is designed to be optional and can be loaded and unloaded depending on your project’s needs.

### Preview Scene Settings

Before beginning to rig the mesh, you can adjust a few settings in the** Preview Scene Settings **panel in order to make the** Viewport** easier to navigate. It is recommended to set the following settings:

| Property | Recommended Setting |
| --- | --- |
| **Show Environment** | **Off** |
| **Show Floor** | **Off** |
| **Post Processing** > **Lens** > **Exposure** > **Metering Mode** | **Manual** |
| **Post Processing** > **Lens** > **Exposure** > **Exposure Compensation** | `11.0` |

### UI Overview

Here you can reference an overview of the Modular Control Rig Editor.

[image: ImageAltText]

- **Module Assets**: Here you will find the available Module assets that you can add to your Control Rig.
- **Viewport**: Here you can view your Mesh and Rig, along with the **Schematic Overlay Sockets**. These sockets indicate a point on the Mesh where a Module can be placed.
- **Details**: Here you can adjust settings for your rig.
- **Rig Hierarchy**: Here you can reference and edit the hierarchy of you
- **Module Hierarchy**: Here you can reference and edit the hierarchy of your Control Rig controls.

## Terminology

Here you can read about the different terminology used when rigging a Modular Control Rig.

### Module

A **Module **is a component of a Control Rig created by a Module Author that can be used within the Modular Control Rig framework.

Generally, Modules represent common parts of a character, such as an Arm, Leg, or Spine, although they are not limited to these concepts.

[image: ImageAltText]

### Connector

In order to build a full character rig, Modules need to be connected together using **Connectors. **A **Connector **is a relationship between two modules. Modules can have multiple connector points. These connector points are created by the **Module Authors **to direct how modules should connect to each other inside the Modular Control Rig.

[image: ImageAltText]

Connectors need to be **resolved **to a rig element for the module to operate correctly**.** Connectors are usually automatically resolved when adding Modules to your Modular Control Rig, however, you can manually assign these resolves in the Module Hierarchy panel, using the drop down associated with each Module and Module Component.

[image: ImageAltText]

### Sockets

**Sockets **are nodes that can be used to connect rig Modules together at specific locations with Connectors. For example connecting the shoulder of an arm to the chest location of the spine. A Connector will automatically **resolve **to a socket**. **A socket can resolve to the following types of hierarchy elements:

- **Bones**
- **Controls**
- **Nulls**

You will visually see if a Connector is resolved to a socket in the Editor’s Viewport. A Circle with a large gray circle within it will indicate a resolved Connector. A circle with a small gray dot within it will indicate an unresolved socket. If there are multiple Connectors resolved to the same socket, a number will be present indicating the number of Connectors resolved to the same socket.

| Socket | Description |
| --- | --- |
| [image: ImageAltText] | Socket is **unresolved** to a connector. |
| [image: ImageAltText] | Socket is **resolved** to a connector. |
| [image: ImageAltText] | Multiple connectors are **resolved** to this socket. |

[image: ImageAltText]

Connectors can have **rules,** meaning that they can only resolve to a specific type of socket. For example, some Connectors can only resolve to Bones or Sockets.

## Create your first Modular Rig

Here you can follow an example walk through about getting started with your

### Create a Modular Rig Asset

You can create a Modular Rig, using (**+**)** Add** in the **Content Browser** and selecting **Animation** > **Control Rig **> **Control Rig**.

When prompted, select the **ModularRig** option in the **Create Control Rig Blueprint** window and then select the **Create** button.

[image: ImageAltText]

You can now open the Control Rig Asset, by** double-clicking** it in the **Content Browser**. After opening the asset, select the Skeletal Mesh Character you want to rig using the **Preview Mesh** property’s drop down menu in the **Details** panel, or using the prompt in the bottom right corner of the Viewport.

[image: ImageAltText]

After defining your Character Mesh, you can **drag and drop** the **Spine** Module from the Module Assets panel onto the unresolved Socket in the Viewport.

After adding the Spine Module, more Connectors will appear that you can add additional Modules to. Next, **drag and drop** the **Neck** Module onto the unresolved Neck socket.

Then, **drag and drop** the a **Leg** Modules onto each of the available Leg sockets.

Then, **drag and drop** the Foot Modules onto each of the available Foot sockets.

Similar to the process of adding the Leg and Foot modules,** drag and drop** a **Shoulder **Module onto each of the Shoulder sockets, and then drag and drop an **Arm** Module onto each of the Arm sockets.

Finally, select each finger socket, and then drag and drop a Finger module onto one of the selected sockets to create multiple Modules at the same time.

### Mirroring

You can also mirror modules to make the process of creating a Modular Control Rig more efficient. To mirror a module, first select the Module or Modules you would like to mirror in the Module Hierarchy panel. Then right click the selection and use the **Mirror** property in the Context Menu. You can then define the property with which to mirror the selected modules, such as the **Mirror Axis**, the** Axis to Flip**, and a **search** and** replace** function for renaming the new Modules. The mirroring operation will attempt to rename Modules contextually based on the original Module’s name and location in the rig.

Sockets need to exist for the mirrored module connectors’ to resolve properly.

### Resolving Connectors

There will be times when a Module cannot automatically resolve the Connector and it needs to be resolved manually. A module that is not resolved will appear as an Unresolved Connector in the Viewport and have a red `none` definition in the Module Hierarchy panel. Connectors can be manually resolved using the following methods:

- Selecting an unresolved element in the Viewport and using the **Use Selected Arrow** button adjacent to the element in the Module Hierarchy panel will input that element to the Connector and may resolve the issue.
- In the Module Hierarchy panel, you can use the hierarchy drop down menu on the unresolved Connector in order to manually assign the bone or socket to be used as the resolve. This will respect the Connector rules and only show the type filtered by the rules.
- When a Module is added to the rig, the **Connector Event** included with the Module will execute automatically, thus trying to resolve all the connectors with the logic provided.

[image: ImageAltText]

You can also manually execute this function by **right clicking** on the unresolved Connector or Connectors in the **Module Hierarchy** panel and selecting the **Auto Resolve** option in the Context Menu**.
**

## Animate a Modular Control Rig

Modular Control Rigs work exactly the same as a regular Control Rig inside of Sequencer and the viewport. For more information about animation Control Rigs in Unreal Engine, see the following documentation:

%animating-characters-and-objects\ControlRig\Animating:topic%

You can drag and drop a Modular Control Rig asset directly into the level to start animating the character.

## Module Authoring

A **Module Author** creates the Modules that will be utilized by a Modular Control Rig. Unreal Engine’s Control Rig is the underlying framework for authoring modules so an understanding how to create Control Rig graphs is a prerequisite. For more information about Control Rigs in Unreal Engine, see the following documentation:

%animating-characters-and-objects\ControlRig:topic%

### Control Rig Modules Plugin

The Modular Control Rig system does not require the installation of the Control Rig Modules plugin, and is not required to start building and using Modular Control Rigs in Unreal Engine. However, in order to use the pre-configured Modules, you can optionally install the Control Rig Modules plugin to use, edit, or learn from. The plugin contains example custom Modules that you can use to build a Modular Control Rigs or to create your own custom Modules. This plugin is designed to be optional and can be loaded and unloaded depending on your project’s needs.

[image: ImageAltText]

#### Root Module

If you are creating and using custom Control Rig modules, you can set which Root Modules should be used when creating new Modular Control Rigs. The initial Root module can be changed inside the **Project Settings** using the **Default Root Module** setting in the **Control Rig** section**.** The default Root module asset is located in the Control Rig Plugin folder and should be **edited with caution**.

[image: ImageAltText]

It is recommended to use this Module as it exists. It is better to create a new Root Module to edit that resides in your project or with your asset.

## Creating your first Module

Here you can reference an example workflow of creating a custom Module for a Modular Control Rig.

### Create a New Module

- Create a new **Control Rig** asset in the Content Browser.
- Open up the Control Rig and convert it to a module by using **Switch to Rig Module**.

[image: ImageAltText]

[image: ImageAltText]

- Import a Skeletal Mesh. This will serve as a **template** for building your Module. There are prebuilt **templates** that can be used in the **ControlRigModules** plugin as shown below, or you can use your own.

Since the module will be referencing this asset, it should be as lightweight as possible.

- Set the following properties in the **Class Settings:**

| Property | Setting |
| --- | --- |
| **Name** | Set the Module name that will show in the Modular Rig editor. |
| **Type** | Set the kind of Module this is (default to Module). |
| **Icon** | Set a visual icon to show in the Modular Rig editor. You can select one of the provided icons using the drop down menu in the property.Packaged with the Control Rig Modules plugin is a series of prebuilt icons that you can use or modify for your new modules. You can find these assets located in the following file path: `…Engine > Plugins > Control Rig Modules Content > Modules > Icons`[image: ImageAltText] |
| **Category** | Here you can set a categorization value for the module. |
| **Keywords** | Keywords to describe the module. |
| **Description** | Here you can give a description of the Module that will appear in instances such as when you hover over the Module in the Editor. |

[image: ImageAltText]

### Creating Connectors

Rig Authors need to tell the Module how to connect to a Skeleton. This is accomplished by using **Connectors.** Connectors are responsible for returning hierarchy information such as bones and Controls. They act as a reference for these hierarchy elements so an Author can create a module that potentially works on many different skeletons that might have a different hierarchy structure or naming scheme.

There are two **types **of Connectors:

| Type | Description |
| --- | --- |
| **Primary** | Modules can only contain one Primary Connector. It is recommended that Primary Connector resolves to a socket on the Skeletal Mesh.When creating a Primary Connector you should consider the following:There can be only one Primary Connector per Module which is created automatically when a Control Rig asset is converted to a Module.The Primary Connector is the first connector to be resolved, and should resolve to a socket on the Skeletal Mesh.It is recommended to give the Primary Connector the Socket Type Rule. |
| **Secondary** | Modules can contain multiple Secondary Connectors. It is recommended that these Connectors resolve to Bones, Nulls, or Controls.When creating Secondary Connectors, you can think of them as any additional Connectors that need to be resolved for the Module to function for the purpose you are designing it. There can be multiple Secondary Connectors per module.It is recommended to give Secondary Connectors the Bones, Controls, or Nulls Type Rules, depending on how it is resolving to your Skeletal Mesh.If a Secondary Connector is Optional the connector does not have to resolve for the module to work properly. |

Connectors can contain **Rules. **These rules dictate what can resolve to that connector. Here you can reference a list of the available rules you can assign to a Connector, and a description of their functionality:

[image: ImageAltText]

| Rule | Description |
| --- | --- |
| And Rule | Resolved element must meet all rules set. |
| Child of Primary | Element exists under the hierarchy of the Primary Connector. |
| Or Rule | Resolved element must meet either of the rules set. |
| Tag Rule | Resolved element must be tagged with this tag. |
| Type Rule | Resolved element is of specified type. |

#### Connector Event

The Connector Event provides a way to build graph logic that will try to **Auto-Resolve** the Secondary Connectors in the Module upon creation during the drag and drop phase while rigging a Modular Asset.

[image: ImageAltText]

### Sockets

A **Socket **is defined in the Character’s Skeleton asset and is used to connect the Modules to the Skeletal Mesh. For example, an Arm Module can be set to connect to the Spine Socket, allowing the Spine to drive the Arm. Sockets are displayed visually in the Editor Viewport as a circle.

### Metadata

Modules can contain metadata on the module level that external modules can access. There are two Control Rig Nodes that utilize this metadata:

| Control Rig Node | Description |
| --- | --- |
| Get Module Metadata | Retrieve the specific metadata at the scope provided. |
| Set Module Metadata | Create new metadata at the scope provided. |

Metadata can be accessed at the Root, Parent, or current Module level. For example, metadata for storing the global size of the controls might live at the Root level, whereas the hand control created in the Arm Module might live in the parent metadata scope.

[image: ImageAltText]

### Pre and Post Forwards Solve

The **Pre Forwards Solve **allows rig logic to be executed before the Forwards solve is executed. The **Post Forwards Solve **allows rig logic to be executed after the Forwards solve is executed.

This is helpful for having a Module edit the rig logic of another Module that pre-existed, such as a Foot Module editing the Leg Module to create a Foot Roll setup.

[image: ImageAltText]

## Technical Appendix

Here you can reference additional technical information about using Modular Control Rigs in Unreal Engine.

### Execution Order

The Modular Control Rig contains references to its Modules. Each Module runs independently from the other Modules, but there’s a concrete order of execution. Modules are executed in the order in which they appear in the module tree, for example, root to leaf, or Spine > Leg > Foot. All modules are executed on the same thread sequentially, so it is not possible to multithread the Modular Control Rig Graph execution.

For example, the Construction event runs for all Modules, the Forwards solve runs for all modules, and so on.

[image: ImageAltText]

In future releases we may offer more control over how the order of Module execution is determined. Certain scenarios may require skipping a module temporarily, or running a Module twice. We may also offer to change the order of execution completely.

### Execution Stack

Modular Control Rigs do not use a VM (Virtual Machine) for itself, even though each module may use a VM. As a result of the execution stack, the Modular Rig is empty or not visible in the user interface.

In a future release we may add more functionality to allow the Modular Rig to use its own VM for advanced scenarios, at which point the execution stack may become visible again.

### Performance

Modular Control Rigs are currently more performance expensive than a single inlined Control Rig, the performance difference should be marginal though.

We expect the benefits of ease-of-use and speed of building a character rig to outweigh the performance hit. We’ll improve the performance in the future however, in order to close the gap and possibly even succeed to make the Modular Rig faster than a comparable inlined Control Rig. There are many potential performance improvements on the horizon to look forward to.

### API

The Modular Rig (`UModularRig`) is managed by its model (`FModularRigModel`), which contains the list of module references, resolved connectors, and variable bindings. Additionally we offer the controller (`UModularRigController`), which can be used to perform changes to the Modular Rig.

The Modular Rig is a special Control Rig, so it shares all of the Control Rig API, and adds its own additional API to it.

#### Python

In Python the model and controller can be accessed using the following scripts:

 C++

```
model = rig_blueprint.modular_rig_model

controller = rig_blueprint.get_modular_rig_controller()
```

model = rig_blueprint.modular_rig_model

controller = rig_blueprint.get_modular_rig_controller()

- experimental
- control rig

On this page

- Getting Started (-> modular-control-rigs-in-unreal-engine)
- Prerequisites (-> modular-control-rigs-in-unreal-engine)
- Preview Scene Settings (-> modular-control-rigs-in-unreal-engine)
- UI Overview (-> modular-control-rigs-in-unreal-engine)
- Terminology (-> modular-control-rigs-in-unreal-engine)
- Module (-> modular-control-rigs-in-unreal-engine)
- Connector (-> modular-control-rigs-in-unreal-engine)
- Sockets (-> modular-control-rigs-in-unreal-engine)
- Create your first Modular Rig (-> modular-control-rigs-in-unreal-engine)
- Create a Modular Rig Asset (-> modular-control-rigs-in-unreal-engine)
- Mirroring (-> modular-control-rigs-in-unreal-engine)
- Resolving Connectors (-> modular-control-rigs-in-unreal-engine)
- Animate a Modular Control Rig (-> modular-control-rigs-in-unreal-engine)
- Module Authoring (-> modular-control-rigs-in-unreal-engine)
- Control Rig Modules Plugin (-> modular-control-rigs-in-unreal-engine)
- Root Module (-> modular-control-rigs-in-unreal-engine)
- Creating your first Module (-> modular-control-rigs-in-unreal-engine)
- Create a New Module (-> modular-control-rigs-in-unreal-engine)
- Creating Connectors (-> modular-control-rigs-in-unreal-engine)
- Connector Event (-> modular-control-rigs-in-unreal-engine)
- Sockets (-> modular-control-rigs-in-unreal-engine)
- Metadata (-> modular-control-rigs-in-unreal-engine)
- Pre and Post Forwards Solve (-> modular-control-rigs-in-unreal-engine)
- Technical Appendix (-> modular-control-rigs-in-unreal-engine)
- Execution Order (-> modular-control-rigs-in-unreal-engine)
- Execution Stack (-> modular-control-rigs-in-unreal-engine)
- Performance (-> modular-control-rigs-in-unreal-engine)
- API (-> modular-control-rigs-in-unreal-engine)
- Python (-> modular-control-rigs-in-unreal-engine)
