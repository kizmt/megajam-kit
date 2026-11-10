# How to Get Animation Variables

https://dev.epicgames.com/documentation/en-us/unreal-engine/how-to-get-animation-variables-in-animation-blueprints-in-unreal-engine?application_version=5.9

> How to get Animation Variables to animate characters in the Animation Blueprint Event Graph and Thread Safe Functions.

[image: How to Get Animation Variables]

When developing Animation Blueprint (-> animation-blueprints-in-unreal-engine)s for characters in **Unreal Engine**, it can be helpful to implement dynamic movement and locomotion **variables** to control animation behaviors.

This document will explain how to set up the **EventGraph** Animation Blueprint logic to calculate these variables in your own project. In addition, this document will also provide an explanation of how to calculate these variables in a **thread safe **blueprint function (-> graphing-in-animation-blueprints-in-unreal-engine), using property access (-> graphing-in-animation-blueprints-in-unreal-engine) nodes to increase your projects performance and stability.

#### Prerequisites

- A controllable Third Person Character with a movement component.

You can supplement this requirement with the Third-Person template project if needed.

## Character Object Reference

Most animation variables can be calculated using the character's movement component in the **EventGraph**. In order to use the character's movement component to calculate other animation variables, a reference variable must be created.

First, in the **EventGraph** of the character's Animation Blueprint, create an** Event Blueprint Initialization Animation** node.

 [image: event blueprint initialize animation amination blueprint event graph node]

From the **Event Initialization** node, create a **Cast** node that casts the animation blueprint to the character's blueprint.

In the workflow example, the character's blueprint is the `BP_ThirdPersonCharacter` found in the Third Person template project.

Then create a **Get Owning Actor** node and connect the **Return Value** output pin of a to the **Cast **node's **Object** input pin.

 [image: cast event graph animation blueprint node cast to third person character blueprint]

Next, **right-click** the cast node's** As Character** output pin and select the **Promote to Variable** option from the context menu, to create a character object reference variable.

After connecting the logic, a **character object** reference variable is accessible in your blueprint's **EventGraph** and **AnimGraph**.

 [image: set character reference variable with cast to third person blueprint animation blueprint node event graph]

## Movement Component Reference

In order to isolate the character's **Movement Component** from the **Character Object**, a **Get Character Movement** node is needed. From the **Set Character** variable node's** Character** output pin, create a **Get Character Movement **node.

 [image: get character movement by create a get character movement node from the character reference node]

Next, **right-click** the **Character Movement** output pin to a variable, and select promote to variable from the context menu, to create a movement component reference variable.

 [image: set character movement component reference variable in event graph]

After connecting the logic, a **character movement component** reference variable is accessible in your blueprint's **EventGraph** and **AnimGraph**.

 [image: full character reference and movement component reference animation blueprint event graph]

## Velocity

A character's velocity can be a helpful value to use when calculating animations that require direction or speed.

To create a velocity variable in the **EventGraph**, first create an **Event Blueprint Update Animation** node.

Next, add the **Movement Component** reference variable to the **EventGraph**. Then, you can use a** Get Velocity** node, to calculate the vector value that represents the movement component's direction and magnitude of movement.

 [image: create a get velocity node from the movemnt component reference variable]

Next, **right-click** the **Velocity** output of the **Get Velocity** node and select the** Promote to Variable** option from the context menu to create the velocity variable.

After connecting the logic, a **Velocity** variable is accessible in your blueprint's **EventGraph** and **AnimGraph**.

 [image: full velocity reference variable in event graph]

Here, a **Print String** node is sending a debug message every frame with the updated **X**, **Y** and **Z** values of the character's velocity.

 [image: velocity print string demo]

### Thread Safe

First create a new thread safe function in your character's animation blueprint.

Then, **right-click **in the graph to create a **property access** node.

From the **property access **node's drop down menu select the function, **Try Get Pawn Owner > Get Movement Component > Velocity**. Then right-click the vector output pin and select promote to variable, to create a velocity variable.

 [image: velocity get property access context menu]

After connecting the logic, a **Velocity** variable is accessible in your blueprint's **EventGraph** and **AnimGraph**.

 [image: velocity thread safe graph full function]

In order to update this function during your project's runtime, add the thread safe Velocity function to the **Blueprint Thread Safe Update Animation** graph.

 [image: add the velocity thread safe function to the blueprint thread safe update function]

Your character's Animation Blueprint now calculates the character's velocity in a thread safe manner.

## Character Speed

Character movement speed can be a helpful variable to use when selecting animations based on a character's speed, such as running or walking states.

You can create a **Vector Length XY** node from the velocity variable to isolate the character's speed from the movement component velocity.

Next, **right-click** the **Vector Length XY** node's **Return Value** output pin to select **Promote to Variable** from the context menu.

 [image: create a vectory xy node to isolate speed from the variable function]

After connecting the logic, a **Speed** variable is accessible in your blueprint's **EventGraph** and **AnimGraph**.

Here, a **Print String** node is sending a debug message every frame with the updated value of the character's speed.

 [image: print string debug displaying character speed demo]

### Thread Safe

First create a new thread safe function in your character's Animation Blueprint.

Next, create a **property access** node and select the **Try Get Pawn Owner > Movement Component > Velocity** function from the drop-down menu.

From the **property access** node's output, create a **Vector Length XY **node to extract the forward and lateral motion (**X** and **Y** axis).

 [image: thread safe function to get speed of character]

In order to update this function during your project's runtime, add the thread safe Speed function to the **Blueprint Thread Safe Update Animation** graph.

 [image: add thread safe speed function to the blueprint thread safe update function]

Your character's Animation Blueprint now calculates the character's velocity in a thread safe manner.

## Movement Threshold

To control when your character's movement should trigger animation playback, you can create a Movement Threshold variable that will allow movement when the character's speed reaches a set magnitude.

From the character's speed variable in the **EventGraph**, create a **Greater Than or Equal To (>=)** node and set the value to a low number.

This number can be a very small value like `0.1`.

**Right-click** the boolean output pin of the **Greater Than or Equal To (>=)** node, and select **Promote to Variable** from the context menu.

 [image: add a greater than or equal to node to set the min movement that will allow animations to update]

After connecting the logic, a **Movement Threshold** variable is accessible in the Animation Blueprint's **EventGraph** and **AnimGraph**.

Here, a **Print String** node is sending a debug message every frame with the updated state of the character's movement threshold variable.

 [image: should move debug text demo]

### Thread Safe

First, create a new thread safe function in your character's Animation Blueprint.

Create a **property access** node in the thread safe graph, and set the node to **Try Get Pawn Owner > Movement Component > Velocity**. Extract the forward and lateral movement with the **Vector Length XY** function node.

Then with a **Greater Than or Equal To (>=)** node, set the speed threshold at which movement animation should not occur.

This number can be a very small value like `0.1`.

**Right-click** the boolean output pin of the **Greater Than or Equal To (>=)** node, and select **Promote to Variable** from the context menu.

 [image: should move thread safe funtion]

In order to update this function during your project's runtime, add the thread safe Should Move function to the **Blueprint Thread Safe Update Animation** graph.

 [image: add the should move thread safe function to the blueprint thread safe update function]

Your character's Animation Blueprint now calculates the character's movement threshold variable in a thread safe function.

## Jumping and Falling

You can use a Jumping and Falling variable to determine when to play jumping and landing animations in the character's **AnimGraph**.

First create a **Movement Component** variable into your Animation Blueprint's **EventGraph**.

You can now create a **IsFalling** function node from the **movement component** reference variable node.

**Right-click** the** Is Falling** node's **Return Value** output pin, and select the** Promote to Variable Option** from the context menu.

 [image: add a greater than or equal to node to determine]

After connecting the logic, a **Jumping and Falling** variable is accessible in the Animation Blueprint's **EventGraph** and **AnimGraph**.

Here, a **Print String** node is sending a debug message every frame with the updated state of the character's Jumping and Falling variable.

 [image: should move debug text demo]

### Thread Safe

First create a new thread safe function in your character's Animation Blueprint.

Create a **property access** node and set the node to **Try Get Pawn Owner > Get Movement Component > IsFalling**.

**Right-click** the property access node's output pin and select the **Promote to Variable** option from the context menu.

 [image: blueprint thread safe function is falling]

In order to update this function during your project's runtime, add the thread safe Is Falling function to the **Blueprint Thread Safe Update Animation** graph.

 [image: add the thread safe is falling function to the blueprint thread safe update function]

Your character's Animation Blueprint now calculates the character's jumping and falling state variable in a thread safe function.

## EventGraph Reference

Here you can reference the full **Event Blueprint Update Animation** logic in the **EventGraph** used in the example workflow.

 [image: full update function on event graph]

- animation
- variables
- how-to

On this page

- Prerequisites (-> how-to-get-animation-variables-in-animation-blueprints-in-unreal-engine)
- Character Object Reference (-> how-to-get-animation-variables-in-animation-blueprints-in-unreal-engine)
- Movement Component Reference (-> how-to-get-animation-variables-in-animation-blueprints-in-unreal-engine)
- Velocity (-> how-to-get-animation-variables-in-animation-blueprints-in-unreal-engine)
- Thread Safe (-> how-to-get-animation-variables-in-animation-blueprints-in-unreal-engine)
- Character Speed (-> how-to-get-animation-variables-in-animation-blueprints-in-unreal-engine)
- Thread Safe (-> how-to-get-animation-variables-in-animation-blueprints-in-unreal-engine)
- Movement Threshold (-> how-to-get-animation-variables-in-animation-blueprints-in-unreal-engine)
- Thread Safe (-> how-to-get-animation-variables-in-animation-blueprints-in-unreal-engine)
- Jumping and Falling (-> how-to-get-animation-variables-in-animation-blueprints-in-unreal-engine)
- Thread Safe (-> how-to-get-animation-variables-in-animation-blueprints-in-unreal-engine)
- EventGraph Reference (-> how-to-get-animation-variables-in-animation-blueprints-in-unreal-engine)
