# Setting Up Virtual Scouting

https://dev.epicgames.com/documentation/en-us/unreal-engine/setting-up-virtual-scouting-in-unreal-engine?application_version=5.9

> An overview of the new Virtual Scouting tools and the prerequisites for using them.

This guide covers how to set up your headset to use the Virtual Scouting tools. For an overview of Virtual Scouting, refer to Virtual Scouting (-> virtual-scouting-in-unreal-engine).

To use Virtual Scouting, you must set up a compatible VR headset, as well as the OpenXR runtime provider. Then, you can create an Unreal Engine project and enable the Virtual Scouting plugin.

## Set Up Your VR Headset

Virtual Scouting supports the following VR headsets:

- Oculus Rift S

- Meta Quest 2

- Meta Quest Pro

- Meta Quest 3

- Valve Index

### Oculus and Meta Headsets

To set up your Oculus or Meta headset, you must install and start the Oculus Desktop. For install instructions, see Meta's Install the Oculus PC app for Meta Quest Link documentation.

When you start the Oculus Desktop and put on the headset, you should see a generic controller model.

 [image: A generic controller model.]

All of the button maps for Oculus and Meta devices are identical between the different headsets and their respective controllers. Button maps are the inputs that connect a controller button to an action.

#### Meta Quest Link - Cable

If you are using a USB-C cable, you must use the Meta Quest Link to connect to your Meta headset. For more information, see Meta's Set up Meta Quest Link documentation.

#### Meta Quest Link - Wireless

To wirelessly connect your Meta headset to your PC, you must use the Meta Quest AirLink. For more information, see Meta's Connect Meta Quest to your PC over Wi-Fi with Air Link documentation.

#### SteamLink with Quest

You can connect your Meta headset to the SteamVR PC desktop software using the SteamLink app. For more information about the app and how to access it, see Steam Link on Meta Quest in the Meta store.

For best results, set up a dedicated wireless router connected by ethernet to your PC, and ensure that both the headset and router are in the same room. The quality and effectiveness of the wireless stream in VR is affected by the quality of the wireless network connectivity.

### Valve Index

Virtual Scouting supports the Valve Index headset and Index Knuckle Controllers.

 [image: The Valve Index Knuckle Controllers.]

To set up your Valve Index headset, open the Steam client on your PC and start the SteamVR app.

Check the SteamVR window to confirm your headset and controllers are connected in the UI. You should see an icon for each of the following components:

- the headset

- the left controller

- the right controller

- any tracking cameras in your system

 [image: The SteamVR window showing a connected headset, left and right controllers, and two cameras.]

### Set Up OpenXR Runtime Provider

If you are using a Meta or Oculus headset, ensure the Meta Quest Link desktop software is set to be your OpenXR provider.

To set the Meta Quest Link desktop software as your OpenXR provider, follow these steps:

- Open the Meta Quest Link desktop software.

- Click **Settings** > **General** > **OpenXR Runtime** > **Set Meta Quest Link as act…**

 [image: The Meta Quest desktop settings dialog]

If you are using a Valve Index headset or a Meta Headset with the SteamLink app, ensure SteamVR is set to be your OpenXR provider.

To set SteamVR as your OpenXR the provider, follow these steps:

- Open SteamVR.

- In the system tray, click **Settings**.

- In the settings dialog that opens, click **OpenXR** > **Set SteamVR as OpenXR Runtime**.

 [image: The SteamVR OpenXR settings dialog]

### Confirm VR Rendering & Streaming

To confirm the Unreal Editor will render and stream to your headset, check that you can see one of the following scenes in your VR headset.

 [image: The Meta Link PC desktop view]

The Meta Link PC desktop view

 [image: The SteamVR PC desktop view]

The SteamVR desktop view

## Set Up Virtual Scouting in an Unreal Engine Project

### Enable the Virtual Scouting Plugin

To enable the Virtual Scouting Plugin, follow these steps:

- Create a blank project in Unreal Engine.

- In the top toolbar, click **Edit** > **Plugins**.

- In the **Plugins** menu window, search for "Virtual Scouting" and enable the plugin. [image: The Virtual Scouting plugin]

- Click **Yes** in the dialog popup and restart the engine.

#### VR Considerations

##### Remove VR Game Input Mappings

If you are using a project that already has VR Enhanced Input Actions pre-set, such as the VR Game template, you must remove all of these for Virtual Scouting to work correctly.

To remove VR Game Input Mappings, follow these steps:

- Click **Edit** > **Project Settings** > **Engine**.

- Expand the **Enhanced Input** category.

- Next to the **Default Map Contexts** header, click the delete icon.

 [image: The Enhanced Input project settings]

##### Rendering Considerations

Instance culling is not supported in VR. If your project has instance culling enabled (as it is in the City Sample project), then you must disable it with the console variable `r.InstanceCulling.OcclusionCull=0`. To learn more about culling, see Visibility and Occlusion Culling Reference (-> visibility-and-occlusion-culling-reference-in-unreal-engine).

**Lumen** and **Nanite** work in VR but, as of Unreal Engine 5.4, there is a significant performance demand when using Lumen. You may need to lower your project’s scalability settings to improve performance. You can lower screen percentage to improve performance but this will be at the expense of rendering artifacts, especially on text elements such as the VR Palette Menu.

##### Post Process Alpha Channel Support

To launch Virtual Scouting, you must disable alpha channel support for post-processing. Go to **Project Settings** > **Engine** > **Rendering** > **Default Settings**, then set **Alpha Output** to **False**.

##### Outline Stencil Support

The Virtual Scouting tools use stencil materials to draw outlines on objects (see Content Placement Tool (-> using-the-virtual-scouting-tools-in-unreal-engine)). To enable outline stencils, go to **Project Settings** > **Engine** > **Rendering** and set **Custom Depth-Stencil Pass** to **Enabled with Stencil**.

### Project and User Settings

The Virtual Scouting Plugin has its own project and user settings, as well as plugin settings. You can also change the handedness of your VR controllers in the XRCreative Editor settings.

#### Project Settings

You can access the plugin settings from **Project Settings** > **Plugins** > **Virtual Scouting Settings**. These settings affect the project for all users if checked into a version control system.

 [image: Project Settings]

These settings include parameters that control the Virtual Scouting toolset, such as the unit system to use for measurements and the viewfinder exposure parameters.

If you modify the unit system, existing measurements retain their values stored in the previous measurement system until they are updated. New measurements automatically reflect the current state of the project settings.

#### User Settings

You can access the user settings from **Project Settings** > **Plugins** > **Virtual Production Editor** > **Legacy Virtual Scouting**. These settings are saved per user with your project’s data. They control the user’s preference for movement speed and tooltip visibility. You can modify these settings both in the editor and while you are in VR.

 [image: User Settings]

#### XRCreative Editor Settings

You can access the XRCreative Editor settings from **Edit** > **Editor Preferences** > **XRCreative Editor Settings**.

 [image: XRCreative Editor Settings]

The XRCreative Editor setting **Handedness** defines which hand your tools spawn into. You cannot change this setting while in VR.

By default, **Handedness** is set to **Right**. Left-handed mode is an exact mirrored control set, swapping functionality between hands.

### Setting the VR mode

To set the VR mode for Virtual Scouting, on the main toolbar, next to the VREditor button, click the **ellipses (...)** dropdown.

 [image: VREditor Button and Mode selection drop down]

Ensure the Scouting Default mode is selected. To learn more about the customization of VREditor modes, see Create a New XR Creative Mode and Toolset (-> customizing-virtual-scouting-in-unreal-engine).

### Launch Into VR

To start the Virtual Scouting toolset and view your level in VR, click the VREditor button.

 [image: VREditor Button on Main Toolbar]

To learn more about using the Virtual Scouting toolset, see Using the VR Tools (-> using-the-virtual-scouting-tools-in-unreal-engine).

- virtual scouting
- instruction

On this page

- Set Up Your VR Headset (-> setting-up-virtual-scouting-in-unreal-engine)
- Oculus and Meta Headsets (-> setting-up-virtual-scouting-in-unreal-engine)
- Meta Quest Link - Cable (-> setting-up-virtual-scouting-in-unreal-engine)
- Meta Quest Link - Wireless (-> setting-up-virtual-scouting-in-unreal-engine)
- SteamLink with Quest (-> setting-up-virtual-scouting-in-unreal-engine)
- Valve Index (-> setting-up-virtual-scouting-in-unreal-engine)
- Set Up OpenXR Runtime Provider (-> setting-up-virtual-scouting-in-unreal-engine)
- Confirm VR Rendering & Streaming (-> setting-up-virtual-scouting-in-unreal-engine)
- Set Up Virtual Scouting in an Unreal Engine Project (-> setting-up-virtual-scouting-in-unreal-engine)
- Enable the Virtual Scouting Plugin (-> setting-up-virtual-scouting-in-unreal-engine)
- VR Considerations (-> setting-up-virtual-scouting-in-unreal-engine)
- Remove VR Game Input Mappings (-> setting-up-virtual-scouting-in-unreal-engine)
- Rendering Considerations (-> setting-up-virtual-scouting-in-unreal-engine)
- Post Process Alpha Channel Support (-> setting-up-virtual-scouting-in-unreal-engine)
- Outline Stencil Support (-> setting-up-virtual-scouting-in-unreal-engine)
- Project and User Settings (-> setting-up-virtual-scouting-in-unreal-engine)
- Project Settings (-> setting-up-virtual-scouting-in-unreal-engine)
- User Settings (-> setting-up-virtual-scouting-in-unreal-engine)
- XRCreative Editor Settings (-> setting-up-virtual-scouting-in-unreal-engine)
- Setting the VR mode (-> setting-up-virtual-scouting-in-unreal-engine)
- Launch Into VR (-> setting-up-virtual-scouting-in-unreal-engine)
