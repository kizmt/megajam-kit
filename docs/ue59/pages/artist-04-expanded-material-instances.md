# Expanded Material Instances

https://dev.epicgames.com/documentation/en-us/unreal-engine/artist-04-expanded-material-instances?application_version=5.9

> Use dynamic material instances to create an interactive tech demo.

[image: Expanded Material Instances]

Changing an asset’s material properties during gameplay is a useful way to give the player visual feedback, gameplay information, or create immersion. For example:

- Player skins can change looks to signal different status effects.
- Pickups can shine to attract attention from nearby players.
- During rain, the ground turning from dry to wet can increase immersion.

 A character's arm becomes emissive after a powerup.

In this tutorial, you’ll use **Blueprints** to change Material properties at runtime in an interactive tech demo. For this demo, you’ll create a ball of water that soaks the floor as the player pushes it around the level.

You’ll also experiment with **emissive materials**, simple **masks**, and **static switches** to create set dressing that reflects off the wet floor.

## Create a Game-Ready Floor Asset

The first asset you'll build for the tech demo will be the floor. In Room 3 of **Lvl_Adventure**, you’ll create a surfaced, game-ready floor asset to replace the placeholder floor mesh.

[image: Placeholder-floor-mesh-of-Room-3] Placeholder floor mesh of Room 3.

Before you begin, let’s pause to consider your approach. In the previous tutorial (-> artist-03-create-materials-and-material-instances), you learned that **tiling** **textures** are an inexpensive way to surface large meshes such as a floor. You also learned that a mesh’s UVs (-> uvs-category-in-unreal-engine) affect how textures appear.

 (1) Appropriately scaled material. (2) Uniformly scaled-up material. (3) Non-uniformly scaled-up material.

The placeholder floor in Room 3 is made up of three meshes and each one has different UVs.

In the demonstration below, notice that the tiling textures seem to be different sizes because of UV inconsistencies between the meshes. This poses a challenge for cohesively surfacing the floor.

[image: Floor-pattern-sliding-over-platforms] Scaling a non-world-aligned texture across meshes with different UVs.

You’ll solve this challenge by using **triplanar projection**. Triplanar projection is a surfacing technique that disregards UVs and makes a texture **world-aligned**. This is useful for cases when you cannot correct UVs or are working with geometry that’s difficult to UV map.

[image: Floor-pattern-moving-over-platforms] Scaling a world-aligned texture across meshes with different UVs.

With this approach in mind, you’ll use **expressions** to make `M_Surfaces` world-aligned. Because instances inherit properties from parent Materials, `MI_Surfaces_Floor` will be world-aligned as well. Then, you’ll apply `MI_Surfaces_Floor` to a blueprint that will replace the placeholder meshes.

To avoid UV issues in advance, we recommend scaling your UVs appropriately across modular assets when creating them in modeling software.

### Create a World-Aligned Material

To make your parent Material world-aligned, follow these steps:

- In the **Content Browser**, navigate to **All > Content > AdventureGame > Artist > Materials** and open `M_Surfaces`.
- Select all nodes in the **UV Tiling** comment box, the diffuse map, and normal map. **Delete** them. [image: Delete-the-UV-box-and-2-maps]
- Right-click the graph and search for Texture Object (-> texture-material-expressions-in-unreal-engine). Create two of these nodes. [image: Create-2-texture-target-nodes]
- Select the first **Texture Object**. In the **Details** panel, set its **Texture** to **DefaultDiffuse**.
- Right-click the **Texture Object** and select **Convert to Parameter**. Name the new parameter `Diffuse`.
- Select the second **Texture Objec**t. In the **Details** panel, set its **Texture** to **DefaultNormal**.
- Right-click the **Texture Object** and select **Convert to Parameter**. Name the new parameter `Normal`.
- On the **Diffuse** node, drag from the output and add a **World Aligned Texture** node. [image: Add-world-aligned-texture-mode]
- From the **XYZ Texture** output, connect it to the **A** input of the **Multiply** node (inside the Diffuse Hue comment box).
- On the **Normal** node, drag from the **output** and add a **World Aligned Normal** node.
- From the **XYZ Texture** output, connect it to the **Normal** input of the **M_Surfaces** material root node.
- Right-click in the graph and search for **Scalar Parameter**. Name it `Texture Scaling`.
- Set its **Default Value** to `214`.
- Connect the output from **Texture Scaling** to the **TextureSizeV3** inputs on both **WorldAligned** nodes.
- **Save** your Material.

Your Material Graph should now look like this:

[image: Finished-graph-with-all-nodes-shown]

Next, you’ll create a blueprint that will replace the placeholder floor.

### Create a Floor Blueprint

To create the blueprint, follow these steps:

- In the **Content Browser**, at the path **All > Content > AdventureGame > Artist**, right-click and select **New Folder**.
- Name the folder `Blueprints`.
- Right-click in the **Blueprints** folder, select **Blueprint Class**, and select **Actor** as the Parent Class.
- Name the blueprint `BP_Floor` and double-click to open it in the **Blueprint Editor**.
- In the Content Browser, select the **All** folder, and search for `SM_Cube`.[image: SM-cube-in-the-content-browser]
- Drag **SM_Cube** into the **Components** panel of the Blueprint Editor, as a child of **BP_Floor**. [image: Drag-SM-cube-to-the-editor]
- Name the SM_Cube `Floor`.
- In the **Details** panel, ensure that its **Scale** is `1.0, 1.0, 1.0`.
- Next to **Materials > Element 0**, set its material to `MI_Surfaces_Floor`.[image: Materials-setting-in-the-details-tab]
- In the **Components** tab, select **DefaultSceneRoot**, click **Add**, and add a `Box Collision`.
- Name the box collision `Trigger`.[image: Box-collision-named-trigger]
- In the **Details** panel, set Trigger’s **Scale** to `1.5, 1.5, 1.5`.
- Set Trigger’s Location to `50, 50, 55`.
- **Save** and **Compile** your blueprint.

Drag an instance of `BP_Floor` into your level and move it around. Notice that as you move the mesh, the texture stays in the same place. If you try scaling it, the mesh changes but the texture does not.

Next, you’ll replace the placeholder flooring in Room 3 with instances of `BP_Floor`.

### Replace the Placeholder Meshes

You can now replace the placeholder meshes in Room 3 with `BP_Floor` in whatever arrangement you prefer. We created a floor that matches the placeholders:

[image: Surfaced Floor]

If you prefer to use what is shown above, you can copy this level by following these steps:

- Verify that you’ve updated `M_Surfaces` and created `BP_Floor` per the tutorial above.
- In the **Outliner**, select everything inside the Room 3 folder, and press **Delete**.
- **Copy** the following snippet. Console Output ```
Begin Map
   Begin Level
      Begin Actor Class=/Script/Engine.StaticMeshActor Name=StaticMeshActor_2 Archetype="/Script/Engine.StaticMeshActor'/Script/Engine.Default__StaticMeshActor'" ExportPath="/Script/Engine.StaticMeshActor'/Game/SFEFWFWEEEWEF.SFEFWFWEEEWEF:PersistentLevel.StaticMeshActor_2'"
         Begin Object Class=/Script/Engine.StaticMeshComponent Name="StaticMeshComponent0" Archetype="/Script/Engine.StaticMeshComponent'/Script/Engine.Default__StaticMeshActor:StaticMeshComponent0'" ExportPath="/Script/Engine.StaticMeshComponent'/Game/SFEFWFWEEEWEF.SFEFWFWEEEWEF:PersistentLevel.StaticMeshActor_2.StaticMeshComponent0'"
         End Object
         Begin Object Name="StaticMeshComponent0" ExportPath="/Script/Engine.StaticMeshComponent'/Game/SFEFWFWEEEWEF.SFEFWFWEEEWEF:PersistentLevel.StaticMeshActor_2.StaticMeshComponent0'"
            StaticMesh="/Script/Engine.StaticMesh'/Game/LevelPrototyping/Meshes/SM_Cylinder.SM_Cylinder'"
            StaticMeshImportVersion=1
            bUseDefaultCollision=False
            StaticMeshDerivedDataKey="STATICMESH_FD1BFC73B5510AD60DFC65F62C1E933E_228332BAE0224DD294E232B87D83948FQuadricMeshReduction_V2$2e1_6D3AF6A2$2d5FD0$2d469B$2dB0D8$2dB6D9979EE5D2_CONSTRAINED0_100100000000000000000000000100000000000080FFFFFFFFFFFFFFFFFFFFFFFF000000000000803F00000000000000803F0000803F00000000000000003D19FC1626C9B2485E57DB4B8EC731318B8215AE8D46FAD400000000010000000100000000000000010000000100000000000000000000000100000001000000400000000000000001000000000000000000F03F000000000000F03F000000000000F03F0000803F00000000050000004E6F6E65000C00000030000000803FFFFFFFFF0000803FFFFFFFFF0000000000000041000000000000A0420303030000000000000000_RT00_0"
```
- In the **Viewport**, press **Ctrl + V**.

Next, you’ll create the water ball and use **Dynamic Materials Instances **to turn the floor from dry to wet.

## Change Materials Using Player Interaction

The water ball will be a physics-enabled object that triggers a property change in the floor, making it appear wet.

### Create a Water Ball

To create and surface the water ball, follow these steps:

- In the **Content Browser**, in the **Blueprints** folder, right-click to create a new **Blueprint Class**.
- Select **Actor** as the Parent Class.
- Name the new blueprint `BP_WaterBall` and open it in the **Blueprint Editor**.
- In the **Components** tab, click **Add** and search for `Sphere`.
- In the **Details** panel, set **Materials > Element 0** to `M_Water`.`M_Water` comes with the Unreal Engine; you do not have to download or create it. If you don’t see this asset, click the **Settings** button in the asset picker or Content Browser, and enable **Plugin Content**.[image: Enabling-plugin-content-checkmark]
- Still in the **Details** panel, under **Physics**, check **Simulate Physics**.[image: Simulate-physics-checkbox-selected]
- **Save** and **Compile** your blueprint.
- Drag an instance of `BP_WaterBall` into your level.

Test the water ball in your level by right-clicking in the Viewport and selecting **Play From Here**. The ball should bounce along the ground when you run into it.

If there are enemies your level, set their **Max Speed** to `0` to avoid them chasing you, or remove them.

Next, you’ll use logic within `BP_Floor` to create a Dynamic Material Instance.

### Create a Dynamic Material Instance

A Dynamic Material Instance (-> instanced-materials-in-unreal-engine) is a material instance generated by script (such as Blueprint) that can change its properties at runtime.

In this section, you'll create Blueprint logic that references the Material assigned to the Floor mesh (`MI_Surfaces_Floor`), generates a Dynamic Material Instance from it, and assigns the new instance to the Floor. Then, the Dynamic Material Instance alters the properties that you exposed in the previous tutorial (-> artist-03-create-materials-and-material-instances), Roughness and Diffuse Hue, to mimic a wet floor.

During runtime, this swap will make it appear as if the floor becomes soaked with a thin layer of water.

To create a dynamic material instance, follow these steps:

- In the **Content Browser**, double-click `BP_Floor` to open it in the **Blueprint Editor**.
- In the **EventGraph**, delete all nodes except for **Event BeginPlay**.
- From the **Components** tab, drag an instance of **Floor** into the EventGraph.
- From the **output** of **Floor**, drag off and search for **Get Material**.
- From the **Return Value** output of **Get Material**, drag off and add a **Create Dynamic Material** **Instance** node where the target is Kismet Material Library.[image: Bueprint-of-return-value]
- Connect the **output** of **Event BeginPla****y** to the **input Exec pin** of **Create Dynamic Material Instance**.
- From the **Return Value** of the **Dynamic Material Instance**, drag out and select **Promote to Variable**.
- In the **Details** panel, rename this variable as `Dynamic Mat Ref`.
- Drag another instance of **Floor** into the EventGraph.
- From Floor’s **output**, drag off and search for **Set Material**.
- Connect the **white Exec output** on the Set node to the **Exec input** of the Set Material node.
- Connect the **blue output** on the Set node to the **Material input** of the Set Material node. [image: Connect-the-set-node-to-the-set-material-node]
- To keep your graph organized, select all nodes and press **C**. Name the comment box `Create Dynamic Material`.
- **Save** and **Compile**.

Your EventGraph should now look like this:

[image: Final-event-graph]

### Call Events

To trigger the floor’s wet look, you’ll need an **event** that checks if `BP_Floor` is overlapping `BP_WaterBall` and an event that calls the correct look as a result.

Let’s draft the logic:

- When an actor overlaps `BP_Floor`:Check if the other actor is (equal to) `BP_WaterBall`. If it is (true), then:Call `BP_Floor`’s wet look.

- Else, if it’s not true (false) then:Do nothing.

To create this logic, follow these steps:

- Right-click in `BP_Floor`’s **EventGraph** and search for **Add Custom Event**. Name this node `Call Wet Look`.
- In the **Components** tab, right-click on **Trigger** and create **Add Event > Add OnComponentBeginOverlap**.[image: Add-event-on-trigger]**OnComponentBeginOverlap** looks for collision.
- From the **Other Actor** output in **OnComponentBeginOverlap**, drag out and create **Get Class**.
- From the **Return Value** output, drag out and create **Equal**.
- Right-click the **Select Class** input and select **Promote to Variable**.
- Name the variable `WaterBall` and **Compile** your blueprint.[image: Trigger-node-with-function-to-get-water-ball]
- In the **Details** panel, set the **Default Value** of WaterBall to `BP_WaterBall`.[image: Set-default-variable-name-to-water-ball]
- From the **output** of the **Equal** node, drag out and create a **Branch**.
- From the **True** output from the **Branch**, drag out and search for **Call Wet Look**.
- Connect the **Exec output** from **OnComponentBeginOverlap** to the **E****xec input** in the **Branch** node.

Your EventGraph should now look like this:

[image: Trigger-to-branch-to-call-wet-look]

### Control Material Properties

Now, you'll build the wet variation of your floor. Since the floor is stone-like and porous, it should darken as it absorbs water (**Diffuse Hue**). Due to a thin layer of water sitting on top, the surface should appear glossy (**Roughness**).

To build logic for the wet look, follow these steps:

- Drag **Dynamic Mat Ref** variable into the EventGraph and select **Get** from the list. [image: Dynamic-mat-ref-in-Blueprints]
- From the **output** pin, drag out and create **Set Scalar Parameter Value**.
- From the same **output** pin, drag out and create **Set Vector Parameter Value**.Remember the parameters you exposed (-> artist-03-create-materials-and-material-instances) in `M_Surfaces`? **Roughness** is a **scalar** (single value) and **Diffuse Hue** is a **vector** (three values; the RGB).
- On the **Set Scalar Parameter Value** node, right-click **Parameter Name** and select **Promote to Variable**. Name the variable `Roughness`.
- On the **Set Vector Parameter Value** node, right-click **Parameter Name** and select **Promote to Variable**. Name the variable `Diffuse Hue`.
- **Compile** the blueprint and enter values for each parameter name:Select the Roughness variable and enter `Roughness` as its Default Value.
- Select the **Diffuse Hue** variable and enter `Diffuse Hue` as its **Default Value**.[image: Default-value-for-roughness-and-diffuse-hue]The Default Values must match the corresponding parameters in `M_Surfaces`.

- Connect the **output Exec** pin from the **Set Scalar Parameter Value** node to the **input Exec** of the **Set Vector Parameter Value** node.[image: Connect-set-scaler-node-to-set-vector-node]

In addition to turning from dry to wet, you can use logic to control how quickly that change occurs. Since saturating a substance takes time, you’ll gradually transition the material properties from one to another. You can do this with a linear interpolation (**lerp**) node.

A **Lerp** node blends, or **interpolates**, smoothly between two values. It's useful for fading from one color, texture, or effect to another.

To create a lerp, follow these steps:

- From the **Value** input of the Scalar Parameter node, drag out and create a **Lerp**. This will control **Roughness**.
- On the Lerp, set the **A** value to `1.0`. This will be the value of Roughness for the **dry look**. Leave the **B** value at `0.0`. This will be the value of the **wet look**.In the previous tutorial (-> artist-03-create-materials-and-material-instances), you learned that Roughness set to 1 is matte and 0 is glossy. You want your water to look glossy.
- From the **Value** input of the **Set Vector Parameter Value** node, drag out and create a **Lerp (Linear Color)**. This will control **Diffuse Hue**.
- From the **A** value of the new **Lerp**, drag out and select **Promote to Variable** (linear color). Name the variable **Unsaturated**.
- From the **B** value of the **Lerp**, drag out and select **Promote to Variable**. Name the variable `Saturated`.
- **Compile** your blueprint. In the **Details** panel, set the default value of **Unsaturated** to `CDDAFFFF`.[image: Details-panel-showing-unsaturated-color]
- In the **Details** panel, set the default value of **Saturated** to something darker, such as `656C7FFF`.

Your EventGraph should now look like this:

[image: Blueprint-of-event-graph]

You’ve now created a brand new look for the floor using blueprint logic. However, you’re missing an engine to power this logic: a **Timeline**.

### Power Your Logic with Timelines

Much like the timeline in animation software, **Timeline** nodes drive values between keyframes over time. You’ll use this node to power the interpolation between the dry and wet looks over a specified amount of time.

To create a timeline, follow these steps:

- Right-click in the EventGraph, search for and create **Add Timeline**. [image: Create-add-timeline]
- Double-click the **Timeline** node to open the **Timeline_Template** tab.
- Click **Track**, and select **Add Float Track** from the list.
- Name the track `Alpha`. This track name will appear as an output pin on the Timeline node.
- Set the timeline **Length** to `3.0` seconds.[image: Save-timeline-length]
- Right-click in the timeline and select **Add Key**.
- With the key selected and highlighted in blue, set the **Time** and **Value** for this key to `0.0`.[image: Setting-the-time-and-value]
- Create a second key and set its **Time** and **Value** to `1.0`.
- Right-click the first **key** and select **User**.[image: Right-click-menu-to-select-user]The **User **setting gives you control over the animation’s easing. We chose to slowly increase the speed of the saturated effect.[image: Graph-showing-effect-increasing-over-time]
- **Save** and **Compile**.

This timeline now outputs a value that blends from 0 – 1 over three seconds. Now, you can connect your remaining nodes to the Timeline:

- Back in the **EventGraph**, connect the **Call Wet Look** output to the **Play** input on the **Timeline**.
- Connect the **Update** output on the **Timeline** to the **Exec input** of the **Set Scalar Parameter Value**.
- Connect the **Timeline’s Alpha** output to the **Alpha** inputs on both **Lerps**.
- Select the nodes and press **C** to comment. Name the comment box `Lerp Dynamic Materials`.[image: Dynamic-lerp-comment-box-in-Blueprints]
- **Save** and **Compile**.

Your complete EventGraph should now look like this:

[image: Node-structure-in-three-comment-boxes]

To test your work, right-click in your level and select **Play From Here**. When you push the water ball around the room, the floor should “flood.”

The reflectiveness of the wet surface is a little difficult to see in daylight. To show off the floor’s reflectivity, you’ll make the level darker and add lighting using an **Emissive Material**.

## Emissive Materials

**Emissive Materials** are an inexpensive way to create self-illumination. They can be used for creating glow that’s incorporated into more complex materials, such as LEDs on a character’s sci-fi armor or a car’s brake lights.

[image: Long-red-line-of-a-car's-tail-light]

Emissive Materials can also interact with the Lumen Global Illumination and Reflections (-> lumen-global-illumination-and-reflections-in-unreal-engine) system, meaning they interact with the environment around them.

The brightness of an emissive material can be controlled with float values ranging from **0** (no light) to **1** (emissive light), or above **1** (emissive light that creates bloom (-> bloom-in-unreal-engine)).

Emissive materials and reflections are more noticeable in dark levels. To change the overall lighting in your level, follow these steps:

- In the **Outliner**, select **Directional Light**.
- In the **Viewport**, press **Ctrl + L**, and move your mouse to adjust the position of the directional light and relative time of day in your level.

Emissives are generally not recommended for environmental lighting. Using emissive materials as light sources can produce unintended results. Instead, we recommend using light sources for environments.

### Create an Emissive Material

For this tutorial, you’ll build neon signs that reflect off the wet stone when placed around the level. To do this, you’ll create a flexible parent Material that can propagate the following parameters to its child instances:

- Emissive Color
- Emissive Brightness
- Texture Mask

To create an emissive material, follow these steps:

- In the **Content Browser**, at the path **All > Content > AdventureGame > Artist > Materials**, create a new **Material**.
- Name the Material `M_EmissiveSign` and double-click to open it in the Material Editor.
- In the **Material Graph**, drag off the **Emissive Color** input on the material root node, and add a **Multiply** node from the selection list.
- Drag off the **Multiply** node’s **A** input and add a **Constant3Vector**.[image: Constant-3-vector-node-to-m-emissive]
- Right-click the **Constant3Vector** and select **Convert to Parameter**.
- Rename the parameter `Color`.
- Double-click the color swatch and choose a color for your emissive.
- Drag off the **Multiply** node’s **B** input and add a **Constant** node from the selection list.[image: Emissive-color-in-the-color-node]
- Convert the constant to a parameter, name it `Brightness`, and set its **Valu****e** to `25`.

Your Material Graph should now look like this:

[image: Color-and-emissive-nodes-in-Blueprints]

### Limit Parameters with Clamps

Although emissive brightness has no upper limit, you can set your own custom limits for the minimum and maximum brightness in the parent Material using a **clamp**. Clamping can make adjusting values with a slider easier, especially when dealing with small numbers and sensitive adjustments.

Like other parameters, clamps are propagated to Material instances.

To clamp the brightness constant, follow these steps:

- In the Material Graph, select the **Brightness** parameter.
- In the **Details** panel, set **Slider Max** to `50`.[image: Setting-the-brightness-parameter-to-50]

Next, you'll give your signage content by using texture masks.

### Create a Simple Mask

A texture mask (-> using-texture-masks-in-unreal-engine) is a grayscale (alpha) or single-channel texture map, used to reveal or hide certain areas of a Material. You can picture an alpha mask like layers; the white area of the mask reveals information on a lower layer and the black area hides it.

[image: Image-of-light-being-contained-by-a-black-planar-mask] (1) Alpha mask (2) Emissive Material

In your emissive Material, you’ll use an alpha mask to reveal or block areas of emissive glow to create the content of the neon sign.

To create a mask inside the `M_Emissive` parent Material, follow these steps:

- With no nodes selected, navigate to the **Details** panel. Next to **Blend Mode**, click the dropdown menu and select **Masked**.[image: Set-blend-mode-to-masked]
- In the **EventGrap**h, right-click and create a **Texture Sample**.
- In the **Details** panel, next to **Textur**e, search for `T_UE_Logo_M`.This texture comes with Unreal Engine, you do not have to download or create it.
- Connect the **RGB** output on the Texture Sample to the **Opacity Mask** input on the material root node.
- Right-click the **Texture Sample** and select **Convert to Parameter**. Name the parameter `LED Sign`.

Your Material Graph should now look like this:

[image: Final-blueprint-with-color-and-led-sign-nodes]

You’ve now created a Material that mimics a neon sign. Next, you'll further increase the flexibility of your parent Material, and the number of unique assets you can create, by inverting the mask:

|  |  |
| --- | --- |
| [image: Glowing-Unreal-logo] | [image: Glowing-masked-unreal-logo] |
| Original mask. | Inverted mask. |

To achieve this, you could create unique Material Instances for inverted and non-inverted masks. Instead, you’ll use a **Static Switch** to **toggle** inversion from within any Material instance made from `M_EmissiveSign`.

## Toggle Parameters with Static Switches

In the previous tutorial (-> artist-03-create-materials-and-material-instances), you learned about the Material propagation hierarchy; child instances inherit properties from parent Materials.

An instance can customize an inherited parameter, but can’t ignore it altogether — unless you use a **Static Switch**. Static switches, set in the parent Material, give child instances the ability to toggle parameters on or off.

Because parameters that are toggled off are not compiled, static switches can improve performance at **runtime**. However, because each boolean creates a new shader permutation, this has the potential to drastically increase **compile time** (depending on the complexity of the material). The value of switches depends on how you use them and your project’s development needs.

**Runtime** refers to the period when a game is running. **Compile time** refers to the stage where a game is compiling, before runtime.

To create a static switch that controls mask inversion, follow these steps:

- In the **Material Graph**, select the **LED Sign** node and duplicate it by pressing **Ctrl + D**.
- Rename the new node `Screen`.
- From the **RGB** output of **Screen**, drag out and search for **One Minus**.
- Right-click in the graph and search for **Static Switch Parameter**. Name the switch `Flip Mask?`
- Connect the **output** of **One Minus** to the **False** input of the switch.
- Connect the **RGB** output of **LED Sign** to the **True** input of the switch.
- Connect the **output** of the switch to the **Opacity Mask** input of the material root node.
- **Save** your Material.

Your Material Graph should now look like this:

[image: Finished-nodes-in-blueprints]

Now you can create Material instances from `M_EmissiveSign` that uniquely control the **brightness**, **color**, **texture ma****p**, or **mask inversion**.

[image: Viewport-with-logo-sign-and-details-panel]

Apply instances of `M_EmissiveSign` to new or existing mesh in your level to create a scene of your choosing. As you roll the water ball around the level, your signs will reflect off the wet floor using Lumen's Global Illumination and Reflections System (-> lumen-global-illumination-and-reflections-in-unreal-engine) — which is on by default. You'll learn more about Lumen and other reflection systems in the next tutorial.

## Next Up

In the next tutorial, you’ll learn more about reflections within Post-Process Volumes, illumination systems, and how to apply different in-camera effects to your level.

- [image: Add Post Process Volumes] Add Post Process VolumesCreate post process volumes to control the look and performance of a level. (-> add-post-process-volumes)

On this page

- Create a Game-Ready Floor Asset (-> artist-04-expanded-material-instances)
- Create a World-Aligned Material (-> artist-04-expanded-material-instances)
- Create a Floor Blueprint (-> artist-04-expanded-material-instances)
- Replace the Placeholder Meshes (-> artist-04-expanded-material-instances)
- Change Materials Using Player Interaction (-> artist-04-expanded-material-instances)
- Create a Water Ball (-> artist-04-expanded-material-instances)
- Create a Dynamic Material Instance (-> artist-04-expanded-material-instances)
- Call Events (-> artist-04-expanded-material-instances)
- Control Material Properties (-> artist-04-expanded-material-instances)
- Power Your Logic with Timelines (-> artist-04-expanded-material-instances)
- Emissive Materials (-> artist-04-expanded-material-instances)
- Create an Emissive Material (-> artist-04-expanded-material-instances)
- Limit Parameters with Clamps (-> artist-04-expanded-material-instances)
- Create a Simple Mask (-> artist-04-expanded-material-instances)
- Toggle Parameters with Static Switches (-> artist-04-expanded-material-instances)
- Next Up (-> artist-04-expanded-material-instances)
