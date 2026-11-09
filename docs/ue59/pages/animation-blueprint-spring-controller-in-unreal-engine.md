# Spring Controller

https://dev.epicgames.com/documentation/en-us/unreal-engine/animation-blueprint-spring-controller-in-unreal-engine?application_version=5.9

> Describes the Spring Controller which is used to limit how far a bone can stretch from its reference pose before force is applied in the opposite direction.

[image: Spring Controller]

With the **Spring Controller** Animation Blueprint (-> animation-blueprints-in-unreal-engine) node, you can apply a controlled stretch to bone from a character's skeleton.

 [image: spring controller animation blueprint node]

Here is an example of the Spring Controller node being used to simulate movement of non-animated bones by applying a force in the opposite direction for the character's motion.

|  |  |
| --- | --- |
| [image: spring cotroller demo disabled] (convert:false) | [image: spring controller demo enabled] |
| Spring Controller Disabled | Spring Controller Enabled |

## Property Reference

 [image: spring controller animation blueprint node details pannel]

Here you can reference a list of the Spring Controller node's properties.

| Property | Description |
| --- | --- |
| **Spring Bone** | Select the bone from the character's skeleton to apply the Spring Controller node to. |
| **Max Displacement** | Set the maximum distance the bone can stretch from the reference pose location, in Unreal Engine units, when **Limit Displacement** is enabled. |
| **Spring Stiffness** | Set a multiplier value used to calculate the stiffness of the spring. Larger values require more bone velocity to displace the bone and result in a larger applied force with quicker reactive movements. |
| **Spring Damping** | Set a multiplier to reduce the **Spring Bones**'s velocity, to create smoother and more controlled results. |
| **Error Reset Thresh** | Set a threshold to reset the Spring Bones in Unreal Engine units. If the **Spring Bone** stretches more than this amount, it resets in order to avoid errors introduced by sudden, large displacements such as those caused by teleporting Actors. |
| **Limit Displacement** | When enabled the **Max Displacement** property will be considered. |

- animation
- skeletal controls
- animation graph

On this page

- Property Reference (-> animation-blueprint-spring-controller-in-unreal-engine)
