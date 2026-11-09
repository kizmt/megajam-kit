# Keys and Curves

https://dev.epicgames.com/documentation/en-us/unreal-engine/keys-and-curves-in-unreal-engine?application_version=5.9

> This document contains an overview of how to work with keys and curves within the Timeline editor in Blueprints.

[image: Keys and Curves]

Programming Language

×C++

Select an option from the dropdown to see content relevant to it.

A **Curve** (**UCurveBase (-> API)**) defines a track of interpolated points to evaluate over a given range. Curves can be **vectors**, **floats**, and **colors**. Each track can have any number of **keys** that define a time and value. The data can be interpolated between these keys to calculate the value at any point during the Timeline.

## Working with Keys and Curves

In this example, you will create a **UCurveFloat (-> API)** that defines a curve of interpolated float points to evaluate over a given range.

To create and instantiate a `UCurveFloat` to a **Timeline Component**, follow the steps below:

- Navigate to the **Content Browser**, click **C++ Classes** folder, then click **Add (+)** button and select **New C++ Class**.
- Select **Actor** as a **Parent Class**. Click image for full size.
- Name created Actor as **ExampleTimelineComponent**. Click image for full size.
- When new Actor is created, **Visual Studio** automatically opens `ExampleTimelineComponent.h` and `ExampleTimelineComponent.cpp` files. Navigate to the `ExampleTimelineComponent.h` file and add the following to the `#include` section:ExampleTimelineComponent.h C++ ```
#include "Components/TimelineComponent.h"
``` #include "Components/TimelineComponent.h"
- Next, in the `ExampleTimelineComponent` class definition, add the following code:ExampleTimelineComponent.h C++ ```
protected:

         UPROPERTY(EditAnywhere, BlueprintReadWrite)
         UTimelineComponent* ExampleTimelineComp;

     public:

         UPROPERTY(EditAnywhere)
         UCurveFloat* ExampleTimelineCurve;
``` protected: UPROPERTY(EditAnywhere, BlueprintReadWrite) UTimelineComponent* ExampleTimelineComp; public: UPROPERTY(EditAnywhere) UCurveFloat* ExampleTimelineCurve;
- Compile your code.
- Navigate to the **Content Browser**, select **Add (+) > Miscellaneous > Curve**.
- Select **CurveFloat** and name it **ExampleFloatTrack**.
- In **Content Browser** navigate to the folder with your **ExampleTimelineComponent** class, right click it and select **Create Blueprint Class based on ExampleTimelineComponent**. Name it **BP_ExampleTimelineComponent**.
- Open the **BP_ExampleTimelineComponent** class defaults, navigate to the **Detail** panel and assign your **Example Timeline Curve** with your **ExampleFloatTrack**.
- Double-click your **Example Float Track** from the Content Browser to open the **Timeline Editor**.

## Adding Keys

Keys are added by pressing the **Enter** key, or by right clicking on the gray bar and selecting the action **Add Key** from the context menu.

## Editing Keys

The time and value of the key can be set by clicking the key and entering the values into the time and value fields near the top of the track.

## Deleting Keys

Selected keys can be deleted by pressing the **Delete** key on the keyboard, or by right clicking on the key you want to delete and selecting the action **Delete** from the context menu.

## Moving Keys

To move a key along the timeline, select the key, then drag it. Multiple keys can be selected using the **Ctrl** key. Dragging horizontally will update the **Time** value of the key, while dragging vertically will update the **Value**.

## Key Interpolation

By right-clicking a key, a context menu menu appears to choose the interpolation type for selected key.

Key interpolation only affects the curve between the key you interpolate for and the next key after that. For example, with all other keys set to **Linear**, and the center key set to **Cubic-Auto**, the track will look similar to the image below.

Available interpolation types are:

- **Auto**
- **User**
- **Break**
- **Linear**
- **Constant**

- blueprints
- blueprint

On this page

- Working with Keys and Curves (-> keys-and-curves-in-unreal-engine)
- Adding Keys (-> keys-and-curves-in-unreal-engine)
- Editing Keys (-> keys-and-curves-in-unreal-engine)
- Deleting Keys (-> keys-and-curves-in-unreal-engine)
- Moving Keys (-> keys-and-curves-in-unreal-engine)
- Key Interpolation (-> keys-and-curves-in-unreal-engine)
