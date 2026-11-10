# Environment Query System Quick Start

https://dev.epicgames.com/documentation/en-us/unreal-engine/environment-query-system-quick-start-in-unreal-engine?application_version=5.9

> The Environment Query System Quick Start aims to get you up to speed on some of the systems and tools for working with EQS and AI.

[image: Environment Query System Quick Start]

It is recommended that you proceed through the Behavior Tree Quick Start Guide (-> behavior-tree-in-unreal-engine---quick-start-guide) or have some prior knowledge of Blueprints and Behavior Trees in Unreal Engine 5 before proceeding with this guide.

The **Environment Query System (EQS)** can be used within Behavior Trees (-> behavior-trees-in-unreal-engine) to poll the environment through a variety of Tests (-> eqs-node-reference-tests-in-unreal-engine), then based on the results of those Tests, can make decisions on how to proceed. Some example use cases for EQS could be to have an AI character find a cover location away from the Player or to find the nearest health or ammo in the Level.

An Environment Query is made up of several different pieces. You can call an Environment Query from a Behavior Tree, and then the actual Environment Query will use its Generator (-> eqs-node-reference-generators-in-unreal-engine), reference its Contexts (-> eqs-node-reference-contexts-in-unreal-engine), and use its Tests to give the Behavior Tree the highest weighted result.

In this guide, we create an AI that randomly moves around the environment until seeing the player. When seeing the player, the AI uses the EQS system to find a location in the environment that provides the best vantage point while maintaining its distance. This can be useful in situations where you have an AI character that performs some form of ranged attack, as the AI will keep its distance from the player and try to retain a line of sight as seen in the example below.

By the end of this guide, you will have a basic understanding of the following systems:

- Blueprint Visual Scripting
- AI Controllers
- Blackboards
- Behavior Trees
- Environmental Query System (EQS)
- EQS Contexts
- AI Debugging Tools

## 1 - Required Project Setup

In this step, we'll set up our project with some of the assets we'll need for our AI as well as enable the EQS system.

For this guide, we are using a new **Blueprint Third Person Template** project.

- Inside your project, in the **Settings > Plugins ** section, enable the **Environment Query Editor** option if necessary.[image: In the Project Settings,enable the Environment Query Editor option]Enabling the EQS system will allow you to create and access EQS-related assets.
- In the **Content > ThirdPerson > Blueprints **folder, copy the **BP_ThirdPersonCharacter **over to a new folder called **AI**.[image: Copy the BPThirdPersonCharacter over to a new folder called AI]
- In the **AI **folder, create the following three AI assets from the **+Add > Create Advanced Asset > Artificial Intelligence** option:[image: In the AI folder create the following three AI assets from the Add option]**Blackboard** named **BB_Enemy**
- **Behavior Tree** named **BT_Enemy**
- **Environment Query** named **EQS_FindPlayer**

- Create a new **Blueprint Class **of the **AIController **type and call it **AIC_Enemy**.[image: Create a new Blueprint Class of the AIController type and call it AIC_Enemy]
- Create a new **Blueprint Class **of the **EnvQueryContext_BlueprintBase **type and call it **EQC_PlayerContext**.[image: Create a new Blueprint Class of the EnvQueryContextBlueprintBase type and call it EQCPlayerContext]**Contexts** can be used in the EQS system for reference when applying various Tests, for example, "EQS, how close am I to the specified Context" is a Test we could run. This asset will be used to provide the Player Character as a Context when we perform Tests a little later in this guide.

## 2 - Environment Query Context

In this step, we establish a Context for the EQS system of the Player Character that will be used in Tests later in the guide.

- Open the **EQC_PlayerContext **asset, then in the **My Blueprint **panel, override the **Provide Single Actor **function.[image: In the My Blueprint panel override the Provide Single Actor function]You can provide individual **Actors** or **Locations** as a Context as well as a set of **Actors** or **Locations**.
- In the **Provide Single Actor **function, use a **Get Player Character **call as the **Resulting Actor**.[image: Use a Get Player Character call as the Resulting Actor]This will retrieve the Player Character at run-time as the Context.While we are focusing on Blueprint, in this case, a more optimized approach would be to create the Context through C++.

## 3 - EQS Setup

In this step, we jump into the EQS editor and set up the Tests for finding a location that has a line of sight to the Player Character.

- Inside **EQS_FindPlayer**, drag off the **Root** node in the graph and add a **Points: Grid** node.[image: Drag off the Root node in the graph and add a Points: Grid node]Several different types of **Generators** are used to create **Items** about a Context. Those items are then used in Tests (for example, how far is Item X from Context Y). From the results of the Tests, Items are culled or scored and can be used to determine what is the "best" (highest or lowest scoring) option.In this example, we will generate a series of points on a grid around the AI that will put it into a position where it can see the Player Character.
- In the **Details** panel, change the **GridHalfSize** to **800** and the **Space Between** to **150.0**.[image: Change the GridHalfSize to 800 and the Space Between to 150.0 in the details panel]These settings are used to define the possible number of points to test against and the distance between those points. For performance reasons, you will want to keep this to a manageable size, as having a grid too large may start to impact your game's performance.Using the **Generate Around** field, you can determine where the grid should be placed (in this case, around the querier or AI character). While it will also work if we set **Generate Around** to use the Player Context we created, we don't want the AI to move up to a point on the grid near the Player if it already has a line of sight to the Player.The **Projection Data** option provides additional fields for determining how the grid is generated, for this example, we can leave these as default but you can come back and adjust these settings if you desire.
- Right-click on the **SimpleGrid** node and under **Add Test** select **Trace**.[image: Right-click on the SimpleGrid node and under Add Test select Trace]The **Trace** Test will be used to determine if a point on the grid can see the Player Character.The order in which you add Tests to a Generator is irrelevant. Tests get sorted by putting the Filters first (so that subsequent Tests deal with as small of an Item collection as possible) and also filter by cost (so the distance filter will be executed before the Line of Sight filter).
- Right-click and add another Test, of the **Distance** type**.**[image: Right-click and add another Test of the Distance type]After the **Trace** Test returns points that can see the Player Character, the **Distance** Test will be used to score those points based on their proximity to the Player Character.
- Select the **Trace** Test, then in the **Details** panel set the following options:[image: Select the Trace Test and in the Details panel set the following options]**Test Purpose** = **Filter Only**
- **Context** = **EQC_PlayerContext**
- **Bool Match** = **Disabled**

Here we are providing the Player Character as the point of reference (Context) in the **Trace** Test for visibility. By disabling the **Bool Match** option, we are stating that we want to filter out any points that cannot see the Player Character.

- Select the **Distance** Test, then in the **Details** panel, change the **Test Purpose** to **Score Only** and the **Scoring Factor** to **-1.0**.[image: Change the Test Purpose to Score Only and the Scoring Factor to -1.0 in the Details panel]The **Distance** Test Purpose is to score the Items returned and the Scoring Factor of -1.0 scores points that are closer to the Player's Character. If we leave this as 1.0, it will return points that are furthest away from the player which may cause the AI to run right past the Player Character in an attempt to reach the furthest point.There are additional scoring options such as clamping the scores to a minimum or maximum value, changing the **Scoring Equation** which changes the curve equation applied to the normalized score before being multiplied by the **Scoring Factor**, defining the **Normalization Type** or assigning a **Reference Value** used to normalize scores. For this example, we can leave these all at their default settings.

## 4 - Blackboard and Behavior Tree Setup

In this step, we set up the Blackboard Keys and lay out the branches of our Behavior Tree.

- In the **BB_Enemy **Blackboard asset, create the following three Keys:[image: Create the following three Keys in the BB_Enemy Blackboard asset]**Bool **named **HasLineOfSight**
- **Vector **named **MoveToLocation**
- **Object **with **Base Class **set to **Actor** named **TargetActor**

These Keys will be used to update and move between branches in our Behavior Tree.

- Open the **BT_Enemy **Behavior Tree and create the graph below using **Selectors**, **Sequences**, and a **Wait Task** node:[image: Open the BT_Enemy Behavior Tree and create the graph below using Selectors, Sequences and a Wait Task node] Click image for full view. Above, we have three main branches. The left most branch uses a **Selector **node (which we have named **In Combat**) to switch between two **Sequence **nodes (one called **Attack **and another called **Move into Position**). When the AI is not executing the "In Combat" branch, it will execute the next branch which we have named **Patrolling**. In the event for some reason, the AI is not in either combat or patrolling, we have a fail-safe task to wait (which we have set to 1 second) before trying to move to another branch.

## 5 - Behavior Tree: Patrol Setup

In this step, we set up the patrolling branch of the Behavior Tree.

- Off the **Patrolling** Sequence node, add a **Move To** Task (set to **MoveToLocation**) and a **Wait** Task (set to **5** +/- **1** second).[image: Add a Move To Task and a Wait Task oiff the Patrolling Sequence node]This will instruct the AI to move to the Blackboard Key **MoveToLocation** and then wait the specified time, however, we still need to define the vector value for **MoveToLocation.**
- From the Toolbar create a **New Task**, then in the **Content Drawer**, call it **BTT_RandomLocation.**[image: From the Toolbar create a New Task then in the Content Drawer call it BTT_RandomLocation]
- In **BTT_RandomLocation**, recreate the Blueprint Graph below:[image: Blueprint Graph]Using an **Event Receive Execute AI** node, off the **Controlled Pawn** you can **Get Actor Location** and use that as the **Origin** for the **Get Random Reachable Point in Radius** function (which we've set to **1000** as the **Radius**).Use the **Return Value** from the **GetRandomReachablePointInRadius** node as a **Branch** condition. Off the **True** pin, use the **Random Location** value and **Set Blackboard Value as Vector** with the Key being a **Blackboard Key Selector** variable called **MoveToLocation**.Off the **False** pin, **Set Blackboard Value as Vector** with **Get Actor Location** as the **Value**. This is if a random point is not found, we take the character's existing location before trying to find a new location. End the Task with both execution wires feeding into a **Finish Execute** node with **Success** enabled.Before adding this as a Task in the Behavior Tree, we'll want to be able to set the value of **MoveToLocation** so we need to make sure that it is set to **Instance Editable** by clicking the eye icon in the **My Blueprint** panel.[image: Click the eye icon in the My Blueprint panel]
- In the Behavior Tree, add the **BTT_RandomLocation** Task (setting **MoveToLocation** in the **Details** panel) as the first node under **Patrolling**.[image: Add the BTT_RandomLocation Task in the Behavior Tree]

## 6 - Behavior Tree: In Combat Setup

In this step, we set up the tasks associated with the In Combat branch including our EQS_FindPlayer query used to find a location that has a line of sight to the Player Character.

- Right-click on the **In Combat **Selector and add a **Decorator **of the **Blackboard **type with the following settings:[image: Right-click on the In Combat Selector and add a Decorator of the Blackboard type]**Observer aborts **set to **Lower Priority**
- **Blackboard Key **set to **TargetActor**

Here we are stating that once TargetActor becomes set, execute the In Combat branch aborting any lower priority tasks.

- Right-click on the **Attack **Sequence and add a **Decorator **of the **Blackboard **type with the following settings:[image: Right-click on the Attack Sequence and add a Decorator of the Blackboard type]**Notify Observer **set to **On Value Change**
- **Observer aborts **set to **Lower Priority**
- **Blackboard Key **set to **HasLineOfSight**

Here we are stating that if **HasLineOfSight** is Set, then execute the Attack branch. If **HasLineOfSight** is not set, execute a different branch until **HasLineOfSight** is set again.

- Off the **Attack **node add a **Rotate to face BB entry **(set to **TargetActor**).[image: Off the Attack node, add a Rotate to face BB entry]This will cause the AI to rotate towards the TargetActor while in the "attack" branch. For this example, we do not have an attack to give our AI however this is something you can add later on if you desire.
- Off the **Move Into Position **node, use the **Run EQSQuery **node.[image: Off the Move Into Position node use the Run EQSQuery node]The Run EQSQuery node can be used to execute an EQS Query that will update the assigned Blackboard Key.
- In the **Details **panel for the **Run EQSQuery **node, set the **Blackboard Key **to **MoveToLocation **and the **Query Template **to **EQS_FindPlayer**.[image: Set the Blackboard Key to MoveToLocation and the Query Template to EQSFindPlayer]
- Add a **MoveTo **(set to **MoveToLocation) **and **Rotate to face BB entry **(set to **TargetActor**) following the **Run EQS Query. **[image: Add a MoveTo and Rotate to face BB entry following the Run EQS Query]The Behavior Tree will run the EQS Query to update the Blackboard Key **MoveToLocation** and the AI will then move to that location and rotate to face the **TargetActor **(Player Character).The full Behavior Tree should look like the following:[image: Behavior Tree] Click image for full view.

## 7 - AI Controller Setup

In this step, we set up our AI Controller to run our Behavior Tree as well as provide a way for the AI to see the Player Character using AI Perception.

- In the **AIC_Enemy **Blueprint, add an **Event On Possess **and connect to a **Run Behavior Tree **(set to **BT_Enemy)**. [image: IAdd an Event On Possess and connect to a Run Behavior Tree]
- Add an **AIPerception **component with the following **AI Sight config **settings:[image: Add an AIPerception component with the following AI Sight config settings]**Senses Config **add an **AI Sight config**
- **Detect Neutrals **set to **enabled**

This will enable the AI to sense other Actors and fire an event when an Actor has been perceived by the Perception system. Currently, by default, Players do not get assigned an affiliation and can only be assigned one through C++ code. To circumvent this, we are enabling neutrals to be detected by the Perception system and will use Actor tagging to only perceive Actors tagged as "Player".

- For the **AIPerception **component, under **Events**, add an **On Target Perception Updated **then promote the **Actor **pin to a variable called **Perceived Actor. **[image: Add an On Target Perception Updated then promote the Actor pin to a variable called Perceived Actor]Click image for full view.When the AI perceives something, that Actor will be stored as a variable which we will use later to update our Blackboard.
- Add two **Branch **nodes with the following conditions:[image: Add two Branch nodes with the conditions]Click image for full view.1st Branch **Condition** set to **Actor Has Tag **with the **Tag **of **Player **and the **Target** beingthe **Actor **from **Perception Updated**.
- 2nd Branch **Condition **set to **Successfully Sensed **from the **Stimulus **pin of **Perception Updated **Event.

Above, if the perceived Actor has the Tag of Player, the Branch continues to check if that Actor was successfully sensed or not. If it doesn't have the Tag of Actor (another enemy perhaps) it does not proceed on.

- Off the **False **pin of the 2nd Branch, add the 3 nodes shown below:[image: Off the False pin of the 2nd Branch, add the 3 nodes]Above we have a **Set Timer by Event **node (set to **8.0**) and promoted the **Return Value **to a variable called **LostSightTimer**. We then assign a Custom Event we created and called **LostSight **as the **Event Delegate.**
- Create 2 Functions in the **My Blueprint **panel called: **UpdateSightKey **and **UpdateTargetKey**.[image: Create UpdateSightKey and UpdateTargetKey Functions in the My Blueprint panel]We will use these two functions to update our Blackboard Keys that are used to make decisions in our Behavior Tree.
- For **UpdateSightKey**, add a **Bool **input called **HasLineOfSight**.[image: Add a Bool input called HasLineOfSight]
- In **UpdateSightKey** right-click and get the **Blackboard **variable, then **Set Value as Bool **with **Key Name **using **HasLineOfSight**.[image: In UpdateSightKey right-click and get the Blackboard variable and Set Value as Bool with Key Name using HasLineOfSight]This enables us to use this function to pass through a bool value to our Blackboard Key, updating the **HasLineOfSIght** key.
- For **UpdateTargetKey**, add an **Actor **input called **TargetActor**.[image: Add an Actor input called TargetActor for UpdateTargetKey]
- In **UpdateTargetKey** right-click and get the **Blackboard **variable, then **Set Value as Object **with **Key Name **using **TargetActor**.[image: In UpdateTargetKey right-click and get the Blackboard variable and Set Value as Object with Key Name using TargetActor]Similar to the UpdateSightKey function, this is used to update the Blackboard Key **TargetActor **with whatever Actor we pass through.
- Add **UpdateSightKey **and **UpdateTargetActor **functions to the **False **condition as shown:[image: Add UpdateSightKey and UpdateTargetActor functions to the False condition]When the AI Perception does not successfully sense the Actor who has the tag of Player, the false condition will start a timer (storing it in a handle for later) and will update the Blackboard Key **HasLineOfSight **to false. After the time specified (8.0 seconds), the Custom Event **LostSight **will execute, clearing the **TargetActor **Blackboard Key (meaning we no longer are targeting the Player and have lost sight of them).You can tune and tweak the amount of time before the AI "gives up" chasing the Player Character by adjusting the **Time **value on the Timer.
- Off the **True **pin of the 2nd Branch, use **LostSIghtTimer **and **Clear and Invalidate Timer by Handle**.[image: Off the True pin of the 2nd Branch use LostSIghtTimer and Clear and Invalidate Timer by Handle]This will stop and reset the Timer used when losing sight of the Player Character.
- Add the **UpdateSightKey **(set to **enabled) **and **UpdateTargetKey** (set to **Perceived Actor**).[image: Add the UpdateSightKey and UpdateTargetKey]The full graph should look similar to below:[image: Full Graph] Click image for full view. Our AI Controller is now set up, runs our Behavior Tree, and updates our Blackboard Keys based on when we perceive an Actor with the tag Player through the AI Perception system.

## 8 - Final Setup

In this step, we set up the enemy AI Character Blueprint, add the Tag Player to the Player Character Blueprint so it can be perceived by the AI, and add a NavMeshBoundsVolume and some meshes so the AI knows how to move around the environment and we can break line of sight easier.

- Open **BP_Enemy**, in the **Details **panel, enable **Use Controller Rotation Yaw **and set **AI Controller Class **to **AIC_Enemy**.[image: Open BP_Enemy and in the Details panel enable Use Controller Rotation Yaw and set AI Controller Class to AIC_Enemy] Click image for full view. For the AI to execute the rotate task inside the Behavior Tree, we need to enable Controller Rotation Yaw. We also assign the custom AI Controller class that has our logic in it and runs the Behavior Tree. Optionally, we deleted all the script that was copied over from the Player Character (as well as the Camera Component) as we will not need it for the AI Character.
- From the **Modes **panel, add a **NavMeshBoundsVolume **to the Level and scale it so it encapsulates the Level.[image: Add a Nav Mesh Bounds Volume to the Level and scale it so it encapsulates the Level from the Modes panel]You can press the **P **key to toggle on/off the debug grid which shows navigatable paths in green. Or during gameplay with the console command **show Navigation** **true **(to display) or **false **(to hide).
- Right-click on the **BP_ThirdPersonCharacter **in the Level, then select **Edit BP_hirdPersonCharacter**.[image: Right-click on the BPThirdPersonCharacter in the Level, then select Edit BPThirdPersonCharacter]
- In the **Details **panel, search for **Tag**, then add a **Tag **called **Player**.[image: Search for Tag, then add a Tag called Player in the Details panel]Inside our **AIC_Enemy **Blueprint when the AI Perception system perceives an Actor, this Actor has the tag of Player so our Branch will be evaluated as True.
- Inside the Level, scale up and add multiple versions of the **Cube Mesh **to provide additional cover points to break the line of sight.[image: Scale up and add multiple versions of the Cube Mesh to provide additional cover points to break line of sight]
- Click the **Play **button from the Toolbar to play in the Level.

## 9 - End Result

While playing in the Editor, the AI will patrol around randomly until seeing the Player. After seeing the Player, it will rotate and face the Player and attempt to move to a new location when losing sight of the Player. Using EQS, it will find a location that will provide a line of sight to the Player but remain a distance away. If it does not see the Player again while moving to a new location, after some time the AI will give up chasing and go back to patrolling as portrayed in the video below.

You can use the AI Debugging Tools (-> ai-debugging-in-unreal-engine) to view any active EQS queries (in addition to Behavior Trees or Perception info). To activate AI Debugging at runtime, press the **' **(apostrophe) key, then select 1 (for general AI debugging), 2 (for Behavior Trees), 3 (for EQS), or 4 (for AI Perception). Below, we activate AI Debugging and bring up the EQS Debugging tools.

While the EQS Debugging tools are running, you can see the points from our Grid test along with their score values. You will also see which point was selected, denoted with the text **Winner**. These tools are useful to see which points are being evaluated and why one point may have been selected over another point based on the score values.

In addition to using the EQS Debugging tools, there is a special type of Pawn called the **EQS Testing Pawn **that can be used to debug EQS queries while in the Editor. You can create this Pawn, by creating a new Blueprint Class of the **EQS Testing Pawn **Class.

[image: You can create EQS Testing Pawn by creating a new Blueprint Class of the EQS Testing Pawn Class]

Our current setup uses the Player Character as a Context for evaluation in our EQS Test. To test while the game is not running, we would need to make a slight modification to the **EQS_PlayerContext **Blueprint and override the **Provide Actors Set **function.

[image: We need to make a slight modification to the EQS_PlayerContext Blueprint and override the Provide Actors Set function]

We can use **Get All Actors of Class **set to **BP_ThirdPersonCharacter** which provides the **Resulting Actors Set**:

[image: We can use Get All Actors of Class set to BP_ThirdPersonCharacter which provides the Resulting Actors Set]

When adding the EQS Testing Pawn to the Level, in the **Details **panel, you can assign the **Query Template **(which we've set to our **EQS_FindPlayer** query).

[image: You can assign the Query Template in the Details panel,]

This enables you to see the results of your test while in you are in the Editor as seen below:

EQS Data is also being recorded through VisLog which you can reference. Please see **Visual Logger** for more information.

- ai
- behavior trees
- eqs
- eqs quickstart

On this page

- 1 - Required Project Setup (-> environment-query-system-quick-start-in-unreal-engine)
- 2 - Environment Query Context (-> environment-query-system-quick-start-in-unreal-engine)
- 3 - EQS Setup (-> environment-query-system-quick-start-in-unreal-engine)
- 4 - Blackboard and Behavior Tree Setup (-> environment-query-system-quick-start-in-unreal-engine)
- 5 - Behavior Tree: Patrol Setup (-> environment-query-system-quick-start-in-unreal-engine)
- 6 - Behavior Tree: In Combat Setup (-> environment-query-system-quick-start-in-unreal-engine)
- 7 - AI Controller Setup (-> environment-query-system-quick-start-in-unreal-engine)
- 8 - Final Setup (-> environment-query-system-quick-start-in-unreal-engine)
- 9 - End Result (-> environment-query-system-quick-start-in-unreal-engine)
