# Editor Utility Widgets

https://dev.epicgames.com/documentation/en-us/unreal-engine/editor-utility-widgets-in-unreal-engine?application_version=5.9

> An overview and usage instructions for Editor Utility Widgets.

[image: Editor Utility Widgets]

Learn to use this **Beta** feature, but use caution when shipping with it.

If you want to modify the User Interface (UI) of the **Unreal Editor**, you can use **Editor Utility Widgets** to add new UI elements. Editor Utility Widgets are based on **Unreal Motion Graphics** (UMG), so you can set up Widgets in a Blueprint like you would for any other UMG Widget Blueprint.

These Widgets are specifically for the Editor UI, and you can use them to create custom Editor tabs. You can then select these custom tabs from the Windows menu, like you would select existing Editor tabs.

## Create an Editor Utility Widget

- Right-click in the **Content Browser** and select **Editor Utilities > Editor Utility Widget**. [image: Add Editor Utility Widget asset]

- Name your Editor Utility Widget Asset. In this example, the Asset is named **TestEditorUtility**. Double-click the **Editor Utility Widget Asset** to open the Widget Blueprint for editing. [image: Name your Editor Utility Widget Asset]

- Edit your Widget Blueprint as needed.

- Right-click the **Editor Utility Widget Asset** and select **Run Editor Utility Widget** to open an Editor tab with your Editor Utility displayed. The tab is only dockable with Level Editor tabs. [image: Run Editor Utility Widget]

- Once you have run the Editor Utility Widget, it appears in the Level Editor's **Tools** dropdown, under the **Editor Utility Widgets** category. [image: Test Editor Utility]

- beta
- umg ui designer
- blutilities
- editor utility

On this page

- Create an Editor Utility Widget (-> editor-utility-widgets-in-unreal-engine)
