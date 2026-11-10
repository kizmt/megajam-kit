# Creating Timelines

https://dev.epicgames.com/documentation/en-us/unreal-engine/creating-timelines-in-unreal-engine?application_version=5.9

> This document contains an overview of how to create Timeline nodes in Blueprints and C++.

**blueprint:**

## Creating Timelines

You can create your own **Timeline Component** in an **Actor** Blueprint by following these steps.

- From the **Content Browser**, select **Add+** > **Blueprint Class** and create a new Actor Blueprint named **BP_TimelineActor**. The **Pick Parent Class** dialog appears.

- In the **Class Defaults**, right-click on the **Event Graph**, to display the **Blueprint Context Menu**, search for and select **Add Timeline**.

A new Timeline node appears on the Event Graph.

When a Timeline is added to your Blueprint class, you will be able to see it listed in the **My Blueprint** tab.

## Timeline Variables

Once you have created a Timeline, you will notice it becomes available as a variable in the **My Blueprint** tab. This is done to provide a reference to the Timeline component, and is useful when utilizing the Timeline nodes. These nodes exist to allow access to certain features of a Timeline, such as its play rate.

For example, you can use the **Get Timeline 0** variable to query the current Play Rate value of that Timeline.

A wide variety of such nodes exist, providing the capabilities to query values and control behavior of your Timeline nodes. For a complete list of the available Timeline nodes and their functionality, see the Timeline Nodes (-> timelines-nodes-in-unreal-engine) page.

## Creating a Timeline Event

**Timeline Events** provide functionality to a **Timeline Component** to handle your own custom events or functions. Follow the steps below for an example on how to implement your own event.

- Open **BP_TimelineActor**, drag off the **execution pin** of the **Begin Play** node and search for and select **Add Timeline**. **context_graph** ```blueprint Begin Object Class=/Script/BlueprintGraph.K2Node_Event Name="K2Node_Event_0"      EventReference=(MemberParent=Class'"/Script/Engine.Actor"',MemberName="ReceiveBeginPlay")      bOverrideFunction=True      NodePosY=-128      bCommentBubblePinned=True      NodeGuid=5FBA33CC4CC8CB4ED0DE10802AEC6150      CustomProperties Pin (PinId=04DC4F854BB6BB3B469928A3D262B532,PinName="OutputDelegate",Direction="EGPD_Output",PinType.PinCategory="delegate",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(MemberParent=Class'"/Script/Engine.Actor"',MemberName="ReceiveBeginPlay"),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)      CustomProperties Pin (PinId=493D6ECC48C47DAF19E698BF937AB787,PinName="then",Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_Timeline_0 7B94569E4931CB05569B779BA7053DE2,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)      End Object      Begin Object Class=/Script/BlueprintGraph.K2Node_Timeline Name="K2Node_Timeline_0" ``` (17 more lines on the web page)

- Drag off the **Finished** pin of the **Timeline_0** node, search for and add **Print String** node. Input the string "**Timeline Finished**" to the **text field**. **context_graph** ```blueprint Begin Object Class=/Script/BlueprintGraph.K2Node_CallFunction Name="K2Node_CallFunction_3"      FunctionReference=(MemberParent=Class'"/Script/Engine.KismetSystemLibrary"',MemberName="PrintString")      NodePosX=432      NodePosY=-128      AdvancedPinDisplay=Hidden      EnabledState=DevelopmentOnly      NodeGuid=C2E617C34EF5512E11FFEF9545AC379A      CustomProperties Pin (PinId=1941A1CD45D63F98C92FB1AA49279290,PinName="execute",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_Timeline_0 AEAD3EDD4B931BA678F86DBDD5D365C2,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)      CustomProperties Pin (PinId=B5FA1DB14BEC1B77DDD8D5A441E574DB,PinName="then",Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)      CustomProperties Pin (PinId=95EA3B1449CB53545C29F38249A31A77,PinName="self",PinFriendlyName=NSLOCTEXT("K2Node", "Target", "Target"),PinType.PinCategory="object",PinType.PinSubCategory="",PinType.PinSubCategoryObject=Class'"/Script/Engine.KismetSystemLibrary"',PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultObject="/Script/Engine.Default__KismetSystemLibrary",PersistentGuid=00000000000000000000000000000000,bHidden=True,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,) ``` (8 more lines on the web page)

- Your final Blueprint Script should look as following: **context_graph** ```blueprint Begin Object Class=/Script/BlueprintGraph.K2Node_Event Name="K2Node_Event_0"      EventReference=(MemberParent=Class'"/Script/Engine.Actor"',MemberName="ReceiveBeginPlay")      bOverrideFunction=True      NodePosX=-16      NodePosY=-128      bCommentBubblePinned=True      NodeGuid=5FBA33CC4CC8CB4ED0DE10802AEC6150      CustomProperties Pin (PinId=04DC4F854BB6BB3B469928A3D262B532,PinName="OutputDelegate",Direction="EGPD_Output",PinType.PinCategory="delegate",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(MemberParent=Class'"/Script/Engine.Actor"',MemberName="ReceiveBeginPlay"),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)      CustomProperties Pin (PinId=493D6ECC48C47DAF19E698BF937AB787,PinName="then",Direction="EGPD_Output",PinType.PinCategory="exec",PinType.PinSubCategory="",PinType.PinSubCategoryObject=None,PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,LinkedTo=(K2Node_Timeline_0 7B94569E4931CB05569B779BA7053DE2,),PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)      End Object ``` (36 more lines on the web page)

- Click **Compile** and **Save** buttons.

- Close the **Blueprint Editor** and navigate to the **Content Browser**. Find your **BP_TimelineActor** and drag off it into the **Level**.

- Click **Play** button for checking result. [image: After a default Timeline length of 5 seconds, The text "Timeline Finished" will appear on the top left corner of the viewport.]

## Renaming Timelines

When using multiple Timelines in your Blueprints, it is important to name each Timeline accordingly. By default, all Timelines are named **"Timeline_n"** where **n** is a serialized number at the end. You can rename a Timeline by right-clicking it within the **Graph** tab or in the **My Blueprint** tab and selecting **Rename**.

## Opening the Timeline Editor

Creating a timeline may not be useful unless you set it up with something to perform. For more information on editing Timelines, please see the Timeline Editing page.

**cpp:**

## Creating Timelines

You can create and instantiate your own **Timeline Component** in an **Actor** class by following the steps below.

- Navigate to your **C++ Classes folder** and click the **Add+**. From the drop down menu select **New C++ Class**.

- Select **Actor** class as a **Parent Class**. [image: Click image for full size.]

- Name created Actor class **Timeline Actor**. [image: Click image for full size.]

- Navigate to your `TimelineActor.h` file and include following `TimelineComponent` class library. TimelineActor.h ```cpp_programming #include "Components/TimelineComponent.h" ```

- Implement the following class declaration inside the TimelineActor class defintion: TimelineActor.h ```cpp_programming protected:         UPROPERTY(EditAnywhere, BlueprintReadWrite)         UTimelineComponent* ExampleTimelineComp; ``` > **note:** In this code sample, you use the Property Specifier Tags (-> unreal-engine-uproperties), **EditAnywhere**, and **BlueprintReadWrite**.

- Navigate to the `TimelineActor.cpp` file, then add the following code to your TimelineActor constructor `ATimelineActor::ATimelineActor()` TimelineActor.cpp ```cpp_programming ATimelineActor::ATimelineActor()      {          // Set this actor to call Tick() every frame.  You can turn this off to improve performance if you don't need it.          PrimaryActorTick.bCanEverTick = true;          ExampleTimelineComp = CreateDefaultSubobject<UTimelineComponent>(TEXT("TimelineComponent"));      } ```

- **Compile** your code.

- Navigate to the **C++ classes folder**, right-click on your **TimelineActor** and create a Blueprint based on your TimelineActor class. Name it **Bp_TimelineActor**.

- Once you have created your TimelineActor Blueprint, you can view the **Class Defaults**. From the **Components** tab, you should see your example Timeline Component.

### Work-In-Progress Code

TimelineActor.h

```cpp_programming
#pragma once
	#include "Components/TimelineComponent.h"
	#include "CoreMinimal.h"
	#include "GameFramework/Actor.h"
	#include "TimelineActor.generated.h"

	UCLASS()
	class CPPTIMELINE_API ATimelineActor : public AActor
	{
		GENERATED_BODY()
```
(17 more lines on the web page)

TimelineActor.cpp

```cpp_programming
#include "TimelineActor.h"

	// Sets default values
	ATimelineActor::ATimelineActor()
	{
		// Set this actor to call Tick() every frame.  You can turn this off to improve performance if you don't need it.
		PrimaryActorTick.bCanEverTick = true;
		ExampleTimelineComp = CreateDefaultSubobject<UTimelineComponent>(TEXT("TimelineComponent"));
	}
```
(12 more lines on the web page)

## Timeline Variables

When you create a Timeline Component in C++ using `UProperty Specifiers`, it will become available as a variable in your **Components** tab. This may be useful for designers who would
like to continue to make iterations to your TimelineComponent via Blueprint Scripting.

> **note:** Image above shows using the native C++ Timeline Variable to get the Current Play Rate value of the Timeline in Blueprint.

For a complete list of the available Blueprint Timeline nodes and their functionality please see the Timeline nodes (-> timelines-nodes-in-unreal-engine) page.

## Creating a FTimeLineEvent

Timeline Events (`FOnTimelineEvent`) are Dynamic Delegates (-> dynamic-delegates-in-unreal-engine) that provide functionality to a Timeline Component to handle an Event.
Follow the steps below to create your own `FTimeLineEvent` to be bound to your Timeline Component's finished functionality.

- Navigate to `TimelineActor.h` file and declare the following code in the **Class Definition**: TimelineActor.h ```cpp_programming protected:          //Delegate signature for the function which will handle our Finished event.          FOnTimelineEvent TimelineFinishedEvent;          UFUNCTION()          void TimelineFinishedFunction(); ```

- Navigate to `TimelineActor.cpp` and implement the following code: TimelineActor.cpp ```cpp_programming void ATimelineActor::TimelineFinishedFunction()       {          UE_LOG(LogTemp, Warning, TEXT("Finished Event Called."));       } ```

- Navigate to `ATimelineActor::BeginPlay()` method, and implement the following code: TimelineActor.cpp ```cpp_programming // Called when the game starts or when spawned      void ATimelineActor::BeginPlay()      {          Super::BeginPlay();          TimelineFinishedEvent.BindUFunction(this, FName("TimelineFinishedFunction"));          ExampleTimelineComp->SetTimelineFinishedFunc(TimelineFinishedEvent);          ExampleTimelineComp->PlayFromStart();      } ``` You have now successfully bound your `TimelineFinished` Event to your custom `TimelineFinished` function.

- Compile your code. Open **Editor** and navigate to the **Content Browser**. Find your **BP_TimelineActor** and drag off it into the **Level**. [image: image alt text]

- Press **Play** button. You should see the following message in the **Output Log** window: [image: image alt text]

### Finished Code

TimelineActor.h

```cpp_programming
#pragma once
	#include "Components/TimelineComponent.h"
	#include "CoreMinimal.h"
	#include "GameFramework/Actor.h"
	#include "TimelineActor.generated.h"

	UCLASS()
	class CPPTIMELINE_API ATimelineActor : public AActor
	{
		GENERATED_BODY()
```
(25 more lines on the web page)

TimelineActor.cpp

```cpp_programming
#include "TimelineActor.h"

	// Sets default values
	ATimelineActor::ATimelineActor()
	{
		// Set this actor to call Tick() every frame.  You can turn this off to improve performance if you don't need it.
		PrimaryActorTick.bCanEverTick = true;
		ExampleTimelineComp = CreateDefaultSubobject<UTimelineComponent>(TEXT("TimelineComponent"));
	}
```
(22 more lines on the web page)
