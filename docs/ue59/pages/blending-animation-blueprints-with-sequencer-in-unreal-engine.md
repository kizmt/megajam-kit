# Blending Animation Blueprints with Sequencer

https://dev.epicgames.com/documentation/en-us/unreal-engine/blending-animation-blueprints-with-sequencer-in-unreal-engine?application_version=5.9

> Describes how you can take a the pose from an Animation Blueprint and blend it with animations defined inside a Level Sequence.

[image: Blending Animation Blueprints with Sequencer]

If you want to blend an animation assigned within Sequencer with an animation defined from a Character's Animation Blueprint, you can do so using a **Slot **node and the **Weight **property of an Animation Track in Sequencer.

In this example, we take the idle pose from our Animation Blueprint and blend in a running animation defined from Sequencer.

## Steps

For this how-to guide, we are using the **Blueprint Third Person Template** project.

- In the **Content/Mannequin/Character/Mesh** folder, right-click the **SK_Mannequin** then under **Create**, select **Anim Blueprint.** Give the Animation Blueprint any name and save location.

- Inside the **Anim Blueprint**, drag in the **ThirdPersonIdle** and connect to a **Slot** node, then connect to the **Final Animation Pose** node. Notice the Slot node is given the name **DefaultSlot** by default and is the name we will refer to inside our Level Sequence later in this guide.

- Drag the **Anim Blueprint** into the Level, then from the Main Toolbar, select **Cinematics** and select **Add Level Sequence**. Give the Level Sequence any name and save location.

- Add the **Anim Blueprint** character to the Sequence, then add/loop the **ThirdPersonRun** animation to fill the Sequence.

- Expand the Animation track, then change the **Weight** value to **0.0** and add a key to the Sequence. By setting the Weight to 0.0, we are stating that we want to use no part of this Animation until we increase the Weight value.

- Add a key for **Weight** with the value **1.0** at frame **75**, and another key with a value of **0.0** at frame **150**. This will blend from 0.0 to to 1.0 (full effect of the animation) back down to 0.0.

- Right-click on the **ThirdPersonRun** track, then under **Properties**, notice the **Slot Name**, and the three **Keys** we added. Slot Name is the name referring to the Slot Node added inside the Animation Blueprint. These names must match in order for Sequencer to know which Slot you are referring to and to pass through the Weight values.

- Select the Level Sequence, then in the **Details **panel, enable **Auto Play** and set **Loop** to **Loop Indefinitely**.

- From the Main Toolbar, select to Play in the Editor.

## End Result

When you play in the Editor, the character will starting idle (which is the state inside our Animation Blueprint) and will blend to the animation we assigned (running) inside our Level Sequence, then back to idle.

While our example uses an idle animation as our Final Animation Pose, using this method you can generate an entire State Machine to produce the Final Animation Pose inside your Animation Blueprint based on any number of factors, then blend to an animation defined inside a Level Sequence.

As an example, an NPC could have some logic defined that governs what pose they are in and the player could approach that NPC triggering a cutscene where you override the animation logic with an animation defined within Sequencer.

- how-to
- sequencer

On this page

- Steps (-> blending-animation-blueprints-with-sequencer-in-unreal-engine)
- End Result (-> blending-animation-blueprints-with-sequencer-in-unreal-engine)
