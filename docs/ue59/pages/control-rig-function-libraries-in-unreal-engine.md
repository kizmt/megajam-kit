# Control Rig Function Libraries

https://dev.epicgames.com/documentation/en-us/unreal-engine/control-rig-function-libraries-in-unreal-engine?application_version=5.9

> Construct and reference public Control Rig functions to speed up your rigging workflows.

[image: Control Rig Function Libraries]

Similar to Blueprints (-> blueprints-visual-scripting-in-unreal-engine), you can share user-created functions between asset graphs by making the function "public". Unlike Blueprints, which only share functions to child classes, Control Rig functions can be shared project-wide. You can create custom function libraries, and share them with all Control Rig graphs in your project.

This document provides a guide for the best practices for creating function libraries in Control Rig, and shows how you can access the default engine-provided function library.

## New Function Library

The following steps will show you how to create and use a new Control Rig function library.

### Create Control Rig Container

As custom functions can only exist inside Control Rig Assets, the first step will be to create a Control Rig Asset. This Control Rig should not be linked to any particular Skeletal Mesh, as it will be used primarily to contain your functions.

In the Content Browser, click **Add (+)**, then select **Animation > Control Rig**. In the **Create Control Rig Blueprint** dialog window, select **ControlRig **and click **Create**. Open the Control Rig after it is created.

 [image: create control rig]

For the purposes of this asset, your function libraries are Control Rig Assets, and do not include dependencies on any particular skeleton. As a container of functions, this allows for the asset to be as lightweight as possible.

### Create Public Function

In the Control Rig Editor (-> control-rig-editor-in-unreal-engine), create a new function by clicking **Add (+)** on the **Functions **section of **My Blueprint**.

 [image: create control rig function]

Next, select the function, and in the **Details **panel set **Access Specifier** to **Public**. This makes the function publicly accessible in all Control Rigs.

 [image: public function]

### Setup Data in Function

From within your function, you can create any arbitrary contained logic you want, including metadata on the function such as tooltip descriptions and context menu categories.

In this example, **For Each** and **Set Control Visibility** nodes were created and connected to the function's **Entry **and **Return **nodes.

 [image: function example]

To create variable inputs on the Entry node, select **Entry **and click **Add (+)** on the **Inputs** category in the **Details **panel. In this example, the following variables were created:

- **Rig Element Key**, as an **Array **type.

- **Boolean**, as a **Single **type.

 [image: variable setup]

Next, connect the variable inputs to their corresponding nodes.

 [image: variable connection]

Optionally, you can also edit the **Node Settings** properties in the **Details **panel to add categorization, tooltip, or other helpful properties to the function.

 [image: function settings]

| Name | Description |
| --- | --- |
| **Category** | Filling this property puts the node within the named context menu category. This category is visible when adding the node in the Control Rig graph. |
| **Keywords** | Adds search terms you can use to find this function when searching for it using the context menu. |
| **Description** | Adds a tooltip description for this function. You can view the tooltip when hovering your cursor either on the context menu item, or on the node after it is added to the graph. |
| **Color** | Sets the color of the function node header. You can preview the look of your node by expanding the **Node Defaults** category. |

### Referencing the Function

To add your shared function in another Control Rig, right-click in the **Rig Graph** and add your function from the context menu. Shared functions also display their folder path in the node header for reference.

 [image: add function]

Double-clicking on a shared function node opens the Control Rig Asset containing the function, and the function logic.

### Localizing Functions

In cases where you want to diverge the logic of the function from the shared version, you can localize the function, which creates a local copy of the function logic within your current Rig Graph.

To do this, right-click on the function node and select **Localize Function**. In the dialog window, ensure the function is enabled and click **OK**.

 [image: localize function]

The function now converts to a local function, where you can diverge the logic locally.

 [image: localized to new function]

## Standard Function Library

By default, Unreal Engine contains a Control Rig **Standard Function Library**, which can be referenced to understand how to construct your own function libraries. Additionally, it contains a variety of functions that can be used to assist your own rigging workflows.

The Standard Function Library is located within the **Control Rig Plugin** folder. To access it, open the **Content Browser** and ensure the plugin folder is enabled by clicking **Settings **and enabling **Show Engine Content** and **Show Plugin Content**.

 [image: show engine and plugin content]

Next, navigate to and open **StandardFunctionLibrary **located in **Engine > Plugins > Control Rig Content > StandardFunctionLibrary**.

 [image: standard function library]

Once open, you can view the various functions in the **My Blueprint **panel.

 [image: standard functions]

Because the Standard Function Library is provided by **Engine Content**, any changes that you make in this asset will be overridden if you reinstall or update Unreal Engine. We reccomend instead to create your own Function Library and not modify the Engine Content one.

- animation
- control rig
- library

On this page

- New Function Library (-> control-rig-function-libraries-in-unreal-engine)
- Create Control Rig Container (-> control-rig-function-libraries-in-unreal-engine)
- Create Public Function (-> control-rig-function-libraries-in-unreal-engine)
- Setup Data in Function (-> control-rig-function-libraries-in-unreal-engine)
- Referencing the Function (-> control-rig-function-libraries-in-unreal-engine)
- Localizing Functions (-> control-rig-function-libraries-in-unreal-engine)
- Standard Function Library (-> control-rig-function-libraries-in-unreal-engine)
