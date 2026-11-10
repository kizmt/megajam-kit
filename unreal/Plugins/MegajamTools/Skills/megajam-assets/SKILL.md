---
name: megajam-assets
description: The megajam-kit's rules for importing, naming, placing and materialling assets in this project (generated props and characters, textures, collision). Load before importing, placing or assigning materials.
---

Rules from the megajam-kit. Full detail: `C:\dev\megajam-kit\PIPELINE.md` ("Hard-won facts"),
`C:\dev\megajam-kit\docs\ue\naming.md`, `C:\dev\megajam-kit\docs\ue\materials.md`.

USE THE KIT'S PIPELINE
- Generated props and characters come from the kit's scripts (gen/asset.ts, gen/character.ts), run by the main
  session from the terminal. They import, make the material instance, set Nanite and place. Don't rebuild these steps
  by hand; rerun the script (no-credit rebuilds: asset.ts --model, character.ts --rig --pbr).
- Paid generations cost real money: never start one from the editor.

NAMES AND FOLDERS
- Epic prefixes: SM_, SK_, M_, MI_, T_, BP_, WBP_, ABP_, AS_, AM_, BS_, FXS_ (Niagara system), DT_, LS_. Kit additions:
  SFX_, MUS_, VO_, MSS_ (MetaSound Source), IA_/IMC_ (input), IK_/RTG_, DA_, MF_, L_ (the main map stays Main).
- Folders: /Game/Props/<Name>/, /Game/Characters/<Name>/, /Game/Audio/{SFX,Music,Voice}/, /Game/Maps/,
  /Game/Kit/ (shared master materials and the VFX set; game content goes elsewhere).
- Move or rename only through the editor or AssetTools, so references and redirectors stay valid.

MATERIALS
- Every generated asset uses an instance (MI_<Name>) of M_PBR_Master. The FBX importer's own materials drop the
  metallic map and can fail to compile: don't keep them.
- Fit off-palette textures with the instance's Tint, Saturation and RoughnessOffset; never re-generate for colour.
- Blender-made normal maps are OpenGL (Y+): apply them with flipped green (materials.ts apply ... --opengl-normals).
- After material or Nanite changes, wait for shader compiles (about 20 s) before judging a screenshot.

IMPORT AND MESHES
- FBX from Blender: apply_scale_options=FBX_SCALE_NONE. Other modes import 100x too small.
- Skeletal meshes: the root bone must have scale 1, or every retargeted animation collapses or flies away. Only the
  kit's prep_rig.py workflow passes check_skeletal.py.
- Re-importing a skeletal mesh deletes its skeleton and breaks its Anim Blueprint: rebuild a character's whole folder.
- Keep full-resolution source textures and cap the cooked size with MaxTextureSize instead of downscaling.

PLACING AND COLLISION
- Pivots are at the base: place at the floor height. add_to_scene_from_asset's snap_to_ground did not move the actor.
- An imported prop gets one convex hull, which fills openings (arches, gates, tunnels). Use complex-as-simple on
  static architecture, or authored boxes for anything the player passes through, and line-trace it.
