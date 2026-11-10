# MetaSounds Quick Start

https://dev.epicgames.com/documentation/en-us/unreal-engine/metasounds-quick-start?application_version=5.9

> A quick guide on getting started with MetaSounds.

[image: MetaSounds Quick Start]

Learn to use this **Beta** feature, but use caution when shipping with it.

**MetaSound** is a high-performance audio system that provides audio designers with complete control over a Digital Signal Processing (DSP) graph to generate sound sources.

In this guide, you will learn how to create two gameplay-driven **MetaSound Sources**: a bomb sound effect and ambient wind.

## Prerequisites

Before creating your first MetaSounds with this guide, you must create a new First Person Template (-> unreal-engine-templates-reference) project with **Starter Content**.

## 1 - Create the Bomb MetaSound

Though the rifle plays a sound when fired, the projectile is silent. Using MetaSound, you will create a bomb sound effect to be used by the projectile.

### 1A - Create the MetaSound Source

Because this will be a sound source within 3D space, start by creating a MetaSound Source with an attached **Sound Attenuation Asset**.

- Create a MetaSound Source. In the **Content Browser**, click the **Add** button.

- Select **Audio > MetaSound Source**.

- Give the newly created Asset a name (such as MSS_Bomb).

- Double-click the MetaSound to open the **MetaSound Editor**.

- Set the **Attenuation Settings** to spatialize and attenuate the MetaSound based on its position relative to the listener. Click the **Source** button on the **MetaSound Editor Toolbar**.

- In the **Details** panel, click the dropdown next to **Attenuation > Attenuation Settings**.

- Select **Sound Attenuation** under the Create New Asset heading.

- Give the newly created Asset a name (such as SA_Bomb), then save it.

### 1B - Build the MetaSound Graph

Click image for full size.

Build the **MetaSound Graph** that controls how your MetaSound Source sounds. Follow the instructions below to create the graph shown above.

- Find the **On Play Input** node and drag off of the pin into an empty space. Enter "Wave Player (Mono)" into the node search to create a connected node. You can move the node around the graph by dragging it.

- On the **Wave Player (Mono)** node: Click the **Wave Asset** dropdown and select the Fire_Sparks01 Sound Wave.

- Enable **Loop**.

- Drag off the **Out Mono** pin and create a **Mono Mixer (2)**.

- Drag off the **Stop** pin and create another **Wave Player (Mono)**.

- On the new **Wave Player (Mono)** node: Connect the **On Finished** pin to the **On Finished Output** node.

- Connect the **Out Mono** pin to the **In 1** pin on the **Mono Mixer (2)**.

- Drag off the **Play** pin and create a **Random Get (WaveAsset:Array)** node.

- Connect the **Wave Asset** pin to the **Value** pin on the **Random Get (WaveAsset:Array)** node.

- On the **Random Get (WaveAsset:Array)** node: Drag off the **Next** pin and select **Promote to Graph Input**. This will create a **Trigger Input** node named Next.

- Drag off the **In Array** pin and select **Promote to Graph Variable**. This will create a **WaveAsset:Array Variable** node named In Array.

- On the **Mono Mixer (2)**: Enter 2.0 for **Gain 1 (Lin)**.

- Connect the **Out** pin to the **Out Mono Output** node.

### 1C - Adjust the Explosion Wave Player Inputs

 [image: Bomb MetaSound Inputs]

Adjust the Next Trigger and the In Array Variable.

- Select the Next **Trigger Input** node.

- In the **Details** panel, enter "Explode" into **General > Input** to rename it. This will be the name of the Trigger you will set to execute from Blueprint.

- Select the In Array **WaveAsset:Array Variable** node.

- In the **Details** panel, enter "ExplosionArray" into **General > Variable** to rename it.

- Click the **Add (+)** button twice for **Default Value > Default**. These indices will hold Sound Wave references to be randomly selected from.

- Click the **Index[0]** dropdown and select the Explosion01 Sound Wave.

- Click the **Index[1]** dropdown and select the Explosion02 Sound Wave.

### 1D - Play the MetaSound

 [image: Explosion Trigger Input]

The MetaSound is now ready to play.

- Click the **Play** button on the **MetaSound Editor Toolbar** to play the MetaSound. A spark sound will loop until the **Explode** Trigger executes, at which point a random explosion sound in the **ExplosionArray** will play before the MetaSound finishes. You can simulate the **Explode** Trigger execution by clicking the **Execute (Down Arrow)** button on the top-right corner of the **Trigger Input** node while the MetaSound is playing.

- Save the MetaSound Source and close the MetaSound Editor.

## 2 - Add Bomb Logic to Blueprint

After designing the bomb sound, use the projectile's Blueprint to set up the runtime logic.

### 2A - Open the Projectile Blueprint

Open the pre-built projectile Blueprint.

- In the **Content Browser**, navigate to `All/Content/FirstPerson/Blueprints`.

- Double-click **BP_FirstPersonProjectile** to open it in the **Blueprint Editor**.

### 2B - Build the Blueprint Graph

 [image: Bomb Blueprint Graph]

Add to the existing **Blueprint Graph** to control the bomb MetaSound based on projectile lifecycle.

- Right-click in an empty space and create an **Event BeginPlay** node.

- Drag off the **Event BeginPlay** node and create a **Spawn Sound Attached** node.

- On the **Spawn Sound Attached** node: Click the **Sound** dropdown and select your bomb MetaSound.

- Drag off the **Attach to Component** pin and create a **Get Sphere** node.

- Drag off the **Return Value** pin and create an **Execute Trigger Parameter** node.

- Hold Alt and click the **Exec Output (>)** pin to remove the connection between the **Spawn Sound Attached** and **Execute Trigger Parameter** nodes.

- On the **Execute Trigger Parameter** node: Enter "Explode" for **In Name**.

- Drag off the **Exec Input (>)** pin and create an **Event Destroyed** node.

- Save your changes to the Blueprint and close the Blueprint Editor.

### 2C - Test the Level

The Blueprint is now ready to test.

Click the **Play** button on the **Level Editor Toolbar**, pick up the rifle (by moving into it), and shoot it (by left-clicking) to verify your work.

The projectiles will produce spatialized, dynamic sounds. The spark sound loops until the projectile explodes by either making contact with a blue box or after a short time passes.

## 3 - Create the Wind MetaSound

Create a MetaSound for ambient wind to add some atmosphere to the scene.

### 3A- Create the MetaSound Source

Create another MetaSound Source Asset. This sound will not be spatialized within 3D space, so you don't have to attach a Sound Attenuation Asset.

- Create a MetaSound Source. In the **Content Browser**, click the **Add** button.

- Select **Audio > MetaSound Source**.

- Give it a name (such as MSS_Wind).

- Double-click the MetaSound to open the MetaSound Editor.

### 3B - Adjust the MetaSound Details

 [image: Wind MetaSound Details]

Before building the graph, adjust the default properties of the MetaSound to support persistent stereo audio.

- In the Interfaces panel, click the **Remove (Trash Bin)** button next to the **UE.Source.OneShot** Interface entry. This will remove the **On Finished Output** node, which isn't used on persistent sounds such ambience or music.

- Click the **MetaSound** button on the **MetaSound Editor Toolbar**.

- In the **Details** panel, click the **MetaSound > Output Format** dropdown and select **Stereo**. This will replace the **Out Mono Output** node with **Out Left** and **Out Right Output** nodes.

### 3C - Build the MetaSound Graph

Click image for full size.

Build the **MetaSound Graph** that controls how your MetaSound Source sounds. Follow the instructions below to create the graph shown above.

- Select the **On Play Input** node and delete it using the Delete key. It will not be needed in this graph.

- Drag off the **Out Left** pin and create a **Stereo Mixer (2)** node.

- Connect the **Out Right** pin to the **Out R** pin on the **Stereo Mixer (2)** node.

- Right-click in an empty space and create a **Noise** node.

- On the **Noise** node, drag off the **Audio** pin and create a **One-Pole Low Pass Filter** node.

- Drag a selection box to select the **Noise** and **One-Pole Low Pass Filter** nodes.

- Right-click either selected node and select **Duplicate**.

- On the new **Noise** node, enter 1 for **Seed**. This will introduce variance in the noise generation.

- On one of the **One-Pole Low Pass Filter** nodes, connect the **Out** pin to the **In 0 L** pin on the **Stereo Mixer (2)** node.

- On the other **One-Pole Low Pass Filter** node, connect the **Out** pin to the **In 0 R** pin on the **Stereo Mixer (2)**node.

- Right-click in an empty space and create an **LFO** node.

- On the **LFO** node: Enter 0.1 for **Frequency**.

- Enter 20.0 for **Min Value**.

- Enter 80.0 for **Max Value**.

- Connect the **Out** pin to both of the **Cutoff Frequency** pins on the **One-Pole Low Pass Filter** nodes.

- On the **Stereo Mixer (2)** node, drag off the **Gain 0 (Lin)** pin and create an **InterpTo** node.

- On the **InterpTo** node: Enter 0.3 for **Interp Time**.

- Drag off the **Target** pin to create an **Add (Float)** node.

- On the **Add (Float)** node: Enter 2.0 for **Bottom Addend**.

- Drag off the **Top Addend** pin and create a **Multiply (Float)** node.

- On the **Multiply (Float)** node: Enter 3.0 for **Bottom Multiplicand**.

- Drag off the **Top Multiplicand** pin and select **Promote to Graph Input**. This will create a **Float Input** node named PrimaryOperand.

- Select the PrimaryOperand **Float Input** node.

- In the **Details** panel, enter "PawnSpeed" into **General > Input** to rename it.

### 3D - Play the MetaSound

 [image: Pawn Speed Float Input]

The MetaSound is now ready to play.

- Click the **Play** button on **MetaSound Editor Toolbar** to play the MetaSound. A dynamic wind-like sound will play in stereo until you click the **Stop** button. The signal gain is affected by the PawnSpeed **Float Input** node. You can simulate PawnSpeed values by clicking the **Input Widget (Dial)** on the node and dragging up or down.

- Save the MetaSound Source and close the MetaSound Editor.

## 4 - Add Wind Logic to Blueprint

After designing the wind sound, use the **Level Blueprint** to set up the runtime logic.

### 4A - Open the Level Blueprint

To open the Level Blueprint, click the **Blueprint** button in the **Level Editor Toolbar** and select **Open Level Blueprint**.

### 4B - Build the Blueprint Graph

Click image for full size.

Build the Blueprint Graph to control the wind MetaSound based on Player movement.

- Right-click in an empty space and create an **Event BeginPlay** node.

- Drag off the **Event BeginPlay** node and create a **Spawn Sound 2D** node.

- On the **Spawn Sound 2D** node: Click the **Sound** dropdown and select your wind MetaSound.

- Drag off the **Return Value** and create a **Set Float Parameter** node.

- Hold Alt and click the **Exec Output (>)** pin to remove the connection between the **Spawn Sound 2D** and **Set Float Parameter** nodes.

- On the** Set Float Parameter** node: Enter "PawnSpeed" for **In Name**.

- Drag off the **Exec Input (>)** pin and create an Event Tick node.

- Right-click in an empty space and create a **Get Player Pawn** node.

- On the **Get Player Pawn** node, drag off the **Return Value** pin and create a **Get Velocity** node.

- On the **Get Velocity** node, drag off the **Return Value** pin and create a **Vector Length** node.

- On the **Vector Length** node, drag off the **Return Value** pin and create a **Map Range Clamped** node.

- On the **Map Range Clamped** node: Enter 200.0 for **In Range A**.

- Enter 1000.0 for **In Range B**.

- Enter 1.0 for **Out Range B**.

- Connect the **Return Value** pin to the **In Float** pin on the **Set Float Parameter** node.

- Save your changes to the Blueprint and close the Blueprint Editor.

### 4C - Test the Level

The Blueprint is ready to test.

Click the **Play** button on the **Level Editor Toolbar** and move around to verify your work.

The wind sound will play at a low volume when idle and grow louder as your velocity increases.

## 5 - On Your Own!

Now that you've finished creating two basic MetaSounds, consider taking this project even further. Below are some suggestions you can explore on your own:

- Alter your MetaSounds with some additional nodes. See the MetaSounds Reference Guide (-> metasounds-reference-guide-in-unreal-engine) for information on the node library and other MetaSound features.

- Replace the default rifle firing sound with a MetaSound. Consider altering the sound dynamically based on the rate of fire, shot angle, or other variables.

- Add MetaSounds for player actions such as walking, jumping, and item pickup.

- Improve on the simple wind implementation you created with this guide. See the Lyra Sample Game (-> lyra-sample-game-in-unreal-engine) project for an example of an advanced implementation that supports additional features, such as panning and environment response.

- beta
- audio
- sound sources
- metasounds

On this page

- Prerequisites (-> metasounds-quick-start)
- 1 - Create the Bomb MetaSound (-> metasounds-quick-start)
- 1A - Create the MetaSound Source (-> metasounds-quick-start)
- 1B - Build the MetaSound Graph (-> metasounds-quick-start)
- 1C - Adjust the Explosion Wave Player Inputs (-> metasounds-quick-start)
- 1D - Play the MetaSound (-> metasounds-quick-start)
- 2 - Add Bomb Logic to Blueprint (-> metasounds-quick-start)
- 2A - Open the Projectile Blueprint (-> metasounds-quick-start)
- 2B - Build the Blueprint Graph (-> metasounds-quick-start)
- 2C - Test the Level (-> metasounds-quick-start)
- 3 - Create the Wind MetaSound (-> metasounds-quick-start)
- 3A- Create the MetaSound Source (-> metasounds-quick-start)
- 3B - Adjust the MetaSound Details (-> metasounds-quick-start)
- 3C - Build the MetaSound Graph (-> metasounds-quick-start)
- 3D - Play the MetaSound (-> metasounds-quick-start)
- 4 - Add Wind Logic to Blueprint (-> metasounds-quick-start)
- 4A - Open the Level Blueprint (-> metasounds-quick-start)
- 4B - Build the Blueprint Graph (-> metasounds-quick-start)
- 4C - Test the Level (-> metasounds-quick-start)
- 5 - On Your Own! (-> metasounds-quick-start)
