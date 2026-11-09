# Data Inspectors

https://dev.epicgames.com/documentation/en-us/unreal-engine/data-inspectors-in-chaos-visual-debugger?application_version=5.9

> Understand data inspectors in Chaos Visual Debugger.

[image: Data Inspectors]

The **Chaos Visual Debugger (-> chaos-visual-debugger-in-unreal-engine)**(**CVD**) displays data in both the **Details **panel and **Data Inspector **tabs located in the bottom-right corner of CVD’s interface.

Each data category has a dedicated Data Inspector:

- Particle Data (Details Panel) (-> data-inspectors-in-chaos-visual-debugger)
- Collision Data (-> data-inspectors-in-chaos-visual-debugger)
- Scene Queries (-> data-inspectors-in-chaos-visual-debugger)
- Joint Constraint Data (-> data-inspectors-in-chaos-visual-debugger)

[image: Data Inspectors]

## Particle Data (Details Panel)

The **Details** panel acts as a data inspector for particle data. In the context of CVD, particles usually refer to rigid bodies.

When you select a particle in the viewport or in the **Outliner**, this panel populates with all data recorded for that particle. Unlike collision contacts or scene queries, data for selected particles persists in the inspector when you use CVD’s playback controls.

If a selected particle contains collision data, a **Show Collision Data Inspector** contextual button appears at the bottom of the Details panel. This populates the Collision Data Inspector with the selected particle’s data.

|  |  |
| --- | --- |
| [image: Static Particle Data] | [image: Dynamic Particle Data] |
| Details panel for a selected dynamic particle. | Details panel for a selected static particle. |

## Collision Data Inspector

The **Collision Data Inspector** displays information for a selected **particle**, **contact **(a point where two collision shapes overlap), or **collision pair** (two particles that collide with one another).

[image: Collision Data Inspector]

Since contacts are generated per frame, when you use CVD’s playback controls, the collision data you inspect becomes out of date. Due to this, the Collision Data Inspector only displays data for the last-selected contact during playback.

To populate the Collision Data Inspector with collision pair information, follow these steps:

- In the viewport, select a particle with collision data.
- Click the **Show Collision Data Inspector** contextual button that appears in the **Details **panel. [image: Show Collision Data]This populates the Collision Data Inspector with data from the particle, including a dropdown list of available collision pairs.[image: Available Collision Pairs]
- Select the collision pair you want to inspect.
- To identify each particle in the Details panel, Outliner, and Viewport, click the **Select Particle 0** or **Select Particle 1 **button.[image: Select Particle Buttons]

## Scene Query Inspector

The **Scene Query Inspector** displays information for a visualized query that is selected in the viewport. This inspector has its own timeline that steps through the objects that were evaluated as part of the query.

[image: Scene Query Inspector]

A contextual **Go to parent query** button becomes available if CVD detects that the selected query has performed (or is itself) a subquery. You can use this button to navigate to the parent query.

[image: Contextual Button]

### Scene Query Browser

The **Scene Query Browser** is an all-in-one browser for inspecting scene queries. To access the Scene Query Browser, click **Scene Query Browser** in CVD’s main toolbar.

[image: Scene Query Browser Button]

[image: Scene Query Browser UI]

| Number | Description |
| --- | --- |
| 1 | Enables scene query data flags (identical to those found in **Show > Scene Query Data Flags**). |
| 2 | Toggles viewport debug text (if any) on and off. Draws data in **worldspace **or in the **foreground **(always on top of any other scene components).Identical to the options found in **Show > Scene Query Visualization Settings**. |
| 3 | Filters queries by **Trace Tag**, **Trace Owner**, **Query** **Type**, or **Solver Name**. |
| 4 | **All Enabled Queries: **Visualizes all recorded queries.**Per Solver Recording Order:** Visualizes one query at the time and enables the Recorded Scene Queries timeline (see below). |
| 5 | Naviagates between recorded queries. This is useful if there are several scene queries on one frame that happen in the same location. |

## Joint Constraint Data Inspector

The Joint Constraint Data Inspector displays joint state and joint setting (-> constraints-user-guide-in-unreal-engine) data for joints that are selected in the viewport. Data in this inspector updates as you n through CVD’s playback controls.

[image: Joint Constraint Inspector]

## Next Up

- [image: Capturing Data with Chaos Visual Debugger] Capturing Data with Chaos Visual DebuggerCapture and play back recordings with Chaos Visual Debugger. (-> capturing-data-with-chaos-visual-debugger)

- chaos visual debugger

On this page

- Particle Data (Details Panel) (-> data-inspectors-in-chaos-visual-debugger)
- Collision Data Inspector (-> data-inspectors-in-chaos-visual-debugger)
- Scene Query Inspector (-> data-inspectors-in-chaos-visual-debugger)
- Scene Query Browser (-> data-inspectors-in-chaos-visual-debugger)
- Joint Constraint Data Inspector (-> data-inspectors-in-chaos-visual-debugger)
- Next Up (-> data-inspectors-in-chaos-visual-debugger)
