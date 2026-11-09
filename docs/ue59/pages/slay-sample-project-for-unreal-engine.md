# Slay

https://dev.epicgames.com/documentation/en-us/unreal-engine/slay-sample-project-for-unreal-engine?application_version=5.9

> Fully realize your virtual production workflows in Unreal Engine by learning about Slay and its cinematic techniques.

[image: Slay]

Virtual production is supported in Unreal Engine through the use of various cinematic tools, rendering features, and workflows. The Slay sample, built by **Mold3D Studio**, was created to demonstrate techniques, rendering features, and workflows that can be achieved when considering virtual production in Unreal Engine.

This document provides an overview of how to view the Slay sample, as well as the workflows and production techniques that were used to create it.

#### Prerequisites

- The Slay sample content is a graphically intensive scene. It requires at least an **Intel Core i9 Series** processor and **GeForce RTX 2080 Ti,** or similar.
- When opening the project or Level for the first time, there may be a long initial load time as numerous assets are loaded and compiled for the first time.

## Setup

To set up a project with the Slay sample, follow these steps:

- Access the Slay sample from **Fab** and click **Add to My Library** for the project file to show in the **Epic Games Launcher**.Alternatively, you can search for the sample project using Fab in Launcher, or the Fab plugin for UE.

- From the **Epic Games Launcher**, go to **Unreal Engine > Library > Fab Library** to access the project.Sample projects only appear in **Fab Library** when you install the compatible engine version.
- Click **Create Project** and follow the on-screen instructions to download the sample and start a new project.
- Open your new project in the Unreal Editor.

To learn more about accessing sample content from Fab, see Samples and Tutorials (-> samples-and-tutorials-for-unreal-engine).

## Viewing the Slay Sequence

To view the Slay sequence, click the **Cinematics **button in the main toolbar and select **TF_Edit**.

[image: open slay cinematic]

This will open the **Master Sequence (-> sequences-shots-and-takes-in-unreal-engine)** for the Slay cinematic. You can see the multiple shots used to assemble the full sequence in this view.

[image: slay master sequence]

Select the **Camera **button on the Shot Track to look through the **Cameras (-> cinematic-cameras-in-unreal-engine)** for each shot, and click the **Play **button to play the sequence.

[image: play slay sequence]

## Quixel Megascan Assets

The Temple Level was built using a combination of unique assets and **Quixel Megascan** assets. These assets were used in Slay to provide background details, props, and foliage. Using Quixel Megascan assets in your project can save time and resources when creating large environments.

[image: slay quixel megascan]

You can view some of the Quixel Megascan assets used in the Slay sample by navigating to the **Quixel Megascan** website. Some notable examples include:

- **Gravestones** in the Temple courtyard.[image: quixel megascan grave]
- **Location or era-specific props** placed around the Level.[image: quixel megascan japan props]
- **Grass** and other foliage placed in the gardens and other areas.[image: quixel megascan grass]

## Shot-Based Workflow

The Slay sequence was created using **Sequencer** and its **Shot-Based (-> sequences-shots-and-takes-in-unreal-engine)** workflow. This was done so that each shot contains all necessary content for that shot only, rather than a larger single sequence. This setup allows for quick modifications to the sequence as a whole, as shots can be **edited, trimmed, and re-arranged (-> sequences-shots-and-takes-in-unreal-engine)**, just like in any non-linear editing software.

In the Master Sequence **TF_Edit**, you can see all the shots arranged in the **Shot Track**. Additionally there are **Audio Tracks (-> cinematic-audio-track-in-unreal-engine)** for playing audio that has been timed to the sequence edit, and a **Fade Track (-> cinematic-color-fade-track-in-unreal-engine)** for controlling the fade to and from black.

[image: slay master sequence]

Double-click any shot to open and view its contents.

### Level Visibility

The first shot of Slay is an exterior view of the Temple. Because of this unique angle, it was necessary to create a custom **Landscape (-> landscape-outdoor-terrain-in-unreal-engine)** and assets for a Level that only is visible for the duration of **Shot TF0010_02**. The Level's visibility is controlled by the **Level Visibility Track (-> cinematic-level-visibility-track-in-unreal-engine)**, and can be seen in shot **TF0010_02** (Shot 1)

With the Level Visibility Track placed inside the shot, it will evaluate only for the duration of the shot. In this case, the Level containing the lower-resolution Landscape for use when inside the Temple is hidden, and the Level containing higher-resolution Landscape and other assets is displayed instead.

[image: slay level visibility terrain]

You can manually preview the higher-resolution Landscape Level by navigating to the **Levels (-> working-with-levels-in-unreal-engine)** panel, enabling **Terrain_TF0010,** and disabling **Terrain**.

### Using Spawnables

**Spawnables (-> spawn-temporary-actors-in-unreal-engine-cinematics)** are Actors that are spawned and typically exist only for the duration of a single sequence. These are used extensively in several shots throughout the Slay sequence in order to address problems unique to each shot. Since each shot is its own sequence, spawnables will only exist for the duration of a shot, making it easier to manage these Actors.

An example of a spawnable Actor can be seen in **Shot TF0020_01** (Shot 2). In this example, the original static mesh door is hidden and replaced with a spawnable **Skeletal Mesh** door, containing animation to match the character's movement as she opens it. When the shot ends, the door is unspawned automatically.

[image: slay spawnable door actor]

### Artist Collaboration

In the Slay sample, each shot is its own sequence, and therefore its own asset. Shots also contain **Subscene Tracks (-> cinematic-subscequences-track-in-unreal-engine)** which are their own sequence assets as well. Because of this division of assets, it is much simpler to enable multiple artists to work on a single sequence or shot at the same time, without file conflicts occurring. Subscenes can also be duplicated, enabling the same contents to be reused and shared across multiple instances.

In several shots, you can see Subscene Tracks for both **Lighting **and **FX**, which enable artists from these disciplines to work within these sequences instead of the main shot sequence. In this way, subscenes are not only useful for limiting file conflicts, but also for Sequencer organization.

[image: slay multi user subscene]

You can double-click a Subscene section to open it and view its contents.

[image: subscene contents]

When a shot or subscene is opened from a parent sequence, it will be displayed within the context of the Master Sequence. This means that even though you are viewing only a single subscene, all tracks from the Master Sequence and current shot also remain visible. You can edit lights, add visual effects, and perform other actions with full visual context of the scene.

This context view can be enabled or disabled by toggling **Evaluate Sub Sequences In Isolation** from Sequencer's Playback Menu (-> sequencer-cinematic-toolbar-in-unreal-engine).

### Camera Animation

The Camera animation for Slay was **created (-> how-to-animate-cinematic-cameras-in-unreal-engine)** entirely in Sequencer. In some cases, additive camera animation is also used to enhance the camera movement. This is done using **Camera Animation Sequences (-> template-sequences-in-unreal-engine)**, which are a form of **Template Sequence (-> template-sequences-in-unreal-engine)**.

[image: additive camera animation]

Double-clicking one of these **Template Animations** will open the corresponding template sequence, where you can view the animation that is being used.

[image: camera animation sequence]

## Lighting and Materials

Lighting, Materials, and Effect usage plays a critical role in the Slay sample. Proper utilization of the Master Sequence and Shot ecosystem enables artists to more effectively light and apply material adjustments for each shot.

### Lighting Workflows

As mentioned previously (-> slay-sample-project-for-unreal-engine), lighting and other workflows can occur within Subscenes. Here, a typical lighting workflow would be to add your necessary **Light Actors** to the sequence as **Spawnables (-> spawn-temporary-actors-in-unreal-engine-cinematics)**. This is done so that the lights will only remain visible for the duration of the shot, and do not need to be manually turned on or off.

[image: spawnable light]

Other lighting techniques can be used to enhance your shots, such as using **Light Blockers** to block out certain areas of a scene from the main Level's light. Afterward you can more directly control the lighting of a shot using your spawnable lights.

For example, in **Shot TF0020_01** (Shot 2), if you disable the **Camera **button to stop piloting it, then navigate in the viewport to view the Temple entrance area, you should see a large **Light Blocker** being used. This is used so that a more controlled lighting environment can be created for the shot.

[image: light blocker]

With the light blocker in place, other lights can be spawned to better enhance the lighting in this shot, such as the spotlight shining through the nearby lattice, which casts soft shadows on the door.

[image: slay lighting]

In some other cases, it may be necessary to hide certain meshes to let light pass through and shine on your Actors. In **Shot TF0080_01**, part of the Temple structure is hidden in order to let the sunlight cast on the Oni character.

[image: hide level for lights]

**Lighting Channels (-> using-lighting-channels-in-unreal-engine)** are also used in Slay to control how lights affect the environment and characters. In this case, spawnable lights are only affecting **Channel 2**. This same channel is then enabled on all Characters, causing them to be lit by these lights. The environment is not lit by these lights because those meshes only have **Channel 0** enabled.

[image: lighting channels]

### Material Workflows

If a **Material** is set up with **parameters**, you can reference these parameters in Sequencer to make overriding material parameter adjustments. In Slay, this was done to make minor adjustments to materials for specific shots. Similar to the previous lighting and shot-based workflows, these edits can be made on a per-shot basis without persisting to the next shot.

In Shot's **TF00110_01 Lighting Subsequence**, you can see the **Roughness **and other parameters on Oni's armor material are adjusted using **Material Element Tracks**. The Material Element number corresponds to the same Material Element ID on the mesh.

[image: material parameter track]

Clicking **Add Parameter (+)** will reveal a list of the available material parameters for that element. Select a parameter to add it as a track.

[image: add material]

## Render Settings

The Slay sample was created to be rendered as **Final Pixel** out, showcasing the high quality images that can be rendered with Unreal Engine. Because of this, there are several important parameters that are being set that increase the fidelity of the scene in both the viewport and when rendered using ****.

### Post Process Volume

**Post Processing (-> post-process-effects-in-unreal-engine)** is used in the scene to control **Ray Tracing** effects such as **Global Illumination, Reflections,** and **Shadows**. Color correction is also applied using **Color Grading and the Filmic Tonemapper (-> color-grading-and-the-filmic-tonemapper-in-unreal-engine)** properties.

To view the post process properties being used in Slay, select the **Post Process Volume** in the Level. It can be found by searching for it in the ****.

[image: post process volume]

You can preview the effects of the Post Process Volume by enabling or disabling the **Enabled **property in its details. Using post processing can help you in making your scenes appear more vibrant.

 [image: Post Processing Off]

 [image: Post Processing On]

### Viewport Optimization

As Slay is a graphically intense project, it became necessary to optimize the editor viewport experience to ensure smooth, reliable performance when working in Unreal Engine. This was done by setting certain Console Variables (-> cinematic-rendering-image-quality-settings-in-unreal-engine) within the **DefaultEngine.ini** **Configuration File (-> setting-up-your-development-environment-for-cplusplus-in-unreal-engine)**.

Some examples of the variables being set are:

 C++

```
r.HairStrands.Enable 1.0
	r.HairStrands.DeepShadow.Resolution 512.0
	r.RayTracing.Shadows.AcceptFirstHit 1.0
	r.RayTracing.SkyLight.ScreenPercentage 55.0
```

r.HairStrands.Enable 1.0
 r.HairStrands.DeepShadow.Resolution 512.0
 r.RayTracing.Shadows.AcceptFirstHit 1.0
 r.RayTracing.SkyLight.ScreenPercentage 55.0

To view the other console variables in use, you can navigate to the **Config** folder located in the install location of the Slay project and open **DefaultEngine.ini** in a text editor.

### Movie Render Queue Settings

The final picture for Slay is rendered using Unreal Engine's **Movie Render Queue tool**. Movie Render Queue supports several features for producing high-quality renders, such as its temporal subsampling feature which is used to apply a high-quality radial motion blur effect. Additionally, Console Variables are used in Slay to increase graphical fidelity during the rendering process.

To open the Movie Render Queue window, click the **Render **button in Sequencer's Toolbar.

[image: open movie render queue]

The specific render settings used for Slay are saved as a **Movie Pipeline Master Config Asset**. To apply this preset to the render, click the **Settings **dropdown menu and select **Slay_MovieRenderQueue_Preset**.

[image: render settings preset]

To see the settings being used, click the **Slay_MovieRenderQueue_Preset** settings text. This will open the **Render Settings** window which contains the various output, quality, and other settings applied during the rendering process.

[image: render settings]

#### Anti-Aliasing

In order to reduce image noise, as well as to produce smoother edges and motion blur, Anti-Aliasing (-> cinematic-rendering-image-quality-settings-in-unreal-engine) is used with **Temporal Sample Count** set to **19**.

[image: slay anti aliasing render settings]

#### Console Variables

To increase graphical fidelity in several areas including **Motion Blur**, **Subsurface Scattering**, and **Raytracing**, the following Console Variables (-> cinematic-rendering-image-quality-settings-in-unreal-engine) are used:

[image: slay console variable render settings]

 C++

```
r.MotionBlurQuality 4.0
	r.MotionBlurSeparable 1.0
	r.DepthOfFieldQuality 4.0
	r.ScreenPercentage 125.0
	r.ViewDistanceScale 50.0
	r.SSS.Quality 1.0
	r.SSR.Quality 4.0
	r.Shadow.DistanceScale 10.0
	r.ShadowQuality 5.0
	r.Shadow.RadiusThreshold 0.001
```

- sequencer

On this page

- Prerequisites (-> slay-sample-project-for-unreal-engine)
- Setup (-> slay-sample-project-for-unreal-engine)
- Viewing the Slay Sequence (-> slay-sample-project-for-unreal-engine)
- Quixel Megascan Assets (-> slay-sample-project-for-unreal-engine)
- Shot-Based Workflow (-> slay-sample-project-for-unreal-engine)
- Level Visibility (-> slay-sample-project-for-unreal-engine)
- Using Spawnables (-> slay-sample-project-for-unreal-engine)
- Artist Collaboration (-> slay-sample-project-for-unreal-engine)
- Camera Animation (-> slay-sample-project-for-unreal-engine)
- Lighting and Materials (-> slay-sample-project-for-unreal-engine)
- Lighting Workflows (-> slay-sample-project-for-unreal-engine)
- Material Workflows (-> slay-sample-project-for-unreal-engine)
- Render Settings (-> slay-sample-project-for-unreal-engine)
- Post Process Volume (-> slay-sample-project-for-unreal-engine)
- Viewport Optimization (-> slay-sample-project-for-unreal-engine)
- Movie Render Queue Settings (-> slay-sample-project-for-unreal-engine)
- Anti-Aliasing (-> slay-sample-project-for-unreal-engine)
- Console Variables (-> slay-sample-project-for-unreal-engine)
