# Creating Gameplay in Unreal Engine

https://dev.epicgames.com/documentation/en-us/unreal-engine/creating-gameplay-in-unreal-engine-for-unity-developers?application_version=5.9

> Complex coding examples in Unreal Engine with side-by-side C#, C++, and Blueprint examples.

> **note:** This page explains Unreal Engine (UE) gameplay programming concepts for Unity users. The explanations below assume you are familiar with Unity C# and want to learn UE C++ and Blueprint.

The examples below cover some common gameplay programming use cases in Unity C# and how to implement the same functionality in UE.

## Instantiating GameObject / Spawning Actor

In Unity, you use the `Instantiate` function to create new instances of objects. This function takes any `UnityEngine.Object` type (GameObject, MonoBehaviour, etc.), and makes a copy of it.

```c_sharp
public GameObject EnemyPrefab;
public Vector3 SpawnPosition;
public Quaternion SpawnRotation;

void Start()
{
	GameObject NewGO = (GameObject)Instantiate(EnemyPrefab, SpawnPosition, SpawnRotation);
	NewGO.name = "MyNewGameObject";
}
```

UE has two different functions to instantiate objects:

- `NewObject` creates new `UObject` types.

- `SpawnActor` spawns `AActor` types.

### UObjects and NewObject

Subclassing `UObject` in UE is similar to subclassing `ScriptableObject` in Unity. These are useful for gameplay classes that do not need to spawn into the world or have attached components as Actors do.

In Unity, if you created a subclass of `ScriptableObject`, you can instantiate it like this:

```c_sharp
MyScriptableObject NewSO = ScriptableObject.CreateInstance<MyScriptableObject>();
```

In UE, if you create a subclass of `UObject`, you can instantiate it like this:

```cpp_programming
UMyObject* NewObj = NewObject<UMyObject>();
```

### AActors and SpawnActor

You can spawn Actors using the `SpawnActor` method on a World (`UWorld` in C++) object. Some UObjects and all Actors provide a `GetWorld` method to get the World object.

In the example below, we use those methods with an existing Actor's spawn parameters to emulate the functionality of Unity's `Instantiate` method.

#### Example

Below is the example AActor subclass, `AMyActor`. The default constructor initializes the `int32` and `USphereComponent*`.

Note the use of the `CreateDefaultSubobject` function. This function creates Components and assigns default properties to them. Sub-objects created with this function act as a default template, so you can modify them in a subclass or Blueprint.

```cpp_programming
UCLASS()
class AMyActor : public AActor
{
	GENERATED_BODY()

	UPROPERTY()
	int32 MyIntProp;

	UPROPERTY()
	USphereComponent* MyCollisionComp;
```
(10 more lines on the web page)

This creates a clone of a `AMyActor`, including all member variables, UPROPERTYs, and Components.

```cpp_programming
AMyActor* CreateCloneOfMyActor(AMyActor* ExistingActor, FVector SpawnLocation, FRotator SpawnRotation)
{
	UWorld* World = ExistingActor->GetWorld();
	FActorSpawnParameters SpawnParams;
	SpawnParams.Template = ExistingActor;
	World->SpawnActor<AMyActor>(ExistingActor->GetClass(), SpawnLocation, SpawnRotation, SpawnParams);
}
```

## Casting from One Type to Another

In this case, we get a component we know we have, then cast it to a specific type and conditionally do something.

#### Unity

```c_sharp
Collider collider = gameObject.GetComponent<Collider>;
SphereCollider sphereCollider = collider as SphereCollider;
if (sphereCollider != null)
{
		// ...
}
```

#### UE C++

```cpp_programming
UPrimitiveComponent* Primitive = MyActor->GetComponentByClass(UPrimitiveComponent::StaticClass());
USphereComponent* SphereCollider = Cast<USphereComponent>(Primitive);
if (SphereCollider != nullptr)
{
		// ...
}
```

#### Blueprint

You can cast in Blueprint by using a **Cast to** node. For more detailed information, see Casting Quick Start Guide (-> casting-quick-start-guide-in-unreal-engine).

## Destroying GameObject / Actor

| **Unity C#** ```c_sharp Destroy(MyGameObject); ``` | **UE C++** ```cpp_programming MyActor->Destroy(); ``` | **Blueprint** |
| --- | --- | --- |

## Destroying GameObject / Actor (with 1-Second Delay)

| **Unity C#** ```c_sharp Destroy(MyGameObject, 1); ``` | **UE C++** ```cpp_programming MyActor->SetLifeSpan(1); ``` | **Blueprint** |
| --- | --- | --- |

## Disabling GameObjects / Actors

| **Unity C#** ```c_sharp MyGameObject.SetActive(false); ``` | **UE C++** ```cpp_programming // Hides visible components MyActor->SetActorHiddenInGame(true); // Disables collision components MyActor->SetActorEnableCollision(false); // Stops the Actor from ticking MyActor->SetActorTickEnabled(false); ``` | **Blueprint** |
| --- | --- | --- |

## Accessing the GameObject / Actor from a Component

| **Unity C#** ```cpp_programming GameObject ParentGO = MyComponent.gameObject; ``` | **UE C++** ```cpp_programming AActor* ParentActor = MyComponent->GetOwner(); ``` | **Blueprint** |
| --- | --- | --- |

## Accessing a Component from the GameObject / Actor

#### Unity

```c_sharp
MyComponent MyComp = gameObject.GetComponent<MyComponent>();
```

#### UE C++

```cpp_programming
UMyComponent* MyComp = MyActor->FindComponentByClass<UMyComponent>();
```

#### Blueprint

## Finding GameObjects / Actors

#### Unity

```c_sharp
// Find GameObject by name
GameObject MyGO = GameObject.Find("MyNamedGameObject");

// Find Objects by type
MyComponent[] Components = Object.FindObjectsOfType(typeof(MyComponent)) as MyComponent[];
foreach (MyComponent Component in Components)
{
		// ...
}
```
(7 more lines on the web page)

#### UE C++

```cpp_programming
// Find UObjects by type
for (TObjectIterator<UMyObject> It; It; ++it)
{
	UMyObject* MyObject = *It;
	// ...
}

// Find Actor by name (also works on UObjects)
AActor* MyActor = FindObject<AActor>(nullptr, TEXT("MyNamedActor"));
```
(17 more lines on the web page)

#### Blueprint

## Adding Tags to GameObjects / Actors

#### Unity

```c_sharp
MyGameObject.tag = "MyTag";
```

#### UE C++

```cpp_programming
// Actors can have multiple tags
MyActor.Tags.AddUnique(TEXT("MyTag"));
```

#### Blueprint

## Adding Tags to MonoBehaviours / ActorComponents

#### Unity

```c_sharp
// This changes the tag on the GameObject it is attached to
MyComponent.tag = "MyTag";
```

#### UE C++

```cpp_programming
// Components have their own array of tags
MyComponent.ComponentTags.AddUnique(TEXT("MyTag"));
```

## Comparing Tags on GameObjects / Actors and MonoBehaviours / ActorComponents

#### Unity

```c_sharp
if (MyGameObject.CompareTag("MyTag"))
{
	// ...
}

// Checks the tag on the GameObject it is attached to
if (MyComponent.CompareTag("MyTag"))
{
	// ...
}
```

#### UE C++

```cpp_programming
// Checks if an Actor has this tag
if (MyActor->ActorHasTag(FName(TEXT("MyTag"))))
{
	// ...
}
```

#### Blueprint

#### UE C++

```cpp_programming
// Checks if an ActorComponent has this tag
if (MyComponent->ComponentHasTag(FName(TEXT("MyTag"))))
{
	// ...
}
```

#### Blueprint

## Physics: RigidBody vs. Primitive Component

In Unity, to give a GameObject physics characteristics, you attach a RigidBody component.

In UE, any Primitive Component (`UPrimitiveComponent` in C++) can represent a physical object. Some common Primitive Components are:

- Shape Components (`USphereComponent`, `UCapsuleComponent`, etc.)

- Static Mesh Components

- Skeletal Mesh Components

Unlike Unity, which separates the responsibilities of collision and visualizations into separate components, UE combines the concepts of "potentially physical" and "potentially visible" into a single Primitive Component. Any Component with geometry in the world that can be rendered or physically interacted with is a subclass of `UPrimitiveComponent`.

> **note:** Collision Channels are the UE equivalent of layers in Unity. To learn more, refer to Collision Filtering.

### RayCast vs. RayTrace

#### Unity

```c_sharp
GameObject FindGOCameraIsLookingAt()
{
	Vector3 Start = Camera.main.transform.position;
	Vector3 Direction = Camera.main.transform.forward;
	float Distance = 100.0f;
	int LayerBitMask = 1 << LayerMask.NameToLayer("Pawn");

	RaycastHit Hit;
	bool bHit = Physics.Raycast(Start, Direction, out Hit, Distance, LayerBitMask);
```
(8 more lines on the web page)

#### UE C++

```cpp_programming
APawn* AMyPlayerController::FindPawnCameraIsLookingAt()
{
	// You can use this to customize various properties about the trace
	FCollisionQueryParams Params;
	// Ignore the player's pawn
	Params.AddIgnoredActor(GetPawn());

	// The hit result gets populated by the line trace
	FHitResult Hit;
```
(14 more lines on the web page)

#### Blueprint

[image: Click the image for full size.]

### Trigger Volumes

#### Unity

```c_sharp
public class MyComponent : MonoBehaviour
{
	void Start()
	{
		collider.isTrigger = true;
	}
	void OnTriggerEnter(Collider Other)
	{
		// ...
	}
```
(5 more lines on the web page)

#### UE C++

```cpp_programming
UCLASS()
class AMyActor : public AActor
{
	GENERATED_BODY()

	// My trigger component
	UPROPERTY()
	UPrimitiveComponent* Trigger;

	AMyActor()
```
(15 more lines on the web page)

#### Blueprint

> **tip:** To learn more about setting up collision responses, see Collision (-> collision-in-unreal-engine).

### Kinematic Rigidbodies

#### Unity

```c_sharp
public class MyComponent : MonoBehaviour
{
	void Start()
	{
		rigidbody.isKinematic = true;
		rigidbody.velocity = transform.forward * 10.0f;
	}
}
```

#### UE C++

```cpp_programming
UCLASS()
class AMyActor : public AActor
{
	GENERATED_BODY()

	UPROPERTY()
	UPrimitiveComponent* PhysicalComp;

	AMyActor()
	{
```
(5 more lines on the web page)

## Input Events

#### Unity

```c_sharp
public class MyPlayerController : MonoBehaviour
{
	void Update()
	{
		if (Input.GetButtonDown("Fire"))
		{
			// ...
		}
		float Horiz = Input.GetAxis("Horizontal");
		float Vert = Input.GetAxis("Vertical");
```
(3 more lines on the web page)

#### UE C++

```cpp_programming
UCLASS()
class AMyPlayerController : public APlayerController
{
	GENERATED_BODY()

	void SetupInputComponent()
	{
		Super::SetupInputComponent();

		InputComponent->BindAction("Fire", IE_Pressed, this, &AMyPlayerController::HandleFireInputEvent);
```
(8 more lines on the web page)

#### Blueprint

This is what your input properties in your Project Settings might look like:

[image: Input settings in Unreal Engine]

> **tip:** To learn more about how to set up input for your UE project, see Input (-> input-in-unreal-engine).

## Further Reading

For more information related to the concepts above, we recommend that you review the following sections:

- Gameplay Framework (-> gameplay-framework-in-unreal-engine) - Covers core game systems such as game mode, player state, controllers, pawns, cameras, and more.

- Gameplay Architecture (-> programming-with-cpp-in-unreal-engine) - Reference for creating and implementing gameplay classes.

- Gameplay Tutorials (-> gameplay-tutorials-for-unreal-engine) - Tutorials for recreating common gameplay elements.
