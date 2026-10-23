# Characters and animation (UE 5.8.4)

The riskiest part of the pipeline. Generated character (Tripo rig) + Epic's stock animations, retargeted with IK Rig.
Everything here was checked against engine headers, the Python stub and template content on GIZMO, plus Epic's 5.8 docs
and Tripo's API docs (list at the bottom). Anything not checked is marked (unverified).

## Decisions

- **1-3 characters max.** Player + 1-2 NPC types. Each one costs a rig, an IK Rig, a retargeter and an ABP copy.
- **`ACharacter` in C++** (see `gameplay.md`). The Anim Blueprint does the anim graph only. Gameplay state (attacking,
  stunned, dead) is decided in C++ and reaches animation as **montages** or as variables on a C++ `UAnimInstance` parent.
- **Default animation source: Epic's template set, retargeted.** Retarget `ABP_Unarmed` (with its blend space and
  idle/jump/fall/land) plus the attack montages from the Third Person template onto the Tripo skeleton in one batch.
  We don't author a state machine. Tripo's own preset animations are the fallback, and the source for extra emotes.
- **Rig in Tripo with a known bone convention:** `tripo anim rig --spec unreal` (Mannequin bone names) or `--spec mixamo`.
  UE's auto-characterizer recognizes both (UE5/UE4 and Mixamo templates). The default `tripo` spec is not a known
  template, so auto-setup would fail and the chains would have to be hand-built.
- **No Nanite on characters, no Motion Matching / Game Animation Sample, no runtime retargeting.**
- Materials: **`MI_<Name>` of the master material** (it has `bUsedWithSkeletalMesh`). Import with materials off, then
  `set_material`. A missing usage flag shows as default grey in a packaged build.
- Names (see `naming.md`): `SK_`, `SKEL_`, `PHYS_`, `ABP_`, `BS_`, `AM_`, `AS_`, `IK_`, `RTG_`.
  Folder: `/Game/Characters/<Name>/`.

## What the agent can drive (MCP + editor Python)

| Need | Tool | Notes |
|---|---|---|
| Import skeletal FBX | `SkeletalMeshTools.import_file(folder, name, file, skeleton=None, import_materials, import_textures, import_animations, create_physics_asset)` | Pins the **legacy `FbxFactory` + `FbxImportUI`**, so it takes **FBX only** (not GLB). `skeleton=None` creates a new Skeleton. Assets are **not saved** (`task.save=False`), so save afterwards |
| Import anything (GLB, FBX) with default importer | `MegajamTools.import_any` | Goes through **Interchange**, which handles FBX by default in 5.8 (`Interchange.FeatureFlags.Import.FBX` = true) |
| Inspect mesh | `SkeletalMeshTools.get_bone_names / get_bone_parent / get_bone_children / get_bounds / get_skeleton / get_lod_count / get_vertex_count / get_morph_target_names` | `get_bone_names` = root first. Use it to check the rig before retargeting |
| Materials, sockets | `get_material_slots / set_material`, `add_socket(mesh, socket, bone) / set_socket_transform / ...` | Sockets for weapons and hand props |
| Physics asset | `get_physics_asset / assign_physics_asset`; PhysicsToolsets plugin has `CreateFromMesh, SetCapsule, AddBody...` | PhysicsToolsets is a separate experimental plugin (check it's enabled) |
| IK Rig, Retargeter, batch retarget | **No toolset.** Use editor Python: `IKRigController`, `IKRetargeterController`, `IKRetargetBatchOperation` (all in the stub) | See script below |
| Anim BP / Blend Space / Montage assets | Python: `AnimBlueprintFactory` (target_skeleton, parent_class, preview_skeletal_mesh), `BlendSpaceFactory1D` / `BlendSpaceFactoryNew`, `AnimMontageFactory`; `BlendSpace.sample_data` / `blend_parameters` are writable; `BlueprintEditorLibrary.reparent_blueprint / compile_blueprint` | Creating the assets is scriptable |
| **Anim graph / state machine nodes** | **Not scriptable** (no toolset covers anim graphs) | Editor UI only. That's why we retarget `ABP_Unarmed` instead of authoring one |
| AnimationAssistantToolset | Sequencer + Control Rig only (level sequences, keyframing, `bake_to_control_rig`, FBX to/from rig) | Useless for gameplay characters; only for cutscenes |

## Skeletal mesh import essentials

- **Format:** prefer **FBX** (`tripo ... --out-format fbx`). `import_file` can't take GLB. Interchange can import GLB
  skins via `import_any`, but that path hasn't been tested with Tripo rigs (unverified).
- **One Skeleton per character.** First import creates `SKEL_`; later animation-only FBX imports must pass
  `skeleton=<that Skeleton>` or they create a duplicate skeleton and nothing will share.
- **Scale check (do it every time):** `get_bounds(mesh)`: a human is ~180 cm tall (box_extent.z ~ 90). 1.8 or 18000
  means a unit-scale problem. Our Blender export settings fix the 100x case (see `PIPELINE.md`).
- **Facing:** UE is X-forward, Z-up. The Mannequin mesh faces +Y and the Character BP rotates the mesh component
  yaw -90 and drops it by the capsule half-height (template capsule 42 x 96). Do the same in the BP subclass, then
  confirm with a PIE screenshot that the character runs face-first.
- **Root bone:** the mesh pivot is the root bone (FBX pipeline doc). Mixamo-convention rigs have `Hips` as root (no
  ground-level `root`). That's fine for in-place locomotion. Root motion needs a ground-level root, so stick to
  in-place animations (see Root motion).
- **Blender export gotchas** (community knowledge, unverified for 5.8 Interchange): untick *Add Leaf Bones*. An armature
  object that isn't named `Armature` gets imported as an extra root bone. Don't apply transforms that rescale the armature
  after skinning.
- **`gen/blender/prep.py` is built for static props** (single mesh, pivot at base, decimation). Don't run it blind on a
  rigged character: joining or re-pivoting can break the rig. Reduce polycount at generation (`--faces`) **before** rigging.
  First try importing Tripo's rigged FBX directly. Go through Blender only if the scale/axis check fails.
- **Physics asset:** `create_physics_asset=True` gives one capsule per major bone. It's needed for per-bone hits, ragdoll and
  accurate bounds. Without one, tick "Component Use Fixed Skel Bounds" on the mesh component (Epic optimization page).
- **Morph targets:** Tripo rigs have none. Leave off.
- **Animations in one FBX:** Epic's FBX pipeline page says only a single animation per file. Tripo can put up to 5
  presets in one output, so import and count the AnimSequences (unverified how 5.8 handles multi-take files).

| Symptom | Cause / fix |
|---|---|
| Tiny or giant character | FBX unit scale. Check `get_bounds`, re-export with kit settings |
| Lies on its back / faces sideways | Axis. Fix mesh-component rotation in BP (yaw -90 typical). Pitch 90 means a Y-up export: fix in Blender |
| Extra bone above `Hips` named after the Blender object | Armature object not named `Armature` (unverified) |
| Animation imports as new skeleton | `skeleton=` not passed |
| Grey in packaged build | MI's parent missing skeletal usage flag (master has it, so check the MI's parent) |
| Mesh explodes when animated | Wrong skeleton/retarget pose, or bone names changed between mesh and anim exports |

## IK Rig and IK Retargeter (5.8)

- **IK Rig** (`IK_<Name>`) per skeletal mesh: **retarget root** (UI "Set Retarget Root", `GetPelvisBone`; = pelvis/hips),
  **retarget chains** (Spine, Neck, Head, LeftArm/RightArm, LeftLeg/RightLeg, clavicles, fingers optional). **Goals**
  are optional; plain FK chains are enough for locomotion. Goals + a solver are only needed for foot planting.
- **Auto setup:** `IKRigController.apply_auto_generated_retarget_definition()` matches the skeleton against built-in
  templates and creates pelvis + all chains. Returns **False** if nothing matches, and there is **no procedural fallback**
  in 5.8 (`IKRigAutoCharacterizer.cpp`: "TODO"). Templates in 5.8: UE4, UE5, Daz3d, **Mixamo**, CC4, Xsens, mGear,
  HumanIK, Vicon, Optitrak, Mocopi, AdvancedSkeleton, MoveOne, Qualisys, Fortnite (Human/Quadruped/Raptor/...),
  Rokoko, Meshcapade, Rigify. A common bone-name prefix (e.g. `mixamorig:`) is stripped before matching.
  `apply_auto_fbik()` does the same for a full-body IK setup (not needed).
- **The template ships no `IK_Mannequin` / `RTG_` asset.** Create the Manny IK Rig too. Auto setup matches the UE5 template.
- **IK Retargeter** (`RTG_Manny_To_<Name>`): source rig, target rig, chain mapping (auto, fuzzy by name), op stack
  (`add_default_ops`), **retarget pose**. Tripo rigs are usually **T-pose** (we prompt for T-pose). Manny is **A-pose**, so
  the target needs a retarget pose: `auto_align_all_bones(TARGET)` (ChainToChain) is the scripted fix. Otherwise
  arms clip into the body.
- **Batch retarget (new API in 5.8):** `IKRetargetBatchOperation.run_batch_retarget(IKRetargetBatchOperationInputs)`.
  `duplicate_and_retarget` is deprecated in 5.8. It handles AnimSequences, Montages, Blend Spaces and **Anim
  Blueprints** (duplicates them, sets `TargetSkeleton`, duplicates parent ABPs). With `include_referenced_assets=True` it
  also duplicates everything the inputs reference. This is the key trick: retarget `ABP_Unarmed` and get the blend space
  and anims with it. Epic's docs say batch work should use a saved retargeter, not an auto-generated one.
- **UI alternative:** right-click an animation > *Retarget Animation Assets*. With "Auto Generate Retargeter" (default on)
  it builds both IK Rigs + retargeter, and *Export Retarget Assets* saves them.

Script outline (API names from `C:\dev\SmokeTest\Intermediate\PythonStub\unreal.py`; end-to-end run unverified):

```python
at = unreal.AssetToolsHelpers.get_asset_tools(); F = "/Game/Characters/Hero"
def ikrig(name, mesh):
    rig = at.create_asset(name, F, unreal.IKRigDefinition, unreal.IKRigDefinitionFactory())
    c = unreal.IKRigController.get_controller(rig); c.set_skeletal_mesh(mesh)
    assert c.apply_auto_generated_retarget_definition(), f"{name}: no template match -> chains by hand"
    return rig
ik_src_mesh = unreal.load_asset("/Game/Characters/Mannequins/Meshes/SKM_Manny_Simple")
ik_src = ikrig("IK_Manny", ik_src_mesh)
ik_tgt = ikrig("IK_Hero", hero_mesh)
rtg = at.create_asset("RTG_Manny_To_Hero", F, unreal.IKRetargeter, unreal.IKRetargetFactory())
r = unreal.IKRetargeterController.get_controller(rtg); S, T = unreal.RetargetSourceOrTarget.SOURCE, unreal.RetargetSourceOrTarget.TARGET
r.set_ik_rig(S, ik_src); r.set_ik_rig(T, ik_tgt)
r.set_preview_mesh(S, ik_src_mesh); r.set_preview_mesh(T, hero_mesh)
r.add_default_ops()                       # if the op stack is empty (unverified whether set_ik_rig fills it)
r.auto_map_chains(unreal.AutoMapChainType.FUZZY, True)
r.auto_align_all_bones(T)                 # T-pose target vs A-pose Manny
i = unreal.IKRetargetBatchOperationInputs()
i.assets_to_retarget = [unreal.EditorAssetLibrary.find_asset_data(p) for p in ABP_AND_MONTAGE_PATHS]
i.source_mesh, i.target_mesh, i.ik_retarget_asset = ik_src_mesh, hero_mesh, rtg
i.target_path, i.suffix, i.include_referenced_assets = F + "/Anims", "_Hero", True
new_assets = unreal.IKRetargetBatchOperation.run_batch_retarget(i)
```

Then **look at it**: open the RTG in the editor, screenshot the viewport and check source vs target poses side by side.
Fixes there are UI work: retarget pose edit mode, chain mapping dropdowns, Root Settings (vertical scale for short/
stylized characters).

## Template animation content (what we retarget)

From the Third Person template's `Characters` pack (`/Game/Characters/Mannequins/` in a TP-based project; if the jam
project lacks it, add the Third Person feature pack via Content Drawer > Add):
- `Meshes/SKM_Manny_Simple`, `SKM_Quinn_Simple`, skeleton `SK_Mannequin`, `Rigs/PA_Mannequin`, `CR_Mannequin_*`.
- `Anims/Unarmed/ABP_Unarmed`: state machines **Locomotion** and **Main States**, `BS_Idle_Walk_Run`, `MM_Idle`,
  `Jump/MM_Jump, MM_Fall_Loop, MM_Land`, a **DefaultSlot** (montages play there). Its EventGraph computes
  `GroundSpeed`, `ShouldMove` (velocity + current acceleration) and `IsFalling` from the CharacterMovementComponent.
  It also has a **Control Rig node using `CR_Mannequin_FootIK`**, which looks up Manny bone names (`ik_foot_l`,
  `foot_l`, `ball_l`, `calf_l`, `thigh_l`, `pelvis`). On a skeleton without those names that node does nothing useful or
  errors, so delete it in the retargeted copy (UI) unless the rig is `--spec unreal` (unverified whether Tripo's unreal
  spec includes the `ik_foot_*` bones).
- `Anims/Unarmed/Attack/MM_Attack_01..03, MM_ChargedAttack`, `Jump/MM_Dash, MM_WallJump`, walk/jog 8-way sets.
- Montages with sections: `Variant_Combat/Anims/AM_ComboAttack`, `AM_ChargedAttack`; `Variant_Platforming/Anims/AM_Dash`.
  Their C++ driver is `Variant_Combat/CombatCharacter.cpp` (template source), a good pattern to copy.
- Pistol/Rifle/Death/HitReact sets also exist (`MM_HitReact_*`, `MM_Death_*`) if the game needs them.

## Anim Blueprint driven from C++

- **Kit-rule note:** `ABP_Unarmed` derives locomotion vars in its EventGraph. That's animation-only derivation from
  movement, so it's acceptable. Don't add gameplay decisions to that graph.
- When the ABP needs a gameplay flag (e.g. `bIsStunned`, `bHasWeapon`), make a C++ parent and reparent the ABP to it
  (`BlueprintEditorLibrary.reparent_blueprint`, then compile). Read the vars in the graph as plain member variables,
  which keeps them on the fast path:

```cpp
UCLASS() class UHeroAnimInstance : public UAnimInstance {
  GENERATED_BODY()
public:
  UPROPERTY(BlueprintReadOnly, Category="Anim") float GroundSpeed = 0.f;
  UPROPERTY(BlueprintReadOnly, Category="Anim") bool bIsFalling = false;
  UPROPERTY(BlueprintReadOnly, Category="Anim") bool bIsStunned = false;   // set by gameplay C++
protected:
  virtual void NativeUpdateAnimation(float Dt) override {
    Super::NativeUpdateAnimation(Dt);
    if (const ACharacter* C = Cast<ACharacter>(TryGetPawnOwner())) {
      GroundSpeed = C->GetVelocity().Size2D();
      bIsFalling  = C->GetCharacterMovement()->IsFalling();
    }
  }
};
```

- Hand-built graph (only if retargeting the ABP fails; editor UI): AnimGraph = State Machine > `Slot 'DefaultSlot'` >
  Output Pose. States: `Locomotion` (Blend Space player, input GroundSpeed), `JumpStart` > `FallLoop` > `Land`.
  Transitions: `bIsFalling`, "time remaining" for Land > Locomotion.
- **Blend Space:** 1D, axis Speed 0..MaxWalkSpeed (template 500): idle at 0, walk ~ 150-250, run at max. Mismatched
  sample speeds cause foot sliding. `BS_Idle_Walk_Run` is already this.
- **Montages** (attack, interact, hit react): play from C++ as the template does:
  `GetMesh()->GetAnimInstance()->Montage_Play(M, 1.f)` + `Montage_SetEndDelegate(...)`, sections via
  `Montage_JumpToSection`. Or use `ACharacter::PlayAnimMontage`. **A montage only shows if the ABP has a Slot node for
  its slot** (`DefaultSlot`). This is the #1 "montage does nothing" cause. Attack hit timing: C++ `UAnimNotify` subclass
  (template: `AnimNotify_DoAttackTrace`). Native notifies avoid BP VM calls.
- **Root motion vs in place:** locomotion **in place** (Manny's are; for Tripo use `--animate-in-place`). Root motion only
  for a dodge/lunge montage, with the ABP set to "Root Motion from Montages Only" (the default). Details are in
  `gameplay.md`. Root motion also blocks the parallel anim update (optimization doc).

## Tripo's own animations (fallback / extras)

- `tripo anim retarget --animation preset:idle preset:walk ...`: **≤5 presets per call, billed per animation**, needs a
  rig task. v3.0/v2.5 biped presets: `idle, walk, run, dive, climb, jump, slash, shoot, hurt, fall, turn`. The v1.0 rig
  (biped only) has 90+ (`preset:biped:wave_goodbye_01`, `dance_01`, `cheer`...). Add `--animate-in-place` for locomotion.
  Output includes geometry by default (`export_with_geometry`).
- Import them onto the **existing** skeleton (`skeleton=`); delete any duplicate mesh the import creates.
- No blend-space-ready walk/run speed matching, no jump start/loop/land split. Fine for an emote montage, weaker for
  locomotion than Manny's set. Using both on one character works because they share the target skeleton.

## Sharing animations between characters

- Same Skeleton asset = share everything directly. Similar hierarchy + proportions = "Compatible Skeletons" on the
  Skeleton asset (Epic suggests this over IK retargeting for similar rigs).
- Different Tripo characters each get their own skeleton, so run one RTG + batch retarget per character from Manny.
  Bake offline. Don't use runtime `Retarget Pose From Mesh` (per-frame cost, extra setup).

## Nanite, LOD and performance

- **Don't enable Nanite on characters.** Epic's 5.8 Nanite page lists skeletal support with "No geometry LODs. Nanite
  Skeletal Mesh uses animation LODs" and no morph targets. With 1-3 characters there's no win and only risk (maturity
  status in 5.8 unverified).
- Tripo meshes import with **one LOD**. Fine for player + a few NPCs. For crowds, generate LODs in the Skeletal Mesh
  Editor (UI) or cap faces at generation.
- NPCs: set `bEnableUpdateRateOptimizations = true` (URO) and
  `VisibilityBasedAnimTickOption = EVisibilityBasedAnimTickOption::OnlyTickPoseWhenRendered` on the mesh component.
  Keep the player on the default. Epic recommends the **Animation Budget Allocator** plugin over URO for many characters.
- Keep AnimGraph inputs as member variables (fast path); compute in C++ `NativeUpdateAnimation` or
  `NativeThreadSafeUpdateAnimation`.
- Measure with `stat anim` / `stat unit` (see `performance.md`).

## Game Animation Sample / Motion Matching

Exists (5.8 version on Fab, 500+ anims): Motion Matching, Pose Search databases, Choosers, Pose History, State Tree,
experimental Offset Root Bone. Using your own character means a child of `CBP_Sandbox_Character`, `ABP_GenericRetarget`
and an RTG from its UEFN mannequin. It's a large interdependent **Blueprint** system, so it conflicts with C++ gameplay
and a 93-hour budget. **Skip.** At most, migrate a few of its AnimSequences and batch-retarget them like the template's.

## Recommended path for a generated character

**Automated (2026-10-24):** `gen/character.ts` runs steps 1-9 below in one command (~4 min, 90 Tripo credits) and
prints the one manual step (8). Usage, options and the failure modes found while building it: `PIPELINE.md`
"Characters" and "Hard-won facts". Material differs from step 4 below: PBR maps come from the textured model,
not the rig (the rig FBX wires its colour image as the normal map). The steps stay here as the explanation.

`[S]` = scriptable (MCP/Python/CLI), `[UI]` = editor UI needed, `[V]` = verify with screenshot/PIE.

1. `[S]` Concept image in **T-pose**, front view (`-p template=t_pose`). Generate with a face cap (`--faces`).
2. `[S]` `tripo anim check` (free) > `tripo anim rig --spec unreal --out-format fbx` (fallback `--spec mixamo`).
   Default rig model is v3.0 (best for humanoids). Non-humanoid: rig type from the check, and Manny retargeting is
   out. Use Tripo presets only.
3. `[S]` **Always** run `gen/blender/prep_rig.py` first (Tripo rigs are 1 m tall and face +X), then import with
   `gen/unreal/py/import_skeletal.py` and run `check_skeletal.py` (root bone scale must be 1). Never fix scale with
   the FBX import scale: it lands on the root bone and breaks every retargeted animation. Exact commands and the
   tested failure modes: `PIPELINE.md` "Characters" and "Hard-won facts" (verified 2026-10-24).
4. `[S]` `MI_<Name>` from the master material with Tripo's textures; `set_material` per slot.
5. `[S]` IK Rigs (`IK_Manny`, `IK_<Name>`) with `apply_auto_generated_retarget_definition()`. **Decision:** False
   means build chains with `set_retarget_root` + `add_retarget_chain` from the bone list (or `[UI]` in the IK Rig editor).
6. `[S]` `RTG_Manny_To_<Name>`: set rigs/meshes, auto-map, auto-align target pose. `[UI][V]` Open it, compare poses,
   play `MM_Idle` and a jog, fix the retarget pose/root scale if arms clip or feet float.
7. `[S]` `run_batch_retarget` on `ABP_Unarmed` + `AM_ComboAttack` (+ any extra montages/anims), referenced assets on,
   suffix `_<Name>`.
8. `[UI]` Open the new ABP: delete the `CR_Mannequin_FootIK` Control Rig node (confirmed needed for Tripo
   `--spec unreal` rigs: without it the feet twist). Wire Slot 'DefaultSlot' → Output Pose. Compile.
   Optional `[S]`: reparent to the C++ `UAnimInstance` parent.
9. `[S]` BP subclass of the C++ Character: mesh = `SK_<Name>`, Anim Class = new ABP, mesh offset (Z = -capsule
   half-height, yaw -90 typical).
10. `[V]` PIE: idle, walk, run, jump, land, attack montage. Screenshot each. Check foot sliding (blend space speeds vs
    `MaxWalkSpeed`) and montage slot.
11. Extras: Tripo presets (`--animate-in-place`) onto the same skeleton, wrapped as montages for emotes.

Budget: steps 2-10 are ~1-2 h for the first character (estimate), mostly in step 6 visual fixes. Later characters reuse
`IK_Manny` and the script.

## Verified against

- Toolset functions and their options (FBX-only legacy factory, `save=False`): `Engine/Plugins/Experimental/Toolsets/EditorToolset/Content/Python/editor_toolset/toolsets/skeletal_mesh.py`, `.../asset.py` (`import_asset`).
- AnimationAssistantToolset scope: `.../Toolsets/AnimationAssistantToolset/Content/Python/animation_toolset/toolsets/*.py` (sequencer, keyframing, controlrig, import_export...). No Retarget/IKRig/AnimGraph code in any toolset (grep across `Experimental/Toolsets`).
- Physics toolset functions: `.../Toolsets/PhysicsToolsets/Source/PhysicsToolsets/Private/PhysicsToolsets/PhysicsAssetToolset.h`.
- `import_any` uses the default importer: `C:\dev\megajam-kit\unreal\Plugins\MegajamTools\Content\Python\megajam_tools\toolsets.py`; Interchange FBX on by default: `Engine/Plugins/Interchange/Runtime/Source/Import/Private/Fbx/InterchangeFbxTranslator.cpp` (`GInterchangeEnableFBXImport = true`).
- IK Rig / Retargeter controller APIs, `ApplyAutoGeneratedRetargetDefinition`, `ApplyAutoFBIK`, `AutoMapChains`, `AutoAlignAllBones`: `Engine/Plugins/Animation/IKRig/Source/IKRigEditor/Public/RigEditor/IKRigController.h`, `.../RetargetEditor/IKRetargeterController.h`.
- `RunBatchRetarget` + inputs struct, `DuplicateAndRetarget` deprecated 5.8, ABP/Montage handling: `.../RetargetEditor/IKRetargetBatchOperation.h`, `IKRigEditor/Private/.../IKRetargetBatchOperation.cpp`.
- Template list, prefix stripping, no fallback: `IKRigEditor/Private/RigEditor/IKRigAutoCharacterizer.cpp`.
- Python names (snake_case methods, `AutoMapChainType.FUZZY`, `RetargetSourceOrTarget.SOURCE/TARGET`, factories, `BlendSample`, `reparent_blueprint`): `C:\dev\SmokeTest\Intermediate\PythonStub\unreal.py`.
- `NativeUpdateAnimation`, `NativeThreadSafeUpdateAnimation`, `TryGetPawnOwner`, `Montage_Play`: `Engine/Source/Runtime/Engine/Classes/Animation/AnimInstance.h`. URO/visibility tick: `.../Components/SkinnedMeshComponent.h`.
- Template content and ABP internals (state machines, slot, vars, Control Rig bones): `Templates/TemplateResources/High/Characters/Content/Mannequins/` (strings of `ABP_Unarmed.uasset`, `CR_Mannequin_FootIK.uasset`); montages in `Templates/TP_ThirdPerson/Content/Variant_*`; `CombatCharacter.cpp`; capsule/MaxWalkSpeed in `TP_ThirdPersonCharacter.cpp`.
- Tripo rig specs, rig models, presets, limits: Tripo API docs (below) and `tripo docs --topic examples/animation` on GIZMO, 2026-10-24.

## Sources (5.8)

- IK Rig retargeting: https://dev.epicgames.com/documentation/en-us/unreal-engine/ik-rig-animation-retargeting-in-unreal-engine?application_version=5.8
- Retargeting bipeds: https://dev.epicgames.com/documentation/en-us/unreal-engine/retargeting-bipeds-with-ik-rig-in-unreal-engine?application_version=5.8
- Auto retargeting: https://dev.epicgames.com/documentation/en-us/unreal-engine/auto-retargeting-in-unreal-engine?application_version=5.8
- FBX skeletal mesh pipeline: https://dev.epicgames.com/documentation/en-us/unreal-engine/fbx-skeletal-mesh-pipeline-in-unreal-engine?application_version=5.8
- Interchange import reference: https://dev.epicgames.com/documentation/en-us/unreal-engine/interchange-import-reference-in-unreal-engine?application_version=5.8
- Animation Blueprints / Blend Spaces / Montages / Root motion: https://dev.epicgames.com/documentation/en-us/unreal-engine/animation-blueprints-in-unreal-engine?application_version=5.8 , `blend-spaces-in-unreal-engine`, `animation-montage-in-unreal-engine`, `root-motion-in-unreal-engine` (same URL pattern)
- Animation optimization: https://dev.epicgames.com/documentation/en-us/unreal-engine/animation-optimization-in-unreal-engine?application_version=5.8
- Nanite (skeletal section): https://dev.epicgames.com/documentation/en-us/unreal-engine/nanite-virtualized-geometry-in-unreal-engine?application_version=5.8
- Game Animation Sample: https://dev.epicgames.com/documentation/en-us/unreal-engine/game-animation-sample-project-in-unreal-engine?application_version=5.8 , https://www.unrealengine.com/tech-blog/download-the-latest-game-animation-sample-project-now-updated-for-ue-5-8
- Tripo: https://developers.tripo3d.com/en/docs/animations-rig.md , `animations-retarget.md`, `animations-rig-check.md`
