# Sound Cue Editor UI

https://dev.epicgames.com/documentation/en-us/unreal-engine/sound-cue-editor-ui-in-unreal-engine?application_version=5.9

> A reference guide for the components of the Sound Cue Editor Interface.

[image: Sound Cue Editor UI]

The **Sound Cue Editor** is divided into the following regions:

 [image: Sound Cue Editor Overview]

- Menu Bar (-> sound-cue-editor-ui-in-unreal-engine)

- Toolbar (-> sound-cue-editor-ui-in-unreal-engine)

- Details Panel (-> sound-cue-editor-ui-in-unreal-engine)

- Viewport Panel (-> sound-cue-editor-ui-in-unreal-engine)

- Palette Panel (-> sound-cue-editor-ui-in-unreal-engine)

You can close any panel by clicking the small "X" in the upper-right corner of the tab. To reopen a panel that you have closed, click that panel's name on the **Window** menu.

You can also hide any tab by right-clicking on the tab, and then clicking **Hide Tab** on the context menu that appears. Likewise, you can show any hidden tab by clicking the little blue arrow in the top left order of the panel.

## Menu Bar

**File**

- **Open Asset…** - Displays the **Open Asset** panel to quickly find an asset and open the appropriate editor.

- **Save All** - Saves all unsaved levels and assets for your project.

- **Choose Files to Save…** - Brings up a dialog box that allows you to choose which levels and assets you want to save for your project.

- **Save** - Saves the current asset.

- **Save As…** - Saves the current asset under a different name or location.

**Edit**

- **Undo** - Undoes the most recent action.

- **Redo** - Redoes the most recent Undo, if it was the last action taken.

- **Undo History** - Displays the **Undo History** panel.

- **Editor Preferences…** - Displays the **Editor Preferences** panel, where you can modify your Unreal Editor preferences.

- **Project Settings…** - Displays the **Project Settings** panel, where you can modify various settings for your Unreal Engine project.

- **Plugins** - Displays the **Plugins** panel, where you can control the active plugins for your Unreal Engine installation.

**Asset**

- **Find in Content Browser…** - Locates and selects the current asset in the **Content Browser**.

- **Reference Viewer…** - Displays the **Reference Viewer** panel, where you can see reference information for the current asset.

- **Size Map…** - Displays the **Size Map** panel, where you can see size information for the current asset.

- **Audit Assets…** - Displays the **Asset Audit** panel.

- **Shader Cook Statistics…** - Displays the **Statistics** panel with the Shader Cook Stats filter applied.

**Window**

- **Viewport** - Displays the **Viewport** panel.

- **Details** - Displays the **Details** panel.

- **Palette** - Displays the **Palette** panel.

- **Content Browser** - Brings up the **Content Browser** in a separate window.

- **Device Output Log** - Displays the **Device Output Log** panel.

- **Interchange Results Browser** - Displays the **Interchange Results Browser** panel.

- **Message Log** - Displays the **Message Log** panel

- **Output Log** - Displays the **Output Log** panel.

- **Open Marketplace** - Opens the Unreal Engine Marketplace.

- **Load Layout** - Loads the selected panel layout.

- **Save Layout** - Saves the current layout of the panels as the new default layout.

- **Remove Layout** - Removes the selected layout from the Unreal Editor.

- **Enable Fullscreen** - Enables fullscreen mode for the application, expanding across the entire monitor.

**Tools**

- **New C++ Class…** - Opens a dialog where you can create a new C++ class for your project.

- **Refresh Visual Studio Project** - Refreshes your Visual Studio C++ project.

- **Open Visual Studio** - Opens your C++ code in Visual Studio.

- **Find in Blueprints** - Displays the **Find in Blueprints** panel.

- **Cache Statistics** - Displays the **Cache Statistics** panel.

- **Class Viewer** - Displays the **Class Viewer** panel.

- **CSV to SVG** - Displays the **CSV to SVG** panel.

- **Localization Dashboard** - Displays the **Localization Dashboard** panel.

- **Merge Actors** - Displays the **Merge Actors** panel.

- **Project Launcher** - Displays the **Project Launcher** panel.

- **Resource Usage** - Displays the **Resource Usage** panel.

- **Session Frontend** - Displays the **Session Frontend** panel.

- **Struct Viewer** - Displays the **Struct Viewer** panel.

- **Virtual Assets** - Displays the **Virtual Assets** panel.

- **Debug** - Acts as a container folder for the below options. **Blueprint Debugger** - Displays the **Blueprint Debugger** panel.

- **Collision Analyzer** - Displays the **Collision Analyzer** panel.

- **Debug Tools** - Displays the **Debug Tools** panel.

- **Modules** - Displays the **Modules** panel.

- **Niagara Debugger** - Displays the **Niagara Debugger** panel.

- **Pixel Inspector** - Displays the **Pixel Inspector** panel.

- **Stylus Input Debug** - Displays the **Stylus Input Debug** panel.

- **Visual Logger** - Displays the **Visual Logger** panel.

- **Widget Reflector** - Displays the **Widget Reflector** panel.

- **Profile** - Acts as a container folder for the below options. **Profile Data Visualizer** - Displays the **Profile Data Visualizer** panel.

- **Trace Data Filtering** - Displays the **Trace Data Filtering** panel.

- **Audit** - Acts as a container folder for the below options. **Asset Audit** - Displays the **Asset Audit** panel.

- **Material Analyzer** - Displays the **Material Analyzer** panel.

- **Platforms** - Acts as a container folder for the below options. **Device Manager** - Displays the **Device Manager** panel.

- **Device Profiles** - Displays the **Device Profiles** panel.

- **View Changelists** - Opens a dialog which displays the current changelists.

- **Submit Content** - Opens a dialog with check in options for content and levels.

- **Connect to Source Control…** - Brings up a dialog box that allows you to choose or interact with a source-control system that the Unreal Editor can integrate with.

- **Run Unreal Insights** - Runs the **Unreal Insights** standalone application.

**Help**

- **SoundCue Editor Documentation** - Opens the **SoundCue Editor** documentation page.

- **Documentation Home** - Opens the Unreal Engine documentation home page.

- **C++ API Reference** - Opens the C++ API Reference documentation page.

- **Console Variables** - Opens the Console Variables and Commands documentation page.

- **Online Learning** - Opens the Epic Developer Community site, which provides video tutorials and guided learning paths.

- **Forums** - Opens the Unreal Engine Forums site.

- **Q&A** - Opens the Q&A section of the Unreal Engine Forums site.

- **Support** - Opens the Unreal Engine Support site.

- **Report a Bug** - Opens the Unreal Engine Bug Submission Form page.

- **Issue Tracker** - Opens the Unreal Engine Issues page.

- **About Unreal Editor** - Opens a dialog with information about the installed Unreal Editor.

- **Credits** - Opens a dialog which displays the credits for the installed Unreal Engine version.

- **Visit UnrealEngine.com** - Opens UnrealEngine.com in a browser window.

## Toolbar

| **Button** | **Description** |
| --- | --- |
| [image: Toolbar Save Button] | Saves the current Sound Cue. |
| [image: Toolbar Browse Button] | Finds and selects the current Sound Cue in the Content Browser. |
| [image: Toolbar Solo Button] | Mutes all other sound sources except for the current Sound Cue. |
| [image: Toolbar Mute Button] | Mutes the current Sound Cue. |
| [image: Toolbar Play Cue Button] | Plays the entire Sound Cue. |
| [image: Toolbar Play Node Button] | Plays only the currently selected node in the Viewport panel. Only available while a single node is selected. |
| [image: Toolbar Stop Button] | Stops playing the Sound Cue or node. |

## Details Panel

 [image: Sound Cue Editor Details Panel]

The **Details** panel displays the properties of the currently selected node. If multiple nodes are selected, the **Details** panel displays only the properties that the nodes have in common.

## Viewport Panel

 [image: Sound Cue Editor Viewport Panel]

The **Viewport** panel contains the Sound Node Graph, which displays the audio signal path with wire-connected Sound Nodes which manipulate the signal as data flows through the Sound Cue.

For general information about the **Sound Cue Editor** and working with the Sound Node Graph, see the Sound Cue Editor (-> sound-cue-editor-in-unreal-engine) documentation.

## Palette Panel

 [image: Sound Cue Editor Palette Panel]

The **Palette** panel lists all of the available Sound Node types available for Sound Cues. You can add a node to a Sound Node Graph by dragging one of the types from the list in **Palette** panel into the **Viewport** panel.

For information about Sound Node types and their properties, see the [Sound Cue Reference] (working-with-audio/sound-sources/sound-cues/sound-cue-reference) documentation.

- audio
- sound
- sound cues

On this page

- Menu Bar (-> sound-cue-editor-ui-in-unreal-engine)
- Toolbar (-> sound-cue-editor-ui-in-unreal-engine)
- Details Panel (-> sound-cue-editor-ui-in-unreal-engine)
- Viewport Panel (-> sound-cue-editor-ui-in-unreal-engine)
- Palette Panel (-> sound-cue-editor-ui-in-unreal-engine)
