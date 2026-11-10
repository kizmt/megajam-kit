# Common UI Quickstart Guide

https://dev.epicgames.com/documentation/en-us/unreal-engine/common-ui-quickstart-guide-for-unreal-engine?application_version=5.9

> A first-time walkthrough of Common UI's core features.

[image: Common UI Quickstart Guide]

This page provides a walkthrough for how to set up **Common UI** in your project. You will learn the following in this guide:

- Setting up your viewport to support **Input Routing**.

- How to create **Input Action Data Tables**, which map controller buttons to actions within your UI.

- How to set up **Default Navigation Actions**, which support global click and back button functionality.

- How to create **Controller Data Assets **and assign them to specific types of controllers on specific platforms.

## 1. Viewport Input Routing Setup

The **Viewport** is the base for all input routing in Common UI. When Common UI captures input, it sends it to the Viewport first, which then sends it to whichever root node is drawn on top. To support this functionality, perform the following setup steps:

- Open **Edit **> **Project Settings **> **Engine** > **General Settings**.

- Set your **Game Viewport Client Class **to **CommonGameViewportClient**. [image: Setting the viewport class to use Input Routing]

If you need your own custom game viewport class, you will need to extend it from CommonGameViewportClient to use Common UI.

## 2. Creating an Input Action Data Table

Common UI uses Input Action Data Tables to create named actions that can be associated with various platform-specific inputs. For examples, see **GenericInputActionDataTable **in Common UI's content folder, or **NavigationInputActionDataTable **in the Content Example project.

Common UI's Input Action Data Tables are not related to the input actions used in Project Settings or the Advanced Input System. They are exclusively used for managing UI input.

- Right-click in the **Content Browser**, then click **Miscellaneous** > **Data Table Asset**.

- Select **CommonInputActionDataBase **as your row structure, then click **OK** to create a new Input Action Data Table. [image: Common Input Action Data Base as the row structure for a new data table]

- To add a new Input Action row, click **Add** in the top bar. [image: Click the Add button to add a row]

- Populate the Input Action with a name and information about which keys activate it.

Input Actions consist of the following parameters:

| **Parameter** | **Description** |
| --- | --- |
| **Display Name** | Name of input action. Displayed in Nav-bar if present. |
| **Hold Display Name** | Name of the input action if it requires the user to hold the button down. |
| **Nav Bar Priority** | Priority used when sorting actions in Nav-bar from left to right. |
| **Keyboard Input Type Info** | Key used for this action when using Mouse & Keyboard, if any. |
| **Default Gamepad Input Type Info** | Key used for this action when using Gamepad, if any. |
| **Gamepad Input Overrides** | Key used for this action on a specific gamepad. Useful for platform-specific button overrides, such as swapping the back and forward buttons for the gamepad on the Nintendo Switch. [image: The A and B buttons on the Switch, switched] |
| **Touch Input Type Info ** | Key used for this action when using a touch interface, if any. |

Common UI widgets map these abstract actions to actual inputs. For example, you can add a data table and row name reference to the **Triggering Input Action** in the **CommonButtonBase **widget. After that, pressing the button associated with that action will activate the Common UI button.

 [image: Defining the triggering input action for a Common UI button]

For fewer version control conflicts, group related sets of actions into their own data tables. For example, put all menu navigation actions into one table together, then put actions for more specialized menus into their own tables as well. After that, create a single composite data table that references those data tables.

## 3. Default Navigation Action Setup

Cardinal navigation is natively supported by Unreal Engine. However, Common UI uses the **Common UI Input Data** asset to define universal **Click **and **Back** input actions that are used across all platforms.

- Create a new **Blueprint Class** in the Content Browser.

- Search for **CommonUIInputData **and click **Select** to create a new Blueprint.

- Assign an appropriate Data Table containing your default **Click** and **Back** actions. [image: Setting up default Click and Back actions]

- Assign this asset to **Project Settings** > **Game** > **Common Input Settings **> **Input Data**. [image: Assigning the default actions in your project settings]

The asset specified above will be loaded by Common UI and used for default navigation. The designated Click button substitutes for mouse clicks when highlighting buttons or other interactable elements, and the designated Back button is universally used for navigating backward from your current menu to a previous one.

## 4. Controller Data Binding (Platform-Specific UI Elements)

**Controller Data Assets **associate key-actions with UI elements. Each Controller Data Asset is associated with an input type, gamepad, and platform. CommonUI uses this information to automatically use the correct platform-specific UI elements based on the current platform and input type. Optionally, for platforms that support multiple input types or unique gamepads, it can also use the user's input to find the correct gamepad and swap its UI elements at runtime.

- Right-click in the **Content Browser** and create a new **Blueprint Class**.

- Search for **CommonInputBaseControllerData **and click **Select **to create a new Controller Data Asset.

- Populate the Controller Data Asset with assets and information about one of the controllers you plan to support. | **Parameter** | **Description** |
| --- | --- |
| **Input Type** | Set this to Gamepad, Mouse and Keyboard, or Touch. |
| **Gamepad Name** | If the controller is a Gamepad, this will be the platform this gamepad corresponds to. The default Gamepad is called **Generic**. |
| **Input Brush Data Map** | Mapping of keys to UI elements and Icons. |
| **Input Brush Key Sets** | Mapping of multiple keys to a single UI element. Useful for D-Pads and other inputs that can potentially map to different axes. |

- Once you have created Controller Data for all inputs you plan to support, these classes must be added to their associated platforms under **Project Settings** > **Game **> **Common Input Settings** > **Platform Input**.

The **Default Gamepad Name** must exactly match the **Gamepad Name** field in one of your Controller Data Assets, otherwise it will not be recognized and its icons will not appear.

Assign each gamepad's data to the **Controller Data **array for its corresponding platform. You can have multiple gamepads associated with a single platform. For example, PC games would typically support a mouse and keyboard Controller Data as well as a generic gamepad. However, you can also add Controller Data for specific gamepad models.

## 5. Common UI Widget Library and Widget Styling

Common UI has a library of widgets, listed under the **Common UI Plugin** section in UMG's **Palette**. Many of these are pieces of UI functionality that are commonly reproduced in many games and applications, including:

- Specialized text blocks for **date / time** and **numeric **values.

- Navigation and visibility aids like **carousels **and **animated switchers**.

- Platform aids like a **loading guard** and a **hardware visibility border**.

- Widgets that provide basic functionality, like buttons and text, but that use style data assets for styling.

None of these widgets have the styling options of their equivalent base UMG widgets. Instead, they reference **Common Style Assets**, making it possible to apply a consistent style across multiple menus and HUDs. Any changes you make to a style asset will take effect on every Common UI widget that uses it.

To make a common style asset:

- Right-click in the **Content Browser **and create a **Blueprint**, then select one of the Common Style classes as the base. [image: The Common Style classes can be Blueprinted]

- Populate its **Details** with the styling information that you want to apply to Common UI widgets. These are typically the same as the styling options on standard UMG widget.

- Assign it to a Common UI widget of the appropriate type. For example, if you create a **Common Text Style** asset, you would assign it to the **Style** field in the Common Text Widget. You can also assign these to the **Template Styles **in **Project Settings** > **Plugins** > **Common UI Editor**.

Any Common UI widgets that you have not manually assigned a style will use the appropriate Template Style instead. This makes it easy to create a global default style for your application.

The **Project Settings **> **Plugins** > **Common UI Framework** menu features several more global assets, including a **Default Throbber Material **that is used in loading screens, and a **Default Image Resource Object** that displays as a placeholder for UI assets that have not been loaded.

- ui
- user interface
- plugin
- umg
- menus
- gamepad
- common ui

On this page

- 1. Viewport Input Routing Setup (-> common-ui-quickstart-guide-for-unreal-engine)
- 2. Creating an Input Action Data Table (-> common-ui-quickstart-guide-for-unreal-engine)
- 3. Default Navigation Action Setup (-> common-ui-quickstart-guide-for-unreal-engine)
- 4. Controller Data Binding (Platform-Specific UI Elements) (-> common-ui-quickstart-guide-for-unreal-engine)
- 5. Common UI Widget Library and Widget Styling (-> common-ui-quickstart-guide-for-unreal-engine)
