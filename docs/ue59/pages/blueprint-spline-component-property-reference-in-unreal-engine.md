# Blueprint Spline Component Property Reference

https://dev.epicgames.com/documentation/en-us/unreal-engine/blueprint-spline-component-property-reference-in-unreal-engine?application_version=5.9

> Contains a reference of all properties available in the editor for Blueprint Spline Components.

[image: Blueprint Spline Component Property Reference]

This page contains a reference listing of properties available on **Blueprint Spline Components**. The properties displayed will be slightly different if the **Blueprint Spline Component** is selected in the **Blueprint Editor**, is a **Root Component**, or if the component is selected in the **Level Editor**.

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

### Spline

| Property | Description |
| --- | --- |
| **Duration** | Specifies the duration of the spline in seconds |
| **Override Construction Script** | Whether the spline has been edited from its default by the spline component visualizer |
| **Input Spline Points to Construction Script** | Whether the spline points should be passed to the User Construction Script so they can be further manipulated by it. |
| **Draw Debug** | If true, the spline will be rendered if the Splines showflag is set. |
| **Closed Loop** | Whether the spline is to be considered as a closed loop. |
| **Default Up Vector** | Default up vector in local space to be used when calculating transforms along the spline |

### Advanced

| Property | Description |
| --- | --- |
| **Reparam Steps Per Segment** | Number of steps per spline segment to place in the reparameterization table |
| **Stationary Endpoints** | Whether the endpoints of the spline are considered stationary when traversing the spline at non-constant velocity. |

### Editor

| Property | Description |
| --- | --- |
| **Editor Unselected Spline Segment Color** | Color of an unselected spline component segment in the editor. |
| **Editor Selected Spline Segment Color** | Color of a selected spline component segment in the editor. |
| **Should Visualize Scale** | Whether or not scale visualization should be displayed in the editor. |
| **Scale Visualization Width** | Width of the spline when scale visualization is enabled in the editor. |

### Selected Points

| Property | Description |
| --- | --- |
| **Input Key** | This is the index of the selected **Curve Point** on the curve. |
| **Position** | This is the location of the selected **Curve Point** in local space. |
| **Arrive Tangent** | This is the vector that defines the tangent of the curve as it approaches the selected **Curve Point**. |
| **Leave Tangent** | This is the vector that defines the tangent of the curve as it departs the selected **Curve Point**. |
| **Rotation** | Rotation can be applied to a **Curve Point** to modify its tangents. This value is applied separately from the tangents, so both can be modified to create the desired results. |
| **Scale** | Scale can be applied to a **Curve Point** to modify its tangents. This value is applied separately from the tangents, so both can be modified to create the desired results. |
| **Type** | Defines the type of curve at the selected **Curve Point**. **Linear**: From the selected **Curve Point** to the next, the curve will be straight. This affects the tangent coming into the selected **Curve Point** as well as the tanget departing the next. **Curve**: Default value. The locations of the **Curve Points** (before and after the selected one) define the tangents of the selected **Curve Point**. **Constant**: Like **Linear** but **doesn't** affect the tangent coming into the selected **Curve Point** as well as the tanget departing the next. **CurveClamped**: Like **Curve** but it clamps the tangents of the curve. **CurveCustomTangent**: If you adjust any tangent on a **Curve Point**, it is set to this value. |

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

- splines

On this page

- Properties (-> blueprint-spline-component-property-reference-in-unreal-engine)
- Transform (-> blueprint-spline-component-property-reference-in-unreal-engine)
- Sockets (-> blueprint-spline-component-property-reference-in-unreal-engine)
- Spline (-> blueprint-spline-component-property-reference-in-unreal-engine)
- Advanced (-> blueprint-spline-component-property-reference-in-unreal-engine)
- Editor (-> blueprint-spline-component-property-reference-in-unreal-engine)
- Selected Points (-> blueprint-spline-component-property-reference-in-unreal-engine)
- Tags (-> blueprint-spline-component-property-reference-in-unreal-engine)
- Activation (-> blueprint-spline-component-property-reference-in-unreal-engine)
- Events (-> blueprint-spline-component-property-reference-in-unreal-engine)
