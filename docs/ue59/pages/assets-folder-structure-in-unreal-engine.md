# Assets Folder Structure

https://dev.epicgames.com/documentation/en-us/unreal-engine/assets-folder-structure-in-unreal-engine?application_version=5.9

> A reference guide for organizing your In-Camera VFX project's Asset files in the Content Browser.

[image: Assets Folder Structure]

[image: The recommended Assets folder structure in the Content Browser]

The **Assets** folder typically contains all Assets for creating Characters, Environments, and FX - Meshes, like Materials, Textures, Blueprints, and other source files. Level Assets are not included here.

Each subfolder contains the appropriate source files for that Asset. For example, the Chr folder contains Character Asset subfolders, one per Character used. Each contains that Character's source Assets, that is, Blueprints, Skeletal Meshes, Skeletons, Animations, Materials, and so on.

The following list is how the Assets were categorized for the In-Camera VFX Production Test (-> incamera-vfx-production-test-sample-project-for-unreal-engine) project, expanded to include a few Asset types that were not used in that project. It's unlikely for any given project to use all possible Asset types.

- VegetationTree_ASM_Tree_A
- MI_Tree_A
- T_Tree_A_BaseColor

- RocksRock_ABP_Rock_A
- SM_Rock_A
- MI_Rock_A
- T_Rock_A_BaseColor

- Rock_B
- Pebble_A

- ChrBackpacker_ABP_Backpacker_A
- SK_Backpacker_A
- SKEL_Backpacker_A
- MI_Backpacker_A
- T_Backpacker_A_BaseColor
- ABP_Backpacker_A_Livelink
- ABP_Backpacker_A_Game
- AnimationsA_Backpacker_A_Run
- A_Backpacker_A_Idle

[image: First part of the recommended Asset folder structure] A diagram showing the first part of the recommended Asset folder structure for your project in the Content Browser.

- FXBirds_ABP_Birds_A
- FXS_Birds_A_(DescA)_A
- FXS_Birds_A_(DescB)_A
- EmittersFXE_Birds_A_(DescA)_A

- DecalsMI_Caustic_A_Decal
- T_Caustic_A_M

- HDRsHDR_NightSky_A
- HDR_CitySky_D

- IESTLP_Arri750Plus_A
- TLP_Arri750Plus_B

- OCIO(Stage Name)OCIO_(Stage)_A
- OCIO_(Stage)_B
- LUTS(Description).spi1d (file explorer only)

OpenColorIO `.spi1d` files do not show in the Content Browser, only in the File Explorer. Refer to the OpenColorIO documentation for more information.

- MasterMaterialsGround_AM_Ground_A
- T_Ground_A_BaseColor
- MI_WetGround_A

- Textures

- Props*
- Landscapes*
- Vehicles*
- Other*

* Not used for the In-Camera VFX Production Test.

[image: Rest of the recommended Asset folder structure] A diagram showing the rest of the recommended Asset folder structure for your project in the Content Browser. It links back to the first part at the top.

- content browser
- asset
- icvfx
- virtual sets
