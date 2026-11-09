# Pose Blender

https://dev.epicgames.com/documentation/en-us/unreal-engine/pose-blender-in-unreal-engine?application_version=5.9

> How to playback Pose Asset curves using the Pose Blender and Pose by Name Animation Blueprint nodes.

[image: Pose Blender]

After creating an Animation Pose Asset (-> animation-pose-assets-in-unreal-engine), you can use the Pose Blender (-> pose-blender-in-unreal-engine) and Pose by Name (-> pose-blender-in-unreal-engine) animation blueprint (-> animation-blueprints-in-unreal-engine) nodes to animate characters with pose assets.

## Pose Blender

**Pose Blender** nodes are Animation Blueprint (-> animation-blueprints-in-unreal-engine) nodes that are automatically created by dragging a **pose asset** into the **AnimGraph**.

 [image: pose blender node animation blueprint node]

Pose Blender nodes are used to play the associated **pose asset** on the skeletal mesh (-> skeletal-mesh-assets-in-unreal-engine) at runtime.

Pose Blender nodes will not display an **output pose** without any method of driving the contained **animation curves**. You will need to use an Animation Blueprint node to drive the curve data of the pose node to generate an output pose.

 [image: source pose was visible but ignored no pose output without animation curve driving method]

Here is an example of an animation sequence (-> animation-sequences-in-unreal-engine), that contains authored animation curves, driving the pose assets curves, to animate the face.

|  |  |
| --- | --- |
| [image: animation curves in animation sequence asset] | [image: pose blender demo using animation sequence curves to drive anim curve] |
| Animation Sequence Curves | Pose Asset playback using animation sequence curves and Pose Blender node |

While nodes like the animation sequence players, can be used to drive animation curves found within the pose asset, you can also drive these curves with an curve asset (-> animation-curves-in-unreal-engine). You can set a custom curve, to drive the pose asset, in the **Custom Curve** property, in the **Pose Blender** node's **Details** panel.

 [image: custom curve property in the pose blender nodes detail panel]

## Pose by Name

When working with a pose asset that contains multiple skeletal mesh (-> skeletal-mesh-assets-in-unreal-engine) poses, stored as unique animation curves, you can use the Pose by Name Animation Blueprint (-> animation-blueprints-in-unreal-engine) node to selectively playback poses by using their name.

 [image: pose by name animation blueprint node]

To create a Pose by Name node, you must right click a Pose Blender node in the AnimGraph and select, **Create Pose by Name Node** from the context menu.

 [image: convert a pose blender node to a pose by name animation blueprint node]

Here a Pose by Name node is outputting a single pose from within a pose asset that was generated using a run animation, with each frame of animation having its own animation curve assigned, `Frame 25` being the desired pose's name.

 [image: pose by name animation blueprint node demo]

When using the Pose by Name node, you can control the weight of the specified pose using the **Alpha Property**. Here a simple wave value is adjusting the alpha value to drive the weight of the pose.

|  |  |
| --- | --- |
| [image: aniamtion blueprint driving pose alpha] | [image: alpha value demo] |
| Animation Blueprint | Result |

If you are using a Pose Asset that has been enabled as **Additive**, you will need to use the **Apply Additive** node to correctly display your desired pose.

 [image: apply additive node when pose asset is additive]

- animation
- animation blending
- animation blueprint
- pose assets

On this page

- Pose Blender (-> pose-blender-in-unreal-engine)
- Pose by Name (-> pose-blender-in-unreal-engine)
