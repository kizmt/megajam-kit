# Remote Control Protocols

https://dev.epicgames.com/documentation/en-us/unreal-engine/remote-control-protocols-in-unreal-engine?application_version=5.9

> With Remote Control Protocols you can bind protocol input data to exposed properties, to control them through external devices.

[image: Remote Control Protocols]

Learn to use this **Beta** feature, but use caution when shipping with it.

With Remote Control Protocols you can bind protocol input data to exposed properties, to control them using external devices. This page describes how to use the Remote Control plugins for the DMX, MIDI, and OSC plugins, and how to create your own Protocol plugin.

## Prerequisites

- Enable the **Remote Control API** plugin.

- Enable the Remote Control plugin specific to the protocol you're using: For DMX, enable the **Remote Control Protocol DMX** plugin.

- For MIDI, enable the **Remote Control Protocol MIDI** plugin.

- For OSC, enable the **Remote Control Protocol OSC** plugin.

- Restart the editor.

Once you enable these plugins, create a **Remote Control Preset Asset** and expose properties to the Preset. Refer to Getting Started with Remote Control Presets (-> getting-started-with-remote-control-presets-in-unreal-engine) for more details.

## Mapping Protocols in Remote Control

Follow these steps to be able to control properties from your external device.

- In the Remote Control Panel, select the property you want to map to a Protocol. [image: Select a property to map to a protocol]

- Select the Protocol from the dropdown list and press the plus button next to it to add a new mapping. [image: Select a protocol mapping]

- Modify the settings in the mapping section to connect to your external device. Refer to the Remote Control Panel Reference (-> remote-control-panel-reference-for-unreal-engine) for more details on the fields. You can quickly autobind an input by using the autobinding button located in the top right of the mapping panel. Refer to the Remote Control Panel Reference (-> remote-control-panel-reference-for-unreal-engine) for more details.

- In the **Ranges** section, add more range steps by selecting the plus button on the right. Enter different values in the range points to make the property interpolate between them when controlling from the external device. Press the left-facing arrow next to a range value to capture its current value in the world.

- Verify your mapping and inputs are set up correctly by using your external device and seeing the changes in the object's **Details** panel or the viewport.

## Adding a New Protocol

To add your own protocol support to Remote Control, you need to implement `IRemoteControlProtocol` and `FRemoteControlProtocolEntity`.

Follow these steps to add your own implementation for a Remote Control Protocol.

- Create a new blank plugin. See Creating a New Plugin (-> plugins-in-unreal-engine) for instructions. The recommended naming convention is **RemoteControlProtocol{Name}**, where **{Name}** is the name of your protocol. For example the MIDI implementation is called `RemoteControlProtocolMIDI`.

- Within the created *.uplugin file, add a dependency to the RemoteControl plugin: ```
         "Plugins": [
             {
                 "Name": "RemoteControl",
                 "Enabled": true
             }
         ]

``` "Plugins": [ { "Name": "RemoteControl", "Enabled": true } ]

- In Visual Studio's Solution Explorer for your project, find the module, defined in a `.Build.cs` file. Append `RemoteControl` and `RemoteControlProtocol` to the `PrivateDependencyModuleNames` range.

- Create a new class that implements `IRemoteControlProtocol`, or inherit from the base implementation `FRemoteControlProtocol`, with overrides for: **GetProtocolScriptStruct()**: Provide the class of your **Protocol Entity** implementation. For the example with MIDI, it's `FRemoteControlProtocolMIDIEntity::StaticStruct()`.

- **Bind(Entity)**: This is typically used to register the entity with a local collection to iterate over whenever input is received. The provided entity will be specific to your implementation which is described below.

- **Unbind(Entity):** Similar to Bind, this is typically used to remove the provided entity from a collection.

- **UnbindAll(): **Removes all entities from the collection.

- Create a new struct that represents the protocol binding for a given entity (the exposed property) by inheriting from the FRemoteControlProtocolEntity struct, with overrides for: **GetRangePropertyName():** For example `FFloatProperty` if the input from the device is a float.

- A transient, non-visible, and non-editable UPROPERTY() called RangeInputTemplate: You can specify additional constraints such as min and max values. This is used to create the appropriate editor widget. You can optionally store the property elsewhere and specify it by overriding `IRemoteControlProtocol::GetRangeTemplateType()`.

- Register your `IRemoteControlProtocol` implementation with: ```
         IRemoteControlProtocolModule::Get().AddProtocol({Name}, MakeShared<{Implementation}>());
``` IRemoteControlProtocolModule::Get().AddProtocol({Name}, MakeShared());

For further examples, including how to create and register project settings, see the implementations for DMX, MIDI, and OSC Remote Control Protocol Plugins in the UE source code.

- beta
- osc
- midi
- remote control
- dmx
- remote control protocol

On this page

- Prerequisites (-> remote-control-protocols-in-unreal-engine)
- Mapping Protocols in Remote Control (-> remote-control-protocols-in-unreal-engine)
- Adding a New Protocol (-> remote-control-protocols-in-unreal-engine)
