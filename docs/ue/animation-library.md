# Animation library: making characters feel alive (UE 5.8.4)

Epic's Third Person template gives a generated character idle, walk/jog, jump and a few unarmed attacks
(`characters.md`). Anything beyond that (interactions, ladders, emotes, sprint, strafe, or for combat: weapon combos,
blocks, parries, dodges, hit reactions, knockdowns, deaths) needs a source. This note says where
to get it, what the jam rules say, and how it plugs in.
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
- **5.9:** a new **UAF AnimGen** plugin brings AI-driven animation generation into the Unreal Animation Framework
  (UAF). The 5.9 docs have no page on it beyond the release notes: check its output and terms before relying on it
  (docs/ue59/pages/whats-new/unreal-engine-5-9-release-notes.md).
- **5.9: AnimGenOffline + Kimodo: text-to-motion inside Sequencer, local and free per clip** (read in the installed 5.9 Preview's plugin sources on 2026-11-10, and
  the plugin author's post, John van der Burg, Epic; no doc page yet). Not the UAF AnimGen plugin above, which trains
  motion-matching models.
  - Plugins: **AnimGenOffline** ("offline generated animations inside sequencer") and **Kimodo** (its first pose
    generator: NVIDIA's Kimodo motion-diffusion model, vendored in the engine), both under
    `Engine/Plugins/Experimental/Animation/`, Experimental, off by default. The author: guide motion with splines the
    character follows, a text style, and target key poses set with Control Rig; retargeting is automatic; an agent can
    be asked to generate a clip and save it as an Animation Sequence. Fastest on a GeForce 30-series or newer; Windows.
  - Why it matters here: the output is generated content (scored), where library clips are sourced (not scored), and
    it costs no credits (Uthana is ~$0.40 per 4 s clip).
  - Licences: Kimodo's code is Apache-2.0; its SOMA and G1 weights use the NVIDIA Open Model License, the SMPL-X one an
    NVIDIA R&D licence (don't use it); training data is Bones Rigplay mocap, which Kimodo's README calls
    "commercially-friendly". The text encoder is Meta's gated **Llama 3 8B Instruct** (Llama 3 licence), so it needs
    a Hugging Face read token from an account granted access to `meta-llama/Meta-Llama-3-8B-Instruct`. The director
    reads and accepts these; the session never does.
  - Setup (per machine and project, done on the target PC 2026-11-10): `SETUP.md` 10b. The token comes from the kit's
    `.env` via `gen\hf_token.ts`; the weights are cached under the user's Hugging Face cache; each new project needs
    the plugins, Pip Strict Hash Check off and the two-package install. Never print or commit the token.
  - Memory (measured): the text encoder sits in system RAM, quantized to NF4 (4.6 GB, cached under `Intermediate`);
    the diffusion model holds ~1.1 GB of VRAM after a generation; the model unloads after 15 idle minutes. It fits the
    RTX 4060 with the editor open. Time: ~20 s per 5 s clip, 8 s of it encoding a new prompt (repeated prompts are
    cached).
  - Errors open a **modal dialog** (`KimodoSettings.h` ShowErrorDialog), which blocks the game thread and every MCP
    call. With the setup done none appeared in the test; a session still saves before generating and treats a
    stalled MCP call as a possible dialog (`debugging.md` B).
  - **Scripting: works, with the kit's tool** (proven in the 2026-11-10 practice run, shipped 2026-11-11):
    `node gen\unreal\kimodo.ts "<prompt>" --name A_Hero_Wave --seq /Game/.../LS_HeroKimodo [--seed N] [--dest ...]`
    opens the sequence, sets the prompt, waits for the generation and saves the clip as an Animation Sequence for the
    character's skeleton: 18-26 s per 5 s clip once the models are loaded (about 1-2 min for the first after an
    editor start). `--state` lists the sections with their prompts and seeds. No UI step, no C++. What it relies on
    (`gen/unreal/py/kimodo.py`):
    - The plugin has no "generate" call. Its edit mode regenerates a section about 0.4 s after an editor
      **transaction** touches the section or its pose generator, while the sequence is **open in Sequencer** and Live
      Update and the section's auto-generate are on (defaults). The script edits inside
      `unreal.ScopedEditorTransaction` after `section.modify()` and `pose_generator.modify()`.
    - Property names are **CamelCase** (`AnimDescriptionOverride`, `RandomSeed`): `KimodoPoseGenerator` has no Python
      type, so the snake_case forms raise "Failed to find property".
    - Done line in the Output Log: `LogAnimGenOffline: GenerationTiming ... Stage=CleanupAndPostGenerate`.
    - Export: `ControlRigSequencerLibrary.export_anim_sequence_from_sequencer(anim, AnimSeqExportOption(), binding,
      False)` into an AnimSequence made with `AnimSequenceFactory(target_skeleton=...)`. The character is found from
      the binding (`LevelSequenceEditorBlueprintLibrary.get_bound_objects(seq.get_binding_id(binding))`: a plain
      Actor with one SkeletalMeshComponent).
    - Traps: generator sections can have open ranges (`has_start_frame()` before `get_start_frame()`); the edit
      dirties the sequence, so closing the editor asks to save it; an error opens the modal dialog above.
    - **Any character, one sequence: `--for <Name>`** (verified 2026-11-11 on a generated Tripo hero with short arms
      and a hood). Generate on the mannequin's Kimodo sequence, and the tool retargets the clip onto a
      `character.ts` character with its own retargeter (`RTG_Manny_To_<Name>`), into
      `/Game/Characters/<Name>/Anims/Kimodo/<clip>_<Name>`: `node gen\unreal\kimodo.ts "<prompt>" --name A_Hero_Jump
      --seq <Manny's Kimodo sequence> --for Hero`. About 25 s per clip. In a side-by-side pose check the hero matched
      the mannequin through a crouch, an arms-up jump and the landing. So the manual Add Character step is done once,
      for the mannequin, not per hero. The retarget never overwrites: a new take needs a new clip name. These clips
      are generated content, not sourced (the tool reuses the library retarget script, whose closing line about
      `SOURCED_ASSETS.md` doesn't apply to them).
    - `--map` is only needed if the sequence must be opened in its own level, and it fails if the open level has
      unsaved changes (`load_level`'s default policy on 5.9): leave it out and the sequence opens in the current level.
    - **Still by hand, once per character:** the sequence itself, made with the plugin's **Add Character** (SETUP
      10b; the workflow below). Not tried by script: `AddGeneratedAnimationSectionAsync`, clips longer than the
      section (150 frames in the test), pose and foot keys, splines. Variations: run the tool with 2-3 seeds and keep
      the take with the least foot slide.
  - **What an agent does better than the UI:** measure foot slide from the baked clip (foot bone positions per frame,
    in cm, as `characters.md` does for retargets), generate 2-3 variations and keep the one with the least slide, and
    hide the rest with runtime foot IK.
  - Setup, by the director: `SETUP.md` 10b. UI labels in the plugin's source (2026-11-10): **Add Generated Animation
    Section**, **Pose Generator** (Kimodo), **Anim Description** (the text prompt), **Draw Spline** (a path to
    follow), **Generate Animation** / **Generate All Animations**, **Export Animation** ("exports the generated
    animation to an animation sequence asset"), **Create Auto-Generated Retargeter Assets**; progress shows
    "Downloading Llama 3 weights", "Downloading Kimodo weights", "Quantizing Llama 3 to NF4"; the plugin shows
    **VRAM Used**.
  - Prompting (tested 2026-11-10): "a person walks forward and waves" walked but never waved; "a person walks forward
    while waving their right hand above their head" did both. Name simultaneous actions explicitly, with the limb
    and where it goes; for actions in sequence, key the **Anim Description** channel over time (or Multi-Prompt
    Transitions) so each stretch has one action, as Kimodo's training data is described moment by moment. Variations
    2-3 and Quality High for clips that will ship.
  - **Workflow that worked (2026-11-10, by hand):** add the character with the plugin's own **Add Character**
    (Sequencer toolbar > the AnimGenOffline drop-down, a running-figure icon > Actions): pick the mesh, tick **Control
    Rig** (Auto finds Manny's `CR_Mannequin_Body`) for pose editing, and tick **Spline** only for "walk along this
    path" clips: it attaches the character to a path, and an on-the-spot action then slides along it (mute or delete
    the **Attach** track, set Movement Source = Generated Animation). The character is a Sequencer spawnable; delete
    any hand-placed copy. The toolbar's **Generate** button appears only while the sequence holds a generator section.
    The actor row's pencil toggles **Edit Poses** (the Control Rig pose) and the generated animation; with it on, the
    character shows the rig's pose and looks frozen (the "stands still" seen in the test was this, not the rig track
    itself). **Pose and foot keys** live in Animation Mode's Tab menu, not Sequencer's: select a rig control in the
    viewport, press **Tab** > **AnimGenOffline** > **Add Key** > Full Body / Hips / Left Hand / Right Hand / Left Foot /
    Right Foot (keys that part's current pose at the playhead as a target), plus **Add Target Transform Key**, **Auto
    Key Channels**, **Draw Spline**. Hand keys are the way to place arms for stylised characters.
  - **Quality seen:** walks and gestures convincing on the mannequin; a punch worked with slightly unnatural legs and a
    little foot slide even on the spot. Foot keys set by hand at three frames did not remove the slide (one try, may
    have been misapplied). Levers: Quality High, Variations 3 and keep the least-sliding take (measure it), prompts that
    say what the feet do, Post Processing foot cleanup, foot keys, and runtime foot IK in game. Sharp combat moves: hand
    keys on the strike frame, or library clips.
  - **Show Retarget Debug** draws only on Pose Targets you key (the poses given to the model); with none it draws
    nothing. To tell a retarget problem from a model one, play the same seed and prompt on Kimodo's own
    `soma_neutral` mesh (Content Browser > Settings > Show Plugin Content > Kimodo Content > Characters > Soma) next
    to the character.

### Claude as the fallback generator (any engine; APIs checked in the 5.9 stub, not yet run)

Pick the source per motion: Kimodo (if it passed its test) for full-body human motion; library clips (sourced, not
scored) for stock locomotion; Uthana (paid); and the session itself for simple, stylised or mechanical motion, or
when the others are unavailable. Agent-written motion is good at doors, platforms, bobbing pickups, a tail sway, a
creature with few bones, a stylised hop or bow; it is weak at natural human weight and timing. Three routes, simplest
first:
1. **Code, no asset:** procedural motion in C++ (sine bob, spring, rotation, squash and stretch) for props and
   pickups (`game-feel.md`).
2. **Control Rig in Sequencer, baked** (characters): key the character's Control Rig controls (IK feet and hands,
   pelvis, spine) at a few key poses with `ControlRigSequencerLibrary.set_local_control_rig_transform` or
   `set_control_rig_world_transform` (per control, per frame), let Sequencer interpolate, then bake with
   `SequencerTools.export_anim_sequence(world, sequence, anim_sequence, export_options, binding, create_link)`.
   IK keeps the feet where they are put.
3. **Bone keys straight into an Animation Sequence** (simple rigs): the sequence's `controller`
   (`AnimationDataController`): `open_bracket`, `set_frame_rate`, `set_number_of_frames`, `add_bone_track`,
   `set_bone_track_keys(bone, positions, rotations, scales)` (one key per frame), `close_bracket`, then save.

Method, as an animator blocks: key poses first (a walk: contact, down, passing, up; an action: anticipation, action,
follow-through, settle), written as numbers in a JSON the build script reads (`Tools\anim\<clip>.json`), so a
correction is a data edit. Judge a frame sheet from the gameplay camera with the critic, then refine: at most 3-4
rounds per clip, then simplify the motion or use another source. AnimGenOffline accepts other pose generators (its
author: any algorithm that outputs poses over time), so an agent-backed generator could plug in there, but that is a
C++ plugin: not for the jam.

### Uthana text-to-motion (tested: 3 clips; API, cost and output format in `PIPELINE.md`)

- **Clips are full acted performances, not game clips.** A 4 s "hit" was a 1.2 s stagger followed by a long hunch and
  recovery. Trim and retime for gameplay (that hit: first 1.5 s at 1.25x). Bake the retime into the clip rather than
  using montage `RateScale` (`gameplay.md` "Montages and attached props"). The `text-to-motion-3.0` model has a 4 s
  minimum, so expect to trim most clips.
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
   `node gen/unreal/retarget_library.ts --name <Name> --folder /Game/<Pack>/<clip folder> --source-mesh <mesh from the
   inventory> --category <Sword|Locomotion|...>`. Only clips on the game's own Manny need no `--source-mesh`: Fab
   packs usually ship their own copy of the mannequin skeleton, so point at that pack's mesh.
3. **Test run first, then the rest:** `--names` for exact clips (`--filter` is a substring match and catches variants)
   or `--limit 5`. Check those clips **in PIE** (editor-world skeletal meshes don't re-evaluate single-node animation,
   and `shot.ts` only captures the editor viewport): `set_animation` / `play` / `set_play_rate(0)` /
   `set_position(t)`, then a `HighResShot` in a **separate** call. For numbers without a world,
   `AnimPoseExtensions.get_anim_pose_at_time` + `get_bone_pose(..., WORLD)` gives component-space bones. Arms, feet,
   weapon hand; a rest-pose mismatch (A-pose vs T-pose) bends the arms: fix the retargeter's retarget pose and rerun.
   **5.9:** the IK Retargeter gains three spatially aware ops: **Proximity IK** (keeps limbs and contacts correct
   relative to the body), **Pelvis Volume** (places the pelvis across characters with different proportions) and
   **Limb Twist** (spreads twist along the limbs). The 5.9 docs name them only in the release notes (no settings
   page); try them in the retargeter's op stack when contacts or the pelvis are off after a retarget
   (docs/ue59/pages/whats-new/unreal-engine-5-9-release-notes.md).
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
  **5.9:** the release notes list "smaller updates" to Motion Warping without detail; the 5.9 Motion Warping page
  describes the same plugin, component, notify-state and warp-target workflow
  (docs/ue59/pages/whats-new/unreal-engine-5-9-release-notes.md, docs/ue59/pages/animation/motion-warping-in-unreal-engine.md).
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
