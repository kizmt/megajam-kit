# Add Sounds to Fire Traps

https://dev.epicgames.com/documentation/en-us/unreal-engine/artist-09-adding-sounds-to-fire-traps-artist-track-unreal-engine?application_version=5.9

> Learn how to add a sound effect to a Blueprint.

[image: Add Sounds to Fire Traps]

In this tutorial, you will add a sound effect to the fire traps in the level. You will create a **Sound Cue** asset to choose which audio file to play, which we have provided with the project files.

You’ll then create a **Sound Attenuation** asset to modify how the sound is perceived by the player. This asset contains settings such as attenuation inner radius and falloff distance, and whether the sound is spatialized in 3D space.

Finally, you’ll update the fire effect’s blueprint to add an **Audio **component, and start or stop the sound effect based on whether the fire is active.

## Before You Begin

Make sure you understand these topics covered in the Unreal Engine for New Users (-> unreal-engine-for-new-users) documentation:

- Blueprint basics, such as adding and connecting nodes.

You’ll work with the following assets in the sample project file and content pack (-> artist-01-project-setup-and-content-import):

- **S_Fire **sound wave file
- **BP_TrapFire** blueprint

## Create a Sound Cue

To begin, you’ll create a **Sound Cue**, which is a node-based audio asset.

A **Sound Cue** is an audio asset that can contain references to one or more audio files, and instructions on how to manipulate audio as it flows through the graph. This is similar to how Blueprints are used to add functionality and logic to gameplay objects. The **Sound Cue Editor** has a list of **Sound Node** types that you can use to control your sound effects.

To create a Sound Cue asset, follow these steps:

- In the **Content Browser**, go to the **Content > AdventureGame > Artist** **> Audio **folder.
- In the **Audio **folder, create a new folder named **Fire**.
- In the **Fire **folder, right-click the asset area, go to **Audio**, and select** Sound Cue**.
- Name this asset `SC_FireTrap` and open it.[image: Content Browser view of Audio > Fire folder with a new Sound Cue]

 The asset opens in the **Sound Cue Editor**, which might feel similar to the Blueprint Editor.

The Sound Cue Editor comes with many nodes and settings you can use to customize your sound effects. For this tutorial, you’ll add an audio file you’d like to play and make it loop.

To add an audio file to the Sound Cue, follow these steps:

- Right-click and add a **Wave Player** node.[image: Searching for a Wave Player node]
- Connect the Wave Player’s **Output **pin to the **Output **node. The Output node is always the last node in a Sound Cue.
- Select the **Wave Player **node. In the panel to the left side of the window, change the **Sound Wave** to the `S_Fire` Sound Wave file you imported in Set Up Your Project and Import Content (-> artist-01-project-setup-and-content-import).
- Turn on **Looping **so the audio can play on repeat.
- Save the Sound Cue.

You have now created a Sound Cue with the audio file that should play for each fire trap. You can close the sound cue editor.

## Control the Sound With a Sound Attenuation

Next, you need to create a **Sound Attenuation **asset that you can use to change audio settings like the falloff distance, the radius of the audio zone, and more.

Your sound attenuation settings should be set up so that:

- The fire sound is at full volume only within that trap’s bounds.
- The fire sound’s volume decreases (falls off) as the player moves away from the trap.
- The fire sound isn’t audible once the player is a few meters away from the trap.

This ensures the player can’t hear the fire sound until they are in the same room as the traps and they don’t hear audio from all traps at once.

To create a sound attenuation asset, follow these steps:

- Go to the **Content Browser**. In the **Audio **folder, right-click, go to **Audio**, and select **Sound Attenuation**.
- Name this asset `SA_FireTrap `and open it. The sound attenuation asset is a data asset, which means that you will see a **Details **panel with several settings.
- Under the **Attenuation (Volume) **category, change the following settings in the sound attenuation asset:**Inner Radius: 100**
- **Falloff Distance: 600**

- Save `SA_FireTrap `and close the window.

Now, you have the attenuation settings for your sound effect saved as an asset.

## Modify the Fire Trap Blueprint

In the **BP_TrapFire **blueprint, you will bring together the **Sound Cue** and **Sound Attenuation** assets and define when the audio should start and stop.

To modify the blueprint, follow these steps:

- Go to the **Content Browser **and navigate to the **AdventureGame > Designer > Blueprints > Traps** folder.
- Open the `BP_TrapFire`** **blueprint.
- In the **Components **panel, click **Add**, and add an **Audio **component.
- Select the **Audio **component. In the **Details** panel, go to the **Sound **section, and set **Sound **to the `SC_FireTrap`** **asset you created.
- Optionally, you can modify the **Volume Multiplier **field to change the volume of this sound effect.
- In the **Attenuation **section, set **Attenuation Settings **to the `SA_FireTrap`.
- Ensure **Allow Spatialization **is enabled, which makes the audio play at a higher volume if the player is closer to it.

Next, you will change the graph of this blueprint to add the logic for starting and stopping the audio. The fire trap gets activated and deactivated, so since that logic already exists, you’ll extend it by adding the relevant nodes.

To add the functionality to stop the audio when the trap is disabled, follow these steps:

- In the **BP_TrapFire **blueprint editor, go to the **Event Graph **tab.
- Locate the red Event **fnBPISwitchOn **node and go to the last node in that sequence. You can use **CTRL + F **to search for a node.
- Drag the **Audio **component into the graph after the **Set Material **node. This creates an **Audio **node.
- Drag off the **Audio **node’s pin and add a **Stop **node (under the **Audio **category).
- From the **Audio **node, drag the **exec input** pin and connect it to the **Set Material **node’s **exec **pin. This will stop playing the sound that the **Audio **component plays.

Under this sequence of nodes, you’ll see another sequence that starts with the **Event fnBPIButtonOff **node.

To play the audio when the trap is active, follow these steps:

- Locate the red **Event fnBPISwitchOff **node and go to the last node in that sequence.
- Drag off the **Set Material **node’s **exec **pin, search for **play** **audio **in the node actions list, and add a **Play (Audio)** node. The Audio component is automatically added as the **Target**.
- Compile and Save the blueprint.

Now, you have modified the fire trap’s blueprint to play the sound effect upon activation. Your final blueprint graph should look like this:

You can now close the `BP_TrapFire`** **blueprint editor.

In the level viewport, if you select a fire trap in your level, you’ll see two spherical wireframes around the actor: the inner sphere shows the sound’s **Inner Radius**, and the outer sphere shows the sound’s **Falloff Distance**.

You can now play your game and hear the sound effect when the fire traps are active!

## Next Up

Next, you’ll continue working with audio and learn to use Unreal Engine’s Metasounds system to procedurally generate background music for your level.

- [image: Create Procedural Music] Create Procedural MusicCreate Procedural Music with MetaSounds. (-> artist-10-create-procedural-music-with-metasounds)

On this page

- Before You Begin (-> artist-09-adding-sounds-to-fire-traps-artist-track-unreal-engine)
- Create a Sound Cue (-> artist-09-adding-sounds-to-fire-traps-artist-track-unreal-engine)
- Control the Sound With a Sound Attenuation (-> artist-09-adding-sounds-to-fire-traps-artist-track-unreal-engine)
- Modify the Fire Trap Blueprint (-> artist-09-adding-sounds-to-fire-traps-artist-track-unreal-engine)
- Next Up (-> artist-09-adding-sounds-to-fire-traps-artist-track-unreal-engine)

Related documents

Sound Sources

 [image: Sound Sources] (-> sound-sources-in-unreal-engine)Art Pass for a Puzzle Adventure Game

 [image: Art Pass for a Puzzle Adventure Game] (-> art-pass-for-a-puzzle-adventure-game)Design a Puzzle Adventure

 [image: Design a Puzzle Adventure] (-> design-a-puzzle-adventure-game-in-unreal-engine)
