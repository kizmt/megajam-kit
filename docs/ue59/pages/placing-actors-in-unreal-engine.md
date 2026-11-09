# Placing Actors

https://dev.epicgames.com/documentation/en-us/unreal-engine/placing-actors-in-unreal-engine?application_version=5.9

> Shows how you can place Actors such as props, lights, and cameras into your Level.

[image: Placing Actors]

An **Actor** is any object that can be placed into a **Level**, from **Static Meshes** that create your game's environment, to sounds, cameras, player characters, and so on. This page will show you how to place these Actors into your Level so you can bring your world to life.

Placing an Actor into your Level creates an **instance** of the object the Actor is based on.

Adding Actors to your Level also adds them to the **World Outliner**, which is located in the upper-right corner of the Unreal Editor by default. Refer to the World Outliner (-> outliner-in-unreal-engine) documentation for more information.

## Required Setup

Before you can follow the workflows described on this page, you must create a new project and open it in Unreal Editor. The examples on this page will use the Third Person Template, but you can choose any template you like.

## Using the Place Actors Panel

This section will show you how to place Actors from the **Place Actors** panel. To open this panel, from the main menu, go to **Window > Place Actor**. The Place Actors panel will open at the left-hand side of the Unreal Editor window.

The Place Actors panel in the Unreal Editor. Click the image for full size.

Let's go ahead and place a simple cube into your Level. In the **Place Actors** panel, left-click the **Cube** Actor, then drag it into the Level, as shown in the GIF below.

 [image: Placing a cube Static Mesh Actor into the Level]

You can do this for any Actor in the **Place Actors** panel.

### Place Actors Panel Interface

 [image: Place Actors panel interface]

The **Place Actors** panel consists of three major areas:

- Search

- Filters

- Asset View

#### 1. Search

Use the **Search** bar to find any Actor by name.

#### 2. Filters

Use these tabs to quickly switch between Actor categories.

| Tab | Contents |
| --- | --- |
| **Recently Placed** | Rolling history of up to the last 20 types of Actors you placed in your Level. This history is project-specific. |
| **Basic** | Basic Actors such as planes, Pawns, and trigger volumes. Also contains empty Actors and Characters. |
| **Lights** | Different types of lights you can place into your Level. |
| **Shapes** | Simple primitives (cube, sphere, cylinder, cone, and plane). |
| **Cinematic** | A cinematic camera and related Actors that you can use to simulate real-world camera movement. |
| **Visual Effects** | Volumes that visually affect part of all of your Level in some way, such as fog, post-processing, and reflections. |
| **Geometry** | Geometry brushes you can use to quickly block out or prototype a level. Use the Add or Subtract radio buttons to change whether the brush adds geometry to the Level or removes existing geometry. |
| **Volumes** | All placeable Volume types. |
| **All Classes** | All placeable Actors. |

#### 3. Asset View

This view shows all Assets that correspond to the search or filters you selected.

An **Asset** is any piece of content within an Unreal Engine project. All Actors are Assets.

## Placing Actors Using the Context Menu

This section will show you how to place Actors through a **context menu**. A context menu is any menu that opens when you right-click inside Unreal Engine.

You will select the Actor you want to place from the Content Browser. The fastest way to open an instance of the Content Browser is to click the **Content Drawer** button in the lower-left corner of the Unreal Editor window. If you want this instance to persist when it loses focus (when you click away from it), click the **Dock in Editor** button in its upper-right corner.

The Content Browser in the Unreal Editor. Click the image for full size.

To place an Actor from the Content Browser, follow the steps below:

- In the **Content Browser**, find the **Asset** you want to place.

- Left-click the **Asset** to select it.

- With the **Asset** still selected, right-click anywhere in the **Level Viewport** to open the context menu.

- Click the **Asset** under the **Place Actor** section.

Placing an Actor from the Content Browser into a Level using the context menu. Click the image for full size.

After selecting the Asset from the context menu, you will see it appear inside your Level at the coordinates where you right-clicked.

You can also use the context menu to quickly add different types of Assets to your level, even when you have a specific Asset selected in the **Content Browser**. To see the types of Assets you can add, right-click anywhere in your **Level Viewport**, then hover over the **Place Actor** section. Click any Actor you see in this section to place it.

### Replacing Actors

You can also use the context menu to replace one or more Actors in the **Level Viewport** with an Asset you selected in the **Content Browser**. This can be useful if you want to swap multiple Assets at once.

To replace one or more Actors, follow the steps below:

- In the **Content Browser**, select the Actor you want to replace another Actor with.

- Right-click the Actor or Actors in the **Level Viewport** to open the context menu.

- Click **Replace Selected Actors with**.

You can also use this method to replace the selected Actor with any Actor that is also available from the **Place Actors** panel.

## Placing Actors Using Drag and Drop

You can add Actors to your Level from the Content Browser by using drag and drop. To do this, follow the steps below:

- In the **Content Browser**, find the **Asset** you want to place.

- Left-click the **Asset**, then drag it into the **Level Viewport** and drop it at the location where you want to place it.

 [image: Placing an actor into the Level using drag-and-drop]

When you drag and drop an Asset from the Content Browser, the following types of Actors are created for the associated type of Asset:

- **Blueprint**: Places an instance of the Blueprint.

- **Skeletal Mesh**: Places a SkeletalMeshActor.

- **Static Mesh**: Places a StaticMeshActor.

- **Sound Cue**: Places an AmbientSound.

- **Sound Wave**: Places an AmbientSound.

## Placing Actors from the Class Viewer

A more advanced method of placing Actors is by using the **Class Viewer**, which is a hierarchical list of all classes used by the Unreal Editor.

To place an Actor from the Class Viewer, follow these steps:

- Open the **Class Viewer**. From the main menu, go to **Tools > Class Viewer**. Any Actor that can be placed in the level will be tinted blue in this window.

- Select the **Asset** you want to place, then drag it into the **Level Viewport**.

 [image: Placing an Actor from the Class Viewer using drag-and-drop]

For more information, refer to the Class Viewer (-> class-viewer-in-unreal-engine) page.

- actors

On this page

- Required Setup (-> placing-actors-in-unreal-engine)
- Using the Place Actors Panel (-> placing-actors-in-unreal-engine)
- Place Actors Panel Interface (-> placing-actors-in-unreal-engine)
- 1. Search (-> placing-actors-in-unreal-engine)
- 2. Filters (-> placing-actors-in-unreal-engine)
- 3. Asset View (-> placing-actors-in-unreal-engine)
- Placing Actors Using the Context Menu (-> placing-actors-in-unreal-engine)
- Replacing Actors (-> placing-actors-in-unreal-engine)
- Placing Actors Using Drag and Drop (-> placing-actors-in-unreal-engine)
- Placing Actors from the Class Viewer (-> placing-actors-in-unreal-engine)
