# Niagara Fluids Quick Start Guide

https://dev.epicgames.com/documentation/en-us/unreal-engine/niagara-fluids-quick-start-guide-for-unreal-engine?application_version=5.9

> A quick start guide for using the Niagara Fluids plugin to create real-time fluid simulation.

[image: Niagara Fluids Quick Start Guide]

Pre-Requisite Tasks:

- Create a New Project (-> creating-a-new-project-in-unreal-engine)

- Enable the Niagara Plugin (-> how-to-enable-the-niagara-effects-plugin-in-unreal-engine)

**Niagara Fluids** is a plugin that you can enable to add templates to your project for real-time fluid simulation.

## Goals

In this tutorial, you will learn how to enable the Niagara Fluids plugin and create your first project.

## Objectives

- Enable the Niagara Fluids plugin

- Create a new Niagara System from a Fluids template

- Modify the parameters to achieve a new look

## 1 - Enable the Niagara Fluids Plugin

To begin working, first enable the Niagara Fluids plugin.

- Click on **Edit > Plugins**. Click for full size.

- Search for **Niagara** in the search bar. Click the checkbox to the left of **Niagara Fluids**. Click for full size.

- A warning message is displayed, because this plugin is still in Beta. Click **Yes** to enable the plugin. Click for full size.

- You are then prompted to restart Unreal Engine. Click **Restart Now**. Click for full size.

The fluids templates will now be available to you when you create a new Niagara system.

## 2 - Create the Niagara System

Next, you will create a new Niagara system from a Fluids template.

- Right-click in the **Content Drawer**. Under the **Create Basic Asset** section, select **Niagara System**. [image: Select Niagara system in the right-click menu.]

- Select **Niagara Fluids > 3D Gas** from the left menu, then select **Grid3D_Gas_Explosion** and click **Create**. Click for full size.

- Rename the Niagara system to **Grid3DGasExplosion**. [image: Rename your new Niagara system.]

- Drag the Niagara system into your level. The explosion triggers in the scene when you drop it. Click for full size.

## 3 - Add an Actor to Collide With

The first place you can adjust the actor is within the level itself. For this example, you are using a simple sphere.

- Select the Niagara system in the level.

- In the **Details** panel, under **Override Parameters**, adjust any of the exposed parameters as needed. Since this system does not loop, toggle on and off **Show Overlays** to force the explosion to restart. This is a good way to test as you adjust the parameters. Click for full size. | Parameter | Description |
| --- | --- |
| **Collide_GeometryCollection, Collide_PhysicsAsset, Collide_StaticMesh** | Use these data interfaces to add actors in your level to affect your simulation. |
| **DirectionalLight1, DirectionalLight2** | Link up to two directional lights to your system. In this way, you can use lights that are already in your level to illuminate your simulation. If you leave these empty, the system sets some default values. |
| **ResolutionMaxAxis** | Set the resolution of your simulation. Try to keep this as small as possible to preserve memory and performance. |
| **ShowOverlays** | Toggle the bounds of the system on and off. |
| **SourceOffset** | Position the explosion inside the system's bounding box. By default, this is set to the center of the domain. |
| **WorldSpaceSize** | Change the size of the bounding box for the simulation. |

- Set the **WorldSpaceSize** to **300**, **300**, **600**.

- To show how to have the explosion interact with an object, add a simple sphere to the scene and position it above the explosion. Click the **Quick Add Content** button, then select **Shapes > Sphere**. Click for full size.

- Move the sphere into position above your explosion, but within its bounding box. Click for full size.

- To reduce the pixelation of the simulation, you need to increase the resolution. Select the **simulation, then** in the **Details** panel, in the **Override Parameters** section, adjust the **ResolutionMaxAxis** to **300**. Click for full size.

- Next, you need to add a tag to the sphere to indicate to the level that it is a collider object. Click the **sphere** to select it.

- In the **Details** panel, search for 'tag'.

- Under the **Actor** section, in **Advanced > Tags**, click **plus(+)** to add a new tag.

- Type in 'collider' for the name of the tag. The explosion will now collide with the sphere.

Click for full size.

## 4 - Adjust the Look of the Explosion

Next, you fine-tune the look of the explosion.

- Double-click on the **Niagara system** in the **Content Drawer** to open it in the **Niagara Editor**.

- You should see the explosion playing in the **Preview** panel. In the **System Overview**, there are two emitters set up. If you don't see them right away, click F to fit them in the window. Click for full size.

- The emitter on the left, **ParticleSourceEmitter**, injects values into the simulation. The emitter on the right, **Grid3D_Gas_CONTROLS_Emitter**, is known as a Controls emitter. This is the primary emitter you will use to adjust the look. Click on **Emitter Summary** to view the parameters you can adjust. Click for full size. Shift-click the triangle to the left of a section heading to collapse all sections.

- First, adjust the dissipation values. **Dissipation** defines how quickly the data fades over time. The higher the number, the faster the data will drop to zero. Lowering the number will maintain the values for longer. Set the values to the following for a shorter, burst-like explosion. Click for full size. | Parameter | Value |
| --- | --- |
| **Density Dissipation** | 3.0 |
| **Temperature Dissipation** | 1.5 |
| **Velocity Dissipation** | 0.8 |

- Next, adjust the buoyancy values. In this simulation, buoyancy from temperature causes the simulation to rise. Buoyancy from density causes the simulation to fall. Velocity can be added to the simulation by adjusting the density and/or the temperature values. If you change the direction of the **Gravity** parameter, then the buoyancy adapts to the new direction. To make the explosion rise more quickly, change the **Temperature Buoyancy** value to **3.5**. Click for full size.

- To finalize the look, adjust the parameters in the **Render** section. By default, **Render Density** is set to **Linear**. This means that the values defined by **Render Density Range** will start at **0.0** opacity, and ramp up to an opacity of **1.0** when rendered. You can change the opacity overall by adding to the **Render Density Gain** value. For this example, set it to **0.5**. Click for full size. By default, the colors transition from black, to red, orange, and then white, using a black body curve. This black body curve is a physically plausible mapping that gives a realistic look. It is based on the color of the wavelengths of light emitted by a hot black body at different temperatures.

- Change **Render Temperature** to **Curve**. This property is where you can input your own custom values for the color. Click for full size.

- Expand the **Render Temperature Curve**, then **Curve**. Adjust the colors freely to achieve the look you want. Click for full size.

- When you are satisfied with the look, **Save** and then close the Niagara system. In the **Level Editor**, you now see the explosion in your scene with the adjustments you made.

## End Result

Your final result now looks like the following.

 [image: The final result of the Niagara Fluids quickstart.]

## Further Reading

To continue learning more about the parameters you can adjust, read the Niagara Fluids Reference Guide (-> niagara-fluids-reference-in-unreal-engine).

- effects
- getting started
- vfx
- niagara
- visual effects
- particle effects

On this page

- Goals (-> niagara-fluids-quick-start-guide-for-unreal-engine)
- Objectives (-> niagara-fluids-quick-start-guide-for-unreal-engine)
- 1 - Enable the Niagara Fluids Plugin (-> niagara-fluids-quick-start-guide-for-unreal-engine)
- 2 - Create the Niagara System (-> niagara-fluids-quick-start-guide-for-unreal-engine)
- 3 - Add an Actor to Collide With (-> niagara-fluids-quick-start-guide-for-unreal-engine)
- 4 - Adjust the Look of the Explosion (-> niagara-fluids-quick-start-guide-for-unreal-engine)
- End Result (-> niagara-fluids-quick-start-guide-for-unreal-engine)
- Further Reading (-> niagara-fluids-quick-start-guide-for-unreal-engine)
