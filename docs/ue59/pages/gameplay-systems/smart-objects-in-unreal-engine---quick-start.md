# Smart Objects Quick Start

https://dev.epicgames.com/documentation/en-us/unreal-engine/smart-objects-in-unreal-engine---quick-start?application_version=5.9

> This guide shows how to create and use Smart Objects with an AI Agent.

[image: Smart Objects Quick Start]

## Overview

**Smart Objects** are objects placed in a Level that AI Agents and players can interact with. These objects contain all the information needed for those interactions.

At a high level, Smart Objects represent a set of activities in the Level that can be used through a reservation system. This system keeps track of all the Smart Objects in the Level and allows an AI Agent to "reserve" a Smart Object so no other Agent can use it until the Smart Object becomes available again.

## Goals

In this Quick Start guide, you will learn how to create and use Smart Objects with an AI Agent.

## Objectives

- Create the AI Gameplay Behavior and Behavior Definition that the AI Agent can use when it reaches a Smart Object.

- Create a Smart Object that holds the Behavior Definition to play an animation montage.

- Create simple AI behavior with a Behavior Tree and Behavior Tree Tasks.

- Create the AI Agent that can search for and use Smart Objects in the level.

## 1 - Required Setup

- Create a new **Blueprint **project based on the **Third Person** template.

- From the main menu, go to **Settings > Plugins** to open the **Plugins **window. [image: Open the Plugins window]

- Go to the **Gameplay **section and enable the **Smart Objects**, **AI Behaviors**, and **Gameplay Behavior Smart Objects** plugins. Restart the editor if prompted. [image: Enable the Smart Objects plugin] [image: Enable the AI Behaviors plugin] [image: Enable the Gameplay Behavior Smart Objects plugin]

### Section Results

In this section, you created a new project and enabled the Smart Objects and AI Behaviors plugins. You are now ready to create the AI Gameplay Behavior for your AI Agent.

## 2 - Create the AI Gameplay Behavior

In this section, you will create the Gameplay Behavior and Gameplay Config Blueprints that define what your Agent will do when it reaches a Smart Object Slot.

- In the **Content Browser**, right-click and select **Blueprint Class** from the **Create Basic Asset** section. [image: Create a new Blueprint Class]

- In the **Pick Parent Class** window, expand the **All Classes** section, then search for and select **Gameplay Behavior**. Click **Select **and name the new Asset **BP_SO_Behavior_PlayMontage**. [image: Select the Gameplay Behavior class]

- Create a new Blueprint class, then search for and select **Gameplay Behavior Config**. Click **Select **and name the new Asset **BP_SO_BehaviorConfig**. [image: Select the Gameplay Behavior Config class]

- In the **Content Browser**, double-click **BP_SO_BehaviorConfig **to open it. Go to the **Details **panel and click the **Behavior Class** dropdown. Select **BP_SO_Behavior_PlayMontage**. Compile and save the Blueprint. [image: Add the BP_SO_Behavior_PlayMontage to the Behavior Class]

- In the **Content Browser**, double-click **BP_SO_Behavior_PlayMontage **to open it. Click the **Override **dropdown next to **Functions **and select **OnTriggeredCharacter**. [image: Override the OnTriggeredCharacter function]

- Right-click the **Avatar **pin of the **Event OnTriggeredCharacter** node and select **Promote to Variable**. [image: Right-click the Avatar pin of the Event OnTriggeredCharacter node and select Promote to Variable]

- Drag the **Avatar **variable to the **Event Graph** and select **Get Avatar**. Drag from the **Avatar **node, then search for and select **Get Component by Class**. [image: Search for and select Get Component by Class]

- Click the **Component Class** dropdown, then search for and select **Skeletal Mesh Component**. [image: Add the Skeletal Mesh component]

- Right-click in the **Event Graph,** then search for and select **Play Montage**. Connect the **Return Value** pin of the **Get Component by Class** node to the **In Skeletal Mesh Component** pin of the **Play Montage** node.

- Connect the **Set Avatar** node to the **Play Montage** node.

 [image: Add a Play Montage node]
 [image: Connect the Play Montage node to the Set Avatar node]

- Click the **Montage to Play** dropdown on the **Play Montage** node. Select an animation montage from the list. [image: Select an animation montage to play] If you don't have animations available, you can get free animation asset packs from Fab, such as the Animation Starter pack. You can also convert any Animation Sequence to an Animation Montage by right-clicking it and selecting **Create > Create AnimMontage**.

- Drag the **Avatar **variable to the **Event Graph** and select **Get Avatar**. Drag from the **Avatar **node, then search for and select **End Behavior**. [image: Add the End Behavior node]

- Connect the **On Completed** and **On Interrupted** pins from the **Play Montage** node to the **End Behavior** node. [image: Connect On Completed and On Interrupted to the End Behavior node]

- Compile and save the Blueprint. This example uses the **Play Montage** node, as opposed to the **Play Anim Montage** node to use the **On Completed** and **On Interrupted** pins to end the behavior. This ensures the Smart Object remains occupied until the animation finishes playing.

### Section Results

In this section, you created the Gameplay Behavior and Gameplay Config Blueprints that the Agent will use to play an animation montage once it reaches a Smart Object Slot. You can now create the Behavior Definition that will be used by the Smart Object.

## 3 - Create the Smart Object Definition Data Asset

In this section, you will create the SmartObject Definition Data Asset that will define the behavior for each Slot of the Smart Object.

- In the **Content Browser**, right-click and select **Miscellaneous > Data Asset**. In the **Pick Class for Data Asset Instance** window, search for and select **Smart Object Definition**.

- Click **Select **to create the Asset and name it **SO_Definition_PlayMontage**.

 [image: Select Miscellaneous - Data Asset]
 [image: Select the Smart Object Definition]

- In the **Content Browser**, double-click **SO_Definition_PlayMontage** to open it. Scroll down to the **Smart Object** section and click the **Add (+)** button next to **Slots **to add a new Slot. This is the Slot that will be used by the AI Agent when performing the behavior. [image: Click the Add (+) button next to Slots** **to add a new Slot]

- Click the **Add (+)** button next to **Default Behavior Definitions** and select **Gameplay Behavior Smart Object Behavior Definition** for **Index 0**. Click the **Gameplay Behavior Config** dropdown and select **BP_SO_BehaviorConfig**. [image: Add a new Default Behavior Definition]

- Save and close the Blueprint.

### Section Results

In this section, you created the SmartObject Definition Data Asset that defines each Slot of the Smart Object and its default behavior definition.

## 4 - Create a Smart Object

In this section, you will create a Smart Object that can be found and used by an Agent in the level.

- In the **Content Browser**, right-click and select **Blueprint Class** from the **Create Basic Asset** section. [image: Create a new Blueprint Class]

- In the **Pick Parent Class** window, click the **Actor **class button to create the asset. Name the new Asset **BP_SO_RunBT**. [image: Select the Actor class]

- In the **Content Browser**, double-click **BP_SO_RunBT** to open it. Go to the **Components **window and click the + **Add **button. Search for and select **Smart Object**. [image: Select the SOComponent component]

- With the **SmartObject **component selected, go to the **Details **panel and scroll down to the **Smart Object** section. Click the **Definition Asset **dropdown and select **SO_Definition_PlayMontage**. [image: Add the Definition Asset]

- Compile and save the Blueprint.

### Section Results

In this section, you created a Smart Object and added the Behavior Definition that defines the default behavior of its Slot.

## 5 - Create the Behavior Tree for the AI Agent

In this section, you will create the necessary behavior for the AI Agent to search for and use Smart Objects in the Level. You will use a simple Behavior Tree and two custom Behavior Tree Tasks to accomplish this.

### Create the Behavior Tree and Blackboard

- In the **Content Browser**, right-click and select **AI > Blackboard**. Name the Blackboard **BB_SO_Agent**. [image: Create a Blackboard]

- Double-click **BB_SO_Agent **to open it. Click the **New Key** dropdown and select **SO Claim Handle**. Name the key **ClaimHandle**. Save and close the Blackboard. [image: Add a SmartObject Claim Handle]

- In the **Content Browser**, right-click and select **AI > Behavior Tree**. Name the Behavior Tree **BT_SO_Agent**. [image: Create a Behavior Tree]

### Create the Behavior Tree Tasks

**Finding Smart Objects**

- In the **Content Browser**, right-click and select **Blueprint Class** from the **Create Basic Asset** section. [image: Create a new Blueprint Class]

- In the **All Classes** section, search for and select **BT Task Blueprint Base**, then click **Select**. Name the Blueprint **BTT_FindSmartObject**. [image: Search for and select BT Task Blueprint Base, then click Select]

- In the **Content Browser**, right-click **BTT_FindSmartObject **and select **Duplicate**. Name the new Blueprint **BTT_UseSmartObject**. [image: Duplicate BTT_FindSmartObject]

- In the **Content Browser**, double-click **BTT_FindSmartObject **to open it. In the **Event Graph**, right-click, then search for and select **Event Receive Execute AI**. [image: Add the Event Receive Execute AI node]

- Drag from the **Owner Controller** pin of the **Event Receive Execute AI** node, then search for and select **Get Blackboard**. Right-click the **Return Value** pin of the **Get Blackboard** node and select **Promote to Variable**. Name the variable **Blackboard**.

- Connect the **Event Receive Execute AI** node to the **Set Blackboard** node.

 [image: Add the Get Blackboard node]
 [image: Connect the Set Blackboard node to the Event Receive Execute AI node]

- Drag from the **Controlled Pawn** pin of the **Event Receive Execute AI** node, then search for and select **Get Actor Location**. Drag from the **Return Value** of the **Get Actor Location** node, then search for and select **Subtract**.

- Drag from the **Return Value** of the **Get Actor Location** node, then search for and select **Add**.

- Set the **X**, **Y**, and **Z** values of both nodes to **2000**. This creates a search box of 4000 x 4000 units, or 40 x 40 meters around the Agent.

 [image: Add the Get Actor Location node]
 [image: Add Subtract and Add nodes]

- In the **Event Graph**, right-click then search for and select **Make Box**. Connect the **Subtract **node to the **Min **pin of the **Make Box** node.

- Connect the **Add **node to the **Max **pin of the **Make Box** node.

 [image: Add a Make Box node]
 [image: Connect the Make Box node]

- In the **Event Graph**, right-click then search for and select **Get Smart Object Subsystem**. Drag from the **Smart Object Subsystem** node, then search for and select **Find Smart Objects**.

- Drag from the **Request **pin of the **Find Smart Objects** node and select **Make SmartObjectRequest**.

 [image: Add a Get Smart Object Subsystem node]
 [image: Add a Find Smart Objects node]
 [image: Select Make SmartObjectRequest]

- Connect the **Return Value** pin of the **Make Box** node to the **Query Box** pin of the **Make SmartObjectRequest** node. Drag from the **Filter **pin of the **Make SmartObjectRequest** node and select **Make SmartObjectRequestFilter**.

- Drag from the **Behavior Definition Classes** pin and search for then select **Make Array**.

- Click the dropdown of the **Make Array** node and select **GameplayBehaviorSmartObjectBehaviorDefinition**.

- Connect the **Set Blackboard **node to the **Find Smart Objects** node.

 [image: Connect the Return Value pin of the Make Box node to the Query Box pin of the Make SmartObjectRequest node]
 [image: Select GameplayBehaviorSmartObjectBehaviorDefinition from the dropdown]

- This is what the Blueprint looks like so far. [image: The Blueprint so far]

- Right-click the **Out Results** pin of the **Find Smart Objects** node and select **Promote to Variable**. Connect the **Out Results **node to the **Blackboard** node. Drag from the pin of the **Out Results** node, then search for and select **Is Valid Index**.

- Drag from the **Is Valid Index** node, then search for and select **Branch**. Connect the **Out Results** node to the **Branch **node.

 [image: Right-click the Out Results pin of the Find Smart Objects node and select Promote to Variable]
 [image: Select Is Valid Index]
 [image: Select Is Valid Index]

- Drag from the **False **pin of the **Branch **node, then search for and select **Finish Execute**. The **Out Results** will be invalid if no nearby Smart Objects match the search criteria. [image: Drag from the False pin of the Branch node, then search for and select Finish Execute]

- Create a **Smart Object Subsystem** node in the **Event Graph**. Drag from the node, then search for and select **Claim**. Connect the **True **pin of the **Branch **node to the **Claim **node.

- Drag the **Out Results** variable to the **Event Graph** and select **Get Out Results**. Drag from the node, then search for and select **Random Array Item**.

- Drag from the **Random **node and connect it to the **Request Results** pin of the **Claim **node.

 [image: Add a Claim node]
 [image: Drag from the node, then search for and select Random Array Item]
 [image: Drag from the Random node and connect it to the Request Results pin of the Claim node]

- Right-click the **Return Value** pin of the **Claim **node and select **Promote to Variable**. Name the variable **ClaimHandle**. Drag from the **Claim Handle** node pin, then search for and select **Is Valid Smart Object Claim Handle**.

- Drag from the **Return Value** of the **Is Valid Smart Object Claim Handle** node, then search for and select **Branch**.

 [image: Right-click the Return Value pin of the Claim node and select Promote to Variable. Name the variable ClaimHandle]
 [image: Drag from the Claim Handle node pin, then search for and select Is Valid Smart Object Claim Handle]
 [image: Drag from the Return Value of the Is Valid Smart Object Claim Handle node, then search for and select Branch]

- Drag from the **False **pin of the **Branch **node, then search for and select **Finish Execute**. [image: Drag from the False pin of the Branch node, then search for and select Finish Execute]

- Drag the **Blackboard **variable to the **Event Graph** and select **Get Blackboard**. Drag from the **Blackboard **node, then search for and select **Set Value as SOClaim Handle**.

- Connect the **True **pin of the **Branch **node to the **Set Value as SOClaim Handle** node.

- Right-click the **Key Name** pin of the **Set Value as SOClaim Handle** node and select **Promote to Variable**.

- With the **Key Name** variable selected, go to the **Details **panel and enable the **Instance Editable** checkbox. Set the **Default Value** to **ClaimHandle**.

 [image: Drag from the Blackboard node, then search for and select Set Value as SOClaim Handle]
 [image: Right-click the Key Name pin of the Set Value as SOClaim Handle node and select Promote to Variable]
 [image: Enable the Instance Editable checkbox. Set the Default Value to ClaimHandle]

- Drag the **ClaimHandle **variable and connect it to the **Value **pin of the **Set Value as SOClaim Handle** node. [image: Drag the ClaimHandle variable and connect it to the Value pin of the Set Value as SOClaim Handle node]

- Drag from the **Set Value as SOClaim Handle** node, then search for and select **Finish Execute**. Enable the **Success **checkbox on the node. [image: Add a Finish Execute node and enable the Success checkbox]

- Compile and save the Blueprint.

**Use the Smart Object**

- In the **Content Browser**, double-click **BTT_UseSmartObject **to open it. In the **Event Graph**, right-click and search for then select **Event Receive Execute AI**. [image: Add the Event Receive Execute AI node]

- Drag from the **Owner Controller** pin of the **Event Receive Execute AI** node, then search for and select **Get Blackboard**. [image: Drag from the Owner Controller pin of the Event Receive Execute AI node, then search for and select Get Blackboard]

- Drag from the **Return Value** pin of the **Get Blackboard** node, then search for and select **Get Value as SOClaim Handle**. [image: Drag from the Return Value pin of the Get Blackboard node, then search for and select Get Value as SOClaim Handle]

- Right-click the **Key Name** pin of the **Get Value as SOClaim Handle** node and select **Promote to Variable**. With the **Key Name** variable selected, go to the **Details **panel and enable the **Instance Editable** checkbox. Set the **Default Value** to **ClaimHandle**.

 [image: Enable the Instance Editable checkbox. Set the Default Value to ClaimHandle]

- Drag from the **Return Value** pin of the **Get Value as SOClaim Handle** node, then search for and select **Use Claimed Gameplay Behavior Smart Object**. Connect the **Get Value as SOClaim Handle** node to the **Use Claimed Smart Object** node.

- Drag from the **Owner Controller** pin of the **Event Receive Execute AI** node and connect it to the **Controller **pin of the **Use Claimed Smart Object** node.

 [image: Drag from the Return Value pin of the Get Value as SOClaim Handle node, then search for and select Use Claimed Smart Object]
 [image: Drag from the Owner Controller pin of the Event Receive Execute AI node and connect it to the Controller pin of the Use Claimed Smart Object node]

- Drag from the **On Succeeded** pin of the **Use Claimed Smart Object** node, then search for and select **Finish Execute**. Enable the **Success **checkbox on the node. [image: Drag from the On Finished pin of the Use Claimed Smart Object node, then search for and select Finish Execute]

- Compile and save the Blueprint.

**Create the Behavior Tree**

- In the **Content Browser**, double-click **BT_SO_Agent **to open it. Drag from the **Root **node and select **Selector**. [image: Drag from the Root node and select Selector]

- Drag from the **Selector **node and select **Sequence**. Drag from the Selector node and select **Wait**. This node will have the Agent wait for 5 seconds before searching for a new Smart Object, if the initial search was unsuccessful.

- Make sure the **Sequence **node is to the left of the **Wait **node. This ensures the Sequence will be executed first in the Behavior Tree.

 [image: Drag from the Selector node and select Sequence]

- Drag from the **Sequence **node and select **BTT_FindSmartObjects**. [image: Drag from the Sequence node and select BTT_FindSmartObjects]

- Drag from the **Sequence **node and select **BTT_UseSmartObjects**. [image: Drag from the Sequence node and select BTT_UseSmartObjects]

- Drag from the **Sequence **node and select **Wait**. With the node selected, set the **Wait Time** to **2.0** and **Random Deviation** to **0.5**. This node will have the Agent wait between 1.5 and 2.5 seconds before searching for a new Smart Object. [image: Drag from the Sequence node and select Wait] [image: Final Behavior Tree]

- Save and close the Behavior Tree.

**Section Results**

In this section, you created the Behavior Tree and Behavior Tree Tasks that allow the Agent to find and use Smart Objects in the Level.

## 6 - Create the AI Agent

In this section, you will create the AI Agent that will search for Smart Objects in the level.

- In the **Content Browser**, double-click the **BP_ThirdPersonCharacter **Blueprint to open it. [image: Double-click the ThirdPersonCharacter Blueprint to open it]

- Select all the nodes in the **Event Graph** and delete them. Right-click in the **Event Graph**, then search for and select **Event Possessed**. [image: Right-click in the Event Graph and search for then select Event Possessed]

- Drag from the **New Controller** pin of the **Event Possessed** node, then search for and select **Cast to AI Controller**. Connect the **Event Possessed** node to the **Cast to AIController** node. [image: Drag from the New Controller pin of the Event Possessed node, then search for and select Cast to AI Controller]

- Drag from the **As AIController** pin of the **Cast to AIController** node, then search for and select **Run Behavior Tree**. Click the **BTAsset **dropdown and select **BT_SO_Agent**. [image: Drag from the As AIController pin of the Cast to AIController node, then search for and select Run Behavior Tree]

- Compile and save the Blueprint.

**Section Results**

In this section, you created the AI Agent Blueprint that will search for Smart Objects in the Level. You also modified the animation Blueprint to make sure the animation montage can play correctly.

## 7 - Test the Smart Objects

You will now test the Agent to make sure it can find and use the Smart Objects in the Level.

- From the Main Toolbar, click **Add Content (****+****) > Volumes > NavMeshBoundsVolume** to add a new **Navigation Mesh **actor to your Level. Scale the Mesh to cover your Level so the Agent can navigate to its destination. [image: Add a NavMeshBoundsVolume to your Level]

- Drag several **BP_SO_RunBT **Blueprints to your level. [image: Drag several BP_SO_RunBT** **Blueprints to your level]

- Drag the **ThirdPersonCharacter **Blueprint to your Level. [image: Drag the ThirdPersonCharacter** **Blueprint to your Level]

- Press **Simulate **to see the Agent find and use Smart Objects in the Level. [image: Press Simulate to see the Agent find and use Smart Objects in the Level]

**Section Results**

In this section, you confirmed that the Agent can find and use Smart Objects in the Level.

- ai
- smart objects

On this page

- Overview (-> smart-objects-in-unreal-engine---quick-start)
- Goals (-> smart-objects-in-unreal-engine---quick-start)
- Objectives (-> smart-objects-in-unreal-engine---quick-start)
- 1 - Required Setup (-> smart-objects-in-unreal-engine---quick-start)
- Section Results (-> smart-objects-in-unreal-engine---quick-start)
- 2 - Create the AI Gameplay Behavior (-> smart-objects-in-unreal-engine---quick-start)
- Section Results (-> smart-objects-in-unreal-engine---quick-start)
- 3 - Create the Smart Object Definition Data Asset (-> smart-objects-in-unreal-engine---quick-start)
- Section Results (-> smart-objects-in-unreal-engine---quick-start)
- 4 - Create a Smart Object (-> smart-objects-in-unreal-engine---quick-start)
- Section Results (-> smart-objects-in-unreal-engine---quick-start)
- 5 - Create the Behavior Tree for the AI Agent (-> smart-objects-in-unreal-engine---quick-start)
- Create the Behavior Tree and Blackboard (-> smart-objects-in-unreal-engine---quick-start)
- Create the Behavior Tree Tasks (-> smart-objects-in-unreal-engine---quick-start)
- 6 - Create the AI Agent (-> smart-objects-in-unreal-engine---quick-start)
- 7 - Test the Smart Objects (-> smart-objects-in-unreal-engine---quick-start)
