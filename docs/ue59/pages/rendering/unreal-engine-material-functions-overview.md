# Material Functions Overview

https://dev.epicgames.com/documentation/en-us/unreal-engine/unreal-engine-material-functions-overview?application_version=5.9

> An overview of how Material functions work and some critical concepts for their use.

[image: Material Functions Overview]

**Material Functions** let you package parts of a Material graph into a reusable asset that you can share to a library and easily insert into other Materials. Their purpose is to streamline Material creation by giving instant access to commonly used networks of Material nodes.

For example, the **Blend_Overlay** function shown below contains the entire Material Expression network shown on the right side of the image. Instead of constructing this node network over and over, you can insert it directly into your graph from the Material Function library.

 [image: Material Function example]

Functions are edited in the Material Editor like a normal Material, but with some restrictions on what nodes you can use. When used properly, they can reduce Material redundancy which in turn reduces artist maintenance effort. Material Functions keep duplicate expressions in sync, preventing the inevitable bugs that arise when one duplicate is missed during a modification.

Material Functions are a distinct asset class in the **Content Browser**. Their graphs are similar to Materials, but differ in one major regard. Instead of a Main Material node, Material Functions have FunctionOutput nodes, which appear as output pins on the final Material Function node when it is used in a Material.

It may help to think of a Material function like an electronics project enclosure. You can add as many inputs and outputs as you deem necessary. The heart of the function is the Material Expression network between those inputs and outputs. This example takes two layers and blends them together like a Photoshop screen blend. The function abstracts the details from an artist, so they do not have to actually know the math of a screen blend to use a screen blend operation.

 [image: Blend Screen Function]

Material Function input (1) and output (2) nodes.

As you can see above, what happens between the input and the output is entirely up to you and will be defined by any network of standard Material expression nodes. Once you insert a Material Function into a Material, you will only see the Matrial Function Call node with its inputs and outputs. The rest of the graph is hidden within the function.

 [image: Blend Screen example]

## Material Function Library

When your Material Function is finished, you can publish it to the **Material Function library** for easy access during Material creation. The Material Function library is found within the Palette on the right side of the Material Editor. The Palette contains a categorized and filterable list of available Material Functions. This list is populated from any loaded functions, but also from any deault Material Functions found in the **Content Browser Database**.

 [image: Material Function Library]

You can hover over these entries to see their Description as a tooltip, or drag and drop one into your Material.

In order for a Material function to appear in the Material Function Library, its **Expose to Library** property must be checked. In the Material Function editor, deselect all nodes by clicking an empty space in the graph to show the base properties for the Material Function. The Expose to Library option is found in the Details panel.

For a full listing of the existing functions within the Material Function Library by default, please see the Material Function Reference (-> unreal-engine-material-functions-reference).

## Function Related Nodes

Below are the Material expression nodes that relate to Material Functions, along with their purpose:

- **MaterialFunctionCall** - Allows using an external function from another Material or function. The external function's input and output nodes become inputs and outputs of the function call node.

- **FunctionInput** - Can only be placed in a Material Function, where it defines one of the function's input pins.

- **FunctionOutput** - Can only be placed in a Material Function, where it defines one of the function's output pins.

- **TextureObject** - Useful for providing a default texture for a texture function input within a function. This node does not actually sample the texture, so it must be used in conjunction with a TextureSample node.

- **TextureObjectParameter** - Defines a texture parameter and outputs the texture object, used in Materials that call a function with texture inputs. This node does not actually sample the texture, so it must be used in conjunction with a TextureSample node.

- **StaticSwitch** - Performs a compile time choice between two inputs, based on the input value.

- **StaticBool** - Useful for providing a default bool value for a static bool function input within a function. This node does not switch between anything, so it must be used in conjunction with a StaticSwitch node.

- **StaticBoolParameter** - Defines a static bool parameter and outputs the static bool value, used in Materials that call a function with static bool inputs. This node does not switch between anything, so it must be used in conjunction with a StaticSwitch node.

## Input and Output

Since Material functions are encapsulated networks of nodes, it is up to the user to make sure that data can flow into and out of them. This is handled by way of FunctionInput and FunctionOutput nodes. Understanding these nodes is critical for using Material functions.

Within the Material Function itself, FunctionInput and FunctionOutput nodes appear like so:

 [image: Input and Output nodes]

When the Material Function is used in a Material, the FunctionInput and FunctionOutput nodes appear as input and output pins on the Material Function node:

 [image: Input and output pins on Material Function Call]

### FunctionInput Nodes

As stated, **FunctionInput** nodes serve as the gateway through which data enters a Material Function. A given function may have any number of these input nodes, each corresponding with an input pin on the Material Function Call node.

 [image: FunctionInput node]

FunctionInput nodes have the following properties and data pins:

| Item | Description |
| --- | --- |
| Properties |  |
| **Input Name** | The name of the input, which is visible as an output pin on the Material Function when it is used within a Material. |
| **Description** | A description of the input, which is visible as a tooltip when you mouse over the corresponding input pin on the Material Function node. |
| **Input Type** | This defines what type of data the input accepts. See Input Types (-> unreal-engine-material-functions-overview) below. |
| **Preview Value** | This serves as a means of testing and a way to help visualize that the function is doing during the construction process. Any value entered here is used as if it was passed in from an input outside the function. |
| **Use Preview Value as Default** | This checkbox allows the data set in the preview value to act as the default value. This is useful if you do not want to force the user to provide an input into the function for this value. |
| **Sort Priority** | This number is used to control the order in which input pins are displayed on the Material Function node. The order is lowest to highest. |
| Input Pins |  |
| **Preview** | Data passed into this input supersedes the Preview Value property. As with its associated property, this is useful for testing the function during construction and setting up default values. |
| Output Pins |  |
| **(Unlabled)** | This provides the output for the incoming data that will be processed by the function. |

### FunctionOutput Nodes

A FunctionOutput node provides the means by which data within a Material Function exits the function for further use in a Material. In other words, it outputs final result of the Material function. As with FunctionInput nodes, a function may have any number of output nodes, leading to any number of potential output pins.

 [image: FunctionOutput node]

When a **FunctionOutput** node is selected, the following properties are accessible in the Details panel.

| Item | Description |
| --- | --- |
| Material Expression Function Output |  |
| **Output Name** | The name of the output, which is visible as an output pin on the Material Function when it is used within a Material. |
| **Description** | A description of the output, which displays as a tooltip when you mouse over the corresponding output pin on the Material Function node. |
| Material Expression |  |
| **Sort Priority** | This number is used to control the order in which output pins are displayed on the Material Function node. The order is lowest to highest. |
| **Description** | This description field defines the text in Comment Bubble of the node. This is only visible **within** the Material Function editor. |
| Output Pins |  |
| **(Unlabled)** | This provides the output for the incoming data that will be processed by the function. |

### Input Types

Inputs have a specified type that is required of any expressions connected to them. To set the Input Type, select a **FunctionInput** node in the Material Function editor, and use the **Input Type** dropdown to select an option.

 [image: Function input types]

When called in a Material, the input type is displayed as an abbreviation next to the input connectors. In this case, both the inputs were Vector3's so V3 is displayed. Anything connected to an input when used in a Material **must** be convertible to the correct input type, or you will receive an error.

 [image: Color burn input types]

Below are the available input types and their associated abbreviations:

| Input Type | Abbreviation |
| --- | --- |
| **Scalar** | S |
| **Vector2** | V2 |
| **Vector3** | V3 |
| **Vector4** | V4 |
| **Texture2D** | T2D |
| **TextureCube** | TCube |
| **Texture2DArray** | T2dArr |
| **VolumeTexture** | TVol |
| **StaticBool** | B |
| **MaterialAttributes** | MA |
| **TextureExternal** | TExt |

## Common Properties

While editing a Material Function, deselecting all nodes or clicking in the background of the Material Graph will make the base properties of the function visible in the Details panel.

| Item | Description |
| --- | --- |
| Properties |  |
| **Description** | This description will display as a tooltip when users mouse over the Material Function in the palette, or mouse over the body of the Function Call node within the Material Editor. |
| **Expose to Library** | If this box is checked, the Material Function will appear within the Material Functions list inside the Material Editor palette so that you can insert it into Materials. You may need to restart the editor for a new function to appear. |
| **Library Categories** | This array holds all of the categories of the Material Functions tab under which this function will appear. |

## Previewing

When editing a Material Function, the preview viewport shows whichever node is being previewed. You can **right-click** on any node and choose **Start Previewing Node** to preview the results of the Material network up to that point.

 [image: Start Previewing Node]

Most of the time you will want to preview the function output, or the end result of the Material Function. The Material Function output node is previewed by default.

 [image: Previewing Output]

### Function Input Preview

Function Input nodes have some options for specifying preview values, since they do not know the actual values that artists will use within the Material. Each input has a built-in **Preview Value** that you can use to show a constant for float input types. Function inputs also have a 'Preview' connector which allows you to override the built-in value with any value that matches the input type. In this example, texture samples are used to provide a preview value for the two Vector3 inputs.

 [image: Preview texture sample inputs]

Note that the input has an option in the details panel to **Use Preview Value As Default**. When this is enabled, the preview value is used any time the function is called in a Material and nothing is connected to that input. The preview value acts as a fallback, and prevents compilation errors when nothing is connected to the input. This makes the input an optional input, so it is drawn in gray.

## Parameters

You can use Parameters (-> instanced-materials-in-unreal-engine) in a Material Function like you would in a regular Material. These parameters are passed directly to any Material for use. There are some slight differences in the procedure for using texture parameters.

### Texture Parameters

To use a texture parameter within a Material Function, create a **FunctionInput* node and change the data type to **Texture2D**. Connect it to the texture object override pin in a **Texture Sample** node.

 [image: Texture Parameter within function]

When you use that Material Function in a Material, place a **TextureObjectParameter** node and connect it to the **Texture2D** input pin on the Material Function.

 [image: Texture object parameter]

### Static Bool Parameter

Similarly for Static Switch parameters, create a FunctionInput and change the Input Type to **StaticBool**. Connect it to a **StaticSwitch** node:

 [image: Static Switch function]

In the Material that uses the function, place a **StaticBoolParameter** node and connect it to the input that accepts a Static Bool (**Enable Tiling** in this example).

 [image: Static Bool Parameter]

## Organization

By design, Material Functions are often used by many artists and teamates who did not have a hand in creating the function itself. Therefore, it is important to provide good documentation of what the functions do, and what values are needed for their inputs and outputs. For this reason, functions have several documentation fields on top of the function name and input/output names:

### Function Desctiption

Material Functions have a **Description** field where you can document what the function does. To add a description, click on an empty area in the Material Graph while editing a Material Function. This will display the function's properties in the Details panel, where you can enter a description in the field.

 [image: Material Function description]

The description text displays as a tooltip when you mouse over the Material Function Call node within a Material Graph.

 [image: Custom fresnel tooltip]

### Input and Output Descriptions

You can add a name and description for the input and output pins on your Material Function. While editing a Material Function select an input or output node in the Material Graph. In the details panel, fill out the **Input Name** and **Description** fields.

 [image: Input descriptions]

When this Material Function is used in a Material, the each input pin displays the name you entered, and the description is shown as a tooltip whe you mouse over the input.

 [image: Input tooltip]

While you are editing a Material Function, all tools for organizing and documenting your Material Graph are available to you. Read here about organizing a Material Graph (-> organizing-a-material-graph-in-unreal-engine).

## Propagation

When you edit a Material Function and click the **Save** button to recompile and apply the changes, the new version propagates to any loaded Materials or functions which reference this Material Function. Any unloaded Materials which reference the function will be updated with the changes when they are next loaded.

When an input or output is deleted from a function and the changes are propagated, any links to these deleted connectors in Materials that use the function will be broken! It is important to consider this before you recompile a Material Function, because the propagation cannot be undone. The more Materials a function is used in, the bigger the potential for breakage, so be careful.

All loaded Materials that use the function will be marked dirty when the function change is propagated, which can be used to see which packages could be resaved to prevent increased load times. You can find all the loaded Materials which use a function by **right-clicking** in the **Content Browser** and choosing **Find Materials Using This**.

 [image: Find Materials using this function]

## Nesting Functions

You can nest Material functions within other functions, and chain them together arbitrarily. The only caveat is that Material Functions cannot be nested in such a way that creates a circular dependency.

## Compilation Errors

If there are errors within a Material Function, a compilation error dialog is generated when you attempt to compile the Material. A red error message also appears on top of the Material Function that did not compile correctly. You can hover the mouse over the error message to see a tooltip that describes the compilation error. In this example, the Material Function is not receiving data in either of its inputs, which causes the compilation to fail.

 [image: Compilation error message]

You can avoid the above errors by supplying preview values for your inputs and then activating each input's **Use Preview Value as Default** property. However, this practice may serve as a double-edged sword, as there will be no highly obvious alert (such as an error message) to remind you that you have left an input unplugged.

 [image: Use preview value]

## Default Material Functions

Unreal Engine includes several dozen premade default Material functions. These are accessible from the Material Editor Palette (-> unreal-engine-material-editor-ui), or the right-click search menu.

If you would like to edit one of the default Material Functions, you can find the assets in the **Content Browser** within the **Engine > Content > Functions** folder.

If any changes are made and saved to a default Material function, those changes will exist in all instances of the function. For this reason, it is strongly recommended that you make a duplicate copy of default functions when you want to make changes.

For more information about the default Material Functions included with Unreal Engine, please see the Material Function Reference (-> unreal-engine-material-functions-reference).

- materials
- shaders

On this page

- Material Function Library (-> unreal-engine-material-functions-overview)
- Function Related Nodes (-> unreal-engine-material-functions-overview)
- Input and Output (-> unreal-engine-material-functions-overview)
- FunctionInput Nodes (-> unreal-engine-material-functions-overview)
- FunctionOutput Nodes (-> unreal-engine-material-functions-overview)
- Input Types (-> unreal-engine-material-functions-overview)
- Common Properties (-> unreal-engine-material-functions-overview)
- Previewing (-> unreal-engine-material-functions-overview)
- Function Input Preview (-> unreal-engine-material-functions-overview)
- Parameters (-> unreal-engine-material-functions-overview)
- Texture Parameters (-> unreal-engine-material-functions-overview)
- Static Bool Parameter (-> unreal-engine-material-functions-overview)
- Organization (-> unreal-engine-material-functions-overview)
- Function Desctiption (-> unreal-engine-material-functions-overview)
- Input and Output Descriptions (-> unreal-engine-material-functions-overview)
- Propagation (-> unreal-engine-material-functions-overview)
- Nesting Functions (-> unreal-engine-material-functions-overview)
- Compilation Errors (-> unreal-engine-material-functions-overview)
- Default Material Functions (-> unreal-engine-material-functions-overview)
