# Environment Light Mixer

https://dev.epicgames.com/documentation/en-us/unreal-engine/environment-light-mixer-in-unreal-engine?application_version=5.9

> An editor window that combines common atmospheric lighting components in one place where they can be created and edited for a Level.

[image: Environment Light Mixer]

The **Environment Light Mixer** is an editor window where you can create and edit a Level's environment lighting components for sky, clouds, atmosphere lights, and sky lighting. For designers and artists, it's a single window that enables you to edit these components quickly and choose the amount of properties detail you want access to.

[image: An overview of the Environment Light Mixer Window]

Click image for full size.

## Opening the Environment Light Mixer

Open the Environment Light Mixer from the **Main Menu** by selecting **Window > Env. Light Mixer**.

[image: From the Main Menu, select Window, then select Env. Light Mixer]

## Environment Light Mixer Interface

The Environment Light Mixer's interface is comprised of two primary elements:

[image: Environment Light Mixer Interface]

Click image for full size.

- Toolbar (-> environment-light-mixer-in-unreal-engine)
- Components Panels (-> environment-light-mixer-in-unreal-engine)

### Toolbar

The **Toolbar** is where you'll add and configure the level of properties detail that is visible in the Components Panels.

[image: The Toolbar Element]

Click image for full size.

#### Adding Scene Components

When you open the Environment Light Mixer window, if you are starting from an empty Level, you will find the following components listed:

[image: Adding Scene Components from the Environment Light Mixer Window]

Click image for full size.

- Sky Light (-> sky-lights-in-unreal-engine)
- Atmosphere Lights (2x Directional Lights for sun and moon, or two suns representation)
- Sky Atmosphere
- Volumetric Cloud (-> volumetric-cloud-component-in-unreal-engine)

If any of these components is added from the Place Actors panel or already exists in the scene, the list will automatically reflect what is not currently added. Likewise, when you remove a component from the scene, the create button becomes available again in the toolbar.

### Controlling the Amount of Properties Detail

When one of the available components is referenced in your Level – whether you added it through the Environment Light Mixer, or it already exists – the component's properties are added to the Components Panel where you can adjust and edit various properties for each of them.

For those that want maximum control over editing of their components, you can change the amount of properties shown using the **Property Details** dropdown:

[image: Using the Property Details Dropdown]

- **Minimal** provides the bare essentials for components.
- **Normal** provides the common properties for components.
- **Normal+Advanced** provides common and advanced properties for components.

Below are examples of the amount of properties shown for the Directional Light using each detail amount:

|  |  |  |
| --- | --- | --- |
| [image: Minimal Amount of Properties Detail] | [image: Normal Amount of Properties Detail] | [image: Normal and Andanced Amount of Properties Detail] |
| Minimal | Normal | Normal+Advanced |

Click images for full size

### Components Panels

The **Components Panels** lists any of the components available in the Toolbar to add to your scene. It includes components for Sky Atmosphere, Volumetric Clouds, up to two Directional Lights, and a Sky Light.

By Default, the properties displayed for each component is limited to its **Minimal** set but can be extended to show more using the Property Details (-> environment-light-mixer-in-unreal-engine) dropdown in the toolbar.

[image: The Components Panels]

- rendering
- lighting
- environment lighting

On this page

- Opening the Environment Light Mixer (-> environment-light-mixer-in-unreal-engine)
- Environment Light Mixer Interface (-> environment-light-mixer-in-unreal-engine)
- Toolbar (-> environment-light-mixer-in-unreal-engine)
- Adding Scene Components (-> environment-light-mixer-in-unreal-engine)
- Controlling the Amount of Properties Detail (-> environment-light-mixer-in-unreal-engine)
- Components Panels (-> environment-light-mixer-in-unreal-engine)
