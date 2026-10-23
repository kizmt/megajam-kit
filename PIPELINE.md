# Asset pipeline

Run from `C:\dev\megajam-kit` with the Unreal editor open (MCP server on). Keys come from `.env`.

## Props: prompt to placed actor

```powershell
node gen/asset.mjs "an old brass ship lantern" --name Lantern --height 0.45
node gen/asset.mjs "a weathered treasure chest" --name Chest --max 0.8 --place 300,0,0 --yaw 270
```

Steps: concept image (Gemini) -> Tripo image-to-3D -> Blender prep -> Blender preview ->
Unreal import + `MI_<Name>` from `M_PBR_Master` + place + screenshot.
Output: `out/assets/<name>/` (concept, tripo/, SM_<Name>.fbx, textures, preview.png, shot.png, manifest.json).
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
| `--hulls 6` | Replace default collision with N convex hulls (4–8). For props the player pushes, carries or brushes against. |
| `--no-unreal` | Stop after the FBX. |

Measured 2026-10-24: ~3 min per new prop (Tripo ~2.5-3.5 min), 45 Tripo credits ($0.45).
With `--model`: ~14 s.

Known limits: master material is opaque (glass renders dark).

## Characters: concept to playable (tested 2026-10-24, Explorer in SmokeTest)

Manual sequence for now (to be wrapped as `gen/character.mjs`). Details and reasoning: `docs/ue/characters.md`.

```powershell
# 1. T-pose concept (pick one with arms straight out; A-pose rigs worse)
node gen/image.mjs "Full-body character ... strict T-pose, arms straight out horizontally, front orthographic view, plain light-grey background" --n 2 --aspect 3:4 --out out/characters/<name>
# 2. Model, then rig the ORIGINAL image_to_model task (not the game-pc convert task). Load TRIPO_* from .env first.
tripo make <concept.jpg> --for game-pc -p face_limit=30000 -o out/characters/<name>/tripo/model --json --yes --no-open
#    original task id = "original_model_id" in the model's task.json
tripo anim rig <image_to_model task id> --spec unreal --out-format fbx -o out/characters/<name>/tripo/rig --json --yes --no-open
# 3. Armature-safe size/facing in Blender (cm workflow), then import and check
blender -b --factory-startup --python gen/blender/prep_rig.py -- <rig model.fbx> out/characters/<name>/SK_<Name>.fbx --height 1.8
node gen/unreal/py.mjs gen/unreal/py/import_skeletal.py --arg fbx=<SK_Name.fbx> --arg folder=/Game/Characters/<Name> --arg name=SK_<Name>
node gen/unreal/py.mjs gen/unreal/py/check_skeletal.py --arg mesh=/Game/Characters/<Name>/SK_<Name>   # must print CHECK_SKELETAL ok
# 4. IK rigs + retargeter + batch retarget of ABP_Unarmed (needs the Third Person content pack in the project)
node gen/unreal/py.mjs gen/unreal/py/retarget_setup.py --arg name=<Name>
```

5. **[UI, 2 min]** Open `ABP_Unarmed_<Name>` → AnimGraph → delete the **Control Rig** node (CR_Mannequin_FootIK) between
   `Slot 'DefaultSlot'` and `Output Pose`, wire Slot → Output Pose, delete the orphaned NOT / Is Falling nodes, Compile, Save.
   Without this the feet twist outwards (Tripo's skeleton lacks Manny's extra spine/metacarpal bones).
6. Character: mesh `SK_<Name>`, Anim Class `ABP_Unarmed_<Name>`, mesh offset Z = -capsule half-height, yaw 270 (same as Manny).
7. Verify in PIE (not the editor viewport): walk (speed 300), jog (600), jump, land.

Measured: concept 26 s, Tripo model ~2.5 min, rig 25 s (25 credits), Blender + import + retarget < 1 min.
Blend space speeds: idle 0, walk 300, jog 600. A keyboard always gives full speed, so walking needs a walk key or MaxWalkSpeed 300.

## Audio

```powershell
node gen/audio.mjs sfx "heavy wooden chest lid creaking open" --seconds 2.5 --name ChestOpen
node gen/audio.mjs sfx "night forest ambience, crickets" --seconds 20 --loop --name ForestAmb
node gen/audio.mjs music "calm mysterious exploration theme, harp, low strings" --seconds 90 --name Explore
node gen/audio.mjs voice "The map was right." --name Line01      # needs TTS permission on the key
```

Output: `out/audio/SFX_*.mp3/.wav`, `MUS_*`, `VO_*`. Music is instrumental unless `--vocals`.
WAVs (48 kHz, 16-bit, via ffmpeg) are imported automatically into `/Game/Audio/SFX|Music|Voice`
when the editor is open; music and `--loop` sounds are set to loop. Needs the MegajamTools plugin.
Add `--mono` for any sound played at a location in the world (footsteps, chest, pickups); keep
stereo for music, UI and 2D ambience.
Measured: SFX ~2 s end to end, 30 s music track ~6 s.

## Individual tools

| Tool | Does |
|---|---|
| `gen/image.mjs` | Concept images (Gemini `gemini-3-pro-image` / OpenAI `gpt-image-2`), `--asset` framing for 3D |
| `tripo` CLI | Image-to-3D, rig, retarget, decimate, convert (`tripo docs --llm`) |
| `gen/blender/prep.py` | Size, pivot at base, texture budget, single mesh, UE-scaled FBX |
| `gen/blender/inspect.py` | Stats JSON + preview render |
| `gen/unreal/mcp.mjs` | Call any Unreal MCP tool from scripts; `captureViewport()` |
| `gen/unreal/py.mjs` | Run a Python file (or `-c` code) in the editor via `run_python`; `--arg k=v` → `ARGS` dict |
| `gen/unreal/shot.mjs` | Viewport screenshot to PNG (`--wait N` for shader compiles) |
| `gen/blender/prep_rig.py` | Rigged character: height, facing, armature-safe cm export |
| `gen/unreal/py/import_skeletal.py` / `check_skeletal.py` / `retarget_setup.py` | Skeletal import, root-scale check, IK rigs + retarget + batch |
| `gen/unreal/materials.mjs` | `M_PBR_Master` + per-asset material instances |
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
  `TRIPO_API_KEY` from the environment (asset.mjs loads `.env`; manual runs must too).
- Retargeted `ABP_Unarmed` keeps the `CR_Mannequin_FootIK` Control Rig node: compile warnings "Hierarchy
  discrepancy" and twisted feet on non-Manny skeletons. Delete it (UI; AnimGraph nodes can't be edited from Python).
- Placed SkeletalMeshActors don't evaluate animation in the editor viewport (even with `set_update_animation_in_editor`).
  Verify animation in PIE: start with `LevelEditorSubsystem.editor_request_begin_play()`, screenshot with
  `HighResShot WxH filename=...` on the PIE world, read bone positions with `get_socket_location`.
- Inline Python through PowerShell breaks on quotes. Put scripts in files and run `node gen/unreal/py.mjs file.py --arg k=v`.
