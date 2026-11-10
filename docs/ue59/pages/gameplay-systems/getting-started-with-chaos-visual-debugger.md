# Getting Started with Chaos Visual Debugger

https://dev.epicgames.com/documentation/en-us/unreal-engine/getting-started-with-chaos-visual-debugger?application_version=5.9

> Navigate Chaos Visual Debugger’s user interface.

[image: Getting Started with Chaos Visual Debugger]

**Chaos Visual Debugger (-> chaos-visual-debugger-in-unreal-engine)** (**CVD**) is a tool that you can use to record physics simulations. With CVD, you can record games and applications running on your machine, as well as from a remote machine, or a platform that’s connected to your machine.

By playing back recordings in CVD, you can inspect data for debugging. These recordings are project independent, meaning they can be loaded even without access to Unreal Engine (UE) project files, enabling cross-team collaboration or remote debugging.

The data that CVD records includes:

- **Particles **(including velocities, accelerations, mass properties, and object states)
- **Collision geometry **(including collision channels)
- **Collision constraints** (contact pairs with their state)
- **Joint constraints** (state and joint settings)
- **Character ground constraints** (physics-based character movement)
- **Scene queries** (including line traces, sweeps, and overlaps)
- **Rigid body animation nodes** (RBAN)

In the context of CVD, **particles **usually refer to rigid bodies.

## Launch Chaos Visual Debugger

There are two ways to launch CVD; from the Editor (-> getting-started-with-chaos-visual-debugger) or as a standalone program (-> getting-started-with-chaos-visual-debugger).

### Inside the Unreal Editor

To open the Chaos Visual Debugger from the Unreal Editor, in the menu bar, click **Tools > Debug > Chaos Visual Debugger**. After selecting CVD, the tool will open in a new window.

[image: Launch From The Editor]

### As a Standalone Program

To run CVD as a standalone program, you must use a source-code build of Unreal Engine. You can download a source-code build from GitHub. To learn more, see Building Unreal Engine from Source (-> building-unreal-engine-from-source).

You can build and run the CVD as a standalone program from either an executable (not portable) or batch file (portable). The table below describes the file location and build steps for each option.

| Build Flow | Description |
| --- | --- |
| **CVD Executable** | The executable is located in the following file path: `Engine\Binaries\Win64\ChaosVisualDebugger.exe `To build and run CVD, follow these steps:From your IDE of choice (such as Visual Studio), open the CVD executable.Build and run the executable.Once built, you can create a shortcut to the executable and run the tool with a single click. |
| **CVD Batch File** | The batch file located at the following path: `Engine\Programs\ChaosVisualDebugger\BuildAndCook.bat` To build and run CVD, follow these steps:Build the Editor.Run the batch file to build, cook, and package CVD.Access the output build from `Engine\Programs\ChaosVisualDebugger\PackagedBuild` and run it. |

## Explore the CVD User Interface

This section describes the most common buttons, panels, and toolbars you will interact with in the Chaos Visual Debugger. While some of these elements are similar to the Unreal Editor interface, you should familiarize yourself with CVD due to visual differences between CVD and some Unreal Editor versions.

The sections below describe where to find each user interface (UI) element and offer simple use cases. For a deeper dive, follow the links provided throughout this page.

[image: CVD Interface]

| Number | Name | Overview |
| --- | --- | --- |
| 1 | **Menu Bar** | Options to load recent recordings and modify the CVD layout. |
| 2 | **Main Toolbar** | Options to start or stop recordings, load recordings, and customize which data to record. |
| 3 | **Viewport Toolbar** | Options to modify which data is displayed in the viewport and how it's visually differentiated. |
| 4 | **Scene Outliner** | Displays a list of scene components within a recording. |
| 5 | **Viewport** | Displays a loaded or live recording, like the Unreal Editor viewport. This can include:A level open in the Unreal Editor.A Play-In-Editor (PIE) session.Packaged builds running on your machine.An application running on a platform connected to your machine, such as a console. |
| 6 | **Playback Controls** | Displays a collection of playback timelines and logs including:The Game Frames Timeline (-> getting-started-with-chaos-visual-debugger)The Solver Timeline (-> getting-started-with-chaos-visual-debugger)The Solver Stage Timeline (-> getting-started-with-chaos-visual-debugger)The Recorded Output Log (-> getting-started-with-chaos-visual-debugger)The Output Log (-> getting-started-with-chaos-visual-debugger) |
| 7 | **Details Panel** | Displays information for a selection made in the viewport that doesn't have a dedicated Data Inspector, such as particles. |
| 8 | **Data Inspectors** | Provides additional details for:Collision data (-> data-inspectors-in-chaos-visual-debugger)Scene queries (-> data-inspectors-in-chaos-visual-debugger)Joint constraint data (-> data-inspectors-in-chaos-visual-debugger)Particle data (-> data-inspectors-in-chaos-visual-debugger) |

### Menu Bar

| Name | Description | Image |
| --- | --- | --- |
| **File** | Quick access to open recent recordings. | [image: Menu Bar File] |
| **Window** | Show or hide parts of the CVD UI. | [image: Menu Bar Window] |

### Main Toolbar

[image: Main Toolbar]

| Number | Name | Description |
| --- | --- | --- |
| 1 | **Open File** | Loads existing `.utrace` recordings. |
| 2 | **Connect to Session** | (Legacy) Connects to a remote machine for remote debugging.This is now only used when recording a remote session via the command line. See (Legacy) Record a Live Session with the Command Line Interface (-> live-debugging-with-chaos-visual-debugger) for more information. |
| 3 | **Combine** | Combines multiple recordings that are open in CVD into one `.cvdmulti` file. |
| 4 | **Scene Query Browser** | Inspects all scene queries made for a single frame. For more information on this, see Data Inspectors (-> data-inspectors-in-chaos-visual-debugger). |
| 5 | **Session Targets** | Selects the target(s) to record. |
| 6 | **Loading Mode** | Loads single or multiple recordings (which merges data). |
| 7 | **Record to File** | Begins a recording and saves to file. |
| 8 | **Record Live Session** | Begins a recording and renders the visualization in real time. |
| 9 | **Data Channels** | Customizes the data captured during recording, such as:Data flags (-> data-visualization-flags-in-chaos-visual-debugger)Simulation stages (-> getting-started-with-chaos-visual-debugger) |
| 10 | **Settings** | Customizes CVD’s UI and performance. |

### Viewport Toolbar

[image: Viewport Toolbar]

- Hamburger Menu (-> getting-started-with-chaos-visual-debugger)
- View Mode (-> getting-started-with-chaos-visual-debugger)
- Lighting Mode (-> getting-started-with-chaos-visual-debugger)
- Show Button (-> getting-started-with-chaos-visual-debugger)
- Transform and Snapping Toolbar (-> getting-started-with-chaos-visual-debugger)

#### Hamburger Menu

| Name | Description | Image |
| --- | --- | --- |
| **Play at Recorded Framerate** | Overrides the recorded frame rate to a fixed one. | [image: Play At Recorded Framerate] |
| **Object Tracking (F8)** | Locks the camera to an object in the viewport. | [image: Object Tracking] |
| **FOV Options** | Adjusts the viewport’s FOV (field of view) and furthest render distance. | [image: FOV Options] |
| **Allow Translucent Selection (T)** | Toggles the ability to click through translucent objects. | [image: Allow Translucent Selection] |
| **Go to Location** | Teleports the camera to a location entered into this field, using an XYZ format. | [image: Go To Location] |

#### View Mode

View mode switches between **Perspective**, **Top**, **Bottom**, **Left**, **Right**, **Front**, and **Back **views in the viewport.

| Perspective | Top | Left |
| --- | --- | --- |
| [image: Perspective] | [image: Top] | [image: Left] |

#### Lighting Mode

Lighting mode switches between **Lit**, **Unlit**, **Lit** **Wireframe**, and **Wireframe **view modes in the viewport.

 [image: Lighting Modes] [image: Lighting Modes] [image: Lighting Modes] [image: Lighting Modes]

**Lighting Modes**

For better visibility when using Unlit mode, enable **Mesh Edges**.

[image: Mesh Edges]

#### Show Button

The **Show **button modifies which visualization flags and debug text are visible in the viewport for an existing recording. For more information about data flags, see Data Visualization Flags (-> data-visualization-flags-in-chaos-visual-debugger).

[image: Show Button]

Settings in this menu persist between CVD sessions unless reset to default.

#### Transform and Snapping Toolbar

The transform and snapping toolbar is similar to the legacy viewport toolbar in previous versions of the Unreal Editor. Most often, you’ll use these tools to manipulate light actors.

| Icon | Name | Description |
| --- | --- | --- |
| [image: Icon Select] | **Select Objects** | Selects objects within the viewport. |
| [image: Translate Object] | **Select and Translate Objects** | Moves light actors around the world along individual axes, dual axes, or on all three axes. |
| [image: Rotate Object] | **Select and Rotate Objects** | Rotates light actors along individual axes. |
| [image: Scale Object] | **Select and Scale Objects** | Scales light actors using the scale gizmo. Use the gizmo to scale objects along individual axes, dual axes, or uniformly on all three axes. |
| [image: Coordinate System] | **Coordinate System** | Cycles the coordinate system between **World** and **Local**. |
| [image: Snap To Surface] | **Snap to Surface** | Sets the snapping behavior of light actors when you drag them along another object’s surface. |
| [image: Snap To Grid] | **Snap to Grid** | Toggles whether light actors snap to the grid and sets the increment. |
| [image: Rotation Increments] | **Rotation Increments** | Toggles whether light actors rotate in increments and sets the degree. |
| [image: Scaling Increments] | **Scaling Increments** | Toggles whether light actors scale in increments and sets the increment. |
| [image: Camera Speed] | **Camera Speed** | Affects the speed at which the camera can move around the world. |

### Scene Outliner

The **Scene Outliner **displays a list of scene components within a recording. Since each recording can contain multiple solvers, each solver's particles are put under a folder with the name and ID of the solver they belong to. Within that folder, each particle is labeled with its Chaos-side debug name.

[image: Scene Outliner]

In CVD, a **physics solver** is an instance of a physics simulation (usually from a game world), handled by the Chaos Physics Engine (-> physics-in-unreal-engine).

### Playback Controls

The Chaos Visual Debugger includes controls to play and rewind existing recordings based on game-thread (-> threaded-rendering-in-unreal-engine) frames, physics-solver frames, or stages of a simulation. This maximizes the degree to which you can inspect situations that use networked physics (-> networked-physics-overview), asynchronous physics, or multiple game worlds (such as multiplayer games).

#### Game Frames Timeline

The **Game Frames Timeline** represents each game-thread frame for a recording.

[image: Game Frames Timeline]

When you playback a recording using this timeline, you’ll notice that the Solver Timeline also plays. This is because for each **game-thread** frame that plays, CVD searches for the closest **physics-solver** frame available at that timestamp.

The frame numbers of the Game Frames Timeline may not always match the Solver Timeline. This is because game-thread frames can correspond to multiple physics-solver frames. Access to both timelines means you can inspect situations where this occurs, such as when using Async Physics.

[image: Game Frame and Solver Timelines] (1) Solver Timeline (2) Game Frames Timeline

For an in-depth explanation of how CVD visualizes Sync and Async Physics, data from multiple game worlds, and resimulated frames, see Debugging Chaos Physics in Unreal Engine at the 16:05 minute mark.

#### Solver Timeline

The **Solver Timeline** represents each physics-solver frame for a recording. Each solver gets a dedicated track. Using this timeline, you can playback data for any solver track and see which solver frame corresponds to a specific game-thread frame.

[image: Solver Timeline]

| Setting | Description | Image |
| --- | --- | --- |
| **Timeline Sync Mode** | Controls how each solver track is synced.**Recorded Timestamp (Default):** Syncs all solver tracks based on which time they were recorded, regardless of networked physics time offsets.**Network Tick:** Visualizes each solver track as if the client-side prediction logic works correctly. This can help you pinpoint any divergences that indicate a client and server desync.**Manual:** Fully disables automatic track syncs. | [image: Network Tick] |
| **Re-Simulation Badge** | Appears on any solver track that includes frames that are part of a re-simulation done during the network desync correction process. | [image: ReSim Badge] |
| **Visibility Control** | Shows or hides visualized data from a particular solver track. | [image: Visibility Control] |

#### Solver Stage Timeline

With the **Solver Stage Timeline**, you can jump to a specific **stage **of a physics simulation. **Stages **are snapshots of a simulation taken at different points within a single physics frame.

[image: Solver Stage Timeline]

You can visualize the following stages, using a particle simulation as an example:

| Stage | Description |
| --- | --- |
| **Evolution Start** | Takes a snapshot of all particles at the beginning of the solver step. |
| **Post-Integrate** | Takes a snapshot of all particles after performing the `Integrate` calculation on them. |
| **Collision Detection Broad Phase** | Takes a snapshot of all mid phases (an object is created for every particle pair whose bounds overlap) after running the Broad Phase of the collision detection process. |
| **Collision Detection Narrow Phase** | Takes a snapshot of all mid phases after running the Narrow Phase of the collision detection process. |
| **Pre Constraint Solve** | Takes a snapshot of all particles before solving the available constraints. |
| **Post Constraint Solve** | Takes a snapshot of all particles after solving the constraints. |
| **Evolution End** | Takes a snapshot of all particles at the end of the solver step. |

The Solver Stage Timeline is useful for inspecting unusual behavior within singular frames, such as when an object appears in the correct location at the beginning of a frame but in an unexpected location at the end of a frame.

#### Recorded Output Log

Located next to the Solver Timeline Tracks tab, the **Recorded Output Log **tab is where CVD records the log stream of your application for retroactive inspection.

[image: Recorded Output Log]

#### Output Log

The **Output Log **is a real-time log to monitor activity. This tab shows the active log for the current CVD instance and displays errors or warnings for CVD itself.

[image: Output Log]

## Details Panel

The **Details **panel displays information for a selection made in the viewport.

[image: Details Panel]

The Details panel also acts as the Data Inspector for particle data. For more information, see Particle Data (Details Panel) (-> data-inspectors-in-chaos-visual-debugger).

## Next Up

- [image: Data Inspectors] Data InspectorsUnderstand data inspectors in Chaos Visual Debugger. (-> data-inspectors-in-chaos-visual-debugger)

- [image: Data Visualization Flags] Data Visualization FlagsUnderstand data visualization flags in Chaos Visual Debugger. (-> data-visualization-flags-in-chaos-visual-debugger)

- [image: Capturing Data with Chaos Visual Debugger] Capturing Data with Chaos Visual DebuggerCapture and play back recordings with Chaos Visual Debugger. (-> capturing-data-with-chaos-visual-debugger)

- chaos visual debugger

On this page

- Launch Chaos Visual Debugger (-> getting-started-with-chaos-visual-debugger)
- Inside the Unreal Editor (-> getting-started-with-chaos-visual-debugger)
- As a Standalone Program (-> getting-started-with-chaos-visual-debugger)
- Explore the CVD User Interface (-> getting-started-with-chaos-visual-debugger)
- Menu Bar (-> getting-started-with-chaos-visual-debugger)
- Main Toolbar (-> getting-started-with-chaos-visual-debugger)
- Viewport Toolbar (-> getting-started-with-chaos-visual-debugger)
- Hamburger Menu (-> getting-started-with-chaos-visual-debugger)
- View Mode (-> getting-started-with-chaos-visual-debugger)
- Lighting Mode (-> getting-started-with-chaos-visual-debugger)
- Show Button (-> getting-started-with-chaos-visual-debugger)
- Transform and Snapping Toolbar (-> getting-started-with-chaos-visual-debugger)
- Scene Outliner (-> getting-started-with-chaos-visual-debugger)
- Playback Controls (-> getting-started-with-chaos-visual-debugger)
- Game Frames Timeline (-> getting-started-with-chaos-visual-debugger)
- Solver Timeline (-> getting-started-with-chaos-visual-debugger)
- Solver Stage Timeline (-> getting-started-with-chaos-visual-debugger)
- Recorded Output Log (-> getting-started-with-chaos-visual-debugger)
- Output Log (-> getting-started-with-chaos-visual-debugger)
- Details Panel (-> getting-started-with-chaos-visual-debugger)
- Next Up (-> getting-started-with-chaos-visual-debugger)
