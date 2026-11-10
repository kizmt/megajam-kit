# StateTree Quick Start Guide

https://dev.epicgames.com/documentation/en-us/unreal-engine/statetree-quick-start-guide?application_version=5.9

> Quickstart guide on using the StateTree system in Unreal Engine.

[image: StateTree Quick Start Guide]

## Overview

**StateTree** is a general-purpose hierarchical state machine that combines the **Selectors** from behavior trees with **States** and **Transitions** from state machines. Users can create highly performant logic that stays flexible and organized.

You can learn more about State Trees by reading the State Tree Overview (-> overview-of-state-tree-in-unreal-engine) documentation.

## Goals

In this guide you will use a State Tree to create a moving target the player can shoot and destroy.

## Objectives

- Create a **Blueprint** for a target Actor the player can shoot and destroy.
- Create the State Tree that contains the logic to move and destroy the target actor.
- Create State Tree Tasks and use them in the State Tree.
- Create a State Tree Evaluator and use it in the State Tree.

## Required Setup

- Create a new project then select the **Games** category and the **First Person** template. Enter your project's location and name. Click **Create**.[image: Create a new First Person project]Click image for full size.
- Click **Settings > Plugins** to open the **Plugins** window.[image: Open the Plugins window]
- Search for and **enable** the **GameplayStateTree** and **StateTree** plugins. Restart the Unreal Engine editor.[image: Open the Plugins window]

### Section Results

In this section, you created a new project and enabled the State Tree plugins. You are now ready to create the State Tree you will use in the target Actor.

## Create the State Tree

In this section, you will create a State Tree that will be used by the target Actor. This State Tree is intended to be used as a component of the target Actor, so you will use the **State Tree Component Schema** for this example.

- In the **Content Browser**, right click and select **Artificial Intelligence > StateTree**.[image: In the Content Browser, right click and select Artificial Intelligence > StateTree]
- Select the **StateTreeComponentSchema** class and click **Select**.[image: Select the StateTreeComponentSchema class and click Select]
- Name the State **Tree ST_ShootingTarget**.[image: Name the State Tree ST ShootingTarget]

### Section Results

In this section, you created a State Tree with the Component Schema that will be used by a target Actor.

## Create the Shooting Target Blueprint

In this section, you will create the Blueprint for the target Actor that will move and receive damage from the player.

- In the **Content Browser**, right click and select **Blueprint Class** from the **Create Basic Asset** section.In the **Pick Parent Class** window, click the **Actor** button to create a new Actor Blueprint.
- Name the Blueprint **BP_ShootingTarget**.

[image: Select Blueprint Class from the Create Basic Asset section]

[image: Click the Actor button to create a new Actor Blueprint]

[image: Name the Blueprint BP_ShootingTarget]

- Open **BP_ShootingTarget** and go to the **Components** window. Click **+Add** and select **Static Mesh**.Go to the **Details** panel and scroll down to the **Static Mesh** section.
- Click the **Static Mesh** dropdown and select **1M_Cube**.

[image: Click +Add and select Static Mesh]

[image: Click the Static Mesh dropdown and select 1M_Cube]

- Set the **Scale** of the **Static Mesh** to **X = 0.2**, **Y = 2.0**, **Z = 2.0**.[image: Set the Scale of the Static Mesh to X = 0.2, Y = 2.0, Z = 2.0]
- In the **Components** window, click **+Add** and select **StateTree**.Go to the **Details** panel and scroll down to the **AI** section.
- Click the **State Tree** dropdown and select **ST_ShootingTarget**.

[image: Click +Add and select StateTree]

[image: Click the State Tree dropdown and select ST Shooting Target]

If the State Tree does not appear in the dropdown, it means that the incorrect schema was selected. Make sure to select the **StateTreeComponentSchema** to use in the State Tree component.

- Right-click the **Static Mesh** component and select **Add Event > Add OnComponentHit**.[image: Right click the Static Mesh component and select Add Event then Add OnComponentHit]
- Create a new variable and name it **HitCount**.Go to the **Details** panel and set the **Variable Type** to **Integer**.

[image: Create a new variable and name it HitCount]

[image: Set the Variable Type to Integer]

- Drag the **HitCount** variable to the **Event Graph** and select **Get HitCount**.Drag from the **HitCount** node and search for and select **Increment Int**.
- Connect the **On Component Hit** node to the **Increment Int** node.

[image: Connect the On Component Hit node to the Increment Int node]

- In the **Event Graph**, right click and search for then select **Add Custom Event**. Name the event **DelayedDestroy**.[image: Add a Custom Event and name it DelayedDestroy]
- Drag from the **DelayedDestroy** node and search for then select** Delay**.[image: Add a Delay node]
- Drag from the **Delay** node and search for then select **Destroy Actor**.[image: Add a Destroy Actor node]

### Section Results

In this section, you created the Shooting Actor Blueprint the player will shoot during gameplay. You are now ready to create the Idle and Dead States of the State Tree.

## Create the Idle and Dead States

- Go back to **ST_ShootingTarget** and under the **Schema** section, click the **Context Actor Class** dropdown. Select **BP_ShootingTarget**.[image: Click the Context Actor Class dropdown and select BP_ShootingTarget]
- Click **+ Add State** to create a new State and name it **Idle**.[image: Click + Add State to create a new State and name it Idle]
- Go to the **Details** panel and scroll down to the **Transitions** section.Expand the **Go to State** section and click the **Transition To** dropdown. Select **Root**. This will set the State Tree to transition back to the Root State once this State is completed.
- Click the **Trigger** dropdown and select **On State Completed**.

[image: Click the Transition To dropdown and select Root]

[image: The Idle State now shows the Transition to Root]

- Create another State and name it **Dead**.[image: Create another State and name it Dead]
- Select the **Idle** State and add another **Transition**.Click the **Trigger** dropdown and select **On Tick**.
- Click the **Transition To** dropdown and select **Dead**.

[image: Click the Trigger dropdown and select On Tick. Click the Transition To dropdown and select Dead]

- Add a new **Condition** by clicking on the **plus sign**. Click the dropdown and select **Integer Compare**.Expand the structure and click on the **Left Bind** dropdown and select **Actor > Hit Count**. This binds the value of **Hit Count** inside **BP_ShootingTarget** to the StateTree Condition.
- Enter **5** as the value of the **Right** integer.

[image: Expand the structure and click on the Left Bind dropdown and select Actor > Hit Count]

[image: Expand the structure and click on the Left Bind dropdown and select Actor > Hit Count]

[image: Enter 5 as the value of the Right integer]

### Section Results

In this section, you added the Idle and Dead States to the State Tree. You are now ready to create a State Tree Task that will handle the Dead State.

## Create a New State Tree Task

In this section, you will create a new **State Tree Task** that will destroy the Actor when the **Dead** State is executed.

- In the **Content Browser**, right click and select **Blueprint Class**.In the **Pick Parent Class** window, expand the **All Classes** dropdown and search for and select **StateTreeTaskBlueprintBase**.
- Click **Select** to create the asset.
- Name the Blueprint class **STT_Destroy**.

[image: Select Blueprint Class from the Create Basic Asset section]

[image: Expand the All Classes dropdown and search for and select StateTreeTaskBlueprintBase]

[image: Name the Blueprint class STT Destroy]

- Open **STT_Destroy** by double-clicking it in the **Content Browser**. Go to the **Functions** section and click the **Override** dropdown. Select **ExitState**.[image: Go to the Functions section and click the Override dropdown. Select ExitState]
- Create a new variable and name it **Actor**. Set its type to **Actor Object Reference**.Go to the **Details** panel, and click in the **Category** field. Enter **Context**.
- Drag the **Actor** variable to the **Event Graph** and select **Get Actor**.
- Drag from the **Actor** node and search for and select **Cast to BP_ShootingTarget**.
- Drag from the **As BP Shooting Target** pin of the **Cast to BP_ShootingTarget** node and search for then select **Delayed Destroy**.
- Connect the **Event ExitState** node to the **Cast to BP_ShootingTarget** node.

[image: Create a new variable and name it Actor. Set its type to Actor Object Reference]

[image: Go to the Details panel, and set its Category to Context]

[image: Connect the Event ExitState node to the Cast to BP_ShootingTarget node]

### Section Results

In this section, you created a new State Tree Task that runs once the Dead State is executed. This Task destroys the Actor.

## Finish the Dead State

- Go back to **ST_ShootingTarget** and select the **Dead** State. Add a new **Task** and select **Debug Text Task** from the dropdown.Enter **'Actor Destroyed'** in the **Text** field.
- Enter a **Text Color** and a **Font Scale**.

[image: Add a new Task and select Debug Text Task from the dropdown]

- Add another **Task** and select **Delay Task** from the dropdown.Enter **2.0** for the **Duration**.

[image: Add another Task and select Delay Task from the dropdown]

- Add a third **Task** and select **STT_Destroy** from the dropdown. This will destroy the Actor.[image: Add a third Task and select STT_Destroy from the dropdown]
- Create a new **Transition** and set the **Trigger** to **On State Completed**.Set the **Transition To** dropdown to **Tree Succeeded**.

[image: Create a new Transition and set the Trigger to On State Completed. Set the Transition To dropdown to Tree Succeeded]

- Drag **BP_ShootingTarget** to your Level and press **Play**. Shoot the Blueprint and confirm the State Tree is working.[image: Drag BP_ShootingTarget to your Level and press Play][image: The player shoots and destroys the Shooting Target]

### Section Results

In this section, you completed the Dead State and tested that the Shooting Actor Blueprint can receive damage and be destroyed.

## Add a Spline Path

In this section, you will create an Actor with a Spline component. This spline will be used by the Shooting Target Blueprint to move in the Level.

- In the **Content Browser**, right click and select **Blueprint Class** from the **Create Basic Asset** section.In the **Pick Parent Class** window, click the **Actor** button to create a new Actor Blueprint.
- Name the Blueprint **BP_SplineActor**.

[image: Select Blueprint Class from the Create Basic Asset section]

[image: Click the Actor button to create a new Actor Blueprint]

[image: Name the Blueprint BP_ShootingTarget]

- Open **BP_SplineActor** and go to the **Components** window. Click **+Add** and select **Spline**.**Compile** and **Save** the Blueprint.

[image: Click the +Add button and select Spline]

### Section Results

In this section, you created a generic Blueprint Actor that has a Spline component. This Spline will be used to create a moving path for the Shooting Actor in the Level.

## Add a State Tree Evaluator

Now you will create a **State Tree Evaluator** that will search for all Spline Actors in the Level and return the closest one to the State Tree.

- In the **Content Browser**, right click and select **Blueprint Class** from the **Create Basic Asset** section.In the **Pick Parent Class** window, expand the **All Classes** dropdown and search for and select **StateTreeEvaluatorBlueprintBase**.
- Click **Select** to create the asset.
- Name the Blueprint class **STE_GetSpline**.

[image: Select Blueprint Class from the Create Basic Asset section]

[image: In the Pick Parent Class window, expand the All Classes dropdown and search for and select StateTreeEvaluatorBlueprintBase]

[image: Name the Blueprint class STE_GetSpline]

- Open **STE_GetSpline** and go to the **Functions** section of the **My Blueprint** panel.Click the **Override** dropdown and select **TreeStart**.

[image: Click the Override dropdown and select TreeStart]

- Drag from the **Event TreeStart** node and search for and select **Get All Actors of Class**.Click the **Actor Class** dropdown and select **BP_SplineActor**.

[image: Drag from the Event TreeStart node and search for and select Get All Actors of Class]

- Create a new variable and name it **Actor**.Go to the **Details** panel and set the **Variable Type** to **Actor Object Reference**.
- Click the **Category** dropdown and enter '**Context**'.

[image: Create a new variable and name it Actor]

[image: Set the Variable Type to Actor Object Reference and click the Category dropdown and enter 'Context']

- Drag from the **Out Actors** pin of the **Get All Actors from Class** node and search for and select **Find Nearest Actor**.Drag the **Actor** variable to the **Event Graph** and select **Get Actor**.
- Drag from the **Actor** node and search for and select **Get Actor Location**.
- Connect the **Return Value** of the **Get Actor Location** node to the **Origin** pin of the **Find Nearest Actor** node.

[image: Drag from the Out Actors pin of the Get All Actors from Class node and search for and select Find Nearest Actor]

- Drag from the **Return Value** pin of the **Find Nearest Actor** node and search for and select **Cast to BP_SplineActor**.Right click on the **As BP Spline Actor** pin of the **Cast to BP_SplineActor** node and select **Promote to Variable**.
- Name this variable to **SplineActor** and enter '**Output**' for its **Category**.
- **Compile** and **Save** the Blueprint.

[image: Drag from the Return Value pin of the Find Nearest Actor node and search for and select Cast to BP_SplineActor]

[image: Name this variable to SplineActor and enter 'Output' for its Category]

- Go back to **ST_ShootingTarget** and under the **StateTree** window, click the **plus sign** next to **Evaluators**.Click the dropdown and select **STE_GetSpline**.

[image: Click the dropdown and select STE_GetSpline]

### Section Results

In this section, you created a State Tree Evaluator that will execute when the State Tree begins execution. This Evaluator checks for all Spline Actors in the Level and returns the closest one to the Shooting Actor.

## Add a State Tree Task to Move Along Spline

In this section, you will create a new **State Tree Task** that will move the Actor along the **BP_SplineActor**'s spline.

- In the **Content Browser**, right click and select **Blueprint Class**.In the **Pick Parent Class** window, expand the **All Classes** dropdown and search for and select **StateTreeTaskBlueprintBase**.
- Click **Select** to create the asset.
- Name the Blueprint class **STT_MoveAlongSpline**.

[image: Select Blueprint Class from the Create Basic Asset section]

[image: In the Pick Parent Class window, expand the All Classes dropdown and search for and select StateTreeTaskBlueprintBase]

[image: Name the Blueprint class STT_MoveAlongSpline]

- Open **STT_MoveAlongSpline** and go to the **Functions** section of the **My Blueprint** panel. Click the **Override** dropdown and select **Tick**.[image: Click the Override dropdown and select Tick]
- Create a new variable and name it **Actor**.Go to the **Details** panel and set the **Variable Type** to **Actor Object Reference**.
- Click the Category dropdown and enter '**Context**'.

[image: Create a new variable and name it Actor]

[image: Set the Variable Type to Actor Object Reference and click the Category dropdown and enter 'Context']

- Create a new variable and name it **SplineActor**.Go to the **Details** panel and set the **Variable Type** to **BP_SplineActor**.
- Enter '**Input**' as the **Category**.

[image: Create a new variable and name it SplineActor]

[image: Set the Variable Type to B SplineActor and enter 'Input' as the Category]

- Drag the **Actor** variable to the **Event Graph** and select **Get Actor**.Drag from the **Actor** node and search for and select **Set Actor Location**.
- Connect the **Tick** node to the **Set Actor Location** node.

[image: Drag from the Actor node and search for and select Set Actor Location]

- Drag the **SplineActor** to the **Event Graph** and select **Get Spline Actor**.Drag from the **SplineActor** node and search for and select **Spline**.
- Drag from the **Spline** node and search for and select **Get Location at Distance Along Spline**.
- Connect the **Return Value** of the **Get Location** at **Distance Along Spline** node and connect it to the **New Location** pin of the **Set Actor Location** node.
- Right click the **Distance** pin of the **Get Location at Distance Along Spline** node and select **Promote to Variable**.

[image: Connect the Return Value of the Get Location at Distance Along Spline node and connect it to the New Location pin of the Set Actor Location node]

- Drag from the **Set Actor Location** node and search for and select **Branch**.Drag the **Distance** variable to the **Event Graph** and select **Get Distance**.
- Drag from the **Distance** node and search for and select **Less**.
- Connect the **Less** node to the **Condition** pin of the **Branch** node.

[image: Connect the Less node to the Condition pin of the Branch node]

- Drag the **SplineActor** to the **Event Graph** and select **Get Spline Actor**.Drag from the **SplineActor** node and search for and select **Spline**.
- Drag from the **Spline** node and search for and select **Get Spline Length**.
- Connect the **Return Value** from the **Get Spline Length** node and connect it to the lower pin of the **Less** node.

[image: Connect the Return Value from the Get Spline Length node and connect it to the lower pin of the Less node]

- Drag the **Distance** variable to the **Event Graph** and select **Get Distance**.Drag from the **Distance** node and search for and select **Add**.
- Create a new variable of type **Float** and name it **MovementSpeed**.
- Connect **MovementSpeed** to the lower pin of the **Add** node.
- Drag the **Distance** variable to the **Event Graph** and select **Set Distance**.
- Connect the **Add** node to the **Set Distance** node.
- Connect the **True** pin of the **Branch** node to the **Set Distance** node, as seen below.

[image: Connect the True pin of the Branch node to the Set Distance node, as seen below]

- Select the **MovementSpeed** variable and set its **Default** value to **5.0**.[image: Select the MovementSpeed variable and set its Default value to 5.0]
- Drag the **Distance** variable to the **Event Graph** and select **Set Distance**.Connect the **False** pin of the **Branch** node to the **Set Distance** node.
- Drag from the **Set Distance** node and search for then select the **Finish Task** function.

[image: Connect the False pin of the Branch node to the Set Distance node]

[image: Connect both Set Distance nodes to the Return Node with a Return Value of Running]

### Section Results

In this section, you create a State Tree Task that moves the Shooting Actor Blueprint along the spline path created with the Spline Actor Blueprint.

## Finalize the State Tree

- Go back to **ST_ShootingTarget** and click **+Add State**. Name the new State **MoveAlongSpline**.Click and drag the **MoveAlongSpline** State into the **Idle** State to parent it.

[image: Click and drag the MoveAlongSpline State into the Idle State to parent it]

- Go to the **Details** panel and add a new **Task** by clicking the **+** button.Click the **dropdown** and select **STT_MoveAlongSpline**.
- Click the **Bind** dropdown next to **Spline Actor** and select **STE Get Spline > Spline Actor**.

[image: Click the dropdown and select STT_MoveAlongSpline]

[image: Click the Bind dropdown next to Spline Actor and select STE Get Spline > Spline Actor]

[image: The Spline Actor is now bound to the Spline Actor variable in STE Get Spline]

- Drag **BP_SplineActor** to the Level.[image: Drag B SplineActor to the Level]
- Select the **Spline** component of **BP_SplineActor**. **Alt-drag** to create new spline points and create a closed shape.Select the **Spline** component of the **Spline Actor** Blueprint and scroll down to the **Spline** section. **Enable** the **Closed Loop** checkbox to make the spline a closed shape.

[image: Enable the Closed Loop checkbox to make the spline a closed shape]

- Press **Play** and shoot at the target.[image: Press Play and shoot at the target]

- blueprints
- ai

On this page

- Overview (-> statetree-quick-start-guide)
- Goals (-> statetree-quick-start-guide)
- Objectives (-> statetree-quick-start-guide)
- Required Setup (-> statetree-quick-start-guide)
- Section Results (-> statetree-quick-start-guide)
- Create the State Tree (-> statetree-quick-start-guide)
- Section Results (-> statetree-quick-start-guide)
- Create the Shooting Target Blueprint (-> statetree-quick-start-guide)
- Section Results (-> statetree-quick-start-guide)
- Create the Idle and Dead States (-> statetree-quick-start-guide)
- Section Results (-> statetree-quick-start-guide)
- Create a New State Tree Task (-> statetree-quick-start-guide)
- Section Results (-> statetree-quick-start-guide)
- Finish the Dead State (-> statetree-quick-start-guide)
- Section Results (-> statetree-quick-start-guide)
- Add a Spline Path (-> statetree-quick-start-guide)
- Section Results (-> statetree-quick-start-guide)
- Add a State Tree Evaluator (-> statetree-quick-start-guide)
- Section Results (-> statetree-quick-start-guide)
- Add a State Tree Task to Move Along Spline (-> statetree-quick-start-guide)
- Section Results (-> statetree-quick-start-guide)
- Finalize the State Tree (-> statetree-quick-start-guide)
