# Dynamic Wind for Nanite Foliage

https://dev.epicgames.com/documentation/en-us/unreal-engine/dynamic-wind-for-nanite-foliage-in-unreal-engine?application_version=5.9

> Use Dynamic Wind to simulate wind on Nanite Foliage, with local forces and push capsules that bend nearby plants.

Learn to use this **Experimental** feature, but use caution when shipping with it.

**Dynamic Wind** moves foliage in the wind by simulating the bones of skeletal plant meshes on the GPU, instead of offsetting vertices in the material. Each bone's mass and wind-catching area come from the mesh itself, so a small bush and a large tree respond differently to the same wind without hand calibration. On top of the world's wind, you can add force sources and push capsules that bend nearby plants, for example for an explosion, a helicopter's downwash or a character walking through grass.

Dynamic Wind is the wind system for Nanite Foliage (-> nanite-foliage), which animates trees through Nanite Skinning rather than World Position Offset. It drives plants placed as **Instanced Skinned Mesh** components, and it works with skeletal meshes that the Procedural Vegetation Editor (PVE) (-> procedural-vegetation-editor-in-unreal-engine) exports.

## How Dynamic Wind Simulates Foliage

Every frame, Dynamic Wind works out a bending force for each bone from the global wind, any force sources and push capsules that reach it, and any external velocity volumes. That force drives two motions per bone:

- **Sway**, a slow, springy motion driven by drag. It's what makes trunks and large branches lean and rock.
- **Flutter**, a fast shimmer driven by the vortices that wind sheds off a branch. Flutter is always present, so leaves stay alive in a light breeze, and it speeds up and strengthens as the wind gets stronger.

The two motions are added into one rotation per bone. A branch bends by the same total amount whether it's built from three bones or ten.

### What the Mesh Provides

When a skeletal mesh has Dynamic Wind data, the editor analyzes its geometry and stores each bone's mass, wind-catching area, center of mass and center of pressure. Each bone carries the totals of everything that hangs off it, so a trunk bends under the load of the whole crown. Wood and leaves get separate densities you set per asset, and Nanite Assembly parts count toward the totals by default.

The analysis needs the mesh's source geometry and skin weights. Until it finishes, or if it fails, the plant stays in its bind pose.

### Shared Wind and Individual Plants

To keep large worlds affordable, Dynamic Wind works in two tiers. Plants that only feel the global wind share a small set of simulations, one per wind direction. When a force source, push capsule or external velocity volume reaches a plant, that plant is **promoted** to its own simulation, which starts from the shared motion so there's no visible pop. After the force leaves, the plant keeps simulating for a grace period and then blends back to the shared motion.

Each mesh has a budget of individually simulated instances, and memory grows and shrinks with demand. When the budget is full, further plants keep the shared motion.

### Wind Modes

The `DynamicWind.Mode` console variable switches between the default force-based simulation and a cheaper parametric mode for low-end hardware. The parametric mode plays a stylized wind animation with no per-plant state, forces or push capsules. **Is Ground Cover**, **Gust Attenuation** and each group's influence settings only affect the parametric mode.

## Enabling the Dynamic Wind Plugin

Dynamic Wind is an Experimental plugin, and it isn't enabled by default. To enable it, open **Edit > Plugins**, find **Dynamic Wind** in the **Rendering** category, enable it, and restart the editor. Enabling the Procedural Vegetation Editor plugin also enables Dynamic Wind. The plugin brings the Interchange, Interchange OpenUSD and USD Core plugins with it in the editor.

Dynamic Wind needs the Shader Model 6 (SM6) feature level. Below it, plants don't move. Dynamic Wind also needs Nanite Foliage. In **Project Settings > Engine > Rendering**, enable **Nanite Foliage (Experimental)**, which sets `r.Nanite.Foliage`, and restart the editor. Without it, PVE meshes, which are built as Nanite Assemblies, fall back to non-Nanite rendering and Dynamic Wind skips them.

You then work with Dynamic Wind through the wind data on a skeletal mesh, the **Transform Provider** of an Instanced Skinned Mesh component, the **Dynamic Wind Force** and **Dynamic Wind Push Capsule** components, and the **Wind Mass Viewer** in the Skeletal Mesh Editor.

## Setting Up Foliage for Dynamic Wind

- **Add wind data to the skeletal mesh.** The wind data assigns bones to simulation groups, such as a trunk and branches. It comes from one of these sources:**Procedural Vegetation Editor.** When you export a skeletal mesh from PVE, choose a preset in the export's **Wind Settings** property. PVE writes the wind data onto the exported mesh.
- **USD.** Importing a USD file through Interchange adds wind data to any skeleton that has the Dynamic Wind schema applied. Meshes imported before this was set up must be imported again, not reimported.
- **JSON.** Right-click a skeletal mesh in the Content Browser and use the plugin's scripted asset action to import a Dynamic Wind JSON file. Blueprint and Python can run the same import.

- **If the mesh doesn't use Nanite, enable Optimize For Instancing** in the mesh's LOD build settings. Dynamic Wind skips non-Nanite meshes that don't have it.
- **Set the component's Transform Provider.** On each Instanced Skinned Mesh component that uses the mesh, set **Transform Provider** to a Dynamic Wind Data asset. Only components with a Dynamic Wind Data transform provider register with the wind system.
- **Feed the world's wind.** From a Blueprint, get the Dynamic Wind subsystem and call **Update Wind Parameters** whenever your weather changes. Dynamic Wind smooths changes so plants don't pop.
- **Add forces where gameplay needs them.** Add a **Dynamic Wind Force** or **Dynamic Wind Push Capsule** component to an actor, as described in the next section.
- **Check and tune the result** in the Wind Mass Viewer and with the debug views described in Dynamic Wind Settings (-> dynamic-wind-for-nanite-foliage-in-unreal-engine).

## Forces and Push Capsules

Forces and push capsules are components that push on foliage locally. They follow their owner, so you can attach them to moving actors, and any plant they reach is promoted to its own simulation.

### Dynamic Wind Force Component

A **Dynamic Wind Force** component is a source of moving air. Its **Strength** is a pressure in pascals that acts like the world's wind, with the same drag, turbulence and flutter. Its sphere radius sets its reach, and **Basis** sets its shape:

|  |  |
| --- | --- |
| **Basis** | **Description** |
| Radial | Pushes outward from the center, like a blast. **Lobe Amount** biases it toward the component's forward direction. |
| Directional | Pushes along the component's forward direction, like a fan. |
| Swirl | Circles around the component's up axis, like a whirlwind. **Swirl Core Radius** sets where the swirl is fastest. |
| Cone | Pushes outward in a cone along the forward direction. **Cone Angle Degrees** sets its half-angle. |

By default, a force blows continuously. Set **Base Strength Mode** to **Event Only** to fire it in short bursts instead. Events need **Propagation History Samples** set to 2 or more, which also makes the force travel outward at the **Propagation Speed**. Choose the burst's shape with **Event Type**: **Friedlander** (a blast wave with a suction phase after it), **Pulse** or **Burst**. To fire an event, click **Emit Event** in the component's Details panel, or call **Emit Event** or **Trigger Shockwave** from a Blueprint.

### Dynamic Wind Push Capsule Component

A **Dynamic Wind Push Capsule** component pushes bones out of a capsule shape, with no air involved. Use it for contact, such as a character wading through grass or a vehicle brushing past bushes. Size it with the capsule's usual radius and half height handles.

|  |  |
| --- | --- |
| **Property** | **Description** |
| Strength | How hard the capsule pushes. This is a direct force rather than a pressure, so its numbers don't compare with a force component's **Strength**. Default: 1000. |
| Penetration Falloff | How the push grows with depth inside the capsule. 1 is linear and 2 is quadratic. Higher values concentrate the push near the surface. Default: 1. |

### External Velocity Volumes

For wind that changes across space, such as a fluid simulation, you can register a volume texture of air velocities with the Dynamic Wind subsystem from a Blueprint, using **Register External Volume**. Plants inside the volume sway and flutter from the velocities it holds, and those in fast-moving areas are promoted. Up to four volumes can be active at once. Call **Update External Volume** whenever the volume moves, because Dynamic Wind doesn't track it for you.

## Dynamic Wind Settings

### World Wind Parameters

These are the fields of the **Dynamic Wind Parameters** structure that you pass to **Update Wind Parameters**.

|  |  |
| --- | --- |
| **Property** | **Description** |
| **Wind Direction** | The world-space direction the wind blows toward. |
| **Wind Speed** | Wind speed in meters per second. Doubling it pushes four times as hard. Default: 5. |
| **Wind Amplitude** | An overall multiplier on sway and flutter. Change **Wind Speed** for physically based weather; animate this to fade wind in and out in stylized scenes. Default: 1. |
| **Wind Texture** | A 2D noise texture that varies the wind across the world. |
| **Flutter Wind Ramp Start** / **End** | The wind speeds, in meters per second, where flutter starts and finishes ramping up. Defaults: 3 and 20. |
| **Flutter Frequency Scale Start** / **End** | Multipliers on flutter speed at the start and end of the ramp. Defaults: 0.25 and 1. |
| **Flutter Amplitude Scale Start** / **End** | Multipliers on flutter strength at the start and end of the ramp. Raise the end value for stronger storm shimmer. Defaults: 1 and 1. |

### Skeletal Mesh Wind Data

The wind data is a **Dynamic Wind Skeletal Data** entry in the skeletal mesh's **Asset User Data**. Changing a **Bake** property reanalyzes the mesh.

|  |  |
| --- | --- |
| **Property** | **Description** |
| **Is Enabled** | Registers the mesh with Dynamic Wind. When it's off, the mesh stays in its bind pose. |
| **Include Assembly Geometry** | Counts Nanite Assembly parts in the analysis. Default: on. |
| **Density** (Bake) | The density of wood, in kg/m³, used to turn branch volume into mass. Default: 700. |
| **Leaf Areal Density** (Bake) | Leaf mass per square meter. Lower it for livelier canopy tips. Default: 0.6. |
| **Leaf Optical Depth** (Bake) | How much leaves shelter the foliage behind them from the wind. 0 turns sheltering off. Default: 0.4. |
| **Max Active Instances** | The most instances of this mesh that can simulate individually at once. Overrides the project default of 256. |
| **Simulation Groups** | The per-group tuning described in the next table. |

### Simulation Group Settings

Each simulation group tunes a set of bones relative to the project's defaults. Most physics settings have a checkbox: leave it off and the group uses the project default. The **Base** and **Tip** versions of a setting apply at the start and end of each bone chain, and the group blends between them along the chain.

|  |  |
| --- | --- |
| **Property** | **Description** |
| **Is Trunk?** | Marks the group as a trunk, which tapers by height and uses the trunk defaults. |
| **Base Frequency Scale** / **Tip Frequency Scale** | Multiplies how fast the group sways. Faster also means stiffer, so it moves less. |
| **Base Settling Time Scale** / **Tip Settling Time Scale** | Multiplies how long the group takes to come to rest. |
| **Base Max Bend Angle** / **Tip Max Bend Angle** | The most the whole chain can bend, in degrees from end to end. 0 makes it rigid. Default: 90. |
| **Tip Falloff Power** | Shapes the blend from Base to Tip. Values below 1 give a firm base and a whippy tip. |
| **Length Frequency Variation** | How much shorter branches sway faster than longer ones. 0 turns this off for the group. |
| **Stiffness Compensation Scale** | Gives back movement that faster branches lose. Below 1 reads stiffer, above 1 floppier. |
| **Flutter Frequency Scale** | Multiplies the flutter speed relative to each bone's sway speed. |
| **Wind Response Scale** | Scales how strongly the wind pushes this group. Default: 1. |

### Project Settings

In **Project Settings > Plugins > Dynamic Wind (Foliage)**, **Enable USD Import** controls whether Dynamic Wind data is read from USD files during Interchange import. It's on by default, and changing it needs an editor restart.

### Wind Mass Viewer

The **Wind Mass Viewer** is a panel in the Skeletal Mesh Editor that shows what the analysis produced and how the simulation will resolve each bone. It opens automatically when you open a mesh with enabled wind data, and you can open it from the **Window** menu as **Dynamic Wind Mass Viewer**. Select a bone to see its mass, drag area and resolved sway frequency and settling time. You can also draw centers of mass and pressure in the viewport, color bones with a heat map, and graph frequency, settling time or bounces against chain length. It needs no wind or force in the scene.

### Console Variables

These are the console variables you're most likely to need. Many more tune the project-wide defaults.

|  |  |
| --- | --- |
| **Console Variable** | **Description** |
| `DynamicWind.Mode` | 1 (default) runs the force-based simulation. 0 runs the stateless parametric wind. |
| `DynamicWind.OverrideSpeed` | Overrides the wind speed for testing. Values below 0 (default -1) use the speed from **Update Wind Parameters**. |
| `DynamicWind.OverrideAmplitude` | Overrides the wind amplitude for testing. Values below 0 (default -1) turn the override off. |
| `DynamicWind.DemoteGracePeriod` | The number of seconds a promoted plant keeps simulating after the last force touches it. Default: 3. |
| `DynamicWind.Flutter.DebugIsolate` | 1 shows only flutter, 2 shows only sway, and 0 (default) shows both. |
| `DynamicWind.Debug.Ring.Enable` | Draws a ring under each promoted plant, colored by its state. |
| `DynamicWind.Debug.Bone.Enable` | Draws each bone's sway and flutter on promoted plants. Bones at their bend limit turn red. |
| `DynamicWind.Debug.Arrow.Enable` | Draws arrows for the force field inside force volumes. The arrows follow the radial field whatever the Basis is, so they don't show Swirl, Directional or Cone shapes. |
| `DynamicWind.Debug.Tracks` | Shows how full the instance budgets are. |

## Limitations

- Bones are assigned to simulation groups only by import, from PVE, USD or JSON. You can't build that data by hand in the editor.
- Each bone simulates on its own as a spring. There's no full constraint solver between bones.

## Troubleshooting

### Foliage Doesn't Move

Check that the component's **Transform Provider** is a Dynamic Wind Data asset, that the mesh's wind data has **Is Enabled** on, and that the project runs at SM6. Open the Wind Mass Viewer and select a bone: if its mass and drag area are zero, the analysis hasn't finished or the mesh is missing its source geometry. For a non-Nanite mesh, check the Output Log for "is non-Nanite and lacks a unified bone map" and enable **Optimize For Instancing**. If the log also says a PVE mesh failed to build as a Nanite Assembly, Optimize For Instancing isn't the fix: enable **Nanite Foliage (Experimental)** in **Project Settings > Engine > Rendering** and restart the editor.

### A Force Has No Effect on Nearby Plants

Make sure the force reaches the plants. The sphere radius is in centimeters, so 100 is one meter. Turn on `DynamicWind.Debug.Arrow.Enable` to see the force field and `DynamicWind.Debug.Ring.Enable` to see which plants are promoted. If plants near the force share the global motion instead, the mesh's instance budget is full: raise **Max Active Instances** or lower `DynamicWind.DemoteGracePeriod`.

## More Information

- Nanite Foliage (-> nanite-foliage)
- Procedural Vegetation Editor (PVE) (-> procedural-vegetation-editor-in-unreal-engine)

On this page

- How Dynamic Wind Simulates Foliage (-> dynamic-wind-for-nanite-foliage-in-unreal-engine)
- What the Mesh Provides (-> dynamic-wind-for-nanite-foliage-in-unreal-engine)
- Shared Wind and Individual Plants (-> dynamic-wind-for-nanite-foliage-in-unreal-engine)
- Wind Modes (-> dynamic-wind-for-nanite-foliage-in-unreal-engine)
- Enabling the Dynamic Wind Plugin (-> dynamic-wind-for-nanite-foliage-in-unreal-engine)
- Setting Up Foliage for Dynamic Wind (-> dynamic-wind-for-nanite-foliage-in-unreal-engine)
- Forces and Push Capsules (-> dynamic-wind-for-nanite-foliage-in-unreal-engine)
- Dynamic Wind Force Component (-> dynamic-wind-for-nanite-foliage-in-unreal-engine)
- Dynamic Wind Push Capsule Component (-> dynamic-wind-for-nanite-foliage-in-unreal-engine)
- External Velocity Volumes (-> dynamic-wind-for-nanite-foliage-in-unreal-engine)
- Dynamic Wind Settings (-> dynamic-wind-for-nanite-foliage-in-unreal-engine)
- World Wind Parameters (-> dynamic-wind-for-nanite-foliage-in-unreal-engine)
- Skeletal Mesh Wind Data (-> dynamic-wind-for-nanite-foliage-in-unreal-engine)
- Simulation Group Settings (-> dynamic-wind-for-nanite-foliage-in-unreal-engine)
- Project Settings (-> dynamic-wind-for-nanite-foliage-in-unreal-engine)
- Wind Mass Viewer (-> dynamic-wind-for-nanite-foliage-in-unreal-engine)
- Console Variables (-> dynamic-wind-for-nanite-foliage-in-unreal-engine)
- Limitations (-> dynamic-wind-for-nanite-foliage-in-unreal-engine)
- Troubleshooting (-> dynamic-wind-for-nanite-foliage-in-unreal-engine)
- Foliage Doesn't Move (-> dynamic-wind-for-nanite-foliage-in-unreal-engine)
- A Force Has No Effect on Nearby Plants (-> dynamic-wind-for-nanite-foliage-in-unreal-engine)
- More Information (-> dynamic-wind-for-nanite-foliage-in-unreal-engine)
