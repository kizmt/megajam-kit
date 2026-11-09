# Physical Materials User Guide

https://dev.epicgames.com/documentation/en-us/unreal-engine/physical-materials-user-guide-for-unreal-engine?application_version=5.9

> Guide to the creation and application of Physical Materials in Unreal Engine.

[image: Physical Materials User Guide]

This document will cover the creation and usage of **Physical Materials** as well as enabling or editing **Surface Types** for your project.

## Creation

- From the **Content Drawer**, click **Add > Physics > Physical Material** or right-click in the **Content Drawer > Physics > Physical Material**. [image: Click Add, Physics, Physical Material or right-click in the Content Drawer, Physics, Physical Material from the Content Drawer]

- Double click the **NewPhysicalMaterial** to edit its properties. [image: Double click the NewPhysicalMaterial]

- Adjust properties. [image: Adjust properties]

- Click **Save** [image: Click Save]

See the Physical Material Reference (-> physical-materials-reference-for-unreal-engine) for information on the properties of the Physical Material.

### Surface Type

By default, Unreal Engine 5 supports 62 Surface Types, which can be labeled as anything you desire, stored in your project's `DefaultEngine.ini`, which can be found in `YourProjectRoot\Config\DefaultEngine.ini`.

## Usage

### Material

- Open or create a new material. [image: Open or create a new Material]

- Select the main material node. [image: Select the main material node]

- Change the **Physical Material**. [image: Change the Physical Material]

### Material Instance

- Open or create a new **Material Instance**. [image: Open or create a new Material Instance]

- Change the Physical Material. [image: Change the Physical Material]

### Physics Asset (Skeletal Mesh)

When adjusting the Physical Material for a **Physics Asset**, it is best to start by assigning the most commonly used Physical Material to all of the **Physics Bodies** in the Physics Asset.

- Double-click a **Physics Asset** in the **Content Drawer** to open it in the **Physics Asset Editor**. [image: Double-click a Physics Asset in the Content Drawer to open it in the Physics Asset Editor]

- In the Physics Asset Editor, select a Physical Material from the **Physical Material** dropdown in the toolbar. [image: Select a Physical Material from the Physical Material dropdown in the toolbar in the Physics Asset Editor]

If specific Physics Bodies need differing Physical Materials, you can then adjust them individually.

- Double-click a **Physics Asset** in the **Content Drawer** to open it in the **Physics Asset Editor**.

- Select a **Physics Body**.

- In the Details pane, in the Physics Category, change the **Simple Collision Physical Material**.

 [image: Physical Material Physics Asset]

The default behavior for Physics interactions with Skeletal Meshes is to only interact with its associated Physics Asset, so the Skeletal Mesh's material's Physical Material will
not be used.

With Physics Assets, though you are setting the Simple Collision Physical Material, when you trace against a Physics Asset, you will need to do a complex trace and the complex trace
will return the Physical Material listed in the Simple Collision Physical Material property of the hit Physics Body.

### Static Mesh

**Static Meshes** have both **Simple Collision** (the Physics Bodies that you create in your 3D art package or the StaticMesh Editor) and **Complex Collision** (per poly collision) which can be composed of several different materials each with their differing Physical Materials.

| Collision | Physical Material Order |
| --- | --- |
| **Simple** | When any collision or trace uses Simple Collision, it will reference the Physical Material on the StaticMesh that is set in the StaticMesh Editor, or if the Phys Material Override on the StaticMesh Actor is set to something other than `None`, it will use what is listed in that property. |
| **Complex** | When any collision or trace uses Complex Collision, it will reference the Physical Material on the Material or Material Instances applied to the StaticMesh Actor, or if the Phys Material Override on the StaticMesh Actor is set to something other than `None`, it will use what is listed in that property. |

To set the Simple Collision Physical Material for a StaticMesh:

- Double Click a **Static Mesh** in the **Content Drawer** to bring up the **Static Mesh Editor**. [image: Double Click a Static Mesh in the Content Drawer to bring up the Static Mesh Editor]

- Change the **Simple Collision Physical Material** property in the **Static Mesh Settings** category to the desired Physical Material. [image: Change the Simple Collision Physical Material property in the Static Mesh Settings category to the desired Physical Material]

- Click **Save** [image: Click Save]

### Misc

 [image: The Phys Material Override property exists on everything with a Physics category]

The Phys Material Override property exists on everything with a **Collision** category. This can be used to completely override Simple Collision Physical Materials on an Actor or Component with the selected Physical Material.

- Overriding a StaticMesh's simple collision Physical Material.

- Since Skeletal Meshes Physics Assets always return Simple Collision, you can use this to override all Physical Materials on a placed Skeletal Mesh Actor.

This does not affect Complex Collision traces.

- physics
- physical materials

On this page

- Creation (-> physical-materials-user-guide-for-unreal-engine)
- Surface Type (-> physical-materials-user-guide-for-unreal-engine)
- Usage (-> physical-materials-user-guide-for-unreal-engine)
- Material (-> physical-materials-user-guide-for-unreal-engine)
- Material Instance (-> physical-materials-user-guide-for-unreal-engine)
- Physics Asset (Skeletal Mesh) (-> physical-materials-user-guide-for-unreal-engine)
- Static Mesh (-> physical-materials-user-guide-for-unreal-engine)
- Misc (-> physical-materials-user-guide-for-unreal-engine)
