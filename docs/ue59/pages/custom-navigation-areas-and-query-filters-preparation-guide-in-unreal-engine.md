# Custom Navigation Areas and Query Filters Preparation Guide

https://dev.epicgames.com/documentation/en-us/unreal-engine/custom-navigation-areas-and-query-filters-preparation-guide-in-unreal-engine?application_version=5.9

> This guide covers the preliminary steps needed to learn about Custom Navigation Areas and Query Filters.

[image: Custom Navigation Areas and Query Filters Preparation Guide]

## Overview

This document will guide you through the preliminary steps of creating a Level and AI Agent to learn about the Custom Areas and Query Filters in the Navigation System.

You can also download the full sample project, which includes all the material covered in this guide.

## Objectives

- Create a new Level and set up navigation by placing a Navigation Mesh Actor in the Level.

- Modify the ThirdPersonCharacter Blueprint to navigate toward its target by using specific Query Filters.

## 1 - Required Setup

- In the **New Project Categories** section of the Unreal Project Browser, select **Games > Third Person** template. [image: Select the Games category and click Third Person]

- Select the **Blueprint **and **No Starter Content** options and click **Create**. [image: Select Blueprint and No Starter Content and click Create]

### Section Results

You have created a new Third Person project and are now ready to learn about creating Area Classes and Navigation Query Filters.

## 2 - Creating Your Test Level

- Click **File > New Level** on the Menu Bar. [image: Click New Level]

- Select the **Basic** Level and click **Create**. [image: Select the Basic Level and click Create]

- Select the **Floor **Static Mesh Actor in the **Outliner** and on the **Details** panel, set the **Scale** to X = 10, Y = 10, Z = 1. [image: Select the Floor Static Mesh Actor in the World Outliner] [image: Set the Scale to X = 10, Y = 10, Z = 1]

- Go to the **Place Actors** panel and search for **NavMeshBoundsVolume**. Drag it into the Level and place it on the floor mesh. [image: Drag a Nav Mesh Bounds Volume Actor to the Level]

- With the **NavMeshBoundsVolume** selected, go to the **Details **panel and set the **Scale **to X = 5, Y = 10, Z = 1. [image: Set the Scale to X = 5, Y = 10, Z = 1]

- Go to the **Place Actors** panel and go to the **Shapes** category. Drag a **Sphere **Actor into the Level. [image: Drag a Sphere Actor into the Level]

### Section Results

In this section, you created a new Level and added a Navigation Mesh and a Sphere Actor. You are now ready to create an Agent that will walk toward the sphere goal.

## 3 - Creating Your Agent

In this section, you will create an Agent that navigates to its target Actor.

- In the **Content Drawer**, right-click and select **New Folder** to create a new folder. Name the folder **NavigationSystem**.

- In the** Content Drawer**, go to **ThirdPersonBP > Blueprints** and select the **BP_ThirdPersonCharacter **Blueprint. Drag it to the **NavigationSystem** folder and select the option **Copy Here**. [image: Drag the Third Person Character Blueprint to the Navigation System folder and select Copy Here]

- Navigate to the **NavigationSystem** folder and rename the Blueprint to **BP_NPC_CustomZone**. Double-click the Blueprint to open it and go to the **Event Graph**. Select all input nodes and delete them.

- Right-click the **Event Graph,** then search for and select **Add Custom Event**. Name the event **MoveNPC**. [image: Right-click the Event Graph, then search for and select Add Custom Event. Name the event Move NPC]

- Go to the **My Blueprint** panel and click the **Add (+) button** next to **Variables **to create a new variable. Name the variable **Target**. [image: Click the Add next to Variables to create a new variable and name it Target]

- Go to the **Details **panel and click the **Variable Type** dropdown. Search for **Actor **and select the **Object Reference**. Enable the **Instance Editable** checkbox. [image: Click the Variable Type dropdown and select the Actor Object Reference] [image: Enable the Instance Editable checkbox]

- Drag the **Target **variable to the **Event Graph** and select the option **Get Target**. Drag from the **Target **node, then search for and select the **Is Valid** macro, as shown below. [image: Drag from the Target node, then search for and select the Is Valid macro]

- Right-click the **Event Graph**, then search for and select **Get reference to self**. [image: Right-click the Event Graph, then search for and select Get reference to self]

- Drag from the **Self **node, then search for and select **Get AIController**. [image: Drag from the Self node, then search for and select Get AI Controller]

- Drag from the **AI Controller** node, then search for and select **Move to Actor**. [image: Drag from the AI Controller node, then search for and select Move to Actor]

- Connect the **Is Valid** pin of the **Is Valid** node to the **Move to Actor** node. Set the **Acceptance Radius** of the **Move to Actor** node to 50. Drag the **Target ** variable and connect it to the **Goal ** pin of the **Move to Actor** node. [image: Connect the Is Valid pin of the Is Valid node to the Move to Actor node]

- Right-click the **Filter **Class pin of the **Move to Actor** node and select **Promote to Variable**. Go to the **Details **panel and enable the **Instance Editable** checkbox. [image: Right-click the Filter Class pin of the Move to Actor node and select Promote to Variable] [image: Enable the Instance Editable checkbox]

- Right-click the **Event Graph**, then search for and select **Event Begin Play**. Drag from the **Event Begin Play** node and search for and select **MoveNPC**. [image: Right-click the Event Graph, then search for and select Event Begin Play] [image: Drag from the Event Begin Play node and search for and select MoveNPC]

- **Compile **and **Save **the Blueprint. The final Blueprint should look like the image below. [image: This is the final Blueprint Setup]

- Drag the **BP_NPC_CustomZone **Blueprint into your Level. Navigate to the **Details **panel and click the dropdown next to **Target**. Search for and select **Sphere**, as seen below. [image: Drag the BP_NPC_CustomZone Blueprint into your Level] [image: Navigate to the Details panel and click the dropdown next to Target. Search for and select Sphere]

- Press **Simulate **and watch as your Agent moves toward the Sphere. [image: Your Agent is now moving towards the Sphere]

### Section Results

In this section, you created an Agent that navigates toward its goal and can use a Navigation Query Filter. You are now ready to learn about adding Custom Navigation Areas and Query Filters (-> custom-navigation-areas-and-query-filters-quick-start-in-unreal-engine).

- ai

On this page

- Overview (-> custom-navigation-areas-and-query-filters-preparation-guide-in-unreal-engine)
- Objectives (-> custom-navigation-areas-and-query-filters-preparation-guide-in-unreal-engine)
- 1 - Required Setup (-> custom-navigation-areas-and-query-filters-preparation-guide-in-unreal-engine)
- Section Results (-> custom-navigation-areas-and-query-filters-preparation-guide-in-unreal-engine)
- 2 - Creating Your Test Level (-> custom-navigation-areas-and-query-filters-preparation-guide-in-unreal-engine)
- Section Results (-> custom-navigation-areas-and-query-filters-preparation-guide-in-unreal-engine)
- 3 - Creating Your Agent (-> custom-navigation-areas-and-query-filters-preparation-guide-in-unreal-engine)
- Section Results (-> custom-navigation-areas-and-query-filters-preparation-guide-in-unreal-engine)
