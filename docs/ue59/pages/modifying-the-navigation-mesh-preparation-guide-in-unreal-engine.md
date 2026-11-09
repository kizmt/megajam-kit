# Modifying the Navigation Mesh Preparation Guide

https://dev.epicgames.com/documentation/en-us/unreal-engine/modifying-the-navigation-mesh-preparation-guide-in-unreal-engine?application_version=5.9

> This guide covers the preliminary steps needed to learn about modifying the Navigation Mesh.

[image: Modifying the Navigation Mesh Preparation Guide]

## Overview

This document will guide you through the preliminary steps of creating a Level and AI Agent to demonstrate the different ways you can modify the Navigation Mesh.

Alternatively, you can download the full sample project, which includes all the material covered in this guide.

## Objectives

- Create a simple Level and add navigation by placing a Nav Mesh Bounds Volume Actor in the Level.

- Modify the ThirdPersonCharacter Blueprint to roam around the Level using the Navigation System.

## 1 - Required Setup

- In the **New Project Categories** section of the menu, select **Games > Third Person** template. [image: Select the Games category and select Games and the Third Person template]

- Select the **Blueprint **and **No Starter Content** options and click **Create**. [image: Select Blueprint and No Starter Content and click Create ]

### Section Results

You have created a new Third Person project and are now ready to build a basic Level with a Navigation Mesh.

## 2 - Creating Your Test Level

- Click **File > New Level** on the Menu Bar. [image: Create a new Level]

- Select the **Basic** Level and click **Create**. [image: Select the Basic Level and click Create]

- Select the **Floor **Static Mesh Actor in the **Outliner** and from the **Details **panel, set the **Scale **to X = 10, Y = 10, Z = 1. [image: Select the Floor Static Mesh Actor in the World Outliner] [image: Set the Scale to X = 10, Y = 10, Z = 1]

- Inside the **Content Drawer**, go to **LevelPrototyping > Meshes** and drag the **TemplateFloor **Static Mesh into the Level. [image: Drag the Template Floor Static Mesh into the Level]

- Go to the **Place Actors** panel and search for **Nav Mesh Bounds Volume**. Drag it into the Level and place it above the floor mesh. [image: Drag the Nav Mesh Bounds Volume to the Level]

- With the **NavMeshBoundsVolume** selected, go to the** Details Panel **and set the **Scale **to X = 20, Y = 20, Z = 5 to cover the entire floor area. Unreal Engine will automatically generate navigation inside the navigation bounds by default. A Navmesh Actor **RecastNavMesh-Default** should have also been added to the Level. Press the **P** key to visualize the Navigation Mesh in the Level. If no navigation is generated, go to Project Settings > Navigation System and enable the Auto Create Navigation Data checkbox. [image: Set the Scale to X = 20, Y = 20, Z = 5] [image: The Navigation Mesh now covers the entire floor]

- Go to the **Place Actors** panel and under the **Shapes** category drag the **Cube **Static MeshActor into your Level. [image: Drag the Cube Static Mesh Actor into your Level]

- With the **Cube **selected, go to the** Details Panel **and set the **Scale **to X = 1, Y = 1, Z = 5. [image: Set the Scale to X = 1, Y = 1, Z = 5] [image: The Cube is now rescaled]

- Drag three more **Cubes **into the level and scale them like the one above. Place them around your floor to create four pillars as seen below. [image: Drag three more Cubes into the level and scale them like the one above]

- Next, add a stair and a platform in the middle. Inside the **Content Drawer**, go to **ThirdPerson > Meshes** and drag the **Linear_Stair_StaticMesh** into the Level. [image: Add a stair and a platform in the middle]

- With the stairs selected, go to the** Details Panel **and set the **Scale **to X = 1.5, Y = 1, Z = 1.3. [image: Set the Scale to X = 1.5, Y = 1, Z = 1.3]

- With the stairs selected, drag the mesh while holding the **Alt** key to duplicate it. [image: Duplicate the stairs mesh]

- Go to the **Place Actors** panel and under the **Shapes **category drag the **Cube **Static Mesh** **Actor into your Level. Go to the** Details Panel **and set the **Scale **to X = 14, Y = 4, Z = 0.1. Place the Actor on the edge of the stairs to create a platform, as seen below. [image: Drag a Cube Static Mesh Actor into your Level and set the scale to X = 14, Y = 4, Z = 0.1]

- Go to the **Place Actors** panel and under the **Basic **category drag the **Sphere **Static Mesh** **Actor into your Level. [image: Drag a Sphere Static Mesh Actor into your Level]

- With the **Sphere **selected, go to the **Details **Panel and from the **Collision **section, set the **Collision Presets** to **No Collision**. [image: Set the Collision Presets to No Collision]

- Finally, duplicate the spheres and place them around your Level as shown below. [image: Duplicate the spheres and place them around your Level]

### Section Results

In this section, you created a simple Level and added a Nav Mesh Bounds Volume. You also added five spheres that will serve as target Actors for the Agent.

## 3 - Creating Your Agent

In this section, you will create an AI Agent that will move between a list of target Actors.

- In the **Content Drawer**, right-click and select **New Folder** to create a new folder. Name the folder **NavigationSystem**.

- In the** Content Drawer**, go to **ThirdPerson > Blueprints** and select the **BP_ThirdPersonCharacter **Blueprint. Drag it into the **NavigationSystem **folder and select the option **Copy Here**. [image: Copy the Third Person Character Blueprint to the Navigation System folder]

- Go to the **NavigationSystem **folder and rename the Blueprint to **BP_NPC_ModNavMesh**. Double-click the Blueprint to open it in the Blueprint Editor and go to the **Event Graph**. Select all input nodes and delete them.

- Right-click the **Event Graph**, then search for and select **Add Custom Event**. Name the event **MoveNPC**. [image: Right click the Event Graph, then search for and select Add Custom Event. Name it Move NPC]

- Go to the **My Blueprint** panel and click the **Add (+)** button next to **Variables **to create a new variable. Name the variable **TargetList**. [image: Create a new variable and name it Target List]

- Go to the **Details **panel and click the dropdown next to **Variable Type**. Search for and select **Actor > Object Reference**. [image: Set the variable type to Actor Object Reference]

- Click the **blue sphere** icon next to the Actor selection and click the **Array **option, as shown below. Click the** Instance Editable** checkbox to enable it. [image: Click the blue sphere icon next to Actor selection and click the Array option] [image: Click the Instance Editable checkbox to enable it]

- Drag the **TargetList **variable to the **Event Graph** and select the option **Get TargetList**.

- Drag from the **TargetList **node, then search for and select **Last Index**. [image: Drag from the TargetList node, then search for and select Last Index]

- Drag from the **TargetList **node and search for and select **Get (a copy)**. [image: Drag from the TargetList node and search for and select Get a copy]

- Drag from the **green **pin of the **Get **node, then search for and select **Random Integer in Range**. Connect the **green **pin of the **Last Index** node to the **Max **pin of the **Random Integer in Range** node, as seen below. [image: Drag from the green pin of the Get node, then search for and select Random Integer in Range] [image: Connect the green pin of the Last Index node to the Max pin of the Random Integer in Range node]

- Drag from the **Get **node, then search for and select **Promote to variable**. Name the variable **CurrentTarget **and connect it to the **MoveNPC **node. [image: Drag from the Get node, then search for and select Promote to variable] [image: Name the variable Current Target and connect it to the Move NPC node]

- Drag from the **CurrentTarget **node, then search for and select **Is Valid**. Connect the **IsValid **macro node to the **Set CurrentTarget** node. [image: Drag from the CurrentTarget node, then search for and select Is Valid] [image: Connect the IsValid macro node to the Set CurrentTarget node]

- Drag the **CurrentTarget** variable to the **Event Graph**, then select **Get Current Target**. Drag from the **CurrentTarget **node, then search for and select **Get Actor Location**. [image: Drag from the CurrentTarget node, then search for and select Get Actor Location]

- Drag from the **Return Value** of the **GetActorLocation **node, then search for and select **Get Random Reachable Point In Radius**. Set the **Radius **value to **100**. [image: Drag from the Return Value of the GetActorLocation node, then search for and select Get Random Reachable Point In Radius] [image: Set the Radius value to 100]

- Drag from the **Random Location** pin of the **GetRandomReachablePointInRadius **node and select **Promote to variable**. Name the variable **RandomLocation**. Connect the **RandomLocation **node to the **IsValid **node as shown below. [image: Drag from the Random Location pin of the GetRandomReachablePointInRadius node and select Promote to variable. Name the variable Random Location] [image: Connect the RandomLocation node to the IsValid node]

- Drag from the **RandomLocation **node, then search for and select **AI MoveTo**. [image: Drag from the Random Location node, then search for and select AI MoveTo]

- Drag from the **Pawn **pin of the **AI MoveTo** node, then search for and select **Get a reference to self**. Connect the **yellow **pin of the **RandomLocation **node to the **Destination **pin of the **AI MoveTo** node. Finally, set the **Acceptance Radius** of the **AI MoveTo** node to 50, as seen below. [image: Drag from the Pawn pin of the AI MoveTo node, then search for and select Get a reference to self] [image: Connect the yellow pin of the Random Location node to the Destination pin of the AI MoveTo node]

- Drag from the **On Success** pin of the **AI Move To** node, then search for and select **Delay**. Set the **Duration **of the node** **to 4. Drag from the **Completed **pin of the **Delay **node, then search for and select **MoveNPC**, as seen below. [image: Drag from the On Success pin of the AI Move To node, then search for and select Delay. Set the Duration to 4. Drag from the Delay node and add a Move NPC node]

- Repeat the steps above to add the nodes to the **On Fail** pin of the **AI Move To** node. Set the **Duration **of the **Delay **node to 0.1. [image: Repeat the steps above to add the nodes to the On Fail pin of the AI Move To node. Set the Duration of the Delay node to 0.1]

- Right-click the **Event Graph**, then search for and select **Event Begin Play**. Drag from the **Event Begin Play** node, then search for and select **MoveNPC**. [image: Right-click the Event Graph, then search for and select Event Begin Play] [image: Drag from the Event Begin Play node, then search for and select Move NPC]

- **Compile **and **Save **the Blueprint.

- Drag your **BP_NPC_ModNavMesh **Blueprint into your Level and under the **Details **panel find the **Target List** and click the **Add (+)** button to add a new target Actor. [image: Drag your BP_NPC_ModNavMesh Blueprint into your Level] [image: In the Details panel find the Target List and click the Add button to add a new target Actor]

- Click the dropdown, then search for and select the **Sphere **Actor you created earlier. [image: Click the dropdown, then search for and select the Sphere Actor]

- Repeat the step above to add the remaining four **Sphere **Actors. [image: Repeat the step above to add the remaining four Sphere Actors]

- Click **Simulate **to see your Agent roam between goals in your Level. [image: Click Simulate to see your Agent roam between goals in your Level]

### Section Results

In this section, you created an Agent that roams between a list of target Actors. You can now move on to learning about Modifying the Navigation System (-> overview-of-how-to-modify-the-navigation-mesh-in-unreal-engine).

- ai
- navigation

On this page

- Overview (-> modifying-the-navigation-mesh-preparation-guide-in-unreal-engine)
- Objectives (-> modifying-the-navigation-mesh-preparation-guide-in-unreal-engine)
- 1 - Required Setup (-> modifying-the-navigation-mesh-preparation-guide-in-unreal-engine)
- Section Results (-> modifying-the-navigation-mesh-preparation-guide-in-unreal-engine)
- 2 - Creating Your Test Level (-> modifying-the-navigation-mesh-preparation-guide-in-unreal-engine)
- Section Results (-> modifying-the-navigation-mesh-preparation-guide-in-unreal-engine)
- 3 - Creating Your Agent (-> modifying-the-navigation-mesh-preparation-guide-in-unreal-engine)
- Section Results (-> modifying-the-navigation-mesh-preparation-guide-in-unreal-engine)
