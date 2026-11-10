# Chaos Fields User Guide

https://dev.epicgames.com/documentation/en-us/unreal-engine/chaos-fields-user-guide-in-unreal-engine?application_version=5.9

> Overview of the Physics Fields in Unreal Engine.

[image: Chaos Fields User Guide]

You can find similar information in video format in the Developer Community site by watching the Chaos Destruction - Fields tutorials.

**Chaos Fields** use a region of space to control properties of a physics simulation. There are three primary types of fields — Anchor Fields, Strain / Force Fields, and Sleep / Disable Fields.

**Anchor** Fields are construction Blueprints that constrain a portion of a **Geometry Collection** in place during simulation. You can use them to make sure a certain part of the Geometry Collection stays fixed in place no matter what happens in the simulation.

**Sleep / Disable **Fields bring a Geometry Collection to rest when the bone (fractured piece) velocities fall below a specified threshold value. Sleeping bones can be reawakened during the simulation if they come in contact with an active object. Disabled bones cannot be reawakened.

**Strain / Force** Fields apply strain or linear velocity to a Geometry Collection during simulation.

Unreal Engine comes with pre-built Chaos Fields that can be used as-is, or modified by opening them in the **Blueprint Editor**.

To find them, click **Settings > Show Engine Content** in the **Content Browser**.

Go to **Engine > Content > EditorResources > FieldNodes** to find the available Chaos Fields.

 [image: Go to Engine - Content - EditorResources - FieldNodes to find the available Chaos Fields]

## Creating a Geometry Collection

In this section you will create a Geometry Collection so you can learn to use the Chaos Fields during a fracture simulation.

- Select a **Static Mesh Actor** in the scene, click the **Mode** dropdown and select **Fracture**. [image: Select the Fracture mode from the Select Mode dropdown] This opens the **Fracture Mode** panels that contain all the tools for fracturing your mesh.

- In the **Generate **section, click **New** to create a new **Geometry Collection**. [image: Click New to create a new Geometry Collection] This asset type will be saved in the **Content Browser** and will be used to create your fractured mesh. [image: Select the directory location, enter a name for your asset and click Create Geometry Collection] (1) Select the **directory location** where the Geometry Collection will be saved.

- (2) Enter the name for the Geometry Collection asset.

- (3) Click **Create Geometry Collection**.

 [image: Click Save All in the Content Browser to save the new Geometry Collection asset]

- Click **Save All** in the **Content Browser** to save the new Geometry Collection asset.

- The Actor you selected in the scene is replaced with the Geometry Collection in the level. [image: The Static Mesh is replaced with the Geometry Collection in the level] See the Geometry Collections User Guide (-> geometry-collections-user-guide) to learn more about creating Geometry Collections.

- Use the Fracturing tools to fracture the Geometry Collection. In the example below, we used the **Slice **and **Uniform Voronoi** tools to create 4 Levels in the **Fracture Hierarchy**. See the Fracturing Geometry Collections User Guide (-> fracturing-geometry-collections-user-guide) to learn more about fracturing Geometry Collections.

## The Anchor Field

Anchor Fields set any Geometry Collection bone that falls within its volume to **Static **during the simulation.

Drag `FS_AnchorField_Generic`** **to the level and overlap it with a corner of the Geometry Collection.

Select the Geometry Collection and go to the **Details **panel. Scroll down to the **Chaos Physics** section and expand the **Initialization Fields** array. Click the **Index [0]** dropdown and select `FS_AnchorField_Generic`** **from the list.

 [image: Click the Index 0 dropdown and select FS_AnchorField_Generic** **from the list]

Go to the **Clustering **section and disable the **Enable Clustering** checkbox. This is done for demonstration purposes as it will better show the fracturing of the Geometry Collection.

 [image: Go to the Clustering section and disable the Enable Clustering checkbox]

Click the **Play Mode** menu button and select **Selected Viewport** or **Simulate** to see the results.

 [image: The bones on the corner stay anchored in place during the simulation]

You can add as many Anchor Fields as you want by following the steps above. In the example below, we added Anchor Field to the top right corner.

 [image: Simulation with two Anchor Fields]

You can also use the same Anchor Field on several Geometry Collections at once. In the example below, we used one Anchor Field on two Geometry Collections.

 [image: One Anchor Field used on two Geometry Collections]

Anchor Fields come with three **Falloff Shapes** — Box, Sphere, and Plane. These shapes affect how many bones are set to Static and how the effect is implemented.

To change the Falloff Shape, select the Anchor Field and go to the **Details **panel. Scroll down to the **Default **section and click the **Anchor Falloff Shape** dropdown. Select the desired falloff shape.

 [image: Click the Anchor Falloff Shape dropdown]

In the example below, we use a **Sphere **shape for the Anchor Field.

 [image: Example of a sphere shape Anchor Field]

In the example below, we use a **Plane **shape for the Anchor Field.

 [image: Example of a plane shape Anchor Field]

## The Sleep and Disable Fields

The **Sleep **and **Disable **Fields bring rigid bodies to rest when their velocities go below a given **Threshold **value. Higher Threshold values will stop objects more aggressively.

These Fields are used to improve simulation performance and prevent excess jittering of the Geometry Collection pieces as they collide with each other. They also give you more control over how many rigid bodies are part of the simulation.

Sleeping bodies can be reawakened when they collide with an active object. Disabled bodies are removed from the simulation completely after they come to a resting state. Disabled bodies cannot be reawakened.

This type of field also has a **Kill **option, in addition to Sleep and Disable. This option ignores the Threshold value and immediately stops the body from simulating and removes it from the simulation once it overlaps the Field's volume.

Drag **FS_SleepDisable_Generic **into the Level and place it as seen below.

Go to the **Details **panel and scroll down to the **Default **section. Here you can specify the **Threshold **value the field uses to apply its effect. You can also specify the **Field Behavior, Falloff Shape**, and whether you want to show the **Debug **information.

 [image: The options available for the Sleep and Disable fields]

In the example below we enabled the **Debug **option and used two Geometry Collections to show the effects of a Sleep Field. On the left, the **Threshold **value is set to **2**, and on the right, the value has been set to **50**.

 [image: Example of Sleep fields with thresholds of 2 and 50]

As you can see, when the first object passes through the volume it goes to sleep. However, it is awakened when it collides with the second object. The higher the Threshold value, the more aggressively the bodies will be set to sleep.

In the examples below, we switched to **Disable **Fields. The Field on the left has a **Threshold **value of **2**, and the Field on the right has a value of **200**.

 [image: Example of Disable fields with thresholds of 2 and 200]

Notice how the Geometry Collections on the right do not collide with each other after they have been disabled. The higher Threshold value shows the effect more prominently.

Finally, we can use **Kill **Fields to immediately stop any rigid body from simulating. Notice that on the right we show a Static Mesh simulating physics while we use Geometry Collections on the left.

 [image: Example of Kill fields stopping a Geometry Collection and a Static Mesh]

## The Master Field

### Introduction

The `FS_MasterField`** **is a pre-built Chaos Field included with Unreal Engine. You can find it by going to **Engine > Content > EditorResources > FieldNodes.**

This Field comes with many options for customization and is used primarily to:

- Activate rigid bodies by applying external strain that breaks the connection between bones.

- Apply velocity to rigid bodies to make them move and spin in a realistic manner

In the example below, we placed a default `FS_MasterField` where it overlaps with a Geometry Collection.

In its default configuration, the Field applies a large amount of external strain which causes the Geometry Collection to fracture. Then, the Field adds radial and angular velocities to the broken pieces to make them spin. Finally, the Field applies noise to add randomness to the effect.

This is the result:

 [image: The FS_MasterField applies strain to the Geometry Collection causing a fracture]

You can configure the shape of the Field by clicking the **Field Falloff Shape** dropdown and choosing an option.

 [image: Select the Field Falloff Shape from the dropdown]

You can also configure the way the Field is applied by clicking the **Activation Type** dropdown and choosing an option.

 [image: Select the Activation Type from the dropdown]

| **Activation Type** | **Description** |
| --- | --- |
| **Delay** | The field activates after the **Delay Amount**. |
| **OnTick** | The field activates on each tick. |
| **OnTickWithDelay** | The field activates on each tick after the initial **Delay Amount**. |
| **Trigger** | The field is activated by a Blueprint directly. |

You can set the Field's **lifespan **by going to **Advanced Field Settings > Timing and Lifespan** section in the **Details **panel. This is useful when you are creating Fields that need to apply their effects over a short period.

You will learn more about these settings and more in the following sections.

### External Strain

**External Strain** breaks the connections between the bones in a fractured Geometry Collection. You can modify the External Strain options of the Field by going to the **Apply External Strain to Break Node Connections** section in the **Details **panel.

 [image: You can modify the external strain options of the field by going to the Apply External Strain to Break Node Connections section in the Details panel]

| **Option** | **Description** |
| --- | --- |
| **Use External Strain** | If enabled, the Field applies external strain to the assigned Geometry Collections. |
| **Strain Magnitude** | The magnitude of the strain force applied. By default, this value is very high to ensure the applied strain force breaks the bones. If the strain force is lower than the Damage Threshold for the Geometry Collection, the strain will not cause a fracture. |
| **Strain Falloff Type** | Applies a falloff to the strain force within the volume. You can select between **Linear**, **Inverse**, **Square**, and **Logarithmic **falloff types. |
| **Strain ****Falloff**** Min Max** | Sets the falloff values from the center of the volume (Min) to the edge of the volume (Max). A value of 0 represents no falloff, and a value of 1 represents 100% falloff. |
| **Num Strain Hits** | Sets the number of times the Field will be applied. The Field is activated once per hit, so multiple hits allow the user to break multiple cluster levels before any forces are applied. |

#### Strain Magnitude

In the example below, the Field is applying more strain than the Geometry Collection's Damage Threshold, resulting in the bones breaking.

 [image: The Geometry Collection breaks due to the strain applied by the Field]

In this example, we have two different Geometry Collections. The blue Geometry Collections have a Damage Threshold of 200,000, while the orange ones have a Damage Threshold of 500,000. The Field is applying internal strain with a magnitude of 400,000. This results in the blue Geometry Collections breaking, while the orange ones remain intact.

 [image: The field is applying strain to two different Geometry Collections. The blue Geometry Collections have a Damage Threshold below the applied internal strain from the field, which results in fracturing]

#### Strain Falloff Type and Min and Max

You can adjust the **Strain Falloff **by clicking the **Strain Falloff Type** dropdown and selecting an option. You can also adjust the Min and Max falloff values to get a desired result.

In this example, the Field has no falloff applied:

 [image: This Field has no falloff applied]

In this example, we applied a **Linear falloff** with a **Max **value of **2**:

 [image: This Field has a Linear falloff with a Max value of 2]
 [image: This Field has a falloff with a Max value of 2]

For performance reasons, we recommend avoiding using falloff with external strain. However, external strain falloff can be useful when combined with internal strain to achieve specific effects.

### Internal Strain

Internal Strain, or decay, changes the internal Damage Threshold values of the Geometry Collection. When active, a decay Field will lower the Damage Threshold of the bones inside the volume by the Decay Amount.

This can be used to weaken a Geometry Collection gradually, until it breaks from external strain.

In the example below, we set the **Activation Type** to **OnTick **with a **Delay Amount **of **1 second**. In addition, we enabled the **Use Decay** checkbox and set a **Decay Amount** of **100,000**, with a **Decay Delay** of **1 second**.

The Geometry Collection has a **Damage Threshold** of **500,000**.

These options will reduce the Damage Threshold of the bones within the volume by 100,000 every second, with a falloff towards the edges. Here are the results:

 [image: We enabled Use Decay and set the Decay Amount to 100,000 with a Decay Delay of 1 second]
 [image: The Field weakens the Geometry Collection until it fractures from external strain]

### Activate Rigid Bodies

There are situations where you might want to activate kinematic rigid bodies without using strain.

You can do this by going to the **Advanced Field Settings > Force Dynamic Switching** section under **Field Settings** and enabling the **Force Dynamic Switch** checkbox.

 [image: Activate Kinematic bodies by going to the Advanced Field Settings - Force Dynamic Switching section and enabling the **Force Dynamic Switch** checkbox]

In the example below, the Geometry Collection is set to **Kinematic **and the field is activating the Geometry Collection without applying any strain or velocity.

 [image: IThe field is activating the Geometry Collection without applying any strain or velocity]

You can also activate **Static **and **Skeletal Meshes** by enabling the **Activate Tagged Static and Skeletal** checkbox.

 [image: You can activate Static and Skeletal Meshes]

For each Mesh you want to activate, set its **Mobility **to **Movable **and add the **Actor Tag** '**SM_Rigids.**' In addition, make sure the Mesh has collision so it can simulate correctly.

 [image: Set the Mobility setting to Movable]
 [image: Add the Actor Tag 'SM_Rigids']
 [image: Both kinematic rigid bodies are activated by the fields]

### Velocity

#### Radial Velocity

Radial velocity pushes objects away from a point in space by a given magnitude. This point is in the center of the volume by default, but can be changed by the user.

In the example below the radial velocity is applied at the center of the sphere volume.

 [image: The radial velocity is applied at the center of the sphere volume]

To change the origin of the velocity, go to the **Advanced Field Settings > Velocity Controls** section and change the **Radial Position Offset**. In this example, we offset the origin in the Y Axis by 100 units. This results in the velocity being applied from the edge of the sphere volume, as seen below.

 [image: You can change the Radial Position Offset here]
 [image: The velocity is applied from the edge of the sphere volume]

You can also apply velocity in a specific direction by going to the **Apply Linear and Angular Velocities** section and enabling the **Use Directional Vector** checkbox.

 [image: You can also apply velocity in a specific direction by going to the Apply Linear and Angular Velocities section and enabling the Use Directional Vector checkbox]

In the example below, we are applying a Directional Magnitude of 800 in the up vector of the Field.

 [image: This Field is applying a Directional Magnitude of 800 in the up vector]

You can change the velocity direction by rotating the field. In this example, we rotated the field to change the direction of the velocity.

 [image: The Field is rotated to change the velocity direction]

You can manually enter the direction vector by going to the **Advanced Field Settings > Velocity Controls** section and enabling the **Override Directional Vector** checkbox. Then, enter the **Directional Vector Override** value.

 [image: You can manually enter the direction vector]
 [image: The Field is applying velocity by using the Directional Vector Override value]

#### Angular Velocity

You can apply angular velocity by going to the **Apply Linear and Angular Velocities** section and enabling the **Use Torque** checkbox. You can control the magnitude of the velocity applied by setting the **Torque Multiplier** value.

In the example below, we set the **Torque Multiplier** to **64**.

 [image: Enable the Use Torque checkbox and enter the Torque Multiplier]
 [image: This Field is applying Torque with a multiplier of 64]

### Force vs Velocity

The `FS_MasterField` comes with options to apply force or velocity within its volume. By default, the Field applies velocity, which explicitly sets the velocity of objects to the given value without taking into account their mass or volume.

Applying force is more realistic, as it takes into account each object's mass during the simulation. To adjust a Geometry Collection's mass, open the **Geometry Collection asset** from the **Content Browser** and go to the **Collision **section. Enter the desired amount for **Mass**.

 [image: Open the Geometry Collection asset, go to the Collision section and enter the desired amount for Mass]

Keep in mind that for Geometry Collections, the **Mass **value under the **Physics **section will not be used by the Field. Instead, only the settings in the Geometry Collection asset itself will be considered.

If you are applying force to a Static Mesh or Skeletal Mesh, set the object's mass by going to the **Details **panel and scrolling down to the **Physics **section. Enable **Simulate Physics** and enter the **Mass **value.

 [image: Go to the Details panel and scroll down to the Physics section. Enable Simulate Physics and enter the Mass value]

In the example below, you can see the Field on the left is applying velocity, while the Field on the right is applying force. Inside each field, there are two objects with a mass of 500 and 1000 Kilograms.

As you can see, both objects on the Field that is applying velocity move in the same way even though they have different masses. However, on the Field that is applying force, the objects are affected differently when the same amount of force is applied.

 [image: The field applying velocity does not take into account the object's mass]

### Falloff

The `FS_MasterField` has a variety of options to control the falloff of velocity applied within its volume. You can change the falloff type by going to the **Apply Linear and Angular Velocities** section and clicking the **Velocity Field Falloff Type** dropdown.

 [image: You can change the falloff type by going to the Apply Linear and Angular Velocities section and clicking the Velocity Field Falloff Type dropdown]

**Velocity Field Falloff Types**

| **Falloff Type** | **Description** |
| --- | --- |
| **None** | No falloff function is applied to the Field. |
| **Linear** | The falloff function will be proportional to X, where X represents the distance between the center of the volume and its edges. |
| **Inverse** | The falloff function will be proportional to 1 / X, where X represents the distance between the center of the volume and its edges. |
| **Squared** | The falloff function will be proportional to X * X, where X represents the distance between the center of the volume and its edges. |
| **Logarithmic** | The falloff function will be proportional to Log(X), where X represents the distance between the center of the volume and its edges. |

When using the Linear falloff type, the field will apply the maximum velocity at the center of the Field, and fade to the minimal value when it reaches the edges of the Field.

In the example below, you can see a Field where the **Minimum Velocity Falloff** is **0**, and the **Maximum Velocity Falloff** is **1**.

 [image: In this Field the Minimum Velocity Falloff is 0, and the Maximum Velocity Falloff is 1]

You can adjust the minimum and maximum Falloff values to create different effects. For example, the Field below is using a **Minimum Falloff **value of **-1**, and a **Maximum Falloff** value of **0**. The negative value pulls objects towards the center, instead of repelling them. This creates the following effect:

 [image: In this Field the Minimum Velocity Falloff is -1, and the Maximum Velocity Falloff is 0]

You can also set the Minimum Falloff and Maximum Falloff values to larger integers to create a ring effect within the volume. In the example below, the **Minimum ****Falloff**** **value is set to **-1, **and the **Maximum Falloff **value is set to **1**.

 [image: In this Field the Minimum Velocity Falloff is -1, and the Maximum Velocity Falloff is 1]

### Noise

The `FS_MasterField` includes the ability to add noise to the velocities and forces applied within its volume. Noise adds randomness to the otherwise predictable velocities applied to objects inside the Field.

To add noise to the Field, go to the **Noise **section in the **Details **panel, and enable the **Use Noise** checkbox. You can set the minimum and maximum noise values multiplied against the velocities inside the Field. You can also set the **Noise Scale Multiplier** which scales the perlin noise used to create randomness.

 [image: To add noise to the Field, go to the Noise section in the Details panel, and enable the Use Noise checkbox]

In the example below, the box Field is applying velocity on Tick without any noise.

 [image: The box Field is applying velocity on Tick without any noise]

In the example below, the box Field is applying velocity on Tick with a **Minimum Noise** value of **0.8** and a **Maximum Noise** value of **1**. The **Noise Scale Multiplier** is set to **30**.

 [image: The box Field is applying velocity on Tick with a Minimum Noise value of 0.8 and a Maximum Noise value of 1]

- physics
- chaos
- destruction

On this page

- Creating a Geometry Collection (-> chaos-fields-user-guide-in-unreal-engine)
- The Anchor Field (-> chaos-fields-user-guide-in-unreal-engine)
- The Sleep and Disable Fields (-> chaos-fields-user-guide-in-unreal-engine)
- The Master Field (-> chaos-fields-user-guide-in-unreal-engine)
- Introduction (-> chaos-fields-user-guide-in-unreal-engine)
- External Strain (-> chaos-fields-user-guide-in-unreal-engine)
- Strain Magnitude (-> chaos-fields-user-guide-in-unreal-engine)
- Strain Falloff Type and Min and Max (-> chaos-fields-user-guide-in-unreal-engine)
- Internal Strain (-> chaos-fields-user-guide-in-unreal-engine)
- Activate Rigid Bodies (-> chaos-fields-user-guide-in-unreal-engine)
- Velocity (-> chaos-fields-user-guide-in-unreal-engine)
- Radial Velocity (-> chaos-fields-user-guide-in-unreal-engine)
- Angular Velocity (-> chaos-fields-user-guide-in-unreal-engine)
- Force vs Velocity (-> chaos-fields-user-guide-in-unreal-engine)
- Falloff (-> chaos-fields-user-guide-in-unreal-engine)
- Noise (-> chaos-fields-user-guide-in-unreal-engine)
