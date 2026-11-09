# In-Camera VFX Production Test

https://dev.epicgames.com/documentation/en-us/unreal-engine/incamera-vfx-production-test-sample-project-for-unreal-engine?application_version=5.9

> How to set up the In-Camera VFX Production Test sample, and explore the features, project structure, and settings used during production.

[image: In-Camera VFX Production Test]

The In-Camera VFX Production Test is a Virtual Production sample that uses Unreal Engine and an LED Volume to feature traveling vehicle shots, multi-camera setups, and multi-user setup for making quick changes between takes. This sample was created in collaboration with filmmakers' collective Bullitt. The team produced final pixels in-camera over four days on Nant Studios' LED stage in Los Angeles.

The short produced from the project.

Exploring and modifying the sample will help you learn how you can:

- Structure your Virtual Production project so multiple artists can collaborate simultaneously on scenes during production.
- Use GPU Lightmass with Multi-User to bake lighting on one computer and share to all computers in the session for faster lighting changes.
- Render the inner frustum using mGPU on a multi-screen nDisplay cluster.
- Apply color correction and OCIO profiles to your nDisplay renders to achieve the desired look for each scene.
- Build the UI of your Remote Control Web Application to meet your production's needs and make quick changes on set from a tablet.
- Apply cvars to improve performance in the project.

This guide covers how the production team used Unreal Engine's features in the project to make the final result. Use this project as an example for designing your production. For learning the basics of in-camera VFX, refer to the In-Camera VFX Quick Start (-> in-camera-vfx-quick-start-for-unreal-engine). For behind the scenes footage of this production, refer to the Unreal Engine Spotlight.

## Stage Setup and Hardware

[image: The In-Camera VFX Production Test stage] Click image to expand.

Four nDisplay nodes were used to render the following volume, with 2 LED panels assigned to each node:

- **Walls**: Total resolution of **15312 x 2112** over **5 **LED panels.
- **Ceiling**: Total resolution of** 4160 x 5280** over **3 **LED panels.

This real production sample is both CPU-intensive and GPU-intensive so it can render on this large LED volume at a camera-ready resolution. The diagram below shows every device contributing to the production and the connections between devices on stage. To learn about the roles of each device in the shoot, refer to In-Camera VFX Overview (-> in-camera-vfx-overview-in-unreal-engine) for details. To learn what hardware is recommended for an in-camera VFX shoot, refer to In-Camera VFX Recommended Hardware (-> recommended-hardware-for-in-camera-vfx-in-unreal-engine).

[image: In-Camera VFX Production Test devices diagram] Diagram showing what devices were used and how they communicated with each other on stage. Click image to expand.

## Getting Started

In addition to the nDisplay Config (-> ndisplay-configuration-file-reference-for-unreal-engine) that represents the topology of the real stage used in production, a simple nDisplay Config is included in the project so you can view the scenes on a single computer without an LED volume. This section shows how to use the simple nDisplay Config to render the scene and make changes in a multi-user session on a single computer.

Follow these steps to launch an instance of the Unreal Editor and another instance of Unreal Engine with the nDisplay renderer in a multi-user session on your computer.

- Access the In-Camera VFX Production Test sample from **Fab** and click **Add to My Library** for the project file to show in the **Epic Games Launcher**.Alternatively, you can search for the sample project using Fab in Launcher, or the Fab plugin for UE.

- From the **Epic Games Launcher**, go to **Unreal Engine > Library > Fab Library** to access the project.Sample projects only appear in **Fab Library** when you install the compatible engine version.
- Click **Create Project** and follow the on-screen instructions to download the sample and start a new project.To learn more about accessing sample content from Fab, see Samples and Tutorials (-> samples-and-tutorials-for-unreal-engine).

- Go to the Unreal Engine folder on your computer and run Engine\Binaries\Win64\SwitchboardListener.exe to launch **SwitchboardListener** on your computer. The listener will minimize its window automatically on start to avoid issues with nDisplay devices. You can find the application in your OS's taskbar.The following is an example of a full path: `C:\Program Files\Epic Games\UE_4.27\Engine\Binaries\Win64\SwitchboardListener.exe`
- In the Unreal Engine folder, run Engine\Plugins\VirtualProduction\Switchboard\Source\Switchboard\Switchboard.bat to launch **Switchboard** on your computer. If this is your first time running Switchboard, it will install any required dependencies before opening the application window.The following is an example of a full path: `C:\Program Files\Epic Games\UE_4.27\Engine\Plugins\VirtualProduction\Switchboard\Source\Switchboard\Switchboard.bat`
- Create a new **Switchboard Configuration**.If this is your first time running Switchboard, the **Add New Switchboard Configuration** window appears when Switchboard launches.
- If you have run Switchboard before, click **Configs > New Config** in the top left corner of the window to open the **Add New Switchboard Configuration** window.[image: Adding a new Switchboard configuration]

- In the **Add New Switchboard Configuration** window:Set **Config Path** to the name and location where you want to store your Switchboard Configuration file.
- Set **uProject** to the location of the In-Camera VFX Production Test sample project file, `TheOrigin.uproject`.
- Make sure **Engine Dir** is pointing to the **Engine** folder for your Unreal Engine.
- Click **Ok** to create the Switchboard Configuration.[image: New Switchboard configuration paths]

- Set **Level** to **CaveEntrance_NantStudiosSimple**.[image: Setting the Level in Switchboard]
- Add an nDisplay device to Switchboard:Click **Add Device** and select **nDisplay **from the dropdown.[image: Adding an nDisplay device]
- In the **Add nDisplay Device window**, click **Browse** and navigate to Content\TheOrigin\Content\Stages\NantStudiosSimple\Config\NDC_NantStudiosSimple.uasset in the sample project's folder.[image: Browsing to the nDisplay device .uasset file]
- Click **OK **to see one nDisplay device added to Switchboard.[image: The nDisplay device added to Switchboard]

- Add an Unreal device to Switchboard:Click **Add Device** again and select **Unreal **from the dropdown.[image: Adding an Unreal device]
- In the **Add Unreal Device** window, set the **IP Address** to the local computer: **127.0.0.1**.[image: Setting the Unreal device local IP address]
- Click **OK **and see one Unreal device added to Switchboard.[image: The Unreal device added to Switchboard]

- Click the **Connect to Listener** button for the nDisplay **Render_2** device to connect to SwitchboardListener.[image: Connect to Listener button for nDisplay device in Switchboard]
- Click the **Start Unreal **button for the nDisplay **Render_2 **device to launch Unreal with the nDisplay renderer in a multi-user session.[image: Start Unreal button for nDisplay device in Switchboard]
- All windows automatically minimize and the full screen nDisplay render appears. The view might be dark but you will change the view in a later step.
- Open the minimized Switchboard window, and click the **Connect to listener** button for the Unreal device to connect to SwitchboardListener.[image: Connect to Listener button for Unreal device in Switchboard]
- Click the **Start Unreal** button for the Unreal device to launch an instance of the Unreal Editor in the Multi-User Session.[image: Start Unreal button for Unreal device in Switchboard]
- In the Editor, on the toolbar click **Open Level Snapshots Editor**.[image: Open the Level Snapshots editor]
- In the Level Snapshots Editor, double-click the **CaveEntrance_NantStudiosSimple_SetupA** Level Snapshot and click **Restore Level Snapshot**.[image: Restore the Setup A Level Snapshot]
- In the Unreal Editor's **World Outliner panel**, select the nDisplay Root Actor **NDC_NantStudios_Simple** to see its updated position. [image: Before Level Snapshot restore] [image: After Level Snapshot restore]
- The nDisplay view updates with the changes you make in the Unreal Editor instance.[image: nDisplay view updates]
- Select **InnerCamera_A** under the nDisplay Root Actor and move it around the scene to see the inner frustum move in the nDisplay view.

These steps showed how to run the project on a single computer. You can use similar steps and modify the nDisplay Config that represents the real stage to test on your own LED volume.

## mGPU and Multi-Screen Cluster

[image: The In-Camera VFX Production Test shoot in progress]

The production leveraged multi-GPU to improve performance during the shoot. Rather than relying on a single GPU to render all viewports, a second GPU was dedicated to rendering only what appeared in-camera, to allow for the highest fidelity where it counted most. Refer to the nDisplay Overview (-> ndisplay-overview-for-unreal-engine) to learn how to use mGPU in a project.

Unreal Engine includes the **Stage Monitor** tool so you can receive reports associated with specific events from all the nDisplay cluster nodes in one application. You can have the tool enter a critical state while filming so you can easily notice events that could affect your shot. For more on how to use this tool, refer to Stage Monitor (-> stage-monitor-with-unreal-engine).

## Remote Control

With Remote Control (-> remote-control-for-unreal-engine), the production team, while on set, was able to control the displays and virtual environment dynamically from a web application running on a tablet. Exposed controls from the project included lighting, color grading of the displays, and modifying the position and rotation of the stage in the virtual environment.

[image: Using Remote Control to control the stage]

### Using Remote Control

In the Getting Started (-> incamera-vfx-production-test-sample-project-for-unreal-engine) section, you used an Unreal Editor instance to make changes to the scene and see the updates immediately in the nDisplay render. This section shows how to do the same thing using the Remote Control Web Application designed for the project.

Follow these steps to view the Remote Control Web Application designed for this project, and move the nDisplay Root Actor remotely:

- In the **Content Browser**, go to **TheOrigin > Content > Tools > RemoteControl** and double-click **RCP_NantStudios** to open the Remote Control Preset in the **Remote Control Panel**.[image: Open the Remote Control Preset in the Content Browser]
- The Remote Control Panel shows all the exposed parameters in the Remote Control Preset (-> remote-control-presets-and-web-application-for-unreal-engine). Launch the web application by clicking the angled arrow icon in the top right of the panel.[image: Launch the web application from the Remote Control panel]If there is no option to launch the web application in the Remote Control Panel, ensure the web application was built properly. You may need to modify the Remote Control section of the Project Settings to build it on your computer. Scan the Output Log in the Unreal Editor for errors.
- You might need to rebind properties to work with the level and stage you have open.[image: Rebinding properties in the Remote Control panel]
- Switch to the **Stage** tab of the Remote Control Web Application.
- Move the joysticks to change the location of the nDisplay Root Actor.

### Designing the Web Application

The Remote Control Web Interface (-> remote-control-presets-and-web-application-for-unreal-engine) is a plugin that provides a companion web application to Remote Control. The web application includes a UI builder so you can create and customize your own web application without any code.

To switch to the UI builder of the Remote Control Web Application, toggle the **Control** button to **Design**, and modify the UI for the project. Save the **Remote Control Preset Asset **to save changes to the Remote Control Web Application's UI design.

[image: Remote Control Design mode to modify UI]

The following list describes the controls exposed in each tab of the Remote Control Web Application designed for this production.

- **Stage**: Combines the controls for the Stage Position and Rotation within the Level.[image: Stage controls]
- **Viewport Settings**: Combines the controls for the global Viewport Screen Percentage and per-viewport Screen Percentage parameters.[image: Viewport settings controls]
- **Color Correction**: Combines the controls for global Color Correction and per-viewport Color Correction parameters.[image: Color correction controls]
- **LightCard**: Combines the controls for Light Cards.[image: Light cards controls]
- **Snapshot**: Shows all Level Snapshots in the project, and combines controls for taking and applying Level Snapshots. See Level Snapshots (-> level-snapshots-in-unreal-engine) for more details.[image: Level Snapshot controls]

## Color Grading and OCIO

In order to preserve accurate and consistent color across the pipeline, the art and stage teams leveraged OpenColorIO (OCIO) (-> color-management-with-opencolorio-in-unreal-engine) to standardize color space conversions. These color space conversions accounted for display differences between monitors, LED panels, and production cameras.

A sample OCIO configuration and its look- up tables (LUTs) are included in the OCIO Plugin. This project has an example OCIO Configuration Asset that references this OCIO configuration and is assigned to both nDisplay Config Assets. You can find the OCIO Configuration Asset in **TheOrigin/Content/OCIO**.

To learn more about creating OCIO configurations and color space conversions for your displays, see In-Camera VFX Camera Calibration (-> camera-color-calibration-for-in-camera-vfx-in-unreal-engine).

Follow these steps to use your own OCIO configuration in the project:

- In the **Content Browser**, right-click and select **Miscellaneous > OpenColorIOConfiguration** to create a new **OpenColorIO Configuration Asset**.[image: Add an OCIO configuration asset]
- Double-click the new asset to open its editor.
- In the Asset Editor, under the **Config** section, set the **Configuration File** field to the path of your OCIO configuration file on disk.[image: Set the path to the OCIO configuration file]
- Click **Reload and Rebuild** to load the OCIO configuration.
- When the OCIO configuration is successfully loaded, expand the **Color Space** section.
- Add the Source and Destination color spaces you wish to use. The options available are determined by the OCIO config you specified.[image: Add source and destination color spaces]
- To apply this configuration to your nDisplay viewport, open the level containing your **nDisplay Config Asset**, and search for **OCIO** in the **Details Panel** of the actor. Ensure that you have **Enable Viewport OCIO** set to true.
- Expand **All Viewports Color Configuration:**Specify the Config asset you want to use.
- Set the Source and Destination color spaces.[image: Set the Source and Destination color spaces]

These steps demonstrate how to add your own OCIO configuration to the project. You can also set OCIO configurations per viewport and separately on the inner frustum. For more information, refer to Color Management in nDisplay (-> color-management-in-ndisplay-in-unreal-engine).

## GPU Lightmass and Multi-User

The production team used the new GPU Lightmass (-> gpu-lightmass-global-illumination-in-unreal-engine) feature to bake the scenes' lighting and thus minimize how long the production had to wait for lighting changes in their multi-GPU and multi-user environment. Light baking occurred on a single multi-GPU workstation and then was distributed over the network through the multi-user session. This meant that the scene could be baked quickly and reloaded on the LED walls without needing to close and relaunch the cluster.

Follow these steps to use GPU Lightmass to bake lighting for the scene:

- In the **Toolbar**, click the arrow next to **Build** and select **GPU Lightmass** from the dropdown.[image: Select GPU Lightmass in the Build dropdown menu]
- In the **GPU Lightmass** window, click **Build Lighting** to begin your bake.[image: Build Lighting using GPU Lightmass]
- When the lighting finishes building, in the main menu choose **File > Save All** to transmit the changes to the other computers in the multi-user session.[image: Save All to transmit the baked lighting]

Instead of sharing all changes with the other computers in the multi-user session, you can also choose what changes to transmit.

- In the main menu, choose **File > Choose Files to Save…**[image: Choose files to save]
- Select only the levels and build data you want to save and transfer.[image: Select baked lighting files to save and transmit]
- Click **Save Selected** to transmit the changes to the other computers in the multi-user session.

For more on the settings you can change for your lightmass bakes, refer to GPU Lightmass (-> gpu-lightmass-global-illumination-in-unreal-engine).

Transferring GPU Lightmass bakes through the multi-user session is an experimental feature. Scenes that produce large BuildData files may experience issues with the transfer. If this happens, you can:

- Check your updated levels and BuildData into source control.
- Through source control, sync the changes to your render nodes to distribute the updated lightmaps.

## Level Snapshots

The production team used Level Snapshots (-> level-snapshots-in-unreal-engine) to save configurations of the Actors in a Level for each scene. Once Level Snapshots were created, the team was able to restore the scene later to exactly how it was set up for a specific shot. Level Snapshots also track changes to the nDisplay Root Actor, so modifications to the inner frustum and color grading can be saved and applied to the nDisplay renders at any time.

The following sections describe how to use the filters and presets included in the project. To learn about creating your own filters and other features in the tool, refer to Level Snapshots (-> level-snapshots-in-unreal-engine).

### Filtering with Level Snapshots

Included in the project is an example **Blueprint Level Snapshot Filter** that lets you filter Actors in the Level Snapshot changes by their Class. You can find the filter **LSF_FilterByClass** in **TheOrigin/Content/Tools/LevelSnapshotFilters**. This section shows how to use this filter in the project.

[image: The Blueprint Level Snapshot Filter] Diagram showing what devices were used and how they communicated with each other on stage. Click image to expand.

Follow these steps to filter Level Snapshot changes and apply them to your project:

- In Unreal Editor's **Content Browser**, go to **TheOrigin > Content > StageLevels > NantStudiosSimple > StageLevels** and double-click **CaveEntrance_NantStudiosSimple** to open the Level.
- In the **Toolbar**, click the arrow next to the **Level Snapshots** button and select **Open Level Snapshots Editor** from the dropdown.[image: Open Level Snapshot Editor]
- There are two Level Snapshots already created for the Level CaveEntrance_NantStudiosSimple. Double-click **CaveEntrance_NantStudiosSimple_SetupA** to see how the Actors saved in the Level Snapshot differ from the current state of the Level.[image: The In-Camera VFX Production Test Level Snapshots]
- Click **Filter Group**.[image: The Setup A Level Snapshot selected]
- Click **Add Filter** and in the dropdown choose **Blueprint Filters > LSF Filter by Class**.[image: Add the LDF Filter by Class Blueprint filter]
- Click **LSF Filter by Class** in the Filter Group.[image: Click the filter]
- In the **Default** section next to **Class**, click the dropdown and search for **Light Card**.[image: Search for Light Card]
- Click the **Refresh Results** button to apply the filter changes.[image: Refresh Results to apply filter]
- Now, only changes to Light Card Actors are shown. To turn off the filter, right-click the filter and select **Ignore Filter**.[image: Only changes to Light Card Actors shown]
- Click **Refresh Results** and see the nDisplay Root Actor appear in the list again.[image: Disabled filter means all Actors are shown]

### Using Presets with Level Snapshots

With Level Snapshot Presets, you can set up logic using Blueprint and C++ filters and save it as a preset. Later, you can load the preset to use this logic again. Included in the project is an example Level Snapshot Preset located in **TheOrigin/Content/Tools/LevelSnapshotPresets**.

This preset strings multiple instances of the **Filter by Class** Blueprint Filter together with the OR boolean so only Actors that match any of those Classes will appear. The Classes used in the preset are: LightCards, Stages, Cameras, SyncTestBall, ColorCorrectRegion, and PostProcessVolume.

Follow these steps to use the Level Snapshot Preset in the project.

- In the **Content Browser**, go to **TheOrigin > Content > StageLevels > NantStudiosSimple > StageLevels** and double-click **CaveEntrance_NantStudiosSimple** to open the Level.
- In the **Toolbar**, click the arrow next to the **Level Snapshots** button and select **Open Level Snapshots Editor** from the dropdown.[image: Open Level Snapshot Editor]
- There are two Level Snapshots already created for the Level CaveEntrance_NantStudiosSimple. Click **Load/Save Filter** and choose **ExampleStagePreset**.[image: Load the Example Stage Preset filter]
- Double-click **CaveEntrance_NantStudiosSimple_SetupA** to see how the Actors saved in the Level Snapshot differ from the current state of the Level.[image: The Preset Filter loaded]
- When the Level Snapshot is opened, only the Actors that fit the filter loaded from the preset are shown.[image: The Setup A Level Snapshot filtered by the Preset]

## Project Structure

The In-Camera VFX Production Test is a great example to see how to structure an Unreal Project for Virtual Production. The following folders define the overall structure for the project's content and separate it into relevant categories.

- Assets (-> incamera-vfx-production-test-sample-project-for-unreal-engine)
- Envs (-> incamera-vfx-production-test-sample-project-for-unreal-engine)
- OCIO (-> incamera-vfx-production-test-sample-project-for-unreal-engine)
- StageLevels (-> incamera-vfx-production-test-sample-project-for-unreal-engine)
- Stages (-> incamera-vfx-production-test-sample-project-for-unreal-engine)
- Tools (-> incamera-vfx-production-test-sample-project-for-unreal-engine)

### Assets

This folder typically contains all assets for creating Characters, Environments, and FX. Level Assets are not included here. The following list is how the assets were categorized for this sample project.

- **Atlases**
- **Decals**
- **FX**
- **IES**
- **Landscape**
- **Materials**
- **MS_Presets**
- **Props**
- **Rocks**
- **Scatter**
- **Sky**
- **Textures**
- **Vegetation**

### Environments

Three environments from the shoot are included in the project:

- CaveEntrance[image: The Cave Entrance environment]
- CavePath[image: The Cave Path environment]
- SpaceJunkyard[image: The Space Junkyard environment]

#### Environment Structure

Since source control only lets you exclusively check out binary assets, such as `.umap` files, each artist working on an environment at the same time must work in their own level. The solution to this is to divide an environment up into multiple sublevels (-> managing-multiple-levels-in-unreal-engine) based on the type of Actors in each.

For example, a lighting artist would work in the lighting sublevel, and an FX artist in the FX sublevel. It is also common to have multiple GEO levels that divide the environment up into regions, each being worked on by a different artist. The number and types of sublevels used should be dependent on the needs of the production.

The following are the folders used for each environment in this project:

- **LevelSnapshots**: Level Snapshot Assets associated with the Level.
- **SubLevels**: In this project, each Level was separated into the Caustics, FX, Geo, and Lighting sublevels.
- **Level Asset**: Level Assets follow a {LevelName}_{Descriptor} structure. The _P suffix is given to the Persistent Level, which acts as a container for the sublevels. Open this Level Asset to view the full environment composed of all the sublevels.

### OCIO

This folder contains the OpenColorIO Configuration Assets. There is one Asset for this project: ExampleOCIO. For more details on using OCIO in this project, refer to the Color Grading and OCIO section (-> incamera-vfx-production-test-sample-project-for-unreal-engine) on this page.

[image: The Example OCIO asset]

### Stage Levels

The folder contains all the Level Assets that have both the environment and stage Actors. Open these assets when you want to render with nDisplay. The stage levels are categorized by the stage used in the Level Asset. This sample project uses the following structure to match the stages:

- NantStudiosCaveEntrance_NantStudios
- CavePath_NantStudios
- SpaceJunkyard_NantStudios

- NantStudiosSimpleCaveEntrance_NantStudiosSimple
- CavePath_NantStudiosSimple
- SpaceJunkyard_NantStudiosSimple

### Stages

This folder contains the nDisplay Configurations which describe the topology of the LED volumes. The production used one stage for all the shots: Nant Studios. A simpler version of the stage is provided as well so you can render the front walls on a single desktop.

[image: The NantStudios LED stage] Click image to expand.

#### NantStudios

- **Config**: An nDisplay Config Asset for the stage that defines the topology of the LED volume and how to render on it.[image: The NantStudios nDisplay Config asset]
- **LEDMeshes**: Static Meshes and materials with the LED panel resolution used in the **nDisplay Config Asset**.[image: NantStudios LED meshes]
- **LiveLinkPresets**: These are previously created configurations for Live Link that are required to load LiveLink sources on the nDisplay nodes at launch. The default preset is specified in **Project Settings > Live Link > Default Live Link Preset.** They can also be used to quickly reload different sources in an editor environment.
- **NantStudios_Stage**: A Level Asset that contains only the Actors that represent the stage, such as the **nDisplay Root Actor**, **ICVFX Cameras**, and **Light Cards**.

#### Simple Nant Studios

- **Config**: An nDisplay Config Asset for the stage that defines the topology of the LED volume and how to render on it. The topology looks the same as the Nant Studios configuration, but only two of the front walls are set up to render.
- **NantStudiosSimple_Stage**: A Level Asset that contains only the Actors that represent the stage, such as the **nDisplay Root Actor**, **ICVFX Cameras**, and **Light Cards**.

### Tools

This folder contains custom Blueprint controls, Level Snapshot Filters and Presets, and Remote Control Presets. The following list describes each tool.

- **CaveMaterialControl**: A blueprint controller for various Material Parameter Collections used by objects in the scene. Contains controls for things such as caustic speed, light shaft intensity, and global color shifts for the rocks.
- **HierarchicalInstanceConverter**
- **HolePunch**: A spherical actor used to create a hole in the geometry of the cave. This was used on the day of the shoot to create an additional light shaft.
- **InnerFrustumCamera**: A CineCameraActor with a LiveLinkComponent. This Blueprint simplifies the camera tracking by not requiring the user to manually add an instanced LiveLinkComponent to the scene actor.
- **LevelSnapshotFilters**: Custom Blueprint Filters for Level Snapshots.
- **LevelSnapshotPresets**: Presets of groups of filters for Level Snapshots.
- **RemoteControl**: Remote Control Presets.
- **SyncTestBall**: This tool creates a bouncing red ball used to test synchronization. Place the ball in the scene so that it appears on the seam between two walls. A visible tearing of the ball occurs at the seam if the synchronization is not functioning properly.

## Cvars

To improve performance while rendering with nDisplay on stage, the production team used the cvars in the table below to tweak settings. You can set cvars during an nDisplay session in Switchboard and have them applied to the cluster.

To set cvars in Switchboard:

- Open Switchboard.
- Under the **nDisplay Monitor** tab, in the **Console:** text box, enter the cvar and the desired value, if applicable.
- Click **Exec**.

[image: The nDisplay Monitor Console]

The following values are what were used for the In-Camera VFX Production Test. You might need to use different values depending on the content in your project and what look you want to achieve.

| Cvar | Value | Description |
| --- | --- | --- |
| `r.ExrReadAndProcessOnGPU` | N/A | Switches EXR playback between CPU and GPU. When enabled for the GPU, Unreal Engine 4 can load large, uncompressed EXR files directly into a Structured Buffer and process them on the GPU. |
| Ray Tracing |  |  |
| `r.RayTracing.ForceAllRayTracingEffects` | 0 | Forces all ray tracing effects either on or off. Options for value include:-1: Do not force (default)0: Disable all ray tracing effects1: Enable all ray tracing effectsSetting this cvar to 0 turns off all the additional ray tracing features that are enabled by default. When using GPU Lightmass, which requires ray tracing, you can still use GPU-accelerated light baking. This cvar can also be useful for figuring out how much performance is required with ray tracing enabled. |
| `r.RayTracing.Reflections.MaxRoughness` | 0.2 | Sets the maximum roughness for visible ray tracing reflections (default = -1 (max roughness driven by post processing volume)). This guarantees that only Materials with roughness values lower than 0.2 will have ray-traced reflections. |
| `r.RayTracing.Reflections.MaxRayDistance` | 500 | Sets the maximum ray distance for ray traced reflection rays. When ray shortening is used, the skybox will not be sampled in the RT reflection pass and will be composited later, together with local reflection captures. Negative values turn off this optimization (default = -1 (infinite rays)). Using a value other than -1 will help reduce the amount of ray tracing that is done in a scene. |
| `r.RayTracing.Reflections.SortMaterials` | 0 | Determines whether reflected materials will be sorted before shading. Options:0: Disabled1: Enabled, using Trace > Sort > Trace (Default) |
| `r.DiffuseIndirect.Denoiser` | 2 | Denoising options (default = 1) |
| `r.RayTracing.Reflections` | 0 | Turn OFF only ray tracing reflections in your level. This is useful in case you still want to use ray-traced shadows or other ray tracing features, and not pay the cost of ray-traced reflections. Options:-1: Value driven by the postprocess volume (default)0: Use traditional rasterized SSR.1: Use ray-traced reflections. |
| `r.RayTracing.Geometry.Landscape` | 0 | Include landscapes in ray tracing effects (default = 1 (landscape enabled in ray tracing)) In order to optimize the levels that needed ray-traced reflections, we disabled landscape ray-tracing as it was not adding much to the final look, and disabling it gave us some performance boost. |
| `r.RayTracing.Reflections.ScreenPercentage` | 50 | Screen percentage the reflections should be ray traced at (default = 100). If your scene doesn't have very shiny and clean reflections you can reduce this value and you will gain some performance. |
| Upscaling Resolution |  |  |
| `r.ScreenPercentage` | 75 | Render in lower resolution and upscale for better performance (combined with the blendable post process setting). 75 is a good value for low aliasing and performance, verify with 'show TestImage'.In percent, use >0 and <=100, larger numbers are possible (supersampling) but the downsampling quality is improvable. Numbers <0 are treated like 100. |
| `r.TemporalAA.Algorithm` | 1 | Algorithm to use for Temporal AA Options:0: Gen 4 TAAU (default)1: Gen 5 TAAU (experimental) This will turn ON our new Gen5 TAAU in case some resolution upscaling is needed . |
| `r.TemporalAA.Upsampling` | 1 | Whether to perform primary screen percentage with temporal AA or not. Options:0: Perform the spatial upscale pass independently of TAA (default).1: TemporalAA performs the spatial and temporal upscale using the screen percentage method. |
| SSGI |  |  |
| `r.SSGI.Enable` | 0 | Whether to enable or disable Screen Space GI Options:0: Disable1: Enable Turns OFF Screen Space GI. |
| `r.SSGI.HalfRes` | 1 | Whether to perform SSGI at half resolution. Options:0: Disable (defaults)1: Enable |
| `r.SSGI.Quality` | 1 | Quality setting to control the number of rays shot with SSGI, between 1 and 4 (defaults to 4). |
| Volumetric Fog |  |  |
| `r.VolumetricFog.GridPixelSize` | 6 | XY size of a cell in the voxel grid, in pixels. Lower values produce better Volumetric Fog Quality but it will affect performance. |
| `r.VolumetricFog.GridSizeZ` | 96 | How many Volumetric Fog cells to use in the Z axis. Higher values can help increase accuracy and reduce noise but it can impact performance. |
| `r.VolumetricFog` | 0 | Whether to enable the Volumetric Fog feature. Options0: Disabled1: Enabled This can be used to quickly turn OFF Volumetric Fog and determine how much performance it uses. |
| Rendering |  |  |
| `ShowFlag.DirectLighting` | 0 | This cvar is useful for quickly disabling direct lighting in order to understand what is baked and what isn't, and its performance implications. Options:0: Disable the showflag.1: Enable the showflag.2: Do not override this showflag (default). |
| `r.SetNearClipPlane` | 150 | Set the near clipping plane (in cm). This cvar will allow you to modify the Near Clip Plane in case you want to quickly remove any geometry that is in front of your render camera. |
| `r.TextureStreaming` | 0 | Defines whether texture streaming is enabled, which can be changed at run time. Options0: Disabled1: Enabled (default) |
| `r.Streaming.PoolSize` | 3600 | -1: Default texture pool size, otherwise the value is the size in MB. This cvar can be used to increase the texture pool size at runtime in order to allow higher mipmaps to be loaded, if the pool size originally was set too low and your hardware allows a higher texture pool size. |
| `r.DFShadowScatterTileCulling` | 1 | Whether to use the rasterizer to scatter objects onto the tile grid for culling. Options0: Disabled1: Enabled |
| `r.ForceLOD` | 5 | LOD level to force, -1 is disabled. This is useful for testing how much performance or quality can be gained by forcing a specific LOD on the scene. |

- virtual production
- in-camera vfx
- ndisplay

On this page

- Stage Setup and Hardware (-> incamera-vfx-production-test-sample-project-for-unreal-engine)
- Getting Started (-> incamera-vfx-production-test-sample-project-for-unreal-engine)
- mGPU and Multi-Screen Cluster (-> incamera-vfx-production-test-sample-project-for-unreal-engine)
- Remote Control (-> incamera-vfx-production-test-sample-project-for-unreal-engine)
- Using Remote Control (-> incamera-vfx-production-test-sample-project-for-unreal-engine)
- Designing the Web Application (-> incamera-vfx-production-test-sample-project-for-unreal-engine)
- Color Grading and OCIO (-> incamera-vfx-production-test-sample-project-for-unreal-engine)
- GPU Lightmass and Multi-User (-> incamera-vfx-production-test-sample-project-for-unreal-engine)
- Level Snapshots (-> incamera-vfx-production-test-sample-project-for-unreal-engine)
- Filtering with Level Snapshots (-> incamera-vfx-production-test-sample-project-for-unreal-engine)
- Using Presets with Level Snapshots (-> incamera-vfx-production-test-sample-project-for-unreal-engine)
- Project Structure (-> incamera-vfx-production-test-sample-project-for-unreal-engine)
- Assets (-> incamera-vfx-production-test-sample-project-for-unreal-engine)
- Environments (-> incamera-vfx-production-test-sample-project-for-unreal-engine)
- Environment Structure (-> incamera-vfx-production-test-sample-project-for-unreal-engine)
- OCIO (-> incamera-vfx-production-test-sample-project-for-unreal-engine)
- Stage Levels (-> incamera-vfx-production-test-sample-project-for-unreal-engine)
- Stages (-> incamera-vfx-production-test-sample-project-for-unreal-engine)
- NantStudios (-> incamera-vfx-production-test-sample-project-for-unreal-engine)
- Simple Nant Studios (-> incamera-vfx-production-test-sample-project-for-unreal-engine)
- Tools (-> incamera-vfx-production-test-sample-project-for-unreal-engine)
- Cvars (-> incamera-vfx-production-test-sample-project-for-unreal-engine)

Related documents

GPU Lightmass Global Illumination

 [image: GPU Lightmass Global Illumination] (-> gpu-lightmass-global-illumination-in-unreal-engine)
