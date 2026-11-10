# Creating and Using Material Functions

https://dev.epicgames.com/documentation/en-us/unreal-engine/creating-and-using-material-functions-in-unreal-engine?application_version=5.9

> A guide to the process of creating and using Material Functions.

[image: Creating and Using Material Functions]

###### Prerequisite topics

In order to understand and use the content on this page, make sure you are familiar with the following topics:

- Material Functions Overview (-> unreal-engine-material-functions-overview)

## Creating Material Functions

Use the following steps to create a new Material Function:

- Right-click in the **Content Browser**. In the context menu under the Create Advanced Asset section, open the **Materials** sub-menu and select **Material Function** from the list.

- Rename the Material Function after it appears in the Content Browser. Your name should be as descriptive as possible so that when someone looks at it they can easily understand what it does. This example ses the name **Custom_Fresnel**. You can re-name your Material Function by selecting it in the **Content Browser**, pressing **F2** on the keyboard, and typing a new name.

## Editing Material Functions

After you create a new Material Function, you need to open it in the Material Editor to begin constructing the Material Expression network. You can also open existing Material Functions if you would like to change their behavior. There are two ways to open a Material Function for editing:

- Double-click a Material Function asset in the **Content Browser** to open it in a separate Material Editor tab. You can then edit the Material Expression network within the Material Function to modify its behavior [image: Cheap Contrast Material Function asset]

- Double-click a Material Function node within an existing Material, and the Material Function will open in a new Material Editor Tab. [image: Cheap contrast Material Function Call node]

When double-clicked, the Material Function opens in a new tab of the Material Editor, showing the Material Expression network contained within the function. You can then edit the graph to your liking.

 [image: Cheap contrast material graph]

It is important to note that any changes made and saved to a Material Function will propagate to all instances of that Material Function moving forward. For example, if you made a change to the internal network of a Radial Gradient Material Function, all existing instances of that function would receive the update, as well as all new instances moving forward.

For this reason, unless you are certain that your change needs to propagate throughout all other instances of the function, it may be wise to **make a copy of an existing function** in the Content Browser (right-click and choose Duplicate from the context menu) rather than editing the original material function.

Once you make changes to a function you must click the **Apply** button to propagate the changes to the function asset and any Materials using the function. Once done, be sure to save your asset in the Content Browser.

 [image: Apply changes]

## Publishing Your New Function

In order to use your Material Function , you need to make sure that it shows up within the **Material Function Library** in the Material Editor Palette. In order to do this, you must set the **Expose to Library** property to true.

- Deselect all nodes within your function by clicking in the background of the Material Graph. This will display the function's base properties in the **Details** panel. [image: Expose to library]

- Add a description. This is critical, as putting a description here will cause that description to appear as a tooltip when users mouse over the function in the Material Function Library as well as in Material Editor. Adding descriptions to your Input and Output nodes is certainly good practice, but if you had to choose only one place to comment in your expression, this is by far the most important one. [image: Function description]

- **Library Categories Text** lets you choose which category your Material Function will appear in. You can add additional categories by clicking **Insert**, and typing a new category name. However, it is wise to be as concise as possible and not add any more categories than are absolutely needed. [image: Function categories]

## Using Material Functions

### From Material Palette

Once you have created your Material Function and published it to the library, you can use it in an existing Material by dragging it directly from the Material Editor Palette. In addition to user-created Material Functions, the Palette contains all the default Material Functions included with the engine.

 [image: Material Function library]

Default Material Functions are sorted into a wide range of categories. User-created Material Functions are placed in the **Misc** category by default, but you can change their categorization in the Details panel properties for the function. Drag a Material Function into your Material Graph, and a Material Function Call node is created, containing the various inputs and outputs defined by the input and output nodes within the function.

 [image: Drag Material Function from Palette]

You can also add Material Functions to your Material by **right-clicking** in the Material Editor and searching for them in the context menu.

### Unspecified Function Node

A third way to use Material Functions is by placing an **Unspecified Function** node in your Material Graph, and then assigning a Material Function to it in the Details panel.

- Hold the **F key** and **left-click** in the Material Graph to place an Unspecified Function node. [image: Unspecified Function node]

- Assign a Material Function to the Unspecified Function node in the **Details** panel. You can search for a Material Function in the dropdown menu in the Details Panel, or you can select a Material Function asset in the **Content Browser** and click the **Use Selected Asset from Content Browser** button. [image: Use selected asset from Content Browser]

- The Unspecified Function node is replaced by the selected Material Function – Blend Angle Corrected Normals in this example. [image: Blend angle corrected normals node]

- materials
- shaders

On this page

- Creating Material Functions (-> creating-and-using-material-functions-in-unreal-engine)
- Editing Material Functions (-> creating-and-using-material-functions-in-unreal-engine)
- Publishing Your New Function (-> creating-and-using-material-functions-in-unreal-engine)
- Using Material Functions (-> creating-and-using-material-functions-in-unreal-engine)
- From Material Palette (-> creating-and-using-material-functions-in-unreal-engine)
- Unspecified Function Node (-> creating-and-using-material-functions-in-unreal-engine)
