# Controlling Inputs to Virtual Camera Controls

https://dev.epicgames.com/documentation/en-us/unreal-engine/controlling-inputs-to-virtual-camera-controls-in-unreal-engine?application_version=5.9

> How to manage, edit, and configure inputs to virtual camera controls.

[image: Controlling Inputs to Virtual Camera Controls]

Learn to use this **Beta** feature, but use caution when shipping with it.

The Enhanced Input (-> enhanced-input-in-unreal-engine) features of Unreal Engine is capable of managing a large number of actions and changing them dynamically. Inputs can change behavior depending on their current state. This means that you can assign more mappable keys than there are buttons for in the user interface. In this case, it's ideal for mapping inputs of hardware devices to virtual camera controls in Unreal Engine through the Live Link VCAM app.

This page covers how to:

- Map hardware inputs to virtual camera actions. (-> controlling-inputs-to-virtual-camera-controls-in-unreal-engine)

- Create an Input Profile for customized workflows and device actions. (-> controlling-inputs-to-virtual-camera-controls-in-unreal-engine)

- Set an Input Profile for all Virtual Camera Actors and for individual ones. (-> controlling-inputs-to-virtual-camera-controls-in-unreal-engine)

- Specify type of input for a Virtual Camera Actor. (-> controlling-inputs-to-virtual-camera-controls-in-unreal-engine)

## Mapping Hardware Inputs to Virtual Camera Actions

You can set input mappings in two ways: globally through the Project Settings, or on individual Virtual Camera Actors. You can edit, add, and configure them from either of these locations.

Change default inputs from:

- **Project Settings** under **Game > VCam Input Settings**

- Select a Virtual Camera Actor and in the **Details** panel look under the **Virtual Camera** section and expand the **Input Profile** section.

### Adding an Input

To add a hardware input to a virtual camera action:

 [image: Adding an Input to a Input Profile.]

- Select a **Virtual Camera** Actor in your scene.

- In the **Details** panel under **Virtual Camera**, expand the **Input Profile** section.

- Expand **Mappable Key Overrides** and look for a desired input action to change.

- Next to the named input, you can do one of the following: Click the **Keyboard** icon and then press the key / button you want to handle the input..

- Use the dropdown and search for the key / button / action you want to handle the input.

When choosing an input to map, the desired button is listed as long as it provides the correct type of input to handle that action. For example, the input "NextLens" requires a bool (button) input and cannot be mapped to a float (joystick).

### Creating an Input Profile

To create an **Input Profile**:

- Open the **Project Settings** and navigate to **Game > VCam Input Settings**.

- **Add** (+) an element to the **Input Profiles** array and give it a **Name**. [image: Add a new Input Profile and give it a name.]

- **Add** (+) elements to the **Mappable Overrides** array. [image: Add mappable key overrides to your Input Profile.] Each element that you add must be named before another can be added. If you intend to use the mappings of the Default VCam Actor profile as a starting point, you can right-click on the list, choose **Copy** and then **Paste** it onto your custom input profile.

- Expand **Mappable Key Overrides**. Add new inputs or look for one to edit if you copied the ones from the default Input Profile. [image: Add mappable key override elements to the list Input Profile list.]

- Next to the named input, you can do one of the following: Click the **Keyboard** icon and then press the key / button you want to handle the input.

- Use the dropdown and search for the key / button / action you want to handle the input.

- Repeat **Step 5** for each input you wish to change.

Your list may look similar to the one below, whether you added entries manually or copied and pasted from the default profile to build your own Input Profile.

 [image: A list of mappable key overrides for the created Input Profile.]

### Setting an Input Profile

Input Profiles can be set in one of two ways: globally for all virtual cameras through the Project Settings, or on individual Virtual Camera Actors in the scene.

To setting an input profile in the Project Settings:

- Open the **Project Settings** and navigate to **Game > VCam Input Settings**.

- In the **Input** section next to **Default Input Profile**, choose the global default you want to use from the dropdown list.

 [image: Setting the default input profile from the Project Settings.]

To set an Input Profile for individual Virtual Camera Actors:

- Select a **Virtual Camera** actor in the scene.

- In the **Details** panel under **Virtual Camera**, use the dropdown list next to **Input Profile** to select the profile you want to use.

 [image: Setting the default input profile for a single virtual camera actor.]

## Specifying Type of Input from a Device

For set ups using multiple Virtual Camera Actors, you can assign specific input devices to each virtual camera in the scene. This is useful when you have multiple virtual cameras being controlled from a single workstation and is most useful when using gamepads.

Each input device has an ID that starts at 0 and increases by 1 as more devices are connected. The registered ID is recycled when a device disconnects, and is then available for reassignment to the next device that connects. When a device is connected, the lowest possible ID is reassigned. For example, if you have a workstation with two gamepads connected: Gamepad A and Gamepad B. Gamepad A would receive ID 0, and Gamepad B would receive ID 1. If Gamepad A is disconnected, Gamepad B would maintain its registered ID 1. When another gamepad is plugged in and registered, that gamepad would be given the lowest available ID — in this case, that would be ID 0 that was unregistered when Gamepad A was disconnected.

To specify input for a virtual camera:

- Select a **Virtual Camera** Actor in your scene.

- In the **Details** panel under **Virtual Camera**, expand the **Input Device Settings**.

- Remove the checkmark from **Allow All Input Devices**. A new property called **Allow Input Device Ids** will appear. Click image for full size.

- Click the **Add (+)** icon to add a device to the array. [image: Add a new Input Device element to the device array.]

- Connect a physical gamepad to your workstation, if one is not already.

- Click the **Gamepad** icon. Then, press any button on your physical gamepad to register its ID.

This Virtual Camera Actor now responds to inputs from the registered gamepad and any other input devices in the list.

### Using Keyboards and Mice with an Input Device

- Keyboards and mice cannot be assigned to specific Virtual Camera Actors. Workflows involving multiple keyboards and mice are not supported.

- Keyboards always have a device ID equal to 0. The first connected gamepad will also use ID 0.

- Mice always have a device ID equal to -1.

- getting started
- beta
- virtual camera
- working with media

On this page

- Mapping Hardware Inputs to Virtual Camera Actions (-> controlling-inputs-to-virtual-camera-controls-in-unreal-engine)
- Adding an Input (-> controlling-inputs-to-virtual-camera-controls-in-unreal-engine)
- Creating an Input Profile (-> controlling-inputs-to-virtual-camera-controls-in-unreal-engine)
- Setting an Input Profile (-> controlling-inputs-to-virtual-camera-controls-in-unreal-engine)
- Specifying Type of Input from a Device (-> controlling-inputs-to-virtual-camera-controls-in-unreal-engine)
- Using Keyboards and Mice with an Input Device (-> controlling-inputs-to-virtual-camera-controls-in-unreal-engine)
