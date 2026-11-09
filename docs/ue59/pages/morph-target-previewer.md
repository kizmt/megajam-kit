# Morph Target Previewer

https://dev.epicgames.com/documentation/en-us/unreal-engine/morph-target-previewer?application_version=5.9

> User guide for the editing modes available in the Animation Editor.

[image: Morph Target Previewer]

The **Morph Target Previewer** previews any **Morph Targets** (sometimes called "morphs" or "blend shapes") that are applied to a **Skeletal Mesh**. Each **Morph Target** is additively blended into the existing **Skeletal Mesh** geometry. Multiple morph targets can be combined to create a complex vertex-driven animation, which is often ideal for such things as facial expressions.

The **Morph Target Previewer** window is visible by default whenever any Animation Editor (-> animation-editors-in-unreal-engine) is open.

## Interface

The **Morph Target Previewer** panel has two main sections:

- Search Bar

- Morph Target List

The Search Bar filters the list of **Morph Targets** to quickly find the one you need. Type the first few letters of the desired target and the list will begin filtering.
You can also right-click on a **Morph Target**, which will pop-up a dialog box with additional actions, such as **Delete** or **Copy Morph Target Names**.

## Creating Morph Targets

You can import **Morph Targets** as a part of a **Skeletal Mesh**, as well as independently (from a given mesh). This is supported via the FBX file format.

For more information on the setup procedure, as well as how to import Morph Targets into Unreal, please see FBX Morph Target Pipeline (-> fbx-morph-target-pipeline-in-unreal-engine).

## Using Morph Targets

Once your Morph Targets are in place, you will need to set up your Animation Blueprint (-> animation-blueprints-in-unreal-engine) to utilize them. This is done within your Event Graph via the **Set Morph Target** node.

| Pin | Description |
| --- | --- |
| Input Pins |  |
| Execution | An execution wire to trigger the effect of the node. |
| Target | The target **Skeletal Mesh**. For most circumstances, this will point to "self". |
| Morph Target Name | The name of the **Morph Target** being edited. |
| Value | A float value (between 0.0 and 1.0) used to set the value of the **Morph Target** being edited. |
| Output Pins |  |
| Execution | Passes execution on to the next node. |

## Morph Target Debug View Mode

You can enable this view mode to easily see what vertices are affected by each Morph Target.

- In the viewport window, click on **Show** > **Mesh Overlay** >, and then **Selected MorphTarget Vertices**.

- Now select any **Morph Target** from the **Morph Target Preview** panel to see the debug view.

## Optimization

For target platforms that support Shader Model 5, you can enable the GPU calculation of morph targets. This means that the CPU does not have to perform the calculations if your game is CPU bound, and you have GPU processing to spare. This feature can be activated in the **Project Settings**, as follows:

- On the file menu, go to **Edit** > **Project Settings**.

- Open the **Rendering** section of **Project Settings**.

- In the **Optimizations** category, find the **Use GPU for computing morph targets** checkbox and enable it.

Click for full image.

- animation
- morph target
- skeletal mesh
- fbx importing

On this page

- Interface (-> morph-target-previewer)
- Creating Morph Targets (-> morph-target-previewer)
- Using Morph Targets (-> morph-target-previewer)
- Morph Target Debug View Mode (-> morph-target-previewer)
- Optimization (-> morph-target-previewer)
