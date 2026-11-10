# Common UI Overview

https://dev.epicgames.com/documentation/en-us/unreal-engine/overview-of-advanced-multiplatform-user-interfaces-with-common-ui-for-unreal-engine?application_version=5.9

> Learn about the problems Common UI is designed to solve and how it solves them.

[image: Common UI Overview]

**Common UI** supports the development of cross-platform UIs with complex navigation, such as menus with layers, submenus, or popups. Originally developed for UI in Fortnite, this plugin is available to Unreal Engine users through the **Plugins** menu. This page details the use-cases Common UI was designed to address, and the main concepts that drive its design.

## Problems Common UI Solves

### Navigating Multi-Layered Menus

The image below shows an example of a complex menu:

 [image: The dual blade menus in Fortnite]

This UI shows two blade menus overlaid on top of a tabbed UI in the background. The background UI still exists, but cannot be interacted with if the top layer exists. **How is this selective interactivity achieved?**

Meanwhile, input methods can vary between different platforms and controllers. On PC, users select the UI elements above by clicking them with a mouse cursor. On consoles, however, the user selects UI elements using cardinal navigation and button presses. **How do we create a UI that works across multiple platforms, consoles, and PC?**

### Returning to the Correct Element

 [image: Example of a popup window appearing in front of other menus.]

Suppose the user sees a popup like the one in the image above. Then, the user closes the popup.** How does the UI return to the correct element for cardinal navigation? **If the overlay UI beneath the popup is then closed, then it will again need to find somewhere to return to. The solution to this problem must be applicable in a wide variety of circumstances.

### Console-specific UI Elements

 [image: Example of an action bar showing button icons.]

In the image above, the UI displays the button to press for each interaction. However, these buttons' icons vary per console. **How do we create a UI that is indifferent to console-specific UI elements?**

### Common UI's Features

Common UI's features are designed to address the problems listed above. With Common UI, you gain:

- Selective widget interactivity, providing an easy way of creating rich UIs with layering.

- Multiplatform console and PC support.

- On consoles: Cardinal navigation management, including breadcrumbs and history.

- Console-specific UI element management.

## Key Concepts

This section explains the design and main features of Common UI.

### Input Routing

On consoles and PC, interactivity is determined by input. To achieve selective interactivity, CommonUI uses **Input Routing**, which only permits certain widgets to receive input, whether from a mouse or a gamepad, at a given time.

 [image: Input routing makes menus with many elements easier to manage]

Input routing can also selectively distribute input across widgets. For instance, in the image above, the bumper buttons are always routed to the tab widget at the top, while the 'X' action button is routed to the widget currently selected by cardinal navigation.

For a deeper look, refer to `CommonGameViewportClient.h` and `CommonUIActionRouterBase.h` in Common UI's source code.

### Nodes

Common UI routes inputs to whatever UI widget is visually rendered on top. Common UI converts widgets into **nodes**, which handle input routing based on visual and logical hierarchies.

Nodes are organized into trees which, with a few exceptions, match the **Slate** hierarchy. Each tree consists of a root node, usually represented with a widget placed directly in the Viewport, as well as leaf nodes, usually represented with individual UI elements like buttons.

Once per tick, Common UI finds the tree of nodes painted higher than any other tree, then sends input to that tree's root node. That root widget will then forward input to the first leaf widget within the tree ready to handle input, which will then process the input or forward it again if needed.

 [image: Flowchart showing input routing logic.]

For a deeper look, see **UIActionRouterTypes.h**.

### Activatable Widgets

Within Common UI, only certain widgets are converted into nodes for the purpose of handling input, and only widgets that are ready to handle input receive input. These widgets are called **activatable widgets**, and they are considered _active _if they are ready to receive input.

Activatable Widgets:

- Can be toggled between active or inactive states, indicating if they are ready to receive input.

- Can forward input to other activatable widgets within the same tree.

- Can deactivate automatically when appropriate, such as when handling back actions.

With activatable widgets, if the user dismisses an overlay UI that is currently receiving input, the issue of returning to the correct element is trivial. Since input is only routed to the highest painted tree, we can leave widgets active without concern if they are on a lower UI layer. Once that upper level UI is dismissed, Common UI routes input to the still-active widgets in the next-highest UI layer.

For a deeper look, refer to `CommonActivatableWidget.h`.

## Further Reading

For detailed information about how to set up Common UI for first-time use, refer to the Common UI Quickstart Guide (-> common-ui-quickstart-guide-for-unreal-engine).

## Content Examples

For a basic example of Common UI in action, look at the Common UI content sample. For a more advanced example that includes a full frontend menu, download the Lyra sample project.

- ui
- user interface
- plugin
- umg
- menus
- gamepad
- common ui

On this page

- Problems Common UI Solves (-> overview-of-advanced-multiplatform-user-interfaces-with-common-ui-for-unreal-engine)
- Navigating Multi-Layered Menus (-> overview-of-advanced-multiplatform-user-interfaces-with-common-ui-for-unreal-engine)
- Returning to the Correct Element (-> overview-of-advanced-multiplatform-user-interfaces-with-common-ui-for-unreal-engine)
- Console-specific UI Elements (-> overview-of-advanced-multiplatform-user-interfaces-with-common-ui-for-unreal-engine)
- Common UI's Features (-> overview-of-advanced-multiplatform-user-interfaces-with-common-ui-for-unreal-engine)
- Key Concepts (-> overview-of-advanced-multiplatform-user-interfaces-with-common-ui-for-unreal-engine)
- Input Routing (-> overview-of-advanced-multiplatform-user-interfaces-with-common-ui-for-unreal-engine)
- Nodes (-> overview-of-advanced-multiplatform-user-interfaces-with-common-ui-for-unreal-engine)
- Activatable Widgets (-> overview-of-advanced-multiplatform-user-interfaces-with-common-ui-for-unreal-engine)
- Further Reading (-> overview-of-advanced-multiplatform-user-interfaces-with-common-ui-for-unreal-engine)
- Content Examples (-> overview-of-advanced-multiplatform-user-interfaces-with-common-ui-for-unreal-engine)
