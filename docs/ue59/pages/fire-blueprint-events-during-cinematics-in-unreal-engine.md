# Calling Events through Sequencer

https://dev.epicgames.com/documentation/en-us/unreal-engine/fire-blueprint-events-during-cinematics-in-unreal-engine?application_version=5.9

> Example of how you can use Sequencer's Event Track to fire off Events in Blueprint.

[image: Calling Events through Sequencer]

When playing a cinematic through **Sequencer**, there may be instances when you want to trigger an **Event** that initiates some scripted functionality.
Perhaps at a certain point in your cinematic you want a door to open, or have a particle effect to spawn and effect the Player in some way. With the **Event Track** you can key the exact frame in the cinematic where you want to call the Event.

You can add Events through a Sequencer track without needing to access the Blueprint. You can add multiple Events to an object, or add multiple object bindings to a single Event.
If you open the Blueprint, you can also add multiple Parameters to one Event. For more detailed information, refer to Event Track Overview (-> cinematic-event-track-in-unreal-engine).

In this guide, we use several Event Tracks to print text to the screen indicating our character is dead. At the same time, we disable player movement and simulate physics on the character.

For this guide we are using the **Blueprint Third Person Template** project.

## Setting up the Character

First, we need to set up the Third Person Character.

- From the Main Toolbar, click the **Cinematics** button and select **Add Level Sequence** with any name and save location.

- In the **Details** panel for the Level Sequence, enable the **Auto Play** option.

- Select the **ThirdPersonCharacter** in the Level, then add it to Sequencer from the **+ Track** button.

- Right-click on the **ThirdPersonCharacter** in the Level, then select **Edit ThirdPersonCharacter**.

- Right-click in the **Event Graph** and search for then add a **Custom Event**.

- Call the Custom Event **KillPlayerText** and connect a **Print String** node with custom text as the String.

- Select the KillPlayerText node, and on the Details panel, go to **Inputs**. Select **+Add Parameter** to add a new parameter to the node.

- Choose the **String** parameter from the dropdown and update the parameter name to **In String**. Then, connect the In String input from the Custom Event to the Print String.

## Adding Event Tracks

With the character set up, we can add Events so the character becomes disabled and prints the text from the Character Blueprint.

- In **Sequencer**, click the **+ Track** button on the **ThirdPersonCharacter** track and select **Event**.

- Move the Timeline to frame **149**, then add a key to the Events track.

- Right-click on the new keyframe, and under **Properties**, select the **Unbound** dropdown to add **Create a Quick Binding**.

- In the Quick Bind, search for **Set All Bodies to Simulate Physics**. Make sure to check **New Simulate** under Payload.

- Add a second Event Track and add a Quick Bind for **Disable Movement**.

- Add a third Event Track and add a Quick Bind to call the **Kill Player Text** we set up earlier. Under **Payload**, enter **GAME OVER!** in the **In String** textbox.

- **ALT+Drag** the string key to three other locations on the timeline. Update the first key's string text with **3**, the second key with **2**, and the third key with **1**. Essentially, we are counting down to the GAME OVER! string text.

- From any key's **Event Properties**, double-click the **magnifying glass** icon to open the **Sequence Director Blueprint**. You can also open the Blueprint by double-clicking the event key or by navigating to **General Options > Open Director Blueprint**.

- Add a **SetCollisionEnabled** node to **Set All Bodies Simulate Physics**, and set the type to **Collision Enabled**. Connect the Target pin to the **Mesh** pin. This setting causes the character to collide into objects rather than fall through them. Even though we don't need to access the Blueprint to create Events, we do need the Blueprint to add onto Events, such as in this case.

- When you press **Play** you can run around in the viewport until the 150 second mark where the character dies and the text prints to the upper left corner of the viewport.

If the **Mouse Control** label appears in the upper left corner, you will not be able to see the text easily. To toggle this off, go to Editor Preferences > Level Editor > Play, and uncheck **Show Mouse Control Label**.

## End Result

When you play in the Editor, after a few moments, text will appear in the upper-left corner of the window and the character will fall to the ground with your ability to move disabled.

Adding an Event Track to an Object within Sequencer creates an Object Binding where you can call Events, Functions or access properties of the Object that you are bound to. Event Tracks can also be used to execute script within the Level Blueprint, UI Widget Blueprints, or communicate with multiple Blueprints through a Blueprint Interface.

- sequencer
- event track

On this page

- Setting up the Character (-> fire-blueprint-events-during-cinematics-in-unreal-engine)
- Adding Event Tracks (-> fire-blueprint-events-during-cinematics-in-unreal-engine)
- End Result (-> fire-blueprint-events-during-cinematics-in-unreal-engine)
