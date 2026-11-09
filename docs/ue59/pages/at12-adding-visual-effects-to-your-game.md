# Add Visual Effects to Your Game

https://dev.epicgames.com/documentation/en-us/unreal-engine/at12-adding-visual-effects-to-your-game?application_version=5.9

> Add visual effects to your game!

[image: Add Visual Effects to Your Game]

In this tutorial you’ll learn how to create a fire **Visual Effect (VFX)** and add it to the traps in your level.

## Before You Begin

Make sure you understand **how to create a material**, which is covered in the Create Materials and Material Instances (-> artist-03-create-materials-and-material-instances) module of this track.

You’ll work with the following assets:

- **BP_FireTrap** Blueprint

## Niagara Overview

The **Niagara VFX System** is the primary tool to create visual effects (VFX) inside Unreal Engine. The system comes with a variety of premade visual effects that can be customized and placed directly inside your level. You can also create your own visual effects for full customization.

To learn more about Niagara, read the Niagara Overview (-> overview-of-niagara-effects-for-unreal-engine) documentation.

## Create a Niagara System

Now, you’ll create your first **Niagara System **that uses a regular emitter. To create a new Niagara System, follow these steps:

- Go to the **Content Browser** and navigate to the **Content > AdventureGame > Artist** folder. Right-click the Artist folder and select **New Folder**. Name it **VFX**.
- In the new **VFX **folder, right-click anywhere in the asset area, go to **FX**, and select **Niagara System**.
- The **Create Niagara System** window opens. Here, you can select an emitter or system as a base for your visual effect. If you select a system, it will create a Niagara System that uses one or more emitters. If you select an emitter, it will create a Niagara System that uses a single emitter. Select the **Hanging Particulates** emitter and click **Create**.
- Name this asset **NS_HangingParticles **and open it.

In the **NS_HangingParticles **window, you’ll see two nodes: **NS_HangingParticles** and **HangingParticulates**.

The **NS_HangingParticles **node is the system node, listing options such as the **Properties **for the entire system, and two stages named **System Spawn **and **System Update **where you can add modules that execute when Unreal Engine creates the system (Spawn) and while the system is active (Update).

The **HangingParticulates** node is the emitter. This is the node that defines how the particles are generated and rendered.

If you right-click anywhere in the **System Overview **graph, where the nodes are located, you can add new emitters to this system. Alternatively, you can use the **E** key as a shortcut to add a new emitter.

Adding a new emitter opens the **Add Emitter to your System** window. This is similar to the previous window where you created your system, but only displays the base emitters available (since you already created the system). For this example, close the window without adding another emitter.

The **HangingParticulates **emitter comes with pre-defined modules that generate the particles visual effect – similar to small dust particles. In the top-left corner of the window, you can see your effect in the **Preview **panel.

Now, you’ll increase the **Spawn** **Rate **of this emitter to increase the number of particles that get spawned. Follow these steps:

- Select the **HangingParticulates **node.
- Using the **Details **panel, navigate to the **Spawn Rate **category.
- Change the **SpawnRate **field to **250**.

You can also select the **Spawn Rate **module on the emitter to only see options related to that module in the Details panel.

In the **Preview **panel, you’ll now see many more particles rendered.

In the bottom part of the window, you can see a timeline used to animate the system. You can press the **Pause **or **Play **button to control the preview.

Now, you’ll add this system to your level to see it in context. Follow these steps:

- Go to the **Content Browser **and navigate to the **Adventure Game > Artist > VFX **folder where you created the **NS_HangingParticles **asset.
- Drag the **NS_HangingParticles **asset into the world. You’ll now see your visual effect simulated in the level.

## Create a Fire Effect

In this section, you’ll create a fire effect for your traps.

### Create the Material

To create an animated fire effect, you will use a texture that contains a series of still images that when displayed in a sequence appear to animate a flame. This type of texture is called a **SubUV texture** and it can be animated via the material or Niagara emitter.

First, you’ll create a material using the provided fire texture. Follow these steps:

- Go to the **Content Browser **and navigate to the **AdventureGame > Artist > Materials** folder.
- Right-click anywhere and create a **Material**.
- Name this asset **M_Fire_SubUV_Simple **and open it.

To set up the material, follow these steps:

- In the **Details **panel, under the **Material **category:Change the **Blend Mode **to **Translucent**.
- Change the **Shading Model** to **Unlit**.

- Right-click in the Material Editor and create a **ParticleSubUV **node.
- Select the **Particle SubUV **node, and in the **Details **panel, change the **Texture **to the **T_Fire_SubUV** file.
- From the **Particle SubUV **node, drag the **RGB **pin and add a **Multiply **node (under the **Math **category).
- From the **Multiply** node, drag the output pin and connect it to **M_Fire_SubUV_Simple **node’s **Emissive Color** input.
- Right-click an empty area below the **Particle SubUV **node and add a **Particle** **Color** node (under the **Particles **category).
- Drag its **RGB **output pin and connect it to the **Multiply** node’s **B** input pin.
- From the **Particle SubUV **node, drag the **R** output pin and add a new **Multiply **node.
- From the **Particle Color **node, drag the **A** output pin and connect it to the new **Multiply **node’s **B **input pin.
- From the new **Multiply **node, drag the output pin and add a **Clamp **node.
- From the **Clamp **node, drag the output pin and add a **Depth Fade **node.
- On the **Depth Fade **node, change the **Fade Distance **field to **60**.
- From the **Depth** **Fade **node, connect the output pin to the **M_Fire_SubUV_Test **node’s **Opacity **input pin.

The preview of the material should now look similar to this:

This material sets its emissive color to be the shape of the ParticleSubUV texture tinted (colorized) by the Particle Color, which comes from the Niagara System. The opacity is set by using the Particle Color's Alpha (transparency) value and normalized between 0 - 1. Finally, we use a DepthFade node to hide any particles that are overlapping (clipping) with nearby geometry in the level.

## Create the Niagara System

Next, you’ll create the Niagara System that generates the fire visual effect. For the fire effect, you will use a **Lightweight (stateless) emitter**. These emitters are optimized for better performance compared to traditional (stateful) emitters, but are limited to a specific set of modules.

To learn more about Lightweight emitters, read the Niagara Lightweight Emitters Overview (-> niagara-lightweight-emitters-overview) documentation.

Follow these steps to create a new Niagara system:

- Go to the **Content Browser** and navigate to the** AdventureGame > Artist > VFX **folder.
- Right-click anywhere and go to **FX **and select **Niagara System**.
- In the list, select **Minimal Lightweight **and click **Create**. Note that you can also use the search field at the top of the window to find the system.
- Name this asset **NS_LW_Fire **and open it.

Next, you’ll set up the modules of the emitter. Follow these steps:

- Select the **Minimal **emitter node.
- In the **Details **panel, under the **Emitter** **State **category, change the **Loop Duration** to **5.0** **s**.
- Under the **Spawn Burst Instantaneous **category:Next to the **Spawn Burst Instantaneous **headline, click the **Type **dropdown and change it to **Rate**. This will change the Spawn Burst Instantaneous module to a **Spawn Rate **module.
- Change the **Spawn** **Rate **field type to **Binding**.
- Go to the **User Parameters **panel in the bottom-left corner of the window. Click the **Plus **button next to the User Parameters category, to add a new parameter.
- Select **Make New > Common > float**.
- Name this parameter **FireSpawnRate**.
- Change the value of the **FireSpawnRate **parameter to **20**.
- Select the **Minimal **emitter, and in the **Details **panel, change the **Spawn** **Rate **field’s value to **FireSpawnRate **using the dropdown.

- With the emitter still selected, in the **Details **panel, go to the **Initialize** **Particle **category and change the **Lifetime **field to **5.0 s**.
- On the emitter, press the **Plus **button next to the **Simulate **stage and add a **Shape Location **module.When you add a new module, it is selected by default and the **Details **panel displays properties related to only that module. You can always either select the emitter to display every module’s properties, or select a single module to display only its properties.
- Select the new module and in the **Details **panel, set the **Shape Primitive **to **Plane**. This distributes the fire particles across a flat plane. You can reduce the **Plane Size **if you want, but for this tutorial, you can keep it at **100** by **100**.
- On the emitter, under the **Simulate **stage, add a **Add Velocity** module.
- Select the module, and in the **Details **panel:Set **Velocity** to **Non-uniform Range**.
- Set the **Velocity **field’s **Min Z** value to **5** and **Max Z** to **10**. This will move the particles upward slowly.

- On the emitter, under **Simulate**, add a **Scale** **Color **module.
- Select the module and in the **Details **panel, set the **Scale **type to **Color Range**.
- Click the **Min **color field and change the **Hex sRGB **to **FFA91300**.
- Click the **Max **color field and change the **Hex sRGB **to **FF4747FF**.This will set the color of each particle accordingly.
- On the emitter, under **Simulate**, add a **Scale Sprite Size **module and set the range to **5** and **8**. This will resize the particles to make them significantly larger.
- On the emitter, under **Simulate**, add a **Sub UV Animation** module.
- On the emitter, under the **Render **category, select the **Sprite Renderer **module.
- In the **Details **panel, update the following fields:Change the **Material **to the **M_Fire_SubUV_Simple **material you created.
- Change the **Alignment **to **Velocity Aligned**.
- Change the **Facing** **Mode **to **Face Camera**.
- Under the **Sub UV **category, change the **Sub Image Size** to **6** and **6**.

The reason you entered the Sub Image Size of 6 x 6 is because the T_Fire_SubUV texture has 6 rows and 6 columns.

You can now see the preview of your new fire effect!

### Add the Fire Effect to the Fire Traps

Lastly, you’ll need to add the fire effect to the trap blueprint so that the fire effect plays on each trap while the trap is active. Follow these steps:

- Go to the **Content Browser** and navigate to the **AdventureGame > Designer > Traps** folder.
- Open the **BP_TrapFire **blueprint.
- In the **Components **panel, select the **Base **component, click **Add**, and add a **Niagara Particle System Component**. By selecting the Base component first, you will add the Niagara component as a child of the Base component. This is an important step to make the fire effect scale with the size of the base component.
- Select the **Niagara **component and in the **Details **panel, under the **Niagara **section, change the **Niagara System Asset **to the **NS_LW_Fire **you created.
- In the Blueprint Editor, open the **EventGraph **tab. This is what it looks like now:
- Before the **Stop node** on the top row you’ll add two new nodes to deactivate the fire effect.Remove the connection between the **Stop **and **Set Material **nodes by holding **ALT **and left-clicking the connection between them.
- Make some space between the nodes.
- Right-click in the middle and add a **Deactivate Niagara **node. Note that this node is named after the Niagara component you added earlier; for example, **Deactivate [Component]**, so the name may differ from what’s shown here.
- Connect the **Set Material **node to the **Deactivate Niagara **node.
- Connect the **Deactivate Niagara **node to the **Stop Audio **node.

- Now, you’ll repeat these steps for the row below this one, where **Set Material **and **Play Audio **take place.
- Follow the same steps as before, and add an **Activate Niagara **node instead.
- **Compile **and **Save **your Blueprint.

Your **EventGraph **should now look like this:

Next you'll add the ability to modify the **FireSpawnRate Niagara User Parameter** you created earlier from the trap blueprint. In this example, you are modifying the fire spawn rate, but this technique can be used to modify any number of user parameters in your Niagara System.

To modify the user parameter, follow these steps:

- In the Blueprint Editor, go to the **Construction Script** tab.
- Create a new float variable and name it **FireSpawnRate**.
- Select the new variable and do the following:Change the **Category **to **Setup**. This will categorize FireSpawnRate with the other variables under the Setup category.
- Change the **Default Value** to **10**. This ensures that each new instance of the fire trap in the level will start with visible particles.
- Enable **Instance Editable** to turn this variable public.

- In the graph, drag from the **Parent: Construction Script** node's exec pin and add a **Set Niagara Variable (Float)** node. On this node: Enter '**FireSpawnRate**' to the **In Variable Name** text field. This refers to the parameter you created in the Niagara system. Make sure you spell the name exactly as it appears inside your Niagara System.
- Drag the In Value pin and add a **Get FireSpawnRate** node. This refers to the variable you created in this blueprint.
- Drag the Target pin and add a **Get Niagara** node, which refers to the Niagara component you added to the blueprint.

**Save **and **Compile **the blueprint. Your **Construction Script **graph should now look like this:

It’s time to play your game and see the fire effect! Since you added the fire effect to the trap blueprint asset, you don’t have to add the visual effect to your level, or change any of the traps manually. The traps automatically gain the fire effects.

### Hide the Fire Trap Base Mesh

To hide the fire trap's square mesh so you only see the fire effect in game, follow these steps:

- Return to the `BP_TrapFire` blueprint.
- In the **Components **panel, select **TrapBase**.
- In the **Details **panel, go to the **Rendering **category and enable **Hidden in Game**.
- **Compile** and **Save** the blueprint.

Now when you play the game, you'll only see the fire effect on the level floor.

### Modify the Fire Spawn Rate

You can use the **FireSpawnRate **variable you created earlier to change the number of fire particles each individual trap produces.

To modify the fire spawn rate, follow these steps:

- In the **Outliner **panel, use the search field to search for **BP_FireTrap**. Alternatively, you can unfold the **Room2 **folder to see all of the fire traps in room 2.Select all **BP_FireTrap **actors.
- In the **Details **panel, under the **Setup **category, change the **Fire Spawn Rate **field to **20**.

You'll notice how the number of fire particles spawned changes based on the number you input. You can keep trying different values until you find the right amount for your game!

Keep experimenting with your effect and see what you can create! To learn more, see Creating Visual Effects (-> creating-visual-effects-in-niagara-for-unreal-engine).

## Example Project

Below is a link to download the final sample project that you can build using this tutorial series. You can use this example project to see what your final project might look like, or as a reference to see how we built and designed the project.

Download the Artist Track Example Project here

## Next Up

Congratulations on finishing the Artist Track Tutorial Series! You learned to work with materials, post-process effects, lighting, audio, and Niagara visual effects to perform an art pass on your level.

If you are interested in packaging your project as a standalone program to test and share, see the following documentation:

- [image: Packaging Unreal Engine Projects] Packaging Unreal Engine ProjectsPackaging Unreal game projects for distribution. (-> packaging-your-project)

On this page

- Before You Begin (-> at12-adding-visual-effects-to-your-game)
- Niagara Overview (-> at12-adding-visual-effects-to-your-game)
- Create a Niagara System (-> at12-adding-visual-effects-to-your-game)
- Create a Fire Effect (-> at12-adding-visual-effects-to-your-game)
- Create the Material (-> at12-adding-visual-effects-to-your-game)
- Create the Niagara System (-> at12-adding-visual-effects-to-your-game)
- Add the Fire Effect to the Fire Traps (-> at12-adding-visual-effects-to-your-game)
- Hide the Fire Trap Base Mesh (-> at12-adding-visual-effects-to-your-game)
- Modify the Fire Spawn Rate (-> at12-adding-visual-effects-to-your-game)
- Example Project (-> at12-adding-visual-effects-to-your-game)
- Next Up (-> at12-adding-visual-effects-to-your-game)

Related documents

Art Pass for a Puzzle Adventure Game

 [image: Art Pass for a Puzzle Adventure Game] (-> art-pass-for-a-puzzle-adventure-game)Design a Puzzle Adventure

 [image: Design a Puzzle Adventure] (-> design-a-puzzle-adventure-game-in-unreal-engine)Creating Visual Effects

 [image: Creating Visual Effects] (-> creating-visual-effects-in-niagara-for-unreal-engine)
