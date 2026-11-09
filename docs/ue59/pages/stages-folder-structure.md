# Stages Folder Structure

https://dev.epicgames.com/documentation/en-us/unreal-engine/stages-folder-structure?application_version=5.9

> A reference guide for organizing your In-Camera VFX project's Stages files in the Content Browser.

[image: Stages Folder Structure]

[image: The recommended Stages folder structure in the Content Browser]

The **Stages** folder contains the **nDisplay Configurations** which describe the topology of the LED volume or volumes used and all related files.

The files in this section are linked to the **Envs** folder files, as they will all be combined for the final In-Camera VFX persistent levels.

- EpicLAEpicLAStage_P - Main Stage persistent level
- WarpMeshes - Meshes that make up the volumeEpicLA_C1SM_EpicLA_C1
- MI_EpicLA_C1_(Description)_A
- T_EpicLA_C1_(Description)_A

- ConfigsNPC_EpicLA_(Description)
- EpicLA_(Description).cfg - `.cfg` files are not visible in the content browser

[image: A diagram of the recommended Stages folder structure] A diagram showing the recommended Stages folder structure for your project in the Content Browser.

- content browser
- icvfx
- virtual sets
