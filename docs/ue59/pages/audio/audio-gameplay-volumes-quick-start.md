# Audio Gameplay Volumes Quick Start

https://dev.epicgames.com/documentation/en-us/unreal-engine/audio-gameplay-volumes-quick-start?application_version=5.9

> A quick guide on getting started with Audio Gameplay Volumes.

[image: Audio Gameplay Volumes Quick Start]

Learn to use this **Beta** feature, but use caution when shipping with it.

Using **Audio Gameplay Volumes** you can define physical regions that apply effects to sounds, relative to the listener's position.

In this guide, you'll learn how to set up a basic Audio Gameplay Volume with a **Reverb** component to simulate sound waves bouncing within the space.

## Prerequisites

- A brand new project created using the First Person Template (-> unreal-engine-templates-reference). [image: Project Template]

- The Audio Gameplay Volumes plugin is disabled by default. To enable it, open the **Plugin** panel by selecting **Edit > Plugins**, use the search bar to find the plugin, and then click the corresponding checkbox. [image: Plugin]

## 1 - Set Up the Sound Class

Audio Gameplay Volumes require **Sound Wave** assets as part of a properly set up **Sound Class** in order to function.

For more information on Sound Classes, see Sound Classes (-> sound-classes-in-unreal-engine).

- The First Person Template has a single Sound Wave asset which plays when you fire the weapon. Using the **Content Browser**, go to **Content/FPWeapon/Audio**.

- Double-click the **FirstPersonTemplateWeaponFire02** Sound Wave to open the **Sound Wave Details** panel. [image: Sound Wave in Content Browser]

- Click the dropdown for **Sound > Class**. [image: Sound Wave Details]

- Select **Sound Class** in the context menu to create a new asset. [image: Create New Sound Class]

- Enter a name for the new Sound Class and save it to your **Content** folder.

- Double-click on your new **Sound Class** to open the **Sound Class Details** panel. [image: Sound Wave Details]

- Enable **Routing > Apply Ambient Volumes** to allow sounds associated with this Sound Class to be used with Audio Gameplay Volumes.

- Input 1.0 for the **Submix > Default 2DReverb Send Amount** to send 100% of the sound in the Sound Class to the **Master Reverb Submix**. [image: Sound Class Details]

- Save the Sound Class and Sound Wave assets.

## 2 - Place the Audio Gameplay Volume

- Place an **AudioGameplayVolume** in your level by using the **Place Actors** panel or by clicking **Quick Add** in the **Level Editor Toolbar** and selecting **Volumes > AudioGameplayVolume**. [image: Place Actor]

- Position the volume in the level so that your character can move into and out of it, such as directly over the `BP_Pickup_Rifle`. [image: Volume In Level]

## 3 - Add the Reverb Component

Audio Gameplay Volume functionality is driven by components. Each volume may have any number of these components which affect the sounds that happen inside or outside of the volume, relative to the listener. For this example, add a Reverb component to your volume to make the weapon fire sound reverberate while the player is inside it.

- With the **Audio Gameplay Volume** selected, click the **Add Component** button in the **Details** panel. [image: New Volume Details]

- Select the **Reverb** component under the **Audio Gameplay Volume** section of the context menu. [image: Add Reverb Component]

- Input 1.0 for **Reverb > Volume** to increase the loudness of the effect.

- Input 0.0 for **Reverb > Fade Time** to apply the effect immediately when entering the volume. [image: Reverb Component Details]

## 4 - Set Up the Reverb Effect

The Reverb component applies its effect using a **Reverb Effect** asset, so you'll need to create one.

- With the new **Reverb** component selected, click the dropdown for **Reverb > Reverb Effect**. [image: Reverb Component Details]

- Select **Reverb Effect** in the context menu to create a new asset. [image: Create New Reverb Effect]

- Enter a name for the new Reverb Effect and save it to your **Content** folder.

- Double-click on your new **Reverb Effect** to open the **Reverb Effect Details** panel. [image: Reverb Component Details]

- Input 1.0 for **Late Reflections > Gain** to amplify the signal and make the effect easier to hear. [image: Reverb Details]

- Save the Reverb Effect asset.

## 5 - Play

- Click the **Play Level** button in the **Level Editor Toolbar**.

- Move your character into the `BP_Pickup_Rifle` to pick up the weapon.

- Left-click to fire while inside or outside of the volume and listen to the difference in the sound.

## 6 - On Your Own!

Now that you've finished creating a basic Audio Gameplay Volume, consider taking it even further.

Try adding these other Audio Gameplay Volume component types to a new or existing volume:

- **Submix Override**: Adds a **Submix Effect Chain** to a **Sound Submix**. When the listener enters the volume, this effect applies to all sounds regardless of whether they are inside or outside of the volume.

- **Submix Send**: Sends the audio to a **Sound Submix**. This effect applies to sounds inside of the volume, and can be configured to apply while the listener is either outside or inside.

- **Attenuation**: Interpolates the audio's current volume (loudness) to a target volume (loudness). You can configure the effect to apply to sounds inside of the volume while the listener is outside, or the other way around.

- **Filter**: Applies a low pass filter to the audio. You can configure the effect to apply to sounds inside of the volume while the listener is outside, or the other way around.

You will need at least one sound positioned away from the player to hear the effects of some of the component types, such as **Attenuation** and **Filter**. The First Person Template doesn't come with any sounds set up this way by default, so some additional work is required.

There are a lot of ways to do this, but for a simple option, try importing an ambient sound file as a **Sound Wave** asset and then place it either inside or outside of the volume within the level. See Importing Audio Files (-> importing-audio-files) for information on how to import audio files.

- beta
- audio
- audio gameplay volumes

On this page

- Prerequisites (-> audio-gameplay-volumes-quick-start)
- 1 - Set Up the Sound Class (-> audio-gameplay-volumes-quick-start)
- 2 - Place the Audio Gameplay Volume (-> audio-gameplay-volumes-quick-start)
- 3 - Add the Reverb Component (-> audio-gameplay-volumes-quick-start)
- 4 - Set Up the Reverb Effect (-> audio-gameplay-volumes-quick-start)
- 5 - Play (-> audio-gameplay-volumes-quick-start)
- 6 - On Your Own! (-> audio-gameplay-volumes-quick-start)
