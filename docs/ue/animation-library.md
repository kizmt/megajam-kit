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

No free source has a proper **parry** or **sword idle**; a paid melee pack covers those.

## Generated animation (counts as generated content under the rules)

- **Good for:** idles, emotes, taunts, hit reactions, deaths, special moves; anything slow or tolerant of imperfection.
- **Not reliable for:** fast weapon arcs and combos (blur, foot sliding, mushy contacts in text- and video-to-motion).
- Options with an API (scriptable): **Meshy** (animation library plus API, ~3 credits per action), **Uthana**
  (text-to-motion, pay per second), **Tripo** (retarget presets, ~10 credits per animation, a thin set of ~16).
  Video-to-motion (Move.ai, DeepMotion, Rokoko) needs filmed reference and paid plans for commercial use.
- **Cascadeur** (AI-assisted keyframing, physics, inbetweening) is the tool for *polishing* a clip; FBX export needs a
  paid plan. Hand-authoring a convincing combo in Blender takes a non-animator hours per move: avoid in a jam.
- Untested in this kit: run a 2-3 clip trial (cost stated first) before relying on any generator.

## Workflow

1. **Before the jam (once per machine):** add the free sources to your Fab library and download them into a library
   project that is *not* the game (Paragon Kwang/Greystone/Feng Mao, Game Animation Sample); keep a Mixamo account
   ready. Note what is there.
2. **During the jam:** migrate the needed library folder into the game project (`/Game/AnimLibrary/<Source>/...`;
   Content Browser > Asset Actions > Migrate), then retarget it onto the character:
   `node gen/unreal/retarget_library.ts --name <Hero> --folder /Game/AnimLibrary/<Source> --source-mesh <a mesh on that
   skeleton> --category <Sword|Locomotion|...>`. Epic-skeleton libraries need no `--source-mesh`.
3. The tool reuses one retargeter per (source skeleton, character), never overwrites, and warns about unmapped chains.
   Check a few clips in PIE from the gameplay camera: arms, feet, weapon hand. A rest-pose mismatch (A-pose vs T-pose)
   bends the arms; fix it in the retargeter's retarget pose, then rerun for the missing clips.
4. Paragon heroes hold the sword as a bone. Either attach the game's own sword to that bone's socket on the retargeted
   character, or ignore the bone and attach to `hand_r`.

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
