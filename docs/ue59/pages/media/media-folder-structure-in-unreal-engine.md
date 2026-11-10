# Media Folder Structure

https://dev.epicgames.com/documentation/en-us/unreal-engine/media-folder-structure-in-unreal-engine?application_version=5.9

> A reference guide for organizing your In-Camera VFX project's Media files in the Content Browser.

[image: Media Folder Structure]

[image: The recommended Media folder structure in the Content Browser]

The **Media** folder includes all the files associated with using media in your production. Some of the files in this section will be automatically populated at the Root level of the Content Browser by the Media Framework (-> media-framework-in-unreal-engine) plugin. The folders here are used in the background by the Media Profiles, but you should almost never have reason to work with them directly.

- Bundles - Auto populated at the Content Root level by the Media Framework plugin.
- Proxies - Auto populated at the Content Root level by the Media Framework plugin.
- MediaOutputs
- MediaProfilesMPR_(Description1)
- MPR_(Description2)

- MediaSources - All Actors related to media content, with separate folders for each Media Source.

[image: A diagram of the recommended Media folder structure] A diagram showing the recommended Media folder structure for your project in the Content Browser.

- content browser
- icvfx
- virtual sets
