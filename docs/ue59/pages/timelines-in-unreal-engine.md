# Timelines

https://dev.epicgames.com/documentation/en-us/unreal-engine/timelines-in-unreal-engine?application_version=5.9

> An Overview of Timelines in Unreal

[image: Timelines]

Programming Language

×C++

Select an option from the dropdown to see content relevant to it.

## Overview (C++)

**UTimelineComponent** holds a series of **events**, **floats**, **vectors** or **colors** with their associated **keyframes**. They are inherited from UActorComponents (-> API)

For further documentation, please see the overview about Actor Components (-> components-in-unreal-engine)

Timelines allow for time-based animation which are played from Events that can be triggered at keyframes along the timeline. They can be used to handle simple, non-cinematic tasks such as opening doors, altering lights, or performing other time-centric manipulations to Actors within a scene. They are similar to level sequences (-> unreal-engine-sequencer-movie-tool-overview) as they both provide values such as floats, vectors, and colors to be interpolated between keyframes along the timeline.

## Inputs and Outputs

UTimelineComponents have robust methods that can be extended in native code, refer to the UTimelineComponent (-> API) API reference for further documentation. If you would like to see examples on how to utilize Timeline Components in the engine, see one of the Timeline Example links in the section below.

ExampleTimeline.h

 C++

```
/** Start playback of timeline */
	UFUNCTION(BlueprintCallable, Category="Components|Timeline")
	ENGINE_API void Play();

	/** Start playback of timeline from the start */
	UFUNCTION(BlueprintCallable, Category="Components|Timeline")
	ENGINE_API void PlayFromStart();

	/** Start playback of timeline in reverse */
	UFUNCTION(BlueprintCallable, Category="Components|Timeline")
```

## Timeline Examples

- [image: Keys and Curves] Keys and CurvesThis document contains an overview of how to work with keys and curves within the Timeline editor in Blueprints. (-> keys-and-curves-in-unreal-engine)
- [image: Fading Lights] Fading LightsAn example use of a timeline in which we set up a fading light that also changes color. (-> fading-lights-in-unreal-engine)
- [image: Opening Doors] Opening DoorsAn example use of a timeline in which we set up a classic proximity-based opening door using Blueprints and C++. (-> opening-doors-in-unreal-engine)

- blueprints
- blueprint

On this page

- Overview (C++) (-> timelines-in-unreal-engine)
- Inputs and Outputs (-> timelines-in-unreal-engine)
- Timeline Examples (-> timelines-in-unreal-engine)
