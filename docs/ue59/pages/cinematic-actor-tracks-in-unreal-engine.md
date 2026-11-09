# Object Binding Track

https://dev.epicgames.com/documentation/en-us/unreal-engine/cinematic-actor-tracks-in-unreal-engine?application_version=5.9

> The Object Binding Track is a track that binds Actors and Objects to Sequencer and provides controls to manipulate their specialized properties or components.

[image: Object Binding Track]

In Sequencer, you can add **Static Mesh Actors (-> static-mesh-actors-in-unreal-engine)**, **Skeletal Mesh Actors (-> skeletal-mesh-actors-in-unreal-engine)**, and other kinds of Actors in order to animate them. All Actors in Sequencer are referenced by using the **Object Binding Track**, which enables access to their properties, components, and variables.

This guide provides an overview of the Object Binding Track, how bindings work with it, how to access Actor components within Sequencer, and how to work with automatic track creation.

#### Prerequisites

- You have an understanding of **Sequencer (-> how-to-make-movies-in-unreal-engine)** and its **Interface**.

- You have an understanding of **Blueprint Visual Scripting (-> blueprints-visual-scripting-in-unreal-engine)**.

## Creation

Object Binding tracks are created whenever you add an Actor to Sequencer through a variety of methods.

You can add Actors to your sequence by navigating within the **Track (+)** menu to the **Actor To Sequencer** submenu. From here you can choose any Actor currently in your Level to add to your sequence, or you can search for a specific Actor using the search bar.

 [image: actor to sequencer]

If an Actor is already selected in your Level, then it will be listed at the top of the **Actor To Sequencer** list for convenience.

You can also drag Actors from other windows, like the **Outliner (-> outliner-in-unreal-engine)** and add them into Sequencer.

 [image: sequencer drag and drop actor add]

### Binding

When Actors are added to Sequencer, the Object Binding Track is created and is bound to the chosen Actor. The binding enables certain property tracks and components to become available that are dependent on the Actor's class.

For example, when the track binds to a **Skeletal Mesh Actor (-> skeletal-mesh-actors-in-unreal-engine)**, it enables the creation of the **Animation Track (-> cinematic-animation-track-in-unreal-engine)**, which is a track specific to the **Skeletal Mesh Component**.

 [image: skeletal mesh actor component animation]

Actor bindings can be changed or removed by right-clicking the track and navigating to the **Assign Actor** menu.

 [image: assign actor bind]

To change an Object Binding Track's binding, you can either choose the new Actor directly from the Actor list in the **Assign Actor** menu, or select the new Actor and click **Replace with Selected**.

 [image: replace with selected]

When rebinding between different classes of Actors, any class-specific tracks will remain, but will no longer function unless the new binding contains a compatible component for the track.

To remove a binding, right-click the Object Binding Track, navigate to the Assign Actor menu, and select **Remove All**. You may also select **Remove Selected** if the same Actor is selected in the viewport.

 [image: remove object binding]

Bindings can also be changed with **Blueprint Functions (-> blueprints-visual-scripting-in-unreal-engine)**. You can locate binding functions when calling Blueprint functions from a Level Sequence reference object by navigating to **Sequencer > Player > Bindings**. From here you can choose to use explicit binding functions, such as **Set Binding**, or changing bindings **By Tag** (-> cinematic-tags-and-groups-in-unreal-engine).

 [image: sequencer player bindings blueprints]

### Multi Binding

Multiple Actors can also be bound to the track, enabling a single track to control several Actors at once. When more than one Actor is bound, the track is denoted with a **yellow chevron**, and the number of bound Actors is displayed in brackets next to the track name.

 [image: multiple object binding]

Binding multiple Actors can be useful in situations where you want to change the properties of multiple Actors at once, such as when adjusting all lights in an area.

 [image: multiple binding lights]

You can also share data between multiple characters in your cinematic, then control their visibility during runtime, enabling conditional characters or objects to be visible when the scene plays.

 [image: conditional characters multiple bindings]

To bind multiple Actors to the same track, select your required Actors from the viewport, then right-click a currently existing Object Binding Track, and select **Assign Actor > Add Selected**.

 [image: create multiple bindings sequencer]

You can bind Actors of different classes together, however you will only be able to access the components of the first bound Actor. Shared properties, such as **Transform** (-> cinematic-transform-and-property-tracks-in-unreal-engine), will still function correctly though.

## Accessing Components

Typically, Actors only have a single component, and the most often used properties for that component are filtered down when adding tracks to the Actor. You can access the full range of an Actor's properties by adding a component track, and adding properties from that component.

This is done by clicking the **Track (+)** dropdown on the Object Binding Track, and selecting the component from the **Components **category. Then click the **Track (+)** dropdown on the component track to view all available component properties.

 [image: sequencer component properties]

Actor Blueprints, or Blueprints with multiple components can also have their components accessed in the same way. In this example, an Actor Blueprint contains a **Skeletal Mesh Component**, **Point Light Component**, and a **Camera Component**. These components and their subcomponents are accessible in the **Components** category when clicking the **Track (+)** dropdown.

 [image: blueprint actor sequencer components]

## Automatic Track Creation

When adding certain Actors to Sequencer, you may notice that tracks are automatically created with them. For example:

- **Static Mesh Actors (-> static-mesh-actors-in-unreal-engine)** will automatically create a **Transform Track** (-> cinematic-transform-and-property-tracks-in-unreal-engine). [image: static mesh sequencer auto track]

- **Skeletal Mesh Actors (-> skeletal-mesh-actors-in-unreal-engine)** will automatically create a **Transform Track** (-> cinematic-transform-and-property-tracks-in-unreal-engine) and an **Animation Track (-> cinematic-animation-track-in-unreal-engine)**. [image: skeletal mesh sequencer auto track]

- **Cine Camera Actors (-> cinematic-cameras-in-unreal-engine)** will automatically create a **Transform Track** (-> cinematic-transform-and-property-tracks-in-unreal-engine) and a **Camera Component** with **Aperture**, **Focal Length**, and **Focus Distance** property tracks. [image: camera actor sequencer auto track]

- **Light Actors** will automatically create a **Light Component** with **Intensity **and **Light Color** property tracks. [image: lights sequencer auto track]

This occurs because of the **Tracks Settings** located in the **Sequencer Plugins Project Settings** (-> cinematic-editor-and-project-settings-in-unreal-engine). You can locate these settings by opening the **Project Settings** window, and locating **Level Sequencer** in the **Plugins **category.

 [image: sequencer track settings]

The **Track Settings** array is populated by default with settings for the previously mentioned tracks. You can click the **Add (+)** button to add a new array item, and each array has the following categories:

 [image: add track setting]

| Name | Description |
| --- | --- |
| **Matching Actor Class** | This is where you specify the Actor class to automatically create tracks for when adding it to Sequencer. [image: matching actor class] |
| **Default Tracks** | This array is where you specify the tracks that are added when the **Matching Actor Class** is added to Sequencer. Click the **Add (+)** button and click the dropdown menu to browse **Sequencer's** track types. [image: default tracks] |
| **Exclude Default Tracks** | This array is where you specify tracks you don't want added for this Actor class. You may want to use this if you are specifying different tracks to add, such as when your class is inheriting from a parent class which also has its default tracks specified here. |
| **Default Property Tracks** | This array is where you specify the property tracks that are added when the Actor is added to Sequencer. Click the **Add (+)** button to add a new property item to the array. [image: default property tracks] **Component Path** is where you specify the Actor's component you want to add the property from. **Property Path** is where you specify the property name you want to automatically add. |
| **Exclude Default Property Tracks** | This array is where you specify property tracks you don't want added for this Actor class. You may want to use this if you are specifying different tracks to add, such as when your class is inheriting from a parent class which also has its default property tracks specified here. |

- sequencer

On this page

- Prerequisites (-> cinematic-actor-tracks-in-unreal-engine)
- Creation (-> cinematic-actor-tracks-in-unreal-engine)
- Binding (-> cinematic-actor-tracks-in-unreal-engine)
- Multi Binding (-> cinematic-actor-tracks-in-unreal-engine)
- Accessing Components (-> cinematic-actor-tracks-in-unreal-engine)
- Automatic Track Creation (-> cinematic-actor-tracks-in-unreal-engine)
