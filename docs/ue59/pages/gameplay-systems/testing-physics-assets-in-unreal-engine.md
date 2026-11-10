# Testing Physics Assets

https://dev.epicgames.com/documentation/en-us/unreal-engine/testing-physics-assets-in-unreal-engine?application_version=5.9

> This tutorial covers the basics for testing your Physics Assets in the Physics Asset Editor.

[image: Testing Physics Assets]

This page covers the basics of testing a **Physics Asset** in the **Physics Asset Tool**.

## Testing

 [image: Testing]

Selecting **Simulation** from the dropdown menu under the toolbar **arrow icon** will allow you to test your Physics Asset.

 [image: Selecting Simulation from the dropdown menu under the toolbar arrow icon will allow you to test your Physics Asset]

- When the **No Gravity** option is enabled, the entire Physics Asset is simulated but gravity is not turned on, enabling you to ctrl+click to poke the **Physics Bodies** in a zero gravity environment. This is useful for finding any interpenetrating Physics Bodies or **Limited Physics Constraints** already outside of their limits.

- You can also simulate a chain of joints by toggling on **Selected Simulation**. This option only simulates the Physics Bodies you have selected (you can select more than one) and those down the hierarchy from the selected Physics Bodies. For example, if you select the shoulder, the entire arm will be simulated.

- physics

On this page

- Testing (-> testing-physics-assets-in-unreal-engine)
