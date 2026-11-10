# Recommended Asset Naming Conventions

https://dev.epicgames.com/documentation/en-us/unreal-engine/recommended-asset-naming-conventions-in-unreal-engine-projects?application_version=5.9

> A recommended naming convention to help organize your Assets.

[image: Recommended Asset Naming Conventions]

As you develop projects in **Unreal Engine (UE)**, the list of **Assets **in your **Content Browser** will expand. This runs the risk of creating redundant variations of assets you're experimenting with, or introducing ambiguity with overly similar names. For example, it is possible for you to have a folder named "Soldier" with a Blueprint, a texture, and a model that all have the name "Soldier" in them, but no clear way to tell which is which in a simple list.

For large projects, we recommend you establish a common naming convention for individual Assets early in development. This will make it easier for you and your team to locate files and prevent potential conflicts or ambiguity. The naming convention described below reflects how Epic Games names Assets in sample projects, such as the In-Camera VFX Production Test (-> incamera-vfx-production-test-sample-project-for-unreal-engine).

```
		[AssetTypePrefix]_[AssetName]_[Descriptor]_[OptionalVariantLetterOrNumber]
```

[AssetTypePrefix]_[AssetName]_[Descriptor]_[OptionalVariantLetterOrNumber]

- `AssetTypePrefix` identifies the type of Asset, refer to the table below for details.

- `AssetName` is the Asset's name.

- `Descriptor` provides additional context for the Asset, to help identify how it is used. For example, whether a texture is a normal map or an opacity map.

- `OptionalVariantLetterOrNumber` is optionally used to differentiate between multiple versions or variations of an asset.

Consider using this naming convention for your own project's Assets, as it will provide multiple ways for your team to locate an Asset when searching the Content Browser.

This naming convention is only a recommendation to simplify setting up your project. Your requirements will always take precedence, and it is likely that you won't use all of these Asset types in your Project.

## Recommended Asset Prefixes

This list is not exhaustive, as new features can require new Asset types. If you are using an Asset type not listed, use the existing list as a guideline for your naming convention for that Asset.

| Asset | Prefix |
| --- | --- |
| General |  |
| HDRI (-> hdri-backdrop-visualization-tool-in-unreal-engine) | HDR_ |
| Material (-> unreal-engine-materials) | M_ |
| Material Instance (-> instanced-materials-in-unreal-engine) | MI_ |
| Physics Asset (-> physics-asset-editor-in-unreal-engine) | PHYS_ |
| Physics Material (-> physical-materials-in-unreal-engine) | PM_ |
| Post Process Material (-> post-process-materials-in-unreal-engine) | PPM_ |
| Skeletal Mesh (-> skeletal-mesh-assets-in-unreal-engine) | SK_ |
| Static Mesh (-> static-meshes) | SM_ |
| Texture (-> textures-in-unreal-engine) | T_ |
| OCIO Profile (-> color-management-with-opencolorio-in-unreal-engine) | OCIO_ |
| Blueprints (-> blueprints-visual-scripting-in-unreal-engine) |  |
| Actor Component | AC_ |
| Animation Blueprint | ABP_ |
| Blueprint Interface | BI_ |
| Blueprint | BP_ |
| Curve Table | CT_ |
| Data Table | DT_ |
| Enum | E_ |
| Structure | F_ |
| Widget Blueprint | WBP_ |
| Particle Effects (-> creating-visual-effects-in-niagara-for-unreal-engine) |  |
| Niagara Emitter | FXE_ |
| Niagara System | FXS_ |
| Niagara Function | FXF_ |
| Skeletal Mesh Animations (-> skeletal-mesh-animation-system-in-unreal-engine) |  |
| Rig | Rig_ |
| Skeleton | SKEL_ |
| Montages | AM_ |
| Animation Sequence | AS_ |
| Blend Space | BS_ |
| ICVFX (-> incamera-vfx-in-unreal-engine) |  |
| NDisplay Configuration | NDC_ |
| Animation (-> cinematics-and-movie-making-in-unreal-engine) |  |
| Level Sequence | LS_ |
| Sequencer Edits | EDIT_ |
| Media (-> media-framework-in-unreal-engine) |  |
| Media Source | MS_ |
| Media Output | MO_ |
| Media Player | MP_ |
| Media Profile | MPR_ |
| Other |  |
| Level Snapshots (-> level-snapshots-in-unreal-engine) | SNAP_ |
| Remote Control Preset (-> remote-control-for-unreal-engine) | RCP_ |

- asset
- optimization

On this page

- Recommended Asset Prefixes (-> recommended-asset-naming-conventions-in-unreal-engine-projects)
