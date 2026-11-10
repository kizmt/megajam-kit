# Troubleshooting Common Physics Asset Errors

https://dev.epicgames.com/documentation/en-us/unreal-engine/troubleshooting-common-physics-asset-errors-in-unreal-engine?application_version=5.9

> This tutorial covers how to troubleshoot the two common Physics Asset issues of Exploding and Jittering.

[image: Troubleshooting Common Physics Asset Errors]

While there are several things that can be out of your control during a physical simulation, there are two issues that are definitely within your power to correct: **Exploding**
(interpenetrating physics bodies that are set to collide with each other) and **Jitter** (when the **Physics Bodies** refuse to sleep due to micro-movements). Below are some steps for correcting
these issues.

## Exploding

This is caused by two Physics Bodies interpenetrating and the physics system attempting to correct it by applying a massive amount of force to expel the Physics Bodies from each other.
If a **Physics Constraint** is keeping the offending Physics Bodies together, the physics system will continually apply force to separate them, causing very erratic and extreme movement.

 [image: Exploding vehicle physics bodies]

This is normally fixed by disabling collision between the two offending Physics Bodies, or changing their positions and/or scale to make sure they do not interpenetrate. Additionally, welded
Physics Bodies act as one regardless of interpenetration.

## Jitter

If your **Physics Asset** is mostly "collapsed" but still shaking and twitching on the ground, but not violently bouncing around, there are a few values you can tweak to get it to stop
and sleep.

Before doing anything, try simulating with **No Gravity**, this will show you if any of your Physics Constraints are misaligned, and tryi to correct them before the Physics Asset has
even hit the ground.

 [image: No gravity simulation option]

Often a small amount of **Linear** and **Angular Damping** on all the Physics Asset's Physics Bodies is more than enough to stop the asset from shaking. However, using large
values in Linear Damping will cause a Physics Body to slow its movement through the world, even due to gravity. Damping, as it is implemented here, is like the drag of moving through a viscous substance.

If jitter is still an issue, perhaps you have several really small Physics Bodies, check the Substepping (-> physics-sub-stepping-in-unreal-engine) documentation for information on having the
physics simulation calculates in-between solutions.

See the Constraints Reference (-> physics-constraint-reference-in-unreal-engine) for more details on the properties for Physics Constraints.

- physics
- error

On this page

- Exploding (-> troubleshooting-common-physics-asset-errors-in-unreal-engine)
- Jitter (-> troubleshooting-common-physics-asset-errors-in-unreal-engine)
