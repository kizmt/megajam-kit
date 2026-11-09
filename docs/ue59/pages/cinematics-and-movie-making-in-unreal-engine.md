# Cinematics and Sequencer

https://dev.epicgames.com/documentation/en-us/unreal-engine/cinematics-and-movie-making-in-unreal-engine?application_version=5.9

> Sequencer is Unreal Engine's multi-track editor used for creating and previewing cinematic sequences in real time.

[image: Cinematics and Sequencer]

Unreal Engine contains robust Cinematic tools enabling you to create animated and cinematic sequences. You can pilot cameras to create level fly-throughs, animate lights, move objects, animate characters, render output sequences, and more. At the core of these workflows is **Sequencer**, a powerful non-linear editing suite. Sequencer is the primary tool you will be using to create Cinematic content in Unreal Engine.

This page contains links to documentation covering Unreal Engine's Cinematic tools and real-world examples of their associated workflows.

[image: image alt text]

## Starting Out

If you're just starting to learn about Cinematics and Unreal Engine, the following pages cover the basics of the Sequencer Editor. Simple guides are provided to assist you in learning common actions you might perform when creating Cinematics.

- [image: Sequencer Basics] Sequencer BasicsGet started making cinematics and animations with Sequencer. (-> how-to-make-movies-in-unreal-engine)

- [image: Create Camera Animation] Create Camera AnimationA beginner's look at how to create camera animation in Sequencer. (-> how-to-animate-cinematic-cameras-in-unreal-engine)
- [image: Apply Animation to a Character] Apply Animation to a CharacterA beginner's guide at how to add character animation in Sequencer. (-> how-to-add-cinematic-animation-to-a-character-in-unreal-engine)
- [image: Animate a Light] Animate a LightA beginner's guide at how to animate lights in Sequencer. (-> how-to-animate-lights-in-unreal-engine)
- [image: Enable Particles] Enable ParticlesA beginner's look at how to enable different types of particles in Sequencer. (-> how-to-trigger-cinematic-particle-effects-in-unreal-engine)

## Sequencer Editor

These pages describe tools, features, and workflows of the Sequencer Editor and tools related to Sequencer.

- [image: Sequencer Overview] Sequencer OverviewLearn about Level Sequences and the primary features of the Sequencer Editor. (-> unreal-engine-sequencer-movie-tool-overview)

- [image: Sequencer Editor] Sequencer EditorAn overview of the Sequence Editor's user interface, tools, and options. (-> sequencer-cinematic-editor-unreal-engine)
- [image: Curve Editor] Curve EditorTweak your keyframes and curves by using the Curve Editor and tools within it. (-> animation-curve-editor-in-unreal-engine)
- [image: Tracks] TracksCreate tracks that affect your actors in Sequencer. (-> sequencer-track-list-in-unreal-engine)
- [image: Sequences, Shots, and Takes] Sequences, Shots, and TakesEdit cinematics in a non-linear editor using Sequences, Shots, and Takes. (-> sequences-shots-and-takes-in-unreal-engine)
- [image: Actor Sequence Component] Actor Sequence ComponentDescribes how you can embed Sequences within Actor Blueprints using an Actor Sequence Component. (-> sequencer-blueprint-component-in-unreal-engine)
- [image: Take Recorder] Take RecorderRecord Editor, Gameplay, and Live Link Actors with Take Recorder. (-> take-recorder-in-unreal-engine)
- [image: Keyframing] KeyframingAnimate objects, actors, and properties in Sequencer by keyframing them and utilizing sections. (-> creating-animation-keyframes-in-unreal-engine)
- [image: Editor Preferences and Project Settings] Editor Preferences and Project SettingsTweak Sequencer's behavior using Editor and Project Settings. (-> cinematic-editor-and-project-settings-in-unreal-engine)
- [image: Render Movie] Render MovieDescribes the options available to you when rendering out your cinematic sequences. (-> old-render-movie-in-unreal-engine)
- [image: Importing and Exporting FBX files] Importing and Exporting FBX filesDescribes how you can export FBX files from Sequencer and import FBX files to Sequencer. (-> import-and-export-cinematic-fbx-animations-in-unreal-engine)
- [image: Template Sequences] Template SequencesReuse animation data created in sequencer with Template Sequences. (-> template-sequences-in-unreal-engine)
- [image: Sequencer Tags and Groups] Sequencer Tags and GroupsReference your Sequencer Actors using Tags for Blueprint scripting, and organize your tracks with Groups. (-> cinematic-tags-and-groups-in-unreal-engine)
- [image: Custom Binding] Custom BindingCreate custom binding types using Blueprints or custom classes to bind objects to tracks in Sequencer. (-> dynamic-binding-in-sequencer)
- [image: Spawnables and Possessables] Spawnables and PossessablesSpawn temporary Actors, lights, and other objects in your scene by using Spawnables. (-> spawn-temporary-actors-in-unreal-engine-cinematics)
- [image: Sequencer Playlists] Sequencer PlaylistsPrepare and trigger Sequences during your virtual production session. (-> sequencer-playlists-in-unreal-engine)
- [image: Python Scripting in Sequencer] Python Scripting in SequencerLearn common Python scripting commands and features used with Sequencer. (-> python-scripting-in-sequencer-in-unreal-engine)

## Cameras

The following pages contain information on setting up and using Cameras in your Cinematics.

- [image: Cameras in Sequencer] Cameras in SequencerLearn about using cameras and its features for your cinematics. (-> movie-and-cinematic-cameras-in-unreal-engine)

- [image: Cine Camera Actor] Cine Camera ActorThe Cine Camera Actor is used as the primary camera type for filming cinematic content in Unreal Engine. (-> cinematic-cameras-in-unreal-engine)
- [image: Virtual Cameras] Virtual CamerasControl Cameras inside Unreal Engine by using a modular component system to manipulate and output Camera data. (-> virtual-cameras-in-unreal-engine)
- [image: Camera Rigs] Camera RigsFilm with real-world techniques in Unreal Engine by using Camera Rigs. (-> camera-jibs-and-dollies-in-unreal-engine)
- [image: Camera Shakes] Camera ShakesCreate camera shake effects in Unreal Engine. (-> camera-shakes-in-unreal-engine)
- [image: Cinematic Viewport] Cinematic ViewportUse the Cinematic Viewport to add filmmaking controls in the viewport. (-> cinematic-viewport-controls-in-unreal-engine)
- [image: Image Plate] Image PlatePlay full screen videos and image sequences on your cameras using Image Plates. (-> full-screen-movies-in-unreal-engine)

## Rendering

Unreal Engine's Movie Render Queue allows you to output your Cinematic scenes to an image sequence. These pages describe how to use this tool.

- [image: Movie Render Pipeline] Movie Render PipelineUse the Movie Render Pipeline to render and export linear content. (-> movie-render-pipeline-in-unreal-engine)

- [image: Transitioning to Movie Render Graph from Movie Render Queue] Transitioning to Movie Render Graph from Movie Render QueueLearn about the Movie Render Graph feature in Unreal Engine. (-> transitioning-to-the-movie-render-graph-from-movie-render-queue-in-unreal-engine)

- [image: Programming a Render in Movie Render Graph] Programming a Render in Movie Render GraphMovie render graph scripting and concept discussion. (-> programming-a-render-in-mrg-in-unreal-engine)

- [image: Callback Scripts] Callback ScriptsIntroduction to the new ways of adding Callbacks to the Movie Render Graph. (-> movie-render-graph-callback-scripts-in-unreal-engine)

- [image: Render Passes] Render PassesLearn about the different render pass layers in Movie Render Queue. (-> cinematic-render-passes-in-unreal-engine)

- [image: Still Image Render] Still Image RenderQuickly render multiple camera angles to individual images in MRQ using the Still Image Render tool. (-> render-multiple-camera-angle-stills-in-unreal-engine)

- [image: Using Command Line Rendering with MRQ] Using Command Line Rendering with MRQAn overview of using Command Line Rendering with Movie Render Queue. (-> using-command-line-rendering-with-move-render-queue-in-unreal-engine)

- [image: Movie Render Queue in Runtime Builds] Movie Render Queue in Runtime BuildsHow to use Movie Render Queue in a distributed build to create movies on end-users' devices (-> movie-render-queue-in-runtime-in-unreal-engine)

- [image: Render Settings and Formats] Render Settings and FormatsCustomize your render output and visuals with render settings and formats for MRQ and MRG (-> cinematic-render-settings-and-formats-in-unreal-engine)

## Workflow Guides and Examples

These how-to guides will walk you through how to create certain Cinematic content examples.

- [image: Creating Camera Cuts Using Sequencer] Creating Camera Cuts Using SequencerLearn how to create camera cuts in Sequencer. (-> creating-camera-cuts-using-sequencer-in-unreal-engine)
- [image: Creating Level Sequences with Dynamic Transforms] Creating Level Sequences with Dynamic TransformsDynamically change locations of your Sequencer content using Transform Origin Actors. (-> creating-level-sequences-with-dynamic-transforms-in-unreal-engine)
- [image: Blending Gameplay and Sequencer Animation] Blending Gameplay and Sequencer AnimationSeamlessly blend character and camera animation from Sequencer to gameplay using Animation Blueprints and Slots. (-> blend-gameplay-animation-to-cinematic-animation-in-unreal-engine)
- [image: Switching Actor Materials in Sequencer] Switching Actor Materials in SequencerHow to change materials for an Actor in a Sequence. (-> change-material-in-unreal-engine-cinematic-movie)
- [image: Referencing the Player in Sequencer] Referencing the Player in SequencerReference the player in Sequencer by using a proxy substitute, then changing the binding at runtime. (-> how-to-reference-the-player-in-unreal-engine-cinematics)
- [image: Rendering Out Cinematic Movies] Rendering Out Cinematic MoviesShows you can render out your cinematic sequences to a saved movie file on your computer. (-> rendering-out-cinematic-movies-in-unreal-engine)
- [image: Rendering from Multiple Camera Angles] Rendering from Multiple Camera AnglesLearn how to render from multiple cinematic cameras within the same sequence without needing to create extra shots or takes. (-> rendering-from-multiple-camera-angles-in-unreal-engine)
- [image: Calling Events through Sequencer] Calling Events through SequencerExample of how you can use Sequencer's Event Track to fire off Events in Blueprint. (-> fire-blueprint-events-during-cinematics-in-unreal-engine)
- [image: Trigger Level Blueprint Events from Sequencer] Trigger Level Blueprint Events from SequencerUse Blueprint Interfaces to communicate Sequencer's Event Track to a Level Blueprint (-> trigger-level-blueprint-events-from-sequencer-in-unreal-engine)
- [image: Using Take Recorder] Using Take RecorderHow-to use Take Recorder to record sequences with motion capture. (-> record-gameplay-in-unreal-engine)
- [image: Actor Rebinding in Blueprints with Sequencer] Actor Rebinding in Blueprints with SequencerThis example illustrates how you can apply Sequences to dynamic objects at runtime that are different than the one the Sequence was authored with. (-> change-cinematic-track-bindings-in-unreal-engine)
- [image: Applying Burn Ins] Applying Burn InsShows how you can apply overlays from UMG to rendered Sequencer movies. (-> applying-burn-ins-to-your-movie-in-unreal-engine)
- [image: Controlling Anim Instances with Sequencer] Controlling Anim Instances with SequencerShows how to animate variables on anim instances through possessables (-> control-animation-blueprint-parameters-from-sequencer-in-unreal-engine)
- [image: Importing & Exporting Edit Decision Lists (EDLs)] Importing & Exporting Edit Decision Lists (EDLs)Illustrates how you can import and export EDLs for use in external video editing software applications. (-> import-and-export-edl-in-unreal-engine)
- [image: Triggering Sequences from Gameplay] Triggering Sequences from GameplayIllustrates how to trigger a Sequence from an in-game event. (-> play-cinematics-from-blueprints-in-unreal-engine)
- [image: Keeping or Restoring Changes Made by Sequencer] Keeping or Restoring Changes Made by SequencerDescribes how to keep any changes made through Sequencer when it has completed or restore changes back to their original state. (-> what-happens-when-my-cinematic-ends-in-unreal-engine)
- [image: Blending Animation Blueprints with Sequencer] Blending Animation Blueprints with SequencerDescribes how you can take a the pose from an Animation Blueprint and blend it with animations defined inside a Level Sequence. (-> blending-animation-blueprints-with-sequencer-in-unreal-engine)

## Cheat Sheet and Workflow shortcuts

These pages contain small workflow tips, hotkeys, and other time-saving shortcuts.

- [image: Cinematic Shortcuts and Tips] Cinematic Shortcuts and TipsTips, tricks, and shortcuts for your cinematic workflow. (-> cinematic-workflow-tips-for-sequencer-in-unreal-engine)

- [image: Sequencer Hotkeys] Sequencer HotkeysA list and description of Sequencer's main hotkeys. (-> sequencer-hotkeys-in-unreal-engine)

## Cinematic Samples

You can also browse and download pre-made projects to learn how these content examples were made with Sequencer.

- [image: Meerkat Demo] Meerkat DemoHow to set up the Meerkat demo, render it with Movie Render Queue, and explore its animation and optimization features (-> meerkat-sample-project-for-unreal-engine)
- [image: Slay] SlayFully realize your virtual production workflows in Unreal Engine by learning about Slay and its cinematic techniques. (-> slay-sample-project-for-unreal-engine)

- sequencer

On this page

- Starting Out (-> cinematics-and-movie-making-in-unreal-engine)
- Sequencer Editor (-> cinematics-and-movie-making-in-unreal-engine)
- Cameras (-> cinematics-and-movie-making-in-unreal-engine)
- Rendering (-> cinematics-and-movie-making-in-unreal-engine)
- Workflow Guides and Examples (-> cinematics-and-movie-making-in-unreal-engine)
- Cheat Sheet and Workflow shortcuts (-> cinematics-and-movie-making-in-unreal-engine)
- Cinematic Samples (-> cinematics-and-movie-making-in-unreal-engine)
