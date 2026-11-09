# Add Footstep Sounds to a Character

https://dev.epicgames.com/documentation/en-us/unreal-engine/artist-11-add-footstep-sounds-to-a-character?application_version=5.9

> Make a character produce different step sounds as they move across different surfaces.

[image: Add Footstep Sounds to a Character]

In this section, you’ll add footstep sounds to the player character to add to the realism of running around the level. You will use **Sound Cues **to create different sounds based on the type of surface that the player walks on.

You’ll create **Physical Materials **to represent the surface types. For instance, walking on metal should sound different from walking on stone. You will also create a custom Data Asset that holds the surface and sound information. Using a Data Asset makes it easier to add more surface types and sounds in the future, without modifying the Blueprint code.

Lastly, you’ll create a **Function **in the **Blueprint Function Library** that you already have in the game – **BPL_FPGame**.

This function will, in turn, call a function inside the Data Asset that returns the correct sound effect based on the surface type detected.

## Before You Begin

Make sure you understand these topics covered in the previous sections of the **Art Pass for a Puzzle Adventure Game (-> art-pass-for-a-puzzle-adventure-game)** and Unreal Engine for New Users (-> unreal-engine-for-new-users):

- Creating Sound Cue and Sound Attenuation assets.
- Blueprint basics, including creating variables and functions, and creating and connecting nodes.

You’ll work with the following assets in the sample project and content pack (-> setting-up-your-project-in-unreal-engine):

- **S_Metal-1** Sound Wave
- **S_Metal-2** Sound Wave
- **S_Metal-3** Sound Wave
- **S_Stone-1** Sound Wave
- **S_Stone-2** Sound Wave
- **S_Stone-3 **Sound Wave
- **S_DefaultStep-1 **Sound Wave
- **S_DefaultStep-2** Sound Wave
- **S_DefaultStep-3** Sound Wave
- **BPL_FPGame **Blueprint Function Library
- **BP_AdventureCharacter **Blueprint
- **ABP_Unarmed **Animation Blueprint

## Create Sound Cues with Footstep Sounds

First, you’ll create two Sound Cues, one for footsteps on metal and one for footsteps on stone.

To create a Sound Cue, follow these steps:

- Go to the **Content Browser **and navigate to the **AdventureGame > Artist > Audio.**
- Right-click in the **Audio **folder, select **New Folder**, and name it **Footsteps**.
- In the **Footsteps **folder, right-click and go to **Audio > Sound Cue**. Name this **SC_Footsteps_Metal** and open it. There is already an Output node in this asset, which plays the sound based on the nodes that are connected to it.
- Right-click anywhere in the graph and add a **Wave Player** node.
- Select the **Wave Player **node and use the panel on the left side to change the **Sound Wave** to **S_Metal-1**.
- Add two more **Wave Player** nodes and repeat the steps for them to select the **S_Metal-2** and **S_Metal-3** Sound Wave files you imported in Set Up Your Project and Import Content (-> artist-01-project-setup-and-content-import).
- Right-click in the graph and add a **Random **node. Click **Add input** in the **Random node** once to add a third input.
- Connect each **Wave Player **node to a pin on the **Random **node.
- Connect the **Random **node to the **Output **node.
- Save the Sound Cue.

Next, create two **Sound Cue** assets, one that randomizes the stone footstep sounds, and one for the default footstep sounds:

- Create a **Sound Cue** asset named **SC_Footsteps_Stone**.
- For the **Wave Player** nodes, use the **S_Stone-****1** , **S_Stone-2**, and **S_Stone-3****** audio assets you imported in Set Up Your Project and Import Content (-> artist-01-project-setup-and-content-import).
- Create a **Sound Cue **asset named **SC_Footsteps_Default**.
- For the **Wave Player **nodes, use the **S_Default-1, S_Default-2, **and **S_Default-3 **audio assets.

## Create Physical Materials

Now that you have created your Sound Cues, you will create two ****Physical Materials (-> physical-materials-in-unreal-engine)** **to represent each surface type. You’ll later match the footstep sounds to these physical materials.

A **Physical Material **is used to define the response of a physical object when interacting dynamically with the world. These material can also be used to identify different types of surfaces during gameplay.

For example, in this tutorial, you’ll create Physical Materials named **PM_Metal **and **PM_Stone **to represent metal and stone surfaces. You’ll then check which surface the player is walking on, and play a Sound Cue based on that information.

To create a Physical Material, follow these steps:

- Go to the **Content Browser** and navigate to the **AdventureGame > Artist > Materials** folder.
- In the **Materials **folder, right-click, go to **Physics**, and select **Physical Material**.
- In the **Pick Physical Material Class** window, select **PhysicalMaterial**, and click Select.
- Name this asset **PM_Metal**.
- Create one more Physical Material named **PM_Stone**.

A Physical Material is a **data asset **that you can use to change various settings for a surface, like friction. For these Physical Materials, you don’t have to edit the properties in the assets themselves. Instead, you’ll assign these assets to different materials to change their individual surface types.

## Assign Footstep Sounds With a Data Asset Blueprint Class

Next, you’ll create a new **Blueprint Data Asset** class to hold the footstep sounds and create a function that returns the correct footstep sound based on the Physical Material assigned to the material of an object.

To set up a Blueprint Data Asset to control your footstep sounds, follow these steps:

- In the **Content Browser**, navigate to the **AdventureGame > Artist > Audio > Footsteps **folder.
- Right-click and create a **Blueprint Class**.
- In the **Pick Parent Class** window, expand the **All Classes** dropdown and search for, then select **PrimaryDataAsset**.
- Name this asset **BP_DA_FootSteps **and open it.
- In the **My Blueprint **panel, add a new variable:Name it **FootStepSounds**.
- Select it, and in the **Details **panel:Change the **Variable Type **to **Physical Material (Object Reference)**.
- Change the **Container **to **Map**.
- Change the **Map Value Type** to **Sound Cue (Object Reference)**.The default Variable Type is boolean. Since you can’t map booleans, the **Map **container will not be available if you don't change the Variable Type first.

- Add another variable:Name it **DefaultFootSteps**.
- Change its type to **Sound Cue**. Since there is only one Sound Cue for the default footstep sound, and it’ll only play if there is no Physical Material assigned to the object's material, you can change its container type to a single variable.

A map variable is a data-pair list that links one type of asset to another. The FootStepSounds variable maps each Physical Material to its corresponding Sound Cue.

To set up FootStepSounds to link materials with sounds, follow these steps:

- **Compile **the blueprint so you can edit your variables’ default values.
- Select the **FootStepSounds **variable. In the **Details **panel, under **Default Value**, add a new element.
- In the Physical Material field, select the **PM_Stone **asset.
- In the Sound Cue field, select the **SC_Footsteps_Default **asset.
- Repeat the steps above to add an element with **PM_Metal **and **SC_Footsteps_Metal **assigned.
- Select the **FootStepSounds** variable. In the **Details **panel, under **Default Value**, add **SC_Footsteps_Default**.

To build the blueprint logic, follow these steps:

- In the **My Blueprint** panel, add a new **Function **named **fnGetFootStepSounds**. It opens in a new tab with its own graph.
- Select the function and, using the **Details **panel, do the following:Add a new **Input **named **PhysicalMaterial **with the type **Physical Material**.
- Add a new **Output **named **SoundCue **with the type set to **Sound Cue**.
- In the graph, disconnect the wire between the function entry node (**fnGetFootStepSounds**) and **Return Node**.

- In the function graph, drag the **FootStepSounds **variable into the function graph and select **Get**.
- Drag the **Foot Step Sounds** node’s pin and add a **Find **node.
- From the **Find **node, connect the second input pin to the **fnGetFootStepSounds **node’s **Physical Material **pin. This is the parameter for the input you added earlier.
- On the **fnGetFootStepSounds **node, drag its **exec **pin and add a **Branch **node. Connect the **Condition **pin to the **Find **node’s bottom (red) output pin.
- From the **Branch** node, connect the **True **pin to the **Return** **Node**.
- From the **Return **node, drag the **Sound Cue **pin and connect it to the **Find **node’s top (blue) output pin.
- From the **Branch **node, drag the **False **pin and add another **Return** **Node**.
- On the new **Return Node**, drag off the **Sound** **Cue **pin and add a **Get Default** **Foot Steps **node.
- **Compile **and **Save **the blueprint.

This function checks if a Physical Material (function input) is found in the FootStepSounds Map. If the Physical Material is found, it returns the Sound Cue associated with that Physical Material as the function's output variable.

If no Physical Material is found, the DefautlFootSteps Sound Cue is returned instead.

## Set the Default Footstep Sounds

Next, you’ll create a Data Asset to manage the values used by your Blueprint. This asset acts as a configuration layer, allowing you to add, remove, or update the Physical Materials and Sound Cues without modifying or recompiling the Blueprint. Follow these steps:

- In the **Content Browser**, navigate to the **AdventureGame > Artist > Audio > Footsteps** folder.
- Right-click and go to **Miscellaneous > Data Asset**. (Select the Data Asset type with a circular icon.)
- Select the **BP_DA_FootSteps **data class as the data asset instance.
- Name this asset **DA_FootSteps **and open it.
- For **Default Foot Steps**, select **SC_Footsteps_Default**.
- Expand **Foot Step Sounds** and ensure the list is populated with both **FootStepSounds **map elements.
- Save the Data Asset.

## Build a Function to Play Footstep Sounds

Next, you’ll create a function in the function library to play the footstep sound. Any blueprint class in your project can use functions in a blueprint function library.

To create and set up a new function, follow these steps:

- In the **Content** **Browser**, go to **AdventureGame > Designer > Blueprints > Core**, and open the **BPL_FPGame **blueprint function library.
- In the **My Blueprint **panel, add a new function and name it **fnBPLPlayFootStepSound**.
- Select the new function and in the **Details **panel, add a new **Input **named **PlayerReference **of the type **Pawn**.

To set up a line trace between the player and the ground, follow these steps:

- Drag off the **fnBPLPlayFootStepSound **node’s **exec **pin and add a **Line** **Trace By Channel **node.
- From the **Line Trace By Channel **node, drag the **Start **pin and add a **Get Actor Location **node. In the Node Actions list, remember to disable **Context Sensitive **if you have trouble finding a node.
- Drag the **Get Actor Location** node’s **Target **pin and add a **Get Player** **Reference **node.
- Drag the **Get Player Reference** node’s output pin and add a **Make Array **node.
- Connect the **Make Array** node’s array output pin to the **Line Trace By Channel** node’s **Actors to Ignore** pin.
- From the **Get Actor Location** node, drag the **Return Value **pin and add a **Subtract **node.
- Connect the **Subtract **node’s output pin to the **Line Trace By Channel **node’s **End **pin.
- In the **Subtract **node, set the **Z** value to **500**.

This traces a line starting from the player’s position downwards by 500 units, ignoring the player character. In the next part, you will assign the correct footstep sound based on the surface type reported by the line trace.

Follow these steps to use the Data Asset you created earlier to assign the right footstep sound:

- From the **Line Trace By Channel** node, drag the **Out Hit** pin and select **Break Hit Results**.
- Create a local variable, name it **FootStepsAsset **and set its type to **BP_DA_FootSteps (Object Reference)**. Set its **Default Value** to **DA_FootSteps**.
- Drag the **FootStepsAsset **variable to the **Event Graph** and selected **Get FootStepAsset**.
- Drag from the FootStepsAsset node and search for then select **fnGetFootStepSounds**.
- Connect the **Exec **pin of the **LineTraceByChannel **node to the **FnGetFootStepSounds **node. Expand the **Break Hit Results** node and connect the **Phys Ma**t pin to the **Physical Material** pin of the **FnGetFootStepSounds **node.
- Drag from the **FnGetFootStepSounds **node and search for then select **Play Sound At Location**.
- Connect the PlaySoundAtLocation node’s **Sound **pin to the **Sound Cue **pin of the **FnGetFootStepSounds** node.
- Drag the **Location **pin of the **PlaySoundAtLocation **node and search for then select **Get Actor Location**. Drag its **Target **pin and add a **Get Player Reference** node.
- **Save **and **Compile **the function.

This uses the Data Asset function **fnGetFootStepSounds **to pass in a Physical Material and get a Sound Cue to play.

## Update the Animation Blueprint with Step Sounds

The next step is to modify your player character’s **Animation Blueprint** to call the **FnBPLPlayFootStepSound **function when each foot of the character touches on the ground.

Most **Manny **characters, like the one used in this project, use animations that include **Notifications **by default. **Animation Notifications **(also known as **Animation Notifies **or just **Notifies**) provide a way for you to create repeatable events synchronized with **Animation Sequences**. These events can be sounds (such as footsteps for walk or run animations), spawning particles, and more.

While Notifies can be added to an Animation Sequence, most locomotion animations that comes with the Unreal Engine templates, come with default Animation Notifies that match when the character's feet touch the ground (FootPlant).

Follow these steps to see the default Animation Notifies:

- In the **Content** **Browser**, open the animation blueprint that your player character uses. For **BP_AdventureCharacter **in the sample project, go to **Content > Characters > Mannequins > Anims > Unarmed**, and open **ABP_Unarmed**.
- In the top-right corner, click the **Animation **button (green running human icon). This opens one of the blueprint’s animations in a new tab in Unreal Editor.
- To change the animation that’s playing, click the three dots next to the Animation button, and select any walk or run animation. For example, **MF_Unarmed_Jog_Fwd**.Tip: You can also open the jog animation directly from the **Content Browser**.

In the timeline, you’ll see the footplant Notifies:

You can add new Notifies and change existing ones to craft your own system where you would like to execute a chain of events. For this tutorial, you’ll use the **default Notifies** that come with the character’s animations. They are called **AN_FootPlant_Right **and **AN_FootPlant_Left**.

To add the animation’s Notifies to the blueprint and play the footstep sounds, follow these steps:

- Go back to **ABP_Unarmed.**
- Right-click in the **Event Graph** and add an **AnimNotify_AN_FootPlant_Left **node.
- Drag from the **Notify **node’s pin and search for then select **FnBPLPlayFootStepSound**.
- Add an **AnimNotify_AN_FootPlant_Right **node and connect it to the **FnBPLPlayFootStepSound **node’s **exec **input pin.
- From the **FnBPLPlayFootStepSound **node, drag the **Player Reference **pin and add a **Get Player Pawn **node.
- **Compile **and **Save **the animation blueprint.

This will play the footstep sound each time the foot plant notify triggers from the animation blueprint.

If your character uses additional animation blueprints, then you have to add the code to those animation BPs as well.

## Update the Player Character Blueprint to Play Footstep Sounds

Next, you’ll modify the player blueprint and add logic to play the sound when the player lands on the ground, such as landing after falling or jumping. Since you created the FnBPLPlayFootStepSound function in the blueprint function library, you can reuse that function in the player character’s blueprint.

To modify the player blueprint, follow these steps:

- Open the **Content Browser** and navigate to the **AdventureGame > Designer > Blueprints > Characters** folder.
- Open the **BP_AdventureCharacter **blueprint and go to the **EventGraph **tab.
- Right-click an empty area of the graph and add an **Event On Landed **node.
- Drag the EventOnLanded node’s **exec **pin and search for then select **FnBPLPlayFootStepSound**.
- From the **FnBPLPla FootStepSound **node, drag the **Player Reference** pin and add a **Self** node.
- **Compile **and **Save **the blueprint.

## Assign Floors a Physical Material

Next, you’ll assign a Physical Material to multiple surfaces. Follow these steps:

- Select a surface in the level, like a **Floor **object.
- In the **Details **panel, under the **Collision **section, change the **Phys Material** **Override **to one of the Physical Materials that you created earlier.
- Repeat these steps to add both Physical Material types to some of your level’s floors.

Alternatively, you can add a Physical Material to a Material Instance by doing the following:

- Open the Material Instance and go to the **Details **panel.
- Scroll down to the **General **section, click the **Phys Material** dropdown and select your desired Physical Material.
- Save your Material Instance.

## Test Your Footsteps

Play the game and walk over the surfaces with physical materials and jump to hear the correct footstep sounds.

If the surface has a Physical Material assigned, you will hear the corresponding foot step sound. If no Physical Material is found, you will hear the default foot step sound.

## Next Up

In the next module you will learn how to create a fire effect visual effect and apply it to your fire traps by using the Niagara VFX system.

- [image: Add Visual Effects to Your Game] Add Visual Effects to Your GameAdd visual effects to your game! (-> at12-adding-visual-effects-to-your-game)

On this page

- Before You Begin (-> artist-11-add-footstep-sounds-to-a-character)
- Create Sound Cues with Footstep Sounds (-> artist-11-add-footstep-sounds-to-a-character)
- Create Physical Materials (-> artist-11-add-footstep-sounds-to-a-character)
- Assign Footstep Sounds With a Data Asset Blueprint Class (-> artist-11-add-footstep-sounds-to-a-character)
- Set the Default Footstep Sounds (-> artist-11-add-footstep-sounds-to-a-character)
- Build a Function to Play Footstep Sounds (-> artist-11-add-footstep-sounds-to-a-character)
- Update the Animation Blueprint with Step Sounds (-> artist-11-add-footstep-sounds-to-a-character)
- Update the Player Character Blueprint to Play Footstep Sounds (-> artist-11-add-footstep-sounds-to-a-character)
- Assign Floors a Physical Material (-> artist-11-add-footstep-sounds-to-a-character)
- Test Your Footsteps (-> artist-11-add-footstep-sounds-to-a-character)
- Next Up (-> artist-11-add-footstep-sounds-to-a-character)

Related documents

Sound Sources

 [image: Sound Sources] (-> sound-sources-in-unreal-engine)Art Pass for a Puzzle Adventure Game

 [image: Art Pass for a Puzzle Adventure Game] (-> art-pass-for-a-puzzle-adventure-game)Design a Puzzle Adventure

 [image: Design a Puzzle Adventure] (-> design-a-puzzle-adventure-game-in-unreal-engine)
