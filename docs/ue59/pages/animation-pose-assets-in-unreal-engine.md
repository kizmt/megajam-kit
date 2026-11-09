# Animation Pose Assets

https://dev.epicgames.com/documentation/en-us/unreal-engine/animation-pose-assets-in-unreal-engine?application_version=5.9

> Describes the Animation Pose Asset which can be used to drive animation through weighted curve data.

[image: Animation Pose Assets]

In **Unreal Engine**, animation **Pose assets** are stored skeletal mesh (-> skeletal-mesh-assets-in-unreal-engine) poses that you can use in your project, as an animation target or reference point.

 [image: animation pose asset in content browser]

Pose assets save the position of the mesh geometry as well as the skeleton data. Pose assets can contain a single static pose, or many poses, saved as animation curves within the asset.

## Creating Pose Asset

There are many ways to create an animation Pose asset.

While working in the Skeleton Editor (-> skeleton-editor-in-unreal-engine), skeletal mesh editor (-> skeletal-mesh-editor-in-unreal-engine), or the animation sequence editor (-> animation-sequence-editor-in-unreal-engine), you can create a pose asset, using the **create asset** button in the animation editor (-> animation-editors-in-unreal-engine) **Toolbar** to save the current skeletal mesh position as an animation Pose asset.

 [image: create a pose asset with the create asset button in the animation editors]

You can also create an animation Pose asset from an entire animation sequence (-> animation-sequences-in-unreal-engine) by **right-clicking** the asset in the **Content Browser** and selecting **Create > Create PoseAsset** from the context menu.

 [image: create a pose asset in the content browser by right clicking and slecting create pose asset in the context menu]

After selecting **Create PoseAsset**, the Create Pose Asset window will open, where you can select which animation sequence you wish to create an animation pose asset from.

 [image: select the animation sequence to generate a pose asset]

When generating a Pose asset from an entire **animation sequence**, Unreal Engine will create a pose for each frame of animation. The generated poses will then be accessible using animation curves (-> animation-curves-in-unreal-engine) present in the Pose Asset.

You can sequentially input any desired names for the generated pose curves by typing a name on a new line for each curve or frame of animation, in the **[OPTIONAL] Pose Names** field.

 [image: name pose curves in the option pose names field]

### Additive Pose Assets

After creating and opening a Pose Asset, you can modify a pose asset, to behave as additive by toggling the **Additive** property and selecting the **Convert to Additive Pose** button in the pose asset's **Asset Details Panel**.

 [image: additive pose asset setting in the pose asset details panel]

Additive pose assets are able to play in an additive capacity, in conjunction with other animation data, such as animation sequences, without overriding the entire pose.

## Using Pose Assets

Pose assets can be used in many ways to animate characters.

### Pose Blender

You can use the **Pose Blender** and **Pose Driver** animation blueprint nodes, to control the playback and blending of animation Pose assets to animate characters at runtime.

- animation
- animation assets

On this page

- Creating Pose Asset (-> animation-pose-assets-in-unreal-engine)
- Additive Pose Assets (-> animation-pose-assets-in-unreal-engine)
- Using Pose Assets (-> animation-pose-assets-in-unreal-engine)
- Pose Blender (-> animation-pose-assets-in-unreal-engine)
