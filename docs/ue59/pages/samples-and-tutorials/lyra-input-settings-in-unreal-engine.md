# Lyra Input Settings

https://dev.epicgames.com/documentation/en-us/unreal-engine/lyra-input-settings-in-unreal-engine?application_version=5.9

> An overview of how Lyra uses its Input Settings system to solve many common input configuration setups.

[image: Lyra Input Settings]

Lyra's **Input Settings System** was designed to resolve many common issues with input configuration setups experienced in games. It is based on the Enhanced Input system (-> enhanced-input-in-unreal-engine).

## UGameFeatureAction_AddInputConfig

 [image: game-feature-action-config-menu]

The **UGameFeatureAction_AddInputConfig** is a **Game Feature Action **that is responsible for registering the Enhanced Input **PlayerMappableInputConfig** data assets. The PlayerMappableInputConfigs contain input mappings to be added to the local player, such as pressing the "W" key to move the character forward.

This means each game feature plugin registers its own set of key bindings used with its experience. The input mappings are registered whenever the game feature plugin is loaded; this means the user can change their keybindings for any experience even if it is not currently active, such as on the main menu.

Input mappings will not be "activated" on the player until the associated Game Feature is activated. Mappings will only be activated if their platform conditions are met. For example, the mouse and keyboard mappings will only be activated if there is an associated `SupportsMouseAndKeyboard` platform trait.

 [image: platform-trait-maps]

These platform traits can be helpful for defining platform-specific input mappings, especially on platforms that may have varying inputs available. For example, a modern mobile platform has fewer physical buttons to use than a controller on a Console platform.

The **Type** field is useful if you want to extend the existing functionality to change mapping configurations when the input device changes. You can do so with the Common Input Subsystem's `OnInputMethodChanged` delegate.

## ULyraSettingsLocal

Once a Game Feature registers an input config, they are stored in the game settings. The settings are aware of all input mappings and which ones are currently active. The `ULyraInputComponent` uses these registered configs to add the mappings to Enhanced Input when the player is initialized.

The settings have callbacks for when a mapping config is activated or deactivated so that anything with a local player can get access to that information, which can be useful both in gameplay situations and for updating the settings menu.

Along with holding the currently registered input mappings and custom keybinds, the settings provide a place for you to declare any modifications to their experience such as aim sensitivity, inverting the look axis, and more. These settings can then be used by Input Modifiers to implement the desired input behavior.

### Lyra Input Modifiers

Input Modifiers are pre-processors that alter the raw input values before sending them to Input Triggers. This is how Lyra applies settings such as gamepad sensitivity, dead zones, and even aim assist. As an example, we can look at how we apply Gamepad Sensitivity based on the user's settings, `ULyraInputModifierGamepadSensitivity`.

First, we have defined a Data Asset for "Aim Sensitivity", `ULyraAimSensitivityData`. This maps a gamepad sensitivity enum to an associated float scalar value. Having this defined in a data asset provides us the capability to reuse it in multiple places, in addition to making the values easily accessible to designers or gameplay programmers.

The `ModifyRaw_Implementation` function is what performs all of the input manipulations. Because the function takes in a `const UEnhancedPlayerInput*` parameter, you can use it to get the owning local player. Once you have the owning player, you can get the associated settings of that player. From here, you can get the current gamepad sensitivity setting and look it up in our Aim Sensitivity Data Asset to get a float value to scale by.

On this page

- UGameFeatureAction_AddInputConfig (-> lyra-input-settings-in-unreal-engine)
- ULyraSettingsLocal (-> lyra-input-settings-in-unreal-engine)
- Lyra Input Modifiers (-> lyra-input-settings-in-unreal-engine)
