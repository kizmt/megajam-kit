# Game AI and navigation (UE 5.8.4)

For games with AI-driven agents: enemies, NPCs, companions, creatures. Scope: a handful of agents, gameplay in C++,
tick off by default. Facts below were checked against the 5.8 headers, `BaseEngine.ini`/`BaseGame.ini`, Epic's 5.8
C++ templates and the 5.8 docs (see bottom).

## Decision: how to drive behaviour

| Option | 5.8 status | Use for the jam? |
|---|---|---|
| **Plain C++ state machine** in the AIController (enum + timers + perception/move callbacks) | Always works | **Default.** 100% C++, diffable, agent can write and fix it alone |
| **StateTree** (`StateTree` + `GameplayStateTree` plugins) | Not beta/experimental in 5.8. All 5.8 C++ templates' AI uses it (Combat, Shooter, SideScrolling, TwinStick) | Good if a human edits the tree. Tasks/conditions in C++, tree asset = data |
| **Behavior Tree + Blackboard** | Still supported (AIModule) | Skip. Older pattern, two assets, more glue |
| Mass / MassGameplay (crowds) | MassGameplay plugin is **Experimental** | Skip (hundreds of agents only) |

Why C++ FSM by default: Epic's `AIModuleToolset` and `StateTreeToolset` (Experimental, editor-only) only **inspect**
assets (`list_nodes`, `get_blackboard`, `get_root_states`, `get_tasks`, `get_transitions`, ...). Nothing creates or edits
a BT or StateTree, so an agent-authored tree means hand-editing in the editor. Python authoring of StateTree assets is
(unverified). Pick StateTree when the director wants to tune behaviour visually; keep every task/condition in C++.

## Core setup (any option)

- Enemy = `ACharacter` subclass (CharacterMovement gives nav walking, slopes, avoidance). A bare `APawn` needs a movement
  component (`UFloatingPawnMovement`) or it never moves.
- In the enemy constructor (pattern from `CombatEnemy.cpp`):
  ```cpp
  AIControllerClass = AEnemyAIController::StaticClass();
  AutoPossessAI = EAutoPossessAI::PlacedInWorldOrSpawned; // default is PlacedInWorld: spawned enemies get NO controller
  bUseControllerRotationYaw = false;
  GetCharacterMovement()->bOrientRotationToMovement = true; // or bUseControllerDesiredRotation + SetFocus
  ```
- Controller = `AAIController` subclass. Create components in its constructor, start logic in `OnPossess`, stop in
  pawn death (template: `GetPathFollowingComponent()->AbortMove(*this, FPathFollowingResultFlags::UserAbort)`,
  `UnPossess()`, `Destroy()`).
- Build.cs: `AIModule`, `NavigationSystem` (nav queries), `GameplayTasks` (if using AITasks, unverified need),
  `StateTreeModule` + `GameplayStateTreeModule` (only with StateTree; plugins must be enabled in `.uproject`,
  both are `EnabledByDefault: false` in the engine but the 5.8 TP templates enable them). See `cpp.md`.

## Navigation mesh

- Place a **Nav Mesh Bounds Volume** covering every walkable area. Press **P** in the viewport to show it (green).
  `RecastNavMesh-Default` appears in the Outliner; its Details hold Generation + Display (Draw Poly Edges, Draw Offset).
- Engine defaults (`BaseEngine.ini`): `AgentRadius=34`, `AgentHeight=144`, `AgentMaxStepHeight=35`, `AgentMaxSlope=44`,
  `CellSize=19`, `TileSizeUU=1000`. ACharacter's default capsule (radius 34) matches; the TP template's 42
  (`gameplay.md`) is wider than the default agent (check 7 below). Gaps narrower than 2x radius are
  not walkable; a much bigger enemy needs its own Supported Agent in Project Settings > Navigation System.
- **Runtime Generation** (Project Settings > Navigation Mesh, or the RecastNavMesh actor), `ERuntimeGenerationType`:
  - `Static` (engine default) - built in editor, saved with the level. Cheapest. Fine for hand-built/PCG-in-editor levels.
  - `DynamicModifiersOnly` - static geometry, but nav modifiers (doors, hazards) can change at runtime.
  - `Dynamic` - full rebuild of dirty tiles at runtime. Needed if level geometry is spawned/moved at runtime
    (runtime PCG, destructible walls). Costs CPU on change; tiles are 10 m, so small changes are cheap.
- **Nav Modifier Volume** / `UNavModifierComponent`: mark areas (`NavArea_Null` = blocked, custom area = higher cost).
  5.8 lets a static mesh carry its own nav area (a flag and area class on its NavCollision, e.g. "a couch that AI
  prefers to walk around"): cheaper than hand-placed volumes on props. Untested, including from Python.
- **Nav Link Proxy** (`ANavLinkProxy`): jumps/drops between disconnected nav. Simple links just path through; the
  character still has to physically make the jump (launch it yourself on a smart link event).
- Movable actors that should cut holes: set the component's "Can Ever Affect Navigation" and use Dynamic generation.
- Navigation Invokers (`UNavigationInvokerComponent`): generate nav only around agents. Only for huge worlds; skip.
- After any level change with `Static`: confirm P still shows nav where needed, then save the level (nav data is saved).
- **Scripted nav build (editor Python, 5.8.4):** `unreal.SystemLibrary.execute_console_command(editor_world,
  'RebuildNavigation')` builds it, but only once nav data exists (`FNavigationSystemExec::Exec_Runtime` needs a
  `RecastNavMesh`); before that it echoes the command and does nothing (no "Build started" log line). Spawning a
  `NavMeshBoundsVolume` by script didn't create the RecastNavMesh; after an editor restart the map loaded with
  `RecastNavMesh-Default` and the command worked. Check the result with P or the log, not the echo.
- **World Settings `enable_navigation_system` always reads False: ignore it.** It is `DEPRECATED_bEnableNavigationSystem`
  (UE 4.22); `AWorldSettings::PostLoad` moves it into `NavigationSystemConfig` and resets it on every load. The real
  switch is `NavigationSystemConfig` (`GetNavigationSystemConfig()`). Don't set the old flag and save.

### Why won't my AI move? (check in order)

0. No floor collision: a downward line trace onto the floor must hit. Script-built level meshes can have no simple
   collision, so the navmesh builds empty and pawns fall (`editor-scripting.md`, Geometry Script). Hidden-in-game
   stand-in actors still collide (a `SkeletalMeshActor` stand-in kept `PhysicsActor` collision and trapped an enemy in
   `MOVE_FALLING`): set them to `NoCollision`.
1. No nav: press P. No green = no bounds volume, or it doesn't overlap the floor, or nav not rebuilt/saved.
2. No controller: spawned pawn with `AutoPossessAI = PlacedInWorld` (default), or `AIControllerClass` unset.
   Check `GetController()` in the log or the apostrophe debugger (no AI shown).
3. Destination off the mesh: `MoveToLocation` defaults `bProjectDestinationToNavigation = false` - pass `true`, or
   use `UNavigationSystemV1::ProjectPointToNavigation` / `GetRandomReachablePointInRadius` to pick points.
4. Return value ignored: `MoveTo*` returns `EPathFollowingRequestResult::Failed` / `AlreadyAtGoal` / `RequestSuccessful`.
   Log it. `AlreadyAtGoal` with a big AcceptanceRadius looks like "does nothing".
5. Logic never started: StateTree component with `SetStartLogicAutomatically(false)` and no `StartLogic()` call.
6. Movement blocked: `MaxWalkSpeed` 0, movement mode None, root-motion montage playing, or capsule stuck in geometry.
7. Nav agent mismatch: capsule much wider than `AgentRadius`, or Dynamic geometry not rebuilt yet (first frames).

## MoveTo from C++

```cpp
// AIController.h (5.8): returns EPathFollowingRequestResult::Type
MoveToActor(Goal, AcceptanceRadius=-1, bStopOnOverlap=true, bUsePathfinding=true, bCanStrafe=true, FilterClass={}, bAllowPartialPath=true);
MoveToLocation(Dest, AcceptanceRadius=-1, bStopOnOverlap=true, bUsePathfinding=true,
               bProjectDestinationToNavigation=false, bCanStrafe=true, FilterClass={}, bAllowPartialPath=true);

// completion: override in the controller (event, no polling)
virtual void OnMoveCompleted(FAIRequestID RequestID, const FPathFollowingResult& Result) override;
//   Result.IsSuccess(); Result.Code: EPathFollowingResult::Success / Blocked / OffPath / Aborted / Invalid
```

- `MoveToActor` keeps re-pathing to a moving goal (use for chase). Calling MoveTo again aborts the previous move
  (`OnMoveCompleted` fires with `Aborted` - ignore aborts you caused).
- `StopMovement()` to halt; `SetFocus(Actor)` / `ClearFocus(EAIFocusPriority::Gameplay)` to face a target while moving.
- `bAllowPartialPath=true` (default) walks as close as possible to an unreachable goal - good for chase.

## AI Perception

- `UAIPerceptionComponent` on the **controller** (template: created in C++ ctor, senses configured on the BP subclass).
  In C++: `NewObject`/`CreateDefaultSubobject<UAISenseConfig_Sight>`, set fields, `Perception->ConfigureSense(*Cfg)`,
  `SetDominantSense(Cfg->GetSenseImplementation())`.
- Bind `OnTargetPerceptionUpdated(AActor*, FAIStimulus)` (`Stimulus.WasSuccessfullySensed()`) and
  `OnTargetPerceptionForgotten(AActor*)`. Event-driven: no tick needed.
- Sight defaults (`BaseGame.ini`): `SightRadius=3000`, `LoseSightRadius=3500`, `PeripheralVisionAngleDegrees=90`
  (half-angle), **`DetectionByAffiliation=(bDetectEnemies=true)` only**.
- **Gotcha #1:** the player has no team, so it is *Neutral* and the default sight config never sees it. Either set
  `DetectionByAffiliation.bDetectNeutrals = true` (Epic's suggestion, then filter by tag like the templates' `TeamTag`),
  or implement `IGenericTeamAgentInterface` on the player controller/pawn.
- Pawns auto-register as sight sources (`AISense_Sight` sets `bAutoRegisterAllPawnsAsSources`). Non-pawn targets need
  `UAIPerceptionStimuliSourceComponent` (`bAutoRegisterAsSource`, `RegisterAsSourceForSenses`).
- Hearing: `UAISense_Hearing::ReportNoiseEvent(World, Location, Loudness, Instigator, MaxRange, Tag)` from gunshots /
  footsteps; listener needs a Hearing config (default `HearingRange=768`, also enemies-only - set Neutrals).
- Damage: `UAISense_Damage::ReportDamageEvent(...)` in `TakeDamage` so a shot enemy turns to the shooter.
- Forgetting: Project Settings > AI System > Forget Stale Actors + per-sense Max Age.
- `UPawnSensingComponent` is the legacy system; don't use it.

## EQS, Smart Objects, Mass (brief)

- **EQS** (AIModule): asset-based queries "best point to stand / cover / flee". Combat template uses it with C++
  contexts (`EnvQueryContext_Player`, `_Danger`) and StateTree's Run Env Query task. Jam: usually overkill - a few
  `GetRandomReachablePointInRadius` calls plus a distance/line-of-sight check in C++ does the same for one enemy type.
- **Smart Objects** (plugin, off by default): claimable world slots ("sit here", "use terminal") for ambient NPCs.
- **NPC routines (ambient townsfolk, 6-12 NPCs): a plain C++ world subsystem was enough** on the rehearsal: it holds
  spot claims, fans out world events to the NPCs and pairs NPCs up. No Mass, StateTree or Smart Objects plugin.
  StateTree + Smart Objects were not tried, so don't make them the default. Status: StateTree and Smart Objects are
  not beta and off by default, MassGameplay is Experimental ("Verified against"), and neither StateTree nor Smart
  Objects is on Epic's 5.8 Beta or Experimental hub; Mass Avoidance is Experimental on the 5.8 hub. MassCrowd,
  ZoneGraph and UAF Experimental is the rehearsal's research, unverified here.
- **Mass**: ECS crowds/traffic; MassGameplay is Experimental. Skip. For 10-30 moving agents use
  `ADetourCrowdAIController` or CharacterMovement RVO avoidance instead. (5.8 split out a `MassCore` module and moved
  Mass Signals into core; nothing changes for us.)

## Patterns (C++ FSM)

State enum on the controller: `Idle/Patrol, Chase, Attack, Flee, Dead`. Drive it with events, not tick:
- **Patrol**: array of `TObjectPtr<AActor>` waypoints (or random reachable points); `OnMoveCompleted` -> short timer ->
  next point.
- **Chase**: on perception sensed -> `MoveToActor(Target, AttackRange * 0.8f)`; on lost -> `MoveToLocation(LastSeen)` then
  back to Patrol after a timer.
- **Attack**: a looping `FTimerHandle` (e.g. 0.25 s) checks range + line of sight; play montage / fire; leave when out of
  range. Damage via `UGameplayStatics::ApplyDamage` (see `gameplay.md`).
- **Flee**: below HP threshold, pick `GetRandomReachablePointInRadius` points that increase distance from the threat.
- **Companion**: `MoveToActor(Player, AcceptRadius)` re-issued on a short timer only when farther than a larger
  follow distance, so it doesn't jitter at the edge (one prototype's values: 300 / 500 cm, 0.5 s).

## StateTree in C++ (if chosen)

- Controller: `UStateTreeAIComponent* StateTreeAI = CreateDefaultSubobject<UStateTreeAIComponent>(...)`
  (schema `StateTreeAIComponentSchema` guarantees an AIController in context). Templates call
  `SetStartLogicAutomatically(false)` and `StartLogic()` in `OnPossess`; `StopLogic("")` on death.
- Task = `USTRUCT` deriving `FStateTreeTaskCommonBase` + an instance-data `USTRUCT`
  (`using FInstanceDataType = ...; GetInstanceDataType()`), override `EnterState` / `ExitState` / `Tick`.
  Conditions derive `FStateTreeConditionCommonBase` and override `TestCondition`. Read data via
  `Context.GetInstanceData(*this)`.
- **Event-driven tasks**: set `bShouldCallTick = false` in the task ctor, return `EStateTreeRunStatus::Running`, and
  finish later from a delegate with `Context.MakeWeakExecutionContext()` -> `WeakContext.FinishTask(
  EStateTreeFinishTaskType::Succeeded)` (exactly what `CombatStateTreeUtility.cpp` does). Thread safety is yours
  (5.6 notes): finish only from game-thread delegates (timers, perception, `OnMoveCompleted`).
- Built-in `Move To` task (`FStateTreeMoveToTask`, GameplayStateTree) and `Run Env Query` exist.
- Send gameplay events into the tree: `StateTreeAI->SendStateTreeEvent(FGameplayTag, Payload)`.
- Reference only: read `Variant_Combat/AI` (`CombatEnemy`, `CombatAIController`, `CombatStateTreeUtility`,
  `ST_CombatEnemy`) for the pattern, then write our own classes and tree; the jam forbids lightly modified templates
  (CLAUDE.md). Debug with the StateTree Debugger (see docs).
- **Editor help, 5.7-5.8.** Copy and paste tasks, conditions and transitions between states and assets; a Rewind
  Debugger track for StateTree; "Re-Enter State" (off by default); 5.8 adds a definable starting state and flags an
  out-of-date tree: recompile it before PIE when the flag shows.

## Recommended setup for an enemy (if the game has one)

1. `AEnemyCharacter : ACharacter` - HP, `TakeDamage`, attack montage, `OnDeath` delegate. Ctor: `AIControllerClass`,
   `AutoPossessAI = PlacedInWorldOrSpawned`, `bOrientRotationToMovement = true`, `MaxWalkSpeed` from a data asset.
   Actor tick off is fine: see `gameplay.md` "Character and CharacterMovementComponent" (Tick).
2. `AEnemyAIController : AAIController` - ctor creates `UAIPerceptionComponent` + `UAISenseConfig_Sight`
   (radius ~1500-2500, half-angle 60-80, `bDetectNeutrals = true`) and Hearing. Binds `OnTargetPerceptionUpdated`.
   Tick off unless needed (verify path following still runs - it is its own component).
3. FSM in the controller (`EEnemyState`), transitions in `SetState()`, driven by perception events, `OnMoveCompleted`
   and one low-rate timer (0.2-0.5 s) for range checks. Log every transition with `UE_VLOG` (below).
4. `BP_Enemy` subclass only assigns mesh, AnimBP, montages, sounds, tuning data asset.
5. Level: Nav Mesh Bounds Volume, P to verify, keep `Static` unless geometry changes at runtime.
6. Spawner: `SpawnActor` with `AdjustIfPossibleButAlwaysSpawn`; spawn points on the navmesh; pool if respawning often.
7. Test: PIE, apostrophe debugger, check every `MoveTo*` return value in the log once.

## Debugging

- **Apostrophe (')** in PIE = AI debugging tools (gameplay debugger). Numpad 0 NavMesh, 1 AI (controller, path
  following, active task), 2 Behavior Tree, 3 EQS, 4 Perception (sense radii, last known location). Look at an agent
  to select it. Requires the AI to run a BT or have AI Perception.
- `show Navigation true/false` in console toggles nav drawing in game.
- **Visual Logger**: records per-frame agent snapshots you can scrub. Log from C++ with
  `UE_VLOG(this, LogTemp, Log, TEXT("State %s"), ...)`, `UE_VLOG_LOCATION(...)`, `UE_VLOG_SEGMENT(...)`
  (compiled out in Shipping). Open via Tools > Debug > Visual Logger (menu path unverified).
- StateTree: StateTree Debugger window (docs: statetree-debugger-quick-start-guide).

## Performance (a handful of agents = cheap; keep it that way)

- Our cost is our own logic: no per-frame polling, timers at 0.2-0.5 s, perception events. Respect `performance.md`.
- Don't disable engine component ticks we rely on (CharacterMovement, PathFollowing, StateTree component).
- StateTree tasks: `bShouldCallTick = false` unless they really need per-frame work; the StateTree scheduler can then
  skip ticking idle trees (`bConsideredForScheduling`, header comment).
- Sight is time-sliced (`AISense_Sight` `MaxTracesPerTick`, `MaxTimeSlicePerTick`); fine for <20 agents. Keep sight
  radius modest and disable perception on dead/far agents (`SetSenseEnabled`).
- Many agents: animation and CharacterMovement dominate before AI does - use `stat game`, `stat anim`, Insights.
- Dynamic navmesh rebuilds cost CPU when geometry changes; avoid moving nav-affecting actors every frame.

## LLM-powered NPCs

UEFN has AI-powered NPC conversations (Personas, Apr 2026, Epic-hosted models). Plain UE 5.8 has nothing built in:
a runtime LLM call would need our own backend + API key in the build, and the jam rules forbid requiring extra
software to run. Use pre-written dialogue (optionally LLM-generated **offline** during development) instead.

## AI characters slide without walk/run animation

Epic's template ABP plays locomotion only when the movement component reports **acceleration**, and path following
sets velocity directly by default, so AI-driven characters glide in their idle pose. Fix in the AI character's
constructor: `GetCharacterMovement()->NavMovementProperties.bUseAccelerationForPaths = true;` (5.8 moved the flag into
`FNavMovementProperties`). Alternative: base the ABP's ShouldMove on speed only. Seen on a prototype; confirmed in the
5.8 API reference and Epic forum threads.

## Verified against

- `Engine/Source/Runtime/AIModule/Classes/AIController.h` (MoveToActor/MoveToLocation signatures, OnMoveCompleted,
  SetFocus, PerceptionComponent), `Navigation/PathFollowingComponent.h` (result enums), `Perception/*`
  (AISenseConfig_Sight fields, AIPerceptionComponent delegates, StimuliSource, ReportNoiseEvent/ReportDamageEvent),
  `AIPerceptionTypes.h` (affiliation flags default false), `Private/Perception/AISense_Sight.cpp` (auto-register pawns).
- `Engine/Source/Runtime/NavigationSystem/Public/NavigationData.h` (`ERuntimeGenerationType`), nav headers list.
- `Engine/Config/BaseEngine.ini` (nav defaults), `BaseGame.ini` (sense defaults); `GameFramework/Pawn.h`, `Pawn.cpp`
  (`AutoPossessAI = PlacedInWorld`).
- Plugins: StateTree / GameplayStateTree / SmartObjects (not beta, off by default), MassGameplay (Experimental);
  `GameplayStateTree/.../StateTreeAIComponent.h`, `StateTreeComponent.h`, `StateTreeMoveToTask.h`;
  `StateTree/.../StateTreeTaskBase.h` (tick flags).
- Toolsets: `Plugins/Experimental/Toolsets/AIModuleToolset`, `StateTreeToolset` (Python sources; inspection only).
- Templates: `TP_ThirdPerson/Variant_Combat/AI/*` (CombatEnemy, CombatStateTreeUtility), `TP_FirstPerson/Variant_Shooter/AI/ShooterAIController.*`.
- No StateTree agent skill found in the engine install.

## Sources (5.8)

- AI hub: https://dev.epicgames.com/documentation/en-us/unreal-engine/artificial-intelligence-in-unreal-engine?application_version=5.8
- StateTree overview: https://dev.epicgames.com/documentation/en-us/unreal-engine/overview-of-state-tree-in-unreal-engine?application_version=5.8
- StateTree quick start: https://dev.epicgames.com/documentation/en-us/unreal-engine/statetree-quick-start-guide?application_version=5.8
- Basic navigation: https://dev.epicgames.com/documentation/en-us/unreal-engine/basic-navigation-in-unreal-engine?application_version=5.8
- Navigation hub (modifiers, links, invokers, avoidance): https://dev.epicgames.com/documentation/en-us/unreal-engine/navigation-system-in-unreal-engine?application_version=5.8
- AI Perception: https://dev.epicgames.com/documentation/en-us/unreal-engine/ai-perception-in-unreal-engine?application_version=5.8
- AI debugging: https://dev.epicgames.com/documentation/en-us/unreal-engine/ai-debugging-in-unreal-engine?application_version=5.8
- EQS / Smart Objects / Mass: `environment-query-system-in-unreal-engine`, `smart-objects-in-unreal-engine`,
  `mass-entity-in-unreal-engine` (same URL pattern; not read in detail)
- Beta / Experimental hubs: https://dev.epicgames.com/documentation/en-us/unreal-engine/beta-features?application_version=5.8 ,
  https://dev.epicgames.com/documentation/en-us/unreal-engine/experimental-features?application_version=5.8
- Release notes (StateTree, Mass, nav areas on meshes): 5.6 https://dev.epicgames.com/documentation/en-us/unreal-engine/unreal-engine-5-6-release-notes?application_version=5.6 ,
  5.7 https://dev.epicgames.com/documentation/en-us/unreal-engine/unreal-engine-5-7-release-notes?application_version=5.7 ,
  5.8 https://dev.epicgames.com/documentation/en-us/unreal-engine/unreal-engine-5-8-release-notes
- UEFN Personas (LLM NPCs): https://dev.epicgames.com/documentation/en-us/fortnite/developing-personas-overview-in-unreal-editor-for-fortnite
