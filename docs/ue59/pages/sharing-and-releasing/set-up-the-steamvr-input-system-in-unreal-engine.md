# Set Up the SteamVR Input System

https://dev.epicgames.com/documentation/en-us/unreal-engine/set-up-the-steamvr-input-system-in-unreal-engine?application_version=5.9

> Setting up Unreal Engine to work with the SteamVR Input system.

[image: EditDefaultUE4Bindings.png]

The Unreal Engine 4 input action and event system now contains experimental support for the SteamVR Input ystem. Users can use the SteamVR Input system to build binding configurations for their favorite games, even for controllers that didn't exist when the game was written. Once enabled, actions and axis mappings defined in the UE4 Input settings can be bound to devices in the SteamVR binding editor utility.

For more information, see Steam's initial announcement of the SteamVR Input system: Controllers Controllers Controllers: Introducing SteamVR Input

In order to preserve backward compatibility with existing projects, support for the new SteamVR Input system is disabled by default.

## Steps

- The new SteamVR Input system is not compatible with existing projects, so it must be explicitly enabled. To enable SteamVR Input, set the console variable vr.SteamVR.EnableVRInput to 1 in the Unreal Engine **ConsoleVariables.ini** file (\Engine\Config\ConsoleVariables.ini). Click for full image.

- Under **Project Settings > Engine > Input > Bindings**, set up Action and Axis Mappings for the input actions that you want to handle. Click for full image. The actual keys assigned to the **Input Action and Axis Mappings** do not matter, as long as some keys are bound to each action and axis, as the final key binding is done in SteamVR through the **Input Bindings**.

- Save the settings, and restart both SteamVR and the Unreal Editor. While SteamVR is stopped, you may also need to edit C:\Program Files (x86)\Steam\config\steamvr.vrsettings to remove the block caching the action manifest settings generated for the Unreal Editor.

- In **SteamVR**, under **Devices**, click **Controller Input Binding**. Find your application at the top, under the running application. Create some bindings using the UI, then save them.

- Under **SteamVR beta**, select **Devices**, then **Controller Input Bindings**. Click for full image.

- Select an application's binding to edit (UE4EDITOR.EXE). Click for full image.

- Select **Edit** to edit the existing bindings. Click for full image.

- Make changes to existing bindings and save them. Click for full image.

**About 2D Axes**: Unreal Engine only has 1-dimensional axis inputs, while Steam supports up to 3-dimensional inputs. This mismatch can be rectified if you define two axes that are bound to the X and Y counterpart of the same controller in the input settings. For example, let's say MoveRight is bound to Motion Controller Thumb Stick X, and MoveForward is bound to Motion Controller Thumb Stick Y. The SteamVR controller code will actually generate three actions�a vector1 action called MoveRight, another vector1 action called MoveForward, and a third combined vector2 action called MoveRightForward. You can choose to bind to only one or two of them, depending on what kind of inputs (1- or 2-dimensional) you want.

## End Result

A game using the Action Input API actions should now respond to the bindings defined in the SteamVR Input system.
