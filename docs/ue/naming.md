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

Source: https://dev.epicgames.com/documentation/en-us/unreal-engine/recommended-asset-naming-conventions-in-unreal-engine-projects?application_version=5.8

## Kit conventions (types Epic's table doesn't cover)

| Asset | Prefix | Notes |
|---|---|---|
| Sound effect (SoundWave) | `SFX_` | `gen/audio.ts` |
| Music | `MUS_` | looping |
| Voice line | `VO_` | |
| MetaSound Source | `MS_` | |
| Sound Cue / Attenuation / Class / Mix | `SC_` / `ATT_` / `SCL_` / `MIX_` | |
| Input Action / Mapping Context | `IA_` / `IMC_` | Enhanced Input |
| IK Rig / IK Retargeter | `IK_` / `RTG_` | as in Epic's templates |
| Data Asset | `DA_` | |
| Material Function | `MF_` | |
| Level / Map | `L_` (main map stays `Main`) | |
| Level Sequence | `LS_` | |
| Sound Concurrency | `SCON_` | |
| Geometry Collection (destruction) | `GC_` | |
| Niagara Effect Type | `FXT_` | systems stay `FXS_` (Epic's quick start uses `FX_`; we don't) |
| Post Process Material | `PPM_` | listed in Epic's 5.8 docs (not in the table above) |
| Material Parameter Collection | `MPC_` | |
| Other master materials | `M_Glass`, `M_Decal` | allowed exceptions to the single master; still used via `MI_` |

Texture descriptors: `T_<Name>_BaseColor`, `_Normal`, `_Roughness`, `_Metallic`, `_ORM` (packed).
(The pipeline currently writes lowercase descriptors, e.g. `T_Chest_basecolor`; fine, but keep new ones consistent.)

## Folders

- Generated props: `/Game/Props/<Name>/` (SM_, MI_, T_*)
- Audio: `/Game/Audio/{SFX,Music,Voice}/`
- Kit shared assets: `/Game/Kit/` (master material, default textures). Don't put game content here.
- Maps: `/Game/Maps/`
- Never move/rename assets by hand in Explorer; use the editor (or AssetTools.move) so references and redirectors stay valid.
