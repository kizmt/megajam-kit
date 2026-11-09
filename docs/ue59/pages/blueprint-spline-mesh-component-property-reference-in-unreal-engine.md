# Blueprint Spline Mesh Component Property Reference

https://dev.epicgames.com/documentation/en-us/unreal-engine/blueprint-spline-mesh-component-property-reference-in-unreal-engine?application_version=5.9

> Contains a reference of all properties available in the editor for Blueprint Spline Mesh Components.

[image: Blueprint Spline Mesh Component Property Reference]

This page contains a reference listing of properties available on **Blueprint Spline Mesh Components**. The properties displayed will be slightly different if the **Blueprint Spline Mesh Component** is selected in the **Blueprint Editor**, is a **Root Component**, or if the component is selected in the **Level Editor**.

## Properties

### Transform

| Property | Description |
| --- | --- |
| **Location** | The location of the **Actor** or **Component** in **World Space** or **Relative** to its parent. |
| **Rotation** | The rotation of the **Actor** or **Component** in **World Space** or **Relative** to its parent. |
| **Scale** | The Scale of the **Actor** or **Component** in **World Space** or **Relative** to its parent. |

### Sockets

| Property | Description |
| --- | --- |
| **Parent Socket** | When this component is the **Child** of a **Skeletal Mesh Component** (or **Static Mesh Component** with a **Socket**), you can specify a **Socket** or **Joint** to attach this component to. |

### Static Mesh

| Property | Description |
| --- | --- |
| **Static Mesh** | Specifies the **Static Mesh** to render for this component. |

### Materials

| Property | Description |
| --- | --- |
| **Element #** | Once a **Static Mesh** has been specified in the **Static Mesh Property**, a number of additional **Material Properties** will appear. These will be named based on the **Material IDs** applied to the **Static Mesh**. |

### Spline Mesh

| Property | Description |
| --- | --- |
| **Start Pos** | Start location of spline, in component space. |
| **Start Tangent** | Start tangent of spline, in component space. |
| **End Pos** | End location of spline, in component space. |
| **End Tangent** | End tangent of spline, in component space. |
| **Spline Up Dir** | Axis (in component space) that is used to determine X axis for co-ordinates along spline |
| **Forward Axis** | Chooses the forward axis for the spline mesh orientation |

#### Advanced

| Property | Description |
| --- | --- |
| **Start Scale** | X and Y scale applied to mesh at start of spline. |
| **Start Roll** | Roll around spline applied at start, in radians. |
| **Start Offset** | Starting offset of the mesh from the spline, in component space. |
| **End Scale** | X and Y scale applied to mesh at end of spline. |
| **End Roll** | Roll around spline applied at end, in radians. |
| **End Offset** | Ending offset of the mesh from the spline, in component space. |
| **Smooth Interp Roll Scale** | If true, will use smooth interpolation (ease in/out) for Scale, Roll, and Offset along this section of spline. |
| **Spline Boundary Min** | Minimum coordinate along the spline forward axis which corresponds to start of spline. |
| **Spline Boundary Max** | Maximum coordinate along the spline forward axis which corresponds to end of spline. |

### Spline

| Property | Description |
| --- | --- |
| **Allow Spline Editing Per Instance** | If true, spline mesh properties - StartPos, EndPos, StartTangent and EndTangent- may be edited per instance in the level viewport. |

### Physics

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

### Collision

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

### Lighting

| Property | Description |
| --- | --- |
| **Cast Shadow** | is true. |

#### Advanced

| Property | Description |
| --- | --- |
| **Affect Dynamic Indirect Lighting** | Controls whether the primitive should influence indirect lighting. |
| **Affect Distance Field Lighting** | Controls whether the primitive should affect dynamic distance field lighting methods. |
| **Cast Dynamic Shadow** | Controls whether the primitive should cast shadows in the case of non precomputed shadowing. |
| **Cast Static Shadow** | Whether the object should cast a static shadow from shadow casting lights. |
| **Cast Volumetric Translucent Shadow** | Whether the object should cast a volumetric translucent shadow. |
| **Self Shadow Only** | When enabled, the component will only cast a shadow on itself and not other components in the world. |
| **Cast Far Shadow** | When enabled, the component will be rendering into the far shadow cascades (only for directional lights). |
| **Cast Inset Shadow** | Whether this component should create a per-object shadow that gives higher effective shadow resolution. |
| **Cast Cinematic Shadow** | Whether this component should cast shadows from lights that have bCastShadowsFromCinematicObjectsOnly enabled. |
| **Cast Hidden Shadow** | If true, the primitive will cast shadows even if bHidden is true. |
| **Cast Shadow as Two Sided** | Whether this primitive should cast dynamic shadows as if it were a two sided material. |
| **Light as if Static** |  |
| **Light Attachments as Group** | set in a parent. |
| **Indirect Lighting Cache Quality** | Quality of indirect lighting for Movable primitives. |
| **Single Sample Shadow From Stationary Lights** | Whether the whole component should be shadowed as one from stationary lights, which makes shadow receiving much cheaper. |
| **Lighting Channels** | Channels that this component should be in. |

### Rendering

| Property | Description |
| --- | --- |
| **Visible** | . |
| **Hidden in Game** | Whether to hide the primitive in game, if the primitive is Visible. |

#### Advanced

| Property | Description |
| --- | --- |
| **Texture Streaming** | **Force Mip Streaming**: If true, forces mips for textures used by this component to be resident when this component's level is loaded. |
| **LOD** | **Min Draw Distance**: The minimum distance at which the primitive should be rendered, measured in world space units from the center of the primitive's bounding sphere to the camera position. **Desired Max Draw Distance**: Max draw distance exposed to LDs. **Current Max Draw Distance**: The distance to cull this primitive at. **Allow Cull Distance Volume**: Whether to accept cull distance volumes to modify cached cull distance. **Detail Mode**: If detail mode is >= system detail mode, primitive won't be rendered. |
| **Render In Main Pass** | If true, this component will be rendered in the main pass (z prepass, basepass, transparency) |
| **Receives Decals** | Whether the primitive receives decals. |
| **Owner No See** | If this is True, this component won't be visible when the view actor is the component's owner, directly or indirectly. |
| **Only Owner See** | If this is True, this component will only be visible when the view actor is the component's owner, directly or indirectly. |
| **Treat As Background for Occlusion** | Treat this primitive as part of the background for occlusion purposes. |
| **Use As Occluder** | Whether to render the primitive in the depth only pass. |
| **Render CustomDepth Pass** | If true, this component will be rendered in the CustomDepth pass (usually used for outlines) |
| **CustomDepth Stencil Value** | Optionally write this 0-255 value to the stencil buffer in CustomDepth pass (Requires project setting or r.CustomDepth == 3) |
| **Translucency Sort Priority** | Translucent objects with a lower sort priority draw behind objects with a higher priority. Translucent objects with the same priority are rendered from back-to-front based on their bounds origin. |
| **Lpv Bias Multiplier** |  |
| **Bounds Scale** | Scales the bounds of the object. |
| **Use Attach Parent Bound** | If true, this component uses its parents bounds when attached. |

### Tags

| Property | Description |
| --- | --- |
| **Component Tags** | Array of tags that can be used for grouping and categorizing. Can also be accessed from scripting. |

### Activation

| Property | Description |
| --- | --- |
| **Auto Activate** | Whether the component is activated at creation or must be explicitly activated. |

### Events

| Property | Description |
| --- | --- |
| **On Component Hit** | Event called when a component hits (or is hit by) something solid. |
| **On Component Begin Overlap** | Event called when something starts to overlaps this component, for example a player walking into a trigger. |
| **On Component End Overlap** | Event called when something stops overlapping this component |
| **On Component Wake** | Event called when the underlying physics objects is woken up |
| **On Component Sleep** | Event called when the underlying physics objects is put to sleep |
| **On Begin Cursor Over** | Event called when the mouse cursor is moved over this component and mouse over events are enabled in the player controller |
| **On End Cursor Over** | Event called when the mouse cursor is moved off this component and mouse over events are enabled in the player controller |
| **On Clicked** | Event called when the left mouse button is clicked while the mouse is over this component and click events are enabled in the player controller |
| **On Released** | Event called when the left mouse button is released while the mouse is over this component click events are enabled in the player controller |
| **On Input Touch Begin** | Event called when a touch input is received over this component when touch events are enabled in the player controller |
| **On Input Touch End** | Event called when a touch input is released over this component when touch events are enabled in the player controller |
| **On Input Touch Enter** | Event called when a finger is moved over this component when touch over events are enabled in the player controller |
| **On Input Touch Leave** | Event called when a finger is moved off this component when touch over events are enabled in the player controller |
| **Physics Volume Changed** | Delegate that will be called when PhysicsVolume has been changed. |

### Mobile

| Property | Description |
| --- | --- |
| **Receive Combined Static and CSM Shadows from Stationary Lights** |  |

- splines

On this page

- Properties (-> blueprint-spline-mesh-component-property-reference-in-unreal-engine)
- Transform (-> blueprint-spline-mesh-component-property-reference-in-unreal-engine)
- Sockets (-> blueprint-spline-mesh-component-property-reference-in-unreal-engine)
- Static Mesh (-> blueprint-spline-mesh-component-property-reference-in-unreal-engine)
- Materials (-> blueprint-spline-mesh-component-property-reference-in-unreal-engine)
- Spline Mesh (-> blueprint-spline-mesh-component-property-reference-in-unreal-engine)
- Advanced (-> blueprint-spline-mesh-component-property-reference-in-unreal-engine)
- Spline (-> blueprint-spline-mesh-component-property-reference-in-unreal-engine)
- Physics (-> blueprint-spline-mesh-component-property-reference-in-unreal-engine)
- Physics (-> blueprint-spline-mesh-component-property-reference-in-unreal-engine)
- Advanced (-> blueprint-spline-mesh-component-property-reference-in-unreal-engine)
- Collision (-> blueprint-spline-mesh-component-property-reference-in-unreal-engine)
- Collision (-> blueprint-spline-mesh-component-property-reference-in-unreal-engine)
- Advanced (-> blueprint-spline-mesh-component-property-reference-in-unreal-engine)
- Lighting (-> blueprint-spline-mesh-component-property-reference-in-unreal-engine)
- Advanced (-> blueprint-spline-mesh-component-property-reference-in-unreal-engine)
- Rendering (-> blueprint-spline-mesh-component-property-reference-in-unreal-engine)
- Advanced (-> blueprint-spline-mesh-component-property-reference-in-unreal-engine)
- Tags (-> blueprint-spline-mesh-component-property-reference-in-unreal-engine)
- Activation (-> blueprint-spline-mesh-component-property-reference-in-unreal-engine)
- Events (-> blueprint-spline-mesh-component-property-reference-in-unreal-engine)
- Mobile (-> blueprint-spline-mesh-component-property-reference-in-unreal-engine)
