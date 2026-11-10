# Create Procedural Music

https://dev.epicgames.com/documentation/en-us/unreal-engine/artist-10-create-procedural-music-with-metasounds?application_version=5.9

> Create Procedural Music with MetaSounds.

[image: Create Procedural Music]

In this tutorial, you’ll learn how to create procedural music using **MetaSounds**. You’ll create procedurally-generated background music for your adventure game.

MetaSounds is a high-performance audio system that can generate sound sources using a node-based system, similar to the Blueprint Visual Scripting system.

## Before You Begin

Make sure you understand these topics covered in the Unreal Engine for New Users (-> unreal-engine-for-new-users) documentation:

- Blueprint basics, such as adding and connecting nodes.

## Create Procedural Music with MetaSounds

You’ll start by creating a MetaSound asset. Follow these steps:

- Go to the **Content** **Browser **and navigate to the** Content > AdventureGame > Artist > Audio** folder.
- In the **Audio **folder, create a new folder named **Music**.
- Right-click inside the **Music **folder and select **Audio > MetaSound Source**.
- Name this asset `MS_BGM`, which stands for **MetaSound Background Music**.
- Open the asset.

The asset opens in the **MetaSound Editor**. In the new window, you will see three nodes in the graph – **Input**, **Output On Finished**, and **Input Out Mono**.

The **Input **trigger is executed when this audio source is played. A MetaSound always begins with an Input.

The **Output On Finished **trigger is executed to stop the source from playing. If you’re stopping the audio from somewhere else, like a blueprint, you don’t have to use this node to stop the audio source from playing. In this case, you’ll use a blueprint to start and stop the audio, so you won’t have to use this node.

The **Output** **Out Mono **node represents the final audio output of the MetaSound graph, routing all upstream audio signals into a single-channel (mono) output. Any nodes connected to it are effectively mixed down and sent to the engine as the sound’s output.

## Set Music Tempo and Rhythm

First, you’ll create the nodes to set the tempo and rhythm of the music. Follow these steps:

- Drag the **Input **node’s pin and add a **Trigger Repeat **node.
- On the **Trigger** **Repeat **node, drag the **Period **pin and add a **BPM To Seconds **node. Set the **Divisions of** **Whole Note** to **16**.
- On the **BPM To Seconds **node, drag the **BPM** pin and select **Promote to Graph Input**.
- In the **Members **panel in the top-left corner of the screen, rename **Input **from **BPM **to **Note In**.
- In the **Details **panel, change the **Default Value** of the **Note In** node to **60**. You can also change this value at the bottom of the node.
- From the **Trigger Repeat **node, drag the **RepeatOut **pin and add a new **Trigger** **Counter **node.
- Select the **Trigger Counter **node and set the **Reset Count **to **8**.

This section sets the tempo and rhythm. Additionally, you can highlight all four nodes you added – **Trigger Counter**, **Trigger Repeat**, **BPM To Seconds**, and **Input **– and press **C** to add a comment box that contains all of the nodes. Name this comment box **Tempo and Rhythm**.

## Generate a Melody

Next, you’ll create the functionality that generates the melody using the tempo and rhythm you defined. Follow these steps:

- From the **Trigger Counter** node:Drag the **On Trigger **pin and add a **Random** **Get** **(Float:Array)** node.
- Drag the **Trigger** **Counter **node’s **On** **Reset **pin and connect it to the **Random Get **node’s **Reset pin**.

- From the **Random Get **node, drag the **In Array **pin and add a **Scale to Note Array **node.
- From the **Scale to Note Array** node, drag the **Scale Degrees **pin and add select **Promote to Graph Input **and name it **Scale**.
- From the **Random** **Get **node, drag the **Seed **pin and add a **Random (Int) **node.
- From the **Random (Int) **node, drag the **Next **pin and connect it to the **Trigger Counter **node’s **On Reset **pin.

This section generates the melody. Once again, you can highlight all of the new nodes and add a comment box called **Melody Generation**.

## Synthesize the Melody

Next, you’ll shape how that melody actually sounds by creating the synthesis. This means turning the generated melody notes into audible sound. Follow these steps:

- On the **Random Get **node, drag the **Value** pin and add an **Add (Float)** node.
- On the **Add **node, change the second input pin’s value from 0 to **48**.
- From the **Add **node, drag the **exec **pin and add a **MIDI To Frequency** **(Float)** node.
- From the **MIDI To Frequency (Float) **node, drag the **Out Frequency **pin and add a **Sine **node.
- From the **Sine **node, drag the **Audio **output pin and add an **Add (Audio) **node.
- You’ll add one more **Sine **node that connects to this **Add **node. So, from the **Add** node, drag the other input pin and add a **Sine **node.
- On the new **Sine **node, drag the **Frequency **pin and add a** MIDI To Frequency (Float) **node.
- From the **MIDI To Frequency** node, drag the **MIDI In** pin and add an **Add (Float)** node.
- On the **Add **node:Connect the first input pin to the **Add **node that is connected to the first **Sine **node.
- Drag the second input pin and select **Promote to Graph Input**. Name it **Detune**.
- Select the **Detune **input and in the **Details **panel, change its **Range **to **0** and **12**.
- In the **Details **panel, change the **Default **value to **12.**

Now, you’ve synthesized the melody that will be generated. You can once again add a comment box for this new section and name it **Synthesis**.

## Shape the Sound With an Envelope

Next, you’ll add an envelope to shape how the sound evolves over time, controlling its start, sustain, and fade-out for a more natural result.

To add an envelope, follow these steps:

- Scroll to the melody generation section you created previously (if you added a comment box, it should be named **Melody Generation**). From the **Random Get (Float:Array)** node, drag the **On** **Next **pin and add an **AD Envelope (Audio) **node. Move this new node after the two Sine nodes you added in the synthesis section.
- From this node, drag the **Out Envelope** pin and add a **Multiply (Audio) **node.
- From this **Multiply **node, drag the second input pin and connect it to the output pin of the **Add (Audio) **node that you connected the two **Sine **nodes to.
- On the **AD Envelope (Audio) **node, change the **Decay Time** to **0.2**.
- From the **Multiply (Audio) **node, drag the output pin and connect it to the **Output** **Out** **Mono **node that was already in the MetaSound Source.

Now, press the **Play **button in the toolbar near the top of the MetaSound Source window. It will continuously play procedurally-generated music.

To learn more about crafting procedural music in Unreal Engine, see the Creating Procedural Music with MetaSounds (-> creating-procedural-music-with-metasounds) page.

## Play the Music In-Game With Blueprints

Before moving on, you’ll create a Blueprint that plays the background music in the level.

Since this blueprint will be added to the level but doesn’t have a visual representation, you’ll add a **Billboard **component to the blueprint. This component adds a 2D sprite that makes it visible in the editor so you can find it while editing your level, but it won’t be visible in the game.

To create the background music blueprint, follow these steps:

- Go to the **Content** **Browser **and navigate to** Content > AdventureGame > Artist > Audio > Music**.
- Right-click and create a new **Blueprint Class** that derives from the **Actor **parent class. Name this **BP_BGM**, which stands for Blueprint Background Music.
- In the **Components **panel, click **Add **and add a **Billboard **component. In the **Details **panel, you can see that the **Sprite **is set to **S_Actor **by default. You can change the sprite or leave it as is.
- Go to the **EventGraph** tab to start building the functionality.
- Drag from the **Event** **BeginPlay **node and add a **Branch **node.
- From the **Branch **node, drag the **Condition **pin and select **Promote to Variable**. Name this variable **Active**. This variable will be used to determine if this audio source is active or not.
- In the **Variables **list in the **My Blueprints **panel, click the **eye **icon next to the **Active **variable so the eye is open, making it public and editable in the level editor.
- **Compile **the blueprint, use the **Details **panel to ensure the **Active** variable’s **Default Value** is **true **(enabled).
- From the **Branch **node, drag the **True **pin and add a **Play Sound 2D** node.
- On the** Play Sound 2D** node, use the dropdown to set the **Sound **pin to **MS_BGM**.
- From the **Play Sound 2D** node, click the down arrow to expand the node options. Drag the **Volume Multiplier** pin and select **Promote to Variable**.
- Click the variable’s **eye **icon to make it public and editable, **Compile **the blueprint, and change its **default value** to **0.5**.
- Save and compile your blueprint.

The “**2D**” in the **Play Sound 2D** node indicates that the sound will play independently of the player’s position in the level. In other words, it’s not spatialized in 3D space so distance and direction don’t affect how the player hears it.

## Test Your Music In-Game

You can now go back to the level editor and add the **BP_BGM **blueprint into your level.

Select the **BP_BGM **actor in the level, and in the **Details **panel, make sure that the two variables you added are correctly set up: **Active **should be toggled **on**, and the **Volume Multiplier** should be set to **0.5**.

You can try different values for the Volume Multiplier and see what works best for your use case. Since this is the background music, you might want to have its volume set to lower values to keep it subtle.

Now, play the game. You should hear the music that you created play in the background!

## Next Up

In the next module you will learn how to add dynamic footstep sound effects to your player character, that playback different sounds depending on the type of floor the character is currently moving across.

- [image: Add Footstep Sounds to a Character] Add Footstep Sounds to a CharacterMake a character produce different step sounds as they move across different surfaces. (-> artist-11-add-footstep-sounds-to-a-character)

On this page

- Before You Begin (-> artist-10-create-procedural-music-with-metasounds)
- Create Procedural Music with MetaSounds (-> artist-10-create-procedural-music-with-metasounds)
- Set Music Tempo and Rhythm (-> artist-10-create-procedural-music-with-metasounds)
- Generate a Melody (-> artist-10-create-procedural-music-with-metasounds)
- Synthesize the Melody (-> artist-10-create-procedural-music-with-metasounds)
- Shape the Sound With an Envelope (-> artist-10-create-procedural-music-with-metasounds)
- Play the Music In-Game With Blueprints (-> artist-10-create-procedural-music-with-metasounds)
- Test Your Music In-Game (-> artist-10-create-procedural-music-with-metasounds)
- Next Up (-> artist-10-create-procedural-music-with-metasounds)

Related documents

MetaSounds

 [image: MetaSounds] (-> metasounds-in-unreal-engine)Art Pass for a Puzzle Adventure Game

 [image: Art Pass for a Puzzle Adventure Game] (-> art-pass-for-a-puzzle-adventure-game)Design a Puzzle Adventure

 [image: Design a Puzzle Adventure] (-> design-a-puzzle-adventure-game-in-unreal-engine)
