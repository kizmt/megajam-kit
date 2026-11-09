# Using the Main Material Node

https://dev.epicgames.com/documentation/en-us/unreal-engine/using-the-main-material-node-in-unreal-engine?application_version=5.9

> Guide for setting up and using the Main Material Node

[image: Using the Main Material Node]

**Materials** are created using a specialized coding language called **High Level Shading Language** or HLSL. HLSL allows Materials to send instructions directly to the graphics hardware, giving artists and coders control over what is displayed on screen. Inside Unreal Engine 5 (UE5) the **Material Expression** nodes that are used to create Materials contain small snippets of this HLSL code.

The inputs on the **Main Material Node** are the last stop in a UE5 Material graph. Whatever combination of Material Expression nodes is connected to the inputs on the Main Material Node is what determines the overall appearance of the final Material when it is compiled and used in your Level.

 [image: UE5 Main Material Node]

The Main Material Node with default inputs.

## Material Inputs

Each **input** on the Main Material Node defines a single unique aspect of the appearance and surface properties of your Material. For example, if you connect a **Constant3Vector** to the **Base Color** input and give it a value of (1,0,0), you can make the Material red.

 [image: Vector 3 in Base Color]

This Material graph only explicitly defines a single aspect of the Material—its Base Color.

However, the overall appearance of the Material is the collective result of all the enabled inputs in the Main Material Node. Enabled input pins are white on the Main Material Node, and disabled inputs are grayed out.

 [image: Enabled inputs in Main Material Node]

Inputs that do not receive any data from Material expressions in the graph simply revert to their default values. For example, even though there is nothing plugged into Metallic, Specular, or Roughness, these properties still contribute to the appearance of the Material.

 [image: Empty material inputs]

- **Metallic** defaults to 0 (non-metallic).

- **Specular** defaults to 0.5.

- **Roughness** defaults to 0.5.

Therefore, a Material with those values plugged into Metallic, Specular, and Roughness looks exactly the same as the one shown previously.

 [image: Default values]
 [image: Default Spec Metallic Roughness]
 [image: New values in color and roughness]

Slider: Note that the preview render does not change when default values are connected the the Main Material Node.

By changing the values, you can alter the appearance and surface properties of the Material. In the third image, the roughness value is changed from **0.5 to 0.07**, and the Material appears more polished. Changing the values in the **Constant3Vector** to **(0,0,1)** makes the Base Color blue instead of red.

### Understanding Material Inputs

UE5 uses a **Physically Based Rendering** (PBR) workflow for Materials, meaning Materials closely approximate the way surfaces interact with light in the real world. To create Materials effectively it is important to understand exactly how each input affects the final Material. These two pages provide foundational information about the PBR Materials workflow in Unreal Engine 5.

- Read the Physically Based Materials (-> physically-based-materials-in-unreal-engine) overview to learn best practices for creating Materials in a PBR workflow.

- Read the Material Inputs (-> material-inputs-in-unreal-engine) page for examples and descriptions of what each input on the Main Material Node does.

### Enabled and Disabled Inputs

Some of the input pins in the Main Material Node are enabled by default, while others are disabled. The following properties in the **Details Panel** determine which inputs are enabled.

- Material Domain

- Blend Mode

- Shading Model

 [image: Default Main Material Node]

Modifying any of these three Material properties can change the inputs that are enabled and disabled in the Main Material Node.

In the middle example, changing the Blend Mode from **Opaque** to **Translucent** enables the Opacity and Refraction inputs. It also disables any inputs that are not used by translucent Materials.

 [image: Main Material Node variations]

On the far right, selecting the **Clear Coat Shading Model** enables the inputs for Clear Coat and Clear Coat Roughness.

You must select the Main Material Node to access these properties in the **Details** panel. To select the Main Material Node, click it with the **left mouse button** or click anywhere in the background of the Material graph.

### Nodes Connected to Disabled Inputs are Ignored

When switching between Blend Modes or Shading Models, some inputs may become disabled. Material Expressions remain connected to disabled inputs, but are ignored when the Material is compiled.

In this example, a constant value was connected to Opacity. The Blend Mode was changed from **Translucent** to **Opaque**, causing the Opacity input to become disabled.

 [image: Opacity disabled]

The constant node remains connected to the Opacity input, but the cable and input are grayed out to indicate that the input is disabled. Nodes connected to disabled inputs do not affect the compiled Material in any way.

## Main Material Node Details Panel Properties

When the Main Material Node is selected in the Material Editor, the **Details** panel displays a list of all editable properties relating to how the Material can be used.

As demonstrated above, properties like **Blend Mode** and **Shading Model** directly influence which inputs are enabled in the Main Material Node. Other sections let you modify how the Material interacts with specific platforms or rendering features.

Here is a brief breakdown of what each section in the Main Material Node Details panel does:

 [image: Details panel properties]

| Section Name: | Description |
| --- | --- |
| **Physical Material** | This allows you to specify what type of Physical Material is used for this Material. |
| **Material** | This is where you will spend most of your time when editing Materials. The Material section is where you can change the Material Domain, Blend Mode, and Shading Model along with many more options. |
| **Physical Material Mask** | An array of Physical Material Maps to be used for this Material. |
| **Translucency** | This is where you can adjust how Translucency in this Material will function. Please note that this is only editable if the Material Blend Mode is set to Translucent. |
| **Translucency Self Shadowing** | This is where you can adjust how Translucent self shadowing looks and behaves. Please note that this is only editable if the Material Blend Mode is set to Translucent. |
| **Usage** | This is where you set what type of objects this Material will work with. Usage flags are usually set automatically by the editor. However if you know that this Material is supposed to be used with a certain object type, make sure you enable it here to avoid any future mistakes |
| **Mobile** | This is where you set how this Material should work when used on a mobile device like a smart phone. |
| **Forward Shading** | Per-material overrides for when the Forward Shading Renderer is in use. |
| **Group Sorting** | Allows you to change the order of Parameter Groups in your Material. |
| **Post Process Material** | This is where you define how this Material should work with Post Process and Tone Mapping. Please note that this is only editable if the Material Domain is set to Post Process. |
| **Refraction** | Properties to change the refraction mode and refraction depth bias. |
| **Lightmass** | This is where you can adjust how this Material will interact with Lightmass. |
| **Previewing** | Change the Static Mesh used to preview the Material in the Material Editor viewport. |
| **Import Settings** | A selection of import data types and options relevant to the selection for use with this Material. |

Read more about these settings on the Material Properties (-> unreal-engine-material-properties) page.

## Using the Main Material Node

Inputs on the Main Material Node work exactly like any other Material Expression or Function in the Material graph.

To connect a Material Expression to an input in the Main Material Node:

- **Left-click** the output pin of a Material Expression and drag the mouse to an input pin on the Main Material Node. [image: Drag connection]

- Release the **left mouse button** over the input pin when the green check icon appears. [image: Connect Material node]

If you do not know how to place Material Expressions and Functions in your Material graph, read here (-> placing-material-expressions-and-functions-in-unreal-engine).

## Previewing and Applying Materials

The Main Material node is the end-point of a UE5 Material graph. The information that you pass into the inputs on the Main Material node is what ultimately determines the appearance of the Material. As you connect Material expressions to the Main Material node, the preview in the Material Editor viewport updates continuously so you can evaluate your changes and make sure you are getting the desired results.

Continue reading about the various ways to preview Materials (-> previewing-and-applying-your-materials-in-unreal-engine) and how to apply them to the Actors in your Level.

- materials
- shaders

On this page

- Material Inputs (-> using-the-main-material-node-in-unreal-engine)
- Understanding Material Inputs (-> using-the-main-material-node-in-unreal-engine)
- Enabled and Disabled Inputs (-> using-the-main-material-node-in-unreal-engine)
- Nodes Connected to Disabled Inputs are Ignored (-> using-the-main-material-node-in-unreal-engine)
- Main Material Node Details Panel Properties (-> using-the-main-material-node-in-unreal-engine)
- Using the Main Material Node (-> using-the-main-material-node-in-unreal-engine)
- Previewing and Applying Materials (-> using-the-main-material-node-in-unreal-engine)

Related documents

Material Inputs

 [image: Material Inputs] (-> material-inputs-in-unreal-engine)Material Editor Guide

 [image: Material Editor Guide] (-> unreal-engine-material-editor-user-guide)Material Editor UI

 [image: Material Editor UI] (-> unreal-engine-material-editor-ui)Essential Material Concepts

 [image: Essential Material Concepts] (-> essential-unreal-engine-material-concepts)
