# Behavior Tree Node Reference: Decorators

https://dev.epicgames.com/documentation/en-us/unreal-engine/unreal-engine-behavior-tree-node-reference-decorators?application_version=5.9

> Reference information for the Behavior Tree Decorator nodes.

[image: Behavior Tree Node Reference: Decorators]

**Decorator**, also known as conditionals in other Behavior Tree systems, are attached to either a Composite (-> unreal-engine-behavior-tree-node-reference-composites) or a Task (-> unreal-engine-behavior-tree-node-reference-tasks) node and define whether or not a branch in the tree, or even a single node, can be executed.

## Blackboard

 [image: Decorator also known as conditionals in other Behavior Tree systems are attached to either a Composite or a Task node]

The **Blackboard** node will check to see if a value is set on the given **Blackboard Key**.

| Property | Description |
| --- | --- |
| **Notify Observer** | **On Result Change**: Reevaluate only when the condition has changed. **On Value Change**: Reevaluate only when the observed Blackboard Key changes. |
| **Observer Aborts** | **None**: Do not abort anything. **Self**: Abort self and any subtrees running under this node. **Lower Priority**: Abort any nodes to the right of this node. **Both**: Abort self, any subtrees running under this node, and any nodes to the right of this node. |
| **Blackboard Key** | The Blackboard Key the Decorator will work on. |
| **Key Query** | **Is Set**: Is the value set? **Is Not Set**: Is the value not set? |
| **Node Name** | The name the node should display in the Behavior Tree graph. |

## Check Gameplay Tag Condition

 [image: Gameplay Tag Condition]

| Property | Description |
| --- | --- |
| **Actor to Check** | The Blackboard Key that contains the reference to the Actor to check. |
| **Tags to Match** | Should the Decorator match **Any** or **All** of the Tags listed in the property **Gameplay Tags**. |
| **Gameplay Tags** | Loads the **Gameplay Tag** editor to select the tags that should be used in this Decorator. |
| **Inverse Condition** | If the result of this Decorator be inversed where false becomes true and true becomes false. |
| **Node Name** | The name the node should display in the Behavior Tree graph. |

## Compare BBEntries

 [image: The Compare BBEntries node will compare the values of two Blackboard Keys and will block or allow the execution of a node]

The **Compare BBEntries** (Blackboard Entries) node will compare the values of two **Blackboard Keys** and will block or allow the execution of a node based on if the result is equal to or not equal to.

| Property | Description |
| --- | --- |
| **Observer Aborts** | **None**: Do not abort anything. **Self**: Abort self and any subtrees running under this node. **Lower Priority**: Abort any nodes to the right of this node. **Both**: Abort self, any subtrees running under this node, and any nodes to the right of this node. |
| **Operator** | **Is Equal To**: Are the two Keys equal to each other? **Is Not Equal To**: Are the two Keys different from each other? |
| **Blackboard Key A** | The first Key to use in this comparison. |
| **Blackboard Key B** | The second Key to use in this comparison. |
| **Node Name** | The name the node should display in the Behavior Tree graph. |

## Composite

 [image: The Composite Decorator node enables you to set up more advanced logic]

The **Composite Decorator** node enables you to set up more advanced logic than the built-in nodes but not as complex as a full Blueprint. Once you have added a Composite Decorator to a node, double-click the Composite Decorator to bring up the Composite's Graph. By right-clicking in the graph area you can add Decorator nodes as standalone nodes, then wire them together through **AND** nodes, **OR** nodes, and **NOT** nodes, to create more advanced logic:

Click image for full view.

| Property | Description |
| --- | --- |
| **Composite Name** | The name the node should display in the Behavior Tree graph. |
| **Show Operations** | This will cause the operations to be listed on the node in plain text. |

Using a Composite Decorator in this manner will impact memory and performance. It is possible to create a Decorator in C++ that will do the same custom behavior but in a more efficient way.

## Conditional Loop

As long as the **Key Query** condition is met, this Decorator will have the node it's attached to the loop.

 [image: Decorator will have the node it's attached to loop]

| Property | Description |
| --- | --- |
| **Blackboard Key** | The Blackboard Key the Decorator will work on. |
| **Key Query** | **Is Set**: Is the value set? **Is Not Set**: Is the value not set? |
| **Node Name** | The name the node should display in the Behavior Tree graph. |

## Cone Check

 [image: The Cone Check Decorator takes in three Vector Keys]

The **Cone Check** Decorator takes in three Vector Keys: the first for the location to start the cone, the second to define the direction the cone points, and the third for the location to check if it is inside the cone. You define the angle of the cone by using the **Cone Half Angle** property.

| Property | Description |
| --- | --- |
| **Observer Aborts** | **None**: Do not abort anything. **Self**: Abort self and any subtrees running under this node. **Lower Priority**: Abort any nodes to the right of this node. **Both**: Abort self, any subtrees running under this node, and any nodes to the right of this node. |
| **Cone Half Angle** | The half angle of the cone. For example, for a 90-degree cone, this value should be set to 45 degrees. |
| **Cone Origin** | The location where the cone should start (the tip of the cone). |
| **Cone Direction** | The direction in which the mouth of the cone should point. |
| **Observed** | The location or Actor that is being checked to see if it is in the cone. |
| **Inverse Condition** | If the result of this Decorator is inversed where false becomes true and true becomes false. |
| **Node Name** | The name the node should display in the Behavior Tree graph. |

## Cooldown

 [image: The Cooldown node will lock the execution of a node or branch]

The **Cooldown** node will lock the execution of a node or branch until the cooldown time expires.

| Property | Description |
| --- | --- |
| **Observer Aborts** | **None**: Do not abort anything. **Self**: Abort self and any subtrees running under this node. **Lower Priority**: Abort any nodes to the right of this node. **Both**: Abort self, any subtrees running under this node, and any nodes to the right of this node. |
| **Cooldown time** | The time, in seconds, the Cooldown Decorator should lock the execution of this node. |
| **Node Name** | The name the node should display in the Behavior Tree graph. |

## Custom Decorators

 [image: Custom Decorator]

You can create new **Decorators **with your own custom Blueprint logic and (or) parameters by clicking the **New Decorator **button.

 [image: You can create new Decorators by clicking the New Decorator button ]

The following parameters will also be included with your custom logic.

| Property | Description |
| --- | --- |
| **Observer Aborts** | **None**: Do not abort anything. **Self**: Abort self and any subtrees running under this node. **Lower Priority**: Abort any nodes to the right of this node. **Both**: Abort self, any subtrees running under this node, and any nodes to the right of this node. |
| **Show Property Details** | Show detailed information about properties on the node. |
| **Node Name** | The name the node should display in the Behavior Tree graph. |
| **Inverse Condition** | If the result of this Decorator is inversed where false becomes true and true becomes false. |

## Does Path Exist

 [image: The Does Path Exist node checks to see if a path can be made from the two vectors]

The **Does Path Exist** node checks to see if a path can be made from the two vectors: Blackboard Key A and Blackboard Key B.

| Property | Description |
| --- | --- |
| **Observer Aborts** | **None**: Do not abort anything. **Self**: Abort self and any subtrees running under this node. **Lower Priority**: Abort any nodes to the right of this node. **Both**: Abort self, any subtrees running under this node, and any nodes to the right of this node. |
| **Blackboard Key A** | The first location in the path. |
| **Blackboard Key B** | The second location in the path. |
| **Path Query Type** | **NavMesh Raycast 2D**: Really Fast **Hierarchical Query**: Fast **Regular Path Finding**: Slow |
| **Inverse Condition** | If the result of this Decorator is inversed where false becomes true and true becomes false. |
| **Filter Class** | Which navigation data should be used? If set to **None** the default navigation data will be used. |
| **Node Name** | The name the node should display in the Behavior Tree graph. |

## Force Success

 [image: The Force Success Decorator changes the node result to a success]

The **Force Success** Decorator changes the node result to success.

| Property | Description |
| --- | --- |
| **Node Name** | The name the node should display in the Behavior Tree graph. |

## Is At Location

 [image: The Is At Location Decorator node checks if the AI controlled Pawn is at the given location]

The **Is At Location **Decorator node checks if the AI-controlled Pawn is at the given location.

| Property | Description |
| --- | --- |
| **Acceptable Radius** | The distance threshold to accept as being at location. |
| **Parametrized Acceptable Radius** | A parameter based Acceptable Radius (such as **Random Number**). |
| **Geometric Distance Type** | With **Path Finding Based Test **disabled, this enables you to set the distance type to 3D, 2D, or Z values. |
| **Use Nav Agent Goal Location** | If moving to an Actor and this Actor is a Nav Agent, then we will move to their Nav Agent Goal Location. |
| **Path Finding Based Test** | If enabled, the result will be consistent with tests done while following paths. If disabled, use **Geometric Distance **as configured with **Distance Type**. |
| **Inverse Condition** | If the result of this Decorator is inversed where false becomes true and true becomes false. |
| **Blackboard Key** | The Blackboard Key value to test against. |
| **Node Name** | The user defined-name of the node. |

## Is BBEntry Of Class

 [image: The Is BBEntry Of Class Decorator node is used to determine if the designated Blackboard Key is of a specified Class]

The **Is BBEntry Of Class **Decorator node is used to determine if the designated Blackboard Key is of a specified Class.

| Property | Description |
| --- | --- |
| **Observer Aborts** | **None**: Do not abort anything. **Self**: Abort self and any subtrees running under this node. **Lower Priority**: Abort any nodes to the right of this node. **Both**: Abort self, any subtrees running under this node, and any nodes to the right of this node. |
| **Test Class** | The Class type that is tested against the Class of the Object of the Blackboard Key property. |
| **Blackboard Key** | The Blackboard Key that is tested. |
| **Node Name** | The name the node should display in the Behavior Tree graph. |

## Keep in Cone

 [image: The Keep in Cone Decorator node that bases its condition on whether the observed position is still inside a cone]

The **Keep in Cone **Decorator node bases its condition on whether the observed position is still inside a cone. The cone's direction is calculated when the node first becomes relevant.

| Property | Description |
| --- | --- |
| **Observer Aborts** | **None**: Do not abort anything. **Self**: Abort self and any subtrees running under this node. **Lower Priority**: Abort any nodes to the right of this node. **Both**: Abort self, any subtrees running under this node, and any nodes to the right of this node. |
| **Cone Half Angle** | The half angle of the cone. For example, for a 90-degree cone, this value should be set to 45 degrees. |
| **Cone Origin** | The location where the cone should start (the tip of the cone) |
| **Observed** | The location or Actor to keep in the cone. |
| **Node Name** | The name the node should display in the Behavior Tree graph. |

## Loop

 [image: The Loop Decorator loops the node or branch]

The **Loop **Decorator loops the node or branch a number of times, or infinitely.

| Property | Description |
| --- | --- |
| **Num Loops** | The number of loops to run. |
| **Infinite Loop** | Should this loop run indefinitely? |
| **Infinite Loop Timeout Time** | Timeout value if **Infinite Loop **is enabled (a negative value will loop forever). |
| **Node Name** | The name the node should display in the Behavior Tree graph. |

## Set Tag Cooldown

 [image: A Decorator node that bases its condition on whether a cooldown timer from a Gameplay Tag has expired]

The **Set Tag Cooldown **node enables you to set a cooldown duration for a Gameplay Tag.

| Property | Description |
| --- | --- |
| **Cooldown Tag** | The GameplayTag that will be used for the Cooldown. |
| **Cooldown Duration** | How long the Cooldown is in seconds. |
| **Add to Existing Duration** | If there is an existing Cooldown on the given GameplayTag, should we add more? |
| **Node Name** | The name the node should display in the Behavior Tree graph. |

## Tag Cooldown

 [image: The Time Limit Decorator will give a branch or node a set amount of time]

A Decorator node that bases its condition on whether a cooldown timer from a Gameplay Tag has expired.

| Property | Description |
| --- | --- |
| **Observer Aborts** | **None**: Do not abort anything. **Self**: Abort self and any subtrees running under this node. **Lower Priority**: Abort any nodes to the right of this node. **Both**: Abort self, any subtrees running under this node, and any nodes to the right of this node. |
| **Cooldown Tag** | The GameplayTag that will be used for the Cooldown. |
| **Cooldown Duration** | How long the Cooldown is in seconds. |
| **Add to Existing Duration** | If there is an existing Cooldown on the given GameplayTag, should we add more? |
| **Adds/Sets Cooldown on Deactivation** | Whether or not we are adding/setting to the CooldownTag's value when the decorator deactivates. |
| **Node Name** | The name the node should display in the Behavior Tree graph. |

## Time Limit

The **Time Limit** Decorator will give a branch or node a set amount of time to finish before stopping it and failing out. The timer is reset every time the node gains focus.

| Property | Description |
| --- | --- |
| **Observer Aborts** | **None**: Do not abort anything. **Self**: Abort self and any subtrees running under this node. **Lower Priority**: Abort any nodes to the right of this node. **Both**: Abort self, any subtrees running under this node, and any nodes to the right of this node. |
| **Time Limit** | The time limit before the node fails out, in seconds. |
| **Node Name** | The name the node should display in the Behavior Tree graph. |

- ai
- behavior tree node reference

On this page

- Blackboard (-> unreal-engine-behavior-tree-node-reference-decorators)
- Check Gameplay Tag Condition (-> unreal-engine-behavior-tree-node-reference-decorators)
- Compare BBEntries (-> unreal-engine-behavior-tree-node-reference-decorators)
- Composite (-> unreal-engine-behavior-tree-node-reference-decorators)
- Conditional Loop (-> unreal-engine-behavior-tree-node-reference-decorators)
- Cone Check (-> unreal-engine-behavior-tree-node-reference-decorators)
- Cooldown (-> unreal-engine-behavior-tree-node-reference-decorators)
- Custom Decorators (-> unreal-engine-behavior-tree-node-reference-decorators)
- Does Path Exist (-> unreal-engine-behavior-tree-node-reference-decorators)
- Force Success (-> unreal-engine-behavior-tree-node-reference-decorators)
- Is At Location (-> unreal-engine-behavior-tree-node-reference-decorators)
- Is BBEntry Of Class (-> unreal-engine-behavior-tree-node-reference-decorators)
- Keep in Cone (-> unreal-engine-behavior-tree-node-reference-decorators)
- Loop (-> unreal-engine-behavior-tree-node-reference-decorators)
- Set Tag Cooldown (-> unreal-engine-behavior-tree-node-reference-decorators)
- Tag Cooldown (-> unreal-engine-behavior-tree-node-reference-decorators)
- Time Limit (-> unreal-engine-behavior-tree-node-reference-decorators)
