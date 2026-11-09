# Vehicle Center of Mass

https://dev.epicgames.com/documentation/en-us/unreal-engine/vehicle-center-of-mass-in-unreal-engine?application_version=5.9

> An overview of how Center of Mass works with Vehicles.

[image: Vehicle Center of Mass]

Weight distribution of a vehicle is important to its control, as it affects a variety of its characteristics, like handling, acceleration, and traction. Different vehicle types will require different weight distributions depending on their intended use. For the purposes of game development, these characteristics can also define what style of game you are making, whether that is an arcade-style racer, a simulation, or even a hybrid of the two. Altering **Center of Mass** enables you to change the weight distribution of your vehicle.

In games, the primary use of Center of Mass is for vehicles, but it can also be used for large Physics Bodies encapsulating an irregular shape. In your
Physics Asset (-> physics-asset-editor-in-unreal-engine), you will often use one large Physics Body to define the majority of the Mass for the vehicle (or large object). The
Center of Mass will be generated at the center of this Physics Body, which can make the vehicle handle oddly, so you can adjust the Center of Mass to
account for where the mass of the vehicle is really located.

## Understeering versus Oversteering

Depending on where the Center of Mass is located, you can shift it to be predominantly front-heavy, causing the vehicle to have a tendency toward **understeering** (not turning enough when going around corners), or to be predominantly rear-heavy, causing it to tend toward **oversteering** (turning more sharply than intended).
In most cases, it is ideal to find a neutral balance for your Center of Mass so that the vehicle is more easily controlled.

 [image: Understeering]

 [image: Oversteering]

Also, when you consider where to place the Center of Mass, it is worth noting that this choice can have an effect on how your vehicle handles in the air. In this example, the Center of Mass has been lowered and moved closer to the rear of the car. Since it's low to the ground and can get to high speed quickly, the lower rear Center of Mass helps to stabilize the car, especially with jumps!

|  |  |
| --- | --- |
|  |  |
| Center of Mass: X: 0, Y: 0, Z: 0 | Center of Mass: X: -25, Y: 0, Z: -10 |

## Debugging Center of Mass

To help you debug mass properties and inertia tensors associated with physics objects while in the Level Editor, you can enable the `Show` flag by going to **Show** > **Advanced** > **Mass Properties**.

 [image: Center of Mass: X: 0, Y: 0, Z: 0]

 [image: Center of Mass: X: -25, Y: 0, Z: -10]

The thickness of each axis indicates the moment of inertia magnitude along that axis.

- physics
- vehicles

On this page

- Understeering versus Oversteering (-> vehicle-center-of-mass-in-unreal-engine)
- Debugging Center of Mass (-> vehicle-center-of-mass-in-unreal-engine)
