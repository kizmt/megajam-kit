# Creating Procedural Music with MetaSounds

https://dev.epicgames.com/documentation/en-us/unreal-engine/creating-procedural-music-with-metasounds?application_version=5.9

> Learn how to create procedural music with MetaSounds.

[image: Creating Procedural Music with MetaSounds]

# Creating Procedural Music with MetaSounds

**MetaSound** is a high-performance audio system providing audio designers with complete control over a Digital Signal Processing (DSP) graph to generate sound sources.

This guide teaches you how to create a gameplay-driven procedural music system using a **MetaSound Source** and Blueprint.

## Prerequisites

This guide requires a project with player character movement support, such as the First Person Template (-> unreal-engine-templates-reference) project.

## 1 - Create the Music MetaSound

Click image for full size.

Start by creating a MetaSound that plays procedural music. Follow each substep below to build the graph above, section by section.

This process exposes several input parameters for access from Blueprint in future steps.

### 1.1 - Initial Setup

Create a MetaSound Source that supports persistent stereo audio.

- Create a MetaSound Source. In the **Content Browser**, click the **Add** button.

- Select **Audio > MetaSound Source**.

- Give the newly created MetaSound a name, such as `MSS_Music`.

- Double-click the MetaSound to open the **MetaSound Editor**.

- In the **Interfaces** panel, click the **Remove (Trash Bin)** button next to the **UE.Source.OneShot** Interface entry. This removes the **On Finished Output** node, which isn't used on persistent sounds such as ambience or music.

- Click the **MetaSound** button on the **MetaSound Editor Toolbar**.

- In the **Details** panel, click the **MetaSound > Output Format** dropdown and select **Stereo**. This replaces the **Out Mono Output** node with an **Out Left** and an **Out Right Output** node.

### 1.2 - Tempo and Rhythm

 [image: Tempo and Rhythm Graph]

Build the Tempo and Rhythm section to control the timing of the music with Trigger nodes.

- Find the **On Play Input** node and drag off of the pin into an empty space. Enter "Trigger Repeat" into the node search to create a connected node. You can move the node around the graph by dragging it.

- On the **Trigger Repeat** node: Drag off the **Period** pin and create a **BPM To Seconds** node.

- Drag off the **RepeatOut** pin and create a **Trigger Counter** node.

- On the **BPM to Seconds** node: Set **Divisions of Whole Note** to 16.

- Drag off the **BPM** pin and select **Promote to Graph Input**. This creates a **Float Input** node named BPM.

- Select the **BPM** node.

- In the **Details** panel, set **Default Value > Range** to 60.0, 180.0.

- On the **Trigger Counter** node, set **Reset Count** to 8.

- Select all of the nodes except the **On Play Input** node, right-click one of the selected nodes, and select **Create Comment From Selection**.

- Name the comment box "Tempo and Rhythm."

You can change the color of a selected comment box in the **Details** panel.

### 1.3 - Melody Generation

 [image: Melody Generation Graph]

Build the Melody Generation section to produce a random melody in a specified scale.

- On the **Trigger Counter** node in the Tempo and Rhythm section: Drag off the **On Trigger** pin and create a **Random Get (Float:Array)** node.

- Drag off the **On Reset** pin and connect it to **Reset** on the **Random Get (Float:Array)** node.

- On the **Random Get (Float:Array)** node: Drag off the **In Array** pin and create a **Scale to Note Array** node.

- Drag off the **Seed** pin and create a **Random (Int)** node.

- Drag off the **Value** pin and create an **Add (Float)** node.

- On the **Scale to Note Array** node, drag off the **Scale Degrees** pin and select **Promote to Graph Input**. This creates an **Enum Input** node named Scale Degrees.

- Select the Scale Degrees node.

- In the **Details** panel: Set **General > Input** to "Scale" to rename the input.

- (Optional) Set **Default Value > Default** to the music scale you want to use. This defaults to Major Scale.

- On the **Random (Int)** node: Set **Max** to 100000.

- Drag off the **Next** pin and select **Promote to Graph Input**. This creates a **Trigger Input** node named Next.

- Select the Next node.

- In the **Details** panel, set **General > Input** to "NewMelody" to rename the input.

- On the **Add (Float)** node, set the bottom addend to 48.0. This is an offset of four octaves.

- Enclose the new nodes in a comment box named "Melody Generation."

### 1.4 - Synthesis (Sine)

 [image: Synthesis (Sine) Graph]

Build the Synthesis (Sine) section to produce a sine wave at the frequency of the input note.

- On the **Add (Float)** node in the Melody Generation section: Drag off the output pin and create a **MIDI To Frequency (Float)** node.

- Drag off the output pin again and create another **Add (Float)** node.

- On the new **Add (Float)** node: Drag off the output pin and create another **MIDI To Frequency (Float)** node.

- Drag off the bottom addend pin and select **Promote to Graph Input**. This creates a **Float Input** node named AdditionalOperands.

- Select the AdditionalOperands node.

- In the **Details** panel: Set **General > Input** to "Detune" to rename the input.

- Set **Default Value > Default** to 12.0.

- Set **Default Value > Range** to 0.0, 12.0.

- On each of the **MIDI To Frequency (Float)** nodes, drag off the **Out Frequency** pin and create a **Sine** node.

- On the first **Sine** node, drag off the **Audio** pin and create an **Add (Audio)** node.

- On the second **Sine** node, connect the **Audio** pin to the bottom addend of the **Add (Audio)** node.

- Enclose the new nodes in a comment box named "Synthesis (Sine)."

### 1.5 - Synthesis (Saw)

 [image: Synthesis (Saw) Graph]

Build the Synthesis (Saw) section to produce a saw wave at the frequency of the input note.

- Select all of the nodes in the Synthesis (Sine) section, right-click one of the selected nodes, and select **Duplicate**.

- Ensure that the input pins of the **Add (Float)** and **MIDI to Frequency (Float)** nodes are connected to the output pin of the **Add (Float)** node from the Melody Generation section.

- Delete both of the **Sine** nodes and replace them with **Saw** nodes.

- Enclose the new nodes in a comment box named "Synthesis (Saw)."

### 1.6 - Crossfade

 [image: Crossfade Graph]

Build the Crossfade section to control the ratio of the sine and saw synths.

- On the **Add (Audio)** in the Synthesis (Sine) section, drag off the output pin and create a **Crossfade (Audio, 2)** node.

- On the **Crossfade (Audio, 2)** node: Connect the **In 1** pin to the output pin on the **Add (Audio)** node in the Synthesis (Saw) section.

- Drag off the **Crossfade Value** pin and select **Promote to Graph Input**. This creates a **Float Input** node named Crossfade Value.

- Select Crossfade Value.

- In the **Details** panel, set **General > Input** to "Crossfade" to rename the input.

- Enclose the new nodes in a comment box named "Synthesis (Crossfade)."

### 1.7 - Filtering

 [image: Filtering Graph]

Build the Filtering section to smooth out the sound.

- On the **Crossfade (Audio, 2)** node in the Crossfade section, drag off the **Out** pin and create a **Ladder Filter** node.

- On the **Ladder Filter** node: Set **Resonance** to 6.0.

- Drag off the **Cutoff Frequency** pin and create an **LFO** node.

- On the **LFO** node: Set **Frequency** to 0.5.

- Set **Min Value** to 500.0.

- Set **Max Value** to 5000.0.

- Enclose the new nodes in a comment box named "Filtering."

### 1.8 - Enveloping

 [image: Enveloping Graph]

Build the Enveloping section with an attack-decay envelope to remove the sustain of the notes in the melody.

- On the **Random Get (Float:Array)** node in the Melody Generation section, drag off the **On Next** pin and create an **AD Envelope (Audio)** node.

- On the **AD Envelope (Audio)** node, set **Decay Time** to 0.1.

- Enclose the new node in a comment box named "Enveloping."

### 1.9 - Effects Processing

 [image: Effects Processing Graph]

Build the Effects Processing section to produce a stereo widening effect. The delay creates an illusion that the mono signal is a stereo signal.

- On the **AD Envelope (Audio)** node in the Enveloping section, drag off the **Out Envelope** pin and create a **Multiply (Audio)** node.

- On the **Multiply (Audio)** node: Connect the bottom multiplicand pin to the **Out** pin of the **Ladder Filter** node in the Filtering section.

- Drag off the output pin and create a **Delay** node.

- On the **Delay** node: Set **Delay Time** to 0.02.

- Drag off the **Out** pin and create a **Stereo Delay** node.

- On the **Stereo Delay** node: Connect the **In Right** pin to the output pin of the **Multiply (Audio)** node.

- Set **Delay Mode** to Ping Pong.

- Set **Delay Time** to 0.2.

- Set **Delay Ratio** to 0.2.

- Set **Dry Level** to 0.7.

- Set **Wet Level** to 0.2.

- Set **Feedback** to 0.4.

- Connect the **Out Left** pin to the **Out Left Output** node.

- Connect the **Out Right** pin to the **Out Right Output** node.

- Enclose the **Delay** and **Stereo Delay** nodes in a comment box named "Effects Processing."

### 1.11 - Play the MetaSound

The MetaSound is now ready to play.

- Save the MetaSound.

- Click the **Play** button on the **MetaSound Editor Toolbar** to play the MetaSound.

- Use the widgets or the **Details** panel to adjust input values and listen to the changes in real-time.

## 2 - Build the Blueprint Actor

 [image: Blueprint Actor]

Create a **Blueprint Actor** with **Box Colliders** that triggers changes in the MetaSound during runtime.

### 2.1 - Create the Blueprint Class

- In the **Content Browser**, click the **Add** button.

- Select **Blueprint Class**.

- From the **Pick Parent Class** window, select **Actor**.

- Give the newly created Blueprint Actor a name, such as `BP_MusicPlayer`.

### 2.2 - Add Components

Add Components to the Actor to create three separate trigger zones that respond when the Player moves in and out of them.

- Double-click the Blueprint Actor to open the **Blueprint Editor**.

- Add a Box Collision Component. In the **Components** panel: Click the **Add** button.

- Type "Box Collision" into the search bar and press Enter.

- In the **Details** panel: Set **Transform > Scale** to 5.0, 5.0, 1.0.

- Disable **Rendering > Hidden In Game**.

- Add a Text Render Component to the Box Collision Component. In the **Components** panel: Select the Box Collision Component.

- Click the **Add** button.

- Type "Text Render" into the search bar and press Enter.

- In the **Details** panel: Set **Transform > Location** to 0.0, 0.0, 150.0.

- Set **Text > Horizontal Alignment** to Center.

- Set **Text > World Size** to 64.0.

- Create two additional copies of the Components. Do the following twice: In the **Components** panel, Ctrl + click to select both the Box Collision Component and Text Render Component.

- Right-click and select **Duplicate**.

- Customize the BPM Trigger. In the **Components** panel, right-click the first Box Collision Component, select **Rename**, and name it `Trigger_BPM`.

- In the **Details** panel, set **Transform > Location** to 0.0, 350.0, 0.0.

- In the **Components** panel, select the child Text Render Component.

- In the **Details** panel, set **Text > Text** to BPM.

- Customize the Crossfade Trigger. In the **Components** panel, right-click the second Box Collision Component, select **Rename**, and name it `Trigger_Crossfade`.

- Select the child Text Render Component.

- In the **Details** panel, set **Text > Text** to Crossfade.

- Customize the Melody Trigger. In the **Components** panel, right-click the third Box Collision Component, select **Rename**, and name it `Trigger_Melody`.

- In the **Details** panel, set **Transform > Location** to 0.0, -350.0, 0.0.

- In the **Components** panel, select the child Text Render Component.

- In the **Details** panel, set **Text > Text** to Melody.

- Add an Audio Component for the MetaSound. In the **Components** panel: Click the **Add** button.

- Type "Audio" into the search bar and press Enter.

- In the **Details** panel, set **Sound > Sound** to the Music MetaSound.

### 2.3 - Add Trigger Events

Add collision response events for each of the zones.

- In the **Components** panel, select Trigger_BPM.

- In the **Details** panel: Select the **Add (+)** button next to **Events > On Component Begin Overlap**.

- Select the **Add (+)** button next to **Events > On Component End Overlap**.

- In the **Components** panel, select Trigger_Crossfade.

- In the **Details** panel: Select the **Add (+)** button next to **Events > On Component Begin Overlap**.

- Select the **Add (+)** button next to **Events > On Component End Overlap**.

- In the **Components** panel, select Trigger_Melody.

- In the **Details** panel, select the **Add (+)** button next to **Events > On Component Begin Overlap**.

### 2.4 - Build Trigger Events

Click image for full size.

Attach nodes to each event to control the music.

You might need to turn off the **Context Sensitive** filter located at the top-right of the search context menu to find the **Set Float Parameter (Audio)** and **Execute Trigger Parameter** nodes used below.

- On the **On Component Begin Overlap (Trigger_BPM)** node, drag off the **Exec Output (>)** pin, and create a **Set Float Parameter (Audio)** node.

- On the **Set Float Parameter** node: Set **In Name** to BPM.

- Set **In Float** to 120.0.

- On the **On Component End Overlap (Trigger_BPM)** node, drag off the **Exec Output (>)** pin, and create another **Set Float Parameter (Audio)** node.

- On the new **Set Float Parameter** node: Set **In Name** to BPM.

- Set **In Float** to 90.0.

- On the **On Component Begin Overlap (Trigger_Crossfade)** node, drag off the **Exec Output (>)** pin, and create another **Set Float Parameter (Audio)** node.

- On the new **Set Float Parameter** node: Set **In Name** to Crossfade.

- Set **In Float** to 1.0.

- On the **On Component End Overlap (Trigger_Crossfade)** node, drag off the **Exec Output (>)** pin, and create another **Set Float Parameter (Audio)** node.

- On the new **Set Float Parameter** node: Set **In Name** to Crossfade.

- Set **In Float** to 0.0.

- On the **On Component Begin Overlap (Trigger_Melody)** node, drag off the **Exec Output (>)** pin, and create an **Execute Trigger Parameter** node.

- On the **Execute Trigger Parameter** node: Set **In Name** to NewMelody.

- In the **Components** panel, drag the Audio Component onto the **Target** pin.

- Compile and save the Blueprint.

## 3 - Test the Level

The Blueprint is ready to test.

- Place the BP_MusicPlayer by dragging it from the **Content Browser** into the **Level**.

- Using the transformation widget, place the Actor so your character can move in and out of it.

- Click the **Play** button on the **Level Editor Toolbar**.

- Move in and out of the triggers and observe their effects on the music.

- audio
- sound sources
- metasounds

On this page

- Creating Procedural Music with MetaSounds (-> creating-procedural-music-with-metasounds)
- Prerequisites (-> creating-procedural-music-with-metasounds)
- 1 - Create the Music MetaSound (-> creating-procedural-music-with-metasounds)
- 1.1 - Initial Setup (-> creating-procedural-music-with-metasounds)
- 1.2 - Tempo and Rhythm (-> creating-procedural-music-with-metasounds)
- 1.3 - Melody Generation (-> creating-procedural-music-with-metasounds)
- 1.4 - Synthesis (Sine) (-> creating-procedural-music-with-metasounds)
- 1.5 - Synthesis (Saw) (-> creating-procedural-music-with-metasounds)
- 1.6 - Crossfade (-> creating-procedural-music-with-metasounds)
- 1.7 - Filtering (-> creating-procedural-music-with-metasounds)
- 1.8 - Enveloping (-> creating-procedural-music-with-metasounds)
- 1.9 - Effects Processing (-> creating-procedural-music-with-metasounds)
- 1.11 - Play the MetaSound (-> creating-procedural-music-with-metasounds)
- 2 - Build the Blueprint Actor (-> creating-procedural-music-with-metasounds)
- 2.1 - Create the Blueprint Class (-> creating-procedural-music-with-metasounds)
- 2.2 - Add Components (-> creating-procedural-music-with-metasounds)
- 2.3 - Add Trigger Events (-> creating-procedural-music-with-metasounds)
- 2.4 - Build Trigger Events (-> creating-procedural-music-with-metasounds)
- 3 - Test the Level (-> creating-procedural-music-with-metasounds)
