# Using Retargeted Animations

https://dev.epicgames.com/documentation/en-us/unreal-engine/using-retargeted-animations-in-unreal-engine?application_version=5.9

> Examples of how to set up and use Retargeted Animations for multiple characters.

[image: Using Retargeted Animations]

**Animation Retargeting** is the process of repurposing existing animations for use between multiple characters, eliminating the need to create entirely new animations as you can instead share your animation assets between characters.

There are two forms of Animation Retargeting, one in which the Skeleton of the character you wish to share animations with is using the **Same Skeleton** as the character that the animations were originally created for.
The other involves an intermediary object called a **Rig** which allows you to retarget animations from one character's Skeleton and pass that Skeleton's Bone information to a **Different Skeleton** using the Rig which both Skeleton's share.

Refer to the two links below for the type of Animation Retargeting you are looking to achieve:

## Retargeting Using the Same Skeleton

This section will show you how to set up a **Skeleton** to use retargeted animations for all biped characters that use the Skeleton.

### Steps

- Inside the **Content Browser**, open the **Skeleton** asset that is being used for each of your characters.

- In the **Skeleton Tree** window of the **Skeleton Editor**, check the **Show Retargeting Options** checkbox.

- **Right-click** on your **Root** bone in the **Skeleton Tree** and select **Recursively Set Translation Retargeting Skeleton**. This will ensure that all bones use the skeleton's static translation (we will modify certain bones for retargeting in a moment).

- Locate the **Pelvis** bone (or its equivalent bone) and click the drop-down box and select **AnimationScaled**. This will make sure that the bone sits at the right height and is still animated. Any other bone you want translation to be animated and retargeted should also use this setting.

- Find the **Root** bone, any **IK** bones, any **Weapon** bones you may be using or other marker-style bones and set them to **Animation**. By using **Animation** as the Bone Translation Retargeting Mode, the bone's translation comes from the animation data itself and is unchanged. You may have to experiment with the different methods for different bones to produce your desired results.

- Click the **Scene Setup** button in the Viewport and select a different **Preview Mesh**. Try out different animations on different **Skeletal Meshes** to ensure that your Skeleton is set up properly for each of your animations.

- Inside the Viewport, click **Show** and check **NonRetarget Animation** and under **Bone**, choose **All Hierarchy** to display all Bones.

### End Result

You should now see something similar to below on your Skeleton.

|  |  |  |
| --- | --- | --- |
|  |  |  |
| Base Character | Short Stocky Character | Tall Skinny Character |

Shown in beige above is the original Skeleton along with the current, retargeted Skeleton in white. When retargeting is applied to the characters, the differences in their proportions are taken out of the equation and animations applied play properly on each of the different characters and the original Skeleton (beige Skeleton) is depicted in the same position in both the Short and Tall Characters.

## Retargeting Using Different Skeletons

In this section, we will go through the process of retargeting animations from one character to another who both use different Skeleton assets.
We are also going to use two asset packs that are available for free via the **Marketplace** that have additional skeletons and animations in it that we can use to retarget. If you have two Skeleton assets ready to use, you can skip the note below and use your assets. If you do not, you can follow along with the steps by adding the two packs outlined in the note below.

In this example, we are using the following assets which are available for download for free from the **Marketplace**.

- The Source Skeleton we are using is the **UE4_Mannequin_Skeleton** that is included in the **Animation Starter Pack**.

- The Target Skeleton we are using is the **SK_Mannequin_Skeleton** that is included in the **Infinity Blade: Warriors** pack.

Once you have installed the packs above, you can add them to a project via the **Add to project** button in the Unreal Launcher.

### Steps

- Inside the **Content Browser** under the **Content/AnimStarterPack/UE4_Mannequin/Mesh** folder, open the **UE4_Mannequin_Skeleton** asset.

- Click the **Retarget Manager** button, then under **Set up Rig**, click the **Select Rig** dropdown and select **Select Humanoid Rig**.

- In the **Content Browser** under the **Content/InfinityBladeWarriors/Character/CompleteCharacters** folder, open the **SK_Mannequin_Skeleton** asset.

- Click the **Retarget Manager** button, then under **Set up Rig**, click the **Select Rig** dropdown and select **Select Humanoid Rig**.

- With the Rig assigned, next you will need to match up the Bones from the Target to the Nodes on the Rig. Since the Skeleton in the Infinity Blade: Warriors pack uses the same naming convention and Bone hierarchy, they are automatically detected and applied to the Rig. If your Bone naming convention differs from the Epic Skeleton, you may see "none" applied to each of the Bones in the Rig: In this case, you will need to use the **Auto Mapping** feature or manually assign each Bone from the Skeleton that best matches the Node on the Rig. When using the **Auto Mapping** feature, it is a good idea to double check which Bones were assigned to which Nodes on the Rig. Auto Mapping will try to get the best match based on Bone position and (or) Bone Naming Conventions and assign those to ones on the Rig, but they may not the ideal Bone to use in each case.

- Click the **Show Advanced** button to toggle between Advanced/Base configuration. In this section, you can assign Bones from the Skeleton that corresponds to Nodes on the Rig for digits of fingers, IK Bones or Twist/Roll Bones. Similar to the Base configuration, the Bones within Advanced may be set to "none" depending on your Skeleton which you will have to set.

- In the **Content Browser**, under **Content/AnimStarterPack**, select an animation that you want to retarget to the new Skeleton.

- **Right-click** on the animation and choose **Retarget Anim Assets -> Duplicate Anim Assets and Retarget**.

- In the **Select Skeleton** window, you should see your Skeleton in the upper portion of the window, select it and click **Retarget**. This will copy the animation to the specified folder location. You can assign a New Asset Name in this window as well. The **Target** Skeleton should have a similar Base pose as the Source to generate the best possible retargeted animation. Above, both Skeletons are in an A-Pose, however, you may have a character that is an A-Pose and one that is in a T-Pose. You can use a Retargted Base Pose (-> retarget-manager-in-unreal-engine) to fix this prior to retargeting animations.

### End Result

The new retargeted animation will be available to any Skeletal Meshes that use the Skeleton asset the animation was retargeted for.

While this example illustrates how to retarget an animation, the same **Right-click** method can be used on any animation asset and retargeting can be applied.

- animation
- animation retargeting

On this page

- Retargeting Using the Same Skeleton (-> using-retargeted-animations-in-unreal-engine)
- Steps (-> using-retargeted-animations-in-unreal-engine)
- End Result (-> using-retargeted-animations-in-unreal-engine)
- Retargeting Using Different Skeletons (-> using-retargeted-animations-in-unreal-engine)
- Steps (-> using-retargeted-animations-in-unreal-engine)
- End Result (-> using-retargeted-animations-in-unreal-engine)
