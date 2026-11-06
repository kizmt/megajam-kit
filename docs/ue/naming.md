# Asset naming

Format (Epic): `[Prefix]_[AssetName]_[Descriptor]_[Variant]`, e.g. `T_Chest_Normal`, `SM_Rock_Moss_02`.
Descriptor says how the asset is used; variant is an optional letter/number.

## Epic's official prefixes (UE 5.8 docs)

| Asset | Prefix | | Asset | Prefix |
|---|---|---|---|---|
| Static Mesh | `SM_` | | Animation Sequence | `AS_` |
| Skeletal Mesh | `SK_` | | Montage | `AM_` |
| Skeleton | `SKEL_` | | Blend Space | `BS_` |
| Physics Asset | `PHYS_` | | Rig (animation) | `Rig_` |
| Physics Material | `PM_` | | Niagara System | `FXS_` |
| Material | `M_` | | Data Table | `DT_` |
| Material Instance | `MI_` | | Curve Table | `CT_` |
| Texture | `T_` | | Enum | `E_` |
| Blueprint | `BP_` | | Struct | `F_` |
| Widget Blueprint | `WBP_` | | Animation Blueprint | `ABP_` |
| Level Sequence | `LS_` | | Post Process Material | `PPM_` |

Source: https://dev.epicgames.com/documentation/en-us/unreal-engine/recommended-asset-naming-conventions-in-unreal-engine-projects?application_version=5.8

## Kit conventions (types Epic's table doesn't cover)

| Asset | Prefix | Notes |
|---|---|---|
| Sound effect (SoundWave) | `SFX_` | `gen/audio.ts` |
| Music | `MUS_` | looping |
| Voice line | `VO_` | |
| MetaSound Source | `MSS_` | not `MS_` (Epic's table uses it for Media Source) |
| Sound Cue / Attenuation / Class / Mix | `SC_` / `ATT_` / `SCL_` / `MIX_` | |
| Input Action / Mapping Context | `IA_` / `IMC_` | Enhanced Input |
| IK Rig / IK Retargeter | `IK_` / `RTG_` | as in Epic's templates |
| Data Asset | `DA_` | |
| Material Function | `MF_` | |
| Level / Map | `L_` (main map stays `Main`) | |
| Sound Concurrency | `SCON_` | |
| Geometry Collection (destruction) | `GC_` | |
| Niagara Effect Type | `FXT_` | systems stay `FXS_` (Epic's quick start uses `FX_`; we don't) |
| Material Parameter Collection | `MPC_` | |
| Font Face / Font | `FF_` / `Font_` | import: `audio-ui.md` "Layout, fonts, DPI" |
| Other master materials | `M_Glass`, `M_Decal` | allowed exceptions to the single master; still used via `MI_` |

Texture descriptors: `T_<Name>_BaseColor`, `_Normal`, `_Roughness`, `_Metallic`, `_ORM` (packed).
(The pipeline currently writes lowercase descriptors, e.g. `T_Chest_basecolor`; fine, but keep new ones consistent.)

Names the kit scripts create that differ from the table (keep them; the scripts find assets by these names):
- **Skeleton / Physics Asset of a kit-imported character:** the importer's `SK_<Name>_Skeleton` and
  `SK_<Name>_PhysicsAsset`, not `SKEL_` / `PHYS_` (`import_skeletal.py` replaces them by these names on a rerun).
- **Retargeted copies:** the source name plus `_<Name>`: `ABP_Unarmed_<Name>`, `BS_Idle_Walk_Run_<Name>`, and
  template clips keep Epic's `MM_` prefix (`MM_Idle_<Name>`).

## Folders

- Generated props: `/Game/Props/<Name>/` (SM_, MI_, T_*)
- Characters (`gen/character.ts`): `/Game/Characters/<Name>/` (SK_, MI_, T_*, BP_; `Rig/` holds `IK_<Name>` and
  `RTG_Manny_To_<Name>`, `Anims/` the retargeted copies); the shared source rig is `/Game/Characters/Rigs/IK_Manny`
- Animation library packs (`SETUP.md` 10): their own `/Game/<Pack>/` folder (Migrate keeps it)
- Audio: `/Game/Audio/{SFX,Music,Voice}/`
- Kit shared assets: `/Game/Kit/` (master materials, default textures, the `gen/vfx/vfx.ts` set). Game-specific content goes elsewhere.
- Maps: `/Game/Maps/`
- Never move/rename assets by hand in Explorer; use the editor (or AssetTools.move) so references and redirectors stay valid.
