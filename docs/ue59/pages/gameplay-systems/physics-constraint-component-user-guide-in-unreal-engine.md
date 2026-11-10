# Physics Constraint Component User Guide

https://dev.epicgames.com/documentation/en-us/unreal-engine/physics-constraint-component-user-guide-in-unreal-engine?application_version=5.9

> A user guide on using the Physics Constraint Component in Blueprints.

[image: Physics Constraint Component User Guide]

## Overview

Physics Constraint Components operate just like **Physics Constraints Actors (-> constraints-user-guide-in-unreal-engine)**, except they are used in Blueprints or can be
created in C++. Given the flexibility of Blueprints and the power of C++, you can constrain just about any Physics Body in your project using Physics Constraint Components.

This document will cover Physics Constraint Component basic creation in a Blueprint.

This document assumes that the user has some knowledge of **Blueprints** and the **Blueprint Editor**.

## Usage

- Create the Components that will be used to constrain. For this demonstration, two **StaticMesh** Components referencing the StaticMesh `Shape_Cube` will be used. [image: Two StaticMesh Components referencing the StaticMesh ShapeCube will be used] You will need to position the Components that you want to be constrained. For this guide, these two cubes are used.

- Enable **Simulate Physics** for the lower of the two StaticMesh Components. [image: Enable Simulate Physics]

- Click **Add Component** to find **Physics Constraint**. [image: Click Add Component to find Physics Constraint]

- Position the Physics Constraint Component where you wish the joint of the constraint to be. [image: Position the Physics Constraint Component]

- You must manually type in the names of the StaticMesh Components you wish to constrain in the **Details** panel of the Physics Constraint Component. Type in the component name you wish to constrain in the **Component Name 1** of the **Component Name** property. [image: Type in the component name you wish to constrain in the Component Name 1]

- Type in the component name you wish to constrain in the **Component Name 2** of the **Component Name** property. [image: Type in the component name you wish to constrain in the Component Name 2]

- Select the Physics Constraint component and move its location to the bottom of the StableMesh component. This will place the anchor point at the bottom of the cube. [image: Select the Physics Constraint component and move its location to the bottom of the StableMesh component] Want to know what all the properties on a Physics Constraint Component affect? See the **Physics Constraint Reference (-> physics-constraint-reference-in-unreal-engine)** for specific details.

- Rotate the Physics Constraint Component as necessary to account for Linear and Angular Limits. [image: Rotate the Physics Constraint Component]

- Place the **Blueprint Actor** in a level and position it where you need it. [image: Place the Blueprint Actor in a level and position it where you need it]

- Select **Blueprint Actor** and go to the **Details** panel. Select the **ConstrainedMesh** component in the hierarchy and move it as seen in the picture. In this example, the **location** was set to **X = -300** and **Z = 100**. This will allow the ConstrainedMesh to swing once you press **Simulate**. [image: Select Blueprint Actor and go to the Details panel]

- Test by using **Simulate in Editor** or **Play in Editor**. [image: physics-constraint-blueprint-simulate]

- physics
- constraints

On this page

- Overview (-> physics-constraint-component-user-guide-in-unreal-engine)
- Usage (-> physics-constraint-component-user-guide-in-unreal-engine)
