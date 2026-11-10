# Writing Code in Unreal Engine

https://dev.epicgames.com/documentation/en-us/unreal-engine/writing-code-in-unreal-engine-for-unity-developers?application_version=5.9

> Overview and examples of writing code in Unreal Engine, demonstrating equivalence between C#, C++, and Blueprint.

## Setup

### C++

To write C++ code in Unreal Engine (UE), download Visual Studio on Windows, or install Xcode on macOS. When you create a new C++ project, UE will automatically create Visual Studio project files for you.

There are two ways to access Visual Studio from your UE project:

- In the **Content Browser**, **double-click** a C++ class to open it in Visual Studio.

- From the main menu, go to **Tools ****> ****Open Visual Studio**. This option only appears if your project contains at least one C++ class.

A critical difference in UE: You will sometimes have to manually refresh your Visual Studio project files (for example, after downloading a new version of UE, or when manually making changes to source file locations on disk.) You can do this in two ways:

- From UE's main menu, go to **Tools > Refresh Visual Studio Project**.

- **Right-click** the **.uproject** file in your project's directory and select **Generate Visual Studio project files**.

> **tip:** See Development Setup (-> setting-up-your-development-environment-for-cplusplus-in-unreal-engine) for more detailed information.

### Blueprint

You only need UE to use Blueprint scripting. All the features you need are built into Unreal Editor.

## Writing Event Functions

If you previously worked with MonoBehaviors, you are familiar with the `Start`, `Update`, and `OnDestroy` methods. Below is a comparison between a Unity behavior and its equivalent for UE: Actors and Components.

In Unity, you might have a simple component that looks like this:

```c_sharp
public class MyComponent : MonoBehaviour
{
	void Start() {}
	void OnDestroy() {}
	void Update() {}
}
```

### AActor

In UE, you can write code on the Actor itself rather than only coding new component types.

Additionally, Actors have similar methods to Unity's `Start`, `OnDestroy`, and `Update` methods.

#### C++

```cpp_programming
UCLASS()
class AMyActor : public AActor
{
	GENERATED_BODY()

	// Called at start of game.
	void BeginPlay();

	// Called when destroyed.
	void EndPlay(const EEndPlayReason::Type EndPlayReason);
```
(4 more lines on the web page)

#### Blueprint

### UActorComponent

Components in UE are conceptually similar to MonoBehaviors but contain different methods.

#### C++

```cpp_programming
UCLASS()
class UMyComponent : public UActorComponent
{
	GENERATED_BODY()

	// Called after the owning Actor was created
	void InitializeComponent();

	// Called when the component or the owning Actor is being destroyed
	void UninitializeComponent();
```
(4 more lines on the web page)

#### Blueprint

## Additional Notes

- In UE, you must explicitly call the parent's method within a child's method. For example, in Unity C# this would be `base.Update()`, but in UE C++ you will use `Super::Tick()` for Actors or `Super::TickComponent()` for Components.

- In UE C++, classes use various prefixes, such as `U` for `UObject` subclasses and `A` for Actor subclasses. See Coding Standard (-> epic-cplusplus-coding-standard-for-unreal-engine) for more detailed information.

- For gameplay coding examples, see Creating Gameplay in Unreal Engine (-> creating-gameplay-in-unreal-engine-for-unity-developers).
