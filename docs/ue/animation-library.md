# Animation library: making characters feel alive (UE 5.8.4)

Epic's Third Person template gives a generated character idle, walk/jog, jump and a few unarmed attacks
(`characters.md`). Anything beyond that (weapon combos, blocks, parries, dodges, hit reactions, knockdowns, deaths,
sprint, strafe) needs a source. This note says where to get it, what the jam rules say, and how it plugs in.
Researched 2026-10-26; prices and terms change, so re-check a source before relying on it.

## Jam rules that decide the strategy (2026 Official Rules, sections 7(h) and 15(c))

- **Sourced (non-original) assets are allowed but "will not be reviewed or scored"**, and must be noted on submission.
- **"Content the Entrants generate with AI tools is not considered a sourced asset"**: generated content can score.
- Before the contest only tools, agent configs, MCP settings, prompt libraries and scripts may be prepared; all other
  game content "(other than noted sourced assets) must be created during the Contest Period".
- So: **download libraries before the jam (sourced assets), but retarget them onto the game's characters during the
  jam** with `gen/unreal/retarget_library.ts`. Every library used goes in the project's `SOURCED_ASSETS.md`.
- Library animation still matters for scoring indirectly (Fun Factor, Gameplay). Where a generated clip is good
  enough, it can also score in its own right (see "Generated animation" below).

## Sources (ranked for a melee/action character)

| Source | What it covers | Skeleton / effort | Cost / licence |
|---|---|---|---|
| **Paragon heroes** (Epic, on Fab): Kwang (longsword), Greystone (greatsword), Feng Mao (sword); Aurora, Wukong, Terra for variety | Primary-attack combo chains, abilities, dodges/dashes, jumps, hit reactions, knockback/stun, deaths, idle/jog/sprint (~100-150 per hero; per-hero lists not published) | Paragon skeleton (own hierarchy, 3-bone spine, weapon bones; the sword is a bone, not a separate actor). One IK Rig per hero (similar heroes can share) | Free. UE-only content, no attribution needed; "Paragon" must not appear in the game's name or marketing |
| **Game Animation Sample** (Epic, on Fab, updated for 5.8) | 500+ mocap: walk/run/sprint/crouch/strafe, starts/stops/pivots, turn in place, jumps and landings, vault/climb/mantle, slides; 5.8 adds shoves/tackles/takedowns and a ragdoll pawn. **No weapon combat** | UEFN mannequin source, compatible with UE5 Manny. Built on Motion Matching; taking only the sequences into a state machine works but loses motion matching | Free from Epic |
| **Mixamo** (Adobe) | Broad: sword and shield attacks (mostly single swings), block, roll, hit reactions, knockdown/get-up, deaths, strafe | `mixamorig` skeleton, FBX; auto-retargets well. Download "In Place" except for attacks/rolls (root motion sits on Hips) | Free with an Adobe ID; royalty-free commercial use |
| **Kevin Iglesias, Human Melee** (itch.io) | 284 hand-keyed: 1H/2H/dual/polearm attacks, **parries**, shield blocks, dodges, stun, hit reactions, deaths, sprint/strafe; root-motion and in-place versions | Own skeleton, one IK Rig | ~$23 (free lite version). Check the licence file before relying on it |
| **Fab combat packs** (e.g. a greatsword action-RPG pack: 112 clips, 5-hit combo, lock-on strafe, defence) | Combos, skills, defence | Often the UE4 mannequin skeleton: near-zero retarget | Paid, Fab standard licence |
| **Free Fab mocap samplers** (e.g. voxel vision "Free Animation Library", MoCap Online free pack, dramatic-death and pose packs) | Traversal gaps the Game Animation Sample lacks (wall/ledge/ladder climb, prone, cover, swim, downed/revive, interactions), NPC idles, long cinematic deaths | Skeleton often unstated: check each clip's skeleton after download; UE4 mannequin needs `--source-mesh` | Free, Fab standard licence |

No free source has a proper **parry** or **sword idle**; a paid melee pack covers those.

## Generated animation (counts as generated content under the rules)

- **Good for:** idles, emotes, taunts, hit reactions, deaths, special moves; anything slow or tolerant of imperfection.
- **Not reliable for:** fast weapon arcs and combos (blur, foot sliding, mushy contacts in text- and video-to-motion).
- Options with an API (scriptable): **Meshy** (animation library plus API, ~3 credits per action), **Uthana**
  (text-to-motion, pay per second), **Tripo** (retarget presets, ~10 credits per animation, a thin set of ~16).
  Video-to-motion (Move.ai, DeepMotion, Rokoko) needs filmed reference and paid plans for commercial use.
- **Cascadeur** (AI-assisted keyframing, physics, inbetweening) is the tool for *polishing* a clip; FBX export needs a
  paid plan. Hand-authoring a convincing combo in Blender takes a non-animator hours per move: avoid in a jam.
- Fab listings marked **"Allows usage with AI: No"** opt out of use as generative-AI input: retarget and ship them
  normally, but never feed them to a generator as reference or source motion.
- Untested in this kit: run a 2-3 clip trial (cost stated first) before relying on any generator.

## Workflow

1. **Before the jam (once per machine):** add the free sources to your Fab library and download them into a library
   project that is *not* the game (Paragon Kwang/Greystone/Feng Mao, Game Animation Sample); keep a Mixamo account
   ready. Note what is there.
2. **During the jam:** run `node gen/unreal/anim_inventory.ts --project <library project>` (offline, ~20 s) to see what
   is there and which `--source-mesh` each pack needs. Migrate the needed pack folder into the game project (Content
   Browser > right-click the folder > Asset Actions > Migrate; it keeps its path, e.g. `/Game/ParagonKwang`), then
   retarget it onto the character:
   `node gen/unreal/retarget_library.ts --name <Hero> --folder /Game/<Pack>/<clip folder> --source-mesh <mesh from the
   inventory> --category <Sword|Locomotion|...>`. Only clips on the game's own Manny need no `--source-mesh`: every
   Fab pack ships its own copy of the mannequin skeleton, so point at that pack's mesh.
3. **Test run first, then the rest:** `--filter PrimaryAttack --limit 5` (`--limit` alone takes the first five
   alphabetically, usually abilities). Check those clips **in PIE** (editor-world skeletal meshes don't re-evaluate
   single-node animation, and `shot.ts` only captures the editor viewport): `set_animation` / `play` /
   `set_play_rate(0)` / `set_position(t)`, then a `HighResShot` in a **separate** call. For numbers without a world,
   `AnimPoseExtensions.get_anim_pose_at_time` + `get_bone_pose(..., WORLD)` gives component-space bones. Arms, feet,
   weapon hand; a rest-pose mismatch (A-pose vs T-pose) bends the arms: fix the retargeter's retarget pose and rerun.
   Then run without `--limit`. Finally do one `-game` launch: it catches cook-only problems PIE hides.
4. The tool reuses one retargeter per (source skeleton, character), never overwrites, retargets sequences before
   montages, skips a montage whose clips an earlier run already retargeted (it would make `_<Name>1` duplicates), and
   registers the clips' curves on the target skeleton and saves it (Paragon's `mask_geo` curve otherwise crashes
   `-game` and the cook in `USkeleton::AccumulateCurveMetaData`). It warns about unmapped chains and duplicates.
5. Paragon heroes hold the sword as a bone. Either attach the game's own sword to that bone's socket on the retargeted
   character, or ignore the bone and attach to `hand_r`.

## Paragon clips: what to reuse (measured on Kwang, one prototype)

- **Build your own montages from the sequences.** Paragon's `PrimaryAttack_*_Montage` assets are single-segment
  montages on an `UpperBody` slot whose combo logic is plain named notifies (`SaveAttack`, `ResetCombo`) for Paragon's
  own AnimBP; on a `DefaultSlot` ABP they do nothing. Make one montage per combo step on `DefaultSlot` with the
  hit-window and combo-window notify states (pattern below). Retarget sequences only (`--filter` the attack names).
- **Timing (blade-tip speed on the retargeted clips):** every attack strikes early, then holds the follow-through:
  A 0.08-0.27 s of 1.2, B 0.10-0.30 of 1.27, C 0.15-0.30 of 1.27, D 0.18-0.30 of 1.47. Epic's chain point
  (`SaveAttack`) is at 0.55-0.62 s and `ResetCombo` at ~1.07 s; opening the combo window much earlier feels spammy.
  A-C have `_Recovery` clips back to guard; D's tail returns to guard itself.
- **Reaction names say where the hit came from:** `Hitreact_Fwd` recoils backward (hit from the front),
  `Hitreact_Left` is a hit from the left, `Knockback_Bwd` is thrown backward (heavy hit from the front).
- **No root motion on deaths:** `Death_Bwd`'s pelvis ends ~2.4 m behind the root, so the body lands outside the
  capsule. Turn the capsule's collision off on death (or move the actor to the pelvis afterwards).
- Light hits with a big knockback push the target out of reach of the next swing: keep knockback small on light hits
  and save the big one for the finisher.

## Reference inventory (free packs as downloaded for 5.8, from `anim_inventory.ts`)

Counts are approximate (heuristic classification). Mesh = the `--source-mesh` to pass.

| Pack folder | Clips | Skeleton | `--source-mesh` | Notes |
|---|---|---|---|---|
| `ParagonKwang` | 177 seq, 5 montages, 12 BS | Kwang_Skeleton | `.../Kwang/Meshes/Kwang_GDC` | Longsword: 4-hit combo (PrimaryAttack A-D + recoveries), air attack, hit reacts x4, knockback, stun, Death_Bwd, emotes, full jog/sprint set |
| `ParagonGreystone` | 154 / 4 / 10 | Greystone_Skeleton | `.../Greystone/Meshes/Greystone` | Greatsword |
| `ParagonFengMao` | 196 / 5 / 12 | FengMao_Skeleton | `.../FengMao/Meshes/FengMao_GDC` | Sword |
| `ParagonSunWukong` | 170 / 5 / 10 | Wukong_Skeleton | `.../Wukong/Meshes/Wukong` | Staff |
| `ParagonGideon` | 201 / 4 / 17 | Gideon_Skeleton | `.../Gideon/Meshes/Gideon` | Mage casts |
| `ParagonMurdock` | 197 / 3 / 11 | Murdock_Skeleton | `.../Murdock/Meshes/Murdock` | Shotgun |
| `ParagonWraith` | 229 / 5 / 13 | Wraith_Skeleton | `.../Wraith/Meshes/Wraith` | Sniper |
| `ParagonSevarog` | 144 / 3 / 10 | Sevarog_Skeleton | `.../Sevarog/Meshes/Sevarog` | Large scythe boss: ready-made enemy set |
| `FreeAnimationLibrary` | 129 | pack's own UE5 SK_Mannequin | `.../Demo/Characters/Mannequins/Meshes/SKM_Manny_Simple` | Climb (wall/ledge/pipe/ladder), prone, cover, swim, downed/revive, interactions, spear attacks, counters |
| `Free_Interaction_Animation` | 10 | own UE5 SK_Mannequin | `.../Demo/Characters/Mannequins/Meshes/SKM_Manny_Simple` | Doors (push/kick), lever |
| `FreeLadderAnimationSet` | 12 | own UE5 SK_Mannequin | `.../Demo/Mannequins/Meshes/SKM_Manny_Simple` | Ladder |
| `FreeAnimationsPack2` | 12 | own UE5 SK_Mannequin | `.../Demo/Mannequins/Meshes/SKM_Manny_Simple` | NPC idles/conversation, pistol |
| `DramaticDeath` | 12 | own UE5 SK_Mannequin | `.../Demo/ControlRig/Characters/Mannequins/Meshes/SKM_Manny_Simple` | Long cinematic deaths (8-45 s) |
| `DeadBodies_Poses_nikoff` | 30 | own UE5 SK_Mannequin | `.../Demo/Mannequins/Meshes/SKM_Manny_Simple` | Single-frame corpse poses (set dressing) |
| `8WayFlyAnimation` | 9 + 1 BS + ABP | own UE5 SK_Mannequin | `.../Animations/UnrealMannequin/Meshes/SKM_Quinn` | 8-way levitation locomotion |
| `MCO_Mocap_Basics` | 39 | **UE4** mannequin | `.../Character/Mesh/SK_Mannequin` | Idles, walk/jog/run, crouch, a death, scared walks |
| Game Animation Sample `Characters/UEFN_Mannequin` | ~1,500 | SK_UEFN_Mannequin | `/Game/Characters/UEFN_Mannequin/Meshes/SKM_UEFN_Mannequin` | Walk/run/crouch 450 each, jumps 145, traversal 145, interactions/shoves 187, slides, ragdoll, look-at. Separate project: migrate from it |
| Zebra Sample | 1 | SK_Zebra / Monster_Skeleton | - | Reference only: stylized in-engine rig and face rig, not a retarget source |

**AnimGen** (Experimental engine plugin, plus an AnimGen Example content plugin on the UEFN mannequin): its
dependencies (LearningCore, NNE, PoseSearch, AnimDatabase, TensorBoard) point to a neural network trained on an
animation database, not a text-to-motion generator. Untested; training time makes it a poor fit for a jam.

## Combat animation pattern (C++, stable 5.8 APIs)

- **One montage per attack**, chained with montage sections for combos; the ABP needs a Slot node (`DefaultSlot`) that
  the montages play into (`characters.md`).
- **Hit window:** a C++ `UAnimNotifyState` opens and closes the hit window. Each tick, sweep from the weapon socket's
  previous position to its current one (`SweepMultiByChannel`) and hit each target once per swing. Overlap events
  miss fast arcs at low frame rates.
- **Cancel window:** a notify state that allows the next input to interrupt (`Montage_Play` / `Montage_JumpToSection`)
  for earlier recovery; short blend-outs.
- **Soft aim:** the Motion Warping plugin (stable in 5.8): `UMotionWarpingComponent` on the character, a Motion Warping
  notify state in the montage, and `AddOrUpdateWarpTargetFromLocation` toward the nearest target in a front cone when
  the attack starts. Needs root-motion animations. Without root motion, rotate toward the target over the wind-up instead.
- **States:** dodge/roll (with brief invulnerability), block/parry (timed window), hit reaction (interrupts the attack),
  knockdown + get-up, death (ragdoll or death montage). All timings and damage in a DataAsset.
- **AI characters using Epic's ABP:** it plays locomotion from *acceleration*, and path following doesn't set
  acceleration by default, so AI slides with no walk/run. Set
  `GetCharacterMovement()->NavMovementProperties.bUseAccelerationForPaths = true` (5.8 location of the flag).

## Sources (2026-10-26)

- 2026 Epic AI MegaJam Official Rules (PDF, 2026-10-22), sections 7(h), 9, 15(c)
- Paragon Kwang: https://www.fab.com/listings/f4c67e92-b976-4b5b-ab9f-4c25b010f6f3
- Paragon retarget notes: https://docs.unamedia.com/ue5-mixamo/paragon-characters-animations
- Game Animation Sample: https://www.fab.com/listings/880e319a-a59e-4ed2-b268-b32dac7fa016 and
  https://dev.epicgames.com/documentation/en-us/unreal-engine/game-animation-sample-project-in-unreal-engine
- Fab EULA: https://www.fab.com/cla ; Epic content EULA: https://www.unrealengine.com/eula/content
- Kevin Iglesias Human Melee: https://kevdev.itch.io/human-melee-animations
- Meshy API pricing: https://docs.meshy.ai/api/pricing.md ; Uthana: https://uthana.com/pricing ;
  Tripo animation: https://developers.tripo3d.com/en/models/animation
- Motion Warping: https://dev.epicgames.com/documentation/unreal-engine/motion-warping-in-unreal-engine?application_version=5.8
- FNavMovementProperties: https://dev.epicgames.com/documentation/unreal-engine/API/Runtime/Engine/FNavMovementProperties?application_version=5.8
