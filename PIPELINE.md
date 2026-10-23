# Asset pipeline

Run from `C:\dev\megajam-kit` with the Unreal editor open (MCP server on). Keys come from `.env`.

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
| `--place x,y,z --yaw deg` | Placement in cm. Use `--yaw=-90` form for negatives. |
| `--hulls 6` | Replace default collision with N convex hulls (4Ã¢â‚¬â€œ8). For props the player pushes, carries or brushes against. |
| `--no-unreal` | Stop after the FBX. |

Measured 2026-10-24: ~3 min per new prop (Tripo ~2.5-3.5 min), 45 Tripo credits ($0.45).
With `--model`: ~14 s.

Known limits: master material is opaque (glass renders dark).

## Characters: concept to playable (tested 2026-10-24: Explorer, Mechanic in SmokeTest)

```powershell
# 1. Three T-pose concepts, then STOP for Scott to pick (art direction; also catches A-poses)
node gen/character.ts "a young mechanic in blue work overalls, brown work boots" --name Mechanic --concepts 3
# 2. Everything else, then the one manual step it prints
node gen/character.ts --image <picked concept> --name Mechanic --parent /Script/<Module>.PlayerCharacter
```

Steps: Tripo model (45 cr) -> v3.5 re-texture (20 cr) -> rig `--spec unreal` on the textured task (25 cr) ->
`extract_pbr.py` (colour/normal/roughness/metallic from the textured model) -> `prep_rig.py` (1.8 m, face +Y,
cm export, no textures) -> import -> `MI_<Name>` of `M_PBR_Master` (textures capped at 2048 in-game, 4K source
kept) -> root-scale gate -> IK rigs + retargeter + batch retarget of `ABP_Unarmed` -> `BP_<Name>` on `--parent`.
Measured: ~4 min and 90 credits per new character; a rebuild from downloaded files takes ~20 s and no credits.

| Option | Use |
|---|---|
| `--concepts N` | Stop after N T-pose concepts. Always do this first. |
| `--image file` | Start from a picked concept. |
| `--task id [--pbr file]` | Start from a Tripo task. With `--pbr`, rig it as is; without, re-texture it first. |
| `--rig fbx --pbr file` | Rebuild from downloaded files: no credits (e.g. after a pipeline fix, or the editor was closed). |
| `--no-retexture` | Skip the v3.5 re-texture (70 credits); maps come from the first model. Blotch risk. |
| `--max-tex 2048` | In-game texture cap (cooked size). Raise to 4096 for a hero/close-up character; no regeneration. |
| `--parent /Script/M.C` | Make `BP_<Name>`: thin subclass of the game's C++ Character (mesh, ABP, offset only). |
| `--height 1.8` `--rot -90` | Real height in metres; Blender Z rotation (Tripo faces +X in Unreal; -90 makes +Y like Manny). |

Needs the Third Person content pack in the project (Manny + `ABP_Unarmed`). Reruns replace the character's whole
folder (`clean_character.py`); if anything outside it still references the character (game mode pawn, placed
actors), the run stops and lists them instead of triggering an Unreal dialog. Point those elsewhere first.

**Manual step (2 min, UI):** open `ABP_Unarmed_<Name>` > AnimGraph, delete the **Control Rig** node
(`CR_Mannequin_FootIK`) between `Slot 'DefaultSlot'` and `Output Pose` plus the orphaned NOT / Is Falling nodes,
wire Slot -> Output Pose, Compile, Save. Without it the feet twist outwards.

Blend space speeds: idle 0, walk 300, jog 600 (the C++ player recipe in `docs/ue/gameplay.md` matches these).

## Audio

```powershell
node gen/audio.ts sfx "heavy wooden chest lid creaking open" --seconds 2.5 --name ChestOpen
node gen/audio.ts sfx "night forest ambience, crickets" --seconds 20 --loop --name ForestAmb
node gen/audio.ts music "calm mysterious exploration theme, harp, low strings" --seconds 90 --name Explore
node gen/audio.ts voice "The map was right." --name Line01      # needs TTS permission on the key
```

Output: `<Project>/Generated/audio/SFX_*.mp3/.wav`, `MUS_*`, `VO_*`. Music is instrumental unless `--vocals`.
WAVs (48 kHz, 16-bit, via ffmpeg) are imported automatically into `/Game/Audio/SFX|Music|Voice`
when the editor is open; music and `--loop` sounds are set to loop. Needs the MegajamTools plugin.
Add `--mono` for any sound played at a location in the world (footsteps, chest, pickups); keep
stereo for music, UI and 2D ambience.
Measured: SFX ~2 s end to end, 30 s music track ~6 s.

## Individual tools

| Tool | Does |
|---|---|
| `gen/image.ts` | Concept images (Gemini `gemini-3-pro-image` / OpenAI `gpt-image-2`), `--asset` framing for 3D |
| `tripo` CLI | Image-to-3D, rig, retarget, decimate, convert (`tripo docs --llm`) |
| `gen/blender/prep.py` | Size, pivot at base, texture budget, single mesh, UE-scaled FBX |
| `gen/blender/inspect.py` | Stats JSON + preview render |
| `gen/unreal/mcp.ts` | Call any Unreal MCP tool from scripts; `captureViewport()` |
| `gen/unreal/py.ts` | Run a Python file (or `-c` code) in the editor via `run_python`; `--arg k=v` Ã¢â€ â€™ `ARGS` dict |
| `gen/unreal/shot.ts` | Viewport screenshot to PNG (`--wait N` for shader compiles) |
| `gen/character.ts` | Concept -> rigged, PBR-textured, retargeted character (+ BP); see Characters |
| `gen/blender/prep_rig.py` | Rigged character: height, facing, armature-safe cm export, textures stripped |
| `gen/blender/pack_orm.py` | Pack roughness/metallic/AO PNGs into `T_<Name>_orm.png` for M_PBR_Master v2 |
| `gen/blender/extract_pbr.py` | Colour/normal/roughness/metallic PNGs from a Tripo textured model (FBX or GLB) |
| `gen/unreal/py/import_skeletal.py` / `check_skeletal.py` / `retarget_setup.py` / `clean_character.py` / `make_character_bp.py` | Skeletal import, root-scale check, IK retarget, safe rebuild, thin BP |
| `gen/unreal/materials.ts` | `M_PBR_Master` + per-asset material instances |
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
- Gemini image API only returns JPEG.
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
  discrepancy" and twisted feet on non-Manny skeletons. Delete it (UI; AnimGraph nodes can't be edited from Python).
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
  viewer squarely, zero rotation, symmetrical"): 3/3 clean vs 1/2 without (one A-pose, one turned body).
- Editor Python must never delete an asset something else references: `delete_asset` force-deletes, but the
  object lives on in memory, and creating one with the same name then opens a modal **"Overwrite Existing
  Object"** dialog that blocks the game thread (and every MCP call) until someone clicks. Reuse shared assets
  (`IK_Manny`), delete referencers first, check `get_referencers` and refuse with a message instead.
- Re-importing a skeletal mesh deletes its skeleton; an existing ABP for that skeleton then fails to compile
  ("The skeleton asset for this animation Blueprint is missing"). Rebuild a character's whole folder at once.
- Texture size: keep the full-res source and set `MaxTextureSize` (cooked size) instead of downscaling in
  Blender, so a hero asset can be raised later with one setting. Characters do this (`--max-tex`); props still
  downscale in `prep.py`.
- M_PBR_Master is version-tagged and rebuilt **in place** (`materials.ts master [--force]`). Existing instances
  keep working; ones made before v2 lose their old Roughness/Metallic parameters until rebuilt (`asset.ts --model`,
  `character.ts --rig --pbr`: free). Details: `docs/ue/materials.md` "Master material v2".
- `asset.ts` reruns used to stack a new actor each time while the old ones pointed at the deleted mesh; it now
  removes same-label actors first. Editor scripts that run user code: catch `SystemExit` too (`run_python` does).
