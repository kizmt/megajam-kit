# Envs Folder Structure

https://dev.epicgames.com/documentation/en-us/unreal-engine/envs-folder-structure-in-unreal-engine?application_version=5.9

> A reference guide for organizing your In-Camera VFX project's environment files in the Content Browser.

[image: Envs Folder Structure]

[image: The recommended Envs folder structure in the Content Browser]

The **Envs** folder contains all the assets specifically for your environments (envs).

Since source control only lets you exclusively check out binary assets, such as `.umap` files, each artist working on an environment at the same time must work on their own level. The solution to this is to divide an environment up into multiple sublevels (-> managing-multiple-levels-in-unreal-engine) based on the type of Actors in each.

For example, a lighting artist would work in the lighting sublevel, and an FX artist in the FX sublevel. It is also common to have multiple GEO levels that divide the environment up into regions, each being worked on by a different artist. The number and types of sublevels used should be dependent on the needs of the production.

The files in this section are linked to the **Stages** folder files, as they will all be combined for the final In-Camera VFX persistent levels.

The following are the types of folders used for each environment in the sample project:

- **Level Asset**: Level Assets follow a (LevelName)_(Descriptor) structure. The _P suffix is given to the Persistent Level, which acts as a container for the sublevels. Open this Level Asset to view the full environment composed of all the sublevels.
- **SubLevels**: In this project, each Level was separated into the Caustics, FX, Geo, and Lighting sublevels.
- **Snapshots**: Level Snapshot Assets associated with the Level.

For example:

- CaveEntranceCaveEntrance_P — Main persistent level
- SubLevelsCaveEntrance_Geo_A
- CaveEntrance_Lighting_A
- CaveEntrance_FX_A
- CaveEntrance_Anim_A
- CaveEntrance_Vis_A

- SnapshotsSNAP_CaveEntrance_(Description)

- CavePath
- SpaceJunkyard

[image: A diagram of the recommended Envs folder structure] A diagram showing the recommended Envs folder structure for your project in the Content Browser.

- content browser
- icvfx
- virtual sets
