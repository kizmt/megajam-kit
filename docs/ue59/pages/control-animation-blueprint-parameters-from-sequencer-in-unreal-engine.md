# Controlling Anim Instances with Sequencer

https://dev.epicgames.com/documentation/en-us/unreal-engine/control-animation-blueprint-parameters-from-sequencer-in-unreal-engine?application_version=5.9

> Shows how to animate variables on anim instances through possessables

[image: Controlling Anim Instances with Sequencer]

Within Sequencer, it is possible to animate variables on Anim Instances through Possessables, enabling you direct control of Anim Blueprint variables, functions and other content. By adding a Skeletal Mesh Component Track, you can gain access to the Anim Instance Track where any variables that are exposed to cinematics will be shown and available to keyframe.

In this how-to, we blend between multiple animation poses that are defined within an Animation Blueprint by keyframing those changes inside Sequencer.

## Steps

For this guide we are using a new **Blueprint Third Person** template project.

- In the **Content/Mannequin/Character/Mesh **folder, right-click the **SK_Mannequin **then select **Anim Blueprint **under **Create **and give it any name. [image: image alt text]

- Right-click in the **Content Browser** and under **Blueprints**, select **Enumeration **and call it **MoveType**. [image: image alt text]

- Create three enumerators called, **Idle, Walk **and **Run **by clicking the **New **button. [image: image alt text]

- Open the **Animation Blueprint **created in step 1 and create a variable of the **MoveType **type called **MoveType **and enable **Expose to Cinematics**. [image: image alt text]

- On the **Anim Graph**, add the **ThirdPersonIdle, ThirdPersonWalk **and **ThirdPersonRun **animations and a **Blend Poses by Move Type **node. [image: image alt text]

- Right-click on the **Blend Poses **node then add a pin for **Idle, Walk **and **Run**. [image: image alt text]

- Add the **Move Type **variable to the graph and connect each of the nodes to the **Final Animation Pose **as shown below. [image: image alt text]

- Drag the **Animation Blueprint **into the Level, then create a new **Level Sequence **(give it any name) and add the Anim Blueprint to the Sequence. [image: image alt text]

- Click the **+ Track **button on the Anim Blueprint and add an **SkeletalMeshComponent0 **track. [image: image alt text]

- Click the **+ Track **button on the SkeletalMeshComponent and add the **Anim Instance **track. [image: image alt text]

- Click the **+ Track **button on the Anim Instance and add the **Move Type **property. [image: image alt text]

- Scrub the Timeline to frame **45** and change the **Move Type **drop-down to **Walk, **adding a key. [image: image alt text]

- Scrub the Timeline to frame **90 **and change the **Move Type **drop-down to **Run**, adding another key. [image: image alt text]

- Add a key for **Move Type **at frame **120 **set to **Walk **and another key at frame **150 **set to **Idle. ** [image: image alt text]

- Set the Level Sequence to **Auto Play **in the **Details **panel, then click the **Play **or **Simulate **button to play/simulate in the Editor.

## End Result

When you Play or Simulate, the Level Sequence will play back and change the character's state based on the key framed property **Move Type **defined in the Sequence. Animating variable properties is useful in the event that you have characters that have Animation Blueprints that drive their animation logic, however you want to control what animation the character enters through a Sequence.

- sequencer

On this page

- Steps (-> control-animation-blueprint-parameters-from-sequencer-in-unreal-engine)
- End Result (-> control-animation-blueprint-parameters-from-sequencer-in-unreal-engine)
