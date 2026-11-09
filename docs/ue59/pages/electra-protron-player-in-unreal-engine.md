# Electra Protron Player

https://dev.epicgames.com/documentation/en-us/unreal-engine/electra-protron-player-in-unreal-engine?application_version=5.9

> An overview of the Electra Protron player.

[image: Electra Protron in action]

**Electra Protron** is a version of the Electra player optimized for local filesystems and container based media. It is meant to help you achieve smooth in-editor scrubbing, looping, and seeking performance, not only in-editor but also for live video performance. For best scrubbing performance, use the Apple Pro Res codec.

## Enabling Electra Protron in the Editor

In the **Project Settings**, you can find a new section called **Electra Protron Factory**. This provides a way for you to override the default player to pick Protron as preferred player over Electra for the following cases:

- In-Editor: Protron only gets picked while in editor.
- In-Game: Protron also gets picked while in Standalone or Packaged modes.

[image: Electra Protron Factory in the Project Settings]

## Enabling Protron Player in File Media Source Assets

The Protron player is part of the Electra plugin so there are no other prerequisites for enabling it. By default, UE uses the Electra player instead of the Protron player. If you do not want to use the Project Settings override, you can still use the Protron player directly with any File Media Source asset you want. Proceed as follows:

- Open the asset in the editor.
- In the **Details **panel under **Platforms**, open the menu for **Windows**, then select **Electra Protron**.

Any further playback request for the asset, for example from the Media Plate actor, the Media Track in Sequencer, or the Media Viewer, now uses Protron Player.

[image: Electra Protron in the Details panel of a File Media Source asset]

## Verifying Protron

To ensure UE uses Protron when appropriate, you can verify the player in-use in various areas where the engine plays media assets.

### File Media Source

You can verify Protron is used when playing a File Media Source asset. When you open and play the media asset, you can see the current active Player name displayed under Media Details during playback.

[image: Electra Protron in the File Media Source asset Media Details]

### Media Plate Actor

The same Media Details section is also available in the Details panel of the Media Plate Actor.

[image: Electra Protron in the Media Plate actor Details panel]

### Sequencer

The Sequencer Media sections display Player and Media information during playback.

[image: Electra Protron in Sequencer]

### Media Viewer

The Media Viewer plugin supports video playback, and displays Player and Media information as an overlay during playback.

[image: Electra Protron in the Media Viewer]

On this page

- Enabling Electra Protron in the Editor (-> electra-protron-player-in-unreal-engine)
- Enabling Protron Player in File Media Source Assets (-> electra-protron-player-in-unreal-engine)
- Verifying Protron (-> electra-protron-player-in-unreal-engine)
- File Media Source (-> electra-protron-player-in-unreal-engine)
- Media Plate Actor (-> electra-protron-player-in-unreal-engine)
- Sequencer (-> electra-protron-player-in-unreal-engine)
- Media Viewer (-> electra-protron-player-in-unreal-engine)
