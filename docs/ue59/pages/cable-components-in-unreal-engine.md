# Cable Components

https://dev.epicgames.com/documentation/en-us/unreal-engine/cable-components-in-unreal-engine?application_version=5.9

> A guide on how to use Cable Components to create cables, ropes, or chains.

Having the ability to cheaply add cables, ropes, or chains that can sway back and forth as if being gently blown by the wind can add a nice bit of life to your Unreal Engine projects. In the following document, we will look at how you can use the **Cable Component** plugin to create, set up, and control how the cables look, react and even collide with objects in your levels.

## Simulation and Rendering

To perform the actual cable simulation, a technique called **Verlet Integration**, which is well known in game development. The idea is to represent the cable as a series of particles, with **distance constraints** between them. The particles at the ends are **fixed**, moving with whatever they are attached to. The ones in the middle are **free**, falling with gravity. For each step, you update the velocity and position of each particle, and then move them to satisfy the constraints. The **stiffness** of the cable is controlled by the number of times we iterate to enforce the constraints (each step).

Click image for full size.

Now that there is a nice chain of connected particles bouncing around, they need to be rendered. To render a cable, a class called **FCableSceneProxy** was created to represent the render of the cable. Each end of the Sim particles' positions (done on the main thread, inside of TickComponent) is then passed to this proxy via the **SendRenderDynamicData_Concurrent** function. Next, update is locked on the render thread, and then the index and vertex buffers are updated, making a **tube** mesh. For each vertex on this tube mesh, we need to calculate a position, a Texture UV, and three Tangent Basis vectors. When doing this, **X** will point along the cable, **Z** will point straight out from the cable (the normal) and **Y** is perpendicular to **X** and **Z**. These properties have been exposed to the components, giving you the ability to control the number of sides, the radius of the tube, and how many times the UVs can tile along the cable.

Click image for full size.

## Enabling the Plugin

By default, the Cable Component plugin should be enabled. However, if it is not, you can enable it by first going to the main toolbar and selecting **Edit** > **Plugins**. Then, from the plugins list, go to **Rendering** and make sure the **Cable Component** has a checkmark in the box next to **Enabled**.

Click image for full size.

## Using the Cable Component

In the following section, we will go over the two different ways that you can add cables to your project's levels.

### Using Cable Components from the Place Actors Panel

To use the Cable Component from the Place Actors Panel, do the following:

- From the **Main Toolbar**, click **Create** and select **Place Actors Panel**. [image: Access Place Actors Panel from the Create button]

- In the search box, type `Cable`. Then drag **Cable Actor** into your level. Click image for full size.

- You can now position, rotate, and scale the Cable Actor so that it fits the needs of your level.

### Using Cable Components in Blueprints

To use the Cable Component in your Blueprints, create new Blueprint Class.

- **Right-click** from your **Content Drawer / Content Browser** and select **Blueprint Class**. [image: Creating new Blueprint Class]

- Select **Actor** as a Parent Class for the new Blueprint. [image: Select Actor from the Pick Parent Class Window]

- Rename your Blueprint to **BP_Cable**. Then double-click it to open it in the **Blueprint Editor**. [image: Rename blueprint]

- From the **Components** tab, click the **Add** button. In the list, locate and select the **Cable** component [image: Adding Cable component to the Blueprint]

- With the Cable Component now added, select it in the components list so that you can adjust its properties through the **Details** panel. For now, leave everything as the default, and make sure to **Compile** and **Save** your Blueprint before closing the editor. To make either side of the cable fall, disable the **Attach Start** or **Attach End** option from the Details panel. This can also be toggled while the game is running to go along with effects. [image: Disabling Attach Start and Attach End]

- In the Content Drawer, locate the **BP_Cable** and drag it into your level. Move and rotate it as needed. [image: Dragging Cable Blueprint into the level]

## Attaching Objects to the Cable ends

You can also attach objects to either end of the cable so that the objects will swing along with the cable. To accomplish this, do the following:

- From the Actors Panel, drag a **Cube Actor** into your level. Locate it next to the **BP_Cable**, that you added before. [image: Dragging the Cube Actor into the Level]

- Make sure that the Cube has its **Mobility** set to **Movable**. Click image for full size.

- Locate the Cube you want to attach to the end of the Cable Actor in the **World Outliner**. Then drag the Cube on top of the Cable Actor. After doing this, the following dialogue window will open. [image: Drag the cube over the cable actor]

- Select **Cable End**, and in the viewport, you should see your Cube snaps to the end of the cable. [image: Before] [image: After]

- Now, select the Cable Actor in the level viewport. Then, in the **Details** panel under the **Cable** section, disable the **Attach End** option. [image: Disabling the Attach End option] You do not have to only use the **Attach Start** and **Attach End** options to attach cables to Actors. You can also specify a Socket that can be used as the attachment point.

- After disabling **Attach End**, your cable should swing freely in the viewport. You can dynamically enable or disable the **Attach Start** and **Attach End** options at run time, which can make for some interesting effects.

## Collision and Stiffness

Enabling Collision and Stiffness will greatly increase the cost of the Cable Actor. Only enable these features if the cable has to collide with something in the world or if the cable needs some stiffness to help make the effect look better. If none of that is needed, it is best to keep these options disabled to save performance.

The Cable Component does have the option to have the cable collide with the world, controlling how stiff the cable is. To enable this functionality, perform the following steps:

- In the Blueprint Editor, go to the Details panel of the Cable Component. Locate the **Cable** section and expand its **Advanced** options. Click image for full size.

- Enable both the **Enable Stiffness** and **Enable Collision** options. [image: Enabling Stiffness and Collision]

- Now, when you move the Cable Actor around, or if an object collides with the Cable Actor, it should collide with the object it comes in contact with.

## Cable Component Properties Reference

This section contains reference information for each of the properties of the Cable Component:

#### Cable

 [image: Properties in the Cable Section]

| Property Name | Description |
| --- | --- |
| **Attach Start** | Should we fix the start to something or leave it free. If false, component transform is just used for the initial location of the start of the cable. |
| **Attach End** | Should we fix the end to something (using AttachEndTo and EndLocation), or leave it free. If false, AttachEndTo and EndLocation are just used for the initial location of the end of the cable. |
| **Attach End To** | Actor or Component that defines the end position of the cable. |
| **Component Name** | Name of the component property to attach the cable to. |
| **Attach End To Socket Name** | Socket name on the AttachEndTo component to attach to. |
| **End Location** | End location of cable, relative to AttachEndTo (or AttachEndToSocketName) if specified. Otherwise, relative to the cable component. |
| **Cable Length** | Rest length of the cable. |
| **Num Segments** | How many segments the cable has. |
| **Solver Iterations** | The number of solver iterations controls how 'stiff' the cable is. |
| **Substep Time** | Controls the simulation substep time for the cable. |
| **Use Substepping** | When false, will still wait for **Substep Time** to elapse before updating, but will only run the cable simulation once using all of the accumulated simulation time. |
| **Enable Stiffness** | Add stiffness constraints to cable. |
| **Enable Collision** | Perform sweeps for each cable particle at each substep to avoid collisions with the world. Uses the Collision Preset on the component to determine what is collided with. This greatly increases the cost of the cable simulation. This is currently Experimental. |
| **Collision Friction** | If **Collision** is enabled, this option controls how much sliding friction is applied when the cable is in contact. |

### Cable Forces

 [image: Properties in the Cable Forces Section]

| Property Name | Description |
| --- | --- |
| **Cable Forces** | Force vector (world space) applied to all particles in the cable. |
| **Cable Gravity Scale** | Scaling applied to world gravity affecting this cable. |

### Cable Rendering

 [image: Properties in the Cable Forces Section]

| Property Name | Description |
| --- | --- |
| **Cable Width** | How wide the cable geometry is. |
| **Num Sides** | Number of sides of the cable geometry. |
| **Tile Material** | How many times to repeat the material along the length of the cable. |
