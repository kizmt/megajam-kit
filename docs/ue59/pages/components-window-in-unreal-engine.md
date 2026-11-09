# Components Window

https://dev.epicgames.com/documentation/en-us/unreal-engine/components-window-in-unreal-engine?application_version=5.9

> Overview of working with Components in Blueprints inside the Components Window.

[image: Components Window]

A **Component** is a piece of functionality that can be added to an Actor.

When you add a Component to an Actor, the Actor can use the functionality that the Component provides. For example:

- A Spot Light Component will make your Actor emit light like a spot light.

- A Rotating Movement Component will make your Actor spin around.

- An Audio Component will give your Actor the ability to play sounds.

Components must be attached to an Actor and can't exist by themselves.

For more information on Components, please see the Components Overview (-> components-in-unreal-engine) documentation.

## Components Window

With an understanding of Components, the **Components** window inside the **Blueprint Editor** allows you to add Components to your Blueprint. This provides a means of adding collision geometry via CapsuleComponents, BoxComponents, or SphereComponents, adding rendered geometry in the form of StaticMeshComponents or SkeletalMeshComponents, controlling movement using MovementComponents, etc. The Components added in the Components list can also be assigned to instance variables providing access to them in the graphs of this or other Blueprints.

## Adding Components

To add a Component to a Blueprint from the **Components** window:

- Select the type of Component you want to add from the dropdown list, i.e. a CameraComponent.

- After selecting a Component from the list, you will be prompted to enter a name for your Component.

Components can also be added by dragging-and-dropping assets from the **Content Browser** into the **Components** window.

Assets this method applies to include: StaticMeshes, SoundCues, SkeletalMeshes, and ParticleSystems.

## Removing Components

To remove a Component from the **Components** window, **Right-click** on the Component's name and select **Delete**.

You can also select the Component in the window and press the **Delete** key to remove it as well.

## Transforming Components

Components, when added to an instance in your level, are placed by default at the location of that instance. However, they can be Transformed, Rotated, and Scaled as necessary in either the **Details** panel or the **Viewport** similar to the method in which you can Transform Actors.

You can select Components for transformation either by clicking on their name in the **Components** window or by clicking directly on the Component in the **Viewport**. When Transforming, Rotating, and Scaling your Components in the **Viewport**, hold **Shift** to enable snapping. This snapping requires that snapping be enabled in the **Level Editor** and uses the **Snap Grid** settings from the **Level Editor** (see Actor Snapping (-> actor-snapping-in-unreal-engine) for more information on Grid Snapping).

Exact values can also be entered for **Location**, **Rotation**, and **Scale** in the **Details** panel for your selected component.

Transforming, Rotating, or Scaling a parent component will propagate the transformation down to all child components as well.

## Component Assets

Once you have added a Component, you may need to specify the asset to occupy the Component (such as assigning a Static Mesh to use for a StaticMeshComponent). There are a couple of different ways you can assign an asset to use for a Component type as described below.

### Assigning Component Assets

To assign an asset to a Component in the **Components** window:

- With the Component selected, in the **Details** panel find the section that corresponds to your Component type. Above we have added a StaticMeshComponent and under **StaticMesh** is where we would assign the asset to use.

- Click the **Static Mesh** drop-down box, then select the asset to use from the context menu.

Another method of assigning an asset can be done using the **Content Browser**:

- Select the asset you would like to assign as the asset to use with your Component in the **Content Browser**.

- With the **Component** selected, in the **Details** panel find the section that corresponds to your Component type. Above we have added a StaticMeshComponent and under **StaticMesh** is where we would assign the asset to use.

- Instead of clicking the **Static Mesh** box, since an asset is selected in the **Content Browser**, click the button. This will assign the asset selected in the **Content Browser** as the asset to use in the Component.

### Removing Component Assets

To clear an assigned asset from a Component:

- In the **Details** panel for the Component, click the button next to the currently assigned asset.

- Or, click the **Current Asset** box for your asset, then select the **Clear** from the context menu. [image: Clear] In either method, the asset will be removed as being assigned to the Component.

### Browsing to Component Assets

You can also browse to a currently assigned asset of a Component, jumping to and locating in the **Content Browser**:

- In the **Details** panel for the Component, press the [image: Blueprint - Browse Asset Button] button next to the currently assigned asset.

- The **Content Browser** opens showing the assigned asset selected.

## Renaming Component Instance Variables

Components created in the **Components** window will have an automatically generated instance variable name based on their type.

To change the name of these variables:

- Select the component in the **Components** window and its details will appear in the **Details** panel.

- Enter a new name for the component in the **Variable Name** field in the **Details** panel and confirm by pressing **Enter**. You can quickly rename a Component by selecting it in the **Components** window then pressing **F2**.

## Component Events and Functions

You can quickly add events and/or functions based on a Component to the **Event Graph** of the Blueprint through different methods. Any events or functions created in this manner are specific to that particular function and do not have to be tested to verify which Component is involved.

- Add a Component for which events can be created, such as a BoxComponent.

- Provide a name for your Component, here we called it Trigger.

- In the **Details** panel, click the **Add Event** button and select your desired event type. You can also **Right-click** on the Component in the **Components** window and select your event from the **Add Event** context menu.

- In either manner, a new event node (based on the type you selected) will be added to the **Event Graph** which will automatically open.

Events and Functions can also be added for a Component from the **Event Graph** through the **My Blueprint** window:

- In the **My Blueprint** window, under **Components**, select your Component.

- **Right-click** in the graph to bring up the context menu. If the component has any associated events or functions, they will be listed at the top. Not all Components have associated events. For instance, a PointLightComponent only has functions. You can also **Right-click** on the Component in the **My Blueprint** window to access the **Add Event** context menu.

- blueprints
- components

On this page

- Components Window (-> components-window-in-unreal-engine)
- Adding Components (-> components-window-in-unreal-engine)
- Removing Components (-> components-window-in-unreal-engine)
- Transforming Components (-> components-window-in-unreal-engine)
- Component Assets (-> components-window-in-unreal-engine)
- Assigning Component Assets (-> components-window-in-unreal-engine)
- Removing Component Assets (-> components-window-in-unreal-engine)
- Browsing to Component Assets (-> components-window-in-unreal-engine)
- Renaming Component Instance Variables (-> components-window-in-unreal-engine)
- Component Events and Functions (-> components-window-in-unreal-engine)
