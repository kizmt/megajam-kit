# Create a Respawning Pickup Item

https://dev.epicgames.com/documentation/en-us/unreal-engine/coder-06-create-a-respawning-pickup-item-in-unreal-engine?application_version=5.9

> Learn how to use C++ to create custom pickups and initialize them in your level.

[image: Create a Respawning Pickup Item]

## Before You Begin

Ensure you’ve completed the following objectives in the previous section, Manage Items and Data (-> coder-05-manage-item-and-data-in-an-unreal-engine-game):

- Set up an Item Data Struct, `UDataAsset` class, a Consumable-type Data Asset instance named `DA_Pickup_001`, and a Data Table.

## Create a New Pickup Class

So far, you've learned to define and store an item's structure and data. In this section, you'll learn how to turn this data into an in-game "pickup", a concrete representation of table data that the player can interact with and gain an effect. A pickup could be an equippable gadget, a box that gives them materials, or a powerup that gives them a temporary boost.

To start setting up a pickup class with initial declarations, follow these steps:

- In the Unreal Editor, go to **Tools **> **New C++ Class**. Select **Actor **as the parent class and name the class `PickupBase`. Click **Create Class**.
- In Visual Studio, in `PickupBase.h`, add the following statements to the top of the file:`#include ”Components/SphereComponent.h”`. You’ll add a sphere component to the pickup to detect collisions between player and pickup.
- `#include ”AdventureCharacter.h”`. Add a reference to your first-person character class so you can check for overlaps between the pickup and characters of this class. (This tutorial uses `AdventureCharacter`.)
- A forward declaration for `UItemDefinition`. This is the associated Data Asset item that each pickup references.

 C++

```
// Copyright Epic Games, Inc. All Rights Reserved.

#pragma once

// --- New Code Start ---
#include "Components/SphereComponent.h"
#include "AdventureCharacter.h"
// --- New Code End ---
#include "CoreMinimal.h"
#include "GameFramework/Actor.h"
```

- In the `UCLASS()` macro above the `APickupBase` class definition, add the `BlueprintType` and `Blueprintable` specifiers to expose it as a base class for creating Blueprints. C++ ```
UCLASS(BlueprintType, Blueprintable)
class ADVENTUREGAME_API APickupBase : public AActor
{
``` UCLASS(BlueprintType, Blueprintable) class ADVENTUREGAME_API APickupBase : public AActor {
- Switch to `PickupBase.cpp`.
- In `PickupBase.cpp`, add an `#include` for `ItemDefinition.h` and `ItemData.h`. C++ ```
// Copyright Epic Games, Inc. All Rights Reserved.

#include "PickupBase.h"
#include "ItemDefinition.h"
#include "Data/ItemData.h"
``` // Copyright Epic Games, Inc. All Rights Reserved. #include "PickupBase.h" #include "ItemDefinition.h" #include "Data/ItemData.h"

## Initialize the Pickup with Table Data

Your pickup is just a blank Actor, so when the game begins, you need to give it the data it needs to operate properly. The pickup should pull a row of values from the Data Table and save those values in an ItemDefinition Data Asset (the “reference item”).

### Pull Data from a Data Table

To declare the function and properties you need to pull data from the data table, follow these steps:

- In `PickupBase.h`, in the `public` section, declare a new void function `InitializePickup()`. You’ll use this function to initialize the pickup with values from the Data Table. C++ ```
public:
	// Sets default values for this actor's properties
	APickupBase();

	// --- New Code Start ---
	// Initializes this pickup with values from the data table.
	void InitializePickup();
	// --- New Code End ---
``` public: // Sets default values for this actor's properties APickupBase(); // --- New Code Start --- // Initializes this pickup with values from the data table. void InitializePickup(); // --- New Code End ---
- To pull data from the table, the pickup Blueprint needs two properties: the Data Table asset and the Row Name (which you’ve set up to be the same as the item ID).In the `protected` section, declare an `FName` property named `PickupItemID`. Give it the `EditInstanceOnly` and `Category = “Pickup | Item Table”` specifiers. This is the ID of this pickup in the associated Data Table. C++ ```
protected:
	// Called when the game starts or when spawned
	virtual void BeginPlay() override;

	// --- New Code Start ---
	// The ID of this pickup in the associated data table.
	UPROPERTY(EditInstanceOnly, Category = "Pickup | Item Table")
	FName PickupItemID;
	// --- New Code End ---
``` protected: // Called when the game starts or when spawned virtual void BeginPlay() override; // --- New Code Start --- // The ID of this pickup in the associated data table. UPROPERTY(EditInstanceOnly, Category = "Pickup | Item Table") FName PickupItemID; // --- New Code End ---Pickups shouldn’t have a default item ID, so the `EditInstanceOnly` specifier lets you edit this property in instances of pickups in the world, but not in the archetype (or class default). In the `Category` text, the vertical bar (`|`) creates a nested subsection. So in this example, Unreal Engine creates a **Pickup** section with a subsection named **Item Table** in the asset’s **Details** panel.
- Also in the `protected` section, declare a `TSoftObjectPtr` to a `UDataTable` named `PickupDataTable`. Give it the same specifiers as the `PickupItemID`. This is the Data Table the pickup uses to get its data.The Data Table may not be loaded at runtime, so use a `TSoftObjectPtr` here so you can load it asynchronously. C++ ```
protected:
	// Called when the game starts or when spawned
	virtual void BeginPlay() override;

	// The ID of this pickup in the associated data table.
	UPROPERTY(EditInstanceOnly, Category = "Pickup | Item Table")
	FName PickupItemID;

	// --- New Code Start ---
	// Data table that contains this pickup.
```
- Save the header file and switch to `PickupBase.cpp` to implement `InitializePickup()`.

To initialize a pickup, you first need to retrieve a row of item data from the Data Table using the Pickup Item ID. This lookup should only happen if the ID is set and a valid Data Table asset is assigned. `PickupDataTable` is a soft reference and may not be loaded yet, so to validate the data table, you'll first convert that soft reference to an `FSoftObjectPath`

An `FSoftObjectPath` stores an asset’s path without loading it, making it useful for validating soft references before using them.

 To implement the `InitializePickup()` function, follow these steps:

- In `PickupBase.cpp`, add the function definition for `InitializePickup()`.
- Convert `PickupDataTable` to a `const FSoftObjectPath` named `TablePath` to verify that it points to a real asset before attempting to load and use it. C++ ```
// Initializes the pickup with values retrieved from the associated data table.
void APickupBase::InitializePickup()
{
	// Only initialize if the pickup has valid inputs
	const FSoftObjectPath TablePath = PickupDataTable.ToSoftObjectPath();

}
``` // Initializes the pickup with values retrieved from the associated data table. void APickupBase::InitializePickup() { // Only initialize if the pickup has valid inputs const FSoftObjectPath TablePath = PickupDataTable.ToSoftObjectPath(); }
- Inside the function, in an `if` statement, check if the `TablePath` is valid and that `PickupItemID` has a value. C++ ```
// Initializes the pickup with values retrieved from the associated data table.
void APickupBase::InitializePickup()
{
	// Only initialize if the pickup has valid inputs
	const FSoftObjectPath TablePath = PickupDataTable.ToSoftObjectPath();
	// --- New Code Start ---
	if (!TablePath.IsNull() && !PickupItemID.IsNone())
	{
	}
	// --- New Code End ---
```
- In the `if` statement, declare a new pointer variable to a `UDataTable` named `LoadedDataTable` and use a ternary operator to test `PickupDataTable.IsValid()`, assigning `PickupDataTable.Get()` if it’s already loaded or `PickupDataTable.LoadSynchronous()` if it isn’t. C++ ```
// Initializes the pickup with values retrieved from the associated data table.
void APickupBase::InitializePickup()
{
	// Only initialize if the pickup has valid inputs
	const FSoftObjectPath TablePath = PickupDataTable.ToSoftObjectPath();
	if (!TablePath.IsNull() && !PickupItemID.IsNone())
	{
		// --- New Code Start ---
		/* Resolve the table soft reference into a usable data table.
		   Use the loaded table if available; otherwise load it now. */
``` Call `LoadSynchronous()` on an object to load and return an asset pointer to that object.
- Use an `if` statement with a `return;` inside to exit the function if `LoadedDataTable` is null. C++ ```
// Initializes the pickup with values retrieved from the associated data table.
void APickupBase::InitializePickup()
{
	// Only initialize if the pickup has valid inputs
	const FSoftObjectPath TablePath = PickupDataTable.ToSoftObjectPath();
	if (!TablePath.IsNull() && !PickupItemID.IsNone())
	{
		/* Resolve the table soft reference into a usable data table.
		   Use the loaded table if available; otherwise load it now. */
		UDataTable* LoadedDataTable = PickupDataTable.IsValid()
``` When working with data-driven systems, never assume that assets or references are immediately usable. We recommend checking a reference is assigned, resolve or load it, and then access its data. This strategy prevents silent failures and makes your code more robust to editor state, loading order, and asset changes.Through this tutorial, you'll repeat this pattern of "check, resolve, use" any time you're accessing external data.
- Retrieve the row of values from the Data Table. Declare a const `FItemData` pointer named `ItemDataRow` and set it to the result of calling `FindRow()` on your `LoadedDataTable`. Specify `FItemData` as the type of row to find. C++ ```
		// Continue only if the DataTable was successfully loaded
		if (!LoadedDataTable)
		{
			return;
		}

		// --- New Code Start ---
		// Use the pickup ID to look up and save the corresponding table row
		const FItemData* ItemDataRow = LoadedDataTable->FindRow<FItemData>();
		// --- New Code End ---
``` // Continue only if the DataTable was successfully loaded if (!LoadedDataTable) { return; } // --- New Code Start --- // Use the pickup ID to look up and save the corresponding table row const FItemData* ItemDataRow = LoadedDataTable->FindRow(); // --- New Code End ---
- Add the following two arguments to the `FindRow()` call:An `FName` row name you want to find. Pass the `PickupItemID` as the row name.
- An `FString`-type context string that you can use for debugging if the row isn’t found. You can use `Text(“My context here.”)` to add a context string, or use `ToString()` to convert the item ID into a context string.

 C++

```
		// Use the pickup ID to look up and save the corresponding table row
		const FItemData* ItemDataRow = LoadedDataTable->FindRow<FItemData>(PickupItemID, PickupItemID.ToString());
```

 // Use the pickup ID to look up and save the corresponding table row
 const FItemData* ItemDataRow = LoadedDataTable->FindRow<FItemData>(PickupItemID, PickupItemID.ToString());

- Use an `if` statement with a `return;` inside to exit the function if `ItemDataRow` is null. C++ ```
// Initializes the pickup with values retrieved from the associated data table.
void APickupBase::InitializePickup()
{
	// Only initialize if the pickup has valid inputs
	const FSoftObjectPath TablePath = PickupDataTable.ToSoftObjectPath();
	if (!TablePath.IsNull() && !PickupItemID.IsNone())
	{
		/* Resolve the table soft reference into a usable data table.
		   Use the loaded table if available; otherwise load it now. */
		UDataTable* LoadedDataTable = PickupDataTable.IsValid()
```
- Check that the Data Asset referenced in the table row is valid so you can retrieve the item's mesh from the Data Asset later in this section of the tutorial. Declare a pointer to a `UItemDefinition` Data Asset named `TempItemDefinition` and use the same ternary operator syntax you used earlier. C++ ```
// Initializes the pickup with values retrieved from the associated data table.
void APickupBase::InitializePickup()
{
	// Only initialize if the pickup has valid inputs
	const FSoftObjectPath TablePath = PickupDataTable.ToSoftObjectPath();
	if (!TablePath.IsNull() && !PickupItemID.IsNone())
	{
		/* Resolve the table soft reference into a usable data table.
		   Use the loaded table if available; otherwise load it now. */
		UDataTable* LoadedDataTable = PickupDataTable.IsValid()
```
- Add an `if` statement to check that you have a loaded Data Asset before continuing. C++ ```
		/* Resolve the Data Asset referenced by this table row.
		Use the Data Asset if available; otherwise load it now.    */
		UItemDefinition* TempItemDefinition = ItemDataRow->ItemBase.IsValid()
			? ItemDataRow->ItemBase.Get()
			: ItemDataRow->ItemBase.LoadSynchronous();

		// --- New Code Start ---
		// Continue only if the Data Asset was successfully loaded
		if (!TempItemDefinition)
		{
```

### Create a Reference Item

Once you’ve retrieved the pickup’s row data, create and initialize a Data Asset-type `ReferenceItem` to hold that information.

By saving the data in a reference item like this, Unreal Engine can easily reference that data when it needs to know about the item instead of performing more table data lookups, which is less efficient.

To save a row of table data in a reference item, follow these steps:

- In `PickupBase.h`, in the `protected` section, declare a `TObjectPtr` to a `UItemDefinition` named `ReferenceItem`. This is a Data Asset that stores the pickup’s data. Give it the `VisibleAnywhere` and `Category = “Pickup | Reference Item”` specifiers. C++ ```
// Data asset associated with this item.
UPROPERTY(VisibleAnywhere, Category = "Pickup | Reference Item")
TObjectPtr<UItemDefinition> ReferenceItem;
``` // Data asset associated with this item. UPROPERTY(VisibleAnywhere, Category = "Pickup | Reference Item") TObjectPtr ReferenceItem;
- Save the header file and switch back to `PickupBase.cpp`.
- In `InitializePickup()`, after the `if (!TempItemDefinition)` statement, set `ReferenceItem` to a `NewObject` of type `UItemDefinition`. In Unreal Engine, `NewObject()` is a templated function for dynamically creating `UObject`-derived instances at runtime. It returns a pointer to the new object. It usually has the following syntax:`T* Object = NewObject(Outer, Class);`Where T is the type of `UObject` you're creating, `Outer` is who owns this object, and `Class` is the class of the object you're creating. The `Class` argument is often `T::StaticClass()`, which gives a `UClass` pointer representing T's class type. However, you can often omit both arguments as UE assumes `Outer` is the current class and uses T to infer the `UClass`.Pass `this` as the outer class and the `UItemDefinition::StaticClass()` as the class type to create a base `UItemDefinition`. C++ ```
// Initializes the pickup with values retrieved from the associated data table.
void APickupBase::InitializePickup()
{
	// Only initialize if the pickup has valid inputs
	const FSoftObjectPath TablePath = PickupDataTable.ToSoftObjectPath();
	if (!TablePath.IsNull() && !PickupItemID.IsNone())
	{
		/* Resolve the table soft reference into a usable data table.
		   Use the loaded table if available; otherwise load it now. */
		UDataTable* LoadedDataTable = PickupDataTable.IsValid()
```
- To copy the pickup’s information into `ReferenceItem`, set each field in `ReferenceItem` to the associated field from `ItemDataRow`. For the `WorldMesh`, pull the `WorldMesh` property from `TempItemDefinition`. C++ ```
		// Build a runtime ItemDefinition object from the data table row
		ReferenceItem = NewObject<UItemDefinition>(this);
		// --- New Code Start ---
		ReferenceItem->ID = ItemDataRow->ID;
		ReferenceItem->ItemType = ItemDataRow->ItemType;
		ReferenceItem->ItemText = ItemDataRow->ItemText;
		ReferenceItem->WorldMesh = TempItemDefinition->WorldMesh;
		// --- New Code End ---
``` // Build a runtime ItemDefinition object from the data table row ReferenceItem = NewObject(this); // --- New Code Start --- ReferenceItem->ID = ItemDataRow->ID; ReferenceItem->ItemType = ItemDataRow->ItemType; ReferenceItem->ItemText = ItemDataRow->ItemText; ReferenceItem->WorldMesh = TempItemDefinition->WorldMesh; // --- New Code End ---

### Call InitializePickup()

In `BeginPlay()`, call `InitializePickup()` to initialize the pickup when the game begins.

 C++

```
// Called when the game starts or when spawned
void APickupBase::BeginPlay()
{
	Super::BeginPlay();

	// Initialize this pickup with default values
	InitializePickup();
}
```

// Called when the game starts or when spawned
void APickupBase::BeginPlay()
{
 Super::BeginPlay();

 // Initialize this pickup with default values
 InitializePickup();
}

Save and build your code.

`PickupBase.cpp` should now look like this:

 C++

```
// Copyright Epic Games, Inc. All Rights Reserved.

#include "PickupBase.h"
#include "ItemDefinition.h"
#include "Data/ItemData.h"

// Sets default values
APickupBase::APickupBase()
{
```

## Create In-Game Functionality

Your pickup has the item data it needs, but it still needs to know how to appear and operate in the game world. It needs a mesh for the player to see, a collision volume to determine when the player touches it, and some logic to make the pickup disappear (as if the player picked it up) and respawn after a certain amount of time.

### Add a Mesh Component

Just like you did when setting up the player character in Add a First-Person Camera, Mesh, and Animation (-> coder-04-adding-a-firstperson-camera-mesh-and-animation), you’ll use the `CreateDefaultSubobject` template function to create a static mesh object as a child component of your pickup class and then apply the item’s mesh to this component.

To give the base pickup class a static mesh component, follow these steps:

- In `PickupBase.h`, in the `protected` section, declare a `TObjectPtr` to a `UStaticMeshComponent` named `PickupMeshComponent`. This is the mesh that will represent the pickup in the world. You’ll use code to assign the Data Asset’s mesh to this property, so give it the `VisibleDefaultsOnly` and `Category = “Pickup | Mesh”` specifiers so it’s visible, but not editable, in Unreal Editor. C++ ```
// The mesh component to represent this pickup in the world.
UPROPERTY(VisibleDefaultsOnly, Category = "Pickup | Mesh")
TObjectPtr<UStaticMeshComponent> PickupMeshComponent;
``` // The mesh component to represent this pickup in the world. UPROPERTY(VisibleDefaultsOnly, Category = "Pickup | Mesh") TObjectPtr PickupMeshComponent;
- Save the header file and return to to `PickupBase.cpp`.
- In the `APickupBase` construction function, set the `PickupMeshComponent` pointer to the result of calling `CreateDefaultSubobject()` of type `UStaticMeshComponent`. In the `Text` argument, name the object `“PickupMesh”`. C++ ```
// Sets default values
APickupBase::APickupBase()
{
 	// Set this actor to call Tick() every frame.  You can turn this off to improve performance if you don't need it.
	PrimaryActorTick.bCanEverTick = true;

	// --- New Code Start ---
	// Create this pickup's mesh component
	PickupMeshComponent = CreateDefaultSubobject<UStaticMeshComponent>(TEXT("PickupMesh"));
	// --- New Code End ---
```
- On the next line, to ensure the mesh was properly instantiated, check that `PickupMeshComponent` isn’t null. C++ ```
check(PickupMeshComponent != nullptr);
``` check(PickupMeshComponent != nullptr);
- After creating the mesh component, call `SetRootComponent()` to ensure the mesh is the root component. C++ ```
// Sets default values
APickupBase::APickupBase()
{

	// Set this actor to call Tick() every frame.  You can turn this off to improve performance if you don't need it.
	PrimaryActorTick.bCanEverTick = true;

	// Create this pickup's mesh component
	PickupMeshComponent = CreateDefaultSubobject<UStaticMeshComponent>(TEXT("PickupMesh"));
	check(PickupMeshComponent != nullptr);
``` If you don’t set a root component in C++, Unreal Engine may choose a different one during recompiles or editor restarts, which can break component attachment, transforms, and collision behavior.

Next, apply the item's mesh to the mesh component. You defined `WorldMesh` with a `TSoftObjectPtr`, so in `InitializePickup()`’s implementation, first check that the mesh is loaded before applying it.

To check the mesh is loaded and then apply it, follow these steps:

- In `InitializePickup()`, after the `ReferenceItem` setup but inside the larger `if` statement, declare a `UStaticMesh` pointer named `LoadedMesh` and use the same ternary operator syntax to resolve `TempItemDefinition`'s `WorldMesh` soft pointer and ensure the mesh is ready to use. C++ ```
// Initializes the pickup with values retrieved from the associated data table.
void APickupBase::InitializePickup()
{
	// Only initialize if the pickup has valid inputs
	const FSoftObjectPath TablePath = PickupDataTable.ToSoftObjectPath();
	if (!TablePath.IsNull() && !PickupItemID.IsNone())
	{
		/* Resolve the table soft reference into a usable data table.
		   Use the loaded table if available; otherwise load it now. */
		UDataTable* LoadedDataTable = PickupDataTable.IsValid()
```
- In a new `if` statement, check if `LoadedMesh` is not null. C++ ```
		// Build a runtime ItemDefinition object from the data table row
		ReferenceItem = NewObject<UItemDefinition>(this);
		ReferenceItem->ID = ItemDataRow->ID;
		ReferenceItem->ItemType = ItemDataRow->ItemType;
		ReferenceItem->ItemText = ItemDataRow->ItemText;
		ReferenceItem->WorldMesh = TempItemDefinition->WorldMesh;

		// Resolve the item's world mesh from the item definition.
		// This uses the mesh if it’s already in memory, or loads it if it isn’t.
		UStaticMesh* LoadedMesh = TempItemDefinition->WorldMesh.IsValid()
```
- In the new `if` statement, set the `PickupMeshComponent` by calling `SetStaticMesh()`, passing `LoadedMesh`: C++ ```
		// Check the mesh is set and can load before using it
		if (LoadedMesh)
		{
			// --- New Code Start ---
			// Set the pickup's mesh
			PickupMeshComponent->SetStaticMesh(LoadedMesh);
			// --- New Code End ---
			//
		}
``` // Check the mesh is set and can load before using it if (LoadedMesh) { // --- New Code Start --- // Set the pickup's mesh PickupMeshComponent->SetStaticMesh(LoadedMesh); // --- New Code End --- // }
- Save and build your code.

`PickupBase.cpp` should look like this:

 C++

```
// Copyright Epic Games, Inc. All Rights Reserved.

#include "PickupBase.h"
#include "ItemDefinition.h"
#include "Data/ItemData.h"

// Sets default values
APickupBase::APickupBase()
{
	// Set this actor to call Tick() every frame.  You can turn this off to improve performance if you don't need it.
```

### Add a Collision Shape

Add a sphere component to act as a collision volume, then enable collision queries on that component.

To set up collision on the pickup, follow these steps:

- In `PickupBase.h`, in the `protected` section, declare a `TObjectPtr` to a `USphereComponent` named `SphereComponent`. This is the sphere component used for collision detection. Give it the `EditAnywhere`, `BlueprintReadOnly`, and `Category = “Pickup | Components”` specifiers. C++ ```
// Sphere Component that defines the collision radius of this pickup for interaction purposes.
UPROPERTY(EditAnywhere, BlueprintReadOnly, Category = "Pickup | Components")
TObjectPtr<USphereComponent> SphereComponent;
``` // Sphere Component that defines the collision radius of this pickup for interaction purposes. UPROPERTY(EditAnywhere, BlueprintReadOnly, Category = "Pickup | Components") TObjectPtr SphereComponent;
- Save the header file and return to `PickupBase.cpp`.
- In the `APickupBase` construction function, after you set the `PickupMeshComponent`, set `SphereComponent` to the result of calling `CreateDefaultSubobject` with `USphereComponent` as the type and `“SphereComponent”` as the name. Add a null `check` afterwards. C++ ```
// Sets default values
APickupBase::APickupBase()
{
 	// Set this actor to call Tick() every frame.  You can turn this off to improve performance if you don't need it.
	PrimaryActorTick.bCanEverTick = true;

	// Create this pickup's mesh component
	PickupMeshComponent = CreateDefaultSubobject<UStaticMeshComponent>(TEXT("PickupMesh"));
	check(PickupMeshComponent != nullptr);
	// Make the mesh the root component
```
- Now that you have both components, use `SetupAttachment()` to attach the `PickupMeshComponent` to the `SphereComponent`: C++ ```
// Sets default values
APickupBase::APickupBase()
{
 	// Set this actor to call Tick() every frame.  You can turn this off to improve performance if you don't need it.
	PrimaryActorTick.bCanEverTick = true;

	// Create this pickup's mesh component
	PickupMeshComponent = CreateDefaultSubobject<UStaticMeshComponent>(TEXT("PickupMesh"));
	check(PickupMeshComponent != nullptr);
	// Make the mesh the root component
```
- After attaching the `SphereComponent`, set the sphere’s size using `SetSphereRadius()`. This value should be large enough for the player to intentionally interact with the pickup, but not so large that the player collects the pickup accidentally when passing nearby. C++ ```
// Sets default values
APickupBase::APickupBase()
{
 	// Set this actor to call Tick() every frame.  You can turn this off to improve performance if you don't need it.
	PrimaryActorTick.bCanEverTick = true;

	// Create this pickup's mesh component
	PickupMeshComponent = CreateDefaultSubobject<UStaticMeshComponent>(TEXT("PickupMesh"));
	check(PickupMeshComponent != nullptr);
	// Make the mesh the root component
```
- After setting the radius, make the sphere generate overlap events by calling `SetGenerateOverlapEvents(true)`. C++ ```
	// Configure the sphere to actually generate overlap events
	SphereComponent->SetGenerateOverlapEvents(true);
``` // Configure the sphere to actually generate overlap events SphereComponent->SetGenerateOverlapEvents(true);
- Make the `SphereComponent` collidable by calling `SetCollisionEnabled()`. This function takes an enum (`ECollisionEnabled`) that tells the engine what type of collision to use. You want the character to be able to collide and trigger collision queries with the pickup, but the pickup shouldn’t have any physics that makes it bounce away when hit, so pass the `ECollisionEnabled::QueryOnly` option. C++ ```
	// Enable collision
	SphereComponent->SetCollisionEnabled(ECollisionEnabled::QueryOnly);
``` // Enable collision SphereComponent->SetCollisionEnabled(ECollisionEnabled::QueryOnly);
- You've turned collision on for the sphere, and you also need to define what types of collisions can occur. Collision channels define what types of objects can interact with each other and collision responses define how those interactions are handled. Before setting up the sphere's collision responses, call `SetCollisionResponseToAllChannels()` to set the response to every collision channel to `ECR_Ignore` to ensure no engine defaults or presents affect your collision rules. C++ ```
	// Set the sphere's response to every collision channel to Ignore, removing any engine defaults
	SphereComponent->SetCollisionResponseToAllChannels(ECR_Ignore);
``` // Set the sphere's response to every collision channel to Ignore, removing any engine defaults SphereComponent->SetCollisionResponseToAllChannels(ECR_Ignore);The `ECC` prefix is used by the `ECollisionChannels` enum and the `ECR` prefix is used by the `ECollisionResponses` enum. In Unreal Editor, these channels and responses are displayed without prefixes.
- Now you can set the collision channel responses. The pickup needs query-only collision and overlap responses, but only with the Pawn channel.A collision query is a non-physical check such as an overlap or trace, so the pickup can respond to an overlap with the player while letting the character move through it naturally. C++ ```
	// Set the sphere's response to every collision channel to Ignore, removing any engine defaults
	SphereComponent->SetCollisionResponseToAllChannels(ECR_Ignore);
	// --- New Code Start ---
	// Overrides the previous collision rule for the Pawn channel, so encountering anything on that channel generates an overlap
	SphereComponent->SetCollisionResponseToChannel(ECC_Pawn, ECR_Overlap);
	// --- New Code End ---
``` // Set the sphere's response to every collision channel to Ignore, removing any engine defaults SphereComponent->SetCollisionResponseToAllChannels(ECR_Ignore); // --- New Code Start --- // Overrides the previous collision rule for the Pawn channel, so encountering anything on that channel generates an overlap SphereComponent->SetCollisionResponseToChannel(ECC_Pawn, ECR_Overlap); // --- New Code End ---

For more information about Unreal Engine's collision system, see Collision Response Reference (-> collision-response-reference-in-unreal-engine).

 ` PickupBase.cpp` should now look like this:

 C++

```
// Copyright Epic Games, Inc. All Rights Reserved.

#include "PickupBase.h"
#include "ItemDefinition.h"
#include "Data/ItemData.h"

// Sets default values
APickupBase::APickupBase()
{
	// Set this actor to call Tick() every frame.  You can turn this off to improve performance if you don't need it.
```

### Simulate Pickup Collisions

Now that your pickup has a collision shape, add logic to detect a collision between the pickup and player and make the pickup disappear when collided with.

#### Declare the Overlap Handler

In `PickupBase.h`, in the `protected` section, declare a `void` function named `OnSphereBeginOverlap()`.

Any component that inherits from `UPrimitiveComponent`, like `USphereComponent`, can implement this function to run code when the component overlaps with some other Actor. This function takes several parameters you won’t be using; you’ll only pass the following:

- `UPrimitiveComponent* OverlappedComponent`: The component that was overlapped.
- `AActor* OtherActor`: The Actor overlapping that component.
- `UPrimitiveComponent* OtherComp`: The Actor’s component that overlapped.
- `int32 OtherBodyIndex`: The index of the overlapped component.
- `bool bFromSweep, const FHitResult& SweepResult`: Information about the collision, such as where it happened and at what angle.

 C++

```
// Code for when something overlaps the SphereComponent.
UFUNCTION()
void OnSphereBeginOverlap(UPrimitiveComponent* OverlappedComponent, AActor* OtherActor, UPrimitiveComponent* OtherComp, int32 OtherBodyIndex, bool bFromSweep, const FHitResult& SweepResult);
```

// Code for when something overlaps the SphereComponent.
UFUNCTION()
void OnSphereBeginOverlap(UPrimitiveComponent* OverlappedComponent, AActor* OtherActor, UPrimitiveComponent* OtherComp, int32 OtherBodyIndex, bool bFromSweep, const FHitResult& SweepResult);

Save the header file and switch to `PickupBase.cpp`.

#### Bind the Function to the Collision Event

Unreal Engine’s collision events are implemented using dynamic multicast delegates. In UE, this delegate system enables one object to call multiple functions at once, sort of like broadcasting a message to a mailing list where your subscribers are these other functions. When we bind functions to the delegate, it’s like we’re subscribing them to our mailing list. The “delegate” is our event; in this case, a collision between the player and the pickup. When the event happens, Unreal Engine calls all functions bound to that event.

Unreal Engine includes a couple of other binding functions, but you’ll want to use `AddDynamic()` because your delegate, `OnComponentBeginOverlap`, is a dynamic delegate. And, you’re binding a `UFUNCTION` in a `UObject`class, requiring `AddDynamic()` for reflection support. For more information about dynamic multicast delegates, see Multicast DelegatesMulti-cast Delegates (-> multicast-delegates-in-unreal-engine).

In `PickupBase.cpp`, in `BeginPlay()`, before calling `InitializePickup();`, call the `AddDynamic` helper function to bind `OnSphereBeginOverlap()` to the sphere component’s `OnComponentBeginOverlap` event.

 C++

```
// Called when the game starts or when spawned
void APickupBase::BeginPlay()
{
	Super::BeginPlay();

	// --- New Code Start ---
	// Register the overlap event so it runs when an overlap happens
	SphereComponent->OnComponentBeginOverlap.AddDynamic(
		this,
		&APickupBase::OnSphereBeginOverlap
```

To ensure Unreal Engine only ever creates a single event binding, before the line of code that binds the overlap event, call `RemoveAll(this)` on the delegate before the event binding.

`RemoveAll()` clears any existing delegate bindings associated with the passed actor.

 C++

```
// Called when the game starts or when spawned
void APickupBase::BeginPlay()
{
	Super::BeginPlay();

	// --- New Code Start ---
	// Ensure we don’t bind the overlap event more than once
	SphereComponent->OnComponentBeginOverlap.RemoveAll(this);
	// --- New Code End ---
	// Register the overlap event so it runs when an overlap happens
```

Bindings like this are usually done in `BeginPlay()` as a part of runtime behavior, and you can call `RemoveAll(this)` to guarantee the event is bound only once, even across editor during reloads and recompiles.

You could bind the the overlap event in `InitiaizePickup()`, but we recommend performing this step outside of the function so the binding is successful even if loading and using the item data fails.

Save your code.

Now, `OnSphereBeginOverlap()` will run when a character collides with the pickup’s sphere component.

#### Hide the Pickup After a Collision

Next, you'll implement the `OnSphereBeginOverlap()` function so the player can pick up the item.

To make your pickup disappear so it looks like the player picked it up, follow these steps:

- In `PickupBase.cpp`, add the function signature for `OnSphereBeginOverlap()`. C++ ```
/**
*	Broadcasts an event when a character overlaps this pickup's SphereComponent. Sets the pickup to invisible and uninteractable, and respawns it after a set time.
*	@param OverlappedComponent - the component that was overlapped.
*	@param OtherActor - the Actor overlapping this component.
*	@param OtherComp - the Actor's component that overlapped this component.
*	@param OtherBodyIndex - the index of the overlapped component.
*	@param bFromSweep - whether the overlap was generated from a sweep.
*	@param SweepResult - contains info about the overlap such as surface normals and faces.
*/
void APickupBase::OnSphereBeginOverlap(UPrimitiveComponent* OverlappedComponent, AActor* OtherActor, UPrimitiveComponent* OtherComp, int32 OtherBodyIndex, bool bFromSweep, const FHitResult& SweepResult)
```
- Inside the function, add a debug message to signal the function is triggered properly. C++ ```
// Sets the pickup to invisible and uninteractable, and respawns it after a set time.
void APickupBase::OnSphereBeginOverlap(UPrimitiveComponent* OverlappedComponent, AActor* OtherActor, UPrimitiveComponent* OtherComp, int32 OtherBodyIndex, bool bFromSweep, const FHitResult& SweepResult)
{
	GEngine->AddOnScreenDebugMessage(-1, 5.0f, FColor::Yellow, TEXT("Attempting a pickup collision"));
}
``` // Sets the pickup to invisible and uninteractable, and respawns it after a set time. void APickupBase::OnSphereBeginOverlap(UPrimitiveComponent* OverlappedComponent, AActor* OtherActor, UPrimitiveComponent* OtherComp, int32 OtherBodyIndex, bool bFromSweep, const FHitResult& SweepResult) { GEngine->AddOnScreenDebugMessage(-1, 5.0f, FColor::Yellow, TEXT("Attempting a pickup collision")); }
- This function runs whenever another actor collides with the pickup, so you need to make sure it’s your first-person character doing the colliding. Declare a new `AAdventureCharacter` pointer named `Character` and set it by casting `OtherActor` to your Character class’ name (this tutorial uses `AAdventureCharacter`). C++ ```
// Sets the pickup to invisible and uninteractable, and respawns it after a set time.
void APickupBase::OnSphereBeginOverlap(UPrimitiveComponent* OverlappedComponent, AActor* OtherActor, UPrimitiveComponent* OtherComp, int32 OtherBodyIndex, bool bFromSweep, const FHitResult& SweepResult)
{
	GEngine->AddOnScreenDebugMessage(-1, 5.0f, FColor::Yellow, TEXT("Attempting a pickup collision"));

	// --- New Code Start ---
	// Checking if it's an AdventureCharacter overlapping
	AAdventureCharacter* Character = Cast<AAdventureCharacter>(OtherActor);
	// --- New Code End ---
```
- In an `if` statement, check if `Character` is not null. Null indicates that the cast failed and that `OtherActor` was not some type of `AAdventureCharacter`.
- In the `if` statement, hide the mesh and end the collision by: Setting the `PickupMeshComponent` to invisible using `SetVisibility(false)`
- Setting both the mesh and sphere component to non-collidable using `SetCollisionEnabled()`, passing the `NoCollision` option.

 C++

```
// Sets the pickup to invisible and uninteractable, and respawns it after a set time.
void APickupBase::OnSphereBeginOverlap(UPrimitiveComponent* OverlappedComponent, AActor* OtherActor, UPrimitiveComponent* OtherComp, int32 OtherBodyIndex, bool bFromSweep, const FHitResult& SweepResult)
{
	GEngine->AddOnScreenDebugMessage(-1, 5.0f, FColor::Yellow, TEXT("Attempting a pickup collision"));

	// Checking if it's an AdventureCharacter overlapping
	AAdventureCharacter* Character = Cast<AAdventureCharacter>(OtherActor);
	if (Character != nullptr)
	{
		// --- New Code Start ---
```

- Save your code.

### Make the Pickup Respawn

Now that the character can’t interact with the pickup, make it respawn after a certain amount of time.

To implement a respawn timer for pickups, follow these steps:

- In `PickupBase.h`, in the `protected` section, declare two variables: A bool named `bShouldRespawn`. You can use this to turn respawns on or off.
- Declare a float named `RespawnTime` initialized to `4.0f`. This is the time to wait until the pickup should respawn.

Give both properties `EditAnywhere`, `BlueprintReadOnly`, and `Category = “Pickup | Respawn”` specifiers.

 C++

```
// Whether this pickup should respawn after being picked up.
UPROPERTY(EditAnywhere, BlueprintReadOnly, Category = "Pickup | Respawn")
bool bShouldRespawn;

// The time in seconds to wait before respawning this pickup.
UPROPERTY(EditAnywhere, BlueprintReadOnly, Category = "Pickup | Respawn")
float RespawnTime = 4.0f;
```

// Whether this pickup should respawn after being picked up.
UPROPERTY(EditAnywhere, BlueprintReadOnly, Category = "Pickup | Respawn")
bool bShouldRespawn;

// The time in seconds to wait before respawning this pickup.
UPROPERTY(EditAnywhere, BlueprintReadOnly, Category = "Pickup | Respawn")
float RespawnTime = 4.0f;

- Also in the `protected` section, declare an `FTimerHandle` named `RespawnTimerHandle`. C++ ```
// Timer handle to distinguish the respawn timer.
FTimerHandle RespawnTimerHandle;
``` // Timer handle to distinguish the respawn timer. FTimerHandle RespawnTimerHandle;In Unreal Engine, gameplay timers are handled by `FTimerManager`. This class includes the `SetTimer()` function, which calls a function or delegate after a set delay. `FTimerManager’s` functions use an `FTimerHandle` to start, pause, resume, or infinitely loop the function. You’ll use `RespawnTimerHandle` to signal when to respawn the pickup. To learn more about using Timer Manager, see Gameplay Timers (-> gameplay-timers-in-unreal-engine).
- Save the header file and return to `PickupBase.cpp`. Here, you'll use the Timer Manager to set a timer that calls `InitializePickup()` after a short wait.
- You only want to respawn the pickup if respawns are enabled; so, at the bottom of `OnSphereBeginOverlap()`, add an `if` statement that checks if `bShouldRespawn` is true. C++ ```
	// Checking if it's an AdventureCharacter overlapping
	AAdventureCharacter* Character = Cast<AAdventureCharacter>(OtherActor);
	if (Character != nullptr)
	{
		// Set this pickup to be invisible and disable collision
		PickupMeshComponent->SetVisibility(false);
		PickupMeshComponent->SetCollisionEnabled(ECollisionEnabled::NoCollision);
		SphereComponent->SetCollisionEnabled(ECollisionEnabled::NoCollision);
	}
```
- In the `if` statement, get the Timer Manager using `GetWorldTimerManager()` and call `SetTimer()` on the timer manager. This function has the following syntax:`SetTimer(InOutHandle, Object, InFuncName, InRate, bLoop, InFirstDelay);`Where:`InOutHandle` is the `FTimerHandle` that’s controlling the timer (your `RespawnTimerHandle`).
- `Object` is the `UObject` that owns the function you’re calling. Use this.
- `InFuncName` is a pointer to the function you want to call (`InitializePickup()` in this case).
- `InRate` is a float value specifying the time in seconds to wait before calling your function.
- `bLoop` makes the timer either repeat every `Time` seconds (`true`) or only fire once (`false`).
- `InFirstDelay` (optional) is an initial time delay before the first function call in a looping timer. If not specified, UE uses `InRate` as the delay.

You only want to call `InitializePickup()` once to replace the pickup, so set `bLoop` to `false`.

Set your preferred respawn time; this tutorial makes the pickup respawn after four seconds (`RespawnTime`).

 C++

```
	// If the pickup should respawn, wait an fRespawnTime amount of seconds before calling InitializePickup() to respawn it
	if (bShouldRespawn)
	{
		// --- New Code Start ---
		GetWorldTimerManager().SetTimer(RespawnTimerHandle, this, &APickupBase::InitializePickup, RespawnTime, false);
		// --- New Code End ---
	}
```

 // If the pickup should respawn, wait an fRespawnTime amount of seconds before calling InitializePickup() to respawn it
 if (bShouldRespawn)
 {
 // --- New Code Start ---
 GetWorldTimerManager().SetTimer(RespawnTimerHandle, this, &APickupBase::InitializePickup, RespawnTime, false);
 // --- New Code End ---
 }

- You've turned off collision and hidden the mesh in the overlap event, so you need to restore the pickup's active state after it respawns.At the end of `InitializePickup()`:Make the `PickupMeshComponent` visible using `SetVisiblity(true)`.
- Repeat the `SphereComponent->SetCollisionEnabled` line of code that is in the class constructor.

 C++

```
		// Check the mesh is set and can load before using it
		if (LoadedMesh)
		{
			// Set the pickup's mesh
			PickupMeshComponent->SetStaticMesh(LoadedMesh);

		}

		// --- New Code Start ---
		// Restore visibility after respawning
```

- Save your code and compile it from Visual Studio.

Your complete `OnSphereBeginOverlap()` function should look like this:

 C++

```
// Copyright Epic Games, Inc. All Rights Reserved.

#include "PickupBase.h"
#include "ItemDefinition.h"
#include "Data/ItemData.h"

// Sets default values
APickupBase::APickupBase()
{
```

## Implement Pickups in Your Level

Now that you’ve defined the code that makes up your pickups, it’s time to test them out in your game!

To add pickups to your level, follow these steps:

- In Unreal Editor, in the **Content Browser** asset tree, go to **Content > FirstPerson > Blueprints**.
- In the **Blueprints **folder, create a new child folder named **Pickups** to store your pickup classes.
- In the asset tree, go to your **C++ Classes **folder. Right-click your **PickupBase **class to create a Blueprint from that class.
- Name it `BP_PickupBase`.
- For the **Path**, select **Content/FirstPerson/Blueprints/Pickups**, and click **Create Pickup Base Class**.
- Go back to your **Blueprints > Pickups** folder. Drag your `BP_PickupBase` Blueprint into the level. An instance of PickupBase appears in your level and is automatically selected in the **Outliner** panel. However, it doesn’t have a mesh yet.
- With the `BP_PickupBase` actor still selected, in the **Details **panel, set the following properties:Set **Pickup Item ID** to `pickup_001`.
- Set **Pickup Data Table** to `DT_PickupData`.
- Set **Should Respawn** to **true**.

This system relies on manual data entry, so make sure the **Pickup Item ID** in your level object exactly matches the **ID** in the Data Table row, or the item will fail to initialize.

When you click **Play** to test your game, your pickup uses the **Pickup Item ID** to query the Data Table and retrieve data associated with `pickup_001`. The pickup uses table data and the reference to your `DA_Pickup_001` Data Asset to initialize a reference Item and load its static mesh.

When you run over the pickup, you should see it disappear, then reappear four seconds later.

### Load a Different Pickup

If you set the **Pickup Item ID** to a different value, your pickup will retrieve data from that row in the table instead.

To experiment with switching the **Pickup Item ID**, follow these steps:

- Create a new Data Asset named **DA_Pickup_002**. Set the following properties in this asset:**ID**: pickup_002
- **Item Type**: Consumable
- **Name**: Test Name 2
- **Description**: Test Description 2
- **World** **Mesh**: `SM_ChamferCube`

[image: 500]

- Add a new row in the `DT_PickupData` table and enter the Data Asset's information into the new row's fields.
- In the `BP_PickupBase` actor, change the **Pickup Item ID** to `pickup_002`.

When you click **Play** to test your game, the pickup should spawn with the values from `DA_Pickup_002` instead!

## Update Pickup Actors in the Editor

Your pickups are working in-game, but it can be difficult to visualize them in the editor since they don’t have a default mesh.

To fix this, use the `PostEditChangeProperty()` function. This is an in-editor function that Unreal Engine calls when the editor changes a property, so you can use it to keep your actors up to date in the Viewport as their properties change. For example, updating a UI element as you change a player’s default health, or scaling a sphere as you bring it closer or further away from the origin.

In this project, you’ll use it to apply the pickup’s new static mesh whenever **Pickup Item ID** changes. This way, you can change your pickup type and see it immediately update in the Viewport without needing to click Play!

To make changes to your pickups immediately in the editor, you'll:

- Declare a new `PostEditChangeProperty` function.
- Use `PropertyChangedEvent` information to get the name of the changed property.
- Apply the new property value to your pickup item.

First, to declare PostEditChangeProperty and retrieve the name of the changed property, follow these steps:

- In `PickupBase.h`, at the end of the `protected` section, declare an `#if WITH_EDITOR` macro. This macro tells Unreal Header Tool that anything inside it should only be packaged for editor builds and not compiled for release versions of the game. End this macro with an `#endif` statement. C++ ```
#if WITH_EDITOR

#endif
``` #if WITH_EDITOR #endif
- Inside the macro, declare a virtual void function override for `PostEditChangeProperty()`. This function takes a reference to the `FPropertyChangedEvent`, which includes info about the property changed, the type of change, and more. Save the header file. C++ ```
#if WITH_EDITOR

// Runs whenever a property on this object is changed in the editor
	virtual void PostEditChangeProperty(FPropertyChangedEvent& PropertyChangedEvent) override;

#endif
``` #if WITH_EDITOR // Runs whenever a property on this object is changed in the editor virtual void PostEditChangeProperty(FPropertyChangedEvent& PropertyChangedEvent) override; #endif
- In `PickupBase.cpp`, implement the `PostEditChangeProperty()` function. Start by calling the `Super::PostEditChangeProperty()` function to handle any parent class property changes. C++ ```
/*	Updates this pickup whenever a property is changed.
*	@param PropertyChangedEvent - contains info about the property that was changed. */
void APickupBase::PostEditChangeProperty(FPropertyChangedEvent& PropertyChangedEvent)
{
	// Handle parent class property changes
	Super::PostEditChangeProperty(PropertyChangedEvent);
}
``` /* Updates this pickup whenever a property is changed. * @param PropertyChangedEvent - contains info about the property that was changed. */ void APickupBase::PostEditChangeProperty(FPropertyChangedEvent& PropertyChangedEvent) { // Handle parent class property changes Super::PostEditChangeProperty(PropertyChangedEvent); }
- Create a new `const FName` variable named `ChangedProperty` to store the changed property’s name. C++ ```
/*	Updates this pickup whenever a property is changed.
*	@param PropertyChangedEvent - contains info about the property that was changed. */
void APickupBase::PostEditChangeProperty(FPropertyChangedEvent& PropertyChangedEvent)
{
	// Handle parent class property changes
	Super::PostEditChangeProperty(PropertyChangedEvent);

	// --- New Code Start ---
	const FName ChangedPropertyName;
	// --- New Code End ---
```
- To verify that the `PropertyChangedEvent` includes a `Property` and save that property, use a ternary operator with `PropertyChangedEvent.Property` as the condition. Set `ChangedPropertyName` to `PropertyChangedEvent.Property->GetFName()` if the condition is true and set it to `NAME_None` if false. C++ ```
	// If a property was changed, get the name of the changed property. Otherwise use none.
	const FName ChangedPropertyName = PropertyChangedEvent.Property
		? PropertyChangedEvent.Property->GetFName()
		: NAME_None;
``` // If a property was changed, get the name of the changed property. Otherwise use none. const FName ChangedPropertyName = PropertyChangedEvent.Property ? PropertyChangedEvent.Property->GetFName() : NAME_None;`NAME_None` is a global Unreal Engine constant of type `FName` that means "no valid name" or “null name”.

Now that you know the name of the property, you can make Unreal Engine update the mesh if it detected the ID changed. You'll need to check and resolve each soft pointer before using the data, so as a short cut, you can just call `InitializePickup()`.

To update the mesh in the editor preview, follow these steps:

- In an `if` statement, check that `ChangedPropertyName` is named `PickupItemID` or `PickupDataTable`.To do this, call `GET_MEMBER_NAME_CHECKED()`, passing this `APickupBase` class and either `PickupItemID`. or `PickupDataTable`. This macro does a compile-time check to ensure the property you pass exists in the passed class. C++ ```
/*	Updates this pickup whenever a property is changed.
*	@param PropertyChangedEvent - contains info about the property that was changed. */
void APickupBase::PostEditChangeProperty(FPropertyChangedEvent& PropertyChangedEvent)
{
	// Handle parent class property changes
	Super::PostEditChangeProperty(PropertyChangedEvent);

	// If a property was changed, get the name of the changed property. Otherwise use none.
	const FName ChangedPropertyName = PropertyChangedEvent.Property
		? PropertyChangedEvent.Property->GetFName()
```
- Inside the `if` statement, you need to check and resolve the item data, the data asset, and the item's mesh, and then apply the mesh to the pickup. Since you already built the code for that in `InitializePickup()`, call that function. C++ ```
/*	Updates this pickup whenever a property is changed.
*	@param PropertyChangedEvent - contains info about the property that was changed. */
void APickupBase::PostEditChangeProperty(FPropertyChangedEvent& PropertyChangedEvent)
{
	// Handle parent class property changes
	Super::PostEditChangeProperty(PropertyChangedEvent);

	// If a property was changed, get the name of the changed property. Otherwise use none.
	const FName ChangedPropertyName = PropertyChangedEvent.Property
		? PropertyChangedEvent.Property->GetFName()
``` `InitializePickup()` includes extra runtime logic that's not necessary for editor preview updates, but reusing it here keeps the example simple. In a production system, you'd have a dedicated validation function or preview-only function instead.
- Save your code and compile it from Visual Studio.

 Your complete `PostEditChangeProperty()` function should look like this:

 C++

```
/*	Updates this pickup whenever a property is changed.
*	@param PropertyChangedEvent - contains info about the property that was changed. */
void APickupBase::PostEditChangeProperty(FPropertyChangedEvent& PropertyChangedEvent)
{
	// Handle parent class property changes
	Super::PostEditChangeProperty(PropertyChangedEvent);

	// If a property was changed, get the name of the changed property. Otherwise use none.
	const FName ChangedPropertyName = PropertyChangedEvent.Property
		? PropertyChangedEvent.Property->GetFName()
```

Back in the editor, in the **Outliner**, ensure your **BP_PickupBase** actor is selected. Change the **Pickup Item ID** from `pickup_001` to `pickup_002`, then change it back. As you change the ID, your pickup’s mesh updates in the Viewport.

## Next Up

Next, you’ll extend your pickup class further to create a custom gadget and equip it to your character!

- [image: Equip Your Character] Equip Your CharacterLearn to use C++ to create custom equippable items and attach them to your character. (-> coder-07-equip-your-character-with-cplusplus-tools)

## Complete Code

 C++

 PickupBase.h

```
// Copyright Epic Games, Inc. All Rights Reserved.

#pragma once

#include "Components/SphereComponent.h"
#include "AdventureCharacter.h"
#include "CoreMinimal.h"
#include "GameFramework/Actor.h"
#include "PickupBase.generated.h"
```

 C++

 PickupBase.cpp

```
// Copyright Epic Games, Inc. All Rights Reserved.

#include "PickupBase.h"
#include "ItemDefinition.h"
#include "Data/ItemData.h"

// Sets default values
APickupBase::APickupBase()
{
```

On this page

- Before You Begin (-> coder-06-create-a-respawning-pickup-item-in-unreal-engine)
- Create a New Pickup Class (-> coder-06-create-a-respawning-pickup-item-in-unreal-engine)
- Initialize the Pickup with Table Data (-> coder-06-create-a-respawning-pickup-item-in-unreal-engine)
- Pull Data from a Data Table (-> coder-06-create-a-respawning-pickup-item-in-unreal-engine)
- Create a Reference Item (-> coder-06-create-a-respawning-pickup-item-in-unreal-engine)
- Call InitializePickup() (-> coder-06-create-a-respawning-pickup-item-in-unreal-engine)
- Create In-Game Functionality (-> coder-06-create-a-respawning-pickup-item-in-unreal-engine)
- Add a Mesh Component (-> coder-06-create-a-respawning-pickup-item-in-unreal-engine)
- Add a Collision Shape (-> coder-06-create-a-respawning-pickup-item-in-unreal-engine)
- Simulate Pickup Collisions (-> coder-06-create-a-respawning-pickup-item-in-unreal-engine)
- Declare the Overlap Handler (-> coder-06-create-a-respawning-pickup-item-in-unreal-engine)
- Bind the Function to the Collision Event (-> coder-06-create-a-respawning-pickup-item-in-unreal-engine)
- Hide the Pickup After a Collision (-> coder-06-create-a-respawning-pickup-item-in-unreal-engine)
- Make the Pickup Respawn (-> coder-06-create-a-respawning-pickup-item-in-unreal-engine)
- Implement Pickups in Your Level (-> coder-06-create-a-respawning-pickup-item-in-unreal-engine)
- Load a Different Pickup (-> coder-06-create-a-respawning-pickup-item-in-unreal-engine)
- Update Pickup Actors in the Editor (-> coder-06-create-a-respawning-pickup-item-in-unreal-engine)
- Next Up (-> coder-06-create-a-respawning-pickup-item-in-unreal-engine)
- Complete Code (-> coder-06-create-a-respawning-pickup-item-in-unreal-engine)

Related documents

Code a First-Person Adventure Game

 [image: Code a First-Person Adventure Game] (-> code-a-firstperson-adventure-game-in-unreal-engine)Manage Items and Data

 [image: Manage Items and Data] (-> coder-05-manage-item-and-data-in-an-unreal-engine-game)Equip Your Character

 [image: Equip Your Character] (-> coder-07-equip-your-character-with-cplusplus-tools)
