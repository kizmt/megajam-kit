# IK Rig Editor

https://dev.epicgames.com/documentation/en-us/unreal-engine/ik-rig-in-unreal-engine?application_version=5.9

> Create your custom IK Rig using goals, solvers, and settings.

[image: IK Rig Editor]

The **IK Rig editor** is where you set up IK Rigs and retargeting for characters. With it, you can create different Solvers, adjust Bone settings, and preview your results.

This page provides an overview of this editor and how to create IK Rig Assets.

#### Prerequisites

- IK Rigs require a Skeletal Mesh (-> skeletal-mesh-actors-in-unreal-engine) in your project.

## Create IK Rig

To start creating IK Rigs, you must create an **IK Rig Asset**. To do this, click **Add (+)** in the **Content Browser**, then select **Animation > IK Rig**. A dialog window will open where you select the Skeletal Mesh you want to create the IK Rig for.

[image: create ik rig]

After selecting the Skeletal Mesh, the IK Rig Asset will be created. Double-click it in the **Content Browser** to open it.

## Editor and Feature Overview

The IK Rig editor contains the following tools and options:

[image: ik rig editor]

- The **Reset **button, which resets IK Goals (-> ik-rig-in-unreal-engine) to their default position.
- **Hierarchy**, which displays your Bones, IK Goals, and settings.
- **Solver Stack**, which displays the IK Solvers (-> ik-rig-solvers-in-unreal-engine) being used on this Skeletal Mesh.
- **Viewport**, where you can select your Bones and manipulate IK Goals to preview the IK behavior.
- **IK Rig Output Log**, which displays debug information about your IK Rig. It displays warnings and errors indicating the current status of the rig.
- The **Details **panel displays properties for your selected item. **Preview Scene Settings** is where you can change the ambient viewport environment, such as lighting and background.
- The **Asset Browser** displays a list of Animation Sequences (-> animation-sequences-in-unreal-engine) that you can preview along with your IK behavior to test its effects. **IK Retargeting** is where you specify Bone chains for use with an IK Retargeter asset if you are retargeting this character using IK Rig.

### IK Goals

IK Goals are the manipulation and effector points for your IK chains, which you create in the IK Rig Editor. IK Goals are used in conjunction with Solvers (-> ik-rig-solvers-in-unreal-engine) to modify an incoming pose to reach the goal locations.

To create IK Goals, first select the ending Bones in the IK chain you want to create. Typically, these would be the hand or foot Bones if you are creating IK along the arms or legs.

[image: create ik goal]

Next, click **Add (+)** in the Hierarchy panel and select **New IK Goal**. If your IK Rig does not already have a Solver, then a dialog window will appear where you can select a Solver to associate with the new goal. For common IK setups, you can select **Limb IK**, then click **OK**.

[image: new ik goal]

You can also right-click Bones in the Hierarchy panel to access the **Add (+)** menu.

The goal and Solver-specific settings will now be created and be visible in the Viewport and Hierarchy.

[image: ik goal]

#### IK Goal Properties

When you select an IK Goal, you will see the following properties in the **Details **panel:

[image: ik goal details]

| Name | Description |
| --- | --- |
| **Goal Name** | The name of the IK Goal object. |
| **Bone Name** | The name of the end Bone that the IK Goal is acting as the effector for. |
| **Position Alpha** | Blends the final location of the IK Goal from the position of the Goal bone in the input pose (**0**) to the Goal's own position (**1**).[image: position alpha] |
| **Rotation Alpha** | Blends the final rotation of the IK Goal from the rotation of the Goal bone in the input pose (**0**) to the Goal's own rotation (**1**).[image: rotation alpha] |
| **Preview Mode** | Previews (in editor only) the goal in either **Additive** or **Absolute** modes. **Additive** is used when you want to ensure the IK behavior is relative to any incoming animation, whereas **Absolute** overwrites any incoming animation along the chain. Additive goal behavior can be achieved at runtime by setting your goals to **Manual Input** and **Additive** on the IK Rig Anim Graph node (-> ik-rig-in-animation-blueprints-in-unreal-engine).[image: preview mode] |
| **Transforms** | Contains the current transform information for the selected IK Goal. |
| **Size Multiplier** | Multiplies the size of the IK Goal relative to its base size from the viewport settings (-> ik-rig-in-unreal-engine). Increase this if you have larger, non-human characters.[image: size multiplier] |
| **Thickness Multiplier** | Multiplies the line thickness of the IK Goal relative to its base thickness from the viewport settings (-> ik-rig-in-unreal-engine) You may want to increase this if you have increased the **Size Multiplier**.[image: thickness multiplier] |
| **Expose Position** | Exposes position pins on the IK Rig Animation Blueprint Node (-> ik-rig-in-animation-blueprints-in-unreal-engine) in order to affect the position of the IK Goal in Animation Blueprints (-> animation-blueprints-in-unreal-engine). |
| **Expose Rotation** | Exposes rotation pins on the IK Rig Animation Blueprint Node (-> ik-rig-in-animation-blueprints-in-unreal-engine) in order to affect the rotation of the IK Goal in Animation Blueprints (-> animation-blueprints-in-unreal-engine). |

### Solvers

Different IK behaviors can be added to your IK Rig, which are called **Solvers**. Using Solvers, you can create a wide variety of IK effects, from simple three-bone chains to full-body multi-limb IK systems.

Visit the Solvers (-> ik-rig-solvers-in-unreal-engine) page to learn more about the different Solvers you can add, and how to use them in your IK Rigs.

%animating-characters-and-objects/SkeletalMeshAnimation/AssetsFeatures/IKRig/IKEditor/IKSolvers:Role%

### Viewport Settings

When nothing is selected in the IK Rig editor, the **Details** panel will display the following Viewport settings:

[image: ik rig viewport settings]

| Name | Description |
| --- | --- |
| **Preview Skeletal Mesh** | The Skeletal Mesh to run the IK solve on. You can change the assigned Skeletal Mesh here and the IK Rig system will attempt to run on the replacement. If the new Skeletal Mesh contains incompatible bone names or hierarchies, then the IK Rig will not function. You can reference the **IK Rig Output Log** for more information on any incompatibilities. |
| **Draw Goals** | Shows or hides IK Goals (-> ik-rig-in-unreal-engine) in the viewport. |
| **Goal Size** | The base size of IK Goals. |
| **Goal Thickness** | The base thickness of IK Goals. |

## IK Rig Example Setup

A common use-case for IK in Unreal Engine is to control foot alignment to uneven terrain, which requires manipulating the feet and hips of a character. The example below will walk you through setting up this IK Rig system for a humanoid character.

### Create Solvers

Start by creating a new Solver. To do this, click **Add New Solver** in the Solver Stack panel, then add the following Solvers:

- **Set Transform**.
- **Limb IK**.
- **Limb IK** again.

[image: add new solver]

The order in which you add the Solvers matters, because Solvers execute in sequence according to the number displayed next to their name. For this IK system, Limb IK should evaluate last.

You can drag Solvers within the Solver stack to change their order if needed.

[image: change solver order]

### Create Goals

Due to the Solver types being used for this IK system, you will need to create IK Goals (-> ik-rig-in-unreal-engine) for each Solver. To do this, select the pelvis and feet bones, right-click them, and select **New IK Goal**. Goals will be created at the location of each of these bones.

[image: create ik goal]

You can optionally adjust the goals so they appear more prominently in the viewport by selecting them and editing their **Size **and **Thickness Multiplier** properties.

[image: ik goal size]

### Connect Goals to Solvers

Each IK Goal must be connected to a Solver for it to correctly act as the effector for that Solver.

To do this, select both the **Solver **and the **IK Goal**, right-click the goal, and select **Connect Goal to Selected Solver**.

[image: connect goal to selected solver]

Repeat this action for each goal and Solver so that all your goals are connected to their respective Solvers.

[image: connect goal to selected solver]

### Set Solver Root

For some Solvers, like Limb IK, you must specify both a **goal **and a **root**. The root is typically the starting Bone of the IK chain. In this example, the **thigh** will be the root.

To set the root for a Solver, select both the **Solver **and the **Bone**, right-click the Bone, and select **Set Root Bone on Selected Solver**.

[image: set root bone on selected solver]

Repeat this action for both Limb IK Solvers so that both of them have their respective thigh Bones set as the root.

[image: set root bone on selected solver]

### Final Result

You can now preview your IK system in the viewport by selecting IK Goals and manipulating them. Clicking **Reset** restores your Goals to their initial state.

- animation

On this page

- Prerequisites (-> ik-rig-in-unreal-engine)
- Create IK Rig (-> ik-rig-in-unreal-engine)
- Editor and Feature Overview (-> ik-rig-in-unreal-engine)
- IK Goals (-> ik-rig-in-unreal-engine)
- IK Goal Properties (-> ik-rig-in-unreal-engine)
- Solvers (-> ik-rig-in-unreal-engine)
- Viewport Settings (-> ik-rig-in-unreal-engine)
- IK Rig Example Setup (-> ik-rig-in-unreal-engine)
- Create Solvers (-> ik-rig-in-unreal-engine)
- Create Goals (-> ik-rig-in-unreal-engine)
- Connect Goals to Solvers (-> ik-rig-in-unreal-engine)
- Set Solver Root (-> ik-rig-in-unreal-engine)
- Final Result (-> ik-rig-in-unreal-engine)
