# Animation Pose Snapshot

https://dev.epicgames.com/documentation/en-us/unreal-engine/animation-pose-snapshot-in-unreal-engine?application_version=5.9

> Animation Pose Snapshots can capture a runtime Skeletal Mesh Pose inside a Blueprint and can be used for blending in or out of additional poses within an Animation Blueprint.

[image: Animation Pose Snapshot]

When animating **Skeletal Meshes**, there may be instances when you want to let physics take control of the mesh (such as a character entering a rag-doll state).
After physics has been applied, using the **Animation Pose Snapshot** feature, you can capture a Skeletal Mesh pose (storing all the Bone Transform data) within a Blueprint (-> blueprints-visual-scripting-in-unreal-engine).
You can then retrieve that informaiton inside an Animation Blueprint (-> animation-blueprints-in-unreal-engine) and use the saved pose as a source to blend from (as seen in the example video below).

Above, our character enters a rag-doll state when we press the R key and we use the **Pose Snapshot** node in our Character Blueprint (-> blueprint-class-assets-in-unreal-engine) to save off the pose of our Skeletal Mesh.
When we press the R key again, our character blends from that snapshot into and plays a "get up" Animation Montage (-> animation-montage-in-unreal-engine) before resuming the normal locomotion state.
This grants us the ability to take whatever pose the character ends up in as a result of physics and generate a smooth blend from that pose into an animation of the character getting back to their feet.

## Save Pose Snapshot

In order to save your Skeletal Mesh's pose at runtime, inside your **Character Blueprint**, you will need access to the Skeletal Mesh Component and its **Anim Instance**.
After getting the Skeletal Mesh and Anim Instance, you can call the **Save Pose Snapshot** node and enter the desired **Snapshot Name**.
You can manually enter a name into the **Snapshot Name** field or create a variable to store the name.

The name you provide as the **Snapshot Name** must also be used when attempting to retrieve the Pose Snapshot inside your **Animation Blueprint**.
Additionally, when calling Save Pose Snapshot, the snapshot is taken at the current LOD. For example, if you took the snapshot at LOD1 and then used it at LOD0, any bones not in LOD1 will use the mesh's reference pose.

## Retrieve Pose Snapshot

To retrieve a Pose Snapshot, inside the **AnimGraph** of your **Animation Blueprint**, right-click and add the **Pose Snapshot** node and enter your **Snapshot Name**.

Below is the graph used for the example of a character getting up from a rag-doll pose.

Above, we have a State Machine (-> state-machines-in-unreal-engine) called **Default** that drives our character's locomotion and uses a **Slot** node called **MySlot** that plays an Animation Montage of our character getting up.
We use the Blend Poses by bool (-> animation-blueprint-blend-nodes-in-unreal-engine) node to determine if our character has stopped moving, where if **True** we switch over to our Pose Snapshot.
If **False**, we blend from the Pose Snapshot into our slotted Animation Montage before continuing on with our normal Default State Machine.

## Snapshot Pose Function

An alternative way of using the Pose Snapshot feature is by calling the **Snapshot Pose** function within **Blueprint** to save a snapshot to a **Pose Snapshot** variable.

When using Snapshot Pose, you will need to provide a variable to save the snapshot to as shown above.

Inside your **AnimGraph** after adding the **Pose Snapshot** node, set the **Mode** to **Snapshot Pin** and check the **(As pin) Snapshot** option inside the **Details** panel.

This will expose a Pose Snapshot input pin on the node where you can pass in your desired snapshot variable.

## Additional Resource

Additional information about this feature can be seen in the following Live Training Stream.

- animation
- blueprints
- animation blending
- animation blueprint

On this page

- Save Pose Snapshot (-> animation-pose-snapshot-in-unreal-engine)
- Retrieve Pose Snapshot (-> animation-pose-snapshot-in-unreal-engine)
- Snapshot Pose Function (-> animation-pose-snapshot-in-unreal-engine)
- Additional Resource (-> animation-pose-snapshot-in-unreal-engine)

Related documents

Blueprints Visual Scripting

 [image: Blueprints Visual Scripting] (-> blueprints-visual-scripting-in-unreal-engine)
