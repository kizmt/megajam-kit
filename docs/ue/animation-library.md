# Animation library: making characters feel alive (UE 5.8.4)

Epic's Third Person template gives a generated character idle, walk/jog, jump and a few unarmed attacks
(`characters.md`). Anything beyond that (weapon combos, blocks, parries, dodges, hit reactions, knockdowns, deaths,
sprint, strafe) needs a source. This note says where to get it, what the jam rules say, and how it plugs in.
Researched 2026-10-26/28; prices and terms change, so re-check a source before relying on it.

## Jam rules and licences that decide the strategy

- **Sourced (non-original) assets are allowed but "will not be reviewed or scored"** (Official Rules 15(c)), and must
  be noted on submission.
- **"Content the Entrants generate with AI tools is not considered a sourced asset"**: generated content can score.
- Before the contest only tools, agent configs, MCP settings, prompt libraries and scripts may be prepared; all other
  game content "(other than noted sourced assets) must be created during the Contest Period" (7(h)).
- So: **download libraries before the jam (sourced assets), but retarget them onto the game's characters during the
  jam** with `gen/unreal/retarget_library.ts`. Every library used goes in the project's `SOURCED_ASSETS.md`.
- **Only packs whose licence allows AI use** (CLAUDE.md "Jam compliance"). Check before downloading.
- Library animation still matters for scoring indirectly (Fun Factor, Gameplay). Where a generated clip is good
  enough, it can also score in its own right (see "Generated animation" below).

## Sources

| Source | What it covers | Skeleton / effort | Cost / licence |
|---|---|---|---|
| **Generated** (Uthana, below) | Idles, emotes, hit reactions, deaths, special moves; anything slow or tolerant of imperfection | Standard UE5 Manny bone names | Pay per second; scores as the game's own content |
| **Third Person template** (engine content) | Idle, walk/jog, jump, a few unarmed attacks, a dash | The template's Manny | Engine EULA; not a Fab listing |
| **Mixamo** (Adobe) | Broad: sword and shield attacks (mostly single swings), block, roll, hit reactions, knockdown/get-up, deaths, strafe | `mixamorig` skeleton, FBX; auto-retargets well. Download "In Place" except for attacks/rolls (root motion sits on Hips) | Free with an Adobe ID; royalty-free commercial use. Check Adobe's terms on AI use before relying on it |
| **Kevin Iglesias, Human Melee** (itch.io) | 284 hand-keyed: 1H/2H/dual/polearm attacks, **parries**, shield blocks, dodges, stun, hit reactions, deaths, sprint/strafe; root-motion and in-place versions | Own skeleton, one IK Rig | ~$23 (free lite version). Check the licence file, AI use included |
| **Fab packs that allow AI use** (see "Reference inventory") | Interactions, ladders, corpse poses, cinematic deaths; paid combat packs exist | Usually the pack's own copy of the UE5 or UE4 mannequin: near-zero retarget | Free or paid, Fab standard licence or CC-BY (credit it) |

## Generated animation (counts as generated content under the rules)

- **Good for:** idles, emotes, taunts, hit reactions, deaths, special moves; anything slow or tolerant of imperfection.
- **Not reliable for:** fast weapon arcs and combos (blur, foot sliding, mushy contacts in text- and video-to-motion).
- Options with an API (scriptable): **Meshy** (animation library plus API, ~3 credits per action), **Uthana**
  (text-to-motion, pay per second), **Tripo** (retarget presets, ~10 credits per animation, a thin preset set: see `characters.md`).
  Video-to-motion (Move.ai, DeepMotion, Rokoko) needs filmed reference and paid plans for commercial use.
- **Cascadeur** (AI-assisted keyframing, physics, inbetweening) is the tool for *polishing* a clip; FBX export needs a
  paid plan. Hand-authoring a convincing combo in Blender takes a non-animator hours per move: avoid in a jam.
- Untested in this kit except Uthana (below): run a 2-3 clip trial (cost stated first) before relying on any generator.

### Uthana text-to-motion (tested: 3 clips; API, cost and output format in `PIPELINE.md`)

- **Clips are full acted performances, not game clips.** A 4 s "hit" was a 1.2 s stagger followed by a long hunch and
  recovery. Trim and retime for gameplay (that hit: first 1.5 s at 1.25x). Bake the retime into the clip rather than
  using montage `RateScale` (`gameplay.md` "Montages and attached props"). 3.0 has a 4 s minimum, so expect to trim
  most clips.
- **Root trajectory sits on `root`, not the pelvis** (root yawed about -35° at frame 0). The retargeter and montages
  expect root at the reference pose with the motion on the pelvis, so bake it before retargeting:
  pelvis' = pelvis * root(t) * inverse(root(0)), root = identity. Then `retarget_library.ts` works first time. Moving
  the pelvis's travel back onto root as **root motion** turns a stagger into real knockback with no blend-out slide.
- Standard UE5 Manny bone names: imports straight onto `SK_Mannequin`. Delete the bundled Manny mesh after import.
- **Hands are open**, whatever the prompt says about a held weapon: a held prop needs a grip pose (`characters.md`
  "Held props").
- Generated clips count as the game's own content under the rules (above), unlike library clips.

## Workflow

1. **Before the jam (once per machine):** check each source's licence (AI use included), add the free ones to your
   Fab library and download them into a library project that is *not* the game; keep a Mixamo account ready.
2. **During the jam:** run `node gen/unreal/anim_inventory.ts --project <library project>` (offline, ~20 s) to see what
   is there and which `--source-mesh` each pack needs. Migrate the needed pack folder into the game project (Content
   Browser > right-click the folder > Asset Actions > Migrate; it keeps its `/Game/<Pack>` path).
   **Without a second editor:** copy the `.uasset` files with their `/Game/...` paths preserved, plus the full
   dependency closure read from the library project's asset registry; check for path clashes first. Clips can
   hard-reference assets outside the pack folder (e.g. curve compression settings under `/Game/Misc`): those must
   come along and be committed. Then retarget onto the character:
   `node gen/unreal/retarget_library.ts --name <Hero> --folder /Game/<Pack>/<clip folder> --source-mesh <mesh from the
   inventory> --category <Sword|Locomotion|...>`. Only clips on the game's own Manny need no `--source-mesh`: Fab
   packs usually ship their own copy of the mannequin skeleton, so point at that pack's mesh.
3. **Test run first, then the rest:** `--names` for exact clips (`--filter` is a substring match and catches variants)
   or `--limit 5`. Check those clips **in PIE** (editor-world skeletal meshes don't re-evaluate single-node animation,
   and `shot.ts` only captures the editor viewport): `set_animation` / `play` / `set_play_rate(0)` /
   `set_position(t)`, then a `HighResShot` in a **separate** call. For numbers without a world,
   `AnimPoseExtensions.get_anim_pose_at_time` + `get_bone_pose(..., WORLD)` gives component-space bones. Arms, feet,
   weapon hand; a rest-pose mismatch (A-pose vs T-pose) bends the arms: fix the retargeter's retarget pose and rerun.
   The tool prints the source-to-target chain map: read it, because a wrong mapping is otherwise silent. Then run
   without `--limit`. Finally do one `-game` launch: it catches cook-only problems PIE hides.
4. The tool reuses one retargeter per (source skeleton, character), never overwrites, retargets sequences before
   montages, skips a montage whose clips an earlier run already retargeted (it would make `_<Name>1` duplicates), and
   registers the clips' curves on the target skeleton and saves it (an unregistered curve otherwise crashes `-game`
   and the cook in `USkeleton::AccumulateCurveMetaData`). It warns about unmapped chains and duplicates.

## Library clips: lessons from prototypes

- **Build your own montages from the sequences.** A pack's montages are usually wired to its own AnimBP (an
  `UpperBody` slot, combo logic in plain named notifies) and do nothing on a `DefaultSlot` ABP. Make one montage per
  combo step on `DefaultSlot` with the hit-window and combo-window notify states (pattern below); retarget sequences
  only.
- **Attacks strike early and hold a long follow-through:** put hit windows on the measured strike (blade-tip speed),
  and open the combo window late in the follow-through, not earlier.
- **Additive clips look broken played alone** (single node, a preview: near-T-pose). Through a montage on the ABP slot
  they're fine, so preview and compare additive clips through the montage path.
- **Deaths without root motion** can end with the pelvis metres behind the root, outside the capsule. Turn the
  capsule's collision off on death (or move the actor to the pelvis afterwards).
- A weapon held as a **bone** in the source skeleton: attach the game's own weapon to that bone's socket on the
  retargeted character, or ignore the bone and attach to `hand_r`.
- **Clips cut for Motion Matching** (starts, stops, pivots) slide as plain sequences: a whole step at the hand-overs.
  Fix: `force_root_lock`, distance-matched starts and stops, and pose-matched entry into the loop and the stop. Accept
  on the worst planted-foot slip per phase, measured in `-game`. If the game needs snappy control, accept some slip:
  responsiveness usually matters more than feet.
- Copied clips can carry **notify tracks whose classes don't exist in the game** (they load as null notifies) and **no
  sync markers**. A blend space of loops needs markers for clean foot sync: strip the null tracks and add L/R markers
  where foot-contact curves rise (or at the measured foot plants).

## Reference inventory (free packs as downloaded for 5.8, from `anim_inventory.ts`)

All allow AI use (checked 2026-10-28). Counts are approximate (heuristic classification). Mesh = the `--source-mesh`.

| Pack folder | Clips | Skeleton | `--source-mesh` | Notes |
|---|---|---|---|---|
| `Free_Interaction_Animation` | 10 | own UE5 SK_Mannequin | `.../Demo/Characters/Mannequins/Meshes/SKM_Manny_Simple` | Doors (push/kick), lever |
| `FreeLadderAnimationSet` | 12 | own UE5 SK_Mannequin | `.../Demo/Mannequins/Meshes/SKM_Manny_Simple` | Ladder |
| `DramaticDeath` | 12 | own UE5 SK_Mannequin | `.../Demo/ControlRig/Characters/Mannequins/Meshes/SKM_Manny_Simple` | Long cinematic deaths (8-45 s). CC-BY: credit it |
| `DeadBodies_Poses_nikoff` | 30 | own UE5 SK_Mannequin | `.../Demo/Mannequins/Meshes/SKM_Manny_Simple` | Single-frame corpse poses (set dressing) |

## Combat animation pattern (C++, stable 5.8 APIs)

- **One montage per attack**, chained with montage sections for combos; the ABP needs a Slot node (`DefaultSlot`) that
  the montages play into (`characters.md`).
- **Hit window:** a C++ `UAnimNotifyState` opens and closes the hit window. Each tick, sweep from the weapon socket's
  previous position to its current one (`SweepMultiByChannel`) and hit each target once per swing. Overlap events
  miss fast arcs at low frame rates.
- **Cancel window:** a notify state that allows the next input to interrupt (`Montage_Play` / `Montage_JumpToSection`)
  for earlier recovery; short blend-outs.
- **Soft aim:** the Motion Warping plugin (**Beta** in 5.8.4: `MotionWarping.uplugin` has `IsBetaVersion: true`;
  `features.md` rules apply): `UMotionWarpingComponent` on the character, a Motion Warping
  notify state in the montage, and `AddOrUpdateWarpTargetFromLocation` toward the nearest target in a front cone when
  the attack starts. Needs root-motion animations. Without root motion, rotate toward the target over the wind-up instead.
- **States:** dodge/roll (with brief invulnerability), block/parry (timed window), hit reaction (interrupts the attack),
  knockdown + get-up, death (ragdoll or death montage). All timings and damage in a DataAsset.
- **AI characters using Epic's ABP slide without walk/run:** fix in `ai.md` "AI characters slide without walk/run
  animation" (`bUseAccelerationForPaths`).

## Sources (2026-10-28)

- 2026 Epic AI MegaJam Official Rules (PDF, 2026-10-22), sections 7(h), 9, 15(c)
- Epic Content License Agreement (section 17, NoAI): https://www.unrealengine.com/eula/content ; Fab EULA: https://www.fab.com/cla
- Kevin Iglesias Human Melee: https://kevdev.itch.io/human-melee-animations
- Meshy API pricing: https://docs.meshy.ai/api/pricing.md ; Uthana: https://uthana.com/pricing ;
  Tripo animation: https://developers.tripo3d.com/en/models/animation
- Motion Warping: https://dev.epicgames.com/documentation/unreal-engine/motion-warping-in-unreal-engine?application_version=5.8
- FNavMovementProperties: https://dev.epicgames.com/documentation/unreal-engine/API/Runtime/Engine/FNavMovementProperties?application_version=5.8
