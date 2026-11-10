# Smart Objects Overview

https://dev.epicgames.com/documentation/en-us/unreal-engine/smart-objects-in-unreal-engine---overview?application_version=5.9

> Smart Objects represent a set of activities in the level that can be used through a reservation system.

[image: Smart Objects Overview]

## Overview

**Smart Objects** are objects placed in a level that AI Agents and Players can interact with. These objects contain all the information needed for those interactions.
Smart Objects are part of a global database and use a spatial partitioning structure. This means that they can be queried at runtime by using filters such as search area around the Agent and Gameplay Tags.

At a high level, Smart Objects represent a set of activities in the level that can be used through a reservation system.

It's important to note that Smart Objects do not contain execution logic. Instead, they provide all necessary information to the interactor to be able to perform the interaction, depending on its implementation. Each interactor (Agent or Player) does its own implementation logic for a Smart Object.

## Smart Object Elements

### SmartObject Subsystem

The **SmartObject subsystem** is responsible for keeping track of all Smart Objects available in the level. Smart Objects are automatically registered with the subsystem for access and tracking.

This subsystem is automatically created in the world when the Smart Objects plugin is active.

### SmartObject Persistent Collection

The **SmartObject Persistent Collection** is a level-placed Actor that holds a list of Smart Objects that will always be part of the simulation, regardless of whether they are loaded or unloaded at runtime.

Note that it is possible to have more than one SmartObject Persistent Collection in the level, or none at all. The collection only influences the SmartObjects lifetime, not whether it will be used by the system.

### SmartObject Container

The **SmartObject Container** tracks a group of Smart Objects. Both, the Smart Object Subsystem and the Smart Object Persistent Collection, use it to perform specific operations on their SmartObjects.

A common example is merging groups of SmartObjects when a persistent collection is added to the SmartObject Subsystem.

### SmartObject Component

The **SmartObject component** can be added to any **Actor** to mark it as a Smart Object in the level. The component points to a Smart Object Definition asset, which stores the configuration of a given Smart Object template.

The Actor containing the SmartObject component may be loaded and unloaded at runtime using **Streaming**. If the SmartObject component is included in any of the loaded Smart Object Persistent Collections, a runtime instance will remain active in memory and will be considered as part of the simulation regardless of the component's streaming state.

If the Actor containing the SmartObject component is spawned at runtime, then it will not remain active in memory once it's unloaded. This is because the component is not part of any of the SmartObject Persistent Collection.

### Smart Object Definition

A **Smart Object Definition** is a data asset that contains the immutable data shared between multiple Smart Object runtime instances. A Smart Object Definition stores filtering information such as user-required tags, Activity tags, Object Activation tags, and the default set of Behavior Definitions that could be used to interact with the Smart Object.

A Smart Object Definition exposes one or more Slots that can be used by Agents or Players for the specific Smart Object. Each Slot includes the location and rotation relative to the parent anchor (baked from editor placement), as well as several overridable properties. Common examples of overridable properties include user-required tags and specific Behavior Definition per Slot.

### Smart Object Behaviors Definition

**Smart Object Behaviors Definitions** contain the data needed by the Agent or Player for a given interaction. The following types of Behaviors Definitions are currently available:

- **Mass Entity Behavior** - contains data used to configure Smart Objects that can be used by Mass Entities.

- **Gameplay Behavior** - contains data used to configure Smart Objects that can be used by the Gameplay Behavior plugin.

## Runtime Flow

In this section you will learn how Agents interact with a Smart Object in the level.

### Agent Data

In order to search for Smart Objects, the Agent can use one or more Gameplay Tags, and it can also use a Tag Query (Activity Requirements) that contains the desired tags on the object. This information will be used when searching for matching Smart Objects in the level.

### Smart Object Data

Smart Object Definitions can contain one or more Activity Tags that are used to describe the object. They can also contain a Tag Query with a list of desired tags. The Tag Query is an expression used to determine if the user requesting the use of the Smart Object is allowed to interact with it.

A Smart Object Definition contains a list of Default Behavior Definitions that will be used for all Slots. If a Slot has a specific Behavior Definition assigned to it, then the specific behavior will override the default behavior.

### Searching for a Smart Object

- The Agent searches for nearby Smart Objects on a specified interval. The Agent performs the search by calling the **FindSmartObjects** method in the Smart Object subsystem. This method contains the user tags, Activity Tags, Behavior Definition Class, and search area.

- The Smart Object subsystem finds all Smart Objects within the search area that match the all provided filters.

- The Smart Object subsystem returns the Smart Object Results to the Agent. The Smart Object Results are a Struct array containing all matching Smart Object handles and their free Slots. [image: Smart Object with two free Slots] In the image above you can see a vehicle Smart Object with one free Slot, denoted by the green-colored ring.

### Claiming the Smart Object

- The Agent selects a desired Smart Object Result and calls the **ClaimSmartObject** method in the Smart Object subsystem. This method will attempt to claim a Slot from the Smart Object.

- The Smart Object subsystem attempts to claim a Slot from the Smart Object.

- An available Slot is claimed in the Smart Object and its state is set to **Claimed**.

- Smart Object subsystem returns a **Claim Handle** to the Agent.

- The Agent checks if the Claim Handle is valid. If it is valid, the claim attempt was successful and it can proceed to the next step. However, if the Claim Handle is invalid, the Agent may attempt to claim another Smart Object Slot from the Smart Object Results. The claimed Slot may not be claimed by another Agent until it is released by the Agent that claimed it. [image: Smart Object with two claimed Slots] In the image above, Slot 0 has been claimed by the Agent.

### Approaching the Smart Object

- The Agent calls the **GetSlotLocation** or **GetSlotTransform** method in the Smart Object subsystem and passes the Claim Handle. This method returns the location or transform of the claimed Slot. Alternatively, users can use the follow C++ code to obtain the Slot transform: ```
         FSmartObjectSlotView:
         FSmartObjectSlotView View = Subsystem->GetSlotView(ClaimHandle.SlotHandle);

         const FSmartObjectSlotTransform& SlotTransform = View.GetStateData<FSmartObjectSlotTransform>();
         FTransform Transform = SlotTransform.GetTransform();
``` FSmartObjectSlotView: FSmartObjectSlotView View = Subsystem->GetSlotView(ClaimHandle.SlotHandle); const FSmartObjectSlotTransform& SlotTransform = View.GetStateData(); FTransform Transform = SlotTransform.GetTransform();

- The Smart Object subsystem returns the location or transform of the claimed Slot to the Agent.

- The Agent can now start navigating to the Slot location in the Level. The Agent can use any desired navigation method to reach its destination.

- The Agent arrives at the Slot location and calls the **Use** method in the Smart Object subsystem and passes the Claim Handle.

- The Use method triggers a state change for the claimed Slot. The Slot's state is changed from **Claimed** to **Occupied**.

- The Smart Object subsystem returns the **Behavior Definition** struct to the Agent. The Behavior Definition contains all the required data for the Agent to perform its desired behavior at the Slot location. [image: Smart Object with an Occupied Slot and a Claimed Slot] In the image above, the Agent arrives at the Slot and begins performing its desired behavior. The Slot is now Occupied, denoted by the red-color ring.

### Releasing the Smart Object

- The Agent performs the desired behavior described in the Behavior Definition.

- Once the behavior is completed or aborted, the Agent calls the **Release** method with the Claim Handle in the Smart Object subsystem.

- The Smart Object Subsystem changes the Slot state from **Occupied** to **Free**.

- The Agent is now free to perform other tasks or search for another Smart Object. Agents are responsible for releasing their claimed Slots. This can happen once their behavior is completed or interrupted.

### Aborting the Process

The process described above can be interrupted or aborted by the Agent or the Smart Object at any time.

If the Smart Object's state changes it will automatically release all Claimed or Occupied Slots and will notify the corresponding Agents through the **OnSlotInvalidatedDelegate** callback. A common example is the Smart Object being destroyed during gameplay.

The Agent can also abort the process at any time for any reason. In this scenario, the Agent is responsible for releasing the Slot so other Agents can claim it. Common examples include the Agent dying or performing another task with a higher priority.

- ai
- smart objects

On this page

- Overview (-> smart-objects-in-unreal-engine---overview)
- Smart Object Elements (-> smart-objects-in-unreal-engine---overview)
- SmartObject Subsystem (-> smart-objects-in-unreal-engine---overview)
- SmartObject Persistent Collection (-> smart-objects-in-unreal-engine---overview)
- SmartObject Container (-> smart-objects-in-unreal-engine---overview)
- SmartObject Component (-> smart-objects-in-unreal-engine---overview)
- Smart Object Definition (-> smart-objects-in-unreal-engine---overview)
- Smart Object Behaviors Definition (-> smart-objects-in-unreal-engine---overview)
- Runtime Flow (-> smart-objects-in-unreal-engine---overview)
- Agent Data (-> smart-objects-in-unreal-engine---overview)
- Smart Object Data (-> smart-objects-in-unreal-engine---overview)
- Searching for a Smart Object (-> smart-objects-in-unreal-engine---overview)
- Claiming the Smart Object (-> smart-objects-in-unreal-engine---overview)
- Approaching the Smart Object (-> smart-objects-in-unreal-engine---overview)
- Releasing the Smart Object (-> smart-objects-in-unreal-engine---overview)
- Aborting the Process (-> smart-objects-in-unreal-engine---overview)
