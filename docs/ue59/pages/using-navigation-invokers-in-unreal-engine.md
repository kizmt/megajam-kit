# Using Navigation Invokers

https://dev.epicgames.com/documentation/en-us/unreal-engine/using-navigation-invokers-in-unreal-engine?application_version=5.9

> This guide shows how to use Navigation Invokers.

[image: Using Navigation Invokers]

## Overview

Unreal Engine's **Navigation System** allows Agents to navigate the Level using a **Navigation Mesh** for pathfinding. In addition to the various **Runtime Generation** methods for the Navigation Mesh, the system also includes a way to only build the navigation locally around specific targets.

**Navigation Invokers** are Blueprint Actor components that generate the Navigation Mesh around the Agent at runtime. Using Navigation Invokers removes the need to build the Navigation Mesh in the editor and can also limit the number of tiles generated at runtime.

Navigation Invokers are ideal for big Levels where building the Navigation Mesh in the editor is impractical.

## Goals

In this guide, you will learn to use Navigation Invokers with your Agents to generate the Navigation Mesh during gameplay.

## Objectives

- Create a new Level and configure the Navigation System to use Navigation Invokers.

- Modify the ThirdPersonCharacter Blueprint to roam around the Level using Navigation Invokers.

## 1 - Required Setup

- In the **Unreal Project Browser** window, select the **Games** category and **Third Person** template. [image: Select the Games and ThirdPerson category and click Next]

- Enter a **Project Name** and click **Create**. [image: Select Blueprint and No Starter Content and click Create Project]

### Section Results

You created a new Third Person project and are now ready to learn about Navigation Invokers.

## 2 - Creating Your Test Level

- Click **File > New Level** from the Menu Bar. [image: Click New Level]

- Select the **Basic** Level. [image: Select the Basic Level]

- Select the **Floor **Static Mesh Actor in the **Outliner** and go to the **Details **panel. Set the **Scale **to X = 100, Y = 100, Z = 1. [image: Select the Floor Static Mesh Actor in the Outliner] [image: Set the Scale to X = 100, Y = 100, Z = 1]

- Click **Settings > Project Settings** and go to the **Navigation System** category. Enable the **Generate Navigation Only Around Navigation Invokers** checkbox. [image: Click Project Settings] [image: Enable the Generate Navigation Only Around Navigation Invokers checkbox]

- (Optional) The **Invokers Maximum Distance from Seed** property sets the maximum distance between players (seeds by default) and Invokers that will be considered to regenerate tiles around those Invokers. In the example below, we set the maximum distance to 30,000 units (300 meters). Any Invokers farther from the player will not trigger navigation regeneration. [image: Set the Invokers Maximum Distance from Seed to 30,000]

- Go to the **Navigation Mesh **category and scroll down to the **Runtime **section. Click the **Runtime Generation** dropdown and select **Dynamic**. [image: Click the Runtime Generation dropdown and select Dynamic]

- Go to the **Place Actors** panel and search for **NavMeshBoundsVolume**. Drag it into the Level and place it on the floor mesh. Scale the **NavMeshBoundsVolume** to X = 500, Y=500, Z = 10. [image: Drag the Nav Mesh Bounds Volume to the Level] [image: Set the Scale to X = 500, Y=500, Z = 10]

### Section Results

In this section, you created a new Level and configured the Navigation System to use Navigation Invokers.

## 3 - Creating your Agent

- In the **Content Drawer**, right-click and select **New Folder** to create a new folder. Name the folder **NavigationSystem**.

- In the** Content Drawer**, go to **ThirdPerson> Blueprints** and select the **BP_ThirdPersonCharacter **Blueprint. Drag it into the **NavigationSystem** folder and select the option **Copy Here**. [image: Drag the Third Person Character Blueprint to the Navigation System folder and select Copy Here]

- Navigate to the **NavigationSystem** folder and rename the Blueprint to **BP_NPC_Invoker**. Double-click the Blueprint to open it and go to the **Event Graph**. Select all input nodes and delete them.

- Right-click the **Event Graph**, then search for and select **Add Custom Event**. Name the event **MoveNPC**. [image: Right-click the Event Graph, then search for and select Add Custom Event. Name the event Move NPC]

- Right-click the **Event Graph**, then search for and select **Get Actor Location**. [image: Right-click the Event Graph, then search for and select Get Actor Location]

- Drag from the **GetActorLocation **node and search for and select **Get Random Reachable Point In Radius**. Set the **Radius **to 1000. [image: Drag from the Get Actor Location node and search for and select Get Random Reachable Point In Radius]

- Drag from the **Random Location** pin of the **GetRandomReachablePointInRadius **node and select **Promote to variable**. [image: Drag from the Random Location pin of the Get Random Reachable Point In Radius node and select Promote to variable]

- Connect the **MoveNPC **node to the **RandomLocation** node you just created. [image: Connect the Move NPC node to the Random Location node]

- Right-click the **Event Graph**, then search for and select **AI Move To**. Connect the **RandomLocation **node to the **AI Move To** node. [image: Right-click the Event Graph, then search for and select AI Move To]

- Right-click the **Event Graph**, then search for and select **Get a reference to self**. [image: Right-click the Event Graph, then search for and select Get a reference to self]

- Connect the **Self **node to the **Pawn **pin of the **AI Move To** node. Connect the **yellow **pin of the **Random Location** node to the **Destination **pin of the **AI Move To** node, as seen below. [image: Connect the Self node to the Pawn pin of the AI Move To node. Connect the yellow pin of the Random Location node to the Destination pin of the AI Move To node]

- Drag from the **On Success** pin of the **AI Move To** node, then search for and select **Delay**. Set the **Duration **of the node** **to 4. Drag from the **Completed **pin of the **Delay **node, then search for and select **MoveNPC**, as seen below. [image: Drag from the On Success pin of the AI Move To node and add a Delay node. Set the Duration to 4. Drag from the Duration node and add a Move NPC node]

- Repeat the steps above to add these nodes to the **On Fail** pin of the **AI Move To** node. Set the **Duration **of the **Delay **node to 0.1. [image: Repeat the steps above to add these nodes to the On Fail pin]

- Right-click the **Event Graph**, then search for and select **Event Begin Play**. Drag from the **Event Begin Play** node, then search for and select **MoveNPC**. [image: Right-click the Event Graph, then search for and select Event Begin Play] [image: Drag from the Event Begin Play node, then search for and select Move NPC]

- Go to the **Components **tab, click the **+Add** dropdown, then search for and select **Navigation Invoker**. [image: Go to the Components tab, click the Add Component dropdown, then search for and select Navigation Invoker]

- With the **Navigation Invoker **component selected, go to the **Details **panel and find the **Navigation **section. Here you can change the **Tile Generation Radius** (radius around the actor used to generate Navigation Mesh tiles) and **Tile Removal Radius** (radius from the actor used to remove Navigation Mesh tiles). For this example, set these values to **3000 **and **5000**, respectively. [image: Set the Tile Generation Radius to 3000 and the Tile Removal Radius to 5000]

- **Compile **and **Save **the Blueprint.

- Drag several **BP_NPC_Invoker **Blueprints to your Level and click **Simulate **to see the navigation generating around each Agent. [image: Drag several BP_NPC_Invoker Blueprints to your Level] If you don't see the navigation, press P on your keyboard to visualize the Navigation Mesh. [image: Your Agents are now moving in the Level]

### Section Results

In this section, you created an Agent that roams around the Level and uses the Navigation Invoker component to build the Navigation Mesh around itself.

- ai
- navigation

On this page

- Overview (-> using-navigation-invokers-in-unreal-engine)
- Goals (-> using-navigation-invokers-in-unreal-engine)
- Objectives (-> using-navigation-invokers-in-unreal-engine)
- 1 - Required Setup (-> using-navigation-invokers-in-unreal-engine)
- Section Results (-> using-navigation-invokers-in-unreal-engine)
- 2 - Creating Your Test Level (-> using-navigation-invokers-in-unreal-engine)
- Section Results (-> using-navigation-invokers-in-unreal-engine)
- 3 - Creating your Agent (-> using-navigation-invokers-in-unreal-engine)
- Section Results (-> using-navigation-invokers-in-unreal-engine)
