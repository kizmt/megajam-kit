# Animation Blueprint Override

https://dev.epicgames.com/documentation/en-us/unreal-engine/animation-blueprint-override-in-unreal-engine?application_version=5.9

> Illustrates how you can override animations in a child Animation Blueprint.

[image: Animation Blueprint Override]

## Overview

When setting up characters and animation for those characters, there may be instances where you want to have one character perform an animation for an action and have another character perform a different animation for the same action. By using the **Asset Override Editor** inside of a child Animation Blueprint (-> animation-blueprints-in-unreal-engine), you can override any previously set animation asset used in a Sequence Player Node allowing you to quickly create variations of Animation Blueprints that each of your characters can use.

Be aware that the only functionality that should be changed via a Child Anim Blueprint is the animation sequences. Changing other properties such as the Skeleton or introducing Animation Layers is not supported.

#### Prerequisites

- For this guide, we are using the **Blueprint Third Person** template and included the **Infinity Blade: Warriors** and **Animation Starter Pack** assets which are available for free via the Marketplace.

- We also performed some Animation Retargeting (-> using-retargeted-animations-in-unreal-engine) and retargeted the Animation Blueprint and Animations that came with the Animation Starter Pack for use with the Infinity Blade characters.

## Steps

- **Right-click** on the **Animation Blueprint** you would like to override animations for and select **Create Child Blueprint Class**.

- Open the child Animation Blueprint, then click **Window** from the **File Menu** and select **Asset Override Editor**.

- The **Asset Override Editor** will open showing the available animations which can be overridden. You can expand/collapse the display of assets by clicking the arrow next to each asset.

- In the **Asset** column, click the drop-down window and specify the new asset to use (which will override the existing when called). Clicking the eyeball icon will allow you to see a preview of the node context in the parent graph as read only in the main graph panel.

- You can view your changes after you click **Compile**.

## End Result

Below is an example where a character's default movement (assigned as Jog) in the parent Animation Blueprint is overridden so that the character performs a Walk instead.

A prime usage case for this is if you have a character that performs a certain attack when a button is pressed but you want a different character to have the same general movement but perform a different motion when the attack button is pressed.

- animation
- animation blueprint

On this page

- Overview (-> animation-blueprint-override-in-unreal-engine)
- Prerequisites (-> animation-blueprint-override-in-unreal-engine)
- Steps (-> animation-blueprint-override-in-unreal-engine)
- End Result (-> animation-blueprint-override-in-unreal-engine)
