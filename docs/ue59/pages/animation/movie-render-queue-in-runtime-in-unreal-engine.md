# Movie Render Queue in Runtime Builds

https://dev.epicgames.com/documentation/en-us/unreal-engine/movie-render-queue-in-runtime-in-unreal-engine?application_version=5.9

> How to use Movie Render Queue in a distributed build to create movies on end-users' devices

[image: Movie Render Queue in Runtime Builds]

In addition to rendering using the **Movie Render Queue** user interface, you can also execute renders using **Blueprints** on runtime distributed builds. This makes it so that renders can be created on end-user devices.

This document provides an overview of how to create renders using Blueprints, and the functions available to you to configure various settings.

#### Prerequisites

- You have completed the prerequisite steps from the Movie Render Queue section of the page.

- You have an understanding of using Blueprints (-> blueprints-visual-scripting-in-unreal-engine) in Unreal Engine.

## Movie Pipeline Subsystem

Movie Render Queue in Blueprints is accessed using the **Movie Pipeline Runtime Subsystem** node. This subsystem features a **Queue** which contains a list of rendering **jobs**. Each job can contain one or more **shots**, and each job also has its own **configuration**, which contains the render settings (-> cinematic-render-settings-and-formats-in-unreal-engine) used to render its shots. To render a video, you need to build a list of jobs, allocate them to the queue, then call the Movie Render Queue subsystem's **Executor** to process the queue.

To add this, right-click in the **Event Graph** and select **Engine Subsystems > Get MoviePipelineQueueEngineSubsystem**.

 [image: get movie pipeline queue engine subsystem]

## Creating a Basic Render

From the **Movie Pipeline Runtime Subsystem** node, there are three main functions and steps required for successfully rendering using Blueprints.

- **Allocate Job**, which is a function used to assign a **Level Sequence** to the render job.

- **Set Configuration**, which is used to assign a render configuration (-> cinematic-render-settings-and-formats-in-unreal-engine).

- **Render Job**, which renders the job using the provided sequence and configuration.

### Allocate Job

First, drag off the **Movie Pipeline Runtime Subsystem** node and select **Movie Render Pipeline > Rendering > Allocate Job**.

 [image: allocate job]

Connect the **Subsystem** node to the **Target** pin, and then assign the Level Sequence you want to render to the **In Sequence** pin.

 [image: assign sequence to allocate job]

### Set Configuration

Next, drag off the **Allocate Job** node's **Return Value** pin and create a **Set Configuration** node.

 [image: set configuration]

Assuming you already saved a custom render configuration as a Preset (-> cinematic-render-settings-and-formats-in-unreal-engine), assign it in the **In Preset** pin.

 [image: assign render configuration to set configuration]

### Render Job

Lastly, drag off the **Movie Pipeline Runtime Subsystem** node and create a **Render Job** Function. It should execute after Set Configuration, and **In Job** should connect to **Allocate Job**.

 [image: full render logic]

Executing these functions performs a render on the local machine using the sequence assigned in **Allocate Job,** and the render settings assigned in **Set Configuration**.

## Additional Functions and Settings

For more advanced render controls, you can use the following functions and workflows.

### Customize Render Configurations

If you want to edit or create new render settings for a job, you can connect **Get Configuration** and **Find or Add Setting by Class** nodes after Allocate Job.

 [image: customize settings using get configuration and find or add settings by class]

Next, set the specific export format (-> cinematic-rendering-export-formats-in-unreal-engine), image setting (-> cinematic-rendering-image-quality-settings-in-unreal-engine), or render pass (-> cinematic-render-passes-in-unreal-engine) in the **In Class** pin.

 [image: class settings menu]

After you choose a setting, you can now drag from the **Return Value** pin to **get **or **set** property variables related to that setting class.

 [image: settings variables]

If you are building custom render configurations without setting a base configuration, you are required to add a base render pass and output format. Typically this means adding **Deferred Pass** and an output such as **PNG **or **JPG**. Unlike the editor, these settings will not be added by default.

### Canceling Jobs

You can also cancel active render jobs using functions. This can be important as a protection for cases when the simulation ends while a render is ongoing. Without this protection, it could cause the editor to enter into a softlock state.

To cancel all render jobs, connect the **Movie Pipeline Runtime Subsystem** node to **Get Active Executor**, then **Cancel All Jobs**.

 [image: get active executor and cancel]

To implement the cancellation as a protection when the simulation ends, create an **End Play Event**, connect it to an **Is Valid** check, then connect** Is Valid** it to **Cancel All Jobs**.

 [image: cancellation protection]

### Render Finish Event

Render finish events can be created by binding to a custom event from the Movie Pipeline Runtime Subsystem. To do this, drag off the subsystem and select either **Assign On Render Finished** (to create both a **Bind **and **Custom Event** node), or **Bind Event to On Render Finished** (to create only a **Bind **node to connect to an already existing custom event).

 [image: on render finished event]

Once connected to a custom event, right-click on the **Results **pin and select **Split Struct Pin**. A Render Finish event outputs the following information related to the render that occurred when this event fires:

 [image: render finish output properties]

| Name | Description |
| --- | --- |
| **Results Pipeline** | The internal UMoviePipeline object that generated this event. This is an advanced option and is only meant for tracking. |
| **Results Job** | The UMoviePipelineExecutorJob that generated the event. This is the same result as **Allocate Job** earlier, and can be used for tracking. |
| **Results Success** | Outputs **true** or **false** depending on if the render was successful. |
| **Results Shot Data** | This contains lists of the render passes and the file paths for the files that were generated on disk. This can be used in the event you want to load these images for further processing. |

### Change Render UI

The **Debug Widget** is the UI Widget that displays the preview frames of your movie while it renders. You can set the Executor to use a different Debug Widget by using **Set Configuration** from the **Movie Pipeline Runtime Subsystem**.

 [image: render preview user interface]

Select the In Progress Widget Class dropdown menu to select which widget to use. You can select from the following:

- **MovieRenderDebugWidget**, which is the base class and shows a blank screen.

- **UI_MovieRenderPipelineScreenOverlay**, which shows the default rendering progress UI seen above.

- **UI_MovieRenderPipelineScreenOverlayBlank**, which shows a blank screen.

 [image: set configuration widget class]

You can create your own custom debug widget by creating a **Widget Blueprint**, then setting its **Parent Class** to **MovieRenderDebugWidget**. You can then select this custom widget as your Debug Widget Class for your Executor.

 [image: movie render debug widget class]

## Limitations

Some settings are unavailable in runtime builds, as they depend on editor-specific functionality. These include:

- The FinalCut Pro XML output format

- Object ID render passes

- Wav Output (unless your application is launched with `-deterministicaudio` and `-audiomixer`).

- sequencer
- movie render queue
- blueprint
- render

On this page

- Prerequisites (-> movie-render-queue-in-runtime-in-unreal-engine)
- Movie Pipeline Subsystem (-> movie-render-queue-in-runtime-in-unreal-engine)
- Creating a Basic Render (-> movie-render-queue-in-runtime-in-unreal-engine)
- Allocate Job (-> movie-render-queue-in-runtime-in-unreal-engine)
- Set Configuration (-> movie-render-queue-in-runtime-in-unreal-engine)
- Render Job (-> movie-render-queue-in-runtime-in-unreal-engine)
- Additional Functions and Settings (-> movie-render-queue-in-runtime-in-unreal-engine)
- Customize Render Configurations (-> movie-render-queue-in-runtime-in-unreal-engine)
- Canceling Jobs (-> movie-render-queue-in-runtime-in-unreal-engine)
- Render Finish Event (-> movie-render-queue-in-runtime-in-unreal-engine)
- Change Render UI (-> movie-render-queue-in-runtime-in-unreal-engine)
- Limitations (-> movie-render-queue-in-runtime-in-unreal-engine)
