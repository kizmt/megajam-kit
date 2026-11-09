# VR Camera and Light Legacy Tools

https://dev.epicgames.com/documentation/en-us/unreal-engine/vr-camera-and-light-legacy-tools?application_version=5.9

> How to use the VR camera and light tools for virtual scouting.

[image: VR Camera and Light Legacy Tools]

The Virtual Scouting Legacy tools (-> virtual-scouting-legacy-tools) described on this page will be sunset and deprecated in a future engine release. We encourage users to move to the new Virtual Scouting tools (-> virtual-scouting-in-unreal-engine). Unused VREditor code and modules will be fully deprecated in a future engine release.

## Viewfinder

With the **Viewfinder** tool you can view the environment through a virtual lens and then spawn a virtual camera in the scene with the same viewport. The initial viewfinder display is only visible to you. For others to see your composition, you can create a camera in the scene easily with this tool. To activate this tool, open the Virtual Scouting menu and select the **Viewfinder** option.

The initial viewport monitor has a few features available from the trackpad or thumbstick on your motion controller.

- The upper-left and upper-right sections of the Vive motion controller's trackpad can be clicked to change the lens: left switches to a shorter lens and right switches to a longer lens.

- Moving the Rift thumbstick left or down switches to a shorter lens and right or up switches to a longer lens. The lens selections are determined by the Lens Kit (-> vr-camera-and-light-legacy-tools).

- The bottom area of the Vive Trackpad or the Rift's B or Y buttons takes a snapshot of the current viewfinder display. This is helpful when wanting to show other users in a Multi-User scouting session with you a particular composition.

- Snapshots are also saved to the Content/Snapshots/[Level Name] folder on your computer. These snapshots can be useful for storyboards or shot planning.

|  |  |
| --- | --- |
|  |  |
| Vive | Oculus Touch |

An example of a snapshot (the image frame on the left) taken from the Viewfinder tool.

## Virtual Camera

To spawn a virtual camera in the scene, press the trigger on your motion controller while the Viewfinder tool is active.

- You can change the lens of the new camera using the same controls as the viewfinder display.

- You can also select and operate the camera with your controller using this tool.

- While you can also operate the camera with the Interaction tool, you won't be able to adjust the lenses unless you use the camera's context menu.

### Camera Context Menu

You can make changes to the camera's settings directly in VR with the Camera Context Menu. Click the menu button on your motion controller while the camera is highlighted to bring up the Context Menu. The settings you can modify on the virtual camera are listed below.

- **Delete**: Removes the camera from the level.

- **Mark**: Spawns a camera location flag at the camera's current position. See the Camera Marks section for more.

- **Focal Length**: Opens an additional HUD with lens options for the camera.

- **F-Stop**: Opens an additional HUD with aperture options that can be used to adjust the focus range on the camera. F-Stop adjustments do not affect exposure.

- **Snapshot**: Takes a snapshot image from the camera's current position.

If using the Focal Length or F-Stop context menu options, click the left or right sections on the Vive motion controller's trackpad or move the Oculus Touch controller's thumbstick to the left or right. This adjusts the camera's settings using what is in the Lens Kit (-> vr-camera-and-light-legacy-tools) settings.

### Camera Monitor

Floating above the virtual camera object when the camera is selected is a camera monitor to show what the camera sees. You can interact with this camera monitor to pin or move it. The following are ways you can interact with the camera monitor:

- On the bottom left of the camera monitor is the Pin button. Selecting this keeps the camera monitor visible even when you deselect the camera or select other objects in the scene.

- On the bottom right of the camera monitor is a toggle button. This option toggles between the camera monitor being locked to the camera or to you. If attached to you, the camera view stays in front of you as you navigate around the scene.

- While the camera monitor is attached to you, you can select the bar underneath the monitor to reposition it. Moving your motion controller moves the camera monitor.

- You can anchor the monitor in its current location and detach from you. To anchor the monitor in the level, select the arrow button to the left of the monitor bar.

### Camera Marks

Use **Camera Marks** to save the position of the camera as well as its lens settings. You can return the camera to this position and these settings at any time to recreate the same shot composition. This feature is also helpful for communicating the start and end position of the camera for a moving shot, such as with a dolly.

You can teleport to the position of a camera mark by opening the **Virtual Scouting** menu and selecting the **Camera Marks** tab on the right panel. Press the trigger on your motion controller when the camera mark to which you want to teleport is highlighted.

### Tripod

With the **Tripod** tool active, you can connect the virtual camera to your motion controller to operate the camera's pan and tilt rotation. The instructions below explain how to activate and use the tool:.

- Open the **Virtual Scouting** menu and select the **Tripod** option to activate this tool. A virtual tripod appears and is connected to your motion controller.

- Press the trigger on your motion controller to have your virtual camera attach to the tripod rig. Your motion controller drives the motion of the tripod, so you cannot detach your controller from the tripod while in this mode.

- Press the trigger on your motion controller again to detach the camera from the tripod. |  |  |
| --- | --- |
|  |  |

### Handheld

With the **Handheld** tool you can connect your virtual camera to your motion controller to operate the camera. This movement tracking includes translations, along with pan, tilt, and roll.

Follow these instructions to activate and use the tool:.

- Open the Virtual Scouting menu and select the Handheld option to activate the Handheld tool. A handheld camera rig appears and is connected to your controller.

- Press the trigger on your motion controller to have a virtual camera attach to the handheld camera rig. Your motion controller drives the motion of the rig, so you cannot detach your controller from the rig while in this mode. |  |  |
| --- | --- |
|  |  |

- Press the trigger on your motion controller again to detach the camera from the tripod.

### Dolly

With the **Dolly** tool active, you can create a dolly track in VR and have the virtual camera move along the track. Open the **Virtual Scouting** menu and select the **Dolly** option to activate the tool.

- When using the Vive motion controller to add dolly points to the level, click the top section on the trackpad. After two or more points have been created, click the bottom section of the trackpad to spawn the rails into the level.

- When using the Oculus Touch controller to add dolly points to the level, press the B or Y button. After two or more points have been created, press down on the thumbstick to spawn the rails into the level. |  |  |
| --- | --- |
|  |  |
| Vive | Oculus Touch |

- After the rails have been spawned, the dolly points can be edited to adjust the shape and path of the track. To edit the dolly points, select a dolly point and press the trigger on the motion controller.

In order to connect cameras to the dolly track, you must parent the camera to the rails in the Editor. This cannot be done in VR.

You can drive the position of the camera along the track with a custom Blueprint setup. With this custom setup, you can move the virtual camera using a physical dolly tracked in three-dimensional space.

## Using the VR Camera

### Mounting the Motion Controller to a Real Camera Rig

You can mount your motion controller onto a real tripod or handheld rig when using the Tripod and Handheld tools. This way, if desired, when you move your real tripod or handheld rig you can have more realistic camera motions using professional equipment.

To account for the variance of mounting positions of your motion controller to your physical rig, you can adjust the pivot point between your motion controller and the virtual camera.

- With the virtual camera attached to the rig, use the Interaction tool with your other motion controller to select the camera with the interaction pointer.

- Hold down the trigger on your motion controller to reposition the pivot point on the rig.

- Release the camera with the Interaction tool to save the new pivot point for the virtual camera on the rig.

### Camera Viewfinder and UI Panel Brightness

You can adjust the brightness on your viewfinder or camera monitor if it is too bright or dark by following these steps.

- Navigate to **Edit > Editor Preferences**.

- Select **VR Mode**.

- On the VR Mode settings page, modify the **UI Panel Brightness** setting.

### Camera Operating and Gizmos

Manipulating the camera in a single axis is easier with the Transform Gizmo enabled. You may find it preferable to disable the Transform Gizmo if you plan to operate the camera directly with your motion controller.

|  |  |
| --- | --- |
|  |  |
| With Transform Gizmo enabled | With Transform Gizmo disabled |

### How to Change the Camera Filmback

Any virtual camera added to the level with the Viewfinder tool is going to have a set of film backs that can be used on that camera. You can edit the list of film back options and aspect ratio for each.

- Open your project's Engine > Config > DefaultEngine.ini file in a text editor.

- Edit the options in the FimbackPresets array.

- Edit the DefaulFilmbackPresetName to change the default film back for the Viewfinder tool.

If the preset values are edited, it is recommended to distribute that DefaultEngine.ini to any other machines that are going to be used together for a Multi-User Virtual Scouting session.

### How to Change Lens Kit Information

Any virtual camera added to the level with the Viewfinder tool is going to have a set of lenses that can be used on that virtual camera. You can add to or edit this list of lenses that the virtual camera can use while Virtual Scouting.

- Open your project's **Engine > Config > DefaultEngine.ini** file in a text editor.

- Edit the options in the **LensPresets** array.

- Edit the **DefaultLensPresetName** within the lens kit array to change the default lens for the Viewfinder tool.

Prime and Zoom lenses can be defined but the Viewfinder tool will only switch between the possible Prime lens options.

## Gaffer

With the **Gaffer** tool, you can spawn a light in your scene. You can move and adjust this light as if it were a real light on set.

- Open the Virtual Scouting menu and select the Gaffer option to activate the Gaffer Tool.

- Press the trigger on your motion controller to make a light appear in your level.

- Move your motion controller inside the light's collision layer to make moving and rotating the light more natural.

- You can adjust the spread and brightness of the light using the trackpad on your Vive motion controller or the thumbstick on your Oculus Touch controller. The top section of the trackpad or thumbstick makes the light brighter and the bottom section of the trackpad or thumbstick makes the light dimmer.

- The left section of the trackpad or thumbstick widens the spread and the right section of the trackpad or thumbstick narrows the spread.

|  |  |
| --- | --- |
|  |  |
| Vive | Oculus Touch |

### Light Context Menu

Using the **Light Context Menu** you can edit the light's intensity and spread as well as settings for the light's temperature. To view the Light Context Menu, select the light and press the **Menu** button on your motion controller.

|  |  |
| --- | --- |
|  |  |

Click down on the trackpad or thumbstick to select the options in the menu. This opens a HUD with the following settings. Choose an option in the HUD using the trackpad or thumbstick.

- **Delete**: Removes the selected light from the scene.

- **Intensity**: Brings up an additional HUD with Brightness options for the light.

- **Spread**: Brings up an additional HUD with throw angle options for the light. These are visible from the angle of the panels attached to the light.

- **Temperature**: Brings up an additional HUD with color temperature options in Kelvin for the light.

- **Duplicate**: Spawns a copy of the light in the scene.

- virtual scouting

On this page

- Viewfinder (-> vr-camera-and-light-legacy-tools)
- Virtual Camera (-> vr-camera-and-light-legacy-tools)
- Camera Context Menu (-> vr-camera-and-light-legacy-tools)
- Camera Monitor (-> vr-camera-and-light-legacy-tools)
- Camera Marks (-> vr-camera-and-light-legacy-tools)
- Tripod (-> vr-camera-and-light-legacy-tools)
- Handheld (-> vr-camera-and-light-legacy-tools)
- Dolly (-> vr-camera-and-light-legacy-tools)
- Using the VR Camera (-> vr-camera-and-light-legacy-tools)
- Mounting the Motion Controller to a Real Camera Rig (-> vr-camera-and-light-legacy-tools)
- Camera Viewfinder and UI Panel Brightness (-> vr-camera-and-light-legacy-tools)
- Camera Operating and Gizmos (-> vr-camera-and-light-legacy-tools)
- How to Change the Camera Filmback (-> vr-camera-and-light-legacy-tools)
- How to Change Lens Kit Information (-> vr-camera-and-light-legacy-tools)
- Gaffer (-> vr-camera-and-light-legacy-tools)
- Light Context Menu (-> vr-camera-and-light-legacy-tools)
