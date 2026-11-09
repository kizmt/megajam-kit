# Adding nDisplay to an Existing Project

https://dev.epicgames.com/documentation/en-us/unreal-engine/adding-ndisplay-to-an-existing-project-in-unreal-engine?application_version=5.9

> Describes how to set up any existing Project to be ready for nDisplay.

[image: Adding nDisplay to an Existing Project]

You don't have to use the nDisplay Template Project in order to render through nDisplay. If you already have a different Project set up with your content, you can adjust that Project so that it can take advantage of nDisplay.

To set up an existing Project to use nDisplay:

- Enable the nDisplay plugin. In the Unreal Editor, choose **Edit > Plugins** from the main menu. Search for "nDisplay", and check the **Enabled** checkbox.

- Enable nDisplay for your Project. Choose **Edit > Project Settings** from the main menu, and find the **Plugins > nDisplay** section. Check the **Enabled** checkbox.

- Restart the Unreal Editor and reopen your Project.

- Drag and drop the previously-generated config file (.cfg or .ndisplay) into your **Content Browser**. It will be automatically converted to a **UAsset**. Alternatively, add a new **nDisplay Config** UAsset, found in the **nDisplay** media category in the Content Browser

- Continue on with the rest of the setup instructions in the Quick Start Guide (-> ndisplay-quick-start-for-unreal-engine).

- rendering
- vfx
- graphics
- guide
- ndisplay
