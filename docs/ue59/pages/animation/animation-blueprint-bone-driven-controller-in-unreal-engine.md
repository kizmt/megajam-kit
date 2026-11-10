# Bone Driven Controller

https://dev.epicgames.com/documentation/en-us/unreal-engine/animation-blueprint-bone-driven-controller-in-unreal-engine?application_version=5.9

> Describes the Bone Driven Controller node which allows a 'Driver' bone to dynamically affect the motion of a target object.

[image: Bone Driven Controller]

With the **Bone Driven Controller** Animation Blueprint (-> animation-blueprints-in-unreal-engine) node, you can dynamically affect the motion of a **Target Object**, such as another Bone (-> skeletons-in-unreal-engine), **Morph Target** or **Material Parameter**.

## Overview

With this node, you can apply motion data from the **Source Bone** to dynamically adjust another object on the Skeletal Mesh (-> skeletal-mesh-assets-in-unreal-engine), such as a character's accessory object, to avoid geometry intersections during an animation.

 [image: bone driven controller animation blueprint node]

Here the character's arm bone has been selected as the **Source Bone**, and the shoulder pad bone has been selected as the destination **Target Bone**. As the arm rotates, the Bone Driven Controller node uses the arm bone motion to drive a similar rotation of the shoulder pad bone, to avoid the geometry intersection when no motion occurs on the shoulder pad bone.

|  |  |
| --- | --- |
| [image: bone driven controller node disabled] | [image: bone driven controller node enabled] |
| **Disabled** Bone Driven Controller | **Enabled** Bone Driven Controller |

## Set Up

The Bone Driven Controller node operates within **Component Space**, so a space conversion (-> animation-blueprint-component-space-conversion-in-unreal-engine) will need to occur to implement the node within your character's Animation Blueprint.

With the **Alpha** property or pin, you can control the degree of the applied driven motion on the generated output pose. A value of **1** will fully use the generated output pose, while a value of **0** will output the source pose.

In the **Detail** panel of the Bone Driven Controller node, you first declare the **Source Bone**. Then in the **Source Component Property**, you can select the kind of motion (**Translation**, **Rotation** or **Scale**), and on what axis (**X**, **Y** or **Z**) you want to use from the **Source Bone** as the motion to drive the target object's motion.

 [image: source bone properties in the details panel]

With the **Multiplier** property you can declare a set value with which to multiply the **Source Bone** motion as it drives the target object.

 [image: miltiplier properties in the details panel]

If the **Multiplier** property is a value of 0, no motion will occur. The **Multiplier** property is ignored when a **Driving Curve** is selected.

You can assign a curve to modify the **Source Bone** motion within the **Driving Curve** property. Curves can provide more precise control over how the **Source Bone**'s motion data is used to drive the target object.

 [image: curve maping properties in the details panel]

If the **Destination Mode** property is set to **Bone**, an applied motion type must be defined. You can define how the **Source Bone** motion drives the **Target Bone**, by toggling the different axis of motion in the **Translation**, **Rotation** and **Scale** properties. You can enable any combination of these properties, and the source bone motion data will be applied to each additively.

 [image: motion properties attributes values axis axes translation rotation scale in the details panel]

If there are no applied motion types selected, no motion will occur.

### Debug

When a Bone Driven Controller node is selected in the **AnimGraph**, a debug object will be drawn in the Viewport window to indicate the associated objects. A **blue line** will be drawn connecting the **Source Bone** to the target object, and a **green cone** will be drawn on the blue line pointed in the direction of the target object.

 [image: bone driven controller displays a blue line conecting source and target bones with a green cone pointing twords the target bone when the node is selected in the animgraph for debug]

## Property Reference

 [image: details panel bone driven controller node]

Here you can reference a list of the Bone Driven Controller node's properties.

| Property | Description |
| --- | --- |
| **Source Bone** | Select the bone that will be used as the controller to drive the target object. |
| **Source Component** | Select which motion component from the **Source Bone** will be used to drive the target object. You can select any axis (**X**, **Y**, **Z**) from the source object's **Transform**, **Rotation** and **Scale** components. |
| **Driving Curve** | Here you can select a curve to map the **Source Bone** attribute to the target object attributes. If no curve is selected, the Bone Driven Controller node will default to using the **Multiplier** property to determine the degree of effect the **Source Bone** attribute has on the target object attributes. |
| **Remap Source** | If enabled, the Bone Drive Controller node will clamp the **Source Bone** attribute and remap them to the curve **before** scaling the values. |
| **Multiplier** | Applies the assigned value as a multiplier to the **Source Bone** attribute to drive the target object. |
| **Destination Mode** | Select the type of object the **Source Bone** motion will drive. You can choose another another Bone (-> skeletons-in-unreal-engine), **Morph Target** or **Material Parameter**. |
| **Target Bone** | When **Bone** is selected in the **Destination Mode** property, you can select a bone to drive with the **Source Bone**. |
| **Target Component Space** | Here you can reference the **Target Bone**'s component space. |
| **Modification Mode** | Toggle any of the **Translation** axes (**X**, **Y**, **Z**) you want driven by the **Source Bone**. |
| **Translation** | Toggle any of the **Translation** axes (**X**, **Y**, **Z**) you want driven by the **Source Bone**. |
| **Rotation** | Toggle any of the **Rotation** axes (**X**, **Y**, **Z**) you want driven by the **Source Bone**. |
| **Scale** | Toggle any of the **Scale** axes (**X**, **Y**, **Z**) you want driven by the **Source Bone**. |
| **Modification Mode** | Here you can select the method in which the Bone Driven Controller node will drive the **Target Bone**. **Add to Input**: Will add the driven attribute values to the existing input attribute values. **Replace Component**: Replaces the input attribute values with the driven attribute values. **Add to Reference Pose**: Adds the driven attribute values to the character's reference pose. |
| **Parameter Name** | When the **Destination Mode** property is set to **Morph Target** or a **Material Parameter**, you can specify which object you want to drive with the **Source Bone**, by typing the name of the object in the property's field. |

- animation
- skeletal controls

On this page

- Overview (-> animation-blueprint-bone-driven-controller-in-unreal-engine)
- Set Up (-> animation-blueprint-bone-driven-controller-in-unreal-engine)
- Debug (-> animation-blueprint-bone-driven-controller-in-unreal-engine)
- Property Reference (-> animation-blueprint-bone-driven-controller-in-unreal-engine)
