# Physics Damping

https://dev.epicgames.com/documentation/en-us/unreal-engine/physics-damping-in-unreal-engine?application_version=5.9

> Properties and methods used to cause physical objects to resist movement.

[image: Physics Damping]

To slow down **Physics Bodies**, simulate atmospheric drag, or add resistance to a hinge, there are two properties available to Physics Bodies and **Physics Constraints**: **Linear Damping**
and **Angular Damping**. Linear Damping controls how much the Physics Body or Constraint resists translation, while Angular Damping controls how much they resist rotating.

## Physics Bodies

Every Physics Body has properties for Linear Damping and Angular Damping, found under **Physics** in the **Details** panel. These are primarily used to simulate drag, and even a value of 1.0 has a substantial effect on the Physics
Body.

 [image: Physics properties in the Details panel]

For reference, in normal gravity (9.8m/s^2), a Linear Damping value of 30 is enough to stop any single body Actor from falling under the initial pull of gravity, at the start of the simulation. Once more than one Physics Body is interacting (through the use of Physics Constraints or if a collision is occurring), the amount of damping required to stop the Physics Body goes up.

The minimum Linear Damping value to stop a Physics Body that has had force applied to it is around 100.

Finally, with no Angular Damping, a Physics Body will continue to rotate until it is acted upon by an outside force. Even small values can reduce rotation rapidly, while a value of
100 will almost immediately stop any angular motion caused by an outside source.

## Physics Constraints

The Damping for Physics Constraints work a bit differently than with Physics Bodies: they only work on **Limited Motions** and when a motion attempts to go beyond its limit. Setting a
Physics Constraint's Motion(s) to Limited will display the **Soft Limits**:

 [image: Setting a Physics Constraint's Motions to Limited will display the Soft Limits] [image: Linear Limits Mod]

The two Angular Swing Motions share Damping values, the Angular Twist receives its Damping values, and all the Linear axes use the same Damping values. While they may have
separate properties, the properties all have the same effect on the Motions they relate to.

| Property | Description |
| --- | --- |
| **Limit Stiffness** | When a limit is exceeded, this value affects how harshly the constraint attempts to stop the offending motion. The default of 50 will barely affect the motion, a value of 5000 will appear to bounce back into the limit, and 50000 will completely deflect the motion. |
| **Limit Damping** | Like the Damping on Physics Bodies, this defines how much the motion should be slowed. Unlike Damping on Physics Bodies, the damping effect occurs only when the Motion Limit is exceeded, draining momentum until the Physics Body stops. |

The two values work together to create different effects. A high Stiffness and low Damping will look like a hard limit, while having them both high will appear to be the move through
tar, coming to a stop gently but quickly. A good deal of experimentation is necessary to find the right values for your specific needs.

For more information on Constraints, refer to: **Constraints User Guide (-> constraints-user-guide-in-unreal-engine)**

For a reference specific to the properties available to Physics Constraints, refer to: **Physics Constraint Reference (-> physics-constraint-reference-in-unreal-engine)**

- physics
- constraints

On this page

- Physics Bodies (-> physics-damping-in-unreal-engine)
- Physics Constraints (-> physics-damping-in-unreal-engine)
