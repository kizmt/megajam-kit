# Facial Animation Sharing

https://dev.epicgames.com/documentation/en-us/unreal-engine/facial-animation-sharing-in-unreal-engine?application_version=5.9

> Describes the method in which you can share facial animation using Pose Assets, Animation Blueprints, and Anim Curves.

[image: Facial Animation Sharing]

 [image: FacialAnimationSharing.png]

If you have multiple characters in your project that are similar and share the same Skeleton Asset, you may want to consider using curve driven animations for facial expressions. When doing so, you can share thoseanimation curves and drive them with Pose Assets to produce your desired facial expressions and even share them across multiple Skeletal Meshes.

One important caveat however is that your animation must not have any bone transform data within it. Any bone transform data, even with one mesh's reference pose, won't work for other meshes so it is important to remove bone transforms (keeping only curves) and start with each mesh's own reference pose if you want to share the curve between different meshes. This enables you to share the facial curves between different faces.

The following is an example workflow, your workflow may differ based on your assets and desired results.

## Create and Use a Master Skeleton

The first thing you will want to do is to import a base Skeletal Mesh and create a Skeleton Asset that will be considered as your Master Skeleton (which every other Skeletal Mesh that you want to share facial animations with will use). Any additional meshes that you import should have the same bone hierarchy and naming convention in order to share the Skeleton asset.

Please see the Skeleton Assets (-> skeletons-in-unreal-engine) documentation pages for more information on Skeletons.

## Create a Pose Asset

The next thing you will want to do is inside your DCC, bake out your poses to an FBX sequence and import the FBX into Unreal Engine. This will give you an Animation Sequence containing each of the curves at their min/max blend values.

Click image for full view.

Above, our imported animation sequence contains all curves and their max values at a given frame.

Once you have imported your sequence containing all your curve data, you can create a Pose Asset (-> animation-pose-assets-in-unreal-engine) from that animation sequence which can be used to translate the animation curve data into actual facial animation on the character.

You can right-click on an Animation Sequence and create a Pose Asset from it from the context menu.

Inside your Pose Asset, you will need to define the Pose Names by entering in each name manually or by copying and pasting data stored from your clipboard.

Here we have a list of all the poses identified in our 58 frame animation sequence containing our poses that we imported:

We can then apply these as the names of our poses in our Pose Asset:

You will then see these curves in the **Anim Curves **window which is stored along with the Skeleton Asset.

Click image for full view.

Every character that uses the Master Skeleton would then have access to these curves and can drive their own facial animation by the different values represented in each curve while the Pose Asset translates all of the curve data to the actual animation pose the character takes.

Above, we changed the default value of the jaw_open_pose from 0 to 1 resulting in the character opening its mouth.

When entering your Pose Names inside the Pose Asset, it is generally a good idea to delete unused curves from the **Anim Curves **window to minimize the amount of unused curves from being displayed.

Below in our Pose Asset we can see all of our Pose Names which are also displayed in the Anim Curves window:

When we change **Pose_0** to **l_eye**, **Pose_0** remains as a curve in the Anim Curves which we can delete by right-clicking on it and selecting **Delete Curve.**

## Establish Parent/Child Animation Blueprints

Once you have a Pose Asset, you'll want to create an **Animation Blueprint** for your character that utilizes a curve driven animation, and finally, a **Pose Asset** node (assigning your Pose Asset) to correctly translate the curve data into poses the character can use.

Click image for full view.

If you plug the curve driven animation directly into the Final Animation Pose, the Animation Pose will not now how to translate the curves into pose data. This is where the Pose Asset node comes in and intercepts the animation, properly translating the curves into actual pose data that the character can use.

When you have additional characters, if you create and assign them Child Animation Blueprints from this Master Animation Blueprint, you can override the Pose Asset with unique Pose Asset data for each character. This allows for the character specific deltas to be achieved, ensuring that a scream for example looks correct on varying proportions.

Click image for full view.

Above we have an additional character that is using a Child Animation Blueprint based on our Master.

Inside our Child AnimBP, we have overridden the Pose Asset to use one that is specific to this character, enabling us to use the deltas to drive facial poses specific to this character and the animation that is played comes from our parent.

## Bringing In Animations

When you start to bring in facial animations for your characters, typically you'll want some body animation that is driven by bones in the character in addition to the curve driven facial animation. In order to share body animations but drive facial animations through curves, you will need to remove any Bone Tracks from the facial animation leaving only curves or use an Animation Modifier to remove specified Bone Tracks and drive curves for the face.

How would this work? For example, take the Animation Sequence below:

 [image: BringInAnimation_01.png]

Our Animation Sequence contains all the curves and keyed values for those curves representing varying facial poses. The problem however is that the curves would also be playing on top of any bone driven animations which would result in double transforms and incorrect results. In this case you would want to remove those Bone Transforms, leaving only the curves.

You can Remove All Bone Tracks from the Asset menu under animation:

You can also use Animation Modifiers to remove certain bones only if you want to share body animations but drive curves for the face. Typically you'll want to have a bone driven body animation, but curve driven facial animations in which case we opted to use an Animation Modifier.

Here the Animation Sequence and specified Bone Track to remove (include its children) are finalized when the modifier is applied.

You can create an Animation Modifier by creating a Blueprint with the Parent Class (-> creating-blueprint-classes-in-unreal-engine) set to Animation Modifier.

On any animation that your import, you can go into the Animation Modifiers section and then apply the Animation Modifier that you have created to remove Bone Transforms.

After adding the Animation Modifier, you can then click to Apply the modifier.

With only the curves remaining, you can run the animation through a Pose Asset inside your Animation Blueprint to give you the curve driven pose that can be shared. Below, we connect our curve driven animation directly up to the Final Animation Pose, however the pose is not used as it does not know how to handle the curves. We then connect it to the Pose Asset to drive those curves which results in the character performing our facial expressions.

Each of our characters since they are using a Child Animation Blueprint and their own assigned Pose Asset can now share the facial animation using their relative deltas. Since we do not have bone transforms and the animation is purely driven by curves, we are not seeing double transforms and can blend this with any additional bone driven animation data (such as full body animation).

- animation
- pose asset
- facial animation

On this page

- Create and Use a Master Skeleton (-> facial-animation-sharing-in-unreal-engine)
- Create a Pose Asset (-> facial-animation-sharing-in-unreal-engine)
- Establish Parent/Child Animation Blueprints (-> facial-animation-sharing-in-unreal-engine)
- Bringing In Animations (-> facial-animation-sharing-in-unreal-engine)
