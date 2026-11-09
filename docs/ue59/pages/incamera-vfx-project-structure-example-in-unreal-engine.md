# In-Camera VFX Project Structure Example

https://dev.epicgames.com/documentation/en-us/unreal-engine/incamera-vfx-project-structure-example-in-unreal-engine?application_version=5.9

> A reference guide for organizing your In-Camera VFX project's file structure in the Content Browser.

[image: In-Camera VFX Project Structure Example]

The **In-Camera VFX Production Structure Example** is intended to provide a clean sample organizational structure for a Virtual Production project. You can duplicate this structure and modify it as necessary to meet the requirements of your own project. The structure described is based on the structure of the In-Camera VFX Production Test (-> incamera-vfx-production-test-sample-project-for-unreal-engine), expanded to cover additional common use cases.

### Content Browser Folders

Inside the **Content **folder of the **Content Browser**, create a folder named based on your Project Name, to hold any content specifically for your project. If required, create a folder named Common, which will contain any content that is shared with other projects.

Don't confuse the Project folder created by UE when the project was created (the root folder of the entire project) with the folder with your Project Name you create inside the Content Browser. We recommend varying the names so as not to confuse them.

[image: Recommended project structure top level in the Content Browser]

**Content/(Project Name)/Assets (-> assets-folder-structure-in-unreal-engine)**

All assets for creating Characters, Environments, and visual effects. Level Assets are not included here.

**Content/(Project Name)/Envs (-> envs-folder-structure-in-unreal-engine)**

Contains all levels, snapshots, and sublevels. Does not contain any Stage actors.

**Content/(Project Name)/Media (-> media-folder-structure-in-unreal-engine)**

Any media framework content such as EXRs and Movie Render Queue Outputs and Profiles.

**Content/(Project Name)/Sequences (-> sequences-folder-structure-in-unreal-engine)**

All level sequences, edits, animations, and related snapshots.

**Content/(Project Name)/Stages (-> stages-folder-structure)**

Stage-specific files like mocap layouts, green screen stages, and LED stages such as nDisplay Configurations which describe the topology of the LED volumes.

**Content/(Project Name)/StageLevels (-> stage-levels-folder-structure-in-unreal-engine)**

All the Level Assets that have both environment and stage Actors.

**Content/(Project Name)/Tools (-> tools-folder-structure-in-unreal-engine)**

Custom Blueprints including utilities and widgets, controls, Level Snapshot Filters and Presets, and Remote Control Presets. Also includes any related Blueprint Actors — structures, enums, and so on.

We recommend using an organized naming convention for your Assets to help make it easy to find them in the Content Browser. Refer to the Recommended Asset Naming Convention (-> recommended-asset-naming-conventions-in-unreal-engine-projects) for a best-practices example.

Refer to the individual pages for the details of the recommended project structure inside each folder.

[image: A diagram of the recommended top-level project folders] A diagram showing the recommended top-level folder structure for your project in the Content Browser.

- content browser
- icvfx
- virtual sets

On this page

- Content Browser Folders (-> incamera-vfx-project-structure-example-in-unreal-engine)
