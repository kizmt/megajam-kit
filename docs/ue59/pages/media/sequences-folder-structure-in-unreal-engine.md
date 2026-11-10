# Sequences Folder Structure

https://dev.epicgames.com/documentation/en-us/unreal-engine/sequences-folder-structure-in-unreal-engine?application_version=5.9

> A reference guide for organizing your In-Camera VFX project's Sequences files in the Content Browser.

[image: Sequences Folder Structure]

[image: The recommended Media folder structure in the Content Browser]

The **Sequences** folder contains all **Level Sequences** and **Animations**, grouped by sequence abbreviation (CE, CP, and SJ in the example shown).

The **Edits** subfolder contains edits that apply to the entire project's sequences taken together. Each individual sequence folder also has an **Edits** subfolder, which applies specifically to that sequence only.

This sample uses the format `(Sequence Code)_(Setup)_(Camera or Anim Pass)_(Take)`. However, this is only an example take-naming convention. Use whatever naming system for your takes that makes sense for your project. The important point is for the naming system to be consistent.

- EditsEDIT_Origin_00_01
- EDIT_Origin_0A_07

- CE (Sequence Abbreviation)Takes - Sorted by shot name and take numberCE_00_0A_01LS_CE_00_0A_01
- SNAP_CE_00_0A_01
- CE_00_0A_01_SubscenesLS_Actor01_CE_00_0A_01
- LS_Actor02_CE_00_0A_01

- AnimationsA_CE_00_0A-01_Actor02

- Shots
- Previs
- Techvis
- EditsEDIT_CE_00_01
- EDIT_CE_0G_99

- SublevelsCE_Lighting
- CE_Chr

[image: A diagram of the recommended Sequences folder structure] A diagram showing the recommended Sequences folder structure for your project in the Content Browser.

- content browser
- animation
- sequencer
- icvfx
- virtual sets
