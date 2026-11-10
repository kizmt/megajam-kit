# Retarget Manager

https://dev.epicgames.com/documentation/en-us/unreal-engine/retarget-manager-in-unreal-engine?application_version=5.9

> Breaks down the Retarget Manager options within the Skeleton Editor.

[image: Retarget Manager]

The **Retarget Manager** within the **Skeleton Editor** can be used to manage your retarget sources, set up rigs and define retargeted base poses for use with Animation Retargeting (-> using-retargeted-animations-in-unreal-engine).

## Manage Retarget Source

Since retargeting uses a **Skeleton** (-> skeletons-in-unreal-engine) asset and the Skeleton has its original proportions defined by the Skeletal Mesh for which it was initially created, it follows that one-directional retargeting will work smoothly in most cases. However, there will often come times when you will have special animations that are built just for the variant versions. For example, suppose you have multiple characters that share the same Skeleton asset (a base character, a short character, and a tall character) and you have a special animation that was created just for the tall version of the character.

If you imported this new tall-only animation in, you would still need to use the same Skeleton asset as before, which was created from the base version of the character. This will cause the new animation's proportions to be distorted. The solution is to use the **Manage Retarget Source** option within the **Retarget Manager** which allows you to associate an Animation Sequence with the actual Skeletal Mesh for which it was designed. In this way, any problems of retargeting for special animations will be fixed.

### Adding Retarget Sources

- Inside the **Skeleton Editor**, from the **Toolbar** click the **Retarget Source Manager** button.

- Click the **Add New Retarget Source** button.

- Choose the **Skeletal Mesh** for which the special animation was created. You will now see that Skeletal Mesh listed in the **Retarget Manager**.

- Open the special case **Animation Sequence** intended for your specific **Skeletal Mesh**.

- In the **Asset Details** panel, locate the **Animation** category and locate the **Retarget Source** property and choose your **Skeletal Mesh** from the drop-down menu. By choosing this mesh, you are specifying that you want to use the proportions of that mesh to drive this animation.

## Set up Rig

The middle section of the Retarget Manager allows you assign a **Rig** to the Skeleton which can be used to pass animation data to a different Skeleton that uses the same Rig.

 [image: Set up Rig-1.png]

This process is needed in order to perform any animation retargeting for characters that use different Skeleton assets.

You can select the Rig to use from the **Select Rig** drop-down option where a **Humanoid** option is available which you will want to select for most characters.

Once you assign the Humanoid Rig, you will need to assign Bones from the Skeleton that correspond to the same (or similar) location as the Node on the Rig. You can use the drop-down menu for Node and manually assign the corresponding Bone from your Skeleton, or you can use the **Auto Mapping** feature located at the top of the menu. This will look through your Skeleton and attempt to find the best matching Bone for each Node on the Rig.

If you are working with non-biped characters, or have a hierarchy that is not compatible with the Humanoid Rig asset then you can create your own Rig asset by right-clicking on your Skeleton in the Content Browser and selecting **Create > Create Rig**.

The **Clear Mapping** button will wipe all the currently assigned Bones from their corresponding Node assignment. You can also use the **Save** and **Load** buttons to save the current mapping assignment or load a previously saved mapping assignment from a **Node Mapping Container** asset (shown below).

The **Show Advanced** button will allow you to assign additional Node/Bone correlations for things like finger digits, IK Bones or Twist Bones. Once you set up the Rig for your source Skeleton (or the Skeleton asset that drives the animation that you want to retarget to another character), you will need to go into the Skeleton of the target Skeleton and assign the same Rig and define the Bones in the new Skeleton that best match up with the Nodes on the Rig.

Please see Using Retargeted Animations (-> using-retargeted-animations-in-unreal-engine) for a step-by-step guide on how to retarget animations between characters that use different Skeletons.

## Manage Retarget Base Pose

There may be instances where you want to retarget animations to a Skeleton that is not quite using the same base pose as your Source Skeleton.

Take for example the Skeleton in the image below on the right when attempting to retarget an animation:

Our Source Skeleton (left) is in a A-Pose while our Target Skeleton is using an T-Pose. If we were to retarget animations as is now, we may encounter issues:

Above we have our target animation on the left of a character holding a shotgun, however, when we retarget the animation to our new character on the right (because they are using different base poses) the arm positioning is not correct. We can fix this by Retargeting the Base Pose inside the **Retarget Manager** which allows us to define a Retargeted Base Pose to use for animation retargeting purposes rather than using the characters normal Base Pose.

We can select bones in our character and rotate them (in this case the left and right shoulders) so that our character is in an A-Pose, then we click **Modify Pose**:

In context menu, select **Use Current Pose**:

This will set the pose you define as the Retargeted Base Pose to use when performing any animation retargeting.

Now when we go to retarget an animation, we will see the updated Retargeted Base Pose:

When we retarget animations for Skeletons that have more similar Base Poses, we get better-looking results:

### Importing Retarget Base Pose from Pose Asset

From the **Modify** context menu, you can also choose to import a pose from an animation **Pose Asset** (-> animation-pose-assets-in-unreal-engine) to use as the Retargeted Base Pose.

In the image above, after selecting which Pose Asset to use (1) the available poses will be displayed in the selection drop-down menu (2). After selecting a pose from the Pose Asset to use, clicking the **Import** button (3) will update the mesh in the viewport to use the pose selected as the Retargeted Base Pose. Below (left) our default pose is shown and (right) our Retargeted Base Pose selected from a pose within our Pose Asset is shown.

- animation
- skeleton
- retargeting

On this page

- Manage Retarget Source (-> retarget-manager-in-unreal-engine)
- Adding Retarget Sources (-> retarget-manager-in-unreal-engine)
- Set up Rig (-> retarget-manager-in-unreal-engine)
- Manage Retarget Base Pose (-> retarget-manager-in-unreal-engine)
- Importing Retarget Base Pose from Pose Asset (-> retarget-manager-in-unreal-engine)
