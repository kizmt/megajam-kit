# Live Link Hub UI Reference

https://dev.epicgames.com/documentation/en-us/unreal-engine/live-link-hub-ui-reference-for-unreal-engine?application_version=5.9

> Learn how to use the Live Link Hub UI

This reference provides information about the layout and functionality of each panel in the Live Link UI

## Live Link Hub UI

[image: Live Link Hub main UI]

- **Data Devices**: Clicking on an individual device loads its details in the Details panel below.

- **Details** - **Source Details**: Use the panel to modify a source’s properties. - **Device Details**: Use this panel to modify a device’s properties. - **Subject Details**: Use this panel to modify a subject’s data with **Translators**, **Pre-processors**, and **Remappers**.

- **Recording List**

- **Clients**: Clicking to highlight a source will list its details in the panel below.

- **Client Details**: A read-only list of a client’s IP, Hostname, UE Project Name, and the level open when first connected to Live Link Hub.

- **Layout Dropdown**: Use this to switch between UI layouts.

- **Session**, **Slate, **and **Take **input

- **Record** button

- **Timecode**

- **Media Profile**: Open the media profile to view media and timing settings.

- **Settings** and **Plugins**:  Jump to the settings dialog.

- **Hub Mode**: Switch between spoke and hub.

- **Current Config Name**: The saved name of the currently loaded config.

## Devices

Devices are defined as external sources of data that DO NOT send real time animation. Live Link Hub comes with the following devices:

### Live Link Face

The Live Link Face device enables downloading of recorded media from the Live Link Face application on Android and iOS. It also provides a way for Live Link Hub to trigger recording on the connected phone.

### OBS Studio

The OBS Studio device enables Live Link Hub to control the recording of a connected OBS session. You can also override the file name of the recording with the slate and take from Live Link Hub.

### Unreal

The Unreal device connects to an editor client and gives either the Editor or Live Link Hub a way to control recording.

For documentation on devices for ingesting offline video file, see Capture Manager Devices (-> capture-manager-devices).

## Subject Details

### Outbound Name

You can modify the name of a subject. The modified outbound name will be what is received in the connected clients.

[image: The Outbound Name field]

### Translators

Translators provide a way for you to mutate animation role data into transform role data and vice versa.

Animation to Transform is a way for you to pick a single bone from an animation role’s hierarchy and stream just that bone’s transform. Transform Roles can be consumed by Live Link Controllers and Blueprints.

[image: Animation to Transform translator]

Transform to Animation takes a transform and reformats it as a single bone hierarchy. Animation roles can be consumed by Anim Instances

[image: Transform to Animation translator]

### Pre-processors

Pre-processors provide a way for you to modify all data flowing through a role. You can swizzle axes, add a world-space offset and/or rotation.

[image: Pre-processor swapping coordinate systems]

### Live Link Remappers

Live Link Remappers are code-only assets that provide a way for plugin developers to remap data in the same way as ULive LinkRetarget and ULive LinkRemap assets do in UE. Developers can provide users with bone name remapping and conversion functions (for example, Quaternion rotation to Euler rotation conversion.)

[image: Selecting a Live Link Remapper]

## Clients

Clients are the Unreal Engine sessions Live Link Hub is or has been connected to in the current session. You can add clients by navigating to the **Add Client** button. You can remove a client by clicking to highlight it and pressing delete on your keyboard.

[image: Add a client in the Clients panel]

## Virtual Subjects

Virtual subjects let you merge two or more subject’s data into a single subject for consumption in Unreal Engine.

To create a virtual subject, navigate to **Add Source** and select **Add Virtual Subject**.

### Attachments

A `LiveLinkHubAnimationVirtualSubject` provides a way for you to merge skeletal data and also reparent bones in the hierarchy using **Attachments**.

To create an attachment, add an entry to the attachments array in the details of a `LiveLinkHubAnimationVirtualSubject`:

[image: Adding an entry to the Attachments array]

In this entry you must define the parent subject and the bone to attach to, the child subject and the bone to be attached and any offsets you need.

If you have a system with separate motion capture gloves and body hardware, you can use attachments to merge the two subjects into a single subject and apply that to a skeletal mesh in Unreal Engine.

> **note:** You will need a skeleton that is compatible with the merged bone hierarchy.

## Sync Parent

On a source you can set the Sync Parent and this will retime all of the data coming from that source. For example, this means you can take a 60fps source and retime it to 30fps. The Sync Parent’s frame rate will define the frame rate for all of a source’s subjects.

[image: Sync subject with 24 fps default rate and no timecode]

[image: Sync subject retimed with timecode embedded]

## Plugins

Many third-party manufacturers of motion capture hardware publish Live Link plugins. These plugins (which can be loaded into an Unreal Engine project) can also be accessed by Live Link Hub.

Plugins you acquire from Fab are installed here:

```cpp_programming
…/Engine/Plugins/Marketplace/…
```

If you are using UEFN or have a plugin installed in a non-default location, you can load your plugin into Live Link Hub by the following these steps:

- Open the **Plugin Browser** window.

- Click **Plugin Directories**

- Add an entry to the **User Plugin Directories** array. The entry should point to a folder containing the plugin(s) you want to access. > **note:** Only uplugins with the `"SupportedPrograms": [ "Live Link Hub" ]` property will be Loaded.

- Restart Live Link Hub.

- The plugin’s sources will be available from the **Add Source** button. [image: PLugin sources available in the Add Source dropdown]

The list of External Directories is saved in an INI file, in the following location:

```cpp_programming
%LocalAppData%\UnrealEngine\LiveLinkHub\Config\LiveLinkHubPlugins.ini
```

## Saved Configurations

Live Link Hub allows users to save the state of the sources, subjects and clients. To load a previously saved config, go to **File** > **Open Config…**

To save a config, navigate to **File** > **Save Config**.

Selecting **New Config** will clear all the sources, subjects, and clients, as if the application has just been started.

Live Link Hub configs are stored as `.json` files. They are human-readable and can be opened and edited in a text editor.

## Live Link Hub Settings

To access the settings of Live Link Hub navigate to the **Settings** button and choose settings from the drop-down.

## Recording Live Link Data

Live Link Hub lets you record the raw data stream for easy playback. This feature is intended as a back-stop against data-loss and for easy QA of motion capture processes without needing to run all the hardware for QA and development tasks.

### Record

To begin recording simply press the record button. To end the recording press the same button again.

### Naming Tokens

When you save you will be prompted to give a file name. To automatically populate this filename you can set a filename template. Go to **Settings** > **Live Link Hub**. In the template section you can define a string that will generate the filename.

The session name, slate name, and take are defined on the top bar of the UI

[image: Defining the file name template]

### Playback

To play a recording back, navigate to the **Playback** tab. Double-click on a recording to load it. All your current sources are temporarily removed and replaced by virtualized Sources and Subjects from your recording.

The play controls at bottom of the Recording panel provide ways for you to play, pause, and scrub.

You can duplicate, rename, and open a recording file’s location on disk using the right-click menu.

### Timing and Sync Settings

[image: Live Link Hub Timing and Sync settings]

You can use the **Timing and Sync settings** to determine whether Live Link Hub will automatically set a Timecode Provider and Custom Timestep (also referred to as Framelock or Genlock) on connected Unreal Editor clients. The default behavior is to not push this message to connected editor clients.

The supported types for Timecode Provider are:

- Live Link Timecode Provider

- System Timecode Provider

The supported types for Timestep Provider are:

- Live Link Custom Timestep

- Timecode Custom Timestep

Evaluation mode determines the Evaluation Mode in the Live Link panel of connected Unreal clients. The best practice for synchronizing multiple sources of Live Link animation data is to use timecode. However, not all Live Link Sources carry timecode data so the default is Engine Time.

### Media Profile

[image: Live Link Hub Media Profile user interface]

- Timecode Settings

- Timestep (Framelock) settings

- Media Source and Outputs

- Timecode and Genlock

- Video Media Preview

You can use Live Link Hub’s media profile to control the timecode and timestep of connected editors. Use this functionality to ensure all recording devices are using the same timing information.

> **note:** Live Link Hub cannot itself accept a custom timestep. It will always run at the vsync defined framerate, usually 60hz. You will always see the “No custom time step configured” message.
