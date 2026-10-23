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
| `--no-unreal` | Stop after the FBX. |

Measured 2026-10-24: ~3 min per new prop (Tripo ~2.5-3.5 min), 45 Tripo credits ($0.45).
With `--model`: ~14 s.

Known limits: master material is opaque (glass renders dark); characters/rigging not covered yet.

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
Measured: SFX ~2 s end to end, 30 s music track ~6 s.

## Individual tools

| Tool | Does |
|---|---|
| `gen/image.mjs` | Concept images (Gemini `gemini-3-pro-image` / OpenAI `gpt-image-2`), `--asset` framing for 3D |
| `tripo` CLI | Image-to-3D, rig, retarget, decimate, convert (`tripo docs --llm`) |
| `gen/blender/prep.py` | Size, pivot at base, texture budget, single mesh, UE-scaled FBX |
| `gen/blender/inspect.py` | Stats JSON + preview render |
| `gen/unreal/mcp.mjs` | Call any Unreal MCP tool from scripts; `captureViewport()` |
| `gen/unreal/materials.mjs` | `M_PBR_Master` + per-asset material instances |
| `unreal/Plugins/MegajamTools` | Project plugin: MCP tools `import_sound`, `import_any`, `run_console_command`, `get_sound_info` |

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
