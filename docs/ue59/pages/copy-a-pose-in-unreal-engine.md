# Copy a Pose from another Skeletal Mesh

https://dev.epicgames.com/documentation/en-us/unreal-engine/copy-a-pose-in-unreal-engine?application_version=5.9

> Shows how you can copy the pose from one Skeletal Mesh to another Skeletal Mesh using the Copy Pose From Mesh Animation Blueprint node.

[image: Copy a Pose from another Skeletal Mesh]

When working with animated characters, there may be times when you want to apply the same animation data to an entirely different character. Using the **Copy Pose From Mesh** Animation Blueprint node and a little bit of Blueprint Visual Scripting, you can reference a Skeletal Mesh Component and copy whatever pose is being used to another Animation Blueprint for a different Skeletal Mesh.

In this how-to, we use the Copy Pose From Mesh node to copy the player's animations onto another Skeletal Mesh.

## Steps

- In the **Content/ThirdPersonBP/Blueprints** folder, duplicate the **ThirdPersonCharacter** Blueprint using the default name.

- In the **Content/Mannequin/Character/Mesh** folder, right-click the **SK_Mannequin** and under **Create**, select **Anim Blueprint** and use the default naming convention.

- Open the **ThirdPersonCharacter1** Blueprint from Step 1 and delete all the nodes in the **Event Graph**.

- Select the **Mesh** in the **Components** window, and then in the **Details** panel, set the **Anim Class** to **UE4_Mannequin_Skeleton_AnimBlueprint**.

- Open the **UE4_Mannequin_Skeleton_AnimBlueprint**, and in the **Anim Graph**, add the **Copy Pose From Mesh** node and connect it to the **Final Animation Pose**, then promote the **Source Mesh Component** to a variable called **Character Reference**. The Character Reference variable will refer to the Skeletal Mesh Component of the character we specify.

- Inside **ThirdPersonCharacter1** Blueprint, create a variable called **Character Reference** and set the **Variable Type** to **Third Person Character**, then enable **Instance Editable**.

- Drag the **ThirdPersonCharacter1** Blueprint into the level, then in its **Details** panel, assign the **ThirdPersonCharacter** from the level as the **Character Reference** variable. By assigning the value here, we will have a reference to the character whose Skeletal Mesh Component we want to copy (in this case, the Player).

- Open the **UE4_Mannequin_Skeleton_AnimBlueprint** and on the **Event Graph** use a **Try Get Pawn Owner** node to **Cast to ThirdPersonCharacter1**, then off the **As Third Person Character 1** pin, get the **Character Reference** variable.

- Off the **Character Reference** node, add the **Get Mesh** node and set the **Character Reference** variable inside the Animation Blueprint. The Skeletal Mesh from the Player will now be copied and assigned to the Character Reference inside this Animation Blueprint, driving the character's pose.

- From the Main Toolbar, **Play** in the Editor.

## End Result

When you play in the Editor, the non-playable character will play the same animations as your player character.

As you move around, the other character in the level will copy your animation pose even though that character has no logic or State Machine driving the different poses. While this example copies the player, it is possible to set up a non-playable character (NPC) with AI and a State Machine driving animations, then have another NPC that has no logic copy the pose through the Copy Pose From Mesh node to mimic the same behavior and logic.

When using the Copy Pose From Mesh node, in the **Details** panel, you can enable **Use Attached Parent** which will look for an attached parent and use it as the source if the Source Mesh Component is not valid.

Also, you can **Copy Curves** in addition to Bone Transforms, which will copy the curves that exist in the current Skeleton. If the curve list has changed, it will require the animation system to be reinitialized.

- animation
- animation blueprint
- copy pose

On this page

- Steps (-> copy-a-pose-in-unreal-engine)
- End Result (-> copy-a-pose-in-unreal-engine)
