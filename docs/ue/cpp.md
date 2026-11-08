# C++ and building (UE 5.8.4)

Gameplay lives in C++; Blueprints only subclass C++ classes to assign assets and tunables. These rules keep the
build green (UHT warnings fail it) and keep UObjects from being garbage-collected under us. Checked against the
5.8.4 headers, UBT/UHT source and Epic's 5.8 docs (bottom).

## Reflection macros: write them exactly

- Every reflected type: macro on the line before, `GENERATED_BODY()` first thing inside the body.
  UHT errors without it ("Expected a GENERATED_BODY() at the start of the class").
- `#include "MyThing.generated.h"` is the **last** include in the header. Anything after it is a UHT error.
  Header needs `#pragma once`.
- Prefixes are enforced: `U` UObject, `A` Actor, `F` struct, `E` enum, `I`/`U` interface. File name = class name
  minus prefix (`MyPickup.h` holds `AMyPickup`).
- `UENUM(BlueprintType)` must be `enum class EFoo : uint8` (UHT: "only uint8 supported" for BlueprintType). Never a raw
  `enum` as a member type.
- No UPROPERTY/UFUNCTION inside templates or nested classes. A UPROPERTY inside `#if WITH_EDITOR` is a UHT error
  (use `WITH_EDITORONLY_DATA`, and avoid it). A UFUNCTION there compiles but exists only in editor builds, so keep
  gameplay UFUNCTIONs out of it.
- A header with only `DECLARE_DYNAMIC_*` delegates needs `UDELEGATE` on one of them or UHT skips it.

```cpp
#pragma once
#include "CoreMinimal.h"
#include "GameFramework/Actor.h"
#include "MyPickup.generated.h"   // last include, always

class UMyPickupData;              // forward-declare in headers; include in the .cpp
class UStaticMeshComponent;

UCLASS()
class AMyPickup : public AActor
{
    GENERATED_BODY()
public:
    AMyPickup();
protected:
    UPROPERTY(VisibleAnywhere, Category="Components")
    TObjectPtr<UStaticMeshComponent> Mesh;

    UPROPERTY(EditDefaultsOnly, BlueprintReadOnly, Category="Tuning")
    TObjectPtr<UMyPickupData> Data;   // DataAsset holds the numbers (kit rule)
};
```

## Specifiers that matter for us

| Want | Specifier |
|---|---|
| Tunable set on the BP subclass defaults (our normal case) | `EditDefaultsOnly` |
| Tunable per placed instance in the level | `EditInstanceOnly` or `EditAnywhere` |
| Component pointer (show it, don't let anyone replace it) | `VisibleAnywhere` |
| BP may read / write | `BlueprintReadOnly` / `BlueprintReadWrite` |
| Not saved | `Transient` |
| Group in Details panel | `Category="Tuning\|Movement"` (`\|` nests) |
| Clamp a number in the editor | `meta=(ClampMin="0", ClampMax="1")` |

- Every exposed property gets a `Category`. `Edit*` and `Visible*` are mutually exclusive; `BlueprintReadOnly` and
  `BlueprintReadWrite` are mutually exclusive (UHT errors).
- `BlueprintReadOnly/ReadWrite` on a **private** member is a UHT error unless `meta=(AllowPrivateAccess="true")`
  (the TP_ThirdPerson template does this for its camera components).
- Prefer `BlueprintReadOnly`: Blueprints are data wrappers, not logic. Only expose what a BP or widget must read.
- `meta` is editor-only: never read metadata from game logic.
- Functions: `UFUNCTION(BlueprintCallable, Category="...")` only when a widget/BP must call it.
  `BlueprintImplementableEvent` = BP-only body (avoid: logic in BP); `BlueprintNativeEvent` = you implement
  `Foo_Implementation()` in C++. `UFUNCTION()` (no specifiers) is still required for functions bound to dynamic
  delegates (`OnComponentBeginOverlap.AddDynamic`) and timers by name.
- Class references for spawning BP subclasses: `UPROPERTY(EditDefaultsOnly) TSubclassOf<AMyEnemy> EnemyClass;`

## UObject pointers and garbage collection

- GC frees any UObject not reachable from the root set through **reflected** references. A raw `UObject*` member
  without `UPROPERTY()` neither keeps the object alive nor gets nulled: it dangles. Classic crash.
- Rules:
  - Member pointer to a UObject you own or need: `UPROPERTY() TObjectPtr<UFoo> Foo;` (also inside `TArray`/`TMap`).
  - Pointer you observe but don't own (target actor, last hit): `TWeakObjectPtr<AActor>`; call `.Get()` and
    null-check every use.
  - Reference to an asset you don't want loaded with the owner (music, big meshes, next level):
    `TSoftObjectPtr<T>` / `TSoftClassPtr<T>`; `LoadSynchronous()` for small things, async load for big ones.
  - Plain (non-UObject) C++ class holding a UObject: `TStrongObjectPtr<T>` (rare; prefer making the holder a UObject).
  - Locals and function parameters: raw `T*` is fine.
- `TObjectPtr` is the drop-in replacement for raw pointer **members**; GC behaviour is identical to a UPROPERTY raw
  pointer. Use it for all new UPROPERTY members. UHT allows raw pointers silently (engine default), so mixing won't
  fail the build, but don't copy the template's raw `UInputAction*` style.
- Destroyed actors/components: reflected references to them are nulled. Check with `IsValid(Ptr)` (null and
  pending-kill), not just `Ptr != nullptr`.
- Create objects with `CreateDefaultSubobject<T>(TEXT("Name"))` (constructor only, components),
  `GetWorld()->SpawnActor<T>()` (actors), `NewObject<T>(Outer)` (other UObjects). Never `new` a UObject.
- Constructor: set defaults and create components only. No `GetWorld()`, no spawning, no gameplay; use `BeginPlay`.
- **Anything an actor creates in `BeginPlay` (components, timers), it removes in `EndPlay`.** In a World Partition map
  a cell that streams out calls `EndPlay` (`RemovedFromWorld`) without destroying the actor, and `BeginPlay` runs again
  when it streams back: an actor that added its meshes in `BeginPlay` ended up with two sets, one frozen.
- Tick off by default: `PrimaryActorTick.bCanEverTick = false;` in the constructor (`performance.md`).

## Modules: Build.cs

- One game module is enough. Its `<Game>.Build.cs` lists the engine modules our code may use; a missing entry
  shows up as a **linker** error (`LNK2019 unresolved external symbol`) or a missing include, not a clear message.
- 5.8 template baseline (TP_ThirdPerson): `Core, CoreUObject, Engine, InputCore, EnhancedInput, AIModule,
  StateTreeModule, GameplayStateTreeModule, UMG, Slate`. Add as needed:

| Using | Add module | Notes |
|---|---|---|
| Enhanced Input (`UInputAction`, `UEnhancedInputComponent`) | `EnhancedInput` | Plugin, enabled by default |
| Widgets (`UUserWidget`, `UTextBlock`) | `UMG` (+ `Slate`, `SlateCore` for Slate types) | |
| Niagara (`UNiagaraComponent`, `UNiagaraFunctionLibrary`) | `Niagara` | Plugin, enabled by default |
| AI controller, perception, behaviour | `AIModule` | |
| Nav mesh queries | `NavigationSystem` | |
| Gameplay tags | `GameplayTags` | |
| Project settings class (`UDeveloperSettings`) | `DeveloperSettings` | |

- Public vs private: Epic prefers `PrivateDependencyModuleNames` (faster builds); use Public only if our public
  headers include that module's headers. For a single game module either works; don't agonise.
- A module from a **plugin** also needs the plugin enabled in the `.uproject` (EnhancedInput/Niagara already are).
- Changing Build.cs, Target.cs or the `.uproject` = close editor, full build (regenerates project files).

## Target.cs

- Two files: `<Game>.Target.cs` (`TargetType.Game`, packaged game) and `<Game>Editor.Target.cs` (`TargetType.Editor`).
- 5.8 values, as the template: `DefaultBuildSettings = BuildSettingsVersion.V7;`
  `IncludeOrderVersion = EngineIncludeOrderVersion.Unreal5_8;` `ExtraModuleNames.Add("<Game>");` (V7 and
  Unreal5_8 are `Latest` in 5.8.4). Don't touch otherwise.

## Build configurations

- Installed (launcher) engine = project builds only: Game target in **DebugGame / Development / Shipping**,
  Editor target in **DebugGame / Development**. Debug and Test need an engine source build.
- **Development** (Editor and Game): what we use everywhere, including the submitted build
  (`scripts/package.ps1` packages Win64 Development). Keeps logs, `stat` commands and console.
- **DebugGame**: our code unoptimised, engine optimised. Only for stepping through a nasty bug in a debugger.
- **Shipping**: strips console, stats and profiling; `check()` compiled out. Not the default; `package.ps1 -Config
  Shipping` builds one only to compare size. Also believed (unverified in 5.8.4): `Saved\` (logs,
  `GameUserSettings.ini`) moves to `%LOCALAPPDATA%\<Project>\Saved`, so `bench.ts` and the "delete Saved" steps look
  in the wrong place; no log file at all (`bUseLoggingInShipping` needs a unique build environment, which a launcher
  engine refuses); engine on-screen warnings go too.
- Command-line editor build (editor closed):
  `"<Engine>\Engine\Build\BatchFiles\Build.bat" <Game>Editor Win64 Development -Project="<path>\<Game>.uproject" -WaitMutex`

## Packaging: BuildCookRun

`scripts/package.ps1` runs `RunUAT.bat BuildCookRun` with these flags; reuse it, don't hand-roll:

| Flag | Meaning |
|---|---|
| `-project=<.uproject>` `-platform=Win64` `-clientconfig=Development` | what to build |
| `-build` `-cook` `-stage` `-pak` `-archive -archivedirectory=<dir>` | compile, cook content, stage, pak, copy out |
| `-unattended` `-utf8output` `-nop4` `-NoCodeSign` | no prompts, no Perforce, no signing |

- Useful extras: `-iterate` (incremental cook; first thing to drop if content looks stale), `-skipbuild` /
  `-skipcook` (reuse previous step), `-nodebuginfo` (no .pdb in stage, smaller zip), `-prereqs` (ship VC redist
  installer), `-clean` (wipe intermediates). `-distribution` is store signing: not for itch.
- UBT refuses to build while the editor has Live Coding active
  ("Unable to build while Live Coding is active"): close the editor first (the script checks).

## Live Coding vs full rebuild

- Live Coding: Ctrl+Alt+F11 in editor or IDE; patches the running editor/PIE. **Scriptable:** run the console
  command `LiveCoding.Compile` (MCP `MegajamTools.run_console_command`), then poll the Output Log for
  `LogLiveCoding: Display: Live coding succeeded` (~7 s for one .cpp on the target PC, verified 2026-10-24). Changes apply
  from the next PIE session. Not through MCP: the 5.8.4 build registers no `LiveCodingToolset` (the `unreal-mcp`
  skill names one).
- Full build with the editor closed: `scripts\build.ps1` (24 s for a 4-class module on the target PC). It passes only with
  zero warnings in our files; engine/toolchain warnings are listed separately. Known engine one: 5.8's own
  `GameFramework/Character.h(798)` raises **C4996 GetMovementBase deprecated** for every `ACharacter` subclass;
  not ours, can't be fixed, ignore it. Also "Visual Studio compiler 14.51 is not a preferred version" (harmless).
- Flat module with subfolders (`Source/<Module>/Core/...`): add `PublicIncludePaths.Add(ModuleDirectory);` to
  Build.cs so `#include "Core/MyGameMode.h"` resolves (Epic's templates list their folders the same way).
- **Kit rule (stricter than Epic's docs): Live Coding for function bodies only.** New or changed UPROPERTY,
  UFUNCTION, UCLASS/USTRUCT/UENUM, class members, Build.cs, new files = close editor, full build, reopen.
  (5.8 docs say Object Reinstancing, on by default, can take new functions/variables; it is the source of
  corrupted BP defaults and shutdown crashes, so we don't rely on it.)
  **Any header edit counts, even a comment:** that is no longer "function bodies only".
- **After Live Coding, full build before loading a map.** On a prototype, `LevelEditorSubsystem.load_level` a few
  minutes after a patch (a world subsystem's `.cpp` with a new static cvar, plus a comment-only header edit) crashed
  the editor in world init: `Assertion failed: Ret->IsA(T::StaticClass())` (Class.h). After `scripts\build.ps1` the
  same map loaded cleanly. Not reproduced on purpose, but don't open or reload maps in a Live-Coded session.
- Constructor changes in the `.cpp` do **not** reach existing instances/BP defaults after Live Coding. Full build.
- Anything odd after a patch (stale values, BP compile errors): close editor, full build, before debugging further.
- Fix the first compile error first; later ones are usually cascades.

## Common errors

| Error | Usual cause / fix |
|---|---|
| `#include found after .generated.h file` | Move `.generated.h` to last include |
| `Expected a GENERATED_BODY()` | Missing macro or wrong placement |
| `BlueprintReadWrite should not be used on private members` | Make protected/public or add `AllowPrivateAccess` |
| `Cannot specify ... BlueprintReadOnly and BlueprintReadWrite` | Pick one |
| `LNK2019 unresolved external symbol` for an engine class | Module missing in Build.cs; else the function isn't exported (no `*_API`): use another API |
| `LNK2019` for your own `UFUNCTION` | `BlueprintNativeEvent` without `_Implementation`, or body missing in `.cpp` |
| `C2027 use of undefined type` / incomplete type | Forward-declared only: `#include` the header in the `.cpp` |
| `cannot open include file` | Wrong path (5.8 headers: `"GameFramework/Character.h"`, `"Components/StaticMeshComponent.h"`) or missing module |
| Crash on pointer that "was fine" | Missing `UPROPERTY()` (GC'd) or destroyed actor: `IsValid()` |
| Editor DLL locked / "Unable to build while Live Coding is active" | Close editor (or use Live Coding for body-only edits) |

Grep the 5.8 headers for the exact include path and signature before using any engine API.

## Logging

- One project category, declared in the module header and defined in the module `.cpp` (as the template does):

```cpp
// MyGame.h
DECLARE_LOG_CATEGORY_EXTERN(LogMyGame, Log, All);
// MyGame.cpp
DEFINE_LOG_CATEGORY(LogMyGame);
// use (FString needs * for %s)
UE_LOG(LogMyGame, Warning, TEXT("Picked up %s worth %d"), *GetName(), Points);
```

- Per-file category: `DEFINE_LOG_CATEGORY_STATIC(LogMyPickup, Log, All);` in the `.cpp`.
- Verbosity levels, `[PROOF]` lines, runtime verbosity changes, `UE_LOGFMT` and where the logs live:
  `debugging.md` A. Use `Log`/`Verbose` for chatter, `Warning` for "this should not happen but we continue".

## Assertions

- `check(Expr)` / `checkf(Expr, TEXT("..."), ...)`: halts. Active in Development; **compiled out in Shipping,
  expression not evaluated**. Never put side effects inside.
- `verify(Expr)`: like check but the expression always runs.
- `ensure(Expr)` / `ensureMsgf`: logs + callstack, execution continues, reports **once per call site per session**
  (`ensureAlways` every time; each first fire hitches). Returns the bool: `if (!ensure(Data)) { return; }`.
- Our default: `ensure` + early return for "designer forgot to assign a DataAsset/class" (game keeps running,
  error is visible); `check` only for true programmer invariants. Never `check` on asset assignments.

## Verified against

- Engine version: `Engine\Build\Build.version` = 5.8.4 (CL 58902052).
- Template Build.cs module list, Target.cs (`V7`, `Unreal5_8`), log category pattern, `AllowPrivateAccess`, raw
  UPROPERTY pointers: `Templates\TP_ThirdPerson\Source\TP_ThirdPerson\{TP_ThirdPerson.Build.cs, TP_ThirdPerson.h,
  TP_ThirdPerson.cpp, TP_ThirdPersonCharacter.h}`, `Source\TP_ThirdPerson.Target.cs`, `TP_ThirdPersonEditor.Target.cs`.
- `V7`/`Unreal5_8` are `Latest`: `Engine\Source\Programs\UnrealBuildTool\Configuration\Rules\TargetRules.cs`.
- UBT passes `-WarningsAsErrors` to UHT on every build: `...\UnrealBuildTool\System\UHTExecution.cs` (~line 1433).
- UHT errors quoted above: `Engine\Source\Programs\Shared\EpicGames.UHT\Parsers\UhtHeaderFileParser.cs` (generated.h
  last), `UhtClassParser.cs` (GENERATED_BODY, prefix), `Specifiers\UhtPropertyMemberSpecifiers.cs` (private BP access,
  ReadOnly/ReadWrite), `UhtEnumParser.cs` (uint8), `UhtPropertyParser.cs` (raw enum, WITH_EDITOR).
- Raw pointer members allowed silently by default: `...\UnrealBuildTool\Modes\UnrealHeaderToolMode.cs` (line 69).
- Pointer types: `Runtime\CoreUObject\Public\UObject\{ObjectPtr.h (TObjectPtr doc ~l.506), SoftObjectPtr.h
  (LoadSynchronous, TSoftClassPtr), StrongObjectPtr.h, Object.h (IsValid, CreateDefaultSubobject), UObjectGlobals.h
  (NewObject)}`; `Runtime\Core\Public\UObject\WeakObjectPtrTemplates.h`.
- Asserts: `Runtime\Core\Public\Misc\AssertionMacros.h`, `Misc\Build.h` (`DO_CHECK = USE_CHECKS_IN_SHIPPING`).
  Logging: `Runtime\Core\Public\Logging\{LogMacros.h, LogCategory.h, StructuredLog.h}`.
- `bCanEverTick`: `Runtime\Engine\Classes\GameFramework\Actor.h`; `UPrimaryDataAsset`: `Engine\Classes\Engine\DataAsset.h`.
- Modules exist: `Plugins\EnhancedInput\Source\EnhancedInput`, `Plugins\FX\Niagara\Source\Niagara`, `Source\Runtime\{UMG,
  AIModule, NavigationSystem, GameplayTags, SlateCore, DeveloperSettings}`; EnhancedInput and Niagara `.uplugin` have
  `EnabledByDefault: true`.
- BuildCookRun flags (`-iterate`, `-skipbuild`, `-skipcook`, `-nodebuginfo`, `-prereqs`, `-pak`, `-archivedirectory`,
  `-distribution`, `-clean`): `Engine\Source\Programs\AutomationTool\AutomationUtils\ProjectParams.cs`.
- Live Coding busy message: `...\UnrealBuildTool\...\HotReload.cs` (line 277); `bEnableReinstancing=True`,
  `bAutomaticallyCompileNewClasses=True`: `Engine\Config\BaseEditorPerProjectUserSettings.ini`.
- `Build.bat <Target> <Platform> <Config>` arguments: `Engine\Build\BatchFiles\Build.bat` header comment.
- Linker-error causes and the "BP defaults corrupted by reinstancing" rationale are experience, not Epic docs
  (unverified).

## Sources (5.8)

- Reflection system: https://dev.epicgames.com/documentation/en-us/unreal-engine/reflection-system-in-unreal-engine?application_version=5.8
- Property specifiers: https://dev.epicgames.com/documentation/en-us/unreal-engine/unreal-engine-uproperties?application_version=5.8
- Object handling / GC: https://dev.epicgames.com/documentation/en-us/unreal-engine/unreal-object-handling-in-unreal-engine?application_version=5.8
- Modules: https://dev.epicgames.com/documentation/en-us/unreal-engine/unreal-engine-modules?application_version=5.8
- Build configurations: https://dev.epicgames.com/documentation/en-us/unreal-engine/build-configurations-reference-for-unreal-engine?application_version=5.8
- Live Coding: https://dev.epicgames.com/documentation/en-us/unreal-engine/using-live-coding-to-recompile-unreal-engine-applications-at-runtime?application_version=5.8
- Build operations (BuildCookRun stages): https://dev.epicgames.com/documentation/en-us/unreal-engine/build-operations-cooking-packaging-deploying-and-running-projects-in-unreal-engine?application_version=5.8
- Logging: https://dev.epicgames.com/documentation/en-us/unreal-engine/logging-in-unreal-engine?application_version=5.8
- Asserts: https://dev.epicgames.com/documentation/en-us/unreal-engine/asserts-in-unreal-engine?application_version=5.8
- UBT / UHT / UAT: https://dev.epicgames.com/documentation/en-us/unreal-engine/unreal-build-tool-in-unreal-engine?application_version=5.8 ,
  https://dev.epicgames.com/documentation/en-us/unreal-engine/unreal-header-tool-for-unreal-engine?application_version=5.8 ,
  https://dev.epicgames.com/documentation/en-us/unreal-engine/unreal-automation-tool-for-unreal-engine?application_version=5.8
