# Behavior Tree Node Reference: Services

https://dev.epicgames.com/documentation/en-us/unreal-engine/unreal-engine-behavior-tree-node-reference-services?application_version=5.9

> Reference information for the Behavior Tree Service nodes.

[image: Behavior Tree Node Reference: Services]

**Services** attach to Composite (-> unreal-engine-behavior-tree-node-reference-composites) or Task (-> unreal-engine-behavior-tree-node-reference-tasks) nodes and will execute at their defined frequency as long as their branch is being executed. These are often used to make checks and to update the Blackboard. These take the place of traditional Parallel nodes in other Behavior Tree systems.

## Default Focus

 [image: The Default Focus creates a shortcut to accessing an Actor in your Blueprints and Code by setting the focus of the AI Controller]

The **Default Focus** creates a shortcut to accessing an Actor in your **Blueprints** and Code by setting the focus of the AI Controller. By setting the focus of the AI Controller to an Actor, you can directly access it from the AI Controller instead of accessing a Blackboard key.

| Property | Description |
| --- | --- |
| **Blackboard Key** | This takes in an Actor Key (an Object Key with its base class set to Actor) to be quickly referenced by the AI Controller using `GetFocusActor`. |
| **Node Name** | The name the node should display in the Behavior Tree graph. |

## Run EQS

 [image: The Run EQS Service node can be used to regularly execute an Environmental Query System (EQS) template at assigned intervals and can update a specified Blackboard Key]

The **Run EQS** Service node can be used to regularly execute an Environmental Query System (EQS) (-> environment-query-system-in-unreal-engine) template at assigned intervals and can update a specified Blackboard Key.

| Property | Description |
| --- | --- |
| **Query Template** | The EQS asset to run. |
| **Query Config** | Optional array of additional parameters to include in the query. |
| **EQSQuery Blackboard Key** | Option to use a Blackboard Key that stores an EQS Query Template instead of a specified EQS Query Template. |
| **Run Mode** | **Single Best Item**: Pick the first item with the best score. **Single Random Item from Best 5%**: Pick a random item with a score `95%` to `100%` of max. **Single Random Item from Best 25%**: Pick a random item with a score `75%` to `100%` of max. **All Matching**: Get all items that match conditions. |
| **Update BBOn Fail** | Updates the Blackboard when the EQS query fails. |
| **Blackboard Key** | The Blackboard Key the Service will write results into - either an FVector or an Actor. |
| **Interval** | Defines the time span between subsequent ticks of the Service. |
| **Random Deviation** | Adds a random range value to the Service's **Interval** value. |
| **Call Tick on Search Start** | Call Tick Event when Task search enters this node (**Search Start** will be called as well). |
| **Restart Timer on Each Activation** | If set, the next Tick time will be always reset to Service's **Interval** value when the node is activated. |
| **Node Name** | The name the node should display in the Behavior Tree graph. |

## Custom Services

 [image: New Custom Service]

You can create **Services** by clicking the **New Service** button from the toolbar that contains Blueprint logic and (or) parameters.

 [image: You can create Services by clicking the New Service button from the toolbar]

Blueprint Services are less performant than C++ Services. If optimization is a concern, you may want to use native Services.

The following properties are also available when creating a Service.

| Property | Description |
| --- | --- |
| **Show Property Details** | Shows detailed information about properties when enabled. |
| **Show Event Details** | Shows detailed information about implemented Events when enabled. |
| **Node Name** | The name the node should display in the Behavior Tree graph. |
| **Interval** | Defines the time span between subsequent ticks of the Service. |
| **Random Deviation** | Adds a random range value to the Service's **Interval** value. |
| **Call Tick on Search Start** | Call Tick Event when Task search enters this node (**Search Start** will be called as well). |
| **Restart Timer on Each Activation** | If set, the next Tick time will be always reset to Service's **Interval** value when the node is activated. |

- ai
- behavior tree node reference

On this page

- Default Focus (-> unreal-engine-behavior-tree-node-reference-services)
- Run EQS (-> unreal-engine-behavior-tree-node-reference-services)
- Custom Services (-> unreal-engine-behavior-tree-node-reference-services)
