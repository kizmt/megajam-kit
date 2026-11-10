# Lyra Interaction System

https://dev.epicgames.com/documentation/en-us/unreal-engine/lyra-sample-game-interaction-system-in-unreal-engine?application_version=5.9

> An overview of the Lyra Interaction System for the Lyra Game sample.

[image: Lyra Interaction System]

## Lyra Interaction System

Lyra uses its interaction Interface (-> interfaces-in-unreal-engine)/IInterface (-> API) through its own Gameplay Ability (-> gameplay-ability-system-for-unreal-engine)/UGameplayAbility (-> API) (ULyraGameplayAbility_Interact) which establishes a cause and effect relationship between how the player Interacts with objects in Lyra, and how those objects interact with the player.

Using the `LyraGameplayAbility_Interact` class, you can manage the logic of how your interactions are called.

**ULyraGameplayAbility_Interact.h**

 C++

```
#pragma once
		#include "CoreMinimal.h"
		#include "AbilitySystem/Abilities/LyraGameplayAbility.h"
		#include "Interaction/InteractionQuery.h"
		#include "Interaction/IInteractableTarget.h"
		#include "LyraGameplayAbility_Interact.generated.h"

		class FIndicatorDescriptor;
		/**
```

`AbilityTask_WaitForInteractableTargets_SingleLineTrace` is a Gameplay Ability Task (-> gameplay-ability-tasks-in-unreal-engine), which performs a line trace and waits in a looped timer until it hits an Actor that implements the interface.

As an example:

A player controlling a LyraPawnActor is low on health, the player directs the Pawn towards a collectible health item pickup. Upon aligning the player's crosshair with the Collectible, and pressing the "Use/Interact" key, a Line Trace is fired from the Pawn. When the trace hits the Collectible, the interaction interface implemented on the Collectible will handle the logic to restore the Player's health to its full amount.

## Interaction Ability Tasks

`UAbilityTask_WaitForInteractableTargets` is used to make a new method of tracing for interactable targets.

As an example:

A player controlling a LyraPawnActor approaches a door that they want to open. Upon aligning the player's crosshair with the door and pressing the "Use" key, a radial menu appears with the options to "Unlock/Lock" the door, or attempt to open the door.

For additional information on Line Traces in Unreal, See Tracing (-> traces-tutorials-in-unreal-engine)

**UAbilityTask_WaitForInteractableTargets.h**

 C++

```
#pragma once
		#include "CoreMinimal.h"
		#include "UObject/ObjectMacros.h"
		#include "Abilities/Tasks/AbilityTask.h"
		#include "Engine/EngineTypes.h"
		#include "CollisionQueryParams.h"
		#include "WorldCollision.h"
		#include "Engine/CollisionProfile.h"
		#include "Abilities/GameplayAbilityTargetDataFilter.h"
		#include "Interaction/InteractionOption.h"
```

Your chosen AbilityTask for tracing delivers a set of Interactable targets from the `FInteractionQuery` struct.

**struct FInteractionQuery**

 C++

```
#pragma once
		#include "CoreMinimal.h"
		#include "Abilities/GameplayAbility.h"
		#include "InteractionQuery.generated.h"

		/**  */
		USTRUCT(BlueprintType)
		struct FInteractionQuery
		{
```

to the method `UAbilityTask_WaitForInteractableTargets::UpdateInteractableOptions`:

 C++

```
void UAbilityTask_WaitForInteractableTargets::UpdateInteractableOptions(const FInteractionQuery& InteractQuery, const TArray<TScriptInterface<IInteractableTarget>>& InteractableTargets)
		{

			TArray<FInteractionOption> NewOptions;

			for (const TScriptInterface<IInteractableTarget>& InteractiveTarget : InteractableTargets)

			{

				TArray<FInteractionOption> TempOptions;
```

which will call `IInteractableTarget::GatherInteractionOptions` on each interactable target.

 C++

```
virtual void GatherInteractionOptions(const FInteractionQuery& InteractQuery, FInteractionOptionBuilder& OptionBuilder) = 0;
```

virtual void GatherInteractionOptions(const FInteractionQuery& InteractQuery, FInteractionOptionBuilder& OptionBuilder) = 0;

Once you update the set of interactable objects, the interaction ability (GA_Interact) calls the `TriggerInteraction` function when the player focuses on an object to interact with and receives input from the player that they want to interact with that particular object.

Once you invoke the current Option, there are two methods by which interactions can occur. The first method grants an ability to the player's Ability System Component through the function `FInteractionOption::InteractionAbilityToGrant`, using this function is recommended for simple logic such as the Weapon Pickup Actor.

Alternatively, if you're interacting with an object that contains its own Ability System Component to handle complex logic, then you can invoke the `FInteractionOption::TargetAbilitySystem` and the `FInteractionOption::TargetInteractionHandle` functions, this invokes the ability on the interactable object, instead of invoking the ability on the Lyra Character's (Avatar) Ability System Component.

The interaction function `FInteractionOption::InteractionAbilityToGrant` is inherited from the base class of your `ULyraGameplayAbility_Interact` interaction ability, which runs the task function `AbilityTask_GrantNearbyInteraction`, as a ranged loop and timer that collects nearby abilities and grants them to your character before you attempt to interact with them. You can increase the `InteractionScanRate` float to be at a larger radius than your `InteractionRange`, otherwise, replication will not deliver the ability to the client soon enough.

The ability is invoked through the event Gameplay Tag (-> using-gameplay-tags-in-unreal-engine), `FInteractionOption::InteractionEventTag`. This tag needs to match up to a trigger in your ability. For example, the `GA_Collect_Interaction` is triggered when the `Ability.Type.Interact.Collect` event is sent, which is set in the interaction option.

`GA_Collect_Interaction` represents only one kind of interaction, it is an ability that provides you the capability to pick up objects on the ground and add them to your inventory. There is no limit to your imagination, you can make an ability to eat Apples on the ground that will refill your player's health, or you could make an ability to open doors, get into a vehicle, or open a chest.

This decoupling behavior provides you with all kinds of different interactions from the central passive interaction scanner.

#### Important Lyra Interaction Terminology

**InteractableTarget** - An Actor or Component that implements the IInteractableTarget interface, this determines what objects in the world can be interacted with.

**InteractionOption** - The "Affordance" or "Option", for example, an apple might provide both a "Collect" and a "Consume".

**InteractionInstigator** - The Pawn (LyraPawnActor) that initiates the interaction. They may or may not implement the `IInteractionInstigator` interface, which allows further customization of options and how they are presented.

On this page

- Lyra Interaction System (-> lyra-sample-game-interaction-system-in-unreal-engine)
- Interaction Ability Tasks (-> lyra-sample-game-interaction-system-in-unreal-engine)
- Important Lyra Interaction Terminology (-> lyra-sample-game-interaction-system-in-unreal-engine)
