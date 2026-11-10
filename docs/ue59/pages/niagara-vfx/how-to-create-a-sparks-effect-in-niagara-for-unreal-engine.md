# Sparks Effect

https://dev.epicgames.com/documentation/en-us/unreal-engine/how-to-create-a-sparks-effect-in-niagara-for-unreal-engine?application_version=5.9

> This tutorial shows how to create a sparks effect using Niagara. It shows how to use more than one emitter in a Niagara system.

[image: Sparks Effect]

**Prerequisite Steps:**

This tutorial uses the **M_smoke_subUV**, **M_Spark**, and **M_Radial_Gradient** materials, which can be found with the Starter Content. If you have not done so already, make sure that your project includes the Starter Content. This tutorial also uses the FX_Smoke emitter created in the how-to Create a Sprite Particle Effect in Niagara (-> how-to-create-a-smoke-effect-using-sprite-particles-in-niagara-for-unreal-engine).

To create the Sparks effect included in the Starter Content, you will need to make three Niagara emitters: one for the fountain of sparks, one for the spark at the center, and one for the small stream of smoke rising from the fountain of sparks.

The final effect will look like the following.

 [image: Sparks Effect Final Result]

You will start with the smoke emitter, because you can create it using a copy of an existing emitter.

## Create the Smoke Emitter and the Sparks System

Niagara emitters and systems are independent. The current recommended workflow is to create a system from existing emitters or emitter templates.

- Create a new folder for this tutorial in the Content folder for your project.

- Make a copy of the **FX_Smoke** emitter you created in Create a Sprite Particle Effect in Niagara (-> how-to-create-a-smoke-effect-using-sprite-particles-in-niagara-for-unreal-engine). Click image for full size.

- Drag this duplicate emitter to the folder you created in step 1. In the popup context menu, select **Move**.

- Rename the copied emitter **FX_Sparks_Smoke**. [image: Rename Emitter]

- Now create a system for your spark effect. Right-click on your new smoke emitter, and select **Create Niagara System**. Click image for full size. There are multiple ways to create new Niagara systems. Because you are starting with an emitter you have already created, the method used here quickly creates a system containing that emitter. However, as you saw in the Create a Sprite Particle Effect tutorial, there are emitter and system wizards that give you many other options for creating and setting up a Niagara system.

- Name the system **SparksSystem**. [image: Name System]

- Open your Level in the Level Editor, if it isn't open already. Drag the **SparksSystem** tile from the **Content Drawer** into your Level. When you make a particle effect, it is always a good idea to drag your system into your level. This gives you a chance to see every change and edit in context. Any changes you make to the system automatically propagate to the instance of the system in your level. Click image for full size.

### Smoke Emitter - Edit the Emitter Update Settings

- In the **System Overview**, click the **Emitter Update** group to open it in the **Selection** panel. Click image for full size.

- Open the **Emitter State** module. This module controls time and scalability for this emitter. Click the dropdown and set the **Life Cycle Mode** to **System**. This enables your system to calculate life cycle settings, which usually optimizes performance. By default, the system loops infinitely on a 5 second interval. Click image for full size.

- Open the **Spawn Rate** module. Change the **Spawn Rate** setting to **20**. Click image for full size.

### Smoke Emitter - Edit the Particle Spawn Settings

Next, you will edit the modules in the Particle Spawn group. These are behaviors that apply to particles when they first spawn.

- In the **System Overview**, click the **Particle Spawn** group to open it in the **Selection** panel. Click image for full size.

- Open the **Initialize Particle** module. Under **Point Attributes**, expand **Lifetime**. Change the **Minimum** and **Maximum** values to the following. Click image for full size. | Parameter | Value |
| --- | --- |
| **Lifetime Mode** | Random |
| **Minimum** | 2.0 |
| **Maximum** | 3.0 |

- Locate the **Color** parameter. Change the **RGB** values to the following. Click image for full size. | Parameter | Value |
| --- | --- |
| **Red** | 0.3 |
| **Green** | 0.3 |
| **Blue** | 0.3 |

- Under **Sprite Attributes**, expand **Sprite Size**. Set the Sprite Size Mode to **Non-Uniform**. Set the **Minimum** and **Maximum** values to the following. Click image for full size. | Parameter | Value |
| --- | --- |
| **Sprite Size Mode** | Random Uniform |
| **Minimum** | 20.0 |
| **Maximum** | 40.0 |

- Open the **Add Velocity** module. Change the Velocity **Minimum** and **Maximum** values to the following. Click image for full size. | Velocity | Minimum | Maximum |
| --- | --- | --- |
| **X** | 0.0 | 1.0 |
| **Y** | 0.0 | 1.0 |
| **Z** | 25.0 | 35.0 |

- Open the **Shape Location** module. Change the **Sphere Radius** value to **5**. Click image for full size.

### Smoke Emitter - Edit the Particle Update Settings

Now you will edit the modules in the Particle Update group. These behaviors apply to an emitter's particles and update each frame.

- In the **System Overview**, click the **Particle Update** group to open it in the **Selection** panel. Click image for full size.

- Open the **Scale Color** module. Click to deselect the box next to **Scale RGB**. Above the curve for **Scale Alpha**, click the **Smooth Ramp Down** template to apply that shape to the curve. Click image for full size.

- Open the **Acceleration Force** module. Set the **Acceleration** values to **X: 0, Y: 0, Z: 20**. Click image for full size.

At this stage in the process, you have finished configuring the first emitter in the system. It should look similar to the following.

 [image: Sparks Effect First Emitter Configured]

## Add the Spark Burst Emitter to the System

Next, you will create the spark burst at the center of the effect.

- Right-click in the **System Overview** of your SparkFountain system. Click **Add Emitter**, and a list of existing emitters will display. From the list of emitters, select the **Simple Sprite Burst** template. Click image for full size.

- The default name for the template emitter is **SimpleSpriteBurst**, but you can rename it. Click on the emitter name, and the field becomes editable. Name the new emitter **FX_SparkBurst**. Click image for full size.

### Spark Burst Emitter - Edit Render Settings

The **Render** group is last in the stack, but you need to change the material so that the effect displays the way it is supposed to.

- In the **System Overview**, click the **Render** group to open it in the **Selection** pane. Click image for full size.

- Under **Sprite Renderer**, click the dropdown for **Material**, and select the **M_Spark** material from the Starter Content. Click image for full size.

### Spark Burst Emitter - Edit the Emitter Update Settings

First, you will edit the modules in the **Emitter Update** group. These are behaviors that apply to the emitter, and that update each frame.

- In the **System Overview**, click the **Emitter Update** group to open it in the **Selection** panel. Click image for full size.

- Remove the **Sprite Burst Instantaneous** module by clicking the **Trashcan** icon. Click image for full size.

- Open the **Emitter State** module. This module controls time and scalability for this emitter. Because you used the Simple Sprite Burst template, the **Life Cycle Mode** is set to Self. Normally this is used for complete customization of emitter life cycle logic for this specific emitter, but it is not needed for this effect. Click the dropdown and set the **Life Cycle Mode** to **System**. This enables your system to calculate life cycle settings, which usually optimizes performance. By default, the system loops infinitely on a 5 second interval. Click image for full size.

- Click the **Plus sign** (**+**) for Emitter Update, and select **Spawning > Spawn Rate**. Click image for full size.

- Open the **Spawn Rate** module. Set the **Spawn Rate** to **50**. Click image for full size.

### Spark Burst Emitter - Edit the Particle Spawn Settings

Next, you will edit the modules in the **Particle Spawn** group. These are behaviors that apply to particles when they first spawn.

- In the **System Overview**, click the **Particle Spawn** group to open it in the **Selection** panel. Click image for full size.

- Under **Point Attributes**, set the **Lifetime** to **.2**. Click image for full size.

- Set the **Mass Mode** to **Random** and the **Minimum** and **Maximum** values to the following: Click image for full size. | Parameter | Value |
| --- | --- |
| **Mass Mode** | Random |
| **Minimum** | 0.6 |
| **Maximum** | 1.0 |

- Under **Sprite Attributes**, expand **Sprite Size**. Set the **Sprite Size Mode** to **Random Non-Uniform**. Set the Sprite Size **Minimum** and **Maximum** values to the following: Click image for full size. | Sprite Size | Minimum | Maximum |
| --- | --- | --- |
| **X** | 10.0 | 30.0 |
| **Y** | 10.0 | 25.0 |

- Click the box next to **Sprite Rotation** to enable it. Set the **Sprite Rotation Mode** to **Direct Angle (Degrees)**. Click the dropdown next to the Value field, and select **Dynamic Inputs > Random Range Float**. Click image for full size.

- Set the **Minimum** and **Maximum** to the following: Click image for full size. | Parameter | Value |
| --- | --- |
| **Minimum** | -10.0 |
| **Maximum** | 30.0 |

- Click the **Plus sign** (**+**) for Particle Spawn, and select **Velocity > Add Velocity**. Click image for full size.

- Open the **Add Velocity** module. Click the dropdown next to the value, and select **Dynamic Inputs > Random Range Vector**. Click image for full size.

- Set the Velocity **Minimum** and **Maximum** to the following: Click image for full size. | Velocity | Minimum | Maximum |
| --- | --- | --- |
| **X** | 0.0 | 5.0 |
| **Y** | 0.0 | 5.0 |
| **Z** | 0.0 | 5.0 |

- Click the **Plus sign** (**+**) for Particle Spawn, and select **Location > Shape Location**. Click image for full size.

- Open the **Shape Location** module. Set the **Sphere Radius** to **5**. Click image for full size.

### Spark Burst Emitter - Edit the Particle Update Settings

Now you will edit the modules in the **Particle Update** group. These behaviors apply to an emitter's particles and update each frame.

- In the **System Overview**, click the **Particle Update** group to open it in the **Selection** panel. Click image for full size.

- Open the **Scale Color** module. For **Scale RGB**, set the **RGB** values to the following. Under **Scale Alpha**, select the **Smooth Ramp Down** template. Click image for full size. | Color | Value |
| --- | --- |
| **R** | 2.0 |
| **G** | 6.0 |
| **B** | 25.0 |

- Click the **Plus sign** icon (**+**) for **Particle Update**, and select **Size > Scale Sprite Size**. You can also type `scale` in the search bar, as shown below. Click image for full size.

- Open the **Scale Sprite Size** module. Click the dropdown next to the **Scale Factor** value field, and select **Dynamic Inputs > Random Range Vector 2D**. You can also type `random` in the search bar. Click image for full size.

- Set the Scale Factor **Minimum** and **Maximum** to the following: Click image for full size. | Scale | Minimum | Maximum |
| --- | --- | --- |
| **X** | 1.0 | 3.5 |
| **Y** | 2.5 | 5.0 |

At this stage in the process, you have finished configuring the second emitter in the system. It should look similar to the following.

 [image: Sparks Effect Second Emitter Configured]

## Add the Radial Sparks Emitter to the System

- Right-click in the **System Overview** of your SparkFountain system. Click **Add Emitter**, and a list of existing emitters will display. From the list of emitters, select the **Simple Sprite Burst** template. Click image for full size.

- The default name for the template emitter is **SimpleSpriteBurst**, but you can rename it. Click on the emitter name, and the field becomes editable. Name the new emitter **FX_Sparks_Radial**. Click image for full size.

### Radial Sparks Emitter - Edit Render Settings

The **Render** group is last in the stack, but you need to change the material so that the effect displays the way it is supposed to.

- In the **System Overview**, click the **Render** group to open it in the **Selection** panel. Click image for full size.

- Click the dropdown for **Material**, and select the **M_Radial_Gradient** material from the Starter Content. To locate it, type `radial` in the search bar, as shown below. Click image for full size.

- Click the dropdown for **Alignment** and select **Velocity Aligned**. Click image for full size.

### Radial Sparks Emitter - Edit the Emitter Update Settings

First, you will edit the modules in the **Emitter Update** group. These are behaviors that apply to the emitter, and that update each frame.

- In the **System Overview**, click the **Emitter Update** group to open it in the **Selection** panel. Click image for full size.

- Remove the **Sprite Burst Instantaneous** module by clicking the **Trashcan** icon. Click image for full size.

- Open the **Emitter State** module. This module controls time and scalability for this emitter. Because you used the **Simple Sprite Burst** template, the **Life Cycle Mode** is set to **Self**. Normally this is used for complete customization of emitter life cycle logic for this specific emitter, but it is not needed for this effect. Click the dropdown and set the **Life Cycle Mode** to **System**. This enables your system to calculate life cycle settings, which usually optimizes performance. By default, the system loops infinitely on a 5 second interval. Click image for full size.

- Click the **Plus sign** icon (**+**) for **Emitter Update**, and select **Spawning > Spawn Rate**. Click image for full size.

- Open the **Spawn Rate** module. Set the **Spawn Rate** to **500**. Click image for full size.

### Radial Sparks Emitter - Edit Particle Spawn Settings

Next, you will edit the modules in the **Particle Spawn** group. These are behaviors that apply to particles when they first spawn.

- In the **System Overview**, click the **Particle Spawn** group to open it in the **Selection** panel. Click image for full size.

- Open the **Initialize Particle** module. Under **Point Attributes**, expand **Lifetime**. Set the Lifetime Mode to **Random** and the **Minimum** and **Maximum** values to the following: Click image for full size. | Parameter | Value |
| --- | --- |
| **Lifetime Mode** | Random |
| **Minimum** | 0.2 |
| **Maximum** | 0.7 |

- Expand **Color**. Set the **Color Mode** to **Direct Set** and the RGB values to the following: Click image for full size. | Parameter | Value |
| --- | --- |
| **Red** | 2.0 |
| **Green** | 8.0 |
| **Blue** | 20.0 |
| **Alpha** | 1.0 |

- Expand **Mass**. Set the **Mass Mode** to **Random** and the **Minimum** and **Maximum** values to the following: Click image for full size. | Parameter | Value |
| --- | --- |
| **Mass Mode** | Random |
| **Minimum** | 0.3 |
| **Maximum** | 0.6 |

- Under **Sprite Attributes**, set the **Sprite Size Mode** to **Non-Uniform**. Set the following values: **X: 0.25, Y: 0.5**. Click image for full size.

- Leave the **Sprite Rotation Mode** and **Sprite UV Mode** as **Unset**.

- Click the **Plus sign** icon (**+**) for **Particle Spawn**, and select **Mass > Calculate Size and Rotational Inertia by Mass**. You can also type `calc` in the Search bar, as shown below. Click image for full size.

- Open the **Calculate Size and Rotational Inertia by Mass** module. Under **Density**, set **Density by Material Type** to **Water**. Click image for full size.

- Under **Proportions**, change the **Height** to **0.5** and **Depth** to **0.0**. Click image for full size.

- Click the **Plus sign** icon (**+**) for **Particle Spawn**, and select **Velocity > Add Velocity**. You can also type `velocity` in the Search bar. Click image for full size.

- Open the **Add Velocity** module. Click on the dropdown menu and select **Dynamic Inputs** then **Random Range Vector**. Click image for full size.

- Set the Velocity **Minimum** and **Maximum** to the following. Click image for full size. | Velocity | Minimum | Maximum |
| --- | --- | --- |
| **X** | -100.0 | 90.0 |
| **Y** | -100.0 | 90.0 |
| **Z** | 300.0 | 500.0 |

- Click the **Plus sign** icon (**+**) for **Particle Spawn**, and select **Location > Shape Location**. You can also type `sphere` in the Search bar. Click image for full size.

- Open the **Shape Location** module. Set the **Sphere Radius** to **2.0**. Click image for full size.

### Radial Sparks Emitter - Edit the Particle Update Settings

Now you will edit the modules in the **Particle Update** group. These behaviors apply to an emitter's particles and update each frame.

- In the **System Overview**, click the **Particle Update** group to open it in the **Selection** panel. Click image for full size.

- Click the **Plus sign** icon (+) for **Particle Update**, and select **Velocity > Scale Velocity**. Click image for full size.

- Set the **Scale Velocity** to **X: 3.0, Y: 4.0, Z: 1.0**. Click image for full size.

- Click the **Plus sign** icon (**+**) for **Particle Update**, and select **Forces > Gravity Force**. Click image for full size.

- Open the **Gravity Force** module. Change the **Z** value to **-4500**. Click image for full size.

- Click the **Plus sign** icon (**+**) for **Particle Update**, and select **Forces > Drag**. Click image for full size.

- Open the **Drag** module. Set the **Drag** value to **1.7**. Click image for full size.

- Click the **Plus sign** (**+**) for **Particle Update** and select **Collision > Collision**. This module will make sure any sparks that hit something like a floor will collide and bounce back. Click image for full size.

- Open the **Collision** module. Under **Bounce**, set the **Restitution** value to **0.4**. Click image for full size.

- Under **Friction**, set the **Friction** value to **0.2**. Click image for full size.

- Remove the **Scale Color** module by clicking the **Trashcan** icon. Click image for full size.

- Click the **Plus sign** (**+**) and select **Size > Scale Sprite Size by Speed**. Click image for full size.

- Open the **Sprite Size Scale by Speed** module. Set the **Scale Factor** Minimum and Maximum to the following. Click image for full size. | Sprite Size Scale by Speed | Minimum | Maximum |
| --- | --- | --- |
| **X** | 0 | 0.5 |
| **Y** | 3 | 6 |

- Set the **Velocity Threshold** value to **2000**. Click image for full size.

## End Result

Congratulations! After following these steps, the Sparks effect is complete. You can check the final results back in your level, and make any adjustments you like to fine-tune it.

 [image: Sparks Effect Final Result]

- effects
- vfx
- niagara
- visual effects
- particle effects

On this page

- Create the Smoke Emitter and the Sparks System (-> how-to-create-a-sparks-effect-in-niagara-for-unreal-engine)
- Smoke Emitter - Edit the Emitter Update Settings (-> how-to-create-a-sparks-effect-in-niagara-for-unreal-engine)
- Smoke Emitter - Edit the Particle Spawn Settings (-> how-to-create-a-sparks-effect-in-niagara-for-unreal-engine)
- Smoke Emitter - Edit the Particle Update Settings (-> how-to-create-a-sparks-effect-in-niagara-for-unreal-engine)
- Add the Spark Burst Emitter to the System (-> how-to-create-a-sparks-effect-in-niagara-for-unreal-engine)
- Spark Burst Emitter - Edit Render Settings (-> how-to-create-a-sparks-effect-in-niagara-for-unreal-engine)
- Spark Burst Emitter - Edit the Emitter Update Settings (-> how-to-create-a-sparks-effect-in-niagara-for-unreal-engine)
- Spark Burst Emitter - Edit the Particle Spawn Settings (-> how-to-create-a-sparks-effect-in-niagara-for-unreal-engine)
- Spark Burst Emitter - Edit the Particle Update Settings (-> how-to-create-a-sparks-effect-in-niagara-for-unreal-engine)
- Add the Radial Sparks Emitter to the System (-> how-to-create-a-sparks-effect-in-niagara-for-unreal-engine)
- Radial Sparks Emitter - Edit Render Settings (-> how-to-create-a-sparks-effect-in-niagara-for-unreal-engine)
- Radial Sparks Emitter - Edit the Emitter Update Settings (-> how-to-create-a-sparks-effect-in-niagara-for-unreal-engine)
- Radial Sparks Emitter - Edit Particle Spawn Settings (-> how-to-create-a-sparks-effect-in-niagara-for-unreal-engine)
- Radial Sparks Emitter - Edit the Particle Update Settings (-> how-to-create-a-sparks-effect-in-niagara-for-unreal-engine)
- End Result (-> how-to-create-a-sparks-effect-in-niagara-for-unreal-engine)
