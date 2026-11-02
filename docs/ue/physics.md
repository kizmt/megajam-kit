# Physics rules (Chaos, UE 5.8.4)

The goal: physics that looks good in a 5-10 min game without eating the 93 hours. Chaos is the only physics engine
in 5.8. Keep physics props few, simple-collided and asleep when idle. Collision channels/profiles/traces live in
`gameplay.md` (Collision); this file is about simulating things. Gameplay code is C++.

## Props that simulate

- Static Mesh Component > **Simulate Physics** on (C++: `SetSimulatePhysics(true)`). The mesh needs **simple**
  collision (our generated props have one auto convex hull) and Mobility = **Movable**.
- Profile `PhysicsActor` for loose props (object type PhysicsBody). Leave the root of a pickup actor as the mesh itself:
  a simulating child detaches from its parent actor's transform.
- **Mass** is volume x physical material Density. Generated props at odd scales get silly masses: set it explicitly.
  `SetMassOverrideInKg(NAME_None, 12.f, true)`. Check with `GetMass()`.
- **Damping**: `SetLinearDamping` / `SetAngularDamping` (0.01 / 0.0 defaults). 0.2-1.0 angular stops props spinning
  forever and helps them settle (and sleep).
- **Center of mass**: `SetCenterOfMass(FVector Offset)` nudges it (BodyInstance `COMNudge`). Lower it on tall props
  that topple too easily, offset it for a wobbly toy.
- Nanite is fine on simulating static meshes: physics uses the collision shapes, not render triangles.

## Collision for generated meshes

- **Simple** = boxes/spheres/capsules/convex hulls (physics + most traces). **Complex** = the triangle mesh
  (complex traces only).
- Epic 5.8: "if you are using UseComplexAsSimple you cannot simulate the object." **Never** set
  "Use Complex Collision As Simple" on anything dynamic. Static world architecture is where it belongs (below).
- One hull around a concave shape (chair, arch, cup, crate with open top) fills the hollow: things rest on air, and
  an arch's opening blocks (a prototype's characters could only pass around its posts). Fix with convex decomposition
  via MCP:
  `editor_toolset.toolsets.static_mesh.StaticMeshTools.generate_convex_collisions(mesh, hull_count=4,
  max_hull_verts=16, hull_precision=100000)` - replaces existing collision. Use 4-8 hulls for props the player
  interacts with; leave background props at 1 hull. More hulls = more cost per contact.
- `remove_collisions(mesh)` for pure decoration (grass, small clutter): no collision is the cheapest collision.
- Shapes passed through or under (arches, gates, tunnels, walk-in hollows): hand-placed boxes beat any decomposition.
  Check with a line trace through the opening.
- **Static world architecture uses complex-as-simple collision** (walls, terraces, buildings, ground pieces, any long
  or curved mesh); convex hulls are for compact props. On a prototype, importers kept single FBX/auto hulls on long
  and curved world meshes: one hull over a curved wall run filled its inside, roofing the road 4-5 m up and walling its
  sides. A capsule-sweep survey of a 2.8 km route found 836 invisible blocks and 1,757 low ceilings; with
  complex-as-simple on built architecture (and the blockers below removed) it found 22 and 13, and a run-speed route
  walker in `-game` finished with 0 falls. Never on anything that simulates (Epic's rule above).
- **On a Nanite mesh, complex collision comes from the fallback mesh**, so keep its fallback triangle percent high
  enough to walk on (`procedural-assets.md` says the same for kit pieces).
- **No invisible blockers on an open route.** Blockers placed "for safety" behind fence runs, gaps included, were the
  other half of those invisible walls. Limits come from visible things; check with the traversal survey
  (`debugging.md` F "Traversal checks").
- Stairs modelled with complex collision need flat-base floor checks on the character: `gameplay.md` (CMC).

## Physical materials (`PM_`)

- Asset: Physical Material (`PM_Ice`, `PM_Rubber`, `PM_Metal`). Fields (5.8 header): `Friction`, `StaticFriction`,
  `FrictionCombineMode`, `Restitution` (bounciness 0-1), `RestitutionCombineMode`, `Density` (g/cm^3, drives mass),
  `SleepLinearVelocityThreshold`, `SleepAngularVelocityThreshold`, `SurfaceType`.
- Apply on the material (`M_PBR_Master` / `MI_` Phys Material slot) so every use of that look behaves the same, or
  per component: `SetPhysMaterialOverride(PM)` / Details > Collision > Phys Material Override.
- **Surface types** (footsteps, impact VFX/SFX): name them in Project Settings > Physics > Physical Surface
  (SurfaceType1..). Read from a hit: `UPhysicalMaterial::DetermineSurfaceType(Hit.PhysMaterial.Get())`;
  traces need `Params.bReturnPhysicalMaterial = true`.

## Impulses and forces (C++)

5.8 signatures (`PrimitiveComponent.h`):

```cpp
Mesh->AddImpulse(Dir * 600.f, NAME_None, /*bVelChange*/ true);   // one-shot kick; true = ignore mass (cm/s)
Mesh->AddImpulseAtLocation(Impulse, HitLocation);                // adds spin; Impulse is mass-dependent
Mesh->AddForce(Thrust, NAME_None, /*bAccelChange*/ false);       // EVERY tick while the force lasts
Mesh->AddRadialImpulse(Origin, 500.f, 2000.f, RIF_Linear, /*bVelChange*/ true); // one component only
Mesh->AddTorqueInRadians(Torque);
```

- Classic mistakes: calling `AddForce` once (does nothing visible - it is per frame); passing an impulse without
  `bVelChange` and wondering why heavy props don't move (impulse is kg*cm/s; units are cm); calling on a component
  that is not simulating (no effect) - check `IsSimulatingPhysics()`.
- Explosion hitting many things: `URadialForceComponent::FireImpulse()` (affects everything in radius) or an overlap
  query + `AddRadialImpulse` on each. `AddRadialImpulse` on one component does not find neighbours.
- Sleeping bodies wake on impulse/force automatically; `WakeRigidBody()` if you move them some other way.

## Hit and overlap events

- `OnComponentHit` from physics contacts needs **Simulation Generates Hit Events** (`SetNotifyRigidBodyCollision(true)`,
  BodyInstance `bNotifyRigidBodyCollision`). Without it: blocking happens, event never fires. `NormalImpulse` is only
  filled for simulating bodies - use it to scale impact sounds and ignore tiny taps.
- Overlap rules (both components, skeletal-mesh default, delegate signature): `gameplay.md` "Collision". Hit handler,
  bound with a UFUNCTION:

```cpp
// .h: UFUNCTION() void OnHit(UPrimitiveComponent* HitComp, AActor* Other, UPrimitiveComponent* OtherComp,
//                            FVector NormalImpulse, const FHitResult& Hit);
Mesh->SetNotifyRigidBodyCollision(true);
Mesh->OnComponentHit.AddDynamic(this, &AMyProp::OnHit);   // in BeginPlay (not the constructor) = no stale bindings
```

- Resting contact keeps firing hits every frame: gate sounds/damage by impulse size and a cooldown.

## Constraints (doors, hinges, ropes)

- `UPhysicsConstraintComponent` between two primitives. Component1 = frame (or `nullptr` = the world),
  Component2 = the simulating part. Place the constraint at the pivot (door hinge edge), not the mesh centre.
- Door: linear all Locked; Swing1 Limited 90 deg, Swing2 Locked, Twist Locked. Spring shut: angular orientation drive
  (`SetOrientationDriveTwistAndSwing`, `SetAngularOrientationTarget`). Motor: `SetAngularVelocityTarget`.
- `SetConstrainedComponents(Frame, NAME_None, Door, NAME_None)` when wiring in C++; in a BP use Component Name 1/2.
- `SetDisableCollision(true)` between the pair (default on) so the door doesn't fight its frame.
- Breakable: `SetLinearBreakable(true, Threshold)` + `OnConstraintBroken` for kick-down doors.
- Rope/chain: a few capsule links joined by constraints (keep under ~10 links) or Cable Component (visual only,
  no collision) for decoration. Long physics chains are jittery; add substepping only if needed.
- Thrusters: `UPhysicsThrusterComponent` for constant push (hover pads) instead of hand-ticking `AddForce`.

## Physics handle (pick up / carry)

- `UPhysicsHandleComponent` on the character. Line trace (gameplay.md) -> if `IsSimulatingPhysics()`:
  `Handle->GrabComponentAtLocationWithRotation(Comp, NAME_None, Hit.ImpactPoint, Comp->GetComponentRotation());`
  Each tick: `Handle->SetTargetLocationAndRotation(CameraLoc + Fwd * HoldDist, CamRot);`. Drop: `ReleaseComponent()`.
  Throw: release, then `AddImpulse(Fwd * Speed, NAME_None, true)`.
- Tune with `SetLinearStiffness`, `SetLinearDamping`, `SetInterpolationSpeed`. The handle ticks: tick only while holding.
- Gotchas: while held, set the prop to ignore the **Pawn** channel (else the player stands on it and flies, or gets
  pushed); clamp grab mass (`GetMass()` > ~50 kg = refuse) or heavy props drag the player's aim; restore on release.

## Sleeping and stability

- A body sleeps when slow for a short while; sleeping bodies cost almost nothing. Damping and a sensible mass help.
- BodyInstance: **Start Awake** off for props placed resting on the floor; `SleepFamily` (Normal/Sensitive/Custom) and
  `CustomSleepThresholdMultiplier` to sleep sooner; `PutRigidBodyToSleep()` after you spawn/settle something.
- Jitter/explosions at start = interpenetration (props placed overlapping, hulls bigger than the visual). Separate
  them, or raise `PositionSolverIterationCount` on that body only. Stacked props: wider bases, more damping.
- `MaxAngularVelocity` caps spin on small fast props.

## CCD (fast objects)

- Small fast bodies (thrown items, physics projectiles) tunnel through thin walls. Turn on **CCD**:
  `SetUseCCD(true)` / BodyInstance `bUseCCD`. Costs more; only on the few that need it. Projectiles: prefer
  `UProjectileMovementComponent` + sweeps over simulated bodies.

## Destruction (Chaos, Geometry Collections)

- Workflow: Fracture mode (Shift+6) > select static mesh > Generate **New** (makes a Geometry Collection asset, `GC_`) > Uniform Voronoi (min/max sites) > Fracture. Preview with Explode Amount.
  Breaks on impact or via strain: Physics Field (`FS_MasterField`) or C++ `ApplyExternalStrain`,
  `ApplyBreakingLinearVelocity`, `CrumbleActiveClusters` on `UGeometryCollectionComponent`. Break callback:
  `SetNotifyBreaks(true)` + `OnChaosBreakEvent`.
- Plugins: `GeometryCollectionPlugin` (Beta) + `Fracture` (Beta, editor mode); both off by default. `AllToolsets` ->
  `DataflowAgent` already depends on GeometryCollectionPlugin; Fracture mode may still need enabling (check .uproject).
- Source mesh must be **watertight** with no self-intersections (Epic: open faces "perform worse ... unpredictable
  results"). AI-generated meshes are often not watertight: expect broken-looking interiors or failed fractures.
- **Nanite**: supported - Geometry Collection > Nanite > **Enable Nanite** (+ `bEnableNaniteFallback`). Not inherited
  from the source static mesh; set it per GC. Interior faces use separate material slots: assign an `MI_`.
- Cost: every loose piece is a rigid body. 20-50 pieces per object, a handful of objects at once. Use clustering,
  **Removal** (`bRemoveOnMaxSleep`, Sleep Min Max, Removal Duration) so debris disappears, and avoid fracturing at runtime
  of many GCs in one frame. Each fracture also adds an asset with its own setup time.
- **Jam verdict**: practical for 1-3 hero breakables (a wall, a statue, a final set-piece), budget ~2-3 h for the first
  one. Not for every crate. Cheaper default: on hit, hide the mesh, spawn 3-6 pre-cut static chunks (or our prop's
  smaller variants) with `AddRadialImpulse`, plus Niagara dust; remove after a few seconds.

## Vehicles, cloth, ragdolls (brief)

- **Chaos Vehicles**: `ChaosVehiclesPlugin` (Experimental, off by default). Use the Vehicle template as reference
  only (the jam forbids lightly modified templates); write our own classes from its pattern. Only if the game is about driving.
- **Cloth**: Chaos Cloth (enabled by default) on skeletal meshes, painted in the Cloth Panel / cloth asset. Costly to
  author; skip unless a character already ships with cloth.
- **Ragdoll on death**: needs a Physics Asset (`PHYS_`) on the skeletal mesh. C++:
  `Mesh->SetCollisionProfileName(TEXT("Ragdoll")); Mesh->SetAllBodiesSimulatePhysics(true); Mesh->WakeAllRigidBodies();`
  and disable the capsule's collision + stop CharacterMovement. Hit-reaction blend: `SetAllBodiesBelowSimulatePhysics`.
- **Physics Control** plugin (not experimental, off by default): active ragdoll / physical animation. Out of jam scope.
- Physics Assets via MCP (below) for retargeted/generated characters whose auto bodies are wrong.

## Performance and determinism

- Budget (no measured number yet on the target PC): aim **< ~100 awake simulating bodies**, a few hundred total (unverified -
  measure with `stat physics` / `stat chaos` and Chaos Visual Debugger). Sleeping bodies are near free; awake contacts
  are what cost. Instanced clutter: collision off unless it matters (`pcg.md`).
- Sub-stepping (Project Settings > Physics > **Substepping**, Max Substep Delta Time, Max Substeps): improves stiff
  ragdolls/chains at CPU cost; hit callbacks may fire several times per frame. Off by default; turn on only to fix
  visible jitter. Async physics (`bTickPhysicsAsync`, fixed step) also exists - don't switch mid-jam.
- Determinism: Chaos is not deterministic across frame rates by default (`bEnableEnhancedDeterminism` and fixed-step
  async physics help). Never build a puzzle that needs physics to replay identically; gate progress on triggers, not on
  where a stack of props ends up. Kill-Z / reset volume for props that fall out of the level.

## What the agent can do via MCP

- `StaticMeshTools.generate_convex_collisions` / `remove_collisions` (EditorToolset, Python) - see Collision.
- **PhysicsToolsets** (`UPhysicsAssetToolset`, Experimental, enabled through `AllToolsets`) - Physics Assets only:
  `CreateFromMesh(MeshPath, bAssignToMesh)`, `GetBodyNames`, `GetBodyShapes`, `SetSphere`/`SetCapsule`/`SetBox`,
  `RemoveShape`, `AddBody`/`RemoveBody`, `Get/SetBodyPhysicsMode` (Default/Kinematic/Simulated),
  `Get/SetBodyMassScale`, `GetConstraints`, `AddConstraint`, `SetConstraintLimits` (swing1/swing2/twist
  Free/Limited/Locked + degrees), `RemoveConstraint`. Toolset id probably `PhysicsToolsets.PhysicsAssetToolset`
  (unverified, by analogy with `EditorToolset.LogsToolset`).
- No toolset for physical materials, constraints in levels, Simulate Physics or Geometry Collections: set those in C++
  or via generic object/property tools. `DataflowAgent` can edit Dataflow graphs (Dataflow-driven fracture is possible
  in principle; untested, don't plan on it).

## Collision lessons (from a prototype)

- **Meshes built with Geometry Script have no simple collision**, so characters fall through them
  (`editor-scripting.md`). Complex-as-simple is fine for a few low-poly walkable pieces; never for dense generated meshes.
- **Match collision to the visible shape** after swapping a mesh (e.g. a shorter bumper): a taller hidden collider
  makes jumps feel unfair.

## Verified against

- 5.8.4 headers on the target PC: `PrimitiveComponent.h` (AddImpulse/AddForce/AddRadialImpulse/AddTorqueInRadians, SetUseCCD,
  SetMassOverrideInKg, SetCenterOfMass, OnComponentHit note on Simulation Generates Hit Events),
  `PhysicsEngine/PhysicsHandleComponent.h`, `PhysicsConstraintComponent.h`, `BodyInstance.h`,
  `PhysicalMaterials/PhysicalMaterial.h`, `SkeletalMeshComponent.h`, `PhysicsSettings.h`, `PhysicsSettingsCore.h`,
  `GeometryCollectionObject.h` (EnableNanite, bRemoveOnMaxSleep), `GeometryCollectionComponent.h`.
- Toolsets: `PhysicsToolsets/.../PhysicsAssetToolset.h` + `.uplugin`, `AllToolsets.uplugin`,
  `EditorToolset/.../toolsets/static_mesh.py`, `DataflowAgent.uplugin`/`DataflowAgentToolset.h`.
- Plugin flags from `.uplugin` files: GeometryCollectionPlugin/Fracture Beta, ChaosVehiclesPlugin Experimental,
  PhysicsControl neither, all off by default; ChaosCloth on by default.
- Not tested in-editor: ragdoll snippet, handle Pawn-ignore trick, body-count budget, destruction time estimate.

## Sources (5.8)

- Physics overview: https://dev.epicgames.com/documentation/en-us/unreal-engine/physics-in-unreal-engine?application_version=5.8
- Simple vs complex collision: https://dev.epicgames.com/documentation/en-us/unreal-engine/simple-versus-complex-collision-in-unreal-engine?application_version=5.8
- Physics constraint component: https://dev.epicgames.com/documentation/en-us/unreal-engine/physics-constraint-component-user-guide-in-unreal-engine?application_version=5.8
- Physical materials: https://dev.epicgames.com/documentation/en-us/unreal-engine/physical-materials-in-unreal-engine?application_version=5.8
- Sub-stepping: https://dev.epicgames.com/documentation/en-us/unreal-engine/physics-sub-stepping-in-unreal-engine?application_version=5.8
- Destruction quick start: https://dev.epicgames.com/documentation/en-us/unreal-engine/destruction-quick-start?application_version=5.8
- Geometry Collections: https://dev.epicgames.com/documentation/en-us/unreal-engine/geometry-collections-user-guide?application_version=5.8
- Nanite (GC Enable Nanite): https://dev.epicgames.com/documentation/en-us/unreal-engine/nanite-virtualized-geometry-in-unreal-engine?application_version=5.8
- Vehicles: https://dev.epicgames.com/documentation/en-us/unreal-engine/vehicles-in-unreal-engine?application_version=5.8
