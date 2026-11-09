# Physics Bodies Reference

https://dev.epicgames.com/documentation/en-us/unreal-engine/physics-bodies-reference-for-unreal-engine?application_version=5.9

> Physics Body, or Body Instance, property reference.

[image: Physics Bodies Reference]

This page contains a reference listing of properties in the Physics and Collision categories of properties. If you are looking for reference on Collision Responses or Collision Presets please see: Collision Response Reference (-> collision-response-reference-in-unreal-engine).

## Properties

Below are the properties for Physics Bodies (Body Instances) separated by major category.

## Physics

 [image: Physics body details panel showing the physics properties]

| Property | Description |
| --- | --- |
| **Double Sided Geometry** | If enabled, the physics triangle mesh will use double-sided faces when doing scene queries. This is useful for planes and single-sided meshes that need traces to work on both sides. |
| **Simple Collision Physical Material** | Physical material to use for simple collision on this body. Encodes information about density, friction, and so on. |
| **Physics Type** | Simulated: Object will use physics simulation. Kinematic: Object will not be affected by physics, but can interact with physically simulated bodies. Default: Object will inherit from OwnerComponent's behavior. |
| **Mass in KG** | Mass of the body in KG. |
| **Linear Damping** | 'Drag' force added to reduce linear movement. |
| **Angular Damping** | 'Drag' force added to reduce angular movement. |
| **Enable Gravity** | If the object should have the force of gravity applied. |

### Advanced

 [image: Physics body details panel showing the advanced physics properties]

| Property | Description |
| --- | --- |
| **Start Awake** | If the object should start awake, or if it should initially be sleeping. |
| **Center Of Mass Offset** | User specified offset for the center of mass of this object, from the calculated location. |
| **Mass Scale** | Per-instance scaling of mass. |
| **Max Angular Velocity** | The maximum angular velocity for this instance. |
| **Sleep Family** | The set of values used in considering when to put this body to sleep. Normal, Sensitive, Custom. |
| **Inertia Tensor Scale** | Per-instance scaling of inertia (larger values mean more difficulty rotating) |
| **Walkable Slope Override** | Custom walkable slope setting for this body. See the **Walkable Slope (-> walkable-slope-in-unreal-engine)** documentation for usage information. |
| **Walkable Slope Behavior** | Behavior of this surface (whether we affect the walkable slope). |
| **Walkable Slope Angle** | Override a walkable slope, applying the rules of the Walkable Slope Behavior. |
| **Custom Sleep Threshold Multiplier** | If the Sleep Family is set to **Custom**, multiply the natural sleep threshold by this amount. A higher number will cause the body to sleep sooner. |
| **Stabilization Threshold Multiplier** | The stabilization factor for this body if Physics stabilization is enabled. A higher number will cause more aggressive stabilization at the risk of loss of momentum at low speeds. A value of 0 will disable stabilization for this body. |
| **Update Mass when Scale Changes** | If true, it will update the mass when the scale changes. |
| **Generate Wake Events** | Determines whether 'wake/sleep' events should fire when this object is woken up or put to sleep by the physics simulation. |

## Collision

 [image: Physics body details panel showing the collision properties]

| Property | Description |
| --- | --- |
| **Never Needs Cooked Collision Data** | To do chaos this is to opt out of CreatePhysicsMeshes for certain meshes. Better a long term mesh is not to call CreatePhysicsMesh until is known there is a mesh instance that needs it. |
| **Collision Complexity** | Collision Trace behavior - by default, it will keep simple (convex) and complex (per-poly) separate. |
| **Collision Responses** | See the Collision Response Reference (-> collision-response-reference-in-unreal-engine) documentation for more information. |
| **Simulation Generates Hit Events** | Should 'Hit' events fire when this object collides during physics simulation. |
| **Phys Material Override** | Allows you to override the PhysicalMaterial to use for simple collision on this body. |

### Advanced

 [image: Physics body details panel showing the advanced collision properties]

| Property | Description |
| --- | --- |
| **Use CCD** | If true Continuous Collision Detection (CCD) will be used for this component |
| **Ignore Analytic Collisions** | If true, ignore analytic collisions and treat objects as a general implicit surface. |
| **Smooth Edge Collisions** | Remove unnecessary edge collisions to allow smooth sliding over surfaces composed of multiple actors/components. |

## Body Setup

 [image: Physics body details panel showing the body set up properties]

| Property | Description |
| --- | --- |
| **Skip Scale from Animation** | If true, scale changes from animation are ignored. This is useful for subtle scale animations like breathing where the physics collision should remain unchanged. |
| **Primitives** | Simplified collision representation of this object. |
| **Spheres** | Sphere Elements |
| **Boxes** | Box Elements |
| **Capsules** | Sphyl Elements |
| **Convex Elements ** | Convex Elements |
| **Tapered Capsules** | Tapered Capsule Elements |
| **Consider for Bounds** | Determines whether this BodySetup should be considered for the bounding box of the PhysicsAsset (and hence SkeletalMeshComponent). There is a speed improvement from having fewer BodySetups processed each frame when updating the bounds. |
| **Bone Name** | Used in the PhysicsAsset case. Associates this Body with a Bone in a skeletal mesh. |

See below for the Detail properties for each Primitive type.

### Primitive Types

#### Spheres

 [image: Body setup details for sphere primitives]

| Property | Description |
| --- | --- |
| **Center** | Position of the sphere's origin. |
| **Radius** | Radius of the sphere. |
| **Rest Offset** | The offset used when generating contact points. This allows you to smooth out the Minkowski sum by radius R. Useful for making objects slide smoothly on top of irregularities. |
| **Name** | User-defined name for this shape. |
| **Contribute to Mass** | Enable if this shape should contribute to the overall mass of the body it belongs to. This lets you create extra collision volumes which do not affect the mass properties of an object. |
| **Collision Enabled** | Course per-primitive collision filtering. This allows for individual primitives to be toggled in and out of sim and query collisions without changing filtering details. |

#### Boxes

 [image: Body setup details for box primitives]

| Property | Description |
| --- | --- |
| **Center** | Position of the box's origin. |
| **Rotation** | Rotation of the box, in degrees around each axis. |
| **X Extent** | Extent of the box along the x-axis. |
| **Y Extent** | Extent of the box along the y-axis. |
| **Z Extent** | Extent of the box along the z-axis. |
| **Rest Offset** | The offset used when generating contact points. This allows you to smooth out the Minkowski sum by radius R. Useful for making objects slide smoothly on top of irregularities. |
| **Name** | User-defined name for this shape. |
| **Contribute to Mass** | Enable if this shape should contribute to the overall mass of the body it belongs to. This lets you create extra collision volumes which do not affect the mass properties of an object. |
| **Collision Enabled** | Course per-primitive collision filtering. This allows for individual primitives to be toggled in and out of sim and query collisions without changing filtering details. |

#### Capsules

 [image: Body setup details for capsule primitives]

| Property | Description |
| --- | --- |
| **Center** | Position of the capsule's origin. |
| **Rotation** | Rotation of the capsule, in degrees around each axis. |
| Radius | Radius of the capsule |
| Length | The length of the line-segment. Add Radius to both ends to find the total length. |
| **Rest Offset** | The offset used when generating contact points. This allows you to smooth out the Minkowski sum by radius R. Useful for making objects slide smoothly on top of irregularities. |
| **Name** | User-defined name for this shape. |
| **Contribute to Mass** | Enable if this shape should contribute to the overall mass of the body it belongs to. This lets you create extra collision volumes which do not affect the mass properties of an object. |
| **Collision Enabled** | Course per-primitive collision filtering. This allows for individual primitives to be toggled in and out of sim and query collisions without changing filtering details. |

#### Convex Elements

 [image: Body setup details for convex element primitives]

| Property | Description |
| --- | --- |
| **Rest Offset** | The offset used when generating contact points. This allows you to smooth out the Minkowski sum by radius R. Useful for making objects slide smoothly on top of irregularities. |
| **Name** | User-defined name for this shape. |
| **Contribute to Mass** | Enable if this shape should contribute to the overall mass of the body it belongs to. This lets you create extra collision volumes which do not affect the mass properties of an object. |
| **Collision Enabled** | Course per-primitive collision filtering. This allows for individual primitives to be toggled in and out of sim and query collisions without changing filtering details. |

#### Tapered Capsules

 [image: Body setup details for tapered capsule primitives]

| Property | Description |
| --- | --- |
| **Center** | Position of the capsule's origin. |
| **Rotation** | Rotation of the capsule, in degrees around each axis. |
| **Radius 0** | Radius of the capsule start point. |
| **Radius 1** | Radius of the capsule end point. |
| **Length** | Length of the line-segment. Add Radius 0 and Radius 1 to find the total length. |
| **Rest Offset** | The offset used when generating contact points. This allows you to smooth out the Minkowski sum by radius R. Useful for making objects slide smoothly on top of irregularities. |
| **Name** | User-defined name for this shape. |
| **Contribute to Mass** | Enable if this shape should contribute to the overall mass of the body it belongs to. This lets you create extra collision volumes which do not affect the mass properties of an object. |
| **Collision Enabled** | Course per-primitive collision filtering. This allows for individual primitives to be toggled in and out of sim and query collisions without changing filtering details. |

- physics
- physics bodies

On this page

- Properties (-> physics-bodies-reference-for-unreal-engine)
- Physics (-> physics-bodies-reference-for-unreal-engine)
- Advanced (-> physics-bodies-reference-for-unreal-engine)
- Collision (-> physics-bodies-reference-for-unreal-engine)
- Advanced (-> physics-bodies-reference-for-unreal-engine)
- Body Setup (-> physics-bodies-reference-for-unreal-engine)
- Primitive Types (-> physics-bodies-reference-for-unreal-engine)
- Spheres (-> physics-bodies-reference-for-unreal-engine)
- Boxes (-> physics-bodies-reference-for-unreal-engine)
- Capsules (-> physics-bodies-reference-for-unreal-engine)
- Convex Elements (-> physics-bodies-reference-for-unreal-engine)
- Tapered Capsules (-> physics-bodies-reference-for-unreal-engine)
