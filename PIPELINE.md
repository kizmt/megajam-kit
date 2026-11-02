# Asset pipeline

Run from `C:\dev\megajam-kit` with the Unreal editor open (MCP server on). Keys come from `.env`.
Run generators from **PowerShell**. Git Bash (Claude Code's Bash tool) rewrites any argument starting with `/`:
`--dest /Game/Props` reached Node as `C:/Program Files/Git/Game/Props`, and the import failed with a misleading
"produced no assets ... file format may not be supported". From Bash, set `MSYS_NO_PATHCONV=1` first.

All generators write to `<Project>/Generated/` where `<Project>` is `MEGAJAM_PROJECT` in the kit's `.env`.
Nothing generated is ever written into the kit.

## Props: prompt to placed actor

```powershell
node gen/asset.ts "an old brass ship lantern" --name Lantern --height 0.45
node gen/asset.ts "a weathered treasure chest" --name Chest --max 0.8 --place 300,0,0 --yaw 270
```

Steps: concept image (Gemini) -> Tripo image-to-3D -> Blender prep -> Blender preview ->
Unreal import + `MI_<Name>` from `M_PBR_Master` + place + screenshot.
Output: `<Project>/Generated/assets/<name>/` (concept, tripo/, SM_<Name>.fbx, textures, preview.png, shot.png, manifest.json).
Unreal: `/Game/Props/<Name>/` (SM_, MI_, T_*).

| Option | Use |
|---|---|
| `--max 0.8` / `--height 1.8` | Real-world size in metres (longest side / height). Always set one. |
| `--concepts 4` | Stop after 4 concept images to pick one, then rerun with `--image <file>`. |
| `--image file` | Start from an existing concept image. |
| `--model file` | Reuse an existing Tripo mesh (no credits). For redoing size/material. |
| `--provider openai` | Concept images from gpt-image-2 instead of Gemini. |
| `--style file --ref img` | Style prefix text and reference images for a consistent look. |
| `--tex 1024` | Smaller textures for small props (default 2048). |
| `--faces 30000` / `--tris N` | Tripo face limit / extra Blender decimation. |
| `--place x,y,z --yaw deg` | Placement in cm. A value starting with `-` needs the `=` form (`--place=-10,-470,60`, `--yaw=-90`), or Node's `parseArgs` fails with "argument is ambiguous". |
| `--hulls 6` | Replace default collision with N convex hulls (4-8 is typical; the script clamps to 1-16). For props the player pushes, carries or brushes against. |
| `--dest /Game/Props` | Unreal content folder for the asset (default `/Game/Props`; the asset goes in `<dest>/<Name>/`). |
| `--no-unreal` | Stop after the FBX. |

Measured 2026-10-24: ~3 min per new prop (Tripo ~2.5-3.5 min), 45 Tripo credits ($0.45).
With `--model`: ~14 s.

Image prices (as of 2026-10; check before quoting): `gemini-3-pro-image` ~$0.134 per 1K/2K image, ~$0.24 per 4K
(Google list price as quoted by third-party gateways; confirm on Google's pricing page). So a new prop is ~$0.58
(one concept + 45 Tripo credits). `gpt-image-2` is billed per token (OpenAI pricing page, as of 2026-10; check
before quoting): $15 per 1M image output tokens, $4 per 1M image input (reference images), $2.50 per 1M text input.
The per-image cost depends on size and quality: estimate it with the calculator in OpenAI's image generation guide.

Known limits: master material is opaque (glass renders dark).

## Characters: concept to playable (tested 2026-10-24: Explorer, Mechanic in a test project)

```powershell
# 1. Three T-pose concepts, then STOP for the director to pick (art direction; also catches A-poses)
node gen/character.ts "a young mechanic in blue work overalls, brown work boots" --name Mechanic --concepts 3
# 2. Everything else (no manual steps)
node gen/character.ts --image <picked concept> --name Mechanic --parent /Script/<Module>.PlayerCharacter
```

Steps: Tripo model (45 cr) -> v3.5 re-texture (20 cr) -> rig `--spec unreal` on the textured task (25 cr) ->
`extract_pbr.py` (colour/normal/roughness/metallic from the textured model) -> `prep_rig.py` (1.8 m, face +Y,
cm export, no textures) -> import -> `MI_<Name>` of `M_PBR_Master` (textures capped at 2048 in-game, 4K source
kept) -> root-scale gate -> IK rigs + retargeter + batch retarget of `ABP_Unarmed` -> `BP_<Name>` on `--parent`.
Measured: ~4 min and 90 credits per new character; a rebuild from downloaded files takes ~20 s and no credits.

**Balance first:** `character.ts` and `asset.ts` check `tripo balance --json` before the first paid step and stop if
the run can't finish (90 new, 45 from `--task`, 25 rig only, 45 per prop). Before that check existed, a run spent 45
credits on the model and then failed the re-texture on "Insufficient credits"; the model survived (resume with
`--task <id>`). Tripo exit 6 (timed out) or 7 (network) can still bill: resume with `tripo task watch <id> --download`
(id from `tripo history --limit 3`), never re-run. `run()` prints these hints.

**A-pose concepts? T-pose pass (5 credits, manual for now).** Concepts can come out A-pose despite the T-pose
wording: 6/6 for a long outfit description (hood, shoulder cape, long coat); a plainer outfit the same day gave 2/3
T-pose. Fix the picked concept before image-to-model:
`tripo generate image-to-image <concept> --model seedream_v5 -p template=t_pose` gave a clean T-pose with outfit,
colours and silhouette kept, for 5 credits (as of 2026-10; check before quoting). Output was 1024×1024 PNG, not the
documented 2048. `generate` has no `--dry-run`; the price is on Tripo's developer pricing page, not in `tripo docs`.
Show the director the result next to the original. (`character.ts --tpose` is planned.)

| Option | Use |
|---|---|
| `--concepts N` | Stop after N T-pose concepts. Always do this first. |
| `--image file` | Start from a picked concept. |
| `--task id [--pbr file]` | Start from a Tripo task. With `--pbr`, rig it as is; without, re-texture it first. |
| `--rig fbx --pbr file` | Rebuild from downloaded files: no credits (e.g. after a pipeline fix, or the editor was closed). |
| `--no-retexture` | Skip the v3.5 re-texture (saves 20 credits: 70 per new character instead of 90); maps come from the first model. Blotch risk. |
| `--max-tex 2048` | In-game texture cap (cooked size). Raise to 4096 for a hero/close-up character; no regeneration. |
| `--tex N` | Source texture budget for `extract_pbr.py` in px (default 0 = full resolution; prefer `--max-tex`). |
| `--parent /Script/M.C` | Make `BP_<Name>`: thin subclass of the game's C++ Character (mesh, ABP, offset only). |
| `--height 1.8` `--rot -90` | Real height in metres; Blender Z rotation (Tripo faces +X in Unreal; -90 makes +Y like Manny). |
| `--faces 30000` | Tripo face limit for the model. |
| `--spec unreal` | Tripo rig spec (default `unreal`: Manny bone names). |
| `--provider openai` `--style file --ref img` | Concept image provider and style inputs, as for props. |
| `--no-unreal` | Stop before the Unreal import (files only). |

Needs the Third Person content pack in the project (Manny + `ABP_Unarmed`). Reruns rebuild the character's folder
(`clean_character.py`; see "Hard-won facts").

**Foot IK (automatic, step 6b):** the retargeted `ABP_Unarmed_<Name>` keeps Epic's `CR_Mannequin_FootIK` Control Rig
node, which twists non-Manny feet. `gen/unreal/abp.ts strip-footik <ABP>` deletes it and its NOT / Is Falling inputs,
wires Slot -> Output Pose, compiles and force-saves (idempotent; character.ts runs it).

Blend space speeds: `docs/ue/characters.md` "Anim Blueprint driven from C++" (Blend Space).

## Audio

```powershell
node gen/audio.ts sfx "heavy wooden chest lid creaking open" --seconds 2.5 --name ChestOpen
node gen/audio.ts sfx "night forest ambience, crickets" --seconds 20 --loop --name ForestAmb
node gen/audio.ts music "calm mysterious exploration theme, harp, low strings" --seconds 90 --name Explore
node gen/audio.ts voice "The map was right." --name Line01      # needs TTS permission on the key
node gen/audio.ts plan "slow ambient folk cue, 72 BPM, D dorian" --seconds 60 --name Explore   # free plan JSON
node gen/audio.ts music --plan <Generated\audio\MUS_Explore.plan.json> --seed 1 --name Explore
node gen/audio.ts design "<voice description>" --name Narrator --preview "<in-character text>"  # 3 previews
node gen/audio.ts save <generated_voice_id> --name Narrator                                    # keep the pick
```

Output: `<Project>/Generated/audio/SFX_*.mp3/.wav`, `MUS_*`, `VO_*`. Music is instrumental unless `--vocals`.
WAVs (48 kHz, 16-bit, via ffmpeg) are imported automatically into `/Game/Audio/SFX|Music|Voice`
when the editor is open; music and `--loop` sounds are set to loop. Needs the MegajamTools plugin.
Add `--mono` for any sound played at a location in the world (footsteps, chest, pickups); keep
stereo for music, UI and 2D ambience.
Measured: SFX ~2 s end to end, 30 s music track ~6 s.

| Option | Use |
|---|---|
| `--n 3` | Variants, named `_1`, `_2`, `_3` (1-6), at most 2 (music) or 3 at once. Each is billed. A re-run with the same name moves the old take to `old\`. |
| `--plan file` / `--seed N` | Music from an edited composition plan (`plan` command) / seed for voice or plan music. |
| `--timestamps` | Voice: per-character timing in the `.json` sidecar for subtitles. |
| `--stability 0.45`, `--similarity 0.75` | Voice: `voice_settings` (0-1). Lower stability is more varied; keep one value per character. |
| `--influence 0.4` | SFX only: how closely the sound follows the prompt (ElevenLabs `prompt_influence`, 0-1). |
| `--format mp3_44100_128` | ElevenLabs output format (`mp3_*`, `opus_*`, `wav_*`, `pcm_*`); the WAV for Unreal is made by ffmpeg either way. |
| `--voice id` | Voice for `voice` lines (`node gen/audio.ts voices` lists ids). |
| `--vocals` / `--loop` / `--mono` | Music with vocals / looping SFX / one channel (see above). |
| `--no-unreal` | Files only, no import. |
| `--model id` | Override the model. Defaults: SFX `eleven_text_to_sound_v3` (v2 is deprecated and retired 2027-02-01; same parameters), voice `eleven_v4` (`eleven_multilingual_v2` is the old default). |

**How to prompt, limits, prices and licence: `docs/elevenlabs.md`** (sound effects, music with composition plans,
voice lines on Eleven v4, designing a narrator or character voice). Read it before generating.

## Motion: Uthana (text-to-motion)

No kit script yet (`gen/uthana.ts` is planned: generate with cost logged, fetch, then import, bake root, retarget).
Facts from one trial (3 clips: idle fidget, hit reaction, death; no re-rolls needed):

- **API:** one GraphQL endpoint, `https://uthana.com/graphql`, HTTP Basic auth with the key (`UTHANA_API_KEY` in
  `.env`) as the user and an empty password. Keep the key in the auth header only.
- **Models:** `text-to-motion-3.0` is async (`create_text_to_motion_job`, poll `job(job_id:)` until `FINISHED`;
  `result.result.id` is the motion id; 134-193 s per job). `text-to-motion-bucmd` (2.0) is a synchronous mutation.
  3.0 has a **4 s minimum** length. `{ org { payg_total_usd ... } payg_prices { ... } }` shows balance and prices free.
- **Cost** (as of 2026-10; check before quoting): billed per second of output, ~$0.10/s plus ~$0.004 per call. Rule
  of thumb **~$0.40 per 4 s clip** (a 5 s clip was ~$0.50).
- **Output:** FBX from `https://uthana.com/motion/file/motion_viewer/<character>/<motion>/fbx/<name>.fbx?fps=30` (same
  auth), 30 fps, retargeted to Uthana's built-in UE5 Manny (`c43tbGks3crJ`). Each file **bundles a skinned Manny
  mesh** (~8.8 MB per clip; causes a harmless "No smoothing group information" warning): discard it on import.
- **Import and fit** (root bake before retargeting, trimming, open hands): `docs/ue/animation-library.md` "Uthana".

## Individual tools

| Tool | Does |
|---|---|
| `gen/image.ts` | Concept images (Gemini `gemini-3-pro-image` / OpenAI `gpt-image-2`), `--asset` framing for 3D |
| `tripo` CLI | Image-to-3D, rig, retarget, decimate, convert (`tripo docs --llm`) |
| `gen/blender/prep.py` | Size, pivot at base, texture budget, single mesh, UE-scaled FBX |
| `gen/blender/inspect.py` | Stats JSON + preview render |
| `gen/unreal/mcp.ts` | Call any Unreal MCP tool from scripts; `captureViewport()` |
| `gen/unreal/py.ts` | Run a Python file (or `-c` code) in the editor via `run_python`; `--arg k=v` -> `ARGS` dict |
| `gen/unreal/shot.ts` | Viewport screenshot to PNG (`--wait N` for shader compiles) |
| `gen/character.ts` | Concept -> rigged, PBR-textured, retargeted character (+ BP); see Characters |
| `gen/blender/prep_rig.py` | Rigged character: height, facing, armature-safe cm export, textures stripped |
| `gen/blender/pack_orm.py` | Pack roughness/metallic/AO PNGs into `T_<Name>_orm.png` for M_PBR_Master (v2+) |
| `gen/blender/mesh_compare.py` | Compare two rigged FBX meshes (counts, UVs, normals, skin-weight steps), e.g. after a hand-fixed rig |
| `gen/audio.ts` | SFX, music and voice via ElevenLabs, converted and imported; see Audio |
| `gen/unreal/abp.ts` | `strip-footik <ABP>`: remove the foot-IK Control Rig node from a retargeted `ABP_Unarmed` |
| `gen/unreal/anim_inventory.ts` | Offline inventory of a project's animation content (no editor), to find a library's source mesh |
| `gen/unreal/retarget_library.ts` | Retarget a whole animation library folder onto a `character.ts` character (`docs/ue/animation-library.md`) |
| `gen/perf/bench.ts` / `csv_report.ts` | Benchmark render variants on the packaged build / summarise an Unreal CSV profile (`docs/ue/performance.md`) |
| `gen/test/keytest.ps1` | Real-input key test of a packaged build (ask the director first; aborts if the game loses focus) |
| `gen/test/autoclip.ps1` | Film the game playing itself through an autoplay hook (no key injection) |
| `gen/test/record_window.ps1` | Record the game window only, while it has focus |
| `gen/test/game_test.ps1` | Run a scripted test in a standalone `-game` instance and print its result lines |
| `gen/blender/extract_pbr.py` | Colour/normal/roughness/metallic PNGs from a Tripo textured model (FBX or GLB) |
| `gen/unreal/py/import_skeletal.py` / `check_skeletal.py` / `retarget_setup.py` / `clean_character.py` / `make_character_bp.py` | Skeletal import, root-scale check, IK retarget, safe rebuild, thin BP |
| `gen/unreal/materials.ts` | `M_PBR_Master` + per-asset material instances |
| `gen/vfx/vfx.ts` | VFX building blocks: procedural mask/noise textures, `M_VFX_Master` + per-effect instances, effect meshes (`docs/ue/vfx.md` "Kit VFX building blocks") |
| `unreal/Plugins/MegajamTools` | Project plugin: MCP tools `import_sound`, `import_any`, `run_console_command`, `run_python`, `get_sound_info` |

## Tool references (check here when a generation step fails)

- Tripo CLI: `tripo docs --llm` (full agent guide, offline), `tripo docs --topic commands/make`,
  `tripo docs --topic examples/game-asset`, `tripo docs --topic examples/animation`.
  API docs as raw markdown: https://developers.tripo3d.com/en/docs/<page>.md (index: https://developers.tripo3d.com/llms.txt).
  The docs site serves binary to some fetchers; fetching the .md with curl/Invoke-WebRequest works.
- ElevenLabs: sound effects https://elevenlabs.io/docs/api-reference/text-to-sound-effects/convert.md ,
  music https://elevenlabs.io/docs/api-reference/music/compose.md ,
  text to speech https://elevenlabs.io/docs/api-reference/text-to-speech/convert.md
- Gemini images: https://ai.google.dev/gemini-api/docs/nanobanana (Interactions API, JPEG output only).
- OpenAI images: Images API, model `gpt-image-2` (generations; edits when reference images are given).

## Hard-won facts (UE 5.8.4)

- FBX from Blender must use `apply_scale_options=FBX_SCALE_NONE`; the other modes import 100x too small and UE drops triangles.
- The FBX importer's auto materials drop the metallic map and can fail to compile. Always use `M_PBR_Master`.
- `CaptureViewport` requires `captureTransform` and `annotations`; the image comes back inside JSON.
- `add_to_scene_from_asset` `snap_to_ground` did not move the actor; place at z=0 (pivots are at the base).
- Generated props import with 1 LOD and Nanite off; the pipeline enables Nanite. See `docs/ue/performance.md`.
- Master material needs usage flags (Nanite, skeletal, instanced) set up front; a missing flag in a packaged build = default material.
- After material/Nanite changes, wait ~20 s for shader compiles before taking a judging screenshot (props render grey/blocky meanwhile).
- **Skeletal meshes: the root bone must have scale 1.** Unreal's FBX `import_uniform_scale` and Blender's
  `FBX_SCALE_NONE` both put the scale on the root bone (x180 / x100); the mesh looks right in T-pose, but every
  retargeted animation collapses to ~1 cm or flies km away (player looks "invisible", camera seems first-person).
  Only `prep_rig.py`'s cm workflow (unit scale 0.01, rig x100 applied, `FBX_SCALE_NONE`) passes `check_skeletal.py`.
  `FBX_SCALE_ALL` / `FBX_SCALE_UNITS` give root scale 1 but import at 1/100 size.
- Tripo's rigged FBX is 1 m tall, faces +X in Unreal, bones use Manny names (61 bones, no `ik_foot_*`). Rig/rig-check
  reject `convert_model` tasks (API 2006): pass the `image_to_model` task id. The `tripo` CLI only reads
  `TRIPO_API_KEY` from the environment (asset.ts loads `.env`; manual runs must too).
- Retargeted `ABP_Unarmed` keeps the `CR_Mannequin_FootIK` Control Rig node: compile warnings "Hierarchy
  discrepancy" and twisted feet on non-Manny skeletons. `gen/unreal/abp.ts` removes it (BlueprintTools edits AnimGraphs via MCP).
- Placed SkeletalMeshActors don't evaluate animation in the editor viewport (even with `set_update_animation_in_editor`).
  Verify animation in PIE: start with `LevelEditorSubsystem.editor_request_begin_play()`, screenshot with
  `HighResShot WxH filename=...` on the PIE world, read bone positions with `get_socket_location`.
- Inline Python through PowerShell breaks on quotes. Put scripts in files and run `node gen/unreal/py.ts file.py --arg k=v`.
- **Tripo's rig FBX keeps only the colour image** and points its normal-map slot at that same image (verified by
  scanning the file: 1 JPEG inside; the textured GLB has 3 maps). Imported as is, the colour map is used as the
  normal map: blotchy, wrong lighting in Unreal. Take PBR maps from the textured model (`extract_pbr.py`) and
  export the rig without textures.
- Tripo texture quality varies between models with identical settings (Explorer clean, two Mechanics blotchy
  in Tripo's own preview). `tripo model texture <task> --model v3.5-20260815 --texture-quality detailed`
  (delight on by default) fixed it: 20 credits, ~70 s, output GLB packs roughness (G) + metallic (B).
  `tripo anim rig` accepts the `texture_model` task. The command is `tripo model texture` (not `tripo texture`);
  `--dry-run` exists on `make` only. `--for game-pc` and `--for anim` send the same generation settings.
- T-pose concepts: say the arm angle ("exactly 90 degrees, NOT an A-pose") and camera alignment ("facing the
  viewer squarely, zero rotation, symmetrical"): 3/3 clean vs 1/2 without (one A-pose, one turned body) for a short
  prompt. It doesn't hold for long outfit descriptions (0/6 later); use the Tripo T-pose pass (Characters).
- Editor Python must never delete an asset something else references: `delete_asset` force-deletes, but the
  object lives on in memory, and creating one with the same name then opens a modal **"Overwrite Existing
  Object"** dialog that blocks the game thread (and every MCP call) until someone clicks. Reuse shared assets
  (`IK_Manny`), delete referencers first, check `get_referencers` and refuse with a message instead.
- Re-importing a skeletal mesh deletes its skeleton; an existing ABP for that skeleton then fails to compile
  ("The skeleton asset for this animation Blueprint is missing"). Rebuild a character's whole folder at once.
- Texture size: keep the full-res source and set `MaxTextureSize` (cooked size) instead of downscaling in
  Blender, so a hero asset can be raised later with one setting. Characters do this (`--max-tex`); props still
  downscale in `prep.py`.
- M_PBR_Master (now v3) is version-tagged and rebuilt **in place** (`materials.ts master [--force]`). Existing
  instances keep working; ones made before v2 lose their old Roughness/Metallic parameters until rebuilt
  (`asset.ts --model`, `character.ts --rig --pbr`: free). Details: `docs/ue/materials.md` "Master material".
- `asset.ts` reruns used to stack a new actor each time while the old ones pointed at the deleted mesh; it now
  removes same-label actors first. Editor scripts that run user code: catch `SystemExit` too (`run_python` does).
- **Imported props get one auto convex hull, which fills openings** (arches, gates, tunnels): an arch walled off a
  finish line. Use complex-as-simple (low-poly only) or authored boxes for anything passed through, and line-trace it.
- **Generated textures drift off the palette** given in the prompt (redder, glossier). Fit the MI's Tint/Saturation/
  RoughnessOffset to the palette instead of re-rolling (`docs/ue/materials.md`). No credits.
- **Tripo's auto-rig on non-human proportions** (short arms, round body) can put the shoulder joint well above the
  arm, end the arm chain early and weight the outer arm to finger bones: arms shear and crumple. Diagnose in Blender
  and fix the rig and weights from the downloaded files, then always smooth the weights (`docs/ue/characters.md`).
- **`character.ts` replaces the whole character folder.** Anything else you created inside it (extra MIs, tint
  variants) is deleted, and it refuses while assets outside the folder reference the character: clear those
  references first, rerun, then reattach. Keep project-made assets for a character in a separate folder.
- **Re-running a batch retarget with overwrite breaks the cook** (blend space samples point at temporary
  `_<Suffix>1` packages). Repair the blend space samples and delete the orphan ABP (`docs/ue/characters.md`).
- **The first `bench.ts` run right after packaging reads low** (~13%: shader/PSO cache warm-up) and the very first
  launch of a fresh exe can fail to start (likely the exe being scanned). `bench.ts` runs a warm-up launch and
  relaunches once if the game doesn't start.
- **ElevenLabs pricing** differs by product (per generation vs per second for SFX; music per minute). Check the
  current price on the account page before a batch and quote it; one prototype batch (1 music track, 4 SFX) was ~$0.70.
- **A launcher update of the Fab plugin can break every C++ build and `package.ps1`** with `RulesError` naming
  `FabToolset` (the editor still runs). Fix: disable Fab in the `.uproject` (`SETUP.md` step 2); `package.ps1`
  prints the hint. Packaged in 4 min afterwards on the rehearsal.
- **numpy exists only in Blender's bundled Python** (`<Blender>\<version>\python\bin\python.exe`), not in the
  editor's Python nor (on the target PC) the system Python, which has PIL. Generate numeric fields (heightmaps, layer
  weights, carve masks) there, write raw files, and read them in the editor with `array` (`docs/ue/worldbuilding.md`
  "Landscape from Python").
- **Uploads:** `SETUP.md` section 9.
