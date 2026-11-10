# Referencing the Player in Sequencer

https://dev.epicgames.com/documentation/en-us/unreal-engine/how-to-reference-the-player-in-unreal-engine-cinematics?application_version=5.9

> Reference the player in Sequencer by using a proxy substitute, then changing the binding at runtime.

[image: Referencing the Player in Sequencer]

When making cinematic content in Sequencer, it may not be clear how to add and animate the player character in the same way you add other objects or actors (-> cinematic-actor-tracks-in-unreal-engine) in the scene. This document provides the recommended workflow for referencing the player character as a proxy, then binding it to the actual player at runtime.

#### Prerequisites

- You have a controllable player character in your project. For this document, the Third Person Template is used as an example.

- You are familiar with animating skeletal meshes in Sequencer (-> how-to-add-cinematic-animation-to-a-character-in-unreal-engine).

- You are familiar with using Blueprints (-> blueprints-visual-scripting-in-unreal-engine).

## Reference a Proxy Player

While the PlayerStart Actor is the spawn point for the player, this is not a useful or appropriate Actor to use in Sequencer, as it does not include the player mesh or object being spawned.

Because of this, you should instead create a proxy (substitute) Actor to animate with instead. One way this can be done is by creating a spawnable reference of the player **Character Blueprint**. To do this, navigate in the **Content Browser** to the Character Blueprint Asset and drag it into Sequencer.

This creates a spawnable Actor based on the player Character Blueprint in your Sequence. It is a temporary Sequencer-only character, which can be useful to not pollute your level with proxy references.

You can now animate and create content on this proxy character in your cinematic sequence.

## Rebind Proxy to Actual Player

Once your content is ready, the proxy character must be replaced with the actual player before the sequence plays.

### Create Player Tag

To make finding the proxy character to replace easier, assign a Tag (-> cinematic-tags-and-groups-in-unreal-engine) to the character track. To do this, right-click the track and select **Tags**, then type a tag name in the **Add Tag** menu and press **Enter**. This creates a tag on the character track.

### Blueprint Setup

Next, open your Level Blueprint by clicking **Level Blueprint** in the **Level Toolbar** and selecting **Open Level Blueprint**.

Reference your sequence in Blueprints by selecting the** Level Sequence Actor** in your level, then right-click in the **Event Graph** and select **Create a Reference to Level Sequence**.

Create the following logic:

- Create a **Get Player Pawn** node, which gets the current actual player during runtime. This is the actor that replaces your proxy character.

- Drag off the Level Sequence reference and create a **Set Binding by Tag** node, which is used to change the binding of an object or Actor on a track by tag name. On this node, do the following: Connect your **Level Sequence** reference to **Target**.

- Set **Binding Tag **to the tag name you created earlier on the proxy character track.

- Connect **Get Player Pawn** to **Actors**.

- Ensure **Allow Bindings from Asset** is **disabled**. If **enabled**, the proxy actor remains and won't be overridden, resulting in both the player pawn and the proxy actor bound to the track.

- After binding, **Play **the sequence.

## Results

When executing this logic, you should see the player correctly animating in your cinematic sequence.

- sequencer
- proxy player

On this page

- Prerequisites (-> how-to-reference-the-player-in-unreal-engine-cinematics)
- Reference a Proxy Player (-> how-to-reference-the-player-in-unreal-engine-cinematics)
- Rebind Proxy to Actual Player (-> how-to-reference-the-player-in-unreal-engine-cinematics)
- Create Player Tag (-> how-to-reference-the-player-in-unreal-engine-cinematics)
- Blueprint Setup (-> how-to-reference-the-player-in-unreal-engine-cinematics)
- Results (-> how-to-reference-the-player-in-unreal-engine-cinematics)
