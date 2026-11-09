# Behavior Tree Node Reference: Tasks

https://dev.epicgames.com/documentation/en-us/unreal-engine/unreal-engine-behavior-tree-node-reference-tasks?application_version=5.9

> Reference for the Behavior Tree Task nodes.

[image: Behavior Tree Node Reference: Tasks]

This is a reference page for the **Task** nodes available in the Behavior Tree Editor. Tasks are nodes that "do" things, like move an AI, or adjust Blackboard values. They can have Decorators (-> unreal-engine-behavior-tree-node-reference-decorators) or Services (-> unreal-engine-behavior-tree-node-reference-services) attached to them.

## Finish With Result

 [image: The Finish With Result Task node can be used to instantly finish with a given result]

The **Finish With Result** Task node can be used to instantly finish with a given result. This node can be used to force a branch to exit or continue based on the defined result.

| Property | Description |
| --- | --- |
| **Result** | **Succeeded**: Finishes with success. **Failed**: Finishes with failure. **Aborted**: Finishes and aborts. **In Progress**: Finishes as in-progress. |
| **Ignore Restart Self** | If enabled, Task search will be discarded when this Task is selected to execute but is already running. |
| **Node Name** | The name the node should display in the Behavior Tree graph. |

## Make Noise

 [image: Make Noise Task will cause the Pawn to produce a noise]

If the controlled Pawn has the **PawnNoiseEmitter** Component, the **Make Noise** Task will cause the Pawn to "produce a noise" (send a message) that other Pawns with the **PawnSensing** Component can hear (receive the message).

| Property | Description |
| --- | --- |
| **Loudness** | How loud the generated sound is. |
| **Ignore Restart Self** | If enabled, Task search will be discarded when this Task is selected to execute but is already running. |
| **Node Name** | The name the node should display in the Behavior Tree graph. |

## Move Directly Toward

 [image: The Move Directly Toward Task node moves the AI Pawn toward the specified Actor or Location Vector Blackboard entry in a straight line]

The **Move Directly Toward** Task node moves the AI Pawn toward the specified Actor or Location (Vector) Blackboard entry in a straight line, without regard to any navigation system. If you need the AI to navigate, use the **Move To** Task node instead.

| Property | Description |
| --- | --- |
| **Acceptable Radius** | How close does the Pawn have to be to the target for the Task to succeed. |
| **Filter Class** | Which navigation data should be used? If set to **None** the default navigation data will be used. |
| **Allow Strafe** | Whether to enable the AI's ability to strafe while moving towards the destination. |
| **Reach Test Includes Agent Radius** | If enabled, the radius of the AI's capsule will be added to the threshold between the AI and the goal location. |
| ****Reach Test Includes Goal Radius**** | If enabled, the radius of the goal's capsule will be added to the threshold between the AI and the goal location. |
| **Allow Partial Path** | If enabled, allow the AI to use an incomplete path when the goal cannot be reached. |
| **Track Moving Goal** | If enabled, the path to the goal Actor will update itself when the Actor moves. |
| **Project Goal Location** | If enabled, the goal location will be projected on the Nav Mesh before using. |
| **Observe Blackboard Value** | If the move goal in Blackboard changes, the move will be redirected to the new location. |
| **Blackboard Key** | The Key to check. This is most useful for data types that can return `None` such as Objects, as other types may return their initialized values (for example 0, false, {0,0,0}). |
| **Ignore Restart Self** | If enabled, Task search will be discarded when this Task is selected to execute but is already running. |
| **Node Name** | The name the node should display in the Behavior Tree graph. |

## Move To

 [image: A Move To Task will cause a Pawn with a Character Movement component]

A **Move To** Task will cause a Pawn with a Character Movement component to move using the NavMesh to a Vector Blackboard key.

| Property | Description |
| --- | --- |
| **Acceptable Radius** | How close does the Pawn have to be to the target for the Task to succeed. |
| **Filter Class** | Which navigation data should be used? If set to **None** the default navigation data will be used. |
| **Allow Strafe** | Whether to enable the AI's ability to strafe while moving towards the destination. |
| **Reach Test Includes Agent Radius** | If enabled, the radius of the AI's capsule will be added to the threshold between the AI and the goal location. |
| **Reach Test Includes Goal Radius** | If enabled, the radius of the goal's capsule will be added to the threshold between the AI and the goal location. |
| **Allow Partial Path** | If enabled, allow the AI to use an incomplete path when the goal cannot be reached. |
| **Track Moving Goal** | If enabled, the path to the goal Actor will update itself when the Actor moves. |
| **Project Goal Location** | If enabled, the goal location will be projected on the Nav Mesh before using. |
| **Observe Blackboard Value** | If the move goal in Blackboard changes, the move will be redirected to the new location. |
| **Blackboard Key** | The Key to check. This is most useful for data types that can return `None` such as Objects, as other types may return their initialized values (for example 0, false, {0,0,0}). |
| **Ignore Restart Self** | If enabled, Task search will be discarded when this Task is selected to execute but is already running. |
| **Node Name** | The name the node should display in the Behavior Tree graph. |

## Play Animation

 [image: The Play Animation node can be used to play the specified animation asset]

The **Play Animation** node can be used to play the specified animation asset.

The animation selected must match the Skeleton of the Pawn the Behavior Tree is controlling.

| Property | Description |
| --- | --- |
| **Animation to Play** | Animation asset to play. |
| **Looping** | If enabled, the animation will continually loop playback. |
| **Non Blocking** | If enabled, the Task will trigger the animation and instantly finish. |
| **Ignore Restart Self** | If enabled, Task search will be discarded when this Task is selected to execute but is already running. |
| **Node Name** | The name the node should display in the Behavior Tree graph. |

## Play Sound

 [image: The Play Sound node will play the sound given in the Sound to Play property]

The **Play Sound** node will play the sound given in the **Sound to Play** property.

| Property | Description |
| --- | --- |
| **Sound to Play** | The Sound Cue asset to play. |
| **Ignore Restart Self** | If enabled, Task search will be discarded when this Task is selected to execute but is already running. |
| **Node Name** | The name the node should display in the Behavior Tree graph. |

## Push Pawn Action

 [image: The Push Pawn Action node enables you to push the specified action to the Pawn's Controller]

The **Push Pawn Action** node enables you to push the specified action to the Pawn's Controller.

| Property | Description |
| --- | --- |
| **Action** | The type of action to push to the Pawn's Controller. |
| **Ignore Restart Self** | If enabled, Task search will be discarded when this Task is selected to execute but is already running. |
| **Node Name** | The name the node should display in the Behavior Tree graph. |

## Rotate to face BB entry

 [image: The Rotate to face BB entry Task causes the associated Pawn to rotate towards the specified Blackboard Key]

The **Rotate to face BB entry** Task causes the associated Pawn to rotate towards the specified Blackboard Key.

The Pawn must have **Use Controller Rotation Yaw** enabled to successfully rotate.

| Property | Description |
| --- | --- |
| **Precision** | The amount in degrees to be considered as a success condition. |
| **Blackboard Key** | The Blackboard Key to get the target to turn toward. This can be either a Vector, Object, or Actor. |
| **Ignore Restart Self** | If enabled, Task search will be discarded when this Task is selected to execute but is already running. |
| **Node Name** | The name the node should display in the Behavior Tree graph. |

## Run Behavior

 [image: The Run Behavior Task enables you to run another Behavior Tree by pushing sub-trees onto the execution stack]

The **Run Behavior** Task enables you to run another Behavior Tree by pushing sub-trees onto the execution stack. One limitation to consider however is that the subtree asset cannot be changed during runtime. This limitation is caused by support for the subtree's Root-level Decorators, which are injected into the Parent tree. Also, the structure of the running tree cannot be modified at runtime.

You can use **Run Behavior Tree Dynamic** if you need a subtree that can be changed at runtime.

| Property | Description |
| --- | --- |
| **Behavior Asset** | The **Behavior Tree** asset to run. |
| **Ignore Restart Self** | If enabled, Task search will be discarded when this Task is selected to execute but is already running. |
| **Node Name** | The name the node should display in the Behavior Tree graph. |

## Run Behavior Dynamic

 [image: The Run Behavior Dynamic Task enables pushing subtrees on the execution stack]

The **Run Behavior Dynamic** Task enables pushing subtrees on the execution stack. Subtree Asset can be assigned at runtime with the **SetDynamicSubtree** function on a **Behavior Tree Component**.

This does not support a subtree's Root-level Decorator.

| Property | Description |
| --- | --- |
| **Injection Tag** | Opens the **Gameplay Tag** Editor that you can use to identify this Task for subtree injection. |
| **Default Behavior Asset** | The initial **Behavior Tree **asset to run. |
| **Ignore Restart Self** | If enabled, Task search will be discarded when this Task is selected to execute but is already running. |
| **Node Name** | The name the node should display in the Behavior Tree graph. |

## Run EQS Query

 [image: The Run EQS Query node runs the specified Environment Query System asset when the Task node is executed]

The **Run EQS Query** node runs the specified Environment Query System (EQS) (-> environment-query-system-in-unreal-engine) asset when the Task node is executed.

| Property | Description |
| --- | --- |
| **Query Template** | The EQS asset to run. |
| **Query Config** | The additional parameters to include as part of the EQS test. |
| **EQSQuery Blackboard Key** | Optional Blackboard Key storing an EQS Query Template to use instead of specifying one under the **Query Template**. |
| **Run Mode** | **Single Best Item**: Pick the first item with the best score. **Single Random Item from Best 5%**: Pick a random item with a score `95%` to `100%` of max. **Single Random Item from Best 25%**: Pick a random item with a score `75%` to `100%` of max. **All Matching**: Get all items that match conditions. |
| **Update BBOn Fail** | Updates the Blackboard when the EQS query fails. |
| **Blackboard Key** | The Blackboard Key value to update based on the EQS results. |
| **Ignore Restart Self** | If enabled, Task search will be discarded when this Task is selected to execute but is already running. |
| **Node Name** | The name the node should display in the Behavior Tree graph. |

## Set Tag Cooldown

 [image: Sets a Cooldown Tag value and is used with Cooldown Tag Decorators to prevent Behavior Tree execution]

Sets a **Cooldown Tag** value and is used with **Cooldown Tag Decorators** to prevent Behavior Tree execution.

| Property | Description |
| --- | --- |
| **Cooldown Tag** | The GameplayTag that will be used for the Cooldown. |
| **Cooldown Duration** | How long the Cooldown is in seconds. |
| **Add to Existing Duration** | If there is an existing Cooldown on the given GameplayTag, should we add more? |
| **Ignore Restart Self** | If enabled, Task search will be discarded when this Task is selected to execute but is already running. |
| **Node Name** | The name the node should display in the Behavior Tree graph. |

## Wait

 [image: The Wait Task can be used in the Behavior Tree to cause the tree to wait on this node until the specified Wait Time is complete]

The **Wait** Task can be used in the Behavior Tree to cause the tree to wait on this node until the specified **Wait Time** is complete.

| Property | Description |
| --- | --- |
| **Wait Time** | How long to wait, in seconds. |
| **Random Deviation** | Allows adding a random time (plus or minus) to the **Wait Time** property. |
| **Ignore Restart Self** | If enabled, Task search will be discarded when this Task is selected to execute but is already running. |
| **Node Name** | The name the node should display in the Behavior Tree graph. |

## Wait Blackboard Time

 [image: Works just like the Wait Task node, except it will pull a Blackboard value for how long it should wait]

Works just like the **Wait** Task node, except it will pull a Blackboard value for how long it should wait.

| Property | Description |
| --- | --- |
| **Blackboard Key** | The float Blackboard Key to reference how long to wait. |
| **Ignore Restart Self** | If enabled, Task search will be discarded when this Task is selected to execute but is already running. |
| **Node Name** | The name the node should display in the Behavior Tree graph. |

## Custom Tasks

 [image: Custom Task Creation]

You can create new **Tasks** with your custom Blueprint logic and (or) parameters by clicking the **New Task** button.

 [image: Custom Task Toolbar]

Blueprint Tasks are slower than native Tasks. If you are looking to optimize your content, switch to using native Tasks.

The following parameters will also be included with your custom logic.

| Property | Description |
| --- | --- |
| **Interval** | Defines the time span between subsequent ticks of the Task. |
| **Ignore Restart Self** | If enabled, Task search will be discarded when this Task is selected to execute but is already running. |
| **Show Property Details** | Show detailed information about properties on the node. |
| **Node Name** | The name the node should display in the Behavior Tree graph. |

- ai
- behavior tree node reference

On this page

- Finish With Result (-> unreal-engine-behavior-tree-node-reference-tasks)
- Make Noise (-> unreal-engine-behavior-tree-node-reference-tasks)
- Move Directly Toward (-> unreal-engine-behavior-tree-node-reference-tasks)
- Move To (-> unreal-engine-behavior-tree-node-reference-tasks)
- Play Animation (-> unreal-engine-behavior-tree-node-reference-tasks)
- Play Sound (-> unreal-engine-behavior-tree-node-reference-tasks)
- Push Pawn Action (-> unreal-engine-behavior-tree-node-reference-tasks)
- Rotate to face BB entry (-> unreal-engine-behavior-tree-node-reference-tasks)
- Run Behavior (-> unreal-engine-behavior-tree-node-reference-tasks)
- Run Behavior Dynamic (-> unreal-engine-behavior-tree-node-reference-tasks)
- Run EQS Query (-> unreal-engine-behavior-tree-node-reference-tasks)
- Set Tag Cooldown (-> unreal-engine-behavior-tree-node-reference-tasks)
- Wait (-> unreal-engine-behavior-tree-node-reference-tasks)
- Wait Blackboard Time (-> unreal-engine-behavior-tree-node-reference-tasks)
- Custom Tasks (-> unreal-engine-behavior-tree-node-reference-tasks)
