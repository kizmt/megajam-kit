# Implement Interface in Blueprint

https://dev.epicgames.com/documentation/en-us/unreal-engine/implementing-blueprint-interfaces-in-unreal-engine?application_version=5.9

> Implement interface functions in Blueprints that inherit from C++ or Blueprint interfaces.

[image: Implement Interface in Blueprint]

Interfaces are a common method of interacting with different types of objects that all share some specific functionality. This means you can enforce different types of objects to implement some of the same functionality, no matter how dissimilar the objects are. Blueprints can implement:

- Blueprint Interfaces

- Unreal C++ Interfaces

## Create an Interface

To create an interface, see the following documentation:

- Create a Blueprint Interface (-> blueprint-interface-in-unreal-engine)

- Create an Unreal C++ Interface

## Content Used on this Page

The content on this page uses an Unreal Engine interface defined in C++ and an actor that implements that interface. The header and source files are provided below:

MyInterface.h

```
#pragma once

#include "CoreMinimal.h"
#include "UObject/Interface.h"
#include "MyInterface.generated.h"

// This class does not need to be modified.
UINTERFACE(MinimalAPI, Blueprintable)
class UMyInterface : public UInterface
{
	GENERATED_BODY()
};

class SAMPLE_API IMyInterface
{
	GENERATED_BODY()

	// Add interface functions to this class. This is the class that will be inherited to implement this interface.
public:

	virtual bool MyInterfaceFunction();

	UFUNCTION(BlueprintCallable, BlueprintImplementableEvent, Category=MyInterface)
	bool MyImplementableFunction();

	UFUNCTION(BlueprintCallable, BlueprintNativeEvent, Category=MyInterface)
	FString MyNativeFunction();

	// Utility Functions
public:
	FString GetInterfaceName();
};
```

#pragma once

#include "CoreMinimal.h"
#include "UObject/Interface.h"
#include "MyInterface.generated.h"

// This class does not need to be modified.
UINTERFACE(MinimalAPI, Blueprintable)
class UMyInterface : public UInterface
{
 GENERATED_BODY()
};

class SAMPLE_API IMyInterface
{
 GENERATED_BODY()

 // Add interface functions to this class. This is the class that will be inherited to implement this interface.
public:

 virtual bool MyInterfaceFunction();

 UFUNCTION(BlueprintCallable, BlueprintImplementableEvent, Category=MyInterface)
 bool MyImplementableFunction();

 UFUNCTION(BlueprintCallable, BlueprintNativeEvent, Category=MyInterface)
 FString MyNativeFunction();

 // Utility Functions
public:
 FString GetInterfaceName();
};

MyInterface.cpp

```
#include "MyInterface.h"

// Add default functionality here for any IMyInterface functions that are not pure virtual.
bool IMyInterface::MyInterfaceFunction()
{
	return false;
}

FString IMyInterface::GetInterfaceName()
{
	return FString(TEXT("MyInterface"));
}
```

#include "MyInterface.h"

// Add default functionality here for any IMyInterface functions that are not pure virtual.
bool IMyInterface::MyInterfaceFunction()
{
 return false;
}

FString IMyInterface::GetInterfaceName()
{
 return FString(TEXT("MyInterface"));
}

MyInterfaceActor.h

```
#pragma once

#include "CoreMinimal.h"
#include "GameFramework/Actor.h"
#include "MyInterface.h"
#include "MyInterfaceActor.generated.h"

UCLASS()
class SAMPLE_API AMyInterfaceActor : public AActor, public IMyInterface
{
	GENERATED_BODY()

public:
	// Sets default values for this actor's properties
	AMyInterfaceActor();

	// Interface function implementations
	virtual bool MyInterfaceFunction() override;

	FString MyNativeFunction_Implementation() override;

	// Called every frame
	virtual void Tick(float DeltaTime) override;

protected:
	// Called when the game starts or when spawned
	virtual void BeginPlay() override;

};
```

#pragma once

#include "CoreMinimal.h"
#include "GameFramework/Actor.h"
#include "MyInterface.h"
#include "MyInterfaceActor.generated.h"

UCLASS()
class SAMPLE_API AMyInterfaceActor : public AActor, public IMyInterface
{
 GENERATED_BODY()

public:
 // Sets default values for this actor's properties
 AMyInterfaceActor();

 // Interface function implementations
 virtual bool MyInterfaceFunction() override;

 FString MyNativeFunction_Implementation() override;

 // Called every frame
 virtual void Tick(float DeltaTime) override;

protected:
 // Called when the game starts or when spawned
 virtual void BeginPlay() override;

};

MyInterfaceActor.cpp

```
#include "MyInterfaceActor.h"

// Sets default values
AMyInterfaceActor::AMyInterfaceActor()
{
 	// Set this actor to call Tick() every frame.  You can turn this off to improve performance if you don't need it.
	PrimaryActorTick.bCanEverTick = true;
}

bool AMyInterfaceActor::MyInterfaceFunction()
{
	return true;
}

FString AMyInterfaceActor::MyNativeFunction_Implementation()
{
	return FString(TEXT("My Native Function C++ Implementation first."));
}

// Called when the game starts or when spawned
void AMyInterfaceActor::BeginPlay()
{
	Super::BeginPlay();
}

// Called every frame
void AMyInterfaceActor::Tick(float DeltaTime)
{
	Super::Tick(DeltaTime);
}
```

#include "MyInterfaceActor.h"

// Sets default values
AMyInterfaceActor::AMyInterfaceActor()
{
 // Set this actor to call Tick() every frame. You can turn this off to improve performance if you don't need it.
 PrimaryActorTick.bCanEverTick = true;
}

bool AMyInterfaceActor::MyInterfaceFunction()
{
 return true;
}

FString AMyInterfaceActor::MyNativeFunction_Implementation()
{
 return FString(TEXT("My Native Function C++ Implementation first."));
}

// Called when the game starts or when spawned
void AMyInterfaceActor::BeginPlay()
{
 Super::BeginPlay();
}

// Called every frame
void AMyInterfaceActor::Tick(float DeltaTime)
{
 Super::Tick(DeltaTime);
}

## Add an Interface to an Existing Blueprint

To add an interface to an existing Blueprint class, follow these steps:

- Open your existing Blueprint class. [image: Blueprint Actor] Existing Blueprint class.

- In the Blueprint Toolbar, select **Class Settings**. [image: Select Class Settings] Open Blueprint class settings.

- Navigate to the **Class Settings Details Panel**. Under **Interfaces > Implemented Interfaces** select your interface from the dropdown that says **Add**. [image: Add implemented interface] Add an interface you want this Blueprint to implement.

- Search for the interface you want your class to implement. This example uses a C++ interface named `MyInterface` defined in `MyInterface.h`.

- Once you have found the interface, choose the interface, then **Compile** and **Save** your Blueprint.

Your Blueprint should now be configured to implement your interface. The **My Blueprint** tab should now display a category for the interface you selected and all the functions the interface provides for you to implement.

The Inherited Interfaces section in the Interfaces category of the Class Settings automatically populates with any Interfaces that are inherited by this class through its parent Blueprint or C++ class. Below, a Blueprint actor inherits from the `MyInterfaceActor` C++ class thereby inheriting `MyInterface`.

 [image: Show inheritied interfaces]

List the inherited interfaces for this Blueprint.

## Remove an Interface

To remove an interface from a Blueprint class, click the X button located next to the interface you want to remove in the Implemented Interfaces list in the Class Settings.

 [image: Remove an interface from a Blueprint]

Remove an inherited interface from this Blueprint.

## Implement Interface Functions

To implement an interface function in your Blueprint that inherits from an interface, do one of the following:

- Double-click on the function in **My Blueprint > Interfaces** to open the function’s Blueprint graph.

- Right-click on the function in **My Blueprint > Interfaces** and select **Open Graph**.

 [image: Open function Blueprint graph]

Open the function's Blueprint graph.

Here you can implement the interface function for your class. See the Blueprint Functions (-> functions-in-unreal-engine) documentation for more information about implementing functions in Blueprint.

 [image: Implementation of interface function]

Default implementation of an interface function in Blueprint.

## Override Interface Functions

Blueprint implementations of interface functions override implementations in parent classes by default. To first call the parent class’ implementation inside your Blueprint, see Step 4 in the Blueprint Native Events (-> implementing-blueprint-interfaces-in-unreal-engine) section.

## Blueprint Native Events

`BlueprintNativeEvent` functions differ from `BlueprintImplementableEvent` functions. `BlueprintImplementableEvent` functions can only be implemented within Blueprint. `BlueprintNativeEvent` functions can be implemented in Blueprint, C++, or both. To implement a `BlueprintNativeEvent`, follow the steps for the context that best suits your needs:

- To implement a `BlueprintNativeEvent` purely in Blueprint, follow the guidance in the Implement Interface Functions (-> implementing-blueprint-interfaces-in-unreal-engine) section.

- To implement a `BlueprintNativeEvent` in C++, see the Unreal Interfaces documentation.

- To override a `BlueprintNativeEvent` in Blueprint and have the Blueprint call the C++ implementation contained in its parent class, see the Override Blueprint Native Event in Blueprint (-> implementing-blueprint-interfaces-in-unreal-engine) section.

### Override Blueprint Native Event in Blueprint

To override a Blueprint native event in Blueprint that is defined in C++, follow these steps:

- Open your Blueprint that inherits from a C++ class implementing an interface. In this case, the C++ class implementation looks like this: ```
      FString AMyInterfaceActor::MyNativeFunction_Implementation()
      {
          return FString(TEXT("My Native Function C++ Implementation first."));
      }
``` FString AMyInterfaceActor::MyNativeFunction_Implementation() { return FString(TEXT("My Native Function C++ Implementation first.")); }

- Open your `BlueprintNativeEvent` function in the **My Blueprint** panel. [image: Blueprint native function] Open function implementation.

- If you have not already implemented this function in Blueprint, you should see a main function node. [image: Main Blueprint function node] Blueprint function definition.

- Right-click on this node and choose **Add Call to Parent Function**. [image: Add call to parent function] Add call to parent function in Blueprint.

- Add your Blueprint functionality after the **Parent** node. [image: Add Blueprint functionality after parent node] Add additional functionality after call to parent.

## Call Interface Functions

Interface functions are called in different ways depending on the context. When you want to call **My Implementable Function** in Blueprint, you have multiple options:

- My Implementable Function (Object)

- My Implementable Function (Interface)

- My Implementable Function (Message)

 [image: Different Blueprint interface function node types]

Blueprint nodes corresponding to the different types of Blueprint interface function calls.

| **Blueprint Function Type** | **Description** |
| --- | --- |
| Object | Call on an object of the specified class that implements the interface. |
| Interface | Call on an object that implements this interface. |
| Message | Call on any object. If the object does not implement the correct interface, the function fails silently. This method is also slower than the object and interface methods. |

- interface
- blueprint
- blueprintnativeevent
- blueprintimplementableevent

On this page

- Create an Interface (-> implementing-blueprint-interfaces-in-unreal-engine)
- Content Used on this Page (-> implementing-blueprint-interfaces-in-unreal-engine)
- Add an Interface to an Existing Blueprint (-> implementing-blueprint-interfaces-in-unreal-engine)
- Remove an Interface (-> implementing-blueprint-interfaces-in-unreal-engine)
- Implement Interface Functions (-> implementing-blueprint-interfaces-in-unreal-engine)
- Override Interface Functions (-> implementing-blueprint-interfaces-in-unreal-engine)
- Blueprint Native Events (-> implementing-blueprint-interfaces-in-unreal-engine)
- Override Blueprint Native Event in Blueprint (-> implementing-blueprint-interfaces-in-unreal-engine)
- Call Interface Functions (-> implementing-blueprint-interfaces-in-unreal-engine)
